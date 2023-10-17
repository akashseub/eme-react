import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
// import LoginForm from "../LoginForm/LoginForm";
import SlideShow from "../SlideShow/SlideShow";

const loginButtonHandler = () => {
    console.log('button clicked')
}

const Home = () => {
    return (
        <div className="space-y-4">
            <Header loginButtonHandler={loginButtonHandler}></Header>
            <SlideShow></SlideShow>
            <Outlet></Outlet>
        </div>
    );
};

export default Home;