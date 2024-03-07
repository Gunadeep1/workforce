import { Box, Card, CardContent, CardHeader, Grid, Step, Stepper, Divider, Checkbox, Autocomplete, Chip, TextField, SwipeableDrawer, Stack, Slide } from '@mui/material'
import React from 'react'
import Text from '../../../components/customText/Text';
import Button from '../../../components/customButton/Button';
import { BrownMnCustomisedConnector, BrownMnColorlibStepLabel, clientStepper, blue } from '../../../theme';
import { useState } from 'react';
import Input from '../../../components/input/Input';
import minus from '../../../assets/client/minus-circle.svg';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import success from '../../../assets/client/clientSuccess.svg';
import { useNavigate } from 'react-router-dom';
import { empty_usContact, isValid, isValidMulti, validate_Extension, validate_alphaNumeric, validate_charWithSpace, validate_city, validate_emptyField, validate_selectField, validate_contact_number, validate_withCharDigit, validate_zipcode, validates_emailId, empty_name } from '../../../components/Validation';
import RadioGroup from '../../../components/customButton/RadioGroup';
import { useEffect } from 'react';
import CommonApi from '../../../apis/CommonApi';
import LocalStorage from '../../../utils/LocalStorage';
import ClientStyles from './ClientStyles';
import SearchSelect from '../../../components/selectField/SearchSelect';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../utils/utils';
import FileInput from '../../../components/muiFileInput/FileInput';
import ClientsApi from '../../../apis/admin/clients/ClientsApi';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/closeIcon.svg';
import CustomMultipleSelect from '../../../components/customSelect/CustomMultipleSelect';
import RichTextEditor from 'react-rte';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as Information } from '../../../assets/svg/Information.svg';
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

