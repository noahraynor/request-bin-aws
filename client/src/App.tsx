import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Requests from './components/Requests'
import './App.css'

function App() {
  const [currentTub, setCurrentTub] = useState(null)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setCurrentTub={setCurrentTub}/>}/>
        <Route path="/tubs/:encoded_id" element={<Requests currentTub={currentTub}/>}/>
      </Routes>
    </Router>
  )
}

export default App
