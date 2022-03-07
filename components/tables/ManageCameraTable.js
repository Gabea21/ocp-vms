import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {BsTrash} from 'react-icons/bs'
import { GiCctvCamera } from "react-icons/gi";
import { useAuthContext } from '../../contexts/AuthContext';
import CameraService from '../services/CameraService';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function ManageCameraTable(props) {
    const  auth  = useAuthContext() // MenuContext object.
    const {cameras, locationFilter,setOpen} = props;
    const [loadedCameras, setLoadedCameras] = useState([]);
    const [camPreviews, setCamPreviews] = useState([])
    const [loaded, setLoaded] = useState(false);

    const getCamPreview = async(cam) => {
        try{
           
            const res =  await axios.get(`/api/cameras/live?id=${cam._id}&key=imageSingle`)
            let imagePreview = res.data.events
            return imagePreview
            
        }catch(err){
            console.log(err)
        }
    }
 

    useEffect(() => {
        const fetchCameras = async () => {
            const res = await CameraService.getAllCamera()
            if(res.data.success){
                const resultArray = async () => {
                    const resArr = await Promise.all(res.data.cameras.map(async (cam) => getCamPreview(cam)));
                    return resArr
                }  
                resultArray().then((result) => {
                    console.log(result)
                    setCamPreviews(result)
                    setLoadedCameras(res.data.cameras)

                } )
            }
        }
        fetchCameras()
    }, [])
 

    if(!loadedCameras.length > 0) {
        return <h1>Loading....</h1>
    }
    console.log(loadedCameras)
    return (
        <div className="flex flex-col mt-4">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Camera
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                             Location
                            </th>
                            {/* <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Smart Ai
                            </th> */}
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Controller
                            </th>
             
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loadedCameras.filter((val) => {
                            if(locationFilter  === ''){
                                return val
                            } else if ( val.location?.toLowerCase().includes(locationFilter?.toLowerCase()) ){
                                return val
                            }}).map((cam,idx) => {
                                // const resultArray = async () => {
                                //     const resArr = await Promise.all(loadedCameras.map(async (cam) => getCamPreview(cam)));
                                //     console.log(resArr)
                                //     return resArr
                                // }
                                // resultArray()
                            return <tr key={cam._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-start">
                                                    {cam.vxg.rec === "off" ? (
                                                      <GiCctvCamera size={30} />
                                                    ):(
                                                        <div className=" cursor-pointer border-2 border-blue-500 bg-black flex flex-col justify-center items-center">
                                                            <Link  href={`/app/cameras/${cam._id}`}>
                                                                <img width="160px" height="130px" src={camPreviews[idx]?.url} alt={cam.name} className="object-cover" />
                                                            </Link>
                                                        </div> 
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-md  font-medium text-gray-900">{cam.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="px-2 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {cam.location}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            {cam.aiEnabled ?
                                                <span className="px-2 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    Ai Enabled
                                                </span>
                                                :
                                                ' Ai Disabled'
                                            }
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link  href={`/app/cameras/${cam._id}`}>  
                                            <span className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full  bg-blue-300 text-blue-800">
                                                View
                                            </span>
                                        </Link>
                                        </td>
                                        
                                    </tr>
                            })}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
