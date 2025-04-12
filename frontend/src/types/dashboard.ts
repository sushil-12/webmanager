export interface DashboardStats {
  activeWebsites: {
    count: number;
    change: string;
  };
  totalContent: {
    count: number;
    change: string;
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
    status: string;
  }>;
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