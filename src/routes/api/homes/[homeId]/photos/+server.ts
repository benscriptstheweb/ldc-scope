import { compressor } from "$lib/imageCompressor";
import { supabase } from "$lib/supabase/supabaseClient";
import { json } from "@sveltejs/kit";

export async function POST({ request, params }) {
    const form = await request.formData();
    const images = form.getAll("images") as File[];
    const { homeId } = params;

    if (!images.length || !homeId) {
        return json({ message: "No images or missing homeId" }, { status: 400 });
    }

    // status code 415: unsupported file type
    if (images.some((e) => !e.type.startsWith('image/'))) {
        return json({ message: "Invalid file types detected" }, { status: 415 })
    }

    for (const image of images) {
        const buffer = Buffer.from(await image.arrayBuffer());

        // status code 413: content too large
        let compressedImageBuffer: Buffer<ArrayBufferLike>;
        try {
            compressedImageBuffer = await compressor(buffer);
        } catch (error) {
            return json({ message: "File too large" }, { status: 413 });
        }

        const fileName = `housing/${homeId}/${image.name}`;

        await supabase.storage
            .from("photos")
            .upload(fileName, compressedImageBuffer, {
                contentType: "image/webp",
                upsert: false
            });
    }

    return json({ message: "Uploaded" }, { status: 200 });
}

export async function GET({ params }) {
    const { homeId } = params;

    if (!homeId)
        return new Response("Missing homeId", { status: 400 });

    const { data, error } = await supabase.storage.from('photos').list(`housing/${homeId}`);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    let urls: any[] = [];
    let filenames: any[] = [];

    data.forEach((image) => {
        filenames.push(image.name);
        urls.push(supabase.storage
            .from("photos")
            .getPublicUrl(`housing/${homeId}/${image.name}`).data
            .publicUrl
        )
    }
    );

    return json({ urls, filenames })
}

export async function DELETE({ params, request }) {
    const { homeId } = params;
    const imageName = await request.json();

    const { error } = await supabase.storage
        .from('photos')
        .remove([`housing/${homeId}/${imageName}`]);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return json({ status: 'deleted' });
}
