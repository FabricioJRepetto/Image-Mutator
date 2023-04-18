import { useEffect } from 'react'
import { OptPanelComp } from '../../types'
import Checkbox from '../Checkbox'
import { play } from '../Sound'

const Brigther = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    useEffect(() => {
        options.style !== 'ascii' && options.double && play()
    }, [options.style, options.double])

    const click = () => {
        setOptions(opt => ({
            ...opt,
            brighter: !opt.brighter
        }))
    }

    return (
        <div className={(options.style === 'dots' && options.double) ? 'OptPanelComp' : 'hidden'}>
            <label >Brighter </label>
            <Checkbox id='brighter' disabled={false} def={false} cb={click} />
        </div>
    )
}

export default Brigther