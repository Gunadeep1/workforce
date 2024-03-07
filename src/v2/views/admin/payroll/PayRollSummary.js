import { React, useState, useEffect } from 'react';
import PayrollDashboardStyles from './PayrollViewStyles';
import Avatar from '@mui/material/Avatar';
// import Avatarsvg from '../../../assets/svg/avatar.svg';
import PayrollsTable from './PayrollsTable';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import LoaderGif from '../../../assets/gif/Loader.gif'
import DownloadReport from '../../../assets/svg/downloadReport.svg';
import Payrollcomment from '../../../assets/svg/Payrollcomment.svg';
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import Payrollselectcomment from '../../../assets/svg/Payrollselectcomment.svg';
import Text from '../../../components/customText/Text';
import Input from "../../../components/input/Input";
import { addErrorMsg, addWarningMsg } from '../../../utils/utils';
import { Box, Typography, Breadcrumbs, Grid, Tab, Menu, MenuItem, Checkbox, Divider, SwipeableDrawer, Popover } from '@mui/material';
import Vectorlines from '../../../assets/svg/vector.svg';
import MenuLine from '../../../assets/svg/menu.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import { Draggable } from "react-drag-reorder";


export default function PayRollSummary() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({
        "w2": [],
        "1099": [],
        "internal_employees": [],
        'project_completed': [],
        'placement_going_to_end': [],
        'in_active_employee': [],
        'finalized_employees': [],
        'unFinalized_employees': [],
        'others': []
    });
    const location = useLocation();
    const { state } = location;
    const name = state ? state.name : null;
    const payroll_configuration_id = state ? state.payroll_configuration_id : null;
    const status = state ? state.status : null;
    const from_date = state ? state.from_date : null;
    const to_date = state ? state.to_date : null;
    const [comments, setComments] = useState({});
    const [payrollDetails, setPayrollDetails] = useState({});
    const [openPayroll, setOpenPayroll] = useState(false);
    const [value, setValue] = useState('1');
    const classes = PayrollDashboardStyles();
    const [totalNetAmount, setNetTotalAmount] = useState(0);
    const [drawer, setDrawer] = useState(false);
    const [openStatus, setOpenStatus] = useState(null);
    const opStatus = Boolean(openStatus);
    const [visaTypeIds, setVisaTypeIds] = useState([]);
    const [visaTypes, setVisaTypes] = useState([]);
    const [columnCheckBox, setColumnCheckBox] = useState([
        { name: 'Employee Name', checked: true },
        { name: 'Client Name', checked: true },
        { name: 'Visa', checked: true },
        { name: 'Hours', checked: true },
        { name: 'OT Hours', checked: false },
        { name: 'OT Rate', checked: false },
        { name: 'Bill Rate', checked: false },
        { name: 'Pay Rate', checked: true },
        { name: 'Amount', checked: true },
        { name: 'Salary Amount', checked: true },
        { name: 'Comments', checked: true },
        { name: 'Net Payable Amount', checked: true },
        { name: 'Balance', checked: true },
        { name: 'Expense Reimbursement', checked: true },
        { name: 'Expense Deduction', checked: false }
    ]);

    const navigate = useNavigate();

    const columns = [
        { 'name': 'Employee Name', 'width': '200px' },
        { 'name': 'Client Name', 'width': '130px' },
        { 'name': 'Visa', 'width': '150px' },
        { 'name': 'Hours', 'width': '120px' },
        { 'name': 'OT Hours', 'width': '120px' },
        { 'name': 'OT Rate', 'width': '120px' },
        { 'name': 'Bill Rate', 'width': '120px' },
        { 'name': 'Pay Rate', 'width': '120px' },
        { 'name': 'Amount', 'width': '120px' },
        { 'name': 'Salary Amount', 'width': '150px' },
        { 'name': 'Comments', 'width': '120px' },
        { 'name': 'Net Payable Amount', 'width': '200px' },
        { 'name': 'Balance', 'width': '120px' },
        { 'name': 'Expense Reimbursement', 'width': '220px' },
        { 'name': 'Expense Deduction', 'width': '220px' },
    ];

    useEffect(() => {
        if (location.state !== null && location.state.columnCheckBox) {
            setColumnCheckBox(location.state.columnCheckBox)
        }
        getPayrollList();
        getVisaTypes();
        // eslint-disable-next-line  
    }, [])

    useEffect(() => {
        getPayrollList();
        // eslint-disable-next-line  
    }, [visaTypeIds]);

    const getPayrollList = () => {
        let data = {
            payroll_configuration_id: payroll_configuration_id,
            visa_type_id: visaTypeIds.length == 0 ? [] : JSON.stringify(visaTypeIds)
        }
        setLoader(true);
        PayrollApi.getlisting(data).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data[0]) {
                    setData(response.data.data[0]);
                    handleTotalNetAmount(response.data.data[0]);
                    setLoader(false);
                } else {
                    setData({});
                    addWarningMsg(response.data.message);
                    setLoader(false);
                }
            } else {
                addErrorMsg(response.data.message);
                setLoader(false);
            }

        });

    };

    const getChangedPos = (currentPos, newPos) => {
        console.log(currentPos, newPos);
    };

    const getVisaTypes = () => {
        PayrollApi.visaTypeList().then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaTypes(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }

        });
    };

    const handleTotalNetAmount = (param) => {
        const totalNetAmount = {
            "w2": calculateTotalNetAmount(param["w2"]),
            "1099": calculateTotalNetAmount(param["1099"]),
            "internal_employees": calculateTotalNetAmount(param["internal_employees"]),
            "project_completed": calculateTotalNetAmount(param["project_completed"]),
            "placement_going_to_end": calculateTotalNetAmount(param["placement_going_to_end"]),
            "in_active_employee": calculateTotalNetAmount(param["in_active_employee"]),
            "others": calculateTotalNetAmount(param["others"]),
        };

        setNetTotalAmount(parseFloat(totalNetAmount["1099"] + totalNetAmount["w2"] + totalNetAmount["internal_employees"] + totalNetAmount["project_completed"] + totalNetAmount["placement_going_to_end"] + totalNetAmount["in_active_employee"]).toFixed(2));
    }

    function calculateTotalNetAmount(array) {
        return array.reduce((total, item) => total + (item.net_amount || 0), 0);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleColumn = (columnName, index) => {
        const newColumnCheckBox = [...columnCheckBox];
        newColumnCheckBox[index].checked = !newColumnCheckBox[index].checked;
        setColumnCheckBox(newColumnCheckBox);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleStatus = (args) => {
        setComments({});
        setOpenStatus(null);
        setOpenPayroll(null);
    }

    const handleOpenElcomment = (event) => {
        setOpenPayroll(event.currentTarget.id);
        setOpenStatus(event.currentTarget);
    }

    const handleViewFilterDetails = (data) => {
        setDrawer(true);
        setPayrollDetails(data);
    }

    const filteredColumns = columns.filter((column, index) => columnCheckBox[index]?.checked);

    const createMainRowData = (data, opStatus, openPayroll, comments, classes, type) => {
        return {
            id: data.id,
            main_row_data: [
                {
                    column: 'Employee Name', value: <Box display="flex" textAlign="left" width={'100%'}
                        sx={{ cursor: 'pointer' }} onClick={() => handleViewFilterDetails(data)}>
                        <Avatar alt={data.employee_name} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                        <Box ml={2}>
                            <Text noWrap sx={{
                                paddingTop: '0px !important', fontSize: "14px !important",
                                fontWeight: "500 !important", color: "#262626 !important",
                                height: "17px !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                            }} >{data.employee_name}</Text>
                            <Text sx={{
                                color: '#737373 !important', fontSize: "12px !important", fontWeight: "500 !important",
                                paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                            }} nowrap> {data.employee_reference_id} </Text>
                        </Box>
                    </Box>
                },
                {
                    column: 'Client Name',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{info.client_name}</Text>
                    ))
                },
                {
                    column: 'Visa',
                    value: data.placement_information.map(info => (
                        <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{data.visa_type_name}</Text>
                    ))
                },
                {
                    column: 'Hours',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{info.payroll_information.length > 0 ? info.payroll_information[0].total_hours : 0}</Text>
                    ))
                },
                {
                    column: 'OT Hours',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{info.payroll_information.length > 0 ? info.payroll_information[0].ot_hours : 0}</Text>
                    ))
                },
                {
                    column: 'OT Rate',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].ot_pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Bill Rate',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].bill_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Pay Rate',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Amount',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.amount}</Text>
                    ))
                },
                {
                    column: 'Salary Amount', value:
                        <Text id={data.id} value={data.amount_paid}
                            sx={{
                                cursor: "no-drop",
                                textAlign: "center",
                                fontSize: "12px !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                fontWeight: '500 !important',
                                color: "#171717 !important"
                            }}>
                            <Box id={data.id} value={data.amount_paid} sx={{ border: !data.is_finalize ? '1px solid #EAECF0' : 'none', margin: 'auto 0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} width={'153px'} height={'50px'}>
                                $ {data.amount_paid}
                            </Box>
                        </Text>
                },
                {
                    column: 'Comments', value:
                        openPayroll == data.id ?
                            <>
                                <img id={null}
                                    onClick={handleOpenElcomment} src={Payrollselectcomment} alt='Payrollselectcomment' style={{ cursor: 'pointer' }}></img>
                                <Popover id={data.id}
                                    disableScrollLock={true}
                                    anchorEl={openStatus}
                                    open={opStatus}
                                    onClose={handleStatus}
                                    sx={{
                                        boxShadow: '0px 2px 24px 0px #919EAB1F',
                                        borderRadius: '8px',

                                    }}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}>
                                    <Box p={2} background={'#FFFFFF'}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'comments',
                                                value: comments[data.id] || data.comments,
                                                disabled: true,
                                                inputProps: { readOnly: true }
                                            }}
                                            multiline={true}
                                            rows={2}
                                            descriptionFormControl
                                            descriptionInput
                                            labelText={<Text largeLabel>Comment Here</Text>}
                                        />
                                    </Box>
                                </Popover>
                            </>
                            :
                            <img id={data.id} onClick={handleOpenElcomment} src={Payrollcomment} alt='Payrollcomment' style={{ cursor: 'pointer' }}></img>
                },
                { column: 'Net Payable Amount', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.net_amount}</Text> },
                { column: 'Balance', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.available_balance_amount}</Text> },
                { column: 'Expense Reimbursement', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.debit_expense_available}</Text> },
                { column: 'Expense Deduction', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.credit_expense_available}</Text> },
            ],
            is_finalize: data.is_finalize,
            placement_information: data.placement_information.length
        };
    };

    const createRows = (data, opStatus, openPayroll, comments, classes, type) => {
        return data && data.map((rowData, index) => createMainRowData(rowData, opStatus, openPayroll, comments, classes, type));
    };

    var w2rows = createRows(data.w2, opStatus, openPayroll, comments, classes, 'w2');

    var filteredw2RowsFinalized = w2rows ? w2rows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filteredw2RowsUnFinalized = w2rows ? w2rows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    var d1099rows = createRows(data['1099'], opStatus, openPayroll, comments, classes, '1099');

    var filtered1099RowsFinalized = d1099rows ? d1099rows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filtered1099RowsUnFinalized = d1099rows ? d1099rows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    var internalEmployeeRows = createRows(data.internal_employees, opStatus, openPayroll, comments, classes, 'internal_employees');

    var filteredInternalEmployeeRowsFinalized = internalEmployeeRows ? internalEmployeeRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filteredInternalEmployeeRowsUnFinalized = internalEmployeeRows ? internalEmployeeRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    var projectCompletedRows = createRows(data.project_completed, opStatus, openPayroll, comments, classes, 'project_completed');

    var filteredProjectCompletedRowsFinalized = projectCompletedRows ? projectCompletedRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filteredProjectCompletedRowsUnFinalized = projectCompletedRows ? projectCompletedRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    var leftCompanyRows = createRows(data.in_active_employee, opStatus, openPayroll, comments, classes, 'in_active_employee');

    var otherCompanyRows = createRows(data.others, opStatus, openPayroll, comments, classes, 'others');

    var filteredLeftCompanyRowsFinalized = leftCompanyRows ? leftCompanyRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filteredLeftCompanyRowsUnFinalized = leftCompanyRows ? leftCompanyRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    var filteredOtherCompanyRowsFinalized = otherCompanyRows ? otherCompanyRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filteredOtherCompanyRowsUnFinalized = otherCompanyRows ? otherCompanyRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    var placementGoingToEndRows = createRows(data.placement_going_to_end, opStatus, openPayroll, comments, classes, 'placement_going_to_end');

    var filteredPlacementGoingToEndRowsFinalized = placementGoingToEndRows ? placementGoingToEndRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => row.is_finalize) : [];

    var filteredPlacementGoingToEndRowsUnFinalized = placementGoingToEndRows ? placementGoingToEndRows.map(row => {
        return {
            ...row,
            main_row_data: row.main_row_data.filter((_, index) => columnCheckBox[index]?.checked)
        };
    }).filter(row => !row.is_finalize) : [];

    const FilterView = () => {
        return (
            <Box width={'750px'} height={'auto'}>
                <Box height={'10vh'} display={'flex'} alignItems={'center'} padding={5} justifyContent={'space-between'} >
                    <Typography sx={{
                        fontSize: "16px",
                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                        fontWeight: "500",
                        color: "#262626"
                    }}>Employee Report</Typography>
                    <Box display={'flex'} gap={1}>
                        <img src={DownloadReport} alt="DownloadReport"></img>
                        <Typography sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: '#0C75EB' }}>Download Report</Typography>
                    </Box>
                </Box>
                <Box pl={3} pr={3}>
                    <Divider variant="middle" sx={{ color: '#EAECF0 !important' }} />
                </Box>
                <Box pt={3} pl={5} pr={5}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'employee_name',
                                    value: payrollDetails.employee_name,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Employee Name</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'client_name',
                                    value: payrollDetails.placement_information.map((value) => value.client_name),
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Client Name</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'visa',
                                    value: payrollDetails.visa_type_name,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Visa</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'hours',
                                    value: payrollDetails.placement_information.map((value) => value.payroll_information[0].total_hours),
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Hours</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'ot_hours',
                                    value: payrollDetails.placement_information.map((value) => value.payroll_information[0].ot_hours),
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>OT Hours</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'ot_rate',
                                    value: payrollDetails.placement_information.map((value) => value.payroll_information[0].ot_pay_rate),
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>OT Rate</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'payrate',
                                    value: payrollDetails.placement_information.map((value) => value.payroll_information[0].pay_rate),
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Payrate</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'amount',
                                    value: payrollDetails.placement_information.map((value) => value.amount),
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Amount</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'salary_amount',
                                    value: payrollDetails.amount_paid,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Salary Amount</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'net_payable_amount',
                                    value: payrollDetails.net_amount,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Net Payable Amount</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'expense_deduction',
                                    value: payrollDetails.credit_expense_available,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Expense Deduction</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'expense_reimbursement',
                                    value: payrollDetails.debit_expense_available,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Expense Reimbursement</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'balance',
                                    value: payrollDetails.available_balance_amount,
                                    disabled: true
                                }}
                                clientInput
                                labelText={<Text largeLabel>Balance</Text>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'comments',
                                    value: payrollDetails.comments,
                                    disabled: true,
                                    inputProps: { readOnly: true }
                                }}
                                // multiline={true}
                                rows={3}
                                descriptionFormControl
                                descriptionInput
                                labelText={<Text largeLabel>Comments</Text>}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} p={1} display={'flex'} gap={1} justifyContent={'flex-end'}>
                            <Button onClick={() => setDrawer(false)} sx={{
                                textTransform: "none !important", width: '91px', height: '35px',
                                fontSize: '14px !important', font: '14px Nunito Sans, sans-serif !important', backgroundColor: '#FFFFFF', border: '1px solid #525252', color: '#525252', borderRadius: '8px'
                            }}>Cancel</Button>
                            <Button sx={{
                                textTransform: "none !important",
                                width: '78px',
                                height: '35px',
                                fontSize: '14px !important',
                                font: '14px Nunito Sans, sans-serif !important',
                                backgroundColor: '#0C75EB',
                                border: '1px solid #FFFFFF',
                                color: '#FFFFFF',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#0C75EB !important',
                                    color: '#FFFFFF !important',
                                }
                            }} onClick={() => setDrawer(false)}>
                                Save</Button>
                        </Grid> */}
                    </Grid>
                </Box>
            </Box>
        );
    }

    const handleNavigation = () => {
        let routePath;
        let stateValue;

        if (status == 'Summary') {
            routePath = '/summary';
            stateValue = { status: 3 };
        } else if (status == 'Skipped') {
            routePath = '/skipped';
            stateValue = { status: 4 };
        }

        navigate(routePath, { state: stateValue });
    }

    return (
        <>
            {loader ?
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loader}
                >
                    <img src={LoaderGif} alt='LoaderGif'></img>
                </Backdrop>
                :
                <>
                    <Box sx={{ width: "100%" }}>
                        <Box p={1} sx={{ marginLeft: "100px" }}>
                            <Box mx={3}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Typography component={Link} to={'/payroll'} className={classes.breadcrumbsLink}>Payroll</Typography>
                                    <Typography
                                        onClick={handleNavigation}
                                        className={classes.breadcrumbsLink}>
                                        {status}
                                    </Typography>
                                    <Typography className={classes.breadcrumbsName}>View</Typography>
                                </Breadcrumbs>
                            </Box>
                            <Box mt={2} mx={3}>
                                <Grid container spacing={0}>
                                    <Grid item display={{ xs: 'block', md: 'block', lg: 'flex', xl: 'flex' }} gap={1} xs={12} sm={12} md={12} lg={6} xl={6}>
                                        <Typography className={classes.currentDraft}>{name}</Typography>
                                        <Typography className={classes.currentDraftDate}>( {from_date} - {to_date} )</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                        <Box display={{ xs: 'block', md: 'block', lg: 'flex', xl: 'flex' }} justifyContent={{ xs: "center", md: "flex-end", lg: "flex-end", xl: "flex-end" }} gap={1}>
                                            <button
                                                type="button"
                                                className={classes.searchButton}
                                                onClick={handleClick}>
                                                <img src={Vectorlines} alt="Vectorlines" />
                                            </button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                sx={{ height: '400px' }}

                                                onClose={handleClose}
                                            >
                                                <Draggable onPosChange={getChangedPos}>
                                                    {columnCheckBox.map((item, index) => (
                                                        <MenuItem key={index} disableRipple={true}>
                                                            <Box display={'flex'} width={'200px'}>
                                                                <Checkbox
                                                                    checked={item.checked}
                                                                    onChange={() => toggleColumn(item.name, index)}
                                                                    onClick={() => setAnchorEl(null)}
                                                                    sx={{
                                                                        width: '18px !important',
                                                                        height: '18px !important',
                                                                        borderRadius: '4px !important',
                                                                        border: '1px !important',
                                                                        padding: '0px !important',
                                                                    }}
                                                                    name={item.name}
                                                                />
                                                                <Typography sx={{
                                                                    marginLeft: '15px !important',
                                                                    fontSize: '12px !important',
                                                                    fontFamily: "Nunito, Nunito Sans, sans-serif !important",
                                                                    fontWeight: "500 !important",
                                                                    color: "#262626 !important"
                                                                }}
                                                                >{item.name}</Typography>
                                                                <div style={{ marginLeft: 'auto' }}>
                                                                    <img src={MenuLine} alt="MenuLine"></img>
                                                                </div>
                                                            </Box>
                                                            <Divider />
                                                        </MenuItem>
                                                    ))}
                                                </Draggable>

                                            </Menu>
                                        </Box>


                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TabContext value={value}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                                                <TabList onChange={handleChange} variant="fullWidth">
                                                    <Tab label='W2' value="1" className={value == '1' ? classes.activeText1 : classes.tabText1} />
                                                    <Tab label='1099' value="2" className={value == '2' ? classes.activeText1 : classes.tabText1} />
                                                    <Tab label='Internal Employees - W2' value="3" className={value == '3' ? classes.activeText1 : classes.tabText1} />
                                                    <Tab label='Project Completed' value="4" className={value == '4' ? classes.activeText1 : classes.tabText1} />
                                                    <Tab label='Placement Going To End' value="5" className={value == '5' ? classes.activeText1 : classes.tabText1} />
                                                    <Tab label='Left company' value="6" className={value == '6' ? classes.activeText1 : classes.tabText1} />
                                                    <Tab label='Others' value="7" className={value == '7' ? classes.activeText1 : classes.tabText1} />
                                                </TabList>
                                            </Box>
                                            <TabPanel value="1" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredw2RowsFinalized ? `Finalized ( ${filteredw2RowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredw2RowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredw2RowsUnFinalized ? `Not Finalized ( ${filteredw2RowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'unfinalize'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredw2RowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="2" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filtered1099RowsFinalized ? `Finalized ( ${filtered1099RowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filtered1099RowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filtered1099RowsUnFinalized ? `Not Finalized ( ${filtered1099RowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'unfinalize'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filtered1099RowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="3" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredInternalEmployeeRowsFinalized ? `Finalized ( ${filteredInternalEmployeeRowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredInternalEmployeeRowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredInternalEmployeeRowsUnFinalized ? `Not Finalized ( ${filteredInternalEmployeeRowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'unfinalize'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredInternalEmployeeRowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="4" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredProjectCompletedRowsFinalized ? `Finalized ( ${filteredProjectCompletedRowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredProjectCompletedRowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredProjectCompletedRowsUnFinalized ? `Not Finalized ( ${filteredProjectCompletedRowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'unfinalize'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredProjectCompletedRowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="5" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredPlacementGoingToEndRowsFinalized ? `Finalized ( ${filteredPlacementGoingToEndRowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredPlacementGoingToEndRowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredPlacementGoingToEndRowsUnFinalized ? `Not Finalized ( ${filteredPlacementGoingToEndRowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'unfinalize'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredPlacementGoingToEndRowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="6" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredLeftCompanyRowsFinalized ? `Finalized ( ${filteredLeftCompanyRowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredLeftCompanyRowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredLeftCompanyRowsUnFinalized ? `Not Finalized ( ${filteredLeftCompanyRowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} status={'unfinalize'} setVisaTypes={setVisaTypes} rows={filteredLeftCompanyRowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="7" sx={{ height: '65vh', overflow: 'scroll' }}>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredOtherCompanyRowsFinalized ? `Finalized ( ${filteredOtherCompanyRowsFinalized.length} )` : 'Finalized (0)'}
                                                </Typography>
                                                <br></br>

                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} status={'undefined'} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredOtherCompanyRowsFinalized} columns={filteredColumns}></PayrollsTable>
                                                <br></br>
                                                <Typography className={classes.currentDraft}>
                                                    {filteredOtherCompanyRowsUnFinalized ? `Not Finalized ( ${filteredOtherCompanyRowsUnFinalized.length} )` : 'Not Finalized (0)'}
                                                </Typography>
                                                <br></br>
                                                <PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} status={'unfinalize'} setVisaTypes={setVisaTypes} rows={filteredOtherCompanyRowsUnFinalized} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                        </TabContext>
                                        <Box width={'100%'} height={'95px'} sx={{
                                            padding: '15px 0px',
                                            position: 'fixed',
                                            bottom: '0px',
                                            background: '#ffffff',
                                            // boxShadow: '50px 0px 50px #ffffff',
                                            width: '1350px',
                                            zIndex: 0,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}>
                                            <Box>
                                                <Text sx={{ color: '#404040 !important', font: '16px Nunito Sans, sans-serif !important', fontWeight: '500 !important', fontSize: '16px !important' }}>Total Net Payable</Text>
                                                <Text sx={{
                                                    color: '#15803D !important',
                                                    font: '24px Nunito Sans, sans-serif !important', fontWeight: '700 !important', fontSize: '24px !important'
                                                }}>$ {totalNetAmount}</Text>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                    <SwipeableDrawer
                        anchor={'right'}
                        open={drawer} //Initially drawer value is false so SwipeableDrawer not appear directly
                        transitionDuration={300}
                        sx={{
                            ".MuiDrawer-paper": {
                                borderRadius: '8px 0px 0px 8px !important',
                            },
                            "& .MuiBackdrop-root.MuiModal-backdrop": {
                                backgroundColor: 'rgba(0, 0, 0, 0.75) !important'
                            }
                        }}
                        onClose={() => { setDrawer(false) }}
                    >
                        {
                            drawer === true ? FilterView() : null
                        }

                    </SwipeableDrawer>
                </>
            }
        </>
    );
}