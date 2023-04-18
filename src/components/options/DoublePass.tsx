import { useEffect } from 'react'
import { OptPanelComp } from "../../types"
import Checkbox from "../Checkbox"
import { play } from "../Sound"

const DoublePass = ({ options, setOptions, GIF }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    useEffect(() => {
        options.style !== 'ascii' && play()
    }, [options.style])

    const click = () => {
        setOptions(opt => ({
            ...opt,
            double: !opt.double
        }))
    }

    return (
        <div className={(options.style === 'dots' && !GIF) ? 'OptPanelComp' : 'hidden'}>
            <label htmlFor="double">Double pass </label>
            <Checkbox id='double' disabled={false} def={false} cb={click} />
        </div>
    )
}

export default DoublePass