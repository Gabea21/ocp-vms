import { customAlphabet } from 'nanoid'
import VXG from '../../../../lib/vxg/index';
import Camera from '../../../../mongo/models/camera';

export default async function handler(req, res) {
    const {
        query: { id, clip_id }, 
        method 
    } = req;
	
	await dbConnect();

	switch (method) {
        case 'GET':
			
			try {
              
                const camera = await Camera.findOne({_id: id});
                if(!camera){
                    return res.status(422).json({success:false, message:'No Camera Found'})
                }
                const apiRes = await VXG.getCameraArchiveClip(camera,clip_id)
                console.log(apiRes)
                return  res.status(200).json({success:true, archive: apiRes.data.events })
                                
			} catch (error) {
                console.log('Camera Archive Clip Find Error', error)
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':

			try {
               
                const camera = await Camera.findOne({_id: id});
                if(!camera){
                    return res.status(422).json({success:false, message:'No Camera Found'})
                }
                const apiRes = await VXG.deleteCameraArchiveClip(camera, clip_id)
                console.log(apiRes)

               return  res.status(201).json({success:true, message:'archive clip deleted' })
                
			} catch (error) {
                console.log('Archive Delete Error', error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
