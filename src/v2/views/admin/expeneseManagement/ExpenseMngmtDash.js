import React from 'react';
import ExpenseManagementStyles from './ExpenseManagementStyles';
import { Box, Checkbox, Chip, DialogContent, Typography, FormControl, Pagination, FormControlLabel, Grid, IconButton, InputBase, Menu, MenuItem, Paper, Radio, RadioGroup, Skeleton, Stack, SwipeableDrawer, Tab } from '@mui/material';
import Button from '../../../components/customButton/Button';
import { addErrorMsg, addSuccessMsg, getCurrencySymbol } from "../../../utils/utils";
import Text from '../../../components/customText/Text';
import { useState } from 'react';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as ExpenseDeleteIcon } from '../../../assets/svg/ExpenseDeleteIcon.svg';
import Datepicker from '../../../components/datePicker/Date';
import moment from "moment";
import Avatar from '@mui/material/Avatar';
import { dateFormat } from '../../../utils/utils';
import { ReactComponent as RadioCheckedIcon } from '../../../assets/svg/RadioCheckedIcon.svg';
import { TabContext, TabList } from '@mui/lab';
import Search from '../../../assets/svg/search1.svg'
import ExpenseImg from '../../../assets/svg/expenseImg.svg'
import ExpenseRejectImg from '../../../assets/svg/ExpenseRejectImg.svg'
import { btnBgGrey } from '../../../theme';
import Filterlines from '../../../assets/svg/filter-lines.svg';
import Dollar from '../../../assets/svg/dollar-sign 1.svg'
import Table from '../../../components/table/Table';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import expeneseManagementApi from '../../../apis/admin/expensesManagmentApi/ExpensesManagmentApi';
import { ReactComponent as CloseIcon } from '../../../assets/svg/cross.svg';
import { ReactComponent as RadioIcon } from '../../../assets/svg/RadioIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg'
import menu from "../../../assets/client/ActionMenu.svg"
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import crossIcon from "../../../assets/svg/crossIcon.svg";
import Input from '../../../components/input/Input';
import SearchSelect from '../../../components/selectField/SearchSelect';
import { Link } from 'react-router-dom';
import { ReactComponent as NewTag } from '../../../assets/svg/NewTag.svg';
import LocalStorage from '../../../utils/LocalStorage';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -18,
        top: 9,
        padding: '2px, 4px, 2px, 4px',
        background: '#FF4B55 !important',
        color: '#FFFF !important',

    },
}));

const FilterBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 3,
        background: '#FF4B55 !important',
        border: '1px solid #FFFF',
        color: '#FFFF !important',

    },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "16px",
    },
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));

