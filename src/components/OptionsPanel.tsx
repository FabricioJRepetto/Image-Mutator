import { options } from '../types'

interface OptPanelProps {
    options: options,
    setOptions: React.Dispatch<React.SetStateAction<options>>,
    GIF?: boolean
}

const OptionsPanel = ({ options, setOptions, GIF = false }: OptPanelProps): JSX.Element => {

    const fontSizeHandler = (num: string): void => {
        if (!num) return

        let size = parseInt(num) / 10
        setOptions(opt => ({
            ...opt,
            fontSize: size
        }))
    }

    return (
        <div>
            <div className='border'>
                <label htmlFor="style">Style</label>
                <select name="style" id="select" defaultValue={'dots'} className='styleselect' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    style: e.target.value
                }))}>
                    <option value="ascii">ascii</option>
                    <option value="dots">dots</option>
                </select>
            </div>

            <div className='border'>
                <label htmlFor="range">Resolution: {options.res}{options.imgData && <i> ({Math.ceil(options.imgData.width / options.res)} per row)</i>}</label>
                <input type="range" min={2} max={15} defaultValue={5} className='resolution' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    res: parseInt(e.target.value)
                }))}></input>
            </div>

            <div className='border'>
                <p>Background: {!options.background && '🚫'}</p>
                <input type="text" placeholder='HEX' className='hexinput' onChange={(e) => setOptions(opt => ({
                    ...opt,
                    background: e.target.value
                }))} />
                <input type="color" className='colorinput' value={options?.background?.length === 7 ? options.background : '#000000'} onChange={(e) => setOptions(opt => ({
                    ...opt,
                    background: e.target.value
                }))}></input>
                <div className='transparent' onClick={() => setOptions(opt => ({
                    ...opt,
                    background: null
                }))}>🚫</div>
            </div>

            <div className='border'>
                <label htmlFor="invert">Invert: {options.invert ? 'yes' : 'no'}</label>
                <input disabled={options.double} type="checkbox" name="invert" id="invert" onChange={() => setOptions(opt => ({
                    ...opt,
                    invert: !opt.invert
                }))}></input>
            </div>

            {options.style === 'dots' &&
                <>
                    <div className='border'>
                        <label htmlFor="limitDots">Limit dot size</label>
                        <input type="checkbox" name="limitDots" id="limitDots" defaultChecked disabled={options.double} onChange={() => setOptions(opt => ({
                            ...opt,
                            containedDots: !opt.containedDots
                        }))}></input>
                    </div>

                    {!GIF && <div className='border'>
                        <label htmlFor="double">Double pass: {options.double ? 'yes' : 'no'}</label>
                        <input type="checkbox" name="double" id="double" onChange={() => setOptions(opt => ({
                            ...opt,
                            double: !opt.double
                        }))}></input>
                    </div>}

                    {options.double && <div className='border'>
                        <label htmlFor="brighter">Brighter: {options.brighter ? 'yes' : 'no'}</label>
                        <input type="checkbox" name="brighter" id="brighter" checked={options.brighter} onChange={() => setOptions(opt => ({
                            ...opt,
                            brighter: !opt.brighter
                        }))}></input>
                    </div>}
                </>}

            {options.style === 'ascii' &&
                <div className='border'>
                    <p>Font size: <i>{options.fontSize}</i></p>
                    <input type="range" min={0} max={19} defaultValue={10} onChange={(e) => fontSizeHandler(e.target.value)}></input>
                    <br />
                    <button onClick={() => setOptions(opt => ({
                        ...opt,
                        showText: !opt.showText
                    }))} disabled={!options.bluePrint}>SHOW TEXT</button>
                </div>}
        </div>
    )
}

export default OptionsPanel