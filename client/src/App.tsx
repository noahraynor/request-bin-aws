import { useState } from 'react'
import tubImage from './assets/tub.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.youtube.com/watch?v=kvxCU_lQwKM" target="_blank">
        <img src={tubImage} alt="Funny bathtub" style={{ width: '400px', height: 'auto' }} />
        </a>
      </div>
      <h1>Team Tub</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          tub count is {count}
        </button>
      </div>
    </>
  )
}

export default App
