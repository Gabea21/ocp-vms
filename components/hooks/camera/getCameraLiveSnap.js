import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraLiveSnap(props) {
    const { token } = props;
  return useSWR(`/api/cameras/live?key=imageSingle&token=${token}`, fetch)
}

