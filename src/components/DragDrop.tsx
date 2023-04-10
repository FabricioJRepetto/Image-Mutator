import React, { useState } from 'react'

interface dragdrop {
    input: HTMLInputElement | null,
    load: (files: FileList | null) => void
}

const DragDrop = ({ input, load }: dragdrop): JSX.Element => {
    const [dragActive, setDragActive] = useState(false);

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
            load(e.dataTransfer.files);
        }
    }

    const handleButton = (): void => {
        input && input.click()
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className={`droparea ${dragActive ? 'draging' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={dropHandler}>
                <p>Drag & Drop<br />
                    or
                </p>
                <button onClick={handleButton}>upload a file</button>
            </div>
        </form>
    )
}

export default DragDrop