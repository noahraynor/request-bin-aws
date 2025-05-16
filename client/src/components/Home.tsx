import PageHeader from './PageHeader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import tubService from '../services/tubService'
import Modal from './Modal'
import type { ButtonClickHandler, NewTubProps, Tub, MyTubsProps } from '../types'
import { sortTubs } from '../services/tubUtilities'
import trashBinIcon from '../assets/trashBin.png'

function NewTub({onClick}: NewTubProps) {
  return (
    <div className="newTub">
      <h2>Create New Tub</h2>
      <p>Create a new tub to collect and inspect HTTP requests</p>
        <button type="submit" onClick={(e) => onClick(e)}>Create Tub</button>
    </div>
  )
}

function MyTubs({tubs, newestFirst, onToggleSort, onDelete}: MyTubsProps) {
  return (
    <div className="myTubs">
      <div className="myTubs-header">
        <h2>My Tubs</h2>
        <div className="sort-container">
          <p className='sort-order' onClick={onToggleSort}>{newestFirst ? 'Newest First' : 'Oldest First'}</p>
        </div>
        
      </div>
      <div>
        <ul className="duck-list" id="baskets">
          {tubs.map((tub) => 
              <li key={tub.encoded_id} >
                <Link to={`/tubs/${tub.encoded_id}`}>{tub.encoded_id}</Link>
                <img src={trashBinIcon} className="trash-icon" onClick={() => onDelete(tub.encoded_id)}/>
              </li>)}
              
        </ul>
      </div>
    </div>
  )
}

export default function Home() {
  const [tubs, setTubs] = useState<Tub[]>([])
  const [displayModal, setDisplayModal] = useState(false)
  const [newTubId, setNewTubId] = useState(null)
  const [newestFirst, setNewestFirst] = useState(true)

  useEffect(() => {
    tubService
      .getAll()
      .then(tubsData => {
        setTubs(sortTubs(tubsData, newestFirst))
      })
  }, [newestFirst])

  const handleClick: ButtonClickHandler = (e) => {
    e.preventDefault()
    tubService.createTub().then(tub => {
      setTubs(sortTubs(tubs.concat(tub), newestFirst))
      setNewTubId(tub.encoded_id)
      setDisplayModal(true)
    })
  }

  const handleClose = () => {
    setDisplayModal(false)
  }

  const handleSortToggle = () => {
    setNewestFirst(!newestFirst)
    const newNewestFirst = !newestFirst
    setTubs(sortTubs(tubs, newNewestFirst))
  }

  const handleDelete = (tubId: string) => {
    tubService
      .deleteTub(tubId)
      .then(() => {
        setTubs(prev => prev.filter(tub => tub.encoded_id !== tubId))
      })
  }

  return (
    <>
      <PageHeader />
      <div className="homepage">
        <MyTubs tubs={tubs} newestFirst={newestFirst} onToggleSort={handleSortToggle} onDelete={handleDelete}/>
        <NewTub onClick={handleClick} />
      </div>
      {displayModal && newTubId && <Modal onClose={handleClose} newTubId={newTubId}/>}
    </>

  )
}