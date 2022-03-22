import http from '../http-common';
/* eslint-disable */

//get All Cameras
const getAllCamera = () => http.get('/cameras');

//get All Cameras
const getAllCamerasNoPagination = () => http.get('/cameras/?key=all');

//get One Cameras
const getCamera = (id) => http.get(`/cameras/${id}`);

//create Camera
const createCamera = (data) => {
  const cameraData = {
    name: data.name,
    model: data.model,
    ip: data.ip,
    streamName: data.streamName,
    userName: data.userName,
    password: data.password,
    selectedWebrelay: data.selectedWebrelay,
    location: data.location,
  };

  return http.post('/cameras/create', cameraData);
};

//delete Camera
const deleteCamera = (id) => http.delete(`/cameras/${id}`);

const createShareUrl = (expireTime, camera, secondsFromNow ) => http.post('/cameras/share',{
  expireTime,
  camera,
  secondsFromNow 
})

export default {
  getAllCamera,
  getAllCamerasNoPagination,
  getCamera,
  createCamera,
  deleteCamera,
  createShareUrl
};
