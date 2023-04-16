import { OptPanelComp } from '../../types'

const LimitSize = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    return (
        <div className={options.style !== 'dots' ? 'hidden' : 'OptPanelComp'}>
            <label htmlFor="limitDots">Limit dot size</label>
            <input type="checkbox" name="limitDots" id="limitDots" defaultChecked disabled={options.double} onChange={() => setOptions(opt => ({
                ...opt,
                containedDots: !opt.containedDots
            }))}></input>
        </div>
    )
}

export default LimitSize