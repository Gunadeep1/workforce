import React, { useState } from "react";
import { Box, IconButton, Avatar, Dialog, DialogContent, Slide } from "@mui/material";
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
import { useLocation } from 'react-router-dom';
import crossIcon from '../../../../assets/svg/crossIcon.svg';
import warningImg from '../../../../assets/svg/confirm-BG-img.svg';
import CustomButton from '../../../../components/customButton/Button';
import InvoicesApi from '../../../../apis/admin/sales/InvoicesApi';
import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "8px",
        minWidth: "400px",
    },
    "& .MuiDialogContent-root": {
        // padding: theme.spacing(2)
        // padding: theme.spacing(3)
    },
    "& .MuiDialogActions-root": {
        // padding: theme.spacing(1)
        // padding: theme.spacing(5)
    }
}));

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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});


export default function EmployeeInvoiceTable(props) {

    const { clientEmployeesList, ledgerItems, deleteLedgerItem, handleChangeLedgerItem, viewTimesheetData, AddTimesheetData } = props
    const classes = SalesStyles();
    const location = useLocation();
    // const [deleteLedger, setDeleteLedger] = useState(null);
    // const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        openPopup: false,
        ledgerKey: null
    });



    const deleteLedgerItemAPI = (key) => {
        setLoading(true)
        InvoicesApi.deleteLedgerItemAPI(ledgerItems[key].id).then((res) => {
            setLoading(false)
            if (res.data.statusCode === 1003) {
                addSuccessMsg(res.data.message);
                deleteLedgerItem(key)
                setState({ openPopup: false, ledgerKey: null })
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const deleteLedgerItemAction = (key) => {
        deleteLedgerItem(key)
        setState({ openPopup: false, ledgerKey: null })
    }


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
                style={{ resize: "none", color: "#404040", fontWeight: 400, fontFamily: "Nunito, Nunito Sans, sans-serif", fontSize: "12px ", width: "100%", height: "54px", border: "1px solid #EAECF0", borderRadius: "8px", padding: "4px 6px" }}
            />
        );
    }

    const TableTimeInput = (data, target, key) => {
        return (
            <input
                // type="time"
                type="text"
                name={target}
                value={data[target]}
                onChange={(e) => handleChangeLedgerItem(e, key)}
                style={{ color: "#404040", fontWeight: 400, fontFamily: "Nunito, Nunito Sans, sans-serif", fontSize: "12px ", width: "100%", height: "54px", textAlign: "center", border: "1px solid #EAECF0", borderRadius: "8px" }}
            />
        );
    }

    const SelectField = (data, target, key) => {
        // let a = [];
        // const [index, setIndex] = useState([]);
        // for (let i = 0; i < clientEmployeesList.length; i++) {
        //     a.push({
        //         id: i + 1,
        //         value: clientEmployeesList[i].placement_reference_id
        //     });
        //     setIndex(i + 1);
        // }
        // console.log(clientEmployeesList, "clientEmployeesList");
        // console.log(a, "a");
        // console.log(data, "data");
        // console.log((index,"index"));
        return (
            <SearchSelect
                sx={{ width: "300px" }}
                name={target}
                multiple={true}
                // referenceID={'test'}
                value={data[target]}
                onChange={(e) => { handleChangeLedgerItem(e, key) }}
                options={clientEmployeesList}
                labelText={<Text largeLabel>Employee Name</Text>}
                scrollTrue
            />
        );
    }

    const HoursCell = (item, key) => {
        // if (item.employee_reference_id || item.timesheet_hour_ids.length > 0 || item.timesheets_available) {
        if (item.timesheet_hour_ids.length > 0 && item.timesheets_available) {
            return (
                <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box
                        style={{ color: "#404040", fontWeight: 400, fontFamily: "Nunito, Nunito Sans, sans-serif", fontSize: "12px ", width: "190px", height: "54px", border: "1px solid #EAECF0", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >{item.hours}
                    </Box>
                </Box>
            );
        } else {
            return TableTimeInput(item, "hours", key);
        }
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
                            ledgerItems.map((item, key) => (
                                <StyledTableRow key={key}>
                                    <StyledTableCell width={"300px"} >
                                        {
                                            ["", null, undefined].includes(item.employee_id) ?
                                                SelectField(item, "employee_id", key) :
                                                <Box sx={{ width: "300px", display: "flex", alignItems: "center" }}>
                                                    <Box sx={{ width: "50px" }}>
                                                        <Avatar alt={item.placed_employee_name} src={item.avatar ? item.avatar : clientEmployeesList.find(o => o.employee_id === item.employee_id).avatar} />
                                                    </Box>
                                                    <Box sx={{ width: "250px" }}>
                                                        <Text largeBlack>{item.placed_employee_name ? item.placed_employee_name : clientEmployeesList.find(o => o.employee_id === item.employee_id).placed_employee_name}</Text>
                                                        {
                                                            item.employee_reference_id && !["", null, undefined].includes(item.employee_reference_id) ? <Text className={classes.viewTimesheetText} > {item.employee_reference_id} </Text> :
                                                                item.timesheets_available ?
                                                                    <Text className={classes.viewTimesheetText} onClick={() => viewTimesheetData(key)}>View timesheet</Text> :
                                                                    <Text className={classes.viewTimesheetText} onClick={() => AddTimesheetData(key)}>Add timesheet</Text>
                                                        }

                                                    </Box>
                                                </Box>
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            {TableTextArea(item, "description", key)}
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        {HoursCell(item, key)}
                                    </StyledTableCell>
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
                                        {
                                            location.state !== null &&
                                                location.state.action === "generate_invoice" ? null :
                                                <IconButton aria-label="delete" onClick={() => setState({ openPopup: true, ledgerKey: key })}>
                                                    <img src={DeleteSvg} alt='delete-svg' />
                                                </IconButton>
                                        }
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>



            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={state.openPopup}
            >
                <IconButton
                    aria-label="close"
                    onClick={() => setState({ openPopup: false, ledgerKey: null })}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                </IconButton>

                <DialogContent>
                    <Box p={2} sx={{ width: "400px" }}>
                        <Box>
                            <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={warningImg} alt="warning" />
                            </Box>

                            <Box my={3}>
                                <Text my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                    Are You Sure?
                                </Text>
                                <Text my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                    Do You Really want to delete? You cannot undo this process.
                                </Text>
                            </Box>
                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <CustomButton no onClick={() => setState({ openPopup: false, ledgerKey: null })}>
                                    No
                                </CustomButton>
                                <CustomButton deleteBtn loading={loading} onClick={() => ledgerItems[state.ledgerKey].new ? deleteLedgerItemAction(state.ledgerKey) : deleteLedgerItemAPI(state.ledgerKey)}  >
                                    Yes, Delete
                                </CustomButton>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </Box >
    );
}
