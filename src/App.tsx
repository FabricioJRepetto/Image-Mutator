import { useRef, useState } from 'react'
import { printer } from './mutator/printer'
import { scanner } from './mutator/scanner'
import './App.css'
import { testgif } from './mutator/giftest'

function App() {
    const canvas = useRef<HTMLCanvasElement>(null)

    const [gifFile, setGifFile] = useState<File | null>()

    const [loading, setLoading] = useState<boolean>(false)

    const [imgData, setImgData] = useState<ImageData | null>()
    const [style, setStyle] = useState<string>('dots')
    const [res, setRes] = useState<number>(5)
    const [background, setBackground] = useState<string | null>(null)
    const [containedDots, setContainedDots] = useState<boolean>(true)
    const [invert, setInvert] = useState<boolean>(false)
    const [fontSize, setFontSize] = useState<number>(1)
    const [showText, setShowText] = useState<boolean>(false)
    const [bluePrint, setBluePrint] = useState<Array<string> | null>(null)
    const [double, setDouble] = useState<boolean>(false)
    const [brighter, setBrighter] = useState<boolean>(true)

    const loadImage = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            const img = new Image()

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
                        setImgData(() => data)
                    }
                }
            }
        }

    }

    const fontSizeHandler = (num: string): void => {
        if (!imgData || !canvas.current) {
            console.error('No image or canvas')
            return
        }

        let size = parseInt(num) / 10
        setFontSize(() => size)
        // print(size)
    }

    const mutate = async (): Promise<void> => {
        setLoading(true)

        if (!imgData || !canvas.current) return
        const cntx = canvas.current.getContext('2d')

        if (!cntx) return
        cntx.clearRect(0, 0, canvas.current.width, canvas.current.height)

        const config = {
            res,
            style,
            invert,
            containedDots,
            fontSize,
            //: TODO: refact
            margin: false,
            background
        }

        const data = await scanner(imgData, res)

        if (data && canvas.current) {

            if (!double) {
                await printer(canvas.current, data, config, setBluePrint)
            } else {
                //: TODO: probar desactivando el tamaño de dots
                // dark tones
                await printer(canvas.current, data, { ...config, invert: true, containedDots: true }, setBluePrint)

                // bright tones
                await printer(canvas.current, data, { ...config, invert: false, containedDots: brighter, background: null }, setBluePrint)
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
        setGifFile(() => null)

        setImgData(() => null)
        setBackground(() => null)
        setShowText(() => false)
        setBluePrint(() => null)
        setDouble(() => false)
        setBrighter(() => false)
    }

    const loadGif = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            setGifFile(() => file)
        }
    }

    const mutateGif = async (): Promise<void> => {
        if (!gifFile || !canvas.current) return

        const gifData = await testgif(gifFile)
        // console.log(gifData);

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
                res,
                style,
                invert,
                containedDots,
                fontSize,
                //: TODO: refact
                margin: false,
                background
            }

            for (let i = 0; i < gifData.length; i++) {
                const frame = gifData[i];
                const imgData = {
                    width: WIDTH,
                    height: HEIGHT,
                    data: frame.patch
                }

                if (frame.pixels.length) {
                    //? 1: scan frame
                    const data = await scanner(imgData, res)

                    //? 2: clear canvas
                    cntx.clearRect(0, 0, WIDTH, HEIGHT)

                    //? 3: print styled
                    await printer(canvas.current, data, config, setBluePrint)

                    //? 4: get styled frame
                    const styledFrame = cntx.getImageData(0, 0, WIDTH, HEIGHT)

                    //? 5: save new frame
                    styledFrames.push(styledFrame)
                }

            }
            // console.log(styledFrames);

            //? 6: compilar gif
            let i = 0
            setInterval(() => {
                cntx.clearRect(0, 0, WIDTH, HEIGHT)
                cntx.putImageData(styledFrames[i], 0, 0)
                i++
                if (i === styledFrames.length) i = 0
            }, Math.floor(DELAY))

            //________________________________________________________________

            // const frame = gifData[15]
            // console.log(frame);

            // const imgData = {
            //     width: frame.dims.width,
            //     height: frame.dims.height,
            //     data: frame.patch
            // }

            // const data = await scanner(imgData, res)

            // if (!imgData || !canvas.current) return

            // canvas.current.width = imgData.width
            // canvas.current.height = imgData.height
            // const cntx = canvas.current.getContext('2d')

            // if (!cntx) return
            // cntx.clearRect(0, 0, canvas.current.width, canvas.current.height)

            // const config = {
            //     res,
            //     style,
            //     invert,
            //     containedDots,
            //     fontSize,
            //     //: TODO: refact
            //     margin: false,
            //     background
            // }

            // await printer(canvas.current, data, config, setBluePrint)
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Image mutator</h1>
                <p>{loading ? `[[[ CARGANDO ]]]` : `( STAND BY )`}</p>
            </header>

            <canvas ref={canvas} className='canvas'></canvas>

            <div>
                <p>Imagen</p>
                <input type="file" id='fileinput' onChange={(e) => loadImage(e.target.files)}></input>
            </div>

            <div>
                <p>Gif</p>
                <input type="file" id='fileinput' onChange={(e) => loadGif(e.target.files)}></input>
            </div>

            <div>
                <select name="style" id="select" defaultValue={'dots'} onChange={(e) => setStyle(e.target.value)}>
                    <option value="ascii">ascii</option>
                    <option value="dots">dots</option>
                </select>
            </div>

            <div>
                <p>Resolution: {res}{imgData && <i> ({Math.ceil(imgData.width / res)} per row)</i>}</p>
                <input type="range" min={1} max={15} defaultValue={5} onChange={(e) => setRes(parseInt(e.target.value))}></input>
            </div>

            <div>
                <p>Background: {background || 'transparent'}</p>
                <input type="color" onChange={(e) => setBackground(e.target.value)}></input>
                <button onClick={() => setBackground(null)}>transparent</button>
            </div>

            {style === 'dots' &&
                <>
                    <label htmlFor="limitDots">limit dot size</label>
                    <input type="checkbox" name="limitDots" id="limitDots" defaultChecked disabled={double} onChange={() => setContainedDots(() => !containedDots)}></input>
                    <br />
                    <label htmlFor="double">Double pass: {double ? 'yes' : 'no'}</label>
                    <input type="checkbox" name="double" id="double" onChange={() => setDouble(current => !current)}></input>
                    <br />
                    {double && <>
                        <label htmlFor="brighter">Brighter: {brighter ? 'no' : 'yes'}</label>
                        <input type="checkbox" name="brighter" id="brighter" onChange={() => setBrighter(current => !current)}></input>
                        <br />
                    </>}
                </>}

            {style === 'ascii' &&
                <>
                    <>
                        <p>Font size: <i>{fontSize}</i></p>
                        <input type="range" min={0} max={19} defaultValue={10} onChange={(e) => fontSizeHandler(e.target.value)}></input>
                        <br />
                    </>
                    <button onClick={() => setShowText(() => !showText)} disabled={!bluePrint}>SHOW TEXT</button>
                </>}

            <div>
                <>
                    <label htmlFor="invert">Invert: {invert ? 'yes' : 'no'}</label>
                    <input disabled={double} type="checkbox" name="invert" id="invert" onChange={() => setInvert(current => !current)}></input>
                    <br />

                </>
                <button onClick={mutate} disabled={!imgData}>MUTATE</button>
                <button onClick={mutateGif} disabled={!gifFile}>MUTATE GIF</button>
                <button onClick={reset} >RESET</button>
            </div>

            <div className='ascciContainer'>
                {bluePrint && showText && bluePrint.map((string, i) => <p key={i}>{string}</p>)}
            </div>
        </div>
    )
}

export default App
