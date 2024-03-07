import { React, useState, useEffect } from 'react';
import PayrollViewStyles from './PayrollViewStyles';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import PayrollsTable from './PayrollsTable';
// import Dump from './Dump.json';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import LocalStorage from "../../../utils/LocalStorage";
import PayrollrunningGif from '../../../assets/gif/PayrollRunning.gif'
import LoaderGif from '../../../assets/gif/Loader.gif'
import Button from '../../../components/customButton/Button';
import SearchGlobal from '../../../assets/svg/search1.svg';
import ClearIcon from '@mui/icons-material/Clear';
import { onFloatOnlyChange } from '../../../components/Validation';
import DownloadReport from '../../../assets/svg/downloadReport.svg';
import Payrollcomment from '../../../assets/svg/Payrollcomment.svg';
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import Payrollselectcomment from '../../../assets/svg/Payrollselectcomment.svg';
import PayrollModel from '../../../assets/svg/PayrollModel.svg';
import Payrollsummary from '../../../assets/svg/Payrollsummary.svg';
import CancelModel from '../../../assets/svg/CancelModel.svg';
import Text from '../../../components/customText/Text';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import makeStyles from '@mui/styles/makeStyles';
import Input from "../../../components/input/Input";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '../../../assets/svg/Close.svg';
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg, getCurrencySymbol } from '../../../utils/utils';
import { Autocomplete, Box, TextField, Typography, Tooltip, Breadcrumbs, Paper, Grid, IconButton, Tab, Menu, MenuItem, Checkbox, Divider, SwipeableDrawer, Popover } from '@mui/material';
import Vectorlines from '../../../assets/svg/vector.svg';
import CrossIcon from '../../../assets/svg/crossIcon.svg';
import MenuLine from '../../../assets/svg/menu.svg';
import { Link, useLocation } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import { TooltipIndicator } from '../../../theme';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg';
import { Draggable } from "react-drag-reorder";
import Info from '../../../assets/svg/payroll-yellowinfo.svg';

const useStyles = makeStyles({
    globalSearchInput: {
        border: "none !important",
        padding: "0px 0px 0px 10px !important",
        height: "100% !important",
        background: "transparent !important",
        color: "rgba(38, 38, 38, 1) !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "14px !important",
        fontWeight: "600 !important",
        transition: "all .3s ease !important",
        '&::-webkit-input-placeholder': {
            color: "rgba(199, 204, 211, 1) !important",
        },
        '&:focus': {
            outline: "none !important"
        }
    },
    endAdornment: {
        position: 'inherit !important',
    },
    option: {
        '&[data-focus="true"]': {
            backgroundColor: 'transparent',
        },
        '&[aria-selected="true"]': {
            backgroundColor: 'transparent',
        },
    },
    inputRoot: {
        height: "50px",
        border: "0px solid rgba(199, 204, 211, 1)",
        borderRadius: "15px",
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        padding: '0px 0px 5px 5px !important',
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "14px !important",
    },
    inputYear: {
        padding: '0px 0px 0px 0px !important',
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "14px !important",
        color: "#333333 !important",
        fontWeight: "600 !important"
    },
    popupIndicator: {
        display: 'none',
    },
    clearIndicator: {
        display: 'none',
    }
});

