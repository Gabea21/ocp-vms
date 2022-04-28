import useSWR from 'swr'

import fetch from '../fetch'

export default function getCamera(id) {
  return useSWR('/api/cameras/' + id, fetch)
}

