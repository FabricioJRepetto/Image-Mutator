import { OptPanelComp } from "../../types"

const DoublePass = ({ options, setOptions, GIF }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    return (
        <div className={(options.style === 'dots' && !GIF) ? 'OptPanelComp' : 'hidden'}>
            <label htmlFor="double">Double pass: {options.double ? 'yes' : 'no'}</label>
            <input type="checkbox" name="double" id="double" onChange={() => setOptions(opt => ({
                ...opt,
                double: !opt.double
            }))}></input>
        </div>
    )
}

export default DoublePass