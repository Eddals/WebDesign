import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import RecentPurchaseNotification from './RecentPurchaseNotification';
import LiveChat from './LiveChat';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
      <RecentPurchaseNotification />
      <LiveChat />
      <Footer />
    </>
  );
};

export default Layout;