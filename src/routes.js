import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import User from './pages/User';
import NotFound from './pages/Page404';
import AuthGuard from './AuthGuard';
import GuestGuard from './GuestGuard';
import UserView from './pages/UserView';
import UserEdit from './pages/UserEdit';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user/all', element: <User /> },
        { path: 'userdetails', element: <UserEdit /> },
        { path: 'viewuser/:id/:userid', element: <UserView /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/dashboard/404" /> }
      ]
    },
    {
      path: '/',
      element: (
        <GuestGuard>
          <LogoOnlyLayout />
        </GuestGuard>
      ),
      children: [
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/login" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
