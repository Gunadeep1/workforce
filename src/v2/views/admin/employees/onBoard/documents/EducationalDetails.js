import React from 'react'
import { Box, Card, CardContent, CardHeader, Grid } from '@mui/material'
import Text from '../../../../../components/customText/Text'
import { useState } from 'react'
import LocalStorage from '../../../../../utils/LocalStorage'
import CommonApi from '../../../../../apis/CommonApi'
import { useEffect } from 'react'
import Button from '../../../../../components/customButton/Button'
import PropTypes from 'prop-types';
import { isValid, validate_emptyField } from '../../../../../components/Validation'
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../../utils/utils'
import CustomAccordion from '../../../../../components/accordion/CustomAccordion'
import EducationForm from './EducationForm'
import OnBoardApi from '../../../../../apis/admin/employees/OnBoardApi'
import ReusablePopup from '../../../../../components/reuablePopup/ReusablePopup'
import { useNavigate } from 'react-router-dom';
import draft from '../../../../../assets/employee/savedraft.svg';
import editIcon from '../../../../../assets/svg/square-edit.svg';
import moment from 'moment'

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

function EducationalDetails({ value, setValue, docStepper, setDocStepper }) {
    const navigate = useNavigate();
    const emp_id = LocalStorage.getEmployeeId();
    const [open, setOpen] = useState(false); // eslint-disable-next-line
    const [addNew, setAddNew] = useState(true)
    const [edit, setEdit] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [education, setEducation] = useState({
        education_level_id: '',
        id: '',
        field_of_study: '',
        state_id: '',
        country_id: '',
        university_name: '',
        start_date: '',
        end_date: '',
        documents: [
            {
                name: '',
                id: '',
                description: '',
                new_document_id: ''
            }
        ]
    })

    const [edc, setEdc] = useState([]); // eslint-disable-next-line
    const [error, setError] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [editForm, setEditForm] = useState(true);
    const [deletefiles, setDeletefiles] = useState([]);
    const [educationLists, setEducationList] = useState([]);
    const [addExpand, setAddExpand] = useState(false); // eslint-disable-next-line
    const [editAccIcon, setEditAccIcon] = useState(2);// eslint-disable-next-line

    useEffect(() => {
        educationList();
        countriesList();
        if (emp_id) {
            educIndexApi(emp_id)
        }
        // eslint-disable-next-line
    }, [])

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        if (event.target.name == 'start_date') {
            setEducation({
                ...education,
                [name]: moment(date).format(dateFormat()),
                end_date: ''
            }, handleValidate(event))
        } else {
            setEducation({
                ...education,
                [name]: moment(date).format(dateFormat())

            }, handleValidate(event))
        }
    }

    const changeHandler = (e, index, args) => {
        if (e.target.name == 'country_id') {
            statesList(e.target.value);
            education[e.target.name] = e.target.value
            education.state = ''
            setEducation(education);
        }
        else if (e.target.name == 'new_document_id') {
            uploadDocs(e, index)
        }
        else {
            setEducation({
                ...education,
                [e.target.name]: e.target.value
            })
        }
        handleValidate(e);
    }

    const uploadDocs = (value, index) => {
        const formData = new FormData();
        formData.append('files', value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("education-document",formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let deleteArr = deletefiles;
                    education.documents[0].name = value.target.files[0].name;
                    education.documents[0].id = education.documents[index].id;
                    education.documents[0].new_document_id = response.data.data.id;
                    setDeletefiles([...deleteArr])
                    setEducation({ ...education });
                    handleValidate(value.target.value)                    
                }
                else {
                    addErrorMsg(response.data.message);
                }
            })
    }

    const handleValidate = (e) => {
        let input = e.target;
        switch (input.name || input.targetName) {
            case 'education_level_id':
                error.education_level_id = validate_emptyField(input.value);
                break;
            case 'field_of_study':
                error.field_of_study = validate_emptyField(input.value);
                break;
            case 'country_id':
                error.country_id = validate_emptyField(input.value);
                break;
            case 'state_id':
                error.state_id = validate_emptyField(input.value);
                break;
            case 'university_name':
                error.university_name = validate_emptyField(input.value);
                break;
            case 'start_date':
                error.start_date = validate_emptyField(input.value);
                break;
            case 'end_date':
                error.end_date = validate_emptyField(input.value);
                break;
            case 'new_document_id':
                error.new_document_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError({ ...error })
    }

    const validateAll = (item) => {
        const { education_level_id, field_of_study, university_name, country_id, state_id, start_date, end_date } = item === undefined ? education : item;
        let errors = {};
        errors.education_level_id = validate_emptyField(education_level_id);
        errors.field_of_study = validate_emptyField(field_of_study);
        errors.university_name = validate_emptyField(university_name);
        errors.start_date = validate_emptyField(start_date);
        errors.end_date = validate_emptyField(end_date);
        errors.country_id = validate_emptyField(country_id);
        errors.state_id = validate_emptyField(state_id);
        return errors;
    }


    const handleSubmit = (param) => {
        // setEditForm(true);
        let errors = validateAll();
        if (isValid(errors)) {
            education['request_id'] = LocalStorage.uid();
            education['employee_id'] = emp_id;
            if (param != undefined && param != "" && param != null && editForm == true && educationLists.length > 0) {
                OnBoardApi.educationUpdate(education, param ? param : '', LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Education Details Updated Successfully`);
                        educIndexApi(emp_id);
                        setExpanded(!expanded);
                        setEditAccIcon(2);
                        setEdit(false);
                        setAddNew(false)
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            } else {
                OnBoardApi.educationStore(education, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg(`Education Details Added Successfully`);
                        educIndexApi(emp_id);
                        setEditForm(true);
                        setAddNew(false);
                        setAddExpand(false);
                        // setExpanded(!expanded);
                        setEditAccIcon(2);
                        setEducation({
                            education_level_id: '',
                            id: '',
                            field_of_study: '',
                            state_id: '',
                            country_id: '',
                            university_name: '',
                            start_date: '',
                            end_date: '',
                            documents: [
                                {
                                    name: '',
                                    id: '',
                                    description: '',
                                    new_document_id: ''
                                }
                            ]
                        })
                    } else {
                        addErrorMsg(res.data.message);
                    }
                })
            }
        } else {
            let s1 = { error }
            s1 = errors;
            setError(s1);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const nextStep = () => {
        setValue(value + 1);
        setDocStepper(docStepper + 1);

    }

    const back = () => {
        setValue(value - 1);
        setDocStepper(docStepper - 1);
    }


    const educationList = () => {
        CommonApi.educationLevel(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setEdc(res.data.data);
            }
        })
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
    const educIndexApi = (id) => {
        OnBoardApi.educationIndex(LocalStorage.uid(), id ? id : '', LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setEducationList(res.data.data);
                if (res.data.data.length > 0) {
                    setAddNew(false)
                }
            }
        })
    }

    const handleChangeAccordion = (panel, index, item) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setAddExpand(false);
        statesList(educationLists[index].country_id);
        setError(validateAll(item))
    };

    const handleEditIcon = (e, index, name) => {
        setEdit(true);
        // setExpanded(name);
        setAddExpand(false);
        statesList(educationLists[index].country_id)
        e.stopPropagation();
    }

    const newChanges = (e) => {
        setAddExpand(!addExpand)
        setExpanded(false);
        setEdit(false);
        setEducation({
            education_level_id: '',
            id: '',
            field_of_study: '',
            state_id: '',
            country_id: '',
            university_name: '',
            start_date: '',
            end_date: '',
            documents: [
                {
                    name: '',
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
                            <Text largeBlack>Education</Text>
                        } />
                        <CardContent sx={{ padding: '10px 0px 20px 20px !important' }}
                        >
                            <Grid container lg={12}>
                                <EducationForm
                                    education={education}
                                    setEducation={setEducation}
                                    edc={edc}
                                    error={error}
                                    setError={setError}
                                    changeHandler={changeHandler}
                                    dateChange={dateChange}
                                    countries={countries}
                                    states={states}
                                    handleSubmit={handleSubmit}
                                    editForm={editForm}
                                    edit={true}
                                    setEdit={setEdit}
                                    setExpanded={setExpanded}
                                    expanded={expanded}
                                    action='new'
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                    :
                    <Box sx={{ cursor: addExpand ? 'not-allowed ' : 'pointer', width: '100% !important' }}>
                        <CustomAccordion
                            icon={1}
                            expanded={addExpand}
                            handlechangeaccordion={(e) => { newChanges(e) }}
                            AccordionHeader={<Text headerBlack>Education</Text>}>
                            {
                                !edit &&
                                <Grid container lg={12} spacing={2} p={'10px 0px 10px 25px !important'}>
                                    <EducationForm
                                        education={education}
                                        setEducation={setEducation}
                                        edc={edc}
                                        error={error}
                                        setError={setError}
                                        changeHandler={changeHandler}
                                        dateChange={dateChange}
                                        countries={countries}
                                        states={states}
                                        handleSubmit={handleSubmit}
                                        editForm={editForm}
                                        edit={true}
                                        action='addNew'
                                        addExpand={addExpand}
                                        setAddExpand={setAddExpand}
                                    />
                                </Grid>
                            }
                        </CustomAccordion>
                        {
                            educationLists.map((item, key) => (
                                <Box p={'20px 0px'} key={key}>
                                    <CustomAccordion
                                        icon={expanded === `panel${key}` ? editAccIcon == '' : editAccIcon}
                                        handlechangeaccordion={handleChangeAccordion(`panel${key}`, key, item)}
                                        expanded={expanded === `panel${key}`}
                                        AccordionHeader={
                                            <Box justifyContent='space-between' alignItems='center' display='flex' flexDirection='row' width='100% !important' p={'0px 10px'}>
                                                <Box>
                                                    <Text headerBlack>{item.education_level}</Text>
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
                                                <EducationForm
                                                    education={education}
                                                    data={item}
                                                    index={key}
                                                    setEducation={setEducation}
                                                    edc={edc}
                                                    error={edit ? error : validateAll(item)}
                                                    setError={setError}
                                                    changeHandler={changeHandler}
                                                    dateChange={dateChange}
                                                    countries={countries}
                                                    states={states}
                                                    handleSubmit={handleSubmit}
                                                    editForm={editForm}
                                                    action='view'
                                                    edit={edit}
                                                    setEdit={setEdit}
                                                    setExpanded={setExpanded}
                                                    expanded={expanded}
                                                    addExpand={addExpand}
                                                    setAddExpand={setAddExpand}
                                                // setEditAccIcon={setEditAccIcon}
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
                    {/* {
                        edit ?
                            <Button disable sx={{ marginRight: '15px' }}>Save as Draft</Button> :
                            <Button saveAsDraft sx={{ marginRight: '15px' }} onClick={() => setOpen(true)}>Save as Draft</Button>
                    } */}
                    {
                        addNew ?
                            <Button brownMnSave onClick={handleSubmit}>Save</Button> :
                            editForm ?
                                <>
                                    {
                                        (edit || addExpand) ?
                                            <Button disable>Next Step</Button> :
                                            <Button saveNcontinue onClick={nextStep}>Save & Continue</Button>
                                    }
                                </>
                                :
                                <Button brownMnSave onClick={handleSubmit}>Save</Button>
                    }
                </Grid>
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

export default EducationalDetails