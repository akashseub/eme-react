import { FaFireExtinguisher } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import { MdOutlineFireHydrantAlt } from "react-icons/md";
import { PiShippingContainerDuotone } from "react-icons/pi";

const OurServices = () => {
  return (
    <div className="text-center uppercase my-12 space-y-12">
      <h1 className="text-4xl font-bold">Our Services</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex border items-center space-x-2 p-2 rounded-xl h-48 bg-[#F1E5D1]">
          <FaFireExtinguisher className="text-4xl text-[#8E3E63]"></FaFireExtinguisher>
          <div>
            <h1 className="text-2xl font-bold text-[#97BE5A]">
              Fire Safety Plan
            </h1>
          </div>
        </div>

        <div className="flex border items-center space-x-2 p-2 rounded-xl h-48 bg-[#D1D8C5]">
          <AiFillAlert className="text-4xl text-[#5C88C4]"></AiFillAlert>
          <div>
            <h1 className="text-2xl font-bold text-[#DC5F00]">
              Fire Detection & Alarm System
            </h1>
          </div>
        </div>

        <div className="flex border items-center space-x-2 p-2 rounded-xl h-48 bg-[#FFA27F]">
          <MdOutlineFireHydrantAlt className="text-4xl text-[#8E3E63]"></MdOutlineFireHydrantAlt>
          <h1 className="text-2xl font-bold text-[#028391]">
            Fire Protection System
          </h1>
        </div>

        <div className="flex border items-center space-x-2 p-2 rounded-xl h-48 bg-[#ACD793]">
          <PiShippingContainerDuotone className="text-4xl text-[#8E3E63]"></PiShippingContainerDuotone>
          <div>
            <h1 className="text-2xl font-bold text-[#006769]">
              Pre Shipment & Post Landing Inspection
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
