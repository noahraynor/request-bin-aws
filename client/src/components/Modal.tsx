import { useState } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { ModalProps } from '../types'
import GreenCheckbox from './GreenCheckbox'
import copyImg from '../assets/copy.png'


export default function Modal({ onClose, newTubId }: ModalProps) {
  const navigate = useNavigate()
  const [displayCheck, setDisplayCheck] = useState(false)
  const url = `https://${window.location.host}/receive/${newTubId}`

  const handleOpenTub = () => {
    navigate(`/tubs/${newTubId}`)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => setDisplayCheck(true))
    setTimeout(() => {
      setDisplayCheck(false)
    }, 2500)
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>New Tub Created!</h2>
        <h3>New Tub: {newTubId}</h3>
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
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
          <button onClick={handleOpenTub}>Open Tub</button>
        </div>
      </div>
    </div>,
    document.body
  )
}