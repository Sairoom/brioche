import Main from './pages/Main/Main';
import Delivery from './pages/Delivery/Delivery';
import History from './pages/History/History';

const App = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

  if (currentPath === '/delivery') {
    return <Delivery />;
  }

  if (currentPath === '/project-history') {
    return <History />;
  }

  return <Main />;
};

export default App;
