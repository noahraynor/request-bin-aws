import PageHeader from './PageHeader'
import { useEffect, useState } from 'react'
import tubService from '../services/tubService'
import { useParams } from 'react-router-dom'
import copyImg from '../assets/copy.png'
import type { Request, RequestHeaderProps, RequestProps, ToggleInfoProps } from '../types'


export default function Requests() {
  const { encoded_id } = useParams<{ encoded_id: string}>()
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    if (!encoded_id) return

    tubService.getRequests(encoded_id)
    .then(requests => {
      const sorted = [...requests].sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      setRequests(sorted)
    })
    .catch(err => console.error('Failed to fetch requests:', err))
  }, [encoded_id])

  if (!encoded_id) return <p>Error: Missing Tub Id.</p>

  return (
    <>
      <PageHeader />
      <RequestHeader encoded_id={encoded_id} requestsLength={requests.length} />
      {requests.map(request => (
        <Request
          key={request.id}
          request={request}
          onDelete={(id) => setRequests(prev => prev.filter(r => r.id !== id))}
        />
      ))}
    </>
  )
}

function ToggleInfo({ title, children }: ToggleInfoProps) {
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

function Request({request, onDelete}: RequestProps) {
  const methodClass = `${request.method.toLowerCase()}`
  const date = new Date(request.timestamp).toLocaleDateString()
  const time = new Date(request.timestamp).toLocaleTimeString()

  const handleDelete = async () => {
    try {
      await tubService.deleteRequest(request.id)
      console.log('Request deleted')
      if (onDelete) onDelete(request.id)
    } catch (err) {
      console.error('Error deleting request:', err)
    }
  }

  return (
    <div className={"request"}>
      <div className={`method ${methodClass}`}>METHOD: {request.method}</div>
      <div>DATE: {date}</div>
      <div>TIME: {time}</div>
      <div>
        <ToggleInfo title="Headers">
          <pre>
            <code>{JSON.stringify(request.headers, null, 2)}</code>
          </pre>
        </ToggleInfo>
      </div>
      <div>
        <ToggleInfo title="Body">
          <pre>
            <code>{JSON.stringify(request.body, null, 2)}</code>
          </pre>
        </ToggleInfo>
      </div>
      <button className="delete-button" onClick={handleDelete}>
        Delete Request
      </button>
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

function RequestHeader({ encoded_id, requestsLength}: RequestHeaderProps) {
  const [displayCheck, setDisplayCheck] = useState(false)
  const url = `https://${window.location.host}/receive/${encoded_id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => setDisplayCheck(true))
    setTimeout(() => {
      setDisplayCheck(false)
    }, 2500)
  }

  return (
    <div>
      <h2>{`Current Tub: ${encoded_id}`}</h2>
      <div>
        Requests are collected at 
        <span className="tub-url">{url}</span>{}
        <span className="url-plus-checkbox">
        <span className="icon-wrapper">
          <img
            src={copyImg}
            className={`copy-image ${displayCheck ? 'hidden' : ''}`}
            onClick={handleCopy}
          />
          <div className={`green-check ${displayCheck ? '' : 'hidden'}`}>
            <GreenCheckbox />
          </div>
        </span>
      </span>

      </div>
      <span>Total Requests: {requestsLength}</span>
      <br></br>
      <br></br>
      <br></br>
    </div>
  )
}