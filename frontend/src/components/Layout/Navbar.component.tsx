// @ts-ignore
import {FaHome} from "react-icons/fa";
import {IoVideocam} from "react-icons/io5";
import {useNavigate} from "react-router-dom";


export const Navbar = () => {
    const navigate = useNavigate();
    return (<div>
        <div><FaHome onClick={() => navigate('/')} size={24}/></div>
        <div><IoVideocam onClick={() => navigate('/videos')} size={24}/></div>
    </div>)
}