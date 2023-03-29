export interface imageData {
    width: number,
    height: number,
    data: Array<number>
}

export interface pixelData {
    x: number,
    y: number,
    average: number,
    color: string
}

export interface configObject {
    res: number,
    style: string,
    invert: boolean,
    containedDots: boolean,
    background: string | null,
    //: TODO: refact
    fontSize: number
}