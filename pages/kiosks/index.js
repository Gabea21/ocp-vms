import { useState } from "react";
import KioskAntPublish from "../../components/kiosks/KioskAntPublish";
import {GiAtom} from "react-icons/gi"
import {BiPhoneCall, BiBell, BiPhoneOff} from "react-icons/bi";
import KioskAntPlay from "../../components/kiosks/KioskAntPlay";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import KioskService from "../../components/services/KioskService";
import Draggable from 'react-draggable'; // The default

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function index(props) {
    const router = useRouter();
    const [showKioskManager, setShowKioskManager] = useState(false)   
    const [callStarted, setCallStarted] = useState(false);
    const { mutate } = useSWRConfig()

    const handleCallMaster = async() => {
        console.log(' Call Request')

        try{
            const apiRes = await KioskService.callMaster(router.query.kiosk_id)
            if(apiRes.data.success){
                console.log('Call Initiated 🎉 ')
                mutate(`/api/kiosks?id=${router.query.kiosk_id}`)
                setCallStarted(true)
            }
        }catch(err){
            console.log('Call kiosk master ERR', err)
        }
    }
    const endCallMaster = async() => {
        console.log(' Call End Request')

        try{
            const apiRes = await KioskService.endCallRequest(router.query.kiosk_id)
            if(apiRes.data.success){
                console.log('Call Request Ended🎉 ')
                mutate(`/api/kiosks?id=${router.query.kiosk_id}`)
                setCallStarted(false)
            }
        }catch(err){
            console.log('Call kiosk master ERR', err)
        }
    }
    const url =`/api/kiosks?id=${router.query.kiosk_id}`;
    const { data,error: kioskError } = useSWR(router.query.kiosk_id ? url : null, fetcherFunc, {initialProps: props, refreshInterval:3200});
    // const url2 =`https://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/rest/v2/broadcasts/${kioskData?.kiosk.kiosk_id}-manager`;
    // const { data:kioskManagerData ,error } = useSWR( kioskData ? url2 : null, fetcherFunc, {initialProps: props , refreshInterval:2000 });
    if (kioskError) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
   
    return (
        <div>
           <div className="max-w-[800px]">
               <div className="rounded-2xl shadow-lg shadow-blue-200 mb-12 p-[0.5rem]">
                <KioskAntPublish kiosk_id={data?.kiosk?.kiosk_id} />
               </div>
               <div className="flex flex-col items-center w-full py-2">
               { !data.kiosk?.callRequested ?  ( 
                    <button
                         onClick={() => handleCallMaster()}
                        type="button"
                        className="inline-flex text-4xl w-full items-center px-6 py-6 border border-transparent shadow-sm  font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <BiPhoneCall className="mr-3 -ml-1 h-24 w-24" aria-hidden="true" />
                       
                      Concierge Assitance

                    </button>
                    ) :(
                        <button
                        onClick={() => endCallMaster()}
                       type="button"
                       className="inline-flex text-4xl w-full items-center px-6 py-6 border border-transparent shadow-sm  font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <BiPhoneOff className="mr-3 -ml-1 h-24 w-24" aria-hidden="true" />
                            
                            End Call

                        </button>
                    )}
               </div>

               {data?.kiosk?.callRequested === true && data?.kiosk?.callAccepted === true &&    
                <Draggable >
                    <div className="bg-white rounded fixed top-2 left-2 max-w-[300px] p-1 ">
                        <div className="text-black font-bold font-['Roboto'] text-xl text-center w-full flex flex-row justify-center items-center rounded-t-lg">
                            <span>Concierge</span>
                        </div>
                        <div className=" p-2 ">
                            <KioskAntPlay kiosk_id={`${data?.kiosk?.kiosk_id}-manager`} />
                        </div>
                    </div>
                </Draggable> 
               } 
           </div>
        </div>
    )
}
