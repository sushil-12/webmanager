import React, { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { classNames } from '../../utils/classNames';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Plan {
  _id: string;
  name: string;
  description: string;
  productId: string;
  priceId: string;
  price: {
    monthly: number;
    annually: number;
  };
  stripePriceIds: {
    monthly: string;
    annually: string;
  };
  features: string[];
  apiCallsLimit: number;
  websiteLimit: number;
  apiKeyLimit: number;
  isActive: boolean;
  sortOrder: number;
  featured?: boolean;
}

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(import.meta.env.VITE_API_URL, "API URL")
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/subscription/plans`);
        setPlans(response.data.data);
      } catch (err) {
        setError('Failed to load plans. Please try again later.');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = (planId: string) => {
    console.log(planId, "PLAN ID", plans);
    setSelectedPlan(planId);
    const selectedPlan = plans.find(plan => plan.productId === planId);

    if (selectedPlan) {
      const planDetails = {
        planId: selectedPlan._id,
        priceId: selectedPlan.stripePriceIds[billingInterval],
        productId: selectedPlan.productId,
        planName: selectedPlan.name,
        price: selectedPlan.price[billingInterval],
        billingInterval,
        apiCallsLimit: selectedPlan.apiCallsLimit,
        websiteLimit: selectedPlan.websiteLimit,
        features: selectedPlan.features
      };

      navigate('/sign-up', {
        state: {
          plan: planDetails
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900">
            Choose the right plan for you
          </p>
          <p className="mt-3 text-md text-gray-600 max-w-2xl mx-auto">
            Start with a free trial. All plans include our core features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full shadow ring-1 ring-gray-200">
            {['monthly', 'annually'].map((interval) => (
              <button
                key={interval}
                onClick={() => setBillingInterval(interval as 'monthly' | 'annually')}
                className={classNames(
                  billingInterval === interval
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                  'px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200'
                )}
              >
                {interval === 'annually' ? 'Annual billing (Save 20%)' : 'Monthly billing'}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={classNames(
                'flex flex-col justify-between p-6 rounded-2xl border shadow-sm bg-white',
                plan.featured ? 'border-indigo-600' : 'border-gray-200'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className={classNames(
                    'text-lg font-semibold',
                    plan.featured ? 'text-indigo-600' : 'text-gray-900'
                  )}>
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price[billingInterval]}</span>
                  <span className="text-sm text-gray-500"> / {billingInterval}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-x-2">
                      <CheckIcon className="h-5 w-5 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                  <li className="flex items-start gap-x-2">
                    <CheckIcon className="h-5 w-5 text-indigo-500" />
                    {plan.apiCallsLimit.toLocaleString()} API calls/month
                  </li>
                  <li className="flex items-start gap-x-2">
                    <CheckIcon className="h-5 w-5 text-indigo-500" />
                    {plan.websiteLimit === -1 ? 'Unlimited' : plan.websiteLimit} Website{plan.websiteLimit !== 1 ? 's' : ''}
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handlePlanSelection(plan.productId)}
                className={classNames(
                  'mt-6 w-full text-sm font-semibold rounded-md py-2',
                  plan.featured
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-gray-50'
                )}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default PricingSection;