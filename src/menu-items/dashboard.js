

// i want to add collapse button/toggle button so when it clicked the icons of the left side bar show only and it text hides which files i need to share you? this is my dashboard file and other fie struture also i can share
import {
  IconHome,
  IconBuilding,
  IconLayoutGrid,
  IconBuildingStore,
  IconCalendarEvent,
  IconMail,
  IconCreditCard,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconSettings,
  IconPackages,
  IconCrown,
  IconTool,
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconReceipt2,
  IconBook2,
  IconHomeCog,
  IconPlus,
  IconShoppingCart,
  IconHandClick,
  IconStack,
  IconReportAnalytics,
  IconUser,
  IconUserCheck,
  IconBuildingCommunity,
  IconWallet
} from '@tabler/icons';
import PersonIcon from '@mui/icons-material/Person';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import Person2Icon from '@mui/icons-material/Person2';
import TaskIcon from '@mui/icons-material/Task';
import { tokenPayload } from '@/helper';
import AddHomeIcon from '@mui/icons-material/AddHome';
import BookIcon from '@mui/icons-material/Book';
import CommentBankIcon from '@mui/icons-material/CommentBank';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HomeIcon from '@mui/icons-material/Home';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import i18n from '@/i18n';
import { Engineering, People } from '@mui/icons-material';
// constant
const icons = {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconPackages,
  IconCrown,
  IconTool,
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconReceipt2,
  IconBook2,
  IconHomeCog,
  IconPlus,
  IconShoppingCart,
  IconHandClick,
  IconStack,
  IconReportAnalytics,
  IconUser,
  IconUserCheck,
  IconBuildingCommunity,
  IconWallet
};


const superAdminDashboard = {
  title: i18n.t('Superadmin Dashboard'),
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/SADashboard',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: '1',
      title: i18n.t('Company Management'),
      type: 'item',
      url: '/dashboard/company',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: '2',
      title: i18n.t('Subscription'),
      type: 'item',
      url: '/dashboard/Subsciption',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: '3',
      title: i18n.t('Company Active Plans'),
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: '4',
      title: i18n.t('Transactions'),
      type: 'item',
      url: '/dashboard/transactionAll',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    }
  ]
};

const companyAdminDashboard = {
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/default',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: '3',
      title: i18n.t('Properties'),
      type: 'collapse', 
      icon: IconBuilding,
      url: '/dashboard',
      breadcrumbs: false,
      children: [
        {
          id: '3-1',
          title: i18n.t('Projects'),
          type: 'item',
          url: '/dashboard/projects',
          icon: IconBuilding,
        },
        {
          id: '3-2',
          title: i18n.t('Blocks'),
          type: 'item',
          url: '/dashboard/projects-block',
          icon: IconLayoutGrid,
        },
        {
          id: '3-3',
          title: i18n.t('Property Types'),
          type: 'item',
          url: '/dashboard/propertyTypes',
          icon: AddHomeIcon,
        },
        {
          id: '3-4',
          title: i18n.t('Properties / Units'),
          type: 'item',
          url: '/dashboard/property',
          icon: AddHomeWorkIcon,
        },
        {
          id: '3-5',
          title: i18n.t('Tenants'),
          type: 'item',
          url: '/dashboard/tenents',
          icon: IconUsers,
          breadcrumbs: false
        },
        {
          id: '3-6',
          title: i18n.t('Owners'),
          type: 'item',
          url: '/dashboard/owner',
          icon: IconCrown,
          breadcrumbs: false
        },
        {
          id: '3-7',
          title: i18n.t('Bookings'),
          type: 'item',
          url: '/dashboard/booking',
          icon: BookIcon,
          breadcrumbs: false
        },
      ]
    },
    {
      id: '4',
      title: i18n.t('Accounts'),
      type: 'collapse', 
      icon: IconCreditCard,
      url: '/dashboard/',
      breadcrumbs: false,
      children: [
        {
          id: '4-1',
          title: i18n.t('Receivables'),
          type: 'item',
          url: '/dashboard/accounts-receivable',
          icon: IconArrowDownCircle
        },
        {
          id: '4-2',
          title: i18n.t('Payables'),
          type: 'item',
          url: '/dashboard/accounts-payable',
          icon: IconArrowUpCircle
        },
        {
          id: '4-3',
          title: i18n.t('General Voucher'),
          type: 'item',
          url: '/dashboard/general-voucher',
          icon: IconReceipt2
        },
        {
          id: '4-4',
          title: i18n.t('General Ledger'),
          type: 'item',
          url: '/dashboard/general-ledger',
          icon: IconBook2
        },
        {
          id: '4-5',
          title: i18n.t('Maintenance'),
          type: 'item',
          url: '/dashboard/maintenance',
          icon: IconHomeCog,
          breadcrumbs: false
        },
        {
      id: '4-6',
      title: i18n.t('Bills'),
      type: 'item',
      url: '/dashboard/billC',
      icon: PaymentIcon,
      breadcrumbs: false
    },
      ]
    },
    {
      id: '5',
      title: i18n.t('Inventory'),
      type: 'collapse', 
      icon: IconPackages,
      url: '/dashboard/',
      breadcrumbs: false,
      children: [
        {
          id: '5-1',
          title: i18n.t('Add Product'),
          type: 'item',
          url: '/dashboard/product-registration',
          icon: IconPlus
        },
        {
          id: '5-2',
          title: i18n.t('Product Purchase'),
          type: 'item',
          url: '/dashboard/product-purchasing',
          icon: IconShoppingCart
        },
        {
          id: '5-3',
          title: i18n.t('Product Use'),
          type: 'item',
          url: '/dashboard/product-use',
          icon: IconHandClick
        },
        {
          id: '5-4',
          title: i18n.t('Product Stock'),
          type: 'item',
          url: '/dashboard/stock-reports',
          icon: IconStack
        },
        {
          id: '5-5',
          title: i18n.t('Product Activity Report'),
          type: 'item',
          url: '/dashboard/product-activities',
          icon: IconReportAnalytics
        }
      ]
    },
    {
      id: '6',
      title: i18n.t('Master'),
      type: 'collapse',
      icon: IconCrown,
      url: '/dashboard/',
      breadcrumbs: false,
      children: [
       
        {
          id: '6-3',
          title: i18n.t('Staff'),
          type: 'item',
          url: '/dashboard/staff',
          icon: IconUserCheck,
          breadcrumbs: false
        },
        {
          id: '6-4',
          title: i18n.t('Vendors'),
          type: 'item',
          url: '/dashboard/vendor-management',
          icon: IconBuildingStore,
          breadcrumbs: false
        },
        {
          id: '6-5',
          title: i18n.t('Outsoursing Companies'),
          type: 'item',
          url: '/dashboard/serviceprovider',
          icon: IconBuildingCommunity,
          breadcrumbs: false
        },
        {
          id: '6-6',
          title: i18n.t('Users'),
          type: 'item',
          url: '/dashboard/user',
          icon: IconUser,
          breadcrumbs: false
        },
        {
          id: '6-7',
          title: i18n.t('Transactional Accounts'),
          type: 'item',
          url: '/dashboard/transactionalAccounts',
          icon: IconWallet
        }
      ]
    },
    {
      id: '7',
      title: i18n.t('Services'),
      type: 'collapse', 
      icon: IconTool,
      url: '/dashboard/',
      breadcrumbs: false,
      children: [
        {
          id: '7-1',
          title: i18n.t('Announcements'),
          type: 'item',
          url: '/dashboard/announcement',
          icon: AnnouncementIcon,
          breadcrumbs: false
        },
        {
          id: '7-2',
          title: i18n.t('Complaints'),
          type: 'item',
          url: '/dashboard/companyComplaints',
          icon: CommentBankIcon,
          breadcrumbs: false
        },
   
      ]
    },
    
  
    {
      id: '8',
      title: i18n.t('Settings'),
      type: 'item',
      url: '/dashboard/profile',
      icon: IconSettings,
      breadcrumbs: false
    },
   
  ]
};

