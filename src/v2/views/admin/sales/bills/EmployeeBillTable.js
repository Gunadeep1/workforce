import * as React from 'react';
import { Box, IconButton, Avatar } from "@mui/material";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import { btnTxtBlack, btnBgGrey } from "../../../../theme";
import { btnTxtBlack } from "../../../../theme";
import DeleteSvg from '../../../../assets/svg/deleteSvg.svg';
import { getCurrencySymbol } from '../../../../utils/utils';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import Text from '../../../../components/customText/Text';
import SalesStyles from '../SalesStyles';

// Box

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.MuiTableCell-root': {
        padding: "12px 16px",
        // display:"flex",
        // justifyContent: "center",
        // alignItems: "center"
    },
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#F6F6F6",
        color: btnTxtBlack.shade4,
        fontSize: "16px",
        fontFamily: "Nunito, Nunito Sans, sans-serif",
        fontWeight: 500
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "14px",
        fontFamily: "Nunito, Nunito Sans, sans-serif",
        fontWeight: 400,
        backgroundColor: "#FFFFFF",
    },
    [`&.css-13hp4s0-MuiTableCell-root`]: {
        padding: "10px 16px"
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    // },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// function createData(name, calories, fat, carbs, protein) {
//     return { name, calories, fat, carbs, protein };
// }

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
// ];

// border: 1px solid #EAECF0

export default function EmployeeInvoiceTable(props) {

    const { vendorEmployeesList, ledgerItems, deleteLedgerItem, handleChangeLedgerItem, } = props
    const classes = SalesStyles();

    // const handleChange = () => {

    // }


    const TableInput = (data, target, key) => {
        return (
            <input
                type="text"
                name={target}
                value={data[target]}
                onChange={(e) => handleChangeLedgerItem(e, key)}
                style={{ color: "#404040", fontWeight: 400, fontFamily: "Nunito, Nunito Sans, sans-serif", fontSize: "12px ", width: "100%", height: "54px", textAlign: "center", border: "1px solid #EAECF0", borderRadius: "8px" }}
            />
        );
    }

    const TableTextArea = (data, target, key) => {
        return (
            <textarea
                // type="text"
                name={target}
                value={data[target]}
                onChange={(e) => handleChangeLedgerItem(e, key)}
                maxLength={400}
                style={{ resize: "none", marginTop:"2px",  color: "#404040", fontWeight: 400, fontFamily: "Nunito, Nunito Sans, sans-serif", fontSize: "12px ", width: "100%", height: "54px", border: "1px solid #EAECF0", borderRadius: "8px", padding: "4px 6px" }}
            />
        );
    }

    const SelectField = (data, target, key) => {
        return (
            <SearchSelect
                sx={{ width: "300px" }}
                name={target}
                value={data[target]}
                onChange={(e) => vendorEmployeesList.length > 0 && handleChangeLedgerItem(e, key,)}
                options={vendorEmployeesList}
                labelText={<Text largeLabel>Employee Name</Text>}
                scrollTrue
            />
        );
    }


    return (
        <Box>
            <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #EAECF0", borderRadius: "12px 12px 0px 0px" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Employee</StyledTableCell>
                            <StyledTableCell align='center'>Description</StyledTableCell>
                            <StyledTableCell align='center'>Hours</StyledTableCell>
                            <StyledTableCell align='center'>{`Bill Rate (${getCurrencySymbol()})`}</StyledTableCell>
                            <StyledTableCell align='center'>{`Amount (${getCurrencySymbol()})`}</StyledTableCell>
                            <StyledTableCell align='center' width={"100px"}>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            ledgerItems && ledgerItems.map((item, key) => (
                                <StyledTableRow key={key}>
                                    <StyledTableCell width={"300px"} >
                                        {
                                            
                                            item.employee_id === "" ?
                                                SelectField(item, "employee_id", key) :
                                                <Box sx={{ width: "300px", display: "flex", alignItems: "center" }}>
                                                    <Box sx={{ width: "50px" }}>
                                                        <Avatar alt={item.placed_employee_name} src={item.avatar ? item.avatar : vendorEmployeesList.length > 0 && vendorEmployeesList.find(o => o.employee_id === item.employee_id).avatar} />
                                                    </Box>
                                                    <Box sx={{ width: "250px" }}>
                                                        {/* <Box></Box> */}
                                                        <Text largeBlack>{item.placed_employee_name ? item.placed_employee_name : vendorEmployeesList.length > 0 && vendorEmployeesList.find(o => o.employee_id === item.employee_id).placed_employee_name}</Text>
                                                        <Text className={classes.viewTimesheetText} >{item.employee_reference_id !== undefined ? item.employee_reference_id : vendorEmployeesList.length > 0 ?  vendorEmployeesList.find(o => o.employee_id === item.employee_id).employee_reference_id : '-'}</Text>
                                                    </Box>
                                                </Box>
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>{TableTextArea(item, "description", key)}</StyledTableCell>
                                    <StyledTableCell align='center'>{TableInput(item, "hours", key)}</StyledTableCell>
                                    <StyledTableCell align='center'>{TableInput(item, "rate", key)}</StyledTableCell>
                                    <StyledTableCell align='center'>
                                        <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Box
                                                style={{ color: "#404040", fontWeight: 400, fontFamily: "Nunito, Nunito Sans, sans-serif", fontSize: "12px ", width: "190px", height: "54px", border: "1px solid #EAECF0", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}
                                            >{item.amount}
                                            </Box>
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell align='center' width={"100px"}>
                                        <IconButton aria-label="delete" onClick={() => deleteLedgerItem(key)}>
                                            <img src={DeleteSvg} alt='delete-svg' />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
