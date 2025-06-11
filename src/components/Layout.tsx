import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LiveChat from './LiveChat';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
      <LiveChat />
      <Footer />
    </>
  );
};

export default Layout;