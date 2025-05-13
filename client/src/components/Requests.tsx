import requestsData from '../data/requests.json'
import PageHeader from './PageHeader'
import { useState } from 'react'
import copyImg from '../assets/copy.png'

export default function Requests({currentTub}) {
  const requests = requestsData.requests
  // const requests = tubService.getRequest().then(requests => requests)
  
  return (
    <>
      <PageHeader />
      <RequestHeader currentTub={currentTub}/>
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

function GreenCheckbox() {
  return (
    <div className="checkbox-container">
      <div className="checkbox-checkmark" />
    </div>
  )
}

function RequestHeader({currentTub}) {
  const [displayCheck, setDisplayCheck] = useState(false)
  const requestsLength = requestsData.requests.length
  const url = `${window.location.host}/recieve/${currentTub}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => setDisplayCheck(true))
  }

  return (
    <div>
      <h1>{`Tub: ${currentTub}`}</h1>
      <div>
        Requests are collected at 
        <span className="tub-url">{url}</span>{}
        <span className="url-plus-checkbox">
          <img src={copyImg} className='copy-image' onClick={handleCopy}></img>
          {displayCheck && <GreenCheckbox />}
        </span>
      </div>
      <span>Total Requests: {requestsLength}</span>
      <br></br>
      <br></br>
      <br></br>
    </div>
  )
}