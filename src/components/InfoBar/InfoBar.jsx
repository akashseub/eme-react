import { IoMdCall } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

const InfoBar = () => {
  return (
    <div className="bg-[#373A40] text-white font-bold p-2">
      <div className="container mx-auto flex justify-between">
        <div className="flex items-center space-x-2">
          <IoMdCall></IoMdCall>
          <p>+880 1711527601</p>
        </div>
        <div className="flex space-x-12">
          <div className="flex items-center space-x-2">
            <FaRegClock></FaRegClock>
            <p>We are open: 9:AM to 6PM || SATURDAY - THURSDAY</p>
          </div>
          <div className="flex space-x-2 items-center">
            <MdOutlineMailOutline></MdOutlineMailOutline>
            <p>emeisltd@gamil.com; info.emeisltd@gamil.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBar;
