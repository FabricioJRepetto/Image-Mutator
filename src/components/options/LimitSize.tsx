import { useEffect, useState } from 'react'
import { OptPanelComp } from '../../types'
import Checkbox from '../Checkbox'
import { plop } from '../../utils/Sound'
import { RiEye2Line, RiEyeCloseLine } from 'react-icons/ri';

const LimitSize = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    const [state, setState] = useState<boolean>(true)

    useEffect(() => plop(), [])

    const click = () => {
        if (!options.double) {
            setState(s => !s)
            setOptions(opt => ({
                ...opt,
                containedDots: !opt.containedDots
            }))
        }
    }

    return (
        <div className={options.style !== 'dots' ? 'hidden' : 'OptPanelComp pointer'} onClick={click}>
            Limit dot size
            <div className={`checkbox-eye ${options.double ? 'disabled-eye' : ''}`} >
                {state ? <RiEye2Line /> : <RiEyeCloseLine />}
            </div>
        </div>
    )
}

export default LimitSize