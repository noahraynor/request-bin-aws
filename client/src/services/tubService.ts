import axios from 'axios'
import type { Tub, TubWithRequests } from '../types'
const baseUrl = '/api/tubs'

const getAll = (): Promise<Tub[]> => {
  const request = axios.get<Tub[]>(baseUrl)
  return request.then(response => response.data)
}

// [AH]: This is not entirely setup... This needs more work
const getTubWithRequests = (tubId: String): Promise<TubWithRequests> => {
  const request = axios.get<TubWithRequests>(baseUrl)
  return request.then(response => response.data)
}

const createTub = () => {
  
}

export default {
  getAll
}