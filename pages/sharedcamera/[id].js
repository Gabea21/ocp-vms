import { useRouter } from 'next/router'
import React from 'react'
import useSWR from "swr";
import CamSharedPlayer from '../../components/camera/players/CamSharedPlayer'
import ExpiredCamPage from '../../components/ExpiredCamPage';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function id(props) {
    const router = useRouter()

    const url =`/api/cameras/share/${router.query.id}`;
    const { data,error } = useSWR(router.query.id ? url : null, fetcherFunc, {initialProps: props});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    if(new Date(data?.expiration) < new Date ()) return <ExpiredCamPage />
    console.log('Fetched Shared Cam 🎉 ')
    return (
        <div className="bg-black min-h-[100vh]">
            <CamSharedPlayer camera={data.camera} />
        </div>
    )
}
