import useSWR from 'swr';
import { useEffect, useState } from 'react';
import AllKiosksCard from '../../../../components/cards/AllKiosksCard';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }

export default function index(props) {

    const urlKiosks = `/api/kiosks`;
    const urlRooms =`/api/kiosks/rooms/`;


    const { data: kiosksData, error: kiosksErr } = useSWR(urlKiosks, fetcherFunc, {initialProps: props, revalidateOnMount: true, refreshInterval: 1200});
    // const { data: roomsData, error: roomsErr } = useSWR(urlRooms, fetcherFunc, {initialProps: props, revalidateOnMount: true, refreshInterval:2000});

    if (kiosksErr ) return <div>failed to load</div>
    if ( !kiosksData) return <div>loading...</div>
    console.log('Fetched Rooms and Kiosks 🎉  ')
    return (
        <div className="p-4 bg-black min-h-[100vh] overflow-y-auto">
        <div className="sm:flex-row sm:flex ">
                {kiosksData.kiosks.map((kiosk) => {
                        // const matchedRoom = roomsData.rooms.filter((room) => room.roomId === kiosk.kiosk_id)[0]
                    return <div key={kiosk._id} className="m-1 w-full">
                            <AllKiosksCard kiosk={kiosk} />
                        </div>
                    }
                )}
        </div>
        </div>
    )
}
