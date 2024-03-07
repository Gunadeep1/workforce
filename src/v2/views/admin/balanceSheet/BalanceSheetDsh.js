import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, MenuItem, Menu, Stack, Pagination, Skeleton, CircularProgress } from '@mui/material';
import BalanceSheetStyles from './BalanceSheetStyles';
import Filterlines from '../../../assets/svg/filter-lines.svg';
import Text from '../../../components/customText/Text';
import { getCurrencySymbol } from "../../../utils/utils";
import Avatar from '@mui/material/Avatar';
import CustomPieChart from '../../../components/charts/CustomPieChart';
import AvatarGroup from '@mui/material/AvatarGroup';
import Date from '../../../components/datePicker/Date';
import Button from '../../../components/customButton/Button';
import moment from 'moment';
import { dateFormat } from '../../../utils/utils';
import Badge from '@mui/material/Badge';
import SearchGlobal from '../../../assets/svg/search2.svg';
import TableAccordion from "../../../components/tableAccordion/TableAccordion";
import { useNavigate } from 'react-router-dom';
import BalanceSheetApi from '../../../apis/admin/balanceSheet/BalanceSheetApi';
import EmployeeAPI from '../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg } from '../../../utils/utils';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link } from 'react-router-dom';

export default function BalanceSheetDsh() {
    const classes = BalanceSheetStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [custom, setCustom] = useState(true)
    const open = Boolean(anchorEl);
    const [state, setState] = useState({
        from_date: "",
        to_date: ""
    })
    const [selectedItem, setSelectedItem] = useState(1);
    const [loading, setLoading] = useState(true);
    const [invisible, setInvisible] = React.useState(true);
    const [list, setList] = useState([])
    const [amount, setAmount] = useState([])
    const [avatarList, setAvatarList] = useState([])
    const [searchImg, setSearchImg] = useState(true);
    const [empData, setEmpData] = useState({
        search: "",
        enable_balance_sheet: "true",
    })
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#404040",
            padding: "6px 14px",
            minWidth: 100,
            border: "1px solid #404040"
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: "#404040",
            "&::before": {
                backgroundColor: "#404040",
                border: "1px solid #404040"
            }
        },
    }));

    const StyledPagination = styled(Pagination)({
        "& .MuiPagination-ul li:last-child": {
            marginLeft: "10px",
            '& .MuiButtonBase-root': {
                border: 'none !important'
            },
        },
        "& .MuiPagination-ul li:last-child button::before": {
            content: "'Next'",
            marginRight: "8px",
        },
        "& .MuiPagination-ul li:first-child": {
            marginRight: "10px",
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
    const avatar = {
        limit: 100,
        page: 1,
        search: "",
    }
    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
            getAllEmployees(empData, pagination);
            getAllAvatars(avatar)
            getDashboardData(state)
        }, 300)
        // eslint-disable-next-line
    }, []);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSelect = (e, args) => {
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
            case 3:
                fromDate = moment(moment().subtract(3, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                setInvisible(false)
                break;
            case 4:
                fromDate = moment(moment().subtract(6, 'months').format(dateFormat())).startOf('month').format(dateFormat());
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
        getDashboardData({ from_date: fromDate, to_date: toDate })
        handleClose()
        setSelectedItem(args);
    }
    const dateChange = (e, name) => {
        let date = e.$d
        setState({
            ...state,
            [name]: moment(date).format(dateFormat())
        })
    }
    const handleView = (args) => {
        navigate("/balance-sheet/balance-view", { state: { data: args } })
    }
    const navigate = useNavigate();
    const handleSearch = (e) => {
        const text = e.target.value;
        setEmpData({ ...empData, search: text })
        if (text.length > 0) {
            setSearchImg(false);
        } else {
            setSearchImg(true);
        }
        if (e.target.value.length > 1) {
            setTimeout(() => {
                BalanceSheetApi.getAllEmployees({ ...empData, search: e.target.value }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
                    setList(res.data.data);
                    setPagination(res.data.pagination);
                })
            }, 2000);
        }
    }
    const getAllEmployees = (args, paginationData) => {
        BalanceSheetApi.getAllEmployees(args, paginationData).then((response) => {
            if (response.data.statusCode == 1003) {
                setList(response.data.data)
                setPagination({ ...response.data.pagination })
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }
    const getAllAvatars = (args) => {
        setLoading(true);
        EmployeeAPI.getAllEmployees(args).then((response) => {
            setTimeout(() => {
                setLoading(false);
                if (response.data.statusCode == 1003) {
                    setAvatarList(response.data.data)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 300)
        });
    }
    const handleChangePagination = (e, page) => {
        let paginationData = { ...pagination, currentPage: page };
        setPagination({ ...paginationData });
        getAllEmployees(empData, paginationData);
    }
    const getDashboardData = (state) => {
        setLoading(true);
        BalanceSheetApi.getBalanceAmount(state).then((res) => {
            if (res.data.statusCode == 1003) {
                setTimeout(() => {
                    setLoading(false)
                    setAmount(res.data.data)
                }, 300)
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }
    const maxAvatars = 7;
    const total = avatarList.length; // Your total count
    //    Calculate surplus count
    const surplus = total - maxAvatars;
    const Rows = list.map((data, index) => ({
        id: data.serial_no,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Box sx={{ position: 'relative', display: 'flex' }}>
                    {loading ? <Skeleton animation="wave" width="40px" height='65px' style={{ borderRadius: '50%' }} /> :
                        <>
                            <CircularProgress variant="determinate" value={data.profile_progress} size="3.2rem" thickness={2} sx={{ backgroundColor: "#F2F2F2", color: "green", borderRadius: "100%", }} />
                            <Box
                                sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box sx={{ display: "flex", padding: "3px", borderRadius: "50%", backgroundColor: "#ffffff" }}>
                                    <HtmlTooltip
                                        placement="bottom"
                                        arrow
                                        title={
                                            <React.Fragment>
                                                <Box>
                                                    <Typography className={classes.profileTooltipText}>
                                                        {`Profile Completion - ${data.profile_progress}%`}
                                                    </Typography>
                                                </Box>
                                            </React.Fragment>
                                        }
                                    >
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={data.profile_picture_url}
                                            sx={{ width: 40, height: 40, }}
                                        />
                                    </HtmlTooltip>
                                </Box>
                            </Box>
                        </>
                    }
                </Box>
                <Box ml={2}>
                    <Typography className={classes.mainHead} component={Link}
                        to={`/employees/user-profile/${data.full_name === "" ? "" : data.full_name.trim().split(/ +/).join('-')}`}
                        state={{
                            id: data.id, full_name: data.full_name, e_verify: data.e_verified, reference_id: data.reference_id, avatar_url: data.avatar, enable_login: data.enable_placement
                        }}
                    >{loading ? <Skeleton animation="wave" width="100px" /> : data.full_name}</Typography>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : data.reference_id}</Text>
                </Box>
            </Box>,
            <Box>
                <Text smallBlack className={classes.loaders}>{loading ? <Skeleton animation="wave" width="100px" /> : data.email_id}</Text>
            </Box>,
            <Box>
                <Text smallBlack className={classes.loaders}>{loading ? <Skeleton animation="wave" width="100px" /> : data.employment_type}</Text>
            </Box>,
            <Box>
                <Text smallBlack className={classes.loaders} >{loading ? <Skeleton animation="wave" width="100px" /> : data.sub_status}
                </Text>
            </Box>,
            <Box>
                <Text smallBlue sx={{ textAlign: "center", cursor: "pointer" }} onClick={() => handleView(data)}>View</Text>
            </Box>,
        ],
    }))
    const Columns = [
        { 'name': 'Employee', 'width': '' },
        { 'name': 'Email ID', 'width': '' },
        { 'name': 'Employee Type', 'width': '' },
        { 'name': 'Project status', 'width': '' },
        { 'name': 'Actions', 'width': '' }
    ]
    const closeBtn = () => {
        setSearchImg(true)
        setEmpData({ ...empData, search: "" })
        BalanceSheetApi.getAllEmployees({ ...empData, search: "" }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
            setList(res.data.data);
            setPagination(res.data.pagination);
        })
    }
    return (
        <Grid container component={'main'} className={classes.main} pr={5}>
            <Grid container >
                <Grid item lg={11} md={11} sm={11} xs={11}>
                    <Typography sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                        Balancesheet
                    </Typography>
                </Grid>
                <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                <MenuItem className={selectedItem === 5 ? classes.viewText1 : classes.viewText} onClick={() => setCustom(false)} >Custom</MenuItem> :
                                <Stack ml={1}>
                                    <Grid container lg={12} spacing={1}>
                                        <Grid item lg={6} >
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
                                        <Grid item lg={6} >
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
                                    <Grid container mt={1}>
                                        <Button popupSaveBlue sx={{ width: "335px !important" }} onClick={(e) => handleSelect(e, 5)} >Apply Filter</Button>
                                    </Grid>
                                </Stack>
                            }
                        </Menu>
                    </button>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid item lg={9} md={12} sm={12}>
                    <Box p={2} className={classes.miniCard}>
                        <Grid item container>
                            <Grid item lg={10} md={10} sm={10}>
                                <Grid item lg={12} md={12} sm={12}><Text overViewAmount > Balance Amount </Text></Grid>
                                <Grid item container mt={4}>
                                    <Grid item lg={4} md={4} sm={4}>
                                        <Stack spacing={1} direction="row" >
                                            <Stack>
                                                <Box sx={{ margin: "4px 0px", height: "10px", width: "10px", backgroundColor: "#0C75EB;", borderRadius: "50%" }}></Box>
                                            </Stack>
                                            <Stack sx={{ minWidth: 0 }}>
                                                <Text largeGreyTxt>Total Payroll Amount</Text>
                                                <Text overViewAmount >{loading ? <Skeleton animation="wave" width="150px" /> : amount.total_payroll_amount ? `${getCurrencySymbol()}${" "}${amount.total_payroll_amount}` : "-"}</Text>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={4}>
                                        <Stack spacing={1} direction="row" >
                                            <Stack>
                                                <Box sx={{ margin: "4px 0px", height: "10px", width: "10px", backgroundColor: "#77D2B7;", borderRadius: "50%" }}></Box>
                                            </Stack>
                                            <Stack sx={{ minWidth: 0 }}>
                                                <Text largeGreyTxt>Total Expense</Text>
                                                <Text overViewAmount >{loading ? <Skeleton animation="wave" width="150px" /> : amount.total_expense_amount ? `${getCurrencySymbol()}${" "}${amount.total_expense_amount} ` : "-"}</Text>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={4}>
                                        <Stack spacing={1} direction="row" >
                                            <Stack>
                                                <Box sx={{ margin: "4px 0px", height: "10px", width: "10px", backgroundColor: "#FFB126", borderRadius: "50%" }}></Box>
                                            </Stack>
                                            <Stack sx={{ minWidth: 0 }}>
                                                <Text largeGreyTxt>Total Balance</Text>
                                                <Text overViewAmount >{loading ? <Skeleton animation="wave" width="150px" /> : `${getCurrencySymbol()}${" "}${amount.total_balance} `}</Text>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={2} md={2} sm={2}>
                                <CustomPieChart data={[{ value: amount.total_payroll_amount, color: '#3992F5', label: 'Total Payroll Amount' },
                                { value: amount.total_balance, color: '#FFB126', label: 'Total Balance' },
                                { value: amount.total_expense_amount, color: '#77D2B7', label: 'Total Expense' },]} />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item lg={3} md={12} sm={12}>
                    <Box p={2} className={classes.miniCard}>
                        <Grid item container lg={12} md={12} sm={12} >
                            {loading ? <Skeleton animation="wave" width="70%" height="40px" /> :
                                <>
                                    <AvatarGroup max={maxAvatars} width={"137px"} height={"35px"} display={'flex'} sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { marginX: '-10px' } }} >
                                        {avatarList.slice(0, maxAvatars).map((index, data) =>
                                            <Avatar alt={`Avatar ${data + 1}`} src={index.profile_picture_url} sx={{ width: "35px", height: "35px" }} />)}
                                    </AvatarGroup>
                                    <span style={{ marginTop: "11px", marginLeft: "15px", cursor: "pointer" }} >{surplus > 0 && (
                                        <Text smallBlue onClick={() => navigate("/employees")}>+{surplus} More</Text>
                                    )} </span>
                                </>
                            }
                        </Grid>
                        <Grid item container mt={4}>
                            <Grid item lg={6} md={6} sm={6} sx={{ borderRight: "2px solid #EAECF0" }}>
                                <Grid item lg={12} ><Text largeGreyTxt>Avg. Margin %</Text></Grid>
                                <Grid item lg={12}><Text className={classes.title}>25%</Text></Grid>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} pl={3} >
                                <Grid item lg={12}><Text largeGreyTxt>Margin Amount</Text></Grid>
                                <Grid item lg={12}><Text className={classes.title}>{`${getCurrencySymbol()}${" "}750 `}</Text></Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid container mt={3}>
                <div className={classes.searchField}>
                    <input
                        type="text"
                        value={empData.search}
                        onChange={handleSearch}
                        className={classes.globalSearchInput}
                        placeholder="Search by Emp Name / ID"
                    />
                    <button
                        type="button"
                        className={classes.searchIcon}>
                        {searchImg ? <img src={SearchGlobal} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer", color: "#C7CCD3" }} onClick={closeBtn} />}
                    </button>
                </div>
            </Grid>
            <Grid container mt={3} >
                <Grid item lg={12} md={12} sm={12} sx={{ overflowY: "auto", boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D ", borderTopRightRadius: "16px", borderTopLeftRadius: "16px", height: "65vh" }}>
                    <TableAccordion acc={false} rows={Rows} columns={Columns} />
                </Grid>
            </Grid>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', marginTop: "8px" }}>
                <Stack spacing={2} >
                    <StyledPagination
                        count={parseInt(pagination.totalPages)}
                        variant="outlined"
                        shape="rounded"
                        page={parseInt(pagination.currentPage)}
                        onChange={handleChangePagination}
                    />
                </Stack>
            </Box>
        </Grid>
    )
};