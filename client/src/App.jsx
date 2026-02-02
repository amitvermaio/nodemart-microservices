import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { socket } from './socket';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import AppLayout from './components/AppLayout';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import Loader from './components/Loader';
import { setsocketconnected } from './store/reducers/authSlice';
import { asyncloaduser } from './store/actions/authActions';

const Shop = lazy(() => import('./pages/Shop'));
const Orders = lazy(() => import('./pages/Orders'));
const Cart = lazy(() => import('./pages/Cart'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Collections = lazy(() => import('./pages/Collections'));
const Support = lazy(() => import('./pages/Support'));
const Profile = lazy(() => import('./pages/Profile'));
const ItemDetails = lazy(() => import('./pages/ItemDetails'));
const Blogs = lazy(() => import('./pages/Blogs'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
    <Suspense fallback={<Loader />}>
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
    </Suspense>
  );
};

export default App;
