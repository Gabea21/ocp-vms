import React, { useEffect, useState, useRef, useCallback } from 'react';
import WebRTCAdaptor from '../../../../lib/webrtc_adaptor';
import useAntMedia from '../../../../hooks/antMedia/useAntMedia';
import { findDOMNode } from 'react-dom'
// import { useNetworkContext } from '../../../../contexts/NetworkContext';
import ReactPlayer from 'react-player';
import CamRTCControls from './CamRTCControls';

export default function CamWebRTC(props) {
    const { camera,  showHls, setShowHls } = props;
    const isInitialMount = useRef(true); // Track initial mount
    const videoRef = useRef();
    const [isFullScreen, setIsFullScreen] = useState(false)
    // const ip = useNetworkContext() //Fetch User Ip Address
    const [isReady, setIsReady] = useState(false);

    const [allValues, setAllValues] = useState({   //Vod Player Config
        width: '100%',
        height: '100%',
        streamName: camera?.antStreamId,
        mediaConstraints: { video: false, audio: false},
        token:'',
        pc_config: {
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
        },
        sdpConstraints:{
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        },
        websocketURL: `wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}/${process.env.NEXT_PUBLIC_MEDIA_SERVER_APP_NAME}/websocket`,
        // websocketURL: ip !== '96.246.173.123' ? 
        //     `wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}/${process.env.NEXT_PUBLIC_MEDIA_SERVER_APP_NAME}/websocket`
        //   :   `ws://192.168.1.237:5080/WebRTCAppEE/websocket`,
        remoteVideoId: `remoteVideoLive-${camera._id}`,
        isShow:false,
        webRTCAdaptor:null,
        connectionError:false,
        connected:false,
        isPlaying:false,
      });
      // console.log(ip)


    useEffect(() => {
          setAllValues( prevValues => {
            return { ...prevValues, webRTCAdaptor: useAntMedia({allValues:allValues , setAllValues:setAllValues}) }
          })
   }, [])
     
   useEffect(() => {
    if(allValues.webRTCAdaptor !== null  && allValues.connected){ // Handle Not Playing
        onStartPlaying(allValues.streamName)
    }
  }, [allValues.webRTCAdaptor,allValues.connected, allValues.streamName, ])

 

   useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
   } else {
    //  alert('Stop')
       // useEffect code here to be run on update (camera change)
       allValues.webRTCAdaptor.stop(allValues.streamName)
       setIsReady(false)
       setAllValues( prevValues => {
        return { ...prevValues, 
          streamName: camera?.antStreamId,
          token:'',
          remoteVideoId: `remoteVideoLive-${camera._id}`,
          isPlaying:false,
        }
      })
   }
       
  }, [camera])

    
  const  onStartPlaying = (streamName) => {
    console.log('Starting Play for', streamName)
    // allValues.webRTCAdaptor.play(streamName);
    allValues.webRTCAdaptor.play(streamName, allValues.token);

  }

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
      
      if (findDOMNode(videoRef.current).requestFullScreen) {
        // W3C API
        findDOMNode(videoRef.current).requestFullScreen();
      } else if (findDOMNode(videoRef.current).mozRequestFullScreen) {
        // Mozilla current API
        findDOMNode(videoRef.current).mozRequestFullScreen();
      } else if ( findDOMNode(videoRef.current).webkitRequestFullScreen) {
        // Webkit current API
        findDOMNode(videoRef.current).webkitRequestFullScreen();
      } else if ( findDOMNode(videoRef.current).webkitEnterFullScreen) {
        // This is the IOS Mobile edge case
        findDOMNode(videoRef.current).webkitEnterFullScreen();
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
  if(allValues.isPlaying){
    videoRef.current.pause()
  }else{
    videoRef.current.play()
  }
  setAllValues( prevValues => {
    return { ...prevValues, isPlaying: !allValues.isPlaying}
    })
   
}
const handleToggleMuted = () => {
  if( videoRef?.current.muted === true){
    videoRef?.current.muted = false
  }else{
    videoRef?.current.muted = true
  }
  setAllValues( prevValues => {
    return { ...prevValues, muted: !allValues.muted}
  })
}

useEffect(() => {
  if(videoRef?.current?.muted === true){
    setAllValues( prevValues => {
      return { ...prevValues, muted: true}
    })
  }else {
    setAllValues( prevValues => {
      return { ...prevValues, muted: false}
    })
  }

}, [videoRef?.current?.muted])
useEffect(() => {
  if(videoRef?.current?.paused === true){
    setAllValues( prevValues => {
      return { ...prevValues, isPlaying: false}
    })
  }else {
    setAllValues( prevValues => {
      return { ...prevValues, isPlaying: true }
    })
  }

}, [videoRef?.current?.paused])
      
  return (
    <>
    <div  className={
        isFullScreen
          ? "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform w-full h-full"
          : "relative  w-full "
      }>
			{!isReady && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform">
					<div className="w-12 h-12 rounded-full animate-spin border-8 border-dashed border-purple-500 border-t-transparent" />
				</div>
			)}
      {/* <iframe  className='w-full'   src={'https://ams1.gomidl.com/MIDL/play.html?id=583092919'} frameborder="0" allowfullscreen></iframe> */}
			<video
				ref={videoRef}
				className="w-full h-full"
				id={allValues.remoteVideoId}
				style={{
					width: '100%',
					height: '100%',
				}}
				autoPlay
				muted
				playsInline
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen={true}
				webkitallowfullscreen="true"
				mozallowfullscreen="true"
				onCanPlay={() => {
					setIsReady(true)
          // alert(true)
				}}
        // onError={function failed(e) { //Testing DO NOT USE IN PROD
        //   // video playback failed - show a message saying why
        //   switch (e.target.error.code) {
        //     case e.target.error.MEDIA_ERR_ABORTED:
        //       alert('You aborted the video playback.');
        //       break;
        //     case e.target.error.MEDIA_ERR_NETWORK:
        //       alert('A network error caused the video download to fail part-way.');
        //       break;
        //     case e.target.error.MEDIA_ERR_DECODE:
        //       alert('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
        //       break;
        //     case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        //       alert('The video could not be loaded, either because the server or network failed or because the format is not supported.');
        //       break;
        //     default:
        //       alert('An unknown error occurred.');
        //       break;
        //   }
        // }}
			/>
      
		</div>
     <CamRTCControls 
     allValues={ allValues}
     camera={camera}
     handleClickFullscreen={handleClickFullscreen} 
     handlePlayPause={handlePlayPause}
     handleToggleMuted={handleToggleMuted}  
     setShowHls={setShowHls}
     showHls={showHls}
     />
     </>
  )
}