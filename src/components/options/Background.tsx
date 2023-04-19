import { useEffect } from 'react'
import { OptPanelComp } from '../../types'
import { plop } from '../../utils/Sound'
import { RiCloseCircleFill } from 'react-icons/ri';

const Background = ({ options, setOptions, bgHandler, GIF }: OptPanelComp): JSX.Element => {
    if (!options) return <>error: no options</>
    if (!bgHandler) return <>error: cb</>

    useEffect(() => plop(), [])

    return (
        <div className='OptPanelComp'>
            <p>Background</p>
            <input type="text" placeholder={options?.background || 'HEX code'} className='hexinput' onChange={(e) => bgHandler(e.target.value)} />
            <input type="color" className='colorinput' value={options?.background?.length === 7 ? options.background : '#000000'} onChange={(e) => bgHandler(e.target.value)}></input>
            {!GIF && <div className='transparent' onClick={() => setOptions(opt => ({
                ...opt,
                background: null
            }))}><RiCloseCircleFill /></div>}
        </div>
    )
}

export default Background