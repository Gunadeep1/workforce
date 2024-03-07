import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import EmployeeSelfServiceStyles from './EmployeeSSDshStyles';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { Box, Avatar, Grid, FormControlLabel, RadioGroup, Checkbox, Chip, Radio, FormControl, SwipeableDrawer, Tab, Tabs, Menu, MenuItem, Stack, } from '@mui/material';
import { blue } from '../../../theme';
import { ReactComponent as Success } from '../../../assets/client/clientSuccess.svg';
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Search from '../../../assets/svg/search1.svg';
import Filterlines from '../../../assets/svg/filter-lines.svg';
import { useLocation, useNavigate } from "react-router-dom";
import Text from '../../../components/customText/Text';
import Button from '../../../components/customButton/Button';
import { ReactComponent as CloseIcon } from '../../../assets/svg/cross.svg';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as RadioIcon } from '../../../assets/svg/RadioIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../assets/svg/RadioCheckedIcon.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/editIcon1.svg';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Divider from '@mui/material/Divider';
import { ReactComponent as ReassignedTag } from '../../../assets/svg/ReassignedIcon.svg';
import { ReactComponent as NewTag } from '../../../assets/svg/NewTag.svg';
import { ReactComponent as DoneIcon } from '../../../assets/svg/DoneIcon.svg';
import { ReactComponent as PendingIcon } from '../../../assets/svg/PendingIcon.svg';
import { ReactComponent as MenuIcon } from '../../../assets/svg/MenuIcon1.svg';
import { ReactComponent as ChipDeleteIcon } from '../../../assets/svg/chipDeletIcon.svg';
import Badge from '@mui/material/Badge';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import EmployeeSSAPI from '../../../apis/admin/employeeSelfService/EmployeeSelfServiceApi';
import { addErrorMsg, addSuccessMsg, dateFormat } from '../../../utils/utils';
import Skeleton from '@mui/material/Skeleton';
import SearchSelect from '../../../components/selectField/SearchSelect';
import LocalStorage from '../../../utils/LocalStorage';
import CommonApi from '../../../apis/CommonApi';
import { validate_emptyField, isValid } from "../../../components/Validation";
import Datepicker from '../../../components/datePicker/Date';
import moment from "moment";
import disableEdit from '../../../assets/client/disableEdit.svg';

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
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        font: '12px Nunito !important',
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




function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


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

