import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'

export default function Modal({ onClose, newTubId }) {
  const navigate = useNavigate()

  const handleOpenTub = () => {
    navigate(`/tubs/${newTubId}`)
  }
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>New Tub Created!</h2>
        <h3>New Tub Id: {newTubId}</h3>
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
          <button onClick={handleOpenTub}>Open Tub</button>
        </div>
      </div>
    </div>,
    document.body
  )
}