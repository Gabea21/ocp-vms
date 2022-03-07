import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';
import WebRelay from '../../../mongo/models/webrelay';
import xml2js from 'xml2js';

export default async function handler(req, res) {
	const { method } = req;
	// await dbConnect();
    
  
	switch (method) {
		case 'GET':
			const {
				query: {id, relay_id, action, action_type, location, location_id},
				method
			} = req;
			try {

                if(action === 'retrieve'){
                    if(action_type === 'single'){
                        console.log('Get Webrelay by Device  Id', id)
                        const webrelay = await WebRelay.findOne(
                            {_id: id}
                        ); 
                            if(!webrelay){
                                return res.status(400).json({ success: false, webrelay: webrelay});
                            }
                        console.log('Got WebRelay', webrelay )
                        return res.status(200).json({ success: true, webrelay: webrelay});
                    }else if(action_type === 'all'){
                        if(location === 'true'){
                            console.log('Get WebRelays By LocationID',location_id)
                            const webrelays = await WebRelay.find({location: location_id}).sort({ createdAt: -1 });
                            return res.status(200).json({ success: true, webrelays: webrelays });
                        }else{
                            console.log('Get  All WebRelays')
                            const webrelays = await WebRelay.find({}).sort({ createdAt: -1 });
                            return res.status(200).json({ success: true, webrelays: webrelays });
                        }
                    }else{
                        return res.status(400).json({ success: false, message: 'Retrieval type not specified' });
                    }
                }else if(action === 'state'){

                    let webRelayState = {};
                    const foundWebRelay  = await WebRelay.findOne({_id: id})
                        if(!foundWebRelay){
                            return res.status(400).json({success:true, message: 'No WebRelay Found'})
                        }
                    const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml`)// Missing relay endpoint
                    xml2js.parseString(response.data, (err, result) => {
                        if(err) {
                            throw err;
                        }
                        // `result` is a JavaScript object
                        // convert it to a JSON string
                        const json = JSON.stringify(result, null, 4);
                        // Set WebRelayState to current values;
                        webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                    });
                    console.log(webRelayState)
                    return res.status(200).json({success:true, webrelay: webRelayState})
                   
                }else if (action === 'toggle'){
                    if (action_type === 'on'){

                        let webRelayState = {};
                        const foundWebRelay  = await WebRelay.findOne({_id: id}) 
                            if(!foundWebRelay){
                                return res.status(400).json({success:true, message: 'No WebRelay Found'})
                            }
                        const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml?${relay_id}=1`) //Missing WebRelay IP:PORT
                        console.log( 'response error',response.status,response.data,)
                        xml2js.parseString(response.data, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            // `result` is a JavaScript object
                            // convert it to a JSON string
                            const json = JSON.stringify(result, null, 4);
                            // Set WebRelayState to current values;
                            // webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                        });
                        console.log('Toggled On','state='+webRelayState,`relay_id: ${relay_id}`)
                        return res.status(200).json({success:true, webrelay: webRelayState})
                        
                    }else if (action_type === "off"){
                      
                        let webRelayState = {};
                        const foundWebRelay  = await WebRelay.findOne({_id: id}) 
                            if(!foundWebRelay){
                                return res.status(400).json({success:true, message: 'No WebRelay Found'})
                            }
                        const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml?${relay_id}=0`)   
                        xml2js.parseString(response.data, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            // `result` is a JavaScript object
                            // convert it to a JSON string
                            const json = JSON.stringify(result, null, 4);
                            // Set WebRelayState to current values;
                            webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                        });
                        console.log('Toggled Off','state='+webRelayState,`relay_id: ${relay_id}`)
                        return res.status(200).json({success:true, webrelay: webRelayState})

                    }else if(action_type === "pulse"){
                        
                        let webRelayState = {};
                        const foundWebRelay  = await WebRelay.findOne({_id: id}) 
                            if(!foundWebRelay){
                                return res.status(400).json({success:true, message: 'No WebRelay Found'})
                            }
                        const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml?${relay_id}=2`)
                        
                        xml2js.parseString(response.data, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            // `result` is a JavaScript object
                            // convert it to a JSON string
                            const json = JSON.stringify(result, null, 4);
                            // Set WebRelayState to current values;
                            webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                        });
                        console.log('Toggled Pulse','state='+webRelayState,`relay_id: ${relay_id}`)
                       
                        return res.status(200).json({success:true, webrelay: webRelayState})
                    }else{
                        //  Missing Action Type
                        return res.status(400).json({success: false , message: 'No Action Type Defined!'})
                    }
                }

			} catch (error) {
                res.status(400).json({ success: false });
                console.log('List Callback',error)
			}
            break;
        case 'POST': //  Create WebRelay
			try {
				const body = req.body
 
                const webRelayExist = await WebRelay.findOne({
                    ip: body.ip,
                    port: body.port
                });
				if (webRelayExist) {
                    console.log('Found ',webrelay)
					return res.status(301).json({ success: false, message:'Webrelay Already Exists' });
				} else {
					const webrelay = await WebRelay.create({
						name: body.name,
						location: body.location,
						ip: body.ip,
                        port: body.port,
                        model: body.model,
                        userName: body.userName,
                        password: body.password,
                        relays: body.relays
					}); /* create a new model in the database */
					return res.status(201).json({ success: true, webrelay: webrelay });
				}
			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
