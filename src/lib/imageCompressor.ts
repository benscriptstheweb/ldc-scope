import sharp from "sharp";

export async function compressor(buffer: Buffer) {
    let output = buffer;
    let status = '';
    let resolution = 900;
    let maxSize = 50 * 1024;

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

    // if after compressor still over upload limit, complain to frontend
    status = output.length > maxSize
        ? 'oversize'
        : 'ok'

    return {
        output: output,
        status: status
    };
}
