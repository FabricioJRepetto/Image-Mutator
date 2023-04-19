import { useEffect, useRef } from 'react'
import { OptPanelComp } from '../../types'
import "../../range-input.css"
import { plop } from '../../utils/Sound'

const FontSize = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    const fontinput = useRef<HTMLInputElement | null>(null)

    const fontRangeListener = (): void => {
        const e = fontinput.current
        e && e.style.setProperty('--value', e.value)
    }

    useEffect(() => {
        options.style === 'ascii' && plop()
    }, [options.style])

    useEffect(() => {
        if (fontinput.current) {
            const e = fontinput.current
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min == '' ? '0' : e.min);
            e.style.setProperty('--max', e.max == '' ? '100' : e.max);
            e.addEventListener('input', fontRangeListener);
        }

        return () => removeEventListener('input', fontRangeListener)
    }, [fontinput.current])

    const fontSizeHandler = (num: string): void => {
        if (!num) return

        let size = parseInt(num) / 10
        setOptions(opt => ({
            ...opt,
            fontSize: size
        }))
    }

    return (
        <div className={`${options.style !== 'ascii' ? 'hidden' : 'font-container'}`}>
            <div className='OptPanelComp resolution-div'>
                <p>Font size: <i>{options.fontSize}</i></p>
                <input ref={fontinput} type="range" min={1} max={19} defaultValue={10} className='resolution styled-slider slider-progress' onChange={(e) => fontSizeHandler(e.target.value)}></input>
            </div>
            <button onClick={() => setOptions(opt => ({
                ...opt,
                showText: !opt.showText
            }))} disabled={!options.bluePrint} className='popIn'>SHOW TEXT</button>
        </div>
    )
}

export default FontSize