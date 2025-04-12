import React from "react";
import { getHeroIcon } from "@/lib/HeroIcon";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  alt: string;
}

interface FeatureShowcaseProps {
  title: string;
  subtitle: string;
  features: Feature[];
  imageSrc: string;
  leftBlobSrc: string;
  rightBlobSrc: string;
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  title,
  subtitle,
  features,
}) => {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 " />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase; 