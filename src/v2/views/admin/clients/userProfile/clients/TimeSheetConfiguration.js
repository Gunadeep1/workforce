import React, { useState, useEffect, Fragment } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Grid, RadioGroup, FormControlLabel, Radio, Autocomplete, Chip, TextField, Skeleton } from '@mui/material';
import { useLocation } from 'react-router-dom';
// import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
// import { addErrorMsg, } from '../../../../../utils/utils';
import Text from '../../../../../components/customText/Text';
import CustomButton from '../../../../../components/customButton/Button';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import { ReactComponent as RadioIcon } from '../../../../../assets/svg/RadioIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../../../assets/svg/RadioCheckedIcon.svg';
import { ReactComponent as RemoveSvg } from '../../../../../assets/svg/removeIcon.svg';
// import CustomMultipleSelect from '../../../../../components/customSelect/CustomMultipleSelect';
import ClientsAPI from '../../../../../apis/admin/clients/ClientsApi';
import CommonApi from '../../../../../apis/CommonApi';
import { addErrorMsg, addSuccessMsg, } from '../../../../../utils/utils';
import { isValid, validate_emptyField, } from "../../../../../components/Validation";
import LocalStorage from "../../../../../utils/LocalStorage";
import { ReactComponent as DeleteIcon } from '../../../../../assets/svg/closeIcon.svg';
import Input from '../../../../../components/input/Input';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function TimeSheetConfiguration() {

    const classes = UserProfileStyles();
    const location = useLocation();
    const [formData, setFormData] = useState(
        {
            id: '',
            ts_mandatory: 1,
            cycle_id: "",
            day_start_id: "",
            default_hours: "00:00",
            approvals: [
                {
                    id: "",
                    rank: 1,
                    approver_ids: []
                }
            ],
            delete_user_ids: "",
            delete_approval_level_ids: ""
        }
    );
    const [action, setAction] = useState(location.state.viewState);

    const [error, setError] = useState({});
    const [approvalsError, setApprovalsError] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [getloading, setGetloading] = useState(false);
    const [approvalDropdown, setApprovalDropdown] = useState([]);
    const [timesheetCycleDropdown, setTimesheetCycleDropdown] = useState([]);
    const [dayslist, setDayslist] = useState([]);

    const [deletedLevels, setDeletedLevels] = useState([]);
    const [deletedchips, setDeletedchips] = useState([]);

    useEffect(() => {
        getCycleDropdown();
        getDaysDropdown();
        getApprovalDropdown();
        getTimesheetConfiguration();
        // eslint-disable-next-line
    }, []);

    const getTimesheetConfiguration = () => {
        setGetloading(true);
        ClientsAPI.getTimesheetConfiguration(location.state.data.id).then((response) => {
            setTimeout(() => {
                setGetloading(false)
                if (response.data.statusCode == 1003 || response.data.statusCode == 1013) {
                    if (response.data.data.length > 0) {
                        setFormData({
                            ...response.data.data[0],
                            ts_mandatory: response.data.data[0].ts_mandatory == true ? 1 : 0
                        });
                    } else {
                        setFormData(formData);
                    };
                    if (location.state.viewState == 'view' && response.data.data.length == 0) {
                        setAction('update')
                    } else if (location.state.viewState == 'edit') {
                        setAction('update')
                    } else {
                        setAction('view')
                    }
                }
            }, 400)
        });
    }

    const getCycleDropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setTimesheetCycleDropdown(response.data.data);
            }
        });
    };
    const getDaysDropdown = () => {
        let search = "";
        CommonApi.daysDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setDayslist(response.data.data);
            }
        });
    };

    const getApprovalDropdown = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setApprovalDropdown(response.data.data);
            }
        });
    };

    const storeInvoiceConfiguration = () => {     
        let data = { ...formData, request_id: LocalStorage.uid(), id: location.state.data.id }
        setLoading(true)
        ClientsAPI.storeTimesheetConfiguration(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    getTimesheetConfiguration();                   
                    setAction('view');
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateInvoiceConfiguration = () => {
        let data = { ...formData, request_id: LocalStorage.uid(), delete_user_ids: [], delete_approval_level_ids: [] };
        deletedLevels.forEach(ele => {
            data.delete_approval_level_ids.push(ele.id);
        });
        deletedchips.forEach(ele => {
            data.delete_user_ids.push(ele.id);
        });

        setLoading(true)
        ClientsAPI.updateTimesheetConfiguration(location.state.data.id, data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    getTimesheetConfiguration();
                    // getContactsDetails()
                    // setForm(false);
                    // setEditdeleteId(null)
                    setAction('view');
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleChange = (e) => {
        if (e.target.name == "cycle_id") {
            setFormData({ ...formData, [e.target.name]: e.target.value, day_start_id: "" })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        handleValidations(e.target);
    };


    const handleValidations = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "ts_mandatory":
                err.ts_mandatory = validate_emptyField(input.value);
                break;
            case "cycle_id":
                err.cycle_id = validate_emptyField(input.value);
                err.day_start_id = "";
                break;
            case "day_start_id":
                if (formData.cycle_id == 1 || formData.cycle_id == 2) {
                    err.day_start_id = validate_emptyField(input.value);
                }
                break;
            case "default_hours":
                err.default_hours = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }


    const handleSubmit = () => {
        let errors = validateAll();
        let multiLevelErrors = multiLevelSubmitValidation();
        if (isValid(errors) && multiLevelErrors) {
            if (formData.id == "") {
                storeInvoiceConfiguration();
            } else if (action === "update") {
                updateInvoiceConfiguration();
            }
        } else {
            setError(errors);
        }
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = formData.approvals;
        let err = approvalsError;
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

    const validateAll = () => {
        let { cycle_id, ts_mandatory, day_start_id, default_hours, } = formData;
        let errors = {};
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.ts_mandatory = validate_emptyField(ts_mandatory);
        if ([1, 2].includes(cycle_id)) {
            errors.day_start_id = validate_emptyField(day_start_id);
        } else {
            errors.day_start_id = "";
        }
        errors.default_hours = validate_emptyField(default_hours);
        return errors;
    };

    const handleChangeTime = (e) => {      
        let input = e.target.value.replace(/\D/g, "").substring(0, 5);
        const first = input.substring(0, 2);
        const second = input.substring(2, 5);
        if (input.length > 2) {
            setFormData({ ...formData, [e.target.name]: `${first}:${second}` });
        } else {
            setFormData({ ...formData, [e.target.name]: input });
        }

        if (input.length > 2) {
            var mm = parseInt(second);
            if (mm > 59) {
                if (first < 23) {
                    var sec = second - 60;
                    var fOne = parseInt(first) + 1;
                    setFormData({ ...formData, [e.target.name]: `0${fOne}:${sec}` });
                    handleValidations(e.target);
                } else {
                    setFormData({ ...formData, [e.target.name]: `${first}:${59}` });
                    handleValidations(e.target);
                }
            } else {
                setFormData({ ...formData, [e.target.name]: `${first}:${second}` });
                handleValidations(e.target);
            }
        } else if (input.length >= 0) {
            var hh = parseInt(input);
            if (hh > 23) {
                formData[e.target.name] = "23";
            } else {
                formData[e.target.name] = input;
            }
            setFormData({ ...formData });
            handleValidations(e.target);
        }
    };


    const handleChangeLevels = (e, newArr, index) => {
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newArr[newArr.length - 1];
            let approvals = formData.approvals
            let approverIdsArr = approvals[index].approver_ids;
            if (approverIdsArr.filter((i) => i.employee_id == id).length == 0) {
                approverIdsArr.push({ id: "", employee_id: id, value: value, full_name: value });
                setFormData({ ...formData, approvals })
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
        let approvals = formData.approvals;
        let newArr = approvals[index].approver_ids;
        let deletedChipsArr = deletedchips;
        if (newArr[key].id !== '') {
            deletedChipsArr.push(newArr[index]);
        }
        newArr.splice(key, 1);
        setFormData({ ...formData, approvals })
        multiLevelsValidations(approvals, "approvals", index);
        setDeletedchips([...deletedChipsArr]);
    }

    const handleAddLevel = () => {
        let arr = formData.approvals;
        let errorsArr = approvalsError;
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        },);
        errorsArr.push({});
        setFormData({ ...formData, approvals: arr });
        setApprovalsError(errorsArr);
    }

    const handleRemoveLevel = (index) => {
        let arr = formData.approvals;
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
        setFormData({ ...formData, approvals: arr });
        setApprovalsError(errorsArr);

        setDeletedLevels([...deletedLevelArr]);
    }

    return (
        <Box p={2}>
            <Box mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                <Text profileTitle>
                    TimeSheet Configuration
                </Text>
            </Box>
            <Box pb={1}>

                {
                    getloading ?
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
                            <Box sx={{ minHeight: "50vh", }}>
                                <Grid container className={classes.contentScroll}>
                                    <Grid container spacing={0}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box p={1}>
                                                <SearchSelect
                                                    name='cycle_id'
                                                    value={formData.cycle_id}
                                                    onChange={handleChange}
                                                    options={timesheetCycleDropdown}
                                                    labelText={<Text largeLabel>Time Sheet Cycle</Text>}
                                                    scrollTrue
                                                    disabled={action == 'view' ? true : false}
                                                />
                                                <Text errorText> {error.cycle_id ? error.cycle_id : ""}</Text>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Box p={1} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'default_hours',
                                                        value: formData.default_hours,
                                                        type: 'time',
                                                        disabled: action == 'view' ? true : false
                                                    }}
                                                    handleChange={handleChangeTime}
                                                    clientInput
                                                    labelText={<Text largeLabel>Default Hours</Text>}
                                                />
                                                <Text errorText> {error.default_hours ? error.default_hours : ""}</Text>
                                            </Box>
                                        </Grid>
                                        {
                                            [1, 2].includes(formData.cycle_id) ?
                                                <Fragment>
                                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                                        <Box p={1} my={1}>
                                                            <SearchSelect
                                                                name='day_start_id'
                                                                value={formData.day_start_id}
                                                                onChange={handleChange}
                                                                options={dayslist}
                                                                labelText={<Text largeLabel>Day start from</Text>}
                                                                scrollTrue
                                                                disabled={action == 'view' ? true : false}
                                                            />
                                                            <Text errorText> {error.day_start_id ? error.day_start_id : ""}</Text>
                                                        </Box>
                                                        {/* } */}
                                                    </Grid>
                                                    <Grid lg={6} md={6} sm={12} xs={12}></Grid>
                                                </Fragment> : null
                                        }

                                        <Grid item lg={12} md={6} sm={6} xs={12}>
                                            <Box p={1}>
                                                <Text profileTitle>
                                                    Timesheet Submission
                                                </Text>
                                                <Box py={1}>
                                                    <RadioGroup
                                                        row
                                                        name='ts_mandatory'
                                                        value={formData.ts_mandatory}
                                                        onChange={handleChange}
                                                    >
                                                        <FormControlLabel
                                                            value={1}
                                                            control={<Radio icon={<RadioIcon />}
                                                                checkedIcon={<RadioCheckedIcon />} />}
                                                            label={<Text checkboxlable >Mandatory</Text>}
                                                            disabled={action == 'view' ? true : false}
                                                        />
                                                        <FormControlLabel
                                                            value={0}
                                                            control={<Radio icon={<RadioIcon />}
                                                                checkedIcon={<RadioCheckedIcon />} />}
                                                            label={<Text checkboxlable >Non - Mandatory</Text>}
                                                            disabled={action == 'view' ? true : false}
                                                        />
                                                    </RadioGroup>
                                                    <Text errorText> {error.ts_mandatory ? error.ts_mandatory : ""}</Text>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <Box>
                                            <Box p={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                                <Text profileTitle>
                                                    TimeSheet Approval Configuration
                                                </Text>
                                                {
                                                    action == 'view' ?
                                                        <LoadingButton disable loading={loading}>
                                                            Add Level
                                                        </LoadingButton> :
                                                        <CustomButton outlineBlueSmall onClick={() => handleAddLevel()}>Add Level</CustomButton>
                                                }
                                            </Box>
                                            <Grid container spacing={0}>
                                                {
                                                    formData.approvals.map((i, key) => (
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <Box my={1} mx={1}>
                                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                                    <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '69px', display: 'flex', alignItems: "center", }}>
                                                                        <Autocomplete
                                                                            multiple
                                                                            limitTags={2}
                                                                            id="multiple-limit-tags"
                                                                            options={approvalDropdown}
                                                                            getOptionLabel={(option) => option.value}
                                                                            renderOption={(props, option) => (
                                                                                <li {...props} key={option.uniqueIdentifier}>
                                                                                    {option.value}
                                                                                </li>
                                                                            )}
                                                                            value={i.approver_ids}
                                                                            renderInput={(params) => (
                                                                                <TextField {...params} label={`Level ${key + 1} Approvers`} className={classes.multiSelectinputLabel} pt={2} />
                                                                            )}
                                                                            onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                                                                            disabled={action == 'view' ? true : false}
                                                                            renderTags={(value, getTagProps) =>
                                                                                value.map((option, keyId) => (
                                                                                    <Chip
                                                                                        {...getTagProps({ keyId })}
                                                                                        key={keyId}
                                                                                        label={option && option.full_name}
                                                                                        sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                        onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                        deleteIcon={<DeleteIcon />}
                                                                                        disabled={action == 'view' ? true : false}
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
                                                                    {
                                                                        formData.approvals.length > 1 ?
                                                                            <Box mx={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                                                                                {action == 'view' ? <RemoveCircleOutlineIcon style={{ color: 'grey' }} /> : <RemoveSvg onClick={() => handleRemoveLevel(key)} style={{ cursor: "pointer" }} />}
                                                                            </Box> : null
                                                                    }
                                                                </Box>

                                                                <Text errorText> {approvalsError.length > 0 && approvalsError[key] && approvalsError[key].approvals ? approvalsError[key].approvals : ""}</Text>

                                                            </Box>
                                                        </Grid>

                                                    ))
                                                }
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box pt={5} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                                {
                                    action == 'view' ?
                                        <LoadingButton saveLoader loading={loading} onClick={() => setAction('update')}>
                                            Edit
                                        </LoadingButton> :
                                        <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                            {action == 'update' && formData.id !== '' ? 'Update' : 'Save'}
                                        </LoadingButton>
                                }
                            </Box>
                        </Fragment>
                }
            </Box>
        </Box>
    );
}