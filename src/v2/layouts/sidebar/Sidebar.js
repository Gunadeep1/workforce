import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import SidebarStyles from "./SidebarStyles";
// import Logo from '../assets/svg/logo.svg';
import Logo from '../../assets/svg/logo-name.svg';
import DashboardLogo from '../../assets/svg/dashboard.svg';
import EmployeesLogo from '../../assets/svg/employees.svg';
import PlacementLogo from '../../assets/svg/placement.svg';
import SalesLogo from '../../assets/svg/sales.svg';
import FiHevronLeft from '../../assets/svg/fi-hevron-left.svg';
import BalanceSheetLogo from '../../assets/svg/balancesheet.svg';
import ExpenseManagementLogo from '../../assets/svg/expense-management.svg';
import clientLogo from '../../assets/svg/clientIcon.svg';
import payrollLogo from '../../assets/svg/payrollLogo.svg';
import EmpselfserLogo from '../../assets/svg/headphones.svg';
import immigrationLogo from '../../assets/svg/immigration.svg';
import TimeSheetLogo from "../../assets/svg/TimesheetIcon.svg"
// import empSelfsSerLogo from '../../assets/svg/'
import ledgerLogo from '../../assets/svg/ledger.svg';
// import SearchGlobal from '../../assets/svg/search2.svg';
// import Profile from '../../assets/svg/profile.svg';
// import Notification from '../../assets/svg/notification.svg';
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
// import Invitelinkform from './employees/Stepper';
// import FormBox from './employees/TextInput';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useLocation } from "react-router-dom";
import Text from '../../components/customText/Text';
import logo from '../../assets/images/codetru-sidebar.png';
import { app_version } from "../../config/Domain";

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#393939",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #393939"
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#393939",
        "&::before": {
            backgroundColor: "#393939",
            border: "1px solid #393939"
        }
    },
}));

