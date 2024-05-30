/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import logo from "../../assets/eme-logo.png";

const style = {};

const links = (
  <>
    <li className="hover:bg-[#182C61] hover:rounded">
      <Link>Home</Link>
    </li>
    <li>
      <Link>Service</Link>
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
    <header className="">
      <div className="flex justify-between rounded-xl py-2">
        <div className="flex items-center space-x-4 bg-white/50 rounded-xl p-2">
          <img className="w-12" src={logo} alt="" />
          <h1 className="text-4xl font-bold">
            <span className="text-[#182C61]">EME </span>
            <span className="text-[#2C3A47]">INSPECTION SERVICES LTD.</span>
          </h1>
        </div>
        <div className="flex space-x-8 items-center">
          <ul className="flex space-x-4 font-semibold text-white">{links}</ul>
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
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn items-center">Login</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
