
import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

// Kiosk
const kiosk = new Schema({
    kiosk_id: { type: String },
    camera_id: { type: String },
    webrelay_id: { type: String },
    name: {type: String},
    location: {type: String},
    deviceType: {type: String, default:'Ipad'}, 
    callRequested:{type: Boolean, default: false},
    callAccepted:{type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const Kiosk = mongoose.model('Kiosk', kiosk);

export default Kiosk;

