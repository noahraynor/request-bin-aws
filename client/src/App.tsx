import { useState } from 'react'
import './App.css'
import tubsData from './data/tubs.json'
import requestsData from './data/requests.json'

const showHomepage = false

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

function RequestHeader() {
  const encoded_id = requestsData.encoded_id
  const requestsLength = requestsData.requests.length
  return (
    <div>
      <h1>{`Tub: ${encoded_id}`}</h1>
      <p>Requests are collected at https://host/{encoded_id}</p>
      <span>Requests Number: {requestsLength}</span>
      <br></br>
      <br></br>
      <br></br>
    </div>
  )
}

function Request({request}) {

    return (
        <div>
            <p>METHOD: {request.method}</p>
            <p>TIME: {request.time}</p>
            <p>DATE: {request.date}</p>
            <p>HEADERS</p>
            <p>{JSON.stringify(request.headers)}</p>
            <p>BODY</p>
            <p>{JSON.stringify(request.body)}</p>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </div>
        
    )
}

function App() {
  const requests = requestsData.requests

  return (
    <>
      {showHomepage && <NewTub />}
      {showHomepage && <MyTubs />}
      {!showHomepage && <RequestHeader />}
      {!showHomepage && requests.map(request => <Request key={request.request_id} request={request}/>)}
    </>
  )
}

export default App
