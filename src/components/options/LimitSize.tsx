import { useEffect } from 'react'
import { OptPanelComp } from '../../types'
import Checkbox from '../Checkbox'
import { play } from '../Sound'

const LimitSize = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    useEffect(() => play(), [])

    const click = () => {
        setOptions(opt => ({
            ...opt,
            containedDots: !opt.containedDots
        }))
    }

    return (
        <div className={options.style !== 'dots' ? 'hidden' : 'OptPanelComp'}>
            <label htmlFor="limitDots">Limit dot size</label>
            <Checkbox id='limitDots' disabled={options.double} def={true} cb={click} />
        </div>
    )
}

export default LimitSize