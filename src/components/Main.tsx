import { Outlet, useNavigate } from 'react-router-dom'
import '../App.css'

const Main = (): JSX.Element => {
    const navigate = useNavigate()

    return (
        <div>
            <header className='navbar'>
                <h1 onClick={() => navigate('/')}>Image mutator</h1>
                <div onClick={() => navigate('/image')}>Image</div>
                <div onClick={() => navigate('/animation')}>Animation</div>
            </header>

            <section className='color-palette'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </section>

            {<Outlet /> || null}
        </div>
    )
}

export default Main