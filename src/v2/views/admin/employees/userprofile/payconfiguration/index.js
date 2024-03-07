import React, { useState } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Typography, Tabs, Tab } from '@mui/material';

import BankDetails from './BankDetails';
import PayrollConfiguration from './PayrollConfiguration';
import PaytypeConfiguration from './PaytypeConfiguration';

// import name from '../../';

// import { useNavigate } from "react-router-dom";


const generalDetailsTab = ["Bank Details", "Payroll Configuration", "Paytype Configuration",];

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
                <Box sx={{ py: 3, px:2 }}>
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

export default function Payconfiguration() {

    const classes = UserProfileStyles();
    const [tab, setTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };


    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                    {
                        generalDetailsTab.map((item, key) => (
                            <Tab key={key} label={item} {...a11yProps(0)} className={`${classes.tabTitle} ${tab === key ? classes.activeTabTitle : null}`} />
                        ))
                    }
                </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
                <BankDetails />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
                <PayrollConfiguration />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={2}>
                <PaytypeConfiguration />
            </CustomTabPanel>
        </Box>
    );
}