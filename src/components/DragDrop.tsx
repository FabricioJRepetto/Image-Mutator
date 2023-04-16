import React, { useState } from 'react'
import { RiUpload2Fill } from 'react-icons/ri';

interface dragdrop {
    input: HTMLInputElement | null,
    load: (files: FileList | null) => void
}

const DragDrop = ({ input, load }: dragdrop): JSX.Element => {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('')

    // handle drags to change background
    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/webp' &&
                file.type !== 'image/gif') {
                setError(`Eww... I don't like this file`)
                setTimeout(() => {
                    setError(() => '')
                }, 2000);
            } else {
                load(e.dataTransfer.files);
            }
        }
    }

    const handleButton = (): void => {
        input && input.click()
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className={`droparea ${dragActive ? 'draging' : ''} ${error ? 'drag-error' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={dropHandler}>
                {dragActive
                    ? <p className='dropit'>Drop it!</p>
                    : error
                        ? <p>{error}</p>
                        : <>
                            <p>Drag & Drop<br />
                                or
                            </p>
                            <button onClick={handleButton} style={{ fontSize: '1.1rem' }}><RiUpload2Fill /> upload a file</button>
                        </>}
            </div>
        </form>
    )
}

export default DragDrop