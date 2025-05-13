import ReactDOM from 'react-dom'

export default function Modal({onClose}) {
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content">
        <h2>New Tub Created!</h2>
        <div>
          <button onClick={onClose}>Close</button>
          <button>Open Tub</button>
        </div>
      </div>
    </div>,
    document.body
  )
}