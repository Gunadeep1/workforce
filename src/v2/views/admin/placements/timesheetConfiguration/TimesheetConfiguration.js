import { Box, Card, CardContent, CardHeader, Grid, Chip, Stack, Step, Stepper, Autocomplete, TextField, Slide, Breadcrumbs } from '@mui/material';
import Text from '../../../../components/customText/Text';
import { BrownMnCustomisedConnector, BrownMnColorlibStepLabel, BrownMnCustomStepIcon } from '../../../../theme';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Button from '../../../../components/customButton/Button';
import Input from '../../../../components/input/Input';
import CommonApi from '../../../../apis/CommonApi';
import LocalStorage from '../../../../utils/LocalStorage';
import TimesheetConfigurationStyles from './TimesheetConfigurationStyles';
import RadioGroup from '../../../../components/customButton/RadioGroup';
import Date from '../../../../components/datePicker/Date';
import { BlackToolTip, addWarningMsg, dateFormat } from '../../../../utils/utils';
import moment from 'moment';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import { isValid, validate_emptyField, } from '../../../../components/Validation';
import { useLocation, useNavigate } from 'react-router-dom';
import TimeSheetApi from '../../../../apis/admin/placements/TimeSheetApi';
import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';
import { Add, Remove } from "@mui/icons-material";
import InfoIcon from '../../../../assets/svg/Information.svg';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Text>{children}</Text>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function TimesheetConfiguration() {
    const location = useLocation();
    const placementID = location && location.state && location.state.id
    const clientID = location && location.state && location.state.clientDetails && location.state.clientDetails.client_id
    const clientStartDate = location && location.state && location.state.clientDetails
    const classes = TimesheetConfigurationStyles();
    const theme = useTheme();
    const [error, setError] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [dropdown, setDropdown] = useState([]);
    // const daylist = require('../../../../utils/jsons/Days.json');
    const [dayslist, setDaysList] = useState([]);
    const navigate = useNavigate()
    const [approvalsError, setApprovalsError] = useState([]);// eslint-disable-next-line
    const [readMode, setreadMode] = useState(false);
    const [timesheets, setTimesheets] = useState({
        request_id: LocalStorage.uid(),
        cycle_id: '',
        default_hours: '00:00',
        timesheet_settings_config_type: 1,
        day_start_id: '',
        timesheet_start_date: clientStartDate.start_date,
        ts_mandatory: "",
        timesheet_approval_config_type: 1,
        approvals: [{ id: "", approver_ids: [], rank: 1 }],
    })
    const [loading, setLoading] = useState(true);

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });

    useEffect(() => {
        if (timesheets.timesheet_settings_config_type == 1) {
            defaultTimesheetsConfig()
        } else if (timesheets.timesheet_settings_config_type == 2) {
            clientTimesheetsConfig()
        } else if (timesheets.timesheet_approval_config_type == 1) {
            getDefaultApprovalConfig();
        }
        else if (timesheets.timesheet_approval_config_type == 2) {
            getClientApprovalConfig()
        }
        getApprovalDropdownList();
        getCycledropdown();
        daysDropdown();
        // eslint-disable-next-line 
    }, [])

    const statusItems = [
        { id: 1, title: <Text mediumBlack>Default Configuration</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>Client Configuration</Text>, value: 2 },
        { id: 3, title: <Text mediumBlack>Custom Configuration</Text>, value: 3 },
    ]

    const timesheetsOptions = [
        { id: 1, title: <Text mediumBlack>Mandatory</Text>, value: true },
        { id: 2, title: <Text mediumBlack>Non-Mandatory</Text>, value: false },
    ]

    //Dropdown API for employees list
    const getApprovalDropdownList = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmployees(response.data.data);
            }
        });
    };

    //Dropdown API for cycle
    const getCycledropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDropdown(response.data.data);
            }
        });
    }

    //Dropdown API for days
    const daysDropdown = () => {
        TimeSheetApi.getDaysDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDaysList(response.data.data);
            }
        });
    };

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setTimesheets({
            ...timesheets,
            [name]: moment(date).format(dateFormat()),
            day_start_id: moment(date).day()
        }, handleValidate(event))
    }

    const changeHandler = (e) => {
        if (e.target.name == 'cycle_id') {
            timesheets[e.target.name] = e.target.value
            if (e.target.value == 2 || e.target.value == '2') {
                let a = moment(timesheets.timesheet_start_date).day()
                timesheets['day_start_id'] = a
            } else {
                timesheets['day_start_id'] = ''
            }
            setTimesheets({ ...timesheets })
        } else {
            setTimesheets({
                ...timesheets,
                [e.target.name]: e.target.value
            });
        }
        handleValidate(e);
    }

    const handleValidate = (e) => {
        const input = e.target
        switch (input.name || input.tagName) {
            case 'timesheet_start_date':
                error.timesheet_start_date = validate_emptyField(input.value)
                break
            case 'day_start_id':
                error.day_start_id = validate_emptyField(input.value)
                break
            case 'default_hours':
                error.default_hours = validate_emptyField(input.value)
                break;
            case 'cycle_id':
                error.cycle_id = validate_emptyField(input.value)
                break;
            case 'ts_mandatory':
                error.ts_mandatory = validate_emptyField(input.value)
                break
            default:
                break
        }
        setError({ ...error })
    }

    const handleChangeDefaultHours = (e) => {
        // if (e.target.name == "default_hours") {
        let input = e.target.value.replace(/\D/g, "").substring(0, 5);
        const first = input.substring(0, 2);
        const second = input.substring(2, 4);
        if (input.length > 2) {
            setTimesheets({ ...timesheets, [e.target.name]: `${first}:${second}` });
        } else {
            setTimesheets({ ...timesheets, [e.target.name]: input });
        }
        if (input.length > 2) {
            var mm = parseInt(second);
            if (mm > 59) {
                if (first < 23) {
                    var sec = second - 60;
                    var fOne = parseInt(first) + 1;
                    setTimesheets({ ...timesheets, [e.target.name]: `0${fOne}:${sec}` });
                    handleValidate(e);
                } else {
                    setTimesheets({ ...timesheets, [e.target.name]: `${first}:${59}` });
                    handleValidate(e);
                }
            } else {
                setTimesheets({ ...timesheets, [e.target.name]: `${first}:${second}` });
                handleValidate(e);
            }
        } else if (input.length >= 0) {
            var hh = parseInt(input);
            if (hh > 23) {
                timesheets[e.target.name] = "23";
            } else {
                timesheets[e.target.name] = input;
            }
            setTimesheets({ ...timesheets });
            handleValidate(e);

        }
        // }

    };


    const TimesheetErrors = () => {
        let { cycle_id, default_hours, day_start_id, timesheet_start_date, ts_mandatory } = timesheets
        let errors = {};
        if (cycle_id === 1 || cycle_id === 2) {
            errors.day_start_id = validate_emptyField(day_start_id)
        }
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.default_hours = validate_emptyField(default_hours);
        errors.timesheet_start_date = validate_emptyField(timesheet_start_date);
        errors.ts_mandatory = validate_emptyField(ts_mandatory);
        return errors;
    }

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleChangeLevels = (e, newArr, index) => {
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newArr[newArr.length - 1];
            let approvals = timesheets.approvals
            let approverIdsArr = approvals[index].approver_ids;
            if (approverIdsArr.filter((i) => i.employee_id === id).length == 0) {
                approverIdsArr.push({ id: "", employee_id: id, full_name: value });
                setTimesheets((prev) => ({ ...prev, approvals }))
            }
            multiLevelsValidations(approvals, "approvals", index);
        }
    }

    const multiLevelsValidations = (arr, target, index) => {
        let err = approvalsError;
        arr.forEach((ele, key) => {
            if (key === index) {
                if (ele.approver_ids.length === 0) {
                    err[key][target] = "This field is required";
                } else {
                    err[key][target] = "";
                }
            }
        });
        setApprovalsError([...err]);
    }

    const handleDeleteChipLevels = (key, index) => {
        let approvals = timesheets.approvals;
        let newArr = approvals[index].approver_ids;
        newArr.splice(key, 1);
        setTimesheets({ ...timesheets, approvals })
        multiLevelsValidations(approvals, "approvals", index);
    }

    const timesheetsAddlevel = () => {
        let arr = timesheets.approvals;
        let errorsArr = approvalsError || [];
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        },);
        errorsArr.push({});
        setTimesheets({ ...timesheets, approvals: arr });
        setApprovalsError([...errorsArr]);
    }

    const handleRemoveLevel = (index) => {
        let arr = timesheets.approvals;
        let errorsArr = approvalsError;
        arr.splice(index, 1);
        errorsArr.splice(index, 1);
        arr.forEach((ele, key) => {
            ele.rank = key + 1;
        });
        setTimesheets({ ...timesheets, approvals: arr });
        setApprovalsError([...errorsArr]);
    }

    const handleChangeConfigSetting = (e, config) => {
        if (config == "config") {
            timesheets['timesheet_settings_config_type'] = e.target.value
            setTimesheets({ ...timesheets })
            if (e.target.value == 1 || e.target.value == '1') {
                defaultTimesheetsConfig();
                setError({});
            } else if (e.target.value == 2 || e.target.value == '2') {
                clientTimesheetsConfig();
                setError({});
            } else if (e.target.value == 3 || e.target.value == '3') {
                timesheets['cycle_id'] = ''
                timesheets['day_start_id'] = ''
                timesheets['default_hours'] = ''
                setTimesheets({
                    ...timesheets,
                    cycle_id: '',
                    default_hours: '00:00',
                    timesheet_settings_config_type: 3,
                    day_start_id: "",
                    ts_mandatory: "",
                    timesheet_start_date: clientStartDate.start_date,
                });
                setError({});
            }
        }

        if (config == "approvalconfig") {
            timesheets['timesheet_approval_config_type'] = e.target.value
            setTimesheets({ ...timesheets })
            if (e.target.value == 1 || e.target.value == '1') {
                getDefaultApprovalConfig();
                setApprovalsError([]);
            } else if (e.target.value == 2 || e.target.value == '2') {
                getClientApprovalConfig();
                setApprovalsError([]);
            } else if (e.target.value == 3 || e.target.value == '3') {
                setTimesheets({
                    ...timesheets,
                    approvals: [{ approver_ids: [], rank: 1 }],
                    timesheet_approval_config_type: 3,
                });
                setApprovalsError([]);
            }
        }
    };

    const getDefaultApprovalConfig = () => {
        setLoading(true);
        TimeSheetApi.getApprovalConfigurationTimesheet(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    for (let i = 0; i < response.data.data.length; i++) {
                        timesheets['approvals'] = response.data.data[i].approvals
                        setTimesheets({ ...timesheets })
                    }
                } else {
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setTimesheets({
                        ...timesheets,
                        approvals: [{ approver_ids: [], rank: 1 }],
                        timesheet_approval_config_type: 1,
                    });
                }
            } else {
                addErrorMsg(response.data.message);
            }
        })
    }

    const getClientApprovalConfig = () => {
        setLoading(true);
        TimeSheetApi.getClientApprovalTimesheetConfig(LocalStorage.uid(), LocalStorage.getAccessToken(), clientID).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    for (let i = 0; i < response.data.data.length; i++) {
                        timesheets['approvals'] = response.data.data[i].approvals
                        setTimesheets({
                            ...timesheets,
                            timesheet_approval_config_type: 2,
                        })
                    }
                } else {
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setTimesheets({
                        ...timesheets,
                        approvals: [{ approver_ids: [], rank: 1 }],
                        timesheet_approval_config_type: 2,
                    });
                }
            } else {
                addErrorMsg(response.data.message);
            }
        })
    };

    const defaultTimesheetsConfig = () => {
        setLoading(true);
        TimeSheetApi.getDefaulTimesheetConfig(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    timesheets['cycle_id'] = response.data.data[0].cycle_id
                    timesheets['day_start_id'] = response.data.data[0].day_start_id
                    timesheets['default_hours'] = response.data.data[0].default_hours
                    timesheets['ts_mandatory'] = response.data.data[0].ts_mandatory
                    timesheets['timesheet_start_date'] = clientStartDate.start_date
                    timesheets['timesheet_settings_config_type'] = 1
                    setTimesheets({
                        ...timesheets,
                        timesheet_settings_config_type: 1,
                        default_hours: response.data.data[0].default_hours,
                        cycle_id: response.data.data[0].cycle_id,
                        day_start_id: response.data.data[0].day_start_id,
                        ts_mandatory: response.data.data[0].ts_mandatory,
                        timesheet_start_date: clientStartDate.start_date,
                        approvals: [{ id: "", approver_ids: [], rank: 1 }],
                    })
                } else {
                    addWarningMsg('Default configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setTimesheets({
                        ...timesheets,
                        cycle_id: '',
                        default_hours: '00:00',
                        timesheet_settings_config_type: 1,
                        day_start_id: "",
                        ts_mandatory: "",
                        timesheet_start_date: clientStartDate.start_date,
                    });
                }
            } else {
                setTimesheets({
                    ...timesheets,
                    cycle_id: '',
                    default_hours: '00:00',
                    timesheet_settings_config_type: 1,
                    day_start_id: "",
                    ts_mandatory: "",
                    timesheet_start_date: clientStartDate.start_date,
                });
            }
        })
    }

    const clientTimesheetsConfig = () => {
        setLoading(true);
        TimeSheetApi.getClientTimesheetApproval(LocalStorage.uid(), clientID, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    setTimesheets({
                        ...timesheets,
                        default_hours: response.data.data[0].default_hours,
                        cycle_id: response.data.data[0].cycle_id,
                        day_start_id: response.data.data[0].day_start_id,
                        ts_mandatory: response.data.data[0].ts_mandatory,
                        approvals: [{ id: "", approver_ids: [], rank: 1 }],
                        timesheet_start_date: clientStartDate.start_date,
                        timesheet_settings_config_type: 2,
                    });
                } else {
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setTimesheets({
                        ...timesheets,
                        cycle_id: '',
                        default_hours: '00:00',
                        timesheet_settings_config_type: 2,
                        day_start_id: "",
                        ts_mandatory: "",
                        timesheet_start_date: clientStartDate.start_date,
                    });
                }
            } else {
                setTimesheets({
                    ...timesheets,
                    cycle_id: '',
                    default_hours: '00:00',
                    timesheet_settings_config_type: 2,
                    day_start_id: "",
                    ts_mandatory: "",
                    timesheet_start_date: clientStartDate.start_date,
                });
            }
        });
    };

    const handleSubmit = () => {
        let tserrors = TimesheetErrors();
        let multiLevelErrors = multiLevelSubmitValidation();
        if (activeStep === 0) {
            if (isValid(tserrors)) {
                setActiveStep(activeStep + 1);
                setValue(value + 1)
            } else {
                let s = { error }
                s = tserrors;
                setError(s);
            }
        } else if (activeStep === 1) {
            timesheets['placement_id'] = placementID
            if (isValid(tserrors) && multiLevelErrors) {
                TimeSheetApi.timesheetStore(timesheets, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        navigate('/placements/addPlacement', { state: { actionState: 'addFlow' } });
                        addSuccessMsg('Timesheets Added successfully');
                    } else {
                        addErrorMsg(res.data.message);
                    }
                });
            } else {
                let s = { error };
                s = tserrors;
                setError(s);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        }
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = timesheets.approvals;
        let err = approvalsError || [{}];
        let result = [];
        if (activeStep == 1) {
            approvalsArr.forEach((ele, key) => {
                if (err.length < key + 1) {
                    err.push({});
                }
                if (ele.approver_ids.length === 0) {
                    err[key].approvals = "This field is required";
                    result.push(key);
                } else {
                    err[key].approvals = "";
                    result.splice(key, 1);
                }
                setApprovalsError([...err]);
            });
            setApprovalsError([...err]);
            return result.length === 0;
        }
    }

    const back = () => {
        if (activeStep == 0) {
            navigate('/placements/addPlacement', { state: { actionState: 'cancel' } })
        } else {
            setActiveStep(activeStep - 1);
            setValue(value - 1)
            setApprovalsError([]);
        }
    }

    return (
        <Grid container justifyContent='center' pb={5} className={classes.mainGrid}>
            <Grid container position='fixed' justifyContent='center' zIndex='100' sx={{ background: '#FFFFFF' }} pt={2} pl={{ lg: 14, md: 12, sm: 11, xs: 11 }}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/dashboard')}>Placement Dashboard</Text>
                        <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>All Placements</Text>
                        <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/addPlacement', { state: { actionState: 'cancel' } })}>Add placements</Text>
                        <Text mediumBlack>Add Timesheet Configuration</Text>
                    </Breadcrumbs>
                </Grid>
                <Grid item container lg={7} md={10} sm={11} xs={11} justifyContent='center'>
                    <Grid item lg={8} md={8} sm={10} xs={12} pt={2} textAlign='center' p={'30px 0px !important'}>
                        <Stepper activeStep={activeStep} connector={<BrownMnCustomisedConnector />}>
                            <Step  >
                                <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                                    <Text BrowmnMnStepperText>Timesheet Configuration</Text>
                                </BrownMnColorlibStepLabel>
                            </Step>
                            <Step>
                                <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                                    <Text BrowmnMnStepperText>Timesheet Approval Configuration</Text>
                                </BrownMnColorlibStepLabel>
                            </Step>
                        </Stepper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={7} md={10} sm={11} xs={12} mt={14} pl={{ lg: 0, md: 8, sm: 0, xs: 0 }}>
                <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}
                    springConfig={{
                        duration: '0.3s',
                        easeFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        delay: '0s',
                    }}>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Card sx={{ padding: '15px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>{activeStep == 0 ? 'Timesheet Configuration' : activeStep == 1 ? 'Timesheet Approval Configuration' : ''}</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '30px  25px 30px  25px !important' }}
                            >
                                {
                                    activeStep == 0 &&
                                    <>
                                        {
                                            loading ?
                                                <Grid container spacing={2} pt={3}>
                                                    <Grid item lg={9} md={9} sm={9} xs={10}>
                                                        <Input formControlProps={{ fullWidth: true }} formInput />
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={2}>
                                                        <Box sx={{ height: '55px', width: '50px', background: '#f4f4f4', borderRadius: '9px' }}></Box>
                                                    </Grid>
                                                </Grid> :
                                                <Grid container spacing={2} columnSpacing={3} alignItems='center'>
                                                    <Box pl={'22px'}>
                                                        <RadioGroup
                                                            row
                                                            name="timesheet_settings_config_type"
                                                            value={timesheets.timesheet_settings_config_type}
                                                            items={statusItems}
                                                            onChange={(e) => handleChangeConfigSetting(e, "config")}
                                                            disabled={readMode}
                                                        />
                                                    </Box>
                                                    <Grid container spacing={0} pt={2}>
                                                        <Grid item lg={6} md={6} sm={12} xs={12} pl={2}>
                                                            <Box p={1}>
                                                                <SearchSelect
                                                                    name='cycle_id'
                                                                    value={timesheets.cycle_id}
                                                                    options={dropdown}
                                                                    disabled={timesheets.timesheet_settings_config_type != 3 || readMode}
                                                                    onChange={changeHandler}
                                                                    labelText={<Text largeLabel>Timesheet Cycle</Text>}
                                                                    helperText={
                                                                        timesheets.timesheet_settings_config_type == 3 && error.cycle_id &&
                                                                        <span className={classes.helperTextError}>{error.cycle_id}</span>
                                                                    }
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <Box p={1}>
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        name: 'default_hours',
                                                                        value: timesheets.default_hours,
                                                                        disabled: timesheets.timesheet_settings_config_type != 3 || readMode,
                                                                    }}
                                                                    handleChange={handleChangeDefaultHours}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>Default Hours</Text>}
                                                                    helperText={
                                                                        error.default_hours &&
                                                                        <span className={classes.helperTextError}>{error.default_hours}</span>
                                                                    }
                                                                />
                                                                {/* <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        name: 'default_hours',
                                                                        value: timesheets.default_hours,
                                                                        type: 'time',
                                                                        disabled: timesheets.timesheet_settings_config_type != 3 || readMode,
                                                                    }}
                                                                    handleChange={handleChangeDefaultHours}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>Default Hours</Text>}
                                                                    helperText={
                                                                        timesheets.timesheet_settings_config_type == 3 && error.default_hours &&
                                                                        <span className={classes.helperTextError}>{error.default_hours}</span>
                                                                    }
                                                                /> */}
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12} >
                                                            <Box mt={'1px'} p={1} ml={2}>
                                                                <Date
                                                                    labelText={<Text largeLabel>Start Date
                                                                        <BlackToolTip arrow placement='right' title={
                                                                            <Text mediumWhite sx={{ padding: '5px !important' }}>Timesheets will be generated automatically based on Custom Configurations</Text>
                                                                        }>
                                                                            <img src={InfoIcon} alt="InfoIcon" style={{ height: '15px', width: '15px', margin: '3px 0px 0px 5px', cursor: 'pointer' }} />
                                                                        </BlackToolTip>
                                                                    </Text>}
                                                                    name='timesheet_start_date'
                                                                    value={timesheets.timesheet_start_date}
                                                                    height='53px'
                                                                    minDate={clientStartDate.start_date}
                                                                    maxDate={clientStartDate.end_date}
                                                                    onChange={(value => dateChange(value, 'timesheet_start_date'))}
                                                                />
                                                                {
                                                                    timesheets.timesheet_settings_config_type == 3 && error.timesheet_start_date ?
                                                                        <Text red>{error.timesheet_start_date ? error.timesheet_start_date : ''}</Text> : ''
                                                                }
                                                            </Box>
                                                        </Grid>
                                                        {
                                                            (timesheets.cycle_id == '1' || timesheets.cycle_id == '2') &&
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Box p={1} pl={1}>
                                                                    <SearchSelect
                                                                        name='day_start_id'
                                                                        value={timesheets.day_start_id}
                                                                        options={dayslist}
                                                                        onChange={changeHandler}
                                                                        disabled={(timesheets.timesheet_settings_config_type == 3 && timesheets.cycle_id == 2) || timesheets.timesheet_settings_config_type != 3 || readMode}
                                                                        labelText={<Text largeLabel>Day Starts From</Text>}
                                                                        helperText={
                                                                            timesheets.timesheet_settings_config_type == 3 && error.day_start_id &&
                                                                            <span className={classes.helperTextError}>{error.day_start_id}</span>
                                                                        }
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                        }
                                                        <Grid item lg={12} md={12} sm={12} xs={12} mt={2} pl={2}>
                                                            <Stack direction='row' spacing={2}>
                                                                <Text mediumGrey p={1}>Timesheet Submission</Text>
                                                                <Box>
                                                                    <RadioGroup
                                                                        row
                                                                        name="ts_mandatory"
                                                                        value={timesheets.ts_mandatory}
                                                                        onChange={changeHandler}
                                                                        items={timesheetsOptions}
                                                                        disabled={timesheets.timesheet_settings_config_type != 3 || readMode}
                                                                    />

                                                                </Box>

                                                            </Stack>
                                                            {
                                                                timesheets.timesheet_settings_config_type == 3 && error.ts_mandatory ?
                                                                    <Text red>{error.ts_mandatory ? error.ts_mandatory : ''}</Text> : ''
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                        }
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Card sx={{ padding: '20px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>{activeStep == 0 ? 'Timesheet Configuration' : activeStep == 1 ? 'Timesheet Approval Configuration' : ''}</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '30px 40px 30px 40px !important' }}
                            >
                                {
                                    activeStep == 1 &&
                                    <Grid container spacing={2} columnSpacing={3} alignItems='center'>
                                        <Grid container spacing={0} >
                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Box pl={'2px'}>
                                                    <RadioGroup
                                                        row
                                                        name="timesheet_approval_config_type"
                                                        value={timesheets.timesheet_approval_config_type}
                                                        items={statusItems}
                                                        onChange={(e) => handleChangeConfigSetting(e, "approvalconfig")}
                                                        disabled={readMode}
                                                    />
                                                </Box>
                                            </Grid>
                                            {timesheets.approvals.map((i, key) => (
                                                <>
                                                    {
                                                        loading ?
                                                            <Grid container spacing={2} pt={3}>
                                                                <Grid item lg={9} md={9} sm={9} xs={10}>
                                                                    <Input formControlProps={{ fullWidth: true }} formInput />
                                                                </Grid>
                                                                <Grid item lg={3} md={3} sm={3} xs={2}>
                                                                    <Box sx={{ height: '55px', width: '50px', background: '#f4f4f4', borderRadius: '9px' }}></Box>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            <>
                                                                <Grid item lg={9} md={9} sm={9} xs={10} mt={1}>
                                                                    <Box my={1} mx={1}>
                                                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                                            <div style={{ width: '100%', paddingTop: i && i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '69px', display: 'flex', alignItems: "center", }}>
                                                                                <Autocomplete
                                                                                    multiple
                                                                                    limitTags={2}
                                                                                    id="multiple-limit-tags"
                                                                                    options={employees}
                                                                                    getOptionLabel={(option) => option.value}
                                                                                    renderOption={(props, option) => (
                                                                                        <li {...props} key={option.uniqueIdentifier}>
                                                                                            {option.value}
                                                                                        </li>
                                                                                    )}
                                                                                    value={i.approver_ids}
                                                                                    renderInput={(params) => (
                                                                                        <TextField {...params} label={`Level ${key + 1} Approvals`} className={classes.multiSelectinputLabel} pt={2} />
                                                                                    )}
                                                                                    onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                                                                                    disabled={timesheets.timesheet_approval_config_type != 3 || readMode}
                                                                                    renderTags={(value, getTagProps) =>
                                                                                        value.map((option, keyId) => (
                                                                                            <Chip
                                                                                                {...getTagProps({ keyId })}
                                                                                                key={keyId}
                                                                                                label={option && option.full_name}
                                                                                                sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                                onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                                disabled={timesheets.timesheet_approval_config_type != 3 || readMode}
                                                                                            // deleteIcon={<DeleteIcon />}
                                                                                            />
                                                                                        ))
                                                                                    }
                                                                                    sx={{
                                                                                        width: '100%',
                                                                                        "& .MuiInputBase-root": {
                                                                                            cursor: "pointer",
                                                                                        },
                                                                                        "& .MuiInputBase-input": {
                                                                                            cursor: "pointer",
                                                                                        },
                                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                                            border: "none"
                                                                                        },
                                                                                        "& .MuiAutocomplete-endAdornment": {
                                                                                            display: "none"
                                                                                        },
                                                                                        "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
                                                                                            transform: "translate(10px, 16px) scale(1);"
                                                                                        },
                                                                                        "& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root": {
                                                                                            color: "#737373",
                                                                                            fontSize: "14px",
                                                                                            fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                        "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
                                                                                            color: "#737373",
                                                                                            fontSize: "16px",
                                                                                            fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                            fontWeight: 500,
                                                                                        },
                                                                                        "&.Mui-focused .MuiInputLabel-outlined": {
                                                                                            color: "#737373",
                                                                                            fontSize: "10px",
                                                                                            fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                            fontWeight: 400,
                                                                                            transform: i.approver_ids.length === 0 ? "translate(12px, 0px) scale(1);" : "translate(12px, -8px) scale(1);"
                                                                                        },
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </Box>
                                                                        {timesheets.timesheet_approval_config_type == 3 ? <Text errorText> {approvalsError.length > 0 && approvalsError[key] && approvalsError[key].approvals ? approvalsError[key].approvals : ""}</Text> : ""}
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} md={3} sm={3} xs={2}>
                                                                    {timesheets ? (
                                                                        <Box pt={5}>
                                                                            {timesheets.approvals.length - 1 === key ? (
                                                                                <>
                                                                                    <>
                                                                                        {
                                                                                            !readMode && timesheets.timesheet_approval_config_type == 3 ?
                                                                                                <Add className={classes.add} onClick={() => timesheetsAddlevel()} /> :
                                                                                                <Add className={classes.disabledColor} />
                                                                                        }
                                                                                    </>
                                                                                    {timesheets.approvals.length > 1 ? (
                                                                                        <>
                                                                                            {
                                                                                                !readMode && timesheets.timesheet_approval_config_type == 3 ?
                                                                                                    <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                                    <Remove className={classes.disabledColor} />
                                                                                            }
                                                                                        </>
                                                                                    ) : null}
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {
                                                                                        !readMode && timesheets.timesheet_approval_config_type == 3 ?
                                                                                            <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                            <Remove className={classes.disabledColor} />
                                                                                    }
                                                                                </>
                                                                            )}
                                                                        </Box>
                                                                    ) : ''}
                                                                </Grid>
                                                            </>
                                                    }
                                                </>
                                            ))}
                                        </Grid>
                                    </Grid>

                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                </SwipeableViews>
                <Grid item container justifyContent='end'>
                    <Stack display='flex' direction='row' spacing={2} justifyContent='center' pt={'10px'} pr={3}>
                        <Button popupCancel onClick={back}>Back</Button>
                        <Button popupSaveBlue onClick={handleSubmit}>{activeStep == 0 ? 'Next' : 'Save'}</Button>
                    </Stack>
                </Grid>
            </Grid >
        </Grid >
    )
}

export default TimesheetConfiguration

