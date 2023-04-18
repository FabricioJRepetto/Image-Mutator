import { useState } from 'react'
import { RiEye2Line, RiEyeCloseLine } from 'react-icons/ri';

interface asd {
    id: string,
    def: boolean,
    disabled: boolean,
    cb: () => void
}

const Checkbox = ({ def, disabled, cb, id }: asd): JSX.Element => {
    const [state, setState] = useState(def)

    const clickHandler = (): void => {
        if (!disabled) {
            cb()
            setState(curr => !curr)
        }
    }

    return (
        <div id={id} className={`checkbox-eye ${disabled ? 'disabled-eye' : ''}`} onClick={clickHandler}>{state ? <RiEye2Line /> : <RiEyeCloseLine />}</div>
    )
}

export default Checkbox