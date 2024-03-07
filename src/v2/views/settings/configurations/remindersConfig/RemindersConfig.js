import React, { useState } from 'react'
import { Box, ListItemButton, Grid } from '@mui/material';
import Text from '../../../../components/customText/Text';
import MainStyles from '../MainStyles';
import Timesheets from './Preferences/Timesheets';
import InvoicesReminder from './Preferences/InvoicesReminder';
import ExpenseManagment from './Preferences/ExpenseManagment';
import Immigration from './Preferences/Immigration';
import Employee from './Preferences/Employee';
import Payroll from './Preferences/Payroll';
import ConfigApi from '../../../../apis/configurations/ConfigApi';

// const prefernces = ['Timesheets', 'Invoices', 'Expense Managment'
//     , 'Immigration', 'Employee', 'Payroll',
// ];
const prefernces = [
    { name: 'Timesheets', slugId:1 },
    { name: 'Invoices', slugId:3 },
    { name: 'Expense Managment', slugId:6},
    { name: 'Immigration', slugId:7},
    { name: 'Employee', slugId:8},
    { name: 'Payroll', slugId:11 },
];
function RemindersConfig() {
    const classes = MainStyles()
    const [current, setCurrent] = useState(prefernces[0]);
    // useEffect(() => {

    //     getActivity()
    //     // eslint-disable-next-line
    // }, []);
    const [activityTotal,setActivityTotal] = useState()
    const [activityData, setActivityData] = useState([])
   
    const getActivity = (args) => {

        let id = 27;
        ConfigApi.getActivity(id,current.slugId,args).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {

                    console.log(response.data.data, "res")
                    setActivityData(response.data.data);
                    setActivityTotal(response.data.pagination.total)
                }
            }, 300)

        });
    };

    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={{ sm: '95%', md: '85%', lg: '85%' }}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <Box className={classes.mainListBox} >
                            <Box className={classes.prefTitle}>
                                <Text blackHeader>Preferences</Text>
                            </Box>
                            <Box className={classes.listContainer} sx={{ maxHeight: '60vh' }}>

                                {
                                    prefernces.map((item, key) => (
                                        <ListItemButton
                                            key={key}
                                            className={`${classes.listItems} ${current.name === item.name ? classes.listItemsActive : null}`}
                                            onClick={() => setCurrent(item)}
                                        >
                                            {item.name}
                                        </ListItemButton>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={8} xs={12}>

                        <Box>
                            {
                                current.name === "Timesheets" ? <Timesheets current={current}  activityData={activityData} getActivity={getActivity} activityTotal={activityTotal}/> : null
                            }
                            {
                                current.name === "Invoices" ? <InvoicesReminder current={current} activityData={activityData} getActivity={getActivity} activityTotal={activityTotal}/> : null
                            }
                            {
                                current.name === "Expense Managment" ? <ExpenseManagment current={current} activityData={activityData} getActivity={getActivity} activityTotal={activityTotal}/> : null
                            }
                            {
                                current.name === "Immigration" ? <Immigration current={current} activityData={activityData} getActivity={getActivity} activityTotal={activityTotal}/> : null
                            }
                            {
                                current.name === "Employee" ? <Employee current={current} activityData={activityData} getActivity={getActivity} activityTotal={activityTotal}/> : null
                            }
                            {
                                current.name === "Payroll" ? <Payroll current={current} activityData={activityData} getActivity={getActivity} activityTotal={activityTotal}/> : null
                            }
                        </Box>
                        
                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
}

export default RemindersConfig;
