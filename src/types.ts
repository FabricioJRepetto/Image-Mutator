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
    style: 'dots' | 'ascii',
    invertSize: boolean,
    containedDots: boolean
    margin: boolean,
    background: string,
    //: TODO: refact
    size: number,
    fontSize: number
}