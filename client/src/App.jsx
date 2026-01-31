import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { socket } from './socket';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import AppLayout from './components/AppLayout';
import Shop from './pages/Shop';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Collections from './pages/Collections';
import Support from './pages/Support';
import Profile from './pages/Profile';
import ItemDetails from './pages/ItemDetails';
import Blogs from './pages/Blogs';
import AddProduct from './pages/AddProduct';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import NotFound from './pages/NotFound';
import { setsocketconnected } from './store/reducers/authSlice';
import { asyncloaduser } from './store/actions/authActions';

const App = () => {

  const dispatch = useDispatch();
  const { user, status, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user && status === 'idle') {
      dispatch(asyncloaduser());
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    if (isAuthenticated && user) {
      socket.connect();

      socket.on('connect', () => {
        dispatch(setsocketconnected(true));
        console.log('Connected to WebSocket server');
      });
    }

    return () => {
      socket.off('connect');
      dispatch(setsocketconnected(false));
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop/:itemId" element={<ItemDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/dashboard/add-product" element={<AddProduct />} />
      </Route>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App