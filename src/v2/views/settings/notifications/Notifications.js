import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Menu, MenuItem, Divider, Autocomplete, TextField, Avatar, Skeleton } from '@mui/material';
import NotificationsStyles from './NotificationsStyles';
import Text from '../../../components/customText/Text';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReactComponent as LeftArrow } from '../../../assets/svg/leftArrowN.svg';
import letfBtnN from "../../../assets/svg/letfBtnN.svg"
import rightBtnN from "../../../assets/svg/rightBtnN.svg";
import dateleftarrow from '../../../assets/svg/dateleftarrow.svg';
import daterightarrow from '../../../assets/svg/daterightarrow.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '../../../components/customButton/Button';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import { dateFormat } from "../../../utils/utils";
import InvoiceImg from '../../../assets/svg/invoiceNF.svg';
import ClientImg from '../../../assets/svg/clientNF.svg';
import DocumentImg from '../../../assets/svg/documentNF.svg';
import TimesheetImg from '../../../assets/svg/timesheetNF.svg';
//import PayrollImg from '../../../assets/svg/payrollNF.svg';
//import ESSImg from '../../../assets/svg/essNF.svg';
import ExpenseImg from '../../../assets/svg/expenseNF.svg';
import NoDataFoundIcon from '../../../assets/svg/NoDataFoundIcon.svg';
//import NotificationData from './NotificationData.json';
import CommonApi from '../../../apis/CommonApi';



// Extend dayjs with the isoWeek plugin to handle weeks correctly
dayjs.extend(isoWeek);

