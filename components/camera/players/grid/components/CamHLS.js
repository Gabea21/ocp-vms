import React from 'react'
import ReactPlayer from 'react-player'

export default function CamHLS(props) {
    const { allValues } = props;
  return (
    <ReactPlayer  width={allValues.width} height={allValues.height}
                // ref={ (video) => videoRef.current = video}
                playsinline={true}
                playing={allValues.playing}  
                // url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr} 
                url={allValues.url} 
                pip={allValues.pip}
                // onBuffer={() => set}
                // controls={allValues.controls}
                controls={false}/>
  )
}
