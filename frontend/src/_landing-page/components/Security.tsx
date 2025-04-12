import React from 'react';
import { LockClosedIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const securityFeatures = [
  {
    title: 'Data Protection',
    description: 'End-to-end encryption for all data in transit and at rest, ensuring your content remains secure.',
    icon: LockClosedIcon,
  },
  {
    title: 'Access Control',
    description: 'Fine-grained permissions and role-based access control for complete security management.',
    icon: KeyIcon,
  },
  {
    title: 'Security Monitoring',
    description: 'Continuous security monitoring and regular audits to maintain the highest security standards.',
    icon: ShieldCheckIcon,
  },
];

const Security: React.FC = () => {
  return (
    <section className="py-12 bg-white" id="security">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Enterprise-Grade Security
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Your content is protected with industry-leading security measures
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {securityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security; 