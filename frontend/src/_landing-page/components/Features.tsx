import React, { useState } from "react";

// Define types for the Features Section props
interface Feature {
  title: string;
  description: string;
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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle active accordion
  };

  return (
    <section className="py-12 md:py-16 lg:py-32 overflow-x-hidden" id="key-features">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap lg:flex-nowrap content-center">
          {/* Left Column: Text and Accordion */}
          <div className="w-full lg:w-1/2">
            <div className="lg:py-6 lg:pr-32">
              <div className="mb-6">
                <span className="text-xs py-1 px-3 text-blue-500 font-semibold bg-blue-50 rounded-xl">
                  {subtitle}
                </span>
                <h2 className="text-4xl mt-5 font-bold font-heading">{title}</h2>
              </div>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`  rounded-lg overflow-hidden transition-all duration-300 ${
                      activeIndex === index ? "shadow-lg " : ""
                    }`}
                  >
                    {/* Accordion Button */}
                    <button
                      className={`flex items-center justify-between w-full px-4 py-3 text-left  font-semibold ${
                        activeIndex === index ? " bg-[#1973e8] text-white" : ""
                      }`}
                      onClick={() => toggleAccordion(index)}
                    >
                      <span>{feature.title}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          activeIndex === index ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Conditional Rendering for Description */}
                    {activeIndex === index && (
                      <div className="px-4 pt-3 pb-4 text-blueGray-400 text-sm leading-relaxed">
                        {feature.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Image Section */}
          <div className="relative w-full lg:w-1/2 my-12">
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
