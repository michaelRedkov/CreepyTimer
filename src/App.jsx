import './App.css';
import {useState, useEffect, useMemo, useRef} from 'react'
import betrayalSound from './assets/Betrayal_.mp3';
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function App() {

    const [time, setTime] = useState(0)
    const [start, setStart] = useState(false)
    const [limit, setLimit] = useState(1)

    const audioRef = useRef(new Audio(betrayalSound));

    const toggle = () => {
        // ВАЖНО: Браузер разрешит звук, если вызвать .play() или .load()
        // внутри обработчика клика (onClick)
        audioRef.current.load();
        setStart(!start);
    };

    const setTheme = () => {
        document.body.classList.toggle('dark-theme')
    }

    const set = () => {
        setStart(!start)
    }

    const clear = () => {
        setTime((prev) => prev = 0)
        document.querySelector('.Time').classList.remove("over")
    }

    useEffect(() => {

        if(start) {
            const interval = setInterval(() => {
                setTime((prev) => {
                    if (limit > 0 && prev >= limit * 60) {
                        setStart(false)
                        return prev
                    }
                    return prev + 1
                })
            }, 1000)
            return () => clearInterval(interval)
        }

    }, [start , limit])

    useEffect(() => {
        if (limit > 0 && time >= limit * 60) {
            setStart(false);
            audioRef.current.play().catch(err => console.error("Ошибка:", err));
            document.querySelector('.Time').classList.toggle('over')
        }
    }, [time, limit]);

    return (
        <div className="app">
            <h1>Timer</h1>
            <h1 className={`Time`}
            >{formatTime(time)}
            </h1>
            <div className="timer-info">
                {start ?
                    <span className="status running">● Running</span>
                    : <span className="status stopped">● Stopped</span>
                }
            </div>

            <div className="menu">
                <button onClick={set}
                        className={start ? 'stop' : 'start'}
                >{start ? 'stop' : 'start'}
                </button>
                <button onClick={clear}
                        className="clear">Clear
                </button>
                <button onClick={setTheme}>
                    C
                </button>
            </div>
            <input type="number"
                   value={limit}
                   onChange={(e) => setLimit(Number(e.target.value))}
                   placeholder="minutes"
            />
        </div>
    );
}