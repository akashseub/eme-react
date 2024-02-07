/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import logo from '../../assets/eme-logo.png'

const style = {

}

const Header = ({ loginButtonHandler }) => {
    return (
        <header className=' px-10 py-4 shadow-md'>
            <div className='flex justify-between items-center rounded-xl bg-slate-100 px-10 py-4'>
                <div className='flex items-center space-x-4'>
                    <img className='w-12' src={logo} alt="" />
                    <h1 className="text-4xl font-bold"><span className='text-[#182C61]'>EME</span><span className='text-[#2C3A47]'>ISLTD</span></h1>
                </div>
                <div className='flex space-x-8 items-center'>
                    <ul className='flex space-x-4 font-semibold'>
                        <Link className='hover:text-[#2C3A47]' to='/'>Home</Link>
                        <Link className='hover:text-[#2C3A47]' to='/service'>Service</Link>
                        <Link className='hover:text-[#2C3A47]' to='/about'>About Us</Link>
                        <Link className='hover:text-[#2C3A47]' to='/contact'>Contact Us</Link>
                    </ul>
                    <button id='login-button' onClick={() => document.getElementById('my_modal_5').showModal()} className='bg-[#182C61] text-white font-extrabold px-4 py-2 rounded-lg'>Login</button>
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Hello!</h3>
                            <p className="py-4">Press ESC key or click the button below to close</p>
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