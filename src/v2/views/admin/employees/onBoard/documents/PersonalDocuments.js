import React from 'react'
import CustomAccordion from '../../../../../components/accordion/CustomAccordion';
import { useState } from 'react';
import LocalStorage from '../../../../../utils/LocalStorage';
import { Box, Card, CardContent, CardHeader, Grid, Stack } from '@mui/material';
import Button from '../../../../../components/customButton/Button';
import { isValid, isValidMulti, validate_emptyField } from '../../../../../components/Validation';
import Text from '../../../../../components/customText/Text';
import ReusablePopup from '../../../../../components/reuablePopup/ReusablePopup';
import PropTypes from 'prop-types';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../../utils/utils';
import PersonalDocsForm from './PersonalDocsForm';
import CommonApi from '../../../../../apis/CommonApi';
import { useEffect } from 'react';
import info from '../../../../../assets/employee/blue-info.svg';
import { TooltipIndicator } from '../../../../../theme';
import OnBoardApi from '../../../../../apis/admin/employees/OnBoardApi';
import editIcon from '../../../../../assets/svg/square-edit.svg';
import moment from 'moment';

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

function PersonalDocuments({ docStepper, setDocStepper, mainStep, setMainStep, value, setValue }) {
    const emp_id = LocalStorage.getEmployeeId();;
    const [state, setState] = useState({
        id: '',
        document_type_id: '',
        valid_from: '',
        valid_till: '',
        document_number: '',
        status: '',
        documents: [
            {
                document_name: '',
                id: '',
                description: '',
                new_document_id: ''
            }
        ]
    })

    const [error, setError] = useState([]);
    const [addNew, setAddNew] = useState(true);
    const [DocumentsList, setDocumentList] = useState([]);
    const [editForm, setEditForm] = useState(true);
    const [docsList, setDocslist] = useState([]);
    const [deletefiles, setDeletefiles] = useState([]);
    const [addExpand, setAddExpand] = useState(false); // eslint-disable-next-line
    const [docError, setDocError] = useState([]);// eslint-disable-next-line
    const [docTpc, setDocTpc] = useState('');// eslint-disable-next-line
    const [alertOpen, setAlertOpen] = useState(false);
    const [expanded, setExpanded] = useState(false); // eslint-disable-next-line
    const [editAccIcon, setEditAccIcon] = useState(2);// eslint-disable-next-line
    const [edit, setEdit] = useState(false);

    const [drpData, setDrpData] = useState({
        number_mandatory: false,
        number_display: true,
        valid_from_mandatory: false,
        valid_from_display: true,
        valid_to_mandatory: false,
        valid_to_display: true,
        status_mandatory: true,
        status_display: true,
        upload_mandatory: false,
        upload_display: true
    })

    const handleClear = () => {
        let docProperties = docsList.filter(item => item.id == docTpc);
        setDrpData(docProperties[0]);
        state['document_type_id'] = docTpc;
        state['document_number'] = '';
        state['document_type_name'] = '';
        state['valid_from'] = '';
        state['valid_till'] = '';
        state['status'] = '';
        state.documents = [
            { docName: "", document_name: "", id: "", new_document_id: "", description: "", document_status: 0 }
        ]
        error['valid_from'] = '';
        error['valid_till'] = '';
        error['status'] = '';
        error['document_number'] = '';
        setError({ ...error });
        setDocError([]);
        setState({ ...state });
        setAlertOpen(false);
    }

    useEffect(() => {
        docs();
        if (emp_id) {
            getPersonalIndex(emp_id);
        }// eslint-disable-next-line 
    }, [])

    const handleChangeAccordion = (panel, index, item) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setAddExpand(false);
        setError(validateAll(item))
    };

    const handleEditIcon = (e, index) => {
        setEdit(true);
        setAddExpand(false);
        e.stopPropagation();
    }

    const changeHandler = (e, val, index) => {
        // if (val != undefined && val != false && val.name != undefined) {
        //     if (val.name == "document_type_id") {
        //         setState({
        //             ...state,
        //             [val.name]: e.value,
        //             document_type_name: e.label,
        //         });
        //         setError(validate_selectField(val.name, error));
        //     }
        // }
        // else {
        let name = e.target.name;
        if (index >= 0) {
            if (name == "new_document_id") {
                uploadDocs(e, index);
            } else {
                state.documents[index][name] = e.target.value;
            }
            setState({ ...state }, handleValidateDoc(e.target, index));
        }
        else {
            if (name == "document_type_id") {
                if (state.document_type_id == "") {
                    state[name] = e.target.value;
                    let docProperties = docsList.filter(item => item.id == e.target.value);
                    setDrpData(docProperties[0]);
                    console.log(drpData, "without popup");
                } else {
                    setAlertOpen(true);
                    setDocTpc(e.target.value);
                    let docProperties = docsList.filter(item => item.id == e.target.value);
                    setDrpData(docProperties[0]);
                }
                setState({ ...state });
            }
            else {
                state[name] = e.target.value;
            }
        }
        setState({ ...state });
        handleValidate(e.target);
        // }
    };

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        if (event.target.name == 'valid_from') {
            setState({
                ...state,
                [name]: moment(date).format(dateFormat()),
                valid_till: ''
            }, handleValidate(event.target))
        } else {
            setState({
                ...state,
                [name]: moment(date).format(dateFormat()),
            }, handleValidate(event.target))
        }

    }

    const handleValidateDoc = (e, index) => {
        let input = e;
        let error = docError.length > 0 ? (docError ? docError[index] : docError) : docError;
        for (var k = 0; k <= index; k++) {
            docError.push({});
        }
        let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
        switch (input.name || input.tagName) {
            case "new_document_id":
                error.new_document_id = drpData.upload_mandatory ? validate_emptyField(value.new_document_id) : '';
                break;
            // case "document_name":
            //   error.document_name = validate_emptyField(input.value);
            //   break;
            default:
                break;
        }
        setDocError(s1);
    };

    const uploadDocs = (value, index) => {
        const formData = new FormData();
        formData.append('files', value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("personal-document",formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let deleteArr = deletefiles;
                    state.documents[0].document_name = value.target.files[0].name;
                    state.documents[0].id = state.documents[index].id;
                    state.documents[0].new_document_id = response.data.data.id;
                    setDeletefiles([...deleteArr])
                    setState({ ...state }, docValidations(value));
                }
                else {
                    addErrorMsg(response.data.message);
                }
            })
    }



    const handleValidate = (e) => {
        let input = e;
        switch (input.name || input.targetName) {
            case 'document_type_id':
                error.document_type_id = validate_emptyField(input.value);
                break;
            case 'document_number':
                error.document_number = validate_emptyField(input.value);
                break;
            case 'status':
                error.status = validate_emptyField(input.value);
                break;
            case 'new_document_id':
                error.new_document_id = validate_emptyField(input.value);
                break;
            case "valid_from":
                error["valid_from"] = drpData.valid_from_mandatory ? validate_emptyField(input.value) : '';
                break;
            case "valid_till":
                error["valid_till"] = drpData.valid_to_mandatory ? validate_emptyField(input.value) : '';
                break;
            case "status":
                error["status"] = drpData.status_mandatory ? validate_emptyField(input.value) : '';
                break;
            default:
                break;
        }
        setError({ ...error })
    }

    const validateAll = (item) => {
        const { document_type_id, document_number, status, valid_from, valid_till } = item === undefined ? state : item;
        let errors = {};
        errors.document_type_id = validate_emptyField(document_type_id);
        errors.document_number = drpData.number_mandatory ? validate_emptyField(document_number) : ''
        errors.valid_from = drpData.valid_from_mandatory ? validate_emptyField(valid_from) : '';
        errors.valid_till = (drpData.valid_to_display && drpData.valid_to_mandatory) ? validate_emptyField(valid_till) : '';
        errors.status = drpData.status_mandatory ? validate_emptyField(status) : '';// eslint-disable-next-line
        state.documents.map((value) => {
            errors.new_document_id = value.id !== '' ? '' : validate_emptyField(value.new_document_id);
        });
        return errors;
    }

    const docValidations = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        state.documents.map((value) => {
            errors = {};
            errors.new_document_id = value.id !== '' ? '' : validate_emptyField(value.new_document_id);
            err.push(errors);
            setDocError(err);
        });
        return err;
    };

    const handleSubmit = (param) => {
        // setEditForm(true);
        let errors = validateAll();
        let documentErrors = docValidations();
        if (isValid(errors) && isValidMulti(documentErrors)) {
            console.log(state, "state");
            state['request_id'] = LocalStorage.uid();
            state['employee_id'] = emp_id;
            if (param != undefined && param != "" && param != null && editForm == true) {
                OnBoardApi.documentUpdate(state, param ? param : '', LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Personal Documents of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Updated Successfully`);
                        getPersonalIndex(emp_id);
                        setEditAccIcon(2);
                        setExpanded(!expanded);
                        setEdit(false);
                        setAddNew(false)
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            } else {
                OnBoardApi.documentsStore(state, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Personal Documents of ${LocalStorage.getFullName() ? LocalStorage.getFullName() : ''} Added Successfully`);
                        setEditForm(true);
                        getPersonalIndex(emp_id);
                        setEditAccIcon(2)
                        setAddNew(false)
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            }
        } else {
            let s1 = { error }
            s1 = errors;
            setError(s1);
            // let s2 = { docError }
            // s2 = documentErrors
            // setDocError(s2);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const back = () => {
        setValue(value - 1);
        setDocStepper(docStepper - 1);
        setEditForm(true);
    }

    const docs = () => {
        CommonApi.personalDocsList(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setDocslist(res.data.data);
            }
        })
    }

    const getPersonalIndex = (id) => {
        OnBoardApi.documentIndex(LocalStorage.uid(), id ? id : '', LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setDocumentList(res.data.data);
                if (res.data.data.length > 0) {
                    setAddNew(false)
                }
            }
        })
    }

    const newChanges = (e) => {
        setAddExpand(!addExpand)
        setExpanded(false);
        setEdit(false);
        setState({
            id: '',
            document_type_id: '',
            valid_from: '',
            valid_till: '',
            document_number: '',
            status: '',
            documents: [
                {
                    document_name: '',
                    id: '',
                    description: '',
                    new_document_id: ''
                }
            ]
        })
        e.stopPropagation();
    }

    return (
        <Grid item lg={12}>
            {
                addNew ?
                    <Card sx={{ padding: '10px !important', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                        <CardHeader sx={{ padding: '15px 0px 0px 23px !important' }} title={
                            <Text largeBlack>Personal Documents <TooltipIndicator
                                title={<Text smallWhite>Add your Identification Documents i.e,<br />Driver's License,State ID Card etc</Text>}
                                placement='right-start'
                            >
                                <img src={info} alt="info" style={{ height: '20px !important', width: '20px !important', marginBottom: '-4px', paddingLeft: '8px' }} />
                            </TooltipIndicator></Text>
                        } />
                        <CardContent sx={{ padding: '10px 0px 20px 20px !important' }}
                        >
                            {
                                drpData &&
                                <Grid container lg={12}>
                                    <PersonalDocsForm
                                        state={state}
                                        setState={setState}
                                        docError={docError}
                                        error={error}
                                        setError={setError}
                                        changeHandler={changeHandler}
                                        dateChange={dateChange}
                                        handleSubmit={handleSubmit}
                                        uploadDocs={uploadDocs}
                                        editForm={editForm}
                                        edit={true}
                                        docsList={docsList}
                                        drpData={drpData}
                                        addExpand={addExpand}
                                        setAddExpand={setAddExpand}
                                        action='new'
                                    />
                                </Grid>
                            }
                        </CardContent>
                    </Card>
                    :
                    <Box sx={{ cursor: addExpand ? 'not-allowed' : 'pointer', width: '100% !important' }}>
                        <CustomAccordion
                            icon={1}
                            expanded={addExpand}
                            handlechangeaccordion={(e) => { newChanges(e) }}
                            AccordionHeader={<Text headerBlack>Personal Documents</Text>}>
                            {
                                !edit &&
                                <Grid container lg={12} spacing={2} p={'10px 0px 10px 25px !important'}>
                                    <PersonalDocsForm
                                        state={state}
                                        setState={setState}
                                        docError={docError}
                                        error={error}
                                        setError={setError}
                                        changeHandler={changeHandler}
                                        dateChange={dateChange}
                                        handleSubmit={handleSubmit}
                                        uploadDocs={uploadDocs}
                                        editForm={editForm}
                                        edit={true}
                                        docsList={docsList}
                                        drpData={drpData}
                                        addExpand={addExpand}
                                        setAddExpand={setAddExpand}
                                        action='addNew'
                                    />
                                </Grid>
                            }
                        </CustomAccordion>
                        {
                            DocumentsList.map((item, key) => (
                                <Box p={'20px 0px'} key={key}>
                                    <CustomAccordion
                                        icon={expanded === `panel${key}` ? editAccIcon == '' : editAccIcon}
                                        handlechangeaccordion={handleChangeAccordion(`panel${key}`, key, item)}
                                        expanded={expanded === `panel${key}`}
                                        AccordionHeader={
                                            <Box justifyContent='space-between' alignItems='center' display='flex' flexDirection='row' width='100% !important' p={'0px 10px'}>
                                                <Box>
                                                    <Text headerBlack>{item.document_type_name}</Text>
                                                </Box>
                                                <Box textAlign='end'>
                                                    {(expanded === `panel${key}` && editAccIcon == 2) && <img src={editIcon} alt='editIcon' onClick={(e) => handleEditIcon(e, key, `panel${key}`)} />}
                                                </Box>
                                            </Box>
                                        }
                                    >
                                        {
                                            expanded === `panel${key}` &&
                                            <Grid container lg={12} spacing={2} p={'10px 0px 10px 25px !important'}>
                                                <PersonalDocsForm
                                                    state={state}
                                                    data={item}
                                                    index={key}
                                                    setState={setState}
                                                    docError={docError}
                                                    error={edit ? error : validateAll(item)}
                                                    setError={setError}
                                                    changeHandler={changeHandler}
                                                    dateChange={dateChange}
                                                    handleSubmit={handleSubmit}
                                                    uploadDocs={uploadDocs}
                                                    editForm={editForm}
                                                    docsList={docsList}
                                                    drpData={drpData}
                                                    addExpand={addExpand}
                                                    setAddExpand={setAddExpand}
                                                    action='view'
                                                    setExpanded={setExpanded}
                                                    expanded={expanded}
                                                    edit={edit}
                                                    setEdit={setEdit}
                                                />
                                            </Grid>
                                        }
                                    </CustomAccordion>
                                </Box>
                            ))
                        }
                    </Box>
            }
            <Grid item container m={'25px 0px 10px 0px'}>
                <Grid item lg={6}>
                    <Button blackCancel onClick={back}>Back</Button>
                </Grid>
                <Grid item lg={6} textAlign='end'>
                    {
                        editForm ?
                            <>
                                {
                                    (edit || addExpand) ?
                                        <Button disable>Next Step</Button> :
                                        <Button saveNcontinue onClick={() => setMainStep(mainStep + 1)}>save & Continue</Button> 
                                }
                            </> :
                            <Button brownMnSave onClick={handleSubmit}>Save</Button>
                    }
                </Grid>
            </Grid>
            {
                alertOpen && (
                    <ReusablePopup
                        white iconHide
                        title={<Text white>Are You Sure Want To Change Option</Text>}
                        openPopup={alertOpen}
                        setOpenPopup={setAlertOpen}
                    >
                        <Box p={2} textAlign="center">
                            <Text headerText>Are you sure? Entered details will be LOST</Text>
                            <Box pt={2}>
                                <Stack direction={"row"} spacing={2} justifyContent="center" pt={3}>
                                    <Button brownMnSave onClick={() => handleClear()}>
                                        Yes
                                    </Button>
                                    <Button blackCancel onClick={() => { setAlertOpen(false) }}>
                                        No
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </ReusablePopup>
                )
            }
        </Grid>
    )
}

export default PersonalDocuments