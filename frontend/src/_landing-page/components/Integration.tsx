import React from "react";
import { getHeroIcon } from "@/lib/HeroIcon";

interface Integration {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface IntegrationProps {
  integrations: Integration[];
}

const Integration: React.FC<IntegrationProps> = ({ integrations }) => {
  return (
    <section className="py-20 bg-gray-50" id="integrations">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Seamless Integrations</h2>
          <p className="text-xl text-gray-600">
            Connect with your favorite tools and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-blue-100 rounded-full mb-6">
                  {integration.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{integration.name}</h3>
                <p className="text-gray-600">{integration.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-20 text-center">
          <div className="inline-block bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">
              Need a Custom Integration?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team can help you integrate with any service or build custom
              solutions.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Contact Our Team
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Integration; 