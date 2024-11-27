import React from "react";

// Define types for the Features Section props
interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface FeaturesProps {
  title: string;
  subtitle: string;
  features: Feature[];
  imageSrc: string;
  leftBlobSrc: string;
  rightBlobSrc: string;
}

const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  features,
  imageSrc,
  leftBlobSrc,
  rightBlobSrc,
}) => {
  return (
    <section className="py-12 md:py-16 lg:py-32 overflow-x-hidden" id="key-features">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap lg:flex-nowrap">
          <div className="w-full lg:w-1/2">
            <div className="lg:py-6 lg:pr-32">
              <div className="mb-4">
                <span className="text-xs py-1 px-3 text-blue-500 font-semibold bg-blue-50 rounded-xl">
                  {subtitle}
                </span>
                <h2 className="text-4xl mt-5 font-bold font-heading">{title}</h2>
              </div>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start py-4"
                  data-wow-delay={`${0.2 * (index + 1)}s`}
                >
                  <div className="w-8 mr-5 text-blue-500">{feature.icon}</div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold font-heading">{feature.title}</h3>
                    <p className="text-blueGray-400 leading-loose">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image Section */}
          <div className="relative w-full lg:w-1/2 my-12 ">
            <div className="wow animate__animated animate__fadeInRight">
              <img
                className="jump relative mx-auto rounded-xl w-full z-10"
                src={imageSrc}
                alt="Feature Image"
              />
              <img
                className="absolute top-0 left-0 w-40 -ml-12 -mt-12"
                src={leftBlobSrc}
                alt="Left Blob"
              />
              <img
                className="absolute bottom-0 right-0 w-40 -mr-12 -mb-12"
                src={rightBlobSrc}
                alt="Right Blob"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;