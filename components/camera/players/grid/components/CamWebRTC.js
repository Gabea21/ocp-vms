import React, { useEffect, useState, useRef } from 'react';
import WebRTCAdaptor from '../../../../lib/webrtc_adaptor';
import useAntMedia from '../../../../hooks/antMedia/useAntMedia';
import { findDOMNode } from 'react-dom'

export default function CamWebRTC(props) {
    const { camera, isFullScreen } = props;
    const videoRef = useRef();
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
        websocketURL:`wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/websocket`,
        remoteVideoId: `remoteVideo${camera?._id}`,
        isShow:false,
        webRTCAdaptor:null,
        connectionError:false,
        connected:false,
        isPlaying:false,
      });
  
     useEffect(() => {
      if(allValues.webRTCAdaptor !== null && allValues.connected === true ){ // Handle Camera Change
        allValues.webRTCAdaptor.stop(allValues.streamName)
        setAllValues( prevValues => {
          return { ...prevValues, streamName: camera.antStreamId }
       })
       onStartPlaying(camera.antStreamId)
      }else{
      setAllValues( prevValues => {
          return { ...prevValues, webRTCAdaptor: useAntMedia({allValues:allValues , setAllValues:setAllValues}) }
        })
      }
   }, [camera])
    
    useEffect(() => {
        //  Dismount WebRTC Peer
       return () => {
           if(allValues.webRTCAdaptor !== null){
               console.log('ran stop peer')
              allValues.webRTCAdaptor.stop(allValues.streamName)
           }
        }
    }, [allValues.webRTCAdaptor])
    
    useEffect(() => {
        if(allValues.webRTCAdaptor !== null && allValues.connected === true ){
            onStartPlaying(allValues.streamName)
            console.log('Connected-Side Load', camera.antStreamId)
        }
      
    }, [allValues.webRTCAdaptor,allValues.connected])

  
    
   const  onStartPlaying = (streamName) => {
        allValues.webRTCAdaptor.play(streamName, allValues.token);
    }

    function IsFullScreen() {
        return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
    }
      const handleClickFullscreen = () => {
        if(IsFullScreen() === false){
          findDOMNode(videoRef.current).requestFullscreen().catch(
            (err) => 
            {alert("Could not activate full-screen mode ")}
          )
        }else{
          // console.log(IsFullScreen())
          document?.exitFullscreen()
        }
      }

    //   useEffect(() => {
    //     // if(isFullScreen){
    //         handleClickFullscreen()
    //     // }
    //   }, [])
      
  return (
    <video ref={videoRef} className="w-full h-full aspect-video" id={`remoteVideo${camera?._id}`} autoPlay muted playsInline
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" /> 
  )
}
