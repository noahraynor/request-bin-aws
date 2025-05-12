import { useState } from 'react'
import './App.css'
import tubsData from './data/tubs.json'
import requestsData from './data/requests.json'

const showHomepage = true

function NewTub() {
  return (
    <div>
      <h1>New Tubs</h1>
      <p>Create a new tub to collect and inspect HTTP requests</p>
        <button type="submit">Create Tub</button>
    </div>
  )
}

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
  const methodClass = `method-${request.method.toLowerCase()}`

  return (
    <div>
        <div className={`request ${methodClass}`}>METHOD: {request.method}</div>
        <div>TIME: {request.time}</div>
        <div>DATE: {request.date}</div>
        <div>
          <ToggleInfo title="Headers">
            <p>{JSON.stringify(request.headers)}</p>
          </ToggleInfo>
        </div>
        <div>
          <ToggleInfo title="Body">
            <p>{JSON.stringify(request.body)}</p>
          </ToggleInfo>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
    </div>
  )
}

function ToggleInfo({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="toggle-container">
      <button onClick={() => setIsOpen(!isOpen)} className="toggle-button">
        {isOpen ? '▼' : '▶'} {title}
      </button>
      {isOpen && <div className="toggle-content">{children}</div>}
    </div>
  );
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
