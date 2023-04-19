import { useEffect, useState } from 'react'
import { OptPanelComp } from "../../types"
import { RiEye2Line, RiEyeCloseLine } from 'react-icons/ri';
import { plop } from "../../utils/Sound"

const DoublePass = ({ options, setOptions, GIF }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    const [state, setState] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)

    useEffect(() => {
        options.style !== 'ascii' && plop()
    }, [options.style])

    const click = () => {
        setState(s => !s)
        setOptions(opt => ({
            ...opt,
            double: !opt.double
        }))
    }

    return (
        <div className={(options.style === 'dots' && !GIF) ? 'OptPanelComp pointer' : 'hidden'} onClick={click}>
            Double pass
            <div className={`checkbox-eye ${disabled ? 'disabled-eye' : ''}`} >
                {state ? <RiEye2Line /> : <RiEyeCloseLine />}
            </div>
        </div>
    )
}

export default DoublePass