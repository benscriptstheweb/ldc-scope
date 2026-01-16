import { compressor } from "$lib/imageCompressor";
import { supabase } from "$lib/supabase/supabaseClient";
import { json } from "@sveltejs/kit";

export async function POST({ request, params }) {
    const form = await request.formData();
    const images = form.getAll("images") as File[];
    const { homeId } = params;

    if (!images.length || !homeId) {
        return new Response("Missing images or homeId", { status: 400 });
    }

    const uploaded = [];

    for (const image of images) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const compressedImageBuffer = (await compressor(buffer)).output;
        const compressedImageStatus = (await compressor(buffer)).status;

        if (compressedImageStatus === 'oversize') {
            return json({ message: 'oversize' })
        }

        const fileName = `housing/${homeId}/${crypto.randomUUID()}.webp`;

        const { error } = await supabase.storage
            .from("photos")
            .upload(fileName, compressedImageBuffer, {
                contentType: "image/webp",
                upsert: false
            });

        if (error) {
            console.error(error);
            continue;
        }

        const publicURL = supabase.storage
            .from("photos")
            .getPublicUrl(fileName).data.publicUrl;

        uploaded.push({ url: publicURL, path: fileName });
    }

    return json({ status: 'uploaded' });
}

export async function GET({ params }) {
    const { homeId } = params;

    if (!homeId)
        return new Response("Missing homeId", { status: 400 });

    const { data, error } = await supabase.storage.from('photos').list(`housing/${homeId}`);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    const urls = data.map((image) =>
        supabase.storage
            .from("photos")
            .getPublicUrl(`housing/${homeId}/${image.name}`).data
            .publicUrl
    );

    return json({ images: urls })
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
