import useSWR from 'swr'

import fetch from '../fetch'

export default function getAllCamerasLocation(props) {
    const { location } = props;
  return useSWR(`/api/cameras/?key=location&location=${location.name}`, fetch)
}

