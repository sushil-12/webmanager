import { getHeroIcon } from "@/lib/HeroIcon";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowWeWork from "./components/HowWeWork";
import SimpleSolutionSection from "./components/SimpleSolutionSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PricingSection from "./components/PricingSection";
import ContactFormSection from "./components/ContactFormSection";
import Footer from "./components/Footer";

const LandingPage = () => {
    const logo = {
        src: "/assets/content-landing.svg",
        alt: "Content Locker Logo",
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
        { label: "Sign Up", href: "/sign-up", type: "primary" },
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
    const pricingPlans = [
        {
            name: 'Startup',
            price: '$45.99',
            features: [
                '3 Emails',
                '1 Database',
                'Unlimited Domains',
                '10 GB Storage',
            ],
            imageSrc:
                'https://wp.alithemes.com/html/monst/assets/imgs/icons/startup.svg',
            backgroundColor: 'bg-white', // Can be bg-blue-500, bg-white, etc.
            buttonText: 'Start Free Trial',
            buttonLink: '#',
        },
        {
            name: 'Agency',
            price: '$65.99',
            features: [
                '6 Emails',
                '4 Databases',
                'Unlimited Domains',
                '35 GB Storage',
            ],
            imageSrc:
                'https://wp.alithemes.com/html/monst/assets/imgs/icons/agency.svg',
            backgroundColor: 'bg-blue-500', // Background color
            buttonText: 'Start Free Trial',
            buttonLink: '#',
        },
        {
            name: 'Enterprise',
            price: '$85.99',
            features: [
                '12 Emails',
                '8 Databases',
                'Unlimited Domains',
                '50 GB Storage',
            ],
            imageSrc:
                'https://wp.alithemes.com/html/monst/assets/imgs/icons/enterprise.svg',
            backgroundColor: 'bg-white',
            buttonText: 'Start Free Trial',
            buttonLink: '#',
        },
    ];

    const footerData = {
        logo: {
            src: "/assets/content-landing.svg",
            href: "index.html",
            alt: "Monst Logo",
        },
        description: "Helping you maximize operations management with digitization.",
        profession: "Software Engineer",
        contacts: {
            phone: "(+91) 8219479708",
            email: "sushil124maurya@gmail.com",
            emailHref: "mailto:sushil124maurya@gmail.com",
        },
        socialLinks: [
            {
                iconSrc: "https://wp.alithemes.com/html/monst/assets/imgs/icons/facebook-blue.svg",
                href: "https://facebook.com",
                alt: "Facebook",
            },
            {
                iconSrc: "https://wp.alithemes.com/html/monst/assets/imgs/icons/twitter-blue.svg",
                href: "https://twitter.com",
                alt: "Twitter",
            },
            {
                iconSrc: "https://wp.alithemes.com/html/monst/assets/imgs/icons/instagram-blue.svg",
                href: "https://instagram.com",
                alt: "Instagram",
            },
        ],
        copyright: {
            year: 2024,
            text: "All rights reserved.",
            authorName: "Sushil Kumar",
            authorLink: "https://in.linkedin.com/in/sushil-maurya-6256b4154",
        },
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
                <PricingSection
                    sectionTitle="Our Pricing Plans"
                    sectionDescription="Best for freelance developers who need to save their time."
                    pricingPlans={pricingPlans}
                />
                <ContactFormSection />{/*@ts-ignore*/}
                <Footer {...footerData} />
            </div>
        </>
    )
}

export default LandingPage
