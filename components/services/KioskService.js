import http from '../http-common';

//get All Kiosks
const getAllKiosk = () => http.get('/kiosks');

const masterCallAccept = (kiosk_id) => http.put('/kiosks',{
  updateKey: 'masterCallAccept',
  kiosk_id:kiosk_id
})
const callMaster = (kiosk_id) => http.put('/kiosks',{
  updateKey: 'startCallRequest',
  kiosk_id:kiosk_id
})
const endCallRequest = (kiosk_id) => http.put('/kiosks',{
  updateKey: 'endCallRequest',
  kiosk_id:kiosk_id
})

// //create Kiosk
// const createKiosk = (data) => {
//   const kioskData = {
//     name: data.name,
//     model: data.model,
//     ip: data.ip,
//     streamName: data.streamName,
//     userName: data.userName,
//     password: data.password,
//     selectedWebrelay: data.selectedWebrelay,
//     location: data.location,
//   };

//   return http.post('/kiosks', cameraData);
// };

//delete Kiosk
const deleteKiosk = (id) => http.delete(`/kiosks/${id}`);



export default {
  getAllKiosk,
  masterCallAccept,
  // createKiosk,
  deleteKiosk,
  callMaster ,
  endCallRequest
  
};
