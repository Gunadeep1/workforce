import React, { useState } from 'react'
import { Box, ListItemButton, Grid } from '@mui/material';
import MainStyles from '../MainStyles';
import JobTitle from './preferences/JobTitle';
import DocumentType from './preferences/DocumentType';
import Text from '../../../../components/customText/Text';


const dataArr = ["Job Title", "Document Type",];

function PlacementConfig() {
    const classes = MainStyles()

    const [current, setCurrent] = useState("Job Title");

    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={'85%'}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <Box className={classes.mainListBox}>
                            <Box className={classes.prefTitle}>
                                <Text blackHeader>Preferences</Text>
                            </Box>
                            <Box className={classes.listContainer} sx={{maxHeight:'60vh'}}>
                            {
                                dataArr.map((item, key) => (
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
                    <Grid item lg={8} md={8} sm={7} xs={12}>
                        <Box>
                            {
                                current === "Job Title" ? <JobTitle current={current} /> : null
                            }
                            {
                                current === "Document Type" ? <DocumentType current={current} /> : null
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default PlacementConfig