function AddClient() {
    const classes = ClientStyles();
    const navigate = useNavigate();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState(0);
    const [deletedLevels, setDeletedLevels] = useState([]);
    const [deletedInvLevels, setDeletedInvLevels] = useState([]);
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

    const tempArr = [{ id: 1, value: "@_first_name" }, { id: 2, value: "@_last_name" }, { id: 3, value: "@_company_name" }];

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const [daysList, setDaysList] = useState([]);

    // const [editorValue, setEditorValue] = useState(
    //     RichTextEditor.createValueFromString("", "html")
    // );

    // eslint-disable-next-line
    const [mailConfigs, setMailConfigs] = useState({
        subject: "",
        template: RichTextEditor.createValueFromString("", "html"),
        cc: [],
        bcc: [],
    })

    const [templateType, setTemplateType] = useState({
        templateType: 1,
        templateText: "",
    });

    // function onChange(value) {
    //     setEditorValue(value);
    // }

    const handleSelectTemplate = (e) => {
        setTemplateType({ ...templateType, [e.target.name]: e.target.value })
    }

    function onChangeEditor(value) {
        setInvoiceState({ ...invoiceState, template: value })
        if (value.toString("html") == "<p><br></p>" || value.toString("html") == "<p></p>" || value.toString("html") == "<p></p><br>") {
            handleValidationsEditor("");
        } else {
            handleValidationsEditor(value.toString("html"));
        }
    }

    const handleValidationsEditor = (value) => {
        let err = error;
        err.template = validate_emptyField(value);
        setError(err);
    }

    const [invoiceState, setInvoiceState] = useState({
        invoice_email_template_type: 1,
        net_pay_terms_id: '',
        cycle_id: '',
        day_start_id: '',
        to: [],
        cc: [],
        bcc: [],
        subject: "",
        template: RichTextEditor.createValueFromString("", "html"),
        approvals: [{ id: "", approver_ids: [], rank: 1 }],
        add: '',
        addTo: ''
    })

    const [timesheets, setTimesheets] = useState({
        id: '',
        cycle_id: '',
        default_hours: '00:00',
        day_start_id: '',
        ts_mandatory: 1,
        approvals: [{ id: "", approver_ids: [], rank: 1 }],
    })
    const [error, setError] = useState({});
    const [erro, setErro] = useState([]);
    const [invoiceError, setInvoiceError] = useState({});
    const [tsError, setTsError] = useState({});
    const [open, setOpen] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(true);
    const [shippingError, setShippingError] = useState([]);
    const [communicationError, setCommunicationError] = useState([]);// eslint-disable-next-line
    const [countries, setCountries] = useState([]);
    const [getStates, setGetStates] = useState([]);
    const [cycleDropdownList, setcycleDropdownList] = useState([]);
    const [paymentTerms, setPaymentTerms] = useState([]);
    const [approvaldropdownlist, setApprovaldropdownlist] = useState([]);
    const [tsState, setTsState] = useState('');
    const [contactState, setContactState] = useState('');
    const [approvalsError, setApprovalsError] = useState([{}]);
    const [approvalInvsError, setApprovalsInvError] = useState([{}]);
    const [drawer, setDrawer] = useState(false);

    useEffect(() => {
        clientIDApi();
        getCountries();
        getApprovalDropdownList();
        cycleDropdown();
        netPayterms();
        days(); // eslint-disable-next-line         
    }, [])

    const clientIDApi = () => {
        CommonApi.prefix("client").then((res) => {
            if (res.data.statusCode == 1003) {
                setState({
                    ...state,
                    reference_id: res.data.data
                });
            } else {
                addErrorMsg(res.data.message);
            }
        });
    };

    const timesheetIndex = (args) => {
        ClientsApi.timesheetIndex(args).then((res) => {
            if (res.data.statusCode === 1003) {
                setTimesheets({
                    ...res.data.data[0],
                    ts_mandatory: res.data.data[0].ts_mandatory == true ? 1 : 0
                });
            }
        })
    }

    const netPayterms = () => {
        CommonApi.getNetPayTermsList(LocalStorage.uid(), '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setPaymentTerms(response.data.data);
            }
        });
    };

    const days = () => {
        CommonApi.daysDropdown('').then((response) => {
            if (response.data.statusCode == 1003) {
                setDaysList(response.data.data);
            }
        });
    };


    const getCountries = () => {
        CommonApi.getCountryList('', LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setCountries(response.data.data);
                }
            })
    }

    const getApprovalDropdownList = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setApprovaldropdownlist(response.data.data);
            }
        });
    };

    // States Dropdown List
    const getStatesApi = (id) => {
        CommonApi.getStatesList(id)
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setGetStates(response.data.data);
                }
            });
    };

    const cycleDropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setcycleDropdownList(response.data.data);
            }
        });
    };


    const [contacts, setContacts] = useState([
        {
            id: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            email_id: "",
            contact_number: "",
            ext: "",
            mobile_number: "",
        }
    ])

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

    const changeHandler = (e, args) => {
        if (e.target.name == 'invoice_email_template_type') {
            setInvoiceState({
                ...invoiceState,
                [e.target.name]: e.target.value
            })
            if (e.target.value == '2') {
                setDrawer(true)
                // setStateNew({ ...stateNew, 'right': true });
                // toggleDrawer("right", true);
            }
        }
        if (args === 'invoice') {
            if (e.target.name == 'net_pay_terms_id' || e.target.name == 'cycle_id' || e.target.name == 'day_start_id') {
                setInvoiceState({
                    ...invoiceState,
                    [e.target.name]: e.target.value
                })
                switch (e.target.name) {
                    case 'net_pay_terms_id':
                        setInvoiceError(validate_selectField("net_pay_terms_id", invoiceError));
                        break;
                    case 'cycle_id':
                        setInvoiceError(validate_selectField("cycle_id", invoiceError));
                        break;
                    case 'day_start_id':
                        setInvoiceError(validate_selectField("day_start_id", invoiceError));
                        break;
                    default:
                        break
                }
            }
        }
        if (e.target.name == 'cycle_id' || e.target.name == 'default_hours' || e.target.name == 'day_start_id') {
            switch (e.target.name) {
                case 'cycle_id':
                    setTsError(validate_selectField("cycle_id", tsError));
                    break;
                case 'default_hours':
                    setTsError(validate_selectField("default_hours", tsError));
                    break;
                case 'day_start_id':
                    setTsError(validate_selectField('day_start_id', tsError));
                    break;
                default:
                    break
            }
            setTimesheets({
                ...timesheets,
                [e.target.name]: e.target.value
            })
        } else {
            setTimesheets({
                ...timesheets,
                [e.target.name]: e.target.value
            })
        }
        setState({
            ...state,
            [e.target.name]: e.target.value
        }, handleValidate(e))
    }

    const statusItems = [
        { id: 1, title: <Text mediumBlack>Default Configuration</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>Custom Configuration</Text>, value: 2 },
    ]

    const timesheetsOptions = [
        { id: 1, title: <Text blackFont14>Mandatory</Text>, value: 1 },
        { id: 0, title: <Text blackFont14>Non-Mandatory</Text>, value: 0 },
    ]

    // const addButton = () => {
    //     let arr = [{ id: 1, value: "Employee" }, { id: 2, value: "User" }];
    //     let err = error;
    //     if (invoiceState.addTo == 1) {
    //         var finalText = invoiceState.subject + arr.filter(i => i.id == invoiceState.add)[0].value;
    //         setInvoiceState({
    //             ...invoiceState,
    //             subject: finalText
    //         });
    //         err.subject = validate_emptyField(finalText);
    //     } else if (invoiceState.addTo == 2) {
    //         setInvoiceState({
    //             ...invoiceState,
    //             template: RichTextEditor.createValueFromString(`${editorValue.toString("html")}<p>${arr.filter(i => i.id == invoiceState.add)[0].value}</p>`, "html")
    //         });
    //         setEditorValue(RichTextEditor.createValueFromString(`${editorValue.toString("html")}<p>${arr.filter(i => i.id == invoiceState.add)[0].value}</p>`, "html"));
    //         let value = `${editorValue.toString("html")}<p>${arr.filter(i => i.id == invoiceState.add)[0].value}</p>`
    //         if (value == "" || value == "<p><br></p>" || value == "<p></p>" || value == "<p></p><br>") {
    //             err.template = validate_emptyField("");
    //         } else {
    //             err.template = validate_emptyField(value.toString("html"));
    //         }
    //     }
    //     setError(err)


    // }

    const handleAddLevel = () => {
        let arr = timesheets.approvals;
        let errorsArr = approvalsError;
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        });
        errorsArr.push({});
        setTimesheets({ ...timesheets, approvals: arr });
        setApprovalsError(errorsArr);
    }

    const handleAddLevelInvoice = () => {
        let arr = invoiceState.approvals;
        let errorsArr = approvalInvsError;
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        },);
        errorsArr.push({});

        setInvoiceState({ ...invoiceState, approvals: arr });
        setApprovalsInvError(errorsArr);
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

    const handleRemoveLevelInvoice = (index) => {
        let arr = invoiceState.approvals;
        let errorsArr = approvalInvsError;
        let deletedLevelArr = deletedInvLevels;
        if (arr[index].id !== '') {
            deletedLevelArr.push(arr[index]);
        }
        arr.splice(index, 1);
        errorsArr.splice(index, 1);
        arr.forEach((ele, key) => {
            ele.rank = key + 1;
        });
        setInvoiceState({ ...invoiceState });
        setDeletedInvLevels(errorsArr);
        setDeletedInvLevels([...deletedInvLevels]);
    }

    const handleDeleteChipLevels = (key, index) => {
        let approvals = timesheets.approvals;
        let newArr = approvals[index].approver_ids;
        newArr.splice(key, 1);
        setTimesheets({ ...timesheets, approvals });
        multiLevelsValidations(approvals, 'approvals', index);
    }

    const handleDeleteChipLevelsInvoice = (key, index) => {
        let approvals = invoiceState.approvals;
        let newArr = approvals[index].approver_ids;
        newArr.splice(key, 1);
        setInvoiceState({ ...invoiceState, approvals });
        multiLevelsValidationsInvoice(approvals, 'approvals', index);
    }

    const multiLevelsValidationsInvoice = (arr, target, index) => {
        let err = approvalInvsError;
        arr.forEach((ele, key) => {
            if (key === index) {
                if (ele.approver_ids.length === 0) {
                    err[key][target] = "This field is required";
                } else {
                    err[key][target] = "";
                }
            }
        });
        setApprovalsInvError(err);
    }

    const handleChangeLevels = (e, newArr, index) => {
        let { id, value } = newArr[newArr.length - 1];
        let approvals = timesheets.approvals
        let approverIdsArr = approvals[index].approver_ids;
        if (approverIdsArr.filter((i) => i.employee_id === id).length == 0) {
            approverIdsArr.push({ id: "", employee_id: id, value: value, full_name: value });
            setTimesheets({ ...timesheets, approvals })
        }
        multiLevelsValidations(approvals, 'approvals', index);
    }

    const handleChangeLevelsInvoice = (e, newArr, index) => {
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newArr[newArr.length - 1];
            let approvals = invoiceState.approvals
            let approverIdsArr = approvals[index].approver_ids;
            if (approverIdsArr.filter((i) => i.employee_id === id).length == 0) {
                approverIdsArr.push({ id: "", employee_id: id, value: value, full_name: value });
                setInvoiceState({ ...invoiceState, approvals })
            }
            multiLevelsValidationsInvoice(approvals, 'approvals', index);
        }
    }

    const handleValidate = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case "name":
                error.name = validate_alphaNumeric(input.value);
                break;
            case "reference_id":
                error.reference_id = validate_emptyField(input.value);
                break;
            case "document_id":
                error.document_id = validate_alphaNumeric(input.value);
                break;
            case "address_line_one":
                error.address_line_one = validate_emptyField(input.value);
                break;
            case "zip_code":
                error.zip_code = validate_zipcode(input.value);
                break;
            case "address_line_two":
                error.address_line_two = validate_emptyField(input.value);
                break;
            case "city":
                error.city = validate_emptyField(input.value);
                break;
            case "state_id":
                error.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                error.country_id = validate_emptyField(input.value);
                break;
            case "net_pay_terms_id":
                error.net_pay_terms_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        let s1 = { ...error };
        setError(s1);
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

    const validateAll = () => {
        let { name, reference_id } = state;
        let errors = {};
        errors.name = validate_alphaNumeric(name);
        errors.reference_id = validate_emptyField(reference_id);
        return errors;
    }

    const validateInvoiceErrors = () => {
        let { cycle_id, net_pay_terms_id, day_start_id } = invoiceState
        let errors = {};
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.net_pay_terms_id = validate_emptyField(net_pay_terms_id);
        errors.day_start_id = invoiceState.cycle_id == 1 || invoiceState.cycle_id == 2 ? validate_emptyField(day_start_id) : '';
        setInvoiceError(errors);
        return errors;
    }

    const TimesheetErrors = () => {
        let { cycle_id, day_start_id, default_hours } = timesheets
        let errors = {};
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.default_hours = validate_emptyField(default_hours);
        errors.day_start_id = (timesheets.cycle_id == 1 || timesheets.cycle_id == 2) ? validate_emptyField(day_start_id) : '';
        return errors;
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

    const companyIndex = (args) => {
        ClientsApi.companyIndexApi(args).then((res) => {
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

    const contactIndex = (args) => {
        ClientsApi.contactIndex(args).then((res) => {
            if (res.data.statusCode === 1003) {
                setContacts(res.data.data);
            }
        })
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = timesheets.approvals;
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

    const multiLevelInvoiceSubmitValidation = () => {
        let approvalsArr = invoiceState.approvals;
        let err = approvalInvsError;
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
        setApprovalsInvError(err);
        return result.length === 0;
    }

    const handleSubmit = () => {
        // if (activeStep == 3) {
        //     // setOpen(true);
        // } else {
        //     setActiveStep(activeStep + 1);
        //     setValue(value + 1)
        // }
        let errors = validateAll();
        let commErrors = companyCommAddressValidations();
        let shippingErrors = companyShippingAddressValidations();
        let contactErrors = validateContacts();
        let invoiceErrors = validateInvoiceErrors();
        let TSErrors = TimesheetErrors();
        let multiLevelErrors = multiLevelSubmitValidation();
        let multiLevelInvoiceErrors = multiLevelInvoiceSubmitValidation();
        let mailErrors = invoiceState.invoice_email_template_type == 2 ? validateMailConfiguration() : {};
        if (activeStep == 0) {
            if (isValid(errors) && isValidMulti(commErrors) && isValidMulti(shippingErrors)) {
                state['request_id'] = LocalStorage.uid();
                state['company_id'] = LocalStorage.getClientID();
                if (state.id !== '' && state.id !== null && state.id !== undefined) {
                    ClientsApi.updateCompany(LocalStorage.getClientID(), state).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Company Details Updated Successfully');
                            setActiveStep(activeStep + 1);
                            setValue(value + 1);
                            contactIndex(LocalStorage.getClientID());
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                } else {
                    ClientsApi.storeCompany(state).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Company Details Added Successfully');
                            LocalStorage.setClientID(res.data.data.id);
                            setActiveStep(activeStep + 1);
                            setValue(value + 1);
                            contactIndex(LocalStorage.getClientID());
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                }
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
        } else if (activeStep == 1) {
            if (isValidMulti(contactErrors)) {
                const data = {
                    request_id: LocalStorage.uid(),
                    company_id: LocalStorage.getClientID(),
                    contacts: contacts
                }
                if (contactState == 'contactUpdate') {
                    ClientsApi.updateContact(LocalStorage.getClientID(), data).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Contact Details Updated Successfully');
                            setActiveStep(activeStep + 1);
                            setValue(value + 1);
                            setTsError({});
                            setApprovalsError([{}]);
                            contactIndex(LocalStorage.getClientID());
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                } else {
                    ClientsApi.storeContact(data).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Contact Details Added Successfully');
                            setActiveStep(activeStep + 1);
                            setValue(value + 1);
                            setContactState('contactUpdate');
                            contactIndex(LocalStorage.getClientID());
                            setTsError({});
                            setApprovalsError([{}]);
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                }

            } else {
                let s4 = { erro };
                s4 = contactErrors;
                setErro(s4);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        } else if (activeStep == 2) {
            if (isValid(TSErrors) && multiLevelErrors) {
                timesheets['request_id'] = LocalStorage.uid();
                timesheets['id'] = LocalStorage.getClientID();
                if (tsState == 'update') {
                    ClientsApi.updateTimesheet(timesheets.id, timesheets).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Timesheet Details Updated Successfully');
                            setActiveStep(activeStep + 1);
                            setValue(value + 1);
                            timesheetIndex(LocalStorage.getClientID());
                            setInvoiceError({});
                            setApprovalsInvError([{}]);
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                } else {
                    ClientsApi.storeTimesheet(timesheets).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Timesheet Details Added Successfully');
                            setActiveStep(activeStep + 1);
                            setValue(value + 1);
                            timesheetIndex(LocalStorage.getClientID());
                            setTsState('update');
                            setApprovalsInvError([{}]);
                            setInvoiceError({});
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                }
            } else {
                let s5 = { tsError }
                s5 = TSErrors;
                setTsError(s5);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        } else if (activeStep == 3) {
            if (isValid(invoiceErrors) && multiLevelInvoiceErrors && mailErrors) {
                invoiceState['request_id'] = LocalStorage.uid();
                invoiceState['id'] = LocalStorage.getClientID();
                ClientsApi.storeInvoice(invoiceState).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg('Invoice Configuration Added Successfully');
                        setOpen(true);
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            } else {
                let s6 = { invoiceError }
                s6 = invoiceErrors;
                setInvoiceError(s6);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        }
    }

    const back = () => {
        if (activeStep == 0) {
            navigate('/clients', { state: { page: 'Client' } })
        } else if (activeStep == 1) {
            companyIndex(LocalStorage.getClientID());
            setActiveStep(activeStep - 1);
            setValue(value - 1)
        }
        else {
            setActiveStep(activeStep - 1);
            setValue(value - 1)
        }
    }

    const addContact = (action, index) => {
        let obj = {
            id: '',
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
        } 
        else if (action == 'Remove') {
            const data = {
                request_id: LocalStorage.uid(),
                company_id: LocalStorage.getClientID()
            }
            ClientsApi.destroyContact('client', contacts[index].id, data).then((res) => {
                if (res.data.statusCode == 1003) {
                    contactIndex(LocalStorage.getClientID());
                }
                //  else {
                //     addErrorMsg(res.data.message);
                // }
            })
            contacts.splice(index, 1);
        }
        setContacts([...contacts])
    }

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

    // const templateType = (e) => {
    //     setInvoiceState({ ...invoiceState, [e.target.name]: e.target.value })
    //     handleValidates(e);
    // }

    // const invoiceHandleChange = (event, values) => {
    //     if (event.target.name == "invoice_email_template_type") {
    //         setInvoiceState({ ...invoiceState, [event.target.name]: event.target.value }, handleValidates(event));
    //         if (event.target.value == '1') {
    //             setInvoiceState({
    //                 ...invoiceState, [event.target.name]: event.target.value,
    //                 to: [],
    //                 cc: [],
    //                 bcc: [],
    //                 subject: "",
    //                 template: "",
    //             }, handleValidates(event))
    //         } else {
    //             setInvoiceState({ ...invoiceState, [event.target.name]: event.target.value }, handleValidates(event));
    //         }
    //     }
    //     else if (event.target.name == "to" || event.target.name == "cc" || event.target.name == "bcc") {
    //         setInvoiceState({ ...invoiceState, [event.target.name]: values }, handleValidates(event, values))
    //     }
    //     else {
    //         setInvoiceState({ ...invoiceState, [event.target.name]: event.target.value }, handleValidates(event));
    //     }
    //     setError(validate_selectField(event.target.name, error));
    // };

    // const handleValidates = (event, array) => {
    //     let input = event.target;
    //     let s1 = { ...error };
    //     switch (input.name || input.tagName) {
    //         case "net_pay_terms_id":
    //             error.net_pay_terms_id = validate_emptyField(input.value);
    //             break;
    //         case "cycle_id":
    //             error.cycle_id = validate_emptyField(input.value);
    //             break;
    //         case "day_start_id":
    //             error.day_start_id = validate_emptyField(input.value);
    //             break;
    //         case "invoice_email_template_type":
    //             error.invoice_email_template_type = validate_emptyField(input.value);
    //             break;
    //         case "to":
    //             if (array.length == 0) {
    //                 error.to = validate_emptyField('');
    //             } else {
    //                 error.to = validate_emptyField(array);
    //             }
    //             break;
    //         case "subject":
    //             error.subject = validate_emptyField(input.value);
    //             break;
    //         case "template":
    //             error.template = validate_emptyField(input.value);
    //             break;
    //         default:
    //             break;
    //     }
    //     setError(s1);
    // };

    const multiSelectMailsValidations = (arr, target) => {
        let err = error;
        if (arr.length === 0) {
            err[target] = "This field is required";
        } else {
            let mailErrors = [];
            arr.forEach((ele, key) => {
                if (validates_emailId(ele) === "") {
                    mailErrors.splice(key, 1);
                } else {
                    mailErrors.push(key)
                }
            });
            if (mailErrors.length === 0) {
                err[target] = "";
            } else {
                err[target] = "Please enter valid email";
            }
        }
        setError(err);
    }

    const handleChangeMails = (e, target) => {
        let { value } = e.target;
        let newArr = invoiceState[target];
        if (newArr.filter((i) => i === value).length == 0 && value !== '') {
            newArr.push(value);
            setInvoiceState({ ...invoiceState, [target]: newArr });
        }
        multiSelectMailsValidations(newArr, target);
    }

    const handleDeleteChip = (key, target) => {
        let newArr = invoiceState[target];
        newArr.splice(key, 1);
        setInvoiceState({ ...invoiceState, [target]: newArr })
        multiSelectMailsValidations(newArr, target);
    }

    const validateMailConfiguration = () => {
        let { invoice_email_template_type, cc, bcc, subject, template } = invoiceState;
        let errors = {};
        if (invoice_email_template_type == 2) {
            errors.cc = mailsValidation(cc, "cc");
            errors.bcc = mailsValidation(bcc, "bcc");
            errors.subject = validate_emptyField(subject);
            if (template.toString("html") == "<p><br></p>" || template.toString("html") == "<p></p>" || template.toString("html") == "<p></p><br>") {
                errors.template = validate_emptyField("");
            } else {
                errors.template = validate_emptyField(template.toString("html"));
            }
        }
        return errors;
    }

    const mailsValidation = (arr, target) => {
        if (arr.length === 0) {
            return "This field is required";
        } else {
            let mailErrors = [];
            arr.forEach((ele, key) => {
                if (validates_emailId(ele) === "") {
                    mailErrors.splice(key, 1);
                } else {
                    mailErrors.push(key)
                }
            });
            if (mailErrors.length === 0) {
                return "";
            } else {
                return "Please enter valid email";
            }
        }
    }

    const list = (anchor) =>
        <Box className={classes.toggleBox}>
            <Grid container p={4} pt={2} spacing={3}>
                <Grid item lg={12} md={12} sm={12} xs={12} pb={"0px"}>
                    <Box display={'flex'} alignItems={'center'} px={2} pt={2} >
                        <Stack direction={'row'}>
                            <Text BlackExtraDark>Invoice Configuration</Text>
                            <Box pl={1}>
                                <BlackToolTip
                                    title={<Text mediumWhite sx={{ padding: '5px !important' }}>Please press Enter key to save MailID</Text>}
                                    arrow placement='right'>
                                    <Information style={{ height: '20px', width: '20px', cursor: 'pointer' }} />
                                </BlackToolTip>
                            </Box>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                        <CustomMultipleSelect
                            labelText={"CC Mails"}
                            options={
                                [{ id: 1, value: "test1@gmail.com" }, { id: 2, value: "test2@gmail.com" }, { id: 3, value: "test3@gmail.com" }, { id: 4, value: "test4@gmail.com" }]
                            }
                            valuesArr={invoiceState.cc}
                            onChange={(e) => handleChangeMails(e, 'cc')}
                            handleDeleteChip={(e) => handleDeleteChip(e, 'cc')}
                        />
                        <Box mx={4} onClick={() => { console.log('sghsg'); setInvoiceState({ ...invoiceState, cc: [] }) }} sx={{ cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                            {
                                invoiceState.cc.length > 0 ?
                                    <img src={minus} alt='Remove' onClick={() => setInvoiceState({ ...invoiceState, cc: [] })} /> : null
                            }
                        </Box>
                    </Box>
                    <Text red>{error.cc ? error.cc : ''}</Text>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    {/* <Text mediumLabel>BCC mails</Text>
                        <Box pt={1}>
                            <Autocomplete
                                // className={classes.autoComplete}
                                id="size-small-standard"
                                size="small"
                                multiple
                                limitTags={2}
                                freeSolo
                                options={[]}
                                value={invoiceState.bcc}
                                onChange={invoiceHandleChange}
                                disableClearable
                                renderInput={params => (
                                    <TextField
                                        name="bcc"
                                        {...params}
                                        fullWidth
                                        inputProps={{
                                            ...params.inputProps,
                                            onKeyDown: (e) => {
                                                if (!e.target.value.match(emailValidator)) {
                                                    if (e.key == 'Enter') {
                                                        e.stopPropagation();
                                                        return false;
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, key) => (
                                        <Chip
                                            key={key}
                                            label={option}
                                            sx={{ m: "4px 3px" }}
                                            size="small"
                                        // onDelete={() => handleDeleteMail(key, 'bcc')}
                                        />
                                    ))
                                }
                            />
                        </Box> */}
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                        <CustomMultipleSelect
                            labelText={"BCC Mails"}
                            options={
                                [{ id: 1, value: "test1@gmail.com" }, { id: 2, value: "test2@gmail.com" }, { id: 3, value: "test3@gmail.com" }, { id: 4, value: "test4@gmail.com" }]
                            }
                            valuesArr={invoiceState.bcc}
                            onChange={(e) => handleChangeMails(e, 'bcc')}
                            handleDeleteChip={(e) => handleDeleteChip(e, 'bcc')}
                        />
                        <Box mx={4} sx={{ cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                            {
                                invoiceState.bcc.length > 0 ?
                                    <img src={minus} alt='Remove' onClick={() => setInvoiceState({ ...invoiceState, bcc: [] })} /> : null
                            }
                        </Box>
                    </Box>
                    <Text red>{error.bcc ? error.bcc : ''}</Text>
                </Grid>
                <Grid item lg={12} pt={2}>
                    <Text largeBlack>Add Description</Text>
                </Grid>
                <Grid item container lg={12} spacing={3}>
                    <Grid item lg={4}>
                        <SearchSelect
                            name='templateType'
                            value={templateType.templateType}
                            onChange={handleSelectTemplate}
                            options={[{ id: 1, value: "Subject" }, { id: 2, value: "Template" }]}
                            labelText={<Text largeLabel>Add</Text>}
                            scrollTrue
                        />
                    </Grid>
                    <Grid item lg={4}>
                        <SearchSelect
                            name='templateText'
                            value={templateType.templateText}
                            onChange={handleSelectTemplate}
                            options={tempArr}
                            labelText={<Text largeLabel>Add To Subject</Text>}
                            scrollTrue
                        />
                    </Grid>
                    <Grid item lg={4}>
                        {
                            (templateType.templateType == '' || templateType.templateText == '') ?
                                <Button addHeighDisabletButton>Add</Button> :
                                <Button addHeightButton onClick={
                                    () => {
                                        let err = error;
                                        if (templateType.templateType == 1) {
                                            let sub = invoiceState.subject + " " + tempArr.filter(i => i.id == templateType.templateText)[0].value;
                                            setInvoiceState({ ...invoiceState, subject: sub });
                                            err.subject = validate_emptyField(sub);
                                        }
                                        if (templateType.templateType == 2) {
                                            let tempText = invoiceState.template.toString("html") + " " + tempArr.filter(i => i.id == templateType.templateText)[0].value;
                                            let text = RichTextEditor.createValueFromString(tempText, "html");
                                            setInvoiceState({ ...invoiceState, template: text });
                                            if (tempText == "" || tempText == "<p><br></p>" || tempText == "<p></p>" || tempText == "<p></p><br>") {
                                                err.template = validate_emptyField("");
                                            } else {
                                                err.template = validate_emptyField(tempText.toString("html"));
                                            }
                                        }
                                        setError(err);
                                    }
                                }>Add</Button>
                        }
                    </Grid>
                </Grid>
                <Grid item lg={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: "subject",
                            value: invoiceState.subject,
                        }}
                        clientInput
                        labelText={<Text largeLabel>Subject</Text>}
                    />
                    <Text red>{error.subject ? error.subject : ''}</Text>
                </Grid>
                <Grid item lg={12}>
                    <RichTextEditor
                        onChange={onChangeEditor}
                        value={invoiceState.template}
                        editorClassName={classes.editorHeight}
                        placeholder="Type something here..."
                    />
                    <Text red>{error.template ? error.template : ''}</Text>
                </Grid>
                <Grid item lg={12} textAlign='end'>
                    <Stack display='flex' flexDirection='row' gap={2} justifyContent='end'>
                        <Button blackCancel onClick={() => {
                            setDrawer(false);
                            setError({ ...error, cc: '', bcc: '', subject: '', template: '' });
                            setTemplateType({ templateType: 1, templateText: "", })
                            setInvoiceState({ ...invoiceState, invoice_email_template_type: 1, cc: mailConfigs.cc, bcc: mailConfigs.bcc, subject: mailConfigs.subject, template: mailConfigs.template, })
                        }}>Cancel</Button>
                        <Button brownMnSave onClick={
                            () => {
                                let errors = validateMailConfiguration();
                                if (isValid(errors)) {
                                    setDrawer(false);
                                } else {
                                    setError(errors);
                                }
                            }

                        }>Save</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>;


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

    const handleChangeCheckBox = (event) => {
        if (event.target.checked == true) {
            setShippingAddress(false);
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

    const companyCommAddressValidations = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        state.billing_address.map((value) => {
            errors = {};
            errors.address_line_one = validate_withCharDigit(value.address_line_one);
            errors.country_id = validate_emptyField(value.country_id);
            errors.state_id = validate_emptyField(value.state_id);
            errors.city = validate_city(value.city);
            errors.zip_code = validate_zipcode(value.zip_code, value.country_id);
            err.push(errors);
            setCommunicationError(err);
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
            errors.city = validate_city(value.city);
            errors.zip_code = validate_zipcode(value.zip_code, value.country_id);
            err.push(errors);
            setShippingError(err);
        });
        return err;
    };

    const handleChange = (e, index) => {
        const targetName = e.target.name;
        if (targetName == "contact_number" || targetName == "mobile_number") {
            convertFormat(e, index)
        } else {
            contacts[index][e.target.name] = e.target.value;
        }
        setContacts([...contacts]);
        setContacts(contacts, handleValidateContact(e, index));
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

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });

    const stepLabels = ['Company Details', 'Contact Details', 'Timesheet Configuration', 'Invoice Configuration']

    // const handleRemoveLevel = (index) => {
    //     let arr = timeSheetconfigLevels;
    //     arr.splice(index, 1);
    //     setTimeSheetconfigLevels([...arr]);
    // }

    return (
        <Grid container justifyContent='center' pb={5}>
            <Grid item container lg={7} justifyContent='center' position='fixed' zIndex='1000' sx={{ background: '#FFFFFF' }}>
                <Grid item lg={12} pt={2} textAlign='center' p={'30px 0px !important'}>
                    <Stepper activeStep={activeStep}
                        connector={<BrownMnCustomisedConnector />}
                    >
                        {
                            stepLabels.map((item) => (
                                <Step>
                                    <BrownMnColorlibStepLabel StepIconComponent={clientStepper}>
                                        <Text BrowmnMnStepperText>{item}</Text>
                                    </BrownMnColorlibStepLabel>
                                </Step>
                            ))
                        }
                    </Stepper>
                </Grid>
            </Grid>
            <Grid item lg={5.5} pt={10}>
                <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>Company Details</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '20px 30px 30px 30px !important' }}
                            >
                                {
                                    activeStep == 0 &&
                                    <Grid item lg={12}>
                                        <Grid container spacing={2} columnSpacing={3}>
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
                                                    labelText={<Text largeLabel>Company Name</Text>}
                                                    helperText={
                                                        error.name &&
                                                        <span className={classes.helperTextError}>{error.name}</span>
                                                    }
                                                />
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
                                                    labelText={<Text largeLabel>Client ID</Text>}
                                                    helperText={
                                                        error.reference_id &&
                                                        <span className={classes.helperTextError}>{error.reference_id}</span>
                                                    }
                                                />
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
                                                                helperText={
                                                                    communicationError.length > 0 &&
                                                                    communicationError[index] && communicationError[index].address_line_one &&
                                                                    <span className={classes.helperTextError}>{communicationError[index].address_line_one}</span>
                                                                }
                                                            />
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
                                                                onChange={(e, val) => { communicationChangeHandler(e, val, index, 'comm') }}
                                                                helperText={
                                                                    communicationError.length > 0 &&
                                                                    communicationError[index] && communicationError[index].country_id &&
                                                                    <span className={classes.helperTextError}>{communicationError[index].country_id}</span>
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <SearchSelect
                                                                name='state_id'
                                                                value={item.state_id}
                                                                options={getStates}
                                                                labelText={<Text largeLabel>State</Text>}
                                                                onChange={(e, val) => { communicationChangeHandler(e, val, index, 'comm') }}
                                                                helperText={
                                                                    communicationError.length > 0 &&
                                                                    communicationError[index] && communicationError[index].state_id &&
                                                                    <span className={classes.helperTextError}>{communicationError[index].state_id}</span>
                                                                }
                                                            />
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
                                                                helperText={
                                                                    communicationError.length > 0 &&
                                                                    communicationError[index] && communicationError[index].city &&
                                                                    <span className={classes.helperTextError}>{communicationError[index].city}</span>
                                                                }
                                                            />
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
                                                                helperText={
                                                                    communicationError.length > 0 &&
                                                                    communicationError[index] && communicationError[index].zip_code &&
                                                                    <span className={classes.helperTextError}>{communicationError[index].zip_code}</span>
                                                                }
                                                            />
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
                                                    <Grid item container lg={12} md={12} sm={12} xs={12} spacing={2} columnSpacing={3}>
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
                                                                helperText={
                                                                    shippingError.length > 0 &&
                                                                    shippingError[index] && shippingError[index].address_line_one &&
                                                                    <span className={classes.helperTextError}>{shippingError[index].address_line_one}</span>
                                                                }
                                                            />
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
                                                                labelText={<Text largeLabel>Address Line 2<span className={classes.optional}>(Optional)</span></Text>}
                                                                helperText={
                                                                    shippingError.length > 0 &&
                                                                    shippingError[index] && shippingError[index].address_line_two &&
                                                                    <span className={classes.helperTextError}>{shippingError[index].address_line_two}</span>
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <SearchSelect
                                                                name='country_id'
                                                                value={item.country_id}
                                                                options={countries}
                                                                labelText={<Text largeLabel>Country</Text>}
                                                                onChange={(e, val) => { shippingChangeHandler(e, val, index, 'shipping') }}
                                                                helperText={
                                                                    shippingError.length > 0 &&
                                                                    shippingError[index] && shippingError[index].country_id &&
                                                                    <span className={classes.helperTextError}>{shippingError[index].country_id}</span>
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                                            <SearchSelect
                                                                name='state_id'
                                                                value={item.state_id}
                                                                options={getStates}
                                                                labelText={<Text largeLabel>State</Text>}
                                                                onChange={(e, val) => { shippingChangeHandler(e, val, index, "shipping") }}
                                                                helperText={
                                                                    shippingError.length > 0 &&
                                                                    shippingError[index] && shippingError[index].state_id &&
                                                                    <span className={classes.helperTextError}>{shippingError[index].state_id}</span>
                                                                }
                                                            />
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
                                                                helperText={
                                                                    shippingError.length > 0 &&
                                                                    shippingError[index] && shippingError[index].city &&
                                                                    <span className={classes.helperTextError}>{shippingError[index].city}</span>
                                                                }
                                                            />
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
                                                                helperText={
                                                                    shippingError.length > 0 &&
                                                                    shippingError[index] && shippingError[index].zip_code &&
                                                                    <span className={classes.helperTextError}>{shippingError[index].zip_code}</span>
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Grid>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>Contact Details</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '20px 30px 30px 30px !important' }}
                            >
                                {
                                    activeStep == 1 &&
                                    contacts.map((item, index) => (
                                        <Grid container spacing={2} columnSpacing={3} pt={index > 0 ? '15px' : ''}>
                                            {
                                                index > 0 &&
                                                <><Grid item container lg={12} mt={2}>
                                                    <Grid item lg={8}>
                                                        <Text largeBlack>Contact Details - {index + 1}</Text>
                                                    </Grid>
                                                    <Grid item lg={4} textAlign='end'>
                                                        <img src={minus} alt='Minus' style={{ cursor: 'pointer' }} onClick={() => addContact('Remove', index)} />
                                                    </Grid>
                                                </Grid><Divider sx={{ width: '100%', color: '#C7CCD3 !important', margin: '10px' }} /></>
                                            }
                                            <Grid item lg={6}>
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
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].first_name &&
                                                        <span className={classes.helperTextError}>{erro[index].first_name}</span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={6}>
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
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].middle_name &&
                                                        <span className={classes.helperTextError}>{erro[index].middle_name}</span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={6}>
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
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].last_name &&
                                                        <span className={classes.helperTextError}>{erro[index].last_name}</span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={6}>
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
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].email_id &&
                                                        <span className={classes.helperTextError}>{erro[index].email_id}</span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={6}>
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
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].mobile_number &&
                                                        <span className={classes.helperTextError}>{erro[index].mobile_number}</span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={6}>
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
                                                    helperText={
                                                        erro.length &&
                                                        erro[index] && erro[index].ext &&
                                                        <span className={classes.helperTextError}>{erro[index].ext}</span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={6}>
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
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>Timesheet Configuration</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '20px 30px 30px 30px !important' }}
                            >
                                {
                                    activeStep == 2 &&
                                    <Grid container spacing={2} columnSpacing={3} alignItems='center'>
                                        <Grid container spacing={0} pt={1}>
                                            <Grid item lg={6} md={6} sm={12} xs={12} pl={2}>
                                                <Box p={1} my={1}>
                                                    <SearchSelect
                                                        name='cycle_id'
                                                        value={timesheets.cycle_id}
                                                        options={cycleDropdownList}
                                                        onChange={changeHandler}
                                                        labelText={<Text largeLabel>Timesheet Cycle</Text>}
                                                        helperText={
                                                            tsError.cycle_id &&
                                                            <span className={classes.helperTextError}>{tsError.cycle_id}</span>
                                                        }
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Box p={1} my={1}>
                                                <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'default_hours',
                                                            value: timesheets.default_hours,
                                                        }}
                                                        handleChange={handleChangeDefaultHours}
                                                        clientInput
                                                        labelText={<Text largeLabel>Default Hours</Text>}
                                                        helperText={
                                                            tsError.default_hours &&
                                                            <span className={classes.helperTextError}>{tsError.default_hours}</span>
                                                        }
                                                    />
                                                </Box>
                                            </Grid>
                                            {
                                                (timesheets.cycle_id == '1' || timesheets.cycle_id == '2') &&
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={1} pl={3}>
                                                        <SearchSelect
                                                            name='day_start_id'
                                                            value={timesheets.day_start_id}
                                                            options={daysList}
                                                            onChange={changeHandler}
                                                            labelText={<Text largeLabel>Start Day</Text>}
                                                            helperText={
                                                                tsError.day_start_id &&
                                                                <span className={classes.helperTextError}>{tsError.day_start_id}</span>
                                                            }
                                                        />
                                                    </Box>
                                                </Grid>
                                            }
                                        </Grid>
                                        <Grid item lg={12} mt={1}>
                                            <Text largeBlack>Timesheet Attachment</Text>
                                            <Box pt={1}>
                                                <RadioGroup
                                                    row
                                                    name="ts_mandatory"
                                                    value={timesheets.ts_mandatory}
                                                    onChange={changeHandler}
                                                    items={timesheetsOptions}
                                                    fontSize={20}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item container lg={12} mt={2}>
                                            <Grid item lg={8}>
                                                <Text largeBlack>Timesheet Approval Configuration</Text>
                                            </Grid>
                                            <Grid item lg={4} textAlign='end'>
                                                <Button BorderBlueButton onClick={handleAddLevel}>Add level</Button>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        {
                                            timesheets.approvals.map((i, key) => (
                                                <Grid lg={12} md={12} sm={12} xs={12} m={'10px -7px 0px 10px'}>
                                                    <Box my={1} mx={1}>
                                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                            <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '69px', display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                                                                <Autocomplete
                                                                    multiple
                                                                    limitTags={2}
                                                                    id="multiple-limit-tags"
                                                                    options={approvaldropdownlist}
                                                                    getOptionLabel={(option) => option.value}
                                                                    renderOption={(props, option) => (
                                                                        <li {...props} key={option.uniqueIdentifier}>
                                                                            {option.value}
                                                                        </li>
                                                                    )}
                                                                    value={i.approver_ids}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} label={`Level ${key + 1} Approvers`} className={classes.multiSelectinputLabel} pt={2} />
                                                                        // <TextField className={classes.inputLabel} label="Level 1 Approvers" />
                                                                    )}
                                                                    onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                                                                    renderTags={(value, getTagProps) =>
                                                                        value.map((option, keyId) => (
                                                                            <Chip
                                                                                {...getTagProps({ keyId })}
                                                                                key={keyId}
                                                                                label={option && option.full_name}
                                                                                sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                deleteIcon={<DeleteIcon />}
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
                                                                timesheets.approvals.length > 1 ?
                                                                    <Box mx={4} sx={{ cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                                                                        <img src={minus} alt='Remove' onClick={() => handleRemoveLevel(key)} />
                                                                    </Box> : null
                                                            }
                                                        </Box>
                                                        <Text errorText> {approvalsError.length > 0 && approvalsError[key].approvals ? approvalsError[key].approvals : ""}</Text>
                                                    </Box>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>Invoice Configuration</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '20px 30px 30px 30px !important' }}
                            >
                                {
                                    activeStep == 3 &&
                                    <Grid container spacing={2} columnSpacing={3} alignItems='center'>
                                        <Grid container spacing={0} pt={1}>
                                            <Grid item lg={6} md={6} sm={12} xs={12} pl={2}>
                                                <Box p={1} my={1}>
                                                    <SearchSelect
                                                        name='net_pay_terms_id'
                                                        value={invoiceState.net_pay_terms_id}
                                                        options={paymentTerms}
                                                        onChange={(e) => changeHandler(e, 'invoice')}
                                                        labelText={<Text largeLabel>Payment Terms</Text>}
                                                        helperText={
                                                            invoiceError.net_pay_terms_id &&
                                                            <span className={classes.helperTextError}>{invoiceError.net_pay_terms_id}</span>
                                                        }
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                <Box p={1} my={1}>
                                                    <SearchSelect
                                                        name='cycle_id'
                                                        value={invoiceState.cycle_id}
                                                        options={cycleDropdownList}
                                                        onChange={(e) => changeHandler(e, 'invoice')}
                                                        labelText={<Text largeLabel>Invoice Cycle</Text>}
                                                        helperText={
                                                            invoiceError.cycle_id &&
                                                            <span className={classes.helperTextError}>{invoiceError.cycle_id}</span>
                                                        }
                                                    />
                                                </Box>
                                            </Grid>
                                            {
                                                (invoiceState.cycle_id == '1' || invoiceState.cycle_id == '2') &&
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={1} pl={3}>
                                                        <SearchSelect
                                                            name='day_start_id'
                                                            value={invoiceState.day_start_id}
                                                            options={daysList}
                                                            onChange={(e) => changeHandler(e, 'invoice')}
                                                            labelText={<Text largeLabel>Start Day</Text>}
                                                            helperText={
                                                                invoiceError.day_start_id &&
                                                                <span className={classes.helperTextError}>{invoiceError.day_start_id}</span>
                                                            }
                                                        />
                                                    </Box>
                                                </Grid>
                                            }
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Text largeBlack>Client Invoice Template</Text>
                                            <Box pt={1}>
                                                <RadioGroup
                                                    row
                                                    name="invoice_email_template_type"
                                                    value={invoiceState.invoice_email_template_type}
                                                    onChange={changeHandler}
                                                    items={statusItems}
                                                />
                                            </Box>
                                        </Grid>
                                        <SwipeableDrawer
                                            anchor={"right"}
                                            open={drawer}
                                            transitionDuration={300}
                                            sx={{
                                                ".MuiDrawer-paper ": {
                                                    borderRadius: '8px 0px 0px 8px !important',
                                                },
                                                "& .MuiBackdrop-root.MuiModal-backdrop": {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.75) !important'
                                                }
                                            }}
                                        >
                                            {list("right")}
                                        </SwipeableDrawer>
                                        <Grid item container lg={12}>
                                            <Grid item lg={8}>
                                                <Text largeBlack>Invoice Approval Configuration</Text>
                                            </Grid>
                                            <Grid item lg={4} textAlign='end'>
                                                <Button BorderBlueButton onClick={() => handleAddLevelInvoice("Add")}>Add level</Button>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        {/* {invoiceState.approvals.map((val, index) => (
                                            <>
                                                <Grid item lg={11} md={11} sm={11} xs={10}>
                                                    <Text mediumLabel> Level {index + 1} Approver </Text>
                                                    <Box pt={1}>
                                                        <Autocomplete
                                                            // disabled={readOnly}
                                                            multiple
                                                            limitTags={2}
                                                            className={classes.autoComplete}
                                                            onChange={(e) => handleChangeApproval(e, index)}
                                                            options={approvaldropdownlist}
                                                            getOptionLabel={(option) => option.value}
                                                            value={val.approver_ids}
                                                            renderTags={(value, getTagProps) =>
                                                                value.map((option, key) => (
                                                                    <Chip
                                                                        key={key}
                                                                        label={option.value}
                                                                        sx={{ m: "4px 3px" }}
                                                                        size="small"
                                                                        // disabled={readOnly}
                                                                        onDelete={() => handleDeleteEmployee(key, index)}
                                                                    />
                                                                ))
                                                            }
                                                            renderOption={(props, option) => (
                                                                <li {...props} data-value={option.id}>
                                                                    {option.value}
                                                                </li>
                                                            )}
                                                            renderInput={(params) => (
                                                                <TextField {...params} size="small" />
                                                            )}
                                                        />
                                                    </Box>
                                                </Grid>

                                                <Grid item lg={1} md={1} sm={1} xs={2}>
                                                    {invoiceState ? (
                                                        <Box pt={3}>
                                                            {invoiceState.approvals.length - 1 == index ? '' : <img src={minus} alt='Minus' onClick={() => addRemoveLevel("Remove", index)} style={{ cursor: 'pointer' }} />}
                                                        </Box>
                                                    ) : ''}
                                                </Grid>
                                            </>
                                        ))} */}
                                        {
                                            invoiceState.approvals.map((i, key) => (
                                                <Grid lg={12} md={12} sm={12} xs={12} m={'10px -7px 0px 10px'}>
                                                    <Box my={1} mx={1}>
                                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                            <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '69px', display: 'flex', alignItems: "center", }}>
                                                                <Autocomplete
                                                                    multiple
                                                                    limitTags={2}
                                                                    id="multiple-limit-tags"
                                                                    options={approvaldropdownlist}
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
                                                                    onChange={(e, newArr) => handleChangeLevelsInvoice(e, newArr, key)}
                                                                    renderTags={(value, getTagProps) =>
                                                                        value.map((option, keyId) => (
                                                                            <Chip
                                                                                {...getTagProps({ keyId })}
                                                                                key={keyId}
                                                                                label={option && option.full_name}
                                                                                sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                onDelete={() => handleDeleteChipLevelsInvoice(keyId, key)}
                                                                                deleteIcon={<DeleteIcon />}
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
                                                                invoiceState.approvals.length > 1 ?
                                                                    <Box mx={4} sx={{ cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                                                                        <img src={minus} alt='Remove' onClick={() => handleRemoveLevelInvoice(key)} />
                                                                    </Box> : null
                                                            }
                                                        </Box>
                                                        <Text errorText> {approvalInvsError.length > 0 && approvalInvsError[key].approvals ? approvalInvsError[key].approvals : ""}</Text>
                                                    </Box>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                </SwipeableViews>
                <Grid item container p={'10px 20px 0px 20px'}>
                    <Grid item lg={6}>
                        <Button blackCancel onClick={back}>{activeStep == 0 ? 'Home' : 'Back'}</Button>
                    </Grid>
                    <Grid item lg={6} textAlign='end'>
                        <Button save onClick={handleSubmit}>{activeStep == 3 ? 'Finish' : 'Save & Continue'}</Button>
                    </Grid>
                </Grid>
            </Grid>
            {
                open &&
                <ReusablePopup iconHide openPopup={open} setOpenPopup={setOpen} white statusWidth>
                    <Box textAlign='center' p={'0px 20px 0px 20px'}>
                        <img src={success} alt='success' />
                        <Text veryLargeLabel sx={{ paddingTop: '25px !important' }}>Succesfully Added!</Text>
                        <Text mediumLabel sx={{ padding: '10px 0px 30px 0px !important' }}>You Have Successfully Added Client <span style={{ color: `${blue}` }}>{state && state.name}</span>.</Text>
                        <Button onClick={() => navigate('/clients')} blueButton>Go To Home</Button>
                    </Box>
                </ReusablePopup>
            }
        </Grid >
    )
}

export default AddClient