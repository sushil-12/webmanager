import React from 'react';
import { 
  DocumentTextIcon,
  PhotoIcon,
  CodeBracketIcon,
  UserGroupIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Portfolio Management',
    description: 'Create and manage your portfolio content with an intuitive interface. Perfect for showcasing your work and projects.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Media Gallery',
    description: 'Upload and organize your project images, videos, and documents. Optimized for fast loading and easy sharing.',
    icon: PhotoIcon,
  },
  {
    name: 'API Integration',
    description: 'Connect your portfolio to any frontend framework. Simple API endpoints for easy integration with React, Vue, or any other framework.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Collaboration',
    description: 'Invite team members to help manage your portfolio. Perfect for agencies and creative teams.',
    icon: UserGroupIcon,
  },
  {
    name: 'Security',
    description: 'Your content is protected with enterprise-grade security. No need to worry about server security or data breaches.',
    icon: LockClosedIcon,
  },
  {
    name: 'Automatic Updates',
    description: 'Your portfolio stays up-to-date automatically. No need to manage servers or perform maintenance.',
    icon: ArrowPathIcon,
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Perfect for Your Portfolio
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Everything you need to create and manage your portfolio or small-scale content site
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
