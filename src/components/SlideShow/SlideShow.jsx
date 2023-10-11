import image1 from '../../assets/1.png'
import image2 from '../../assets/2.png'
import image3 from '../../assets/3.png'
import image4 from '../../assets/4.png'

const SlideShow = () => {
    return (
        <div>
            <div className="carousel w-full h-96">
                <div id="item1" className="carousel-item w-full">
                    <img src={image1} className="w-full" />
                </div>
                <div id="item2" className="carousel-item w-full">
                    <img src={image2} className="w-full" />
                </div>
                <div id="item3" className="carousel-item w-full">
                    <img src={image3} className="w-full" />
                </div>
                <div id="item4" className="carousel-item w-full">
                    <img src={image4} className="w-full" />
                </div>
            </div>
            <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn btn-xs">1</a>
                <a href="#item2" className="btn btn-xs">2</a>
                <a href="#item3" className="btn btn-xs">3</a>
                <a href="#item4" className="btn btn-xs">4</a>
            </div>
        </div>
    );
};

export default SlideShow;