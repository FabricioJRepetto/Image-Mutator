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
    fontSize: number
}

export interface options {
    imgData: ImageData | null,
    style: string,
    res: number,
    background: string | null,
    containedDots: boolean,
    invert: boolean,
    fontSize: number,
    showText: boolean,
    bluePrint: string[] | null,
    double: boolean,
    brighter: boolean
}

export interface mainComps {
    load: React.Dispatch<React.SetStateAction<FileList | null>>,
    file?: FileList | null
}

export interface OptPanelProps {
    options: options,
    setOptions: React.Dispatch<React.SetStateAction<options>>,
    GIF?: boolean
}