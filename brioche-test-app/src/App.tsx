import Main from './pages/Main/Main';
import Delivery from './pages/Delivery/Delivery';
import History from './pages/History/History';
import About from './pages/About/About';
import Order from './pages/Order/Order';
import Payment from './pages/Payment/Payment';
import Contacts from './pages/Contacts/Contacts';
import Reserve from './pages/Reserve/Reserve';

const App = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

  if (currentPath === '/delivery') {
    return <Delivery />;
  }

  if (currentPath === '/project-history') {
    return <History />;
  }

  if (currentPath === '/about-shop') {
    return <About />;
  }

  if (currentPath === '/how-to-order') {
    return <Order />;
  }

  if (currentPath === '/payment') {
    return <Payment />;
  }

  if (currentPath === '/contacts') {
    return <Contacts />;
  }

  if (currentPath === '/reserve') {
    return <Reserve />;
  }

  return <Main />;
};

export default App;
