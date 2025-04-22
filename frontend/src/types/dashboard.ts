export interface DashboardStats {
  activeWebsites: {
    count: number;
    change: number;
  };
  totalContent: {
    count: number;
    change: number;
  };
  teamMembers: {
    count: number;
    status: string;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  // Super Admin specific stats
  totalUsers?: number;
  activeSubscriptions?: number;
  totalRevenue?: number;
}

export interface SubscriptionDetails {
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