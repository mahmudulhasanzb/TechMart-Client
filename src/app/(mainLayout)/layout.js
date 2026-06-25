import Footer from '@/components/layouts/Footer';
import Navbar from '@/components/layouts/Navbar';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer/>
    </>
  );
}
