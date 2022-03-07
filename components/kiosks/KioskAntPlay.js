
import React, { useEffect, useState } from 'react';
// import './Player.css';
import WebRTCAdaptor from '../lib/webrtc_adaptor';
import {HiOutlineStatusOnline, HiStatusOffline} from 'react-icons/hi';
import { useRouter } from 'next/router';


export default function KioskAntPlay(props) {
    const {kiosk_id} = props;
    const [mediaConstraints, setMediaConstraints] = useState({
        video: false, audio: false
    })
    const [streamName, setStreamName] = useState('')
    const [token, setToken] = useState('')
    const [pc_config, setPc_config] = useState({
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    });
    const [sdpConstraints, setSdpConstraints] = useState({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    })
    const [websocketURL, setWebsocketURL] = useState(`wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/websocket`)  //ADD ENV AM_SERVER_URL 
    const [remoteVideoId, setremoteVideoId] = useState(`remoteVideo${kiosk_id}`)
    const [isShow, setIsShow] = useState(false);
    const [webRTCAdaptor, setWebRTCAdaptor] = useState(null)
    const [connectionError, setConnectionError] = useState(false)
    const [connected, setConnected] = useState(false)
    const [showVod, setShowVod] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);
    const [callFinished, setCallFinished] = useState(false);

    useEffect(() => {
        setWebRTCAdaptor(initiateWebrtc())
        setIsShow(true)
       
    }, [])

     // Close Peer Connection Cleanup Function
     useEffect(() => {
        // NEED TO IMPLEMENT TO FIX Dismount && Mount
       return () => {
           if(webRTCAdaptor !== null){
               console.log('ran stop')
               webRTCAdaptor.stop(streamName)
           }
        }
    }, [webRTCAdaptor])
    

    useEffect(() => {
        if(props.kiosk_id)
        setStreamName(props.kiosk_id)
    }, [])
    
    useEffect(() => {
        if(webRTCAdaptor !== null && connected === true){
            onStartPlaying(streamName)
        }
        console.log('Connected-Side Load')
    }, [webRTCAdaptor,connected])

    const streamChangeHandler = (e) => {
        console.log(e.target.value);
        setStreamName(e.target.value);
    }

   const  onStartPlaying = (streamName) => {
        webRTCAdaptor.play(streamName, token);
    }
   
    const  initiateWebrtc = () => {
        return new WebRTCAdaptor({
            websocket_url: websocketURL,
            mediaConstraints: mediaConstraints,
            peerconnection_config: pc_config,
            sdp_constraints: sdpConstraints,
            remoteVideoId: remoteVideoId,
            isPlayMode: true,
            debug: true,
            candidateTypes: ["tcp", "udp"],
            callback: function (info, obj) {
                if (info == "initialized") {
                    console.log("initialized");
                    setConnected(true)
                } else if (info == "play_started") {
                    //joined the stream
                    console.log("play started");
                    setIsPlaying(true);
                    setConnectionError(false)
                } else if (info == "play_finished") {
                    //leaved the stream
                    console.log("play finished");
                    setCallFinished(true)
                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof obj != "undefined") {
                        console.log("Connecton closed: "
                            + JSON.stringify(obj));
                    }
                } else if (info == "streamInformation") {


                } else if (info == "ice_connection_state_changed") {
                    console.log("iceConnectionState Changed: ", JSON.stringify(obj));
                } else if (info == "updated_stats") {
                    //obj is the PeerStats which has fields
                    //averageIncomingBitrate - kbits/sec
                    //currentIncomingBitrate - kbits/sec
                    //packetsLost - total number of packet lost
                    //fractionLost - fraction of packet lost
                    console.log("Average incoming kbits/sec: " + obj.averageIncomingBitrate
                        + " Current incoming kbits/sec: " + obj.currentIncomingBitrate
                        + " packetLost: " + obj.packetsLost
                        + " fractionLost: " + obj.fractionLost
                        + " audio level: " + obj.audioLevel);

                } else if (info == "data_received") {
                    console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
                } else if (info == "bitrateMeasurement") {
                    console.log(info + " notification received");
                    console.log(obj);
                    setConnectionError(false)
                } else {
                    console.log(info + " notification received");

                }
            },
            callbackError: function (error) {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
                setConnectionError(true);
                console.log("error callback: " + JSON.stringify(error));
                // alert(JSON.stringify(error));
                console.log(JSON.stringify(error))
            }
        });
    }

    return (
        <div className=" bg-black max-h-[480px] p-1 ">
           <div className="flex flex-row justify-center inset-x-0 top-0">
                <div className="flex flex-row justify-between px-[0.55rem] py-[0.2rem]  w-full  bg-black ">
                    {/* <div className="inline-flex items-center px-1 border-indigo-300 border-[1px] rounded-md text-sm font-medium  text-white">

                    </div> */}
                    {
                        !connectionError ? (
                            <div>
                                <span className=" inline-flex items-center px-1 border-indigo-300 border-[1px] rounded-md text-sm font-medium  text-white">
                                        Live
                                        <HiOutlineStatusOnline size={18} className=" text-green-600 animate-pulse ml-2" />
                                </span>
                            </div>
                        ) : (
                        <div>
                            <span className="inline-flex items-center px-1 border-indigo-300 border-[1px] rounded-md text-sm font-medium  text-white"> 
                                No Call Recieved
                                <HiStatusOffline size={18} className="animate-ping text-red-600 ml-2" />
                            </span>
                        </div>
                    )}
                </div>
           </div>
            <div style={{width:'100%', maxWidth:'1200px' , margin:'auto' , display:'block', position: 'relative'}} >
               {!connectionError ?
                <>
                        <video  style={{width:'100%', height:'auto', minHeight:"220px", maxHeight:'440px'}} id={`remoteVideo${kiosk_id}`} autoPlay controls playsInline
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" />
                </>
                :
                <>
                {/* Video Messages */}
                    {/* <div style={{color:"#FFF", position: "absolute", top: "0" ,left: "0" ,display: "flex " ,flexDirection: "column" , justifyContent: "center" ,alignItems: "start",  width: "100%" , height: "100%"}}>
                             We Can Place Messages On Screen
                    </div> */}
                    {/* <video  style={{width:'100%', height:'auto', minHeight:"220px"}} id={`remoteVideo${kiosk_id}`} autoPlay controls playsInline
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" /> */}
                </>}
            </div>
        </div>
    )
}
