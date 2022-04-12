import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';
import Kiosk from '../../../mongo/models/kiosk';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;
	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				const kiosk = await Kiosk.findOne({_id: id});
				if (!kiosk) {
					return res.status(422).json({ success: false, message:'No Kiosk Found' });
				}
				res.status(200).json({ success: true, kiosk: kiosk});
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				console.log(id)
				const {updateVal, updateKey} = req.body
				if(updateKey === 'name'){
                    console.log('Kiosk Name Update')
                  
                    const kiosk = await Kiosk.findByIdAndUpdate(id,{
                        name:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    console.log(kiosk)
                    res.status(200).json({ success: true, data: kiosk});
                    
				}else if (updateKey === 'location'){
                    console.log('Kiosk Location Update')
                    const kiosk = await Kiosk.findByIdAndUpdate(id,{
                        name:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    console.log(kiosk)
                    res.status(200).json({ success: true, data: kiosk});
                }else{
					
                    res.status(400).json({ success: false, message: 'Update Key Invalid'});
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log('Run Delete Kiosk ',id)
				const kiosk = await Kiosk.findOne({ _id: id });
				
				// const amsRes = await axios.delete(encodeURI(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE​/v2​/broadcasts​/conference-rooms​/${kiosk.kiosk_id.toString()}`))
				// if(!amsRes.data){
				// 	return res.status(429).json({ success:false , message:'Room Could Not Be Deleted' })
				// }
				// console.log('Deleted Room', amsRes)

				const deletedKiosk = await Kiosk.deleteOne({ _id: id });
				if (!deletedKiosk) {
					return res.status(400).json({ success: false });
				}
				return res.status(200).json({ success: true, data: deletedKiosk });
			} catch (error) {
				console.log('Could Not Delete Kiosk /or Room', error)
				res.status(400).json({ success: false });
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
