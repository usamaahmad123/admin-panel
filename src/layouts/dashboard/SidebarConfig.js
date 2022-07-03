import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
// ----------------------------------------------------------------------
const getIcon = (name) => <Icon icon={name} width={22} height={22} />;
const SidebarConfig = () => [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon(pieChart2Fill)
  // },
  {
    title: 'User management',
    path: '/dashboard/user/all',
    icon: getIcon(peopleFill)
  }
];

export default SidebarConfig;
