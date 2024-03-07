import { Box, Grid, Stack, Step, Stepper } from '@mui/material'
import React, { useState } from 'react'
import { BrownMnColorlibStepLabel, BrownMnCustomStepIconSignup, BrownMnCustomisedConnector } from '../../theme'
import Text from '../../components/customText/Text';
import CustomButton from '../../components/customButton/Button';
import NewSignUpStyles from './NewSignUpStyles';
import Input from '../../components/input/Input';
import CustomSelect from '../../components/customSelect/CustomSelect';
import { styled } from "@mui/material/styles";
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import CommonApi from '../../apis/CommonApi'
import LocalStorage from '../../utils/LocalStorage'
import { isValid, validates_emailId, validate_charWithSpace, validate_usContact, validate_emptyField, validates_Integer, empty_name, validate_Extension } from '../../components/Validation';
import { addErrorMsg, addSuccessMsg } from '../../utils/utils';

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme, disabled }) => `
    width: 415px;
    font-family: 'Nunito', Nunito Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
   
    border: 1px solid ${disabled ? 'transparent' : '#C7CCD3'};
    &:focus-visible {
        outline: 0;
      }
  `,
);

const NewSignUp = () => {

    const classes = NewSignUpStyles()
    const [mainStep, setMainStep] = useState(0);
    const [error, setError] = useState({});
    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        organization_name: "",
        date_format: "",
        currency_symbol: "",
        email_id: "",
        organization_phone_number: "",
        organization_fax_number: "",
        website_url: '',
        payable_to: '',
        additional_information: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        personal_email_id: "",
        contact_number: "",
        mobile_number: "",
        ext: "",
    });

    const currency = [
        { id: '$', value: '$' },
        { id: '₹', value: '₹' },
        { id: '€', value: '€' },
        { id: '¥', value: '¥' },
    ];

    const options = [
        { id: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
        { id: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
        { id: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
    ];

    const stepsList = ["Organization Details", "Personal Details"]

    const handleNext = () => {
        let errors = organizationValidations()
        if (isValid(errors)) {
            setMainStep(mainStep + 1)
        }
        else {
            setError(errors)
            addErrorMsg('Please fill all the required details')
        }
    }

    const handleCancel = () => {
        setMainStep(0)
        // setIsEditable(true)
        // getList();
        // setError({});
    };

    const changeHandler = (e) => {
        if (
            e.target.name == "organization_phone_number" ||
            e.target.name == "contact_number" ||
            e.target.name == "mobile_number"
        ) {
            convertFormat(e);
        }
        else {
            setState({ ...state, [e.target.name]: e.target.value });
            handleValidations(e);
        }
    }

    const convertFormat = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const input = value.replace(/\D/g, "").substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890"
        const first =
            name == "contact_number" || name == "mobile_number" || name == "organization_phone_number"
                ? input.substring(0, 3)
                : input.substring(0, 3);
        const middle =
            name == "contact_number" || name == "mobile_number" || name == "organization_phone_number"
                ? input.substring(3, 6)
                : input.substring(3, 5);
        const last =
            name == "contact_number" || name == "mobile_number" || name == "organization_phone_number"
                ? input.substring(6, 10)
                : input.substring(5, 9);

        if (
            input.length >
            (name == "contact_number" || name == "mobile_number" || name == "organization_phone_number" ? 6 : 5)
        ) {
            setState(
                {
                    ...state,
                    [e.target.name]: `${first}-${middle}-${last}`,
                },
                handleValidations(e)
            );
        } else if (input.length > 3) {
            setState(
                {
                    ...state,
                    [e.target.name]: `${first}-${middle}`,
                },
                handleValidations(e)
            );
        } else if (input.length >= 0) {
            setState(
                {
                    ...state,
                    [e.target.name]: input,
                },
                handleValidations(e)
            );
        }
    };

    const handleValidations = (e) => {
        let input = e.target
        let err = error
        switch (input.name || input.tagName) {
            case 'organization_name':
                err.organization_name = validate_charWithSpace(input.value)
                break
            case 'date_format':
                err.date_format = validate_emptyField(input.value)
                break
            case 'currency_symbol':
                err.currency_symbol = validate_emptyField(input.value)
                break
            case 'email_id':
                err.email_id = validates_emailId(input.value)
                break
            case 'organization_phone_number':
                err.organization_phone_number = validate_usContact(input.value)
                break
            case 'organization_fax_number':
                err.organization_fax_number = validates_Integer(input.value)
                break
            case 'website_url':
                err.website_url = validate_emptyField(input.value)
                break
            case 'payable_to':
                err.payable_to = validate_emptyField(input.value)
                break
            case 'additional_information':
                err.additional_information = validate_emptyField(input.value)
                break
            case 'first_name':
                err.first_name = validate_charWithSpace(input.value)
                break
            case 'middle_name':
                err.middle_name = empty_name(input.value)
                break
            case 'last_name':
                err.last_name = validate_charWithSpace(input.value)
                break
            case 'personal_email_id':
                err.personal_email_id = validates_emailId(input.value)
                break
            case 'contact_number':
                err.contact_number = validate_usContact(input.value)
                break
            case 'mobile_number':
                err.mobile_number = validate_usContact(input.value)
                break
            case 'ext':
                err.ext = validate_Extension(input.value)
                break
            default:
                break
        }
        setError({ ...err })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("***************")
        let errors = personalValidations();
        console.log(errors,"eroors")
        if (isValid(errors)) {
            CommonApi.tenantStoreSignUp(state).then((response) => {
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(`OTP sent to your mail successfully`);
                } else {
                    addErrorMsg(response.data.message);
                }
            })
        }
        else{
            setError(errors)
        }
    }

    const organizationValidations = () => {
        let { organization_name, date_format, currency_symbol, email_id, organization_phone_number, organization_fax_number, website_url, payable_to, additional_information } = state;
        let errors = {};
        errors.organization_name = validate_charWithSpace(organization_name)
        errors.date_format = validate_emptyField(date_format)
        errors.currency_symbol = validate_emptyField(currency_symbol)
        errors.email_id = validates_emailId(email_id)
        errors.organization_phone_number = validate_usContact(organization_phone_number)
        errors.organization_fax_number = validates_Integer(organization_fax_number)
        errors.website_url = validate_emptyField(website_url)
        errors.payable_to = validate_emptyField(payable_to)
        errors.additional_information = validate_emptyField(additional_information)
        return errors;
    };

    const personalValidations = () => {
        let { first_name, middle_name, last_name, personal_email_id, contact_number, mobile_number, ext } = state;
        let errors = {};
        errors.first_name = validate_charWithSpace(first_name)
        errors.middle_name = empty_name(middle_name)
        errors.last_name = validate_charWithSpace(last_name);
        errors.personal_email_id = validates_emailId(personal_email_id);
        errors.contact_number = validate_usContact(contact_number);
        errors.mobile_number = validate_usContact(mobile_number)
        errors.ext = validate_Extension(ext)
        return errors;
    }

    return (

        <Grid container direction='column' justifyContent='center' alignItems='center'>
            <Grid item pt={2} textAlign='center' p={'30px 0px !important'} width='30%'>
                <Stepper activeStep={mainStep} connector={<BrownMnCustomisedConnector />}>
                    {
                        stepsList.map((item) => (
                            <Step>
                                <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIconSignup}>
                                    <Text BrowmnMnStepperText>{item}</Text>
                                </BrownMnColorlibStepLabel>
                            </Step>
                        ))
                    }
                </Stepper>
            </Grid>

            <Grid item container width='40%' display='flex' justifyContent='center' >
                {
                    mainStep == 0 ?
                        <Box>
                            <Box className={classes.activeItemBox} >
                                <Box className={classes.activeBoxHeading}>
                                    <Box>
                                        <Text blackHeader >Organization Details</Text>
                                    </Box>
                                    <Box sx={{ height: "60vh", overflowY: 'auto', mt: '16px' }}>
                                        <Grid container spacing={3} columnSpacing={5} pt={2}>
                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "organization_name",
                                                        value: state.organization_name,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Organization Name'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.organization_name ? <Text errorText>{error.organization_name}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6}>
                                                <Box pt={1}>
                                                    <CustomSelect
                                                        name="date_format"
                                                        value={state.date_format}
                                                        onChange={changeHandler}
                                                        commonSelect
                                                        label={'Date Format'}
                                                        options={options}
                                                        disabled={false}
                                                    />
                                                </Box>
                                                {error.date_format ? <Text errorText>{error.date_format}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6}>
                                                <Box pt={1}>
                                                    <CustomSelect
                                                        name="currency_symbol"
                                                        value={state.currency_symbol}
                                                        onChange={changeHandler}
                                                        commonSelect
                                                        label={'Currency'}
                                                        options={currency}
                                                        disabled={false}
                                                    />
                                                </Box>
                                                {error.currency_symbol ? <Text errorText>{error.currency_symbol}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "email_id",
                                                        value: state.email_id,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Organization Email ID'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.email_id ? <Text errorText>{error.email_id}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "organization_phone_number",
                                                        value: state.organization_phone_number,
                                                        disabled: false,
                                                        inputProps:{maxLength:12}
                                                    }}
                                                    labelText={'Organization Phone Number'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.organization_phone_number ? <Text errorText>{error.organization_phone_number}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "organization_fax_number",
                                                        value: state.organization_fax_number,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Organization Fax Number'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.organization_fax_number ? <Text errorText>{error.organization_fax_number}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "website_url",
                                                        value: state.website_url,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Website URL'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.website_url ? <Text errorText>{error.website_url}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "payable_to",
                                                        value: state.payable_to,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Payable To'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.payable_to ? <Text errorText>{error.payable_to}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Box >
                                                    <Textarea className={classes.textarea} type="text" name="additional_information" aria-label="minimum height" minRows={6} placeholder="Additional Information" disabled={false} onChange={(e) => changeHandler(e)} />
                                                </Box>
                                                {error.additional_information ? <Text errorText> {error.additional_information}</Text> : ""}
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Box>
                            </Box >
                            <Box display='flex' justifyContent='end' mt='20px'>
                                <CustomButton blueBtnSave sx={{ width: '83px !important' }} onClick={handleNext}>Next</CustomButton>
                            </Box>
                        </Box>
                        :
                        <Box >
                            <Box className={classes.activeItemBox} >
                                <Box className={classes.activeBoxHeading}>
                                    <Box>
                                        <Text blackHeader >Personal Details</Text>
                                    </Box>
                                    <Box sx={{ height: "60vh", overflowY: 'auto', mt: '16px' }}>
                                        <Grid container spacing={3} columnSpacing={5} pt={2}>
                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "first_name",
                                                        value: state.first_name,
                                                        disabled: false,
                                                    }}
                                                    labelText={'First Name'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {console.log(error,"error")}
                                                {error.first_name ? <Text errorText>{error.first_name}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "middle_name",
                                                        value: state.middle_name,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Middle Name'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.middle_name ? <Text errorText>{error.middle_name}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "last_name",
                                                        value: state.last_name,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Last Name'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.last_name ? <Text errorText>{error.last_name}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "personal_email_id",
                                                        value: state.personal_email_id,
                                                        disabled: false,
                                                    }}
                                                    labelText={'Email ID'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.personal_email_id ? <Text errorText>{error.personal_email_id}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "contact_number",
                                                        value: state.contact_number,
                                                        disabled: false,
                                                        inputProps:{maxLength:12}
                                                    }}
                                                    labelText={'Contact Number'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.contact_number ? <Text errorText>{error.contact_number}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "mobile_number",
                                                        value: state.mobile_number,
                                                        disabled: false,
                                                        inputProps:{maxLength:12}
                                                    }}
                                                    labelText={'Mobile Number'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.mobile_number ? <Text errorText>{error.mobile_number}</Text> : ''}
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: "true",
                                                    }}
                                                    inputProps={{
                                                        name: "ext",
                                                        value: state.ext,
                                                        disabled: false,
                                                        inputProps:{maxLength:2}
                                                    }}
                                                    labelText={'Extension Number'}
                                                    clientInput
                                                    handleChange={(e) => changeHandler(e)}
                                                />
                                                {error.ext ? <Text errorText>{error.ext}</Text> : ''}
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Box>
                            </Box >
                            <Stack direction='row' justifyContent='space-between' mt='20px'>
                                <CustomButton cancelButton sx={{ width: '83px !important', font: "18px Nunito, sans-serif !important", }} onClick={handleCancel}>Cancel</CustomButton>
                                <CustomButton blueBtnSave sx={{ width: '83px !important' }} onClick={handleSubmit}>Submit</CustomButton>
                            </Stack>
                        </Box>
                }
            </Grid>
        </Grid>
    )
}

export default NewSignUp
