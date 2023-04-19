import Image from './components/Image';
import Animation from './components/Animation';
import { useEffect, useRef, useState } from 'react';
import Blob from './components/Blob';
import DragDrop from './components/DragDrop';
import { finalSteps } from "./mutator/utils";
import { boing } from './utils/Sound';
import { RiCloseCircleFill, RiDropFill, RiBlurOffLine } from 'react-icons/ri';
import './App.css'

function App() {
    const [file, setFile] = useState<File | null>(null)
    const [mode, setMode] = useState<string | null>(null)

    const [ogpreview, setOgpreview] = useState<string | null>(null)
    const [finalpreview, setFinalpreview] = useState<string | null>(null)
    const [inputArea, setInputArea] = useState<boolean>(false)
    const [transparent, setTransparent] = useState<boolean>(false)

    const dlbutton = useRef<HTMLAnchorElement | null>(null)
    const fileinput = useRef<HTMLInputElement | null>(null)

    const loadfile = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            const preview = URL.createObjectURL(file)
            preview && setOgpreview(() => preview)
            boing()

            setTimeout(() => {
                setFile(file)

                if (file.type === 'image/gif') {
                    setMode(() => 'animation')
                } else if (file.type === 'image/jpeg' ||
                    file.type === 'image/png' ||
                    file.type === 'image/webp') {
                    setMode(() => 'image')
                }
            }, 500);
        }
    }

    useEffect(() => {
        if (fileinput.current) setInputArea(true)
    }, [fileinput.current])

    const previewHandler = (buffer: Blob | null) => {
        if (dlbutton.current) {
            if (buffer) {
                const type = mode === 'image' ? 'image/png' : 'imate/gif'
                const preview = finalSteps(buffer, 'mutated_' + file?.name, { type }, dlbutton.current)

                setFinalpreview(preview)
            } else {
                setFinalpreview(null)
            }
        }
    }

    const reset = (): void => {
        setMode(() => null)
        setFile(() => null)
        setOgpreview(() => null)
        setFinalpreview(() => null)
        if (fileinput.current) fileinput.current.value = ''
    }

    return (
        <div className="App">
            <section className='main-container'>
                <header className='navbar'>
                    <h1 id='title-header'>Image Mutator </h1>
                </header>

                <Blob />

                <input type='file' ref={fileinput} accept="image/jpeg, image/png, image/webp, image/gif" multiple={false} onChange={(e) => loadfile(e.target.files)}></input>

                {!ogpreview && inputArea &&
                    <DragDrop input={fileinput.current} load={loadfile} />}

                <div className='main-img-container'>
                    {(ogpreview && !finalpreview) &&
                        <img className={`og-preview ${transparent ? 'og-preview-transp' : ''}`} src={ogpreview} />}

                    {finalpreview &&
                        <img className={`og-preview ${transparent ? 'og-preview-transp' : ''}`} src={finalpreview} />}

                    {mode === 'image' && (ogpreview || finalpreview) && <button onClick={() => setTransparent(t => !t)}>{transparent ? <RiBlurOffLine /> : <RiDropFill />}</button>}
                    {(ogpreview || finalpreview) && <button onClick={reset}><RiCloseCircleFill /></button>}
                </div>

                <a ref={dlbutton} href='' id='download-anchor' style={{ display: 'none' }}>download</a>

            </section>


            <section className={`controllers-container ${mode ? 'controllers-open' : ''}`}>
                {mode
                    ? mode === 'image'
                        ? <Image file={file} setPreview={previewHandler} parrentReset={reset} />
                        : <Animation file={file} setPreview={previewHandler} parrentReset={reset} />
                    : null}
            </section>
        </div>
    )
}

export default App
