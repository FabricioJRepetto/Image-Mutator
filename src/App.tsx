import { useRef, useState } from 'react'
import { printer } from './mutator/printer'
import { scanner } from './mutator/scanner'
import './App.css'

function App() {
    const canvas = useRef<HTMLCanvasElement>(null)

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

    const mutate = (): void => {
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

        const data = scanner(imgData, res)

        if (data && canvas.current) {

            if (!double) {
                printer(canvas.current, data, config, setBluePrint)
            } else {
                //: TODO: probar desactivando el tamaño de dots
                // dark tones
                printer(canvas.current, data, { ...config, invert: true, containedDots: true }, setBluePrint)

                // bright tones
                printer(canvas.current, data, { ...config, invert: false, containedDots: brighter, background: null }, setBluePrint)
            }
        }
    }

    const reset = (): void => {
        const inpt = document.getElementById('fileinput')
        console.log(inpt);

        if (canvas.current) {
            const cntx = canvas.current.getContext('2d')
            if (!cntx) {
                console.error('Context is null');
                return
            }
            cntx.clearRect(0, 0, canvas.current.width, canvas.current.height)
            canvas.current.height = 150
            canvas.current.width = 300
        }
        setImgData(() => null)
        setBackground(() => null)
        setShowText(() => false)
        setBluePrint(() => null)
        setDouble(() => false)
        setBrighter(() => false)
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Image mutator</h1>
            </header>

            <canvas ref={canvas} className='canvas'></canvas>

            <div>
                <input type="file" id='fileinput' onChange={(e) => loadImage(e.target.files)}></input>
            </div>

            <div>
                <select name="style" id="select" defaultValue={'dots'} onChange={(e) => setStyle(e.target.value)}>
                    <option value="ascii">ascii</option>
                    <option value="dots">dots</option>
                </select>
            </div>

            <div>
                <p>Resolution: {res}{imgData && <i> ({Math.ceil(imgData.width / res)} per row)</i>}</p>
                <input type="range" min={1} max={150} defaultValue={5} onChange={(e) => setRes(parseInt(e.target.value))}></input>
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
                <button onClick={reset} disabled={!imgData}>RESET</button>
            </div>

            <div className='ascciContainer'>
                {bluePrint && showText && bluePrint.map((string, i) => <p key={i}>{string}</p>)}
            </div>
        </div>
    )
}

export default App
