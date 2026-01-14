import sharp from "sharp";

export async function compressTo10kb(buffer: Buffer) {
    let output = buffer;

    let resolution = 900;
    let maxSize = 50 * 1024;

    while (output.length > maxSize) {
        output = await sharp(output)
            .resize(resolution)
            .webp({ quality: 70 })
            .toBuffer();

        resolution -= 20;

        if (resolution < 500) {
            // TBD: error that the file is too large
            break;
        }
    }

    return output;
}
