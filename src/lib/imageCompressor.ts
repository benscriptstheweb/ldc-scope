import sharp from "sharp";

export async function compressTo10kb(buffer: Buffer) {
    console.log('inside compressor! starting size: ', buffer.length)
    let output = buffer;

    // starting quality
    let quality = 80;
    let maxSize = 10 * 1024;

    while (output.length > maxSize) {
        output = await sharp(output)
            .resize(800, null)
            .webp({ quality })
            .toBuffer();

        quality -= 10;

        if (quality < 10) {
            // hail mary this thing
            output = await sharp(buffer)
                .resize(300, null)
                .webp({ quality: 10 })
                .toBuffer();
            console.log('hail mary: ', output.length)
            break;
        } else {
            console.log(output.length)
        }
    }

    return output;
}
