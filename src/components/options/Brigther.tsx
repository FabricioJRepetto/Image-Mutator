import { OptPanelComp } from '../../types'

const Brigther = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    return (
        <div className={(options.style === 'dots' && options.double) ? 'OptPanelComp' : 'hidden'}>
            <label htmlFor="brighter">Brighter: {options.brighter ? 'yes' : 'no'}</label>
            <input type="checkbox" name="brighter" id="brighter" checked={options.brighter} onChange={() => setOptions(opt => ({
                ...opt,
                brighter: !opt.brighter
            }))}></input>
        </div>
    )
}

export default Brigther