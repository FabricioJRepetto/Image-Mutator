import { pixelData } from "../types"

export const scanner = (
    imgData: ImageData,
    res: number
): Array<pixelData> => {

    const {
        width,
        height,
        data
    } = imgData
    let imageToArray: Array<pixelData> = []

    for (let y = 0; y < height; y += res) {
        for (let x = 0; x < width; x += res) {
            const posX = x * 4,
                posY = y * 4,
                pos = (posY * width) + posX,
                r = data[pos],
                g = data[pos + 1],
                b = data[pos + 2],
                average = (r + g + b) / 3,
                rgb = `rgb(${r}, ${g}, ${b})`

            imageToArray.push({
                x,
                y,
                average,
                color: rgb
            })
        }
    }

    return imageToArray
}