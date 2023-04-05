import { pixelData } from "../types"

export const scanner = async (
    imgData: ImageData | any,
    res: number
): Promise<pixelData[]> => {

    const {
        width,
        height,
        data
    } = imgData
    // console.log(imgData.data);

    let imageToArray: pixelData[] = []

    for (let y = 0; y < height; y += res) {
        for (let x = 0; x < width; x += res) {
            const posX = x * 4,
                posY = y * 4,
                pos = (posY * width) + posX,
                r = data[pos] || 1,
                g = data[pos + 1] || 1,
                b = data[pos + 2] || 1,
                a = data[pos + 3],
                average = (r + g + b) / 3,
                rgba = `rgba(${r}, ${g}, ${b}, ${a === 0 ? 0 : 1})`

            imageToArray.push({
                x,
                y,
                average,
                color: rgba
            })
        }
    }

    return imageToArray
}