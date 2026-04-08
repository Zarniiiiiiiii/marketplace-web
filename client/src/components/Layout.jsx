import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ToastHost from './ToastHost';

export default function Layout() {
  return (
    <div className="page-shell">
      <Header />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
      <ToastHost />
    </div>
  );
}