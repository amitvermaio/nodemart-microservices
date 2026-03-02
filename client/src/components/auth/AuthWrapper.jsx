import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthWrapper = ({ role }) => {
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthWrapper;