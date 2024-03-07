import React, { useState } from "react";
import { Box, Typography, Grid, Checkbox, Stack } from "@mui/material";
import Stepper from './Stepper';
import successImg from '../../../assets/svg/succesIcon.svg';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Input from "../../../components/input/Input";
import { useNavigate } from "react-router-dom";
import Text from "../../../components/customText/Text";
import LocalStorage from "../../../utils/LocalStorage";
import SearchSelect from "../../../components/selectField/SearchSelect";
import Button from "../../../components/customButton/Button";
import OnboardStyles from "./onBoard/OnboardStyles";
import ReusablePopup from "../../../components/reuablePopup/ReusablePopup";
import info from '../../../assets/svg/orangeInfo.svg';
import { isValid, validate_charWithSpace, validate_emptyField, validate_usContact, validates_emailId } from "../../../components/Validation";
import { addErrorMsg, addWarningMsg, dateFormat } from "../../../utils/utils";
import Date from "../../../components/datePicker/Date";
import moment from "moment";
import FileInput from "../../../components/muiFileInput/FileInput";
import CommonApi from "../../../apis/CommonApi";
import OnBoardApi from "../../../apis/admin/employees/OnBoardApi";
import { domain } from '../../../config/Domain'
import LoaderIcon from '../../../assets/svg/sandtimer.svg';
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
                    <Typography>{children}</Typography>
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

// function a11yProps(index) {
//     return {
//         id: `full-width-tab-${index}`,
//         'aria-controls': `full-width-tabpanel-${index}`,
//     };
// }

export default function AddEmployee() {
    const classes = OnboardStyles();
    const genderList = require('../../../utils/jsons/Gender.json');
    const navigate = useNavigate();
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [error, setError] = useState({});

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        subdomain_name: domain,
        first_name: '',
        middle_name: '',
        last_name: '',
        email_id: '',
        gender: '',
        contact_number: '',
        dob: '',
        offer_letter_id: '',
        docName: '',
        upload_documents: [
            {
                name: '',
                slug: '',
                is_mandatory: ''
            }
        ]
    })
    // eslint-disable-next-line
    const changeHandler = (e, index) => {
        if (e.target.name == 'offer_letter_id') {
            setState({
                ...state,
                [e.target.name]: e.target.files[0].name
            })
        } else if (e.target.name == 'contact_number') {
            convertFormat(e)
        } else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
        handleValidate(e);
    }

    const uploadDocs = (value) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
            const formData = new FormData();
            formData.append("files", value.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("personal-document",formData, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        state.offer_letter_id = response.data.data.id
                        state.docName = value.target.files[0].name
                        setState({ ...state }, handleValidate(value))
                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
        }
    };

    const deleteDoc = (args) => {
        state.offer_letter_id = ''
        state.docName = ''
        setState({ ...state })
    }

    const convertFormat = (e, index) => {
        const value = e.target.value;
        const name = e.target.name
        const input = value.replace(/\D/g, '').substring(0, 10);
        // Divide numbers in 3 parts :"(123) 456-7890" 
        const first = name == 'contact_number' ? input.substring(0, 3) : input.substring(0, 3);
        const middle = name == 'contact_number' ? input.substring(3, 6) : input.substring(3, 5);
        const last = name == 'contact_number' ? input.substring(6, 10) : input.substring(5, 9);

        if (input.length > (name == 'contact_number' ? 6 : 5)) {
            state[e.target.name] = `${first}-${middle}-${last}`
            setState(state, handleValidate(e))
        }
        else if (input.length > 3) {
            state[e.target.name] = `${first}-${middle}`
            setState(state, handleValidate(e))
        }
        else if (input.length >= 0) {
            state[e.target.name] = input
            setState(state, handleValidate(e))
        }
    }

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setState({
            ...state,
            [name]: moment(date).format(dateFormat())
        }, handleValidate(event))
    }

    const handleValidate = (e) => {
        let input = e.target
        switch (input.name || input.tagName) {
            case 'first_name':
                error.first_name = validate_charWithSpace(input.value)
                break
            case 'last_name':
                error.last_name = validate_charWithSpace(input.value)
                break
            case 'email_id':
                error.email_id = validates_emailId(input.value)
                break
            case 'dob':
                error.dob = validate_emptyField(input.value)
                break
            case 'gender':
                error.gender = validate_emptyField(input.value)
                break
            case 'offer_letter_id':
                error.offer_letter_id = validate_emptyField(input.value)
                break
            case 'contact_number':
                error.contact_number = validate_usContact(input.value)
                break
            default:
                break
        }
        setError({ ...error });
    }

    const validateAll = () => {
        const { first_name, last_name, email_id, contact_number, dob, gender, offer_letter_id } = state
        let errors = {}
        errors.first_name = validate_charWithSpace(first_name);
        errors.last_name = validate_charWithSpace(last_name);
        errors.email_id = validates_emailId(email_id);
        errors.contact_number = validate_usContact(contact_number);
        errors.dob = validate_emptyField(dob);
        errors.gender = validate_emptyField(gender);
        errors.offer_letter_id = validate_emptyField(offer_letter_id);
        return errors;
    }

    const getDocsIndex = () => {
        setLoading(true)
        OnBoardApi.selfOnboarddocsList().then((res) => {
            if (res.data.statusCode === 1003) {                
                setTimeout(() => {
                    state['upload_documents'] = res.data.data
                    setState({...state});
                    setLoading(false);
                }, 800)
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleSubmit = () => {
        let errors = validateAll();
        if (value == 0) {
            if (isValid(errors)) {
                setValue(value + 1);
                getDocsIndex();
            }
            else {
                let s1 = { error };
                s1 = errors
                setError(s1);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        }
        else if (value == 1) {
            OnBoardApi.selfOnboardStore(state).then((res) => {
                if (res.data.statusCode === 1003) {
                    setSuccess(true);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        }
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const goToHome = () => {
        setSuccess(false);
        navigate('/employees');
    }

    return (
        <Box>
            <Box>
                <Grid container justifyContent='center' >
                    <Grid item container lg={7} p={'15px 0px'} justifyContent='center' position='fixed' zIndex='1000' sx={{ background: '#FFFFFF' }}>
                        <Grid item lg={6} textAlign='center' p={'10px 0px !important'}>
                            <Stepper activeStepper={value} />
                        </Grid>
                    </Grid>
                </Grid>
                <Box sx={{ width: "100%", padding: "90px 10px 10px 10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ width: "45%", borderRadius: "12px", boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05)", padding: '0px 10px' }}>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <Box my={1}>
                                    <Box mb={2}>
                                        <Typography sx={{ fontSize: "18px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                            Basic Details
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2} columnSpacing={3} mb={3}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'first_name',
                                                    value: state.first_name
                                                }}
                                                handleChange={changeHandler}
                                                clientInput
                                                labelText={<Text largeLabel>First Name</Text>}
                                            />
                                            {
                                                error.first_name &&
                                                <Text red>{error.first_name ? error.first_name : ''}</Text>
                                            }
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'middle_name',
                                                    value: state.middle_name
                                                }}
                                                handleChange={changeHandler}
                                                clientInput
                                                labelText={<Text largeLabel>Middle Name<span className={classes.optional}>(optional)</span></Text>}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'last_name',
                                                    value: state.last_name
                                                }}
                                                handleChange={changeHandler}
                                                clientInput
                                                labelText={<Text largeLabel>Last Name</Text>}
                                            />
                                            {
                                                error.last_name &&
                                                <Text red>{error.last_name ? error.last_name : ''}</Text>
                                            }
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} columnSpacing={3}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'email_id',
                                                    value: state.email_id
                                                }}
                                                handleChange={changeHandler}
                                                clientInput
                                                labelText={<Text largeLabel>Email ID</Text>}
                                            />
                                            {
                                                error.email_id &&
                                                <Text red>{error.email_id ? error.email_id : ''}</Text>
                                            }
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'contact_number',
                                                    value: state.contact_number,
                                                    inputProps: { maxlength: 12 }
                                                }}
                                                handleChange={changeHandler}
                                                clientInput
                                                labelText={<Text largeLabel>Contact Number</Text>}
                                            />
                                            {
                                                error.contact_number &&
                                                <Text red>{error.contact_number ? error.contact_number : ''}</Text>
                                            }
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box my={1} >
                                                <Date
                                                    labelText={<Text largeLabel>Date of Birth</Text>}
                                                    name='dob'
                                                    value={state.dob}
                                                    onChange={(value => dateChange(value, 'dob'))}
                                                    height='54px'
                                                    maxDate={moment().subtract(18, "years")}
                                                />
                                            </Box>
                                            {
                                                error.dob &&
                                                <Text red>{error.dob ? error.dob : ''}</Text>
                                            }
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box pt={'10px'}>
                                                <SearchSelect
                                                    name='gender'
                                                    value={state.gender}
                                                    onChange={changeHandler}
                                                    options={genderList}
                                                    labelText={<Text largeLabel>Gender</Text>}
                                                />
                                                {
                                                    error.gender &&
                                                    <Text red>{error.gender ? error.gender : ''}</Text>
                                                }
                                            </Box>
                                        </Grid>
                                        <Grid item lg={12}>
                                            <FileInput
                                                name='offer_letter_id'
                                                FileName={state ? state.docName : ''}
                                                handleChange={(e) => uploadDocs(e)}
                                                isDisabled={false}
                                                handleDelete={() => deleteDoc()}
                                                actionState={state.docName ? 1 : ''}
                                                label={<Text largeLabel>Upload Offer Letter</Text>}
                                            />
                                            {
                                                error.offer_letter_id &&
                                                <Text red>{error.offer_letter_id ? error.offer_letter_id : ''}</Text>
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <Box my={1}>
                                    <Box mb={2}>
                                        <Typography sx={{ fontSize: "18px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                            Documents
                                        </Typography>
                                    </Box>
                                    <Grid item lg={12}>
                                        <Box display='flex' flexDirection='row' sx={{
                                            background: '#F59E0B33 !important',
                                            height: '58px',
                                            borderRadius: '8px', gap: 2, alignItems: 'center', paddingLeft: '18px'
                                        }}>
                                            <img src={info} alt="info" style={{ height: '24px', width: '24px' }} />
                                            <Text mediumOrange>Please Mark the required documents that employees need to submit.</Text>
                                        </Box>
                                    </Grid>
                                    <Grid container spacing={2} columnSpacing={3} mt={2} mb={3}>
                                        {
                                            loading ?
                                                <Box className={classes.ViewContainer}>
                                                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                                    </Stack>
                                                </Box> :
                                                state.upload_documents.length > 0 && state.upload_documents.map((item) => (
                                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                                        <Box className={item.is_mandatory == true ? classes.checkBoxbg : classes.checkBox} pl={1} alignItems='center'>
                                                            <Checkbox size='medium' disabled={item.is_mandatory == true ? true : false} defaultChecked={item.is_mandatory == true ? true : false} name={item.name} value={item.name} className={classes.checkboxColor} />
                                                            <Text largeLabel>{item.name}</Text>
                                                        </Box>
                                                    </Grid>
                                                ))
                                        }
                                    </Grid>
                                </Box>
                            </TabPanel>
                        </SwipeableViews>
                        {/* </Box> */}
                    </Box>

                </Box>

                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ width: "45%", display: "flex", justifyContent: "end", alignItems: "center", padding: "20px 10px", gap: 2 }}>
                        <Button blackCancel onClick={() => setValue(0)}>Cancel</Button>
                        {
                            value == 1 ?
                                <Button brownMnSave onClick={handleSubmit}>Send Invite</Button> :
                                <Button brownMnSave onClick={handleSubmit}>Next</Button>
                        }
                    </Box>
                </Box>
                {
                    success &&
                    <ReusablePopup openPopup={success} setOpenPopup={setSuccess} white fixedWidth iconHide>
                        <Box textAlign='center' justifyContent='center'>
                            <img src={successImg} alt='success' style={{ height: '150px', width: '150px', marginBottom: '5px' }} />
                            <Text largeGreen>Congratulations</Text>
                            <Text mediumBlack sx={{ marginTop: '8px !important' }}>Invite Link Successfully Sent to <b>{state.first_name}</b></Text>
                            <Button brownMnSave sx={{ margin: '20px 0px 0px 0px !important' }} onClick={goToHome}>Go To Home</Button>
                        </Box>
                    </ReusablePopup>
                }
            </Box >
        </Box >
    )
};
