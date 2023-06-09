import { useEffect, useRef, useState } from 'react'
import { mainComps, options } from '../types'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import { encoder } from '../mutator/encode'
import { decoder } from '../mutator/decode'
import { download } from '../mutator/utils'
import OptionsPanel from './OptionsPanel'

const Animation = ({ file, setPreview }: mainComps): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)
    const fileinput = useRef<HTMLInputElement>(null)
    const [downloadButton, setDownloadButton] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [gifFile, setGifFile] = useState<File | null>()

    useEffect(() => {
        if (file) loadGif(file)
    }, [])

    const [options, setOptions] = useState<options>({
        imgData: null,
        style: 'dots',
        res: 5,
        background: '#000000',
        containedDots: true,
        invert: false,
        fontSize: 1,
        showText: false,
        bluePrint: null,
        double: false,
        brighter: false
    })

    const loadGif = (file: File): void => {
        setGifFile(() => file)
    }

    const mutateGif = async (): Promise<void> => {
        setLoading(() => true)
        setTimeout(() => null, 0);

        const start = Date.now()

        if (!gifFile || !canvas.current) return

        const gifData = await decoder(gifFile)

        if (gifData) {
            const styledFrames: Array<ImageData> = [],
                WIDTH = gifData[0].dims.width,
                HEIGHT = gifData[0].dims.height,
                DELAY = gifData[0].delay

            canvas.current.width = WIDTH
            canvas.current.height = HEIGHT

            const cntx = canvas.current.getContext('2d', { willReadFrequently: true })
            if (!cntx) return

            const config = {
                res: options.res,
                style: options.style,
                invert: options.invert,
                containedDots: options.containedDots,
                fontSize: options.fontSize,
                background: options.background
            }

            for (let frame of gifData) {
                const imgData = {
                    width: WIDTH,
                    height: HEIGHT,
                    data: frame.patch
                }

                if (frame.pixels.length) {
                    //? 1: scan frame
                    const data = await scanner(imgData, options.res)

                    //? 2: clear canvas
                    cntx.clearRect(0, 0, WIDTH, HEIGHT)

                    //? 3: print styled
                    await printer(canvas.current, data, config, () => null)

                    //? 4: get styled frame
                    const styledFrame = cntx.getImageData(0, 0, WIDTH, HEIGHT)

                    //? 5: save new frame
                    styledFrames.push(styledFrame)
                }
            }
            cntx.clearRect(0, 0, WIDTH, HEIGHT)

            //? 6: compile new gif
            //_ file encoder 
            const buffer = await encoder(styledFrames, DELAY)

            //? 7: set preview and download button
            if (buffer && setPreview) {
                setPreview(buffer)
                setDownloadButton(() => true)
            }

            console.log(`Time elapsed: ${(Date.now() - start) / 1000}s`);
            setLoading(() => false)
        }
    }

    const softReset = () => {
        setPreview && setPreview(null)
        setDownloadButton(() => false)

        setOptions(opt => ({
            ...opt,
            background: '#000000',
            double: false,
            brighter: false
        }))
    }

    return (
        <div className='main-component'>
            <canvas ref={canvas} className='canvas'></canvas>

            <OptionsPanel options={options} setOptions={setOptions} GIF mutate={mutateGif} softReset={softReset} download={download} dlBtn={downloadButton} loading={loading} />
        </div>
    )
}

export default Animation