/* eslint-disable react/prop-types */
import logo from '../../assets/eme-logo.png'

const Header = ({loginButtonHandler}) => {
    return (
        <header className='flex justify-between items-center px-20 py-4 bg-slate-200 shadow-md'>
            <div className='flex items-center space-x-4'>
                <img className='w-12' src={logo} alt="" />
                <h1 className="text-4xl font-bold"><span className='text-[#182C61]'>EME</span><span className='text-[#2C3A47]'>ISLTD</span></h1>
            </div>
            <div className='flex space-x-8 items-center'>
                <ul className='flex space-x-4 font-semibold hover:text-[#2C3A47]'>
                    <li><a href="">Home</a></li>
                    <li><a href="">About us</a></li>
                    <li><a href="">Service</a></li>
                    <li><a href="">Contact us</a></li>
                </ul>
                <button onClick={() => loginButtonHandler()} className='bg-[#182C61] text-white font-extrabold px-4 py-2 rounded-lg'>Login</button>
            </div>
        </header>
    );
};

export default Header;