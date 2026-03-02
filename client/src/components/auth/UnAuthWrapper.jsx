import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnAuthWrapper = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UnAuthWrapper;