export default function ControlledAccordions() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const requestState = location && location.state && location.state.status
    const classes = EmployeeSelfServiceStyles();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [popup, setPopup] = useState(false);
    const [tab, setTab] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [employees, setEmployees] = useState([]);
    const [raisedTickets, setRaisedTickets] = useState([]);
    const [pagination, setPagination] = useState({});
    const [raisedPagination, setRaisedPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [newForm, setNewForm] = useState({});
    const [empList, setEmpList] = useState([]);
    const [error, setError] = useState({});
    const [indication, setIndication] = useState(false);
    const [months, setMonths] = useState([]);
    const [monthRadio, setMonthRadio] = useState(true);
    const [newTickets, setNewTickets] = useState(0);
    const [rowData, setRowData] = useState({});

    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event, data) => {
        setNewForm(data);
        setAnchorEl(event.currentTarget);
        setRowData(data);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setRowData({});
    };
    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        search: '',
        self_service: [],
        status: [],
        from_date: '',
        to_date: '',
        received: true,
        raised: false,
        employee: false,
    })

    const [reAssignData, setReAssignData] = useState({
        self_service_types_id: '',
        admin_names: ''
    });

    const [drawer, setDrawer] = useState(false);

    useEffect(() => {
        // getAllEmployees(filterData);
        getAllEmployees({ ...filterData, raised: requestState == 'created' ? true : false, employee: false, received: requestState == 'created' ? false : true });
        getSelfServiceTypeDropdown();
        // eslint-disable-next-line
    }, []);


    // Self Service Types DropDown api call
    const getSelfServiceTypeDropdown = () => {
        let slug = 'employee-self-service-types'
        CommonApi.selfServiceTypesDropdown(slug, '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setServiceTypes(response.data.data);
            }
        });

    }

    const getAllEmployees = (filter) => {
        setDrawer(false)
        setLoading(true)
        EmployeeSSAPI.getAllEmployees(filter).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setEmployees(response.data.data);
                    setRaisedTickets(response.data.data);
                    setRaisedPagination(response.data.pagination)
                    setPagination(response.data.pagination)
                    setNewTickets(response.data);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const getSelfServiceEmployee = (id) => {
        EmployeeSSAPI.getESSGetEmployee(id).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmpList(response.data.data);
            }
        });

    };


    const updateAssignee = () => {
        let data = { ...newForm, request_id: LocalStorage.uid(), employee_id: newForm.raised_employee_id, self_service_types_id: reAssignData.self_service_types_id };
        EmployeeSSAPI.updateAssigneeApi(data).then((response) => {
            if (response.data.statusCode == 1003) {
                addSuccessMsg('Successfully Re-Assigned')
                setPopup(true);
                setReAssignData({})
                getAllEmployees(filterData);
            }
            else {
                addErrorMsg(response.data.message)
            }
        });

    }

    const handleChange = (e) => {

        if (e.target.value !== '' || e.target.value !== null) {
            setReAssignData({ ...reAssignData, [e.target.name]: e.target.value })
            getSelfServiceEmployee(e.target.value);
        }
        handleValidations(e);
    };

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "self_service_types_id":
                err.self_service_types_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }
    const validateAll = () => {
        let { self_service_types_id } = reAssignData;
        let errors = {};
        errors.self_service_types_id = validate_emptyField(self_service_types_id);
        return errors;
    };






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

    const statusList = [
        {
            id: 'In Progress',
            value: 'In Progress',
        },
        {
            id: 'Closed',
            value: 'Closed',
        },
        {
            id: 'Reopen',
            value: 'Reopen',
        }
    ];

    const handleTabApis = (newValue) => {
        if (newValue === 0) {
            setFilterData({ ...filterData, limit: 4, received: true, raised: false, page: 1, search: '', status: [], self_service: [], from_date: '', to_date: '' })
        }
        else if (newValue === 1) {
            setFilterData({ ...filterData, limit: 4, received: false, raised: true, page: 1, search: '', status: [], self_service: [], from_date: '', to_date: '' })
        }
    }

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
        handleTabApis(newValue);
        getAllEmployees({ ...filterData, limit: 4, received: newValue === 0 ? true : false, raised: newValue === 0 ? false : true, page: 1, search: '', status: [], self_service: [], from_date: '', to_date: '' });
    }

    const handleView = (args) => {
        navigate('/employee-self-service/chat-panel', { state: { formData: tab == 0 ? rowData : args, recieve: tab == 0 ? true : false, raise: tab == 0 ? false : true } });
    }
    const handleReAssign = () => {
        setOpen(true);
        setAnchorEl(null);
        setRowData({});
    };

    const handleClose = () => {
        setOpen(false);
        setReAssignData({});
        setError({});
        setEmpList([])
        setPopup(false);
    };
    const handleAssign = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            updateAssignee();
        } else {
            setError(errors);
        }



    }


    function getStartDateOfMonth(monthNumber) {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Create a new Date object for the first day of the specified month
        const startDate = new Date(currentYear, monthNumber - 1, 1);

        // Format the date as MM/DD/YYYY
        const formattedStartDate = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}/${startDate.getFullYear()}`;

        return formattedStartDate;
    }


    function getEndDateOfMonth(monthNumber) {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Create a new Date object for the first day of the next month
        const nextMonthFirstDay = new Date(currentYear, monthNumber, 1);

        // Subtract one day to get the last day of the specified month
        const lastDayOfMonth = new Date(nextMonthFirstDay.getTime() - 1);

        // Format the date as MM/DD/YYYY
        const formattedEndDate = `${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}/${lastDayOfMonth.getDate().toString().padStart(2, '0')}/${lastDayOfMonth.getFullYear()}`;

        return formattedEndDate;
    }

    const loadeMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: 1 });
        getAllEmployees({ ...filterData, limit: filterData.limit + 4, page: 1 });
    }

    const handleSearch = (e) => {
        if (filterData.raised) {
            setRaisedTickets([]);
        } else {
            setEmployees([]);
        }
        setFilterData({ ...filterData, limit: 4, page: 1, search: e.target.value })
        getAllEmployees({ ...filterData, limit: 4, page: 1, search: e.target.value });
    }

    const handleDeleteChip = (id, name) => {
        let newFilterData = filterData;
        if (newFilterData[name].includes(id)) {
            newFilterData[name].splice(newFilterData[name].findIndex(item => item === parseInt(id)), 1)
        }
        setFilterData({ ...newFilterData });
    };

    const handleDeleteDateChip = () => {
        setFilterData({ ...filterData, from_date: '', to_date: '' })
        setMonthRadio(true);
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

    const handleChangeCheckBox = (e) => {
        let newFilterData = filterData;

        if (e.target.name === "status") {
            if (newFilterData[e.target.name].includes(e.target.value)) {
                newFilterData[e.target.name].splice(newFilterData[e.target.name].findIndex(item => item === e.target.value), 1)
            } else {
                newFilterData[e.target.name].push(e.target.value)
            }
        } else {
            if (newFilterData[e.target.name].includes(parseInt(e.target.value))) {
                newFilterData[e.target.name].splice(newFilterData[e.target.name].findIndex(item => item === parseInt(e.target.value)), 1)
            } else {
                newFilterData[e.target.name].push(parseInt(e.target.value))
            }
        }


        setFilterData({ ...newFilterData });
    };

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
            let from_date = getStartDateOfMonth(months[0]);
            let to_date = getEndDateOfMonth(months[0]);
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


    const dateChange = (e, name) => {
        let date = e.$d
        setFilterData({
            ...filterData,
            [name]: moment(date).format(dateFormat())
        },)
        setMonthRadio(false);
    }


    const handleApplyFilter = () => {
        const { self_service, status, from_date, to_date } = filterData;
        if (self_service.length !== 0 ||
            status.length !== 0 ||
            from_date !== '' ||
            to_date !== '') {
            getAllEmployees({ ...filterData });
            setIndication(true);
        }
        else {
            getAllEmployees({ ...filterData, limit: 4, page: 1, })
        }

    }

    const clearAllFilter = () => {
        setSelectedFilter("")
        setMonths([]);
        setFilterData({ ...filterData, self_service: [], status: [], from_date: '', to_date: '' })
        setIndication(false);
        setMonthRadio(true);
    }

    const cancelFilter = () => {
        clearAllFilter();
        if (filterData.self_service.length !== 0 || filterData.from_date)
            getAllEmployees({ ...filterData, self_service: [], status: [], from_date: '', to_date: '' });
        setDrawer(false);
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
                        selectedFilter === "month" &&
                        monthList.map((item, key) => (
                            months.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteMonthChip(item.id)} deleteIcon={<CloseIcon />} />
                        ))


                    }
                    {
                        selectedFilter === "status" &&
                        statusList.map((item, key) => (
                            filterData.status.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteChip(item.id, "status")} deleteIcon={<CloseIcon />} />
                        ))
                    }
                    {
                        selectedFilter === "self_service" &&
                        serviceTypes.map((item, key) => (
                            filterData.self_service.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteChip(item.id, "self_service")} deleteIcon={<CloseIcon />} />
                        ))
                    }
                    {
                        selectedFilter === "custom_date" &&
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

                        {monthRadio && <FormControlLabel
                            value="month" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Month</Text>} />}
                        <FormControlLabel
                            value="status" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Status</Text>} />
                        <FormControlLabel
                            value="self_service" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Issue Type</Text>} />

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
                            selectedFilter === "self_service" &&
                            serviceTypes.map((item, key) => (
                                <FormControlLabel
                                    sx={{ pl: '36px' }}
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"self_service"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            checked={filterData.self_service.includes(item.id) ? "checked" : null}
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

        <Box className={classes.flexBox}>
            <Box sx={{ width: "65%" }}>
                <Box style={{ padding: "40px 10px 10px 10px" }}>
                    <div className={classes.responsiveNav}>
                        <Box sx={{ borderBottom: '1px solid #E2E5E6 !important' }}>
                            <Tabs
                                value={tab}
                                onChange={handleChangeTab}
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab value={0} label={
                                    <Stack direction='row' spacing={2} mx={'10px'}>
                                        <StyledBadge badgeContent={newTickets ? newTickets.receivedCount : null} >{'Received'}</StyledBadge>
                                    </Stack>
                                }   {...a11yProps(0)} className={`${classes.tabTitle}  ${tab === 0 ? classes.activeTabTitle : null}`} />
                                <Tab value={1} label={
                                    <Stack direction='row' spacing={2} mx={'10px'}>
                                        <StyledBadge badgeContent={newTickets ? newTickets.raisedCount : null} >{'Raised'}</StyledBadge>
                                    </Stack>
                                } {...a11yProps(1)} className={`${classes.tabTitle}  ${tab === 1 ? classes.activeTabTitle : null}`} />
                            </Tabs>
                        </Box>
                        <div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", marginRight: '5px' }}>
                                <div style={{ height: "48px", border: "1.5px solid rgba(199, 204, 211, 1)", width: "260px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                                    <input
                                        type="text"
                                        value={filterData.search}
                                        className={classes.EmployeesSearchInput}
                                        onChange={handleSearch}
                                        placeholder="Search by Name / ID"
                                    />
                                    <button
                                        type="button"
                                        style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "45px", height: "38px", border: "none", backgroundColor: "#FFFFFF", borderRadius: "6px", }}
                                    >
                                        <img src={Search} alt="Search" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "52px", height: "48px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}
                                    onClick={() => setDrawer("filter")}
                                >
                                    <FilterBadge overlap="circular" variant={indication ? 'dot' : null} ><img src={Filterlines} alt="Userplus" /></FilterBadge>

                                </button>
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_self_service_create" && item.is_allowed == true))) ?
                                        <Button startIcon={<EditIcon />} addNew onClick={() => navigate("/employee-self-service/raise-request")} sx={{ height: '48px !important', width: '186px !important' }}>
                                            Raise  Request
                                        </Button> :
                                        <Button addNewDisable sx={{ height: '48px !important', width: '186px !important' }}>
                                            <img src={disableEdit} alt='edit' style={{ marginRight: '10px' }} /> Raise  Request
                                        </Button>
                                }
                            </div>
                        </div>
                    </div>
                </Box>
                <Box >



                    <CustomTabPanel value={tab} index={0}>
                        <Box className={classes.mainContainer}>
                            {
                                loading ?
                                    [1, 2, 3, 4,].map((item) => (
                                        <Stack key={item} direction="row" my={0} px={2} py={2} spacing={2} sx={{ width: "100%", boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05)", borderRadius: "20px" }}>
                                            <Box sx={{ width: "70%", display: "flex", alignItems: "center", gap: 2, }}>
                                                <Skeleton variant="circular" sx={{ width: "56px", height: "50px" }} />
                                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Box>
                                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "10rem" }} />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "5rem" }} />
                                                            <Divider orientation="vertical" flexItem sx={{ border: '1px solid #FAFAF !important', borderRadius: '8px' }} />
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "3rem" }} />
                                                        </Box>

                                                    </Box>
                                                    <Box mr={15}>
                                                        <Skeleton variant="text" sx={{ fontSize: '16px', width: "7rem" }} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box sx={{ width: "30%", display: "flex", alignItems: "center", gap: 2, }}>

                                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: '0px 20px 0px 30px ' }}>
                                                    <Skeleton variant="circular" sx={{ height: '20px', width: '20px' }} />
                                                    <Skeleton variant="text" sx={{ fontSize: '10px', width: "2rem" }} />
                                                </Box>

                                            </Box>
                                        </Stack>
                                    ))
                                    : !loading && employees.length == 0 ?
                                        <Box sx={{ height: "50vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Text sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                                No records Found
                                            </Text>
                                        </Box> : !loading && employees.length > 0 ?
                                            employees.map((formData, key) => (
                                                <Grid container item className={classes.card} xs={12} key={key}>
                                                    <Grid container item lg={4.5} md={5} sm={8} xs={12} alignItems={'center'} pl={3} gap={'15px'} height={'86px !important'} flexWrap={'wrap'}>
                                                        <Avatar src={formData.profile_picture_url} ><Typography sx={{ textTransform: 'capitalize' }} >{formData.profile_picture_url === '' || formData.profile_picture_url === null ? formData.employee_name[0] : null}</Typography></Avatar>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'start', overflow: 'hidden', width: '150px', flexWrap: 'wrap' }}>
                                                            <Text mediumBlackColor sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize !important' }}>{formData.employee_name}</Text>
                                                            <Box sx={{ display: 'flex', height: '14px', overflow: 'hidden' }}>
                                                                <Text greyLabel sx={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>{formData.raised_on}</Text>
                                                                <Divider orientation="vertical" flexItem sx={{ border: '1px solid #737373 !important', marginX: '12px', borderRadius: '8px' }} />
                                                                <Text greyLabel sx={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>{formData.raised_time} </Text>
                                                            </Box>
                                                        </Box>
                                                        {
                                                            formData.re_assigned ? <ReassignedTag /> : null
                                                        }
                                                        {
                                                            formData.label == 'new' ? <NewTag /> : null
                                                        }
                                                    </Grid>
                                                    <Grid container item lg={3.5} md={3.5} sm={4} xs={6} pl={{ lg: '68px', xs: '35px' }} alignItems={'center'} height={'86px !important'}>
                                                        <Text mediumBlackColor sx={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>{formData.self_service_type_name}</Text>
                                                    </Grid>
                                                    <Grid container item lg={3.5} md={3.5} sm={3.5} xs={6} alignItems={'center'} justifyContent={'space-between'} p={{ lg: '0px 0px 0px 60px', xs: '0px 30px 0px 35px' }} height={'86px'}>
                                                        <HtmlTooltip placement='right' title={formData.status === 'Closed' ? 'Ticket Resolved' : 'Ticket Pending'} arrow>
                                                            <Box sx={{ cursor: 'pointer' }}>
                                                                {formData.status === 'Closed' ? <DoneIcon /> : <PendingIcon />}
                                                            </Box>
                                                        </HtmlTooltip>
                                                        <Box>
                                                            <Box
                                                                onClick={(e) => handleMenuClick(e, formData)}
                                                                sx={{ cursor: 'pointer' }}
                                                                id={`basic-menu-${key}`}
                                                                aria-controls={openMenu ? `basic-menu-${key}` : undefined}
                                                                aria-haspopup="true"
                                                                aria-expanded={openMenu ? 'true' : undefined}

                                                            >
                                                                <MenuIcon />
                                                            </Box>
                                                            <Menu
                                                                key={key}
                                                                id={`basic-menu-${key}`}
                                                                anchorEl={anchorEl}
                                                                open={openMenu}
                                                                onClose={handleMenuClose}
                                                                sx={{
                                                                    '& .MuiPaper-root': {
                                                                        boxShadow: 'none !important',
                                                                        border: '1px solid #EAECF0 !important',
                                                                        width: '140px !important',
                                                                    },
                                                                    "&:hover": {
                                                                        background: 'none !important'
                                                                    },
                                                                    '& .MuiList-root.MuiMenu-list': {
                                                                        padding: '0px !important',
                                                                    }
                                                                }}
                                                            >
                                                                <Divider sx={{ border: '1px solid #FFFF !important' }} />
                                                                {
                                                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_self_service_view" && item.is_allowed == true))) &&
                                                                    <MenuItem onClick={() => handleView(formData)} className={classes.viewText}>View</MenuItem>
                                                                }
                                                                {
                                                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_self_service_view" && item.is_allowed == true))) &&
                                                                    <MenuItem onClick={() => handleReAssign()} className={classes.viewText} >Re-Assign</MenuItem>
                                                                }
                                                            </Menu>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            )) : null
                            }
                        </Box>

                    </CustomTabPanel>
                    <CustomTabPanel value={tab} index={1}>
                        <Box className={classes.mainContainer}>
                            {
                                loading ?
                                    [1, 2, 3, 4,].map((item) => (
                                        <Stack key={item} direction="row" my={0} px={2} py={2} spacing={2} sx={{ width: "100%", boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05)", borderRadius: "20px" }}>
                                            <Box sx={{ width: "70%", display: "flex", alignItems: "center", gap: 2, }}>
                                                <Skeleton variant="circular" sx={{ width: "56px", height: "50px" }} />
                                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Box>
                                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "10rem" }} />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "5rem" }} />
                                                            <Divider orientation="vertical" flexItem sx={{ border: '1px solid #FAFAF !important', borderRadius: '8px' }} />
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "3rem" }} />
                                                        </Box>

                                                    </Box>
                                                    <Box mr={15}>
                                                        <Skeleton variant="text" sx={{ fontSize: '16px', width: "7rem" }} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box sx={{ width: "30%", display: "flex", alignItems: "center", gap: 2, }}>

                                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: '0px 20px 0px 30px ' }}>
                                                    <Skeleton variant="circular" sx={{ height: '20px', width: '20px' }} />
                                                    <Skeleton variant="text" sx={{ fontSize: '10px', width: "2rem" }} />
                                                </Box>

                                            </Box>
                                        </Stack>
                                    ))
                                    : !loading && raisedTickets.length == 0 ? <Box sx={{ height: "50vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Text sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                            No records Found
                                        </Text>
                                    </Box> : !loading && raisedTickets.length > 0 ?
                                        raisedTickets.map((formData, key) => (
                                            <Grid container item className={classes.card} xs={12} key={key}>
                                                <Grid container item lg={4.5} md={5} sm={8} xs={12} alignItems={'center'} pl={3} gap={'15px'} height={'86px !important'} flexWrap={'wrap'}>
                                                    <Avatar src={formData.profile_picture_url} ><Typography sx={{ textTransform: 'capitalize' }}>{formData.profile_picture_url === '' || formData.profile_picture_url === null ? formData.employee_name[0] : null}</Typography></Avatar>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'start', overflow: 'hidden', width: '150px', flexWrap: 'wrap' }}>
                                                        <Text mediumBlackColor sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize !important' }}>{formData.employee_name}</Text>
                                                        <Box sx={{ display: 'flex', height: '14px', overflow: 'hidden' }}>
                                                            <Text greyLabel sx={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>{formData.raised_on}</Text>
                                                            <Divider orientation="vertical" flexItem sx={{ border: '1px solid #737373 !important', marginX: '12px', borderRadius: '8px' }} />
                                                            <Text greyLabel sx={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>{formData.raised_time} </Text>
                                                        </Box>
                                                    </Box>

                                                    {/* {
                                                    formData.notification == 're_assigned' ? <ReassignedTag /> : null
                                                } */}
                                                    {
                                                        formData.label == 'new' ? <NewTag /> : null
                                                    }

                                                </Grid>
                                                <Grid container item lg={3.5} md={3.5} sm={4} xs={6} pl={{ lg: '75px', xs: '35px' }} alignItems={'center'} height={'86px !important'}>
                                                    <Text mediumBlackColor sx={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>{formData.self_service_type_name}</Text>
                                                </Grid>
                                                <Grid container item lg={3.5} md={3.5} sm={3.5} xs={6} alignItems={'center'} justifyContent={'space-between'} p={{ lg: '0px 0px 0px 60px', xs: '0px 30px 0px 35px' }} height={'86px'}>

                                                    <HtmlTooltip placement='right' title={formData.status === 'Closed' ? 'Ticket Resolved' : 'Ticket Pending'} arrow>
                                                        <Box sx={{ cursor: 'pointer' }}>
                                                            {formData.status === 'Closed' ? <DoneIcon /> : <PendingIcon />}
                                                        </Box>
                                                    </HtmlTooltip>
                                                    {
                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_self_service_view" && item.is_allowed == true))) ?
                                                            <Box onClick={() => handleView(formData)} sx={{ cursor: 'pointer' }}>
                                                                <Text mediumBlue wordWrap>View</Text>
                                                            </Box> :
                                                            <Box sx={{ cursor: 'default' }}>
                                                                <Text mediumGrey wordWrap>View</Text>
                                                            </Box>
                                                    }
                                                </Grid>
                                            </Grid>
                                        )) : null

                            }

                        </Box>
                    </CustomTabPanel>
                </Box>
                {filterData.raised ?
                    (!loading && raisedTickets.length > 0 &&
                        raisedPagination.totalPages ? raisedPagination.currentPage < raisedPagination.totalPages ?
                        <Box style={{ textAlign: "center", padding: "10px", }}>
                            <Button outlineBlue onClick={() => loading ? null : loadeMore()}> {loading ? "Loading..." : "Load more"}</Button>
                            {/* <button
                                onClick={() => loading ? null : loadeMore()}
                                type="button"
                                style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                            >
                                {loading ? "Loading..." : "Load more"}
                            </button> */}
                        </Box> : null : null)

                    :
                    (!loading && employees.length > 0 &&
                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                        <Box style={{ textAlign: "center", padding: "10px", }}>
                            <Button outlineBlue onClick={() => loading ? null : loadeMore()}> {loading ? "Loading..." : "Load more"}</Button>
                        </Box> : null : null)
                }
            </Box>



            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={false}
            >
                <DialogContent >
                    {popup ?



                        <Box sx={{ padding: '40px 30px 46px 30px !important', width: '562px !important', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Success />
                            <Text sx={{ marginTop: '32px !important', font: '18px Nunito', fontWeight: `${600} !important` }}>Ticket Assigned Sucessfully</Text>
                            <Text sx={{ marginTop: '8px !important', font: '14px Nunito', fontWeight: `${400} !important`, color: 'rgba(84, 89, 94, 0.6)' }}>This ticket has been assigned to
                                <span style={{ color: `${blue}` }}>{empList.length > 0 ? ` ${empList[0].display_name}` : ''}</span>
                                <span style={{ color: `${blue}` }}>.</span></Text>
                            <Button onClick={handleClose} addNew sx={{ width: '211px', mt: '32px' }}>Go Home</Button>

                        </Box> :

                        <Box sx={{ padding: '30px 30px 40px 30px !important', width: '540px !important' }}>
                            <Text mediumBlackColor sx={{ mb: '24px' }}>Re - Assign To</Text>
                            <Grid container rowSpacing={1}>
                                <Grid item xs={12}>
                                    <Box sx={{ minHeight: '70px' }}>

                                        <SearchSelect
                                            options={serviceTypes}
                                            name='self_service_types_id'
                                            value={reAssignData.self_service_types_id}
                                            labelText='Self Service Types'
                                            onChange={handleChange}
                                        />
                                        <Text errorText> {error.self_service_types_id ? error.self_service_types_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ minHeight: '70px' }}>
                                        <Autocomplete
                                            limitTags={2}
                                            multiple
                                            id="tags-outlined"
                                            options={empList}
                                            value={empList}
                                            getOptionLabel={(option) => option.display_name}
                                            defaultValue={''}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, key) => (
                                                    <Chip
                                                        key={key}
                                                        label={option && option.display_name}
                                                        sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                        onDelete

                                                    />
                                                ))}

                                            popupIcon={<KeyboardArrowDownSharpIcon />}
                                            ChipProps={{ deleteIcon: <ChipDeleteIcon /> }}
                                            clearIcon={false}
                                            disabled
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Assigned To"
                                                    // placeholder="Choose Category"
                                                    variant='filled'
                                                    className={classes.autoSelect}


                                                />
                                            )}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'end', gap: '16px', mt: '24px' }}>
                                <Button
                                    cancelSmall
                                    sx={{ height: '43px !important', minWidth: '98px !important', border: '1px solid #C7CCD3', font: '16px Nunito !important' }}
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    addNew
                                    sx={{ height: '43px !important', minWidth: '98px !important' }}
                                    onClick={handleAssign}
                                >Assign</Button>
                            </Box>
                        </Box>

                    }
                </DialogContent>
            </BootstrapDialog>




            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
                // onClose={toggleDrawer(false, state.view)}
                // onOpen={toggleDrawer(true, state.view)}
                transitionDuration={400}
                sx={{
                    ".MuiDrawer-paper ": {
                        borderRadius: '8px 0px 0px 8px !important',
                    },
                    "& .MuiBackdrop-root.MuiModal-backdrop": {
                        backgroundColor: 'rgba(0, 0, 0, 0.75) !important'
                    }
                }
                }
            >
                {
                    FilterView()
                }
            </SwipeableDrawer>

        </Box >
    );
}