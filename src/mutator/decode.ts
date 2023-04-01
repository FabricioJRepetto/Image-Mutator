import { parseGIF, decompressFrames, ParsedGif, ParsedFrame } from 'gifuct-js'

export const decoder = (file: File | null): Promise<ParsedFrame[]> | null => {
    if (!file) return null

    // const file = files[0]
    const img = new Image()
    img.src = URL.createObjectURL(file)

    const promisedGif = fetch(img.src)
        .then(resp => resp.arrayBuffer())
        .then(buff => {
            var gif = parseGIF(buff)
            var frames = decompressFrames(gif, true)

            return frames;
        });

    return promisedGif

}