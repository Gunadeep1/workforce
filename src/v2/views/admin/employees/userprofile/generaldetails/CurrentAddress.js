import React, { useState, useEffect } from 'react';
import { Box, Grid, } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validateAplaSpecialChar, validate_emptyField, validate_zipcode, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import { useLocation } from 'react-router-dom';
import LocalStorage from "../../../../../utils/LocalStorage";
import LoadingButton from '../../../../../components/customButton/LoadingButton';
// import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import CommonApi from '../../../../../apis/CommonApi';
import SearchSelect from '../../../../../components/selectField/SearchSelect';

export default function CurrentAddress(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [action, setAction] = useState("read");
    const [state, setState] = useState({
        address_line_one: "",
        zip_code: "",
        city: "",
        state_id: "",
        country_id: "",
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const [countriesList, setCountriesList] = useState([]);
    const [statesList, setStatesList] = useState([]);

    useEffect(() => {
        getCountriesList();
        if (props.data.country_id !== "") {
            getStatesList(props.data.country_id)
        }
        let newData = props.data;
        setState(newData);
        setInitialState(newData)
        // eslint-disable-next-line
    }, [props]);

    const [initialState, setInitialState] = useState({});
    useEffect(() => {

    }, [initialState]);

    const handleCancel = () => {
        setAction("read");
        setError({});
        setState(initialState);
    }

    const getCountriesList = () => {
        let search = "";
        CommonApi.getCountryList(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setCountriesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getStatesList = (country_id) => {
        CommonApi.getStatesList(country_id).then((response) => {
            if (response.data.statusCode == 1003) {
                setStatesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }


    const handleChange = (e) => {
        if (e.target.name === "country_id") {
            getStatesList(e.target.value);
            setState({ ...state, [e.target.name]: e.target.value, state_id: '' })
            handleValidations(e);
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
            handleValidations(e);
        }
    };


    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "address_line_one":
                err.address_line_one = validate_emptyField(input.value);
                break;
            case "zip_code":
                err.zip_code = state.country_id == 101 ? validate_zipcode(input.value,101) : validate_zipcode(input.value);
                break;
            case "city":
                err.city = validateAplaSpecialChar(input.value);
                break;
            case "state_id":
                err.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                err.country_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let {
            address_line_one, zip_code, city, state_id, country_id,
        } = state;
        let errors = {};
        errors.address_line_one = validate_emptyField(address_line_one);
        errors.zip_code = state.country_id == 101 ? validate_zipcode(zip_code,101) : validate_zipcode(zip_code);
        errors.city = validate_emptyField(city);
        errors.state_id = validate_emptyField(state_id);
        errors.country_id = validate_emptyField(country_id);
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            updateEmployeeCurrentAddress()
        } else {
            setError(errors);
        }
    }

    const updateEmployeeCurrentAddress = () => {
        let data = { ...state, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateEmployeeCurrentAddress(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false);
                if (response.data.statusCode == 1003) {
                    setAction("read");
                    addSuccessMsg(response.data.message);
                    props.getIndex();
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    return (
        <Box py={1}>
            <Box sx={{ minHeight: "53vh", }}>
                <Grid container spacing={0}>

                    <Grid lg={12} md={12} sm={12} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'address_line_one',
                                    value: state.address_line_one,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Address Line 1</Text>}
                            />
                            <Text errorText> {error.address_line_one ? error.address_line_one : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <SearchSelect
                                options={countriesList}
                                name='country_id'
                                value={state.country_id}
                                onChange={handleChange}
                                disabled={action === "update" ? false : true}
                                labelText={<Text largeLabel>Country</Text>}
                                scrollTrue
                            />
                            <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <SearchSelect
                                options={statesList}
                                disabled={action === "update" || state.country_id === '' ? false : true}
                                name='state_id'
                                value={state.state_id}
                                onChange={handleChange}
                                labelText={<Text largeLabel>State</Text>}
                                scrollTrue
                            />
                            <Text errorText> {error.state_id ? error.state_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'city',
                                    value: state.city,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>City</Text>}
                            />
                            <Text errorText> {error.city ? error.city : ""}</Text>
                        </Box>
                    </Grid>

                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'zip_code',
                                    value: state.zip_code,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Zipcode</Text>}
                            />
                            <Text errorText> {error.zip_code ? error.zip_code : ""}</Text>
                        </Box>

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