import React, { useEffect, useState } from "react";
import TimeSheetDashboardStyles from "./TimeSheetDashboardStyles";
import { Pagination, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import leftArrow from "../../../assets/images/LeftArrowButton.png"
import rightArrow from "../../../assets/images/RightArrowButton.png";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Text from '../../../components/customText/Text';
import CustomSelect from "../../../components/customSelect/CustomSelect";
import Downloadcloud from '../../../assets/svg/download-cloud.svg';
import DashboardStyles from '../DasboardStyles';
import Avatar from '@mui/material/Avatar';
import Search from '../../../assets/svg/search1.svg';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
// import Avatarsvg from '../../../assets/svg/avatar.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TimesheetApi from "../../../apis/admin/timesheets/TimesheetApi";
import { addErrorMsg } from '../../../utils/utils';
import Documentsvg from '../../../assets/svg/document.svg';
import roundgreen from '../../../assets/svg/roundgreen.svg';
import roundpink from '../../../assets/svg/roundpink.svg';
import roundpurple from '../../../assets/svg/roundpurple.svg';
import roundweek from '../../../assets/svg/roundweek.svg';
import roundblue from '../../../assets/svg/roundblue.svg';
import dateleftarrow from '../../../assets/svg/dateleftarrow.svg';
import daterightarrow from '../../../assets/svg/daterightarrow.svg';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Skeleton from '@mui/material/Skeleton';
import CustomCalendars from "../../../components/customCalendar/CustomCalendars"
import TableAccordion from "../../../components/tableAccordion/TableAccordion";
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Autocomplete, Grid, Typography, Breadcrumbs, Menu, MenuItem, Box,
    Divider,
    TextField
} from "@mui/material";
import CommonApi from "../../../apis/CommonApi";
// import Tooltip from '@mui/material/Tooltip';
import Button from '../../../components/customButton/Button';
import CalenderEmptyData from '../../../assets/svg/CalenderEmptyData.svg';
import LocalStorage from "../../../utils/LocalStorage";
import disablePlus from '../../../assets/client/disablePlus.svg';
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg';

// Extend dayjs with the isoWeek plugin to handle weeks correctly
dayjs.extend(isoWeek);

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
        height: "40px",
        border: "1.5px solid rgba(199, 204, 211, 1)",
        borderRadius: "6px",
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