export default function Notifications() {

    const moduleIcons = { 'invoice-approval-notification': InvoiceImg, 'placement-expiry-notification': ClientImg, 'drafted-timesheet-notification': TimesheetImg, 'timesheet-approval-notification': TimesheetImg, 'new-invoice-notification': InvoiceImg, 'new-bills-notification': InvoiceImg, 'birthdays-notification': ExpenseImg, 'consultant-invitation-notification': DocumentImg, 'drafted-invoice-notification': InvoiceImg };

    const navigate = useNavigate();
    const classes = NotificationsStyles();
    const [value, setValue] = useState(dayjs());
    const [loading, setloading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [NotificationData, setNotificationData] = useState([]);
    const [open, setOpen] = useState(false);
    const [views, setViews] = useState('day');
    var startOfMonth = value.startOf('month').format(dateFormat());
    var endOfMonth = value.endOf('month').format(dateFormat());
    const [selectedDates, setSelectedDates] = useState([]);
    const day = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [selectedMonth, setSelectedMonth] = useState(months[dayjs().month()]);
    const currentYear = value.format('YYYY');
    const [selectedYear, setSelectedYear] = useState(value.format('YYYY'));
    const years = Array.from({ length: currentYear - 2021 }, (_, i) => i + 2022).reverse();
    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        from_date: value.startOf('month').format(dateFormat()),
        to_date: value.endOf('month').format(dateFormat()),
    })

    const [pagination, setPagination] = useState(
        {
            total: '20',
            currentPage: 1,
            perPage: 5,
            totalPages: 20
        }
    );

    useEffect(() => {
        getNotificationList({ ...filterData, limit: filterData.limit, page: 1, })
        // eslint-disable-next-line  
    }, [])

    const getNotificationList = (data) => {
        setloading(true);
        CommonApi.getAllNotifications(data).then((res) => {
            if (res.data.statusCode == 1003) {
                setNotificationData(res.data.data);
                setPagination(res.data.pagination);
                setloading(false);
            } if (res.data.data.length > 0) {
                setPagination(res.data.pagination);
            }
        })
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);

    };

    const loadeMore = () => {
        filterData.limit += 4
        setFilterData({ ...filterData, page: 1 });
        getNotificationList(filterData)
    }

    const handleView = (viewValue) => {
        var dropView = viewValue;
        if (dropView !== views) {
            setViews(dropView);
        }
        setSelectedDates([]);
    }

    const handleClose = () => {
        // setOpen(false);
        // setAnchorEl(null);
    }

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    }
    const handleYearChangeAdd = (change) => {
        setSelectedYear(Number(selectedYear) + change);
    }
    const handleYearChangesub = (change) => {
        setSelectedYear(Number(selectedYear) - change);
    }

    const addFilter = () => {

        if (selectedDates.length === 0) {
            let newValue = dayjs().set('month', months.indexOf(selectedMonth)).set('year', Number(selectedYear));
            startOfMonth = newValue.startOf('month').format(dateFormat());
            endOfMonth = newValue.endOf('month').format(dateFormat());
            setValue(newValue);
            filterData.from_date = startOfMonth
            filterData.to_date = endOfMonth
            setFilterData({ ...filterData });
            getNotificationList(filterData)
        } else if (selectedDates.length > 1) {
            let minDate = dayjs(Math.min(...selectedDates.map(date => dayjs(date))));
            let maxDate = dayjs(Math.max(...selectedDates.map(date => dayjs(date))));
            let newValue = dayjs().set('month', months.indexOf(selectedMonth)).set('year', Number(selectedYear));
            startOfMonth = minDate.format(dateFormat());
            endOfMonth = maxDate.format(dateFormat());
            setValue(newValue);
            filterData.from_date = startOfMonth
            filterData.to_date = endOfMonth
            setFilterData({ ...filterData });
            getNotificationList(filterData)

        } else {
            let singleDate = dayjs(selectedDates[0]);
            let newValue = singleDate.set('month', months.indexOf(selectedMonth)).set('year', Number(selectedYear));
            startOfMonth = newValue.format(dateFormat());
            endOfMonth = newValue.format(dateFormat());
            setValue(newValue);
            filterData.from_date = startOfMonth
            filterData.to_date = endOfMonth
            setFilterData({ ...filterData });
            getNotificationList(filterData)
        }
        setOpen(false);
        setAnchorEl(null);
    }

    const removeFilter = () => {
        setOpen(false);
        setAnchorEl(null);
    }


    // Generate the days for the calendar view
    let days = [];
    let values_start = dayjs().set('month', months.indexOf(selectedMonth)).set('year', selectedYear);
    let day_of = values_start.startOf('month').startOf('isoWeek');
    while (day_of.isBefore(values_start.endOf('month').endOf('isoWeek'))) {
        days.push(day_of);
        day_of = day_of.add(1, 'day');
    }

    const subMonth = () => {
        var date = value.subtract(1, 'month');
        setValue(date);
        startOfMonth = date.startOf('month').format(dateFormat());
        endOfMonth = date.endOf('month').format(dateFormat());
        setSelectedYear(date.format('YYYY'));
        filterData.from_date = startOfMonth;
        filterData.to_date = endOfMonth;
        setFilterData({ ...filterData })
        getNotificationList(filterData)
    }



    function toggleSelection(day, isSelected) {
        const formattedDay = day.format('YYYY-MM-DD');
        let newDates = [...selectedDates, formattedDay];


        if (isSelected) {
            newDates = (selectedDates.filter(date => date !== day.format('YYYY-MM-DD')));
        } else {
            newDates = [...selectedDates, formattedDay];
        }

        let minDate = new Date(Math.min.apply(null, newDates.map(e => new Date(e))));
        let maxDate = new Date(Math.max.apply(null, newDates.map(e => new Date(e))));

        let allDates = [];
        for (let dt = new Date(minDate); dt <= maxDate; dt.setDate(dt.getDate() + 1)) {
            allDates.push(new Date(dt).toISOString().split('T')[0]);
        }

        setSelectedDates(allDates);
    }

    const addMonth = () => {
        var date = value.add(1, 'month');
        setValue(date);
        startOfMonth = date.startOf('month').format(dateFormat());
        endOfMonth = date.endOf('month').format(dateFormat());
        setSelectedYear(date.format('YYYY'));
        filterData.from_date = startOfMonth;
        filterData.to_date = endOfMonth;
        setFilterData({ ...filterData })
        getNotificationList(filterData)
    }

    return (
        <Box className={classes.root}>
            <Stack className={classes.mainContainer}>
                <Stack className={classes.header}>
                    <Stack className={classes.leftHeader}>
                        <LeftArrow onClick={() => navigate('/mainDashboard')} className={classes.cursor} />
                        <Text className={classes.header1}>All Notifications</Text>
                    </Stack>
                    <Stack className={classes.rightHeader}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box className={classes.calendarBox}>
                                <img onClick={() => { subMonth() }} src={letfBtnN} className={classes.cursor} alt="left navigate" />
                                <Text onClick={handleClick} className={classes.header10}>{value.format('MMMM YYYY')}</Text>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    keepMounted
                                    onClose={handleClose}
                                    style={{ left: "-52px", top: '20px' }}

                                >

                                    <MenuItem
                                        disableRipple={true}
                                        sx={{ backgroundColor: 'transparent !important' }}>

                                        <Box height={'auto'} width={'300px'} padding={'10px'} sx={{ background: '#FFFFFF' }}>
                                            <Box display={'flex'} height={'10px'} mr={'20px'} ml={'20px'} mt={'10px'} justifyContent={'space-between'}>

                                                <Text onClick={() => handleView('day')} sx={{
                                                    fontSize: '14px !important',
                                                    cursor: 'pointer',
                                                    fontWeight: views === 'day' ? '600 !important' : '500 !important',
                                                    color: views === 'day' ? '#0C75EB  !important' : '#8F95B2 !important',
                                                    borderBottom: views === 'day' ? '1.5px solid currentColor' : 'none',
                                                    paddingBottom: views === 'day' ? '16px' : '0',
                                                }} smallBlack>
                                                    Day
                                                </Text>
                                                <Text onClick={() => handleView('week')} sx={{
                                                    fontSize: '14px !important',
                                                    cursor: 'pointer',
                                                    fontWeight: views === 'week' ? '600 !important' : '500 !important',
                                                    color: views === 'week' ? '#0C75EB  !important' : '#8F95B2 !important',
                                                    borderBottom: views === 'week' ? '1.5px solid currentColor' : 'none',
                                                    paddingBottom: views === 'week' ? '16px' : '0',
                                                }} smallBlack>
                                                    Week
                                                </Text>
                                                <Text onClick={() => handleView('year')} sx={{
                                                    fontSize: '14px !important',
                                                    cursor: 'pointer',
                                                    fontWeight: views === 'year' ? '600 !important' : '500 !important',
                                                    color: views === 'year' ? '#0C75EB  !important' : '#8F95B2 !important',
                                                    borderBottom: views === 'year' ? '1.5px solid currentColor' : 'none',
                                                    paddingBottom: views === 'year' ? '16px' : '0',
                                                }} smallBlack>
                                                    Month
                                                </Text>
                                            </Box>
                                            <Divider
                                                sx={{ mr: '20px', ml: '20px', mt: '15px' }}
                                            ></Divider>
                                            <Box sx={{
                                                mt: '10px',
                                                padding: '5px',
                                                display: 'grid',
                                                gridTemplateColumns: views === 'year' ? '' : 'repeat(7, 1fr)'
                                            }}>

                                                {((views === 'day') || (views === 'week')) && day.map((weekday, index) => (
                                                    <Box key={index} sx={{
                                                        textAlign: 'center',
                                                        color: "#8F95B2",
                                                    }}>
                                                        <Text sx={{ padding: '5px', fontWeight: `${950} !important`, font: '10px Nunito Sans, sans-serif !important' }}>{weekday}</Text>
                                                    </Box>
                                                ))}

                                                {(views === 'day') && days.map((day, index) => {

                                                    let value_day = dayjs().set('month', months.indexOf(selectedMonth)).set('year', selectedYear);
                                                    var isInCurrentMonth = day.isSame(value_day, 'month'); // Check if the day is in the current month
                                                    var isSelected = selectedDates.includes(day.format('YYYY-MM-DD')); // Check if the day is selected

                                                    return (
                                                        <Box key={index} sx={{ textAlign: 'center' }}>
                                                            <Text
                                                                onClick={() => {
                                                                    if (isInCurrentMonth) {
                                                                        if (isSelected) {
                                                                            setSelectedDates(selectedDates.filter(date => date !== day.format('YYYY-MM-DD')));
                                                                        } else {
                                                                            setSelectedDates([day.format('YYYY-MM-DD')]);
                                                                        }
                                                                    }
                                                                }}
                                                                sx={{
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                    m: '2px',
                                                                    color: isInCurrentMonth ? (isSelected ? '#FFFFFF' : '#051B44') : '#8F95B2',
                                                                    backgroundColor: isSelected ? '#0066FF' : 'transparent',
                                                                    fontWeight: `${500} !important`,
                                                                    font: '14px Nunito Sans, sans-serif !important'
                                                                }}
                                                            >
                                                                {day.date()}
                                                            </Text>
                                                        </Box>
                                                    );
                                                })}

                                                {(views === 'week') && days.map((day, index) => {
                                                    let value_day = dayjs().set('month', months.indexOf(selectedMonth)).set('year', selectedYear);
                                                    var isInCurrentMonth = day.isSame(value_day, 'month'); // Check if the day is in the current month
                                                    var isSelected = selectedDates.includes(day.format('YYYY-MM-DD')); // Check if the day is selected

                                                    return (
                                                        <Box key={index} sx={{ textAlign: 'center' }}>
                                                            <Text
                                                                onClick={() => {
                                                                    if (isInCurrentMonth) {
                                                                        toggleSelection(day, isSelected);
                                                                    }
                                                                }}
                                                                sx={{
                                                                    m: '2px',
                                                                    padding: '5px',
                                                                    color: isInCurrentMonth ? (isSelected ? '#FFFFFF' : '#051B44') : '#8F95B2', // Change the color based on the month
                                                                    backgroundColor: isSelected ? '#0066FF' : 'transparent', // Change the background color based on the selection
                                                                    fontWeight: `${500} !important`,
                                                                    font: '14px Nunito Sans, sans-serif !important'
                                                                }}
                                                            >
                                                                {day.date()}
                                                            </Text>
                                                        </Box>
                                                    );
                                                })}

                                                {(views === 'year') &&
                                                    <>
                                                        <Box sx={{
                                                            textAlign: 'center',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            paddingLeft: '15px',
                                                            paddingRight: '15px',
                                                            alignItems: 'center', // Align items vertically
                                                            width: '100%',
                                                        }}>
                                                            <img src={dateleftarrow} alt="dateleftarrow" onClick={() => handleYearChangesub(1)} />
                                                            <Text sx={{
                                                                fontWeight: "600 !important",
                                                                color: "#051B44", font: '14px Nunito Sans, sans-serif !important'
                                                            }}>{selectedMonth}</Text>
                                                            <Box sx={{ width: '35%', mt: '4px' }}> {/* Adjust width as needed */}
                                                                <Autocomplete
                                                                    classes={{
                                                                        input: classes.inputYear
                                                                    }}
                                                                    disableClearable={true}
                                                                    options={years}
                                                                    value={selectedYear}
                                                                    onChange={(event, newValue) => {
                                                                        setSelectedYear(newValue);
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextField fullWidth {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} />
                                                                    )}
                                                                    popupIcon={<KeyboardArrowDownIcon sx={{ color: "#051B44 !important" }} />}
                                                                />
                                                            </Box>
                                                            <img src={daterightarrow} alt="daterightarrow" onClick={() => handleYearChangeAdd(1)} />
                                                        </Box>

                                                        <Box sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                                            mt: '10px'
                                                        }}>
                                                            {months.map((month, index) => {
                                                                return (
                                                                    <Box key={index} sx={{
                                                                        textAlign: 'center',
                                                                        color: selectedMonth === month ? '#0C75EB' : '#051B44',
                                                                    }} onClick={() => handleMonthSelect(month)}>
                                                                        <Text sx={{ padding: '5px', my: '10.6px', fontWeight: '500 !important', font: '14px Nunito Sans, sans-serif !important' }}>{month}</Text>
                                                                    </Box>
                                                                );
                                                            })}
                                                        </Box>
                                                    </>
                                                }
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <Box sx={{ display: "flex", justifyContent: 'space-between', padding: '25px' }} >
                                        <Button sx={{
                                            border: "1px solid #D8DAE5 !important", borderRadius: "4px !important",
                                            '&:hover': {
                                                background: `none !important`,
                                                color: '#696F8C !important',
                                            },
                                            color: "#696F8C !important", fontSize: '16px !important', fontWeight: '600 !important', width: "108px !important", height: "40px !important",
                                        }} cancelSmall onClick={() => { removeFilter() }}>Cancel</Button>
                                        <Button sx={{
                                            background: '#0066FF !important',

                                            border: "none !important", borderRadius: "4px !important",
                                            color: "#FFFFFF !important", fontSize: '16px !important', fontWeight: '600 !important', width: "99px !important", height: "40px !important"
                                        }} saveSmall onClick={() => { addFilter() }}>Apply</Button>
                                    </Box>
                                </Menu>
                                <img onClick={() => { addMonth() }} src={rightBtnN} style={{ cursor: "pointer" }} alt="rightArrow" />
                            </Box>
                        </LocalizationProvider>
                    </Stack>
                </Stack>

                <Box className={classes.listContianer}>
                    {NotificationData.length !== 0 && !loading ? NotificationData.map((data, index) => (

                        <Stack className={classes.notificationCard} key={index}>
                            <Stack className={classes.leftContent}>
                                <Avatar src={moduleIcons[data.slug]} alt='icons' className={classes.avatarSize} />
                                <Stack gap={1}>
                                    <Text className={classes.header2}>{data.name}</Text>
                                    <Text className={classes.header3}>{data.content}</Text>
                                </Stack>
                            </Stack>
                            <Stack gap={1}>
                                <Text className={classes.header4}>{data.time}</Text>
                                <Text className={classes.header5}>{data.date}</Text>
                            </Stack>
                        </Stack>

                    ))

                        : null}

                    {loading && [1, 2, 3, 4, 5, 6, 7].map((index) => (

                        <Stack className={classes.notificationCard} key={index}>
                            <Stack className={classes.leftContent}>
                                <Skeleton variant='circular' height={'53px'} width={'53px'} />
                                <Stack gap={1}>
                                    <Skeleton variant='text' width={150} height={16} />
                                    <Skeleton variant='text' width={100} height={14} />
                                </Stack>
                            </Stack>
                            <Stack gap={1} alignItems={'center'}>
                                <Skeleton variant='text' width={50} height={16} />
                                <Skeleton variant='text' width={70} height={14} />
                            </Stack>
                        </Stack>

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
                        (!loading &&
                            pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                            <Box style={{ textAlign: "center", padding: "10px", }}>
                                {/*<button
                                    onClick={() => loading ? null : loadeMore()}
                                    type="button"
                                    style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                                >
                                    {loading ? "Loading..." : "Load more"}
                                </button>*/}
                                <Button outlineBlue onClick={() => loadeMore()}>{loading ? "Loading..." : "Load more"}</Button>
                            </Box> : null : null)
                    }

                </Box>
            </Stack>
        </Box>
    )
}
