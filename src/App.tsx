import { useRef, useState } from 'react'
import { printer, scanner } from './utils'
import './App.css'

function App() {
    const canvas = useRef<HTMLCanvasElement>(null)

    const [loading, setLoading] = useState<boolean>(false)
    const [imgData, setImgData] = useState<ImageData | null>()
    const [style, setStyle] = useState<string>('dots')
    const [res, setRes] = useState<number>(5)
    const [containedDots, setContainedDots] = useState<boolean>(true)
    const [fontSize, setFontSize] = useState<number>(1)
    const [showText, setShowText] = useState<boolean>(false)
    const [bluePrint, setBluePrint] = useState<Array<string> | null>(null)
    const [invert, setInvert] = useState<boolean>(false)
    const [double, setDouble] = useState<boolean>(false)

    const loadImage = (files: FileList | null): void => {
        if (files) {
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
        if (!imgData) return

        const config = {
            res,
            style,
            invert,
            containedDots,
            fontSize,
            //: TODO: refact
            margin: false,
            background: '#FFF'
        }

        const data = scanner(imgData, res, invert)
        if (data && canvas.current) {
            if (!double) {
                printer(canvas.current, data, config, setBluePrint)
            } else {
                printer(canvas.current, data, config, setBluePrint)
            }
        }
    }

    const reset = (): void => {
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
        setShowText(() => false)
        setBluePrint(() => null)
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Image mutator</h1>
            </header>

            <canvas ref={canvas} className='canvas'></canvas>
            {loading && <h1>···LOADING···</h1>}

            <div>
                <input type="file" onChange={(e) => loadImage(e.target.files)}></input>
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

            {style === 'dots' &&
                <>
                    <label htmlFor="limitDots">limit dot size</label>
                    <input type="checkbox" name="limitDots" id="limitDots" defaultChecked onChange={() => setContainedDots(() => !containedDots)}></input>
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
                    <input type="checkbox" name="invert" id="invert" onChange={() => setInvert(current => !current)}></input>
                    <br />
                    <label htmlFor="invert">Double pass: {double ? 'yes' : 'no'}</label>
                    <input type="checkbox" name="invert" id="invert" onChange={() => setDouble(current => !current)}></input>
                    <br />
                    {/* <label htmlFor="margin">Margin: {margin ? 'yes' : 'no'}</label>
                    <input type="checkbox" name="margin" id="margin" onChange={() => setMargin(() => !margin)}></input>
                    <br /> */}
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
