import { DashboardSidebar } from '@/components/DashboardSidebar';
import Footer from '@/components/layouts/Footer';

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="flex flex-1 h-screen">
        <DashboardSidebar />
        {children}
      </div>
      <Footer />
    </>
  );
}
