import { OptPanelComp } from '../../types'
import { RiEye2Line } from 'react-icons/ri';

const Invert = ({ options, setOptions }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>

    return (
        <label htmlFor="invert">
            <div className='OptPanelComp pointer'>Invert
                <input disabled={options.double} type="checkbox" name="invert" id="invert" onChange={() => setOptions(opt => ({
                    ...opt,
                    invert: !opt.invert
                }))} />
            </div>
        </label>
    )
}

export default Invert