import React from 'react';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Box, Grid, TableContainer } from '@mui/material';


function V0_1() {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            // backgroundColor: theme.palette.common.black,
            backgroundColor: "#5146eb",
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(Sno, Module, Description) {
        return { Sno, Module, Description, };
    }

    function createData1(Sno, Issue, Jira, Status) {
        return { Sno, Issue, Jira, Status };
    }

    //  New Features Table
    const rows = [
        createData(1, 'Ledgers', 'A recent module has been introduced in alignment with the specified requirements. Please refer to the Business Requirements Document (BRD) for more details. This module is now integrated into the left navigation bar. Within this module, you will discover information about Payments Received against the invoices and Payments Paid against the Bills.'),
        createData(2, 'Sales', 'A recent addition has been made in accordance with the specified requirements. Please consult the Business Requirements Document (BRD) for details. This newly implemented module is now integrated into the left navigation bar. Within this module, you can access features such as creating, editing, and viewing both Invoices and Bills.'),
        createData(3, 'Payroll', 'A recent module has been introduced in alignment with the specified requirements. Please refer to the Business Requirements Document (BRD) for more details. This module is now integrated into the left navigation bar. Within this module, you will discover information about Payroll Generate, View, Run.'),
        createData(4, 'Balance Sheet', 'A recent module has been introduced in alignment with the specified requirements. Please refer to the Business Requirements Document (BRD) for more details. This module is now integrated into the left navigation bar. Within this module, you will discover information about Balance sheet information about the Consultants/Contractors.'),
    ];

    // Bug Fixes
    const rows1 = [
        createData1(1, 'Placement Bugs', '-', 'Fixed'),
        createData1(2, 'Employee Self Service Bugs', '-', 'Fixed'),
        createData1(3, 'Timesheets Bugs', '-', 'Fixed'),
        createData1(4, 'Balance sheet Bugs', '-', 'Fixed'),
    ];
   

    return (
        <Box  >
            <Grid container p={2}>
                <Grid item lg={12}><h4>New Features</h4></Grid>
                <Grid item lg={12} pt={2}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ width: "10px" }}>S.No</StyledTableCell>
                                    <StyledTableCell sx={{ width: "300px" }} align="center" >Module</StyledTableCell>
                                    <StyledTableCell align="center">Description</StyledTableCell>
                                    {/* <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                  <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.Sno}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.Sno}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.Module}</StyledTableCell>
                                        <StyledTableCell align="center">{row.Description}</StyledTableCell>
                                        {/* <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                    <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid container p={2}>
                <Grid item lg={12}><h4>Bug Fixes</h4></Grid>
                <Grid item lg={12} pt={2}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ width: "10px" }}>S.No</StyledTableCell>
                                    <StyledTableCell sx={{ width: "300px" }} align="center" >Issue</StyledTableCell>
                                    <StyledTableCell align="center">Jira No.</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                    {/* <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows1.map((row) => (
                                    <StyledTableRow key={row.Sno}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.Sno}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.Issue}</StyledTableCell>
                                        <StyledTableCell align="center">{row.Jira}</StyledTableCell>
                                        <StyledTableCell align="center">{row.Status}</StyledTableCell>
                                        {/* <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid container p={2}>
                <Grid item lg={12}><h4>Changes to Previous Release Notes - NA</h4></Grid>
                {/* <Grid item lg={12} pt={2}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ width: "10px" }}>S.No</StyledTableCell>
                                    <StyledTableCell sx={{ width: "300px" }} align="center" >Module</StyledTableCell>
                                    <StyledTableCell align="center">Description</StyledTableCell>                                  
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows2.map((row) => (
                                    <StyledTableRow key={row.Sno}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.Sno}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.Module}</StyledTableCell>
                                        <StyledTableCell align="center">{row.Description}</StyledTableCell>                                       
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid> */}
            </Grid>
        </Box>
    )
}

export default V0_1