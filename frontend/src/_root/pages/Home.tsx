import { useEffect, useState } from 'react';
import {
  DocumentTextIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  GlobeAltIcon,
  TrophyIcon,
  CalendarIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentPlusIcon,
  DocumentMinusIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserPlusIcon,
  UserIcon,
  UserMinusIcon,
  KeyIcon,
  LockClosedIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { dashboardService } from '../../services/dashboardService';
import { formatDistanceToNow } from 'date-fns';
import { useUserContext } from '../../context/AuthProvider';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import DateTimeDisplay from '@/components/shared/DateTimeDisplay';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatFieldChanges = (fieldChanges: any) => {
  if (!fieldChanges) return null;

  return Object.entries(fieldChanges).map(([field, changes]: [string, any]) => {
    // Format the field name for display
    const fieldName = field.split(/(?=[A-Z])|_/).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    // Handle permissions object
    if (field === 'permissions') {
      const formatPermissions = (perms: any) => {
        if (!perms) return 'none';
        return Object.entries(perms)
          .map(([websiteId, permissions]: [string, any]) => {
            const permsList = [];
            if (permissions.editor_permission) permsList.push('Editor');
            if (permissions.viewer_permission) permsList.push('Viewer');
            return `Website ${websiteId}: ${permsList.join(', ')}`;
          })
          .join('; ');
      };

      return (
        <div key={field} className="mt-1 text-sm text-gray-600">
          <span className="font-medium">{fieldName}:</span>{' '}
          <span className="line-through text-gray-400">{formatPermissions(changes.old)}</span>{' '}
          <span className="text-green-600">→</span>{' '}
          <span className="text-blue-600">{formatPermissions(changes.new)}</span>
        </div>
      );
    }

    // Handle role changes
    if (field === 'role') {
      return (
        <div key={field} className="mt-1 text-sm text-gray-600">
          <span className="font-medium">{fieldName}:</span>{' '}
          <span className="line-through text-gray-400">{changes.old || 'none'}</span>{' '}
          <span className="text-green-600">→</span>{' '}
          <span className="text-blue-600">{changes.new || 'none'}</span>
        </div>
      );
    }

    // Handle arrays
    if (Array.isArray(changes.old) || Array.isArray(changes.new)) {
      const formatArray = (arr: any[]) => arr ? arr.join(', ') : 'none';
      return (
        <div key={field} className="mt-1 text-sm text-gray-600">
          <span className="font-medium">{fieldName}:</span>{' '}
          <span className="line-through text-gray-400">{formatArray(changes.old)}</span>{' '}
          <span className="text-green-600">→</span>{' '}
          <span className="text-blue-600">{formatArray(changes.new)}</span>
        </div>
      );
    }

    // Handle boolean values
    if (typeof changes.old === 'boolean' || typeof changes.new === 'boolean') {
      return (
        <div key={field} className="mt-1 text-sm text-gray-600">
          <span className="font-medium">{fieldName}:</span>{' '}
          <span className="line-through text-gray-400">{changes.old?.toString() || 'false'}</span>{' '}
          <span className="text-green-600">→</span>{' '}
          <span className="text-blue-600">{changes.new?.toString() || 'false'}</span>
        </div>
      );
    }

    // Default display for other fields
    return (
      <div key={field} className="mt-1 text-sm text-gray-600">
        <span className="font-medium">{fieldName}:</span>{' '}
        <span className="line-through text-gray-400">{changes.old || 'none'}</span>{' '}
        <span className="text-green-600">→</span>{' '}
        <span className="text-blue-600">{changes.new || 'none'}</span>
      </div>
    );
  });
};

const getActionIcon = (action: string) => {
  switch (action) {
    // Website actions
    case 'website_created':
      return <GlobeAltIcon className="h-5 w-5 text-green-600" />;
    case 'website_updated':
      return <PencilSquareIcon className="h-5 w-5 text-blue-600" />;
    case 'website_deleted':
      return <TrashIcon className="h-5 w-5 text-red-600" />;

    // Content actions
    case 'content_created':
      return <DocumentPlusIcon className="h-5 w-5 text-green-600" />;
    case 'content_updated':
      return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
    case 'content_deleted':
      return <DocumentMinusIcon className="h-5 w-5 text-red-600" />;

    // Settings and analytics
    case 'settings_updated':
      return <Cog6ToothIcon className="h-5 w-5 text-purple-600" />;
    case 'analytics_updated':
      return <ChartBarIcon className="h-5 w-5 text-yellow-600" />;

    // User actions
    case 'user_created':
      return <UserPlusIcon className="h-5 w-5 text-green-600" />;
    case 'user_updated':
      return <UserIcon className="h-5 w-5 text-blue-600" />;
    case 'user_deleted':
      return <UserMinusIcon className="h-5 w-5 text-red-600" />;
    case 'role_changed':
      return <KeyIcon className="h-5 w-5 text-yellow-600" />;
    case 'permission_updated':
      return <LockClosedIcon className="h-5 w-5 text-purple-600" />;

    default:
      return <ClockIcon className="h-5 w-5 text-gray-600" />;
  }
};

const Dashboard = () => {
  const { user } = useUserContext();
  const [greeting, setGreeting] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [websites, setWebsites] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [apiUsage, setApiUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D' | '90D'>('7D');
  const [subscription, setSubscription] = useState<any>(null);
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    };

    // if (user?.role === 'super_admin') {
    setGreeting(getGreeting());
    // }
  }, [user?.role]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        console.log("Fetching dashboard data...");

        const [
          statsData,
          activitiesData,
          performanceData,
          progressData,
          websitesData,
          tasksData,
          subscriptionData,
          apiUsageData
        ] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivity(),
          dashboardService.getContentPerformance(selectedPeriod),
          dashboardService.getUserProgress(),
          dashboardService.getWebsiteStatus(),
          dashboardService.getContentCalendar(),
          dashboardService.getSubscriptionDetails(),
          dashboardService.getApiUsage(selectedPeriod)
        ]);

        console.log("Stats:", statsData);
        console.log("Activities:", activitiesData);
        console.log("Performance:", performanceData);
        console.log("Progress:", progressData);
        console.log("Websites:", websitesData);
        console.log("Tasks:", tasksData);
        // console.log("API Usage:", apiUsageData);

        setStats(statsData);
        setActivities(activitiesData);
        setPerformance(performanceData);
        setProgress(progressData);
        setWebsites(websitesData);
        setTasks(tasksData);
        setSubscription(subscriptionData);
        setApiUsage(apiUsageData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);


  const apiChartData = {
    labels: apiUsage?.dailyData.map((day: any) => day._id) || [],
    datasets: [
      {
        label: 'Total Requests',
        data: apiUsage?.dailyData.map((day: any) => day.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
      {
        label: 'Successful Requests',
        data: apiUsage?.dailyData.map((day: any) => day.successCount) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
      {
        label: 'Error Requests',
        data: apiUsage?.dailyData.map((day: any) => day.count - day.successCount) || [],
        borderColor: 'rgb(239, 68, 68)', // red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      }
    ]
  };

  const apiChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          color: '#374151' // Tailwind's gray-700
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      },
      title: {
        display: false
      }
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280', // Tailwind's gray-500
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          color: '#6B7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="main-container w-full overflow-hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  const totalApi = subscription?.usage?.api?.limit || 0;
  const usedApi = apiUsage?.totalRequests || 0;
  const percentageApi = totalApi > 0 ? (usedApi / totalApi) * 100 : 0;

  const totalWeb = subscription?.usage?.websites?.limit || 0;
  const usedWeb = subscription?.usage?.websites?.used || 0;
  const percentageWebsites = totalWeb > 0 ? (usedWeb / totalWeb) * 100 : 0;

  // FOR websites
  const limitWeb = subscription?.usage?.websites?.limit ?? 0;
  const usedWebsites = subscription?.usage?.websites?.used ?? 0;

  // Percentage for the bar if not unlimited
  const percentageWebsitesData =
    limitWeb > 0 ? (usedWebsites / limitWeb) * 100 : 0;

  // Width logic for the bar
  const barWidth = limitWeb === -1 ? 100 : Math.min(percentageWebsitesData, 100);



  return (
    <div className="main-container w-full overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between header-bar h-[10vh] min-h-[10vh] max-h-[10vh] pl-5 pr-[31px]">
        <div className="flex items-center space-x-4">
          <h3 className="page-titles">Dashboard</h3>
          {user?.role === 'super_admin' ? (
            <div className="flex items-center space-x-2">
              <span className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                {greeting}, {user?.firstName || user?.username}! 👋
              </span>
            </div>
          ) : (
            <span className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
              {greeting}, {user?.username}! 👋
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <DateTimeDisplay />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[90vh] overflow-y-auto p-6 bg-gray-50">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Websites</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.activeWebsites?.count || 0}</p>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">{stats?.activeWebsites?.change}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Content</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalContent?.count || 0}</p>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">{stats?.totalContent.change}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Team Members</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.teamMembers?.count || 0}</p>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">{stats?.teamMembers.status}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">API Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">{apiUsage?.totalRequests || 0}</p>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">{stats?.apiRequests?.change}</div>
            </div>
          </div>
        </div>

        {/* Subscription Details Section */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Plan Details</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${subscription?.daysRemaining > 14
                ? 'bg-green-100 text-green-800'
                : subscription?.daysRemaining > 7
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {subscription?.daysRemaining > 14
                  ? 'Active'
                  : subscription?.daysRemaining > 7
                    ? 'Expiring Soon'
                    : 'Expiring Very Soon'}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{subscription?.plan?.name}</p>
                  <p className="text-sm text-gray-500">{subscription?.plan?.billingCycle} billing</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{subscription?.plan?.price}</p>
                  <p className="text-sm text-gray-500">{subscription?.daysRemaining} days remaining</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                {/* API Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">API Calls</span>
                    <span className="font-medium">
                      {apiUsage?.totalRequests ?? 0} / {subscription?.usage?.api?.limit ?? 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${percentageApi > 90
                        ? 'bg-red-600'
                        : percentageApi > 70
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                        }`}
                      style={{ width: `${Math.min(percentageApi, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Website Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Websites</span>
                    <span className="font-medium">
                      {usedWebsites} / {limitWeb === -1 ? '∞' : limitWeb}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${limitWeb === -1
                        ? 'bg-blue-600'
                        : percentageWebsitesData >= 100
                          ? 'bg-red-600'
                          : 'bg-blue-600'
                        }`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
            <ul className="space-y-3">
              {subscription?.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* API Keys Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
              {/* <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                Generate New
              </button> */}
            </div>
            <div className="space-y-3">
              {subscription?.apiKeys?.keys?.apiKeys?.map((key: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{key.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${key.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={key.key}
                      readOnly
                      className="flex-1 text-sm bg-white border border-gray-200 rounded px-3 py-1 text-gray-600"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(key.key)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy to clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  {key.lastUsed && (
                    <p className="mt-2 text-xs text-gray-500">
                      Last used: {formatDistanceToNow(new Date(key.lastUsed), { addSuffix: true })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-4">
                {activities?.map((activity: any) => (
                  <div key={activity._id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          {activity.metadata?.fieldChanges && (
                            <div className="mt-1">
                              {formatFieldChanges(activity.metadata.fieldChanges)}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${activity.status === 'success' ? 'bg-green-100 text-green-800' :
                          activity.status === 'error' ? 'bg-red-100 text-red-800' :
                            activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          by {activity.userId?.firstName || activity.userId?.username || 'Unknown User'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Performance</h3>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === '7D' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    onClick={() => setSelectedPeriod('7D')}
                  >
                    7D
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === '30D' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    onClick={() => setSelectedPeriod('30D')}
                  >
                    30D
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === '90D' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    onClick={() => setSelectedPeriod('90D')}
                  >
                    90D
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Views</p>
                    <p className="text-2xl font-semibold">{performance?.views.total || 0}</p>
                    <p className="text-sm text-green-600">{performance?.views.change}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Engagement Rate</p>
                    <p className="text-2xl font-semibold">{performance?.engagement.rate || '0%'}</p>
                    <p className="text-sm text-green-600">{performance?.engagement.change}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Top Performing Content</h4>
                  {performance?.topContent?.map((content: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{content.title}</p>
                      <p className="text-sm font-medium">{content.views} views</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* API Usage Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">API Usage</h3>
                  <p className="text-sm text-gray-500">
                    Success Rate: {apiUsage?.total.successRate || '0%'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === '7D' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    onClick={() => setSelectedPeriod('7D')}
                  >
                    7D
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === '30D' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    onClick={() => setSelectedPeriod('30D')}
                  >
                    30D
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === '90D' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    onClick={() => setSelectedPeriod('90D')}
                  >
                    90D
                  </button>
                </div>
              </div>
              <div className="h-64">
                <Line data={apiChartData} options={apiChartOptions} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {apiUsage?.total.requests || 0}
                  </p>
                  {/* <p className="text-sm text-blue-600">
                    {apiUsage?.total.change || '0%'}
                  </p> */}
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {apiUsage?.total.successRate || '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification & Calendar */}
          <div className="space-y-6">
            {/* Gamification Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
                <TrophyIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Content Creation</span>
                    <span className="text-gray-900">{progress?.contentCreation.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progress?.contentCreation.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Team Collaboration</span>
                    <span className="text-gray-900">{progress?.teamCollaboration.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${progress?.teamCollaboration.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">API Usage</span>
                    <span className="text-gray-900">{progress?.apiUsage.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${progress?.apiUsage.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Level</span>
                  <span className="text-sm font-medium text-gray-900">{progress?.currentLevel}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Next Level</span>
                  <span className="text-sm font-medium text-gray-900">{progress?.nextLevel.remaining} points</span>
                </div>
              </div>
            </div>

            {/* Content Calendar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Calendar</h3>
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                {tasks?.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {new Date(task.dueDate).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Website Status */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Website Status</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">Manage All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {websites?.map((website) => (
              <div key={website.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{website.name}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {website.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Content Items</span>
                    <span className="text-gray-900">{website.contentItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="text-gray-900">
                      {formatDistanceToNow(new Date(website.lastUpdated), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">API Usage</span>
                    <span className="text-gray-900">{website.apiUsage} requests</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;