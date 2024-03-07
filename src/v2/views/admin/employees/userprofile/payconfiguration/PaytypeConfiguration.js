import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { float_validation, isValid, validate_emptyField, validates_Integer, validate_toHours, isValidMulti } from "../../../../../components/Validation";
// import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import CustomButton from "../../../../../components/customButton/Button";
import UserProfileStyles from '../UserProfileStyles';
import { Add, Remove } from "@mui/icons-material";
import { ReactComponent as Info } from '../../../../../assets/svg/Information.svg';
import RadioGroup from '../../../../../components/customButton/RadioGroup';


export default function PaytypeConfiguration() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    // const { contact_number, alternate_contact_number, email_id, alternate_email_id, } = props.data;
    const classes = UserProfileStyles();
    const location = useLocation();
    const [action, setAction] = useState("view");
    const [docError, setDocError] = useState([]);
    const [state, setState] = useState({
        id: '',
        pay_type: "",
        pay_value: "",
        payroll_pay: "",
        pay_rate_configurations: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPaycycle();
        // eslint-disable-next-line
    }, []);

    const depositConfigItems = [
        { id: 1, title: <Text mediumBlack>Percentage (%)</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>value</Text>, value: 2 },
    ]

    const getPaycycle = () => {
        setLoading(true)
        EmployeeAPI.getPayCycleConfiguration(location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        setState(response.data.data[0]);
                    } else {
                        setAction('update')
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const [sample, setSample] = useState([]);

    const callApi = (args) => {
        setSample(args)
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getPayrollAmount(sample, sample.target.value);
        }, 300)

        return () => clearTimeout(delayDebounceFn)
        // eslint-disable-next-line
    }, [sample])

    const getPayrollAmount = (e, args) => {
        EmployeeAPI.getPayroll(location.state.id, e.target.value).then((res) => {
            if (res.data.statusCode === 1003) {
                setState({
                    ...state,
                    [e.target.name]: e.target.value,
                    pay_value: args !== '0' ? args : 0,
                    payroll_pay: res.data.amount
                }, handleValidate(e));
            }
        })
    }

    const handleValidatePopup = (e, index) => {
        let input = e;
        let error = docError.length > 0 ? (docError ? docError[index] : docError) : docError;
        for (var k = 0; k <= index; k++) {
            docError.push({});
        }
        let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
        switch (input.name || input.tagName) {
            case "to_hour":
                error.to_hour = validate_toHours(input.value, state.pay_rate_configurations[index].from_hour);
                break;
            case "pay_in":
                error.pay_in = validate_emptyField(input.value);
                break;
            case "from_hour":
                error.from_hour = validates_Integer(input.value);
                break;
            case "rate":
                error.rate = float_validation(input.value);
                break;
            default:
                break;
        }
        setDocError(s1);
    }

    const validateHourly = () => {
        let errors = {};
        let err = [];// eslint-disable-next-line     
        state.pay_rate_configurations.map((item, index) => {
            errors = {};
            errors.from_hour = state.pay_type == 2 && validates_Integer(item.from_hour);
            let val = state.pay_rate_configurations.length != (index + 1) && validate_toHours(item.to_hour, item.from_hour)
            errors.to_hour = val ? val : '';
            errors.rate = (state.pay_type == 2 || state.pay_type == '2') ? float_validation(item.rate) : '';
            errors.pay_in = (state.pay_type == 2 || state.pay_type == '2') ? validate_emptyField(item.pay_in) : '';
            err.push(errors);
            setDocError(err);
        })
        return err;
    }

    const handleCancel = () => {
        setAction("view");
        getPaycycle();
        setErrors({});
        setDocError([]);
    }

    const storePayCycleConfiguration = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        setLoading(true)
        EmployeeAPI.storePayCycleConfiguration(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setAction("view");
                    getPaycycle();
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    const updatePayCycleConfiguration = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        setLoading(true)
        EmployeeAPI.updatePayCycleConfiguration(data, state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setAction("view");
                    getPaycycle();
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const addConfiguration = () => {
        let payRateConfig = state.pay_rate_configurations;
        let Obj = {
            from_hour: "",
            to_hour: "",
            rate: "",
            pay_in: payRateConfig.length > 0 ? payRateConfig[0].pay_in : "",
        };
        let newArr = state.pay_rate_configurations;
        newArr.push(Obj);
        setState({ ...state, pay_rate_configurations: newArr })
        docError.push({
            from_hour: "",
            to_hour: "",
            rate: "",
            pay_in: ""
        }
        )
        setDocError([...docError])
    }

    const removeConfiguration = (index) => {
        let payRateConfigurations = state.pay_rate_configurations;
        if (payRateConfigurations.length === 3) {
            if (index === 2) {
                payRateConfigurations[index - 1].to_hour = ''
                docError[index - 1].to_hour = ''
            }
            else {
                payRateConfigurations[index + 1].to_hour = ''
                docError[index + 1].to_hour = ''
            }
        }
        for (let i = index + 1; i <= payRateConfigurations.length; i++) {
            let len = payRateConfigurations.length - 1
            if (index === len) {
                payRateConfigurations[index - 1].to_hour = ''
                docError[index - 1].to_hour = ''
            }
            else if (i === index + 1) {
                payRateConfigurations[i].from_hour = payRateConfigurations[index - 1].to_hour;
                payRateConfigurations[i].to_hour = ''
                if (docError[i] !== undefined) {
                    docError[i].to_hour = ''
                    docError[i].from_hour = ''
                }
            }
            else {
                if (payRateConfigurations[i] !== undefined) {
                    payRateConfigurations[i].from_hour = '';
                    payRateConfigurations[i].to_hour = '';
                    if (docError[i] !== undefined) {
                        docError[i].to_hour = ''
                        docError[i].from_hour = ''
                    }
                }

            }
        }
        if (state.deleted_pay_rate_id === undefined) {
            state.deleted_pay_rate_id = []
            state.deleted_pay_rate_id.push(payRateConfigurations[index].id)
        }
        else {
            state.deleted_pay_rate_id.push(payRateConfigurations[index].id)
        }
        payRateConfigurations.splice(index, 1);
        docError.splice(index, 1)

        // if (index > 0) {
        //     payRateConfigurations[index - 1].to_hour = "";
        // }
        let newClientData = { ...state, pay_rate_configurations: payRateConfigurations };
        setDocError([...docError])
        setState({ ...newClientData });
    }

    const changeHandler = (e) => {
        if (e.target.name === "pay_type") {
            if (e.target.value === '2' || e.target.value === 2) {
                let obj = {
                    from_hour: 1,
                    to_hour: "",
                    rate: "",
                    pay_in: 1,
                }
                state.pay_rate_configurations = obj
                setState({ ...state, [e.target.name]: e.target.value })
                setDocError([]);
            } else {
                setState({ ...state, [e.target.name]: e.target.value, pay_value: "", payroll_pay: "" })
                setErrors({});
            }
        } else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
        if (e.target.name == 'pay_value') {
            if (e.target.value === '') {
                state.payroll_pay = 0
                setState({
                    ...state,
                    [e.target.name]: e.target.value
                }, handleValidate(e))
            }
            else {
                callApi(e);
            }
        } else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
        handleValidate(e)
    }

    const handleValidate = (e, index) => {
        const input = e.target
        switch (input.name || input.tagName) {
            case 'pay_type':
                errors.pay_type = validate_emptyField(input.value)
                break
            case "payroll_pay":
                errors.payroll_pay = validate_toHours(input.value)
                break
            case "pay_value":
                errors.pay_value = float_validation(input.value)
                break
            default:
                break
        }
        setErrors({ ...errors })
    }

    const handleChangeHours = (e, index) => {
        const input = e.target.value;
        if (e.target.name == "to_hour") {
            state.pay_rate_configurations[index][e.target.name] = input;
            state.pay_rate_configurations[0]['from_hour'] = 1;
            state.pay_rate_configurations[index + 1]['from_hour'] = input;
            if (state.pay_rate_configurations.length > 1) {
                for (let i = index; i < state.pay_rate_configurations.length; i++) {
                    if (i + 1 !== state.pay_rate_configurations.length) {
                        let val = state.pay_rate_configurations[i + 1][e.target.name] === '' ? 0 : state.pay_rate_configurations[i + 1][e.target.name]
                        if (val > state.pay_rate_configurations[i][e.target.name]) {
                            let length = i + 1
                            for (let y = length; y <= state.pay_rate_configurations.length; y++) {
                                if (state.pay_rate_configurations.length > y) {
                                    state.pay_rate_configurations[y][e.target.name] = ''
                                    state.pay_rate_configurations[y]['from_hour'] = ''
                                }

                            }
                            break;
                        }
                    }

                }
            }
            if (docError.length === 0) {
                for (let i = 0; i <= index + 1; i++) {
                    docError.push({ from_hour: '' })
                }
                docError.filter(value => JSON.stringify(value) !== '{}');
            }
            if (docError[index + 1] !== undefined) {
                docError[index + 1]['from_hour'] = '';
            }
            setState({ ...state }, handleValidatePopup(e.target, index));
        } else {
            if (e.target.name == 'rate') {
                if (state.pay_rate_configurations[index].pay_in == 1 || state.pay_rate_configurations[index].pay_in == "1") {
                    if (input > 100) {
                        addWarningMsg('Percentage is not allowed more than 100%')
                    }
                    // else if (input == 0) {
                    //     addWarningMsg('Percentage should be greater than 0%')
                    // }
                    else {
                        state.pay_rate_configurations[index][e.target.name] = input;
                        setState({ ...state }, handleValidatePopup(e.target, index));
                    }
                }
                else {
                    state.pay_rate_configurations[index][e.target.name] = input;
                    setState({ ...state }, handleValidatePopup(e.target, index));
                }
            }
            else {
                if (e.target.name == 'pay_in') {
                    state.pay_rate_configurations.forEach((ele, ind) => {
                        state.pay_rate_configurations[ind][e.target.name] = input;
                    })
                    setState({ ...state }, handleValidatePopup(e.target, index));
                }
                else {
                    state.pay_rate_configurations[index][e.target.name] = input;
                    setState({ ...state }, handleValidatePopup(e.target, index));
                }
            }
        }
    }

    const validateErrors = () => {
        const { pay_type, pay_value } = state;
        let error = {};
        error.pay_type = validate_emptyField(pay_type);
        error.pay_value = (state.pay_type == 1 || state.pay_type == '1') ? float_validation(pay_value) : '';
        setErrors(error);
        return error;
    }

    const payType = require('../../../../../utils/jsons/PayType.json');
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        let errors = validateErrors();
        let salaryPay = validateHourly();
        if (isValid(errors) && (state.pay_type == 2 ? isValidMulti(salaryPay) : [])) {
            if (state.id === '') {
                storePayCycleConfiguration();
            } else {
                updatePayCycleConfiguration();
            }
        }
        else {
            let s1 = { errors }
            s1 = errors
            setErrors(s1);
            let s3 = { docError }
            s3 = salaryPay
            setDocError(s3);
            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
        }
    }


    return (
        <Grid container>
            <Box width='100%' sx={{ height: "53vh", overflowY: 'scroll' }}>
                <Grid container item lg={12} md={12} sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                            <CustomSelect
                                name={'pay_type'}
                                value={state.pay_type}
                                label='Pay Type'
                                commonSelect
                                onChange={changeHandler}
                                options={payType}
                                disabled={action == 'view' ? true : false}
                            />
                            {
                                errors.pay_type ?
                                    <Text red>{errors.pay_type ? errors.pay_type : ''}</Text> : ''
                            }
                        </Box>
                    </Grid>
                    {
                        (state.pay_type == 1 || state.pay_type === '1') &&
                        <>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: "pay_value",
                                        value: state.pay_value,
                                        inputProps: { maxlength: 9 },
                                        disabled: action === 'view' ? true : false
                                    }}
                                    handleChange={changeHandler}
                                    clientInput
                                    labelText={<Text largeLabel>Annual Pay</Text>}
                                />
                                {
                                    errors.pay_value ?
                                        <Text red>{errors.pay_value ? errors.pay_value : ''}</Text> : ''
                                }
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} justifyContent='center'>
                                <Stack direction='row' spacing={4}>
                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        <Box pt={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: "payroll_pay",
                                                    value: state.payroll_pay,
                                                    disabled: true
                                                }}
                                                handleChange={changeHandler}
                                                clientInput
                                                labelText={<Text largeLabel>Payroll Pay</Text>}
                                            />

                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} pt={3}>
                                        <BlackToolTip arrow title={
                                            <Text mediumWhite sx={{ padding: '6px !important' }}>Pay Amount for Each Pay Cycle</Text>
                                        } placement="right">
                                            <Info />
                                        </BlackToolTip>
                                    </Grid>
                                </Stack>
                            </Grid>
                        </>
                    }
                    {
                        (state.pay_type == 2 || state.pay_type === '2') && state.pay_rate_configurations.length > 0 &&
                        <>
                            <Grid item container lg={12} md={12} sm={12} xs={12}>
                                <Grid item lg={12} md={12} sm={12} xs={12} pt={1}>
                                    <Text blackFont14>Choose Pay configuration</Text>
                                </Grid>
                                <Grid container lg={12} pt={1}>
                                    <Grid item lg={6} p={1} pl={0}>
                                        <RadioGroup
                                            row
                                            disabled={action == 'view' ? true : false}
                                            name="pay_in"
                                            value={state.pay_rate_configurations[0].pay_in}
                                            onChange={(e) => handleChangeHours(e, 0)}
                                            items={depositConfigItems}
                                        />
                                        {
                                            docError.length > 0 ? (
                                                <Text red>{docError[0] ? docError[0].pay_in : ''}</Text>
                                            ) : ''}
                                    </Grid>
                                    {state.pay_rate_configurations.map((item, index) => (
                                        <Grid container spacing={0} key={index}>
                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                <Box p={1}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'from_hour',
                                                            value: item.from_hour,
                                                            disabled: action == 'view' || (index !== 0 && state.pay_rate_configurations[0].from_hour) ? true : false,
                                                            inputProps: { maxLength: 7 }
                                                        }}
                                                        handleChange={(e) => handleChangeHours(e, index)}
                                                        clientInput
                                                        labelText={<Text largeLabel>From Hours</Text>}
                                                    />
                                                    {docError.length > 0 ? (
                                                        <Text red>{docError[index] ? docError[index].from_hour : ''}</Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                <Box p={1}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'to_hour',
                                                            value: item.to_hour,
                                                            disabled: action == 'view' || (state.pay_rate_configurations.length == (index + 1)) ? true : false,
                                                            inputProps: { maxLength: 7 }
                                                        }}
                                                        handleChange={(e) => handleChangeHours(e, index)}
                                                        clientInput
                                                        labelText={<Text largeLabel>To Hours</Text>}
                                                    />
                                                    {docError.length > 0 ? (
                                                        <Text red>{docError[index] ? docError[index].to_hour : ''}</Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                <Box p={1}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'rate',
                                                            value: item.rate,
                                                            disabled: action == 'view' ? true : false
                                                        }}
                                                        handleChange={(e) => handleChangeHours(e, index)}
                                                        clientInput
                                                        labelText={<Text largeLabel>{item.pay_in == 1 ? "Percentage" : "Value"}</Text>}
                                                    />
                                                    {docError.length > 0 ? (
                                                        <Text red>{docError[index] ? docError[index].rate : ''}</Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item lg={1} md={1} sm={1} xs={1}>
                                                <Box p={1} pt={0} sx={{ height: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {
                                                        state.pay_rate_configurations.length - 1 == index &&
                                                        <>
                                                            {
                                                                action === "view" ?
                                                                    <Add className={classes.disabledColor} /> :
                                                                    <Add className={classes.add} onClick={() => addConfiguration()}></Add>
                                                            }
                                                        </>
                                                    }
                                                    {
                                                        state.pay_rate_configurations.length > 1 && index !== 0 &&
                                                        <>
                                                            {
                                                                action === "view" ?
                                                                    <Remove className={classes.disabledColor} /> :
                                                                    <Remove className={classes.minus} onClick={() => removeConfiguration(index)}></Remove>
                                                            }
                                                        </>
                                                    }
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </>
                    }
                </Grid>
            </Box>
            <Grid item lg={12} textAlign='end'>
                <Box mt={1} px={1} display={"flex"} justifyContent={"end"} gap={3} textAlign='end'>
                    {
                        action == 'update' ?
                            <CustomButton cancelBtn onClick={handleCancel}>
                                Cancel
                            </CustomButton> : ''
                    }
                    {
                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                            <LoadingButton saveLoader loading={loading} onClick={() => action === "update" ? handleSubmit() : setAction("update")}>
                                {
                                    action == 'view' ? "Edit" : "Save"
                                }
                            </LoadingButton> :
                            <LoadingButton saveLoaderDisable>
                                Edit
                            </LoadingButton>
                    }
                </Box>
            </Grid>
        </Grid >
    );
}
