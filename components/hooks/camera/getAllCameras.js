import useSWR from 'swr'

import fetch from '../fetch'

export default function getAllCameras() {
  return useSWR('/api/cameras/?key=all', fetch)
}

