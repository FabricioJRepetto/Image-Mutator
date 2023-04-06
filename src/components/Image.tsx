import { useRef, useState } from 'react'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import '../App.css'
import { options } from '../types'
import OptionsPanel from './OptionsPanel'

const Image = (): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)
    const fileinput = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState<boolean>(false)

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

    const loadImage = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            // const img = new Image()
            const img = document.createElement('img')

            img.src = URL.createObjectURL(file)

            img.onload = () => {
                if (canvas.current) {
                    const width = img.width,
                        height = img.height,
                        cntx = canvas.current.getContext('2d')

                    canvas.current.width = width
                    canvas.current.height = height

                    if (cntx) {
                        cntx.drawImage(img, 0, 0, width, height)
                        // console.log(canvas.current.toDataURL()) //? convierte a base64
                        const data = cntx.getImageData(0, 0, width, height)
                        //: setImgData(() => data)
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
        setLoading(true)

        if (!options.imgData || !canvas.current) return
        const cntx = canvas.current.getContext('2d')

        if (!cntx) return
        cntx.clearRect(0, 0, canvas.current.width, canvas.current.height)

        if (fileinput.current) fileinput.current.value = ''

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
            if (options.double) {
                // dark tones
                await printer(canvas.current, data, { ...config, invert: true, containedDots: true }, () => null)

                // bright tones
                await printer(canvas.current, data, { ...config, invert: false, containedDots: options.brighter, background: null }, () => null)
            } else {
                //: await printer(canvas.current, data, config, (arg) => setBluePrint(() => arg))
                await printer(canvas.current, data, config, (arg) => setOptions(opt => ({
                    ...opt,
                    bluePrint: arg
                })))
            }
        }

        setLoading(false)
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
        <div>
            <canvas ref={canvas} className='canvas' style={options.imgData ? {} : { display: 'none' }}></canvas>

            <div>
                <p>Imagen</p>
                <input ref={fileinput} type="file" id='fileinput' onChange={(e) => loadImage(e.target.files)}></input>
            </div>

            <OptionsPanel options={options} setOptions={setOptions} />

            <div>
                <button onClick={mutate} disabled={!options.imgData}>MUTATE</button>
                <button onClick={reset} >RESET</button>
            </div>

            <div className='ascciContainer'>
                {options.bluePrint && options.showText && options.bluePrint.map((string, i) => <p key={i}>{string}</p>)}
            </div>
        </div>
    )
}

export default Image