import { Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Image from './components/Image';
import Animation from './components/Animation';
import Home from './components/Home';
import './App.css'
import { useState } from 'react';

function App() {
    const [file, setFile] = useState<FileList | null>(null)

    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Main />}>
                    <Route index element={<Home load={setFile} />} />
                    <Route path="image" element={<Image file={file} load={setFile} />} />
                    <Route path="animation" element={<Animation file={file} load={setFile} />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
