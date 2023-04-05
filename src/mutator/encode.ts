import { GIFEncoder, quantize, applyPalette } from 'gifenc/dist/gifenc';

export const encoder = async (frames: Array<ImageData>, delay: number): Promise<Blob | null> => {
    if (!frames) return null

    // Create an encoding stream
    const gif = GIFEncoder();

    for (let frame of frames) {
        // Get your RGBA image into Uint8Array data, such as from canvas
        const { data, width, height } = frame;

        // Quantize your colors to a 256-color RGB palette palette
        const palette = quantize(data, 256);

        // Get an indexed bitmap by reducing each pixel to the nearest color palette
        const index = applyPalette(data, palette);

        // Write a single frame
        gif.writeFrame(index, width, height, { palette, delay });
    }

    // Write end-of-stream character
    gif.finish();

    // Get the Uint8Array output of your binary GIF file
    // const output = gif.bytes();

    // Get gif buffer
    const buffer = gif.bytesView();
    return buffer
}