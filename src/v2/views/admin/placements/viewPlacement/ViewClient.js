import { Box, Divider, Grid, Stack, Tooltip, tooltipClasses } from '@mui/material';
import React, { useEffect, useState } from 'react'
import SearchSelect from '../../../../components/selectField/SearchSelect';
import Text from '../../../../components/customText/Text';
import Input from '../../../../components/input/Input';
import AddContact from '../../addSelectForms/AddContact';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../utils/utils';
import RadioGroup from '../../../../components/customButton/RadioGroup';
import AddJobTitle from '../../addSelectForms/AddJobTitle';
import Date from '../../../../components/datePicker/Date';
import AddDocumentType from '../../addSelectForms/AddDocumentType';
import FileInput from '../../../../components/muiFileInput/FileInput';
import Button from '../../../../components/customButton/Button';
import LoadingButton from '../../../../components/customButton/LoadingButton';
import { styled } from "@mui/material/styles";
import CommonApi from '../../../../apis/CommonApi';
import { empty_Email_id, empty_city, empty_integer, empty_zipcode, float_validation, isValid, isValidMulti, validate_emptyField, validate_project_name, validate_toHours, validates_Integer } from '../../../../components/Validation';
import LayoutStyles from '../LayoutStyles';
import { useNavigate } from 'react-router-dom';
import LocalStorage from '../../../../utils/LocalStorage';
import moment from 'moment';
import ClientsApi from '../../../../apis/admin/clients/ClientsApi';
import PlacementApi from '../../../../apis/admin/placements/PlacementApi';
import { ReactComponent as Info } from '../../../../assets/svg/Information.svg';
import TimeSheetApi from '../../../../apis/admin/placements/TimeSheetApi';
import { ReactComponent as Edit } from '../../../../assets/svg/edit.svg';
import ReusablePopup from '../../../../components/reuablePopup/ReusablePopup';
import Add from '@mui/icons-material/Add';
import { Remove } from '@mui/icons-material';


