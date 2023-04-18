import { useEffect } from 'react'
import { OptPanelComp } from '../../types'
import { play } from '../Sound'

const Style = ({ setOptions }: OptPanelComp): JSX.Element => {
    useEffect(() => play(), [])

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