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
            className="hover-up-5 w-full md:w-1/2 lg:w-1/3 px-3 mb-6"
            data-wow-delay={delay}
        >
            <div className="p-12 bg-white shadow rounded">
                <div className="flex w-12 h-12 mx-auto items-center justify-center text-blue-800 font-bold font-heading bg-blue-200 rounded-full">
                    {number}
                </div>
                <img className="h-48 mx-auto my-4" src={imageSrc} alt={title} />
                <h3 className="mb-2 font-bold font-heading">{title}</h3>
                <p className="text-sm text-blueGray-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const HowWeWork: React.FC<HowWeWorkProps> = ({ sectionTitle, sectionDescription, steps }) => {
    return (
        <section className="py-20 bg-blueGray-50" id="how-we-work" title={sectionTitle}>
            <div className="container px-4 mx-auto">
                <div className="flex flex-wrap items-center justify-between max-w-2xl lg:max-w-full mb-12">
                    <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading wow animate__animated animate__fadeInDown">
                            <span>We are </span>
                            <span className="text-blue-500">awesome team</span>
                            <br />
                            <span>for your business dream</span>
                        </h2>
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-16">
                        <p className="text-blueGray-400 leading-loose wow animate__animated animate__fadeInUp">
                            {sectionDescription}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 -mb-6 text-center">
                    {steps.map((step, index) => (
                        <StepCard
                            key={step.number}
                            number={step.number}
                            title={step.title}
                            imageSrc={step.imageSrc}
                            description={step.description}
                            delay={((index + 1) * 0.2).toString() + 's'} // Apply delay for animation
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowWeWork;