import { Box, Checkbox, Divider, Grid, Stack } from '@mui/material'
import React from 'react'
import Text from '../../../../../components/customText/Text'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomAccordion from '../../../../../components/accordion/CustomAccordion';
import { useState } from 'react';
import LocalStorage from '../../../../../utils/LocalStorage';
import Input from '../../../../../components/input/Input';
import DocumentStyles from './DocumentStyles';
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import CommonApi from '../../../../../apis/CommonApi';
import { useEffect } from 'react';
import Button from '../../../../../components/customButton/Button';
import { isValid, isValidMulti, validate_alphaNumeric, validate_emptyField, validate_i94, validate_passport, validate_vissa } from '../../../../../components/Validation';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../../utils/utils';
import plus from '../../../../../assets/employee/blueplus.svg';
import editIcon from '../../../../../assets/svg/square-edit.svg';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import EducationalDetails from './EducationalDetails';
import PersonalDocuments from './PersonalDocuments';
import Date from '../../../../../components/datePicker/Date';
import moment from 'moment';
import FileInput from '../../../../../components/muiFileInput/FileInput';
import OnBoardApi from '../../../../../apis/admin/employees/OnBoardApi';
import draft from '../../../../../assets/employee/savedraft.svg';
import ReusablePopup from '../../../../../components/reuablePopup/ReusablePopup';
import { useLocation, useNavigate } from 'react-router-dom';
import RemoveIcon from "@mui/icons-material/Remove";
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import EmployeeCreateAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LoaderIcon from '../../../../../assets/svg/sandtimer.svg';

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


