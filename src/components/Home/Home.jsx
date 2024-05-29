import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Banner from "../Banner/Banner";
import OurServices from "../OurServices/OurServices";
import Footer from "../Footer/Footer";
import AboutUs from "../AboutUs/AboutUs";
import OurMission from "../OurMission/OurMission";
// import LoginForm from "../LoginForm/LoginForm";
// import SlideShow from "../SlideShow/SlideShow";

const Home = () => {
  return (
    <div>
      <div className="relative">
        <div className="container mx-auto relative z-10">
          <Header />
          <Banner />
        </div>
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.ibb.co/pJJNg2r/banner2.png"
            alt="Overlay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      </div>
      <div className="container mx-auto space-y-12">
        <OurServices></OurServices>
        <AboutUs></AboutUs>
        <OurMission></OurMission>
      </div>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};

export default Home;
