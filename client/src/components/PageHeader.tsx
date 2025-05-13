import tubImg from '../assets/requestTub.png'
import { Link } from 'react-router-dom'

export default function PageHeader() {
  return (
    <Link to="/">
      <div className="page-header">
        <img src={tubImg} alt="tub"></img>
        <h1>Request Tubs</h1>
      </div>
    </Link>
  )
}