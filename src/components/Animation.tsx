import React, { useRef, useState } from 'react'
import { scanner } from '../mutator/scanner'
import { printer } from '../mutator/printer'
import { encoder } from '../mutator/encode'
import { decoder } from '../mutator/decode'

const Animation = (): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null)

    const [gifFile, setGifFile] = useState<File | null>()
    const [gifpreview, setGifpreview] = useState<string | null>(null)

    const [loading, setLoading] = useState<boolean>(false)
    const [style, setStyle] = useState<string>('dots')
    const [res, setRes] = useState<number>(5)
    const [background, setBackground] = useState<string | null>(null)
    const [containedDots, setContainedDots] = useState<boolean>(true)
    const [invert, setInvert] = useState<boolean>(false)
    const [fontSize, setFontSize] = useState<number>(1)
    // const [bluePrint, setBluePrint] = useState<Array<string> | null>(null)
    const [double, setDouble] = useState<boolean>(false)

    const loadGif = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            setGifFile(() => file)
            console.log(file);

        }
    }

    const mutateGif = async (): Promise<void> => {
        if (!gifFile || !canvas.current) return

        const gifData = await decoder(gifFile)

        if (gifData) {
            /*
               {
                   delay: frames[i].delay
                   width: frames[i].dims.width,
                   height: frames[i].dims.height,
                   data: frames[i].patch
               }
           */
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
            const preview = await encoder(styledFrames, DELAY)
            //: TODO: should return final buffer
            //: convert buffer to url object
            //: get original file name for download?
            //: render preview & download button 
            //_ testing preview
            if (preview) setGifpreview(() => preview)

            //_ raw animation preview for testing
            // let i = 0
            // setInterval(() => {
            //     cntx.clearRect(0, 0, WIDTH, HEIGHT)
            //     cntx.putImageData(styledFrames[i], 0, 0)
            //     i++
            //     if (i === styledFrames.length) i = 0
            // }, Math.floor(DELAY))
        }
    }

    const fontSizeHandler = (num: string): void => {
        let size = parseInt(num) / 10
        setFontSize(() => size)
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

        setBackground(() => null)
        // setDouble(() => false)
        // setBrighter(() => false)
    }

    return (
        <div>
            <canvas ref={canvas} className='canvas' style={{ display: 'none' }}></canvas>
            {gifpreview && <img src={gifpreview} />}

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
                <p>Resolution: {res}{canvas.current && <i> ({Math.ceil(canvas.current.width / res)} per row)</i>}</p>
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
                    {/* <br />
                    <label htmlFor="double">Double pass: {double ? 'yes' : 'no'}</label>
                    <input type="checkbox" name="double" id="double" onChange={() => setDouble(current => !current)}></input> */}
                    {/* <br />
                    {double && <>
                        <label htmlFor="brighter">Brighter: {brighter ? 'no' : 'yes'}</label>
                        <input type="checkbox" name="brighter" id="brighter" onChange={() => setBrighter(current => !current)}></input>
                        <br />
                    </>} */}
                </>}

            {style === 'ascii' &&
                <>
                    <>
                        <p>Font size: <i>{fontSize}</i></p>
                        <input type="range" min={0} max={19} defaultValue={10} onChange={(e) => fontSizeHandler(e.target.value)}></input>
                        <br />
                    </>
                </>}

            <div>
                <>
                    <label htmlFor="invert">Invert: {invert ? 'yes' : 'no'}</label>
                    <input disabled={double} type="checkbox" name="invert" id="invert" onChange={() => setInvert(current => !current)}></input>
                    <br />

                </>
                <button onClick={mutateGif} disabled={!gifFile}>MUTATE GIF</button>
                <button onClick={reset} >RESET</button>
            </div>

        </div>
    )
}

export default Animation