import { getHeroIcon } from "@/lib/HeroIcon";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowWeWork from "./components/HowWeWork";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PricingSection from "./components/PricingSection";
import ContactFormSection from "./components/ContactFormSection";
import Footer from "./components/Footer";
// import '../landing.css';
const LandingPage = () => {
  const logo = {
    src: "/assets/content-landing.svg",
    alt: "Content Locker Logo",
    href: "index.html",
  };

  const navLinks = [{}];

  const buttons = [
    { label: "Log In", href: "/login", type: "accent" },
    { label: "Sign Up", href: "/sign-up", type: "primary" },
  ];

  const heroData = {
    title: "Your Content, Your Way",
    subtitle: "Streamlined with Headless CMS",
    backgroundImage: "/intersect.svg",
    features: [
      {
        label: "Annual Partners",
        count: "150",
        icon: getHeroIcon("UserGroupIcon"),
      },
      {
        label: "Completed Projects",
        count: "58k",
        icon: getHeroIcon("CogIcon"),
      },
      {
        label: "Happy Customers",
        count: "500",
        icon: getHeroIcon("UserGroupIcon"),
      },
      {
        label: "Research Work",
        count: "320",
        icon: getHeroIcon("CogIcon"),
      },
    ],
    cta: {
      keyFeatures: "Key Features",
      howWeWork: "How We Work?",
    },
  };

  const featureData = {
    title: "Key Features",
    subtitle: "Why choose Content locker",
    features: [
      {
        title: "Best & Affordable Headless CMS",
        description:
          "A flexible, cost-effective, and scalable solution for managing your content seamlessly—empowering businesses to create, organize, and deliver exceptional digital experiences with ease",
        icon: getHeroIcon("UserGroupIcon"),
      },
      {
        title: "Manage Custom Fields",
        description:
          "Easily define and manage custom fields for your content types, enabling greater flexibility and personalization in how data is structured and displayed.",
        icon: getHeroIcon("UserGroupIcon"),
      },
      {
        title: "Manage all your website Data at ease",
        description:
          "Centralize all your website's data and manage it efficiently, making updates, modifications, and content management smooth and hassle-free.",
        icon: getHeroIcon("UserGroupIcon"),
      },
      {
        title: "Allows you to add and manage your users",
        description:
          "Manage user roles and permissions, allowing you to control who has access to different parts of your CMS. Add new users, assign roles, and track activity.",
        icon: getHeroIcon("UserGroupIcon"),
      },
    ],
    imageSrc: "/contentlocker.svg",
    leftBlobSrc: "/blob-tear.svg",
    rightBlobSrc: "/blob-tear.svg",
  };

  const howWeWorkData = {
    sectionTitle: "How Content-Locker Works",
    sectionDescription:
      "Content-Locker simplifies content management with its headless CMS approach. Manage, integrate, and enhance your content workflow seamlessly. Here's how it works:",
    steps: [
      {
        number: 1,
        title: "Seamless Onboarding & Plan Selection",
        imageSrc: "/onboarding.svg", 
        description:
          "Sign up through the registration page and choose a subscription plan Basic, Standard, or Diamond tailored to your content management needs with integrated stripe payments",
      },
      {
        number: 2,
        title: "Powerful Content & API Management",
        imageSrc: "/api.svg", 
        description:
          "Effortlessly add websites, manage posts, pages, and media with custom fields and SEO schemas. Utilize API endpoints for seamless integration into any front-end platform.",
      },
      {
        number: 3,
        title: "Advanced Tools & Collaboration",
        imageSrc: "/tools.svg", 
        description:
          "Leverage Swagger UI to explore and test APIs. Unlock premium features like in-app chat, push notifications, unlimited users, and priority support for collaboration and growth.",
      },
    ],
  };

  const pricingPlans = [
    {
      name: "Basic Plan",
      price: "$25.00",
      features: [
        "Add websites",
        "Manage multiple post types",
        "Add unlimited pages",
        "Add and manage media",
        "Custom fields",
        "Manage SEO Schema",
      ],
      imageSrc: "/startup.svg",
      backgroundColor: "bg-white",
      buttonText: "Choose Basic Plan",
      buttonLink: "/sign-up",
    },
    {
      name: "Standard Plan",
      price: "$55.00",
      features: [
        "All features in Basic Plan",
        "Custom Fields with File options",
        "Add up to 3 websites",
        "Add and manage up to 3 users",
        "Share API data with frontend developers",
        "Customizable permissions for users",
      ],
      imageSrc: "/agency.svg", 
      backgroundColor: "bg-blue-500",
      buttonText: "Choose Standard Plan",
      buttonLink: "/sign-up",
    },
    {
      name: "Premium Plan",
      price: "$75.00",
      features: [
        "All features in Standard Plan",
        "Unlimited websites",
        "Unlimited users",
        "Unlimited media",
        "Unlimited storage",
        "In-app chat feature with notification",
      ],
      imageSrc: "/enterprise.svg", 
      backgroundColor: "bg-white",
      buttonText: "Choose Premium Plan",
      buttonLink: "/sign-up",
    },
  ];

  const footerData = {
    logo: {
      src: "/assets/content-landing.svg",
      href: "index.html",
      alt: "Monst Logo",
    },
    description: "Content Control Made Simple and Secure.",
    profession: "Software Engineer",
    contacts: {
      phone: "+918219479708",
      email: "sushil124maurya@gmail.com",
      emailHref: "mailto:sushil124maurya@gmail.com",
    },
    socialLinks: [
      {
        iconSrc: "/facebook-blue.svg",
        href: "https://facebook.com",
        alt: "Facebook",
      },
      {
        iconSrc: "/twitter-blue.svg",
        href: "https://twitter.com",
        alt: "Twitter",
      },
      {
        iconSrc: "/instagram-blue.svg",
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
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js"></script>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.css"
      />
      <div className="main w-full">
        {/*@ts-ignore*/}
        <Header logo={logo} navLinks={navLinks} buttons={buttons} />{" "}
        {/*@ts-ignore*/}
        <Hero {...heroData} />
        {/*@ts-ignore*/}
        <Features {...featureData} />
        <HowWeWork {...howWeWorkData} />
        {/* <SimpleSolutionSection {...sectionData} /> */}
        <PricingSection
          sectionTitle="Our Pricing Plans"
          sectionDescription="Best for freelance developers who need to save their time."
          pricingPlans={pricingPlans}
        />
        <ContactFormSection />
        {/*@ts-ignore*/}
        <Footer {...footerData} />
      </div>
    </>
  );
};

export default LandingPage;
