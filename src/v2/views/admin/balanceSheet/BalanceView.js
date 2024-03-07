import React, { useEffect, useState, Fragment } from 'react'
import { Grid, Breadcrumbs, Tab, Box, Stack, MenuItem, Menu, Divider, TableRow, TableCell, Skeleton, Pagination } from '@mui/material'
import BalanceSheetStyles from './BalanceSheetStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import Text from '../../../components/customText/Text';
import { TabContext, TabList } from '@mui/lab';
import Search from '../../../assets/svg/search1.svg';
import Button from '../../../components/customButton/Button';
import Date from '../../../components/datePicker/Date';
import Filterlines from '../../../assets/svg/filter-lines.svg';
import moment from 'moment';
import { dateFormat } from '../../../utils/utils';
import { getCurrencySymbol } from "../../../utils/utils";
import Avatar from '@mui/material/Avatar';
import TableAccordion from "../../../components/tableAccordion/TableAccordion";
import BalanceSheetApi from '../../../apis/admin/balanceSheet/BalanceSheetApi';
import Badge from '@mui/material/Badge';
import { addErrorMsg } from '../../../utils/utils';
import PayrollSummary from './PayrollSummary';
import ExpenseSummary from './ExpenseSummary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { styled } from '@mui/system';

function BalanceView() {
    const classes = BalanceSheetStyles();

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

    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );

    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState('payroll_summary');
    const [anchorEl, setAnchorEl] = useState(null);
    const [custom, setCustom] = useState(true)
    const open = Boolean(anchorEl);
    const [selectedItem, setSelectedItem] = useState(1);
    const [loading, setLoading] = useState(true);
    const [viewIndex, setViewIndex] = useState([])
    const [viewIndex1, setViewIndex1] = useState([])
    const [payList, setPayList] = useState([])
    const [expenseList, setExpenseList] = useState([])
    const [invisible, setInvisible] = React.useState(true);
    const [invisible1, setInvisible1] = React.useState(true);
    const [searchImg, setSearchImg] = useState(true);
    const empData = location && location.state && location.state.data;
    const ExpenseTypeList = require('../../../utils/jsons/ExpenseAmount.json');
    // eslint-disable-next-line
    const [filter, setFilter] = useState({
        employee_id: empData.id,
        from_date: '',
        to_date: '',
    })
    useEffect(() => {
        balanceSheetApi(state)
        balanceSheetApi1(state1)
        listingApi(filter, pagination);
        listingApi1(ExpPag)
        // eslint-disable-next-line
    }, []);
    const [state, setState] = useState({
        employee_id: empData.id,
        financial_summary: "payroll_summary",
        from_date: "",
        to_date: ""
    })
    const [state1, setState1] = useState({
        employee_id: empData.id,
        financial_summary: "expense_summary",
        expense_transaction_type: 2,
        from_date: "",
        to_date: "",
        search: "",
        balance_sheet: true,
    })

    const [ExpPag, setExpPag] = useState({
        employee_id: empData.id,
        financial_summary: "expense_summary",
        expense_transaction_type: [2],
        from_date: "",
        to_date: "",
        search: "",
        balance_sheet: true,
        currentPage: 1,
        perPage: 5,
        total: "",
        totalPages: ""
    })

    const handleChangePagination = (e, page) => {
        if (value == 'payroll_summary') {
            pagination['currentPage'] = page
            setPagination(pagination);
            listingApi(filter, pagination);
        } else if (value == 'expense_summary') {
            ExpPag['currentPage'] = page
            setExpPag(ExpPag);
            listingApi1(ExpPag)
        }
    }
    const dateChange = (e, name) => {
        let date = e.$d
        setState({
            ...state,
            [name]: moment(date).format(dateFormat())
        })
    }
    const dateChange1 = (e, name) => {
        let date = e.$d
        setState1({
            ...state1,
            [name]: moment(date).format(dateFormat())
        })
    }
    const handleSearch = (e) => {
        const text = e.target.value;
        setState1({ ...state1, search: text })
        if (text.length > 0) {
            setSearchImg(false);
        } else {
            setSearchImg(true);
        }
        if (e.target.value.length > 1) {
            setTimeout(() => {
                BalanceSheetApi.getExpenseListing({ ...state1, search: e.target.value }).then((res) => {
                    setExpenseList(res.data.data);
                })
            }, 2000);
        }
    }
    const handleSelect = (e, args) => {
        if (value == 'payroll_summary') {
            let fromDate = "";
            let toDate = "";
            switch (args) {
                case 1:
                    setInvisible(true)
                    break;
                case 2:
                    fromDate = moment().startOf('month').format(dateFormat());
                    toDate = moment().format(dateFormat());
                    setInvisible(false)
                    break;
                case 4:
                    fromDate = moment(moment().subtract(6, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                    toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                    setInvisible(false)
                    break;
                case 3:
                    fromDate = moment(moment().subtract(3, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                    toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                    setInvisible(false)
                    break;
                case 5:
                    fromDate = state.from_date
                    toDate = state.to_date
                    setInvisible(false)
                    setCustom(true)
                    break;
                default:
                    break;
            }
            handleClose()
            setSelectedItem(args);
            balanceSheetApi({ employee_id: empData.id, financial_summary: 'payroll_summary', from_date: fromDate, to_date: toDate })
            setFilter({ ...filter, employee_id: empData.id, from_date: fromDate, to_date: toDate })
            listingApi(filter, pagination)
        } else {
            let fromDate = "";
            let toDate = "";
            switch (args) {
                case 1:
                    setInvisible1(true)
                    break;
                case 2:
                    fromDate = moment().startOf('month').format(dateFormat());
                    toDate = moment().format(dateFormat());
                    setInvisible1(false)
                    break;
                case 3:
                    fromDate = moment(moment().subtract(3, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                    toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                    setInvisible1(false)
                    break;
                case 4:
                    fromDate = moment(moment().subtract(6, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                    toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                    setInvisible1(false)
                    break;
                case 5:
                    fromDate = state1.from_date
                    toDate = state1.to_date
                    setInvisible1(false)
                    setCustom(true)
                    break;
                default:
                    break;
            }
            handleClose()
            setSelectedItem(args);
            balanceSheetApi1({
                employee_id: empData.id,
                financial_summary: "expense_summary",
                expense_transaction_type: 2,
                from_date: fromDate,
                to_date: toDate
            })
            setExpPag({ ...ExpPag, from_date: fromDate, to_date: toDate, financial_summary: "expense_summary" })
            listingApi1(ExpPag);
        }
    }
    const handleClick = (event) => {
        if (event.target != event.currentTarget) {
            event.stopPropagation();
        }
        setAnchorEl(event.currentTarget);
    };
    const handleDrop = (event) => {
        setState1({ ...state1, expense_transaction_type: [event.target.value] })
        balanceSheetApi1({
            employee_id: empData.id,
            financial_summary: "expense_summary",
            expense_transaction_type: [event.target.value],
            from_date: "",
            to_date: "",
        })
        setExpPag({ ...ExpPag, expense_transaction_type: [event.target.value], financial_summary: "expense_summary", balance_sheet: true })
        listingApi1(ExpPag);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const balanceSheetApi = (state) => {
        BalanceSheetApi.getPayrollCardIndex(state).then((res) => {
            if (res.data.statusCode == 1003) {
                setViewIndex(res.data.data)
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }
    const balanceSheetApi1 = (state1) => {
        BalanceSheetApi.getExpenseCardIndex(state1).then((res) => {
            if (res.data.statusCode == 1003) {
                setViewIndex1(res.data.data)
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }
    const stepper = (event, newValue) => {
        setValue(newValue)
        if (value == "payroll_summary") {
            balanceSheetApi(state)
        } else if (value == "expense_summary") {
            balanceSheetApi1(state1)
        }
    }
    const listingApi = (data, pagination) => {
        setLoading(true);
        BalanceSheetApi.getPayrollListing(data, pagination).then((res) => {
            setTimeout(() => {
                setLoading(false);
                if (res.data.statusCode == 1003) {
                    setPayList(res.data.payroll);
                    setPagination(res.data.pagination)
                } else {
                    addErrorMsg(res.data.message);
                }
            }, 400)

        })
    }
    const listingApi1 = (args) => {
        BalanceSheetApi.getExpenseListing(args).then((res) => {
            if (res.data.statusCode == 1003) {
                setExpenseList(res.data.data);
                ExpPag['currentPage'] = res.data.pagination.currentPage
                ExpPag['perPage'] = res.data.pagination.perPage
                ExpPag['total'] = res.data.pagination.total
                ExpPag['totalPages'] = res.data.pagination.totalPages
                setExpPag(ExpPag)
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }
    const currencySymbol = getCurrencySymbol()
    const Rows = payList.map((data, index) => ({
        // {data.placement_information.length==0&&setAccordion(false)},
        id: data.employee_id,
        main_row_data: [
            <Box>
                <Text smallBlack >{data.period}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.pay_date}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.amount_paid == null ? currencySymbol + " " + 0 : currencySymbol + " " + data.amount_paid}
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{currencySymbol + " " + data.deduction}
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{currencySymbol + " " + data.reimbursement}
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{currencySymbol + " " + data.balance_amount}
                </Text>
            </Box>,
        ],

        sub_row_content: [
            <>
                {data.placement_information.map((data1, index) => (
                    <>
                        <Box container lg={12} sx={{
                            width: '100%', backgroundColor: '#f1f8ff', borderTopLeftRadius: index == 0 ? "16px" : "", borderTopRightRadius: index == 0 ? "16px" : "", borderBottomLeftRadius: index == data.placement_information.length - 1 ? "16px" : "",
                            borderBottomRightRadius: index == data.placement_information.length - 1 ? "16px" : "", display: 'flex', alignItems: 'center'
                        }}>
                            <>
                                <Box width={'230px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Avatar alt='Jacob James' sx={{ width: '40px', height: "40px" }} />
                                    <Box ml={2}>
                                        <Text boldBlackfont16 sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", textAlign: "center !important", }} > {data1.client_name}</Text>
                                        <Text smallBlack sx={{ color: '#737373 !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important", }} nowrap> {data1.id}</Text>
                                    </Box>
                                </Box>
                                <Box width="677px" >
                                    {data1.payroll_information.map((data2, index) => (
                                        <>
                                            <Box width={'677px'} height={'72px'} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
                                                <Box width={'100%'}>
                                                    <Text className={classes.text1}>
                                                        Hours
                                                    </Text>
                                                    <Text my={1} className={classes.text2}>
                                                        {data2.hours}Hrs
                                                    </Text>
                                                </Box>
                                                <Box width={'100%'}>
                                                    <Text className={classes.text1}>
                                                        Bill Rate
                                                    </Text>
                                                    <Text my={1} className={classes.text2}>
                                                        {currencySymbol + " " + data2.bill_rate}
                                                    </Text>
                                                </Box>
                                                <Box width={'100%'}>
                                                    <Text className={classes.text1}>
                                                        Payrate
                                                    </Text>
                                                    <Text my={1} className={classes.text2}>
                                                        {currencySymbol + " " + data2.pay_rate}
                                                    </Text>
                                                </Box>
                                                <Box width={'100%'}>
                                                    <Text className={classes.text1}>
                                                        Earnings
                                                    </Text>
                                                    <Text my={1} className={classes.text2}>
                                                        {currencySymbol + " " + data2.amount_payable}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </>
                                    ))}
                                </Box>
                            </>
                        </Box>
                        {data.placement_information.length - 1 != index &&
                            <Grid container display={"flex"} justifyContent={"center"} sx={{ backgroundColor: "#f1f8ff" }}><Divider sx={{ border: "1px solid #E4F1FF", width: "98%" }} /></Grid>
                        }
                    </>
                ))}
            </>
        ],

    }))
    const Columns = [
        { 'name': 'Pay Period', 'width': '' },
        { 'name': 'Pay Date', 'width': '' },
        { 'name': 'Amount Paid', 'width': '' },
        { 'name': 'Deduction', 'width': '' },
        { 'name': 'Reimbursement', 'width': '' },
        { 'name': 'Balance', 'width': '' }
    ]
    const Rows1 = expenseList.map((data, index) => ({
        id: 2,
        main_row_data: [
            <Box>
                <Text smallBlack >{data.raised_date}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.reference_id}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{currencySymbol + " " + data.amount}
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{currencySymbol + " " + data.due_amount}
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.expense_type}
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.status == 0 ? "Drafted" : data.status == 1 ? "Submitted" : data.status == 2 ? "Partially Approved" : data.status == 3 ? "Approved" : data.status == 4 ? "Rejected" : "--"}
                </Text>
            </Box>]
    }))
    const TableRowSkeletonLoader = ({ rowsNum }) => {
        return [...Array(rowsNum)].map((row, index) => (
            <Box key={index} sx={{ width: "100%", display: "flex", alignItems: "center", borderRight: "1px solid rgba(226, 229, 230, 1)" }}>
                <TableRow key={index}>
                    <TableCell component="th" scope="row">
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "13rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "13rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "13rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "13rem" }} />
                    </TableCell>
                </TableRow>
            </Box>
        ));
    };
    const Columns1 = [
        { 'name': 'Date', 'width': '' },
        { 'name': 'Expense ID', 'width': '' },
        { 'name': 'Amount', 'width': '' },
        { 'name': 'Due', 'width': '' },
        { 'name': 'Type', 'width': '' },
        { 'name': 'Status', 'width': '' }
    ]
    const closeBtn = () => {
        setSearchImg(true)
        setState1({ ...state1, search: "" })
        BalanceSheetApi.getExpenseListing({ ...state1, search: "" }).then((res) => {
            setExpenseList(res.data.data);
        })
    }

    return (
        <Grid container component={'main'} className={classes.main}>
            <Grid container>
                <Breadcrumbs aria-label="breadcrumb">
                    <Text sx={{ cursor: "pointer" }} onClick={() => { navigate('/balance-sheet'); }} className={classes.breadcrumbsLink}>Balancesheet</Text>
                    <Text className={classes.breadcrumbsName}>{value == "payroll_summary" ? "Employee Payroll Summary" : "Employee Expense Summary"}</Text>
                </Breadcrumbs>
            </Grid>
            <Grid container lg={12} md={12} sm={12} display={"flex"} justifyContent={"center"} mt={3} >
                <Grid item container width={{ lg: "70%" }} >
                    <Grid item lg={8} md={8} sm={7}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: { lg: "61%", md: "61%" } }}>
                                <TabList onChange={stepper} >
                                    <Tab label='Payroll Summary ' value="payroll_summary" className={value == 'payroll_summary' ? classes.activeText : classes.tabText} />
                                    <Tab label='Expense Summary ' value="expense_summary" className={value == 'expense_summary' ? classes.activeText : classes.tabText} />
                                </TabList>
                            </Box>
                        </TabContext>
                    </Grid>
                    <Grid item lg={1} md={1} sm={1} display={"flex"} justifyContent={"center"}>
                        {value == "payroll_summary" ?
                            <button
                                type="button"
                                style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}>
                                <Badge color="warning" variant="dot" invisible={invisible}><img src={Filterlines} alt="Userplus" onClick={handleClick} /></Badge>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            border: '1px solid #EAECF0 !important',
                                            width: custom ? '150px !important' : '350px !important',
                                            boxShadow: "#0000001F !important",
                                            borderRadius: '8px !important',
                                            padding: '0px 2px 0px 0px !important'
                                        },
                                    }}>
                                    <MenuItem className={selectedItem === 1 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 1)} >All</MenuItem>
                                    <MenuItem className={selectedItem === 2 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 2)}>This Month</MenuItem>
                                    <MenuItem className={selectedItem === 3 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 3)}>Last 3 Months</MenuItem>
                                    <MenuItem className={selectedItem === 4 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 4)}>Last 6 Months</MenuItem>
                                    {custom ?
                                        <MenuItem className={selectedItem === 5 ? classes.viewText1 : classes.viewText} onClick={() => setCustom(false)}>Custom</MenuItem> :
                                        <Stack ml={1}>
                                            <Grid container lg={12} md={12} sm={12} spacing={1}>
                                                <Grid item lg={6} md={6} sm={6}>
                                                    <Box pt={'10px'}>
                                                        <Date
                                                            labelText={<Text largeLabel>From</Text>}
                                                            name='from_date'
                                                            value={state.from_date}
                                                            onChange={(value => dateChange(value, 'from_date'))}
                                                            height='40px'
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6}>
                                                    <Box pt={'10px'}>
                                                        <Date
                                                            labelText={<Text largeLabel>To</Text>}
                                                            name='to_date'
                                                            value={state.to_date}
                                                            onChange={(value => dateChange(value, 'to_date'))}
                                                            height='40px'
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container mt={1} >
                                                <Button popupSaveBlue sx={{ width: "335px !important" }} onClick={(e) => handleSelect(e, 5)} >Apply Filter</Button>
                                            </Grid>
                                        </Stack>
                                    }
                                </Menu>
                            </button>
                            :
                            <button
                                type="button"
                                style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}>
                                <Badge color="warning" variant="dot" invisible={invisible1}><img src={Filterlines} alt="Userplus" onClick={handleClick} /></Badge>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            border: '1px solid #EAECF0 !important',
                                            width: custom ? '150px !important' : '350px !important',
                                            boxShadow: "#0000001F !important",
                                            borderRadius: '8px !important',
                                            padding: '0px 2px 0px 0px !important'
                                        },
                                    }}>
                                    <MenuItem className={selectedItem === 1 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 1)} >All</MenuItem>
                                    <MenuItem className={selectedItem === 2 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 2)}>This Month</MenuItem>
                                    <MenuItem className={selectedItem === 3 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 3)}>Last 3 Months</MenuItem>
                                    <MenuItem className={selectedItem === 4 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 4)}>Last 6 Months</MenuItem>
                                    {custom ?
                                        <MenuItem className={selectedItem === 5 ? classes.viewText1 : classes.viewText} onClick={() => setCustom(false)}>Custom</MenuItem> :
                                        <Stack ml={1}>
                                            <Grid container lg={12} md={12} sm={12} spacing={1}>
                                                <Grid item lg={6} md={6} sm={6}>
                                                    <Box pt={'10px'}>
                                                        <Date
                                                            labelText={<Text largeLabel>From</Text>}
                                                            name='from_date'
                                                            value={state1.from_date}
                                                            onChange={(value => dateChange1(value, 'from_date'))}
                                                            height='40px'
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6}>
                                                    <Box pt={'10px'}>
                                                        <Date
                                                            labelText={<Text largeLabel>To</Text>}
                                                            name='to_date'
                                                            value={state1.to_date}
                                                            onChange={(value => dateChange1(value, 'to_date'))}
                                                            height='40px'
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container mt={1} >
                                                <Button popupSaveBlue sx={{ width: "335px !important" }} onClick={(e) => handleSelect(e, 5)} >Apply Filter</Button>
                                            </Grid>
                                        </Stack>
                                    }
                                </Menu>
                            </button>
                        }
                    </Grid>
                    <Grid item lg={3} md={3} sm={4}>
                        <div className={classes.searchField}>
                            <input
                                type="text"
                                value={state1.search}
                                onChange={handleSearch}
                                className={classes.globalSearchInput}
                                placeholder="Search"
                            />
                            <button
                                type="button"
                                className={classes.searchIcon}
                            >
                                {searchImg ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={closeBtn} />}
                            </button>
                        </div>
                    </Grid>
                    {value == "payroll_summary" ?
                        <>
                            {viewIndex.map((data, index) => (
                                <>
                                    <PayrollSummary data={data} img={empData.avatar} loading={loading} />
                                    <Grid item container mt={3}>
                                        <Grid item lg={12} md={12} sm={12} sx={{ height: "300px", overflowY: 'auto', boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D ", borderRadius: "16px" }}>
                                            {
                                                loading ? <TableRowSkeletonLoader rowsNum={10} /> :
                                                    <Fragment>
                                                        <TableAccordion acc={true} rows={Rows} columns={Columns} />
                                                    </Fragment>
                                            }
                                        </Grid>
                                    </Grid>
                                    {
                                        payList.length > 0 &&
                                        <Grid container lg={12} justifyContent='end' pt={2}>
                                            <StyledPagination
                                                count={payList.length > 0 && pagination && parseInt(pagination.totalPages)}
                                                variant="outlined"
                                                shape="rounded"
                                                page={payList.length > 0 && pagination && parseInt(pagination.currentPage)}
                                                onChange={handleChangePagination}
                                            />
                                        </Grid>
                                    }
                                </>
                            ))}
                        </>
                        :
                        <>
                            {viewIndex1.map((data, index) => (
                                <>
                                    <ExpenseSummary data={data} img={empData.avatar} state={state1} onChange={(e) => handleDrop(e)} options={ExpenseTypeList} />
                                    <Grid item container mt={3}>
                                        <Grid item lg={12} md={12} sm={12} sx={{ height: "300px", overflowY: 'auto', boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                                            <TableAccordion acc={false} rows={Rows1} columns={Columns1} />
                                        </Grid>
                                    </Grid>
                                    {
                                        expenseList.length > 0 &&
                                        <Grid container lg={12} justifyContent='end' pt={2}>
                                            <StyledPagination
                                                count={expenseList.length > 0 && parseInt(ExpPag.totalPages)}
                                                variant="outlined"
                                                shape="rounded"
                                                page={expenseList.length > 0 && parseInt(ExpPag.totalPages)}
                                                onChange={handleChangePagination}
                                            />
                                        </Grid>
                                    }
                                </>
                            ))}
                        </>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}
export default BalanceView
