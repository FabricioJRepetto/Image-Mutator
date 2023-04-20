import { useEffect, useRef } from 'react'
import { OptPanelComp } from '../../types'
import "../../range-input.css"
import { plop } from '../../utils/Sound'

const Resolution = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    const resinput = useRef<HTMLInputElement | null>(null)

    const rangeListener = (): void => {
        const e = resinput.current
        e && e.style.setProperty('--value', e.value)
    }

    useEffect(() => plop(), [])

    useEffect(() => {
        if (resinput.current) {
            const e = resinput.current
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min == '' ? '0' : e.min);
            e.style.setProperty('--max', e.max == '' ? '100' : e.max);
            e.addEventListener('input', rangeListener);
        }

        return () => removeEventListener('input', rangeListener)
    }, [resinput.current])

    return (
        <div className='OptPanelComp resolution-div'>
            <label htmlFor="range">Threshold {options.res}{options.imgData && <i> ({Math.ceil(options.imgData.width / options.res)} per row)</i>}</label>
            <input ref={resinput} type="range" min={2} max={15} defaultValue={5} className="resolution styled-slider slider-progress" onChange={(e) => setOptions(opt => ({
                ...opt,
                res: parseInt(e.target.value)
            }))}></input>
        </div>
    )
}

export default Resolution