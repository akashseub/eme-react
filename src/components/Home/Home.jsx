import Header from "../Header/Header";
import LoginForm from "../LoginForm/LoginForm";
import SlideShow from "../SlideShow/SlideShow";

const loginButtonHandler = () => {
    
    <LoginForm loginButtonHandler = {loginButtonHandler}></LoginForm>
}

const Home = () => {
    return (
        <div className="space-y-4">
            <Header loginButtonHandler={loginButtonHandler}></Header>
            <SlideShow></SlideShow>
        </div>
    );
};

export default Home;