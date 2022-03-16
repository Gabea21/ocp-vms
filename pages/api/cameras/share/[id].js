import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import ShareToken from '../../../../mongo/models/shareToken';
import Camera from '../../../../mongo/models/camera';

export default async function handler(req, res) {
    const {
        query: { id, key}, 
        method 
    } = req;
	
	await dbConnect();

	switch (method) {
        case 'GET':
			try {
                
                const share = await ShareToken.findOne({_id: id})
                console.log(share)
                const cameraFound = await Camera.findOne({_id: share.camera_id })

                if(!share || !cameraFound){
                    return res.status(422).send({success:false , message:'No Shared Cam Found'})
                }
               return  res.status(200).send({success:true , expiration: share.expiration, camera: cameraFound})
                
			} catch (error) {
                console.log('Shared Camera Find Error', error)
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
            const { name,} = req.body;

			try {
                const deletedShare = await ShareToken.deleteOne({ _id: id });
				if (!deletedShare) {
					return res.status(422).json({ success: false , message: 'No Wall Deleted'});
				}
				res.status(200).json({ success: true, data: deletedShare });
                
			} catch (error) {
                console.log('ShareToken Delete Error', error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
