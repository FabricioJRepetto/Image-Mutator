import sfx_smash from '../assets/smash-1.mp3'
import sfx_boing from '../assets/boing-1.mp3'
import sfx_1 from '../assets/plop-1.mp3'
import sfx_2 from '../assets/plop-2.mp3'
import sfx_3 from '../assets/plop-3.mp3'

const audios = [
    sfx_1,
    sfx_2,
    sfx_3
]

const random = () => {
    const max = audios.length
    const num = Math.floor(Math.random() * max)
    return num
}

export const plop = () => {
    const rando = random()
    const audio = new Audio(audios[rando])
    audio.volume = .25;

    setTimeout(() => audio.play(), 50);
}
export const smash = () => {
    const audio = new Audio(sfx_smash)
    audio.play()
}
export const boing = () => {
    const audio = new Audio(sfx_boing)
    audio.volume = .25;
    audio.play()
}
