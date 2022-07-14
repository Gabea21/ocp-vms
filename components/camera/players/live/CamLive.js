
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import CamWebRTC from './components/CamWebRTC';
import CamHLS from './components/CamHLS';
import getCameraWatchUrl from '../../../hooks/camera/getCameraWatchUrl';
import { findDOMNode } from 'react-dom'


export default function CamLive(props) {
    const {index, camera, maxHeight} = props;
    const playerRef = useRef();
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [showHls, setShowHls] = useState(false);
    const [allValues, setAllValues] = useState({   //Vod Player Config
        width: '100%',
        height: '100%',
        pip: true,
        controls: false,
        volume: 0.8,
        muted: true,
        playing: true,
        playbackRate: 1.0,
      });
 

    const { data: camWatchUrls, error: camWatchUrlsError} = getCameraWatchUrl(camera.vxg.allToken);
    useEffect(() => { // Load HLS URL
      if(showHls && camWatchUrls){
            setAllValues( prevValues => {
                return { ...prevValues,url: camWatchUrls?.watch?.hls}
            })
        }
    }, [showHls,camWatchUrls])

    
    const handlePlayPause = () => { // Play Pause Toggle
        setAllValues( prevValues => {
          return { ...prevValues, playing: !allValues.playing}
          })
      }
      const handleToggleMuted = () => {
        setAllValues( prevValues => {
          return { ...prevValues, muted: !allValues.muted}
        })
      }

  return (
        <div
        ref={playerRef}
          // onMouseEnter={handleToggleControls}
          //  onMouseLeave={handleToggleControls}
          className={
            'w-full relative bg-black min-h-[211px] aspect-[16/9]	'
           }>

          {!showHls && 
           <CamWebRTC 
            camera={camera} 
            showHls={showHls} 
            setShowHls={setShowHls} 
             />  }    
            
            {showHls && 
             <CamHLS
             allValues={allValues}
             setAllValues={setAllValues}
             showHls={showHls}
             setShowHls={setShowHls}
             isFullScreen={isFullScreen}
             setIsFullScreen={setIsFullScreen}
          /> }

           
        </div>
    )
}