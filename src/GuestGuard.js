import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getToken } from './components/authentication/AuthService';
// hooks
// import useAuth from '../hooks/useAuth';
// routes
// import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  if (getToken()) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
