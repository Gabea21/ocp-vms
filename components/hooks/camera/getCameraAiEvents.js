import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraAiEvents(props) {
  const { fetcher ,token, event, limit } = props;
  return useSWR(!fetcher ? null : `/api/cameras/ai/filter?token=${token}&event=${event}&limit=${limit}`, fetch)
}

