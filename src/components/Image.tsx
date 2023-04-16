import { useEffect, useRef, useState } from 'react'
import { mainComps, options } from '../types'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import { download } from '../mutator/utils'
import OptionsPanel from './OptionsPanel'
import '../App.css'

const Image = ({ file, setPreview, parrentReset }: mainComps): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)
    const [downloadButton, setDownloadButton] = useState<boolean>(false)

    const [options, setOptions] = useState<options>({
        imgData: null,
        style: 'dots',
        res: 5,
        background: null,
        containedDots: true,
        invert: false,
        fontSize: 1,
        showText: false,
        bluePrint: null,
        double: false,
        brighter: false
    })

    useEffect(() => {
        if (file) loadImage(file)
    }, [])

    const loadImage = (file: File | null): void => {
        if (file) {
            if (file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/webp') {
                return
            }

            const img = document.createElement('img')
            img.src = URL.createObjectURL(file)

            img.onload = () => {
                if (canvas.current) {
                    const width = img.width,
                        height = img.height,
                        cntx = canvas.current.getContext('2d', { willReadFrequently: true })

                    canvas.current.width = width
                    canvas.current.height = height

                    if (cntx) {
                        cntx.drawImage(img, 0, 0, width, height)
                        // console.log(canvas.current.toDataURL()) //? convierte a base64
                        const data = cntx.getImageData(0, 0, width, height)
                        setOptions(opt => ({
                            ...opt,
                            imgData: data
                        }))
                    }
                }
            }
        }
    }

    const mutate = async (): Promise<void> => {
        if (!options.imgData || !canvas.current) return
        const cntx = canvas.current.getContext('2d', { willReadFrequently: true })

        if (!cntx) return
        cntx.clearRect(0, 0, canvas.current.width, canvas.current.height)

        const config = {
            res: options.res,
            style: options.style,
            invert: options.invert,
            containedDots: options.containedDots,
            fontSize: options.fontSize,
            background: options.background
        }

        const data = await scanner(options.imgData, options.res)

        if (data && canvas.current) {
            if (options.double && options.style === 'dots') {
                // dark tones
                await printer(canvas.current, data, { ...config, invert: true, containedDots: true }, () => null)

                // bright tones
                await printer(canvas.current, data, { ...config, invert: false, containedDots: !options.brighter, background: null }, () => null, true)
            } else {
                await printer(canvas.current, data, config, (arg) => setOptions(opt => ({
                    ...opt,
                    bluePrint: arg
                })), !options.background)
            }
            if (setPreview) {
                canvas.current.toBlob((blob) => blob && setPreview(blob))
                setDownloadButton(() => true)
            }
        }
    }

    const reset = (): void => {
        if (canvas.current) {
            const cntx = canvas.current.getContext('2d', { willReadFrequently: true })
            if (!cntx) {
                console.error('Context is null');
                return
            }
            cntx.clearRect(0, 0, canvas.current.width, canvas.current.height)
            canvas.current.height = 150
            canvas.current.width = 300
        }
        parrentReset && parrentReset()
        setDownloadButton(() => false)

        setOptions(opt => ({
            ...opt,
            imgData: null,
            background: null,
            showText: false,
            bluePrint: null,
            double: false,
            brighter: false
        }))
    }

    return (
        <div className='main-component'>
            <canvas ref={canvas} className='canvas'></canvas>

            <OptionsPanel options={options} setOptions={setOptions} mutate={mutate} reset={reset} download={download} dlBtn={downloadButton} />

            {/* <div className='buttons-container'>
                <button onClick={mutate} disabled={!options.imgData}>MUTATE</button>
                <button onClick={reset}>RESET</button>
                {downloadButton && <button onClick={download}>DOWNLOAD</button>}
            </div> */}


            <div className='ascciContainer'>
                {options.bluePrint && options.showText && options.bluePrint.map((string, i) => <p key={i}>{string}</p>)}
            </div>
        </div>
    )
}

export default Image