import { useEffect, useState } from "react";
import CamAntPublish from "../../components/camera/players/CamAntPublish";
import CamSinglePlayer from "../../components/camera/players/CamSinglePlayer";

export default function conference(props) {
   
   

    return (
        <div>
            <div className="flex flex-col items-center justify-start">
                <span>Your Video</span>
                <div className="lg:max-w-3xl bg-white p-1 rounded-xl">
                 <CamAntPublish stream_id={'lobby1'} />
                </div>
                <span>Peer</span>
               <div className=" md:fixed top-0 left-10 max-w-[300px] shadow-2xl shadow-white-300">
                 <CamSinglePlayer  camera={camera}/>
               </div>
              
            </div>
        </div>
    )
}
