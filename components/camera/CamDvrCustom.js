import { createRef, useContext, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios';
import dateformat from 'dateformat';
import ReactPlayer from 'react-player'
import Link from 'next/link';
import DvrTimelineCard from '../cards/DvrTimelineCard';
import captureVideoFrame from "capture-video-frame";
import { AiFillCamera,  } from "react-icons/ai";
import { BsBookmark , BsBookmarkFill, BsFillShareFill } from "react-icons/bs";
import CameraService from '../services/CameraService';
import { useAuthContext } from '../../contexts/AuthContext';

export default function CamDvrCustom(props) {
    const {camera,  options, onReady  } = props
    const  auth  = useAuthContext() // MenuContext object.
    const [loadedLiveUrls, setLoadedLiveUrls] = useState(false);
    const [loadedBounds, setLoadedBounds] = useState(false)
    const [calenderBounds, setCalenderBounds] = useState(null);
    const [watch, setWatch] = useState([]);
    const [dates, setDates] = useState([]);
    const [vidSrcArr, setVidSrcArr] = useState([]);
    const [playerLoaded, setPlayerLoaded] = useState(false)
    const [loadError, setLoadError] = useState(false);
    const [viewDayTimeline, setViewDayTimeline] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null); // Selected Daily Recording
    const [clipDuration, setClipDuration] = useState(0); // Loaded Src Clip Duration
    const [selectedInterval, setSelectedInterval] = useState([]); // DVR interval
    const [currentInterval, setCurrentInterval] = useState(null); // DVR Interval Highlight
    const [videoScreenshot, setVideoScreenshot] = useState(null) //Video Screenshot
    const [dvrPosition, setDvrPosition] = useState(0);
    const timelineRef = useRef(null)
    const videoRef = useRef()
    const [showExpireOptions, setShowExpireOptions] = useState(false);
    const [showArchiveOptions, setShowArchiveOptions] = useState(false);
    const [expirationDate, setExpirationDate] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [camShareUrl, setCamShareUrl] = useState('');

    
     //Player Config
    const [allValues, setAllValues] = useState({
        pip: true,
        controls: true,
        light: false,
        volume: 0.8,
        muted: false,
        played:0,
        loaded:0,
        duration:0,
        playbackRate: 1.0,
        loop: true,
        seeking: false
        });

    
    // Fetch HLS URL from Recording Server (4-12 second delayed Stream)
    // useEffect(() => {
    //     const url =`/api/cameras/live?id=${camera._id}&key=watch`;
    //     axios.get(url)
    //       .then((res) =>{
    //         if(res.data.success){
    //             console.log(res.data) 
    //             setWatch(res.data.watch)
    //             setVidSrcArr(res.data.watch)
    //             setLoadedLiveUrls(true)
    //             everyNminutes(1) // Prepare timeline intervals
    //         }
            
    //       }).catch((err) => { 
    //           console.log(err); 
    //           setLoadError(true);
    //       })
    //   }, [])


    // Fetch Recording Calender Bounds
    useEffect(() => {
        const url =`/api/cameras/storage?id=${camera._id}&key=calender`;
        axios.get(url)
          .then((res) =>{
            console.log(res.data)
            setCalenderBounds(res.data.calender.objects)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
    }, [])
    
    function parseDate(str) {
        var mdy = str.split('-');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }
    function datediff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }
    // Set Dates of Recordings
    useEffect(() => {
       if(calenderBounds?.length){
        const start = new Date(calenderBounds[0]+'z') 
        const end = new Date(calenderBounds[1] +'z')    
         const daysBetween = datediff(parseDate(dateformat(start,"mm-dd-yyyy")), parseDate(dateformat(end,"mm-dd-yyyy"))) 
        const arr = [];
        for (let i = 0; i <= daysBetween ; i++) {
          const temp = new Date(parseDate(dateformat(start,"mm-dd-yyyy")));
          temp.setDate(temp.getDate() + i);
          arr.push(temp);
        }
        setDates(arr);
        setLoadedBounds(true)
       }
    }, [calenderBounds]);
    
    useEffect(() => {
        // Start Viewing From Beggining of Recorded 
        if(loadedBounds){
            handleFetchStartDate(new Date(calenderBounds[0] +'z'))
        }
       
    }, [loadedBounds])

    // Handle Load DVR Start
    const handleFetchStartDate = (date) => {
        setSelectedDay(dateformat(date,  'yyyy-mm-dd'))
        let resArr = []
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start: calenderBounds[0]  // Send Calender Bounds in UTC TimeZone
        })
          .then((res) =>{
            if(res.data.success){
                console.log('Fetched Start File')
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                })
            }
            setVidSrcArr(resArr)
            // console.log(resArr)
            setCurrentInterval(dateformat(resArr[0]?.start, "HH:MM"))
            setViewDayTimeline(true)

          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
         })
         setLoadedLiveUrls(true)
         setLoadedBounds(true)
    }   

    // Handle Click Start Date
    const handleClickStartDate = (date) => {
        handleDeselectDay() // Clear DVR STATE
        setSelectedDay(dateformat(date, 'yyyy-mm-dd'))
        let resArr = []
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start: calenderBounds[0]  // Send Calender Bounds in UTC TimeZone
        })
          .then((res) =>{
            if(res.data.success){
                console.log('Fetched Start File')
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                })
            }
            setVidSrcArr(resArr)
            setCurrentInterval(dateformat(new Date(calenderBounds[0] + 'z'), 'HH:MM' ))
            setViewDayTimeline(true)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
         })
    } 

    // Handle Click Between Date
    const handleClickDate = (date) => {
        handleDeselectDay() // Clear DVR STATE
        let resArr = []
        setSelectedDay(dateformat(date, 'yyyy-mm-dd'))
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start:  dateformat(date, 'yyyy-mm-dd') +'T05:00:00' // Add 5 Hours to correct Est TimeZone Offset (GMT -05:00) 
        })
          .then((res) =>{
            if(res.data.success){
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                }) 
            }
            setVidSrcArr(resArr) // Should Begin at 00:00 interval of selected day
            setCurrentInterval(dateformat(resArr[0].start, "HH:MM"))
            setViewDayTimeline(true)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
    }  
   
    // Clear Intervals/Day
    const handleDeselectDay = () => {
        setViewDayTimeline(false);
        setSelectedDay(null);
        setSelectedInterval([])
        setCurrentInterval(null)
    } 

    
    ////// DVR Timeline Functions

    ///Fetch DVR Video Interval Clicked
    const handleClickDvrDate = (interval) => {
        let resArr = []
        let fetchTime = ''
        let earlyBound = new Date(calenderBounds[0]+'z')
        let endBound = new Date(calenderBounds[1]+'z')
        let dvrDateClicked =  new Date(selectedDay+'T'+ interval)
        if( dvrDateClicked < earlyBound){
            console.log('Ran Click Before Start Bound')
            fetchTime = earlyBound
        }else if( dvrDateClicked > endBound){
            console.log('Ran Click After End Bound')
            fetchTime = endBound
        }else{
            console.log('Ran Within Bounds')
            fetchTime = dateformat(new Date(selectedDay +'T'+ interval+':00').toUTCString(), 'isoDateTime' )  // Convert to UTC
        }
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start: fetchTime
        }).then((res) =>{
            if(res.data.success){
                console.log('Fetched Start File')
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                }) 
            }
            setVidSrcArr(resArr)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
     }
   
    //////////////////////// DVR OTHER-Video-Controls////////////////
    // Handle Screenshot Click
    const handleScreenshot = () => {
        const frame = captureVideoFrame(videoRef.current.getInternalPlayer())
        console.log('frame',frame)
        setVideoScreenshot(frame.blob)
    }
    //Download Screenshot 
    useEffect(() => {
       if(videoScreenshot){
        console.log('ran screenshot')
        let a = document.createElement("a"); //Create <a>
        a.download = `${dateformat(new Date(vidSrcArr[0]?.start + 'z'), 'mm/dd/yyyy hh:MM TT' )}-${dateformat(new Date(vidSrcArr[0]?.end + 'z'), 'mm/dd/yyyy hh:MM TT' )}`; //File name Here
        a.href = URL.createObjectURL(videoScreenshot);
        a.click();
       }
        return () => {
            setVideoScreenshot(null)
        }
    }, [videoScreenshot])


     // Handle Archive Clip Toggle
    //  const archiveToggle = () => {
    //     setShowExpireOptions(false)
    //     setShowArchiveOptions(!showArchiveOptions)
    // }

    // Handle Share URL Toggle
    const shareToggle = () => {
        setShowArchiveOptions(false)
        setShowExpireOptions(!showExpireOptions)
    }

    ////////// Handle Create URL///////
    const handleShowLink = async(e) => {
        e.preventDefault()
        // setShowExpireOptions(true)
        if(e.target.value === '0'){
            return console.log('no time selected')
        }
        const date = new Date()
        const secondsFromNow =  60 * Number(e.target.value) * 60 ;
        const expiration =  new Date(date.getTime() + 60 * Number(e.target.value) * 60000)  // 60 min * Hours & 60k for milliseconds
        setExpirationDate(expiration)
        setCurrentDate(date)
        try{
            // TO Do Change to Share Clip not Camera
            //let currViewing = dateformat(new Date(vidSrcArr[currentUrlIndex]?.start + 'z'), ' hh:MM:ss TT' )
            const apiRes = await CameraService.createShareUrl(expiration,camera, secondsFromNow )
            if(apiRes.data.success){
                console.log('Created Share URL 🎉 ', apiRes.data)
                setCamShareUrl(`${process.env.NEXT_PUBLIC_APP_URL}/sharedcamera/${apiRes.data.hash_id}`)
                // setShowExpireOptions(false)
            }
        }catch(err){
            // alert('Create Share URL Err')
            console.log('Create Share URL Err', err)
        }
    }
