import { useEffect, useState } from 'react';
import {
  UserGroupIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { dashboardService } from '../../services/dashboardService';
import { formatDistanceToNow, format } from 'date-fns';
import { useUserContext } from '../../context/AuthProvider';
import DateTimeDisplay from '@/components/shared/DateTimeDisplay';

interface Subscription {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
  };
  plan: {
    id: string;
    name: string;
    price: {
      monthly: number;
      annually: number;
    };
    features: string[];
    limits: {
      apiCalls?: number;
      websites?: number;
    };
  };
  status: string;
  startDate: string;
  billingCycle: string;
  nextBillingDate: string;
}

interface SubscriptionStats {
  total: number;
  active: number;
  cancelled: number;
  expired: number;
  byPlan: {
    _id: string;
    count: number;
    planName: string;
  }[];
}

const SuperAdminDashboard = () => {
  const { user } = useUserContext();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [subscriptionsData] = await Promise.all([
          dashboardService.getSubscribedUsers(1, 10, '', 'active')
        ]);

        setSubscriptions(subscriptionsData.subscriptions);
        setStats({
          total: subscriptionsData.stats.total,
          active: subscriptionsData.stats.active,
          cancelled: subscriptionsData.stats.cancelled,
          expired: subscriptionsData.stats.expired,
          byPlan: subscriptionsData.stats.byPlan
        });
      } catch (error) {
        console.error('Error fetching super admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="main-container w-full overflow-hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Starter':
        return 'bg-blue-100 text-blue-800';
      case 'Professional':
        return 'bg-purple-100 text-purple-800';
      case 'Business':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="main-container w-full overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between header-bar h-[10vh] min-h-[10vh] max-h-[10vh] pl-5 pr-[31px]">
        <div className="flex items-center space-x-4">
          <h3 className="page-titles">Super Admin Dashboard</h3>
          <span className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full">
            Welcome, {user?.firstName || user?.username}! 👋
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <DateTimeDisplay />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[90vh] overflow-y-auto p-6 bg-gray-50">
        {/* Subscription Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Subscriptions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.total || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.active || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cancelled</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.cancelled || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ArrowPathIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expired</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.expired || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Distribution - Redesigned */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Distribution</h3>


          {/* Mini cards alternative view */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats?.byPlan?.map((plan) => (
              <div
                key={plan._id}
                className={`p-4 rounded-lg border ${plan.planName === 'Starter' ? 'border-blue-200 bg-blue-50' :
                    plan.planName === 'Professional' ? 'border-purple-200 bg-purple-50' :
                      plan.planName === 'Business' ? 'border-green-200 bg-green-50' :
                        'border-gray-200 bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${plan.planName === 'Starter' ? 'bg-blue-500' :
                        plan.planName === 'Professional' ? 'bg-purple-500' :
                          plan.planName === 'Business' ? 'bg-green-500' :
                            'bg-gray-500'
                      }`}
                  ></div>
                  <h4 className="font-medium">{plan.planName}</h4>
                </div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-2xl font-bold">{plan.count}</span>
                  <span className="ml-1 text-sm text-gray-500">users</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {Math.round((plan.count / (stats?.total || 1)) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Active Subscriptions</h3>
            <CreditCardIcon className="h-6 w-6 text-blue-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {subscription.user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{subscription.user.name}</div>
                          <div className="text-sm text-gray-500">{subscription.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanColor(subscription.plan?.name || '')}`}>
                        {subscription.plan?.name || 'Custom Plan'}
                      </span>
                      {subscription.plan?.price && (
                        <div className="text-sm text-gray-500 mt-1">
                          ${subscription.billingCycle === 'monthly'
                            ? subscription.plan.price.monthly
                            : subscription.plan.price.annually}
                          /{subscription.billingCycle}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.billingCycle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(subscription.startDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-dashed">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-500">Security Center</h3>
            </div>
            <p className="mt-2 text-sm text-gray-400">Coming soon - Monitor security alerts and activity logs</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-dashed">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-500">System Health</h3>
            </div>
            <p className="mt-2 text-sm text-gray-400">Coming soon - Track system performance and health metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;