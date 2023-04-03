import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div>
            <p>
                Image Mutator transforms your images or Gifs to an stilyzed version. For now, you can choose between ascii or dots for the final effect.
            </p>
            <br />
            <button onClick={() => navigate('/image')}>Image</button>
            <button onClick={() => navigate('/animation')}>Gif</button>
        </div>
    )
}

export default Home