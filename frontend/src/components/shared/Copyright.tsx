import React from "react";

const Copyright: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p className="text-sm">
        &copy; {currentYear} Sushil. Content Locker. All rights reserved.
      </p>
    </footer>
  );
};

export default Copyright;
