import React from 'react';
import Dashboard from '../views/admin/Dashboard';
import EmployeesDashboard from '../views/admin/employees/EmployeesDashboard';
import InviteEmployee from '../views/admin/employees/InviteEmployee';
import Placements from '../views/admin/placements/Dashboard';
import Timesheet from '../views/admin/timesheets/Dashboard';
import AddTimesheet from '../views/admin/timesheets/AddTimesheet';
import Timesheetview from '../views/admin/timesheets/Timesheetview';
import BalanceSheetDsh from '../views/admin/balanceSheet/BalanceSheetDsh';
import ExpenseMngmtDash from '../views/admin/expeneseManagement/ExpenseMngmtDash';
import ClientsDashboard from '../views/admin/clients/ClientsDashboard';
import ImmigrationDsh from '../views/admin/immigration/ImmigrationDsh';
import EmployeeSSDsh from '../views/admin/employeeSelfService/EmployeeSSDsh';
import LedgersDsh from '../views/admin/ledgers/LedgersDsh';
import UserProfile from '../views/admin/employees/userprofile/UserProfile';
import Login from '../layouts/login/Login';
import AddClient from '../views/admin/clients/AddClient';
import AddExpense from '../views/admin/expeneseManagement/AddExpense';
import AddExpenseForm from '../views/admin/expeneseManagement/AddExpenseForm';
import AddVendor from '../views/admin/clients/AddVendor';
import AddEndClient from '../views/admin/clients/AddEndClient';
import OnboardEmployee from '../views/admin/employees/onBoard/OnboardEmployee';
import ClientUserProfile from '../views/admin/clients/userProfile/clients/UserProfile';
import VendorUserProfile from '../views/admin/clients/vendor/VendorUserProfile';
import EndClientUserProfile from '../views/admin/clients/userProfile/endClients/UserProfile';
import AddBillingDetails from '../views/admin/placements/AddBillingDetails';
import ClientAndEndClient from '../views/admin/placements/clients/ClientAndEndClient';
import PlacementInfo from '../views/admin/placements/PlacementInfo';
import AddPlacement from '../views/admin/placements/AddPlacement';
import TimesheetConfiguration from '../views/admin/placements/timesheetConfiguration/TimesheetConfiguration';
import InvoiceConfiguration from '../views/admin/placements/invoiceConfiguration/InvoiceConfiguration';
import RaiseRequest from '../views/admin/employeeSelfService/RaiseRequest';
import ChatPanel from '../views/admin/employeeSelfService/ChatPanel';
import BalanceView from '../views/admin/balanceSheet/BalanceView';
import NewPayment from '../views/admin/ledgers/NewPayment';
import AddInvoices from '../views/admin/sales/invoices/AddInvoices';
import PayrollDashboard from '../views/admin/payroll/PayrollDashboard';
import Pending from '../views/admin/payroll/Pending';
import Drafted from '../views/admin/payroll/Drafted';
import UpcomingPayroll from '../views/admin/payroll/UpcomingPayroll';
import Summary from '../views/admin/payroll/Summary';
import Skipped from '../views/admin/payroll/Skipped';
import PayrollView from '../views/admin/payroll/PayrollView';
import PayRollSummary from '../views/admin/payroll/PayRollSummary';
import NewBills from '../views/admin/ledgers/NewBills';
import ConfigurationPanel from '../views/settings/configurations/Main';
import InvoicesDashboard from '../views/admin/sales/invoices/InvoicesDashboard';
import InvoicesView from '../views/admin/sales/invoices/InvoicesView';
import BillsDashboard from '../views/admin/sales/bills/BillsDashboard';
import AddBills from '../views/admin/sales/bills/AddBills';
import BillsView from '../views/admin/sales/bills/BillsView';
import SelfReminder from '../views/settings/reminders/selfReminders/SelfReminder';
import Notifications from '../views/settings/notifications/Notifications';
import TemplateCreate from '../views/admin/ocr/templateCreate';
import RoleTable from '../views/settings/configurations/roleConfig/Preferences/RoleTable';
import MyProfile from '../views/admin/myProfile/MyProfile';
import OffboardingChecklist from '../views/admin/employees/userprofile/OffboardingChecklist';
// import TemplateCreate from '../views/admin/ocr/templateCreate';
// import RoleTable from '../views/settings/configurations/roleConfig/Preferences/RoleTable';
// import SelfReminder from '../views/admin/selfReminders/SelfReminder';
// import SelfReminder from '../views/settings/reminders/selfReminders/SelfReminder';
// import Notifications from '../views/settings/notifications/Notifications';
import TimesheetReminders from '../views/settings/reminders/TimesheetReminders';
import EmployeeSelfServiceReminders from '../views/settings/reminders/EmployeeSelfServiceReminders';
import SalesReminders from '../views/settings/reminders/SalesReminders';
import EmployeeReminders from '../views/settings/reminders/EmployeeReminders';
import ExpenseReminders from '../views/settings/reminders/ExpenseReminders';
import PayrollReminders from '../views/settings/reminders/PayrollReminders';
import ImmigrationReminders from '../views/settings/reminders/ImmigrationReminders';