export default function App() {

    const classes = SidebarStyles();

    let location = useLocation();
    const [sidebar, setSidebar] = useState({ open: false, subMenu: false, subMenuName: "" });

    const handleClose = () => {
        if (sidebar.open) {
            setSidebar(prev => ({ ...prev, open: !prev.open, subMenu: false }))
        }
    }

    let placementRoutes = ["/placements","/placements/placementsInfo","/placements/addclientAndendclient","/placements/addBillingDetails","/placements/addPlacement","/placements/timesheets","/placements/invoice", "/placements/dashboard"]
    let timesheetRoutes = ["/timesheet","/timesheet/view","/timesheet/add-timesheet","/timesheet/view"]
    let salesRoutes = ["/sales/add-invoices","/sales/invoices","/sales/add-invoices","/sales/invoices/invoices-history","/sales/bills","/sales/add-bills","/sales/bills/bills-history"]
    let ledgerRoutes = ["/ledgers/Newpayment","/ledgers/NewBills","/ledger"]
    let balanceRoutes = ["/balance-sheet","/balance-sheet/balance-view"]
    let expenseRoutes = ["/expense-management","/addExpense","/addExpenseForm"]
    let payrollRoute = ["/payroll","/payroll-view","/payroll-summary","/pending","/drafted","/upcoming-payroll","/summary","/skipped"]
    let clientRoute = ["/clients","/addClient","/clients/clients-user-profile","/clients/end-clients-user-profile"]
    let serviceRoute = ["/employee-self-service","/employee-self-service/chat-panel","/employee-self-service/raise-request"]

    return (
        <>
            {location.pathname !== "/configuration" ?
                <Box component={"section"} className={`${classes.sidebar} ${sidebar.open ? classes.sidebarOpen : null}`}>
                    <Link to={'/'} className={classes.brand}>
                        <img src={Logo} alt="Logo" style={{ height: "54px" }} />
                        {/* <img src={Logo} alt="Logo" />  <span style={{ margin: "0px 14px" }}>BrownMonster <br/><span style={{fontSize:"12px"}}> Efficiency made easy </span></span> */}
                    </Link>
                    <Box sx={{ position: "relative", }}>
                        <button
                            onClick={() => setSidebar(prev => ({ ...prev, open: !prev.open, subMenu: false }))}
                            style={{ all: "unset", cursor: "pointer", position: "fixed", zIndex: 300, left: `${sidebar.open ? "16.4%" : "64px"}`, top: "64px", padding: "0px", margin: "0px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", transform: `${sidebar.open ? "rotate(180deg)" : "rotate(0deg)"}`, transition: "all .3s ease", }}>
                            <img src={FiHevronLeft} alt="FiHevronLeft" />
                        </button>
                    </Box>
                    <ul className={classes.sideMenu}>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Dashboard
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/dashboard'} className={`${classes.sidebarLink} ${location.pathname === "/dashboard" ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={DashboardLogo} alt="dashboard" style={{ filter: `${location.pathname === "/dashboard" ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${location.pathname === "/mainDashboard" ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}`, transition: "all .3s ease", }} >Dashboard</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li style={{ padding: '6px 10px' }}> <Divider /></li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Employees
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/employees'} className={`${classes.sidebarLink} ${["/employees", "/employees/add", "/employees/onboard"].includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={EmployeesLogo} alt="employees" style={{ filter: `${["/employees", "/employees/add", "/employees/onboard"].includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${["/employees", "/employees/add", "/employees/onboard"].includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Employees</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Placements
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={"/placements"} className={`${classes.sidebarLink} ${placementRoutes.includes(location.pathname)? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={PlacementLogo} alt="placement" style={{ filter: `${placementRoutes.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${placementRoutes.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }}>Placements</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Timesheet
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/timesheet'} className={`${classes.sidebarLink} ${timesheetRoutes.includes(location.pathname) ? classes.sidebarLinkActive : null}`} >
                                    <img src={TimeSheetLogo} alt="employees" style={{ filter: `${timesheetRoutes.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${timesheetRoutes.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }}>Timesheet</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li style={{ padding: '6px 10px' }}> <Divider /></li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Sales
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Box className={`${classes.sidebarLink} ${salesRoutes.includes(location.pathname) ? classes.sidebarLinkActive : null}`} >

                                    <Box className={classes.nestedListMainContainer} onClick={() => setSidebar({ ...sidebar, open: true, subMenu: !sidebar.subMenu })}>

                                        <Box className={classes.nestedListContainer}>
                                            <img src={SalesLogo} alt="sales" style={{ filter: `${salesRoutes.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}`, marginTop: "4px" }} />
                                            <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ paddingTop: "4px", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${salesRoutes.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }}>Sales</span>
                                        </Box>
                                        <Box className={classes.nestedListContainer}>
                                            <KeyboardArrowDownIcon style={{ paddingTop: "5px", placeSelf: "end", transition: "all 0.3s ease", transform: sidebar.subMenu ? 'rotateX(180deg)' : 'rotateX(0deg)', }} />
                                        </Box>

                                    </Box>

                                </Box>
                            </HtmlTooltip>
                            <ul className={`${classes.sideDropdown} ${sidebar.open ? sidebar.subMenu ? classes.sideDropdownShow : null : null}`}>
                                <li><Link to={'/sales/invoices'} className={`${location.pathname === "/sales/invoices" ? classes.menuSelected : classes.sidebarSideDropdownLink}`} onClick={() => setSidebar(prev => ({ ...prev, open: !prev.open, subMenu: false }))}>Invoices</Link></li>
                                <li><Link to={'/sales/bills'} className={`${location.pathname === "/sales/bills" ? classes.menuSelected : classes.sidebarSideDropdownLink}`} onClick={() => setSidebar(prev => ({ ...prev, open: !prev.open, subMenu: false }))}>Bills</Link></li>
                            </ul>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Ledger
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/ledger'} className={`${classes.sidebarLink} ${ledgerRoutes.includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={ledgerLogo} alt="ledger" style={{ filter: `${ledgerRoutes.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${ledgerRoutes.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Ledger</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Balance Sheets
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/balance-sheet'} className={`${classes.sidebarLink} ${balanceRoutes.includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={BalanceSheetLogo} alt="ledger" style={{ filter: `${balanceRoutes.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${balanceRoutes.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Balancesheet</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Expense Management
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/expense-management'} className={`${classes.sidebarLink} ${expenseRoutes.includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={ExpenseManagementLogo} alt="ledger" style={{ filter: `${expenseRoutes.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${["/expense-management"].includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Expense Management</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Payroll
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/payroll'} className={`${classes.sidebarLink} ${payrollRoute.includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={payrollLogo} alt="ledger" style={{ filter: `${payrollRoute.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${payrollRoute.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Payroll</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li style={{ padding: '6px 10px' }}> <Divider /></li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Clients
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/clients'} className={`${classes.sidebarLink} ${clientRoute.includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={clientLogo} alt="ledger" style={{ filter: `${clientRoute.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${clientRoute.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Clients</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Immigration
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/immigration'} className={`${classes.sidebarLink} ${["/immigration"].includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={immigrationLogo} alt="ledger" style={{ filter: `${["/immigration"].includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${["/immigration"].includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Immigration</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li>
                            <HtmlTooltip
                                placement="right"
                                sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.sideTooltip}>
                                            <Typography className={classes.sideTooltipText}>
                                                Employee Self Service
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Link to={'/employee-self-service'} className={`${classes.sidebarLink} ${serviceRoute.includes(location.pathname) ? classes.sidebarLinkActive : null}`} onClick={handleClose}>
                                    <img src={EmpselfserLogo} alt="ledger" style={{ filter: `${serviceRoute.includes(location.pathname) ? "brightness(0) invert(1)" : "brightness(0)"}` }} />
                                    <span className={`${sidebar.open ? classes.sidebarLinkTextMs : classes.sidebarLinkTextMl} `} style={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: `${serviceRoute.includes(location.pathname) ? "#FFFFFF" : "rgba(24, 26, 24, 1)"}` }} >Employee Self Service</span>
                                </Link>
                            </HtmlTooltip>
                        </li>
                        <li style={{ backgroundColor: "#FFFFFF", position: "sticky", bottom: 0, }}>
                            {
                                sidebar.open ?
                                    <Text className={classes.sidebarLink} style={{ padding: "15px 8px" }}>
                                        <img src={logo} alt="logo" style={{ height: "40px", width: "40px" }} />
 
                                        <Text verySmallBlack style={{ margin: "0px 8px" }}>
                                            Powered by Codetru <br />All Rights Reserved<br />
                                            <a href={`/release-notes?version=${app_version}`} style={{color:"blue"}} target="_blank" rel="noreferrer">{app_version}</a>
                                        </Text>
                                    </Text> :
                                    <Text className={classes.sidebarLink} style={{ padding: "15px 8px" }}>
                                        <img src={logo} alt="logo" style={{ height: "40px", width: "40px" }} />
                                    </Text>
                            }
                        </li>
                    </ul>
                </Box> :
                <Box component={"section"} className={`${classes.sidebar2}`}>
                    <Box className={classes.brand}>
                        <img src={Logo} alt="Logo" style={{ height: "54px" }} />
                    </Box>
                </Box>}
        </>
    )
};