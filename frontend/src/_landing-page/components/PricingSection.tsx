import React from 'react';

interface PricingPlan {
    name: string;
    price: string;
    features: string[];
    imageSrc: string;
    backgroundColor: string; // For dynamic background color
    buttonText: string;
    buttonLink: string;
}

interface PricingCardProps {
    plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    return (
        <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
            <div
                className={`hover-up-5 pt-16 pb-8 px-4 text-center rounded shadow bg-white hover:bg-blue-500 hover:text-white`}
            >
                <img className="h-20 mb-6 mx-auto" src={plan.imageSrc} alt={plan.name} />
                <h3 className="mb-2 text-4xl font-bold font-heading ">{plan.name}</h3>
                <span className="text-4xl font-bold font-heading">{plan.price}</span>
                <p className="mt-2 mb-8">user per month</p>
                <div className="flex flex-col items-center mb-8">
                    <ul className="">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex mb-3">
                                <svg
                                    className="w-6 h-6 mr-2 text-green-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <a
                        className="block sm:inline-block py-4 px-6 mb-4 sm:mb-0 sm:mr-3 text-xs text-white text-center font-semibold leading-none bg-black hover:border  rounded"
                        href={plan.buttonLink}
                    >
                        {plan.buttonText}
                    </a>
                    <a
                        className="block sm:inline-block py-4 px-6 text-xs text-blueGray-500 hover:text-blueGray-600 text-center font-semibold leading-none bg-white border border-blueGray-200 hover:border-black rounded"
                        href={plan.buttonLink}
                    >
                        Purchase
                    </a>
                </div>
            </div>
        </div>
    );
};

interface PricingSectionProps {
    sectionTitle: string;
    sectionDescription: string;
    pricingPlans: PricingPlan[];
}

const PricingSection: React.FC<PricingSectionProps> = ({
    sectionTitle,
    sectionDescription,
    pricingPlans,
}) => {
    return (
        <section
            className="py-20 xl:bg-contain bg-top bg-no-repeat" title={sectionTitle}
            style={{
                backgroundImage:
                    'url("https://wp.alithemes.com/html/monst/assets/imgs/backgrounds/intersect.svg")',
            }}
        >
            <div className="container px-4 mx-auto">
                {sectionTitle !== "must_no_show" && (
                    <div className="text-center mb-16">
                        <h2
                            className="max-w-lg mx-auto mb-4 text-4xl font-bold font-heading wow animate__animated animate__fadeInUp"
                            data-wow-delay=".2s"
                        >
                            <span>Start saving time today and</span>
                            <span className="text-blue-500"> choose </span>
                            <span>your best plan</span>
                        </h2>
                        <p
                            className="max-w-sm mx-auto text-lg text-blueGray-400 wow animate__animated animate__fadeInDown"
                            data-wow-delay=".5s"
                        >
                            {sectionDescription}
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap -mx-3">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;