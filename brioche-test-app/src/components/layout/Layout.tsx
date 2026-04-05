import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import './Layout.scss';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout__content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
