import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import WebRelayControlModal from "../modal/WebRelayControlModal";
import WebRelayService from "../services/WebRelayService";


async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function WebrelayListTable(props) {
      const {locationFilter,searchItem} = props;
      const [viewWebRelay, setViewWebRelay] = useState(false);
      const [selectedWebRelay, setSelectedWebRelay] = useState(null)
      const {mutate} = useSWRConfig()

      const handleViewWebRelay = (e,webrelay) => {
          e.preventDefault()
          setSelectedWebRelay(webrelay)
          setViewWebRelay(true)
      }
     const handleDeleteWebRelay = async (e,webrelay) => {
        const deleteWebrelay = await WebRelayService.deleteWebRelay(webrelay._id);
        mutate("/api/webrelays?action=retrieve&action_type=all")

    }
      const url = '/api/webrelays?action=retrieve&action_type=all';
      const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
      if (error) return <div>failed to load</div>
      if (!data) return <div>loading...</div>
    //   console.log(data)
      
    return (
        <div>
            <div className="flex flex-col">
                {viewWebRelay && selectedWebRelay && <WebRelayControlModal open={viewWebRelay} setOpen={setViewWebRelay} webrelay={selectedWebRelay} />}
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
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Location
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                View
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Edit
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Delete
                            </th>
                           
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.webrelays.filter((val) => {
                            if(locationFilter  === ''){
                                return val
                            } else if ( val.location?.toLowerCase().includes(locationFilter.toLowerCase()) ){
                                return val
                            }}).filter((val) => {
                                if(searchItem === ''){
                                    return val
                                } else if ( val.name?.toLowerCase().replaceAll('-', '').includes(searchItem.toLowerCase()) || val.location?.toLowerCase().replaceAll('-', '').includes(searchItem.toLowerCase()) ){
                                    return val
                                }}).map((webrelay) => (
                            <tr key={webrelay._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                        {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-md font-medium text-gray-900">{webrelay.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {webrelay.location}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span onClick={(e) => handleViewWebRelay(e,webrelay)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-blue-300 text-blue-800">
                                        View
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                        Edit
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span onClick={(e) => handleDeleteWebRelay(e,webrelay)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-rose-200 text-rose-800">
                                        Delete
                                    </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