import RemainderTimesheet from '../views/admin/dashboardRemainders/RemainderTimesheet';
import RemainderSales from '../views/admin/dashboardRemainders/RemainderSales';
import RemainderEmployees from '../views/admin/dashboardRemainders/RemainderEmployees';
import RemainderExpenseMgmt from '../views/admin/dashboardRemainders/RemainderExpenseMgmt';
import RemainderESS from '../views/admin/dashboardRemainders/RemainderESS';
import RemainderPayroll from '../views/admin/dashboardRemainders/RemainderPayroll';
import RemainderImmigration from '../views/admin/dashboardRemainders/RemainderImmigration';
import SelfRemainder from '../views/admin/dashboardRemainders/SelfRemainder';
import PlacementGraphDashboard from '../views/admin/placements/GraphDashboard';
import BulkUpload from '../views/admin/ocr/bulkUpload/BulkUpload';
import BulkUploadedTimesheets from '../views/admin/ocr/bulkUpload/BulkUploadedTimesheets';

import Charts from '../views/admin/charts/Charts';

const AdminRoute = [
  {
    id: "admin",
    path: "/*",
    element: <Login />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/",
    element: <Login />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/dashboard",
    element: <Dashboard />,
    name: "Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/configuration",
    element: <ConfigurationPanel />,
    name: "Configuration",
    main: "Configuration",
    // slug: "dashboard",
    access: false
  },
  {
    id: "admin",
    path: "/employees",
    element: <EmployeesDashboard />,
    name: "Employees",
    main: "Main",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employees/add",
    element: <InviteEmployee />,
    name: "Invite Employee",
    main: "Main",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employees/user-profile/:employee",
    element: <UserProfile />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employees/onboard",
    element: <OnboardEmployee />,
    name: "Onboard Employee",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements",
    element: <Placements />,
    name: "Placements",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/timesheet",
    element: <Timesheet />,
    name: "Timesheets",
    slug: "dashboard",
    access: true
  },

  {
    id: "admin",
    path: "/timesheet/view",
    element: <Timesheetview />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/timesheet/add-timesheet",
    element: <AddTimesheet />,
    name: "Add Timesheet",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/ledger",
    element: <LedgersDsh />,
    name: "Ledger Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/balance-sheet",
    element: <BalanceSheetDsh />,
    name: "Balancesheet Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/balance-sheet/balance-view",
    element: <BalanceView />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/expense-management",
    element: <ExpenseMngmtDash />,
    name: "Expense Management",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/myProfile",
    element: <MyProfile/>,
    name: "My Profile",
    slug: "dashboard",
    access: true
  },
  {
    id: 'admin',
    path: "/employees/user-profile/:employee/offboarding",
    element: <OffboardingChecklist/>,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/clients",
    element: <ClientsDashboard />,
    name: "Client Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/addClient",
    element: <AddClient />,
    name: "Add Client",
    slug: "dashboard",
    access: true
  },
  {
    id: 'admin',
    path: "/addExpense",
    element: <AddExpense />,
    name: "Add Expense",
    slug: "dashboard",
    access: true
  },
  {
    id: 'admin',
    path: "/addExpenseForm",
    element: <AddExpenseForm />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/addVendor",
    element: <AddVendor />,
    name: "Add Vendeor",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/addEnd-Client",
    element: <AddEndClient />,
    name: "Add End Client",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/clients/clients-user-profile",
    element: <ClientUserProfile />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/clients/end-clients-user-profile",
    element: <EndClientUserProfile />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/vendor/user-profile",
    element: <VendorUserProfile />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/immigration",
    element: <ImmigrationDsh />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employee-self-service",
    element: <EmployeeSSDsh />,
    name: "Employee Self Service Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/addBillingDetails",
    element: <AddBillingDetails />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/addclientAndendclient",
    element: <ClientAndEndClient />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/placementsInfo",
    element: <PlacementInfo />,
    name: "Add Placement",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/addPlacement",
    element: <AddPlacement />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/timesheets",
    element: <TimesheetConfiguration />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/invoice",
    element: <InvoiceConfiguration />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employee-self-service/chat-panel",
    element: <ChatPanel />,
    name: "",
    slug: "dashboard",
    access: true,
  },
  {
    id: "admin",
    path: "/employee-self-service/raise-request",
    element: <RaiseRequest />,
    name: "Raise a Ticket",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/ledgers/Newpayment",
    element: <NewPayment />,
    name: "Add Payment",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/sales/add-invoices",
    element: <AddInvoices />,
    name: "Add Invoice",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/payroll",
    element: <PayrollDashboard />,
    name: "Payroll Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/payroll-view",
    element: <PayrollView />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/payroll-summary",
    element: <PayRollSummary />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/pending",
    element: <Pending />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/drafted",
    element: <Drafted />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/upcoming-payroll",
    element: <UpcomingPayroll />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/summary",
    element: <Summary />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/skipped",
    element: <Skipped />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    path: "/ledgers/NewBills",
    element: <NewBills />,
    name: "Add Payment Bill",
    slug: "dashboard",
    access: true
  },

  {
    id: "admin",
    path: "/sales/invoices",
    element: <InvoicesDashboard />,
    name: "Invoice Dashboard",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/sales/invoices/invoices-history",
    element: <InvoicesView />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/sales/bills",
    element: <BillsDashboard />,
    name: "Bills Dashboard",
    slug: "dashboard",
    access: true
  },

  {
    id: "admin",
    path: "/sales/add-bills",
    element: <AddBills />,
    name: "Add Bill",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/sales/bills/bills-history",
    element: <BillsView />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/self-reminder",
    element: <SelfReminder />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/notifications",
    element: <Notifications />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/role/add-new-role",
    element: <RoleTable />,
    name:'',
    slug: "dashboard",
    access: true
  }, 
  {
    id: "admin",
    path: "/ocr/create-template",
    element: <TemplateCreate />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/ocr/bulk-upload-timesheet",
    element: <BulkUpload />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/ocr/bulk-upload-timesheets",
    element: <BulkUploadedTimesheets />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/timesheet-reminders",
    element: <TimesheetReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/dashboardTimesheet",
    element: <RemainderTimesheet />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employee-self-service-reminders",
    element: <EmployeeSelfServiceReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/RemainderSales",
    element: <RemainderSales />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/sales-reminders",
    element: <SalesReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/RemainderEmployees",
    element: <RemainderEmployees />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/employee-reminders",
    element: <EmployeeReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/RemainderExpenseMgnt",
    element: <RemainderExpenseMgmt />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/expense-reminders",
    element: <ExpenseReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/RemainderESS",
    element: <RemainderESS />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/payroll-reminders",
    element: <PayrollReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/RemainderPayroll",
    element: <RemainderPayroll />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/immigration-reminders",
    element: <ImmigrationReminders />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/RemainderImmigration",
    element: <RemainderImmigration />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/self-Remainder",
    element: <SelfRemainder />,
    name: "",
    slug: "dashboard",
    access: true
  },
  {
    id: "admin",
    path: "/placements/dashboard",
    element: <PlacementGraphDashboard />,
    name: "Placement Statistics",
    slug: "dashboard",
    access: true
  },

  {
    id: "admin",
    path: "/charts",
    element: <Charts/>,
    name: "Charts",
    slug: "dashboard",
    access: true
  }
  
]

export default AdminRoute;