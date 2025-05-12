import tubsData from '../data/tubs.json'
import PageHeader from './PageHeader'
import { Link } from 'react-router-dom'


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
        <ul className="duck-list" id="baskets">
          {myTubs.map(tub => <li key={tub.encoded_id}><Link to={`/tubs/${tub.encoded_id}`}>{tub.encoded_id}</Link></li>)}
        </ul>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="homepage">
      <PageHeader />
      <MyTubs />
      <NewTub />
  </div>
  )
}