function Documents({ docStepper, setDocStepper, mainStep, setMainStep, setSubstepper, setValueMain }) {
    const location = useLocation()
    const emp_id = LocalStorage.getEmployeeId()
    const navigate = useNavigate();
    const classes = DocumentStyles();
    const [countries, setCountries] = useState([]);
    const statusList = require('../../../../../utils/jsons/Status.json');
    const [error, setError] = useState({});
    const [i94Error, setI94Error] = useState({});
    const [visaError, setVisaError] = useState({});
    const [visaTypes, setVisaTypes] = useState([]);
    const [visaDocuments, setVisaDocuments] = useState([]);
    const [docErrors, setDocErrors] = useState([{ visa_document_upload_id: '' }]);
    const [visaMulError, setVisaMulError] = useState([]);
    const [icon, setIcon] = useState(1);
    const [i94Icon, setI94Icon] = useState(1);
    const [visaIcon, setVisaIcon] = useState(1);
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const [deletefiles, setDeletefiles] = useState([]);
    const [deleteI94files, setDeleteI94files] = useState([]);
    const [deleteVisafiles, setDeleteVisafiles] = useState([]);
    const [docError, setDocError] = useState([]);
    const [expand, setExpand] = useState(false);
    const [i94expand, setI94Expand] = useState(false);
    const [visaexpand, setVisaexpand] = useState(false);
    const [open, setOpen] = useState(false);
    const [i9MulError, setI9MulError] = useState([]);
    const [i94DocError, setI94DocError] = useState([]);
    const [saveBtn, setSaveBtn] = useState(true);
    const [i9SaveBtn, setI9SaveBtn] = useState(true);
    const [visaSaveBtn, setVisaSaveBtn] = useState(true);
    const [editState, setEditState] = useState('');
    const [I94EditState, setI94EditState] = useState('');
    const [visaEditState, setVisaEditState] = useState('');
    const [clearAll, setClearAll] = useState(false);
    const [i94ClearAll, setI94ClearAll] = useState(false);
    const [visaClearAll, setVisaClearAll] = useState(false);
    const [disable, setDisable] = useState(0);
    const [formLoader, setFormLoader] = useState(false);
    const [I94FormLoader, setI94FormLoader] = useState(false);
    const [passport, setPassport] = useState({
        id: '',
        place_of_issue: '',
        place_of_birth: '',
        issued_country_id: '',
        valid_from: '',
        valid_till: '',
        document_number: '',
        status: '',
        documents: [
            {
                name: '',
                id: '',
                new_document_id: '',
                document_url: ''
            }
        ]
    })

    const [i94, setI94] = useState({
        id: '',
        valid_from: '',
        expiry_type: 1,
        valid_till: '',
        document_number: '',
        country_id: '',
        status: '',
        documents: [
            {
                name: '',
                id: '',
                description: '',
                new_document_id: '',
                document_status: ''
            }
        ]
    })

    const [visa, setVisa] = useState({
        visa_type_id: '',
        id: '',
        valid_from: '',
        valid_till: '',
        document_number: '',
        status: '',
        visa_documents: [
            {
                new_document_id: '',
                visa_document_name: '',
                visa_document_url: ''
            }
        ],
        i9_documents: [
            {
                new_document_id: '',
                i9_document_name: '',
                i9_document_url: ''
            }
        ],
        support_documents: [
            {
                id: '',
                visa_document_type_id: '',
                visa_document_type_name: '',
                visa_document_upload_id: ''
            }
        ]
    })

    useEffect(() => {
        countriesList();
        VisaList();
        if (location.state !== null) {
            if (location.state.stage === 'General Details' || location.state.stage === 'Documents') {
                addWarningMsg("Please Fill all the Forms to go to Next Step")
            }
        }
        //   if (emp_id) {
        //     PassIndexApi(emp_id)
        //   }
        // eslint-disable-next-line
    }, [])

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const deleteDoc = (index, args) => {
        if (args == 'passport') {
            passport.documents[index].new_document_id = ''
            passport.documents[index].name = ''
            setPassport({ ...passport })
        } else if (args == 'i94') {
            i94.documents[index].new_document_id = ''
            i94.documents[index].name = ''
            setI94({ ...i94 })
        }
    }

    const changeHandler = (e, index, args, visaargs) => {
        if (args == 'passport') {
            if (e.target.name == 'new_document_id') {
                uploadDocs(e, 'passport','','','passport-document');
                handleValidateDoc(e.target, 0);
            }
            else {
                setPassport({
                    ...passport,
                    [e.target.name]: e.target.value
                })
            }
            handleValidate(e)
        } else if (args == 'i94') {
            if (e.target.name == 'expiry_type') {
                i94.expiry_type = e.target.checked == true ? 2 : false ? 1 : 1
                setI94({ ...i94 });
            }
            else if (e.target.name == 'new_document_id') {
                uploadDocs(e, 'i94','','', 'i94-document');
                handleValidateI94Doc(e.target, 0)
            } else {
                setI94({
                    ...i94,
                    [e.target.name]: e.target.value
                });
            }
            handleValidateI94(e)
        } else if (args == 'visa') {
            if (e.target.name == 'visa_type_id') {
                visaDocumentsList(e.target.value)
                visa[e.target.name] = e.target.value;
                setVisa({ ...visa })
            } else if (e.target.name == 'new_document_id' || e.target.name == 'visa_document_upload_id') {
                uploadDocs(e, 'visa', visaargs, index, 'visa-document');
            }
            else if (visaargs == 'suppMul') {
                visa.support_documents[index][e.target.name] = e.target.value
                setVisa({ ...visa }, handleMultiValidate(e, index));
            } else {
                visa[e.target.name] = e.target.value;
                setVisa({ ...visa })
            }
        }
        else {
            visa[e.target.name] = e.target.value;
            setVisa({ ...visa })
        }

        handleValidateVisa(e);
    }

    const addRemove = (action, index) => {
        let newArray = visa.support_documents;
        if (visa.document_type_id == "") {
            // condition for education level is not empty goes inside
            let obj = {
                id: '',
                visa_document_type_id: '',
                visa_document_type_name: '',
                visa_document_upload_id: ''
            }
            if (action == "Add") {
                newArray.push(obj);
            }
        } else {
            // condition for adding document name with education level
            let obj = {
                id: '',
                visa_document_type_id: '',
                visa_document_type_name: '',
                visa_document_upload_id: ''
            };

            if (action == "Add") {
                newArray.push(obj);
            }
        }
        if (action == "Remove") {
            // const deleteData = {
            //     request_id: LocalStorage.uid(),
            // };
            // if (visa.support_documents[index].id != '') {
            //     OnBoardApi.deleteVisaDoc(deleteData, visa.support_documents[index].id, LocalStorage.getAccessToken()).then((response) => {
            //         if (response.data.statusCode == 1003) {
            //         }
            //         else {
            //             addErrorMsg(response.data.message);
            //         }
            //     });
            // }
            newArray.splice(index, 1);
        }
        setVisa({ ...visa, documents: newArray });
    };

    const dateChange = (e, name, args) => {
        console.log(e, "e");
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        if (args == 'passport') {
            setPassport({
                ...passport,
                [name]: moment(date).format(dateFormat())
            }, handleValidate(event))
        } else if (args == 'i94') {
            setI94({
                ...i94,
                [name]: moment(date).format(dateFormat())
            }, handleValidateI94(event))
        } else if (args == 'visa') {
            setVisa({
                ...visa,
                [name]: moment(date).format(dateFormat())
            }, handleValidateVisa(event))
        }
    }

    const handleValidate = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case 'document_number':
                error.document_number = validate_passport(input.value)
                break;
            case 'issued_country_id':
                error.issued_country_id = validate_emptyField(input.value)
                break;
            case 'valid_from':
                error.valid_from = validate_emptyField(input.value)
                break;
            case 'valid_till':
                error.valid_till = validate_emptyField(input.value)
                break;
            case 'status':
                error.status = validate_emptyField(input.value)
                break;
            case 'new_document_id':
                error.new_document_id = validate_emptyField(input.value)
                break;
            default:
                break;
        }
        setError({ ...error });
    }

    const handleValidateI94 = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case 'document_number':
                i94Error.document_number = validate_i94(input.value)
                break;
            case 'country_id':
                i94Error.country_id = validate_emptyField(input.value)
                break;
            case 'valid_from':
                i94Error.valid_from = validate_emptyField(input.value)
                break;
            case 'valid_till':
                i94Error.valid_till = validate_emptyField(input.value)
                break;
            case 'status':
                i94Error.status = validate_emptyField(input.value)
                break;
            case 'expiry_type':
                i94Error.expiry_type = validate_emptyField(input.value)
                break;
            case 'new_document_id':
                i94Error.new_document_id = validate_emptyField(input.value)
                break;
            default:
                break;
        }
        setI94Error({ ...i94Error });
    }

    const handleValidateVisa = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case 'visa_type_id':
                visaError.visa_type_id = validate_emptyField(input.value)
                break;
            case 'document_number':
                visaError.document_number = validate_vissa(input.value)
                break;
            case 'valid_from':
                visaError.valid_from = validate_emptyField(input.value)
                break;
            case 'valid_till':
                visaError.valid_till = validate_emptyField(input.value)
                break;
            case 'status':
                visaError.status = validate_emptyField(input.value)
                break;
            case 'visa_document_upload_id':
                visaError.visa_document_upload_id = validate_emptyField(input.value)
                break;
            case 'i9document_upload_id':
                visaError.i9document_upload_id = validate_emptyField(input.value)
                break;
            default:
                break;
        }
        setVisaError({ ...visaError });
    }

    const handleMultiValidate = (e, index) => {
        let input = e.target;
        let err = docErrors.length > 0 ? (docErrors ? docErrors[index] : docErrors) : docErrors;
        let s1 = docErrors.length > 0 ? [...docErrors] : [{ ...docErrors }];
        switch (input.name || input.tagName) {
            case 'visa_document_type_id':
                err.visa_document_type_id = validate_emptyField(input.value)
                break
            case 'visa_document_upload_id':
                err.visa_document_upload_id = validate_emptyField(input.value)
                break
            default:
                break
        }
        setDocErrors(s1);
    }

    const validateAll = () => {
        const { document_number, valid_from, valid_till, status, issued_country_id } = passport;
        let errors = {};
        errors.document_number = validate_alphaNumeric(document_number);
        errors.valid_from = validate_emptyField(valid_from);
        errors.valid_till = validate_emptyField(valid_till);
        errors.status = validate_emptyField(status);
        errors.issued_country_id = validate_emptyField(issued_country_id);
        return errors;
    }

    const validateI94 = () => {
        const { document_number, valid_from, valid_till, status, country_id } = i94;
        let errors = {};
        errors.document_number = validate_alphaNumeric(document_number);
        errors.valid_from = validate_emptyField(valid_from);
        errors.valid_till = i94.expiry_type == 2 ? validate_emptyField(valid_till) : '';
        errors.status = validate_emptyField(status);
        errors.country_id = validate_emptyField(country_id);
        return errors;
    }

    const validateVisa = () => {
        let { document_number, valid_from, valid_till, status, visa_type_id } = visa;
        let errors = {};
        errors.document_number = validate_alphaNumeric(document_number);
        errors.valid_from = validate_emptyField(valid_from);
        errors.valid_till = validate_emptyField(valid_till);
        errors.status = validate_emptyField(status);
        errors.visa_type_id = validate_emptyField(visa_type_id);
        return errors;
    }

    const docValidations = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        passport.documents.map((value) => {
            errors = {};
            errors.new_document_id = value.id !== '' ? '' : validate_emptyField(value.new_document_id);
            err.push(errors);
        });
        return err;
    };

    const docI94Validations = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        i94.documents.map((value) => {
            errors = {};
            errors.new_document_id = value.id !== '' ? '' : validate_emptyField(value.new_document_id);
            err.push(errors);
            setI94DocError(err)
        });
        return err;
    };

    // eslint-disable-next-line 
    const multiValidations = () => {
        const { support_documents } = visa;  // eslint-disable-next-line
        let errors = {};
        let err = []; // eslint-disable-next-line
        support_documents.map((value) => {
            errors = {}
            errors.visa_document_upload_id = value.id !== '' ? '' : validate_emptyField(value.visa_document_upload_id);
            errors.visa_document_type_id = validate_emptyField(value.visa_document_type_id);
            err.push(errors)
            setDocErrors(err)
        })
        return err;
    }

    const visaMultiValidations = () => {
        const { visa_documents } = visa;  // eslint-disable-next-line
        let errors = {};
        let err = [];// eslint-disable-next-line
        visa_documents.map((value) => {
            errors = {}
            errors.new_document_id = visa.id !== '' ? '' : validate_emptyField(value.new_document_id);
            err.push(errors)
            setVisaMulError(err)
        })
        return err;
    }

    const validateI9Validations = () => {
        const { i9_documents } = visa;  // eslint-disable-next-line
        let errors = {};
        let err = [];// eslint-disable-next-line
        i9_documents.map((value) => {
            errors = {}
            errors.new_document_id = visa.id !== '' ? '' : validate_emptyField(value.new_document_id);
            err.push(errors)
            setI9MulError(err)
        })
        return err;
    }

    const handleVisaMulValidate = (e, index) => {
        let input = e.target;
        console.log(visaMulError.length, "visaMulError length");
        let err = visaMulError.length > 1 ? (visaMulError ? visaMulError[index] : visaMulError) : visaMulError;
        let s1 = visaMulError.length > 1 ? [...visaMulError] : [{ ...visaMulError }];
        switch (input.name || input.tagName) {
            case 'new_document_id':
                err.new_document_id = validate_emptyField(input.value)
                break
            default:
                break
        }
        setVisaMulError(s1);
    }

    const handleValidateDoc = (e, index) => {
        let input = e;
        let error =
            docError.length > 0 ? (docError ? docError[index] : docError) : docError;
        for (var k = 0; k <= index; k++) {
            docError.push({});
        }
        let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
        switch (input.name || input.tagName) {
            case "new_document_id":
                error.new_document_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setDocError(s1);
    };

    const handleValidateI94Doc = (e, index) => {
        let input = e;
        let error =
            i94DocError.length > 0 ? (i94DocError ? i94DocError[index] : i94DocError) : i94DocError;
        for (var k = 0; k <= index; k++) {
            i94DocError.push({});
        }
        let s1 = i94DocError.length > 0 ? [...i94DocError] : [{ ...i94DocError }];
        switch (input.name || input.tagName) {
            case "new_document_id":
                error.new_document_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setI94DocError(s1);
    };


    const handleSubmit = () => {
        let errors = validateAll();
        let documentErrors = docValidations();
        console.log(documentErrors, "doc pass errors");
        if (isValid(errors) && isValidMulti(documentErrors)) {
            passport['employee_id'] = LocalStorage.getEmployeeId();
            passport['request_id'] = LocalStorage.uid();
            console.log(passport, "pass index");
            if (passport.id !== '') {
                OnBoardApi.passportUpdate(passport, passport.id, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Passport details of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Updated Successfully`);
                        setExpand(!expand)
                        setIcon(2);
                        if (editState == 'edit') {
                            setEditState('view');
                        }
                        setSaveBtn(false);
                        PassIndexApi(emp_id);
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            } else {
                OnBoardApi.passportStore(passport, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Passport details of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Added Successfully`);
                        setIcon(2);
                        setDisable(disable + 1)
                        setSaveBtn(false);
                        setEditState('view');
                        if (editState == 'view') {
                            setExpand(expand);
                        } else {
                            setExpand(!expand)
                        }
                        PassIndexApi(emp_id);
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            }

        } else {
            let s1 = { error }
            s1 = errors
            setError(s1);
            let s2 = { docError }
            s2 = documentErrors
            setDocError(s2);
            console.log(docError, "docError");
            addWarningMsg('Please fill all the Mandatory Filelds');
        }
    }

    const handleI94Submit = () => {
        let errors = validateI94();
        let docErrors = docI94Validations();
        if (isValid(errors) & isValidMulti(docErrors)) {
            i94['request_id'] = LocalStorage.uid();
            i94['employee_id'] = LocalStorage.getEmployeeId();
            if (i94.id !== '') {
                OnBoardApi.i94Update(i94, i94.id, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`I-94 details of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Updated Successfully`);
                        setI94Expand(!i94expand)
                        setI94Icon(2);
                        if (I94EditState == 'edit') {
                            setI94EditState('view');
                        }
                        setI9SaveBtn(false);
                        i94IndexApi(LocalStorage.getEmployeeId());
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            } else {
                OnBoardApi.i94Store(i94, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`I-94 details of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Added Successfully`);
                        setI94Expand(!i94expand)
                        setI94Icon(2);
                        setDisable(disable + 1)
                        i94IndexApi(LocalStorage.getEmployeeId());
                        if (i94.id !== '') {
                            setI94EditState('view');
                        }
                        if (I94EditState == 'view') {
                            setI94Expand(i94expand);
                        } else {
                            setI94Expand(!i94expand)
                        }
                        setI9SaveBtn(false);
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            }
        } else {
            let s1 = { i94Error }
            s1 = errors
            setI94Error(s1);
            let s2 = { i94DocError }
            s2 = docErrors
            setI94DocError(s2)
            addWarningMsg('Please fill all the Mandatory Filelds');
        }
    }

    const handleVisaSubmit = () => { // eslint-disable-next-line
        let errors = validateVisa();
        let documentErrors = multiValidations();
        let visaMulErrs = visaMultiValidations();
        let i9MulErrs = validateI9Validations();
        if (isValid(errors) && isValidMulti(documentErrors) && isValidMulti(visaMulErrs) && isValidMulti(i9MulErrs)) {
            visa['request_id'] = LocalStorage.uid();
            visa['employee_id'] = LocalStorage.getEmployeeId();
            if (visa.id !== '') {
                OnBoardApi.visaUpdate(visa, visa.id, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Visa details of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Updated Successfully`);
                        setVisaexpand(!visaexpand);
                        setVisaIcon(2);
                        setDisable(disable + 1)
                        console.log(disable, "able")
                        if (visaEditState == 'edit') {
                            setVisaEditState('view');
                        }
                        setVisaSaveBtn(false);
                        visaIndexApi(LocalStorage.getEmployeeId());
                    }
                })
            } else {
                OnBoardApi.visaStore(visa, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Visa details of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Added Successfully`);
                        setVisaexpand(!visaexpand);
                        setVisaIcon(2);
                        setDisable(disable + 1)
                        console.log(disable, "able")
                        setVisaEditState('view');
                        if (visaEditState == 'view') {
                            setVisaexpand(visaexpand);
                        } else {
                            setVisaexpand(!visaexpand)
                        }
                        visaIndexApi(LocalStorage.getEmployeeId());
                    }
                })
            }
        } else {
            let s1 = { visaError }
            s1 = errors
            setVisaError(s1)
            let s2 = { docErrors }
            s2 = documentErrors
            setDocErrors(s2)
            let s3 = { visaMulError }
            s3 = visaMulErrs
            setVisaMulError(s3)
            let s4 = { i9MulError }
            s4 = i9MulErrs
            setI9MulError(s4)
        }
    }

    const nextStep = () => {
        setDocStepper(docStepper + 1);
        setValue(value + 1);
    }

    const workAuthBack = () => {
        setMainStep(mainStep - 1);
        setSubstepper(1);
        setValueMain(0);
    }

    const uploadDocs = (value, args, visaargs, index, slug_name) => {
        const formData = new FormData();
        formData.append('files', value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload(slug_name,formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (args == 'i94') {
                    setI94FormLoader(true);
                    if (response.data.statusCode == 1003) {
                        let deleteArr = deleteI94files;
                        const data = {
                            request_id: LocalStorage.uid(),
                            document_id: response.data.data.id
                        }
                        EmployeeCreateAPI.ocrDocumentUpload('i94', data).then((res) => {
                            if (res.data.statusCode == 1003) {
                                setI94FormLoader(false);
                                i94.document_number = res.data.data.document_number
                                i94.documents[0].new_document_id = response.data.data.id
                                i94.documents[0].name = value.target.files[0].name
                            } else {
                                setI94FormLoader(false);
                                i94.documents[0].new_document_id = response.data.data.id
                                i94.documents[0].name = value.target.files[0].name
                            }
                            setDeleteI94files([...deleteArr])
                            setI94({ ...i94 });
                        })
                    }
                    else {
                        addErrorMsg(response.data.message);
                    }
                } else if (args == 'visa') {
                    if (visaargs == 'suppMul') {
                        if (response.data.statusCode == 1003) {
                            let deleteArr = deleteVisafiles;
                            visa.support_documents[index].visa_document_type_name = value.target.files[0].name;
                            visa.support_documents[index].id = "";
                            visa.support_documents[index].visa_document_upload_id = response.data.data.id;
                            setDeleteVisafiles([...deleteArr])
                            setVisa({ ...visa }, handleMultiValidate(value, index));
                        }
                        else {
                            addErrorMsg(response.data.message);
                        }
                    }
                    else if (visaargs == 'visaMul') {
                        visa.visa_documents[index].new_document_id = response.data.data.id
                        visa.visa_documents[index].visa_document_name = value.target.files[0].name
                        setVisa({ ...visa }, handleVisaMulValidate(value, index));
                    } else if (visaargs == 'i94Mul') {
                        visa.i9_documents[index].new_document_id = response.data.data.id
                        visa.i9_documents[index].i9_document_name = value.target.files[0].name
                        setVisa({ ...visa }, validateI9Validations(value));
                    }
                }
                else {
                    setFormLoader(true);
                    if (response.data.statusCode == 1003) {
                        let deleteArr = deletefiles;
                        const data = {
                            request_id: LocalStorage.uid(),
                            document_id: response.data.data.id
                        }
                        EmployeeCreateAPI.ocrDocumentUpload('passport', data).then((res) => {
                            if (res.data.statusCode == 1003) {
                                setFormLoader(false);
                                passport.document_number = res.data.data.passport_number
                                passport.valid_from = moment(res.data.data.date_of_issue, 'DD/MM/YYYY').format('MM/DD/YYYY')
                                passport.valid_till = moment(res.data.data.date_of_expiry, 'DD/MM/YYYY').format('MM/DD/YYYY')
                                passport.documents[0].new_document_id = response.data.data.id
                                passport.documents[0].name = value.target.files[0].name;
                            } else {
                                setFormLoader(false);
                                passport.documents[0].new_document_id = response.data.data.id
                                passport.documents[0].name = value.target.files[0].name;
                            }
                            setDeletefiles([...deleteArr])
                            setPassport({ ...passport });
                        })
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }
            });
    }

    const countriesList = () => {
        CommonApi.getCountryList('', LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setCountries(res.data.data);
            }
        })
    }

    const VisaList = () => {
        CommonApi.visaTypes(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setVisaTypes(res.data.data);
            }
        })
    }

    const visaDocumentsList = (id) => {
        CommonApi.visaDocumentTypeList(LocalStorage.uid(), id ? id : '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaDocuments(response.data.data);
            }
        })
    }

    const PassIndexApi = (id) => {
        OnBoardApi.passportIndex(LocalStorage.uid(), id, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                console.log(res.data.data.length, "res pass");
                setIcon(2);
                setPassport(res.data.data[0]);
                console.log(res.data.data.length, "res")
                if (res.data.data.length === 0) {
                    setPassport({
                        id: '',
                        place_of_issue: '',
                        place_of_birth: '',
                        issued_country_id: '',
                        valid_from: '',
                        valid_till: '',
                        document_number: '',
                        status: '',
                        documents: [
                            {
                                name: '',
                                id: '',
                                new_document_id: '',
                                document_url: ''
                            }
                        ]
                    })
                }
            }
        })
    }
    console.log(passport, "pass")
    const visaIndexApi = (id) => {
        OnBoardApi.visaIndex(LocalStorage.uid(), id, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setIcon(2);
                setVisa(res.data.data[0]);
            }
        })
    }

    const i94IndexApi = (id) => {
        OnBoardApi.I94Index(LocalStorage.uid(), id, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setIcon(2);
                setI94(res.data.data[0]);
            }
        })
    }

    const accordionHandler = (args) => {
        if (args == 'passport') {
            setExpand(!expand)
        } else if (args == 'i94') {
            setI94Expand(!i94expand)
        } else if (args == 'visa') {
            setVisaexpand(!visaexpand)
        }
    }

    const passportEdit = (args) => {
        if (args == 'passport') {
            setExpand(true);
            setSaveBtn(true)
            setEditState('edit');
            setIcon(3);
            setClearAll(true);
        } else if (args == 'I94') {
            setI94Expand(true);
            setI9SaveBtn(true)
            setI94EditState('edit');
            setI94Icon(3);
            setVisaClearAll(true);
        } else if (args == 'visa') {
            setVisaexpand(true);
            setVisaSaveBtn(true);
            setVisaEditState('edit');
            setVisaIcon(3);
            setVisaClearAll(true);
        }
    }

    const clearData = (args) => {
        if (args == 'passport') {
            setPassport({
                id: '',
                place_of_issue: '',
                place_of_birth: '',
                issued_country_id: '',
                valid_from: '',
                valid_till: '',
                document_number: '',
                status: '',
                documents: [
                    {
                        name: '',
                        id: '',
                        new_document_id: '',
                        document_url: ''
                    }
                ]
            })
            setClearAll(false);
        } else if (args == 'I94') {
            setI94({
                id: '',
                valid_from: '',
                expiry_type: 1,
                valid_till: '',
                document_number: '',
                country_id: '',
                status: '',
                documents: [
                    {
                        name: '',
                        id: '',
                        description: '',
                        new_document_id: '',
                        document_status: ''
                    }
                ]
            })
            setI94ClearAll(false);
        } else if (args == 'visa') {
            setVisa({
                visa_type_id: '',
                id: '',
                valid_from: '',
                valid_till: '',
                document_number: '',
                status: '',
                visa_documents: [
                    {
                        new_document_id: '',
                        visa_document_name: '',
                        visa_document_url: ''
                    }
                ],
                i9_documents: [
                    {
                        new_document_id: '',
                        i9_document_name: '',
                        i9_document_url: ''
                    }
                ],
                support_documents: [
                    {
                        id: '',
                        visa_document_type_id: '',
                        visa_document_type_name: '',
                        visa_document_upload_id: ''
                    }
                ]
            })
            setVisaClearAll(false);
        }
    }

    return (
        <Grid container pt={15} justifyContent='center' pb={2}>
            <Grid item container lg={5.8}>
                <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {
                            docStepper == 1 &&
                            <Grid item container lg={12}>
                                <Text largeBlack>Work Authorization</Text>
                                <Grid item lg={12} p={'30px 0px 10px 0px'}>
                                    <CustomAccordion
                                        icon={expand ? icon == '' : icon}
                                        expanded={expand}
                                        handlechangeaccordion={() => accordionHandler('passport')}
                                        AccordionHeader={
                                            <Box justifyContent='space-between' display='flex' flexDirection='row' width='100% !important' p={'0px 0px 0px 10px'}>
                                                <Box>
                                                    <Text headerBlack>Passport</Text>
                                                </Box>
                                                <Box textAlign='end'>
                                                    {(expand && icon == 2) && <img src={editIcon} alt='editIcon' className={classes.edit} onClick={() => passportEdit('passport')} />}
                                                </Box>
                                            </Box>
                                        }
                                    >
                                        {
                                            formLoader ?
                                                <Box className={classes.ViewContainer}>
                                                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                                    </Stack>
                                                </Box> :
                                                <Grid container spacing={2} p={'0px 10px'}>
                                                    {
                                                        passport.documents.map((item, index) => (
                                                            <Grid item lg={12} mt={2} pb={2}>
                                                                <FileInput
                                                                    name='new_document_id'
                                                                    FileName={item.name}
                                                                    handleChange={(e) => changeHandler(e, index, 'passport')}
                                                                    label={<Text largeLabel>Document</Text>}
                                                                    handleDelete={() => deleteDoc(index, 'passport')}
                                                                    actionState={item.name ? 1 : ''}
                                                                />
                                                                {
                                                                    passport.documents.length == 1 ?
                                                                        <Text red>{docError ? docError[index] && docError[index].new_document_id : ''}</Text> : ''
                                                                }
                                                            </Grid>
                                                        ))
                                                    }
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'document_number',
                                                                value: passport.document_number,
                                                                inputProps: { minLength: 6, maxLength: 15 }
                                                            }}
                                                            handleChange={(e, index) => changeHandler(e, index, 'passport')}
                                                            clientInput
                                                            labelText={<Text largeLabel>Passport Number</Text>}
                                                        />
                                                        {error.document_number && <Text red>{error.document_number ? error.document_number : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Box pt='0px'>
                                                            <SearchSelect
                                                                name='issued_country_id'
                                                                value={passport.issued_country_id}
                                                                onChange={(e, index) => changeHandler(e, index, 'passport')}
                                                                options={countries}
                                                                labelText={<Text largeLabel>Issued Country</Text>}
                                                            />
                                                        </Box>
                                                        {error.issued_country_id && <Text red>{error.issued_country_id ? error.issued_country_id : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Box pt='9px'>
                                                            <CustomSelect name='status' commonSelect value={passport.status} options={statusList} onChange={(e, index) => changeHandler(e, index, 'passport')}
                                                                label={<Text largeLabel>Status</Text>} />
                                                        </Box>
                                                        {error.status && <Text red>{error.status ? error.status : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={3}>
                                                        <Box pt={'9px'}>
                                                            <Date
                                                                labelText={<Text largeLabel>Date of Issue</Text>}
                                                                name='valid_from'
                                                                value={passport.valid_from}
                                                                maxDate={moment().format(dateFormat())}
                                                                onChange={(value => dateChange(value, 'valid_from', 'passport'))}
                                                                height='56px'
                                                            />
                                                        </Box>
                                                        {error.valid_from && <Text red>{error.valid_from ? error.valid_from : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={3}>
                                                        <Box pt={'9px'}>
                                                            <Date
                                                                labelText={<Text largeLabel>Date of Expiry</Text>}
                                                                name='valid_till'
                                                                minDate={passport.valid_from}
                                                                value={passport.valid_till}
                                                                onChange={(value => dateChange(value, 'valid_till', 'passport'))}
                                                                height='56px'
                                                            />
                                                        </Box>
                                                        {error.valid_till && <Text red>{error.valid_till ? error.valid_till : ''}</Text>}
                                                    </Grid>

                                                    {
                                                        saveBtn &&
                                                        <Grid item container m={'10px 0px 10px 0px'}>
                                                            <Grid item lg={6}>
                                                                <Button blackCancel onClick={() => { setExpand(!expand); setIcon(2) }}>Cancel</Button>
                                                            </Grid>
                                                            <Grid item lg={6} textAlign='end'>
                                                                {
                                                                    clearAll && <Button clearall sx={{ marginRight: '15px !important' }} onClick={() => clearData('passport')}>Clear all</Button>
                                                                }
                                                                <Button brownMnSave onClick={handleSubmit}>Save</Button>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                        }
                                    </CustomAccordion>
                                </Grid>

                                <Grid item lg={12} p={'20px 0px 10px 0px'}>
                                    <CustomAccordion
                                        icon={i94expand ? i94Icon == '' : i94Icon}
                                        expanded={i94expand}
                                        disabled={disable === 1 ? true : false}
                                        handlechangeaccordion={() => accordionHandler('i94')}
                                        AccordionHeader={
                                            <Box justifyContent='space-between' display='flex' flexDirection='row' width='100% !important' p={'0px 0px 0px 10px'}>
                                                <Box>
                                                    <Text headerBlack>I-94</Text>
                                                </Box>
                                                <Box textAlign='end'>
                                                    {(i94expand && i94Icon == 2) && <img src={editIcon} alt='editIcon' className={classes.edit} onClick={() => passportEdit('I94')} />}
                                                </Box>
                                            </Box>
                                        }>
                                        {
                                            I94FormLoader ?
                                                <Box className={classes.ViewContainer}>
                                                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                                    </Stack>
                                                </Box> :
                                                <Grid container spacing={2} p={'0px 10px'}>
                                                    {
                                                        i94.documents.map((item, key) => (
                                                            <Grid item lg={12} pb={2}>
                                                                <FileInput
                                                                    name='new_document_id'
                                                                    FileName={item.name}
                                                                    viewDisplay={item.document_url}
                                                                    handleChange={(e) => changeHandler(e, key, 'i94')}
                                                                    label={<Text largeLabel>Document</Text>}
                                                                    handleDelete={() => deleteDoc(key, 'i94')}
                                                                    actionState={item.name ? 1 : ''}
                                                                />
                                                                {
                                                                    i94.documents.length == 1 ?
                                                                        <Text red>{i94DocError ? i94DocError[key] && i94DocError[key].new_document_id : ''}</Text> : ''
                                                                }
                                                            </Grid>
                                                        ))
                                                    }
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'document_number',
                                                                value: i94.document_number,
                                                                inputProps: { minLength: 6, maxLength: 11 }
                                                            }}
                                                            handleChange={(e, index) => changeHandler(e, index, 'i94')}
                                                            clientInput
                                                            labelText={<Text largeLabel>I-94 Number</Text>}
                                                        />
                                                        {i94Error.document_number && <Text red>{i94Error.document_number ? i94Error.document_number : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Box pt='0px'>
                                                            <SearchSelect
                                                                name='country_id'
                                                                value={i94.country_id}
                                                                onChange={(e, index) => changeHandler(e, index, 'i94')}
                                                                options={countries}
                                                                labelText={<Text largeLabel>Country of Origin</Text>}
                                                            />
                                                        </Box>
                                                        {i94Error.country_id && <Text red>{i94Error.country_id ? i94Error.country_id : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={i94.expiry_type == 2 ? 3 : 6}>
                                                        <Box pt={'9px'}>
                                                            <Date
                                                                labelText={<Text largeLabel>Date of Arrival</Text>}
                                                                name='valid_from'
                                                                value={i94.valid_from}
                                                                maxDate={moment().format(dateFormat())}
                                                                onChange={(value => dateChange(value, 'valid_from', 'i94'))}
                                                                height='56px'
                                                            />
                                                        </Box>
                                                        {i94Error.valid_from && <Text red>{i94Error.valid_from ? i94Error.valid_from : ''}</Text>}
                                                    </Grid>
                                                    {
                                                        i94.expiry_type == 2 &&
                                                        <Grid item lg={3}>
                                                            <Box pt='9px'>
                                                                <Date
                                                                    labelText={<Text largeLabel>Date of Expiry</Text>}
                                                                    name='valid_till'
                                                                    value={i94.valid_till}
                                                                    minDate={i94.valid_from}
                                                                    onChange={(value => dateChange(value, 'valid_till', 'i94'))}
                                                                    height='56px'
                                                                />
                                                            </Box>
                                                            {i94Error.valid_till && <Text red>{i94Error.valid_till ? i94Error.valid_till : ''}</Text>}
                                                        </Grid>
                                                    }
                                                    <Grid item lg={6}>
                                                        <Box pt='9px'>
                                                            <CustomSelect name='status' commonSelect value={i94.status} options={statusList} onChange={(e, index) => changeHandler(e, index, 'i94')} label={<Text largeLabel>Status</Text>} />
                                                        </Box>
                                                        {i94Error.status && <Text red>{i94Error.status ? i94Error.status : ''}</Text>}
                                                    </Grid>
                                                    <Grid item lg={12} m={'10px 0px'}>
                                                        <Box display='flex' flexDirection='row' gap={2} alignItems='center'>
                                                            <Checkbox sx={{ padding: '0px !important' }} name='expiry_type' value={i94.expiry_type} onChange={(e, index) => changeHandler(e, index, 'i94')} />
                                                            <Text mediumBlack>Do you have an expiry date for this I-94 </Text>
                                                        </Box>
                                                    </Grid>

                                                    {
                                                        i9SaveBtn &&
                                                        <Grid item container m={'10px 0px 10px 0px'}>
                                                            <Grid item lg={6}>
                                                                <Button blackCancel onClick={() => setI94Expand(false)}>Cancel</Button>
                                                            </Grid>
                                                            <Grid item lg={6} textAlign='end'>
                                                                {
                                                                    i94ClearAll && <Button clearall sx={{ marginRight: '15px !important' }} onClick={() => clearData('I94')}>Clear all</Button>
                                                                }
                                                                <Button brownMnSave onClick={handleI94Submit}>Save</Button>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                        }
                                    </CustomAccordion>
                                </Grid>
                                <Grid item lg={12} p={'20px 0px 10px 0px'}>
                                    <CustomAccordion
                                        icon={visaexpand ? visaIcon == '' : visaIcon}
                                        expanded={visaexpand}
                                        handlechangeaccordion={() => accordionHandler('visa')}
                                        AccordionHeader={
                                            <Box justifyContent='space-between' display='flex' flexDirection='row' width='100% !important' p={'0px 0px 0px 10px'}>
                                                <Box>
                                                    <Text headerBlack>Work Authorization Type</Text>
                                                </Box>
                                                <Box textAlign='end'>
                                                    {(visaexpand && visaIcon == 2) && <img src={editIcon} alt='editIcon' className={classes.edit} onClick={() => passportEdit('visa')} />}
                                                </Box>
                                            </Box>
                                        }
                                    >
                                        <Grid container spacing={2} p={'0px 10px'}>
                                            {
                                                visa.visa_documents.map((item, index) => (
                                                    <Grid item lg={12} m={'10px 0px'}>
                                                        <FileInput
                                                            name='new_document_id'
                                                            // value={item.new_document_id}
                                                            FileName={item.visa_document_name}
                                                            actionState={(visaIcon == 2 && visaexpand && visaEditState == 'view') ? 'view' : visaEditState == 'edit' ? 'deleteState' : ''}
                                                            viewDisplay={item.visa_document_url}
                                                            handleChange={(e) => changeHandler(e, index, 'visa', 'visaMul')}
                                                            label={<Text largeLabel>Document</Text>}
                                                        />
                                                        {visaMulError.length > 0 ? (
                                                            <Text red>{visaMulError[index] ? visaMulError[index].new_document_id : ""}</Text>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </Grid>
                                                ))
                                            }
                                            {
                                                visa.i9_documents.map((item, index) => (
                                                    <Grid item lg={12} pb={1}>
                                                        <FileInput
                                                            name='new_document_id'
                                                            // value={item.new_document_id}
                                                            actionState={(visaIcon == 2 && visaexpand && visaEditState == 'view') ? 'view' : visaEditState == 'edit' ? 'deleteState' : ''}
                                                            viewDisplay={item.i9_document_url}
                                                            FileName={item.i9_document_name}
                                                            handleChange={(e) => changeHandler(e, index, 'visa', 'i94Mul')}
                                                            label={<Text largeLabel>I-9 Document</Text>}
                                                        />
                                                        {i9MulError.length > 0 ? (
                                                            <Text red>{i9MulError[index] ? i9MulError[index].new_document_id : ""}</Text>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </Grid>
                                                ))
                                            }
                                            <Grid item lg={6}>
                                                <Box pt='0px'>
                                                    <SearchSelect
                                                        name='visa_type_id'
                                                        value={visa.visa_type_id}
                                                        onChange={(e, index) => changeHandler(e, index, 'visa')}
                                                        options={visaTypes}
                                                        labelText={<Text largeLabel>Visa Type</Text>}
                                                    />
                                                </Box>
                                                {visaError.visa_type_id && <Text red>{visaError.visa_type_id ? visaError.visa_type_id : ''}</Text>}
                                            </Grid>
                                            <Grid item lg={6}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'document_number',
                                                        value: visa.document_number,
                                                        inputProps: { minLength: 6, maxLength: 10 }
                                                    }}
                                                    handleChange={(e, index) => changeHandler(e, index, 'visa')}
                                                    clientInput
                                                    labelText={<Text largeLabel>Visa Number</Text>}
                                                />
                                                {visaError.document_number && <Text red>{visaError.document_number ? visaError.document_number : ''}</Text>}
                                            </Grid>
                                            <Grid item lg={6}>
                                                <Box pt='9px'>
                                                    <CustomSelect name='status' commonSelect value={visa.status} options={statusList} onChange={(e, index) => changeHandler(e, index, 'visa')} label={<Text largeLabel>Status</Text>} />
                                                </Box>
                                                {visaError.status && <Text red>{visaError.status ? visaError.status : ''}</Text>}
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Box pt={'9px'}>
                                                    <Date
                                                        labelText={<Text largeLabel>Date of Issue</Text>}
                                                        name='valid_from'
                                                        value={visa.valid_from}
                                                        maxDate={moment().format(dateFormat())}
                                                        onChange={(value => dateChange(value, 'valid_from', 'visa'))}
                                                        height='56px'
                                                    />
                                                </Box>
                                                {visaError.valid_from && <Text red>{visaError.valid_from ? visaError.valid_from : ''}</Text>}
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Box pt={'9px'}>
                                                    <Date
                                                        labelText={<Text largeLabel>Date of Expiry</Text>}
                                                        name='valid_till'
                                                        minDate={visa.valid_from}
                                                        value={visa.valid_till}
                                                        onChange={(value => dateChange(value, 'valid_till', 'visa'))}
                                                        height='56px'
                                                    />
                                                </Box>
                                                {visaError.valid_till && <Text red>{visaError.valid_till ? visaError.valid_till : ''}</Text>}
                                            </Grid>

                                            <Grid item lg={12}>
                                                <Divider sx={{ borderStyle: 'dashed', margin: '15px 0px !important' }} variant='center' />
                                            </Grid>
                                            {
                                                visa.support_documents.map((item, index) => (
                                                    <Grid item container spacing={2} columnSpacing={2} alignItems='center' pb={2}>
                                                        <Grid item lg={5}>
                                                            <Box pt='9px'>
                                                                <SearchSelect
                                                                    name='visa_document_type_id'
                                                                    value={item.visa_document_type_id}
                                                                    actionState={(visaIcon == 2 && visaexpand && visaEditState == 'view') ? 'view' : visaEditState == 'edit' ? 'deleteState' : ''}
                                                                    // viewDisplay={item.}
                                                                    onChange={(e) => changeHandler(e, index, 'visa', 'suppMul')}
                                                                    options={visaDocuments}
                                                                    labelText={<Text largeLabel>Supporting Document Type</Text>}
                                                                />
                                                            </Box>
                                                            {docErrors.length > 0 ? (
                                                                <Text red>{docErrors[index] ? docErrors[index].visa_document_type_id : ""}</Text>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </Grid>
                                                        <Grid item lg={6}>
                                                            <Box pt={'9px'}>
                                                                <FileInput
                                                                    name='visa_document_upload_id'
                                                                    FileName={item.visa_document_type_name}
                                                                    actionState={(visaIcon == 2 && visaexpand && visaEditState == 'view') ? 'view' : visaEditState == 'edit' ? 'deleteState' : ''}
                                                                    handleChange={(e) => changeHandler(e, index, 'visa', 'suppMul')}
                                                                    label={<Text largeLabel>Supporting Documents</Text>}
                                                                />
                                                            </Box>
                                                            {docErrors.length > 0 ? (
                                                                <Text red>{docErrors[index] ? docErrors[index].visa_document_upload_id : ""}</Text>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </Grid>
                                                        <Grid item lg={1}>
                                                            <Box pt={'10px'}>
                                                                {visa.support_documents.length - 1 == index ?
                                                                    (
                                                                        <>
                                                                            <img src={plus} alt='plus' onClick={() => addRemove("Add")} />
                                                                            {
                                                                                visa.support_documents.length > 1 &&
                                                                                <RemoveIcon onClick={() => addRemove("Remove")} style={{ color: 'red', cursor: 'pointer' }} />
                                                                            }
                                                                        </>
                                                                    )
                                                                    : <RemoveIcon onClick={() => addRemove("Remove")} style={{ color: 'red', cursor: 'pointer' }} />
                                                                }

                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                ))
                                            }
                                            {
                                                visaSaveBtn &&
                                                <Grid item container m={'10px 0px 10px 0px'}>
                                                    <Grid item lg={6}>
                                                        <Button blackCancel onClick={() => setVisaexpand(false)}>Cancel</Button>
                                                    </Grid>
                                                    <Grid item lg={6} textAlign='end'>
                                                        {
                                                            visaClearAll && <Button clearall sx={{ marginRight: '15px !important' }} onClick={() => clearData('visa')}>Clear all</Button>
                                                        }
                                                        <Button brownMnSave onClick={handleVisaSubmit}>Save</Button>
                                                    </Grid>
                                                </Grid>
                                            }
                                        </Grid>
                                    </CustomAccordion>
                                </Grid>
                                {disable === 3 &&
                                    <Grid item container m={'20px 0px 10px 0px'}>
                                        <Grid item lg={6}>
                                            <Button blackCancel onClick={workAuthBack} disable={location.state.stage === 'General Details' || location.state.stage === 'Documents' ? true : false}>Back</Button>
                                        </Grid>
                                        <Grid item lg={6} textAlign='end'>
                                            {/* <Button saveAsDraft sx={{ marginRight: '15px' }} onClick={() => setOpen(true)}>Save as Draft</Button> */}
                                            <Button saveNcontinue onClick={nextStep}>Save & Continue</Button>
                                        </Grid>
                                    </Grid>
                                }

                            </Grid>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        {
                            docStepper == 2 &&
                            <EducationalDetails value={value} setValue={setValue} docStepper={docStepper} setDocStepper={setDocStepper} />
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        {docStepper == 3 &&
                            <PersonalDocuments value={value} setValue={setValue} docStepper={docStepper} setDocStepper={setDocStepper} mainStep={mainStep} setMainStep={setMainStep} />
                        }
                    </TabPanel>
                </SwipeableViews>
            </Grid>
            {
                open &&
                <ReusablePopup openPopup={open} setOpenPopup={setOpen} crossIcon iconHide white>
                    <Box textAlign='center' p={'0px 20px'}>
                        <img src={draft} alt='draft' style={{ height: '130px', width: '150px' }} />
                        <Text veryLargeLabel>Save as Draft!</Text>
                        <Text mediumLabel sx={{ paddingTop: '20px' }}>Your progress will be saved, and you will be able to<br /> continue from the next stage when you return.</Text>
                        <Button blueButton sx={{ marginTop: '20px' }} onClick={() => navigate('/employees')}>Done</Button>
                    </Box>
                </ReusablePopup>
            }
        </Grid >
    )
}

export default Documents