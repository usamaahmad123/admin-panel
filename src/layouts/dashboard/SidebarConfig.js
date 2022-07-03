import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import userAddOutlined from '@iconify/icons-ant-design/user-add-outlined';
import settingFilled from '@iconify/icons-ant-design/setting-filled';
import bookOutlined from '@iconify/icons-ant-design/book-outlined';
import fileImageOutlined from '@iconify/icons-ant-design/file-image-outlined';
import baselineCategory from '@iconify/icons-ic/baseline-category';
import baselineLabel from '@iconify/icons-ic/baseline-label';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import QuizIcon from '@mui/icons-material/Quiz';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import ReviewsIcon from '@mui/icons-material/Reviews';
import MapIcon from '@mui/icons-material/Map';
import TableViewIcon from '@mui/icons-material/TableView';
import GroupsIcon from '@mui/icons-material/Groups';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------
const getIcon = (name) => <Icon icon={name} width={22} height={22} />;
const getIconSVG = (name) => (
  <SvgIconStyle src={`/static/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);
const SidebarConfig = () => {
  if (localStorage.getItem('Role') === '2' || localStorage.getItem('Role') === '0') {
    return [
      {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon(pieChart2Fill)
      },
      {
        title: 'Setup',
        path: '/dashboar',
        icon: getIcon(settingFilled),
        children: [
          {
            title: 'Signup Settings',
            path: '/dashboard/signupsettings',
            icon: getIcon(settingFilled)
          },
          {
            title: 'Patient formbuilder',
            path: '/dashboard/formbuilder',
            icon: getIcon(settingFilled)
          },
          {
            title: 'patient list',
            path: '/dashboard/registeredpatients',
            icon: getIcon(userAddOutlined)
          },
          {
            title: 'categories list',
            path: '/dashboard/categories',
            icon: getIcon(baselineCategory)
          },
          {
            title: 'labels list',
            path: '/dashboard/labels',
            icon: getIcon(baselineLabel)
          }
        ]
      },
      {
        title: 'User management',
        path: '/dashboard/user',
        icon: getIcon(peopleFill),
        children: [
          {
            title: 'all users',
            path: '/dashboard/user/all',
            icon: getIcon(peopleFill)
          },
          {
            title: 'deleted users',
            path: '/dashboard/user/deleted',
            icon: getIcon(peopleFill)
          }
        ]
      },
      {
        title: 'Patient registration',
        path: '/dashboard/registration',
        icon: <HowToRegOutlinedIcon />
      },

      {
        title: 'Patient check in for appointment',
        path: '/dashboard/appointment',
        icon: <BookOnlineIcon />
      },
      {
        title: 'Schedule patient',
        path: '/dashboard/schedule',
        icon: <EventNoteIcon />
      },
      {
        title: 'Patient visit documentation',
        path: '/dashboard/documentation',
        icon: <AssignmentIndIcon />
      },
      {
        title: 'Image management',
        path: '/dashboard/gallery',
        icon: getIcon(fileImageOutlined)
      },
      {
        title: 'Prescribe medication for patient',
        path: '/dashboard/medication',
        icon: <VaccinesIcon />
      },
      {
        title: 'Order test (path)',
        path: '/dashboard/order',
        icon: <QuizIcon />
      },
      {
        title: 'View results (path reports)',
        path: '/dashboard/pathreports',
        icon: <FilterFramesIcon />
      },
      {
        title: 'Edit / activity log',
        path: '/dashboard/logs',
        icon: getIconSVG('ic_analytics')
      },
      {
        title: 'Send patient charts to outside institutions',
        path: '/dashboard/charts',
        icon: <BarChartIcon />
      },
      {
        title: 'Patient billing',
        path: '/dashboard/billing',
        icon: <CreditCardIcon />
      },
      {
        title: 'Billing (claims) management',
        path: '/dashboard/management',
        icon: <AccountBalanceWalletIcon />
      },
      {
        title: 'Patient appointment and results notifications',
        path: '/dashboard/notifications',
        icon: <BookOnlineIcon />
      },
      {
        title: 'System security',
        path: '/dashboard/security',
        icon: <SecurityIcon />
      },
      {
        title: 'Online Review Management',
        path: '/dashboard/review',
        icon: <ReviewsIcon />
      },
      {
        title: 'Body map app',
        path: '/dashboard/mapapp',
        icon: <MapIcon />
      },
      {
        title: 'Grid for database table management',
        path: '/dashboard/database',
        icon: <TableViewIcon />
      },
      {
        title: 'Path group module (index lesion)',
        path: '/dashboard/pathgroup',
        icon: <GroupsIcon />
      },
      {
        title: 'Book appointment',
        path: '/dashboard/bookappointment',
        icon: getIcon(bookOutlined)
      }
    ];
  }
  if (localStorage.getItem('Role') === '1') {
    return [
      {
        title: 'Book appointment',
        path: '/dashboard/bookappointment',
        icon: getIcon(bookOutlined)
      },
      {
        title: 'Gallery view',
        path: '/dashboard/gallery',
        icon: getIcon(fileImageOutlined)
      }
    ];
  }
};

export default SidebarConfig;
