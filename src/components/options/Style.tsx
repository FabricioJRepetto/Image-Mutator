import { useEffect } from 'react'
import { OptPanelComp } from '../../types'

const Style = ({ setOptions }: OptPanelComp): JSX.Element => {

    useEffect(() => {
        //: TODO: reproducir fx
    }, [])

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