import React from 'react';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Box, TableContainer } from '@mui/material';

function VersionNote(props) {
    const { newFeatures, bugFixes, changesToPreviousRelease } = props.note;
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
    return (
        <Box>
            <Box mx={2} my={3}>
                <Box>{`${newFeatures.title} ${newFeatures.rows.length > 0 ? "" : "- NA"}`} </Box>
                {
                    newFeatures.rows.length > 0 ?
                        <Box my={2}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            {newFeatures.columns.map((column, key) => (
                                                <StyledTableCell key={key}>{column}</StyledTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {newFeatures.rows.map((rowData, rowkey) => (
                                            <StyledTableRow key={rowkey}>
                                                {
                                                    newFeatures.columns.map((column, columnkey) => (
                                                        <StyledTableCell key={columnkey} >{rowData[column]}</StyledTableCell>
                                                    ))
                                                }
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box> : null
                }
            </Box>
            <Box mx={2} my={3}>
                <Box>{`${bugFixes.title} ${bugFixes.rows.length > 0 ? "" : "- NA"}`} </Box>
                {
                    bugFixes.rows.length > 0 ?
                        <Box my={2}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            {bugFixes.columns.map((column, key) => (
                                                <StyledTableCell key={key}>{column}</StyledTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bugFixes.rows.map((rowData, rowkey) => (
                                            <StyledTableRow key={rowkey}>
                                                {
                                                    bugFixes.columns.map((column, columnkey) => (
                                                        <StyledTableCell key={columnkey} >{rowData[column]}</StyledTableCell>
                                                    ))
                                                }
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box> : null
                }
            </Box>
            <Box mx={2} my={3}>
                <Box>{`${changesToPreviousRelease.title} ${changesToPreviousRelease.rows.length > 0 ? "" : "- NA"}`} </Box>
                {
                    changesToPreviousRelease.rows.length > 0 ?
                        <Box my={2}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            {changesToPreviousRelease.columns.map((column, key) => (
                                                <StyledTableCell key={key}>{column}</StyledTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {changesToPreviousRelease.rows.map((rowData, rowkey) => (
                                            <StyledTableRow key={rowkey}>
                                                {
                                                    changesToPreviousRelease.columns.map((column, columnkey) => (
                                                        <StyledTableCell key={columnkey} >{rowData[column]}</StyledTableCell>
                                                    ))
                                                }
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box> : null
                }
            </Box>
        </Box>
    )
}

export default VersionNote