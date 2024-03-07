import React, { useState } from 'react'
import { Box, ListItemButton, Grid } from '@mui/material';
import MainStyles from '../MainStyles';
import Text from '../../../../components/customText/Text';
import ApprovalMatrix from './preferences/ApprovalMatrix';
import TimeSheetCycle from './preferences/TimeSheetCycle';



const prefernces = ['Approval Matrix', 'Timesheet Cycle'];

function TimeSheetConfig() {

    const classes = MainStyles();

    const [current, setCurrent] = useState("Approval Matrix");

    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={{ sm: '95%', md: '85%', lg: '85%' }}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item lg={4} md={4} sm={4} xs={12} >
                        <Box  className={classes.mainListBox} >
                            <Box className={classes.prefTitle}>
                                <Text blackHeader>Preferences</Text>
                            </Box>
                            <Box className={classes.listContainer}>

                                {
                                    prefernces.map((item, key) => (
                                        <ListItemButton
                                            key={key}
                                            className={`${classes.listItems} ${current === item ? classes.listItemsActive : null}`}
                                            onClick={() => setCurrent(item)}
                                        >
                                            {item}
                                        </ListItemButton>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={8} xs={12}>

                        <Box >
                            {
                                current === "Approval Matrix" ? <ApprovalMatrix current={current} /> : null
                            }
                            {
                                current === "Timesheet Cycle" ? <TimeSheetCycle current={current} /> : null
                            }
                
                        </Box>

                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default TimeSheetConfig;
