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
    <footer className="bg-gray-50 border-t border-gray-200 py-12 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Logo + Description */}
          <div>
            <a href={logo.href} className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
              <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
              <span>ContentLocker</span>
            </a>
            <p className="mt-4 max-w-xs text-gray-500">{description}</p>
          </div>

          {/* Profession */}
          <div>
            <h4 className="text-gray-900 font-medium mb-2">Profession</h4>
            <p className="text-gray-500">{profession}</p>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-gray-900 font-medium mb-2">Contact</h4>
            <ul className="space-y-1 text-gray-500">
              <li>{contacts.phone}</li>
              <li>
                <a href={contacts.emailHref} className="hover:text-gray-900 transition">
                  {contacts.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-gray-900 font-medium mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition"
                >
                  <img src={link.iconSrc} alt={link.alt} className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 border-gray-200">
          <p className="text-gray-400 text-center sm:text-left mb-2 sm:mb-0">
            © {copyright.year}. {copyright.text} Designed by{" "}
            <a
              href={copyright.authorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {copyright.authorName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;