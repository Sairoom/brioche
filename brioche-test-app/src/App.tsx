import Main from './pages/Main/Main';
import Delivery from './pages/Delivery/Delivery';
import History from './pages/History/History';
import About from './pages/About/About';
import Order from './pages/Order/Order';
import Payment from './pages/Payment/Payment';
import Contacts from './pages/Contacts/Contacts';
import Reserve from './pages/Reserve/Reserve';
import Pasxa from './pages/Pasxa/Pasxa';
import Breakfast from './pages/Breakfast/Breakfast';
import Candies from './pages/Candies/Candies';
import StandardCakes from './pages/StandardCakes/StandardCakes';
import Coffee from './pages/Coffee/Coffee';
import Tableware from './pages/Tableware/Tableware';
import Cart from './pages/Cart/Cart';
import ProductDetail from './pages/ProductDetail/ProductDetail';

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

  if (currentPath === '/pasxa') {
    return <Pasxa />;
  }

  if (currentPath === '/breakfast') {
    return <Breakfast />;
  }

  if (currentPath === '/candies') {
    return <Candies />;
  }

  if (currentPath === '/standard-cakes') {
    return <StandardCakes />;
  }

  if (currentPath === '/coffee') {
    return <Coffee />;
  }

  if (currentPath === '/tableware') {
    return <Tableware />;
  }

  if (currentPath === '/cart') {
    return <Cart />;
  }

  if (currentPath === '/products/benedict-pastrami') {
    return <ProductDetail />;
  }

  return <Main />;
};

export default App;
