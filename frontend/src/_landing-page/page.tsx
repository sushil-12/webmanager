import { getHeroIcon } from "@/lib/HeroIcon";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowWeWork from "./components/HowWeWork";
import SimpleSolutionSection from "./components/SimpleSolutionSection";

const LandingPage = () => {
    const logo = {
        src: "https://wp.alithemes.com/html/monst/assets/imgs/logos/monst-logo.svg",
        alt: "Monst Logo",
        href: "index.html",
    };

    const navLinks = [
        {
            label: "Home",
            href: "index.html",
            submenu: [
                { label: "Landing Page 1", href: "index.html" },
                { label: "Landing Page 2", href: "index-2.html" },
            ],
        },
        { label: "About Us", href: "about.html" },
        {
            label: "Services",
            href: "services.html",
        },
        {
            label: "Company",
            href: "#",
            submenu: [
                { label: "Portfolio", href: "portfolio.html" },
                { label: "Team", href: "team.html" },
            ],
        },
        { label: "Blog", href: "#", submenu: [{ label: "Category 1", href: "blog.html" }] },
        { label: "Contact", href: "contact.html" },
    ];

    const buttons = [
        { label: "Log In", href: "/login", type: "accent" },
        { label: "Sign Up", href: "/signup", type: "primary" },
    ];

    const heroData = {
        title: "Committed to User",
        subtitle: "Committed to Easy and Effective solutions",
        backgroundImage: "https://wp.alithemes.com/html/monst/assets/imgs/backgrounds/intersect.svg",
        features: [
            {
                label: "Annual Partners",
                count: "150",
                icon: getHeroIcon('UserGroupIcon'),
            },
            {
                label: "Completed Projects",
                count: "58k",
                icon: getHeroIcon('CogIcon'),
            },
            {
                label: "Happy Customers",
                count: "500",
                icon: getHeroIcon('UserGroupIcon'),
            },
            {
                label: "Research Work",
                count: "320",
                icon: getHeroIcon('CogIcon'),
            },
        ],
        cta: {
            keyFeatures: "Key Features",
            howWeWork: "How We Work?",
        },
    };

    const featureData = {
        title: "Key Features",
        subtitle: "Why choose us",
        features: [
            {
                title: "Expand Your Reach",
                description:
                    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis expedita animi.",
                icon: getHeroIcon('UserGroupIcon'),
            },
            {
                title: "Annualized Growth",
                description:
                    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis expedita animi.",
                icon: getHeroIcon('UserGroupIcon'),
            },
            {
                title: "Book Your Providers",
                description:
                    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis expedita animi.",
                icon: getHeroIcon('UserGroupIcon'),
            },
            {
                title: "Research Your Work",
                description:
                    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis expedita animi.",
                icon: getHeroIcon('UserGroupIcon'),
            },
        ],
        imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-1.png",
        leftBlobSrc: "https://wp.alithemes.com/html/monst/assets/imgs/elements/blob-tear.svg",
        rightBlobSrc: "https://wp.alithemes.com/html/monst/assets/imgs/elements/blob-tear.svg",
    };

    // Sample data for the "How We Work" section
    const howWeWorkData = {
        sectionTitle: "We are an awesome team for your business dream",
        sectionDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus eget justo et iaculis. Quisque vitae nulla malesuada, auctor arcu vitae, luctus nisi. Sed elementum vitae ligula id imperdiet.",
        steps: [
            {
                number: 1,
                title: "Project Initialization",
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/illustrations/eating.svg",
                description:
                    "Sed ac magna sit amet risus tristique interdum at vel velit. In hac habitasse platea dictumst.",
            },
            {
                number: 2,
                title: "Looking for Creative",
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/illustrations/space.svg",
                description:
                    "Sed ac magna sit amet risus tristique interdum at vel velit. In hac habitasse platea dictumst.",
            },
            {
                number: 3,
                title: "Market Development",
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/illustrations/tasks.svg",
                description:
                    "Sed ac magna sit amet risus tristique interdum at vel velit. In hac habitasse platea dictumst.",
            },
        ],
    };

    // Dynamic data for the section
    const sectionData = {
        sectionTitle: "Simple Solution for Complex Connections",
        sectionDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus eget justo et iaculis.",
        carouselItems: [
            {
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-2.jpg",
                title: "User growth",
                subtitle: "Harvard university",
                link: "#",
            },
            {
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-3.jpg",
                title: "Product Launch",
                subtitle: "Cocacola Co",
                link: "#",
            },
            {
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-4.jpg",
                title: "New Event",
                subtitle: "Oxford university",
                link: "#",
            },
            {
                imageSrc: "https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-5.jpg",
                title: "Shopping Mall",
                subtitle: "Alibaba Co",
                link: "#",
            },
        ],
    };

    return (
        <>
            <link rel="stylesheet" href="https://wp.alithemes.com/html/monst/assets/css/animate.min.css?v=2.0" />
            <link rel="stylesheet" href="https://wp.alithemes.com/html/monst/assets/css/slick.css?v=2.0" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.css" />
            <link rel="stylesheet" href="https://wp.alithemes.com/html/monst/assets/css/tailwind-built.css?v=2.0" />
            <div className="main w-full">
                {/*@ts-ignore*/}
                <Header logo={logo} navLinks={navLinks} buttons={buttons} /> {/*@ts-ignore*/}
                <Hero {...heroData} />{/*@ts-ignore*/}
                <Features {...featureData} />
                <HowWeWork {...howWeWorkData} />
                <SimpleSolutionSection {...sectionData} />
                <section className="py-12 md:py-20">
                    <div className="container px-4 mx-auto">
                        <div className="flex flex-wrap -mx-3">
                            <div className="relative w-full lg:w-1/3 mb-8 lg:mb-0 text-center lg:text-left">
                                <div className="max-w-md lg:max-w-xs lg:pr-16 mx-auto lg:ml-0 mb-6 lg:mb-0">
                                    <h2
                                        className="text-3xl md:text-4xl mb-4 font-bold font-heading wow animate__animated animate__fadeInUp"
                                        data-wow-delay=".3s"
                                    >
                                        Simple Solution for{" "}
                                        <span className="text-blue-500">Complex</span> Connections
                                    </h2>
                                    <p
                                        className="text-xs md:text-base text-blueGray-400 leading-loose wow animate__animated animate__fadeInUp"
                                        data-wow-delay=".9s"
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                        luctus eget justo et iaculis.
                                    </p>
                                </div>
                                <div className="lg:absolute lg:bottom-0 lg:left-0 flex justify-center">
                                    <div id="carausel-2-columns-1-arrows" className="flex" />
                                </div>
                            </div>
                            <div className="w-full lg:w-2/3 flex flex-wrap">
                                <div className="relative w-full">
                                    <div
                                        className="carausel-2-columns slick-carausel"
                                        id="carausel-2-columns-1"
                                    >
                                        <div className="px-3 pb-5">
                                            <div className="card-slider group">
                                                <img
                                                    className="rounded-xl"
                                                    src="https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-2.jpg"
                                                    alt=""
                                                />
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h1 className="mt-5 text-xl font-semibold group-hover:text-blue-500">
                                                            User growth
                                                        </h1>
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Harvard university
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <a className="tracking-wide hover-up-2 mr-2 inline-block px-4 py-3 text-xs text-blue-500 font-semibold leading-none border border-blue-200 hover:border-blue-500 hover:text-white hover:bg-blue-500 rounded">
                                                            View Details
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 pb-5">
                                            <div className="card-slider group">
                                                <img
                                                    className="rounded-xl"
                                                    src="https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-3.jpg"
                                                    alt=""
                                                />
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h1 className="mt-5 text-xl font-semibold group-hover:text-blue-500">
                                                            Product Launch
                                                        </h1>
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Cocacola., Co
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <a className="tracking-wide hover-up-2 mr-2 inline-block px-4 py-3 text-xs text-blue-500 font-semibold leading-none border border-blue-200 hover:border-blue-500 hover:text-white hover:bg-blue-500 rounded">
                                                            View Details
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 pb-5">
                                            <div className="card-slider group">
                                                <img
                                                    className="rounded-xl"
                                                    src="https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-4.jpg"
                                                    alt=""
                                                />
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h1 className="mt-5 text-xl font-semibold group-hover:text-blue-500">
                                                            New Event
                                                        </h1>
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Oxford university
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <a className="tracking-wide hover-up-2 mr-2 inline-block px-4 py-3 text-xs text-blue-500 font-semibold leading-none border border-blue-200 hover:border-blue-500 hover:text-white hover:bg-blue-500 rounded">
                                                            View Details
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 pb-5">
                                            <div className="card-slider group">
                                                <img
                                                    className="rounded-xl"
                                                    src="https://wp.alithemes.com/html/monst/assets/imgs/placeholders/img-5.jpg"
                                                    alt=""
                                                />
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h1 className="mt-5 text-xl font-semibold group-hover:text-blue-500">
                                                            Shopping Mall
                                                        </h1>
                                                        <p className="mt-2 text-xs text-gray-500">Alibaba Co</p>
                                                    </div>
                                                    <div>
                                                        <a className="tracking-wide hover-up-2 mr-2 inline-block px-4 py-3 text-xs text-blue-500 font-semibold leading-none border border-blue-200 hover:border-blue-500 hover:text-white hover:bg-blue-500 rounded">
                                                            View Details
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    className="py-20 xl:bg-contain bg-top bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://wp.alithemes.com/html/monst/assets/imgs/backgrounds/intersect.svg")'
                    }}
                >
                    <div className="container px-4 mx-auto">
                        <div className="text-center mb-16">
                            <h2
                                className="max-w-lg mx-auto mb-4 text-4xl font-bold font-heading wow animate__animated animate__fadeInUp"
                                data-wow-delay=".2s"
                            >
                                <span>Start saving time today and</span>
                                <span className="text-blue-500">choose</span>
                                <span>your best plan</span>
                            </h2>
                            <p
                                className="max-w-sm mx-auto text-lg text-blueGray-400 wow animate__animated animate__fadeInDown"
                                data-wow-delay=".5s"
                            >
                                Best for freelance developers who need to save their time
                            </p>
                        </div>
                        <div className="flex flex-wrap -mx-3">
                            <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                                <div
                                    className="hover-up-5 pt-16 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".2s"
                                >
                                    <img
                                        className="h-20 mb-6 mx-auto"
                                        src="https://wp.alithemes.com/html/monst/assets/imgs/icons/startup.svg"
                                        alt=""
                                    />
                                    <h3 className="mb-2 text-4xl font-bold font-heading">Startup</h3>
                                    <span className="text-4xl text-blue-500 font-bold font-heading">
                                        $45.99
                                    </span>
                                    <p className="mt-2 mb-8 text-blueGray-400">user per month</p>
                                    <div className="flex flex-col items-center mb-8">
                                        <ul className="text-blueGray-400">
                                            <li className="flex mb-3">
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
                                                <span>3 Emails</span>
                                            </li>
                                            <li className="flex mb-3">
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
                                                <span>1 Datebases</span>
                                            </li>
                                            <li className="flex mb-3">
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
                                                <span>Unlimited Domains</span>
                                            </li>
                                            <li className="flex">
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
                                                <span>10 GB Storage</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <a
                                            className="block sm:inline-block py-4 px-6 mb-4 sm:mb-0 sm:mr-3 text-xs text-white text-center font-semibold leading-none bg-blue-400 hover:bg-blue-500 rounded"
                                            href="#"
                                        >
                                            Start Free Trial
                                        </a>
                                        <a
                                            className="block sm:inline-block py-4 px-6 text-xs text-blueGray-500 hover:text-blueGray-600 text-center font-semibold leading-none bg-white border border-blueGray-200 hover:border-blueGray-300 rounded"
                                            href="#"
                                        >
                                            Purchase
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                                <div
                                    className="hover-up-5 pt-16 pb-8 px-4 text-center text-white bg-blue-500 rounded shadow wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".4s"
                                >
                                    <img
                                        className="h-20 mb-6 mx-auto"
                                        src="https://wp.alithemes.com/html/monst/assets/imgs/icons/agency.svg"
                                        alt=""
                                    />
                                    <h3 className="mb-2 text-4xl font-bold font-heading">Agency</h3>
                                    <span className="text-4xl font-bold font-heading">$65.99</span>
                                    <p className="mt-2 mb-8">user per month</p>
                                    <div className="flex flex-col items-center mb-8">
                                        <ul>
                                            <li className="flex items-center mb-3">
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
                                                <span>6 Emails</span>
                                            </li>
                                            <li className="flex items-center mb-3">
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
                                                <span>4 Datebases</span>
                                            </li>
                                            <li className="flex items-center mb-3">
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
                                                <span>Unlimited Domains</span>
                                            </li>
                                            <li className="flex items-center">
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
                                                <span>35 GB Storage</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <a
                                            className="block sm:inline-block py-4 px-6 mb-4 sm:mb-0 sm:mr-3 text-xs text-blue-500 font-semibold leading-none bg-white hover:bg-blueGray-50 rounded"
                                            href="#"
                                        >
                                            Start Free Trial
                                        </a>
                                        <a
                                            className="block sm:inline-block py-4 px-6 text-xs font-semibold leading-none border border-blue-500 hover:border-blue-400 rounded"
                                            href="#"
                                        >
                                            Purchase
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/3 px-3 mb-6">
                                <div
                                    className="hover-up-5 pt-16 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".6s"
                                >
                                    <img
                                        className="h-20 mb-6 mx-auto"
                                        src="https://wp.alithemes.com/html/monst/assets/imgs/icons/enterprise.svg"
                                        alt=""
                                    />
                                    <h3 className="mb-2 text-4xl font-bold font-heading">
                                        Enterprise
                                    </h3>
                                    <span className="text-4xl text-blue-500 font-bold font-heading">
                                        $85.99
                                    </span>
                                    <p className="mt-2 mb-8 text-blueGray-400">user per month</p>
                                    <div className="flex flex-col items-center mb-8">
                                        <ul className="text-blueGray-400">
                                            <li className="flex mb-3">
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
                                                <span>12 Emails</span>
                                            </li>
                                            <li className="flex mb-3">
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
                                                <span>8 Datebases</span>
                                            </li>
                                            <li className="flex mb-3">
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
                                                <span>Unlimited Domains</span>
                                            </li>
                                            <li className="flex">
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
                                                <span>50 GB Storage</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <a
                                            className="block sm:inline-block py-4 px-6 mb-4 sm:mb-0 sm:mr-3 text-xs text-white text-center font-semibold leading-none bg-blue-400 hover:bg-blue-500 rounded"
                                            href="#"
                                        >
                                            Start Free Trial
                                        </a>
                                        <a
                                            className="block sm:inline-block py-4 px-6 text-xs text-blueGray-500 hover:text-blueGray-600 text-center font-semibold leading-none bg-white border border-blueGray-200 hover:border-blueGray-300 rounded"
                                            href="#"
                                        >
                                            Purchase
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    className="py-20 bg-top bg-no-repeat"
                    style={{ backgroundImage: 'url("https://wp.alithemes.com/html/monst/assets/imgs/elements/blob.svg")' }}
                >
                    <div className="container px-4 mx-auto">
                        <div className="relative py-20 px-4 lg:p-20">
                            <div className="max-w-lg mx-auto text-center">
                                <h2 className="mb-4 text-3xl lg:text-4xl font-bold font-heading wow animate__animated animate__fadeInUp">
                                    <span>Connect  Me</span>
                                    <span className="text-blue-500">Our Newsletter</span>
                                    <span>and get the Coupon code.</span>
                                </h2>
                                <p
                                    className="mb-8 text-blueGray-400 wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".3s"
                                >
                                    All your information is completely confidential
                                </p>
                                <div
                                    className="p-4 bg-white rounded-lg flex flex-wrap max-w-md mx-auto wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".5s"
                                >
                                    <div className="flex w-full md:w-2/3 px-3 mb-3 md:mb-0 md:mr-6 bg-blueGray-100 rounded">
                                        <svg
                                            className="h-6 w-6 my-auto text-blueGray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <input
                                            className="w-full pl-3 py-4 text-xs text-blueGray-400 font-semibold leading-none bg-blueGray-100 outline-none"
                                            type="text"
                                            placeholder="Type your e-mail"
                                        />
                                    </div>
                                    <button
                                        className="w-full md:w-auto py-4 px-8 text-xs text-white font-semibold leading-none bg-blue-400 hover:bg-blue-500 rounded"
                                        type="submit"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-20">
                    <div
                        className="container px-4 mx-auto wow animate__animated animate__fadeIn"
                        data-wow-delay=".3s"
                    >
                        <div className="flex flex-wrap mb-12 lg:mb-20 -mx-3 text-center lg:text-left">
                            <div className="w-full lg:w-1/5 px-3 mb-6 lg:mb-0">
                                <a
                                    className="inline-block mx-auto lg:mx-0 text-3xl font-semibold leading-none"
                                    href="index.html"
                                >
                                    <img
                                        className="h-10"
                                        src="https://wp.alithemes.com/html/monst/assets/imgs/logos/monst-logo.svg"
                                        alt=""
                                    />
                                </a>
                            </div>
                            <div className="w-full lg:w-2/5 px-3 mb-8 lg:mb-0">
                                <p className="max-w-md mx-auto lg:max-w-full lg:mx-0 lg:pr-32 lg:text-lg text-blueGray-400 leading-relaxed">
                                    Helping you <strong>maximize</strong> operations management with
                                    digitization
                                </p>
                            </div>
                            <div className="w-full lg:w-1/5 px-3 mb-8 lg:mb-0">
                                <p className="mb-2 lg:mb-4 lg:text-lg font-bold font-heading text-blueGray-800">
                                    Office
                                </p>
                                <p className="lg:text-lg text-blueGray-400">
                                    359 Hidden Valley Road, NY
                                </p>
                            </div>
                            <div className="w-full lg:w-1/5 px-3">
                                <p className="mb-2 lg:mb-4 lg:text-lg font-bold font-heading text-blueGray-800">
                                    Contacts
                                </p>
                                <p className="lg:text-lg text-blueGray-400">(+01) 234 568</p>
                                <p className="lg:text-lg text-blueGray-400">
                                    <a
                                        href="/cdn-cgi/l/email-protection"
                                        className="__cf_email__"
                                        data-cfemail="0f6c60617b6e6c7b4f6260617c7b216c6062"
                                    >
                                        [email&nbsp;protected]
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center lg:justify-between">
                            <p className="text-sm text-blueGray-400">
                                © 2021. All rights reserved. Designed by{" "}
                                <a
                                    className="text-blue-400"
                                    href="https://alithemes.com"
                                    target="_blank"
                                >
                                    Alithemes.com
                                </a>
                            </p>
                            <div className="order-first lg:order-last -mx-2 mb-4 lg:mb-0">
                                <a className="inline-block px-2" href="#">
                                    <img src="https://wp.alithemes.com/html/monst/assets/imgs/icons/facebook-blue.svg" alt="" />
                                </a>
                                <a className="inline-block px-2" href="#">
                                    <img src="https://wp.alithemes.com/html/monst/assets/imgs/icons/twitter-blue.svg" alt="" />
                                </a>
                                <a className="inline-block px-2" href="#">
                                    <img src="https://wp.alithemes.com/html/monst/assets/imgs/icons/instagram-blue.svg" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/waypoints.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/counterup.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/slick.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/wow.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/scrollup.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/smooth.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/textType.js"></script>
            <script src="https://wp.alithemes.com/html/monst/assets/js/vendor/mobile-menu.js"></script>
        </>
    )
}

export default LandingPage
