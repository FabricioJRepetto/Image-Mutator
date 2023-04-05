import { useRef, useState } from 'react'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import '../App.css'

const Image = (): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)

    const [loading, setLoading] = useState<boolean>(false)

    interface options {
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

    // const [imgData, setImgData] = useState<ImageData | null>()
    // const [style, setStyle] = useState<string>('dots')
    // const [res, setRes] = useState<number>(5)
    // const [background, setBackground] = useState<string | null>(null)
    // const [containedDots, setContainedDots] = useState<boolean>(true)
    // const [invert, setInvert] = useState<boolean>(false)
    // const [fontSize, setFontSize] = useState<number>(1)
    // const [showText, setShowText] = useState<boolean>(false)
    // const [bluePrint, setBluePrint] = useState<string[] | null>(null)
    // const [double, setDouble] = useState<boolean>(false)
    // const [brighter, setBrighter] = useState<boolean>(false)

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

    const fontSizeHandler = (num: string): void => {
        if (!num) return

        let size = parseInt(num) / 10
        //: setFontSize(() => size)
        setOptions(opt => ({
            ...opt,
            fontSize: size
        }))
    }

    const mutate = async (): Promise<void> => {
        setLoading(true)

        if (!options.imgData || !canvas.current) return
        const cntx = canvas.current.getContext('2d')

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
            //: await printer(canvas.current, data, config, (arg) => setBluePrint(() => arg))
            await printer(canvas.current, data, config, (arg) => setOptions(opt => ({
                ...opt,
                bluePrint: arg
            })))
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

        //: setImgData(() => null)
        //: setBackground(() => null)
        //: setShowText(() => false)
        //: setBluePrint(() => null)
        //: setDouble(() => false)
        //: setBrighter(() => false)
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
            <canvas ref={canvas} className='canvas'></canvas>

            <div>
                <p>Imagen</p>
                <input type="file" id='fileinput' onChange={(e) => loadImage(e.target.files)}></input>
            </div>

            <div className='border'>
                <label htmlFor="style">Style</label>
                {/* //: <select name="style" id="select" defaultValue={'dots'} className='styleselect' onChange={(e) => setStyle(e.target.value)}> */}
                <select name="style" id="select" defaultValue={'dots'} className='styleselect' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    style: e.target.value
                }))}>
                    <option value="ascii">ascii</option>
                    <option value="dots">dots</option>
                </select>
            </div>

            <div className='border'>
                <label htmlFor="range">Resolution: {options.res}{options.imgData && <i> ({Math.ceil(options.imgData.width / options.res)} per row)</i>}</label>
                {/* //: <input type="range" min={2} max={15} defaultValue={5} className='resolution' onChange={(e) => setRes(parseInt(e.target.value))}></input> */}
                <input type="range" min={2} max={15} defaultValue={5} className='resolution' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    res: parseInt(e.target.value)
                }))}></input>
            </div>

            <div className='border'>
                <label htmlFor="color">Background: {options.background || '🚫'}</label>
                {/* //: <input type="color" className='colorinput' onChange={(e) => setBackground(e.target.value)}></input> */}
                <input type="color" className='colorinput' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    color: e.target.value
                }))}></input>
                {/* //: <div className='transparent' onClick={() => setBackground(() => null)}>🚫</div> */}
                <div className='transparent' onClick={() => setOptions(opt => ({
                    ...opt,
                    color: null
                }))}>🚫</div>
            </div>

            <div className='border'>
                <label htmlFor="invert">Invert: {options.invert ? 'yes' : 'no'}</label>
                {/* //: <input disabled={double} type="checkbox" name="invert" id="invert" onChange={() => setInvert(current => !current)}></input> */}
                <input disabled={options.double} type="checkbox" name="invert" id="invert" onChange={() => setOptions(opt => ({
                    ...opt,
                    invert: !opt.invert
                }))}></input>
            </div>

            {options.style === 'dots' &&
                <>
                    <div className='border'>
                        <label htmlFor="limitDots">Limit dot size</label>
                        {/* //: <input type="checkbox" name="limitDots" id="limitDots" defaultChecked disabled={double} onChange={() => setContainedDots(() => !containedDots)}></input> */}
                        <input type="checkbox" name="limitDots" id="limitDots" defaultChecked disabled={options.double} onChange={() => setOptions(opt => ({
                            ...opt,
                            containedDots: !opt.containedDots
                        }))}></input>
                    </div>

                    <div className='border'>
                        <label htmlFor="double">Double pass: {options.double ? 'yes' : 'no'}</label>
                        {/* //: <input type="checkbox" name="double" id="double" onChange={() => setDouble(current => !current)}></input> */}
                        <input type="checkbox" name="double" id="double" onChange={() => setOptions(opt => ({
                            ...opt,
                            double: !opt.double
                        }))}></input>
                    </div>

                    {options.double && <div className='border'>
                        <label htmlFor="brighter">Brighter: {options.brighter ? 'yes' : 'no'}</label>
                        {/* //: <input type="checkbox" name="brighter" id="brighter" checked={brighter} onChange={() => setBrighter(current => !current)}></input> */}
                        <input type="checkbox" name="brighter" id="brighter" checked={options.brighter} onChange={() => setOptions(opt => ({
                            ...opt,
                            brighter: !opt.brighter
                        }))}></input>
                    </div>}
                </>}

            {options.style === 'ascii' &&
                <>
                    <p>Font size: <i>{options.fontSize}</i></p>
                    <input type="range" min={0} max={19} defaultValue={10} onChange={(e) => fontSizeHandler(e.target.value)}></input>
                    <br />
                    <button onClick={() => setOptions(opt => ({
                        ...opt,
                        showText: !opt.showText
                    }))} disabled={!options.bluePrint}>SHOW TEXT</button>
                </>}

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