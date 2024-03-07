import React, { useState, useEffect } from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles';
import Button from '../../../../../components/customButton/Button';
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import { validate_selectField, validate_emptyField, isValid } from '../../../../../components/Validation';
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import TimeSheetApi from '../../../../../apis/admin/placements/TimeSheetApi';
import RadioGroup from '../../../../../components/customButton/RadioGroup';
import TimeSheetCycleApi from '../../../../../apis/configurations/timesheet/TimeSheetCycleApi';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';

export default function ApprovalMatrix({ current }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()
    const [state, setState] = useState({
        cycle_id: '',
        day_start_id: '',
        default_hours: '',
        id: '',
        is_global: true,
        ts_mandatory: true
    })
    const [action, setAction] = useState('');
    const [error, setError] = useState({});
    const [dropdown, setDropdown] = useState([]);
    const [dayslist, setDaysList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            indexApi()
            cycleDropdown();
            daysDropdown();
        }, 300) // eslint-disable-next-line
    }, [])

    const options = [
        { id: true, title: <Text mediumBlack>Mandatory</Text>, value: true },
        { id: false, title: <Text mediumBlack>Non - Mandatory</Text>, value: false },
    ];


    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value }, handleValidate(e));
    };

    const handleValidate = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "cycle_id":
                err.cycle_id = validate_emptyField(input.value);
                break;
            case "default_hours":
                err.default_hours = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }
    const daysDropdown = () => {
        TimeSheetApi.getDaysDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDaysList(response.data.data);
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
    const handleInputChange = (e) => {
        if (e.target.name == "default_hours") {
            let input = e.target.value.replace(/\D/g, "").substring(0, 5);
            const first = input.substring(0, 2);
            const second = input.substring(2, 5);
            if (input.length > 2) {
                setState({ ...state, [e.target.name]: `${first}:${second}` });
            } else {
                setState({ ...state, [e.target.name]: input });
            }
            if (input.length > 2) {
                var mm = parseInt(second);
                if (mm > 59) {
                    if (first < 23) {
                        var sec = second - 60;
                        var fOne = parseInt(first) + 1;
                        setState({ ...state, [e.target.name]: `0${fOne}:${sec}` }, handleValidateChangeHandler(e));
                    } else {
                        setState({ ...state, [e.target.name]: `${first}:${59}` }, handleValidateChangeHandler(e));
                    }
                } else {
                    setState({ ...state, [e.target.name]: `${first}:${second}` }, handleValidateChangeHandler(e));
                }
            } else if (input.length >= 0) {
                var hh = parseInt(input);
                if (hh > 23) {
                    state[e.target.name] = "23";
                } else {
                    state[e.target.name] = input;
                }
                setState({ ...state }, handleValidateChangeHandler(e));
            }
        }
        else if (e.target.name == 'cycle_id') {
            setState({ ...state, [e.target.name]: e.target.value, }, handleValidateChangeHandler(e));
            setError(validate_selectField("cycle_id", error));
        }
        else {
            setState({ ...state, [e.target.name]: e.target.value, }, handleValidateChangeHandler(e));
        }
    };

    const handleValidateChangeHandler = (e) => {
        let input = e.target;
        let s1 = { ...error };
        switch (input.name || input.tagName) {
            case "default_hours":
                error.default_hours = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(s1);
    };

    const validateAll = () => {
        const { cycle_id, default_hours, day_start_id } = state
        let errors = {}
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.default_hours = validate_emptyField(default_hours);
        errors.day_start_id = (state.cycle_id == 1 || state.cycle_id == 2) ? validate_emptyField(day_start_id) : '';
        setError(errors);
        return errors;
    }

    const handleClickOpen = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (action == 'update') {
                updateApi();
            } else {
                storeApi();
            }
        } else {
            let s1 = { error }
            s1 = errors
            setError(s1);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    };

    const indexApi = () => {
        setLoading(true)
        TimeSheetCycleApi.indexApi(
        ).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        setState({ ...response.data.data[0] });
                        setAction('view');
                    } else {
                        setAction('');
                        addWarningMsg('Default configurations have not been completed. Please configure the client module to reflect the changes here.');
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
        console.log(action, "end");
    }

    const updateApi = () => {
        let data = { ...state, request_id: LocalStorage.uid() };
        data['is_global'] = true
        TimeSheetCycleApi.updateApi(data, state.id).then((response) => {
            if (response.data.statusCode == 1003) {
                indexApi()
                addSuccessMsg(response.data.message);
                setAction('view');
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const storeApi = () => {
        let data = { ...state, request_id: LocalStorage.uid() };
        data['is_global'] = true
        if (state.id === '') {
            TimeSheetCycleApi.storeApi(data).then((response) => {
                if (response.data.statusCode == 1003) {
                    indexApi()
                    addSuccessMsg(response.data.message);
                    setAction('view');
                } else {
                    addErrorMsg(response.data.message);
                }
            });
        } else {
            setAction('update');
        }
    };

    return (
        <Box sx={{
            height: '75vh',
            overflow: 'auto',
            padding: '16px',
        }}>

            <Box className={classes.activeItemBox2}>
                <Box className={classes.activeBoxHeading2}><Text RegularBlack1 >{current}</Text></Box>
                {
                    loading ? <>
                        {[1].map((item, index) => (
                            <Grid container key={index} spacing={2}>
                                <Grid item lg={6}>
                                    <Skeleton animation="wave" height="100px" />
                                    <Skeleton animation="wave" height="100px" />

                                </Grid>
                                <Grid item lg={6}>
                                    <Skeleton animation="wave" height="100px" />
                                    <Skeleton animation="wave" height="100px" />
                                </Grid>
                            </Grid>
                        ))}
                    </>
                        :
                        <Grid container spacing={'28px'} mt={'5px'}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <CustomSelect
                                    name={'cycle_id'}
                                    value={state.cycle_id}
                                    label='TimeSheet Cycle'
                                    onChange={handleChange}
                                    options={dropdown}
                                    commonSelect
                                    disabled={action == 'view' ? true : false}
                                />
                                {
                                    error.cycle_id && <Text red>{error.cycle_id ? error.cycle_id : ''}</Text>
                                }
                            </Grid>
                            {(state.cycle_id == 1 || state.cycle_id == 2) &&
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <CustomSelect
                                        name={'day_start_id'}
                                        value={state.day_start_id}
                                        onChange={handleChange}
                                        label='Day Starts From'
                                        options={dayslist}
                                        commonSelect
                                        disabled={action == 'view' ? true : false}
                                    />
                                    {
                                        error.day_start_id && <Text red>{error.day_start_id ? error.day_start_id : ''}</Text>
                                    }
                                </Grid>}
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        name: "default_hours",
                                        value: state.default_hours,
                                        type: 'time',
                                        disabled: action == 'view' ? true : false
                                    }}
                                    clientInput
                                    labelText='Default Hours'
                                    handleChange={handleInputChange}
                                />
                                <Text sx={{ marginLeft: '12px !important' }} errorText> {error.default_hours ? error.default_hours : ""}</Text>
                            </Grid>
                            <Grid container item lg={6} md={6} sm={12} xs={12}>
                                <Grid item xs={12}>
                                    <Text largeBlack>Time Sheet Submission</Text>
                                </Grid>
                                <Grid container item xs={12} direction={'column'}>
                                    <Grid lg={12} md={12} sm={12} xs={12}>
                                        <RadioGroup
                                            row
                                            name="ts_mandatory"
                                            checked={state.ts_mandatory}
                                            value={state.ts_mandatory}
                                            items={options}
                                            onChange={handleChange}
                                            disabled={action == 'view' ? true : false}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>}
            </Box>
            <Box display={'flex'} justifyContent={'end'} mt={'22px'} gap={2}>
                <Button cancelBtnBorder onClick={() => indexApi()}>Cancel</Button>
                {
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_timesheet" && item.is_allowed == true))) ?
                        <Button saveBtn onClick={() => handleClickOpen()}>{state.id === '' ? 'Save' : 'Edit'}</Button> :
                        <Button saveBtnDisable>{state.id === '' ? 'Save' : 'Edit'}</Button>
                }
            </Box>
        </Box>
    )
}
