import requestsData from '../data/requests.json'
import PageHeader from './PageHeader'
import { useState } from 'react'

export default function Requests() {
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