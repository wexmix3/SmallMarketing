import PremiumLayout from '@/components/layout/PremiumLayout';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PremiumLayout>
        {children}
      </PremiumLayout>
    </AuthGuard>
  );
}
