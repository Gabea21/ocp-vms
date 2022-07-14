import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraWatchUrl(token) {
  return useSWR(!token ? null :`/api/cameras/live/?key=watch&token=${token}`, fetch)
}

