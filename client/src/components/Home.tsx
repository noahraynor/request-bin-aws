import PageHeader from './PageHeader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import tubService from '../services/tubService'

function NewTub({onClick}) {
  return (
    <div className="newTub">
      <h2>New Tub</h2>
      <p>Create a new tub to collect and inspect HTTP requests</p>
        <button type="submit" onClick={(e) => onClick(e)}>Create Tub</button>
    </div>
  )
}

function MyTubs({setCurrentTub, tubs}) {

  return (
    <div className="myTubs">
      <h2>My Tubs</h2>
      <div>
        <ul className="duck-list" id="baskets">
          {tubs.map(tub => <li key={tub.encoded_id} onClick={() => setCurrentTub(tub.encoded_id)}><Link to={`/tubs/${tub.encoded_id}`}>{tub.encoded_id}</Link></li>)}
        </ul>
      </div>
    </div>
  )
}

export default function Home({setCurrentTub}) {
  const [tubs, setTubs] = useState([])

  function handleClick(e) {
    e.preventDefault()
    tubService.createTub()
    console.log('CREATED A TUB')
    // tubService.createTub().then(tub => setTubs(tubs.concat(tub)))
  }

  useEffect(() => {
    tubService
      .getAll()
      .then(tubsData => {
        setTubs(tubsData)
      })
  }, [])


  return (
    <>
      <PageHeader />
      <div className="homepage">
        <MyTubs setCurrentTub={setCurrentTub} tubs={tubs}/>
        <NewTub onClick={handleClick}/>
      </div>
    </>

  )
}