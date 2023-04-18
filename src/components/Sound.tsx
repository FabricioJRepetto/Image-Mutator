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

export const play = () => {
    const rando = random()
    const audio = new Audio(audios[rando])
    audio.volume = .25;

    setTimeout(() => audio.play(), 100);
}