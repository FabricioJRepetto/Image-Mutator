import { useEffect } from 'react'
import { OptPanelComp } from '../../types'
import { plop } from '../../utils/Sound'

const Style = ({ setOptions }: OptPanelComp): JSX.Element => {
    useEffect(() => plop(), [])

    return (
        <div className='OptPanelComp'>Style
            <select name="style" id="select" defaultValue={'dots'} className='styleselect' onChange={(e) => setOptions(opt => ({
                ...opt,
                style: e.target.value
            }))}>
                <option value="ascii">ascii</option>
                <option value="dots">dots</option>
            </select>
        </div>
    )
}

export default Style