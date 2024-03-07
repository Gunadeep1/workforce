import React, { useState, useEffect } from 'react';
import { Box, Grid, } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validate_emptyField, validates_float, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { useLocation } from 'react-router-dom';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import CommonApi from '../../../../../apis/CommonApi';
import SearchSelect from '../../../../../components/selectField/SearchSelect';


export default function PayrollConfiguration() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    // const { contact_number, alternate_contact_number, email_id, alternate_email_id, } = props.data;
    const location = useLocation();
    const [action, setAction] = useState("read");
    const [state, setState] = useState(
        {
            balance_amount: "",
            hours_worked: "",
            standard_pay_amount: "",
            enable_payroll: "",
            enable_balance_sheet: "",
            payroll_config_settings_id: ""
        }
    );



    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const [payrollConfigSettings, setPayrollConfigSettings] = useState([]);


    useEffect(() => {
        getpayrollConfigData();
        getpayrollConfigSettings();
        // console.log(loading);
        // let newData = {
        //     ...state,
        //     contact_number,
        //     alternate_contact_number,
        //     email_id,
        //     alternate_email: alternate_email_id,
        // }
        // setState(newData);
        // eslint-disable-next-line
    }, []);

    const [initialState, setInitialState] = useState({});
    useEffect(() => {

    }, [initialState]);

    const getpayrollConfigData = () => {
        setLoading(true)
        EmployeeAPI.getpayrollConfigData(location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    // console.log(response.data., " --------------------");
                    setState(response.data.data)
                    setInitialState(response.data.data)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    const getpayrollConfigSettings = () => {
        CommonApi.payrollConfigSettingsDropdown().then((response) => {
            if (response.data.statusCode == 1003) {
                setPayrollConfigSettings(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
        handleValidations(e);
    };

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "enable_payroll":
                err.enable_payroll = validate_emptyField(input.value);
                break;
            case "enable_balance_sheet":
                err.enable_balance_sheet = validate_emptyField(input.value);
                break;
            case "payroll_config_settings_id":
                err.payroll_config_settings_id = validate_emptyField(input.value);
                break;
            case "balance_amount":
                err.balance_amount = validates_float(input.value);
                break;
            case "hours_worked":
                err.hours_worked = validates_float(input.value);
                break;
            case "standard_pay_amount":
                err.standard_pay_amount = validates_float(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let { enable_payroll, enable_balance_sheet, balance_amount, hours_worked, standard_pay_amount } = state;
        let errors = {};
        errors.enable_payroll = validate_emptyField(enable_payroll);
        errors.enable_balance_sheet = validate_emptyField(enable_balance_sheet);

        errors.balance_amount = balance_amount === 0 ? "" : validates_float(balance_amount);
        errors.hours_worked = hours_worked === 0 ? "" : validates_float(hours_worked);
        errors.standard_pay_amount = standard_pay_amount === 0 ? "" : validates_float(standard_pay_amount);
        console.log(errors, "erroorrss")
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        console.log(errors, "errr")
        if (isValid(errors)) {
            updateEmployeePayRoll();
        } else {
            console.log(errors);
            setError(errors);
        }
    }
    console.log(state, "state")

    const handleCancel = () => {
        setAction("read");
        setError({});
        setState(initialState);
    }

    const updateEmployeePayRoll = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        setLoading(true)
        EmployeeAPI.updateEmployeePayRoll(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setAction("read");
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    return (
        <Box py={1}>
            <Box sx={{ height: "53vh", overflowY: 'scroll' }}>
                <Grid container spacing={0}>

                    <Grid lg={6} md={6} sm={12} xs={12}>

                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'balance_amount',
                                    value: state.balance_amount,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Balance Amount</Text>}
                            />
                            <Text errorText> {error.balance_amount ? error.balance_amount : ""}</Text>
                        </Box>

                    </Grid>

                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'hours_worked',
                                    value: state.hours_worked,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Worked Hours</Text>}
                            />
                            <Text errorText> {error.hours_worked ? error.hours_worked : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'standard_pay_amount',
                                    value: state.standard_pay_amount,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Standard Pay Amount</Text>}
                            />
                            <Text errorText> {error.standard_pay_amount ? error.standard_pay_amount : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <CustomSelect
                                label='Enable Payroll'
                                options={[{ id: true, value: "Yes" }, { id: false, value: "No" }]}
                                disabled={action === "update" ? false : true}
                                name='enable_payroll'
                                value={state.enable_payroll}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.enable_payroll ? error.enable_payroll : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <CustomSelect
                                label='Enable Balance Sheet'
                                options={[{ id: true, value: "Yes" }, { id: false, value: "No" }]}
                                disabled={action === "update" ? false : true}
                                name='enable_balance_sheet'
                                value={state.enable_balance_sheet}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.enable_balance_sheet ? error.enable_balance_sheet : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>

                        {/* {
                            action === "update" ? */}
                        <Box p={2}>
                            <SearchSelect
                                options={payrollConfigSettings}
                                disabled={action === "update" ? false : true}
                                name='payroll_config_settings_id'
                                value={state.payroll_config_settings_id}
                                onChange={handleChange}
                                labelText={<Text largeLabel>Payroll Settings</Text>}
                                scrollTrue
                            />
                            <Text errorText> {error.payroll_config_settings_id ? error.payroll_config_settings_id : ""}</Text>
                        </Box>
                        {/* <Box  p={2}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            value: state.payroll_config_settings_id,
                                            type: 'text',
                                            disabled: action === "update" ? false : true
                                        }}
                                        clientInput
                                        labelText={<Text largeLabel>Payroll Config Settings</Text>}
                                    />
                                </Box>
                        } */}



                    </Grid>
                </Grid>

            </Box>

            <Box mt={1} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                {
                    action === "update" ?
                        <Button cancelBtn onClick={() => handleCancel()}>
                            Cancel
                        </Button> : null
                }
                {
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                        <LoadingButton saveLoader loading={loading} onClick={() => action === "update" ? handleSubmit() : setAction("update")}>
                            {
                                action === "update" ? "Save" : "Edit"
                            }
                        </LoadingButton> :
                        <LoadingButton saveLoaderDisable>
                            Edit
                        </LoadingButton>
                }
            </Box>

        </Box>
    );
}