////////////////////////////////////////////////


    ///////////////////////////// Video Player Callbacks //////////////////////
    const handleProgress = state => {
        // console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!allValues.seeking) {
          setAllValues(allValues)
        }
      }

    const handleDuration = (duration) => {
        // console.log('onDuration', duration)
        setClipDuration(duration)
        setAllValues( prevValues => {
          return { ...prevValues, duration: duration}
        })
      }

    const [currentUrlIndex, setCurrentUrlIndex] = useState(0)

    const handleEnded = () => {
        console.log('onEnded')
        // setCurrentUrlIndex(
        //     prevUrlIndex => (prevUrlIndex + 1) % vidSrcArr.length
        //   )
        // // setAllValues( prevValues => {
        // //   return { ...prevValues, playing: allValues.loop}
        // // })
    }

    // console.log(camShareUrl)
    if(!loadedBounds ) return <h1>Searching For Recordings...</h1>
    return (
        <>
        <div>
            <div className="flex flex-row justify-start font-bold">  Today  {dateformat(new Date(), 'mm/dd/yyyy ') } </div>
             {/* <span className="text-gray-700 text-md flex flex-row justify-start mt-1">Select Day</span> */}
                <div className="cursor-pointer flex flex-row justify-between mb-4 mt-2 overflow-x-auto">
                    {dates.map((date,idx) => {
                        return <div 
                            key={date} onClick={ idx === 0 ? 
                                () => handleClickStartDate(date) 
                                : () => handleClickDate(date)}
                            className={ selectedDay === dateformat(date, 'yyyy-mm-dd')?  "border-4 bg-blue-200 border-blue-500 m-1 p-1 rounded-xl": "border-2 border-blue-500 m-1 p-1 rounded-xl"}
                            > {dateformat(date, 'mm/dd/yyyy ') } 
                        </div>
                    })}
                </div>
            
                { vidSrcArr.length && 
                <div className="flex flex-row justify-between text-lg text-white rounded-t-lg  w-full bg-black p-1 ">
                    <div className="flex flex-row  ">
                            <span className="font-bold mr-2 ">Start:</span> 
                            <span> {dateformat(new Date(vidSrcArr[currentUrlIndex]?.start + 'z'), ' hh:MM:ss TT' ) }</span>
                    </div>

                    <div  className="flex flex-row  ">
                            <span className="font-bold mr-2 ">End:</span> 
                            <span> { dateformat(new Date(vidSrcArr[currentUrlIndex]?.end + 'z'), ' hh:MM:ss TT' ) }</span>
                    </div>
                </div>
                    }
                
            <div className="bg-black p-1  rounded-b" >
                {!showExpireOptions && <div >
                    <ReactPlayer  width="100%" height="100%" 
                        ref={ (video) => videoRef.current = video}
                        playing={loadedLiveUrls ? true : false}  
                        // url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr} 
                        url={vidSrcArr[currentUrlIndex]?.src} 
                        onBuffer={() => {console.log('Buffering')}}
                        onBufferEnd={() => {console.log('Buffering Ended')}}
                        onError={(e) => { console.log('error',e)}}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onEnded={handleEnded}
                        onSeek={e => console.log('onSeek', e)}
                        pip={allValues.pip}
                        controls={allValues.controls}
                        light={allValues.light}
                        loop={allValues.loop}
                        playbackRate={allValues.playbackRate}
                        volume={allValues.volume}
                        muted={allValues.muted}
                        onReady={() => {console.log('onReady'); setPlayerLoaded(true)}}
                        onStart={() => console.log('onStart')}
                        config={{ file: { attributes: { //Allows screenshot
                            crossOrigin: 'anonymous'
                          }}}}
                    />
                </div>}
                {viewDayTimeline && selectedDay && playerLoaded &&
                    <DvrTimelineCard currentInterval={currentInterval} setCurrentInterval={setCurrentInterval} setSelectedInterval={setSelectedInterval} selectedInterval={selectedInterval} handleClickDvrDate={handleClickDvrDate} calenderBounds={calenderBounds} selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
                }   
            </div>
                 <div className="my-2 w-full flex flex-row justify-start items-center">
                    <div onClick={() => handleScreenshot()}  className="mb-1 p-1  cursor-pointer flex flex-row justify-start items-center  border-2 border-gray-300 hover:border-blue-500">
                        <AiFillCamera  size={28}/>
                        <span>Screenshot</span>
                    </div>
                    {/* <div onClick={selectedInterval.length ? () => archiveToggle() : () => alert('Select Event Time')}
                     className="mb-1 p-1 ml-1 cursor-pointer flex flex-row justify-start items-center  border-2 border-gray-300 hover:border-blue-500">
                        <BsBookmark  size={28} /> 
                        <span>Archive</span>
                    </div> */}
                    {auth.user.userType < 2 &&< div onClick={() => shareToggle() }   
                    className="mb-1 p-1 ml-1 cursor-pointer flex flex-row justify-start items-center  border-2 border-gray-300 hover:border-blue-500">
                        <BsFillShareFill  size={28}/> 
                        <span>Share</span>
                    </div>
                    }
                </div>

                  {/* Archive Options*/} 
                {/* {showArchiveOptions && (<div className="flex flex-col justify-center items-center">
                      <span> Archive</span>
                    <span>{dateformat(selectedDay, 'mmm-dd-yyyy')} - {selectedInterval}</span>
                    </div>
                )} */}

                {/* Link Sharing Options */}
                {showExpireOptions && ( <div>
                     <label className="block text-xl font-medium text-gray-700">
                       Expiration Time
                     </label>
                     <select
                       className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                       onChange ={(e) => handleShowLink(e)}>
                        <option value={0}>Select</option>
                       <option value={0.5}>30 min</option>
                       <option value={1}>1 Hour</option>
                       <option value={12}>12 Hour</option>
                     </select>
                     {camShareUrl.length > 0 &&<div className="flex break-words whitespace-normal flex-col items-center justify-center w-full p-1">
                            <span onClick={() => {navigator.clipboard.writeText(`${ camShareUrl}`)}}
                             className="break-words whitespace-normal text-lg text-blue-500 my-4 w-[80%] cursor-pointer hover:text-opacity-80">
                                { camShareUrl}
                            </span>
                            <span className="break-words text-lg text-black px-4 my-4">
                                Date Created: {dateformat(currentDate,"mmm-dd-yyyy hh:MM:ss TT")}
                            </span>
                            <span className="break-words text-lg text-black px-4 my-4">
                                Expiration Date: { dateformat(expirationDate,"mmm-dd-yyyy hh:MM:ss TT")}
                            </span>
                            
                            </div>
                        }
                   </div>
                )}
           
        </div>
     </>
    )
}
