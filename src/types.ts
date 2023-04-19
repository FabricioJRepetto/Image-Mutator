export interface imageData {
    width: number,
    height: number,
    data: number[]
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

export interface printerTypes {
    canvas: HTMLCanvasElement,
    imgData: pixelData[],
    config: configObject,
    setBluePrint?: (bluePrint: string[]) => void,
    transparency?: boolean
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
    file: File | null,
    setPreview: (buffer: Blob | null) => void
}

export interface OptPanelProps {
    options: options,
    setOptions: React.Dispatch<React.SetStateAction<options>>,
    GIF?: boolean,
    mutate: () => void,
    softReset: () => void,
    dlBtn: boolean,
    download: () => void,
    loading?: boolean
}

export interface OptPanelComp {
    options?: options,
    setOptions: React.Dispatch<React.SetStateAction<options>>,
    bgHandler?: (arg: string) => void,
    GIF?: boolean
}