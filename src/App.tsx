import Image from './components/Image';
import Animation from './components/Animation';
import { useEffect, useRef, useState } from 'react';
import Blob from './components/Blob';
import DragDrop from './components/DragDrop';
import { finalSteps } from "./mutator/utils";
import './App.css'

interface pvstyle {
    width: string,
    height: string
}

function App() {
    const [file, setFile] = useState<File | null>(null)
    const [mode, setMode] = useState<string | null>(null)

    const [ogpreview, setOgpreview] = useState<string | null>(null)
    const [previewStyle, setPreviewStyle] = useState<pvstyle | null>(null)
    const [finalpreview, setFinalpreview] = useState<string | null>(null)
    const [inputArea, setInputArea] = useState<boolean>(false)

    const dlbutton = useRef<HTMLAnchorElement | null>(null)
    const fileinput = useRef<HTMLInputElement | null>(null)

    const loadfile = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            const preview = URL.createObjectURL(file)
            preview && setOgpreview(() => preview)

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

    const previewHandler = (buffer: Blob) => {
        if (dlbutton.current) {
            const type = mode === 'image' ? 'image/png' : 'imate/gif'
            const preview = finalSteps(buffer, 'mutated_' + file?.name, { type }, dlbutton.current)

            setFinalpreview(preview)
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

                {(ogpreview && !finalpreview) &&
                    <img className={`og-preview`} style={previewStyle ? previewStyle : {}} src={ogpreview} />}

                {finalpreview && <>
                    <img className={`og-preview`} src={finalpreview} />
                </>}
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
