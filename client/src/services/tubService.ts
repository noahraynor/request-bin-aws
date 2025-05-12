import axios from 'axios'
import type { Tub } from '../types'
const baseUrl = '/api/tubs'

const getAll = (): Promise<Tub[]> => {
  const request = axios.get<Tub[]>(baseUrl)
  return request.then(response => response.data)
}


export default {
  getAll
}