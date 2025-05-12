import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Requests from './components/Requests'
import './App.css'
import tubService from './services/tubService'

function App() {
  const [tubs, setTubs] = useState([])

  useEffect(() => {
    tubService
      .getAll()
      .then(tubsData => {
        console.log(`React tubs: ${JSON.stringify(tubsData, null, 2)}`)
      })
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/tubs/:encoded_id" element={<Requests />}/>
      </Routes>
    </Router>
  )
}

export default App
