import { useState } from 'react'
import './App.css'
import tubsData from './data/tubs.json'

function NewTub() {
  return (
    <div>
      <h1>New Tubs</h1>
      <p>Create a new tub to collect and inspect HTTP requests</p>
      <form>
        <div>
          <label><span>https://rbaskets.in/</span></label>
          <input type="text" placeholder="type a name"/>
        </div>
        <button type="submit">Create</button>
      </form>
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
