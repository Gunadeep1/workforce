import React from "react";
import { Box } from "@mui/material";
import DashboardStyles from '../DasboardStyles';
import EmployeesDashboard from "./EmployeesDashboard";


export default function App() {
    const classes = DashboardStyles();

    return (
        <Box component={'main'} className={classes.main}>
            <EmployeesDashboard />
        </Box>
    )
};