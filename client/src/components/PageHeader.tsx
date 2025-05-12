import tubImg from '../assets/requestTub.png'
import { Link } from 'react-router-dom'

export default function PageHeader() {
  return (
    <div className="page-header">
      <img src={tubImg} alt="tub"></img>
      <Link to="/"><h1>Request Tubs</h1></Link>
    </div>
  )
}