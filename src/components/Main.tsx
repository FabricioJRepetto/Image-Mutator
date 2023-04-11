import { Outlet, useNavigate } from 'react-router-dom'
import '../App.css'
import Blob from './Blob'

const Main = (): JSX.Element => {
    const navigate = useNavigate()

    return (
        <div className='main-container'>
            <header className='navbar'>
                <h1 onClick={() => navigate('/')}>Image mutator</h1>
                <div onClick={() => navigate('/image')}>Image</div>
                <div onClick={() => navigate('/animation')}>Animation</div>
            </header>

            <Blob />

            {<Outlet /> || null}
        </div >
    )
}

export default Main