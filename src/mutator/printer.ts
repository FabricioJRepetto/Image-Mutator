import { configObject, pixelData } from "../types";
import { toChar, toDots, toText } from "./utils";

export const printer = async (
    canvas: HTMLCanvasElement,
    imgData: pixelData[],
    config: configObject,
    setBluePrint?: (bluePrint: string[]) => void,
    transparency?: boolean
): Promise<void> => {
    await new Promise((resolve, reject) => {

        const cntx = canvas.getContext('2d', { willReadFrequently: true })
        if (!cntx) {
            console.error('Context cannot be null');
            reject(false)
            return
        }

        const {
            res,
            style,
            background,
            invert,
            containedDots,
            fontSize
        } = config

        const average = (avg: number): number => {
            const aux = invert ? 255 - avg : avg
            return aux
        }

        // Paint background if not transparency
        //! if no bg is defined, dots breaks into squares on GIFs
        if (background || !transparency) {
            cntx.fillStyle = background?.length === 7
                ? background
                : '#000000'
            cntx.fillRect(0, 0, canvas.width, canvas.height);
        }

        switch (style) {
            case 'dots':
                imgData.forEach(e => {
                    const circle = new Path2D(),
                        X = e.x + Math.round(res / 2), // e.x + Math.round(res / 2) // e.x + res * 1.7
                        Y = e.y + Math.round(res / 2), // e.y - dotSize * 2.5 // e.y + res * 1.7
                        dotSize = toDots(average(e.average), res, containedDots)

                    circle.arc(X, Y, dotSize, 0, 2 * Math.PI);
                    cntx.fillStyle = e.color
                    cntx.fill(circle)
                })
                break;

            default:
                //? fonts: Courier Prime / Inconsolata
                cntx.font = Math.round(Math.round(res * fontSize)) + 'px Inconsolata'

                setBluePrint && setBluePrint(toText(imgData, Math.round(canvas.width / res), invert))

                imgData.forEach(e => {
                    cntx.fillStyle = e.color
                    cntx.fillText(
                        toChar(average(e.average)),
                        e.x,
                        e.y + Math.round(res))
                })
                break;
        }
        resolve(true)
    })
}