import React from 'react';
import DashboardStyles from '../DasboardStyles';
import { Box, Typography } from '@mui/material';


export default function ImmigrationDsh() {
    const classes = DashboardStyles();

    return (
        <Box component={'main'} className={classes.main}>
            <Box sx={{ height: "60vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ fontSize: "42px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignSelf: "center", fontWeight: "800", color: "#b8b8b8" }}>
                    Immigration Dashboard
                </Typography>
            </Box>
        </Box>
    )
};
