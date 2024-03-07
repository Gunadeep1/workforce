import React, { useState } from 'react'
import { Box,  Typography, Tab, Tabs } from '@mui/material'
import { styled } from "@mui/styles";
import Visa from './Visa';
import VisaType from './VisaType';

const Documents = ['Visa', 'Visa Documents'];

const CustomTabs = styled(Tabs)({
  borderBottom: '1px solid #C7CCD3 !important',
  '& .MuiTabs-indicator': {
    borderBottom: '1px solid #0C75EB !important',
    background: '#0C75EB !important'
  },

});


const CustomTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  fontFamily: "Nunito !important",
  color: "#737373 !important",
  fontSize: "16px !important",
  fontWeight: `${500} !important`,
  padding: "0px 24px 15px 24px !important",
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
        <Box >
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


function WorkAuthorization() {

  const [tab, setTab] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };


  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
    }}>

      <Box sx={{ borderBottom: '1px', borderColor: 'divider', }} mb={4}>
        <CustomTabs value={tab} onChange={handleChangeTab}
          aria-label="scrollable auto tabs example"
          variant="fullWidth"
        >
          {
            Documents.map((item, key) => (
              <CustomTab key={key} label={item} {...a11yProps(0)} />
            ))
          }
        </CustomTabs>
      </Box>

      <CustomTabPanel value={tab} index={0} >
        <Visa/>
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <VisaType/>
      </CustomTabPanel>

    </Box>)
}

export default WorkAuthorization;
