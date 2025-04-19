import { getHeroIcon } from "@/lib/HeroIcon";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowWeWork from "./components/HowWeWork";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PricingSection from "./components/PricingSection";
import ContactFormSection from "./components/ContactFormSection";
import Footer from "./components/Footer";
import FeatureShowcase from "./components/FeatureShowcase";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import Integration from "./components/Integration";
import Security from "./components/Security";
// import '../landing.css';
const LandingPage = () => {
  const logo = {
    src: "/assets/content-landing.svg",
    alt: "Content Locker Logo",
    href: "index.html",
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
    // { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const buttons = [
    { label: "Log In", href: "/login", type: "accent" },
    { label: "Sign Up", href: "/sign-up", type: "primary" },
  ];

  const heroData = {
    title: "Your Content, Your Way",
    subtitle: "Streamlined with Headless CMS",
    description: "Empower your content management with our advanced, flexible, and scalable solution. Create, organize, and deliver exceptional digital experiences with ease.",
    backgroundImage: "/intersect.svg",
    features: [
      {
        label: "Active Users",
        count: "10K+",
        icon: getHeroIcon("UserGroupIcon"),
      },
      {
        label: "Websites Managed",
        count: "5K+",
        icon: getHeroIcon("GlobeAltIcon"),
      },
      {
        label: "Content Items",
        count: "1M+",
        icon: getHeroIcon("DocumentTextIcon"),
      },
      {
        label: "API Calls",
        count: "100M+",
        icon: getHeroIcon("ServerIcon"),
      },
    ],
    cta: {
      keyFeatures: "Explore Features",
      howWeWork: "See Demo",
    },
  };

  const featureData = {
    title: "Powerful Features",
    subtitle: "Everything you need to manage your content",
    features: [
      {
        title: "Advanced Content Management",
        description: "Create and manage multiple content types with our intuitive interface. Support for posts, pages, custom post types, and more.",
        icon: getHeroIcon("DocumentTextIcon"),
        image: "/features/content-management.png",
        alt: "Content management interface showing post creation and editing"
      },
      {
        title: "Custom Fields & SEO",
        description: "Define custom fields for any content type and optimize your content for search engines with our comprehensive SEO tools.",
        icon: getHeroIcon("AdjustmentsHorizontalIcon"),
        image: "/features/custom-fields.png",
        alt: "Custom fields and SEO settings interface"
      },
      {
        title: "Media Management",
        description: "Upload, organize, and optimize your media files with our powerful media library. Support for images, videos, and documents.",
        icon: getHeroIcon("PhotoIcon"),
        image: "/features/media-management.png",
        alt: "Media library interface showing file organization"
      },
      {
        title: "User Management",
        description: "Control access with role-based permissions. Manage users, teams, and their access levels with ease.",
        icon: getHeroIcon("UserGroupIcon"),
        image: "/features/user-management.png",
        alt: "User management interface showing roles and permissions"
      },
    ],
    imageSrc: "/contentlocker.svg",
    leftBlobSrc: "/blob-tear.svg",
    rightBlobSrc: "/blob-tear.svg",
  };

  const benefitsData = {
    title: "Why Choose Our Platform",
    benefits: [
      {
        title: "Scalability",
        description: "Grow your content without limits. Our platform scales with your needs.",
        icon: getHeroIcon("ArrowTrendingUpIcon"),
      },
      {
        title: "Security",
        description: "Enterprise-grade security with role-based access control and data encryption.",
        icon: getHeroIcon("ShieldCheckIcon"),
      },
      {
        title: "Performance",
        description: "Lightning-fast content delivery with optimized performance.",
        icon: getHeroIcon("BoltIcon"),
      },
      {
        title: "Flexibility",
        description: "Customize and extend the platform to match your specific needs.",
        icon: getHeroIcon("CogIcon"),
      },
    ],
  };

  const howWeWorkData = {
    sectionTitle: "How It Works",
    sectionDescription: "Content Locker is a powerful platform that allows you to create, manage, and deliver content with ease.",
    steps: [
      {
        number: 1,
        title: "Sign Up & Setup",
        imageSrc: "/onboarding.svg",
        description: "Create your account, choose your plan, and set up your first website in minutes.",
      },
      {
        number: 2,
        title: "Content Management",
        imageSrc: "/api.svg",
        description: "Start creating and managing your content with our intuitive interface.",
      },
      {
        number: 3,
        title: "Integration & Growth",
        imageSrc: "/tools.svg",
        description: "Connect with your frontend and scale your content operations.",
      },
    ],
  };

  const integrations = [
    {
      name: "Frontend Frameworks",
      description: "Works seamlessly with React, Vue, Angular, and more.",
      icon: getHeroIcon("CodeBracketIcon"),
    },
    {
      name: "Cloud Storage",
      description: "Integrates with AWS, Google Cloud, and Azure.",
      icon: getHeroIcon("CloudIcon"),
    },
    {
      name: "Analytics",
      description: "Connect with Google Analytics, Mixpanel, and more.",
      icon: getHeroIcon("ChartBarIcon"),
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
        <FeatureShowcase {...featureData} />
        <Benefits {...benefitsData} />
        <HowWeWork {...howWeWorkData} />
        <Testimonials />
        {/* <Integration integrations={integrations} /> */}
        <Security />
        <PricingSection />
        <ContactFormSection />
        {/*@ts-ignore*/}
        <Footer {...footerData} />
      </div>
    </>
  );
};

export default LandingPage;
