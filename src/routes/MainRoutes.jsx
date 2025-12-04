/* eslint-disable prettier/prettier */
import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import Property from '@/views/Property';
// import Units from '@/views/Units';
import Tenents from '@/views/Tenants';

import Complaints from '@/views/Complaints';
import Announcement from '@/views/Announcement';
import Company from '@/views/Company';
import PropertyTypes from '@/views/PropertyTypes';
import { parseJWT } from '@/helper';
import Booking from '@/views/Booking';
import TenantBooking from '@/views/TenantBooking';
import CompanyComplaints from '@/views/CompanyComplaints';
// import ComplainViewDashboard from '@/views/CompanyComplaints/component/ComplainView';
import ComplainDetailsPage from '@/views/CompanyComplaints/component/ComplainView';
import ComplainViewForTenant from '@/views/CompanyComplaints/component/ComplainViewForTenant';
import ComplainDetailsPageForTenant from '@/views/Complaints/component/TenantComaplainView';
import BookingDetailsPage from '@/views/Booking/component/BookingView';
import BookingDetailsTenantPage from '@/views/TenantBooking/component/BookingTenantDetails';
import VacantProperties from '@/views/VacantProperties';
// import { element } from 'prop-types';
import Propertyview from '@/views/Property/component/propertyView';
import OwnerDetails from '@/views/Owner/Components/OwnerDetails';
import TenentView from '@/views/Tenants/component/TenentViews';
// import AgentView from '@/views/Staff/components/StaffView';
// import CreateBill from '@/views/Booking/component/CreateBill';
// import CreateBill from '@/views/Booking/component/CreateBill';
import Bill from '@/views/Bill/indexC';
import BillT from '@/views/Bill/indexT';
import ServiceProvider from '@/views/ServiceProvider';
import AnnouncementViewPage from '@/views/Announcement/components/AnnouncementView';
import VacantPropertyView from '@/views/VacantProperties/Component/VacantPropertyView';
// import GenerateMonthlyBill from '@/views/Booking/CreateBill';
import MonthlyInvoiceView from '@/views/Bill/MonthlyInvoiceView';
import BillA from '@/views/Bill/indexA';
import ComplainDetailsPageForAgent from '@/views/Complaints/component/AgentComplainView';
import ProfilePage from '@/views/ProfilePage';
// import ATDashboard from '@/views/DashboardAT/indexA';
import ADashboard from '@/views/DashboardAT/indexA';
import TDashboard from '@/views/DashboardAT/indexT';
import SADashboard from '@/views/DashboardAT/indexSA';
import BillC from '@/views/Bill/indexC';
import Subsciption from '@/views/Subscription';
import CompanyView from '@/views/Company/components/view';
import SubsciptionCards from '@/views/SubscriptionCompany';
import Reports from '@/views/Report';
// import TotalTable from '@/views/DashboardAT/TotalTable';
import ChangePasswordForTenant from '@/views/Tenants/component/ChangePasswordForTenants';
import ChangePasswordForAgent from '@/views/Staff/components/ChangePasswordForStaff';
import CompanyReport from '@/views/CompanyReports';
import Transaction from '@/views/Transaction/indecC';
import TransactionSA from '@/views/Transaction/indexSA';
import ChangePasswordForCompany from '@/views/Company/components/changePasswordForCompany';
import ProductRegistration from '@/views/inventoryManagementSystem/ProductRegistration';
import ProductPurchasing from '@/views/inventoryManagementSystem/ProductPurchasing';
import ProductUse from '@/views/inventoryManagementSystem/ProductUse';
import StockReport from '@/views/inventoryManagementSystem/StockReports';
import Projects from '@/views/Projects';
import ProjectsBlock from '@/views/ProjectsBlock';
import StaffManagement from '@/views/StaffManagement';
import Defaulter from '@/views/Defaulter';
import ServicesManagement from '@/views/Services';
import TenantServices from '@/views/TenantServices';
import MyJobs from '@/views/MyJobs';
import MyJobsView from '@/views/MyJobs/myJobsView';
import Maintenance from '@/views/Maintenance';
import VendorManagement from '@/views/Venders';
import GeneralVoucher from '@/views/Accounts/GeneralVoucher';
import AccountsPayable from '@/views/Accounts/AccountPayable';
import PettyCash from '@/views/Accounts/PettyCash';
import AccountsReceivable from '@/views/Accounts/AccountReceivable';
import TransactionalAccounts from '@/views/TransactionalAccounts';
// import { element } from 'prop-types';
import ProductActivity from '@/views/inventoryManagementSystem/ProductActvites';
import AccountsPayableView from '@/views/Accounts/components/accountPayableView';
import { element } from 'prop-types';
import LedgerReportPage from '@/views/Accounts/PettyCash';
import LedgerFilterForm from '@/views/Accounts/components/LedgerFilterForm';
import VoucherManagement from '@/views/Accounts/VoucherManagement';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('@/views/dashboard/Default')));
// const ContactManagement = Loadable(lazy(() => import('@/views/Contact')));
// const Call = Loadable(lazy(() => import('@/views/Calls')));
// const Policy = Loadable(lazy(() => import('@/views/Policy')));
// const Metting = Loadable(lazy(() => import('@/views/Metting')));
const Payment = Loadable(lazy(() => import('@/views/Payments')));
const Email = Loadable(lazy(() => import('@/views/Email')));
// const Task = Loadable(lazy(() => import('@/views/Task')));
// const EmailTemplates = Loadable(lazy(() => import('@/views/EmailTemplates')));
const Document = Loadable(lazy(() => import('@/views/VacantProperties')));
// const Calender = Loadable(lazy(() => import('@/views/Calender')));
const AddTemplates = Loadable(lazy(() => import('@/views/EmailTemplates/AddTemplates')));
const Staff = Loadable(lazy(() => import('@/views/Staff')));
const Owner = Loadable(lazy(() => import('@/views/Owner')));
const User = Loadable(lazy(() => import('@/views/User')));
//const TransactionalAccounts = Loadable(lazy(() => import('@/views/TransactionalAccounts')))

