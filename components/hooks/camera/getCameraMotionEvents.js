import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraMotionEvents({fetcher, token }) {
  return useSWR(!fetcher? null :`/api/cameras/ai/filter?token=${token}&event=motion`, fetch)
}

