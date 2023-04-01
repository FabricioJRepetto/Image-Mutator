import { pixelData } from "../types"

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
    let aux = Math.round((res * (((average * 100) / 255)) / 100))
    // / 2 = limitar el tamaño del circulo dentro de la casilla
    if (containedDots && aux > (res / 2)) {
        return res / 2
    } else return aux
}

export const download = (buf: Blob, filename: string, type: any): { url: string, download: string } => {
    const blob = buf instanceof Blob ? buf : new Blob([buf], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    //: TODO: return elements to render a "download" button    
    return {
        url,
        download: filename
    }

}