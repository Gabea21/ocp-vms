import React, { useState, createRef} from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import dateFormat from 'dateformat';
import axios from 'axios'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { IconContext } from "react-icons";
import { BsFillGearFill, BsFillPlayFill, BsPauseFill, BsZoomIn, BsZoomOut, BsGear} from "react-icons/bs";
import { RiFullscreenLine } from 'react-icons/ri';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
export default function CamGridControls(props) {
    const {
        allValues, 
        camera, 
        handleSetPlaybackRate, 
        handleClickFullscreen, 
        handlePlayPause, 
        handleToggleMuted,  
        setShowHls,
        showHls,
    } = props;

   
  return (
      < >

        {/* Top controls */}
        <div
        className="p-1 flex flex-row justify-between items-center "
        >
            <div >
                {/* <span  className='text-white text-xl' >
                Video Title
                </span> */}
            </div>
       
        </div>
       

        {/* bottom controls */}
        <div
        className={"flex flex-col justify-between items-center w-full bg-[rgb(0,0,0,0.6)]"}
        >
        <div  className=" flex flex-row justify-between items-center w-full ">
            <div className='items-center flex flex-row'>
                    <div className='order-1 mx-2 flex flex-row justify-between' >
                   
                        <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                            <div   
                                className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                onClick={() => handlePlayPause()}
                                >
                                    {allValues.playing ? <BsPauseFill size={22} /> :  <BsFillPlayFill size={22} />}
                            </div>
                        </IconContext.Provider>
                        
                        <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                            <div   
                                className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                onClick={() => handleToggleMuted()}
                                >
                                    {allValues.muted ? <MdVolumeOff size={22} />: <MdVolumeUp size={22} />}
                            </div>
                        </IconContext.Provider>
                               
                       
                    </div>
                   
                   
            </div>
   
                <div  className='items-center'>    
                            <div className="flex flex-row justify-between items-center">
                                    <div  className='order-1 mx-2'>
                                        
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
                                        <div  className='order-2 mx-2'>
                                        <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                                            <div   
                                                className=" cursor-pointer  p-1 text-blue-400 font-bold rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                                // onClick={() => handleToggleMuted()}
                                                >
                                                    PTZ
                                            </div>
                                        </IconContext.Provider>
                                    </div>
                                     <div  className='order-3 mx-2'>
                                        <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                                            <div   
                                                className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                                onClick={() => handleClickFullscreen()}
                                                >
                                                    <RiFullscreenLine size={22} />
                                            </div>
                                        </IconContext.Provider>
                                    </div>
                                   
                            </div>

                          
                          
                    </div>
                </div>
     
        </div>
        
               
    </>
    )
}