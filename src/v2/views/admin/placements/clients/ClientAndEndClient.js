import { Box, Breadcrumbs, Card, CardContent, CardHeader, Grid, Slide, Step, Stepper, Tooltip, tooltipClasses } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { BrownMnColorlibStepLabel, BrownMnCustomisedConnector, clientandEndclientStepper } from "../../../../theme";
import { useLocation } from "react-router-dom";
import ClientAndEndClientStyles from "./ClientAndEndClientStyles";
import SwipeableViews from "react-swipeable-views";
import PropTypes from 'prop-types';
import { validate_emptyField, isValid, isValidMulti, empty_Email_id, empty_zipcode, empty_city, empty_integer, validates_Integer, validate_toHours, validate_project_name, float_validation } from '../../../../components/Validation';
import { useTheme } from '@mui/material/styles';
import Input from "../../../../components/input/Input";
import { useNavigate } from "react-router-dom";
import InfoIcon from '../../../../assets/svg/Information.svg';
import FileInput from "../../../../components/muiFileInput/FileInput";
import LocalStorage from "../../../../utils/LocalStorage";
import moment from 'moment';
import Text from "../../../../components/customText/Text";
import Button from "../../../../components/customButton/Button";
import CustomSelect from "../../../../components/customSelect/CustomSelect";
import RadioGroup from "../../../../components/customButton/RadioGroup";
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from "../../../../utils/utils";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Date from "../../../../components/datePicker/Date";
import CommonApi from '../../../../apis/CommonApi';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import { styled } from "@mui/material";
import AddDocumentType from "../../addSelectForms/AddDocumentType";
import AddContact from "../../addSelectForms/AddContact";
import ClientsApi from "../../../../apis/admin/clients/ClientsApi";
import AddJobTitle from "../../addSelectForms/AddJobTitle";
import PlacementApi from "../../../../apis/admin/placements/PlacementApi";
// For changing the forms 
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