export default function Timesheetview() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const navigate = useNavigate();
    const [value, setValue] = useState(dayjs());
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const classes = TimeSheetDashboardStyles();
    const [loading, setLoading] = useState(false);
    const [listView, setListView] = useState([]);
    const [weeklyView, setWeeklyView] = useState([]);
    const [drop, setDrop] = useState(1);
    const classesDashboard = DashboardStyles();
    const [employeeIDs, setEmployeeIDs] = useState([]);
    const [viewAccess, setViewAccess] = useState(false);
    const [clientsDropdown, setClientsDropdown] = useState([]);
    const [formData, setFormData] = useState({
        client_id: "",
        placement_id: "",
        end_client_id: "",
    })
    const [views, setViews] = useState('day');
    const [selectedDates, setSelectedDates] = useState([]);
    const viewTypeList = require('../../../utils/jsons/View.json');
    var startOfMonth = value.startOf('month').format('MM/DD/YYYY');
    var endOfMonth = value.endOf('month').format('MM/DD/YYYY');
    const [searchImg, setSearchImg] = useState(true);
    const [filter, setFilter] = useState({
        search: "",
    });
    const [employeeIDSelected, setEmployeeIDSelected] = useState(null);
    const [placementID, setPlacementID] = useState(null);
    const [calendarDetails, setCalendarDetails] = useState([]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [selectedMonth, setSelectedMonth] = useState(months[dayjs().month()]);
    const [selectedYear, setSelectedYear] = useState(value.format('YYYY'));
    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );

    const currentYear = value.format('YYYY');
    const years = Array.from({ length: currentYear - 1900 }, (_, i) => i + 1901).reverse();

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    }

    const handleYearChange = (change) => {
        setSelectedYear(Number(selectedYear) + change);
    }

    const classeSearch = useStyles();

    // Generate the days for the calendar view
    let days = [];
    let values_start = dayjs().set('month', months.indexOf(selectedMonth)).set('year', selectedYear);
    let day_of = values_start.startOf('month').startOf('isoWeek');
    while (day_of.isBefore(values_start.endOf('month').endOf('isoWeek'))) {
        days.push(day_of);
        day_of = day_of.add(1, 'day');
    }

    const handleDrop = (event) => {
        var dropValue = event.target.value;
        setEmployeeIDSelected(null);
        if (dropValue !== drop) {
            if (dropValue == 1) {
                getListView(pagination);
            } else if (dropValue == 2) {
                getWeekView(pagination);
            } else if (dropValue == 3) {
                setViews('year');
                // getCalendraView('NoPlacement');
            }
            setFilter({ ...filter, search: "" });
            setSearchImg(true);
        }
        setDrop(event.target.value)
    }

    const handleAutocompe = (event, args) => {
        if (args) {
            getPlacementsDropdown(args ? args.id : '')
            if (formData.client_id !== '') {
                setPlacementID(args.id);
            } else {
                setPlacementID(null);
            }
        }

        // if (args.id === null) {
        //     handleAPICall(null);
        // } else {
        //     handleAPICall(args.id);
        // }
    }

    const handlePlacement = (event) => {
        let { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value, end_client_id: "", placement_id: value }));
        setPlacementID(value)
        getCalendraView(value);
    }

    const handleView = (viewValue) => {
        var dropView = viewValue;
        if (dropView !== views) {
            setViews(dropView);
        }
        setSelectedDates([]);
    }

    useEffect(() => {
        setTimeout(() => {
            if (drop == 1) {
                getListView(pagination);
            } else if (drop == 2) {
                getWeekView(pagination);
            }
            // else if (drop == 3) {
            //     getCalendraView();
            // }
            getEmployeesDropdown();
            if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_view" && item.is_allowed == true))) {
                setViewAccess(true);
            } else {
                setViewAccess(false);
            }
        }, 300)
        // eslint-disable-next-line  
    }, [employeeIDSelected, drop])

    // const handleAPICall = (id) => {
    //     setEmployeeIDSelected(id);
    //     if (drop == 1) {
    //         getListView(pagination);
    //     } else if (drop == 2) {
    //         getWeekView(pagination);
    //     } else if (drop == 3) {
    //         getCalendraView('NoPlacement');
    //         setPlacementID(null);
    //     }
    // }

    const getListView = (paginationData, searchTitle) => {
        setLoading(true);
        let data = {
            from_date: startOfMonth,
            to_date: endOfMonth,
            search: searchTitle ? searchTitle : "",
        };

        TimesheetApi.timesheetlistView(data, paginationData).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setListView(response.data.data);
                    setPagination(prevPagination => ({ ...prevPagination, ...response.data.pagination }));
                    setLoading(false);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400);
        })
    }

    const getCalendraView = (args, employeeID) => {
        if (drop !== 3 || (drop === 3 && (placementID !== null && employeeIDSelected !== null))) {
            setLoading(true);
        }
        let data = {
            from_date: startOfMonth,
            to_date: endOfMonth,
            employee_id: employeeIDSelected ? [employeeIDSelected] : employeeID ? [employeeID] : [],
            placement_id: placementID ? placementID : args ? args : ''
        };

        TimesheetApi.timesheetcalendarView(data).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    var calendarDetails1 = [];
                    if (response.data.data) {
                        var timesheet_hours = response.data.data[0].ts_info.length ? response.data.data[0].ts_info[0]['timesheet_hours'] : [];
                        timesheet_hours.map(item => {
                            let details = {
                                date: item.date,
                                // id?
                                invoice_ready_timesheet: "",
                                total_hours: item.total_hours,
                                pending_for_approval: "",
                                invoiced: "",
                                holiday: "",
                                status: item.status,
                                invoice_raised: item.invoice_raised,
                                weekoff: ""
                            };

                            if (item.status === 3 && item.invoice_raise === false) {
                                details.invoice_ready_timesheet = true;
                            }
                            else if (item.status === 1 || item.status === 2) {
                                details.pending_for_approval = true;
                            }
                            else if (item.status === 3 && item.invoice_raise === true) {
                                details.invoiced = true;
                            } else {
                                details.weekoff = true;
                            }

                            calendarDetails1.push(details);

                            return calendarDetails1;
                        });

                        // var placement_ids = response.data.data[0].ts_info.map(item => ({
                        //     value: item.client_name,
                        //     id: item.placement_id
                        // }));

                        // var employeeData = response.data.data.map(item => ({
                        //     title: item.employee_name,
                        //     id: item.employee_id,
                        //     key: `${item.employee_id}-${item.employee_name}`, // unique key
                        //     employee_reference_id: item.employee_reference_id,
                        //     profile_url: item.profile_picture_url
                        // }));

                        // let uniqueEmployeeData = employeeData.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

                        // setEmployeeIDs([]);
                        // setEmployeeIDs(uniqueEmployeeData);

                        // if (placement === 'NoPlacement' && employeeIDSelected) {
                        //     setPlacementIDs(placement_ids);
                        // }
                    }
                    setCalendarDetails([]);
                    setCalendarDetails(calendarDetails1);

                    setLoading(false);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400);
        })
    }

    const getWeekView = (paginationData, searchTitle) => {
        setLoading(true);
        let data = {
            from_date: startOfMonth,
            to_date: endOfMonth,
            search: searchTitle ? searchTitle : ""
        };

        TimesheetApi.timesheetweeklyView(data, paginationData).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    if (response.data.data.data) {
                        setWeeklyView(response.data.data.data);
                        setPagination({ ...response.data.pagination });
                    } else {
                        setWeeklyView([]);
                    }
                    setLoading(false);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400);
        })
    }
    const getPlacementsDropdown = (id) => {
        CommonApi.placementsDropdown(id, true).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data.length == 1) {
                    setFormData((prev) => ({ ...prev, 'client_id': response.data.data[0].placement_id, end_client_id: "", placement_id: "" }));
                    getCalendraView(response.data.data[0].placement_id, id);
                    setPlacementID(response.data.data[0].placement_id);
                    setEmployeeIDSelected(id);
                } else if (response.data.data.length == 0) {
                    setPlacementID(null);
                    setEmployeeIDSelected(null);
                } else {
                    setPlacementID(null);
                    setEmployeeIDSelected(id);
                }
                let clientFilterArr = [];
                for (let i = 0; i < response.data.data.length; i++) {
                    clientFilterArr.push({
                        id: response.data.data[i].placement_id,
                        value: response.data.data[i].client_name + '(' + response.data.data[i].placement_reference_id + ')'
                    })
                }
                setClientsDropdown(clientFilterArr);
            }
        });
    };
    const handleChangePagination = (e, page) => {
        let paginationData = { ...pagination, currentPage: page };
        setPagination({ ...paginationData })
        if (drop == 1) {
            getListView(paginationData);
        } else if (drop == 2) {
            getWeekView(paginationData);
        } else if (drop == 3) {
            getCalendraView();
        }
    }

    const weekly_rows = weeklyView && weeklyView.map((data, index) => ({
        id: data.timesheet_id,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Avatar alt='Jacob James' src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    <Text smallBlue1 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >{data.employee_name}</Text>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap> {data.employee_reference_id} </Text>
                </Box>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.client_name}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.inv_cycle_name ? data.inv_cycle_name : "--"}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack>
                    {data.invoice_ids && data.invoice_ids.length > 0 ? data.invoice_ids.join(', ') : "--"}
                </Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} key={index} smallBlack >{data.total_hours}</Text>
            </Box>,
        ],
        sub_row_content: [
            <Box sx={{ paddingTop: '18px', width: '100%', height: '80px', backgroundColor: '#f1f8ff', borderRadius: '16px', justifyContent: 'space-around', display: 'flex' }}>
                {data.ts_info.map((data, index) => (
                    <Box width={'100%'}>
                        <Text className={classesDashboard.text1}>
                            Week {(index + 1)}
                        </Text>
                        <Text my={1} className={classesDashboard.text2}>
                            {data.total_hours}
                        </Text>
                    </Box>
                ))}
            </Box>
        ]
    }));

    const weekly_columns = [
        { 'name': 'Employee Name', 'width': '' },
        { 'name': 'Client Name', 'width': '' },
        { 'name': 'Invoice Cycle', 'width': '' },
        { 'name': 'Invoice', 'width': '' },
        { 'name': 'Total Hours', 'width': '' }
    ];

    const list_rows = listView && listView.map((data, index) => ({
        id: data.timesheet_id,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Avatar alt='Jacob James' src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    <Text smallBlue1 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >{data.employee_name}</Text>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap> {data.employee_reference_id} </Text>
                </Box>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.timesheet_reference_id}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.company_name}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.timesheet_status}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.total_billable_hours}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.total_ot_hours}</Text>
            </Box>,
            <a href="/" target="_blank" rel="dashboard">
                <Box>
                    <img alt='Documentsvg' src={Documentsvg}></img>
                    {/* <img alt='Documentsvg' src={Documentsvg} style={{ cursor: "pointer" }} onClick={() => downloadDoc(data.document_url[0].document_url)}></img> */}
                </Box>
            </a>
        ],
        sub_row_content: [
            <Box sx={{ paddingTop: '18px', width: '100%', height: '80px', backgroundColor: '#f1f8ff', borderRadius: '16px', justifyContent: 'space-around', display: 'flex' }}>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        From
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.from_date}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        To
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.to_date}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Total Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.total_hours}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted On
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_on ? data.submitted_on : "--"}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted By
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_by ? data.submitted_by : "--"}
                    </Text>
                </Box>
            </Box>
        ]
    }));

    const list_columns = [
        { 'name': 'Employee Name', 'width': 200 },
        { 'name': 'Timesheet No', 'width': '' },
        { 'name': 'Client Name', 'width': '' },
        { 'name': 'Status', 'width': '' },
        { 'name': 'Billable Hours', 'width': '' },
        { 'name': 'Over Time', 'width': '' },
        { 'name': 'Attachment', 'width': 165 }
    ]

    const TableRowSkeletonLoader = ({ rowsNum }) => {
        return [...Array(rowsNum)].map((row, index) => (
            <Box key={index} sx={{ width: "100%", display: "flex", alignItems: "center", borderRight: "1px solid rgba(226, 229, 230, 1)" }}>
                <TableRow key={index}>
                    <TableCell component="th" scope="row">
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                </TableRow>
            </Box>
        ));
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        // setOpen(false);
        // setAnchorEl(null);
    }

    const day = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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

    const handleSearch = (e) => {
        const text = e.target.value;
        setFilter(prevFilter => ({ ...prevFilter, search: text }));
        if (text.length > 0) {
            setSearchImg(false);
        } else {
            setSearchImg(true);
        }
        if (drop === 1) {
            getListView(pagination, text);
        } else if (drop === 2) {
            getWeekView(pagination, text);
        }

    }

    const closeBtn = () => {
        setFilter(prevFilter => ({ ...prevFilter, search: "" }));
        setSearchImg(true)
        if (drop === 1) {
            getListView(pagination, "");
        } else if (drop === 2) {
            getWeekView(pagination, "");
        }
    }

    const addMonth = () => {
        console.log("vvvvvvvvvvv", placementID,);
        var date = value.add(1, 'month');
        setValue(date);
        startOfMonth = date.startOf('month').format('MM/DD/YYYY');
        endOfMonth = date.endOf('month').format('MM/DD/YYYY');
        // setSelectedYear(date.format('YYYY'));
        setSelectedYear(Number(date.format('YYYY')));
        setSelectedMonth(months[date.month()]);
        // console.log("ddd",date.month());
        // setSelectedMonth(value.month());
        if (drop == 1) {
            getListView(pagination);
        } else if (drop == 2) {
            getWeekView(pagination);
        } else if (drop == 3) {
            getCalendraView();
        }
    }

    const addFilter = () => {

        if (selectedDates.length === 0) {
            let newValue = dayjs().set('month', months.indexOf(selectedMonth)).set('year', Number(selectedYear));
            startOfMonth = newValue.startOf('month').format('MM/DD/YYYY');
            endOfMonth = newValue.endOf('month').format('MM/DD/YYYY');
            setValue(newValue);
        } else if (selectedDates.length > 1) {
            let minDate = dayjs(Math.min(...selectedDates.map(date => dayjs(date))));
            let maxDate = dayjs(Math.max(...selectedDates.map(date => dayjs(date))));
            let newValue = dayjs().set('month', months.indexOf(selectedMonth)).set('year', Number(selectedYear));
            startOfMonth = minDate.format('MM/DD/YYYY');
            endOfMonth = maxDate.format('MM/DD/YYYY');
            setValue(newValue);

        } else {
            let singleDate = dayjs(selectedDates[0]);
            let newValue = singleDate.set('month', months.indexOf(selectedMonth)).set('year', Number(selectedYear));
            startOfMonth = newValue.format('MM/DD/YYYY');
            endOfMonth = newValue.format('MM/DD/YYYY');
            setValue(newValue);
        }
        if (drop == 1) {
            getListView(pagination);
        } else if (drop == 2) {
            getWeekView(pagination);
        } else if (drop == 3) {
            console.log("f", placementID);
            getCalendraView();
        }
        setOpen(false);
        setAnchorEl(null);
    }

    const removeFilter = () => {
        setOpen(false);
        setAnchorEl(null);
    }

    const subMonth = () => {
        var date = value.subtract(1, 'month');
        setValue(date);
        startOfMonth = date.startOf('month').format('MM/DD/YYYY');
        endOfMonth = date.endOf('month').format('MM/DD/YYYY');
        // setSelectedYear(date.format('YYYY'));
        setSelectedMonth(months[date.month()]);
        setSelectedYear(Number(date.format('YYYY')));
        if (drop == 1) {
            getListView(pagination);
        } else if (drop == 2) {
            getWeekView(pagination);
        } else if (drop == 3) {
            getCalendraView();
        }
    }
    const getEmployeesDropdown = () => {
        TimesheetApi.employeesDropdown().then((response) => {
            if (response.data.statusCode == 1003) {
                setEmployeeIDs(response.data.data)
            }
        });
    };

    const handleAutocompeEdit = () => {
        setFormData((prev) => ({ ...prev, 'client_id': "", end_client_id: "", placement_id: "" }));
        setPlacementID(null);
        setEmployeeIDSelected(null);
    }

    console.log(employeeIDSelected, placementID, "placementID");

    return (
        <Grid container component={'main'} className={classes.main} pl={{ lg: 15, md: 11, sm: 12, xs: 11 }} pr={5}>
            <Grid item container >
                <Grid item lg={9} md={9} xs={9}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography sx={{ cursor: "pointer" }} onClick={() => { navigate('/timesheet'); }} className={classes.breadcrumbsLink}>Timesheet</Typography>
                        <Typography className={classes.breadcrumbsName}>Timesheet views</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item lg={3} md={3} xs={3} display={'flex'} justifyContent={'end'}>
                    {
                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_create" && item.is_allowed == true)) ?
                            <Button save startIcon={<Plus />} onClick={() => navigate("/timesheet/add-timesheet")} >Add Timesheet</Button> :
                            <Button addNewDisable><img src={disablePlus} alt="add" sx={{ marginRight: '10px' }} />Add Timesheet</Button>
                    }
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item lg={drop === 3 ? 3.5 : 2} md={12} sm={12} display={'flex'} gap={1}>
                    {drop === 3 ?
                        <>
                            <Autocomplete
                                classes={{
                                    endAdornment: classeSearch.endAdornment,
                                    option: classeSearch.option,
                                    popupIndicator: classeSearch.popupIndicator,
                                    clearIndicator: classeSearch.clearIndicator,
                                    inputRoot: classeSearch.inputRoot,
                                    input: classeSearch.input,
                                }}
                                sx={{ width: '100%' }}
                                onChange={(e, newValue) => handleAutocompe(e, newValue)}
                                height={10}
                                forcePopupIcon={false}
                                clearIcon={<ClearIcon fontSize="small" />}
                                fullWidth
                                // name="employeeName"
                                // value={state.employeeName}
                                options={employeeIDs}
                                getOptionLabel={(option) => `${option.value.length > 20 ? option.value.substring(0, 20) + '...' : option.value}`}
                                getOptionSelected={(option, value) => option.id === value.id}
                                // filterOptions={(options, { inputValue }) => {
                                //         var input = inputValue.trim().toLowerCase();
                                //         return options.filter(
                                //             (option) =>
                                //                 option.value.toLowerCase().includes(input) ||
                                //                 option.id.toLowerCase().includes(input)
                                //         );

                                // }}
                                renderOption={(props, option) => (
                                    // <Tooltip title={option.value} arrow placement="top">
                                    <Box {...props} display="flex" textAlign="left" width={'100%'} sx={{ cursor: 'pointer' }}>
                                        <Avatar alt={option.value} src={option.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                                        <Box ml={1}>
                                            <Text sx={{
                                                paddingTop: '0px !important', fontSize: "14px !important",
                                                fontWeight: "500 !important", color: "#262626 !important",
                                                height: "17px !important",
                                                fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                                whiteSpace: 'noWrap !important'
                                            }} >{option.value.length > 20 ? option.value.substring(0, 20) + '...' : option.value}</Text>
                                            <Text sx={{
                                                color: '#737373 !important', fontSize: "12px !important", fontWeight: "500 !important",
                                                paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important"
                                            }} nowrap> {option.employee_reference_id} </Text>
                                        </Box>
                                    </Box>
                                    // </Tooltip>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        {...params}
                                        className={classeSearch.globalSearchInput}
                                        placeholder="Search by Name / ID"
                                        onChange={(e) => handleAutocompeEdit()}
                                        InputProps={{

                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {/* {params.InputProps.endAdornment} */}
                                                    <SearchIcon sx={{ position: 'absolute', right: 10 }} />
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            <CustomSelect
                                viewDrop
                                name='client_id'
                                value={formData.client_id}
                                sx={{ width: '140px' }}
                                onChange={(e) => handlePlacement(e)}
                                options={clientsDropdown}
                            /></> :
                        <div className={classes.searchField}>
                            <input
                                type="text"
                                value={filter.search}
                                onChange={handleSearch}
                                className={classes.globalSearchInput}
                                placeholder="Search by Name / ID"
                            />
                            <button
                                type="button"
                                className={classes.searchIcon}
                            >
                                {searchImg ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={closeBtn} />}
                            </button>
                        </div>
                    }
                </Grid>
                <Grid item lg={drop === 3 ? 4.5 : 5} md={6} sm={6} display={'flex'} justifyContent={'end'}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box mt={1.5} width={'250px'} display={'flex'} justifyContent={'space-between'}>
                            <img onClick={() => { subMonth() }} src={leftArrow} style={{ height: "20px", cursor: "pointer" }} alt="leftArrow" />
                            <Text onClick={handleClick} sx={{ cursor: 'pointer', fontSize: "14px !important", fontWeight: "500 !important", color: '#0066FF !important' }} smallBlue>{value.format('MMMM YYYY')}</Text>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                keepMounted
                                onClose={handleClose}
                                style={{ left: "-100px", top: '0px' }}

                            >

                                <MenuItem
                                    disableRipple={true}
                                    sx={{ backgroundColor: 'transparent !important' }}>

                                    <Box height={'auto'} width={'300px'} padding={'10px'} sx={{ background: '#FFFFFF' }}>
                                        <Box display={'flex'} height={'10px'} mr={'20px'} ml={'20px'} mt={'10px'} justifyContent={'space-between'}>

                                            <Text onClick={drop !== 3 ? () => handleView('day') : null} sx={{
                                                fontSize: '14px !important',
                                                cursor: drop !== 3 ? 'pointer' : 'not-allowed',
                                                fontWeight: views === 'day' ? '600 !important' : '500 !important',
                                                color: views === 'day' ? '#0C75EB  !important' : '#8F95B2 !important',
                                                borderBottom: views === 'day' ? '1.5px solid currentColor' : 'none',
                                                paddingBottom: views === 'day' ? '16px' : '0',
                                            }} smallBlack>
                                                Day
                                            </Text>
                                            <Text onClick={drop !== 3 ? () => handleView('week') : null} sx={{
                                                fontSize: '14px !important',
                                                cursor: drop !== 3 ? 'pointer' : 'not-allowed',
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

                                            {((views === 'day') || (views === 'week')) && (drop !== 3) && day.map((weekday, index) => (
                                                <Box key={index} sx={{
                                                    textAlign: 'center',
                                                    color: "#8F95B2",
                                                }}>
                                                    <Text sx={{ padding: '5px', fontWeight: `${950} !important`, font: '10px Nunito Sans, sans-serif !important' }}>{weekday}</Text>
                                                </Box>
                                            ))}

                                            {(views === 'day') && (drop !== 3) && days.map((day, index) => {

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

                                            {(views === 'week') && (drop !== 3) && days.map((day, index) => {
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
                                                        <img src={dateleftarrow} alt="dateleftarrow" onClick={() => handleYearChange(-1)} />
                                                        <Text sx={{
                                                            fontWeight: "600 !important",
                                                            color: "#051B44", font: '14px Nunito Sans, sans-serif !important'
                                                        }}>{selectedMonth}</Text>
                                                        <Box sx={{ width: '35%', mt: '4px' }}> {/* Adjust width as needed */}
                                                            <Autocomplete
                                                                classes={{
                                                                    input: classeSearch.inputYear
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
                                                        <img src={daterightarrow} alt="daterightarrow" onClick={() => handleYearChange(1)} />
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
                                                                    <Text sx={{ padding: '5px', fontWeight: '500 !important', font: '14px Nunito Sans, sans-serif !important' }}>{month}</Text>
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
                            <img onClick={() => { addMonth() }} src={rightArrow} style={{ height: "20px", cursor: "pointer" }} alt="rightArrow" />
                        </Box>
                    </LocalizationProvider>
                </Grid>
                <Grid item lg={drop === 3 ? 4 : 5} md={6} sm={6} display={'flex'} gap={2} justifyContent={'end'}>
                    <button
                        type="button"
                        style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}
                    >
                        <img src={Downloadcloud} alt="Userplus" />
                    </button>
                    <CustomSelect
                        viewDrop
                        name='drop'
                        value={drop}
                        onChange={(e) => handleDrop(e)}
                        options={viewTypeList}
                    />
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item lg={12} sx={{ height: '570px !important', overflowY: 'auto' }}>
                    {loading ? (
                        <TableRowSkeletonLoader rowsNum={10} />
                    ) : (
                        <>
                            {drop === 1 && <TableAccordion url={viewAccess == true ? true : false} name={"Invoiced Timesheet"} acc={true} rows={list_rows} columns={list_columns} />}
                            {drop === 2 && <TableAccordion url={viewAccess == true ? true : false} acc={true} rows={weekly_rows} columns={weekly_columns} />}
                            {drop === 3 && (

                                <>
                                    {((employeeIDSelected === null) || (placementID === null)) ? (
                                        <div style={{ textAlign: 'center', margin: "100px" }}>
                                            <img src={CalenderEmptyData} alt="CalenderEmptyData" />
                                        </div>
                                    ) : (
                                        <>
                                            <CustomCalendars calendarDetails={calendarDetails} value={value} />
                                            <Box mt={2} display={'flex'} gap={2}>
                                                <div style={{ display: "flex", gap: "inherit" }}><img alt="roundgreen" src={roundgreen} /><p>Invoice ready timesheet</p></div>
                                                <div style={{ display: "flex", gap: "inherit" }}><img alt="roundpurple" src={roundpurple} /><p>Pending for Approval</p></div>
                                                <div style={{ display: "flex", gap: "inherit" }}><img alt="roundblue" src={roundblue} /><p>Invoiced</p></div>
                                                <div style={{ display: "flex", gap: "inherit" }}><img alt="roundpink" src={roundpink} /><p>Holiday</p></div>
                                                <div style={{ display: "flex", gap: "inherit" }}><img alt="roundweek" src={roundweek} /><p>Week-Off</p></div>
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                            {drop !== 3 &&
                                <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: '15px' }}>
                                    <Stack spacing={2} >
                                        <Pagination
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
                                                "& .MuiPagination-ul li:last-child button::before": {
                                                    content: `${((drop === 2 && weeklyView.length === 0) || (drop === 1 && listView.length === 0)) ? "''" : "'Next'"}`,
                                                    marginRight: "8px",
                                                },
                                                "& .MuiPagination-ul li:first-child button::after": {
                                                    content: `${((drop === 2 && weeklyView.length === 0) || (drop === 1 && listView.length === 0)) ? "''" : "'Prev'"}`,
                                                    marginLeft: "8px",
                                                },
                                                "& .MuiPagination-ul li:last-child": {
                                                    marginLeft: "13px",
                                                    '& .MuiButtonBase-root': {
                                                        border: 'none !important'
                                                    },
                                                },
                                                "& .MuiPagination-ul li:first-child": {
                                                    marginRight: "13px",
                                                    '& .MuiButtonBase-root': {
                                                        border: 'none !important'
                                                    },
                                                },
                                                '& .MuiPaginationItem-icon': {
                                                    display: 'none',
                                                },
                                                '& .css-19xm0h7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
                                                    backgroundColor: '#2F80ED !important',
                                                    color: '#FFFFFF !important',
                                                    border: "1px solid #2F80ED !important"
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Box>

                            }

                        </>
                    )}
                </Grid>

            </Grid>
        </Grid >
    );

}