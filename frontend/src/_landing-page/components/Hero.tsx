import React from "react";

// Define types for the Hero Section props
interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  features: {
    label: string;
    count: string;
    icon: JSX.Element;
  }[];
  cta: {
    keyFeatures: string;
    howWeWork: string;
  };
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, backgroundImage, features, cta }) => {
  console.log(features)
  return (
    <section
      className="xl:bg-contain bg-top bg-no-repeat -mt-24 pt-24"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Hero Content */}
      <div className="container px-4 mx-auto">
        <div className="pt-12 text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl lg:text-5xl lg:leading-normal mb-4 font-bold font-heading wow animate__animated animate__fadeIn">
              {title} <br />
              <span className="text-blue-500">{subtitle}</span>
            </h2>
          </div>
          <div>
            <a
              className="btn-primary py-4 px-8 mr-2 wow animate__animated animate__fadeInUp hover-up-2"
              href="#key-features"
            >
              {cta.keyFeatures}
            </a>
            <a
              className="btn-white wow animate__animated animate__fadeInUp hover-up-2"
              data-wow-delay=".3s"
              href="#how-we-work"
            >
              {cta.howWeWork}
            </a>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative max-w-6xl mt-16 md:mt-8 mb-8 mx-auto">
        <img
          src="/pattern.png"
          alt="Background pattern"
        />
        <div
          className="absolute rounded-md"
          style={{ top: "9%", left: "14%", width: "72%", height: "66%" }}
        >
          <img
            className="jump wow animate__animated animate rounded-lg"
            src="/content-locker.gif"
            alt="Dashboard image"
          />
        </div>
      </div>

      {/* Statistics Section */}
      {/* <div className="container px-4 mx-auto">
        <div className="flex flex-wrap justify-between pt-8 pb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="hover-up-5 flex w-1/2 lg:w-auto py-4 wow animate__animated animate__fadeInUp"
              data-wow-delay={`${0.2 * (index + 1)}s`}
            >
              <div className="flex justify-center items-center text-xl bg-blueGray-50 text-blue-500 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                {feature.icon}
              </div>
              <div className="sm:py-2 ml-2 sm:ml-6">
                <span className="sm:text-2xl font-bold font-heading">+ </span>
                <span className="sm:text-2xl font-bold font-heading">{feature.count}</span>
                <p className="text-xs sm:text-base text-blueGray-400">{feature.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default Hero;