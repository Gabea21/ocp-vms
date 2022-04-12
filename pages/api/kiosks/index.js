import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';
import Kiosk from '../../../mongo/models/kiosk';
import {nanoid} from "nanoid";

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: { id},
				method
			} = req;
			try {
				if(id){
					console.log('Get Kiosk by Kiosk_Id', id)
					const kiosk = await Kiosk.findOne(
						{kiosk_id: id}
					); 
					console.log('Got Kiosk',kiosk )
					return res.status(200).json({ success: true, kiosk: kiosk });
				}else{
					console.log('Get  All Kiosks')
					const kiosks = await Kiosk.find(
						{}
					).sort({ createdAt: -1 }); 
					return res.status(200).json({ success: true, kiosks: kiosks });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			
			try {
				const { kiosk_id, updateKey } = req.body;
				
				if(updateKey === 'startCallRequest'){
					const kiosk = await Kiosk.findOne(
						{kiosk_id: kiosk_id}
					); 
					console.log('kiosk requested call')
					kiosk.callRequested = true;
					const updatedKiosk = await kiosk.save()
					return res.status(200).json({ success: true, kiosk: kiosk });
				}else if (updateKey === 'endCallRequest'){
					const kiosk = await Kiosk.findOne(
						{kiosk_id: kiosk_id}
					); 
					console.log('kiosk call end')
					kiosk.callRequested = false;
					kiosk.callAccepted = false;
					const updatedKiosk = await kiosk.save()
					return res.status(200).json({ success: true, kiosk: kiosk });
				}else if (updateKey === 'masterCallAccept'){
					const kiosk = await Kiosk.findOne(
						{kiosk_id: kiosk_id}
					); 
					console.log('kiosk call end')
					kiosk.callAccepted = true;
					const updatedKiosk = await kiosk.save()
					return res.status(200).json({ success: true, kiosk: kiosk });
				}
			} catch (error) {
				console.log('kiosk PUT err')
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  Create Kiosk
			try {
				console.log(req.body)

				// Create Kiosk in Kioks Collection
				const kiosk = await Kiosk.create({
					kiosk_id: nanoid(9),
					name: req.body.name,
					location: req.body.location,
					webrelay_id: req.body.webrelay_id,
					camera_id: req.body.camera_id
				}); /* create a new model in the database */
				console.log('Kiosk Created',kiosk)

				// Create Dedicated Conference Room on Media Server 
				const amsRes = await axios.post(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE/rest/v2/broadcasts/conference-rooms`,{
                    roomId: kiosk.kiosk_id,
                    startDate: 0,
                    endDate: 1892000000,
                    // roomStreamList: [
                    //     "string"
                    // ],
                    mode: "legacy"
                }	
              )
				console.log('Room Created',amsRes)

				return res.status(201).json({ success: true, kiosk: kiosk});
	
			} catch (error) {
				console.log('Could Not Create Kiosk',error);
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
