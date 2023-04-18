import { useEffect } from 'react'
import { OptPanelComp } from '../../types'
import Checkbox from '../Checkbox';
import { play } from '../Sound';

const Invert = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    useEffect(() => play(), [])

    const click = () => {
        setOptions(opt => ({
            ...opt,
            invert: !opt.invert
        }))
    }

    return (
        <label htmlFor="invert">
            <div className='OptPanelComp pointer'>Invert
                <Checkbox id='invert' disabled={options.double} def={false} cb={click} />
            </div>
        </label>
    )
}

export default Invert