import { useEffect, useState } from 'react';
import WebRelayService from '../services/WebRelayService';
import CameraService from '../services/CameraService';
import WebRelayQuadOldKioskControl from '../section/WebRelayQuadOldKioskControl';
import WebRelayX410KioskControl from '../section/WebRelayX410KioskControl';
import CamSinglePlayer from '../camera/players/CamSinglePlayer';

export default function KioskControlCard(props) {
    const { kiosk } = props;
    const [webrelay, setWebrelay] = useState(null);
    const [camera, setCamera] = useState(null);
    const [loading, setLoading] = useState(true)
    //Fetch WebRelays
    const getKioskCamera = async () => {
        const res = await CameraService.getCamera(kiosk.camera_id)
        // res.data.camera.antStreamId = kiosk.kiosk_id //remove for kiosks with IPcamera instead of tablet cam
        setCamera(res.data.camera)
      }
      const getKioskWebRelay = async () => {
          const res = await WebRelayService.getWebRelay(kiosk.webrelay_id)
          setWebrelay(res.data.webrelay)
      }
    useEffect(() => {
        getKioskCamera()
        getKioskWebRelay()
        setLoading(false)
    }, [])

    if(loading && !camera && !webrelay) return <h1>Loading...</h1>
    console.log(camera)
    return (
        <div className="flex flex-col items-center ">
                 {camera && 
                    <div className="max-w-[780px]">
                        <CamSinglePlayer camera={camera} />
                    </div>
                  }
                  {webrelay?.model === 'Quad_OLD' && <WebRelayQuadOldKioskControl webrelay={webrelay} />}
                  {(webrelay?.model === 'X410' || webrelay?.model === 'X401') && <WebRelayX410KioskControl webrelay={webrelay} />}
                  
        </div>
    )
}
