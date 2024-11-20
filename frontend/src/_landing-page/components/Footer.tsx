import React from "react";

interface FooterProps {
    logo: {
        src: string;
        href: string;
        alt: string;
    };
    description: string;
    profession: string;
    contacts: {
        phone: string;
        email: string;
        emailHref: string;
    };
    socialLinks: {
        iconSrc: string;
        href: string;
        alt: string;
    }[];
    copyright: {
        year: number;
        text: string;
        authorName: string;
        authorLink: string;
    };
}

const Footer: React.FC<FooterProps> = ({
    logo,
    description,
    profession,
    contacts,
    socialLinks,
    copyright,
}) => {
    return (
        <section className="py-20">
            <div className="container px-4 mx-auto">
                <div className="flex flex-wrap mb-12 lg:mb-20 -mx-3 text-center lg:text-left">
                    {/* Logo Section */}
                    <div className="w-full lg:w-1/5 px-3 mb-6 lg:mb-0">
                        <a className="text-xl text-blue-500 items-center gap-2 flex font-semibold leading-none" href={logo.href}>
                            <img className="h-10" src={logo.src} alt={logo.alt} />
                            ContentLocker
                        </a>
                    </div>

                    {/* Description Section */}
                    <div className="w-full lg:w-2/5 px-3 mb-8 lg:mb-0">
                        <p className="max-w-md mx-auto lg:max-w-full lg:mx-0 lg:pr-32 lg:text-lg text-blueGray-400 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Profession Section */}
                    <div className="w-full lg:w-1/5 px-3 mb-8 lg:mb-0">
                        <p className="mb-2 lg:mb-4 lg:text-lg font-bold font-heading text-blueGray-800">
                            Profession
                        </p>
                        <p className="lg:text-lg text-blueGray-400">{profession}</p>
                    </div>

                    {/* Contacts Section */}
                    <div className="w-full lg:w-1/5 px-3">
                        <p className="mb-2 lg:mb-4 lg:text-lg font-bold font-heading text-blueGray-800">
                            Contacts
                        </p>
                        <p className="lg:text-lg text-blueGray-400">{contacts.phone}</p>
                        <p className="lg:text-lg text-blueGray-400">
                            <a href={contacts.emailHref}>{contacts.email}</a>
                        </p>
                    </div>
                </div>

                {/* Social Links and Copyright */}
                <div className="flex flex-col lg:flex-row items-center lg:justify-between">
                    <p className="text-sm text-blueGray-400">
                        © {copyright.year}. {copyright.text} Designed by{" "}
                        <a className="text-blue-400" href={copyright.authorLink} target="_blank" rel="noopener noreferrer">
                            {copyright.authorName}
                        </a>
                    </p>
                    <div className="order-first lg:order-last -mx-2 mb-4 lg:mb-0">
                        {socialLinks.map((link, index) => (
                            <a className="inline-block px-2" href={link.href} key={index}>
                                <img src={link.iconSrc} alt={link.alt} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Footer;