const staffDashboard = {
  title: i18n.t('Staff Dashboard'),
  type: 'group',
  children: [

    {
      id: 'default',
      title: i18n.t('My Jobs'),
      type: 'item',
      url: '/dashboard/myjobs',
      icon: PersonIcon,
      breadcrumbs: false
    },
   
  ]
};

const ownerDashboard = {
  title: i18n.t('Staff Dashboard'),
  type: 'group',
  children: [

    {
      id: 'default',
      title: i18n.t('My Jobs'),
      type: 'item',
      url: '/dashboard/myjobs',
      icon: PersonIcon,
      breadcrumbs: false
    },

  ]
};

const tenantDashboard = {
  title: i18n.t('Tenant Dashboard'),
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/TDashboard',
      icon: HomeIcon,
      breadcrumbs: false
    },

    {
      id: '2',
      title: i18n.t('Bookings'),
      type: 'item',
      url: '/dashboard/tenantBooking',
      icon: icons.IconFileUpload,
      breadcrumbs: false
    },
    {
      id: '3',
      title: i18n.t('Complaints'),
      type: 'item',
      url: '/dashboard/complaints',
      icon: CommentBankIcon,
      breadcrumbs: false
    },
    {
      id: '4',
      title: i18n.t('Bills'),
      type: 'item',
      url: '/dashboard/billT',
      icon: PaymentIcon,
      breadcrumbs: false
    },
{
      id: '5',
      title: i18n.t('Announcements'),
      type: 'item',
      url: '/dashboard/announcement',
      icon: AnnouncementIcon,
      breadcrumbs: false
    },
    
    {
      id: '6',
      title: i18n.t('Services'),
      type: 'item',
      url: '/dashboard/resident-service',
      icon: ContactPageIcon,
      breadcrumbs: false
    }
  ]
};

const payload = tokenPayload();
const role = payload?.role || '';

let dashboardMenu;

switch (role) {
  case 'admin':
    dashboardMenu = superAdminDashboard;
    break;
  case 'companyAdmin':
    dashboardMenu = companyAdminDashboard;
    break;
  case 'staff':
    dashboardMenu = staffDashboard;
    break;
  case 'tenant':
    dashboardMenu = tenantDashboard;
    break;
  case 'owner':
    dashboardMenu = ownerDashboard;
    break;
  default:
    dashboardMenu = { title: i18n.t('No Access'), type: 'group', children: [] };
}

export default dashboardMenu;
