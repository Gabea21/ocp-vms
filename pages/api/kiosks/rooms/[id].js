import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Kiosk from '../../../../mongo/models/kiosk';

export default async function handler(req, res) {
	const { method ,  query: { id}} = req;

	// await dbConnect();

	switch (method) {
		case 'GET':
		
			try {
                let offest = 0
                let size = 40
                const amsRes = await axios.get(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE​/v2​/broadcasts​/conference-rooms​/${id}`)
                if(!amsRes.data){
                    return res.status(429).json({ success:false , message:'No Room Found' })
                }
                console.log('Get Room By Id ', amsRes.data)
                return res.status(200).json({success:true , room: amsRes.data})
			} catch (error) {
                console.log('Could Not Fetch Room ', error)
				res.status(400).json({ success: false });
			}
            break;
        
        case 'DELETE':
               
                try {
                 
                    const amsRes = await axios.delete(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE​/v2​/broadcasts​/conference-rooms​/${id}`)
                    if(!amsRes.data){
                        return res.status(429).json({ success:false , message:'Room Could Not Be Deleted' })
                    }
                    console.log('Deleted Room', amsRes.data)
                    return res.status(200).json({success:true , room: amsRes.data})
                } catch (error) {
                    console.log('Room Could Not Be Deleted', error)
                    res.status(400).json({ success: false });
                }
                break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
