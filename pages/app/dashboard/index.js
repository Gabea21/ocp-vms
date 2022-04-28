import useSWR from 'swr';
import { useEffect, useState } from 'react';
import WebRelayService from '../../../components/services/WebRelayService';
import KioskControlCard from '../../../components/cards/KioskControlCard';
import CamResponsivePlayer from '../../../components/camera/players/CamResponsivePlayer';
import CamLive from '../../../components/camera/players/live/CamLive';

import ManageCameraTable from '../../../components/tables/ManageCameraTable';
import MainDashCameras from '../../../components/tables/MainDashCameras';
import MainDashWebrelays from '../../../components/tables/MainDashWebrelays';
import WebRelayQuadOldKioskControl from '../../../components/section/WebRelayQuadOldKioskControl';
import WebRelayX410KioskControl from '../../../components/section/WebRelayX410KioskControl';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function dashboard(props) {
    const [selectedLocation, setSelectedLocation] = useState('')
    const [searchItem, setSearchItem] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('cameras')
    const [selectedWebrelay, setSelectedWebrelay] = useState(null);
    const [selectedCamera, setSelectedCamera] = useState(null)
    const handleSelectDevice = (e) => {
        setSelectedDevice(e.target.value)
    }
    console.log(selectedCamera)
    const url =`/api/cameras`;
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    console.log('Fetched Cameras', data)
    return (
        <div className="min-h-[100vh] bg-gray-50 rounded">
            
           <div className="flex flex-col lg:flex-row lg:justify-evenly py-4"> 
                <div className="relative rounded-lg  px-4 flex flex-col items-center justify-center sm:max-w-[650px] lg:max-w-[750px]">
                  {/* <CamResponsivePlayer camera={ selectedCamera ?  selectedCamera : data.cameras[0]  }/>  */}
                  <CamLive  camera={ selectedCamera ?  selectedCamera : data.cameras[0]}/>
                    {/* <button className="bg-white bg-opacity-30 rounded-full top-2 left-4 px-1 absolute backdrop-blur-sm">Open Full</button> */}
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-center  ">
                    <span className="text-2xl lg:text-3xl my-2 font-bold"> Main Control</span>
                    {selectedWebrelay && selectedWebrelay?.model === 'Quad_OLD' && <WebRelayQuadOldKioskControl webrelay={selectedWebrelay} />}
                    {selectedWebrelay && (selectedWebrelay?.model === 'X410' || selectedWebrelay?.model === 'X401') && <WebRelayX410KioskControl webrelay={selectedWebrelay} />}
                </div>
           </div>
           <div>
               <div className="flex flex-col lg:flex-row ">
                   <div className= "flex flex-col lg:w-[20%] item-center justify-start px-1 shadow-xl">
                       <button onClick={(e) => handleSelectDevice(e)} 
                            value="cameras" 
                            className={selectedDevice === 'cameras' ? 
                            " font-bold py-[0.6rem] rounded-full bg-black text-white text-xl text-center"
                            :"font-bold  my-2 py-[0.6rem]  rounded-full bg-gray-300 text-black text-xl text-center"}> 
                                Cameras
                        </button>
                       <button onClick={(e) => handleSelectDevice(e)} 
                            value="access" 
                            className={selectedDevice === 'access' ? 
                                "font-bold py-[0.6rem] rounded-full bg-black text-white text-xl text-center"
                                :"font-bold my-2 py-[0.6rem]  rounded-full bg-gray-300 text-black text-xl text-center"}> 
                                Access Control
                            </button>
                   </div>
                   <div className="lg:w-[80%] px-4 ">
                    <div className="m-4 max-w-[300px] flex flex-row">
                        <div className="flex flex-row items-center">
                            <input
                                type="searchDevices"
                                name="searchDevices"
                                id="searchDevices"
                                onChange={ (e) => setSearchItem(e.target.value) }
                                className=" mt-1 block w-full shadow-lg pl-3 pr-10 py-2 text-base focus:ring-blue-500 focus:border-blue-500 sm:text-xl border-gray-300 rounded-md"
                                placeholder="Search Devices"
                            />
                        </div>
                    </div>
                    {selectedDevice === 'cameras' && <MainDashCameras  locationFilter={selectedLocation} searchItem={searchItem} setMainCamera={setSelectedCamera} mainCamera={selectedCamera ? selectedCamera : data.cameras[0]}/>}
                    {selectedDevice === 'access' && <MainDashWebrelays  locationFilter={selectedLocation} searchItem={searchItem} setMainWebrelay={setSelectedWebrelay} mainWebrelay={selectedWebrelay}/>}

                   </div>

               </div>
           </div>
            
        </div>
    )
}
