import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types/dashboard';
import StatsCard from '../components/StatsCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

interface SubscriptionDetails {
  plan: {
    name: string;
    price: string;
    billingCycle: string;
    status: string;
  };
  nextPaymentDate: string;
  daysRemaining: number;
  usage: {
    api: {
      used: number;
      limit: number;
      percentage: string;
    };
    websites: {
      used: number;
      limit: number | 'Unlimited';
      percentage: string;
    };
  };
  features: string[];
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, subscriptionData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSubscriptionDetails()
        ]);
        setStats(statsData);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {subscription && (
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Subscription Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Plan Details</h3>
                <p className="mt-2 text-lg font-semibold">{subscription.plan.name}</p>
                <p className="text-sm text-blue-700">
                  {subscription.plan.price} / {subscription.plan.billingCycle}
                </p>
                <p className="text-sm text-blue-600 mt-1">Status: {subscription.plan.status}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Next Payment</h3>
                <p className="mt-2 text-lg font-semibold">{subscription.nextPaymentDate}</p>
                <p className="text-sm text-blue-700">{subscription.daysRemaining} days remaining</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">API Usage</h3>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="h-2 bg-blue-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${subscription.usage.api.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-blue-700">
                      {subscription.usage.api.percentage}%
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {subscription.usage.api.used.toLocaleString()} / {subscription.usage.api.limit.toLocaleString()} calls
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Website Usage</h3>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="h-2 bg-blue-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${subscription.usage.websites.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-blue-700">
                      {subscription.usage.websites.percentage}%
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {subscription.usage.websites.used} / {subscription.usage.websites.limit} websites
                  </p>
                </div>
              </div>
            </div>

            {subscription.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Plan Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Existing dashboard stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats && (
          <>
            <StatsCard
              title="Active Websites"
              value={stats.activeWebsites.count}
              change={stats.activeWebsites.change}
            />
            <StatsCard
              title="Total Content"
              value={stats.totalContent.count}
              change={stats.totalContent.change}
            />
            <StatsCard
              title="Team Members"
              value={stats.teamMembers.count}
              status={stats.teamMembers.status}
            />
          </>
        )}
      </div>

      {/* Add other dashboard sections here */}
    </div>
  );
};

export default Home; 