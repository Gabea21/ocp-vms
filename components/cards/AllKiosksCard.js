import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ReactPlayer from 'react-player'
import useSound from 'use-sound'; //implement
import { BsPhoneVibrateFill,BsPhoneFill } from 'react-icons/bs';
import KioskCallModal from '../modal/KioskCallModal';
import KioskControlModal from '../modal/KioskControlModal';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }

export default function AllKiosksCard(props) {
    const { kiosk, room } = props;
    const [viewCallModal, setViewCallModal] = useState(false);
    const [calledKiosk, setCalledKiosk] = useState(null);
    const [callAudioEnded, setCallAudioEnded] = useState(false);
    const [handlePlayerLoad, setHandlePlayerLoad] = useState(false);
    const [loadedHLS, setLoadedHLS] = useState(false)
    const [kioskHLS, setKioskHLS] = useState('') //kiosk HLS video Stream
    const videoRef = useRef()
    
    // Config UseSound Hook
    const [play, { stop }] = useSound('/assets/tele-ring-loop.mp3', { // useSound Package for phone ringtone
        onend: () => {
          console.info('Sound ended');
          setCallAudioEnded(true) //Trigger useEffect to loop sound
        },
      });

    // Loop Sound - On MP3 End
    useEffect(() => {
        if(callAudioEnded){
            setCallAudioEnded(false)
            play() //Play Call Ringtone
        }
    }, [callAudioEnded])

     //Handle Modal Closed During Call
     useEffect(() => {
        if(kiosk.callRequested && !viewCallModal){
           play()
           console.log('Ran Play Ringtone 🔈 ')
       }else{
           stop()
           console.log('Ran End Ringtone 🔈 ')
       }
   }, [kiosk, viewCallModal])




    // Handle Answer Kiosk
    const handleCallKiosk = async(e,kiosk) => {
        e.preventDefault()
        setCalledKiosk(kiosk)
        setViewCallModal(true)
    }
    
     // Fetch HLS URL from Recording Server (4-12 second delayed Stream)
    useEffect(() => {
        const url =`/api/cameras/live?id=${kiosk?.camera_id}&key=watch`;
        axios.get(url)
          .then((res) =>{
            if(res.data.success){
                console.log('Kiosk Camera HLS 🎉 ',res.data) 
                setKioskHLS(res.data.watch.hls)
                setLoadedHLS(true)
            }
            
          }).catch((err) => { 
              console.log(err); 
          })
      }, [])
    //Player Config
    const [allValues, setAllValues] = useState({
        pip: true,
        controls: true,
        light: false,
        volume: 0.8,
        muted: true,
        played:0,
        loaded:0,
        duration:0,
        playbackRate: 1.0,
        loop: false,
        seeking: false
        });

    

    // const { data: roomsData, error: roomsErr } = useSWR(`/api/kiosks/rooms/${room.roomId}`, fetcherFunc, {initialProps: props, revalidateOnMount: true, refreshInterval:2000});

    // if ( roomsErr) return <div>failed to load</div>
    // if (!roomsData ) return <div>loading...</div>
    return (
        <div className="mt-12 max-w-lg mx-auto lg:max-w-lg">
            {/* {viewCallModal && calledKiosk && <KioskCallModal open={viewCallModal} setOpen={setViewCallModal} kiosk={calledKiosk} />} */}
            {viewCallModal && calledKiosk && <KioskControlModal open={viewCallModal} setOpen={setViewCallModal} kiosk={calledKiosk} />}

             <div  className={kiosk.callRequested ? "flex flex-col rounded-lg shadow-lg shadow-red-500 overflow-hidden bg-white" : "flex flex-col rounded-lg shadow-lg shadow-green-500 overflow-hidden bg-white"}>
                <div className="flex-shrink-0">
                    {/* <img className="h-48 w-full object-cover" src={'/assets/comp-logo.png'} alt="" /> */}
                    <ReactPlayer  width="100%" height="100%" 
                        ref={ (video) => videoRef.current = video}
                        controls={true} 
                        playing={loadedHLS ? true : false}  
                        // url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr} 
                        url={kioskHLS} 
                        onBuffer={() => {console.log('Buffering')}}
                        onBufferEnd={() => {console.log('Buffering Ended')}}
                        onError={(e) => { console.log('kiosk cam error',e)}}
                        // onProgress={handleProgress}
                        // onDuration={handleDuration}
                        // onEnded={handleEnded}
                        onSeek={e => console.log('onSeek', e)}
                        pip={allValues.pip}
                        controls={allValues.controls}
                        light={allValues.light}
                        loop={allValues.loop}
                        playbackRate={allValues.playbackRate}
                        volume={allValues.volume}
                        muted={allValues.muted}
                        onReady={() => setHandlePlayerLoad(true)}
                        onStart={() => console.log('onStart')}
                        config={{ file: { attributes: { //Allows screenshot
                            crossOrigin: 'anonymous'
                          }}}}
                    />
                </div>
                
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex flex-row justify-between">
                        <div>
                            <span className="text-gray-500 text-sm">{kiosk.kiosk_id} </span>
                            <p className="text-xl font-semibold text-gray-900"> {kiosk.name}</p>
                            <p className="mt-3 text-base text-gray-500">{kiosk.location}</p>
                        </div>
                        <div >
                        {!kiosk.callRequested ?(
                                <div   className="p-2 m-2  rounded-full shadow-2xl shadow-yellow-800  border-green-400 border-4 cursor-pointer">
                                <BsPhoneFill size={60}/>
                                </div>
                        ):(
                             <div  onClick={(e) => handleCallKiosk(e,kiosk)} className="p-2 m-2 bg-rose-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 animate-[pulse_1s_infinite] rounded-full shadow-2xl shadow-yellow-800  border-green-400 border-4 cursor-pointer">
                                <BsPhoneVibrateFill size={70}/>
                            </div>
                        )}
                       
                        </div>
                    </div>
                    <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                    
                            {/* <span className="sr-only">{kiosk.author.name}</span>
                            <img className="h-10 w-10 rounded-full" src={kiosk.author.imageUrl} alt="" /> */}
        
                        </div>
                        <div className="ml-3 flex flex-col">
                            <span className="text-2xl font-bold ">{!kiosk.callRequested ? 'No Caller' : '📱 Incoming Call'}</span>
                        {/* {matchedRoom?.roomStreamList?.map((member,idx) => ( <span key={idx} >{member}</span>))} */}
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
}
