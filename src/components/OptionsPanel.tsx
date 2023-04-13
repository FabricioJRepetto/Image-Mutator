import { OptPanelProps } from '../types'
import { useEffect, useRef } from 'react'
import "../range-input.css"

const OptionsPanel = ({ options, setOptions, GIF = false }: OptPanelProps): JSX.Element => {

    const fontSizeHandler = (num: string): void => {
        if (!num) return

        let size = parseInt(num) / 10
        setOptions(opt => ({
            ...opt,
            fontSize: size
        }))
    }

    const resinput = useRef<HTMLInputElement | null>(null)

    const rangeListener = () => {
        const e = resinput.current
        e && e.style.setProperty('--value', e.value)
    }

    useEffect(() => {
        if (resinput.current) {
            const e = resinput.current
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min == '' ? '0' : e.min);
            e.style.setProperty('--max', e.max == '' ? '100' : e.max);
            e.addEventListener('input', rangeListener);
        }

        return () => removeEventListener('input', rangeListener)
    }, [])

    const bgHandler = (value: string): void => {
        setOptions(opt => ({
            ...opt,
            background: value
        }))

        if (value.length >= 7) {
            const blob = document.getElementById('blob-path')
            if (blob)
                blob.style.fill = value

            const title = document.getElementById('title-header')
            if (title)
                title.style.color = value
        }
    }

    return (
        <div>
            <div className='border'>
                <label htmlFor="style">Style</label>
                <select name="style" id="select" defaultValue={'dots'} className='styleselect' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    style: e.target.value
                }))}>
                    <option value="ascii">ascii</option>
                    <option value="dots">dots</option>
                </select>
            </div>

            <div className='border resolution-div'>
                <label htmlFor="range">Resolution: {options.res}{options.imgData && <i> ({Math.ceil(options.imgData.width / options.res)} per row)</i>}</label>
                <input ref={resinput} type="range" min={2} max={15} defaultValue={5} className="resolution styled-slider slider-progress" onChange={(e) => setOptions(opt => ({
                    ...opt,
                    res: parseInt(e.target.value)
                }))}></input>
            </div>

            <div className='border'>
                <p>Background: {!options.background && '🚫'}</p>
                <input type="text" placeholder={options?.background || 'HEX code'} className='hexinput' onChange={(e) => bgHandler(e.target.value)} />
                <input type="color" className='colorinput' value={options?.background?.length === 7 ? options.background : '#000000'} onChange={(e) => bgHandler(e.target.value)}></input>
                {!GIF && <div className='transparent' onClick={() => setOptions(opt => ({
                    ...opt,
                    background: null
                }))}>🚫</div>}
            </div>

            <div className='border'>
                <label htmlFor="invert">Invert: {options.invert ? 'yes' : 'no'}</label>
                <input disabled={options.double} type="checkbox" name="invert" id="invert" onChange={() => setOptions(opt => ({
                    ...opt,
                    invert: !opt.invert
                }))}></input>
            </div>

            {options.style === 'dots' &&
                <>
                    <div className='border'>
                        <label htmlFor="limitDots">Limit dot size</label>
                        <input type="checkbox" name="limitDots" id="limitDots" defaultChecked disabled={options.double} onChange={() => setOptions(opt => ({
                            ...opt,
                            containedDots: !opt.containedDots
                        }))}></input>
                    </div>

                    {!GIF && <div className='border'>
                        <label htmlFor="double">Double pass: {options.double ? 'yes' : 'no'}</label>
                        <input type="checkbox" name="double" id="double" onChange={() => setOptions(opt => ({
                            ...opt,
                            double: !opt.double
                        }))}></input>
                    </div>}

                    {options.double && <div className='border'>
                        <label htmlFor="brighter">Brighter: {options.brighter ? 'yes' : 'no'}</label>
                        <input type="checkbox" name="brighter" id="brighter" checked={options.brighter} onChange={() => setOptions(opt => ({
                            ...opt,
                            brighter: !opt.brighter
                        }))}></input>
                    </div>}
                </>}

            {options.style === 'ascii' &&
                <div className='border'>
                    <p>Font size: <i>{options.fontSize}</i></p>
                    <input type="range" min={0} max={19} defaultValue={10} onChange={(e) => fontSizeHandler(e.target.value)}></input>
                </div>}

            {options.style === 'ascii' &&
                <button onClick={() => setOptions(opt => ({
                    ...opt,
                    showText: !opt.showText
                }))} disabled={!options.bluePrint}>SHOW TEXT</button>}
        </div>
    )
}

export default OptionsPanel