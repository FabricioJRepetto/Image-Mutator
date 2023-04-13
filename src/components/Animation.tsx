import { useEffect, useRef, useState } from 'react'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import { encoder } from '../mutator/encode'
import { decoder } from '../mutator/decode'
import { download } from '../mutator/utils'
import { mainComps, options } from '../types'
import OptionsPanel from './OptionsPanel'

const Animation = ({ file, setPreview, parrentReset }: mainComps): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)
    const fileinput = useRef<HTMLInputElement>(null)
    const [downloadButton, setDownloadButton] = useState<boolean>(false)

    const [gifFile, setGifFile] = useState<File | null>()

    useEffect(() => {
        if (file) {
            loadGif(file)
        }
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
                // const preview = finalSteps(buffer, gifFile.name + '_mutated', { type: 'image/gif' }, dlbutton.current)
                setPreview(buffer)
                setDownloadButton(() => true)
            }

            console.log(`Time elapsed: ${(Date.now() - start) / 1000}s`);
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
        if (fileinput.current) fileinput.current.value = ''
        parrentReset && parrentReset()

        setDownloadButton(() => false)

        setGifFile(() => null)
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

            <OptionsPanel options={options} setOptions={setOptions} GIF />

            <div className='buttons-container'>
                <button onClick={mutateGif} disabled={!gifFile}>MUTATE GIF</button>
                <button onClick={reset} >RESET</button>
                {downloadButton && <button onClick={download}>DOWNLOAD</button>}
            </div>
        </div>
    )
}

export default Animation