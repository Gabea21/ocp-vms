import useSWR, { useSWRConfig } from "swr";
import axios from 'axios';
import {AiFillUnlock,AiFillLock} from "react-icons/ai";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function WebRelayQuadOldKioskControl(props) {
    const {webrelay} = props;
    const {mutate} = useSWRConfig()

    const handleToggleOn = async(e,relay) => {
        e.preventDefault()
        try{
            const res = await axios.get(`/api/webrelays?action=toggle&action_type=on&id=${webrelay._id}&relay_id=${relay}`)
            console.log('Trigger On Success')
            mutate(`/api/webrelays?action=state&id=${webrelay._id}`)
        }catch(error){
            alert('Controller Connection Error')
            console.log(error)
        }
    }
    const handleToggleOff = async(e,relay) => {
        e.preventDefault()
        try{
            const res = await axios.get(`/api/webrelays?action=toggle&action_type=pulse&id=${webrelay._id}&relay_id=${relay}`)
            console.log('Trigger Off Success')
            mutate(`/api/webrelays?action=state&id=${webrelay._id}`)
        }catch(error){
            console.log(error)
        }
    }
    const handleTogglePulse = async(e,relay) => {
        e.preventDefault()
        try{
            const res = await axios.get(`/api/webrelays?action=toggle&action_type=off&id=${webrelay._id}&relay_id=${relay}`)
            console.log('Trigger Pulse Success')
            mutate(`/api/webrelays?action=state&id=${webrelay._id}`)
        }catch(error){
            console.log(error)
        }
    }

    const { data, error } = useSWR(`/api/webrelays?action=state&id=${webrelay?._id}`, fetcherFunc, {revalidateOnMount:true, refreshInterval: 1000 })
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    if(!data.success) return <div>Loading Controller...</div> // ToDo: Warning Modal for Catch Wrong IP Error 
    console.log(data)
    return (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 bg-white px-5   ">
            {webrelay.relays.map((relay,idx) => (
                    <a
                    key={idx}
                    className="my-1  p-3  flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 border-2 border-blue-600"
                    >
                        <div className="mx-1 w-full">
                            <div className="flex flex-col justify-between w-full">
                                <div className="flex flex-col justify-between">
                                    <p className=" text-2xl font-medium text-gray-900">
                                        {relay.name}
                                    </p>
                                    <div className="mb-12">
                                        {data.webrelay[idx][1][0] === '1' || data.webrelay[idx][1][0] === 1 ? 
                                            <p className="mt-1 flex flex-row whitespace-pretext-2xl lg:text-2xl  decoration-double decoration-green-300 underline  text-gray-500 ">
                                            <AiFillUnlock className="mr-2 pt-1 " size={34}/> Open
                                            </p>
                                            : 
                                            <p className="mt-1 flex flex-row  text-2xl lg:text-2xl  decoration-double decoration-rose-300 underline  text-gray-500 ">
                                                <AiFillLock className="mr-2 pt-1 " size={34} /> Closed
                                            </p>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col cursor-pointer ">
                                    <div className="flex flex-row justify-between cursor-pointer ">
                                        <div onClick={(e) => handleToggleOn(e,relay.relay_id)} className="h-full text-center my-1 rounded-sm px-2 md:px-4 text-xl  max-h-[4rem] bg-green-400 text-green-700 p-1 hover:bg-opacity-70">
                                            OPEN
                                        </div>
                        
                                        <div onClick={(e) => handleTogglePulse(e,relay.relay_id)} className="h-full text-center my-1 rounded-sm  px-2 md:px-4 text-xl  max-h-[4rem] bg-rose-400 text-rose-700 p-1 hover:bg-opacity-70">
                                            LOCK
                                        </div>
                                    </div>
                                    <div onClick={(e) => handleToggleOff(e,relay.relay_id)} className="h-full text-center my-1 rounded-sm px-2 md:px-4 text-xl  max-h-[4rem] bg-orange-300 text-orange-700 p-1 hover:bg-opacity-70">
                                        Door Hold
                                    </div>
                                </div>
                            </div> 

                            {/* Use Device Relay State Hook */}
                           


                        </div>
                    </a>
                ))}
        </div>
    )
}
