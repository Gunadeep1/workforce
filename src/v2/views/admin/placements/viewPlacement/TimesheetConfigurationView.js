import React, { useState, useEffect, Fragment } from 'react'
import { Box, Grid, Skeleton, Autocomplete, TextField, Chip, Divider, Stack } from '@mui/material';
// import timesheetsStyles from './InvoiceViewStyles';
import LocalStorage from '../../../../utils/LocalStorage';
import TimeSheetApi from '../../../../apis/admin/placements/TimeSheetApi';
import Date from '../../../../components/datePicker/Date';
import Input from '../../../../components/input/Input';
import { dateFormat, addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../utils/utils';
import Text from '../../../../components/customText/Text';
import { isValid, validate_emptyField, } from '../../../../components/Validation';
import CommonApi from '../../../../apis/CommonApi';
import moment from 'moment';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import RadioGroup from '../../../../components/customButton/RadioGroup';
import { Add, Remove } from "@mui/icons-material";
import edit from "../../../../assets/images/edit.png";
import LoadingButton from '../../../../components/customButton/LoadingButton';
import TimesheetConfigurationStyles from '../timesheetConfiguration/TimesheetConfigurationStyles';
import Button from '../../../../components/customButton/Button';
// import verified from "../../../../assets/images/verified.png"

function TimesheetConfigurationView({ actionState, id, setViewState, clientDetails, getPlacementDetails, placement }) {

    const classes = TimesheetConfigurationStyles();
    const [action, setAction] = useState(actionState);
    const clientID = clientDetails.client_id
    const [dayslist, setDaysList] = useState([]);
    const [error, setError] = useState({});
    const [getloading, setGetloading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropdown, setDropdown] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [approvalsError, setApprovalsError] = useState([{}]);// eslint-disable-next-line
    const [deletedLevels, setDeletedLevels] = useState([]);
    const [deletedchips, setDeletedchips] = useState([]);
    let endDate = moment(moment(placement.timesheet_last_action_date, dateFormat()).add(1, 'days')).format(dateFormat());
    const tsStartDate = placement.timesheet_details && placement.timesheet_details[0] && placement.timesheet_details[0].timesheet_start_date
    const [timesheets, setTimesheets] = useState(
        {
            timesheet_settings_config_type: 1,
            timesheet_approval_config_type: 1,
            ts_mandatory: true,
            cycle_id: "",
            day_start_id: '',
            default_hours: "",
            timesheet_start_date: endDate,
            approvals: [
                {
                    id: "",
                    rank: "",
                    approver_ids: []
                }
            ],
            delete_user_ids: [],
            delete_approval_level_ids: []
        }
    );

    useEffect(() => {
        getTimesheetConfiguration();
        getApprovalDropdownList();
        cycleDropdown();
        daysDropdown();
        // eslint-disable-next-line
    }, [])

    const getApprovalDropdownList = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmployees(response.data.data);
            }
        });
    };

    const cycleDropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDropdown(response.data.data);
            }
        });
    };


    //Dropdown API for days
    const daysDropdown = () => {
        TimeSheetApi.getDaysDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDaysList(response.data.data);
            }
        });
    };

    const getTimesheetConfiguration = () => {
        setGetloading(true);
        TimeSheetApi.getTimesheetConfiguration(id).then((response) => {
            setTimeout(() => {
                setGetloading(false)
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        if (response.data.data[0].approvals.length > 0 && response.data.data[0].approvals[0].approver_ids.length != 0) {
                            setTimesheets({
                                ...response.data.data[0],
                                timesheet_start_date: endDate,
                                day_start_id: moment(endDate).day()
                            });
                        } else {
                            setTimesheets({
                                ...response.data.data[0],
                                approvals: [
                                    {
                                        approver_ids: [],
                                        rank: 1,
                                    },
                                ],
                            });
                        }
                    } else {
                        setTimesheets({ ...timesheets });
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

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
                    setTimesheets({
                        ...timesheets,
                        timesheet_settings_config_type: 1,
                        default_hours: response.data.data[0].default_hours,
                        cycle_id: response.data.data[0].cycle_id,
                        day_start_id: response.data.data[0].day_start_id,
                        ts_mandatory: response.data.data[0].ts_mandatory,
                        // approvals: [{ id: "", approver_ids: [], rank: 1 }],
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
                });
            }
        });
    };

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
                        // approvals: [{ id: "", approver_ids: [], rank: 1 }],
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
                });
            }
        });
    };

    const updateTimesheetConfiguration = () => {
        let data = { ...timesheets, request_id: LocalStorage.uid(), delete_user_ids: [], delete_approval_level_ids: [] }
        deletedLevels.forEach(ele => {
            data.delete_approval_level_ids.push(ele.id);
        });
        deletedchips.forEach(ele => {
            data.delete_user_ids.push(ele.id);
        });
        setLoading(true)
        TimeSheetApi.updateTimesheetConfiguration(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    getTimesheetConfiguration();
                    setAction("read");
                    setViewState('');
                    getPlacementDetails(id);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleChangeConfigSetting = (e, config) => {
        if (config == "config") {
            // timesheets['timesheet_settings_config_type'] = e.target.value
            setTimesheets({ ...timesheets })
            if (e.target.value == 1 || e.target.value == '1') {
                defaultTimesheetsConfig();
                setError({});
            } else if (e.target.value == 2 || e.target.value == '2') {
                clientTimesheetsConfig();
                setTimesheets({
                    ...timesheets,
                    timesheet_settings_config_type: 2,
                });
                setError({});
            } else if (e.target.value == 3 || e.target.value == '3') {
                timesheets['timesheet_start_date'] = endDate
                setTimesheets({
                    ...timesheets,
                    cycle_id: '',
                    default_hours: '00:00',
                    timesheet_settings_config_type: 3,
                    day_start_id: "",
                    ts_mandatory: '',
                });
            }
        }

        if (config == "approvalconfig") {
            setTimesheets({ ...timesheets })
            if (e.target.value == 1 || e.target.value == '1') {
                getDefaultApprovalConfig();
                setError({});
            } else if (e.target.value == 2 || e.target.value == '2') {
                getClientApprovalConfig();
                setApprovalsError([])
            } else if (e.target.value == 3 || e.target.value == '3') {
                setTimesheets({
                    ...timesheets,
                    approvals: [{ approver_ids: [], rank: 1 }],
                    timesheet_approval_config_type: 3,
                });
                setApprovalsError([])
            }
        }
    };

    const getDefaultApprovalConfig = () => {
        TimeSheetApi.getApprovalConfigurationTimesheet(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data.length > 0) {
                    let data = response.data.data;
                    setTimesheets({
                        ...timesheets,
                        approvals: data[0].approvals,
                        timesheet_approval_config_type: 1,
                    });
                } else {
                    addWarningMsg('Default configurations have not been completed. Please configure the client module to reflect the changes here.');
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
        TimeSheetApi.getClientApprovalTimesheetConfig(LocalStorage.uid(), LocalStorage.getAccessToken(), clientID).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data.length > 0) {
                    let data = response.data.data;
                    setTimesheets({
                        ...timesheets,
                        timesheet_approval_config_type: 2,
                        approvals: data[0].approvals,
                    });
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
    };

    const changeHandler = (e) => {
        if (e.target.name == 'cycle_id') {
            timesheets[e.target.name] = e.target.value
            if (e.target.value == 2 || e.target.value == '2') {
                let a = moment(timesheets.timesheet_start_date).day()
                timesheets['day_start_id'] = a
            } else {
                timesheets['day_start_id'] = ''
            }
            setTimesheets({ ...timesheets }, handleValidate(e))
        } else {
            setTimesheets({
                ...timesheets,
                [e.target.name]: e.target.value
            }, handleValidate(e));
        }
    }

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
        setApprovalsError(err);
    }


    const handleDeleteChipLevels = (key, index) => {
        let approvals = timesheets.approvals;
        let newArr = approvals[index].approver_ids;
        let deletedChipsArr = deletedchips;
        if (newArr[key].id !== '') {
            deletedChipsArr.push(newArr[key]);
        }
        newArr.splice(key, 1);
        setTimesheets({ ...timesheets, approvals })
        multiLevelsValidations(approvals, "approvals", index);
        setDeletedchips([...deletedChipsArr]);
    }

    const handleAddLevel = () => {
        let arr = timesheets.approvals;
        let errorsArr = approvalsError;
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        },);
        errorsArr.push({});

        setTimesheets({ ...timesheets, approvals: arr });
        setApprovalsError(errorsArr);
    }

    const handleRemoveLevel = (index) => {
        let arr = timesheets.approvals;
        let errorsArr = approvalsError;
        let deletedLevelArr = deletedLevels;
        if (arr[index].id !== '') {
            deletedLevelArr.push(arr[index]);
        }
        arr.splice(index, 1);
        errorsArr.splice(index, 1);
        arr.forEach((ele, key) => {
            ele.rank = key + 1;
        });
        setTimesheets({ ...timesheets });
        setApprovalsError(errorsArr);
        setDeletedLevels([...deletedLevelArr]);
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
                break;
            default:
                break
        }
        setError({ ...error })
    }

    const validateTsErrors = () => {
        let { cycle_id, default_hours, day_start_id, timesheet_start_date, ts_mandatory } = timesheets
        let errors = {};
        if (cycle_id === 1 || cycle_id === 2) {
            errors.day_start_id = timesheets.timesheet_settings_config_type == 3 ? validate_emptyField(day_start_id) : "";
        }
        errors.cycle_id = timesheets.timesheet_settings_config_type == 3 ? validate_emptyField(cycle_id) : '';
        errors.default_hours = timesheets.timesheet_settings_config_type == 3 ? validate_emptyField(default_hours) : '';
        errors.timesheet_start_date = timesheets.timesheet_settings_config_type == 3 ? validate_emptyField(timesheet_start_date) : '';
        errors.ts_mandatory = timesheets.timesheet_settings_config_type == 3 ? validate_emptyField(ts_mandatory) : ''
        return errors;
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = timesheets.approvals;
        let err = approvalsError || [];
        let result = [];
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
        });
        setApprovalsError(err);
        return result.length === 0;

    }


    const handleSubmit = () => {
        let errors = validateTsErrors();
        let multiLevelErrors = multiLevelSubmitValidation();
        if (isValid(errors) && multiLevelErrors) {
            updateTimesheetConfiguration();
        } else {
            setError(errors);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const handleCancel = () => {
        setError({});
        getTimesheetConfiguration();
        setAction('read');
        getPlacementDetails(id);
        setViewState('');
    }

    const statusItems = [
        { id: 1, title: <Text mediumBlack>Default Configuration</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>Client Configuration</Text>, value: 2 },
        { id: 3, title: <Text mediumBlack>Custom Configuration</Text>, value: 3 },
    ]

    const timesheetsOptions = [
        { id: 1, title: <Text mediumBlack>Mandatory</Text>, value: true },
        { id: 2, title: <Text mediumBlack>Non-Mandatory</Text>, value: false },
    ]

    return (
        <Grid container columnSpacing={{ lg: 3, md: 3, sm: 0, xs: 0 }}>
            <Grid item lg={12} md={12} sm={12} xs={12} mt={{ lg: 0, md: 0, sm: 3, xs: 3 }}>
                <Box p={2} pb={0} className={classes.cardBg}>
                    <Box className={classes.header} mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                        <Text boldBlackfont600>
                            Timesheet Configuration
                        </Text>
                        <Box display={"flex"} justifyContent={"end"}>
                            {action !== 'update' &&
                                <Button editButton onClick={() => setAction('update')}><img src={edit} alt="edit" style={{ marginRight: "10px" }} />Edit</Button>
                            }
                        </Box>
                    </Box>
                    <Box>
                        {getloading ?
                            <Grid container spacing={0} my={3}>
                                {
                                    [1, 2, 3, 4, 5, 6, 7].map(() => (
                                        <Grid lg={6} md={6} sm={12} xs={12}>
                                            <Box p={1}>
                                                <Skeleton variant="rounded" width={'100%'} height={'54px'} borderRadius={"10px"} />
                                            </Box>
                                        </Grid>
                                    ))
                                }
                            </Grid> :
                            <Fragment>
                                <Box className={classes.contentScroll} mb={2}>
                                    <Grid container spacing={2} alignItems='center' pl={2}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Box pt={1} pl={0}>
                                                <RadioGroup
                                                    row
                                                    name="timesheet_settings_config_type"
                                                    value={timesheets.timesheet_settings_config_type}
                                                    items={statusItems}
                                                    onChange={(e) => handleChangeConfigSetting(e, "config")}
                                                    disabled={action === "update" ? false : true}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid container spacing={0} pt={2}>
                                            <Grid item lg={6} md={6} sm={6} xs={12} pl={2}>
                                                <Box p={1}>
                                                    <CustomSelect name='cycle_id' value={timesheets.cycle_id} commonSelect onChange={changeHandler} label={<Text largeLabel>Time sheet Cycle</Text>} options={dropdown} disabled={action === "update" && (timesheets.timesheet_settings_config_type == 3) ? false : true}
                                                        helperText={
                                                            error.cycle_id ?
                                                                <Text red sx={{ marginLeft: '-10px' }}>{error.cycle_id ? error.cycle_id : ''}</Text> : ''
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
                                                            disabled: action === "update" && (timesheets.timesheet_settings_config_type == 3) ? false : true,

                                                        }}
                                                        handleChange={handleChangeDefaultHours}
                                                        clientInput
                                                        labelText={<Text largeLabel>Default Hours</Text>}
                                                        helperText={
                                                            error.default_hours ?
                                                                <span className={classes.helperTextError}>{error.default_hours ? error.default_hours : ''}</span> : ''
                                                        }
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12} >
                                                <Box mt={'1px'} p={1} ml={2}>
                                                    <Date
                                                        labelText={<Text largeLabel>Effective Start Date</Text>}
                                                        name='timesheet_start_date'
                                                        value={timesheets.timesheet_start_date}
                                                        height='53px'
                                                        onChange={(value => dateChange(value, 'timesheet_start_date'))}
                                                        minDate={tsStartDate}
                                                        maxDate={clientDetails.end_date}
                                                        disabled={action === "view" ? true : false}
                                                    />
                                                    {
                                                        error.timesheet_start_date ?
                                                            <Text red>{error.timesheet_start_date ? error.timesheet_start_date : ''}</Text> : ''
                                                    }
                                                </Box>
                                            </Grid>
                                            {timesheets.cycle_id == 1 || timesheets.cycle_id == 2 ?
                                                <>
                                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                                        <Box p={1} pl={1}>
                                                            <CustomSelect
                                                                name={'day_start_id'}
                                                                value={timesheets.day_start_id}
                                                                onChange={changeHandler}
                                                                label='Day Starts From'
                                                                options={dayslist}
                                                                commonSelect
                                                                disabled={(action == 'update' && timesheets.timesheet_settings_config_type !== 3) || (timesheets.timesheet_settings_config_type == 3 && (timesheets.cycle_id == 2)) || action == 'view' ? true : false}
                                                            />
                                                            <Text red>{error.day_start_id ? error.day_start_id : ''}</Text>
                                                        </Box>
                                                    </Grid>
                                                </> : ''
                                            }
                                            <Grid item lg={12} md={12} sm={12} xs={12} mt={2} pl={2}>
                                                <Stack direction='row' spacing={2}>
                                                    <Text mediumGrey pt={1}>Timesheet Submission</Text>
                                                    <RadioGroup
                                                        row
                                                        name="ts_mandatory"
                                                        value={timesheets.ts_mandatory}
                                                        items={timesheetsOptions}
                                                        onChange={(e) => {
                                                            setTimesheets({
                                                                ...timesheets, ts_mandatory: e.target.value == '1' || e.target.value == 1 ? true : false
                                                            });
                                                            changeHandler(e);
                                                        }}
                                                        disabled={action === "update" && (timesheets.timesheet_settings_config_type == 3) ? false : true} />
                                                </Stack>
                                                {
                                                    timesheets.timesheet_settings_config_type == 3 && error.ts_mandatory ?
                                                        <Text red>{error.ts_mandatory ? error.ts_mandatory : ''}</Text> : ''
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Box p={1} mt={2}>
                                        <Divider />
                                    </Box>
                                    <Box>
                                        <Box p={1} mt={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                            <Text largeBlack>
                                                Timesheets Approval Configuration
                                            </Text>
                                        </Box>
                                        <Grid container spacing={0} mb={3}>
                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Box p={1}>
                                                    <RadioGroup
                                                        row
                                                        name="timesheet_approval_config_type"
                                                        value={timesheets.timesheet_approval_config_type}
                                                        items={statusItems}
                                                        onChange={(e) => handleChangeConfigSetting(e, "approvalconfig")}
                                                        // onChange={changeHandler}
                                                        disabled={action === "update" ? false : true}
                                                    />
                                                </Box>
                                            </Grid>
                                            {timesheets.approvals.map((i, key) => (
                                                <>
                                                    <Grid item lg={11} md={10} sm={9} xs={11}>
                                                        <Box p={1} mx={1}>
                                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                                <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '59px', display: 'flex', alignItems: "center", }}>
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
                                                                            <TextField {...params} className={classes.multiSelectinputLabel} pt={2} label={`Level ${key + 1} Approval`} />
                                                                            // <TextField className={classes.inputLabel} label="Level 1 Approvers" />
                                                                        )}
                                                                        onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                                                                        disabled={action === "update" && (timesheets.timesheet_approval_config_type == 3) ? false : true}
                                                                        renderTags={(value, getTagProps) =>
                                                                            value.map((option, keyId) => (
                                                                                <Chip
                                                                                    {...getTagProps({ keyId })}
                                                                                    key={keyId}
                                                                                    label={option && option.full_name}
                                                                                    sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                    onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                    disabled={action === "update" && (timesheets.timesheet_approval_config_type == 3) ? false : true}                                                                                            // deleteIcon={<DeleteIcon />}
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
                                                            {timesheets.timesheet_approval_config_type == 3 && <Text errorText> {approvalsError && approvalsError.length > 0 && approvalsError[key] && approvalsError[key].approvals ? approvalsError[key].approvals : ""}</Text>}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={1} md={2} sm={3} xs={1}>
                                                        {timesheets ? (
                                                            <Box pt={{ lg: 3, md: 4, sm: 6, xs: 7 }} alignItems='center'>
                                                                {timesheets.approvals.length - 1 === key ? (
                                                                    <>
                                                                        {
                                                                            <>
                                                                                {
                                                                                    action === "update" && timesheets.timesheet_approval_config_type == 3 ?
                                                                                        <Add className={classes.add} onClick={() => handleAddLevel()} /> :
                                                                                        <Add className={classes.disabledColor} />
                                                                                }
                                                                            </>
                                                                        }
                                                                        {timesheets.approvals.length > 1 ? (
                                                                            <>
                                                                                {
                                                                                    action === "update" && timesheets.timesheet_approval_config_type == 3 ?
                                                                                        <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                        <Remove className={classes.disabledColor} />
                                                                                }
                                                                            </>
                                                                        ) : null}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            action === "update" && timesheets.timesheet_approval_config_type == 3 ?
                                                                                <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                <Remove className={classes.disabledColor} />
                                                                        }
                                                                    </>
                                                                )}
                                                            </Box>

                                                        ) : ''}
                                                    </Grid>
                                                </>
                                            ))}
                                        </Grid>
                                    </Box>
                                    {action == 'update' ?
                                        <Grid container lg={12} md={10} sm={10} xs={12} mt={{ lg: 6, md: 4, sm: 4, xs: 3 }} mb={{ lg: 0, md: 4, sm: 4, xs: 4 }} justifyContent={"end"} pb={2}>
                                            <Stack spacing={3} direction={"row"} pr={2}>
                                                <Button popupCancelHeight onClick={handleCancel}>Cancel</Button>
                                                <LoadingButton smallSaveLoader loading={loading} onClick={handleSubmit}>{action === "update" ? 'Update' : 'Save'}</LoadingButton>
                                            </Stack>
                                        </Grid> : ""
                                    }
                                </Box>
                            </Fragment>
                        }
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default TimesheetConfigurationView

