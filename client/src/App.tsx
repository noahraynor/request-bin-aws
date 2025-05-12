import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import tubImg from './assets/requestTub.png'
import tubsData from './data/tubs.json'
import requestsData from './data/requests.json'

// const showHomepage = false

function PageHeader() {
  return (
    <div className="page-header">
      <img src={tubImg} alt="tub"></img>
      <Link to="/"><h1>Request Tubs</h1></Link>
    </div>
  )
}

function NewTub() {
  return (
    <div className="newTub">
      <h2>New Tub</h2>
      <p>Create a new tub to collect and inspect HTTP requests</p>
        <button type="submit">Create Tub</button>
    </div>
  )
}

function MyTubs() {
  const myTubs = tubsData.tubs
  return (
    <div className="myTubs">
      <h2>My Tubs</h2>
      <div>
        <ul class="duck-list" id="baskets">
          {myTubs.map(tub => <li key={tub.encoded_id}><Link to={`/tubs/${tub.encoded_id}`}>{tub.encoded_id}</Link></li>)}
        </ul>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="homepage">
      <PageHeader />
      <MyTubs />
      <NewTub />
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
  const methodClass = `${request.method.toLowerCase()}`

  return (
    <div className={"request"}>
      <div className={`method ${methodClass}`}>METHOD: {request.method}</div>
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
    </div>
  )
}

function Requests() {
  const requests = requestsData.requests
  return (
    <>
      <PageHeader />
      <RequestHeader />
      {requests.map(request => <Request key={request.request_id} request={request}/>)}
    </>
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/tubs/:encoded_id" element={<Requests />}/>
      </Routes>
    </Router>
  )
}

export default App
