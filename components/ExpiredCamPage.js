import { AiOutlineWarning } from 'react-icons/ai';


export default function ExpiredCamPage() {
    return (
        <div className="bg-black flex flex-col items-center min-h-[100vh]">
            <AiOutlineWarning size={90}  className="text-white mt-24"/>

            <span className="text-4xl text-center text-white mt-12"> This Link Has Expired</span>


        </div>
    )
}
