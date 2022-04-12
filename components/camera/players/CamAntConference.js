import { useState, useEffect } from "react";
import WebRTCAdaptor from '../../lib/webrtc_adaptor';

export default function CamAntConference(props) {
        const { publishId, roomId } = props;
        const [isPublishing, setIsPublishing] = useState(false)
        const [token, setToken] = useState('')
        const [pc_config, setPc_config] = useState({
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
        });
        const [mediaConstraints, setMediaConstraints] = useState({
            video: true, audio: true
        })
        const [sdpConstraints, setSdpConstraints] = useState({
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        })
        const [websocketURL, setWebsocketURL] = useState(`wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/websocket`)  //ADD ENV AM_SERVER_URL 
        const [webRTCAdaptor, setWebRTCAdaptor] = useState(null)
        const [roomNameBox, setRoomNameBox] = useState(roomId)
        const [publishStreamId, setPublishStreamId] = useState(publishId)
        const [isCameraOff, setIsCameraOff] = useState(false);
        const [isMicMuted, setIsMicMuted] = useState(false);
        const [isDataChannelOpen, setIsDataChannelOpen] = useState(false);
        const [dominantSpeakerFinderId, setDominantSpeakerFinderId] = useState(null);
        const [playOnly, setPlayOnly] = useState(false);
        const [streamsList,setStreamsList] = useState([])
        const [roomOfStream, setRoomOfStream] = useState([])
        const [roomTimerId, setRoomTimerId] = useState(-1)
        const [mutedAlertPresent, setMutedAlertPresent] = useState(false)
        
        useEffect(() => {
            let videox = document.querySelector(`#localVideo${publishId}`);
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function (stream) {
                        videox.srcObject = stream;
                    })
                    .catch(function (error) {
                        console.log("Something went wrong!");
                    });
            };
          setWebRTCAdaptor(initiateWebrtc());
        
        }, [])

        const  initiateWebrtc = () => {
            return new WebRTCAdaptor(	
            {
                websocket_url : websocketURL,
                mediaConstraints : mediaConstraints,
                peerconnection_config : pc_config,
                sdp_constraints : sdpConstraints,
                localVideoId :`localVideo${publishId}` ,
                isPlayMode : playOnly,
                debug : true,
                dataChannelEnabled : true,
                callback : (info, obj) => {
                    if (info == "initialized") {
                        console.log("initialized");
                        setIsPublishing(true) // Show Stop Publishing Button
                        if(playOnly){
                            setIsCameraOff(true)
                            handleCameraButtons();
                        }
                    } 
                    else if (info == "joinedTheRoom") {
                        var room = obj.ATTR_ROOM_NAME;
                        roomOfStream[obj.streamId] = room;
                        console.log("joined the room: "
                                + roomOfStream[obj.streamId]);
                        console.log(obj)
                        // publishStreamId = obj.streamId
                        setPublishStreamId(obj.streamId)
                        if(playOnly) {
                            setIsPublishing(false) // Show Start Publishing Button
                            setIsCameraOff(true)
                            handleCameraButtons();
                        }
                        else {
                            console.log('Run Publish')
                            console.log(webRTCAdaptor)
                            publish(obj.streamId, token);
                        }
                        
                        if (obj.streams != null) {
                            obj.streams.forEach(function(item) {
                                console.log("Stream joined with ID: "+item);
                                webRTCAdaptor?.play(item, token, roomNameBox);
                            });
                            setStreamsList(streams => [... streamsList, obj.streams]) // Update Remote Streams
                        }
                        roomTimerId = setInterval(() => {			
                            webRTCAdaptor?.getRoomInfo(roomNameBox, publishStreamId);
                        }, 5000);

                            if(streamsList.length > 0){
                                dominantSpeakerFinderId = setInterval(() => {			
                                webRTCAdaptor?.getSoundLevelList(streamsList);
                            }, 200);
                        }
                    }
                    else if (info == "newStreamAvailable") {
                        playVideo(obj);
                        if(dominantSpeakerFinderId == null){
                            dominantSpeakerFinderId = setInterval(() => {			
                            // webRTCAdaptor.getSoundLevelList(streamsList);
                            }, 200);
                        }
                    } 
                    else if (info == "publish_started") {
                        //stream is being published
                        console.debug("publish started to room: "
                                + roomOfStream[obj.streamId]);
                        setIsPublishing(true); // show end-publish button
                        // startAnimation();
                    }
                    else if (info == "publish_finished") {
                        //stream is being finished
                        console.debug("publish finished");
                    } 
                    else if (info == "screen_share_stopped") {
                        console.log("screen share stopped");
                    }
                    else if (info == "gotSoundList"){
                        findDominantSpeaker(obj);
                    }
                    else if (info == "browser_screen_share_supported") {
                        // screen_share_checkbox.disabled = false;
                        // camera_checkbox.disabled = false;
                        // screen_share_with_camera_checkbox.disabled = false;
                        console.log("browser screen share supported");
                        // browser_screen_share_doesnt_support.style.display = "none";
                    } 
                    else if (info == "leavedFromRoom") {
                        let room = obj.ATTR_ROOM_NAME;
                        console.debug("leaved from the room:" + room);
                        if (roomTimerId != null)
                        {
                            clearInterval(roomTimerId);
                            clearInterval(dominantSpeakerFinderId);
                        }
                        dominantSpeakerFinderId = null;

                        setIsPublishing(false) //show join room button
                        
                        if (streamsList != null) {
                            streamsList.forEach(function(item) {
                                removeRemoteVideo(item);
                            });
                        }
                        // we need to reset streams list
                        setStreamsList([])
                    } 
                    else if (info == "closed") {
                        //console.log("Connection closed");
                        if (typeof obj != "undefined") {
                            console.log("Connecton closed: "
                                    + JSON.stringify(obj));
                        }
                    } 
                    else if (info == "play_finished") {
                        console.log("play_finished");
                        removeRemoteVideo(obj.streamId);
                    } 
                    else if (info == "streamInformation") {
                        streamInformation(obj);
                    } 
                    else if (info == "roomInformation") {
                        //Checks if any new stream has added, if yes, plays.
                        for(let str of obj.streams){
                            if(!streamsList.includes(str)){
                                webRTCAdaptor?.play(str, token,
                                        roomNameBox);
                            }
                        }
                        // Checks if any stream has been removed, if yes, removes the view and stops webrtc connection.
                        for(let str of streamsList){
                            if(!obj.streams.includes(str)){
                                removeRemoteVideo(str);
                            }
                        }
                        //Lastly updates the current streamlist with the fetched one.
                        // streamsList=obj.streams;
                        setStreamsList(obj.streams)
                        //Check video tracks active/inactive status
                        checkVideoTrackStatus(streamsList);
                    }
                    else if (info == "data_channel_opened") {
                        console.log("Data Channel open for stream id", obj );
                        setIsDataChannelOpen(true)
                    } 
                    else if (info == "data_channel_closed") {
                        console.log("Data Channel closed for stream id", obj );
                        setIsDataChannelOpen(false)
                    } 
                    else if(info == "data_received") {
                        handleNotificationEvent(obj);
                    }
                    else if (info == "speaking_but_muted") {
                        if(!mutedAlertPresent){
                            setMutedAlertPresent(true)
                            // $("#notification").fadeIn("slow");
                            // $(".dismiss").click(function(){
                            //     $("#notification").fadeOut("slow");
                            //     mutedAlertPresent = false;
                            // });

                            // setTimeout(()=>{
                            //     $("#notification").fadeOut("slow");
                            //     mutedAlertPresent = false;
                            // }, 3000)
                        }
        }	
                    else if(info == "session_restored"){
                        handleCameraButtons();
                        // startAnimation();
                        console.log(info + "notification received");
                    }
                },
                callbackError : function(error, message) {
                    //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

                    if(error.indexOf("publishTimeoutError") != -1 && roomTimerId != null){
                        clearInterval(roomTimerId);
                    }

                    console.log("error callback: " + JSON.stringify(error));
                    var errorMessage = JSON.stringify(error);
                    if (typeof message != "undefined") {
                        errorMessage = message;
                    }
                    var errorMessage = JSON.stringify(error);
                    if (error.indexOf("NotFoundError") != -1) {
                        errorMessage = "Camera or Mic are not found or not allowed in your device.";
                    } else if (error.indexOf("NotReadableError") != -1
                            || error.indexOf("TrackStartError") != -1) {
                        errorMessage = "Camera or Mic is being used by some other process that does not not allow these devices to be read.";
                    } else if (error.indexOf("OverconstrainedError") != -1
                            || error.indexOf("ConstraintNotSatisfiedError") != -1) {
                        errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints."
                    } else if (error.indexOf("NotAllowedError") != -1
                            || error.indexOf("PermissionDeniedError") != -1) {
                        errorMessage = "You are not allowed to access camera and mic.";
                        // screen_share_checkbox.checked = false;
                        // camera_checkbox.checked = false;
                    } else if (error.indexOf("TypeError") != -1) {
                        errorMessage = "Video/Audio is required.";
                        console.log(errorMessage)

                    } else if (error.indexOf("UnsecureContext") != -1) {
                        errorMessage = "Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https";
                    } else if (error.indexOf("WebSocketNotSupported") != -1) {
                        errorMessage = "Fatal Error: WebSocket not supported in this browser";
                        console.log(errorMessage)

                    } else if (error.indexOf("no_stream_exist") != -1) {
                        //TODO: removeRemoteVideo(error.streamId);
                    } else if(error.indexOf("data_channel_error") != -1) {
                        errorMessage = "There was a error during data channel communication";
                        console.log(errorMessage)

                    } else if (error.indexOf("ScreenSharePermissionDenied") != -1) {
                        errorMessage = "You are not allowed to access screen share";
                        console.log(errorMessage)
                        // screen_share_checkbox.checked = false;
                        // camera_checkbox.checked = true;
                    } 

                    alert(errorMessage);
                }
            })
        }
        
     
        function sendNotificationEvent(eventType) {
            if(isDataChannelOpen) {
                var notEvent = { streamId: publishStreamId, eventType:eventType };
    
                webRTCAdaptor.sendData(publishStreamId, JSON.stringify(notEvent));
            }	else {
                console.log("Could not send the notification because data channel is not open.");
            }
        }
        function handleNotificationEvent(obj) {
            console.log("Received data : ", obj.data);
            var notificationEvent = JSON.parse(obj.data);
            if(notificationEvent != null && typeof(notificationEvent) == "object") {
              var eventStreamId = notificationEvent.streamId;
              var eventTyp = notificationEvent.eventType;
    
                if(eventTyp == "CAM_TURNED_OFF") {
                        console.log("Camera turned off for : ", eventStreamId);
                } else if (eventTyp == "CAM_TURNED_ON"){
                        console.log("Camera turned on for : ", eventStreamId);
                } else if (eventTyp == "MIC_MUTED"){
                        console.log("Microphone muted for : ", eventStreamId);
                } else if (eventTyp == "MIC_UNMUTED"){
                        console.log("Microphone unmuted for : ", eventStreamId);
                }
          }
        }
    
        function joinRoom() {
            // publish()
            webRTCAdaptor.joinRoom(roomId, publishStreamId, "legacy"); //legacy or MCU mode
        }
         function publish(streamName, token) {
            publishStreamId = streamName;
            webRTCAdaptor?.publish( publishStreamId, token);
        }
        function turnOffLocalCamera() {
            webRTCAdaptor.turnOffLocalCamera(publishStreamId);
            isCameraOff = true;
            handleCameraButtons();
            sendNotificationEvent("CAM_TURNED_OFF");
        }
    
        function turnOnLocalCamera (){
            webRTCAdaptor.turnOnLocalCamera(publishStreamId);
            isCameraOff = false;
            handleCameraButtons();
            sendNotificationEvent("CAM_TURNED_ON");
        }
        function muteLocalMic(){
            webRTCAdaptor.muteLocalMic();
            isMicMuted = true;
            handleMicButtons();
            sendNotificationEvent("MIC_MUTED");
            webRTCAdaptor.enableAudioLevelWhenMuted()
        }
        function unmuteLocalMic() {
            webRTCAdaptor.unmuteLocalMic();
            isMicMuted = false;
            handleMicButtons();
            sendNotificationEvent("MIC_UNMUTED");
            webRTCAdaptor.disableAudioLevelWhenMuted();
        }
        function handleCameraButtons() {
            if(isCameraOff) {
                console.log('Show Camera On Button')
                // turn_off_camera_button.disabled = true;
                // turn_on_camera_button.disabled = false;
            } else {
                console.log('Show Camera Off Button')
                // turn_off_camera_button.disabled = false;
                // turn_on_camera_button.disabled = true;
            }
        }
    
        function handleMicButtons() {
            if(isMicMuted) {
                mute_mic_button.disabled = true;
                unmute_mic_button.disabled = false;
            } else {
                mute_mic_button.disabled = false;
                unmute_mic_button.disabled = true;
            }
        }
        function leaveRoom() {
            webRTCAdaptor.leaveFromRoom(roomId);
    
            for (var node in document.getElementById("players").childNodes) {
                if(node.tagName == 'DIV' && node.id != "localVideo") {
                    document.getElementById("players").removeChild(node);
                }
            }
        }
        function createRemoteVideo(streamId) {
          setStreamList(prevVideos => [...streamsList,streamId])
        }
        function playVideo(obj) {
            var room = roomOfStream[obj.streamId];
            console.log("new stream available with id: "
                    + obj.streamId + "on the room:" + room);
    
            var video = document.getElementById("remoteVideo"+obj.streamId);
    
            if (video == null) {
                createRemoteVideo(obj.streamId);
                video = document.getElementById("remoteVideo"+obj.streamId);
            }
    
            video.srcObject = obj.stream;
    
            // webRTCAdaptor.enableAudioLevel(obj.stream, obj.streamId)
        }

        function removeRemoteVideo(streamId) {
           setStreamList(streamsList.filter((video) => video !== streamId))
            webRTCAdaptor.stop(streamId);
        }
    
        function checkVideoTrackStatus(streamsList){
            streamsList.forEach(function(item) {
                var video = document.getElementById("remoteVideo"+item);
                if(video != null && !video.srcObject.active){
                    removeRemoteVideo(item);
                    playVideo(item);
                }
            });
        }
        function findDominantSpeaker(streamSoundList){
            var tmpMax = 0;
            var tmpStreamId = null;
            var threshold = 0.01;
            
            for(let i = 0; i < streamsList.length; i++){
                let nextStreamId = streamsList[i];
                let tmpValue = streamSoundList[nextStreamId]
                if( tmpValue > threshold ){
                    if(tmpValue > tmpMax){
                        tmpMax = tmpValue;
                        tmpStreamId = nextStreamId;
                    }
                }
            }
            if(tmpStreamId != null){
                console.log('dominant speaker found')
                // if(checkSpeakingStreamIds[tmpStreamId] == null || typeof checkSpeakingStreamIds[tmpStreamId] == "undefined"){
                //     var icon = document.getElementById("audio"+tmpStreamId);
                //     icon.style.visibility="visible";
                //     checkSpeakingStreamIds[tmpStreamId] = true;
                //     setTimeout(()=> {
                //         var icon = document.getElementById("audio"+tmpStreamId);
                //         icon.style.visibility="hidden";
                //         checkSpeakingStreamIds[tmpStreamId] = null;
                //     },1000)
                // }
            }
        }
        console.log(webRTCAdaptor)
    return (
        <div>
           {streamsList.map((stream,idx) => (
                <video key={idx} id={`remoteVideo`+ stream } controls autoPlay playsInline></video>
           ))}
            <video id={`localVideo${publishId}`} controls autoPlay  playsInline muted />
            <button onClick={() => joinRoom()}> Join ROom</button>
        </div>
    )
}
