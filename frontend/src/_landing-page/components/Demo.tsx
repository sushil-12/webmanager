import React from "react";

interface DemoProps {
  title: string;
  subtitle: string;
  features: {
    title: string;
    description: string;
    image: string;
    alt: string;
  }[];
}

const Demo: React.FC<DemoProps> = ({ title, subtitle, features }) => {
  return (
    <section className="py-20 bg-white" id="demo">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600">{subtitle}</p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-xl"></div>
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="relative rounded-xl shadow-2xl"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Try it now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Ready to transform your content management?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo; 