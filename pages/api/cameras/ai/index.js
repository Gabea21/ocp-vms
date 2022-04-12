import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';
import dateformat from 'dateformat';
import VXG from '../../../../lib/vxg/index';

export default async function handler(req, res) {
	const {
		query: { id,  event,next },
		method
	} = req;

	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				console.log('Get Camera Ai',id)
				const camera = await Camera.findOne({_id: id});
				//Time Settings for Search Filtering
				let currTime = new Date ().toLocaleString("en-US", {timeZone: "America/New_York"})
				// const timeStamp = currTime.getTime();
				// const yesterdayTimeStamp = timeStamp - 24*60*60*1000;
				// const yesterdayDate = new Date(yesterdayTimeStamp); // yesterday
				// let endTime = encodeURIComponent(dateformat(yesterdayTimeStamp, "yyyy-mm-dd'T'HH:MM:ss")) //Yesterday Time
				let startTime = encodeURIComponent(dateformat(currTime, "yyyy-mm-dd'T'HH:MM:ss")) //Current Time
				//////End Time Settings ////////
				let offset = '0'
				let limit = '30' 
				let order_by = '-time' // Newsest at top of response
				
				if(camera.aiEnabled ){

					let objectEvt =  camera.aiTypes[0] //  'object_and_scene_detection' , 'personal_protective_equipment_detection', specify none to return all
					const vxgRes = await VXG.getCameraAi(camera, limit, offset,objectEvt ,order_by)
					console.log('Get Camera Ai Records Recent', objectEvt ? `Event specififed: ${objectEvt}`: 'No Event Specified')
					return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});

				}
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST' /* Get a model by its ID */:
			try {
				
				const { nextUrl } = req.body;
				const camera = await Camera.findOne({_id: id});
				const vxgRes = await VXG.getCameraAiNextURL(camera, nextUrl)
				console.log('Got Next Ai Clips nextUrl :' + nextUrl)
				return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});

			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;


		default:
			res.status(400).json({ success: false });
			break;
	}
}
