import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';
import dateformat from 'dateformat';
import VXG from '../../../../lib/vxg/index';

export default async function handler(req, res) {
	const {
		query: { id,  key,token, next,start, nextUrl },
		method
	} = req;
	
	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
		         if(  key === 'imageSingle' ) {
				  
					const camera = await Camera.findOne({_id: id}) 
					const vxgRes = await VXG.getCameraLiveSnap(camera)
					console.log('Fetched Live Image Snapshot')					
					return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});
					
				}else if(  key === 'watch' ) {
                    
                    const camera = await Camera.findOne({_id: id})
					//Get VXG Watch Tokens
					const vxgRes = await VXG.getCameraWatchURL(token) // change bck to 'camera' for legacy API 
                    console.log('Recieved Camera Watch Urls')					
					return res.status(200).json({ success: true, camera: camera, watch: vxgRes.data, });

				}else{
				    res.status(400).json({ success: false, message: `This Key (${key}) is invalid`  });
				}
			} catch (error) {
                console.log('Cam Live API Err', error)
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
