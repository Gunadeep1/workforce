import React from 'react'
import VendorProfileStyles from './VendorProfileStyles';
import { Box, Grid, Tooltip, Checkbox, tooltipClasses, Skeleton, Typography } from '@mui/material';
import Text from '../../../../components/customText/Text';
import Input from '../../../../components/input/Input';
import Button from '../../../../components/customButton/Button';
import AddNetPayTerms from '../../addSelectForms/AddNetPayTerms';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import FileInput from '../../../../components/muiFileInput/FileInput';
import { useState } from 'react';
import LocalStorage from '../../../../utils/LocalStorage';
import CommonApi from '../../../../apis/CommonApi';
import { useEffect } from 'react';
import { styled } from '@mui/system';
import { isValid, isValidMulti, validateAplaSpecialChar, validate_alphaNumeric, validate_emptyField, validate_withCharDigit, validate_zipcode } from '../../../../components/Validation';
import VendorApi from '../../../../apis/admin/clients/VendorApi';
import { addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../utils/utils';
import { ReactComponent as CheckedIcon } from '../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../assets/svg/CheckedBorderIcon.svg';
import ReusablePopup from '../../../../components/reuablePopup/ReusablePopup';
import ConfirmImg from '../../../../assets/svg/confirm-BG-img.svg';
import CustomButton from '../../../../components/customButton/Button';
import { useLocation } from 'react-router-dom';


function CompanyDetails({ id }) {
    const classes = VendorProfileStyles();
    const location = useLocation();
    const action = location.state.viewState
    const [opentooltip, setOpentooltip] = useState(false);
    const tooltipToggle = () => {
        opentooltip ? setOpentooltip(false) : setOpentooltip(true)
    }
    const [view, setView] = useState(action)
    const [deletePopup, setDeletePopup] = useState(false);

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip open={opentooltip} arrow {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 600,
            border: '1px solid #bdbdbd',
            padding: '0px !important'
        },
    }));

    const [state, setState] = useState({
        id: '',
        name: '',
        reference_id: '',
        net_pay_terms_id: '',
        same_as_above: false,
        billing_address: [
            {
                address_line_one: "",
                address_line_two: "",
                city: "",
                state_id: "",
                state_name: "",
                country_id: "",
                country_name: "",
                zip_code: "",
            },
        ],
        shipping_address: [
            {
                id: '',
                address_line_one: "",
                address_line_two: "",
                city: "",
                state_id: "",
                state_name: "",
                country_id: "",
                country_name: "",
                zip_code: "",
            },
        ],
        documents: [
            {
                id: '',
                new_document_id: '',
                document_name: ''
            }
        ]
    })
    const [error, setError] = useState({});
    const [shippingAddress, setShippingAddress] = useState(true);
    const [shippingError, setShippingError] = useState([]);
    const [communicationError, setCommunicationError] = useState([]);
    const [countries, setCountries] = useState([]);
    const [payTerms, setPayTerms] = useState([]);
    const [states, setStates] = useState([]);
    const [formTT, setFormTT] = useState(false);
    const [edit, setEdit] = useState(false);
    const [getloading, setGetloading] = useState(false);

    useEffect(() => {
        if(action == 'edit'){
            setEdit(true)
        }
        getCountries();
        netPayterms();
        if (id !== '' && id !== null && id !== undefined) {
            IndexApi(id);
        } // eslint-disable-next-line
    }, [])

    const yesPopup = () => {
        setCommunicationError([]);
        setShippingError([]);
        setError({});
        setView('view');
        setDeletePopup(false);
        setEdit(false);
        IndexApi(id);
    }


    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        }, handleCompanyValidate(e));
    }

    const uploadDocs = (e, index) => {
        const formData = new FormData();
        formData.append('files', e.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("company_logo",formData, LocalStorage.getAccessToken())
            .then((res) => {
                if (res.data.statusCode === 1003) {
                    state.documents[index].new_document_id = res.data.data.id
                    state.documents[index].document_name = e.target.files[0].name
                    setState({ ...state })
                } else {
                    addErrorMsg(res.data.message);
                }
            });
    }

    const handleCompanyValidate = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case "name":
                error.name = validate_alphaNumeric(input.value);
                break;
            case "reference_id":
                error.reference_id = validate_emptyField(input.value);
                break;
            case "net_pay_terms_id":
                error.net_pay_terms_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        let s1 = { ...error };
        setError(s1);
    };

    const handleValidateCommunicationAdd = (e, index) => {
        let input = e;
        let error =
            communicationError.length > 0
                ? communicationError
                    ? communicationError[index]
                    : communicationError
                : communicationError;
        for (var k = 0; k <= index; k++) {
            communicationError.push({});
        }
        let s1 =
            communicationError.length > 0
                ? [...communicationError]
                : [{ ...communicationError }];
        switch (input.name || input.tagName) {
            case "address_line_one":
                error.address_line_one = validate_withCharDigit(input.value);
                break;
            case "address_line_two":
                error.address_line_two = validate_withCharDigit(input.value);
                break;
            case "city":
                error.city = validateAplaSpecialChar(input.value);
                break;
            case "state_id":
                error.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                error.country_id = validate_emptyField(input.value);
                break;
            case "zip_code":
                error.zip_code = validate_zipcode(input.value, state.billing_address[index].country_id);
                break;
            default:
                break;
        }
        setCommunicationError(s1);
    };

    const communicationChangeHandler = (e, value, index) => {
        if (e.target.name == "country_id") {
            getStatesApi(e.target.value);
            state.billing_address[index][e.target.name] = e.target.value;
            state.billing_address[index]['country_name'] = value.props.children;
            state.billing_address[index].state_id = ''
            state.billing_address[index].zip_code = ''
            if (state.same_as_above) {
                state.shipping_address[index][e.target.name] = e.target.value;
                state.shipping_address[index]['country_name'] = value.props.children;
            }
            setState(state, handleValidateCommunicationAdd(e.target, index));
        } else {
            state.billing_address[index][e.target.name] = e.target.value;
            if (state.same_as_above) {
                state.shipping_address[index][e.target.name] = e.target.value;
            }
            setState(state, handleValidateCommunicationAdd(e.target, index));
        }
    };

    const handleChangeCheckBox = (event) => {
        if (event.target.checked) {
            setState({
                ...state,
                same_as_above: event.target.checked,
                shipping_address: [
                    {
                        address_line_one: state.billing_address[0].address_line_one,
                        address_line_two: state.billing_address[0].address_line_two,
                        city: state.billing_address[0].city,
                        state_id: state.billing_address[0].state_id,
                        state_name: state.billing_address[0].state_name,
                        country_id: state.billing_address[0].country_id,
                        country_name: state.billing_address[0].country_name,
                        zip_code: state.billing_address[0].zip_code,
                    },
                ],
            });
            setShippingAddress(false);
        } else {
            setState({
                ...state,
                same_as_above: event.target.checked,
                shipping_address: [
                    {
                        address_line_one: "",
                        address_line_two: "",
                        city: "",
                        state_id: "",
                        state_name: "",
                        country_id: "",
                        country_name: "",
                        zip_code: "",
                    },
                ],
            });
            setShippingAddress(true);
        }
    };

    const shippingChangeHandler = (e, value, index) => {
        if (e.target.name == "country_id") {
            getStatesApi(e.target.value);
            state.shipping_address[index][e.target.name] = e.target.value;
            state.shipping_address[index]['country_name'] = value.props.children;
            state.shipping_address[index].state_id = ''
            state.shipping_address[index].zip_code = ''
            setState(state, handleValidateShippingAdd(e.target, index));
        }
        else {
            state.shipping_address[index][e.target.name] = e.target.value;
            setState(state, handleValidateShippingAdd(e.target, index));
        }
    };

    const handleValidateShippingAdd = (e, index) => {
        let input = e;
        let error =
            shippingError.length > 0
                ? shippingError
                    ? shippingError[index]
                    : shippingError
                : shippingError;
        for (var k = 0; k <= index; k++) {
            shippingError.push({});
        }
        let s1 =
            shippingError.length > 0 ? [...shippingError] : [{ ...shippingError }];
        switch (input.name || input.tagName) {
            case "address_line_one":
                error.address_line_one = validate_withCharDigit(input.value);
                break;
            case "address_line_two":
                error.address_line_two = validate_withCharDigit(input.value);
                break;
            case "city":
                error.city = validateAplaSpecialChar(input.value);
                break;
            case "state_id":
                error.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                error.country_id = validate_emptyField(input.value);
                break;
            case "zip_code":
                error.zip_code = validate_zipcode(input.value, state.shipping_address[index].country_id);
                break;
            default:
                break;
        }
        setShippingError(s1);
    };

    const companyDetailsValidations = () => {
        let { name, reference_id, net_pay_terms_id } = state;
        let errors = {};
        errors.name = validate_alphaNumeric(name);
        errors.reference_id = validate_emptyField(reference_id);
        errors.net_pay_terms_id = validate_emptyField(net_pay_terms_id);
        return errors;
    };
    const companyCommAddressValidations = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        state.billing_address.map((value) => {
            errors = {};
            errors.address_line_one = validate_withCharDigit(value.address_line_one);
            errors.country_id = validate_emptyField(value.country_id);
            errors.state_id = validate_emptyField(value.state_id);
            errors.city = validateAplaSpecialChar(value.city);
            errors.zip_code = validate_zipcode(value.zip_code, value.country_id);
            err.push(errors);
        });
        return err;
    };

    const companyShippingAddressValidations = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        state.shipping_address.map((value) => {
            errors = {};
            errors.address_line_one = validate_withCharDigit(value.address_line_one);
            errors.country_id = validate_emptyField(value.country_id);
            errors.state_id = validate_emptyField(value.state_id);
            errors.city = validateAplaSpecialChar(value.city);
            errors.zip_code = validate_zipcode(value.zip_code, value.country_id);
            err.push(errors);
        });
        return err;
    };

    const updatevendor = (args) => {
        VendorApi.updateCompany(id, args).then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg('Company Details Updated Successfully');
                setEdit(false);
                setView('view');
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const cancel = () => {
        setDeletePopup(true);
    }

    const handleSubmit = () => {
        let errors = companyDetailsValidations();
        let commErrors = companyCommAddressValidations();
        let shippingErrors = companyShippingAddressValidations();
        if (isValid(errors) && isValidMulti(commErrors) && isValidMulti(shippingErrors)) {
            state['request_id'] = LocalStorage.uid();
            updatevendor(state);
        } else {
            let s1 = { error };
            s1 = errors;
            let s2 = { error };
            s2 = commErrors;
            let s3 = { error };
            s3 = shippingErrors;
            setError(s1);
            setCommunicationError(s2);
            setShippingError(s3);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }


    const getCountries = () => {
        CommonApi.getCountryList('')
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setCountries(response.data.data);
                }
            })
    }

    // States Dropdown List
    const getStatesApi = (id) => {
        CommonApi.getStatesList(id)
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setStates(response.data.data);
                }
            });
    };

    const netPayterms = () => {
        CommonApi.getNetPayTermsList(LocalStorage.uid(), '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setPayTerms(response.data.data);
            }
        });
    };

    const IndexApi = (args) => {
        setGetloading(true);
        VendorApi.indexApi(args).then((res) => {
            setTimeout(() => {
                setGetloading(false)
                if (res.data.statusCode === 1003) {
                    if (res.data.data.billing_address[0].country_id != "") {
                        getStatesApi(res.data.data.billing_address[0].country_id);
                    }
                    state.shipping_address[0].id = res.data.data.shipping_address[0].id
                    setState({ ...res.data.data })
                    if (res.data.data.same_as_above == true) {
                        setState({
                            ...res.data.data,
                            same_as_above: res.data.data.same_as_above,
                            shipping_address: [
                                {
                                    id: res.data.data.shipping_address[0].id,
                                    address_line_one: res.data.data.billing_address[0].address_line_one,
                                    address_line_two: res.data.data.billing_address[0].address_line_two,
                                    city: res.data.data.billing_address[0].city,
                                    state_id: res.data.data.billing_address[0].state_id,
                                    state_name: res.data.data.billing_address[0].state_name,
                                    country_id: res.data.data.billing_address[0].country_id,
                                    country_name: res.data.data.billing_address[0].country_name,
                                    zip_code: res.data.data.billing_address[0].zip_code,
                                }]
                        })
                        setShippingAddress(false);
                    }
                    else if (res.data.data.same_as_above == false) {
                        setState({
                            ...res.data.data,
                            shipping_address: [
                                {
                                    id: res.data.data.shipping_address[0].id,
                                    address_line_one: res.data.data.shipping_address[0].address_line_one,
                                    address_line_two: res.data.data.shipping_address[0].address_line_two,
                                    city: res.data.data.shipping_address[0].city,
                                    state_id: res.data.data.shipping_address[0].state_id,
                                    state_name: res.data.data.shipping_address[0].state_name,
                                    country_id: res.data.data.shipping_address[0].country_id,
                                    country_name: res.data.data.shipping_address[0].country_name,
                                    zip_code: res.data.data.shipping_address[0].zip_code,
                                }]
                        });
                    }
                }
            }, 400)
        })
    }
    return (
        <Box p={4} pt={5}>
            <Grid item lg={12}><Text largeBlack>Company Details</Text></Grid>
            <Grid item lg={12} md={8} sm={8} xs={12} pt={2}>
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
                        <>
                            <Grid container className={classes.contentScroll}>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'name',
                                                value: state.name,
                                                inputProps: { maxLength: 50 },
                                                disabled: view == 'view' ? true : false
                                            }}
                                            handleChange={changeHandler}
                                            clientInput
                                            labelText={<Text largeLabel>Vendor Name</Text>}
                                        />
                                        {
                                            error.name ?
                                                <Text red>{error.name ? error.name : ''}</Text> : ''
                                        }
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'reference_id',
                                                value: state.reference_id,
                                                disabled: true
                                            }}
                                            handleChange={changeHandler}
                                            clientInput
                                            labelText={<Text largeLabel>Vendor ID</Text>}
                                        />
                                        {
                                            error.reference_id ?
                                                <Text red>{error.reference_id ? error.reference_id : ''}</Text> : ''
                                        }
                                    </Grid>
                                    {
                                        state && state.documents && state.documents.map((item, key) => (
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Box pt={'11px'}>
                                                    <FileInput
                                                        name='new_document_id'
                                                        value={item.new_document_id}
                                                        FileName={item.document_name}
                                                        handleChange={(e) => uploadDocs(e, key)}
                                                        label={<Text largeLabel>Upload Logo<span className={classes.optional}>(Optional)</span></Text>}
                                                    />
                                                </Box>
                                            </Grid>
                                        ))
                                    }
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        {
                                            view == 'view' ?
                                                <Box p={1} >
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            value: state.net_pay_terms_id,
                                                            disabled: view == "view" ? true : false
                                                        }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Net Pay Terms</Text>}
                                                    />
                                                </Box> :
                                                <>
                                                    {formTT == 'net_pay_terms_id' ?
                                                        (<HtmlTooltip
                                                            title={
                                                                <AddNetPayTerms formTT={setOpentooltip} getList={netPayterms} />
                                                            }
                                                        >
                                                            <Box pt={'9px'}>
                                                                <SearchSelect
                                                                    name='net_pay_terms_id'
                                                                    value={state.net_pay_terms_id}
                                                                    options={payTerms}
                                                                    labelText={<Text largeLabel>Net Pay Terms</Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setFormTT('net_pay_terms_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    buttonName='Net Pay Terms'
                                                                />
                                                            </Box>
                                                        </HtmlTooltip>) :
                                                        <Box pt={'9px'}>
                                                            <SearchSelect
                                                                name='net_pay_terms_id'
                                                                value={state.net_pay_terms_id}
                                                                options={payTerms}
                                                                labelText={<Text largeLabel>Net Pay Terms</Text>}
                                                                onChange={changeHandler}
                                                                onClick={() => {
                                                                    setFormTT('net_pay_terms_id');
                                                                    tooltipToggle()
                                                                }}
                                                                buttonName='Net Pay Terms'
                                                            />
                                                        </Box>
                                                    }
                                                    {
                                                        error.net_pay_terms_id ?
                                                            <Text red>{error.net_pay_terms_id ? error.net_pay_terms_id : ''}</Text> : ''
                                                    }
                                                </>
                                        }
                                    </Grid>
                                    {
                                        state.billing_address.map((item, index) => (
                                            <>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'address_line_one',
                                                            value: item.address_line_one,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Address Line 1 </Text>}
                                                    />
                                                    {communicationError.length > 0 ? (
                                                        <Text red>
                                                            {communicationError[index]
                                                                ? communicationError[index].address_line_one
                                                                : ""}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'address_line_two',
                                                            value: item.address_line_two,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Address Line 2<span className={classes.optional}>(Optional)</span></Text>}
                                                    />
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    {
                                                        view == 'view' ?
                                                            <Box p={1} >
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        value: item.country_name,
                                                                        type: 'text',
                                                                        disabled: view === "view" ? true : false
                                                                    }}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>Country</Text>}
                                                                />
                                                            </Box> :
                                                            <>
                                                                <SearchSelect
                                                                    name='country_id'
                                                                    value={item.country_id}
                                                                    options={countries}
                                                                    labelText={<Text largeLabel>Country</Text>}
                                                                    onChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                                />
                                                                {communicationError.length > 0 ? (
                                                                    <Text red>
                                                                        {communicationError[index]
                                                                            ? communicationError[index].country_id
                                                                            : ""}
                                                                    </Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </>
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    {
                                                        view == 'view' ?
                                                            <Box p={1} >
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        value: item.state_name,
                                                                        type: 'text',
                                                                        disabled: view === "view" ? true : false
                                                                    }}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>State</Text>}
                                                                />
                                                            </Box> :
                                                            <>
                                                                <SearchSelect
                                                                    name='state_id'
                                                                    value={item.state_id}
                                                                    options={states}
                                                                    labelText={<Text largeLabel>State</Text>}
                                                                    onChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                                />
                                                                {communicationError.length > 0 ? (
                                                                    <Text red>
                                                                        {communicationError[index]
                                                                            ? communicationError[index].state_id
                                                                            : ""}
                                                                    </Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </>
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'city',
                                                            value: item.city,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>City</Text>}
                                                    />
                                                    {communicationError.length > 0 ? (
                                                        <Text red>
                                                            {communicationError[index]
                                                                ? communicationError[index].city
                                                                : ""}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'zip_code',
                                                            value: item.zip_code,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Zip Code</Text>}
                                                    />
                                                    {communicationError.length > 0 ? (
                                                        <Text red>
                                                            {communicationError[index]
                                                                ? communicationError[index].zip_code
                                                                : ""}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Grid>
                                            </>
                                        ))
                                    }
                                </Grid>
                                <Grid container>
                                    <Grid item container lg={12} md={12} sm={12} xs={12} p={'20px 0px'} alignItems='center'>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Text largeBlack>Shipping Address</Text>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12} textAlign='end'>
                                            <Text largeLabel>
                                                <Checkbox size='small' name='same_as_above' disabled={view == 'view' ? true : false} checked={state.same_as_above}
                                                    icon={<CheckBorderIcon />}
                                                    checkedIcon={<CheckedIcon />}
                                                    onChange={handleChangeCheckBox} />Same as Company Address
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    {
                                        shippingAddress &&
                                        state.shipping_address.map((item, index) => (
                                            <Grid item container lg={12} md={12} sm={12} xs={12} spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'address_line_one',
                                                            value: item.address_line_one,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Address Line 1 </Text>}
                                                    />
                                                    {shippingError.length > 0 ? (
                                                        <Text red>
                                                            {shippingError[index]
                                                                ? shippingError[index].address_line_one
                                                                : ""}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'address_line_two',
                                                            value: item.address_line_two,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Address Line 2 <span className={classes.optional}>(Optional)</span></Text>}
                                                    />
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    {
                                                        view == 'view' ?
                                                            <Box p={1} >
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        value: item.country_name,
                                                                        type: 'text',
                                                                        disabled: action === "update" ? false : true
                                                                    }}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>Country</Text>}
                                                                />
                                                            </Box> :
                                                            <>
                                                                <SearchSelect
                                                                    name='country_id'
                                                                    value={item.country_id}
                                                                    options={countries}
                                                                    labelText={<Text largeLabel>Country</Text>}
                                                                    onChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                                />
                                                                {shippingError.length > 0 ? (
                                                                    <Text red>
                                                                        {shippingError[index]
                                                                            ? shippingError[index].country_id
                                                                            : ""}
                                                                    </Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </>
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    {
                                                        view == 'view' ?
                                                            <Box p={1} >
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        value: item.state_name,
                                                                        type: 'text',
                                                                        disabled: action === "update" ? false : true
                                                                    }}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>State</Text>}
                                                                />
                                                            </Box> :
                                                            <>
                                                                <SearchSelect
                                                                    name='state_id'
                                                                    value={item.state_id}
                                                                    options={states}
                                                                    labelText={<Text largeLabel>State</Text>}
                                                                    onChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                                />
                                                                {shippingError.length > 0 ? (
                                                                    <Text red>
                                                                        {shippingError[index]
                                                                            ? shippingError[index].state_id
                                                                            : ""}
                                                                    </Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </>
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'city',
                                                            value: item.city,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>City</Text>}
                                                    />
                                                    {shippingError.length > 0 ? (
                                                        <Text red>
                                                            {shippingError[index]
                                                                ? shippingError[index].city
                                                                : ""}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'zip_code',
                                                            value: item.zip_code,
                                                            disabled: view == 'view' ? true : false
                                                        }}
                                                        handleChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Zip Code</Text>}
                                                    />
                                                    {shippingError.length > 0 ? (
                                                        <Text red>
                                                            {shippingError[index]
                                                                ? shippingError[index].zip_code
                                                                : ""}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Grid>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                            <Grid item lg={12} pt={4} textAlign='end'>
                                {
                                    edit ?
                                        <>
                                            <Button texutalCancel sx={{ marginRight: '15px !important' }} onClick={cancel}>Cancel</Button>
                                            <Button saveBtn onClick={handleSubmit}>Update</Button>
                                        </> :
                                        <Button saveBtn onClick={() => { setEdit(true); setView('update') }}>Edit</Button>
                                }
                            </Grid>
                        </>
                }
                {
                    deletePopup &&
                    <ReusablePopup iconHide white openPopup={deletePopup} setOpenPopup={setDeletePopup} fullWidth>
                        <Box sx={{ margin: "20px", }}>
                            <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={ConfirmImg} alt="warning" />
                            </Box>

                            <Box my={3}>
                                <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                    Are You Sure?
                                </Typography>
                                <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                    Do You Really Wish To Cancel.
                                </Typography>
                            </Box>

                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <CustomButton no onClick={() => setDeletePopup(false)}>
                                    No
                                </CustomButton>
                                <CustomButton deleteBtn onClick={yesPopup}>
                                    Yes, Cancel
                                </CustomButton>
                            </Box>

                        </Box>
                    </ReusablePopup>
                }
            </Grid>
        </Box>
    )
}

export default CompanyDetails