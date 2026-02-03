import sharp from "sharp";
import { error } from "@sveltejs/kit";

export async function compressor(buffer: Buffer) {
    let output = buffer;
    let resolution = 900;
    let maxSize = 30 * 1024;

    while (output.length > maxSize) {
        output = await sharp(output)
            .resize(resolution)
            .webp({ quality: 70 })
            .toBuffer();

        resolution -= 20;

        // keep resolution good
        if (resolution < 500) {
            break;
        }
    }

    // if after compressor still over upload limit, don't return anything!
    if (output.length > maxSize) {
        error(413, 'Image is too large!');
    }

    return output;
}
