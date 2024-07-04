/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import logo from "../../assets/eme-logo.png";
import LoginForm from "../LoginForm/LoginForm";

const style = {};

const links = (
  <>
    <li className="ease-in duration-300">
      <Link to={"/"}>Home</Link>
    </li>
    <li>
      <Link to={"/service"}>Service</Link>
    </li>
    <li>
      <Link>About Us</Link>
    </li>
    <li>
      <Link>Contact Us</Link>
    </li>
  </>
);

const Header = () => {
  return (
    <header className=" border-b-2">
      <div className="flex justify-between rounded-xl py-2">
        <Link to={"/"}>
          <div className="flex items-center space-x-4 rounded-xl p-2">
            <img className="w-8" src={logo} alt="" />
            <h1 className="text-xl font-bold">
              <span className="text-[#182C61]">EME </span>
              <span className="text-[#2C3A47]">INSPECTION SERVICES LTD.</span>
            </h1>
          </div>
        </Link>
        <div className="flex space-x-8 items-center">
          <ul className="flex space-x-4 text-[#002a3f]">{links}</ul>
          <button
            id="login-button"
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="bg-[#182C61] text-white font-extrabold px-4 py-2 rounded-lg"
          >
            Login
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <LoginForm></LoginForm>
            </div>
          </dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