export default function ExpenseMngmtDash() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const StyledPagination = styled(Pagination)({
        "& .MuiPagination-ul li:last-child": {
            marginLeft: "16px",
            '& .MuiButtonBase-root': {
                border: 'none !important'
            },
        },
        "& .MuiPagination-ul li:last-child button::before": {
            content: "'Next'",
            marginRight: "8px",
        },
        "& .MuiPagination-ul li:first-child": {
            marginRight: "16px",
            '& .MuiButtonBase-root': {
                border: 'none !important'
            },
        },
        "& .MuiPagination-ul li:first-child button::after": {
            content: "'Prev'",
            marginLeft: "8px",
        },
        '& .MuiButtonBase-root': {
            border: "1px solid #F1F1F1 ",
            color: "#333333 !important",
            font: "13px Nunito, Nunito Sans, sans-serif !important",
            fontWeight: '600 !important'
        },
        '& .MuiButtonBase-root.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: '#2F80ED !important',
            color: '#FFFFFF !important',
            border: "1px solid #2F80ED !important"
        },
        '& .MuiPaginationItem-icon': {
            display: 'none',
        },
    });
    const [newCount, setNewCount] = useState('')
    const [filterData, setFilterData] = useState({
        limit: 5,
        page: 1,
        search: '',
        from_date: '',
        to_date: '',
        status: [],
        expense_type: [],
        expense_transaction_type: [1]

    });
    const [indication, setIndication] = useState(false);
    const [viewState, setViewState] = useState([])
    const monthList = [
        {
            id: 1,
            value: 'January'
        },
        {
            id: 2,
            value: 'February'
        },
        {
            id: 3,
            value: 'March'
        },
        {
            id: 4,
            value: 'April'
        },
        {
            id: 5,
            value: 'May'
        },
        {
            id: 6,
            value: 'June'
        },
        {
            id: 7,
            value: 'July'
        },
        {
            id: 8,
            value: 'August'
        },
        {
            id: 9,
            value: 'September'
        },
        {
            id: 10,
            value: 'October'
        },
        {
            id: 11,
            value: 'November'
        },
        {
            id: 12,
            value: 'December'
        },
    ];
    const dateChange = (e, name) => {
        let date = e.$d
        setFilterData({
            ...filterData,
            [name]: moment(date).format(dateFormat())
        },)
        setMonthRadio(false);
    }
    const statusList = [
        {
            id: "Submitted",
            value: 'Submitted',
        },
        {
            id: "Processed",
            value: 'Processed',
        },
        {
            id: "Approval In Progress",
            value: 'Approval In Progress',
        },
        {
            id: "Rejected",
            value: 'Rejected',
        },
        {
            id: "Deduction In Progress",
            value: 'Deduction In Progress',
        },
    ];
    const handleDeleteDateChip = () => {
        setFilterData({ ...filterData, from_date: '', to_date: '' })
        setMonthRadio(true);
    }
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const classes = ExpenseManagementStyles();
    const navigate = useNavigate();
    const [drawer, setDrawer] = useState(false);
    const [value, setValue] = useState('1');
    const [search, setSearch] = useState('');
    const [clientRows, setClientRows] = useState([]);
    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    )
    const [loading, setLoading] = useState(true);
    const [openStatus, setOpenStatus] = useState(null);
    const opStatus = Boolean(openStatus);
    const [anchorEl, setAnchorEl] = useState(null);
    const newOpen = Boolean(anchorEl);
    const [months, setMonths] = useState([]);
    const [monthRadio, setMonthRadio] = useState(true);
    const [approveObj, setApproveObj] = useState({
        employee_name: "",
        expense_type: "",
        enable_approval: false,
        amount: "",
        expense_effect_on: "",
        reference_id: "",
        description: "",
        is_recurring: "",
        goal_amount: "",
        raised_date: ""
    });
    const [action, setAction] = useState("")
    const [openView, setOpenView] = React.useState(false);
    const clearAllFilter = () => {
        setSelectedFilter("")
        setMonths([]);
        setFilterData({ ...filterData, expense_type: [], status: [], from_date: '', to_date: '' })
        setMonthRadio(true);
        setIndication(false);
    }
    const cancelFilter = () => {
        setDrawer(false);
    }
    const handleApplyFilter = () => {
        const { expense_type, status, from_date, to_date } = filterData;
        if (expense_type.length !== 0 ||
            status.length !== 0 ||
            from_date !== '' ||
            to_date !== '') {
            ExpensesManagmentApi(filterData, pagination);
            setIndication(true);
        }
        else {
            ExpensesManagmentApi(filterData, pagination);
        }
    }
    useEffect(() => {
        ExpensesManagmentApi(filterData, pagination);
        dropDownExpenseTypeList();
        // eslint-disable-next-line  
    }, [])
    const dropDownExpenseTypeList = () => {
        setLoading(true);
        let slug = 'expense-management-types'
        expeneseManagementApi.dropDownExpenseTypeList(slug).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setViewState(res.data.data);
                }
            }, 300)
        })
    }

    // eslint-disable-next-line
    const handleClick = (event, args) => {

        if (value == "1") {
            setAnchorEl(event.currentTarget);
            expeneseManagementApi.index(args.id).then((res) => {
                setTimeout(() => {
                    if (res.data.statusCode === 1003) {
                        setApproveObj(res.data.data[0]);
                    }
                    else {
                        addErrorMsg(res.data.message);
                    }
                }, 300)
            })
        } else if (value == '2') {
            setAnchorEl(event.currentTarget);
            expeneseManagementApi.index(args.id).then((res) => {
                setTimeout(() => {
                    if (res.data.statusCode === 1003) {
                        setApproveObj(res.data.data[0]);
                    }
                    else {
                        addErrorMsg(res.data.message);
                    }
                }, 300)
            })
        } else {
            setOpenView(true)
        }
    }

    const handleDeleteMonthChip = (id) => {
        let newFilterData = months;
        if (newFilterData.includes(id)) {
            let numberOfElements = newFilterData.length - (id)
            newFilterData.splice(newFilterData.findIndex(item => item === parseInt(id)), numberOfElements + 1)
        }
        setMonths([...newFilterData]);
        setFilterData({ ...filterData, from_date: '', to_date: '' })
    };
    const handleChangePagination = (e, page) => {
        let paginationData = { ...pagination, currentPage: page };
        setPagination({ ...paginationData });
        console.log(filterData, 'filterData')
        ExpensesManagmentApi(filterData, paginationData);
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleStatus = (args) => {
        setOpenStatus(null);
        if (value == '1') {
            ExpensesManagmentApi(filterData, pagination);
        } else if (value == '3') {
        }
    }
    const handleChange = (event, newValue) => {
        let paginationData = { ...pagination, currentPage: 1 };
        setPagination({ ...paginationData })
        let filter_data = { ...filterData, expense_transaction_type: [parseInt(newValue)], search: '' };
        setFilterData({ ...filter_data });
        setValue(newValue);
        if (value == '1') {
            ExpensesManagmentApi(filter_data, paginationData);
        } else if (value == '2') {
            ExpensesManagmentApi(filter_data, paginationData);
        }
        setSearch("");
    };
    const changeHandler = (e) => {
        setSearch(e.target.value);
        if (value == '1') {
            ExpensesManagmentApi({ ...filterData, search: e.target.value }, { ...pagination, currentPage: 1 });
        } else if (value == '2') {
            ExpensesManagmentApi({ ...filterData, search: e.target.value }, { ...pagination, currentPage: 1 });
        }
        setFilterData({ ...filterData, search: e.target.value })
    }
    const handleApprove = () => {
        let data = {
            status: 'Approved'
        }
        expeneseManagementApi.updateStatus(data, approveObj.id).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setAction('Approve');
                    setOpenDialog(true);
                    setOpenView(false);
                }
                else {
                    addErrorMsg(res.data.message);
                }
            }, 300)
        })
    }
    const handleApproveClose = () => {
        setOpenDialog(false);
        ExpensesManagmentApi(filterData, pagination);
    }
    const handleApproveDeleteClose = () => {
        setOpenDeleteDialog(false);
    }
    const handleApproveDelete = () => {
        expeneseManagementApi.delete(approveObj.id).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    ExpensesManagmentApi(filterData, pagination);
                    setOpenDeleteDialog(false);
                    addSuccessMsg('Expense deleted successfully');
                }
                else {
                    addErrorMsg(res.data.message);
                }
            }, 300)
        })
    }
    const handleReject = () => {
        let data = {
            status: 'Rejected'
        }
        expeneseManagementApi.updateStatus(data, approveObj.id).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setAction('Rejected');
                    setOpenDialog(true);
                    setOpenView(false);
                }
                else {
                    addErrorMsg(res.data.message);
                }
            }, 300)
        })
    }
    const handleDelete = () => {
        setOpenDeleteDialog(true);
    }
    const columns = [
        {
            field: "name",
            align: "left",
            headerAlign: "left",
            headerName: <Text sx={{ fontSize: "16px", fontFamily: "Nunito, sans-serif", color: "#171717", fontWeight: "bold" }} pl={2}>Consultant</Text>,
            sortable: false,
            disableColumnMenu: true,
            width: 250,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Grid container display="flex">
                        <Grid item xs={9} display="flex" alignItems="center">
                            {loading ? <Skeleton animation="wave" width="40px" height='65px' style={{ borderRadius: '50%' }} /> :

                                <Avatar alt={cellValues.row.display_name} src={cellValues.row.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                            }
                            <Box pl={1} textAlign={"left"}>
                                <Typography
                                    sx={{
                                        fontFamily: "Nunito Sans, sans-serif !important",
                                        fontSize: "14px !important",
                                        fontWeight: '600 !important',
                                        color: '#262626 !important'
                                    }}
                                    component={Link}
                                    to={`/employees/user-profile/${cellValues.row.display_name === "" ? "" : cellValues.row.display_name.trim().split(/ +/).join('-')}`}
                                    state={{ id: cellValues.row.employee_id, full_name: cellValues.row.display_name, e_verify: cellValues.row.e_verified, reference_id: cellValues.row.reference_id, avatar_url: cellValues.row.profile_picture_url, enable_login: cellValues.row.enable_approve }}
                                    className={classes.cursor}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.display_name}</Typography>
                                <Text sx={{
                                    fontFamily: "Nunito Sans, sans-serif !important",
                                    fontSize: "12px !important",
                                    pt: 0.5,
                                    fontWeight: '500 !important',
                                    color: '#737373 !important'
                                }}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.employee_reference_id}</Text>
                            </Box>
                        </Grid>
                        <Grid item xs={3} pt={1}>
                            {cellValues.row.lable === "new" ? <NewTag /> : ""}
                        </Grid>
                    </Grid>
                )
            }
        },
        {
            field: "expense_type",
            align: "left",
            headerAlign: "left",
            headerName: <Text sx={{ fontSize: "16px", fontFamily: "Nunito, sans-serif", color: "#171717", fontWeight: "bold" }}>Expense Type</Text>,
            sortable: false,
            disableColumnMenu: true,
            width: 150,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : params.row.expense_type ? params.row.expense_type : "--",
        },
        {
            field: "reference_id",
            align: "left",
            headerAlign: "left",
            headerName: <Text sx={{ fontSize: "16px", fontFamily: "Nunito, sans-serif", color: "#171717", fontWeight: "bold" }}>Reference ID</Text>,
            sortable: false,
            disableColumnMenu: true,
            width: 150,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : params.row.reference_id ? params.row.reference_id : "--",
        },
        {
            field: "amount",
            align: "left",
            headerAlign: "left",
            headerName: <Text sx={{ fontSize: "16px", fontFamily: "Nunito, sans-serif", color: "#171717", fontWeight: "bold" }}>Amount</Text>,
            sortable: false,
            width: 150,
            flex: 1,
            disableColumnMenu: true,
            renderCell: (params) => (
                loading ? (<Skeleton animation="wave" width="100px" />) : (<span>$ {params.row.amount ? params.row.amount : "--"}</span>)
            )
        },
        {
            field: "status",
            align: "left",
            headerAlign: "left",
            width: 150,
            flex: 1,
            headerName:
                <>
                    <Box display='flex' flexDirection='row' columnGap={1}>
                        <Text sx={{ fontSize: "16px", fontFamily: "Nunito, sans-serif", color: "#171717", fontWeight: "bold" }}>Status</Text>
                    </Box>
                    <Menu
                        id="basic-menu"
                        anchorEl={openStatus}
                        newOpen={opStatus}
                        onClose={handleStatus}
                        sx={{
                            paddingBottom: '0',
                            '& .MuiPaper-root': {
                                boxShadow: 'none !important',
                                border: '1px solid #EAECF0 !important',
                                width: '140px !important'
                            }
                        }}
                    >
                    </Menu>
                </>,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (cellValues) => {
                return (
                    <Text smallBlack sx={{ paddingTop: '5px !important' }} nowrap>
                        {loading ? (
                            <Skeleton animation="wave" width="100px" />
                        ) : (
                            cellValues.row.status
                        )}
                    </Text>
                )
            }
        },
        {
            field: "",
            align: "center",
            headerAlign: "center",
            // headerName: "Actions", 
            headerName: <Text sx={{ fontSize: "16px", fontFamily: "Nunito, sans-serif", color: "#171717", fontWeight: "bold" }}>Actions</Text>,
            sortable: false,
            disableColumnMenu: true,
            width: 150,
            flex: 1,
            renderCell: (cellValues) => {
                console.log("111111", cellValues);
                return (
                    <>
                        {loading ?
                            <Skeleton
                                animation="wave"
                                width='100px'
                            />
                            :
                            <img src={menu}
                                className={classes.cursor}
                                alt='menu'
                                onClick={(e) => handleClick(e, cellValues.row)} />
                        }
                        {
                            value == '1' ? <Menu
                                MenuListProps={{
                                    disablePadding: true
                                }}
                                id='basic-menu'
                                anchorEl={anchorEl}
                                open={newOpen}
                                onClose={handleClose}
                                onClick={handleClose}
                                sx={{
                                    '& .MuiPaper-root': {
                                        boxShadow: 'none !important',
                                        border: '1px solid #EAECF0 !important',
                                        width: '140px !important',
                                    },
                                    "&:hover": {
                                        background: 'none !important'
                                    },
                                    // '& .MuiList-root-MuiMenu-list': {
                                    //     paddingTop: '0px !important',
                                    //     paddingBottom: '-10px !important'
                                    // }
                                }}
                            >
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "expense_management_view" && item.is_allowed == true))) ?
                                        <MenuItem className={classes.viewText2} onClick={() => setOpenView(true)} >View</MenuItem> :
                                        <MenuItem className={classes.viewTextDisable}>View</MenuItem>
                                }
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "expense_management_delete" && item.is_allowed == true))) ?
                                        <MenuItem className={classes.rejectText} onClick={() => handleDelete()}>Delete</MenuItem> :
                                        <MenuItem className={classes.viewTextDisable}>Delete</MenuItem>
                                }
                            </Menu> : <Menu
                                MenuListProps={{
                                    disablePadding: true
                                }}
                                id='basic-menu'
                                anchorEl={anchorEl}
                                open={newOpen}
                                onClose={handleClose}
                                onClick={handleClose}
                                sx={{
                                    '& .MuiPaper-root': {
                                        boxShadow: 'none !important',
                                        border: '1px solid #EAECF0 !important',
                                        width: '140px !important',
                                    },
                                    "&:hover": {
                                        background: 'none !important'
                                    }, '& .MuiList-root-MuiMenu-list': {
                                        paddingTop: '0 !important',
                                        paddingBottom: '0 !important'
                                    }
                                }}
                            >
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "expense_management_view" && item.is_allowed == true))) ?
                                        <MenuItem className={classes.viewText2} onClick={() => setOpenView(true)} >View</MenuItem> :
                                        <MenuItem className={classes.viewTextDisable}>View</MenuItem>
                                }
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "expense_management_delete" && item.is_allowed == true))) ?
                                        <MenuItem className={classes.rejectText} onClick={() => handleDelete()}>Delete</MenuItem> :
                                        <MenuItem className={classes.viewTextDisable}>Delete</MenuItem>
                                }
                            </Menu>
                        }
                    </>
                )
            }
        }
    ]

    const handleDeleteChip = (id, name) => {
        let newFilterData = filterData;
        if (newFilterData[name].includes(id)) {
            newFilterData[name].splice(newFilterData[name].findIndex(item => item === parseInt(id)), 1)
        }
        setFilterData({ ...newFilterData });
    }

    const addForm = () => {
        navigate('/addExpense')
    }
    function getStartDateOfMonth(monthNumber) {
        console.log("Month Number", monthNumber);
        const currentYear = new Date().getFullYear();
        console.log("Current year", currentYear);

        const startDate = new Date(currentYear, monthNumber - 1, 1);
        console.log("start date", startDate);

        const formattedStartDate = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}/${startDate.getFullYear()}`;

        return formattedStartDate;
    }

    function getEndDateOfMonth(monthNumber) {
        const currentYear = new Date().getFullYear();

        // Create a new Date object for the first day of the next month
        const nextMonthFirstDay = new Date(currentYear, monthNumber, 1);

        // Subtract one day to get the last day of the specified month
        const lastDayOfMonth = new Date(nextMonthFirstDay.getTime() - 1);

        // Format the date as MM/DD/YYYY
        const formattedEndDate = `${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}/${lastDayOfMonth.getDate().toString().padStart(2, '0')}/${lastDayOfMonth.getFullYear()}`;

        return formattedEndDate;
    }

    const handleChangeMonth = (e) => {
        let newFilterData = months;
        if (newFilterData.includes(parseInt(e.target.value))) {
            let numberOfElements = 13 - (e.target.value)
            newFilterData.splice(newFilterData.findIndex(item => item === parseInt(e.target.value)), numberOfElements)
            setFilterData({ ...filterData, from_date: '', to_date: '' })
        } else {

            if (newFilterData.length >= 1) {
                newFilterData.push(parseInt(e.target.value))
                newFilterData.sort((a, b) => a - b);
                let startMonthId = newFilterData[0];
                let endMonthId = newFilterData[newFilterData.length - 1];
                const newArray = Array.from({ length: endMonthId - startMonthId + 1 }, (_, index) => startMonthId + index);
                newFilterData = newArray;
                setMonths([...newFilterData]);
            } else {
                newFilterData.push(parseInt(e.target.value))
            }
        }
        setMonths([...newFilterData]);
        if (months.length === 1) {
            console.log(months, "monthsssssss");
            let from_date = getStartDateOfMonth(months[0]);
            let to_date = getEndDateOfMonth(months[0]);
            console.log("From Date", from_date);
            console.log("From Date", to_date);
            if (selectedFilter === 'month') {
                setFilterData({ ...filterData, from_date: from_date, to_date: to_date })
            }

        }
        else if (months.length > 1) {
            let from_date = getStartDateOfMonth(months[0]);
            let to_date = getEndDateOfMonth(months[months.length - 1]);
            if (selectedFilter === 'month') {
                setFilterData({ ...filterData, from_date: from_date, to_date: to_date })
            }
        }

    };


    const ExpensesManagmentApi = (filter, pagination) => {
        setLoading(true);
        expeneseManagementApi.listing(filter, pagination).then((res) => {
            setDrawer(false);
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setClientRows(res.data.data);
                    setNewCount(res.data.newly_raised_data)
                    setPagination(prevPagination => ({ ...prevPagination, ...res.data.pagination }));
                }
            }, 300)
        })
    }

    const handleChangeCheckBox = (e) => {
        let newFilterData = filterData;
        if (e.target.name === 'expense_type') {
            if (newFilterData[e.target.name].includes(Number(e.target.value))) {
                newFilterData[e.target.name].splice(newFilterData[e.target.name].findIndex(item => item === Number(e.target.value)), 1)
            } else {
                newFilterData[e.target.name].push(Number(e.target.value))
            }
            setFilterData({ ...newFilterData });
        }
        else {
            if (newFilterData[e.target.name].includes(e.target.value)) {
                newFilterData[e.target.name].splice(newFilterData[e.target.name].findIndex(item => item === e.target.value), 1)
            } else {
                newFilterData[e.target.name].push(e.target.value)
            }
            setFilterData({ ...newFilterData });
        }


    }

    const FilterView = () => (
        <Box width={'660px'} height={'100vh'} >
            <Box height={'10vh'} borderBottom={'1px solid #EAECF0'} display={'flex'} alignItems={'center'} pl={4} >
                <Text BlackExtraDark>Filters</Text>
            </Box>

            <Box display={'flex'} height={'7vh'} borderBottom={'1px solid #EAECF0'} alignItems={'center'} justifyContent={'space-between'} pr={'26px'} gap={1}>
                <Box display={'flex'} height={'60px'} alignItems={'center'} width={'90%'} pl={4} pr={'26px'} gap={1} sx={{
                    overflowX: 'auto', '::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    {
                        // selectedFilter === "month" &&
                        monthList.map((item, key) => (
                            months.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteMonthChip(item.id)} deleteIcon={<CloseIcon />} />
                        ))


                    }
                    {
                        // selectedFilter === "status" &&
                        statusList.map((item, key) => (
                            filterData.status.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteChip(item.id, "status")} deleteIcon={<CloseIcon />} />
                        ))
                    }
                    {
                        // selectedFilter === "expense_type" &&
                        viewState.map((item, key) => (
                            filterData.expense_type.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteChip(item.id, "expense_type")} deleteIcon={<CloseIcon />} />
                        ))
                    }
                    {
                        // selectedFilter === "custom_date" &&
                        (filterData.to_date !== '' && filterData.from_date !== '') ?
                            <Chip label={`${filterData.from_date} - ${filterData.to_date}`} variant="outlined" onDelete={() => handleDeleteDateChip()} deleteIcon={<CloseIcon />} /> : null

                    }


                </Box>
                <Button startIcon={<CloseIcon />} onClick={() => clearAllFilter()} clearAll >Clear All</Button>
            </Box>

            <Box display={'flex'} width={'100%'} border={'1px solid #EAECF0'} height={'73vh'} >
                <Box display={'flex'} flexDirection={'column'} height={'100%'} width={'45%'} borderRight={'1px solid #EAECF0'} pl={5} pt={2} >
                    <RadioGroup sx={{
                        gap: '16px !important'
                    }}
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <FormControlLabel
                            value="expense_type" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Expense type</Text>} />
                        {monthRadio && <FormControlLabel
                            value="month" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Based On Months</Text>} />}
                        <FormControlLabel
                            value="status" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Status</Text>} />

                        {months.length == 0 && <FormControlLabel
                            value="custom_date" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Custom</Text>} />
                        }
                    </RadioGroup>
                </Box>

                <Box display={'flex'} flexDirection={'column'} height={'100%'} width={'55%'} pt={2} overflow={'auto !important'} >
                    <FormControl sx={{
                        gap: '16px !important'
                    }}>
                        {
                            selectedFilter === "month" &&
                            monthList.map((item, key) => (
                                <FormControlLabel
                                    sx={{ pl: '36px' }}
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"month"}
                                            value={item.id}
                                            onChange={handleChangeMonth}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            // defaultChecked={filterData.employment.includes(item.id)}
                                            checked={months.includes(item.id) ? "checked" : null}
                                        />}
                                    label={<Text checkboxlable >{item.value}</Text>}
                                />
                            ))
                        }

                        {
                            selectedFilter === "status" &&
                            statusList.map((item, key) => (
                                <FormControlLabel
                                    key={key}
                                    sx={{ pl: '36px' }}
                                    control={
                                        <Checkbox
                                            name={"status"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            checked={filterData.status.includes(item.id) ? "checked" : null}
                                        />}
                                    label={<Text checkboxlable >{item.value}</Text>}
                                />
                            ))
                        }

                        {
                            selectedFilter === "expense_type" &&
                            viewState.map((item, key) => (
                                <FormControlLabel
                                    sx={{ pl: '36px' }}
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"expense_type"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            checked={filterData.expense_type.includes(item.id) ? "checked" : null}
                                        />}
                                    label={<Text checkboxlable >{item.value}</Text>} />
                            ))
                        }

                        {
                            selectedFilter === "custom_date" && months.length == 0 ?
                                <Grid container sx={{ pt: 2 }} justifyContent={'space-around'} rowSpacing={2}>
                                    <Grid item lg={5} md={5} sm={10} xs={10}   >
                                        <Datepicker
                                            labelText={"From"}
                                            name={"from_date"}
                                            maxDate={filterData.to_date !== '' ? filterData.to_date : ''}
                                            value={filterData.from_date}
                                            onChange={(e, args) => dateChange(e, 'from_date')}
                                            disabled={false}

                                        />
                                    </Grid>
                                    <Grid item lg={5} md={5} sm={10} xs={10}>
                                        <Datepicker
                                            labelText={"To"}
                                            name={"to_date"}
                                            minDate={filterData.from_date !== '' ? filterData.from_date : ''}
                                            value={filterData.to_date}
                                            onChange={(e, args) => dateChange(e, 'to_date')}
                                            disabled={false}
                                        />
                                    </Grid>
                                </Grid> : null
                        }

                    </FormControl>

                </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={1} height={'73px'} pr={'26px'}>

                <Button cancelSmall onClick={() => cancelFilter()}>Cancel</Button>
                <Button saveSmall onClick={() => handleApplyFilter()} >Apply Filters</Button>
            </Box>
        </Box >)


    return (
        <Grid container pl={13} pt={3}>
            {openDialog &&
                <ReusablePopup iconHide openPopup={openDialog} setOpenPopup={handleApproveClose} white statusWidth>
                    <Box textAlign='center' p={'0px 20px 0px 20px'}>
                        <img src={action === 'Approve' ? ExpenseImg : ExpenseRejectImg} alt='success' />
                        <Text veryLargeLabel sx={{ paddingTop: '25px !important' }}>{action === 'Approve' ? "Expense Approved" : "Expense Rejected"}</Text>
                        <Text mediumLabel sx={{ padding: '10px 0px 30px 0px !important' }}>Expense has been {action === 'Approve' ? "Approved" : "Reject"} for <span style={{ color: `blue` }}>{`  ${approveObj && approveObj.employee_name}`}</span>.</Text>
                        <Button onClick={handleApproveClose} blueButton>Go To Home</Button>
                    </Box>
                </ReusablePopup>
            }
            {openDeleteDialog &&
                <ReusablePopup iconHide openPopup={openDeleteDialog} setOpenPopup={handleApproveDeleteClose} white statusWidth>
                    <Box textAlign='center' p={'0px 20px 0px 20px'}>
                        <ExpenseDeleteIcon></ExpenseDeleteIcon>
                        <Text sx={{ fontSize: "18px !important", fontFamily: "Nunito, sans-serif", color: "#54595E !important", fontWeight: "600 !important", paddingTop: '25px !important' }}>Are You Sure?</Text>
                        <Text sx={{ fontSize: "14px !important", fontFamily: "Nunito, sans-serif", color: "#54595E99 !important", fontWeight: "400 !important", paddingTop: '10px !important' }}>Do you really wish to delete this expense for</Text>
                        <Text sx={{ fontSize: "14px !important", fontFamily: "Nunito, sans-serif", color: "#0C75EB !important", fontWeight: "400 !important" }}>{approveObj.employee_name}</Text>
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "15px", gap: "10px" }}>
                            <Button onClick={handleApproveDeleteClose} sx={{ width: "70px !important" }} outlineBlue>No</Button>
                            <Button
                                sx={{
                                    font: "14px Nunito, sans-serif !important",
                                    background: `#F85036 !important`,
                                    color: '#FFFFFF !important',
                                    textTransform: "none !important",
                                    borderRadius: "8px !important",
                                    minWidth: "150px !important",
                                    height: "41px !important",
                                    variant: "outlined",
                                    "&:hover": {
                                        transform: "scale3d(1.05, 1.05, 1)",
                                    }
                                }}
                                onClick={handleApproveDelete}
                            >Yes, Delete</Button>
                        </Box>
                    </Box>
                </ReusablePopup>
            }
            {
                <BootstrapDialog
                    keepMounted
                    aria-labelledby='customizes-dialog-title'
                    open={openView}
                    maxWidth={"md"}
                >
                    <Box sx={{
                        padding: "25px 25px 0px 25px",
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text largeBldBlack>{filterData['expense_transaction_type'][0] == 1 ? `Expense for ${approveObj.expense_type}` : `Deduction for ${approveObj.expense_type}`}</Text>
                        <IconButton
                            aria-label='close'
                            onClick={() => { setOpenView(false) }}>
                            <img src={crossIcon} alt='close' />
                        </IconButton>
                    </Box>
                    <DialogContent sx={{ width: '828px', maxHeight: '578px', '&.MuiDialogContent-root': { padding: '0px' } }}>
                        <Grid container columnSpacing={3} padding={'0px 36px 36px 36px'}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box height={'86px'}>
                                    <Input
                                        disabled
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: "employee_name",
                                            value: approveObj.employee_name,
                                            disabled: true
                                        }}
                                        clientInput
                                        labelText={<Text largeLabel >Employee Name</Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box height={'86px'} >
                                    <SearchSelect
                                        disabled
                                        name='expense_type'
                                        value={value}
                                        options={[
                                            { id: 1, value: "Reimbursement" },
                                            { id: 2, value: "Deduction" }]}
                                        onChange={''}
                                        labelText={<Text largeLabel>Expense Type</Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box height={'86px'}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'expense_name',
                                            value: approveObj.expense_type,
                                            disabled: true
                                        }}
                                        clientInput
                                        labelText={<Text largeLabel>Expense Name</Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box height={'86px'}>
                                    <Input
                                        disabled
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'expense_id',
                                            value: approveObj.reference_id,
                                            disabled: true
                                        }}

                                        clientInput
                                        labelText={<Text largeLabel>Expense ID</Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <Box mt={1}>
                                    <Datepicker
                                        disabled
                                        value={approveObj.raised_date}
                                        labelText={<Text largeLabel>Date</Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <Box height={'86px'} pt={1}>
                                    <Input
                                        clientInput
                                        disabled
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'enter_amount',
                                            value: `${getCurrencySymbol()} ${approveObj.amount}`,
                                            disabled: true,
                                        }}
                                        labelText={<Text largeLabel>Enter Amount</Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box height={'86px'} pt={1}>
                                    <SearchSelect
                                        disabled
                                        name='expense_effect_on'
                                        value={approveObj.expense_effect_on}
                                        options={[{ id: 1, value: "Payroll" }, { id: 2, value: "Balancesheet" }]}
                                        labelText={<Text largeLabel>Add To</Text>}
                                    />
                                </Box>

                            </Grid>
                            {approveObj.expense_effect_on === 1 &&
                                <>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <Box height={'86px'} pt={1}>
                                            <SearchSelect
                                                disabled
                                                name='add_to'
                                                value={(approveObj.is_recurring || approveObj.has_goal_amount) ? 1 : 2}
                                                options={[{ id: 1, value: "Yes" }, { id: 2, value: "No" }]}
                                                labelText={<Text largeLabel>{(approveObj.recurring_count === null && value === "2") ? "Does this deduction have a goal amount?" : "Is Recurring"}</Text>}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        {(approveObj.is_recurring || approveObj.has_goal_amount) &&
                                            <Box height={'86px'} pt={1}>
                                                <Input
                                                    disabled
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'recurring_count',
                                                        value: approveObj.goal_amount || approveObj.recurring_count,
                                                        disabled: true
                                                    }}

                                                    clientInput
                                                    labelText={<Text largeLabel>{(approveObj.recurring_count === null && value === "2") ? "Goal Amount" : "Recurring Count"}</Text>}
                                                />
                                            </Box>
                                        }
                                    </Grid>

                                </>
                            }
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Box height={'150px'}>
                                    <Input
                                        disabled
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'comments',
                                            value: approveObj.description,
                                            disabled: true
                                        }}
                                        multiline={true}
                                        rows={3}
                                        descriptionFormControl
                                        descriptionInput
                                        labelText={<Text largeLabel>Comments</Text>}
                                    />
                                </Box>
                            </Grid>
                            {
                                ((approveObj.enable_approval) ?
                                    ((<Grid item lg={12} md={12} sm={12} xs={12} display={'flex'} justifyContent={'flex-end'} gap={'10px'} mt={0}>
                                        <Button cancelBtn onClick={handleReject} >Reject</Button>
                                        <Button saveBtn onClick={handleApprove}>Approve</Button>
                                    </Grid>)) : '')
                            }
                        </Grid>
                    </DialogContent>
                </BootstrapDialog>
            }
            <Grid item lg={12} md={12} sm={12} xs={12} pl={3}>
                <Text headerBlack>All Expenses</Text>
            </Grid>
            <Grid item container lg={12} md={12} sm={12} xs={12} pt={2} pl={2}>
                <Grid item lg={7} md={5} sm={8} xs={12}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '356px' }}>
                            <TabList onChange={handleChange}>
                                <Tab label={
                                    <Stack direction='row' spacing={2} mx={'10px'}>
                                        <StyledBadge badgeContent={newCount ? newCount.newly_raised_reimbusment : null} >{'Reimbursements'}</StyledBadge>
                                    </Stack>}
                                    value='1' className={value == '1' ? classes.activeText : classes.tabText} style={{ textTransform: 'capitalize' }} />
                                <Tab label={
                                    <Stack direction='row' spacing={2} mx={'10px'}>
                                        <StyledBadge badgeContent={newCount ? newCount.newly_raised_deduction : null} >{'Deductions'}</StyledBadge>
                                    </Stack>
                                } value='2' className={value == '2' ? classes.activeText : classes.tabText} style={{ textTransform: 'capitalize' }} />
                            </TabList>
                        </Box>
                    </TabContext>
                </Grid>
                <Grid item container lg={4} md={7} sm={4} xs={12} spacing={2}>
                    <Grid item lg={6.5} md={4} sm={4} xs={12}>
                        <Paper className={classes.Paper} style={{ display: 'flex', padding: "5px" }}>
                            <InputBase
                                className={classes.InputBase}
                                fullWidth
                                name="search"
                                onChange={changeHandler}
                                placeholder='Search by Emp Name/Expense ID'
                                value={search}
                            />
                            <img src={Search} alt="Search" style={{ color: `${btnBgGrey.shade4} !important`, height: '24px !important', width: '24px !important' }} />
                        </Paper>
                    </Grid>
                    <Grid item lg={1.5}>
                        <Box onClick={() => {
                            setDrawer("filter");
                        }} className={classes.Paper} justifyContent='end' style={{ cursor: 'pointer' }}>
                            <FilterBadge overlap="circular" variant={indication ? 'dot' : null} ><img src={Filterlines} alt="Userplus" style={{ height: '23px', width: '23px' }} /></FilterBadge>
                        </Box>
                    </Grid>
                    <Grid item lg={4}>
                        {
                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "expense_management_create" && item.is_allowed == true))) ?
                                <Button addButton onClick={addForm} style={{ backgroundColor: "#0C75EB", color: 'white', textTransform: 'capitalize', height: "100%", fontSize: "16px" }}><img src={Dollar} alt='dollar' style={{ height: '22px', width: '22px', marginRight: '5px' }} />Add Expense</Button> :
                                <Button addButtonDisable><img src={Dollar} alt='dollar' style={{ height: '22px', width: '22px', marginRight: '5px' }} />Add Expense</Button>
                        }
                    </Grid>
                </Grid>
                <Grid item lg={11.6} md={11} sm={11} xs={11} pt={4}>
                    <Table
                        rows={clientRows}
                        columns={columns}
                        hidePagination={true}
                        height={460}
                    />
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: '15px' }}>
                        {
                            clientRows.length > 0 &&
                            <Stack spacing={2} >
                                <StyledPagination
                                    count={(clientRows.length > 0 && pagination.totalPages)}
                                    variant="outlined"
                                    shape="rounded"
                                    page={clientRows.length > 0 && parseInt(pagination.currentPage)}
                                    onChange={handleChangePagination}
                                />
                                {/* <Pagination
                                count={parseInt(pagination.totalPages)}
                                variant="outlined"
                                shape="rounded"
                                page={parseInt(pagination.currentPage)}
                                onChange={handleChangePagination}
                                sx={{
                                    '& .MuiButtonBase-root': {
                                        border: "1px solid #F1F1F1 !important",
                                        color: "#333333 !important",
                                        font: "13px Nunito, Nunito Sans, sans-serif !important",
                                        fontWeight: '600 !important'
                                    },
                                    '& .css-19xm0h7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
                                        backgroundColor: '#2F80ED !important',
                                        color: '#FFFFFF !important',
                                        border: "1px solid #2F80ED !important"
                                    }
                                }}
                            /> */}
                            </Stack>
                        }
                    </Box>
                </Grid>
            </Grid>
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

            >
                {
                    drawer === "filter" ? FilterView() : null //When we click on filterlines icon "filter" assigned to drawer SwipableDrawer will open, based on this ternory condition content will display which is available in FilterView()
                }
            </SwipeableDrawer>
        </Grid>
    )
};