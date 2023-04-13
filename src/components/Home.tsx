import { useNavigate } from 'react-router-dom'
import DragDrop from './DragDrop'
import { useEffect, useRef, useState } from 'react'
import { mainComps } from '../types'

const Home = ({ load }: mainComps): JSX.Element => {
    const navigate = useNavigate()
    const fileinput = useRef<HTMLInputElement | null>(null)
    const [inputArea, setInputArea] = useState<boolean>(false)

    const loadfile = (files: FileList | null): void => {
        if (files && files[0]) {
            load(files)
            const file = files[0]

            if (file.type === 'image/gif') {
                navigate('/animation')
            } else if (file.type === 'image/jpeg' ||
                file.type === 'image/png' ||
                file.type === 'image/webp') {
                navigate('/image')
            }
        }
    }

    useEffect(() => {
        if (fileinput.current) setInputArea(true)
    }, [fileinput.current])

    return (
        <div>
            <input type='file' ref={fileinput} accept="image/jpeg, image/png, image/webp, image/gif" multiple={false} onChange={(e) => loadfile(e.target.files)}></input>
            {/* <button onClick={() => navigate('/image')}>Image</button>
            <button onClick={() => navigate('/animation')}>Gif</button> */}
            {inputArea && <DragDrop input={fileinput.current} load={loadfile} />}
        </div>
    )
}

export default Home