import React from 'react';
import { RocketLaunchIcon, ShieldCheckIcon, PuzzlePieceIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const Hero: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          {/* Left column - Content */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-3xl leading-20">Create Seamless Online Experiences</span>
              <span className="block text-blue-600">Without the Backend Hassle</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-gray-500">
              A powerful headless CMS that lets you focus on creating amazing content experiences. 
              Perfect for blogs, e-commerce, documentation sites, and more.
            </p>
            <div className="mt-10 flex gap-4">
              <a
                href="#pricing"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </a>
              <a
                href="#demo"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
              >
                View Demo
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <RocketLaunchIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Lightning Fast</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Enterprise Security</span>
              </div>
              <div className="flex items-center">
                <PuzzlePieceIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Easy Integration</span>
              </div>
              <div className="flex items-center">
                <CloudArrowUpIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Scalable Infrastructure</span>
              </div>
            </div>
          </div>

          {/* Right column - Dashboard Image */}
          <div className="mt-12 lg:mt-0">
            <img
              className="rounded-lg shadow-xl"
              src="/dashboard.png"
              alt="Dashboard preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;