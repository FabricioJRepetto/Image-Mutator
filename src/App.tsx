import { Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Image from './components/Image';
import Animation from './components/Animation';
import Home from './components/Home';
import './App.css'

function App() {

    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Main />}>
                    <Route index element={<Home />} />
                    <Route path="image" element={<Image />} />
                    <Route path="animation" element={<Animation />} />
                </Route>

            </Routes>
        </div>
    )
}

export default App
