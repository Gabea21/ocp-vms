import WebRTCAdaptor from '../../lib/webrtc_adaptor';

export default function useAntMedia  (props) {
    const { allValues, setAllValues } = props;
    return new WebRTCAdaptor({
        websocket_url: allValues.websocketURL,
        mediaConstraints:  allValues.mediaConstraints,
        peerconnection_config:  allValues.pc_config,
        sdp_constraints:  allValues.sdpConstraints,
        remoteVideoId:  allValues.remoteVideoId,
        isPlayMode: true,
        debug: true, // Debug AMS
        candidateTypes: ["tcp", "udp"],
        callback: function (info, obj) {
            if (info == "initialized") {
                console.log("initialized");
                setAllValues( prevValues => {
                    return { ...prevValues, connected: true }
                 })
            } else if (info == "play_started") {
                //joined the stream
                console.log("play started");
                setAllValues( prevValues => {
                    return { ...prevValues, isPlaying: true }
                 })
                 setAllValues( prevValues => {
                    return { ...prevValues,connectionError: false }
                 });
            } else if (info == "play_finished") {
                //leaved the stream
                console.log("play finished");
                // videoRef.current.play()
                // console.log(  videoRef.current.ended,'ref')
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

                // console.log("Average incoming kbits/sec: " + obj.averageIncomingBitrate
                //     + " Current incoming kbits/sec: " + obj.currentIncomingBitrate
                //     + " packetLost: " + obj.packetsLost
                //     + " fractionLost: " + obj.fractionLost
                //     + " audio level: " + obj.audioLevel);

            } else if (info == "data_received") {
                console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
            } else if (info == "bitrateMeasurement") {
                // console.log(info + " notification received");
                // console.log(obj);
                setAllValues( prevValues => {
                    return { ...prevValues,connectionError: false }
                 });
            } else {
                // console.log(info + " notification received");

            }
        },
        callbackError: function (error) {
            //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
            setAllValues( prevValues => {
                return { ...prevValues,connectionError: true }
             });
            console.log("error callback: " + JSON.stringify(error));
            // alert(JSON.stringify(error));
            console.log(JSON.stringify(error))
        }
    });
}