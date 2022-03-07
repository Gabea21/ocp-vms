import { useState } from "react";
import KioskAntPublish from "../../components/kiosks/KioskAntPublish";
import {GiAtom} from "react-icons/gi"
import {BiBell} from "react-icons/bi";
import KioskAntPlay from "../../components/kiosks/KioskAntPlay";

export default function index(props) {
    const [showCallPage, setShowCallPage] = useState(false)
    
    return (
        <div>
           <div className="max-w-[800px]">
               {!showCallPage &&
                <div>
                    <div className="flex flex-col items-center">
                        {/* <div className="w-full p-2 flex flex-row justify-center">
                            <img width="50%" height="200px" src="/assets/cap-logo.png" alt="Logo" />
                        </div> */}
                        <span className="text-4xl lg:text-7xl text-white"> Hello,</span>
                        <span className="text-3xl mt-20 lg:text-5xl text-white text-center"> Welcome to  LeCount Garage</span>
                        <div onClick={() => setShowCallPage(true)} className=" mt-24 md:mt-40 lg:mt-44 animate-[pulse_3s_linear_infinite] bg-indigo-800 p-2 shadow-indigo-600 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl">
                            {/* <GiAtom className="text-7xl text-white animate-[spin_3s_linear_infinite]" /> */}
                            <BiBell className="text-7xl text-white " />
                        </div>
                        <div className=" mt-20 md:mt-36 lg:mt-40  ">
                         <span className="text-3xl mt-20 lg:text-5xl text-white text-center">Tap To Call Attendee </span>
                        </div>
                    </div>
                </div>}
                {/* <KioskAntPlay kiosk_id={'concierge-1234'} /> */}
              {showCallPage &&  <KioskAntPublish kiosk_id={'kiosk-1234'} />}
           </div>
        </div>
    )
}
