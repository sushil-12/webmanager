import React, { useState } from "react";

interface NavLink {
    label: string;
    href: string;
    submenu?: NavLink[];
}

type ButtonType = "accent" | "primary";

interface HeaderProps {
    logo: {
        src: string;
        alt: string;
        href: string;
    };
    navLinks: NavLink[];
    buttons: {
        label: string;
        href: string;
        type: ButtonType;
    }[];
}

interface MobileMenuProps {
    navLinks: NavLink[];
    isVisible: boolean;
    setVisible: any;
    buttons: {
        label: string;
        href: string;
        type: ButtonType;
    }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navLinks, buttons, isVisible, setVisible }) => {
    return (
        <div className={`${!isVisible && 'hidden'} navbar-menu relative z-50 transition duration-300`}>
            <div className="navbar-backdrop fixed inset-0 bg-blueGray-800 opacity-25" />
            <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto transition duration-300">
                <div className="flex items-center mb-8">
                    <a className="mr-auto text-3xl font-semibold leading-none" href="#">
                        <img
                            className="h-10"
                            src="/assets/logo.png"
                            alt="Logo"
                        />
                    </a>
                    <button className="navbar-close" onClick={() => setVisible(false)}>
                        <svg
                            className="h-6 w-6 text-blueGray-400 cursor-pointer hover:text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div>
                    <ul className="mobile-menu">
                        {navLinks.map((link, index) => (
                            <li
                                key={index}
                                className={`mb-1 ${link.submenu ? "menu-item-has-children rounded-xl" : ""
                                    }`}
                            >
                                <a
                                    className="block p-4 text-sm text-blueGray-500 hover:bg-blue-50 hover:text-blue-500 rounded-xl"
                                    href={link.href}
                                >
                                    {link.label}
                                </a>
                                {link.submenu && (
                                    <ul className="dropdown pl-5">
                                        {link.submenu.map((subLink, subIndex) => (
                                            <li key={subIndex}>
                                                <a
                                                    className="block p-3 text-sm text-blueGray-500 hover:bg-blue-50 hover:text-blue-500"
                                                    href={subLink.href}
                                                >
                                                    {subLink.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-6 border-t border-blueGray-100">
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                className={`block px-4 py-3 mb-3 text-xs text-center font-semibold leading-none ${button.type === "primary"
                                    ? "bg-blue-400 hover:bg-blue-500 text-white rounded"
                                    : "text-blue-500 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded"
                                    }`}
                                href={button.href}
                            >
                                {button.label}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="mt-auto">
                    <p className="my-4 text-xs text-blueGray-400">
                        <span>Get in Touch</span>{" "}
                        <a className="text-blue-500 hover:text-blue-500 underline" href="#">
                            email@example.com
                        </a>
                    </p>
                    <div className="flex space-x-2">
                        <a className="inline-block" href="#">
                            <img src="/facebook-blue.svg" alt="Facebook" />
                        </a>
                        <a className="inline-block" href="#">
                            <img src="/twitter-blue.svg" alt="Twitter" />
                        </a>
                        <a className="inline-block" href="#">
                            <img src="/instagram-blue.svg" alt="Instagram" />
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ logo, navLinks, buttons }) => {
    const [visible, setVisible] = useState(false);
    return (
        <header className="bg-transparent sticky-bar mt-4">
            <div className="container bg-transparent">
                <nav className="bg-transparent flex justify-between items-center py-3">
                    {/* Logo */}
                    <a className="text-xl text-blue-500 items-center gap-2 flex font-semibold leading-none" href={logo.href}>
                        <img className="h-10" src={logo.src} alt={logo.alt} /> 
                        ContentLocker
                    </a>

                    {/* Navigation Links */}
                    <ul className="hidden lg:flex lg:items-center lg:w-auto lg:space-x-12">
                        {navLinks.map((link, index) => (
                            <li
                                key={index}
                                className={`relative group pt-4 pb-4 ${link.submenu ? "has-child" : ""}`}
                            >
                                <a
                                    href={link.href}
                                    className="text-sm font-semibold text-blueGray-600 hover:text-blueGray-500"
                                >
                                    {link.label}
                                </a>
                                {link.submenu && (
                                    <ul className="drop-down-menu min-w-200 absolute hidden group-hover:block bg-white shadow-lg p-4 rounded">
                                        {link.submenu.map((subLink, subIndex) => (
                                            <li key={subIndex}>
                                                <a
                                                    href={subLink.href}
                                                    className="menu-sub-item text-sm text-blueGray-600 hover:text-blueGray-500"
                                                >
                                                    {subLink.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="lg:hidden" onClick={() => setVisible(!visible)} >
                        <button className="navbar-burger flex items-center py-2 px-3 text-blue-500 hover:text-blue-700 rounded border border-blue-200 hover:border-blue-300">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <title>Mobile menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="hidden lg:flex space-x-4">
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.href}
                                className={`btn-${button.type === "primary" ? "primary" : "accent"} hover-up-2`}
                            >
                                {button.label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu */}
                    <MobileMenu navLinks={navLinks} buttons={buttons} isVisible={visible} setVisible={setVisible} />
                </nav>
            </div>
        </header>
    );
};

export default Header;
