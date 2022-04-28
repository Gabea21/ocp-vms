import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraCalender(token) {
  return useSWR(`/api/cameras/storage?token=${token}&key=calender`, fetch)
}

