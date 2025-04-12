import axios from 'axios';
import { API_BASE_URL } from '../config';

interface DashboardStats {
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
    apiRequests: {
        count: number;
        change: string;
    };
}

interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
    user: string;
    icon: string;
}

interface ContentPerformance {
    views: {
        total: number;
        change: string;
    };
    engagement: {
        rate: string;
        change: string;
    };
    topContent: Array<{
        title: string;
        views: number;
    }>;
}

interface UserProgress {
    contentCreation: {
        percentage: number;
        points: number;
    };
    teamCollaboration: {
        percentage: number;
        points: number;
    };
    apiUsage: {
        percentage: number;
        points: number;
    };
    currentLevel: string;
    nextLevel: {
        points: number;
        remaining: number;
    };
}

interface WebsiteStatus {
    id: string;
    name: string;
    status: string;
    contentItems: number;
    lastUpdated: string;
    apiUsage: number;
}

interface ContentTask {
    id: string;
    title: string;
    dueDate: string;
    status: string;
    website: string;
}

interface ApiUsage {
    total: {
        requests: number;
        successRate: string;
        change: string;
    };
    dailyData: Array<{
        _id: string;
        count: number;
        successCount: number;
    }>;
}

interface SubscriptionDetails {
  plan: {
    name: string;
    price: string;
    billingCycle: string;
    status: string;
  };
  nextPaymentDate: string;
  daysRemaining: number;
  apiKeys: {
    used: number;
    limit: number;
    keys: any[];
  };
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

class DashboardService {
    private api = axios.create({
        baseURL: `${API_BASE_URL}/api/dashboard`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add token to requests
    constructor() {
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    // Get Dashboard Stats
    async getStats(): Promise<DashboardStats> {
        try {
            const response = await this.api.get('/stats');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }

    // Get Recent Activity
    async getRecentActivity(): Promise<Activity[]> {
        const response = await this.api.get('/recent-activity');
        return response.data.data.logs;
    }

    // Get Content Performance
    async getContentPerformance(period: '7D' | '30D' | '90D' = '7D'): Promise<ContentPerformance> {
        const response = await this.api.get(`/content-performance?period=${period}`);
        return response.data.data;
    }

    // Get User Progress
    async getUserProgress(): Promise<UserProgress> {
        const response = await this.api.get('/user-progress');
        return response.data.data;
    }

    // Get Website Status
    async getWebsiteStatus(): Promise<WebsiteStatus[]> {
        const response = await this.api.get('/website-status');
        return response.data.data.websites;
    }

    // Get Content Calendar
    async getContentCalendar(): Promise<ContentTask[]> {
        const response = await this.api.get('/content-calendar');
        return response.data.data.tasks;
    }

    // Get API Usage
    async getApiUsage(period: '7D' | '30D' | '90D' = '7D'): Promise<ApiUsage> {
        const response = await this.api.get(`/api-usage?period=${period}`);
        return response.data.data;
    }

    async getSubscriptionDetails(): Promise<SubscriptionDetails> {
        try {
            const response = await this.api.get('/subscription');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
}

export const dashboardService = new DashboardService(); 