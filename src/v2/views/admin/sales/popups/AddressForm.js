import React, { useState, useEffect } from 'react'
import { Box, Grid, Stack, } from "@mui/material";
import Button from '../../../../components/customButton/Button';
import Text from '../../../../components/customText/Text';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/closeIcons.svg';
import Input from '../../../../components/input/Input';
import SearchSelect from '../../../../components/selectField/SearchSelect';
// import InvoiceDashborardStyles from '../invoices/InvoicesDashboardStyles';
import CommonApi from '../../../../apis/CommonApi';
import LocalStorage from '../../../../utils/LocalStorage';
import { isValid, validate_city, validate_emptyField, validate_withCharDigit, validate_zipcode, } from '../../../../components/Validation';
import InvoicesApi from '../../../../apis/admin/sales/InvoicesApi';
import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';
import LoadingButton from '../../../../components/customButton/LoadingButton';
import SalesStyles from '../SalesStyles';
import { useLocation } from 'react-router-dom';


export default function AddressForm(props) {

    const { slug, label, closePopup, companyId, editAddressAction, editAddressData } = props;
    const location = useLocation();
    const classes = SalesStyles();

    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [getStates, setGetStates] = useState([]);
    const [error, setError] = useState({});

    const [state, setState] = useState({
        company_id: companyId,
        address_line_one: '',
        address_line_two: '',
        city: '',
        state_id: '',
        country_id: '',
        zip_code: '',
        address_type: slug,
    });

    useEffect(() => {

        if (editAddressAction) {
            getStatesApi(editAddressData.country_id)
            setState({ ...editAddressData })
            console.log(editAddressData, " 111111111111111 editAddressData");
        }

        getCountries();
        // eslint-disable-next-line         
    }, [])

    // States Dropdown List
    const getStatesApi = (id) => {
        CommonApi.getStatesList(id)
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setGetStates(response.data.data);
                }
            });
    };

    // Country Drodown List
    const getCountries = () => {
        CommonApi.getCountryList('', LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setCountries(response.data.data);
                }
            })
    }

    const storeShippingAddress = () => {
        let data = { ...state, request_id: LocalStorage.uid(), };
        let apiSlug;

        if (editAddressAction) {
            data = { ...data, id:editAddressData.id, };
        }
        

        if (location.pathname == "/sales/add-invoices") {
            apiSlug = "client";
        }
        if (location.pathname == "/sales/add-bills") {
            apiSlug = "bill";
        }
        setLoading(true)
        InvoicesApi.storeAddress(apiSlug, data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    closePopup();
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    const handleValidates = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "address_line_one":
                err.address_line_one = validate_withCharDigit(input.value);
                break;
            case "address_line_two":
                err.address_line_two = validate_withCharDigit(input.value);
                break;
            case "city":
                err.city = validate_city(input.value);
                break;
            case "state_id":
                err.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                err.country_id = validate_emptyField(input.value);
                break;
            case "zip_code":
                err.zip_code = validate_zipcode(input.value, state.country_id);
                break;
            default:
                break;

        }
        setError(err);
    };

    const onChangeHandler = (e) => {
        if (e.target.name == "country_id") {
            getStatesApi(e.target.value);
            setState({ ...state, [e.target.name]: e.target.value })
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
        }
        handleValidates(e)
    };


    const validateAll = () => {
        let { address_line_one, address_line_two, city, state_id, country_id, zip_code } = state;
        let errors = {};
        errors.address_line_one = validate_withCharDigit(address_line_one);
        errors.address_line_two = validate_withCharDigit(address_line_two);
        errors.city = validate_city(city);
        errors.state_id = validate_emptyField(state_id);
        errors.country_id = validate_emptyField(country_id);
        errors.zip_code = validate_zipcode(zip_code, state.country_id);
        return errors;

    };


    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            storeShippingAddress();
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    return (
        <Box sx={{ width: '100%', }}>
            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} mb={4} >
                <Text className={classes.heading2}>{label}</Text>
                <CloseIcon onClick={() => closePopup()} style={{ cursor: 'pointer' }} />
            </Stack>

            <Grid container columnSpacing={3}>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Box sx={{ height: '80px' }}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'address_line_one',
                                value: state.address_line_one,
                                inputProps: { maxLength: 150 }
                            }}

                            labelText={'Address Line 1'}
                            handleChange={onChangeHandler}
                            clientInput

                        />
                        <Text errorText> {error.address_line_one ? error.address_line_one : ""}</Text>
                    </Box></Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '80px', }}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'address_line_two',
                                value: state.address_line_two,
                                inputProps: { maxLength: 150 }
                            }}

                            labelText={'Address Line 2'}
                            handleChange={onChangeHandler}
                            clientInput

                        />
                        <Text errorText> {error.address_line_two ? error.address_line_two : ""}</Text>
                    </Box></Grid>


                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '80px', }}>
                        <SearchSelect
                            options={countries}
                            name={'country_id'}
                            value={state.country_id}
                            labelText={'Country'}
                            onChange={onChangeHandler}
                        />
                        <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '80px', }}>

                        <SearchSelect
                            options={getStates}
                            name={'state_id'}
                            value={state.state_id}
                            labelText={'State'}
                            onChange={onChangeHandler}
                        />

                        <Text errorText> {error.state_id ? error.state_id : ""}</Text>
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '80px', }}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'city',
                                value: state.city,
                                inputProps: { maxLength: 50 }
                            }}
                            labelText={'City'}
                            handleChange={onChangeHandler}
                            clientInput

                        />
                        <Text errorText> {error.city ? error.city : ""}</Text>
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '80px', }}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'zip_code',
                                value: state.zip_code,
                                inputProps: { maxLength: 7 }
                            }}

                            labelText={'Zipcode'}
                            handleChange={onChangeHandler}
                            clientInput

                        />
                        <Text errorText> {error.zip_code ? error.zip_code : ""}</Text>
                    </Box>
                </Grid>

            </Grid>

            <Stack direction={'row'} justifyContent={'end'} gap={2} mt={4}>
                <Button outlineBlue redHover sx={{ width: '95px', height: '42px !important' }} onClick={() => closePopup(false)}>Cancel</Button>
                {/* <Button blueBtnSave onClick={() => handleSubmit()}>Save</Button> */}
                <LoadingButton saveLoader saveLoadersmall loading={loading} onClick={() => handleSubmit()}>
                    Save
                </LoadingButton>
            </Stack>
        </Box>
    )
}