function ViewClient({ listData, setViewState, clientDetails, actionState, clientData, setClientData, getPlacementDetails }) {

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
    const tsData = clientDetails.timesheet_details && clientDetails.timesheet_details[0] && clientDetails.timesheet_details[0].timesheet_start_date;
    const classes = LayoutStyles();
    const [opentooltip, setOpentooltip] = useState(false);
    const [action, setAction] = useState(actionState);
    const [errors, setErrors] = useState({});
    const [erro, setErro] = useState([]);
    const [contact, setContact] = useState(false);
    const [docType, setDocType] = useState([]);
    const [docError, setDocError] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const navigate = useNavigate();
    const [openClient, setOpenClient] = useState(false);
    const [openEndClient, setOpenEndClient] = useState(false);
    const [endClientVal, setEndClientVal] = useState('');
    const [clientVal, setClientVal] = useState('');
    const [jobTilteList, setJobTitleList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [endClientList, setEndclientList] = useState([]);
    const [clientContList, setClientContList] = useState([]);
    const [endClientContList, setEndClientContList] = useState([]);
    const [sample, setSample] = useState([]);
    const [duplicateId, setDuplicateId] = useState('')
    const [setfirstClientId, setFirstClientId] = useState('') // eslint-disable-next-line
    const [defaultcheck, setdefaultCheck] = useState(false);

    const workLocationList = require('../../../../utils/jsons/WorkLocationType.json');
    const payType = require('../../../../utils/jsons/PayType.json');

    const depositConfigItems = [
        { id: 1, title: <Text mediumBlack>Percentage (%)</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>value</Text>, value: 2 },
    ]

    const payTypeConfigOptions = [
        { id: 1, title: <Text mediumBlack>Default </Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>Configure</Text>, value: 2 },
    ]

    const tooltipToggle = () => {
        opentooltip ? setOpentooltip(false) : setOpentooltip(true)
    }

    useEffect(() => {
        setFirstClientId(clientData.client_id);
        countriesList();
        endClientDropdownList('');
        employeesList();
        getDocumentTypes();
        jobTitleDropdown();
        setClientData(clientDetails && clientDetails.client_details);
        if (clientDetails.client_details.client_id !== '') {
            clientContactsList(clientDetails.client_details.client_id)
        }
        if (clientDetails.client_details.end_client_id !== '') {
            endClientContactList(clientDetails.client_details.end_client_id)
        }
        clientDropdownList('');
        // eslint-disable-next-line
    }, [])

    const deleteDoc = (args) => {
        clientData.documents[args].new_document_id = ''
        clientData.documents[args].document_name = ''
        clientData.documents[args].name = ''
        setClientData({ ...clientData })
    }

    const placementExists = (args) => {
        const data = {
            request_id: LocalStorage.uid(),
            employee_id: listData.employee_id,
            client_id: args
        }
        if (setfirstClientId !== args) {
            ClientsApi.duplicateCheck(data).then((res) => {
                if (res.data.statusCode == 1003) {
                    setDuplicateId('')
                } else {
                    setDuplicateId(args)
                    addErrorMsg(res.data.message);
                }
            })
        }

    }

    const clientIDHandler = (e) => {
        if (e.target.name == 'end_client_id') {
            if (clientData.end_client_id !== '' &&
                (clientData.end_client_contact_one_id != '' || clientData.end_client_contact_two_id != '')) {
                setOpenEndClient(true);
                setEndClientVal(e.target.value);
            } else {
                setClientData({
                    ...clientData,
                    [e.target.name]: e.target.value
                }, handleValidate(e))
                endClientDropdownList(e.target.value);
                endClientContactList(e.target.value);
            }
            // endClientContactList(e.target.value);
        } else {
            if (clientData.client_id !== '' &&
                (clientData.client_contact_one_id != '' || clientData.client_contact_two_id != '')) {
                setOpenClient(true);
                setClientVal(e.target.value);
            } else {
                setClientData({
                    ...clientData,
                    [e.target.name]: e.target.value
                }, handleValidate(e))
                clientDropdownList(e.target.value);
                placementExists(e.target.value);
            }
        }
    }

    const callApi = (args) => {
        setSample(args)
    }
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            payrollValue(sample, sample.target.value);
            // Send Axios request here
        }, 300)

        return () => clearTimeout(delayDebounceFn)
        // eslint-disable-next-line
    }, [sample])

    const changeHandler = (e, index) => {
        if (e.target.name == 'payroll_configuration_type') {
            if (e.target.value == 1 || e.target.value == '1') {
                clientData.pay_rate_configurations = []
                clientData.pay_type = ''
                setClientData({
                    ...clientData,
                    [e.target.name]: e.target.value,
                })
                defaultCheck();
            } else if (e.target.value == 2 || e.target.value == '2') {
                clientData.pay_type = ''
                clientData.pay_value = ''
                clientData.payroll_pay = ''
                clientData.pay_rate_configurations = [{
                    from_hour: 1,
                    to_hour: "",
                    rate: "",
                    pay_in: 1,
                }]
                setClientData({ ...clientData })
            }
        }
        else if (e.target.name == 'client_contact_one_id' || e.target.name == 'client_contact_two_id') {
            setClientData({
                ...clientData,
                [e.target.name]: e.target.value,

            }, handleValidate(e));
            setOpentooltip(false);
        } else if (e.target.name == 'end_client_contact_one_id' || e.target.name == 'end_client_contact_two_id') {
            setClientData({
                ...clientData,
                [e.target.name]: e.target.value,

            }, handleValidate(e));
            setOpentooltip(false);
        } else if (e.target.name == 'job_title_id') {
            setClientData({
                ...clientData,
                [e.target.name]: e.target.value,

            }, handleValidate(e));
            setOpentooltip(false);
        }
        // else if (e.target.name === 'notice_period' && validates_Integer(e.target.value)) {
        //     setClientData({
        //         ...clientData,
        //         [e.target.name]: '',
        //     });
        //     return;
        // }
        else if (e.target.name == 'document_type_id' || e.target.name == 'document_name') {
            clientData.documents[0][e.target.name] = e.target.value
            setClientData({ ...clientData }, validateDocErrors(e.target, 0))
            setContact(false);
        } else if (e.target.name == 'pay_value') {
            if (e.target.value === '') {
                clientData.payroll_pay = 0
                setClientData({
                    ...clientData,
                    [e.target.name]: e.target.value
                }, handleValidate(e))
            }
            else {
                callApi(e);
            }
        }
        if (e.target.name == 'work_location_country_id') {
            statesList(e.target.value);
            clientData.work_location_state_id = ''
            clientData.work_location_zipcode = ''
            setClientData({
                ...clientData,
                [e.target.name]: e.target.value
            }, handleValidate(e));
        } else {
            setClientData({
                ...clientData,
                [e.target.name]: e.target.value
            }, handleValidate(e));
        }
        if (e.target.name === "pay_type") {
            if (e.target.value === '2' || e.target.value === 2) {
                let arr = {
                    from_hour: 1,
                    to_hour: "",
                    rate: "",
                    pay_in: 1,
                };
                setClientData({ ...clientData, [e.target.name]: e.target.value, pay_rate_configurations: [arr] })
            } else {
                setClientData({ ...clientData, [e.target.name]: e.target.value, pay_value: "", payroll_pay: "" })
            }
        } else {
            if (e.target.name === "pay_in") {
                if (e.target.name == 'pay_in') {
                    clientData.pay_rate_configurations.forEach((ele, ind) => {
                        clientData.pay_rate_configurations[ind][e.target.name] = e.target.value;
                    })
                    setClientData({ ...clientData }, handleValidatePopup(e.target, index));
                }
                else {
                    clientData.pay_rate_configurations[index][e.target.name] = e.target.value;
                    setClientData({ ...clientData }, handleValidatePopup(e.target, index));
                }
            }
        }
        handleValidate(e);
    }

    const handleValidate = (e, index) => {
        const input = e.target
        switch (input.name || input.tagName) {
            case 'client_id':
                errors.client_id = validate_emptyField(input.value)
                break
            case 'client_reference_id':
                errors.client_reference_id = validate_emptyField(input.value)
                break
            case 'client_contact_one_id':
                errors.client_contact_one_id = validate_emptyField(input.value)
                break
            case 'client_contact_two_id':
                errors.client_contact_two_id = validate_emptyField(input.value)
                break
            case 'end_client_id':
                errors.end_client_id = validate_emptyField(input.value)
                break
            case 'end_client_reference_id':
                errors.end_client_reference_id = validate_emptyField(input.value)
                break
            case 'end_client_contact_one_id':
                errors.end_client_contact_one_id = validate_emptyField(input.value)
                break
            case 'end_client_contact_two_id':
                errors.end_client_contact_two_id = validate_emptyField(input.value)
                break
            case 'payroll_configuration_type':
                errors.payroll_configuration_type = validate_emptyField(input.value)
                break
            case 'job_title_id':
                errors.job_title_id = validate_emptyField(input.value)
                break
            case 'pay_type':
                errors.pay_type = validate_emptyField(input.value)
                break
            case 'placed_employee_id':
                errors.placed_employee_id = validate_emptyField(input.value)
                break
            case "payroll_pay":
                errors.payroll_pay = validate_toHours(input.value)
                break
            case "pay_value":
                errors.pay_value = float_validation(input.value)
                break
            case 'work_location_type':
                errors.work_location_type = validate_emptyField(input.value)
                break
            case 'start_date':
                errors.start_date = validate_emptyField(input.value)
                break
            case 'document_type_id':
                errors.document_type_id = validate_emptyField(input.value)
                break
            case 'document_name':
                errors.document_name = validate_emptyField(input.value)
                break
            case 'work_location_zipcode':
                errors.work_location_zipcode = empty_zipcode(input.value, clientData.work_location_country_id)
                break
            case 'work_email_id':
                errors.work_email_id = empty_Email_id(input.value);
                break
            case 'notice_period':
                errors.notice_period = empty_integer(input.value);
                break
            case 'project_name':
                errors.project_name = validate_project_name(input.value);
                break;
            case 'work_location_city':
                errors.work_location_city = empty_city(input.value);
                break;
            default:
                break
        }
        setErrors({ ...errors })
    }

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setClientData({
            ...clientData,
            [name]: moment(date).format(dateFormat())

        }, handleValidate(event))
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
                error.to_hour = validate_toHours(input.value, clientData.pay_rate_configurations[index].from_hour);
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

    const handleChangeHours = (e, index) => {
        const input = e.target.value;
        if (e.target.name == "to_hour") {
            clientData.pay_rate_configurations[index][e.target.name] = input;
            clientData.pay_rate_configurations[0]['from_hour'] = 1;
            clientData.pay_rate_configurations[index + 1]['from_hour'] = input;
            if (clientData.pay_rate_configurations.length > 1) {
                for (let i = index; i < clientData.pay_rate_configurations.length; i++) {
                    if (i + 1 !== clientData.pay_rate_configurations.length) {
                        let val = clientData.pay_rate_configurations[i + 1][e.target.name] === '' ? 0 : clientData.pay_rate_configurations[i + 1][e.target.name]
                        if (val > clientData.pay_rate_configurations[i][e.target.name]) {
                            let length = i + 1
                            for (let y = length; y <= clientData.pay_rate_configurations.length; y++) {
                                if (clientData.pay_rate_configurations.length > y) {
                                    clientData.pay_rate_configurations[y][e.target.name] = ''
                                    clientData.pay_rate_configurations[y]['from_hour'] = ''
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
            setClientData({ ...clientData }, handleValidatePopup(e.target, index));
        } else {
            if (e.target.name == 'rate') {
                if (clientData.pay_rate_configurations[index].pay_in == 1 || clientData.pay_rate_configurations[index].pay_in == "1") {
                    if (input > 100) {
                        addWarningMsg('Percentage is not allowed more than 100%')
                    }
                    // else if (input == 0) {
                    //     addWarningMsg('Percentage should be greater than 0%')
                    // }
                    else {
                        clientData.pay_rate_configurations[index][e.target.name] = input;
                        setClientData({ ...clientData }, handleValidatePopup(e.target, index));
                    }
                }
                else {
                    clientData.pay_rate_configurations[index][e.target.name] = input;
                    setClientData({ ...clientData }, handleValidatePopup(e.target, index));
                }
            }
            else {
                if (e.target.name == 'pay_in') {
                    clientData.pay_rate_configurations.forEach((ele, ind) => {
                        clientData.pay_rate_configurations[ind][e.target.name] = input;
                    })
                    setClientData({ ...clientData }, handleValidatePopup(e.target, index));
                }
                else {
                    clientData.pay_rate_configurations[index][e.target.name] = input;
                    setClientData({ ...clientData }, handleValidatePopup(e.target, index));
                }
            }
        }
    }

    const countriesList = () => {
        CommonApi.getCountryList('', LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setCountries(res.data.data);
            }
        })
    }

    const statesList = (id) => {
        CommonApi.getStatesList(id, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setStates(res.data.data);
            }
        })
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
                setJobTitleList(response.data.data);
            }
        });
    };

    const clientDropdownList = (args) => {
        ClientsApi.dropdown('client').then((response) => {
            if (response.data.statusCode == 1003) {
                setClientList(response.data.data);
                if (args) {
                    let x = response.data.data.find(i => i.id === args)
                    clientData['client_reference_id'] = x.reference_id
                    if (args !== '') {
                        clientData['client_id'] = args
                    }
                }
                else {
                    let y = response.data.data.find(i => i.id === clientData.client_id)
                    clientData['client_reference_id'] = y.reference_id
                    if (args !== '') {
                        clientData['client_id'] = args
                    }
                }
                setClientData({ ...clientData });
            }
        });
    };

    const employeesList = () => {
        CommonApi.employees(LocalStorage.uid(), LocalStorage.getAccessToken(), 1).then((res) => {
            if (res.data.statusCode === 1003) {
                setEmployees(res.data.data);
            }
        })
    }

    const endClientDropdownList = (args) => {
        ClientsApi.dropdown('end-client').then((response) => {
            if (response.data.statusCode == 1003) {
                setEndclientList(response.data.data);
                if (args) {
                    let x = response.data.data.find(i => i.id === args)
                    clientData['end_client_reference_id'] = x.reference_id
                    if (args !== '') {
                        clientData['end_client_id'] = args
                    }
                }
                else {
                    let y = response.data.data.find(i => i.id === clientData.end_client_id)
                    clientData['end_client_reference_id'] = y.reference_id
                    if (args !== '') {
                        clientData['end_client_id'] = args
                    }
                }
                setClientData({ ...clientData });
            }
        });
    };

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

    const handleClearClient = () => {
        clientContactsList(clientVal);
        clientData.client_contact_one_id = ""
        clientData.client_contact_two_id = ""
        clientData.client_contact_one_name = ""
        clientData.client_contact_two_name = ""
        clientData.client_id = clientVal
        setClientData({
            ...clientData,
        })
        placementExists(clientVal);
        clientDropdownList(clientVal);
        setOpenClient(false);
    }

    const handleClearEndClient = () => {
        endClientContactList(endClientVal);
        clientData.end_client_contact_one_id = ""
        clientData.end_client_contact_two_id = ""
        clientData.end_client_contact_one_name = ""
        clientData.end_client_contact_two_name = ""
        clientData.end_client_id = endClientVal
        setClientData({
            ...clientData
        })
        endClientDropdownList(endClientVal);
        setOpenEndClient(false);
    }

    const validateAll = () => {
        const { client_id, client_contact_one_id, job_title_id, placed_employee_id, work_location_type, start_date, pay_type, pay_value, work_location_zipcode, project_name, work_email_id, notice_period, work_location_city } = clientData
        let error = {};
        error.client_id = validate_emptyField(client_id);
        error.client_contact_one_id = validate_emptyField(client_contact_one_id);
        error.job_title_id = validate_emptyField(job_title_id);
        error.placed_employee_id = validate_emptyField(placed_employee_id)
        error.work_location_type = validate_emptyField(work_location_type)
        error.start_date = validate_emptyField(start_date)
        error.pay_type = clientData.payroll_configuration_type == 2 ? validate_emptyField(pay_type) : '';
        error.pay_value = (clientData.pay_type == 1 || clientData.pay_type == '1') ? float_validation(pay_value) : '';
        error.work_location_zipcode = clientData.work_location_country_id == '' ? '' : empty_zipcode(work_location_zipcode);
        error.project_name = validate_project_name(project_name);
        error.work_email_id = empty_Email_id(work_email_id);
        error.notice_period = empty_integer(notice_period);
        error.work_location_city = empty_city(work_location_city);
        setErrors(error);
        return error;
    }

    const DocValidations = () => {
        let errors = {};
        let err = [];  // eslint-disable-next-line
        clientData.documents.map((value) => {
            errors = {};
            errors.new_document_id = value.name == '' ? validate_emptyField(value.new_document_id) : '';
            errors.document_type_id = validate_emptyField(value.document_type_id);
            errors.document_name = validate_emptyField(value.document_name);
            err.push(errors);
            setErro(err);
        });
        return err;
    }

    const validateWeekDays = () => {
        let errors = {};
        let err = [];// eslint-disable-next-line     
        clientData.pay_rate_configurations.map((item, index) => {
            errors = {};
            errors.from_hour = clientData.payroll_configuration_type == 2 && clientData.pay_type == 2 && validates_Integer(item.from_hour);
            let val = (clientData.payroll_configuration_type == 2 || clientData.payroll_configuration_type == '2') && clientData.pay_rate_configurations.length != (index + 1) && validate_toHours(item.to_hour, item.from_hour)
            errors.to_hour = val ? val : '';
            errors.rate = (clientData.payroll_configuration_type == 2 || clientData.payroll_configuration_type == '2') && (clientData.pay_type == 2 || clientData.pay_type == '2') ? float_validation(item.rate) : '';
            errors.pay_in = (clientData.pay_type == 2 || clientData.pay_type == '2') ? validate_emptyField(item.pay_in) : '';
            err.push(errors);
            setDocError(err);
        })
        return err;
    }

    const updateClientPlacement = () => {
        setLoading(true);
        clientData['employee_id'] = clientDetails && clientDetails.employee_id
        clientData['request_id'] = LocalStorage.uid();
        TimeSheetApi.updateClientPlacement(clientDetails && clientDetails.id, clientData).then((response) => {
            setLoading(false);
            if (response.data.statusCode == 1003) {
                addSuccessMsg(response.data.message);
                setAction('view');
                setViewState('');
                getPlacementDetails(clientDetails.id);
            } else {
                addErrorMsg(response.data.message);
            }
        })
    }

    const defaultCheck = (args) => {
        let data = {
            request_id: LocalStorage.uid(),
            employee_id: clientDetails.employee_id
        }
        PlacementApi.defaultCheck(data).then((res) => {
            if (res.data.statusCode == 1003) {
                setdefaultCheck(true)
            } else {
                addWarningMsg(res.data.message);
                if (args === undefined) {
                    return true
                }
                setdefaultCheck(false);
            }
        })
    }

    const handleSubmit = () => {
        // let x = docError.find((i) => i.to_hour !== '')
        // if (x !== undefined && x.to_hour !== '') {
        //     return true
        // }
        defaultCheck('error_msg')
        if ((clientData.client_contact_one_id !== '' && clientData.client_contact_one_id) === clientData.client_contact_two_id) {
            addErrorMsg('Client contact one and client contact two should be different')
            return true
        }
        if (duplicateId === (clientData.client_id !== '' && clientData.client_id)) {
            addErrorMsg('Placement Already Exists between the Employee and Client')
            return true
        }
        if ((clientData.end_client_contact_one_id !== '' && clientData.end_client_contact_one_id) === clientData.end_client_contact_two_id) {
            addErrorMsg('End Client contact one and end client contact two should be different')
            return true
        }
        if ((clientData.pay_type == 1 || clientData.pay_type == '1') && (clientData.pay_value === 0 || clientData.pay_value === "0")) {
            addErrorMsg('Annual Pay value should be greater than 0');
            return true
        }

        // Code to check for validation thing for pay configure
        let errors = validateWeekDays();
        //  It ends here
        if (clientData.pay_type == 2) {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].to_hour !== '') {
                    addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
                    return true
                }
                if (errors[i].rate !== '') {
                    addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
                    return true
                }
            }

        }
        let newErrors = validateAll();
        let docErrors = DocValidations();
        let houlyErrors = validateWeekDays();
        if (isValid(newErrors) && isValidMulti(docErrors) && (clientData.pay_rate_configurations.length === 0 ? true : isValidMulti(houlyErrors))) {
            updateClientPlacement();
        } else {
            let s1 = { errors }
            s1 = newErrors
            setErrors(s1);
            let s2 = { erro }
            s2 = docErrors
            setErro(s2);
            let s3 = { docError }
            s3 = houlyErrors
            setDocError(s3);
            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
        }
    }

    const payrollValue = (e, args) => {
        PlacementApi.getPayroll(listData && listData.employee_id, args).then((res) => {
            if (res.data.statusCode === 1003) {
                setClientData({
                    ...clientData,
                    pay_value: args,
                    payroll_pay: res.data.amount
                }, handleValidate(e))
            }
        })
    }


    const uploadDocs = (value, index) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
            const formData = new FormData();
            formData.append("files", value.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("placement-document", formData, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        clientData.documents[index].new_document_id = response.data.data.id
                        clientData.documents[index].name = value.target.files[0].name
                        if (clientData.documents[index].document_name === '') {
                            clientData.documents[index].document_name = value.target.files[0].name
                        }
                        setClientData({ ...clientData }, validateDocErrors(value.target, index))
                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
        }
    };

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
        console.log(s2,"s2");
        setErro(s2);
    }

    const addConfiguration = () => {
        let payRateConfig = clientData.pay_rate_configurations;
        let Obj = {
            from_hour: "",
            to_hour: "",
            rate: "",
            pay_in: payRateConfig.length > 0 ? payRateConfig[0].pay_in : "",
        };
        let newArr = clientData.pay_rate_configurations;
        newArr.push(Obj);
        setClientData({ ...clientData, pay_rate_configurations: newArr })
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
        let payRateConfigurations = clientData.pay_rate_configurations;
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
        if (clientData.deleted_pay_rate_id === undefined) {
            clientData.deleted_pay_rate_id = []
            clientData.deleted_pay_rate_id.push(payRateConfigurations[index].id)
        }
        else {
            clientData.deleted_pay_rate_id.push(payRateConfigurations[index].id)
        }
        payRateConfigurations.splice(index, 1);
        docError.splice(index, 1)

        // if (index > 0) {
        //     payRateConfigurations[index - 1].to_hour = "";
        // }
        let newClientData = { ...clientData, pay_rate_configurations: payRateConfigurations };
        setDocError([...docError])
        setClientData({ ...newClientData });
    }

    return (
        <Grid item lg={12} md={12} sm={12} xs={12} mt={{ lg: 0, md: 0, sm: 1, xs: 1 }} className={classes.miniCard} p={3}>
            <Grid container pb={2}>
                <Grid item lg={10} md={10} sm={10} xs={9}><Text boldBlackfont600>Client & End client</Text></Grid>
                {action == 'view' ?
                    <Grid item lg={2} md={2} sm={2} xs={3} display={"flex"} flexDirection={"row"} justifyContent={"end"} alignItems={"flex-end"}>
                        <Button variant="contained" className={classes.addButton} onClick={() => setAction('update')} startIcon={<Edit />}>
                            Edit
                        </Button>
                    </Grid> : ""
                }
            </Grid>
            <Grid container lg={12} md={12} sm={12} xs={12} pt={1} pr={{ lg: 1, md: 1, sm: 0 }} className={classes.scroll} >
                <Grid item lg={12} md={12} sm={12} xs={12} pl={'5px'} pt={1}><Text largeBoldBlack>Client Details</Text></Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={4}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                            <SearchSelect
                                name='client_id'
                                value={clientData.client_id}
                                options={clientList}
                                labelText={<Text largeLabel>Client Name </Text>}
                                onChange={clientIDHandler}
                                onClick={() => {
                                    navigate('/addClient')
                                    tooltipToggle()
                                }}
                                buttonName='Client'
                                disabled={action == 'view' ? true : false}
                            />
                        </Box>
                        {
                            errors.client_id ?
                                <Text red>{errors.client_id ? errors.client_id : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: "client_reference_id",
                                value: clientData.client_reference_id,
                                disabled: action === 'view' ? true : true
                            }}
                            clientInput
                            labelText={<Text largeLabel>Client ID</Text>}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={2} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box pt={'10px'}>
                            {contact == "client_contact_one_id" ? (
                                <HtmlTooltip
                                    title={
                                        <AddContact
                                            contact={setOpentooltip}
                                            clientId={clientData.client_id}
                                            slug='client'
                                            getList={clientContactsList}
                                        />
                                    }
                                >
                                    <Box pt={1}>
                                        <SearchSelect
                                            name='client_contact_one_id'
                                            value={clientData.client_contact_one_id}
                                            options={clientContList}
                                            labelText={<Text largeLabel>Contact -1</Text>}
                                            onChange={changeHandler}
                                            onClick={() => {
                                                setContact('client_contact_one_id');
                                                tooltipToggle()
                                            }}
                                            buttonName='Contact'
                                            disabled={action == 'view' || clientData.client_id === '' ? true : false}
                                        />
                                    </Box>
                                </HtmlTooltip>
                            ) : (
                                <Box pt={1}>
                                    <SearchSelect
                                        name='client_contact_one_id'
                                        value={clientData.client_contact_one_id}
                                        options={clientContList}
                                        labelText={<Text largeLabel>Contact -1</Text>}
                                        onChange={changeHandler}
                                        onClick={() => {
                                            setContact('client_contact_one_id');
                                            tooltipToggle()
                                        }}
                                        buttonName='Contact'
                                        disabled={action == 'view' || clientData.client_id === '' ? true : false}
                                    />
                                </Box>
                            )}
                        </Box>

                        {
                            errors.client_contact_one_id ?
                                <Text red>{errors.client_contact_one_id ? errors.client_contact_one_id : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <Box pt={'10px'}>
                            {contact == "client_contact_two_id" ? (
                                <HtmlTooltip
                                    title={
                                        <AddContact
                                            contact={setOpentooltip}
                                            clientId={clientData.client_id}
                                            slug='client'
                                            getList={clientContactsList}
                                        />
                                    }
                                >
                                    <Box pt={1}>
                                        <SearchSelect
                                            name='client_contact_two_id'
                                            value={clientData.client_contact_two_id}
                                            options={clientContList}
                                            labelText={<Text largeLabel>Contact -2</Text>}
                                            onChange={changeHandler}
                                            onClick={() => {
                                                setContact('client_contact_two_id');
                                                tooltipToggle()
                                            }}
                                            buttonName='Contact'
                                            disabled={action == 'view' || clientData.client_id === '' ? true : false}
                                        />
                                    </Box>
                                </HtmlTooltip>
                            ) : (
                                <Box pt={1}>
                                    <SearchSelect
                                        name='client_contact_two_id'
                                        value={clientData.client_contact_two_id}
                                        options={clientContList}
                                        labelText={<Text largeLabel>Contact -2<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                        onChange={changeHandler}
                                        onClick={() => {
                                            setContact('client_contact_two_id');
                                            tooltipToggle()
                                        }}
                                        buttonName='Contact'
                                        disabled={action == 'view' || clientData.client_id === '' ? true : false}
                                    />
                                </Box>
                            )}
                        </Box>

                    </Grid>
                </Grid>
                <Grid item lg={12} pt={4} ><Divider /></Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} pt={3} pl={'5px'}><Text largeBoldBlack>End Client Details</Text></Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={4}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                            <SearchSelect
                                name='end_client_id'
                                value={clientData.end_client_id}
                                options={endClientList}
                                labelText={<Text largeLabel>End Client Name<span style={{ color: "#C7CCD3" }}>( Optional )</span> </Text>}
                                onChange={clientIDHandler}
                                onClick={() => {
                                    navigate('/addEnd-Client')
                                    tooltipToggle()
                                }}
                                buttonName='End-Client'
                                disabled={action == 'view' ? true : false}
                            />
                        </Box>
                        {
                            errors.end_client_id ?
                                <Text red>{errors.end_client_id ? errors.end_client_id : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'end_client_reference_id',
                                value: clientData.end_client_reference_id,
                                disabled: true
                            }}
                            handleChange={changeHandler}
                            clientInput
                            labelText={<Text largeLabel>End Client ID<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={2} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box pt={'10px'}>
                            {contact == "end_client_contact_one_id" ? (
                                <HtmlTooltip
                                    title={
                                        <AddContact
                                            contact={setOpentooltip}
                                            clientId={clientData.end_client_id}
                                            slug='end-client'
                                            getList={endClientContactList}
                                        />
                                    }
                                >
                                    <Box pt={1}>
                                        <SearchSelect
                                            name='end_client_contact_one_id'
                                            value={clientData.end_client_contact_one_id}
                                            options={endClientContList}
                                            labelText={<Text largeLabel>Contact -1<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                            onChange={changeHandler}
                                            onClick={() => {
                                                setContact('end_client_contact_one_id');
                                                tooltipToggle()
                                            }}
                                            buttonName='Contact'
                                            disabled={action == 'view' ? true : false}
                                        />
                                    </Box>
                                </HtmlTooltip>
                            ) : (
                                <Box pt={1}>
                                    <SearchSelect
                                        name='end_client_contact_one_id'
                                        value={clientData.end_client_contact_one_id}
                                        options={endClientContList}
                                        labelText={<Text largeLabel>Contact -1<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                        onChange={changeHandler}
                                        onClick={() => {
                                            setContact('end_client_contact_one_id');
                                            tooltipToggle()
                                        }}
                                        buttonName='Contact'
                                        disabled={action == 'view' ? true : false}
                                    />
                                </Box>
                            )}
                        </Box>
                        {
                            errors.end_client_contact_one_id ?
                                <Text red>{errors.end_client_contact_one_id ? errors.end_client_contact_one_id : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <Box pt={'10px'}>
                            {contact == "end_client_contact_two_id" ? (
                                <HtmlTooltip
                                    title={
                                        <AddContact
                                            contact={setOpentooltip}
                                            clientId={clientData.end_client_id}
                                            slug='end-client'
                                            getList={endClientContactList}
                                        />
                                    }
                                >
                                    <Box pt={1}>
                                        <SearchSelect
                                            name='end_client_contact_two_id'
                                            value={clientData.end_client_contact_two_id}
                                            options={endClientContList}
                                            labelText={<Text largeLabel>Contact -2<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                            onChange={changeHandler}
                                            onClick={() => {
                                                setContact('end_client_contact_two_id');
                                                tooltipToggle()
                                            }}
                                            buttonName='Contact'
                                            disabled={action == 'view' ? true : false}
                                        />
                                    </Box>
                                </HtmlTooltip>
                            ) : (
                                <Box pt={1}>
                                    <SearchSelect
                                        name='end_client_contact_two_id'
                                        value={clientData.end_client_contact_two_id}
                                        options={endClientContList}
                                        labelText={<Text largeLabel>Contact -2<span style={{ color: "#C7CCD3" }}>( Optional )</span>
                                        </Text>}
                                        onChange={changeHandler}
                                        onClick={() => {
                                            setContact('end_client_contact_two_id');
                                            tooltipToggle()
                                        }}
                                        buttonName='Contact'
                                        disabled={action == 'view' ? true : false}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Grid item lg={12} pt={4} ><Divider /></Grid>
                <Grid container spacing={2} alignItems='center' pt={4}>
                    <Grid item lg={12} md={12} sm={12} xs={12} pt={2} ml={'6px'}>
                        <Text largeBoldBlack>Pay Type Configuration</Text>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid item lg={12} p={1}>
                            <RadioGroup
                                row
                                disabled={action == 'view' ? true : false}
                                name="payroll_configuration_type"
                                value={clientData.payroll_configuration_type}
                                onChange={changeHandler}
                                items={payTypeConfigOptions}
                            />
                        </Grid>
                    </Grid>
                    {clientData.payroll_configuration_type == 2 || clientData.payroll_configuration_type == '2' ?
                        <Grid container item lg={12} md={12} sm={12} xs={12} spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Box>
                                    <CustomSelect
                                        name={'pay_type'}
                                        value={clientData.pay_type}
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
                                (clientData.pay_type == 1 || clientData.pay_type === '1') &&
                                <>
                                    <Grid item lg={6} md={6} sm={6} xs={12} >
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: "pay_value",
                                                value: clientData.pay_value,
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
                                                            value: clientData.payroll_pay,
                                                            disabled: true
                                                        }}
                                                        handleChange={changeHandler}
                                                        clientInput
                                                        labelText={<Text largeLabel>Payroll Pay</Text>}
                                                    />
                                                    {/* {
                                                        errors.payroll_pay ?
                                                            <Text red>{errors.payroll_pay ? errors.payroll_pay : ''}</Text> : ''
                                                    } */}
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
                                (clientData.pay_type == 2 || clientData.pay_type === '2') &&
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
                                                    value={clientData.pay_rate_configurations[0].pay_in}
                                                    onChange={(e) => handleChangeHours(e, 0)}
                                                    items={depositConfigItems}
                                                />
                                                {
                                                    docError.length > 0 ? (
                                                        <Text red>{docError[0] ? docError[0].pay_in : ''}</Text>
                                                    ) : ''}
                                            </Grid>
                                            {clientData.pay_rate_configurations.map((item, index) => (
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
                                                                    disabled: action == 'view' || (index !== 0 && clientData.pay_rate_configurations[0].from_hour) ? true : false,
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
                                                                    disabled: action == 'view' || (clientData.pay_rate_configurations.length == (index + 1)) ? true : false,
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
                                                                clientData.pay_rate_configurations.length - 1 == index &&
                                                                <>
                                                                    {
                                                                        action === "view" ?
                                                                            <Add className={classes.disabledColor} /> :
                                                                            <Add className={classes.add} onClick={() => addConfiguration()}></Add>
                                                                    }
                                                                </>
                                                            }
                                                            {
                                                                clientData.pay_rate_configurations.length > 1 && index !== 0 &&
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
                        : ''}
                </Grid>
                <Grid item lg={12} pt={4} ><Divider /></Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} pt={4} pl={'5px'}>
                    <Text largeBoldBlack>Placement Information</Text>
                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={4} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'project_name',
                                value: clientData.project_name,
                                inputProps: { maxLength: 50 },
                                disabled: action == 'view' ? true : false
                            }}
                            handleChange={changeHandler}
                            clientInput
                            labelText={<Text largeLabel>Project Name <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                        />
                        {
                            errors.project_name ?
                                <Text red>{errors.project_name ? errors.project_name : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <Box>
                            {contact == "job_title_id" ? (
                                <HtmlTooltip
                                    title={
                                        <AddJobTitle
                                            contact={setOpentooltip}
                                            jobTitleDropdown={jobTitleDropdown}
                                        />
                                    }
                                >
                                    <Box>
                                        <SearchSelect
                                            name='job_title_id'
                                            value={clientData.job_title_id}
                                            options={jobTilteList}
                                            labelText={<Text largeLabel>Job Title</Text>}
                                            onChange={changeHandler}
                                            onClick={() => {
                                                setContact('job_title_id');
                                                tooltipToggle()
                                            }}
                                            buttonName='Job Title'
                                            disabled={action == 'view' ? true : false}
                                        />
                                    </Box>
                                </HtmlTooltip>
                            ) : (
                                <Box>
                                    <SearchSelect
                                        name='job_title_id'
                                        value={clientData.job_title_id}
                                        options={jobTilteList}
                                        labelText={<Text largeLabel>Job Title</Text>}
                                        onChange={changeHandler}
                                        onClick={() => {
                                            setContact('job_title_id');
                                            tooltipToggle()
                                        }}
                                        buttonName='Job Title'
                                        disabled={action == 'view' ? true : false}
                                    />
                                </Box>
                            )}

                        </Box>
                        {
                            errors.job_title_id ?
                                <Text red>{errors.job_title_id ? errors.job_title_id : ''}</Text> : ''
                        }
                    </Grid>
                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={3} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'work_email_id',
                                value: clientData.work_email_id,
                                disabled: action == 'view' ? true : false
                            }}
                            handleChange={changeHandler}
                            clientInput
                            labelText={<Text largeLabel>Work Email ID <span style={{ color: "#C7CCD3" }}>( Optional )</span> </Text>}
                        />
                        {
                            errors.work_email_id ?
                                <Text red>{errors.work_email_id ? errors.work_email_id : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <Box>
                            {/* <CustomSelect
                                name='placed_employee_id'
                                value={clientData.placed_employee_id}
                                disabled={action == 'view' ? true : false}
                                onChange={changeHandler}
                                commonSelect
                                options={employees}
                                label={<Text largeLabel>Placed By</Text>}
                            /> */}
                            <SearchSelect
                                name="placed_employee_id"
                                value={clientData.placed_employee_id}
                                disabled={action == 'view' ? true : false}
                                onChange={changeHandler}
                                options={employees}
                                labelText={<Text largeLabel>Placed By</Text>}
                            />
                        </Box>
                        {
                            errors.placed_employee_id ?
                                <Text red>{errors.placed_employee_id ? errors.placed_employee_id : ''}</Text> : ''
                        }
                    </Grid>
                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={3} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box >
                            <CustomSelect
                                disabled={action == 'view' ? true : false}
                                commonSelect
                                name='work_location_type'
                                value={clientData.work_location_type}
                                onChange={changeHandler}
                                label={<Text largeLabel>Work Location type</Text>}
                                options={workLocationList}
                            />
                        </Box>
                        {
                            errors.work_location_type ?
                                <Text red>{errors.work_location_type ? errors.work_location_type : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'notice_period',
                                value: clientData.notice_period,
                                disabled: action == 'view' ? true : false,
                                inputProps: { maxlength: 3 }
                            }}
                            handleChange={changeHandler}
                            clientInput
                            labelText={<Text largeLabel>Notice Period (Days) <span style={{ color: "#C7CCD3" }}>( Optional )</span> </Text>}
                        />
                        {
                            errors.notice_period ?
                                <Text red>{errors.notice_period ? errors.notice_period : ''}</Text> : ''
                        }
                    </Grid>

                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={3} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box pt={'10px'}>
                            <Date
                                labelText={<Text largeLabel>Start Date</Text>}
                                disabled={action == 'view' ? true : false}
                                name='start_date'
                                onChange={(value => dateChange(value, 'start_date'))}
                                value={clientData.start_date}
                                height='56px'
                                maxDate={tsData ? tsData : clientData.end_date}
                            />
                        </Box>
                        {
                            errors.start_date ?
                                <Text red>{errors.start_date ? errors.start_date : ''}</Text> : ''
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <Box pt={'10px'}>
                            <Date
                                labelText={<Text largeLabel>End Date <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                                minDate={clientData.start_date}
                                disabled={action == 'view' ? true : false || clientData.start_date === ''}
                                name='end_date'
                                onChange={(value => dateChange(value, 'end_date'))}
                                value={clientData.end_date}
                                height='56px'
                            />
                        </Box>
                        {
                            errors.end_date ?
                                <Text red>{errors.end_date ? errors.end_date : ''}</Text> : ''
                        }
                    </Grid>
                </Grid>
                {(clientData.work_location_type == 2 || clientData.work_location_type == '2') &&
                    <Grid container spacing={3} mt={1}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'work_location_address_line_one',
                                    value: clientData.work_location_address_line_one,
                                    disabled: action == 'view' ? true : false,
                                    inputProps: { maxlength: 50 }
                                }}
                                handleChange={(e) => changeHandler(e)}
                                clientInput
                                labelText={<Text largeLabel>Address Line-1<span className={classes.optional}>(Optional)</span></Text>} />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'work_location_address_line_two',
                                    value: clientData.work_location_address_line_two,
                                    inputProps: { maxlength: 50 },
                                    disabled: action == 'view' ? true : false
                                }}
                                handleChange={(e) => changeHandler(e)}
                                clientInput
                                labelText={<Text largeLabel>Address Line-2<span className={classes.optional}>(Optional)</span></Text>} />
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Box pt={'10px'}>
                                <SearchSelect
                                    name='work_location_country_id'
                                    value={clientData.work_location_country_id}
                                    onChange={(e) => changeHandler(e)}
                                    options={countries}
                                    labelText={<Text largeLabel>Country<span className={classes.optional}>(Optional)</span></Text>}
                                    disabled={action == 'view' ? true : false}
                                />
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Box pt={'10px'}>
                                <SearchSelect
                                    name='work_location_state_id'
                                    value={clientData.work_location_state_id}
                                    onChange={(e) => changeHandler(e)}
                                    options={states}
                                    labelText={<Text largeLabel>State<span className={classes.optional}>(Optional)</span></Text>}
                                    disabled={action == 'view' ? true : false}
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
                                    value: clientData.work_location_city,
                                    inputProps: { maxlength: 50 },
                                    disabled: action == 'view' ? true : false
                                }}
                                handleChange={(e) => changeHandler(e)}
                                clientInput
                                labelText={<Text largeLabel>City<span className={classes.optional}>(Optional)</span></Text>} />
                            {
                                errors.work_location_city ?
                                    <Text red>{errors.work_location_city ? errors.work_location_city : ''}</Text> : ''
                            }
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'work_location_zipcode',
                                    value: clientData.work_location_zipcode,
                                    inputProps: { maxlength: 50 },
                                    disabled: action == 'view' || clientData.work_location_country_id == '' ? true : false
                                }}
                                handleChange={(e) => changeHandler(e)}
                                clientInput
                                labelText={<Text largeLabel>{clientData.work_location_country_id == 101 ?
                                    'Pin Code' : 'Zip Code'
                                }<span className={classes.optional}>(Optional)</span></Text>} />
                            {
                                errors.work_location_zipcode ?
                                    <Text red>{errors.work_location_zipcode ? errors.work_location_zipcode : ''}</Text> : ''
                            }
                        </Grid>
                    </Grid>
                }
                <Grid item lg={12} pt={3} ><Divider /></Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} pt={3}>
                    <Text largeBoldBlack>Upload Document  </Text>
                </Grid>
                <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={3} >
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        {contact == "document_type_id" ? (
                            <HtmlTooltip
                                title={
                                    <AddDocumentType
                                        open={(e) => setOpentooltip(e)}
                                        getDocumentsTypes={getDocumentTypes}
                                    />
                                }
                            >
                                <Box>
                                    <SearchSelect
                                        name='document_type_id'
                                        value={clientData.documents && clientData.documents[0].document_type_id}
                                        onChange={changeHandler}
                                        options={docType}
                                        disabled={action == 'view' ? true : false}
                                        buttonName='Document type'
                                        onClick={(e) => {
                                            setContact("document_type_id");
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
                                    value={clientData.documents && clientData.documents[0].document_type_id}
                                    onChange={changeHandler}
                                    options={docType}
                                    disabled={action == 'view' ? true : false}
                                    buttonName='Document type'
                                    onClick={(e) => {
                                        setContact("document_type_id");
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
                                value: clientData.documents[0] && clientData.documents[0].document_name,
                                disabled: action == 'view' ? true : false,
                                inputProps: { maxLength: 50 }
                            }}
                            handleChange={changeHandler}
                            clientInput
                            labelText={<Text largeLabel>Document Name </Text>}
                        />
                        {erro.length > 0 ? (<Text red>{erro[0] ? erro[0].document_name : ""}</Text>) : ("")}
                    </Grid>

                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} pt={2}>
                    {
                        clientData.documents.map((item, key) => (
                            <Grid container spacing={1} key={key}>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box px={1} py={2}>
                                        <FileInput
                                            name={"new_document_id"}
                                            FileName={item.name ? item.name : ''}
                                            handleChange={(e) => uploadDocs(e, key)}
                                            label={"Support Document"}
                                            isDisabled={false}
                                            handleDelete={() => deleteDoc(key)}
                                            actionState={item.name ? 1 : ''}
                                            disabled={action == 'view' ? true : false}
                                        />
                                        {erro.length > 0 ? (<Text red>{erro[0] ? erro[0].new_document_id : ""}</Text>) : ("")}
                                    </Box>
                                </Grid>
                                {/* <Grid lg={1} md={2} sm={2} xs={2}>
                        <Box p={1} sx={{ height: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
                            {
                                clientData.documents.length - 1 == key ?
                                    <Add className={action === "view" ? classes.disabledColor : classes.add} onClick={() => addSupportDocuments()}></Add> : null
                            }
                            {
                                clientData.documents.length > 1 ?
                                    <Remove className={action === "view" ? classes.disabledColor : classes.minus} onClick={() => removeSupportDocuments(key)}></Remove> : null
                            }
                        </Box>
                    </Grid> */}
                            </Grid>
                        ))
                    }
                </Grid>
                {action == 'update' &&
                    <Grid container lg={12} md={12} mt={2} mb={2} justifyContent={"end"}>
                        <Stack spacing={3} direction={"row"}>
                            <Button popupCancelHeight onClick={() => { setAction('view'); setViewState(''); getPlacementDetails(clientDetails.id) }}>Cancel</Button>
                            <LoadingButton smallSaveLoader loading={loading} onClick={handleSubmit}>{action == 'update' ? 'Update' : 'Save'}</LoadingButton>
                        </Stack>
                    </Grid>
                }
            </Grid>
            <ReusablePopup openPopup={openClient} iconHide white fixedWidth>
                <Box p={2} textAlign="center">
                    <Text largeBlack>Are you sure want to Update <b>Client</b> ?<br /> Entered details will be LOST</Text>
                    <Box p={'40px 0px 20px 0px'} >
                        <Stack direction={"row"} spacing={2} justifyContent="center">
                            <Button popupSaveBlue onClick={() => handleClearClient()}>
                                Yes
                            </Button>
                            <Button popupCancel onClick={() => { setOpenClient(false) }}>
                                No
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </ReusablePopup>
            <ReusablePopup openPopup={openEndClient} iconHide white fixedWidth>
                <Box p={2} textAlign="center">
                    <Text largeBlack>Are you sure want to Update <b>End Client</b>?<br /> Entered details will be LOST</Text>
                    <Box p={'40px 0px 20px 0px'}>
                        <Stack direction={"row"} spacing={2} justifyContent="center">
                            <Button save onClick={() => handleClearEndClient()}>
                                Yes
                            </Button>
                            <Button cancel onClick={() => { setOpenEndClient(false) }}>
                                No
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </ReusablePopup>
        </Grid>
    )
}

export default ViewClient