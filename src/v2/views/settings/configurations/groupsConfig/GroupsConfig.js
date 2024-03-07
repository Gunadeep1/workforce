import React, { useState } from 'react'
import { Box, ListItemButton, Grid } from '@mui/material';
import MainStyles from '../MainStyles';
import Text from '../../../../components/customText/Text';
import Groups from './Preferences/Groups';



const prefernces = ['Groups'];

function GroupsConfig() {
    const classes = MainStyles()

    const [current, setCurrent] = useState("Groups");

    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={{ sm: '95%', md: '85%', lg: '85%' }}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <Box  className={classes.mainListBox} >
                            <Box className={classes.prefTitle}>
                                <Text blackHeader>Preferences</Text>
                            </Box>
                            <Box className={classes.listContainer} sx={{ maxHeight: '58vh' }}>

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
                                current === "Groups" ? <Groups current={current} /> : null
                            }
                        </Box>

                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default GroupsConfig;
