import React, { useState } from 'react';
import { Box, Divider, Stack, Avatar, Skeleton, Grid, Menu, MenuItem, Slide, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '../../../assets/svg/leftArrowN.svg';
import Text from '../../../components/customText/Text';
import ReminderStyles from './ReminderStyles';
import CustomSelect from './BorderlessSelect';
import menu from "../../../assets/client/ActionMenu.svg"
import NotificationData from '../notifications/NotificationData.json';
import NoDataFoundIcon from '../../../assets/svg/NoDataFoundIcon.svg';
import styled from '@emotion/styled';
import Button from '../../../components/customButton/Button';
import ReminderForm from './ReminderForm';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import UsersIcon from '../../../assets/images/UsersIcon.png';
import ReusablePopup from "../../../components/reuablePopup/ReusablePopup";
import ReminderSuccess from '../../../assets/images/ReminderSuccessIcon.png';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "8px",
    },
    "& .MuiDialogContent-root": {
        padding: '0px !important'
    },
    "& .MuiDialogActions-root": {
        padding: '0px !important'
    }
}));


const timesheetData = [
    {
        "slug": "ess",
        "title": "Employee Profile Approval",
        "description": "",
        "description1": "Siva Sai Krishna",
        "description2": "Google",
        "approved_by": "Admin 3",
        "status": 0,
    },
    {
        "slug": "expense",
        "title": "E-Verify",
        "description": "",
        "description1": "Siva Sai Krishna",
        "description2": "Google",
        "approved_by": "Admin 3",
        "status": 1,
    }
]

