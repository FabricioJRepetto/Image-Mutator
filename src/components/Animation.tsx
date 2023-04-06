import { useRef, useState } from 'react'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import { encoder } from '../mutator/encode'
import { decoder } from '../mutator/decode'
import { finalSteps } from '../mutator/utils'
import { options } from '../types'
import OptionsPanel from './OptionsPanel'

const Animation = (): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)
    const dlbutton = useRef<HTMLAnchorElement>(null)

    const [gifFile, setGifFile] = useState<File | null>()
    const [gifpreview, setGifpreview] = useState<string | null>(null)

    const [loading, setLoading] = useState<boolean>(false)

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

    const loadGif = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            setGifFile(() => file)
        }
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
            if (buffer) {
                const preview = finalSteps(buffer, gifFile.name, { type: 'image/gif' }, dlbutton.current)
                preview && setGifpreview(() => preview)
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
        setGifFile(() => null)

        //: setBackground(() => null)
        // setDouble(() => false)
        // setBrighter(() => false)
        setOptions(opt => ({
            ...opt,
            background: '#000000',
            double: false,
            brighter: false
        }))
    }

    return (
        <div>
            <canvas ref={canvas} className='canvas' style={{ display: 'none' }}></canvas>

            <div style={gifpreview ? {} : { display: 'none' }}>
                {gifpreview && <img src={gifpreview} style={{ pointerEvents: 'none' }} />}
                <br />
                <a ref={dlbutton} href=''>download</a>
            </div>

            <div>
                <p>Gif</p>
                <input type="file" id='fileinput' onChange={(e) => loadGif(e.target.files)}></input>
            </div>

            <OptionsPanel options={options} setOptions={setOptions} GIF />

            <div>
                <button onClick={mutateGif} disabled={!gifFile}>MUTATE GIF</button>
                <button onClick={reset} >RESET</button>
            </div>
        </div>
    )
}

export default Animation