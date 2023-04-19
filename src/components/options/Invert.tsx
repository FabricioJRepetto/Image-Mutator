import { useEffect, useState } from 'react'
import { OptPanelComp } from '../../types'
import Checkbox from '../Checkbox';
import { plop } from '../../utils/Sound';
import { RiEye2Line, RiEyeCloseLine } from 'react-icons/ri';


const Invert = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    const [state, setState] = useState<boolean>(false)

    useEffect(() => plop(), [])

    const click = () => {
        if (!options.double) {
            setState(s => !s)
            setOptions(opt => ({
                ...opt,
                invert: !opt.invert
            }))
        }
    }

    return (
        <div className='OptPanelComp pointer' onClick={click}>
            Invert
            <div className={`checkbox-eye ${options.double ? 'disabled-eye' : ''}`} >
                {state ? <RiEye2Line /> : <RiEyeCloseLine />}
            </div>
        </div>
    )
}

export default Invert