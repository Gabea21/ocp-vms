import axios from 'axios';

   ////// CONFIGURE AWS API FETCHER ///////////
   const client_id = process.env.AWS_CLIENT_ID;
   const headers = {
	   'Content-Type': 'application/json',
	   'X-API-Key': process.env.AWS_X_API_KEY
   }
   const instance = axios.create({
	   baseURL: process.env.AWS_API_GATEWAY_URL,
	   headers: headers
   });





////////////////////////////////////////////  Channels API  ///////////////////////////////////////////////////////////////

const createChannel = (data) => instance.post('/channels', { //Create AWSVXG Channel
    	client_id: client_id,
    	passthrough: data.passthrough, // Edge Ai Bypass
    	name: data.name,
    	timezone: data.timezone,
    	rec_mode: data.rec_mode, // VXG Record Mode
    	meta: data.meta,
    	source:data.source
})

const deleteChannel = (camera) => instance.delete('/channels', {
    data: { // data {} necessary for axios.delete req.body to be sent
        channel_id: camera.vxg.channel_id
      }
})


    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default {
    createChannel,//Create Channel 
    deleteChannel //Delete Channel

  
  };
  
  