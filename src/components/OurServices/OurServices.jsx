import { FaFireExtinguisher } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import { MdOutlineFireHydrantAlt } from "react-icons/md";
import { PiShippingContainerDuotone } from "react-icons/pi";
import "./OurServices.css";

const OurServices = () => {
  return (
    <div className="text-center uppercase my-12 space-y-12">
      <h1 className="text-4xl font-bold">Our Services</h1>
      <div className="grid grid-cols-4 gap-4 px-2 bg-[#677791] text-white rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-2 p-2 rounded-xl h-48 zoom-hover">
          <FaFireExtinguisher className="text-4xl"></FaFireExtinguisher>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Fire Safety Plan</h1>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consectetur, cum.
            </p>
          </div>
        </div>

        <div className=" flex flex-col items-center justify-center space-y-2 p-2 rounded-xl h-48 zoom-hover">
          <AiFillAlert className="text-4xl"></AiFillAlert>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Fire Detection & Alarm System</h1>
            <p className="text-xs">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam,
              adipisci?
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 p-2 rounded-xl h-48 zoom-hover">
          <MdOutlineFireHydrantAlt className="text-4xl"></MdOutlineFireHydrantAlt>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Fire Protection System</h1>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
              molestias.
            </p>
          </div>
        </div>

        <div className=" flex flex-col items-center justify-center space-y-2 p-2 rounded-xl h-48 zoom-hover">
          <PiShippingContainerDuotone className="text-4xl"></PiShippingContainerDuotone>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">
              Pre Shipment & Post Landing Inspection
            </h1>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod,
              laborum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
