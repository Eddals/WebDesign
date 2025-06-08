import RecentPurchaseNotification from './RecentPurchaseNotification';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <RecentPurchaseNotification />
      <Footer />
    </>
  );
};