const ClientAndEndClient = () => {
    const location = useLocation();
    const empId = location && location.state && location.state.empDetails.id;
    const [activeStep, setActiveStep] = useState(0);
    const classes = ClientAndEndClientStyles()
    const theme = useTheme();
    const [error, setError] = useState({});
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const paytype = require('../../../../utils/jsons/PayType.json');
    const WorkLocationType = require('../../../../utils/jsons/WorkLocationType.json');
    const [openTooltip, setOpenTooltip] = useState(false); // eslint-disable-next-line
    const [defaultcheck, setdefaultCheck] = useState(false);
    const [openDoc, setOpenDoc] = useState(false);
    const [doctype, setDocType] = useState([]);
    const [erro, setErro] = useState([]);
    const [contact, setContact] = useState(false);
    const [clientContList, setClientContList] = useState([]);
    const [endClientContList, setEndClientContList] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [docError, setDocError] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sample, setSample] = useState([]);
    const [states, setStates] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [endClientList, setEndclientList] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [duplicateId, setDuplicateId] = useState('')

    const tooltipToggle = () => {
        openTooltip ? setOpenTooltip(false) : setOpenTooltip(true);
    };

    const statusItems = [
        { id: 0, title: <Text mediumBlack>Default</Text>, value: 1 },
        { id: 1, title: <Text mediumBlack>Configure</Text>, value: 2 },
    ]
    const payItems = [
        { id: 0, title: <Text mediumBlack>Percentage(%)</Text>, value: 1 },
        { id: 1, title: <Text mediumBlack>Value</Text>, value: 2 },
    ]

    // Client Details useState
    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        employee_id: '',
        client_id: '',
        client_name: '',
        end_client_name: '',
        client_reference_id: '',
        endclient_reference_id: '',
        client_contact_one_id: '',
        client_contact_two_id: '',
        end_client_id: '',
        end_client_contact_one_id: '',
        end_client_contact_two_id: '',
        payroll_configuration_type: 1,
        pay_type: '',
        pay_value: '',
        payroll_pay: 0,
        pay_rate_configurations: [
            {
                from_hour: 1,
                to_hour: '',
                pay_in: 1,
                rate: ''
            }
        ],
        job_title_id: '',
        project_name: '',
        work_email_id: '',
        placed_employee_id: '',
        notice_period: '',
        start_date: '',
        end_date: '',
        work_location_type: '',
        work_location_address_line_one: '',
        work_location_address_line_two: '',
        work_location_city: '',
        work_location_state_id: '',
        work_location_country_id: '',
        work_location_zipcode: '',
        documents: [
            {
                document_name: '',
                document_type_id: '',
                description: '',
                new_document_id: '',
                docName: ''
            }
        ]
    })

    useEffect(() => {
        getDocumentTypes();
        jobTitleDropdown();
        countriesList()
        clientDropdownList()
        endClientDropdownList();
        getEmployees(); // eslint-disable-next-line
    }, [])

    const getEmployees = () => {
        CommonApi.employees(LocalStorage.uid(), LocalStorage.getAccessToken(), 1).then((res) => {
            if (res.data.statusCode === 1003) {
                setEmployeesList(res.data.data);
            }
        })
    }

    const placementExists = (args) => {
        const data = {
            request_id: LocalStorage.uid(),
            employee_id: empId,
            client_id: args
        }
        ClientsApi.duplicateCheck(data).then((res) => {
            if (res.data.statusCode == 1003) {
                setDuplicateId('')
            } else {
                setDuplicateId(args)
                addErrorMsg(res.data.message);
            }
        })
    }

    const clientDropdownList = (args) => {
        ClientsApi.dropdown('client').then((response) => {
            if (response.data.statusCode == 1003) {
                setClientList(response.data.data);
                if (args) {
                    let x = response.data.data.find(i => i.id === args)
                    state['client_reference_id'] = x.reference_id && x.reference_id
                    state['client_id'] = args
                }
                else {
                    let y = response.data.data.find(i => i.id === state.client_id)
                    state['client_reference_id'] = y.reference_id && y.reference_id
                    state['client_id'] = args
                }
                setState({ ...state });
            }
        });
    };
    // eslint-disable-next-line 
    const endClientDropdownList = (args) => {
        ClientsApi.dropdown('end-client').then((response) => {
            if (response.data.statusCode == 1003) {
                setEndclientList(response.data.data);
                if (args) {
                    let x = response.data.data.find(i => i.id === args)
                    state['endclient_reference_id'] = x.reference_id && x.reference_id
                    state['end_client_id'] = args
                }
                else {
                    let y = response.data.data.find(i => i.id === state.end_client_id)
                    state['endclient_reference_id'] = y.reference_id && y.reference_id
                    state['end_client_id'] = args
                }
                setState({ ...state });
            }
        });
    };

    const countriesList = () => {
        CommonApi.getCountryList('').then((res) => {
            if (res.data.statusCode === 1003) {
                setCountries(res.data.data);
            }
        })
    }

    const statesList = (id) => {
        CommonApi.getStatesList(id).then((res) => {
            if (res.data.statusCode === 1003) {
                setStates(res.data.data);
            }
        })
    }

    const clientContactsList = (args) => {
        ClientsApi.contactsDropdown('client', args).then((response) => {
            if (response.data.statusCode == 1003) {
                setClientContList(response.data.data);
            }
        });
    };

    const endClientContactList = (args) => {
        ClientsApi.contactsDropdown('end-client', args).then((response) => {
            if (response.data.statusCode == 1003) {
                setEndClientContList(response.data.data);
            }
        });
    }

    const getDocumentTypes = () => {
        CommonApi.documentsTypeDropdown('placement-documents').then((res) => {
            if (res.data.statusCode === 1003) {
                setDocType(res.data.data);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const jobTitleDropdown = () => {
        CommonApi.getJobTitlesDropdownList('').then((response) => {
            if (response.data.statusCode == 1003) {
                setJobTitles(response.data.data);
            }
        });
    };


    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    // eslint-disable-next-line
    const newColoumnAdd = (action, index) => {
        let newArray = state.documents;
        let obj = {
            document_name: '',
            document_type_id: '',
            description: '',
            new_document_id: '',
            docName: ''
        }
        if (action == "add") {
            newArray.push(obj);
        }
        if (action == "remove") {
            newArray.splice(index, 1);
        }
        setState({ ...state, documents: newArray });
    }

    const dateHandler = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        if (name == 'start_date') {
            setState({
                ...state,
                [name]: moment(date).format(dateFormat()),
                end_date: ''
            }, handleValidate(event))
        } else {
            setState({
                ...state,
                [name]: moment(date).format(dateFormat())
            }, handleValidate(event))
        }

    }

    const callApi = (args) => {
        setSample(args)
    }
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getPayrollAmount(sample, sample.target.value);
            // Send Axios request here
        }, 300)

        return () => clearTimeout(delayDebounceFn)
        // eslint-disable-next-line
    }, [sample])

    // HandleChange functions
    const changeHandler = (e) => {
        // const isNumeric = /^[0-9]*$/; 
        if (e.target.name == 'document_type_id' || e.target.name == 'document_name') {
            state.documents[0][e.target.name] = e.target.value
            setState({ ...state }, validateDocErrors(e.target, 0))
        } else if (e.target.name == 'client_id') {
            state.client_contact_one_id = ''
            state.client_contact_two_id = ''
            setState({
                ...state,
                [e.target.name]: e.target.value
            }, handleValidate(e));
            clientContactsList(e.target.value);
            clientDropdownList(e.target.value);
            placementExists(e.target.value);
        } else if (e.target.name == 'end_client_id') {
            state.end_client_contact_one_id = ''
            state.end_client_contact_two_id = ''
            setState({
                ...state,
                [e.target.name]: e.target.value
            }, handleValidate(e))
            endClientContactList(e.target.value);
            endClientDropdownList(e.target.value)
        }
        else if (e.target.name == "pay_value") {
            if (e.target.value == "") {
                setState({
                    ...state,
                    [e.target.name]: e.target.value,
                    payroll_pay: ''
                }, handleValidate(e));
            }
            else {
                setState({
                    ...state,
                    [e.target.name]: e.target.value,
                }, handleValidate(e));
                if (e.target.value !== '') {
                    callApi(e)
                }
                else {
                    setState({
                        ...state,
                        payroll_pay: ''
                    });
                }
            }
        }
        else if (e.target.name == 'work_location_country_id') {
            setState({
                ...state,
                [e.target.name]: e.target.value,
                work_location_state_id: '',
                work_location_zipcode: '',
            }, handleValidate(e))
            statesList(e.target.value);
        } else if (e.target.name == 'client_contact_one_id' || e.target.name == 'client_contact_two_id') {
            setState({
                ...state,
                [e.target.name]: e.target.value,

            }, handleValidate(e));
            setOpenTooltip(false);
        } else if (e.target.name == 'end_client_contact_one_id' || e.target.name == 'end_client_contact_two_id') {
            setState({
                ...state,
                [e.target.name]: e.target.value,

            }, handleValidate(e));
            setOpenTooltip(false);
        } else if (e.target.name == 'job_title_id') {
            setState({
                ...state,
                [e.target.name]: e.target.value,

            }, handleValidate(e));
            setOpenTooltip(false);
        }
        else {
            setState({
                ...state,
                [e.target.name]: e.target.value,
            }, handleValidate(e))
        }
    }

    const getPayrollAmount = (e, args) => {
        PlacementApi.getPayroll(empId, e.target.value).then((res) => {
            if (res.data.statusCode === 1003) {
                setState({
                    ...state,
                    [e.target.name]: e.target.value,
                    pay_value: args != '0' ? args : 0,
                    payroll_pay: res.data.amount
                });
            }
        })
    }

    const uploadDocs = (value, index) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
            const formData = new FormData();
            formData.append("files", value.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("placement-document",formData).then(
                (response) => {
                    if (response.data.statusCode == 1003) {
                        state.documents[index].new_document_id = response.data.data.id
                        state.documents[index].docName = value.target.files[0].name
                        setState({ ...state }, validateDocErrors(value.target, index));
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }
            );
        } else {
            addWarningMsg("Please upload Valid Files (png,jpg,jpeg,pdf)");
        }
    }

    const deleteDoc = (args) => {
        state.documents[args].new_document_id = ''
        state.documents[args].docName = ''
        setState({ ...state })
    }

    const changeHandlerPaymentCofigure = (e) => {
        if (e.target.name == 'payroll_configuration_type') {
            setState({
                ...state, [e.target.name]: e.target.value,
                pay_type: '',
                pay_rate_configurations: [
                    {
                        from_hour: 1,
                        to_hour: '',
                        pay_in: 1,
                        rate: ''
                    }
                ]
            });
            if (e.target.value == 1 || e.target.value == '1') {
                defaultCheck();
            }
        }
        if (e.target.name === "pay_type") {
            if (e.target.value === '2' || e.target.value == 2) {
                let arr = {
                    from_hour: 1,
                    to_hour: "",
                    rate: "",
                    pay_in: 1
                };
                setState({ ...state, [e.target.name]: e.target.value, pay_rate_configurations: [arr] })
            } else {
                setState({ ...state, [e.target.name]: e.target.value, pay_value: '', payroll_pay: 0 })
            }
        } else {
            if (e.target.name === "pay_in") {
                let stateArr = state.pay_rate_configurations;
                stateArr.forEach((ele, key) => {
                    stateArr[key].pay_in = e.target.value;
                });
                setState({ ...state, pay_rate_configurations: stateArr })
            }
        }
        handleValidate(e);
    };

    const defaultCheck = (args) => {
        let data = {
            request_id: LocalStorage.uid(),
            employee_id: empId
        }
        PlacementApi.defaultCheck(data).then((res) => {
            if (res.data.statusCode == 1003) {
                setdefaultCheck(true)
            } else {
                if(args === undefined){
                    addWarningMsg(res.data.message);
                }
                setdefaultCheck(false)
            }
        })
    }

    // Handle validations
    const handleValidate = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case "client_id":
                error.client_id = validate_emptyField(input.value);
                break;
            case "client_contact_one_id":
                error.client_contact_one_id = validate_emptyField(input.value);
                break;
            case "client_contact_two_id":
                error.client_contact_two_id = validate_emptyField(input.value);
                break;
            case "end_client_id":
                error.end_client_id = validate_emptyField(input.value);
                break;
            case "end_client_contact_one_id":
                error.end_client_contact_one_id = validate_emptyField(input.value);
                break;
            case "end_client_contact_two_id":
                error.end_client_contact_two_id = validate_emptyField(input.value);
                break;
            case "pay_type":
                error.pay_type = validate_emptyField(input.value);
                break;
            case "pay_value":
                error.pay_value = float_validation(input.value);
                break;
            case "payroll_pay":
                error.payroll_pay = validate_emptyField(input.value);
                break;
            case "project_name":
                error.project_name = validate_project_name(input.value);
                break;
            case "job_title_id":
                error.job_title_id = validate_emptyField(input.value);
                break;
            case "work_email_id":
                error.work_email_id = empty_Email_id(input.value);
                break;
            case "placed_employee_id":
                error.placed_employee_id = validate_emptyField(input.value);
                break;
            case "notice_period":
                error.notice_period = empty_integer(input.value);
                break;
            case "start_date":
                error.start_date = validate_emptyField(input.value);
                break;
            case "work_location_type":
                error.work_location_type = validate_emptyField(input.value);
                break;
            case "end_date":
                error.end_date = validate_emptyField(input.value);
                break;
            case "work_location_address_line_one":
                error.work_location_address_line_one = validate_emptyField(input.value);
                break;
            case "work_location_address_line_two":
                error.work_location_address_line_two = validate_emptyField(input.value);
                break;
            case "work_location_country_id":
                error.work_location_country_id = validate_emptyField(input.value);
                break;
            case "work_location_state_id":
                error.work_location_state_id = validate_emptyField(input.value);
                break;
            case "work_location_city":
                error.work_location_city = empty_city(input.value);
                break;
            case "work_location_zipcode":
                error.work_location_zipcode = empty_zipcode(input.value);
                break;
            default:
                break;
        }
        let s1 = { ...error };
        setError(s1);
    }

    //ValidateAll Functions 
    const validateAll = () => {
        let { client_id, client_contact_one_id, pay_type, pay_value,
            job_title_id, placed_employee_id, start_date, work_location_type, work_location_zipcode, project_name, work_email_id, notice_period, work_location_city } = state;
        let errors = {};
        errors.client_id = value == 0 ? validate_emptyField(client_id) : '';
        errors.client_contact_one_id = value == 0 && state.client_id !== '' ? validate_emptyField(client_contact_one_id) : '';
        errors.pay_type = value == 2 && state.payroll_configuration_type == 2 ? validate_emptyField(pay_type) : '';
        errors.pay_value = value == 2 && state.pay_type == 1 ? float_validation(pay_value) : '';
        errors.project_name = value == 3 ? validate_project_name(project_name) : '';
        errors.job_title_id = value == 3 ? validate_emptyField(job_title_id) : '';
        errors.placed_employee_id = value == 3 ? validate_emptyField(placed_employee_id) : '';
        errors.start_date = value == 3 ? validate_emptyField(start_date) : '';
        errors.work_location_type = value == 3 ? validate_emptyField(work_location_type) : '';
        errors.work_location_zipcode = value == 3 && state.work_location_country_id !== '' ? empty_zipcode(work_location_zipcode) : '';
        errors.work_email_id = value == 3 ? empty_Email_id(work_email_id) : '';
        errors.notice_period = value == 3 ? empty_integer(notice_period) : '';
        errors.work_location_city = value == 3 ? empty_city(work_location_city) : ''
        setError(errors);
        return errors;
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
            if (docError.length === 0 || docError[0].from_hour === false) {
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
    const handleValidatePopup = (e, index) => {
        let input = e;
        let error = docError.length > 0 ? (docError ? docError[index] : docError) : docError;
        for (var k = 0; k <= index; k++) {
            docError.push({});
        }
        let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
        switch (input.name || input.tagName) {
            case "from_hour":
                error.from_hour = validates_Integer(input.value);
                break;
            case "to_hour":
                error.to_hour = validate_toHours(input.value, state.pay_rate_configurations[index].from_hour);
                break;
            case "pay_in":
                error.pay_in = validate_emptyField(input.value);
                break;
            case "rate":
                error.rate = float_validation(input.value);
                break;
            default:
                break;
        }
        setDocError(s1);

    }
    const validateWeekDays = () => {
        let errors = {};
        let err = [];// eslint-disable-next-line   
        state.pay_rate_configurations.map((item, index) => {
            errors = {};
            errors.from_hour = value == 2 && state.payroll_configuration_type == 2 && state.pay_type == 2 && validates_Integer(item.from_hour);
            let val = (state.payroll_configuration_type == 2 || state.payroll_configuration_type == '2') && state.pay_rate_configurations.length != (index + 1) && validate_toHours(item.to_hour, item.from_hour)
            errors.to_hour = val ? val : '';
            errors.rate = value == 2 && state.payroll_configuration_type == 2 && state.pay_type == 2 && float_validation(item.rate);
            errors.pay_in = value == 2 && state.payroll_configuration_type == 2 && state.pay_type == 2 && validate_emptyField(item.pay_in);
            err.push(errors);
            setDocError(err);
        })
        return err;
    }
    // eslint-disable-next-line 
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
    // eslint-disable-next-line 
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
        payRateConfigurations.splice(index, 1);
        docError.splice(index, 1)
        // if (payRateConfigurations.length > 1) {
        //     payRateConfigurations[index].from_hour = payRateConfigurations[index - 1].to_hour;
        // }
        // if (index > 0) {
        //     payRateConfigurations[index - 1].to_hour = "";
        // }
        let newState = { ...state, pay_rate_configurations: payRateConfigurations };
        setDocError([...docError])
        setState({ ...newState });
    }

    const validateDocErrors = (e, index) => {
        let input = e;
        let error = erro.length > 0 ? (erro ? erro[index] : erro) : erro;
        for (var k = 0; k <= index; k++) {
            erro.push({});
        }
        let s2 = erro.length > 0 ? [...erro] : [{ ...erro }];
        switch (input.name || input.tagName) {
            case "document_type_id":
                error.document_type_id = validate_emptyField(input.value);
                break;
            case "document_name":
                error.document_name = validate_emptyField(input.value);
                break;
            case "new_document_id":
                error.new_document_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setErro(s2);
    }

    const validateErrors = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        state.documents.map((item) => {
            errors = {};
            errors.document_type_id = value == 4 && validate_emptyField(item.document_type_id);
            errors.document_name = value == 4 && validate_emptyField(item.document_name);
            errors.new_document_id = value == 4 && validate_emptyField(item.new_document_id);
            err.push(errors);
            setErro(err);
        });
        return err;
    }

    const handleSubmit = () => {
        defaultCheck('error_msg_hide')
        // if(activeStep == 2){
        //     if (state.payroll_configuration_type == 1) {
        //     defaultCheck()
        //     }
        //     else{
        //         setdefaultCheck(true)
        //     }
        // }
        if ((state.client_contact_one_id !== '' && state.client_contact_one_id) === state.client_contact_two_id) {
            addErrorMsg('Client contact one and client contact two should be different')
            return true
        }
        if(activeStep === 1){
            if ((state.end_client_contact_one_id !== '' && state.end_client_contact_one_id) === state.end_client_contact_two_id) {
                addErrorMsg('End Client contact one and end client contact two should be different')
                return true
            }
        }

        if (duplicateId === (state.client_id !== '' && state.client_id)) {
            addErrorMsg('Placement Already Exists between the Employee and Client')
            return true
        }
        let errors = validateAll();
        let docErrors = validateErrors();
        let salaryPay = validateWeekDays();
        // Code to check for validation thing for pay configure
        if (activeStep == 2) {
            if (state.payroll_configuration_type == 1) {
                if(defaultcheck === false){
                    addWarningMsg("There is no default pay configuration for this employee");
                    return true
                }
            }
            else {
                if(state.pay_type !== 1){
                    for (let i = 0; i < salaryPay.length; i++) {
                        if (salaryPay[i].to_hour !== '') {
                            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
                            return true
                        }
                        if (salaryPay[i].rate !== '') {
                            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
                            return true
                        }
                    }
                }
                
            }
        }

        //It ends here

        if (isValid(errors) && isValidMulti(docErrors) && isValidMulti(salaryPay)) {
            if (activeStep !== 4 && activeStep !== 2) {
                setActiveStep(activeStep + 1);
                setValue(value + 1);
            } else if (activeStep == 2) {
                if (state.pay_value === 0 || state.pay_value === "0") {
                    addErrorMsg('Annual Pay value should be greater than 0');
                    return true
                }
                if (isValidMulti(salaryPay)) {
                    //  It ends here
                    setActiveStep(activeStep + 1);
                    setValue(value + 1);
                } else {
                    let s3 = { docError }
                    s3 = salaryPay
                    setDocError(s3);
                    addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
                }
            }
            else {
                state['employee_id'] = empId
                PlacementApi.placementClientStore(state).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg('Client Added Successfully');
                        LocalStorage.setPlacementID(res.data.data[0].id);
                        navigate('/placements/addPlacement', { state: { actionState: 'addFlow' } })
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            }
        } else {
            let s1 = { error }
            s1 = errors
            setError(s1);
            let s2 = { erro }
            s2 = docErrors
            setErro(s2);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const back = () => {
        if (activeStep == 0) {
            navigate('/placements/addPlacement', { state: { actionState: '', empDetails: location.state.empDetails, empData: location.state.empDetails } })
        } else {
            setActiveStep(activeStep - 1);
            setValue(value - 1)
        }
    }
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip
            open={openTooltip}
            arrow
            {...props}
            classes={{ popper: className }}
        />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#fff",
            color: "rgba(0, 0, 0, 0.87)",
            maxWidth: 600,
            border: "1px solid #bdbdbd",
            padding: "0px !important",
        },
    }));

    const stepLabels = ['Client Details', 'End Client Details', 'Pay Type Configuration', 'Placement Details', 'Upload Document']

    return (
        <Box>
            {/* Stepper  */}
            <Grid container justifyContent='center' pb={5}>
                <Grid item container lg={10} md={10} sm={9} xs={4} justifyContent='center' position='fixed' zIndex={100} sx={{ background: '#FFFFFF' }}>
                    <Grid item lg={12} mt={3}>
                        <Breadcrumbs>
                            <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/dashboard')}>Placement Dashboard</Text>
                            <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>All Placements</Text>
                            <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/addPlacement')}>Add placements</Text>
                            <Text mediumBlack>Add Client & End Client</Text>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item lg={10} md={10} sm={10} xs={12} mt={1} textAlign='center' p={'30px 0px !important'}>
                        <Stepper activeStep={activeStep}
                            connector={<BrownMnCustomisedConnector />}
                        >
                            {
                                stepLabels.map((item) => (
                                    <Step>
                                        <BrownMnColorlibStepLabel StepIconComponent={clientandEndclientStepper}>
                                            <Text BrowmnMnStepperText>{item}</Text>
                                        </BrownMnColorlibStepLabel>
                                    </Step>
                                ))
                            }
                        </Stepper>
                    </Grid>
                </Grid>
                {/* Form  */}
                <Grid item lg={6} pt={16}>
                    <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }} >
                                <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                    <Text largeBoldBlack>Client Details</Text>
                                } />
                                <CardContent
                                    TransitionComponent={Transition}
                                    sx={{ padding: '20px 30px 30px 30px !important' }}>
                                    {
                                        activeStep == 0 &&
                                        <Grid item lg={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                                    <Box pt={1}>
                                                        <SearchSelect
                                                            name='client_id'
                                                            value={state.client_id}
                                                            options={clientList}
                                                            labelText={<Text largeLabel>Client Name </Text>}
                                                            onChange={changeHandler}
                                                            onClick={() => {
                                                                navigate('/addClient')
                                                                tooltipToggle()
                                                            }}
                                                            buttonName='Client'
                                                        />
                                                    </Box>
                                                    {
                                                        error.client_id ?
                                                            <Text red>{error.client_id ? error.client_id : ''}</Text> : ''
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={1}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'client_reference_id',
                                                                value: state.client_reference_id,
                                                                disabled: true
                                                            }}
                                                            clientInput
                                                            labelText={<Text largeLabel>Client ID</Text>}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={'10px'}>
                                                        {contact == "client_contact_one_id" ? (
                                                            <HtmlTooltip
                                                                title={
                                                                    <AddContact
                                                                        contact={setOpenTooltip}
                                                                        clientId={state.client_id}
                                                                        slug='client'
                                                                        getList={clientContactsList}
                                                                    />
                                                                }
                                                            >
                                                                <Box pt={1}>
                                                                    <SearchSelect
                                                                        name='client_contact_one_id'
                                                                        value={state.client_contact_one_id}
                                                                        disabled={state.client_id === ''}
                                                                        options={clientContList}
                                                                        labelText={<Text largeLabel>Contact -1</Text>}
                                                                        onChange={changeHandler}
                                                                        onClick={() => {
                                                                            setContact('client_contact_one_id');
                                                                            tooltipToggle()
                                                                        }}
                                                                        buttonName='Contact'
                                                                    />
                                                                </Box>
                                                            </HtmlTooltip>
                                                        ) : (
                                                            <Box pt={1}>
                                                                <SearchSelect
                                                                    name='client_contact_one_id'
                                                                    value={state.client_contact_one_id}
                                                                    options={clientContList}
                                                                    disabled={state.client_id === ''}
                                                                    labelText={<Text largeLabel>Contact -1</Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setContact('client_contact_one_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    buttonName='Contact'
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    {
                                                        error.client_contact_one_id ?
                                                            <Text red>{error.client_contact_one_id ? error.client_contact_one_id : ''}</Text> : ''
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={'10px'}>
                                                        {contact == "client_contact_two_id" ? (
                                                            <HtmlTooltip
                                                                title={
                                                                    <AddContact
                                                                        contact={setOpenTooltip}
                                                                        clientId={state.client_id}
                                                                        slug='client'
                                                                        getList={clientContactsList}
                                                                    />
                                                                }
                                                            >
                                                                <Box pt={1}>
                                                                    <SearchSelect
                                                                        name='client_contact_two_id'
                                                                        value={state.client_contact_two_id}
                                                                        options={clientContList}
                                                                        disabled={state.client_id === ''}
                                                                        labelText={<Text largeLabel>Contact -2<span style={{ color: "#C7CCD3" }}> ( Optional )</span></Text>}
                                                                        onChange={changeHandler}
                                                                        onClick={() => {
                                                                            setContact('client_contact_two_id');
                                                                            tooltipToggle()
                                                                        }}
                                                                        buttonName='Contact'
                                                                    />
                                                                </Box>
                                                            </HtmlTooltip>
                                                        ) : (
                                                            <Box pt={1}>
                                                                <SearchSelect
                                                                    name='client_contact_two_id'
                                                                    value={state.client_contact_two_id}
                                                                    options={clientContList}
                                                                    disabled={state.client_id === ''}
                                                                    labelText={<Text largeLabel>Contact -2<span style={{ color: "#C7CCD3" }}> ( Optional )</span></Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setContact('client_contact_two_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    buttonName='Contact'
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }} >
                                <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                    <Text largeBoldBlack>End Client Details <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>
                                } />
                                <CardContent
                                    TransitionComponent={Transition}
                                    sx={{ padding: '20px 30px 30px 30px !important' }}>
                                    {
                                        activeStep == 1 &&
                                        <Grid item lg={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={1}>
                                                        <SearchSelect
                                                            name='end_client_id'
                                                            value={state.end_client_id}
                                                            options={endClientList}
                                                            labelText={<Text largeLabel>End Client Name</Text>}
                                                            onChange={changeHandler}
                                                            onClick={() => {
                                                                navigate('/addEnd-Client')
                                                                tooltipToggle()
                                                            }}
                                                            buttonName='End-Client'
                                                        />
                                                    </Box>
                                                    {
                                                        error.end_client_id ?
                                                            <Text red>{error.end_client_id ? error.end_client_id : ''}</Text> : ''
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={1}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'endclient_reference_id',
                                                                value: state.endclient_reference_id,
                                                                disabled: true
                                                            }}
                                                            clientInput
                                                            labelText={<Text largeLabel>End Client ID</Text>}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={'7px'}>
                                                        {contact == "end_client_contact_one_id" ? (
                                                            <HtmlTooltip
                                                                title={
                                                                    <AddContact
                                                                        contact={setOpenTooltip}
                                                                        clientId={state.end_client_id}
                                                                        slug='end-client'
                                                                        getList={endClientContactList}
                                                                    />
                                                                }
                                                            >
                                                                <Box pt={1}>
                                                                    <SearchSelect
                                                                        name='end_client_contact_one_id'
                                                                        value={state.end_client_contact_one_id}
                                                                        options={endClientContList}
                                                                        labelText={<Text largeLabel>Contact -1</Text>}
                                                                        onChange={changeHandler}
                                                                        onClick={() => {
                                                                            setContact('end_client_contact_one_id');
                                                                            tooltipToggle()
                                                                        }}
                                                                        buttonName='Contact'
                                                                    />
                                                                </Box>
                                                            </HtmlTooltip>
                                                        ) : (
                                                            <Box pt={1}>
                                                                <SearchSelect
                                                                    name='end_client_contact_one_id'
                                                                    value={state.end_client_contact_one_id}
                                                                    options={endClientContList}
                                                                    labelText={<Text largeLabel>Contact -1</Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setContact('end_client_contact_one_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    buttonName='Contact'
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    {
                                                        error.end_client_contact_one_id ?
                                                            <Text red>{error.end_client_contact_one_id ? error.end_client_contact_one_id : ''}</Text> : ''
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box pt={'7px'}>
                                                        {contact == "end_client_contact_two_id" ? (
                                                            <HtmlTooltip
                                                                title={
                                                                    <AddContact
                                                                        contact={setOpenTooltip}
                                                                        clientId={state.end_client_id}
                                                                        slug='end-client'
                                                                        getList={endClientContactList}
                                                                    />
                                                                }
                                                            >
                                                                <Box pt={1}>
                                                                    <SearchSelect
                                                                        name='end_client_contact_two_id'
                                                                        value={state.end_client_contact_two_id}
                                                                        options={endClientContList}
                                                                        labelText={<Text largeLabel>Contact -2</Text>}
                                                                        onChange={changeHandler}
                                                                        onClick={() => {
                                                                            setContact('end_client_contact_two_id');
                                                                            tooltipToggle()
                                                                        }}
                                                                        buttonName='Contact'
                                                                    />
                                                                </Box>
                                                            </HtmlTooltip>
                                                        ) : (
                                                            <Box pt={1}>
                                                                <SearchSelect
                                                                    name='end_client_contact_two_id'
                                                                    value={state.end_client_contact_two_id}
                                                                    options={endClientContList}
                                                                    labelText={<Text largeLabel>Contact -2</Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setContact('end_client_contact_two_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    buttonName='Contact'
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={value} index={2} dir={theme.direction}>
                            <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }} >
                                <CardHeader sx={{ padding: '15px 0px 0px 30px !important' }} title={
                                    <Text largeBoldBlack>Pay Type Configuration</Text>
                                } />
                                <CardContent
                                    TransitionComponent={Transition}
                                    sx={{ padding: '20px 30px 30px 35px !important', minHeight: '200px !important' }}>
                                    {
                                        activeStep == 2 &&
                                        <Grid container spacing={2} alignItems='center'>
                                            <Grid item lg={12} md={12} sm={12} xs={12} pl={2}>
                                                <Box p={1}>
                                                    <RadioGroup
                                                        row
                                                        name="payroll_configuration_type"
                                                        value={state.payroll_configuration_type}
                                                        items={statusItems}
                                                        onChange={changeHandlerPaymentCofigure}
                                                    />
                                                </Box>
                                            </Grid>
                                            {
                                                state.payroll_configuration_type == 2 &&
                                                <Grid container spacing={0}>
                                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                                        <Box p={1}>
                                                            <CustomSelect
                                                                label={<Text>Pay Type</Text>}
                                                                options={paytype}
                                                                name="pay_type"
                                                                value={state.pay_type}
                                                                onChange={changeHandlerPaymentCofigure}
                                                                commonSelect
                                                            />
                                                            <Text errorText> {error.pay_type ? error.pay_type : ""}</Text>
                                                        </Box>
                                                    </Grid>
                                                    {
                                                        state.pay_type === 1 ?
                                                            <Fragment>
                                                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                                                    <Box p={1}>
                                                                        <Input
                                                                            formControlProps={{
                                                                                fullWidth: true
                                                                            }}
                                                                            inputProps={{
                                                                                name: "pay_value",
                                                                                value: state.pay_value,
                                                                                inputProps: { maxLength: 9 }
                                                                            }}
                                                                            handleChange={changeHandler}
                                                                            clientInput
                                                                            labelText={<Text largeLabel>Annual Pay</Text>}
                                                                        />
                                                                        <Text errorText> {error.pay_value ? error.pay_value : ""}</Text>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                                                    <Box p={1} pt={2}>
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
                                                                        <Text errorText> {error.payroll_pay ? error.payroll_pay : ""}</Text>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={1} pl={3}>
                                                                    <Box pt={4}>
                                                                        <BlackToolTip arrow title={
                                                                            <Text mediumWhite sx={{ padding: '6px !important' }}>Pay Amount for Each Pay Cycle</Text>
                                                                        } placement="right">
                                                                            <img src={InfoIcon} alt="InfoIcon" />
                                                                        </BlackToolTip>
                                                                    </Box>
                                                                </Grid>
                                                            </Fragment> : state.pay_type === 2 ?
                                                                <Fragment>
                                                                    <Grid item lg={12} pl={2}>
                                                                        <Text largeBlack py={2}>
                                                                            Choose Pay Configuration
                                                                        </Text>
                                                                        <Box>
                                                                            <RadioGroup
                                                                                row
                                                                                name="pay_in"
                                                                                value={state.pay_rate_configurations[0].pay_in}
                                                                                items={payItems}
                                                                                onChange={(e) => handleChangeHours(e, 0)}
                                                                            />
                                                                            {
                                                                                docError.length > 0 ? (
                                                                                    <Text red>{docError[0] ? docError[0].pay_in : ''}</Text>
                                                                                ) : ''}
                                                                        </Box>
                                                                        {
                                                                            state.pay_rate_configurations.map((item, index) => (
                                                                                <Grid container spacing={2} key={index} pt={2}>
                                                                                    <Grid item lg={3} md={3} sm={3} xs={3} >
                                                                                        {/* <Box p={1}> */}
                                                                                        <Input
                                                                                            formControlProps={{
                                                                                                fullWidth: true
                                                                                            }}
                                                                                            inputProps={{
                                                                                                name: 'from_hour',
                                                                                                value: item.from_hour,
                                                                                                disabled: index !== 0 && state.pay_rate_configurations[0].from_hour,
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
                                                                                        {/* </Box> */}
                                                                                    </Grid>
                                                                                    <Grid item lg={4} md={3} sm={3} xs={3}>
                                                                                        {/* <Box p={1}> */}
                                                                                        <Input
                                                                                            formControlProps={{
                                                                                                fullWidth: true
                                                                                            }}
                                                                                            inputProps={{
                                                                                                name: 'to_hour',
                                                                                                value: item.to_hour,
                                                                                                disabled: state.pay_rate_configurations.length == (index + 1),
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
                                                                                        {/* </Box> */}
                                                                                    </Grid>
                                                                                    <Grid item lg={4} md={3} sm={3} xs={3}>
                                                                                        {/* <Box p={1}> */}
                                                                                        <Input
                                                                                            formControlProps={{
                                                                                                fullWidth: true
                                                                                            }}
                                                                                            inputProps={{
                                                                                                name: 'rate',
                                                                                                value: item.rate,
                                                                                            }}
                                                                                            handleChange={(e) => handleChangeHours(e, index)}
                                                                                            clientInput
                                                                                            labelText={<Text largeLabel>{item.pay_in == '1' ? "Percentage" : "Value"}</Text>}
                                                                                        />
                                                                                        {docError.length > 0 ? (
                                                                                            <Text red>{docError[index] ? docError[index].rate : ''}</Text>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                        {/* </Box> */}
                                                                                    </Grid>
                                                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                                                        <Box sx={{ height: "48px !important", display: "flex", alignItems: "center", gap: "10px" }}>
                                                                                            {
                                                                                                state.pay_rate_configurations.length - 1 == index &&
                                                                                                <AddIcon className={classes.addIcon} onClick={() => addConfiguration()} />
                                                                                            }
                                                                                            {
                                                                                                state.pay_rate_configurations.length > 1 && index !== 0 ?
                                                                                                    <RemoveIcon className={classes.removeIcon} onClick={() => removeConfiguration(index)} /> : null
                                                                                            }

                                                                                        </Box>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            ))
                                                                        }
                                                                    </Grid>
                                                                </Fragment> : ''
                                                    }

                                                </Grid>
                                            }
                                        </Grid>
                                    }
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={value} index={3} dir={theme.direction}>
                            <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }} >
                                <CardHeader sx={{ padding: '15px 0px 0px 30px !important' }} title={
                                    <Text largeBoldBlack>Placement Details</Text>
                                } />
                                <CardContent
                                    TransitionComponent={Transition}
                                    sx={{ padding: '20px 30px 30px 35px !important' }}>
                                    {
                                        activeStep == 3 &&
                                        <Grid item lg={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'project_name',
                                                            value: state.project_name,
                                                            inputProps: { maxLength: 50 }
                                                        }}
                                                        handleChange={changeHandler}
                                                        clientInput
                                                        labelText={<Text largeLabel>Project Name<span style={{ color: "#C7CCD3" }}> ( Optional )</span></Text>}
                                                    />
                                                    <Text errorText> {error.project_name ? error.project_name : ""}</Text>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box>
                                                        {contact == "job_title_id" ? (
                                                            <HtmlTooltip
                                                                title={
                                                                    <AddJobTitle
                                                                        contact={setOpenTooltip}
                                                                        jobTitleDropdown={jobTitleDropdown}
                                                                    />
                                                                }
                                                            >
                                                                <Box>
                                                                    <SearchSelect
                                                                        name='job_title_id'
                                                                        value={state.job_title_id}
                                                                        options={jobTitles}
                                                                        labelText={<Text largeLabel>Job Title</Text>}
                                                                        onChange={changeHandler}
                                                                        onClick={() => {
                                                                            setContact('job_title_id');
                                                                            tooltipToggle()
                                                                        }}
                                                                        buttonName='Job Title'
                                                                    />
                                                                </Box>
                                                            </HtmlTooltip>
                                                        ) : (
                                                            <Box>
                                                                <SearchSelect
                                                                    name='job_title_id'
                                                                    value={state.job_title_id}
                                                                    options={jobTitles}
                                                                    labelText={<Text largeLabel>Job Title</Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setContact('job_title_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    buttonName='Job Title'
                                                                />
                                                            </Box>
                                                        )}
                                                        <Text errorText> {error.job_title_id ? error.job_title_id : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'work_email_id',
                                                            value: state.work_email_id
                                                        }}
                                                        handleChange={changeHandler}
                                                        clientInput
                                                        labelText={<Text largeLabel>Work Email ID<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                                    />
                                                    <Text errorText> {error.work_email_id ? error.work_email_id : ""}</Text>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box >
                                                        <SearchSelect
                                                            name="placed_employee_id"
                                                            value={state.placed_employee_id}
                                                            options={employeesList}
                                                            labelText={<Text largeLabel>Placed By</Text>}
                                                            onChange={changeHandler}
                                                        />
                                                    </Box>
                                                    <Text errorText> {error.placed_employee_id ? error.placed_employee_id : ""}</Text>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'notice_period',
                                                            value: state.notice_period,
                                                            inputProps: { maxLength: 3 }
                                                        }}
                                                        handleChange={changeHandler}
                                                        clientInput
                                                        labelText={<Text largeLabel>Notice Period (Days) <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                                    />
                                                    <Text errorText> {error.notice_period ? error.notice_period : ""}</Text>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box >
                                                        <Date value={state.start_date} onChange={(value) => dateHandler(value, 'start_date')} labelText={<Text largeLabel>Start Date</Text>} />
                                                        <Text errorText> {error.start_date ? error.start_date : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box mt={1}>
                                                        <CustomSelect
                                                            label={<Text largeLabel>Work Location Type</Text>}
                                                            options={WorkLocationType}
                                                            name="work_location_type"
                                                            value={state.work_location_type}
                                                            onChange={changeHandler}
                                                            commonSelect
                                                        />
                                                        <Text errorText> {error.work_location_type ? error.work_location_type : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box mt={1}>
                                                        <Date value={state.end_date} disabled={state.start_date === ''} minDate={state.start_date} onChange={(value) => dateHandler(value, 'end_date')} labelText={<Text largeLabel>End Date <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>} />
                                                    </Box>
                                                </Grid>
                                                {
                                                    (state.work_location_type == 2 || state.work_location_type == '2') && (
                                                        <Grid container spacing={2} pt={2} pl={2}>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        name: 'work_location_address_line_one',
                                                                        value: state.work_location_address_line_one,
                                                                        inputProps: { maxLength: 50 }
                                                                    }}
                                                                    handleChange={changeHandler}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>Address Line 1 <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                                                />
                                                            </Grid>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        name: 'work_location_address_line_two',
                                                                        value: state.work_location_address_line_two,
                                                                        inputProps: { maxLength: 50 }
                                                                    }}
                                                                    handleChange={changeHandler}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>Address Line 2 <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                                                />
                                                            </Grid>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Box pt={'10px'}>
                                                                    <SearchSelect
                                                                        name='work_location_country_id'
                                                                        value={state.work_location_country_id}
                                                                        onChange={(e) => changeHandler(e)}
                                                                        options={countries}
                                                                        labelText={<Text largeLabel>Country<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Box pt={'10px'}>
                                                                    <SearchSelect
                                                                        name='work_location_state_id'
                                                                        value={state.work_location_state_id}
                                                                        onChange={(e) => changeHandler(e)}
                                                                        options={states}
                                                                        labelText={<Text largeLabel>State<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        name: 'work_location_city',
                                                                        value: state.work_location_city,
                                                                        inputProps: { maxLength: 50 }
                                                                    }}
                                                                    handleChange={(e) => changeHandler(e)}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>City<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>} />
                                                                <Text errorText> {error.work_location_city ? error.work_location_city : ""}</Text>
                                                            </Grid>
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Input
                                                                    formControlProps={{
                                                                        fullWidth: true
                                                                    }}
                                                                    inputProps={{
                                                                        name: 'work_location_zipcode',
                                                                        value: state.work_location_zipcode,
                                                                        inputProps: { maxlength: 50 },
                                                                        disabled: state.work_location_country_id == ''
                                                                    }}
                                                                    handleChange={(e) => changeHandler(e)}
                                                                    clientInput
                                                                    labelText={<Text largeLabel>{
                                                                        state.work_location_country_id == 101 ?
                                                                            'Pin Code' : 'Zip Code'
                                                                    }<span style={{ color: "#C7CCD3" }}>(Optional)</span></Text>} />
                                                                <Text errorText> {error.work_location_zipcode ? error.work_location_zipcode : ""}</Text>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                    }
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={value} index={4} dir={theme.direction}>
                            <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }} >
                                <CardHeader sx={{ padding: '15px 0px 0px 35px !important' }} title={
                                    <Text largeBoldBlack>Upload Documents</Text>
                                } />
                                <CardContent
                                    TransitionComponent={Transition}
                                    sx={{ padding: '20px 30px 30px 35px !important' }}>
                                    {
                                        activeStep == 4 &&
                                        <Grid item lg={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    {openDoc == "document_type_id" ? (
                                                        <HtmlTooltip
                                                            title={
                                                                <AddDocumentType
                                                                    open={(e) => setOpenTooltip(e)}
                                                                    getDocumentsTypes={getDocumentTypes}
                                                                />
                                                            }
                                                        >
                                                            <Box>
                                                                <SearchSelect
                                                                    name='document_type_id'
                                                                    value={state.documents && state.documents[0].document_type_id}
                                                                    onChange={changeHandler}
                                                                    options={doctype}
                                                                    buttonName='Document type'
                                                                    onClick={(e) => {
                                                                        setOpenDoc("document_type_id");
                                                                        tooltipToggle();
                                                                    }}
                                                                    labelText={<Text largeLabel>Document Type</Text>}
                                                                />
                                                            </Box>
                                                        </HtmlTooltip>
                                                    ) :
                                                        <Box>
                                                            <SearchSelect
                                                                name='document_type_id'
                                                                value={state.documents && state.documents[0].document_type_id}
                                                                onChange={changeHandler}
                                                                options={doctype}
                                                                buttonName='Document type'
                                                                onClick={(e) => {
                                                                    setOpenDoc("document_type_id");
                                                                    tooltipToggle();
                                                                }}
                                                                labelText={<Text largeLabel>Document Type</Text>}
                                                            />
                                                            {erro.length > 0 ? (<Text red>{erro[0] ? erro[0].document_type_id : ""}</Text>) : ("")}
                                                        </Box>
                                                    }
                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            name: 'document_name',
                                                            value: state.documents && state.documents[0].document_name,
                                                            inputProps: { maxLength: 50 }
                                                        }}
                                                        handleChange={changeHandler}
                                                        clientInput
                                                        labelText={<Text largeLabel>Document Name</Text>}
                                                    />
                                                    {erro.length > 0 ? (<Text red>{erro[0] ? erro[0].document_name : ""}</Text>) : ("")}
                                                </Grid>
                                                {
                                                    state.documents.map((item, index) => (
                                                        <Grid lg={12} md={12} sm={12} xs={12}>
                                                            <Box pl={2} pt={2} display={'flex'} alignItems={'center'} gap={2}>
                                                                <FileInput
                                                                    name='new_document_id'
                                                                    FileName={item.docName ? item.docName : ''}
                                                                    handleChange={(e) => uploadDocs(e, index)}
                                                                    label='Supporting Document'
                                                                    isDisabled={false}
                                                                    handleDelete={() => deleteDoc(index)}
                                                                    actionState={item.docName ? 1 : ''}
                                                                />
                                                                {/* <Box display='flex' flexDirection='column'>
                                                                    {
                                                                        state.documents.length - 1 == index &&
                                                                        <AddRoundedIcon sx={{ color: `${btnBgGreen.shade1}`, cursor: 'pointer' }} onClick={() => newColoumnAdd('add', index)} />
                                                                    }
                                                                    {
                                                                        state.documents.length > 1 &&
                                                                        <RemoveIcon sx={{ color: `${btnBgGreen.shade1}`, cursor: 'pointer' }} onClick={() => newColoumnAdd('remove', index)} />
                                                                    }
                                                                </Box> */}
                                                            </Box>
                                                            {erro.length > 0 ? (<Text red pl={2}>{erro[0] ? erro[0].new_document_id : ""}</Text>) : ("")}
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Grid>
                                    }
                                </CardContent>
                            </Card>
                        </TabPanel>
                    </SwipeableViews>
                    <Grid item container pt={2} pr={3} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end', gap: '10px' }}>
                        <Button smallBlueOutlineBtn onClick={back}>Back</Button>
                        <Button brownMnSave onClick={handleSubmit}>{activeStep == 4 ? 'Save' : 'Next'}</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    )
}

export default ClientAndEndClient;
