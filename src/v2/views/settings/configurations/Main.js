import React, { useState } from 'react'
import { Box, Typography, Tab, Tabs } from '@mui/material'
import MainStyles from './MainStyles'
import { styled } from "@mui/styles";
import LeftNavigateArrow from '../../../assets/svg/LeftNavigateArrow.svg';
import Text from '../../../components/customText/Text';
import Employee from './employeeConfig/EmployeeConfig';
import Placement from './placementConfig/PlacementConfig';
import TimeSheet from './timesheetConfig/TimeSheetConfig';
import Invoice from './invoiceConfig/InvoiceConfig';
import EmployeeSelfService from './employeeSelfServiceConfig/EmployeeSelfServiceConfig';
import Clients from './clientConfig/ClientConfig';
import ExpenseManagement from './expenseConfig/ExpenseConfig';
import Role from './roleConfig/RoleConfig';
import Templates from './templatesConfig/TemplatesConfig';
import Remainders from './remindersConfig/RemindersConfig';
import Group from './groupsConfig/GroupsConfig';
import Notifications from './notificationConfig/NotificationConfig';
import Organization from './organization/OrganizationConfig'


const ConfigurationTab = ['Organization','Employee','Clients', 'Placement', 'Timesheet', 'Invoices',
  'Employee Self Service', 
  'Expense Managment', 'Role', 'E-mail Templates', 'Groups', 'Reminders', 'Notifications',
  ];


// custom Tabs container
const TabsContainer = styled(Box)({
  borderBottom: '1px solid #C7CCD3',
  display: 'inline-block', // Display as inline-block
  width: 'min-content', // Set width to fit content
  // maxWidth:'100/%',
  overflowX: 'auto', // Enable horizontal scrolling if needed
  whiteSpace: 'nowrap', // Prevent line breaks
});

// custom Tabs
const CustomTabs = styled(Tabs)({
  overflowX: 'auto',
  '& .MuiTabs-indicator': {
    borderBottom: '1px solid #0C75EB !important',
  },
  '& .MuiTabs-scrollable': {
    overflowX: 'hidden',
  },
});



// custom Tab
const CustomTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  fontFamily: "Nunito !important",
  color: "#737373 !important",
  fontSize: "16px !important",
  fontWeight: `${500} !important`,
  padding: "8px 10px !important",
  textTransform: 'none !important',
  minWidth: 0,
  '&.Mui-selected': {
    color: '#0C75EB !important',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff !important',
  },
}));


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box 
        // sx={{ 
        //   '@media (max-width: 1000px)': {
        //     width: 'fit-content'
        //   },
        //  }}
         >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function ConfigurationPanel() {

  const classes = MainStyles();
  const [tab, setTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box className={classes.mainBox}  >
      <Box display={"flex"} gap={1} >
        <img onClick={() => window.history.back()} style={{ cursor: "pointer" }} src={LeftNavigateArrow} alt="LeftNavigateArrow"></img>
        <Text sx={{
          fontSize: "22px",
          fontFamily: "Nunito , Nunito Sans, sans-serif",
          fontWeight: "500", color: "#092333"
        }}>Organization Configuration</Text>
      </Box>
      <Box className={classes.mainPanel}>
        <Box sx={{ borderBottom: '1px', borderColor: 'divider', }}>
          <TabsContainer>
            <CustomTabs
              value={tab}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
            >
              {
                ConfigurationTab.map((item, key) => (
                  <CustomTab key={key} label={item} {...a11yProps(0)} />
                ))
              }
            </CustomTabs>
          </TabsContainer>
        </Box>
        <CustomTabPanel value={tab} index={0} >
          <Organization />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1} >
          <Employee />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2}>
          <Clients />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={3}>
          <Placement />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={4}>
          <TimeSheet />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={5}>
          <Invoice />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={6}>
          <EmployeeSelfService />
        </CustomTabPanel>
        {/* <CustomTabPanel value={tab} index={6}>
          <Clients />
        </CustomTabPanel> */}
        <CustomTabPanel value={tab} index={7}>
          <ExpenseManagement />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={8}>
          <Role />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={9}>
          <Templates />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={10}>
          <Group />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={11}>
          <Remainders />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={12}>
          <Notifications />
        </CustomTabPanel>
      </Box>
    </Box>
  )
}

export default ConfigurationPanel