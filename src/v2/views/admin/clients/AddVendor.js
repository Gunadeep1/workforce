import { Box, Card, CardContent, CardHeader, Divider, Grid, Slide, Step, Stepper, Tooltip, tooltipClasses } from '@mui/material'
import React from 'react'
import Text from '../../../components/customText/Text';
import Button from '../../../components/customButton/Button';
import { BrownMnCustomisedConnector, BrownMnColorlibStepLabel, BrownMnCustomStepIcon, blue } from '../../../theme';
import { useState } from 'react';
import Input from '../../../components/input/Input';
import ClientStyles from './ClientStyles';
import { Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { empty_name, empty_usContact, isValid, validateAplaSpecialChar, validate_Extension, validate_alphaNumeric, validate_charWithSpace, validate_city, validate_contact_number, validate_emptyField, validate_withCharDigit, validate_zipcode, validates_Integer, validates_emailId } from '../../../components/Validation';
import { isValidMulti } from '../../../../v2/components/Validation';
import minus from '../../../assets/client/minus-circle.svg';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import success from '../../../assets/client/clientSuccess.svg';
import { useNavigate } from 'react-router-dom';
import LocalStorage from '../../../utils/LocalStorage';
import SearchSelect from '../../../components/selectField/SearchSelect';
import { useEffect } from 'react';
import AddNetPayTerms from '../addSelectForms/AddNetPayTerms';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import FileInput from '../../../components/muiFileInput/FileInput';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../utils/utils';
import CommonApi from '../../../apis/CommonApi';
import VendorApi from '../../../apis/admin/clients/VendorApi';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg';
import ClientsApi from '../../../apis/admin/clients/ClientsApi';

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

function AddVendor() {
    const classes = ClientStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingError, setShippingError] = useState([]);
    const [communicationError, setCommunicationError] = useState([]);
    const [countries, setCountries] = useState([]);
    const [getStates, setGetStates] = useState([]);
    const [payTerms, setPayTerms] = useState([]);
    const [formTT, setFormTT] = useState(false);
    const [value, setValue] = useState(0);
    const [opentooltip, setOpentooltip] = useState(false);
    const tooltipToggle = () => {
        opentooltip ? setOpentooltip(false) : setOpentooltip(true)
    }

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });

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
    const [erro, setErro] = useState([]);
    const [open, setOpen] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(true);
    // const [docError, setDocError] = useState([]);

    const [contacts, setContacts] = useState([
        {
            first_name: "",
            middle_name: "",
            last_name: "",
            email_id: "",
            contact_number: "",
            ext: "",
            mobile_number: "",
        }
    ])

    useEffect(() => {
        getCountries();
        netPayterms();
        vendorIDApi();
        // eslint-disable-next-line
    }, [])

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
                    setGetStates(response.data.data);
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

    const vendorIDApi = () => {
        CommonApi.prefix("vendor").then((res) => {
            if (res.data.statusCode == 1003) {
                setState({
                    ...state,
                    reference_id: res.data.data,
                });
            } else {
                addErrorMsg(res.data.message);
            }
        });
    };

    const vendorStore = (args) => {
        VendorApi.storeVendor(args).then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg('Company Details Added Successfully');
                setActiveStep(activeStep + 1);
                setValue(value + 1)
                LocalStorage.setVendorID(res.data.data.id);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const updatevendor = (args) => {
        VendorApi.updateCompany(LocalStorage.getVendorID(), args).then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg('Company Details Updated Successfully');
                setActiveStep(activeStep + 1);
                setValue(value + 1)
                // LocalStorage.setVendorID(res.data.data.id)
                if (state.id !== '' && state.id !== null && state.id !== undefined) {
                    contatcIndex(LocalStorage.getVendorID());
                }
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const IndexApi = (args) => {
        VendorApi.indexApi(args).then((res) => {
            if (res.data.statusCode === 1003) {
                if (res.data.data.billing_address[0].country_id != "") {
                    getStatesApi(res.data.data.billing_address[0].country_id);
                }
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
                setShippingError([]);
            }
        })
    }

    // eslint-disable-next-line
    const contatcIndex = (args) => {
        VendorApi.contactIndex(args).then((res) => {
            if (res.data.statusCode == 1003) {
                // if (res.data.data.length == 0) {
                //     setContacts([
                //         {
                //             first_name: "",
                //             middle_name: "",
                //             last_name: "",
                //             email_id: "",
                //             contact_number: "",
                //             ext: "",
                //             mobile_number: "",
                //         }
                //     ])
                // } else {
                //     setContacts(res.data.data)
                // }
                setContacts(res.data.data)
            }
        })
    }

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        }, handleCompanyValidate(e));
    }

    const uploadDocs = (e, index) => {
        if (e.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg'].includes(r))) {
            const formData = new FormData();
            formData.append('files', e.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("company-logo",formData, LocalStorage.getAccessToken())
                .then((res) => {
                    if (res.data.statusCode === 1003) {
                        state.documents[index].new_document_id = res.data.data.id
                        state.documents[index].document_name = e.target.files[0].name
                        setState({ ...state })
                    } else {
                        addErrorMsg(res.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg).");
        }
    }

    // const handleValidateDocs = (e, index) => {
    //     let input = e.target;
    //     let err = docError.length > 0 ? (docError ? docError[index] : docError) : docError;
    //     for (var k = 0; k <= index; k++) {
    //         docError.push({})
    //     }
    //     let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
    //     switch (input.name || input.tagName) {
    //         case 'new_document_id':
    //             err.new_document_id = validate_emptyField(input.value)
    //             break
    //         default:
    //             break
    //     }
    //     setDocError(s1);
    // }

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

    // handle change for copying communicate address to shipping address
    const handleChangeCheckBox = (event) => {
        if (event.target.checked == true) {
            setShippingAddress(false);
            console.log(state.shipping_address, "ship");
            setState({
                ...state,
                same_as_above: event.target.checked,
                shipping_address: [
                    {
                        id: state.shipping_address[0].id,
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
            setShippingError([]);
            setShippingAddress(false);
        } else {
            setState({
                ...state,
                same_as_above: event.target.checked,
                shipping_address: [
                    {
                        id: state.shipping_address[0].id,
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
                error.city = validate_city(input.value);
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
                error.city = validate_city(input.value);
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
            errors.zip_code = validates_Integer(value.zip_code, value.country_id);
            err.push(errors);
        });
        return err;
    };

    const handleChange = (e, index) => {
        if (e.target.name == "mobile_number" || e.target.name == "contact_number") {
            convertFormat(e, index)
        } else {
            contacts[index][e.target.name] = e.target.value
            setContacts([...contacts], handleValidateContact(e, index));
        }
    };

    const convertFormat = (e, index) => {
        const value = e.target.value;
        const name = e.target.name
        const input = value.replace(/\D/g, '').substring(0, 10);
        // Divide numbers in 3 parts :"(123) 456-7890" 
        const first = name == 'mobile_number' || name == 'contact_number' ? input.substring(0, 3) : input.substring(0, 3);
        const middle = name == 'mobile_number' || name == 'contact_number' ? input.substring(3, 6) : input.substring(3, 5);
        const last = name == 'mobile_number' || name == 'contact_number' ? input.substring(6, 10) : input.substring(5, 9);

        if (input.length > (name == 'mobile_number' || name == 'contact_number' ? 6 : 5)) {
            contacts[index][e.target.name] = `${first}-${middle}-${last}`
            setContacts([...contacts], handleValidateContact(e, index))
        }
        else if (input.length > 3) {
            contacts[index][e.target.name] = `${first}-${middle}`
            setContacts([...contacts], handleValidateContact(e, index))
        }
        else if (input.length >= 0) {
            contacts[index][e.target.name] = input
            setContacts([...contacts], handleValidateContact(e, index))
        }
    }

    const handleSubmit = () => {
        let errors = companyDetailsValidations();
        let commErrors = companyCommAddressValidations();
        let shippingErrors = companyShippingAddressValidations();
        let contactErrors = validateContacts();
        if (activeStep == 0) {
            if (isValid(errors) && isValidMulti(commErrors) && isValidMulti(shippingErrors)) {
                state['request_id'] = LocalStorage.uid();
                if (state.id !== '' && state.id !== null && state.id !== undefined) {
                    updatevendor(state)
                } else {
                    vendorStore(state)
                }
            } else {
                let s1 = { error };
                s1 = errors;
                let s2 = { error };
                s2 = commErrors;
                let s3 = { error };
                s3 = shippingErrors;
                // let s4 = { docError }
                // s4 = documentErrors
                setError(s1);
                setCommunicationError(s2);
                setShippingError(s3);
                // setDocError(s4);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        } else if (activeStep == 1) {
            if (isValidMulti(contactErrors)) {
                const data = {
                    request_id: LocalStorage.uid(),
                    company_id: LocalStorage.getVendorID(),
                    contacts: contacts
                }
                data['request_id'] = LocalStorage.uid();
                VendorApi.storeContact(data).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg('Contact Details Added Successfully');
                        setOpen(true);
                        setValue(1);
                        setActiveStep(1);
                    }
                })
            } else {
                let s2 = { erro };
                s2 = contactErrors;
                setErro(s2);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        }
    }

    const back = () => {
        if (activeStep == 0) {
            navigate('/clients', { state: { page: 'vendors' } })
        } else if (activeStep == 1) {
            IndexApi(LocalStorage.getVendorID());
            setActiveStep(0);
            setValue(value - 1)
        }
    }

    const addContact = (action, index) => {
        let obj = {
            first_name: "",
            middle_name: "",
            last_name: "",
            email_id: "",
            contact_number: "",
            ext: "",
            mobile_number: "",
        };
        if (action == "Add") {
            contacts.push(obj);
        } else if (action == 'Remove') {
            const data = {
                request_id: LocalStorage.uid(),
                company_id: LocalStorage.getVendorID()
            }
            ClientsApi.destroyContact('vendor', contacts[index].id, data).then((res) => {
                if (res.data.statusCode == 1003) {
                    contacts.splice(index, 1);
                    IndexApi(LocalStorage.getVendorID());
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        }
        setContacts([...contacts])
    }

    const validateContacts = () => {
        let errorsus = {};
        let err = [];
        contacts.map((value) => {
            errorsus = {};
            errorsus.first_name = validate_charWithSpace(value.first_name);
            errorsus.last_name = validate_charWithSpace(value.last_name);
            errorsus.email_id = validates_emailId(value.email_id);
            errorsus.mobile_number = validate_contact_number(value.mobile_number, "Mobile Number");
            errorsus.ext = validate_Extension(value.ext);
            errorsus.middle_name = empty_name(value.middle_name);
            return err.push(errorsus);
        });
        return err;
    };

    const handleValidateContact = (e, index) => {
        let input = e.target;
        let error = erro.length > 0 ? (erro ? erro[index] : erro) : erro;
        for (var k = 0; k <= index; k++) {
            erro.push({});
        }
        let s2 = erro.length > 0 ? [...erro] : [{ ...erro }];
        switch (input.name || input.tagName) {
            case "contact_number":
                error.contact_number = empty_usContact(input.value, "Phone Number");
                break;
            case "ext":
                error.ext = validate_Extension(input.value);
                break;
            case "mobile_number":
                error.mobile_number = validate_contact_number(input.value, "Mobile Number");
                break;
            case "first_name":
                error.first_name = validate_charWithSpace(input.value);
                break;
            case "middle_name":
                error.middle_name = empty_name(input.value);
                break;
            case "last_name":
                error.last_name = validate_charWithSpace(input.value);
                break;
            case "email_id":
                error.email_id = validates_emailId(input.value);
                break;
            default:
                break;
        }
        setErro(s2);
    };

    return (
        <Grid container justifyContent='center' pb={5}>
            <Grid item container lg={6} md={10} sm={9} xs={4} justifyContent='center' position='fixed' zIndex='1000' sx={{ background: '#FFFFFF' }}>
                <Grid item lg={6} md={10} sm={10} xs={12} pt={2} textAlign='center' p={'30px 0px !important'}>
                    <Stepper activeStep={activeStep}
                        connector={<BrownMnCustomisedConnector />}
                    >
                        <Step>
                            <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                                <Text BrowmnMnStepperText> Company Details</Text>
                            </BrownMnColorlibStepLabel>
                        </Step>
                        <Step>
                            <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                                <Text BrowmnMnStepperText> Contact Details</Text>
                            </BrownMnColorlibStepLabel>
                        </Step>
                    </Stepper>
                </Grid>
            </Grid>
            <Grid item lg={5.5} md={8} sm={8} xs={12} pt={9}>
                <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Card sx={{ padding: '20px 10px 10px 10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 30px !important' }} title={
                                <Text headerBlack>Company Details</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '20px 30px 30px 30px !important' }}
                            >
                                {
                                    activeStep == 0 &&
                                    <Box>
                                        <Grid container spacing={2}>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'name',
                                                        value: state.name,
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
                                                                // value={item.new_document_id}
                                                                FileName={item.document_name}
                                                                handleChange={(e) => uploadDocs(e, key)}
                                                                label={<Text largeLabel>Upload Logo<span className={classes.optional}>(Optional)</span></Text>}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                ))
                                            }
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
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
                                                                }}
                                                                handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                                clientInput
                                                                labelText={<Text largeLabel>Address Line 2<span className={classes.optional}>(Optional)</span></Text>}
                                                            />
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <SearchSelect
                                                                name='country_id'
                                                                value={item.country_id}
                                                                options={countries}
                                                                labelText={<Text largeLabel>Country</Text>}
                                                                onChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                            />
                                                            {communicationError.length > 0 ?
                                                                <Text red>
                                                                    {communicationError[index]
                                                                        ? communicationError[index].country_id
                                                                        : ""}
                                                                </Text>
                                                                : ''
                                                            }
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <SearchSelect
                                                                name='state_id'
                                                                value={item.state_id}
                                                                options={getStates}
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
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <Input
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    name: 'city',
                                                                    value: item.city,
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
                                                                    disabled: item.country_id === ''
                                                                }}
                                                                handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                                                clientInput
                                                                labelText={<Text largeLabel>{item.country_name == 'India' ? 'Pin Code' : 'Zip Code'}</Text>}
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
                                                        <Checkbox size='small' name='same_as_above' checked={state.same_as_above}
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
                                                                }}
                                                                handleChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                                clientInput
                                                                labelText={<Text largeLabel>Address Line 2 <span className={classes.optional}>(Optional)</span></Text>}
                                                            />
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
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
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <SearchSelect
                                                                name='state_id'
                                                                value={item.state_id}
                                                                options={getStates}
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
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <Input
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    name: 'city',
                                                                    value: item.city,
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
                                                                    disabled: item.country_id === ''
                                                                }}
                                                                handleChange={(e, val) => { shippingChangeHandler(e, val, index) }}
                                                                clientInput
                                                                labelText={<Text largeLabel>{item.country_name == 'India' ? 'Pin Code' : 'Zip Code'}</Text>}
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
                                    </Box>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Card sx={{ padding: '20px 10px 10px 10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 30px !important' }} title={
                                <Text headerBlack>Contact Details</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '20px 30px 30px 30px !important' }}
                            >
                                {
                                    activeStep == 1 &&
                                    contacts.map((item, index) => (
                                        <Grid container spacing={2} pt={index > 0 ? '15px' : ''}>
                                            {
                                                index > 0 &&
                                                <>
                                                    <Grid item container lg={12} md={12} sm={12} xs={12} mt={2}>
                                                        <Grid item lg={8} md={8} sm={8} xs={10}>
                                                            <Text largeBlack>Contact Details -{index + 1}</Text>
                                                        </Grid>
                                                        <Grid item lg={4} md={4} sm={4} xs={2} textAlign='end'>
                                                            <img src={minus} alt='Minus' style={{ cursor: 'pointer' }} onClick={() => addContact('Remove', index)} />
                                                        </Grid>
                                                    </Grid><Divider sx={{ width: '100%', color: '#C7CCD3 !important', margin: '10px' }} />
                                                </>
                                            }
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'first_name',
                                                        value: item.first_name,
                                                        inputProps: { maxLength: 50 }
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>First Name</Text>}
                                                />
                                                {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].first_name : ""}</Text>) : ''}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'middle_name',
                                                        value: item.middle_name,
                                                        inputProps: { maxLength: 50 }
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>Middle Name<span className={classes.optional}>(Optional)</span></Text>}
                                                />
                                                {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].middle_name : ""}</Text>) : ''}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'last_name',
                                                        value: item.last_name,
                                                        inputProps: { maxLength: 50 }
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>Last Name</Text>}
                                                />
                                                {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].last_name : ""}</Text>) : ''}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'email_id',
                                                        value: item.email_id,
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>Email ID</Text>}
                                                />
                                                {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].email_id : ""}</Text>) : ''}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'mobile_number',
                                                        value: item.mobile_number,
                                                        inputProps: { maxLength: 12 },
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>Mobile Number</Text>}
                                                />
                                                {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].mobile_number : ""}</Text>) : ''}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'ext',
                                                        value: item.ext,
                                                        inputProps: { maxLength: 4 },
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>Extension</Text>}
                                                />
                                                {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].ext : ""}</Text>) : ''}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'contact_number',
                                                        value: item.contact_number,
                                                        inputProps: { maxLength: 12 },
                                                    }}
                                                    handleChange={(e) => handleChange(e, index)}
                                                    clientInput
                                                    labelText={<Text largeLabel>Phone Number<span className={classes.optional}>(Optional)</span></Text>}
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].contact_number &&
                                                        <span className={classes.helperTextError}>{erro[index].contact_number}</span>
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                                <Grid item lg={12} m={'25px 0px 0px 0px !important'}>
                                    <Button lightBlue onClick={() => addContact('Add')}>Add Contact</Button>
                                </Grid>
                            </CardContent>
                        </Card>
                    </TabPanel>
                </SwipeableViews>
                <Grid item container p={'10px 20px 0px 20px'}>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                        <Button blackCancel onClick={back}>{activeStep == 0 ? 'Home' : 'Back'}</Button>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6} textAlign='end'>
                        <Button save onClick={handleSubmit}>{activeStep == 0 ? 'Save & Continue' : 'Finish'}</Button>
                    </Grid>
                </Grid>
            </Grid>
            {
                open &&
                <ReusablePopup iconHide openPopup={open} setOpenPopup={setOpen} white statusWidth>
                    <Box textAlign='center' p={'10px 20px 0px 20px'}>
                        <img src={success} alt='success' />
                        <Text veryLargeLabel sx={{ paddingTop: '25px !important' }}>Succesfully Added!</Text>
                        <Text mediumLabel sx={{ padding: '10px 0px 30px 0px !important' }}>You Have Successfully {state.id !== '' && state.id !== null && state.id !== undefined ? 'Updated' : 'Added'} <span style={{ color: `${blue}` }}>{state.name}</span> Details.</Text>
                        <Button onClick={() => navigate('/clients', { state: { page: 'vendors' } })} blueButton>Go To Home</Button>
                    </Box>
                </ReusablePopup>
            }
        </Grid >
    )
}

export default AddVendor