export default function EmployeeReminders() {

    const classes = ReminderStyles();
    const navigate = useNavigate();
    const [payCycle, setPayCycle] = useState('Pay Cycle');
    const [payPeriod, setPayPeriod] = useState('Pay Period');
    const [dateValue, setDateValue] = useState('All');
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const newOpen = Boolean(anchorEl);
    const open1 = Boolean(anchorEl1);
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);
    const [loading, setloading] = useState(false);
    const [view, setView] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        from_date: '',
        to_date: '',
    })

    const [pagination, setPagination] = useState(
        {
            total: '0',
            currentPage: 1,
            perPage: 5,
            totalPages: 0
        }
    );

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
    const dateValueOptions = [
        {
            value: 'This Month', id: 1,
        },
        {
            value: 'Last Month', id: 2,
        },
        {
            value: 'Last 6 Months', id: 3,
        },
        {
            value: '1 Year', id: 4,
        },
        {
            value: 'Custom', id: 5,
        },
    ];

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);

    };
    const handleClick1 = (e) => {
        setAnchorEl1(e.currentTarget);

    };
    const handleClick2 = (e) => {
        setAnchorEl2(e.currentTarget);

    };
    const handleClick3 = (e) => {
        setAnchorEl3(e.currentTarget);

    }

    const ApplyPaycycleFilter = (value) => {
        setPayCycle(value)
        setAnchorEl1(null);
    }
    const ApplyPayPeriodFilter = (value) => {
        setPayPeriod(value)
        setAnchorEl2(null);
    }
    const ApplyDateValueFilter = (value) => {
        setDateValue(value)
        setAnchorEl3(null);
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleClose1 = () => {
        setAnchorEl1(null);
    }
    const handleClose2 = () => {
        setAnchorEl2(null);
    }
    const handleClose3 = () => {
        setAnchorEl3(null);
    }


    const loadMore = () => {
        setloading(!loading) // remove when api integration
        setPagination();// remove when api integration
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: 1 });
    }

    const handleApproveClose = () => {
        setOpenDialog(false);
    }

    return (
        <Box className={classes.root}>
            <Stack className={classes.mainContainer}>
                <Stack className={classes.header}>

                    <Stack className={classes.leftHeader}>
                        <LeftArrow onClick={() => navigate('/mainDashboard')} className={classes.cursor} />
                        <Text className={classes.header1}>Employee Reminders</Text>
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
                        <CustomSelect
                            value={dateValue}
                            anchorEl={anchorEl3}
                            open={open3}
                            options={dateValueOptions}
                            handleClick={handleClick3}
                            ApplyFilter={ApplyDateValueFilter}
                            handleClose={handleClose3}
                        />
                    </Stack>
                </Stack>


                <Box className={classes.listContianer}>

                    {timesheetData.length !== 0 && !loading ? timesheetData.map((data, index) => (
                        <Grid container className={classes.notificationCard} rowSpacing={{ md: 0, sm: 5, xs: 5 }} key={index}>
                            <Grid item lg={5} md={5} sm={6} xs={12} className={classes.leftContent} container >
                                <Avatar src={UsersIcon} alt='icons' className={classes.avatarSize} />
                                <Stack gap={1}>
                                    <Text className={classes.header2}>{data.title}</Text>
                                    <Text className={classes.header3}>
                                        <span style={{ marginRight: '23px' }}>{data.description1}</span>
                                        {data.description2}
                                    </Text>

                                </Stack>

                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12} container justifyContent={{ lg: 'center', md: 'center', sm: 'start' }} pl={{ lg: 12, sm: 0 }}>
                                <Stack gap={1}>
                                    <Text className={classes.header4}>Approved By</Text>
                                    <Text className={classes.header5}>{data.approved_by}</Text>
                                </Stack>
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12} container justifyContent={{ lg: 'end', md: 'end', sm: 'start' }} pr={{ lg: 0, md: 0, sm: 7, xs: 0 }}>
                                <Stack gap={3} className={classes.leftContent}>
                                    <Button lightblueBtn>{data.status == 0 ? 'Approve' : 'E-Verify'}</Button>

                                    <img src={menu}
                                        className={classes.cursor}
                                        alt='menu'
                                        onClick={(e) => handleClick(e)} />
                                    <Menu
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
                                                transform: 'translateX(-130px) translateY(12px)',
                                            }
                                        }}

                                        MenuListProps={{
                                            style: {
                                                padding: 0,
                                            },
                                        }}

                                    >
                                        <MenuItem className={classes.viewText} onClick={''} >Mark as Completed</MenuItem>
                                        <MenuItem className={classes.viewText} onClick={() => setView('form')}>Remind me Later</MenuItem>
                                        <MenuItem className={classes.viewText} onClick={''}>Mute Reminders</MenuItem>
                                    </Menu>
                                </Stack>
                            </Grid>
                        </Grid>

                    )) : null}

                    {loading && [1, 2].map((index) => (

                        <Grid container className={classes.notificationCard} rowSpacing={{ md: 0, sm: 5, xs: 5 }} key={index}>
                            <Grid item lg={5} md={5} sm={6} xs={12} className={classes.leftContent} container >
                                <Skeleton variant='circular' height={'53px'} width={'53px'} />
                                <Stack gap={1}>
                                    <Skeleton variant='text' width={150} height={16} />
                                    <Skeleton variant='text' width={100} height={14} />
                                </Stack>

                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12} container justifyContent={{ lg: 'center', md: 'center', sm: 'start' }} pl={{ lg: 12, sm: 0 }}>
                                <Stack gap={1} alignItems={'center'} >
                                    <Skeleton variant='text' width={50} height={14} />
                                    <Skeleton variant='text' width={100} height={14} />
                                </Stack>
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12} container justifyContent={{ lg: 'end', md: 'end', sm: 'start' }} pr={{ lg: 0, md: 0, sm: 7, xs: 0 }}>
                                <Stack gap={3} className={classes.leftContent}>
                                    <Skeleton variant='rounded' width={103} height={25} />
                                    <Skeleton variant='text' width={30} height={12} />
                                </Stack>
                            </Grid>
                        </Grid>


                    ))}

                    {
                        NotificationData.length === 0 ?
                            <Box className={classes.NoDataFoundIcon}>
                                <img src={NoDataFoundIcon} alt='No Data Found' />
                                No Data Found
                            </Box>
                            : null
                    }

                    {
                        (
                            !loading && pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                                <Box style={{ textAlign: "center", padding: "10px", }}>
                                    <button
                                        onClick={() => loading ? null : loadMore()}
                                        type="button"
                                        style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                                    >
                                        {loading ? "Loading..." : "Load more"}
                                    </button>
                                </Box>
                                : null : null

                        )
                    }


                </Box>
                <BootstrapDialog
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={view}
                    maxWidth={true}
                >
                    <DialogContent >
                        {/* <ReminderForm setView={setView} /> */}

                        {
                            view === 'form' && <ReminderForm setView={setView} />
                        }

                        {
                            view === 'popup' &&
                            <ReusablePopup iconHide openPopup={view} setOpenPopup={handleApproveClose} white statusWidth >
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: '50px' }}>
                                        <img src={ReminderSuccess} alt='success' />
                                        <Text className={classes.addRemindSuccessText} >Reminder Added Successfully</Text>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexDirection: 'row', paddingBottom: '20px' }}>
                                        <Button className={classes.viewAllBtn} onClick={() => { setView(false) }} >View all Reminders</Button>
                                        <Button className={classes.gotoBtn} onClick={() => { navigate('/mainDashboard'); setOpenDialog(false) }} >Go To Dashboard</Button>
                                    </Box>
                                </Box>
                            </ReusablePopup>
                        }
                    </DialogContent>
                </BootstrapDialog>
                {
                    console.log(openDialog)
                }
            </Stack>
        </Box>
    )
}
