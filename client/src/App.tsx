import { useState } from 'react'
import './App.css'
import tubsData from './data/tubs.json'

function NewTub() {
  return (
    <div>
      <h1>New Tubs</h1>
      <p>Create a new tub to collect and inspect HTTP requests</p>
        <button type="submit">Create Tub</button>
    </div>
  )
}

// my tubs component
function MyTubs() {
  const myTubs = tubsData.tubs
  return (
    <div>
      <div>My Tubs:</div>
      <div>
        <ul id="baskets">
          {myTubs.map(tub => <li key={tub.encodedUrl}>{tub.encodedUrl}</li>)}
        </ul>
      </div>
    </div>
  )
}


function App() {
  return (
    <>
      <NewTub />
      <MyTubs />
    </>
  )
}

export default App
