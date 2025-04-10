'use client';

import { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  LinkIcon,
  ArrowPathIcon,
  DocumentTextIcon as DocumentIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data for the dashboard
const mockData = {
  // Website traffic data
  websiteTraffic: {
    current: 12458,
    previous: 10234,
    percentChange: 21.7,
    data: [4200, 4500, 5100, 5400, 6100, 7200, 8100, 9300, 10200, 11500, 12000, 12458]
  },

  // Email campaign performance
  emailCampaigns: {
    sent: 5280,
    opened: 2112,
    clicked: 845,
    converted: 168,
    openRate: 40,
    clickRate: 16,
    conversionRate: 3.2,
    campaigns: [
      { name: 'Summer Sale', sent: 1200, opened: 540, clicked: 216, converted: 43 },
      { name: 'Product Launch', sent: 950, opened: 427, clicked: 171, converted: 34 },
      { name: 'Weekly Newsletter', sent: 2100, opened: 840, clicked: 336, converted: 67 },
      { name: 'Customer Feedback', sent: 1030, opened: 305, clicked: 122, converted: 24 }
    ]
  },

  // Social media performance
  socialMedia: {
    followers: 8750,
    engagement: 3.8,
    clicks: 1245,
    posts: 87,
    platforms: [
      { name: 'Facebook', followers: 3200, engagement: 2.1, clicks: 420, posts: 32 },
      { name: 'Twitter', followers: 2100, engagement: 3.4, clicks: 315, posts: 28 },
      { name: 'Instagram', followers: 2800, engagement: 5.7, clicks: 380, posts: 18 },
      { name: 'LinkedIn', followers: 650, engagement: 4.2, clicks: 130, posts: 9 }
    ]
  },

  // Correlation data
  correlation: {
    dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    traffic: [4200, 4500, 5100, 5400, 6100, 7200, 8100, 9300, 10200, 11500, 12000, 12458],
    emailClicks: [120, 145, 210, 190, 250, 310, 380, 420, 480, 520, 580, 610],
    socialClicks: [80, 110, 150, 180, 220, 270, 340, 390, 450, 490, 540, 580]
  },

  // Insights based on data
  insights: [
    {
      title: 'Email Campaign Impact',
      description: 'Your "Product Launch" campaign had the highest conversion rate at 3.6%. Consider using similar messaging in future campaigns.',
      type: 'email'
    },
    {
      title: 'Social Media Growth',
      description: 'Instagram shows the highest engagement rate (5.7%). Increasing post frequency could further boost traffic.',
      type: 'social'
    },
    {
      title: 'Traffic Source Shift',
      description: 'Direct traffic has increased by 34% since implementing your email newsletter. Continue focusing on email list growth.',
      type: 'traffic'
    },
    {
      title: 'Content Performance',
      description: 'Blog posts about industry trends generate 2.3x more engagement than product announcements. Consider creating more trend-focused content.',
      type: 'content'
    }
  ]
};

// Chart options
const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

export default function IntegrationDashboard() {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Prepare chart data
  const correlationData: ChartData<'line'> = {
    labels: mockData.correlation.dates,
    datasets: [
      {
        label: 'Website Traffic',
        data: mockData.correlation.traffic,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      },
      {
        label: 'Email Clicks',
        data: mockData.correlation.emailClicks,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      },
      {
        label: 'Social Media Clicks',
        data: mockData.correlation.socialClicks,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  };

  const campaignData: ChartData<'bar'> = {
    labels: mockData.emailCampaigns.campaigns.map(c => c.name),
    datasets: [
      {
        label: 'Sent',
        data: mockData.emailCampaigns.campaigns.map(c => c.sent),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Opened',
        data: mockData.emailCampaigns.campaigns.map(c => c.opened),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Clicked',
        data: mockData.emailCampaigns.campaigns.map(c => c.clicked),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'Converted',
        data: mockData.emailCampaigns.campaigns.map(c => c.converted),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  const socialData: ChartData<'bar'> = {
    labels: mockData.socialMedia.platforms.map(p => p.name),
    datasets: [
      {
        label: 'Engagement Rate (%)',
        data: mockData.socialMedia.platforms.map(p => p.engagement),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
      {
        label: 'Clicks per Post',
        data: mockData.socialMedia.platforms.map(p => p.clicks / p.posts),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      }
    ]
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="space-y-6 premium-dashboard premium-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Marketing Integration Dashboard</h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              id="timeframe"
              name="timeframe"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <ArrowPathIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="premium-grid premium-grid-cols-1 premium-grid-cols-md-3 premium-grid-cols-lg-4">
        <div className="premium-stat-card premium-slide-up">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Website Traffic</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{formatNumber(mockData.websiteTraffic.current)}</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
              <LinkIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              mockData.websiteTraffic.percentChange >= 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {mockData.websiteTraffic.percentChange >= 0 ? (
                <ArrowUpIcon className="-ml-1 mr-0.5 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="-ml-1 mr-0.5 h-4 w-4" />
              )}
              {Math.abs(mockData.websiteTraffic.percentChange).toFixed(1)}%
            </div>
            <span className="ml-2 text-sm text-gray-500">vs. previous period</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Email Conversion Rate</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{mockData.emailCampaigns.conversionRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-pink-100 flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <ArrowUpIcon className="-ml-1 mr-0.5 h-4 w-4" />
              0.5%
            </div>
            <span className="ml-2 text-sm text-gray-500">vs. previous period</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Social Engagement</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{mockData.socialMedia.engagement}%</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-purple-100 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <ArrowUpIcon className="-ml-1 mr-0.5 h-4 w-4" />
              1.2%
            </div>
            <span className="ml-2 text-sm text-gray-500">vs. previous period</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Total Audience</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{formatNumber(mockData.socialMedia.followers + mockData.emailCampaigns.sent)}</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-green-100 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <ArrowUpIcon className="-ml-1 mr-0.5 h-4 w-4" />
              8.3%
            </div>
            <span className="ml-2 text-sm text-gray-500">vs. previous period</span>
          </div>
        </div>
      </div>

      {/* Correlation Chart */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Marketing Channel Performance</h3>
          <p className="mt-1 text-sm text-gray-500">
            Correlation between website traffic and marketing activities
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-80">
            <Line options={lineChartOptions} data={correlationData} />
          </div>
        </div>
      </div>

      {/* Email and Social Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Email Campaign Performance</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-80">
              <Bar options={barChartOptions} data={campaignData} />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Social Media Performance</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-80">
              <Bar options={barChartOptions} data={socialData} />
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Marketing Insights</h3>
          <p className="mt-1 text-sm text-gray-500">
            Actionable recommendations based on your marketing data
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockData.insights.map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                    insight.type === 'email' ? 'bg-pink-100' :
                    insight.type === 'social' ? 'bg-purple-100' :
                    insight.type === 'traffic' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    {insight.type === 'email' && <EnvelopeIcon className="h-6 w-6 text-pink-600" />}
                    {insight.type === 'social' && <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />}
                    {insight.type === 'traffic' && <LinkIcon className="h-6 w-6 text-blue-600" />}
                    {insight.type === 'content' && <DocumentIcon className="h-6 w-6 text-green-600" />}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{insight.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
