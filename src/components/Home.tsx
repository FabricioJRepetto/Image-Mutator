import { useNavigate } from 'react-router-dom'
import DragDrop from './DragDrop'
import { useRef } from 'react'
import { mainComps } from '../types'

const Home = ({ load }: mainComps): JSX.Element => {
    const navigate = useNavigate()
    const fileinput = useRef<HTMLInputElement | null>(null)

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

    return (
        <div>
            <p>
                Image Mutator transforms your images or Gifs to an stilyzed version. For now, you can choose between ascii or dots for the final effect.
            </p>
            <input type='file' ref={fileinput} accept="image/jpeg, image/png, image/webp, image/gif" multiple={false} onChange={(e) => loadfile(e.target.files)}></input>
            <br />
            <button onClick={() => navigate('/image')}>Image</button>
            <button onClick={() => navigate('/animation')}>Gif</button>
            <DragDrop input={fileinput.current} load={loadfile} />
        </div>
    )
}

export default Home