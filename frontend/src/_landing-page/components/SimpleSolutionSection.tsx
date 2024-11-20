import React from 'react';
import Slider from 'react-slick';
import CarouselItem from './CarouselItem';

interface CarouselData {
  imageSrc: string;
  title: string;
  subtitle: string;
  link: string;
}

interface SimpleSolutionSectionProps {
  sectionTitle: string;
  sectionDescription: string;
  carouselItems: CarouselData[];
}

const SimpleSolutionSection: React.FC<SimpleSolutionSectionProps> = ({
  sectionTitle,
  sectionDescription,
  carouselItems,
}) => {
  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="py-12 md:py-20" title={sectionTitle}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-3">
          <div className="relative w-full lg:w-1/3 mb-8 lg:mb-0 text-center lg:text-left">
            <div className="max-w-md lg:max-w-xs lg:pr-16 mx-auto lg:ml-0 mb-6 lg:mb-0">
              <h2 className="text-3xl md:text-4xl mb-4 font-bold font-heading wow animate__animated animate__fadeInUp" data-wow-delay=".3s">
                Simple Solution for <span className="text-blue-500">Complex</span> Connections
              </h2>
              <p className="text-xs md:text-base text-blueGray-400 leading-loose wow animate__animated animate__fadeInUp" data-wow-delay=".9s">
                {sectionDescription}
              </p>
            </div>
            <div className="lg:absolute lg:bottom-0 lg:left-0 flex justify-center">
              <div id="carausel-2-columns-1-arrows" className="flex" />
            </div>
          </div>
          <div className="w-full lg:w-2/3 flex flex-wrap">
            <div className="relative w-full">
              <Slider {...settings} className="carausel-2-columns slick-carausel" >
                {carouselItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    imageSrc={item.imageSrc}
                    title={item.title}
                    subtitle={item.subtitle}
                    link={item.link}
                  />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleSolutionSection;