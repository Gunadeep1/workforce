import React, { useEffect, useState } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Typography, Tabs, Tab, Skeleton, Grid } from '@mui/material';

import EducationDocs from './EducationDocs';
import PersonalDocs from './PersonalDocs';
import WorkAuthorization from './WorkAuthorization';
import EmployeesApi from '../../../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg } from '../../../../../utils/utils';

// import name from '../../';

// import { useNavigate } from "react-router-dom";


const generalDetailsTab = ["Education Details Docs.", "Work Authorization", "Personal Docs",];

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

export default function ControlledAccordions({ employee }) {

    const classes = UserProfileStyles();
    const [tab, setTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const [loading, setLoading] = useState(false);

    const [list, setList] = useState([]);

    useEffect(() => {
        getEducationIndex(); // eslint-disable-next-line
    }, []) 

    const getEducationIndex = () => {
        setLoading(true)
        EmployeesApi.getEducation(employee.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        setList(response.data.data);
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

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
                    </Box> : !loading ?
                        <>
                            <CustomTabPanel value={tab} index={0}>
                                <EducationDocs list={list} getEducationIndex={getEducationIndex}/>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1}>
                                <WorkAuthorization />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={2}>
                                <PersonalDocs />
                            </CustomTabPanel>
                        </> : ''
            }
        </Box>
    );
}