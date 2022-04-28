import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraImages(props) {
    const {fetcher, token, limit, offset} = props;
  return useSWR(!fetcher ? null :`/api/cameras/storage/?key=getImages&token=${token}&limit=${limit}&offset=${offset}`, fetch)
}

