import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import RecentPurchaseNotification from './RecentPurchaseNotification';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
      <RecentPurchaseNotification />
      <Footer />
    </>
  );
};

export default Layout;