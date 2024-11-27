import React from 'react';
import Slider from 'react-slick';

interface CarouselData {
  imageSrc: string;
  title: string;
  subtitle: string;
  link: string;
}

interface PlatformFeature {
  title: string;
  description: string;
}

interface PlatformDescription {
  title: string;
  description: string;
  features: PlatformFeature[];
  conclusion: string;
}

interface SimpleSolutionSectionProps {
  sectionTitle: string;
  sectionDescription: string;
  carouselItems: CarouselData[];
  platformDescription: PlatformDescription;
}

const SimpleSolutionSection: React.FC<SimpleSolutionSectionProps> = ({
  sectionTitle,
  sectionDescription,
  carouselItems,
  platformDescription,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {sectionTitle} <span className="text-blue-500">with Videos</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {sectionDescription}
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-16">
          <Slider {...settings}>
            {carouselItems.map((item, index) => (
              <div key={index} className="p-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-3">{item.subtitle}</p>
                    <a
                      href={item.link}
                      className="text-blue-500 text-sm font-medium hover:underline"
                    >
                      Watch Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Platform Description */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6">{platformDescription.title}</h3>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            {platformDescription.description}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {platformDescription.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <span className="text-2xl mr-4"><img src="/point.png" alt=""/></span>
                <div>
                  <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-700 font-semibold text-sm md:text-base mt-8 text-blueGray-400">
            {platformDescription.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SimpleSolutionSection;
