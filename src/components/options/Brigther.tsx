import { useEffect, useState } from 'react'
import { OptPanelComp } from '../../types'
import Checkbox from '../Checkbox'
import { RiEye2Line, RiEyeCloseLine } from 'react-icons/ri';

import { plop } from '../../utils/Sound'

const Brigther = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    const [state, setState] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)

    useEffect(() => {
        options.style !== 'ascii' && options.double && plop()
    }, [options.style, options.double])

    const click = () => {
        setState(s => !s)
        setOptions(opt => ({
            ...opt,
            brighter: !opt.brighter
        }))
    }

    return (
        <div className={(options.style === 'dots' && options.double) ? 'OptPanelComp pointer' : 'hidden'} onClick={click}>
            Brighter
            <div className={`checkbox-eye ${disabled ? 'disabled-eye' : ''}`} >
                {state ? <RiEye2Line /> : <RiEyeCloseLine />}
            </div>
        </div>
    )
}

export default Brigther