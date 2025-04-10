import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardNavCards from '@/components/dashboard/DashboardNavCards';
import UpcomingContent from '@/components/dashboard/UpcomingContent';
import RecentActivity from '@/components/dashboard/RecentActivity';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardOverview />
          <div className="mt-6">
            <UpcomingContent />
          </div>
        </div>
        <div className="space-y-6">
          <PerformanceMetrics />
          <RecentActivity />
        </div>
      </div>

      <DashboardNavCards />
    </div>
  );
}
