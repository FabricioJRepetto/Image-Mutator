import Image from './components/Image';
import Animation from './components/Animation';
import { useEffect, useRef, useState } from 'react';
import Blob from './components/Blob';
import DragDrop from './components/DragDrop';
import { finalSteps } from "./mutator/utils";
import './App.css'

function App() {
    const [file, setFile] = useState<File | null>(null)

    // _____________________________________ //

    const [mode, setMode] = useState<string | null>(null)

    const [ogpreview, setOgpreview] = useState<string | null>(null)
    const [finalpreview, setFinalpreview] = useState<string | null>(null)
    const dlbutton = useRef<HTMLAnchorElement | null>(null)

    const fileinput = useRef<HTMLInputElement | null>(null)
    const [inputArea, setInputArea] = useState<boolean>(false)

    const loadfile = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            setFile(file)

            const preview = URL.createObjectURL(file)
            preview && setOgpreview(() => preview)

            if (file.type === 'image/gif') {
                setMode(() => 'animation')
            } else if (file.type === 'image/jpeg' ||
                file.type === 'image/png' ||
                file.type === 'image/webp') {
                setMode(() => 'image')
            }
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
    }

    return (
        <div className="App">
            <section className='main-container'>
                <header className='navbar'>
                    <h1>ImageMutator</h1>
                </header>

                <Blob />

                {!ogpreview &&
                    <div>
                        <input type='file' ref={fileinput} accept="image/jpeg, image/png, image/webp, image/gif" multiple={false} onChange={(e) => loadfile(e.target.files)}></input>
                        {inputArea && <DragDrop input={fileinput.current} load={loadfile} />}
                    </div>}

                {(ogpreview && !finalpreview) &&
                    <img className={`og-preview`} src={ogpreview} />}

                {finalpreview && <>
                    <img className={`og-preview`} src={finalpreview} />
                </>}
                <a ref={dlbutton} href='' style={finalpreview ? {} : { display: 'none' }}>download</a>

            </section>

            {mode &&
                <section>
                    {mode === 'image'
                        ? <Image load={setFile} file={file} setPreview={previewHandler} parrentReset={reset} />
                        : <Animation load={setFile} file={file} />}
                </section>}
        </div>
    )
}

export default App
