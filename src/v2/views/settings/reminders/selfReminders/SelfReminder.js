import React, { useEffect, useState } from "react";
import { Box, DialogContent, Divider, Slide, Menu, MenuItem, Stack, Tab, Grid } from "@mui/material";
// import Date from '../../../components/datePicker/Date';
import Date from "../../../../components/datePicker/Date";
import SelfReminderStyles from './SelfReminderStyles';
import Text from "../../../../components/customText/Text";
import LeftNavigateArrow from '../../../../assets/svg/LeftNavArrow.svg';
import { TabContext, TabList } from "@mui/lab";
import selfImg from '../../../../assets/svg/SelfImg.svg';
import ThreeDots from '../../../../assets/svg/3Dots.svg';
import Dialog from "@mui/material/Dialog";
import { styled } from '@mui/material/styles';
import CustomSelect from './BorderlessSelect';
import Button from "../../../../components/customButton/Button";
import ReusablePopup from "../../../../components/reuablePopup/ReusablePopup";
import { useNavigate } from "react-router-dom";
import ReminderSuccess from "../../../../assets/svg/reminderSuccess.svg";
import { addErrorMsg, dateFormat } from "../../../../utils/utils";
import ReminderForm from "./ReminderForm";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import moment from "moment";

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
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

function SelfReminder() {
    const classes = SelfReminderStyles();
    const [view, setView] = useState(false);
    const [value, setValue] = useState('1');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [customOpen, setCustomOpen] = useState(false)
    const navigate = useNavigate();
    const [custom, setCustom] = useState(true);
    const [state, setState] = useState({
        from_date: "",
        to_date: ""
    })
    // eslint-disable-next-line
    const [pagination, setPagination] = useState(
        {
            currentPage: "",
            perPage: "",
            total: "",
            totalPages: ""
        }
    );

    const [payCycle, setPayCycle] = useState('Pay Cycle');
    const [payPeriod, setPayPeriod] = useState('Pay Period');
    // const [dateValue, setDateValue] = useState('All');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open1 = Boolean(anchorEl1);
    const open2 = Boolean(anchorEl2);
    const newOpen = Boolean(anchorEl);
    const [timesheetsAnchorEl, setTimesheetsAnchorEl] = useState(null);
    const timesheetOpen = Boolean(timesheetsAnchorEl)// eslint-disable-next-line
    const [filter, setFilter] = useState({
        pay_cycle_Value: 1,
    });

    useEffect(() => {
        getViewAllinfo(filterData);
        // eslint-disable-next-line
    }, []);

    const getViewAllinfo = (filter) => {
        setLoading(true);
        // PayrollApi.getViewAllinfo(filter).then((res) => {
        //     setTimeout(() => {
        //         setLoading(false)
        //         if (res.data.statusCode === 1003) {
        //             setSummaryArray(res.data.data);
        //             setPagination(res.data.pagination)
        //         } else {
        //             setSummaryArray(res.data.data);
        //             addErrorMsg(res.data.message)
        //         }
        //     }, 300)
        // })
    }


    const handleApproveClose = () => {
        setOpenDialog(false);
    }

    const handleSelectCustom = (e, args) => {
        let fromDate = "";
        let toDate = "";
        switch (args) {
            case 1:

                break;

            case 2:
                fromDate = moment(moment().subtract(3, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                handleTimesheetsClose();
                break;
            case 3:
                fromDate = moment(moment().subtract(6, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());

                break;
            case 4:
                fromDate = moment(moment().subtract(12, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                console.log(fromDate, "date")
                toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());

                break;
            case 5:
                fromDate = state.from_date;// eslint-disable-next-line
                toDate = state.to_date
                handleClose()
                setCustom(false)
                break;
            default:
                break;
        }
        // getTimesheets({ from_date: fromDate, to_date: toDate })
        setTimesheetsSelectedItem(args);
        handleTimesheetsClose();
    }






    const dataArray = [
        { title: 'Sales Related (Invoices, Payments, Bills)', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
        { title: 'Documents Related', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
        { title: 'Sales Related (Invoices, Payments, Bills)', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
        { title: 'Category Name', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
    ];
    const dataArray_2 = [
        { title: 'Sales Related (Invoices, Payments, Bills)', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
        { title: 'Category Name', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
        { title: 'Documents Related', desc: 'Description added  ', time: '11:23am', date: '11-sep-23' },
    ]
    const [filterData, setFilterData] = useState({
        limit: 3,
        page: 1,
        // status: status_id
    });
    const [timesheetsSelectedItem, setTimesheetsSelectedItem] = useState(1);
    const payCycleOptions = [
        {
            value: 'Weekly', id: 2,
        },
        {
            value: 'Bi - Weekly', id: 3,
        },
        {
            value: 'Semi - Monthly ', id: 4,
        },
        {
            value: 'Monthly ', id: 5,
        },
        {
            value: 'All', id: 6,
        },
    ];
    const payPeriodOptions = [
        {
            value: '11-12-2024 - 13-01-2024', id: 1,
        },
        {
            value: '11-12-2024 - 13-01-2024', id: 2,
        },
    ];
    const handleTimesheetsClick = (event) => {
        event.preventDefault();
        setTimesheetsAnchorEl(event.currentTarget);
        if (timesheetsAnchorEl) {
            if (!custom) {
                setTimesheetsAnchorEl(null);
            }
        }
    };


    const handleClick1 = (e) => {
        setAnchorEl1(e.currentTarget);
    };

    const handleClick2 = (e) => {
        setAnchorEl2(e.currentTarget);
    };

    const ApplyPaycycleFilter = (value) => {
        setPayCycle(value)
        setAnchorEl1(null);

    }
    const ApplyPayPeriodFilter = (value) => {
        setPayPeriod(value)
        setAnchorEl2(null);
    }

    const handleClose1 = () => {
        setAnchorEl1(null);
    }
    const handleClose2 = () => {
        setAnchorEl2(null);
    }

    const handleTimesheetsClose = () => {
        setTimesheetsAnchorEl(null);
        if (!custom) {
            setTimeout(() => {
                setCustom(true)
            }, 300)
        }

    };
    // eslint-disable-next-line
    const handleSelect = (e) => {
        setFilter({ pay_cycle_Value: [e.target.value] });
    }

    const dateChange = (e, name) => {
        let date = e.$d
        setState({
            ...state,
            [name]: moment(date).format(dateFormat())
        })
    }

    const handleChange = (e, newValue) => {
        setValue(newValue);
    }
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const loadMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 3, page: filterData.page + 1 });
        getViewAllinfo({ ...filterData, limit: filterData.limit + 3, page: 1 });
    }
    return (
        <Box className={classes.root}>
            {openDialog &&
                <ReusablePopup iconHide openPopup={openDialog} setOpenPopup={handleApproveClose} white statusWidth >
                    <Box >
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: '50px' }}>
                            <img src={ReminderSuccess} alt='success' />
                            <Text className={classes.addRemindSuccessText} >Reminder Added Successfully</Text>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexDirection: 'row', paddingBottom: '20px' }}>
                            <Button className={classes.viewAllBtn} onClick={() => { navigate('/expense-management') }} >View all Reminders</Button>
                            <Button className={classes.gotoBtn} onClick={() => { navigate('/expense-management') }} >Go To Dashboard</Button>
                        </Box>
                    </Box>
                </ReusablePopup>
            }
            {
                <BootstrapDialog
                    // keepMounted
                    // aria-labelledby='customizes-dialog-title'
                    // open={openAddReminder}
                    // maxWidth={"md"}
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={view}
                    maxWidth={true}
                >
                    <DialogContent >
                        <ReminderForm setView={setView} />
                    </DialogContent>
                </BootstrapDialog>
            }
            <Stack className={classes.mainContainer}>
                <Stack className={classes.header}>
                    <Stack className={classes.leftHeader}>
                        <img onClick={() => window.history.back()} style={{ cursor: "pointer" }} src={LeftNavigateArrow} alt="LeftNavigateArrow"></img>
                        <Text className={classes.selfReminderText}>Self Reminders</Text>
                    </Stack>
                    <Stack className={classes.rightHeader}>
                        <CustomSelect
                            value={payCycle}
                            anchorEl={anchorEl1}
                            open={open1}
                            options={payCycleOptions}
                            handleClick={handleClick1}
                            ApplyFilter={ApplyPaycycleFilter}
                            handleClose={handleClose1}
                        />
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                        <CustomSelect
                            value={payPeriod}
                            anchorEl={anchorEl2}
                            open={open2}
                            options={payPeriodOptions}
                            handleClick={handleClick2}
                            ApplyFilter={ApplyPayPeriodFilter}
                            handleClose={handleClose2}
                        />
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                        <Box >
                            <button
                                className={classes.selectButtonNew}
                                onClick={(event) => {
                                    if (!timesheetsAnchorEl) {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        handleTimesheetsClick(event);
                                    }
                                }}
                            // onClick={handleClick} 
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <Text largeGrey sx={{ padding: '0px 2px 0px 11px' }}>
                                        {timesheetsSelectedItem === 1
                                            ? "All"
                                            : timesheetsSelectedItem === 2
                                                ? '3 Months'
                                                : timesheetsSelectedItem === 3
                                                    ? '6 Months'
                                                    : timesheetsSelectedItem === 4
                                                        ? '1 Year'
                                                        : timesheetsSelectedItem === 5
                                                            ? 'Custom'
                                                            : ''}
                                    </Text>
                                    <KeyboardArrowDownIcon className={classes.keyIcon} onClick={handleTimesheetsClick} />
                                </Box>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={timesheetsAnchorEl}
                                    open={timesheetOpen}
                                    onClose={handleTimesheetsClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            border: '1px solid #EAECF0 !important',
                                            width: custom ? '150px !important' : '350px !important',
                                            boxShadow: "#0000001F !important",
                                            borderRadius: '8px !important',
                                            padding: '0px 2px 0px 0px !important'
                                        },
                                        '& .MuiList-root': {
                                            padding: '0px !important'
                                        }
                                    }}
                                >

                                    {!custom ? (
                                        <Stack ml={1}>
                                            <Grid container lg={12} spacing={1} sx={{ padding: '0px 5px 10px 5px !important' }}>
                                                <Grid item lg={6} >
                                                    <Box pt={'10px'}>
                                                        <Date
                                                            labelText={<Text largeLabel>From</Text>}
                                                            name="from_date"
                                                            value={state.from_date}
                                                            onChange={(value) => dateChange(value, 'from_date')}
                                                            height="40px"
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6}>
                                                    <Box pt={'10px'}>
                                                        <Date
                                                            labelText={<Text largeLabel>To</Text>}
                                                            name="to_date"
                                                            value={state.to_date}
                                                            minDate={state.from_date !== '' ? state.from_date : ''}
                                                            onChange={(value) => dateChange(value, 'to_date')}
                                                            height="40px"
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Stack display='flex' justifyContent='space-between' direction={'row'} mt={1} sx={{ padding: '0px 5px 10px 5px !important' }}>
                                                <Button blackCancel sx={{ width: "100px !important" }} onClick={(e) => { e.stopPropagation(); handleTimesheetsClose(); }}>cancel </Button>
                                                <Button blueButton sx={{ width: "100px !important", marginRight: '8px' }} onClick={(e) => handleSelectCustom(e, 5)}>Apply </Button>
                                            </Stack>
                                        </Stack>
                                    ) : (

                                        <>

                                            <MenuItem className={timesheetsSelectedItem === 1 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelectCustom(e, 1)}>All</MenuItem>
                                            <MenuItem className={timesheetsSelectedItem === 2 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelectCustom(e, 2)}>Last 3 Months</MenuItem>
                                            <MenuItem className={timesheetsSelectedItem === 3 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelectCustom(e, 3)}>Last 6 Months</MenuItem>
                                            <MenuItem className={timesheetsSelectedItem === 4 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelectCustom(e, 4)}>1 Year</MenuItem>
                                            <MenuItem className={timesheetsSelectedItem === 5 ? classes.viewText1 : classes.viewText} onClick={(e) => { e.stopPropagation(); setCustom(false); }}>Custom</MenuItem>
                                        </>
                                    )}
                                </Menu>
                            </button>
                        </Box>
                    </Stack>
                </Stack>
                <Stack py={4} px={1}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '333px' }}>
                            <TabList onChange={handleChange}>
                                <Tab label={
                                    <Stack direction='row' spacing={2} mx={'10px'}>{'Pending Tasks'}</Stack>
                                }
                                    value='1' className={value == 1 ? classes.activeText : classes.tabText}
                                    style={{ textTransform: 'capitalize' }}
                                />
                                <Tab label={
                                    <Stack direction='row' spacing={2} mx={'10px'}>{'Completed'}</Stack>
                                }
                                    value='2' className={value == 2 ? classes.activeText : classes.tabText}
                                    style={{ textTransform: 'capitalize' }} />
                            </TabList>
                        </Box>
                    </TabContext>
                </Stack>
                {
                    value == "1" ?
                        dataArray.map((data, index) => (
                            <Stack className={classes.notificationCard} key={index} >
                                <Stack className={classes.leftContent}>
                                    <img src={selfImg} alt="img" />
                                    <Stack gap={1}>
                                        <Text className={classes.pendingText1}>{data.title}</Text>
                                        <Text className={classes.descText1}>{data.desc} </Text>
                                    </Stack>
                                </Stack>
                                <Stack className={classes.rightContent}>
                                    <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                                        <Text className={classes.timeText1}>{data.time}am</Text>
                                        <Text className={classes.dateText1}>{data.date}</Text>
                                    </Stack>
                                    <img
                                        src={ThreeDots}
                                        className={classes.cursor}
                                        alt="3Dots"
                                        onClick={(e) => handleClick(e)}
                                    />
                                    <Menu
                                        MenuListProps={{
                                            disablePadding: true,
                                            alignItems: 'left',
                                            padding: 0,
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
                                            },
                                            "&:hover": {
                                                background: 'none !important'
                                            },
                                        }}
                                        PaperProps={{
                                            style: {
                                                transform: 'translateX(-100px) translateY(12px)',
                                            }
                                        }}
                                    >
                                        <MenuItem className={classes.menuItemText1} >Mark as completed</MenuItem>
                                        <MenuItem className={classes.menuItemText1} onClick={() => setView(true)}>Remind me late</MenuItem>
                                        <MenuItem className={classes.menuItemText1} >Mute Reminders</MenuItem>
                                        <MenuItem className={classes.menuItemText2} onClick={() => addErrorMsg("Task Deleted...")}>Delete</MenuItem>
                                    </Menu>
                                </Stack>
                            </Stack>
                        ))
                        :
                        value == "2" &&
                        dataArray_2.map((data, index) => (
                            <Stack className={classes.notificationCard} key={index}>
                                <Stack className={classes.leftContent}>
                                    <img src={selfImg} alt="img" />
                                    <Stack gap={1}>
                                        <Text className={classes.pendingText1}>{data.title}</Text>
                                        <Text className={classes.descText1}>{data.desc}</Text>
                                    </Stack>
                                </Stack>
                                <Stack className={classes.rightContent}>
                                    <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px', marginRight: '124px' }}>
                                        <Text className={classes.timeText1}>{data.time}am</Text>
                                        <Text className={classes.dateText1}>{data.date}</Text>
                                    </Stack>
                                </Stack>
                            </Stack>
                        ))
                }
                {
                    !loading &&
                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                        <Stack className={classes.loadMoreDiv}>
                            <Box style={{ textAlign: "center", padding: "10px", }}>
                                <button
                                    onClick={() => loading ? null : loadMore()}
                                    type="button"
                                    style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                                >
                                    {loading ? "Loading..." : "Load more"}
                                </button>
                            </Box>
                        </Stack> : null : null
                }
            </Stack>

        </Box>
    )
}

export default SelfReminder;

