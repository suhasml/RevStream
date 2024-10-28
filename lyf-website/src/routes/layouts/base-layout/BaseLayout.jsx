import React from 'react';
import GlobalFooter from 'components/global-footer/GlobalFooter';
// import GlobalNavbar from 'components/global-navbar/GlobalNavbar';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'components/scroll-to-top/ScrollToTop';
import Chat from 'routes/chat-bot/Chat';

/**
 * BaseLayout Component
 * Renders the base layout for the application.
 * It includes the global navbar, the main content, and the global footer.
 * @returns {JSX.Element} - The BaseLayout component.
 */
const BaseLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <GlobalNavbar /> */}
      <ScrollToTop />
      <Chat />
      <main className="flex-grow">
        <Outlet />
      </main>
      <GlobalFooter />
    </div>
  );
};

export default BaseLayout;
