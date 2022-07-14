import Head from 'next/head';
import React,{ useEffect, useRef, useState } from 'react'

export default function VxgPlayer(props) {
  const { camera } = props;
  const [allValues, setAllValues] = useState({
    playerId: `player-${camera._id}`,
    timelineId: `timeline-${camera._id}`,
    camLoading: false
  })

   
  useEffect(() => {
    if(camera?._id ){
      setAllValues(preV => {
        return { ...preV, playerId: `player-${camera._id}`}
      })
      setAllValues(preV => {
        return { ...preV, timelineId: `timeline-${camera._id}`}
      })
      setAllValues(preV => {
        return { ...preV, camLoading: true}
      })
    }
}, [camera])
console.log(camera)
  useEffect(() => {
        if(allValues.camLoading){
           try{
            if(window?.player){
                window.player.destroy()
                window.player = new window.CloudPlayerSDK(allValues.playerId, {
                    // debugger: true,
                    autohide: 2000,
                    timeline: true,
                    calendar: true,
                    disableZoomControl: false,
                    disableAudioControl: false,
                    disableGetShot: false,
                    disableGetClip: false,
                    // preferredPlayerFormat:'html5'
                  });
                  window.player.setSource(camera.vxg.allToken)
                  setAllValues(preV => {
                    return { ...preV, camLoading: false}
                  })

            }else{
              window.player = new window.CloudPlayerSDK(allValues.playerId, {
                // debugger: true,
                autohide: 2000,
                timeline: true,
                calendar: true,
                disableZoomControl: false,
                disableAudioControl: false,
                disableGetShot: false,
                disableGetClip: false,
                preferredPlayerFormat:'html5'

              });
            }
              window.player.setSource(camera.vxg.allToken)
              setAllValues(preV => {
                return { ...preV, camLoading: false}
              })
           }catch(err){
             console.log(err)
           }
      }
    }, [allValues.camLoading])


   console.log(allValues.camLoading)
    
  return (
      <>
      <Head>
        <style >{`
                .cloudplayer-watermark{
                        display:none;
                    }
                .cloudplayer-sdkversion{
                        display:none;
                    }
                // .cloudplayer-settings{
                //         display:none;
                //     }
                    `}
            </style>
    </Head>
    <div className='w-full h-full '>
        <div id={allValues.playerId} className='min-h-[260px] sm:min-h-[460px]   aspect-[16/9]'/>
                    <div id={`timeline-${camera._id}`}/>
    </div>
    </>
  )
}