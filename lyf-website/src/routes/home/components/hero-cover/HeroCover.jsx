import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images for the carousel
import SliderImg from '../../../../assets/slider/1.png';
import SliderImg1 from '../../../../assets/slider/2.png';
import SliderImg2 from '../../../../assets/slider/3.png';
import SliderImg3 from '../../../../assets/slider/4.png';

/**
 * HeroCover Component
 * Renders the hero cover section of the home page.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} - The HeroCover component.
 */
const HeroCover = () => {


  return (
    <div className="bg-black min-h-[400px] md:min-h-76 lg:min-h-60 text-slate-100">
      <div className="hero-content__container flex flex-col items-center container mx-auto px-2 pb-5 md:px-0">
        {/* Carousel Banner */}
        <Carousel className="w-full mt-6">
          <Carousel.Item>
            <div
              className="slide bg-cover bg-center"
              style={{
                height: '500px'
              }}
            >
              <div className="carousel-content position-relative d-flex flex-column align-items-center justify-content-center h-100">
                {/* Image */}
                <img src={SliderImg} className="d-block w-100" alt="First Slide" />

                {/* Overlay container for text */}
                <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-end text-white bg-black bg-opacity-50 pb-5">
                  <h2 className="text-4xl font-bold">Luxury Stays Await</h2>
                  <p className="text-lg mt-2">Experience comfort and relaxation</p>
                </div>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="slide bg-cover bg-center"
              style={{
                height: '500px'
              }}
            >
              <div className="carousel-content position-relative d-flex flex-column align-items-center justify-content-center h-100">
                {/* Image */}
                <img src={SliderImg1} className="d-block w-100" alt="First Slide" />

                {/* Overlay container for text */}
                <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-end text-white bg-black bg-opacity-50 pb-5">
                  <h2 className="text-4xl font-bold">Indulge in Unmatched Comfort</h2>
                  <p className="text-lg mt-2">Escape the ordinary</p>
                </div>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="slide bg-cover bg-center"
              style={{
                height: '500px'
              }}
            >
              <div className="carousel-content position-relative d-flex flex-column align-items-center justify-content-center h-100">
                {/* Image */}
                <img src={SliderImg2} className="d-block w-100" alt="First Slide" />

                {/* Overlay container for text */}
                <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-end text-white bg-black bg-opacity-50 pb-5">
                  <h2 className="text-4xl font-bold">Escape to a World of Opulence</h2>
                  <p className="text-lg mt-2">Discover serene retreats designed to elevate your travel</p>
                </div>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="slide bg-cover bg-center"
              style={{
                height: '500px'
              }}
            >
              <div className="carousel-content position-relative d-flex flex-column align-items-center justify-content-center h-100">
                {/* Image */}
                <img src={SliderImg3} className="d-block w-100" alt="First Slide" />

                {/* Overlay container for text */}
                <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-end text-white bg-black bg-opacity-50 pb-5">
                  <h2 className="text-4xl font-bold">Your Dream Getaway Starts Here</h2>
                  <p className="text-lg mt-2">Immerse yourself in unparalleled service</p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default HeroCover;
