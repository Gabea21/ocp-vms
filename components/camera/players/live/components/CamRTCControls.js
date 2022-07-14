import React, { useState, createRef} from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import dateFormat from 'dateformat';
import axios from 'axios'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { IconContext } from "react-icons";
import { BsFillGearFill, BsFillPlayFill, BsPauseFill, BsZoomIn, BsZoomOut, BsGear} from "react-icons/bs";
import { RiFullscreenLine } from 'react-icons/ri';
import { FiShare } from "react-icons/fi";
import { VscTriangleLeft, VscTriangleRight, VscTriangleUp, VscTriangleDown } from 'react-icons/vsc';
// import moveCamera from '../../../hooks/camera/moveCamera';
// import moveCamera from '../../../hooks/camera/moveCamera';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
export default function CamRTCControls(props) {
    const {
        allValues, 
        camera, 
        handleClickFullscreen, 
        handlePlayPause, 
        handleToggleMuted,  
        setShowHls,
        showHls,
    } = props;
    const [popoverShow, setPopoverShow] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const btnRef = createRef();
    const popoverRef = createRef();

    const handleShowShareModal = () => {
        console.log('Show Share Modal')
        setShowShareModal(true)

    }
    const handleShowAddArchiveModal = () => {
        console.log('Show Archive Modal')
        setShowArchiveModal(true)

    }
    const handleDownload = (url, filename) => {
        axios.get(url, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, filename)
        })
    }

    const handlePTZ = async({direction})  => {
        //Compass Style Controls
        let valueX = 0
        let valueY = 0
        let valueZ = 0

        if(direction === 'north'){
            console.log('Move North')
            valueX= 0
            valueY=1.0
            valueZ=0 
        }else if(direction === 'northEast'){
            console.log('Move NorthEast')
            valueX= 0.5
            valueY= 0.5
            valueZ=0
        }else if(direction === 'east'){
            console.log('Move East')
            valueX= 1.0
            valueY=0
            valueZ=0
        }else if(direction === 'southEast'){
            console.log('Move SouthEast')
            valueX= 0.5
            valueY= -0.5
            valueZ=0
        }else if(direction === 'south'){
            console.log('Move South')
            valueX= 0
            valueY=-1.0
            valueZ=0
        }else if(direction === 'southWest'){
            console.log('Move SouthWest')
            valueX= -0.5
            valueY= -0.5
            valueZ= 0
        }else if(direction === 'west'){
            console.log('Move West')
            valueX= -1.0
            valueY= 0
            valueZ= 0
        }else if (direction === 'northWest'){
            console.log('North West')
            valueX= -0.5
            valueY= 0.5
            valueZ= 0
        }else if (direction === 'zoomIn'){
            console.log('PTZ Zoom In')
            valueX= 0
            valueY= 0
            valueZ= 0.25
        }else if (direction === 'zoomOut'){
            console.log('PTZ Zoom Out')
            valueX= 0
            valueY= 0
            valueZ= -0.25
        }
        try{
            // const apiRes = await moveCamera({streamId: camera?.antStreamId, valueX: valueX,  valueY:  valueY , valueZ:  valueZ, movement:'relative' })
            console.log(apiRes.data)
        }catch(err){
            console.log('PTZ Error',err)
        }

    }
  return (
      <>
      {/* <ShareCameraModal open={showShareModal} setOpen={setShowShareModal} camera={camera}/>
      <ArchiveVodClipModal open={showArchiveModal} setOpen={setShowArchiveModal} camera={camera}/> */}
      
        {/* Top controls */}
        <div
        className=" flex flex-row justify-between items-center absolute top-0 "
        >
        {/* <div >
            <span  className='text-white text-xl' >
             {camera?.name}
            </span>
        </div> */}
        </div>
       

        {/* bottom controls */}
        <div
        className=" absolute bottom-0 flex flex-col justify-between items-center w-full  "
        >
        <div  className=" flex flex-row justify-between items-center w-full bg-black bg-opacity-40 pt-2">
            <div className=' flex flex-row items-center'>
                    <div className='mx-2 flex flex-row justify-between' >
                   
                         <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                            <div   
                                className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                                onClick={() => handlePlayPause()}
                                >
                                    {allValues.isPlaying ? <BsPauseFill size={22} /> :  <BsFillPlayFill size={22} />}
                            </div>
                        </IconContext.Provider>
                         
                        <IconContext.Provider disabled value={{ color: "white", className: "global-classname" }}  >
                            <div   
                                className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                onClick={() => handleToggleMuted()}
                                >
                                    {allValues.muted ? <MdVolumeOff size={22} />: <MdVolumeUp size={22} />}
                            </div>
                        </IconContext.Provider>
                               
                       
                    </div>
            </div>
   
                <div className="flex flex-row justify-between items-center   ">
                        <div  className='mx-1'>
                            
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex justify-center items-center w-full rounded-m shadow-sm   text-lg font-medium text-white">
                                            <BsGear size={22} />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-bottom-right absolute bottom-2 right-4 mt-2 w-32 border-r-4 border-orange-300 rounded-md shadow-lg bg-white  focus:outline-none">
                                        <div className="">
                                                    <Menu.Item >
                                                {({ active }) => (
                                                    <button
                                                    href="#"
                                                    onClick={() => setShowHls(false)}
                                                    className={classNames(
                                                        !showHls ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block px-2 py-2 text-md w-full'
                                                    )}
                                                    >
                                                    Low-Latency
                                                    </button>
                                                )}
                                                </Menu.Item>
                                                <Menu.Item >
                                                {({ active }) => (
                                                    <button
                                                    href="#"
                                                    onClick={() => setShowHls(true)}
                                                    className={classNames(
                                                        showHls ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block px-4 py-2 text-md w-full'
                                                    )}
                                                    >
                                                    Reliable HLS
                                                    </button>
                                                )}
                                                </Menu.Item>
                                        </div>
                                        </Menu.Items>
                                    </Transition>
                                    </Menu>
                            </div>
                          {camera.isPTZ &&  <div  className=' mx-2'>
                            <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex justify-center items-center w-full rounded-m shadow-sm   text-lg  text-blue-500 font-bold">
                                           PTZ
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-bottom-right p-1 absolute bottom-2 right-0 sm:right-4 mt-2 w-52 h-32 border-t-4 border-blue-500 rounded-md shadow-lg bg-[#000000ab] focus:outline-none">
                                        <div className="flex flex-col w-full">
                                               <div className="flex flex-row w-full justify-between ">
                                                        <div className="flex flex-col w-[50%] ">
                                                            <span  className='text-gray-500'>Pan {'&'} Tilt</span>
                                                            <div className='p-[0.5rem] flex flex-col relative items-center justify-between h-full text-white '>
                                                               
                                                                <div className='flex flex-row justify-evenly w-full '>
                                                                     <VscTriangleUp onClick={() => handlePTZ({direction:'northWest'})}  size={24} className='-rotate-45 cursor-pointer hover:text-blue-500'/>
                                                                        <VscTriangleUp onClick={() => handlePTZ({direction:'north'})} size={24}  className='cursor-pointer  hover:text-blue-500'/>
                                                                    <VscTriangleUp onClick={() => handlePTZ({direction:'northEast'})} size={24} className='rotate-45 cursor-pointer  hover:text-blue-500'/>
                                                               </div>
                                                               <div className='flex flex-row justify-between w-full   '>
                                                                   <VscTriangleLeft onClick={() => handlePTZ({direction:'west'})} size={24}   className='cursor-pointer  hover:text-blue-500'/>
                                                                   <div className='rounded-full bg-gray-600 text-xs p-1 cursor-pointer  hover:text-blue-500'>
                                                                        RESET
                                                                   </div>
                                                                   <VscTriangleRight  onClick={() => handlePTZ({direction:'east'})} size={24}  className='cursor-pointer hover:text-blue-500'/>
                                                               </div>
                                                               <div   className='flex flex-row justify-evenly w-full '>
                                                                   <VscTriangleDown onClick={() => handlePTZ({direction:'southWest'})} size={24} className='rotate-45 cursor-pointer  hover:text-blue-500'/>
                                                                     <VscTriangleDown onClick={() => handlePTZ({direction:'south'})} size={24} className='cursor-pointer  hover:text-blue-500'/>
                                                                    <VscTriangleDown onClick={() => handlePTZ({direction:'southEast'})} size={24} className='-rotate-45 cursor-pointer  hover:text-blue-500'/>
                                                               </div>

                                                            </div>

                                                        </div>
                                                        <div className="flex flex-col w-[50%]">
                                                            <span className='text-gray-500'>Zoom</span>
                                                            <div  className="flex flex-row w-full justify-evenly p-1">
                                                                <div  onClick={() => handlePTZ({direction:'zoomOut'})} className='p-1 cursor-pointer px-3 rounded bg-gray-600 text-white '>
                                                                    -
                                                                </div>
                                                                <div onClick={() => handlePTZ({direction:'zoomIn'})} className='p-1 cursor-pointer px-3 rounded text-white bg-gray-600   '>
                                                                    +
                                                                </div>
                                                            </div>
                                                            <span  className='text-gray-500'>Focus</span>
                                                            <div  className="flex flex-row w-full justify-evenly p-1">
                                                            <div className='p-1 px-3 rounded bg-gray-600  text-white  '>
                                                                    -
                                                                </div>
                                                                <div className='p-1 px-3 rounded text-white bg-gray-600  '>
                                                                    +
                                                                </div>
                                                            </div>
                                                        </div>
                                               </div>
                                        </div>
                                        </Menu.Items>
                                    </Transition>
                                    </Menu>
                            </div>}
                            <div  className=' mx-1'>
                                <IconContext.Provider  value={{ color: "white", className: "global-classname" }}  >
                                    <div   
                                    onClick={() => handleClickFullscreen()}
                                        className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                                        >
                                            <RiFullscreenLine size={22} />
                                    </div>
                                </IconContext.Provider>
                            </div>
                </div>
            </div>
     
        </div>
        
               
    </>
    )
}