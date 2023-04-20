import { OptPanelProps } from '../types'
import { useEffect, useState } from 'react'
import Style from './options/Style'
import Resolution from './options/Resolution'
import Background from './options/Background'
import Invert from './options/Invert'
import LimitSize from './options/LimitSize'
import DoublePass from './options/DoublePass'
import Brigther from './options/Brigther'
import FontSize from './options/FontSize'
import { RiSaveFill, RiTestTubeFill, RiArrowGoBackFill, RiCloseCircleFill } from 'react-icons/ri';
import { plop, smash } from '../utils/Sound'
import "../range-input.css"

const OptionsPanel = ({ options, setOptions, GIF = false, mutate, softReset, download, dlBtn, loading }: OptPanelProps): JSX.Element => {
    const [RENDER, setRENDER] = useState<number>(0)


    const bgHandler = (value: string): void => {
        setOptions(opt => ({
            ...opt,
            background: value
        }))

        if (value.length >= 7) {
            const blob = document.getElementById('blob-path')
            if (blob)
                blob.style.fill = value

            const title = document.getElementById('title-header')
            if (title)
                title.style.color = value
        }
    }

    useEffect(() => {
        dlBtn && plop()
    }, [dlBtn])

    useEffect(() => {
        let i = 0
        const inter = setInterval(() => {
            setRENDER(pre => {
                i = pre + 1
                return i
            })

            if (window.innerWidth > 1280) {
                const ele = Array.from(document.getElementById('container')?.children as HTMLCollectionOf<HTMLElement>)
                const angle = i - 4 >= 1 ? 1 : i - 4
                const margin = i < 5 ? i * 4 : 20 - (i * 4 - 20)
                if (ele[i - 1]) {
                    ele[i - 1].style.rotate = `${angle}deg`
                    ele[i - 1].style.translate = `${margin}px`
                }
            }

            if (i >= 7) {
                plop()
                clearInterval(inter)
                return
            }
        }, 150)
    }, [])

    const handleMutate = () => {
        smash()
        setTimeout(() => mutate(), 200);
    }

    return (
        <div id='container' className='options-panel'>
            {RENDER >= 1 && <Style setOptions={setOptions} />}
            {RENDER >= 2 && <Resolution options={options} setOptions={setOptions} />}
            {RENDER >= 3 && <Background options={options} setOptions={setOptions} bgHandler={bgHandler} GIF={GIF} />}
            {RENDER >= 4 && <Invert options={options} setOptions={setOptions} />}
            <FontSize options={options} setOptions={setOptions} GIF={GIF} />
            {RENDER >= 5 && <LimitSize options={options} setOptions={setOptions} />}
            {RENDER >= 6 && <DoublePass options={options} setOptions={setOptions} GIF={GIF} />}
            <Brigther options={options} setOptions={setOptions} />

            {RENDER >= 8 && <div className='buttons-container popIn'>
                <div className={'animate-mutate'}>
                    <button onClick={handleMutate}><RiTestTubeFill />{loading ? 'LOADING•••' : 'MUTATE'}</button>
                </div>
                <button onClick={softReset}><RiArrowGoBackFill /></button>
                {dlBtn && <div className='animate-save'>
                    <button onClick={download}><RiSaveFill />DOWNLOAD</button>
                </div>}
            </div>}
        </div>
    )
}

export default OptionsPanel