import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';
import dateformat from 'dateformat';
import VXG from '../../../../lib/vxg/index';

export default async function handler(req, res) {
	const {
		query: { id,  key, next,start, nextUrl },
		method
	} = req;
	
	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				if(key === 'getImages'){

					const camera = await Camera.findOne({_id: id});
					let currTime = new Date ().toLocaleString("en-US", {timeZone: "America/New_York"})
					// const timeStamp = currTime.getTime();
					// const yesterdayTimeStamp = timeStamp - 24*60*60*1000;
					// const yesterdayDate = new Date(yesterdayTimeStamp); // yesterday
					// let endTime = encodeURIComponent(dateformat(yesterdayTimeStamp, "yyyy-mm-dd'T'HH:MM:ss")) //Yesterday Time
					let endTime = encodeURIComponent(dateformat(currTime, "yyyy-mm-dd'T'HH:MM:ss", true)) //Current Time
                    let offset = '0'
                    let limit = '30'
					let order_by = '-time' 
					const vxgRes = await VXG.getCameraEventImages(camera,offset,limit,order_by)
					console.log('Got Camera Image Records')
				   return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});

				}else if(  key === 'video' ) {

					let startTime = encodeURIComponent(start) //Format Start Time
                    let offset = '1'
					let limit = '1'  //Return Single Clip
					let order_by = '-time' 
					const camera = await Camera.findOne({_id: id});
				
					const vxgRes = await VXG.getCameraRecords(camera,startTime, limit, order_by )
					console.log('Got Video Clip')
					return	res.status(200).json({ success: true, camera: camera, events: vxgRes.data, });

				}else if (key === 'calender'){

					let boundstime = true ; // Returns Full time instead of reduced format (YYYY-MM-DD)
					let daysincamtz = false; // Use Camera Local TimeZone, can't be used with above
					const camera = await Camera.findOne({_id: id});
					const vxgRes = await VXG.getCameraCalender(camera)
					console.log('Got Camera Calender')
					return res.status(200).json({ success: true, camera: camera, calender: vxgRes.data, });

				}else{
				    return res.status(400).json({ success: false, message: `This Key (${key}) is invalid`  });
				}
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST' :
				try {
					if(key === 'getNextImages'  ){
						const {nextUrl} = req.body;
						const camera = await Camera.findOne({_id: id});
						const vxgRes = await VXG.getCameraEventImagesNextURL(camera,nextUrl)
						console.log('Got Next Image Set from', 'id: '+id, 'key: '+key, 'nextUrl :' + nextUrl)
						return res.status(200).json({ success: true, camera: camera, events: vxgRes.data, });
					}
				} catch (error) {
					res.status(400).json({ success: false });
				}
				break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
