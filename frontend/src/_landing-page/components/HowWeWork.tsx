import React from 'react';

// Define types for each step
interface Step {
    number: number;
    title: string;
    imageSrc: string;
    description: string;
}

// Define the props for the HowWeWork component
interface HowWeWorkProps {
    sectionTitle: string;
    sectionDescription: string;
    steps: Step[];
}

interface StepCardProps {
    number: number;
    title: string;
    imageSrc: string;
    description: string;
    delay?: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, imageSrc, description, delay = '.3s' }) => {
    return (
        <div
            className="hover-up-5 w-full md:w-1/3 lg:w-1/3 px-3 mb-6 min-w-[380px] h-full" // Ensures cards take up equal height
            data-wow-delay={delay}
        >
            <div className="p-6 bg-white shadow rounded flex flex-col h-full border border-blue-400">
                <div className="flex w-12 h-12 mx-auto items-center justify-center text-blue-800 font-bold font-heading bg-blue-200 rounded-full">
                    {number}
                </div>
                <img className="h-48 mx-auto my-4" src={imageSrc} alt={title} />
                <h3 className="mb-2 font-bold font-heading">{title}</h3>
                <p className="text-sm text-blueGray-400 leading-relaxed flex-grow">
                    {description}
                </p>
            </div>
        </div>
    );
};

const HowWeWork: React.FC<HowWeWorkProps> = ({ sectionTitle, sectionDescription, steps }) => {
    return (
        <section className="py-12 bg-gray-50" id="how-we-work" title={sectionTitle}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-snug text-gray-900">
                <span>Content Locker </span>
                <span className="text-blue-600">Headless CMS</span>
                <br className="hidden md:block" />
                <span>for all your business needs</span>
              </h2>
            </div>
            <div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {sectionDescription}
              </p>
            </div>
          </div>
      
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 ease-in-out"
                style={{ animationDelay: `${(index + 1) * 0.2}s` }}
              >
                <div className="mb-4">
                  <img src={step.imageSrc} alt={step.title} className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-sm text-blue-500 font-medium">Step {step.number}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    );
};

export default HowWeWork;
