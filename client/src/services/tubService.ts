import axios from 'axios'
import type { Tub, Request } from '../types'
const baseUrl = '/api/tubs'

const getAll = (): Promise<Tub[]> => {
  const request = axios.get<Tub[]>(baseUrl)
  return request.then(response => response.data)
}

const getRequests = (encoded_tubId: string): Promise<Request[]> => {
  const request = axios.get<Request[]>(`${baseUrl}/${encoded_tubId}/requests`)
  return request.then(response => response.data)
}

const createTub = () => {
<<<<<<< HEAD
  const request = axios.post('https://rbaskets.in/kz6cku7')
=======
  const request = axios.post(baseUrl)
>>>>>>> origin/main
  return request.then(response => response.data)
}

export default {
  getAll, getRequests, createTub
}