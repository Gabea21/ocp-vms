import React, { useCallback, useEffect, useRef, useState } from 'react'
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player'
import CamHLSControls from './CamHLSControls';

export default function CamHLS(props) {
  const { allValues, setAllValues, showHls, setShowHls, isFullScreen, setIsFullScreen } = props
  const [isReady, setIsReady] = useState(false);
 const videoRef = useRef()


 function IsFullScreen() {
  return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
  );
}

const handleClickFullscreen = () => {

  if(IsFullScreen() === false){
    if (findDOMNode(videoRef?.current?.getInternalPlayer()).requestFullScreen) {
      // W3C API
      findDOMNode(videoRef?.current?.getInternalPlayer()).requestFullScreen();
    } else if (findDOMNode(videoRef?.current?.getInternalPlayer()).mozRequestFullScreen) {
      // Mozilla current API
      findDOMNode(videoRef?.current?.getInternalPlayer()).mozRequestFullScreen();
    } else if ( findDOMNode(videoRef?.current?.getInternalPlayer()).webkitRequestFullScreen) {
      // Webkit current API
      findDOMNode(videoRef?.current?.getInternalPlayer()).webkitRequestFullScreen();
    } else if ( findDOMNode(videoRef?.current?.getInternalPlayer()).webkitEnterFullScreen) {
      // This is the IOS Mobile edge case
      findDOMNode(videoRef?.current?.getInternalPlayer()).webkitEnterFullScreen();
    }
  }else{
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
  const exitHandler = useCallback(() => {
  setIsFullScreen(prevState => !prevState)
}, [])

useEffect(() => {
  if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', exitHandler, false);
      document.addEventListener('mozfullscreenchange', exitHandler, false);
      document.addEventListener('fullscreenchange', exitHandler, false);
      document.addEventListener('MSFullscreenChange', exitHandler, false);
  }

  return () => {
      if (document.addEventListener) {
          document.removeEventListener('webkitfullscreenchange', exitHandler, false);
          document.removeEventListener('mozfullscreenchange', exitHandler, false);
          document.removeEventListener('fullscreenchange', exitHandler, false);
          document.removeEventListener('MSFullscreenChange', exitHandler, false);
      }
  }
}, [])

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
    <>
    <div
      className={
        isFullScreen
          ? "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform w-full h-full"
          : "relative min-h-[211px]  w-full "
      }
    >
      {/* {!isReady && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform">
          <div className="w-12 h-12 rounded-full animate-spin border-8 border-dashed border-purple-500 border-t-transparent" />
        </div>
      )} */}
      <ReactPlayer
        width={'100%'}
        height={'100%'}
        ref={ (video) => videoRef.current = video}
        playsinline={true}
        playing={allValues.playing}
        muted={allValues.muted}
        // url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr}
        url={allValues.url}
        pip={allValues.pip}
        onReady={() => {
          setIsReady(true);
        }}
        onBuffer={() => setIsReady(false)}
        onBufferEnd={() => setIsReady(true)}
        // controls={allValues.controls}
        // controls={false}
      />
     
    </div>
    <CamHLSControls
          allValues={allValues}
          setAllValues={setAllValues} 
            handleClickFullscreen={handleClickFullscreen} 
            handlePlayPause={handlePlayPause}
            handleToggleMuted={handleToggleMuted}  
            setShowHls={setShowHls}
            showHls={showHls}
              />
    </>
  )
}