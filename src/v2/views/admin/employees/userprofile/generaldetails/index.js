import React, { useState, Fragment } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Typography, Tabs, Tab, Grid, Skeleton } from '@mui/material';
import GeneralDetails from '../generaldetails/GeneralDetails';
import ContactDetails from '../generaldetails/ContactDetails';
import EmergencyContact from '../generaldetails/EmergencyContact';
import CurrentAddress from '../generaldetails/CurrentAddress';
import EmploymentDetails from '../generaldetails/EmploymentDetails';

const generalDetailsTab = ["General Details", "Contact Details", "Emergency Contact", "Current Address", "Employment Details"];

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
                <Box sx={{ py: 3, px: 2 }}>
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

export default function GeneralDetailsComponent(props) {
    const { offBoardButton, progress, avatar_url, active, grButn, getData, employee, setEmployee, loading, setLoading } = props
    const classes = UserProfileStyles();
    const [tab, setTab] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };


    return (
        <Box >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
                <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        generalDetailsTab.map((item, key) => (
                            <Tab key={key} label={item} {...a11yProps(0)} className={`${classes.tabTitle}  ${tab === key ? classes.activeTabTitle : null}`} />
                        ))
                    }
                </Tabs>
            </Box>

            {
                loading ?
                    <Box py={5} px={3}>
                        <Grid container spacing={0}>
                            {
                                [1, 2, 3, 4, 5, 6, 7].map(() => (
                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Skeleton variant="rounded" width={'100%'} height={'54px'} borderRadius={"10px"} />
                                        </Box>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box> : !loading &&
                        Object.keys(employee).length > 0 ?
                        <Fragment>
                            <CustomTabPanel value={tab} index={0}>
                                                                <GeneralDetails data={employee} loading={loading} setLoading={setLoading} fullName={employee.basic_details.full_name} getIndex={props.getIndex} data2={employee.employment_details} offBoardButton={offBoardButton} progress={progress} avatar_url={avatar_url} active={active} grButn={grButn} getData={getData} setEmployee={setEmployee} />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1}>
                                <ContactDetails data={employee.contact_details} loading={loading} getIndex={props.getIndex}/>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={2}>
                                <EmergencyContact data={employee.emergency_contacts} loading={loading} getIndex={props.getIndex}/>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={3}>
                                <CurrentAddress data={employee.current_address} loading={loading} getIndex={props.getIndex}/>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={4}>
                                <EmploymentDetails data={employee.employment_details} enable_login={employee.enable_login} loading={loading} getIndex={props.getIndex}/>
                            </CustomTabPanel>
                        </Fragment> : null
            }


        </Box>
    );
}