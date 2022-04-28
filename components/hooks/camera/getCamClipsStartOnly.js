import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraClipsStartOnly({fetchGrant,token,limit, start}) {
  return useSWR( !fetchGrant ? null : `/api/cameras/player/records?token=${token}&limit=${limit}&start=${start}`, fetch)
}

