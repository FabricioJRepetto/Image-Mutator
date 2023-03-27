import { configObject, imageData, pixelData } from "./types"

export const toChar = (c: number): string => {
    if (c > 250) return '@'
    else if (c > 240) return '#'
    else if (c > 220) return '%'
    else if (c > 200) return '&'
    else if (c > 180) return '$'
    else if (c > 160) return '7'
    else if (c > 140) return ')'
    else if (c > 120) return '/'
    else if (c > 100) return '*'
    else if (c > 80) return '='
    else if (c > 60) return '+'
    else if (c > 40) return '-'
    else if (c > 20) return ':'
    else return '·'
}

export const toText = (array: Array<pixelData>, size: number) => {
    //: TODO: refact
    let aux = [],
        string = array.map(e => toChar(e.average)).toString().replaceAll(',', '')
    for (let i = 0; i < Math.round(array.length / size); i++) {
        aux.push(string.slice(0, size))
        string = string.slice(size)
    }
    return aux
}

export const toDots = (average: number, res: number, containedDots: boolean): number => {
    // (average * 100) / 255 = tamaño relativo al brillo (regla de 3)
    // / 100 = tamaño convertido a porcentaje
    // res * porcentaje = tamaño del circulo en pixeles
    let aux = Math.floor((res * (((average * 100) / 255)) / 100))
    // / 2 = limitar el tamaño del circulo dentro de la casilla
    if (containedDots && aux > (res / 2)) {
        return aux / 2
    } else return aux
}

export const scanner = (
    imgData: imageData,
    res: number,
    invertSize: boolean
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
                average = invertSize ? 255 - ((r + g + b) / 3) : (r + g + b) / 3,
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

export const printer = (canvas: HTMLCanvasElement, imgData: Array<pixelData>, config: configObject, setBluePrint: (bluePrint: Array<string>) => void): void => {
    const cntx = canvas.getContext('2d')
    if (!cntx) {
        console.error('Context cannot be null');
        return
    }
    cntx.clearRect(0, 0, canvas.width, canvas.height)

    const {
        res,
        style,
        background,
        containedDots,
        margin,
        size,
        fontSize
    } = config

    if (margin) {
        canvas.width = canvas.width + res * 4
        canvas.height = canvas.height + res * 4
    }

    if (background) {

    }

    switch (style) {
        case 'dots':
            imgData.forEach(e => {
                const circle = new Path2D(),
                    X = e.x + res * 1.7, // x + Math.round(res / 2)                    
                    Y = e.y + res * 1.7, // y - dotSize * 2.5
                    dotSize = toDots(e.average, res, containedDots)
                circle.arc(X, Y, dotSize, 0, 2 * Math.PI);
                cntx.fillStyle = e.color
                cntx.fill(circle)

            })
            break;

        default:
            //? fonts: Courier Prime / Inconsolata
            cntx.font = Math.round(Math.round(res * (size ? size : fontSize))) + 'px Inconsolata'

            setBluePrint(toText(imgData, Math.round(canvas.width / res))) //? ascii text version

            imgData.forEach(e => {
                cntx.fillStyle = e.color
                cntx.fillText(toChar(e.average), margin ? e.x + res * 1.7 : e.x, margin ? e.y + res * 2.3 : e.y)
            })
            break;
    }
}