let token = localStorage.getItem('$2b$10$ehdPSDmr6P');
const payload = parseJWT(token);

const superAdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        { path: 'SADashboard', element: <SADashboard /> },
        { path: 'Subsciption', element: <Subsciption /> },
        // { path: 'totaltable', element: <TotalTable /> },
        { path: 'company/view', element: <CompanyView /> },
        { path: 'transactionAll', element: <TransactionSA /> },
        { path: 'company/changepassword', element: <ChangePasswordForCompany /> },
        { path: 'company', element: <Company /> },
        { path: 'property', element: <Property /> },
        { path: 'reports', element: <Reports /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'payment', element: <Payment /> },
        { path: 'staff', element: <Staff /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        // { path: 'meeting', element: <Metting /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> },
        { path: 'emailtemplate/addTemplates', element: <AddTemplates /> }
      ]
    }
  ]
};

const companyAdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        { path: 'default', element: <DashboardDefault /> },
        { path: 'projects', element: <Projects /> },
        { path: 'projects-block', element: <ProjectsBlock /> },
        { path: 'vendor-management', element: <VendorManagement /> },
        { path: 'accounts-receivable', element: <AccountsReceivable /> },
        { path: 'accounts-payable', element: <AccountsPayable /> },
        { path: 'accounts-payable/view', element: <AccountsPayableView /> },
        { path: 'general-voucher', element: <GeneralVoucher /> },
        { path: 'general-ledger', element: <LedgerFilterForm /> },
        { path: 'ledger-report', element: <LedgerReportPage/>},
        { path: 'vouchers', element: <VoucherManagement/>},
        { path: 'property', element: <Property /> },
        { path: 'propertyTypes', element: <PropertyTypes /> },
        { path: 'product-registration', element: <ProductRegistration /> },
        { path: 'product-purchasing', element: <ProductPurchasing /> },
        { path: 'stock-reports', element: <StockReport /> },  
        { path: 'product-activities', element: <ProductActivity /> },
        { path: 'product-use', element: <ProductUse /> },
        { path: 'subcriptionCards', element: <SubsciptionCards /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'payment', element: <Payment /> },
        { path: 'billC', element: <BillC /> },
        { path: 'transaction', element: <Transaction /> },
        { path: 'companyReport', element: <CompanyReport /> },
        { path: 'announcement/view', element: <AnnouncementViewPage /> },
        { path: 'tenant/changepassword', element: <ChangePasswordForTenant /> },
        { path: 'staff/changepassword', element: <ChangePasswordForAgent /> },
        { path: 'staff-management', element: <StaffManagement /> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'companyComplaints', element: <CompanyComplaints /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        { path: 'staff', element: <Staff /> },
        { path: 'booking', element: <Booking /> },
        { path: 'defaulters', element: <Defaulter /> },
        { path: 'services', element: <ServicesManagement /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'complain/view', element: <ComplainDetailsPage /> },
        { path: 'complain/tenant/view', element: <ComplainViewForTenant /> },
        { path: 'booking/view', element: <BookingDetailsPage /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'owner/view', element: <OwnerDetails /> },
        { path: 'tenant/view', element: <TenentView /> },
        // { path: 'agent/view', element: <AgentView /> },
        // { path: 'meeting', element: <Metting /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> },
        { path: 'emailtemplate/addTemplates', element: <AddTemplates /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'user', element: <User/>},
        { path: 'transactionalAccounts', element: <TransactionalAccounts /> }
      ]
    }
  ]
};

const tenantRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        // { path: 'default', element: <DashboardDefault /> },
        { path: 'TDashboard', element: <TDashboard /> },
        { path: 'property', element: <Property /> },
        { path: 'announcement/view', element: <AnnouncementViewPage /> },
        { path: 'tenantBooking', element: <TenantBooking /> },
        { path: 'payment', element: <Payment /> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        // { path: 'staff', element: <Staff /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        // { path: 'billC', element: <Bill /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'vacantproperty/view', element: <VacantPropertyView /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        // { path: 'billC', element: <Bill /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'vacantproperty/view', element: <VacantPropertyView /> },
        { path: 'billT', element: <BillT /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'vacantproperty', element: <VacantProperties /> },
        { path: 'complain/tenant/view', element: <ComplainDetailsPageForTenant /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'booking/tenant/view', element: <BookingDetailsTenantPage /> },
        { path: 'email', element: <Email /> },
        // { path: 'meeting', element: <Metting /> },
        { path: 'document', element: <Document /> },
        { path: 'resident-service', element: <TenantServices /> }
      ]
    }
  ]
};

const staffDashboardRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      // element: <DashboardDefault />
      element: <MyJobs />
    },
    {
      path: 'dashboard',
      children: [
        // { path: 'default', element: <DashboardDefault /> },
        { path: 'ADashboard', element: <ADashboard /> },
        { path: 'MyJobs', element: <MyJobs /> },
        { path: 'MyJobs/view', element: <MyJobsView /> },
        { path: 'billC', element: <Bill /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'announcement/view', element: <AnnouncementViewPage /> },
        { path: 'payment', element: <Payment /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'booking', element: <Booking /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'tenant/view', element: <TenentView /> },
        // { path: 'billT', element: <BillT /> },
        { path: 'billA', element: <BillA /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'tenant/view', element: <TenentView /> },
        // { path: 'billT', element: <BillT /> },
        { path: 'billA', element: <BillA /> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        { path: 'vacantproperty', element: <VacantProperties /> },
        // { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'complain/agent/view', element: <ComplainDetailsPageForAgent /> },
        { path: 'vacantProperty/view', element: <VacantPropertyView /> },
        { path: 'complain/agent/view', element: <ComplainDetailsPageForAgent /> },
        { path: 'vacantProperty/view', element: <VacantPropertyView /> },
        { path: 'booking/view', element: <BookingDetailsPage /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        // { path: 'meeting', element: <Metting /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> }
      ]
    }
  ]
};

const ownerDashboardRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      // element: <DashboardDefault />
      element: <MyJobs />
    },
    {
      path: 'dashboard',
      children: [
        // { path: 'default', element: <DashboardDefault /> },
        { path: 'ADashboard', element: <ADashboard /> },
        { path: 'MyJobs', element: <MyJobs /> },
        { path: 'MyJobs/view', element: <MyJobsView /> },
        { path: 'billC', element: <Bill /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'announcement/view', element: <AnnouncementViewPage /> },
        { path: 'payment', element: <Payment /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'booking', element: <Booking /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'tenant/view', element: <TenentView /> },
        // { path: 'billT', element: <BillT /> },
        { path: 'billA', element: <BillA /> },
        { path: 'property/view', element: <Propertyview /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'tenant/view', element: <TenentView /> },
        // { path: 'billT', element: <BillT /> },
        { path: 'billA', element: <BillA /> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        { path: 'billC/view', element: <MonthlyInvoiceView /> },
        { path: 'vacantproperty', element: <VacantProperties /> },
        // { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'complain/agent/view', element: <ComplainDetailsPageForAgent /> },
        { path: 'vacantProperty/view', element: <VacantPropertyView /> },
        { path: 'complain/agent/view', element: <ComplainDetailsPageForAgent /> },
        { path: 'vacantProperty/view', element: <VacantPropertyView /> },
        { path: 'booking/view', element: <BookingDetailsPage /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        // { path: 'meeting', element: <Metting /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> }
      ]
    }
  ]
};

let MainRoutes = [];

if (payload?.role === 'admin') {
  MainRoutes = superAdminRoutes;
} else if (payload?.role === 'companyAdmin') {
  MainRoutes = companyAdminRoutes;
} else if (payload?.role === 'tenant') {
  MainRoutes = tenantRoutes;
} else if (payload?.role === 'staff') {
  MainRoutes = staffDashboardRoutes;
} else if (payload?.role === 'owner') {
  MainRoutes = ownerDashboardRoutes
}

export default MainRoutes;