export default function PayrollView(props) {
    const [anchorEl, setAnchorEl] = useState(null);// eslint-disable-next-line
    const [open, setOpen] = useState(true);
    const [openMoveto, setOpenMoveto] = useState(false);
    const [payrollModel, setPayrollModel] = useState(false);
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
    const [runningSummary, setRunningSummary] = useState(false);
    const [viewSummaryModel, setViewSummaryModel] = useState(false);
    const [cancelModel, setCancelModel] = useState(false);
    const [comments, setComments] = useState({});
    const [employeeIDs, setEmployeeIDs] = useState([]);
    const [payrollDetails, setPayrollDetails] = useState([]);
    const [employeeReport, setEmployeeReport] = useState({});
    const [visaTypes, setVisaTypes] = useState([]);
    const [columnCheckBox, setColumnCheckBox] = useState([
        { name: 'Employee Name', checked: true },
        { name: 'Client Name', checked: true },
        { name: 'Visa', checked: true },
        { name: 'Hours', checked: true },
        { name: 'OT Hours', checked: false },
        { name: 'OT Rate', checked: false },
        { name: 'Bill Rate', checked: true },
        { name: 'Pay Rate', checked: true },
        { name: 'Amount', checked: true },
        { name: 'Salary Amount', checked: true },
        { name: 'Comments', checked: true },
        { name: 'Net Payable Amount', checked: true },
        { name: 'Balance', checked: true },
        { name: 'Expense Reimbursement', checked: true },
        { name: 'Expense Deduction', checked: true },
    ]);

    const columns = [
        { 'name': '', 'width': 0 },
        { 'name': 'Employee Name', 'width': '250px' },
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

    const finalizedColumns = [
        { 'name': 'Employee Name', 'width': '200px' },
        { 'name': 'Hours', 'width': '120px' },
        { 'name': 'Salary Amount', 'width': '150px' },
        { 'name': 'Expense Reimbursement', 'width': '220px' },
        { 'name': 'Net Payable Amount', 'width': '220px' }
    ];

    const [amount, setAmount] = useState(null);
    const [openPayroll, setOpenPayroll] = useState(false);
    const [openPayrollAmount, setOpenPayrollAmount] = useState(false);
    const [value, setValue] = useState('1');
    const [finalized, setFinalized] = useState(null);
    const [finalizedvalue, setFinalizedValue] = useState('1');
    const classes = PayrollViewStyles();
    const [totalNetAmount, setNetTotalAmount] = useState(0);
    const [drawer, setDrawer] = useState(false);
    const [openStatus, setOpenStatus] = useState(null);
    const opStatus = Boolean(openStatus);
    const [visaTypeIds, setVisaTypeIds] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [openPaymentStatus, setOpenPaymentStatus] = useState(null);
    const opPaymentStatus = Boolean(openPaymentStatus);
    const classeSearch = useStyles();
    const navigate = useNavigate();

    const handleStatus = (args) => {
        setComments({});
        setOpenStatus(null);
        setOpenPayroll(null);
    }

    const handlePaymentStatus = () => {
        setOpenPaymentStatus(null);
        setOpenPayrollAmount(null);
        setAmount(null);
    }

    const handleAPICall = (title) => {
        getPayrollList(title);
    }

    const handleRowChange = (e, params, category) => {
        var updatedData = {
            ...data,
            [category]: data[category].map(employee => {
                if (employee.id === params.id) {
                    return { ...employee, [e.target.name]: e.target.checked };
                }
                return employee;
            }),
        };

        const payLoad = {
            request_id: LocalStorage.uid(),
            employees: [{
                employee_id: params.employee_id,
                payroll_configuration_id: params.payroll_configuration_id,
                is_draft: true,
                is_finalize: e.target.checked,
                amount_paid: params.amount_paid,
                comments: params.comments
            }],
        }

        const finalizedEmployees = updatedData[category].filter(employee => employee.is_finalize);
        const unFinalizedEmployees = updatedData[category].filter(employee => !employee.is_finalize);

        var updatedData2;
        if (e.target.checked) {
            updatedData2 = {
                ...updatedData,
                finalized_employees: [...updatedData.finalized_employees, ...finalizedEmployees],
                unFinalized_employees: updatedData.unFinalized_employees.filter(employee => employee.id !== params.id),
            };

        } else {
            updatedData2 = {
                ...updatedData,
                finalized_employees: updatedData.finalized_employees.filter(employee => employee.id !== params.id),
                unFinalized_employees: [...updatedData.unFinalized_employees, ...unFinalizedEmployees],
            };
        }
        var filteredArr = removeDuplicatesById(updatedData2.finalized_employees)
        updatedData2.finalized_employees = filteredArr
        setData(updatedData2);
        handleTotalNetAmount(updatedData2);
        UpdatePayroll(payLoad);

    }
    function removeDuplicatesById(arr) {
        const map = new Map();
        return arr.reduce((uniqueArr, obj) => {
            if (!map.has(obj.id)) {
                map.set(obj.id, true);
                uniqueArr.push(obj);
            }
            return uniqueArr;
        }, []);
    }

    const handleRowChangeunFinalized = (e, params, category, index) => {
        var updatedData = {
            ...data,
            [category]: data[category].map(employee => {
                if (employee.id === params.id) {
                    return { ...employee, [e.target.name]: e.target.checked };
                }
                return employee;
            }),
        };
        // if(category === 'unFinalized_employees'){
        //     updatedData.finalized_employees.push(updatedData[category][index]);
        //     updatedData[category].splice(index,1)
        // }
        if (category === 'finalized_employees') {
            const payLoad = {
                request_id: LocalStorage.uid(),
                employees: [
                    {
                        employee_id: updatedData[category][index].employee_id,
                        payroll_configuration_id: updatedData[category][index].payroll_configuration_id,
                        is_draft: true,
                        is_finalize: false,
                        amount_paid: updatedData[category][index].amount_paid,
                        comments: updatedData[category][index].comments
                    }
                ],
            };
            UpdatePayroll(payLoad);
            updatedData.unFinalized_employees.push(updatedData[category][index]);
            updatedData[category].splice(index, 1);
        }
        console.log(updatedData, 'updateData')
        setData({ ...updatedData });

        if (e.target.checked) {
            setOpen(true);
            if (category === 'unFinalized_employees') {
                setOpenMoveto(true);
            }
        } else {
            const hasFinalizedEmployee = updatedData[category].some((employee) => employee.is_finalize);
            setOpen(hasFinalizedEmployee);
            if (category === 'unFinalized_employees') {
                setOpenMoveto(hasFinalizedEmployee);
            }
        }
        if (e.target.checked && category !== 'unFinalized_employees') {
            setOpenMoveto(false)
        }
    }

    const UpdatePayroll = (payLoad) => {

        PayrollApi.updatePayroll(payLoad).then((response) => {
            if (response.data.statusCode == 1003) {
                handleStatus();
                getPayrollList();
            } else {
                addErrorMsg(response.data.message);
            }
        });

    }

    const handleCommentChange = (e, params, category) => {
        if (comments[params.id] === '') {
            comments[params.id] = data.comments
            setComments({ ...comments })
        }
        const updatedComments = {
            ...comments,
            [params.id]: e.target.value,
        };
        setComments(updatedComments);
    }

    const handleSaveComment = (params, category) => {
        let target = {
            name: 'comments',
            value: comments[params.id] || params.comments
        }

        const updatedData = {
            ...data,
            [category]: data[category].map(employee => {
                if (employee.id === params.id) {
                    return { ...employee, [target.name]: target.value };
                }
                return employee;
            }),
        };

        const payLoad = {
            request_id: LocalStorage.uid(),
            employees: [{
                employee_id: params.employee_id,
                payroll_configuration_id: params.payroll_configuration_id,
                is_draft: true,
                is_finalize: params.is_finalize,
                amount_paid: params.amount_paid,
                comments: comments[params.id]
            }],
        }

        setData(updatedData);
        UpdatePayroll(payLoad);
        setTimeout(() => {
            getPayrollList();
        }, 300)
    }

    const handlePaymentSaveStatus = (params, category) => {
        let target = {
            name: 'amount_paid',
            value: amount
        }

        var available_balance_amount = 0;
        if (Number(amount) > params.amount_paid) {
            available_balance_amount = Number(params.available_balance_amount) - (Number(amount) - Number(params.amount_paid));
        } else if (Number(amount) < params.amount_paid) {
            available_balance_amount = Number(params.available_balance_amount) + (Number(params.amount_paid) - Number(amount));
        }

        var net_amount = amount != 0 && amount != "" && amount != null ? (Number(params.credit_expense_available) + Number(amount)) - Number(params.debit_expense_available) : null;

        const updatedData = {
            ...data,
            [category]: data[category].map(employee => {
                if (employee.id === params.id) {
                    return { ...employee, [target.name]: target.value, 'available_balance_amount': available_balance_amount, 'net_amount': net_amount !== null ? net_amount : 0 };
                }
                return employee;
            }),
        };

        const payLoad = {
            request_id: LocalStorage.uid(),
            employees: [{
                employee_id: params.employee_id,
                payroll_configuration_id: params.payroll_configuration_id,
                is_draft: true,
                amount_paid: amount,
                is_finalize: params.is_finalize,
                comments: params.comments
            }],
        }

        setData(updatedData);
        UpdatePayroll(payLoad);
        handlePaymentStatus();
        handleTotalNetAmount(updatedData);
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeFinalized = (event, newValue) => {
        setFinalizedValue(newValue);
        if (newValue == 2) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "8px",
        },
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2)
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1)
        }
    }));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFinalized = (event) => {
        if (finalizedvalue == 1) {
            setOpenView(true);
        }
        else {
            const payLoad = {
                request_id: LocalStorage.uid(),
                employees: data.unFinalized_employees
                    .filter(params => params.is_finalize)
                    .map(params => ({
                        employee_id: params.employee_id,
                        payroll_configuration_id: params.payroll_configuration_id,
                        is_draft: true,
                        is_finalize: true,
                        amount_paid: params.amount_paid,
                        comments: params.comments
                    })),
            };

            const finalizedEmployees = data.unFinalized_employees.filter(employee => employee.is_finalize);


            const updatedData = {
                ...data,
                finalized_employees: [...data.finalized_employees, ...finalizedEmployees],
                unFinalized_employees: data.unFinalized_employees.filter(employee => !employee.is_finalize),
            };
            setOpenMoveto(false)
            setData(updatedData);
            UpdatePayroll(payLoad);
            setFinalizedValue('1')
        }
    };

    const handleCancelFinalize = () => {
        setOpen(false)
        setOpenMoveto(false)
        setFinalized(null);
        getPayrollList();
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenPayment = (event, totalAmount) => {
        setOpenPaymentStatus(event.currentTarget);
        setOpenPayrollAmount(event.currentTarget.id);
        setAmount(totalAmount);
    }

    // const handleCloseOpenPaymentStatus = () => {
    //     setOpenPaymentStatus(null);
    // }

    const handleOpenElcomment = (event) => {
        setOpenPayroll(event.currentTarget.id);
        setOpenStatus(event.currentTarget);
    }

    useEffect(() => {
        getPayrollList();
        getVisaTypes();
        // eslint-disable-next-line  
    }, [])

    useEffect(() => {
        getPayrollList();
        // eslint-disable-next-line  
    }, [visaTypeIds]);

    const getPayrollList = (searchFilter) => {
        let data = {
            payroll_configuration_id: payroll_configuration_id,
            visa_type_id: visaTypeIds.length == 0 ? [] : JSON.stringify(visaTypeIds),
            search: searchFilter
        }

        setLoader(true);
        PayrollApi.getlisting(data).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data[0]) {
                    setData(response.data.data[0]);
                    handleTotalNetAmount(response.data.data[0]);
                    handleAddEmplyeeList(response.data.data[0]);
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

    const handleAddEmplyeeList = (data) => {
        if (!employeeIDs.length) {
            var filteredData1 = data.internal_employees.map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }));

            var filteredData2 = data.in_active_employee.map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }))

            var filteredData3 = data['1099'].map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }))

            var filteredData4 = data['w2'].map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }))

            var filteredData5 = data['project_completed'].map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }))

            var filteredData6 = data['placement_going_to_end'].map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }))

            var filteredData7 = data['others'].map(employee => ({
                id: employee.id,
                title: employee.employee_name,
                employee_reference_id: employee.employee_reference_id,
                profile_url: employee.profile_picture_url || "",
            }))

            filteredData1 = filteredData1.concat(filteredData2, filteredData3, filteredData4, filteredData5, filteredData6, filteredData7);

            let uniqueEmployeeData = filteredData1.filter((v, i, a) => a.findIndex(t => (t.title === v.title)) === i);
            setEmployeeIDs(uniqueEmployeeData);

        }
    }

    const getVisaTypes = () => {
        PayrollApi.visaTypeList().then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaTypes(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }

        });
    };

    const updatePayrollReport = () => {
        const data = {
            request_id: LocalStorage.uid(),
            employee_id: employeeReport.employee_id,
            payroll_configuration_id: employeeReport.payroll_configuration_id,
            is_finalize: employeeReport.is_finalize,
            amount_paid: employeeReport.amount_paid,
            comments: employeeReport.comments
        }
        data['is_draft'] = false;
        PayrollApi.updatePayroll(data).then((response) => {
            if (response.data.statusCode == 1003) {
                addSuccessMsg('Payroll Updated Successfully');
                setData({...data});
                setDrawer(false);
                setTimeout(() => {
                    getPayrollList();
                }, 300)               
            } else {
                addErrorMsg(response.data.message);
                getPayrollList();
            }
        });
    }

    const changeHandler = (e) => {
        setEmployeeReport({
            ...employeeReport,
            [e.target.name]: e.target.value
        })
    }

    // const handleAmountChange = (event) => {
    //     setAmount(event.target.value);
    // };

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

        setNetTotalAmount(parseFloat(totalNetAmount["1099"] + totalNetAmount["w2"] + totalNetAmount["internal_employees"] + totalNetAmount["project_completed"] + totalNetAmount["placement_going_to_end"] + totalNetAmount["in_active_employee"] + totalNetAmount["others"]).toFixed(2));
    }

    function calculateTotalNetAmount(array) {
        return array.reduce((total, item) => total + (item.net_amount || 0), 0);
    }


    const FilterView = () => {
        return (
            <Box width={'750px'} height={'auto'}>
                <Box height={'10vh'} display={'flex'} alignItems={'center'} padding={'40px 40px 20px 40px'} justifyContent={'space-between'} >
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
                <Grid container sx={{ height: '550px', overflowY: 'scroll', marginBottom: "15px" }} pt={3} pl={5} pr={5}>
                    {
                        payrollDetails.map((item, index) => (
                            <Grid container spacing={3}>
                                <Grid item lg={12} xs={12} p={'8px 0px 8px 8px'}>
                                    <Text blackHeader18>{item.client_name}</Text>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'employee_name',
                                            value: item.employee_name,
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
                                            value: item.client_name,
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
                                            name: 'visa_type_name',
                                            value: employeeReport.visa_type_name,
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
                                            name: 'available_balance_amount',
                                            value: employeeReport.available_balance_amount,
                                            disabled: true
                                        }}
                                        clientInput
                                        labelText={<Text largeLabel>Balance</Text>}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'debit_expense_available',
                                            value: employeeReport.debit_expense_available,
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
                                            name: 'amount',
                                            value: item.amount,
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
                                            name: 'debit_expense_available',
                                            value: employeeReport.debit_expense_available,
                                            disabled: true
                                        }}
                                        clientInput
                                        labelText={<Text largeLabel>Expense Reimbursement</Text>}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Text mediumBlack>Payrate Division</Text>
                                    <Box p={'20px 0px'}>
                                        <table className={classes.table}>
                                            <tr>
                                                <th className={classes.tableRow}><Text BlackExtraDark>Payrate</Text></th>
                                                <th className={classes.tableRow}><Text BlackExtraDark>Hours</Text></th>
                                                <th className={classes.tableRow}><Text BlackExtraDark>OT Rate</Text></th>
                                                <th className={classes.tableRow}><Text BlackExtraDark>OT Hours</Text></th>
                                            </tr>
                                            {
                                                item.payroll_information.map((payrollItem) => (
                                                    <tr>
                                                        <td className={classes.tableRow}>
                                                            <Text BlackExtraDark>{getCurrencySymbol()}{payrollItem.pay_rate}</Text>
                                                        </td>
                                                        <td className={classes.tableRow}>
                                                            <Text BlackExtraDark>{payrollItem.hours}</Text>
                                                        </td>
                                                        <td className={classes.tableRow}>
                                                            <Text BlackExtraDark>{payrollItem.ot_pay_rate}</Text>
                                                        </td>
                                                        <td className={classes.tableRow}>
                                                            <Text BlackExtraDark>{payrollItem.ot_hours}</Text>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </table>
                                    </Box>
                                </Grid>
                            </Grid>
                        ))
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} pb={1}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'comments',
                                value: employeeReport.comments,
                                // disabled: true
                            }}
                            handleChange={changeHandler}
                            multiline={true}
                            rows={2}
                            descriptionFormControl
                            descriptionInput
                            labelText={<Text largeLabel>Comments</Text>}
                        />
                    </Grid>
                </Grid>
                <Grid item container spacing={2} xs={12} sm={12} md={12} lg={12} xl={12} p={'5px 35px 10px 35px !important'}>
                    <Grid item lg={8} justifyContent='start'>
                        <Text largeBlack>Salary Amount</Text>
                        <Box display='flex' flexDirection='row'>
                            <Text largeBoldGreen sx={{ paddingTop: '5px' }}>{getCurrencySymbol()}</Text>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'amount_paid',
                                    value: employeeReport.amount_paid,
                                    // disabled: true
                                }}
                                smallWhiteBg
                                handleChange={changeHandler}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={4} p={1} display={'flex'} gap={2} justifyContent={'flex-end'}>
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
                        }} onClick={updatePayrollReport}>
                            Save</Button>
                    </Grid>
                </Grid>
            </Box >
        );
    }

    const toggleColumn = (columnName, index) => {
        const newColumnCheckBox = [...columnCheckBox];
        newColumnCheckBox[index].checked = !newColumnCheckBox[index].checked;
        setColumnCheckBox([...newColumnCheckBox]);
    }

    const handleViewFilterDetails = (data) => {
        setDrawer(true);
        setPayrollDetails([...data.placement_information]);
        setEmployeeReport({ ...data });
    }

    const filteredColumns = columns.filter((column, index) => index === 0 || columnCheckBox[index - 1]?.checked);

    const createMainRowData = (data, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, type) => {
        return {
            id: data.id,
            main_row_data: [
                {
                    column: 'checkbox', value:
                        <Checkbox
                            name='is_finalize'
                            icon={<CheckBorderIcon />}
                            checkedIcon={<CheckedIcon />}
                            checked={data.is_finalize}
                            onChange={(e) => { handleRowChange(e, data, type) }}
                        />
                },
                {
                    column: 'Employee Name', value: <Box display="flex" textAlign="left" width={'100%'}
                        sx={{ cursor: 'pointer' }} onClick={() => handleViewFilterDetails(data)}>
                        <Avatar alt={data.employee_name} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                        <Box ml={1} textAlign={'left'}>
                            <Text noWrap sx={{
                                paddingTop: '0px !important', fontSize: "14px !important",
                                fontWeight: "500 !important", color: "#262626 !important",
                                height: "17px !important", width: "auto !important",
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
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Box display='flex' flexDirection='row' gap={1} pb={1}>
                                    <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: info.timesheet_approval_pending ? "orange !important" : '' }}>{info.client_name}</Text>
                                    {info.timesheet_approval_pending == true ?
                                        <BlackToolTip arrow placement='top' title={<Text smallWhite>Timesheets are not Approved/Submitted</Text>}>
                                            <img src={Info} alt='info' style={{ height: '12px', width: '12px', marginBottom: '-2px', marginTop: '3px', cursor: 'pointer' }} />
                                        </BlackToolTip>
                                        : ''}
                                </Box>)
                            :
                            <Box display='flex' flexDirection='row' gap={1}>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: info.timesheet_approval_pending ? "orange !important" : '' }}>{info.client_name}</Text>
                                {info.timesheet_approval_pending == true ?
                                    <BlackToolTip arrow placement='top' title={<Text smallWhite>Timesheets are not Approved/Submitted</Text>}>
                                        <img src={Info} alt='info' style={{ height: '12px', width: '12px', marginBottom: '-2px', marginTop: '3px', cursor: 'pointer' }} />
                                    </BlackToolTip>
                                    : ''}
                            </Box>

                    ))
                },
                {
                    column: 'Visa',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                            <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{data.visa_type_name}</Text>
                            )
                            :
                        <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{data.visa_type_name}</Text>
                    ))
                },
                {
                    column: 'Hours',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.total_hours}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                    ))
                },
                {
                    column: 'OT Hours',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.ot_hours}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                    ))
                },
                {
                    column: 'OT Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.ot_pay_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].ot_pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Bill Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.bill_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].bill_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Pay Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.pay_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Amount',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>$ {payValue.amount_payable ? payValue.amount_payable : 0}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.amount ? info.amount : 0}</Text>
                            ))
                },
                {
                    column: 'Salary Amount', value:
                        <Text id={data.id} value={data.amount_paid} onClick={(event) => openPaymentStatus == null && !data.is_finalize ? handleOpenPayment(event, data.amount_paid) : ''}
                            sx={{
                                cursor: !data.is_finalize ? "pointer" : "no-drop",
                                textAlign: "center",
                                fontSize: "12px !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                fontWeight: '500 !important',
                                color: "#171717 !important"
                            }}>
                            <Box id={data.id} value={data.amount_paid} sx={{ border: !data.is_finalize ? '1px solid #EAECF0' : 'none', margin: 'auto 0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} width={'153px'} height={'50px'}>
                                $ {data.amount_paid}
                            </Box>
                            {(openPayrollAmount == data.id) &&
                                <Popover id={data.id}
                                    disableRipple={true}
                                    disableScrollLock={true}
                                    anchorEl={openPaymentStatus}
                                    open={opPaymentStatus}
                                    onClose={handlePaymentStatus}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                >
                                    <Box id={data.id} p={1} display={'flex'} >
                                        <Paper id={data.id} className={classes.Paper}>
                                            <input
                                                type="text"
                                                className={classes.InputBase}
                                                value={amount}
                                                name="amount_paid"
                                                onChange={(event) => { setAmount(event.target.value) }}
                                                onKeyPress={onFloatOnlyChange}
                                                maxLength={8}
                                            />
                                        </Paper>
                                        <Box display={'flex'} margin={'auto'}>
                                            <CheckCircleIcon onClick={(e) => { handlePaymentSaveStatus(data, type) }} sx={{ color: '#1DB954', cursor: "pointer" }}></CheckCircleIcon>
                                            <CancelIcon onClick={handlePaymentStatus} sx={{ color: 'red', cursor: "pointer" }}></CancelIcon>
                                        </Box>
                                    </Box>
                                </Popover>}
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
                                                name: 'comments',  // eslint-disable-next-line
                                                value: (comments[data.id] === null || comments[data.id] === undefined) && data.comments || comments[data.id],
                                                disabled: data.is_finalize,
                                                inputProps: { maxLength: 100 }
                                            }}
                                            multiline={true}
                                            rows={2}
                                            handleChange={(e) => { handleCommentChange(e, data, type) }}
                                            // onChange={!data.is_finalize && ((e) => { handleCommentChange(e, data, type) })}
                                            descriptionFormControl
                                            descriptionInput
                                            labelText={<Text largeLabel>Comment Here</Text>}
                                        />
                                        {!data.is_finalize &&
                                            <div style={{ display: 'flex', justifyContent: 'end', paddingTop: '5px' }}>
                                                <Button sx={{
                                                    textTransform: "none !important",
                                                    paddingRight: '5px',
                                                    width: '61px',
                                                    height: '22px',
                                                    fontSize: '12px !important',
                                                    font: "12px Nunito Sans, sans-serif !important",
                                                    fontWeight: '500 !important',
                                                    backgroundColor: '#FFFFFF',
                                                    border: '1px solid #FFFFFF',
                                                    color: '#E51A1A',
                                                    borderRadius: '4px',
                                                    '&:hover': {
                                                        backgroundColor: '#FFFFFF !important',
                                                        color: '#E51A1A !important',
                                                    }
                                                }} onClick={handleStatus}>Cancel</Button>
                                                <Button sx={{
                                                    textTransform: "none !important",
                                                    width: '51px',
                                                    height: '22px',
                                                    fontSize: '12px !important',
                                                    font: "12px Nunito Sans, sans-serif !important",
                                                    fontWeight: '500 !important',
                                                    backgroundColor: '#0C75EB',
                                                    border: '1px solid #FFFFFF',
                                                    color: '#FFFFFF',
                                                    borderRadius: '4px',
                                                    '&:hover': {
                                                        backgroundColor: '#0C75EB !important',
                                                        color: '#FFFFFF !important',
                                                    }
                                                }} onClick={(e) => { handleSaveComment(data, type) }}>Save</Button>
                                            </div>}
                                    </Box>
                                </Popover>
                            </>
                            :
                            <img id={data.id} onClick={handleOpenElcomment} src={Payrollcomment} alt='Payrollcomment' style={{ cursor: 'pointer' }}></img>
                },
                { column: 'Net Payable Amount', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.net_amount}</Text> },
                { column: 'Balance', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.available_balance_amount}</Text> },
                { column: 'Expense Reimbursement', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.credit_expense_available}</Text> },
                { column: 'Expense Deduction', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.debit_expense_available}</Text> },
            ],
            placement_information: data.placement_information.length
        };
    };

    const createRows = (data, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, type) => {
        return data && data.map((rowData, index) => createMainRowData(rowData, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, type));
    };

    var w2rows = createRows(data.w2, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, 'w2');

    var filteredw2Rows = w2rows ? w2rows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var d1099rows = createRows(data['1099'], handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, '1099');

    var filtered1099Rows = d1099rows ? d1099rows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var internalEmployeeRows = createRows(data.internal_employees, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, 'internal_employees');

    var filteredinternalEmployeeRows = internalEmployeeRows ? internalEmployeeRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var projectCompletedRows = createRows(data.project_completed, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, 'project_completed');

    var filteredProjectCompletedRows = projectCompletedRows ? projectCompletedRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var placementGoingToEndRows = createRows(data.placement_going_to_end, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, 'placement_going_to_end');

    var filteredPlacementGoingToEndRows = placementGoingToEndRows ? placementGoingToEndRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var leftCompanyRows = createRows(data.in_active_employee, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, 'in_active_employee');

    var otherCompanyRows = createRows(data.others, handleRowChange, handleOpenPayment, handlePaymentStatus, handleSaveComment, handleCommentChange, opPaymentStatus, opStatus, openPayroll, comments, amount, openPaymentStatus, classes, onFloatOnlyChange, 'others');

    var filteredLeftCompanyRows = leftCompanyRows ? leftCompanyRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var filteredOtherCompanyRows = otherCompanyRows ? otherCompanyRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    console.log(data.others, 'data.others')

    var finalizedEmployeeRows = data.finalized_employees && data.finalized_employees.map((data, index) => {
        const mainRowData = {
            id: data.id,
            main_row_data: [
                {
                    column: 'checkbox', value:
                        <Checkbox
                            name="is_finalize"
                            icon={<CheckBorderIcon />}
                            checkedIcon={<CheckedIcon />}
                            // disabled={true}
                            checked={data.is_finalize}
                            onChange={(e) => { handleRowChangeunFinalized(e, data, 'finalized_employees', index) }}
                        // style={{
                        //     color: '#1976d2'
                        // }}
                        />
                },
                {
                    column: 'Employee Name', value: <Box display="flex" textAlign="left" width={'100%'}
                        sx={{ cursor: 'pointer' }} onClick={() => handleViewFilterDetails(data)}>
                        <Avatar alt={data.employee_name} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                        <Box ml={1}>
                            <Text noWrap sx={{
                                paddingTop: '0px !important', fontSize: "14px !important",
                                fontWeight: "500 !important", color: "#262626 !important",
                                height: "17px !important", width: "auto !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                            }} >{data.employee_name}
                            </Text>
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
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Box display='flex' flexDirection='row' gap={1} pb={1}>
                                    <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: info.timesheet_approval_pending ? "orange !important" : '' }}>{info.client_name}</Text>
                                    {info.timesheet_approval_pending == true ?
                                        <BlackToolTip arrow placement='top' title={<Text smallWhite>Timesheets are not Approved/Submitted</Text>}>
                                            <img src={Info} alt='info' style={{ height: '12px', width: '12px', marginBottom: '-2px', marginTop: '3px', cursor: 'pointer' }} />
                                        </BlackToolTip>
                                        : ''}
                                </Box>)
                            :
                            <Box display='flex' flexDirection='row' gap={1}>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: info.timesheet_approval_pending ? "orange !important" : '' }}>{info.client_name}</Text>
                                {info.timesheet_approval_pending == true ?
                                    <BlackToolTip arrow placement='top' title={<Text smallWhite>Timesheets are not Approved/Submitted</Text>}>
                                        <img src={Info} alt='info' style={{ height: '12px', width: '12px', marginBottom: '-2px', marginTop: '3px', cursor: 'pointer' }} />
                                    </BlackToolTip>
                                    : ''}
                            </Box>

                    ))
                },
                {
                    column: 'Visa',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                            <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{data.visa_type_name}</Text>
                            )
                            :
                        <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{data.visa_type_name}</Text>
                    ))
                },
                {
                    column: 'Hours',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.total_hours}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                    ))
                },
                {
                    column: 'OT Hours',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.ot_hours}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                    ))
                },
                {
                    column: 'OT Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.ot_pay_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].ot_pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Bill Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.bill_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].bill_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Pay Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.pay_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Amount',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>$ {payValue.amount_payable ? payValue.amount_payable : 0}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.amount ? info.amount : 0}</Text>
                            ))
                },
                {
                    column: 'Salary Amount', value:
                        <Text id={data.id} value={data.amount_paid} onClick={(event) => openPaymentStatus == null && !data.is_finalize ? handleOpenPayment(event, data.amount_paid) : ''}
                            sx={{
                                cursor: !data.is_finalize ? "pointer" : "no-drop",
                                textAlign: "center",
                                fontSize: "12px !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                fontWeight: '500 !important',
                                color: "#171717 !important"
                            }}>
                            <Box id={data.id} value={data.amount_paid} sx={{ border: !data.is_finalize ? '1px solid #EAECF0' : 'none', margin: 'auto 0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} width={'153px'} height={'50px'}>
                                $ {data.amount_paid}
                            </Box>
                            {(openPayrollAmount == data.id) &&
                                <Popover id={data.id}
                                    disableRipple={true}
                                    disableScrollLock={true}
                                    anchorEl={openPaymentStatus}
                                    open={opPaymentStatus}
                                    onClose={handlePaymentStatus}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                >
                                    <Box id={data.id} p={1} display={'flex'} >
                                        <Paper id={data.id} sx={{ border: 'none !important' }} >
                                            <input
                                                type="text"
                                                disabled={true}
                                                value={amount}
                                                name="amount_paid"
                                                onChange={(event) => { setAmount(event.target.value) }}
                                                onKeyPress={onFloatOnlyChange}
                                                maxLength={8}
                                                sx={{ border: 'none', width: '100%', height: '100%', fontSize: '8px', fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", textAlign: 'center' }}
                                            />
                                        </Paper>
                                    </Box>
                                </Popover>}
                        </Text>
                },
                {
                    column: 'Comments', value:
                        openPayroll == data.id ?
                            <>
                                <img id={null} onClick={handleOpenElcomment} src={Payrollselectcomment} alt='Payrollselectcomment' style={{ cursor: 'pointer' }}></img>
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
                                            // onChange={!data.is_finalize && ((e) => { handleCommentChange(e, data, 'finalized_employees') })}
                                            // handleChange={(e) => { handleCommentChange(e, data, 'finalized_employees') }}
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
                { column: 'Expense Reimbursement', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.credit_expense_available}</Text> },
                { column: 'Expense Deduction', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.debit_expense_available}</Text> },
            ],
            placement_information: data.placement_information.length

        }

        return mainRowData;
    });

    var filteredfinalizedEmployeeRows = finalizedEmployeeRows ? finalizedEmployeeRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];

    var unfinalizedEmployeeRows = data.unFinalized_employees && data.unFinalized_employees.map((data, index) => {
        const mainRowData = {
            id: data.id,
            main_row_data: [
                {
                    column: 'checkbox', value:
                        <Checkbox
                            name="is_finalize"
                            icon={<CheckBorderIcon />}
                            checkedIcon={<CheckedIcon />}
                            checked={data.is_finalize}
                            onChange={(e) => { handleRowChangeunFinalized(e, data, 'unFinalized_employees', index) }}
                        />
                },
                {
                    column: 'Employee Name', value: <Box display="flex" textAlign="left" width={'100%'}
                        sx={{ cursor: 'pointer' }} onClick={() => handleViewFilterDetails(data)}>
                        <Avatar alt={data.employee_name} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                        <Box ml={1}>
                            <Text noWrap sx={{
                                paddingTop: '0px !important', fontSize: "14px !important",
                                fontWeight: "500 !important", color: "#262626 !important",
                                height: "17px !important", width: "auto !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                            }} >{data.employee_name}
                            </Text>
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
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Box display='flex' flexDirection='row' gap={1} pb={1}>
                                    <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: info.timesheet_approval_pending ? "orange !important" : '' }}>{info.client_name}</Text>
                                    {info.timesheet_approval_pending == true ?
                                        <BlackToolTip arrow placement='top' title={<Text smallWhite>Timesheets are not Approved/Submitted</Text>}>
                                            <img src={Info} alt='info' style={{ height: '12px', width: '12px', marginBottom: '-2px', marginTop: '3px', cursor: 'pointer' }} />
                                        </BlackToolTip>
                                        : ''}
                                </Box>)
                            :
                            <Box display='flex' flexDirection='row' gap={1}>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: info.timesheet_approval_pending ? "orange !important" : '' }}>{info.client_name}</Text>
                                {info.timesheet_approval_pending == true ?
                                    <BlackToolTip arrow placement='top' title={<Text smallWhite>Timesheets are not Approved/Submitted</Text>}>
                                        <img src={Info} alt='info' style={{ height: '12px', width: '12px', marginBottom: '-2px', marginTop: '3px', cursor: 'pointer' }} />
                                    </BlackToolTip>
                                    : ''}
                            </Box>

                    ))
                },
                {
                    column: 'Visa',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                            <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{data.visa_type_name}</Text>
                            )
                            :
                        <Text sx={{ textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{data.visa_type_name}</Text>
                    ))
                },
                {
                    column: 'Hours',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.total_hours}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                    ))
                },
                {
                    column: 'OT Hours',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.ot_hours}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                    ))
                },
                {
                    column: 'OT Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.ot_pay_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].ot_pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Bill Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.bill_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].bill_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Pay Rate',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                                <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>{payValue.pay_rate}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>0</Text>
                        // <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.payroll_information.length > 0 ? info.payroll_information[0].pay_rate : 0}</Text>
                    ))
                },
                {
                    column: 'Amount',
                    value: data.placement_information.map(info => (
                        info.payroll_information.length > 0 ?
                            info.payroll_information.map((payValue) =>
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", paddingBottom: '10px !important' }}>$ {payValue.amount_payable ? payValue.amount_payable : 0}</Text>
                            )
                            :
                            <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {info.amount ? info.amount : 0}</Text>
                            ))
                },
                {
                    column: 'Salary Amount', value:
                        <Text id={data.id} value={data.amount_paid}
                            // onClick={(event) => openPaymentStatus == null && !data.is_finalize ? handleOpenPayment(event, data.amount_paid) : ''}
                            sx={{
                                // cursor: !data.is_finalize ? "pointer" : "no-drop",
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
                            {(openPayrollAmount == data.id) &&
                                <Popover id={data.id}
                                    disableRipple={true}
                                    disableScrollLock={true}
                                    anchorEl={openPaymentStatus}
                                    open={opPaymentStatus}
                                    onClose={handlePaymentStatus}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                >
                                    <Box id={data.id} p={1} display={'flex'} >
                                        <Paper id={data.id} sx={{ border: 'none !important' }} >
                                            <input
                                                type="text"
                                                disabled={true}
                                                value={amount}
                                                name="amount_paid"
                                                onChange={(event) => { setAmount(event.target.value) }}
                                                onKeyPress={onFloatOnlyChange}
                                                maxLength={8}
                                                sx={{ border: 'none', width: '100%', height: '100%', fontSize: '8px', fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important", textAlign: 'center' }}
                                            />
                                        </Paper>
                                    </Box>
                                </Popover>}
                        </Text>
                },
                {
                    column: 'Comments', value:
                        openPayroll == data.id ?
                            <>
                                <img id={null} onClick={handleOpenElcomment} src={Payrollselectcomment} alt='Payrollselectcomment' style={{ cursor: 'pointer' }}></img>
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
                                            // onChange={!data.is_finalize && ((e) => { handleCommentChange(e, data, 'unfinalized_employees') })}
                                            // handleChange={(e) => { handleCommentChange(e, data, 'unfinalized_employees') }}
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
                { column: 'Expense Reimbursement', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.credit_expense_available}</Text> },
                { column: 'Expense Deduction', value: <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.debit_expense_available}</Text> },
            ],
            placement_information: data.placement_information.length

        }

        return mainRowData;
    });

    var filteredunfinalizedEmployeeRows = unfinalizedEmployeeRows ? unfinalizedEmployeeRows.map(row => ({
        ...row,
        main_row_data: row.main_row_data.filter((_, index) => index === 0 || columnCheckBox[index - 1]?.checked)
    })) : [];


    var finalizedViewEmployeeRows = data.finalized_employees && data.finalized_employees.map((data, index) => {
        const mainRowData = {
            id: data.id,
            main_row_data: [
                {
                    column: 'Employee Name', value: <Box display="flex" textAlign="left" width={'100%'}
                        sx={{ cursor: 'pointer' }} onClick={() => handleViewFilterDetails(data)}>
                        <Avatar alt={data.employee_name} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                        <Box ml={1}>
                            <Text noWrap sx={{
                                paddingTop: '0px !important', fontSize: "14px !important",
                                fontWeight: "500 !important", color: "#262626 !important",
                                height: "17px !important", width: "auto !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                            }} >{data.employee_name}
                            </Text>
                            <Text sx={{
                                color: '#737373 !important', fontSize: "12px !important", fontWeight: "500 !important",
                                paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                            }} nowrap> {data.employee_reference_id} </Text>
                        </Box>
                    </Box>
                },
                {
                    column: 'Hours',
                    value: data.placement_information.map(info => (
                        <Text sx={{ fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>{info.payroll_information.length > 0 ? info.payroll_information[0].total_hours : 0}</Text>
                    ))
                },
                {
                    column: 'Salary Amount', value:
                        <Text id={data.id} value={data.amount_paid} onClick={(event) => openPaymentStatus == null ? handleOpenPayment(event, data.amount_paid) : ''} sx={{ cursor: "pointer", textAlign: "center", fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.amount_paid}</Text>
                },
                { column: 'Expense Reimbursement', value: <Text sx={{ textAlign: 'center', fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.debit_expense_available}</Text> },
                { column: 'Net Payable Amount', value: <Text sx={{ textAlign: 'center', fontSize: "12px !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontWeight: '500 !important', color: "#171717 !important" }}>$ {data.net_amount}</Text> },
            ],
            placement_information: data.placement_information.length

        }

        return mainRowData;
    });

    const handleClickContinue = () => {
        if (value < 7) {
            const newValue = parseInt(value) + 1;
            setValue(newValue.toString());
        } else {
            setFinalized(true);
            setOpen(true)
        }
    }

    const handleSubmitRunPayroll = () => {
        setOpenView(false);
        setPayrollModel(true);
    }

    const handleClosePayrollModel = () => {
        setPayrollModel(false);
        setOpenView(true);
    }

    const handleRunPayroll = () => {
        setRunningSummary(true);
        console.log(data, 'data xxxxx')
        let finalize = data.finalized_employees
        let unfinalize = data.unFinalized_employees
        let completeData = finalize.concat(unfinalize)
        console.log(completeData, 'complete DATAAA');
        let dataFinal = []
        for (let i = 0; i < completeData.length; i++) {
            dataFinal.push({
                employee_id: '',
                payroll_configuration_id: '',
                is_draft: '',
                is_finalize: '',
                amount_paid: '',
                comments: ''
            })
        }
        for (let i = 0; i < completeData.length; i++) {
            dataFinal[i].employee_id = completeData[i].employee_id
            dataFinal[i].payroll_configuration_id = completeData[i].payroll_configuration_id
            dataFinal[i].is_draft = false
            dataFinal[i].is_finalize = completeData[i].is_finalize
            dataFinal[i].amount_paid = completeData[i].amount_paid
            dataFinal[i].comments = completeData[i].comments
        }
        const payLoad = {
            request_id: LocalStorage.uid(),
            employees: dataFinal,
        }
        let data1 = {
            request_id: LocalStorage.uid(),
            payroll_configuration_id: payroll_configuration_id
        }
        PayrollApi.updatePayroll(payLoad).then((response) => {
            if (response.data.statusCode == 1003) {
                PayrollApi.PayrollRun(data1).then((response) => {
                    if (response.data.statusCode == 1003) {
                        setRunningSummary(false);
                        setPayrollModel(false);
                        setViewSummaryModel(true);
                        addSuccessMsg(response.data.message);
                    } else {
                        setRunningSummary(false);
                        setPayrollModel(false);
                        // setViewSummaryModel(true);
                        addErrorMsg(response.data.message);
                    }
                });
            } else {
                setRunningSummary(false);
                setPayrollModel(false);
                addErrorMsg(response.data.message);
            }
        });


        // setColumnCheckBox([...columnCheckBox]);
    }

    const handleClickCancel = () => {
        setCancelModel(true);
    }

    const handleNavigation = () => {
        let routePath;
        let stateValue;

        if (status === 'Drafted') {
            routePath = '/drafted';
            stateValue = { status: 'Drafted' };
        } else if (status === 'Pending') {
            routePath = '/pending';
            stateValue = { status: 'Yet to generate' };
        }
        // Add more conditions as needed

        navigate(routePath, { state: stateValue });
    }

    const getChangedPos = (currentPos, newPos) => {
        console.log(currentPos, newPos);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box p={1} sx={{ marginLeft: "100px" }}>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography component={Link} to={'/payroll'} className={classes.breadcrumbsLink}>Payroll</Typography>
                        <Typography
                            onClick={handleNavigation}
                            className={classes.breadcrumbsLink}>
                            {status} Payroll
                        </Typography>
                        <Typography className={classes.breadcrumbsName}>{name}</Typography>
                    </Breadcrumbs>
                </Box>
                <Box pt={2}>
                    <Grid container spacing={0}>
                        <Grid pt={2} item display={{ xs: 'block', md: 'block', lg: 'flex', xl: 'flex' }} gap={1} xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Typography className={classes.currentDraft}>{name}</Typography>
                            <Typography className={classes.currentDraftDate}>( {from_date} - {to_date} )</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} pb={1}>
                            <Box display={{ xs: 'block', md: 'block', lg: 'flex', xl: 'flex' }}
                                justifyContent={{ xs: "center", md: "flex-end", lg: "flex-end", xl: "flex-end" }} gap={1}>
                                <TooltipIndicator sx={{ backgroundColor: "#0C75EB !important" }}
                                    title={<Text mediumWhite><b><u>Note :</u></b> Selecting any employee will impact all payroll categories.</Text>}
                                    placement='left-start'>
                                    <Autocomplete
                                        classes={{
                                            endAdornment: classeSearch.endAdornment,
                                            option: classeSearch.option,
                                            popupIndicator: classeSearch.popupIndicator,
                                            clearIndicator: classeSearch.clearIndicator,
                                            inputRoot: classeSearch.inputRoot,
                                            input: classeSearch.input,
                                        }}
                                        sx={{ width: '300px' }}
                                        onChange={(event, newValue) => {
                                            if (newValue === null) {
                                                handleAPICall(null);
                                            } else {
                                                handleAPICall(newValue.title);
                                            }

                                        }}
                                        height={10}
                                        forcePopupIcon={false}
                                        clearIcon={<ClearIcon fontSize="small" />}
                                        fullWidth
                                        options={employeeIDs}
                                        getOptionLabel={(option) => `${option.title.length > 15 ? option.title.substring(0, 15) + '...' : option.title}`}
                                        getOptionSelected={(option, value) => option.title === value.title}
                                        filterOptions={(options, { inputValue }) => {
                                            const input = inputValue.trim().toLowerCase();
                                            return options.filter(
                                                (option) =>
                                                    option.title.toLowerCase().includes(input) ||
                                                    option.employee_reference_id.toLowerCase().includes(input)
                                            );
                                        }}
                                        renderOption={(props, option) => (
                                            <Tooltip title={option.title} arrow placement="top">
                                                <Box {...props} display="flex" textAlign="center" width={'100%'} sx={{ cursor: 'pointer' }}>
                                                    <Avatar alt={option.title} src={option.profile_url} sx={{ width: '40px', height: "40px" }} />
                                                    <Box ml={1} textAlign={"left"}>
                                                        <Text sx={{
                                                            paddingTop: '0px !important', fontSize: "14px !important",
                                                            fontWeight: "500 !important", color: "#262626 !important",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                                        }} >{option.title.length > 15 ? option.title.substring(0, 15) + '...' : option.title}</Text>
                                                        <Text sx={{ color: '#737373 !important', fontSize: "12px !important", fontWeight: "500 !important", fontFamily: "Nunito , Nunito Sans, sans-serif !important" }}>{option.employee_reference_id}</Text>
                                                    </Box>
                                                </Box>
                                            </Tooltip>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                {...params}
                                                className={classeSearch.globalSearchInput}
                                                placeholder="Search by Name / ID"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {params.InputProps.endAdornment}
                                                            <img src={SearchGlobal} alt='search' sx={{ marginTop: "-15px", position: 'absolute', right: 10 }} />
                                                            {/* <SearchIcon sx={{ position: 'absolute', right: 10 }} /> */}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </TooltipIndicator>
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
                                                        icon={<CheckBorderIcon />}
                                                        checkedIcon={<CheckedIcon />}
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
                        {loader ?
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={loader}>
                                <img src={LoaderGif} alt='LoaderGif'></img>
                            </Backdrop>
                            : <>
                                {finalized === null ?
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <TabContext value={value} sx={{ height: '50vh' }}>
                                            <Grid item container xs={12}>
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                                                    <TabList onChange={handleChange} variant="fullWidth">
                                                        <Tab label='W2' value="1" className={value == '1' ? classes.activeText : classes.tabText} />
                                                        <Tab label='1099' value="2" className={value == '2' ? classes.activeText : classes.tabText} />
                                                        <Tab label='Internal Employees - W2' value="3" className={value == '3' ? classes.activeText : classes.tabText} />
                                                        <Tab label='Project Completed' value="4" className={value == '4' ? classes.activeText : classes.tabText} />
                                                        <Tab label='Placement Going To End' value="5" className={value == '5' ? classes.activeText : classes.tabText} />
                                                        <Tab label='Left company' value="6" className={value == '6' ? classes.activeText : classes.tabText} />
                                                        <Tab label='Others' value="7" className={value == '7' ? classes.activeText : classes.tabText} />
                                                    </TabList>
                                                </Box>
                                            </Grid>
                                            <Grid item container xs={12}>
                                                <Box width={'100%'}>
                                                    <TabPanel value="1"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredw2Rows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                    <TabPanel value="2"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filtered1099Rows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                    <TabPanel value="3"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredinternalEmployeeRows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                    <TabPanel value="4"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredProjectCompletedRows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                    <TabPanel value="5"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredPlacementGoingToEndRows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                    <TabPanel value="6"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredLeftCompanyRows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                    <TabPanel value="7"><PayrollsTable setVisaTypeIds={setVisaTypeIds} visaTypes={visaTypes} setVisaTypes={setVisaTypes} rows={filteredOtherCompanyRows} columns={filteredColumns}></PayrollsTable></TabPanel>
                                                </Box>
                                            </Grid>
                                        </TabContext>
                                        <Box width={'100%'} height={'95px'}
                                            sx={{
                                                padding: '15px 0px',
                                                position: 'fixed',
                                                bottom: '0px',
                                                background: '#ffffff',
                                                width: '89%',
                                                zIndex: 0,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Box>
                                                <Text sx={{ color: '#404040 !important', font: '16px Nunito Sans, sans-serif !important', fontWeight: '500 !important', fontSize: '16px !important' }}>Total Net Payable</Text>
                                                <Text sx={{
                                                    color: '#15803D !important',
                                                    font: '24px Nunito Sans, sans-serif !important', fontWeight: '700 !important', fontSize: '24px !important'
                                                }}>$ {totalNetAmount}</Text>
                                            </Box>
                                            <Box style={{ marginTop: '15px' }}>
                                                <Button sx={{
                                                    textTransform: "none !important", maxWidth: '89px', height: '39px', fontWeight: '500 !important',
                                                    fontSize: '16px !important', font: "16px Nunito Sans, sans-serif !important", backgroundColor: '#FFFFFF', border: '1px solid #FFFFFF', color: '#525252', borderRadius: '10px'
                                                }} onClick={handleClickCancel}>Cancel</Button>
                                                {((data.finalized_employees && data.finalized_employees.length > 0) || (value != '7')) ?

                                                    <Button onClick={handleClickContinue} sx={{
                                                        textTransform: "none !important",
                                                        maxWidth: '113px',
                                                        height: '39px',
                                                        fontSize: '16px !important',
                                                        fontWeight: '500 !important',
                                                        font: "16px Nunito Sans, sans-serif !important",
                                                        backgroundColor: '#0C75EB',
                                                        border: '1px solid #FFFFFF',
                                                        gap: '12px',
                                                        color: '#FFFFFF',
                                                        borderRadius: '8px',
                                                        '&:hover': {
                                                            backgroundColor: '#0C75EB !important',
                                                            color: '#FFFFFF !important',
                                                        }
                                                    }}>Continue</Button>
                                                    : <TooltipIndicator sx={{ backgroundColor: "red !important" }}
                                                        title={<Text mediumWhite><b><u>Note :</u></b> Please ensure that you choose at least one employee to process the payroll.</Text>}
                                                        placement='top'><Button sx={{
                                                            textTransform: "none !important",
                                                            maxWidth: '113px',
                                                            cursor: 'not-allowed !important',
                                                            height: '39px',
                                                            fontSize: '16px !important',
                                                            fontWeight: '500 !important',
                                                            font: "16px Nunito Sans, sans-serif !important",
                                                            backgroundColor: '#0C75EB',
                                                            border: '1px solid #FFFFFF',
                                                            gap: '12px',
                                                            color: '#FFFFFF !important',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                backgroundColor: '#0C75EB !important',
                                                                color: '#FFFFFF !important',
                                                            }
                                                        }}>Continue</Button></TooltipIndicator>}

                                            </Box>
                                        </Box>

                                    </Grid>
                                    :
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TabContext value={finalizedvalue}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                                                <TabList onChange={handleChangeFinalized}>
                                                    <Tab
                                                        label={`Finalized ( ${data.finalized_employees ? data.finalized_employees.length : 0} )`}
                                                        value="1"
                                                        className={finalizedvalue === '1' ? classes.activeText : classes.tabText}
                                                    />
                                                    <Tab
                                                        label={`Not Finalized ( ${data.unFinalized_employees ? data.unFinalized_employees.length : 0} )`}
                                                        value="2"
                                                        className={finalizedvalue === '2' ? classes.activeText : classes.tabText}
                                                    />
                                                </TabList>
                                            </Box>
                                            <TabPanel value="1">
                                                <PayrollsTable rows={filteredfinalizedEmployeeRows} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <PayrollsTable rows={filteredunfinalizedEmployeeRows} columns={filteredColumns}></PayrollsTable>
                                            </TabPanel>
                                        </TabContext>
                                        <Box width={'100%'} height={'95px'} sx={{
                                            padding: '15px 0px',
                                            position: 'fixed',
                                            bottom: '0px',
                                            background: '#ffffff',
                                            // boxShadow: '50px 0px 50px #ffffff',
                                            width: '90%',
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
                                            <Box style={{ marginTop: '15px' }}>
                                                <>
                                                    <Button sx={{
                                                        textTransform: "none !important", width: '89px', height: '39px', fontWeight: '500 !important',
                                                        fontSize: '16px !important', font: "16px Nunito Sans, sans-serif !important", backgroundColor: '#FFFFFF', border: '1px solid #FFFFFF', color: '#525252', borderRadius: '10px'
                                                    }}
                                                        onClick={handleCancelFinalize}
                                                    >Cancel</Button>
                                                    {openMoveto && finalizedvalue === '2' ?
                                                        <Button
                                                            onClick={handleFinalized}
                                                            sx={{
                                                                textTransform: "none !important",
                                                                maxWidth: finalizedvalue == 1 ? '113px' : '200px',
                                                                height: '39px',
                                                                fontSize: '16px !important',
                                                                fontWeight: '500 !important',
                                                                font: "16px Nunito Sans, sans-serif !important",
                                                                backgroundColor: '#0C75EB',
                                                                border: '1px solid #FFFFFF',
                                                                gap: '12px',
                                                                color: '#FFFFFF',
                                                                borderRadius: '8px',
                                                                '&:hover': {
                                                                    backgroundColor: '#0C75EB !important',
                                                                    color: '#FFFFFF !important',
                                                                }

                                                            }} >{finalizedvalue === '2' && 'Move to Finalized list'}</Button>
                                                        :
                                                        finalizedvalue === '1' ?
                                                            <Button
                                                                onClick={handleFinalized}
                                                                sx={{
                                                                    textTransform: "none !important",
                                                                    maxWidth: finalizedvalue == 1 ? '113px' : '200px',
                                                                    height: '39px',
                                                                    fontSize: '16px !important',
                                                                    fontWeight: '500 !important',
                                                                    font: "16px Nunito Sans, sans-serif !important",
                                                                    backgroundColor: '#0C75EB',
                                                                    border: '1px solid #FFFFFF',
                                                                    gap: '12px',
                                                                    color: '#FFFFFF',
                                                                    borderRadius: '8px',
                                                                    '&:hover': {
                                                                        backgroundColor: '#0C75EB !important',
                                                                        color: '#FFFFFF !important',
                                                                    }

                                                                }} >{'Run Payroll'}</Button>
                                                            : null
                                                    }
                                                </>
                                            </Box>
                                        </Box>
                                    </Grid>
                                }</>}
                    </Grid>
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
            <BootstrapDialog
                keepMounted
                aria-labelledby='customizes-dialog-title'
                open={openView}
                maxWidth={"lg"}
            >
                <Box width={'910px'} height={'550px'} mt={2} mx={3}>
                    <Grid container spacing={0}>
                        <Grid item gap={1} xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Text className={classes.currentDraft} noWrap>
                                {data.finalized_employees ? `Finalised List Of Employees ( ${data.finalized_employees.length} )` : 'Finalised List Of Employees (0)'}
                            </Text>
                            <Typography className={classes.currentDraftDate}>{name} ( {from_date} - {to_date} )</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} display={'flex'} justifyContent={'flex-end'}>
                            <IconButton
                                aria-label='close'
                                onClick={() => { setOpenView(false) }}>
                                <img src={CrossIcon} alt='close' />
                            </IconButton>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={'35px'} sx={{ height: '360px', overflowX: 'hidden', overflowY: 'hidden' }}>
                            <PayrollsTable rows={finalizedViewEmployeeRows} columns={finalizedColumns}></PayrollsTable>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={3}>
                            <Box height="auto" sx={{
                                background: '#ffffff',
                                padding: '10px',
                                boxShadow: '50px 0px 50px #ffffff',
                                // zIndex: 1000,
                                display: 'flex',
                                justifyContent: 'space-between',
                                // position: 'absolute', // Adjust positioning as needed
                                bottom: 0, // Adjust positioning as needed
                            }}>
                                <Box>
                                    <Text sx={{ color: '#404040 !important', font: '16px Nunito Sans, sans-serif !important', fontWeight: '500 !important', fontSize: '16px !important' }}>Total Net Payable</Text>
                                    <Text sx={{
                                        color: '#15803D !important',
                                        font: '24px Nunito Sans, sans-serif !important', fontWeight: '700 !important', fontSize: '24px !important'
                                    }}>$ {totalNetAmount}</Text>
                                </Box>
                                <Box style={{ marginTop: '15px' }}>
                                    <Button sx={{
                                        textTransform: "none !important", width: '89px', height: '39px', fontWeight: '500 !important',
                                        fontSize: '16px !important', font: "16px Nunito Sans, sans-serif !important", backgroundColor: '#FFFFFF', border: '1px solid #FFFFFF', color: '#525252', borderRadius: '10px'
                                    }} onClick={() => { setOpenView(false) }}>Cancel</Button>
                                    <Button
                                        onClick={handleSubmitRunPayroll}
                                        sx={{
                                            textTransform: "none !important",
                                            width: '113px',
                                            height: '39px',
                                            fontSize: '16px !important',
                                            fontWeight: '500 !important',
                                            font: "16px Nunito Sans, sans-serif !important",
                                            backgroundColor: '#0C75EB',
                                            border: '1px solid #FFFFFF',
                                            gap: '12px',
                                            color: '#FFFFFF',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: '#0C75EB !important',
                                                color: '#FFFFFF !important',
                                            }
                                        }}>Run Payroll</Button>
                                </Box>
                            </Box>

                        </Grid>
                    </Grid>
                </Box>
            </BootstrapDialog>
            <BootstrapDialog
                keepMounted
                aria-labelledby='customizes-dialog-title'
                open={payrollModel}
                maxWidth={"lg"}
            >
                <Box textAlign='center' width={'562px'} height={'391px'} mt={2} mx={3} sx={{ justifyContent: 'center' }}>
                    {runningSummary ? <>
                        <img src={PayrollrunningGif} height={'200px'} width={'250px'} alt='PayrollrunningGif'></img>
                        <Text sx={{ marginTop: '0px', color: '#54595E', font: '18px Nunito Sans, sans-serif !important', fontWeight: '600 !important', fontSize: '18px !important' }}>Running Payroll...</Text>
                        <Text sx={{ marginTop: '0px', color: '#54595E99', font: '14px Nunito Sans, sans-serif !important', fontWeight: '400 !important', fontSize: '14px !important' }}>Just a moment, our HR elves are double-checking each digit to ensure precision. No payroll typos here!"</Text>
                    </> :
                        <>
                            <img style={{ marginTop: '30px' }} width={'184px'} height={'149px'} src={PayrollModel} alt='PayrollModel'></img>
                            <Text sx={{ marginTop: '30px', color: '#54595E', font: '18px Nunito Sans, sans-serif !important', fontWeight: '600 !important', fontSize: '18px !important' }}>Are You Sure To Run Payroll?</Text>
                            <Text sx={{ marginTop: '10px', color: '#54595E99', font: '14px Nunito Sans, sans-serif !important', fontWeight: '400 !important', fontSize: '14px !important' }}>Recheck before running the payroll.</Text>
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "45px", gap: "10px" }}>
                                <Button
                                    sx={{
                                        width: '145px',
                                        height: '44px',
                                        borderRadius: "8px !important",
                                        color: '#171717',
                                        fontWeight: '600 !important',
                                        textTransform: "none !important",
                                        font: "16px Nunito, sans-serif !important",
                                        border: "1px solid #C7CCD3 !important",
                                        "&:hover": {
                                            transform: "none",
                                        }
                                    }}
                                    onClick={handleClosePayrollModel}
                                >No, Cancel</Button>
                                <Button
                                    sx={{
                                        width: '145px',
                                        height: '44px',
                                        borderRadius: "8px !important",
                                        textTransform: "none !important",
                                        color: '#FFFFFF',
                                        fontWeight: '600 !important',
                                        background: `#0C75EB !important`,
                                        font: "16px Nunito, sans-serif !important",
                                    }} onClick={handleRunPayroll} >Yes, Run</Button>
                            </Box></>}
                </Box>
            </BootstrapDialog>
            <BootstrapDialog
                keepMounted
                aria-labelledby='customizes-dialog-title'
                open={viewSummaryModel}
                maxWidth={"lg"}>
                <Box textAlign='center' width={'562px'} height={'391px'} mt={2} mx={3} sx={{ justifyContent: 'center' }}>
                    <img style={{ marginTop: '30px' }} src={Payrollsummary} alt='PayrollModel'></img>
                    <Text sx={{ marginTop: '20px', color: '#54595E', font: '18px Nunito Sans, sans-serif !important', fontWeight: '600 !important', fontSize: '18px !important' }}>Successful</Text>
                    <Text sx={{ marginTop: '10px', color: '#54595E99', font: '14px Nunito Sans, sans-serif !important', fontWeight: '400 !important', fontSize: '14px !important' }}>Payroll has been run successfully.</Text>
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "15px", gap: "10px" }}>
                        <Button
                            sx={{
                                width: '145px',
                                height: '44px',
                                borderRadius: "8px !important",
                                color: '#171717',
                                textTransform: "none !important",
                                font: "16px Nunito, sans-serif !important",
                                fontWeight: "600 !important",
                                border: "1px solid #C7CCD3 !important",
                                "&:hover": {
                                    transform: "none",
                                }
                            }}
                            onClick={() => navigate("/payroll-summary", { state: { name: name, status: 'Summary', payroll_configuration_id: payroll_configuration_id, from_date: from_date, to_date: to_date, columnCheckBox: columnCheckBox } })}
                        >View Summary</Button>
                        <Button
                            sx={{
                                width: '145px',
                                height: '44px',
                                borderRadius: "8px !important",
                                textTransform: "none !important",
                                color: '#FFFFFF',
                                background: `#0C75EB !important`,
                                font: "16px Nunito, sans-serif !important",
                            }}
                            onClick={() => { navigate('/payroll'); setViewSummaryModel(false) }}
                        >Go To Home</Button>
                    </Box>

                </Box>
            </BootstrapDialog>
            <BootstrapDialog
                keepMounted
                aria-labelledby='customizes-dialog-title'
                open={cancelModel}
                maxWidth={"lg"}>
                <Box textAlign='center' width={'562px'} height={'400px'} mt={2} mx={3} sx={{ justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => setCancelModel(false)}><img src={CloseIcon} alt='CloseIcon'></img></Box>
                    <img src={CancelModel} alt='CancelModel'></img>
                    <Text sx={{ font: "18px Nunito Sans, sans-serif !important", fontWeight: '600 !important', color: '#54595E' }}>Are You Sure?</Text>
                    <Text sx={{ marginTop: '5px', font: "14px Nunito Sans, sans-serif !important", fontWeight: '400 !important', color: '#54595E99' }}>Do you want to quit running this payroll ?</Text>
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "15px", gap: "10px" }}>
                        <Button
                            sx={{
                                width: '145px',
                                height: '44px',
                                borderRadius: "8px !important",
                                color: '#171717',
                                textTransform: "none !important",
                                font: "16px Nunito, sans-serif !important",
                                border: "1px solid #C7CCD3 !important",
                                "&:hover": {
                                    transform: "none",
                                }
                            }}
                            onClick={() => setCancelModel(false)}
                        >No</Button>
                        <Button
                            sx={{
                                width: '145px',
                                height: '44px',
                                borderRadius: "8px !important",
                                textTransform: "none !important",
                                color: '#FFFFFF',
                                background: `#0C75EB !important`,
                                font: "16px Nunito, sans-serif !important",
                            }}
                            onClick={() => {
                                if (location.state.viewAll !== undefined) {
                                    if (location.state.viewAll === 'pending') {
                                        navigate('/pending', { state: { status: 1 } });
                                    }
                                    else {
                                        navigate('/drafted', { state: { status: 2 } });
                                    }
                                }
                                else {
                                    navigate('/payroll');
                                }
                                setCancelModel(false)
                            }}
                        >Yes</Button>
                    </Box>
                </Box>
            </BootstrapDialog>
        </Box>
        //         }

        // </>
    )
};