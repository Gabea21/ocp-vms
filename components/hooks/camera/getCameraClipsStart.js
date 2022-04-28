import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraClipsStart({token,limit}) {
  return useSWR(`/api/cameras/player/records?key=recordingStart&token=${token}&limit=${limit}`, fetch)
}

