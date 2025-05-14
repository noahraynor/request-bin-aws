import PageHeader from './PageHeader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import tubService from '../services/tubService'
import Modal from './Modal'
import type { ButtonClickHandler, NewTubProps, Tub, MyTubsProps } from '../types'

function NewTub({onClick}: NewTubProps) {
  return (
    <div className="newTub">
      <h2>Create New Tub</h2>
      <p>Create a new tub to collect and inspect HTTP requests</p>
        <button type="submit" onClick={(e) => onClick(e)}>Create Tub</button>
    </div>
  )
}

function MyTubs({tubs}: MyTubsProps) {
  return (
    <div className="myTubs">
      <h2>My Tubs</h2>
      <div>
        <ul className="duck-list" id="baskets">
          {tubs.map(tub => <li key={tub.encoded_id} ><Link to={`/tubs/${tub.encoded_id}`}>{tub.encoded_id}</Link></li>)}
        </ul>
      </div>
    </div>
  )
}

export default function Home() {
  const [tubs, setTubs] = useState<Tub[]>([])
  const [displayModal, setDisplayModal] = useState(false)
  const [newTubId, setNewTubId] = useState(null)

  useEffect(() => {
    tubService
      .getAll()
      .then(tubsData => {
        setTubs(tubsData)
      })
  }, [])

  const handleClick: ButtonClickHandler = (e) => {
    e.preventDefault()
    tubService.createTub().then(tub => {
      setTubs(tubs.concat(tub))
      setNewTubId(tub.encoded_id)
      setDisplayModal(true)
    })
  }

  const handleClose = () => {
    setDisplayModal(false)
  }


  return (
    <>
      <PageHeader />
      <div className="homepage">
        <MyTubs tubs={tubs}/>
        <NewTub onClick={handleClick}/>
      </div>
      {displayModal && <Modal onClose={handleClose} newTubId={newTubId}/>}
    </>

  )
}