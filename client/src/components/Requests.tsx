import requestsData from '../data/requests.json'
import PageHeader from './PageHeader'
import { useState } from 'react'
import tubService from '../services/tubService'
import { useParams } from 'react-router-dom'
import copyImg from '../assets/copy.png'


export default function Requests() {
  const { encoded_id } = useParams()
  const requests = tubService.getRequests(encoded_id).then(requests => requests)

  return (
    <>
      <PageHeader />
      <RequestHeader encoded_id={encoded_id} />
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

function RequestHeader({encoded_id}) {
  const [displayCheck, setDisplayCheck] = useState(false)
  const requestsLength = requestsData.requests.length
  const url = `${window.location.host}/recieve/${encoded_id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => setDisplayCheck(true))
  }

  return (
    <div>
      <h2>{`Current Tub: ${encoded_id}`}</h2>
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