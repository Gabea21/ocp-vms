
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import CamLiveControls from './components/CamLiveControls';
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
 

   
    const { data: camWatchUrls, error: camWatchUrlsError} = getCameraWatchUrl(camera.vxg?.allToken);
    useEffect(() => { // Load HLS URL
      if(showHls){
            setAllValues( prevValues => {
                return { ...prevValues,url: camWatchUrls?.watch?.hls}
            })
        }
    }, [showHls, camWatchUrls])

    
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
    
     
      
      function IsFullScreen() {
        return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
      }
      const handleClickFullscreen = () => {
        if(IsFullScreen() === false){
          findDOMNode(playerRef.current).requestFullscreen().catch(
            (err) => 
            {alert("Could not activate full-screen mode ")}
          )
          setIsFullScreen(true)
        }else{
          // console.log(IsFullScreen())
          document?.exitFullscreen()
          setIsFullScreen(false)
        }
      }
       
    return (
        <div
        ref={playerRef}
          // onMouseEnter={handleToggleControls}
          //  onMouseLeave={handleToggleControls}
            className={isFullScreen ? 'w-full relative bg-black' : 'w-full relative  sm:px-12 lg:px-16 xl:px-20 bg-black'}>

          {!showHls &&  <CamWebRTC camera={camera} isFullScreen={isFullScreen} />  }    
            
            {showHls && <CamHLS allValues={allValues} /> }

            {!allValues.controls && <div className={"absolute top-0 left-0 right-0 bottom-0  flex flex-col justify-between z-10"}>
                <CamLiveControls  
                allValues={allValues} 
                camera={camera}
                handleClickFullscreen={handleClickFullscreen}
                handlePlayPause={handlePlayPause}
                handleToggleMuted={handleToggleMuted}
                setShowHls={setShowHls}
                showHls={showHls}
            
                />
            </div>
            }
                  
        </div>
    )
}
