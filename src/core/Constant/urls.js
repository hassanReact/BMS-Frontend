/* eslint-disable prettier/prettier */
const base = import.meta.env.VITE_BASE_URL; // 'https://rentals.samyotech.in/api/v1';
const imageBase = import.meta.env.VITE_BASE_URL; // 'https://rentals.samyotech.in/';
export const urls = Object.freeze({
  // SuperAdmin
  user: {
    register: base + '/user/register',
    login: base + '/user/login',
    update: base + '/user/update',
    adminDashboard: base + '/company/totalData'
  },
  bill: {
    createBill: base + '/bill/createBill',
    getAllBill: base + '/bill/getAllBill',
    getBillByT: base + '/bill/getBillForT',
    getBillForTPending: base + '/bill/getBillForTPending',
    getBillById: base + '/bill/getBillById',
    changeBillStatus: base + '/bill/changeBillStatus',
    delete: base + '/bill/DeleteBill',
    getBillByAgentId: base + '/bill/getBillByAgentId',
    getBillByBookingId: base + '/bill/getBillByBookingId',
    dashboardChartApi: base + '/bill/getMonthlyBillData',
    monthlyRentRevenue: base + '/bill/getTotalSales',
    setYearlySale: base + '/bill/totalYearlySales',
    pendingBillCounts: base + '/bill/totalPendingBills',
    paidBillCounts: base + '/bill/totalPaidBills',
    getAllUnpaidBillForAgent: base + '/bill/getAllUnpaidBillForAgent',
    getMonthlyBillOfTenants: base + '/bill/getMonthlyBillOfTenants',
    getMonthlyPaidBillsForAgent: base + '/bill/getMonthlyPaidBillsForAgent',
    getBillSummaryBetweenDates: base + '/bill/getBillSummaryBetweenDates'
  },
  company: {
    create: base + '/company/register',
    login: base + '/company/login',
    companydata: base + '/company/getAllCompanies',
    edit: base + '/company/edit',
    delete: base + '/company/delete',
    complaintData: base + '/company/getComplaints',
    getCompanyById: base + '/company/getCompanyById',
    changestatus: base + '/company/changestatus',
    addSmtpMailPassword: base + '/company/addMailPassword',
    changeMailStatus: base + '/company/updateMailStatus',
    addSubcriptionPlan: base + '/company/addSubcriptionPlan',
    getSubcriptionDetails: base + '/company/getCompananySubcription',
    activeCompany: base + '/company/totalActiveCompany',
    changePassword: base + '/company/changePassword',
    whatAppStatus: base + '/company/updateWhataapStatus'
  },
  propertyTypes: {
    create: base + '/types/createType',
    getdata: base + '/types/getAllTypes',
    edit: base + '/types/editType',
    delete: base + '/types/delete'
  },
  owner: {
    create: base + '/owner/register',
    // login: base + '/owner/login',
    delete: base + '/owner/delete',
    edit: base + '/owner/edit',
    ownerdata: base + '/owner/getAllOwner',
    ownerById: base + '/owner/getOwnerById',
    getPropertyByOwnerId: base + '/owner/getPropertyByOwnerId',
    bulkUploadOwner: base + '/owner/bulkUploadOwner'
  },
  staff: {
    create: base + '/staff/register',
    login: base + '/staff/login',
    staffdata: base + '/staff/getAllStaff',
    edit: base + '/staff/edit',
    delete: base + '/staff/delete',
    getStaffById: base + '/staff/getStaffById',
    changePassword: base + '/staff/changePassword',
    getAllJobs: base + '/staff/getAllJobs'
  },
  property: {
    create: base + '/property/register',
    editdata: base + '/property/editproperty',
    propertydata: base + '/property/getproperty',
    getPropertyById: base + '/property/getPropertyById',
    propertyDataAll: base + '/property/getAllProperties',
    delete: base + '/property/delete',
    getVacantProperty: base + '/property/vacantproperty',
    uploadPics: base + '/property/upload',
    uplaodImages: base + '/property/uploadImages',
    getAllImgByPropertyId: base + '/property/getAllImages',
    deleteImg: base + '/property/deleteImg',
    image: imageBase
  },
  tenant: {
    create: base + '/tenant/register',
    // login: base + '/tenant/login',
    tenantdata: base + '/tenant/getTenants',
    editdata: base + '/tenant/editTenant',
    getTenantById: base + '/tenant/getTenantById',
    delete: base + '/tenant/delete',
    tenantBookingData: base + '/tenant/mybooking',
    getMyTenants: base + '/tenant/getMyTenants',
    getAllTenants: base + '/tenant/getAllTenants',
    tenantDocs: base + '/tenant/tenantDoc',
    getAllDocByTenantId: base + '/tenant/getAllDocs',
    deleteDocs: base + '/tenant/deleteDoc',
    image: imageBase,
    bulkUpload: base + '/tenant/bulkUploadTenants',
    changePassword: base + '/tenant/changePassword'
  },
  booking: {
    create: base + '/booking/create',
    bookingdata: base + '/booking/getBooking',
    allbooking: base + '/booking/allBooking',
    updateBooking: base + '/booking/editBooking',
    breakTheBooking: base + '/booking/breakTheBooking',
    getBookingById: base + '/booking/getBookingById',
    propertyOnNotice: base + '/booking/propertyOnNotice'
  },
  Complaints: {
    create: base + '/complain/register',
    getComplain: base + '/complain/allComplain',
    editComlplain: base + '/complain/editComplain',
    delete: base + '/complain/delete',
    getComplainById: base + '/complain/getComplainById',
    allComplainForCompany: base + '/complain/allComplainForCompany',
    addCommentToComplain: base + '/complain/addCommentToComplain',
    resolveComplain: base + '/complain/resolveComplain',
    getAllComplainCompanyAgent: base + '/complain/getAllComplainCompanyAgent',
    assignStaffToTenant: base + '/complain/assignedStaff'
  },
  serviceProvider: {
    create: base + '/serviceProvider/register',
    getAll: base + '/serviceProvider/getServiceProviders',
    updateServiceProvider: base + '/serviceProvider/edit',
    delete: base + '/serviceProvider/delete',
    postInvoice: base + '/serviceProvider/invoice'
  },
  project: {
    create: base + '/project/register',
    getAll: base + '/project/getProject',
    updateProject: base + '/project/edit',
    delete: base + '/project/delete'
  },
  block: {
    create: base + '/block/register',
    getAll: base + '/block/getBlock',
    updateBlock: base + '/block/edit',
    delete: base + '/block/delete'
  },
  maintenance: {
    create: base + '/maintenance/register',
    getAll: base + '/maintenance/getMaintenance',
    updateMaintenance: base + '/maintenance/edit',
    delete: base + '/maintenance/delete',
    apply: base + '/maintenance/apply'
  },
  transactionalAccounts: {
    create: base + '/transactionalAccounts/register',
    getAll: base + '/transactionalAccounts/getTransactionalAccounts',
    getById: base + '/transactionalAccounts/getById',
    updateTransactionalAccounts: base + '/transactionalAccounts/edit',
    delete: base + '/transactionalAccounts/delete'
  },
  AccountsPayable: {
    create: base + '/accountsPayable/register',
    getAll: base + '/accountsPayable/getAccountsPayable',
    postVoucherForVendor: base + '/accountsPayable/postVendorVoucher',
    postVoucherForServiceProvider: base + '/accountsPayable/postServiceProviderVoucher',
    getById: base + '/accountsPayable/getById',
    updateAccountsPayable: base + '/accountsPayable/edit',
    delete: base + '/accountsPayable/delete'
  },
  Announcement: {
    create: base + '/announcement/create',
    getAllAnnouncement: base + '/announcement/getAllAnnouncement',
    editAnnouncement: base + '/announcement/editAnnouncement',
    delete: base + '/announcement/delete',
    getAnnouncementById: base + '/announcement/getAnnouncementById'
  },
  Subscribe: {
    create: base + '/subscription/register',
    getAllSubscription: base + '/subscription/getSubscription',
    edit: base + '/subscription/edit',
    delete: base + '/subscription/delete',
    getSubTransaction: base + '/subscription/getSubTransaction',
    getAllSubTransaction: base + '/subscription/getAllSubTransaction'
  },
  CompanyReport: {
    getBillSummaryBetweenDates: base + '/bill/getBillSummaryBetweenDates'
  },
  logo: {
    logoupload: base + '/logo/uploadLogo',
    logoImage: imageBase
  },
  Vendors: {
    create: base + '/vendor/register',
    getAllVendors: base + '/vendor/getAllVendors',
    editVendor: base + '/vendor/updateVendor',
    deleteVendor: base + '/vendor/deleteVendor',
    getVendorById: base + '/vendor/getVendorById',
    getVendorByCompanyId: base + '/vendor/getVendorByCompanyId'
  },
  Inventory: {
    productRegistration: base + '/inventory/product-registration',
    getAllProducts: base + '/inventory/all-product',
    dropDowns: base + '/inventory/dropdowns',
    editProduct: base + '/inventory/editProduct',
    deleteProduct: base + '/inventory/deleteProduct',
    getProductById: base + '/inventory/getProductById',
    purchaseDetails: base + '/inventory/purchaseDetails',
    getPurchaseDetails: base + '/inventory/getPurchaseDetails',
    usageDetails: base + '/inventory/postProductUsage',
    getAllPurchaseDetails: base + '/inventory/getAllPurchaseDetails',
    postPurchaseDetails: base + '/inventory/purchaseDetails',
    editPurchaseDetails: base + '/inventory/editPurchaseDetails',
    deletePurchaseDetails: base + '/inventory/deletePurchaseDetails',
    getUsageDetails: base + '/inventory/getUsageDetails',
    deleteUsageDetails: base + '/inventory/deleteProductUsage',
    getAllUsage: base + '/inventory/product-usage',
    editUsageDetails: base + "/inventory/editProductUsage",
    allReports: base + "/inventory/allReports",
    allActivties: base + "/inventory/allActivties"
  },
  Comments: {
    Create: base + '/comments/addComment',
    getComments: base + '/comments',
    markAsRead: base + '/comments/markAsRead',
    newMessages: base + '/comments/new-messages'
  },
  AccountsReceivable: {
    getAllReceives: base + '/accountsReceiveable/allReceives',
    paidVoucher: base + '/accountsReceiveable/postReceviablesVoucher',
    paidBillVoucher: base + '/accountsReceiveable/postBillVoucher',
    getAccountLedger: base + '/accountsReceiveable/ledger',
    balance: base + '/accountsReceiveable/balance',
    summary: base + '/accountsReceiveable/summary',
    getTransactionDetails: base + '/accountsReceiveable/transaction',
    Vendors: base + '/accountsReceiveable/vendors',
    Staff: base + '/accountsReceiveable/staff',
    Property: base + '/accountsReceiveable/property',
    Accounts: base + '/accountsReceiveable/accounts',
    serviceProvider: base + '/accountsReceiveable/serviceProvider',
  },
  Voucher: {
    createVoucher: base + '/voucherCounter/generate-voucher',
    getAllVoucher: base + '/voucher/getAllVoucher',
    getStats: base + '/voucher/stats',
    getVoucherById: base + '/voucher/getVoucher',
    updateVoucherById: base + '/voucher/update',
    deleteVoucherById: base + '/voucher/delete',
    bulkDeleteVoucherById: base + '/voucher/bulk-delete',
  }
});
