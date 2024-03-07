import React, { useState} from 'react'
import { Box, ListItemButton, Grid } from '@mui/material';
import Text from '../../../../components/customText/Text';
import MainStyles from '../MainStyles';
import Notifications from './preferences/Notifications';


const prefernces = [
    { name: 'Invoices', slug: "new-invoice-notification",slugId:8 },
    { name: 'Draft Invoices', slug: 'drafted-invoice-notification',slugId:6 },
    { name: 'Invoice Approval', slug: 'invoice-approval-notification',slugId:7 },
    { name: 'Bills', slug: 'new-bills-notification',slugId:9 },
    { name: 'Draft Timesheets', slug: 'drafted-timesheet-notification',slugId:4 },
    { name: 'Timesheet Approval', slug: 'timesheet-approval-notification',slugId:5 },
    // { name: 'Personal Documents', slug: 'personal-documents-notification' },
    // { name: 'Work Authorization Documents', slug: 'work-authorization-docs-notification' },
    { name: 'Placement Expiry', slug: 'placement-expiry-notification',slugId:3 },
    { name: 'Birthdays', slug: 'birthdays-notification',slugId:2 },
    { name: 'Consultant Invitation', slug: 'consultant-invitation-notification',slugId:1 }
];


function NotificationConfig() {
    const classes = MainStyles()
    const [current, setCurrent] = useState(prefernces[0]);
   


    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={{ sm: '95%', md: '85%', lg: '85%' }}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <Box className={classes.mainListBox} >
                            <Box className={classes.prefTitle}>
                                <Text blackHeader>Preference</Text>
                            </Box>
                            <Box className={classes.listContainer} sx={{ maxHeight: '60vh' }}>

                                {
                                    prefernces.map((item, key) => (
                                        <ListItemButton
                                            key={key}
                                            className={`${classes.listItems} ${current.slug === item.slug ? classes.listItemsActive : null}`}
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
                            <Notifications current={current}/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default NotificationConfig;
