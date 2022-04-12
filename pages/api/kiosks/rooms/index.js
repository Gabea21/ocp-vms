import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Kiosk from '../../../../mongo/models/kiosk';

export default async function handler(req, res) {
	const { method } = req;

	// await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: { id},
				method
			} = req;
			try {
                let offset = 0
                let size = 40
				const amsRes = await axios.get(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE/rest/v2/broadcasts/conference-rooms/list/${offset}/${size}`)
			
                console.log('Get All Rooms ', amsRes.data)
                res.status(200).json({success:true , rooms: amsRes.data})
			} catch (error) {
                console.log('Could Not Fetch All Rooms', error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
