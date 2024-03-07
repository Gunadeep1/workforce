import React, { useEffect, useState } from 'react'
import { Box, Divider, Grid, Stack } from '@mui/material'
import Button from '../../../../../components/customButton/Button';
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
// import EmployeeTypesApi from '../../../../../apis/configurations/employee/EmployeeTypesApi';
import { validate_usContact, validates_emailId, isValid, validate_emptyField, validate_zipcode, validate_city, validate_charWithSpace } from '../../../../../components/Validation';
import LocalStorage from '../../../../../utils/LocalStorage';
import FileInput from '../../../../../components/muiFileInput/FileInput';
import CommonApi from '../../../../../apis/CommonApi';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from "@mui/material/styles";
import OrganizationDetailsApi from '../../../../../apis/configurations/organization/OrganizationDetailsApi';
import LoaderIcon from '../../../../../assets/svg/sandtimer.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';


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

function OrganizationDetails({ current }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()// eslint-disable-next-line
    const [isEditable, setIsEditable] = useState(true);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [btnloading, setBtnLoading] = useState(false);
    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        organization_name: "",
        // organization_logo_name: '',
        logo_id: "",
        logo_url: "",
        first_name: "",
        middle_name: "",

        email_id: "",
        contact_number: "",
        ext: "",
        mobile_number: "",
        documentName: "",
        date_format: "",
        currency_symbol: "",
        logo_name: '',
        website_url: '',
        organization_fax_number: "",
        payable_to: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        zip_code: '',
        additional_information: "",
    });

    useEffect(() => {
        getList(); // eslint-disable-next-line
    }, []);

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

    const getList = (update = false) => {
        setLoading(true)
        // setBtnLoading(true)
        OrganizationDetailsApi.getOrganizationDetails(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode == 1003) {
                    setLoading(false);
                    let updatedUserData = LocalStorage.getUserData();
                    updatedUserData.organization_id = res.data.data[0].id;
                    LocalStorage.setUserData(updatedUserData);
                    if (res.data.data.length > 0) {
                        if (update == "update") {
                            let updatedUserData = LocalStorage.getUserData();
                            updatedUserData.logo_url = res.data.data[0].logo_url;
                            updatedUserData.organization_id = res.data.data[0].id;
                            console.log(updatedUserData, 'updatedUserData');
                            console.log(res.data.data[0].id, 'res.data.data[0].id');
                            LocalStorage.setUserData(updatedUserData);
                        }
                        setState({
                            ...res.data.data[0],
                            logo_id: "",
                        });
                    } else {
                        setState({ ...state });
                    }
                }
            }, 300)

        });
    };

    const handleCancel = () => {
        setIsEditable(true)
        getList();
        // setState({
        //   organization_name: "",
        //   orgDoc: "",
        //   // organization_logo_name: '',
        //   first_name: "",
        //   middle_name: "",
        //   last_name: "",
        //   email_id: "",
        //   contact_number: "",
        //   ext: "",
        //   mobile_number: "",
        // });
        setError({});
    };

    const handleSubmit = () => {

        let errors = validateAll();
        console.log(errors, "errrrrr")
        if (isValid(errors)) {
            state["request_id"] = LocalStorage.uid();
            if (!state.logo_id) {
                state["logo_id"] = "";
            }
            setState({ ...state });
            // state.logo_document_name = ''
            console.log(state, "state")
            updateAPI(state);
        } else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    };
    const validateAll = () => {
        let { organization_name, email_id, address_line_1, zip_code, city,

            date_format,
            currency_symbol,
            logo_name,
            website_url,
            organization_fax_number,
            payable_to,
            mobile_number,
            additional_information,
            // address_line_2,
        } =
            state;
        let errors = {};
        errors.organization_name = validate_emptyField(organization_name);
        errors.address_line_1 = validate_emptyField(address_line_1);
        errors.zip_code = validate_emptyField(zip_code);
        errors.city = validate_emptyField(city);
        errors.email_id = validate_emptyField(email_id);
        errors.logo_name = validate_emptyField(logo_name);
        errors.payable_to = validate_emptyField(payable_to);
        // errors.address_line_2 = validate_emptyField(address_line_2);
        errors.date_format = validate_emptyField(date_format);
        errors.mobile_number = validate_emptyField(mobile_number);
        errors.website_url = validate_emptyField(website_url);
        errors.organization_fax_number = validate_emptyField(organization_fax_number);
        errors.currency_symbol = validate_emptyField(currency_symbol);
        errors.additional_information = validate_emptyField(additional_information);
        return errors;
    };

    const updateAPI = (data) => {
        setLoading(true)
        setBtnLoading(true)
        let id = data.id
        OrganizationDetailsApi.updateOrganizationDetails(data, id, LocalStorage.getAccessToken()).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode == 1003) {
                    setLoading(false)
                    setBtnLoading(false)
                    // addSuccessMsg("Data Added Successfully");
                    addSuccessMsg("Organization Details updated Successfully");// 
                    setIsEditable(true)
                } else {
                    addErrorMsg(res.data.message);
                }
            }, 300);
        });
    };

    const uploadDocs = (value) => {
        const logoData = new FormData();
        logoData.append("files", value.target.files[0]);
        logoData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("organization-logo", logoData, LocalStorage.getAccessToken()).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    state[value.target.name] = response.data.data.id;
                    state["logo_name"] = value.target.files[0].name.length > 30 ? value.target.files[0].name.slice(0, 30) + "..." : value.target.files[0].name;
                    state["logo_url"] = URL.createObjectURL(value.target.files[0]);
                    setState({ ...state });
                    handleValidateChangeHandler({ name: "logo_name", value: response.data.data.id });
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 300)

        });
    };
    const changeHandler = (e) => {

        if (
            e.target.name == "contact_number" ||
            e.target.name == "mobile_number" ||
            e.target.name == "ext"
        ) {
            convertFormat(e);
        } else {
            setState(
                {
                    ...state,
                    [e.target.name]: e.target.value,
                },
                handleValidateChangeHandler(e.target)
            );
        }
    };

    const convertFormat = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const input = value.replace(/\D/g, "").substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890"
        const first =
            name == "contact_number" || name == "mobile_number"
                ? input.substring(0, 3)
                : input.substring(0, 3);
        const middle =
            name == "contact_number" || name == "mobile_number"
                ? input.substring(3, 6)
                : input.substring(3, 5);
        const last =
            name == "contact_number" || name == "mobile_number"
                ? input.substring(6, 10)
                : input.substring(5, 9);

        if (
            input.length >
            (name == "contact_number" || name == "mobile_number" ? 6 : 5)
        ) {
            setState(
                {
                    ...state,
                    [e.target.name]: `${first}-${middle}-${last}`,
                },
                handleValidateChangeHandler(e.target)
            );
        } else if (input.length > 3) {
            setState(
                {
                    ...state,
                    [e.target.name]: `${first}-${middle}`,
                },
                handleValidateChangeHandler(e.target)
            );
        } else if (input.length >= 0) {
            setState(
                {
                    ...state,
                    [e.target.name]: input,
                },
                handleValidateChangeHandler(e.target)
            );
        }
    };

    const handleEditClick = (args) => {
        setIsEditable(false)

    };

    const handleValidateChangeHandler = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "organization_name":
                err.organization_name = validate_charWithSpace(input.value);
                break;

            case "mobile_number":
                err.mobile_number = validate_usContact(input.value);
                break;
            case "email_id":
                err.email_id = validates_emailId(input.value);
                break;
            case "date_format":
                err.date_format = validate_emptyField(input.value);
                break;
            case "currency_symbol":
                err.currency_symbol = validate_emptyField(input.value);
                break;
            case "address_line_1":
                err.address_line_1 = validate_emptyField(input.value);
                break;
            // case "address_line_2":
            //     err.address_line_2 = validate_emptyField(input.value);
            //     break;
            case "logo_name":
                err.logo_name = validate_emptyField(input.value)
                break
            case "zip_code":
                err.zip_code = validate_zipcode(input.value)
                break

            case "website_url":
                err.website_url = validate_emptyField(input.value)
                break
            case "city":
                err.city = validate_city(input.value)
                break
            case "payable_to":
                err.payable_to = validate_emptyField(input.value)
                break
            case "organization_fax_number":
                err.organization_fax_number = validate_emptyField(input.value)
                break

            case "additional_information":
                err.additional_information = validate_emptyField(input.value)
                break
            default:
                break;
        }
        setError({ ...err });
    };


    return (
        <Box sx={{
            height: '75vh',
            overflow: 'auto',
            padding: '16px',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        }}>
            {loading ?
                <Box sx={{
                    height: '75vh',
                    overflow: 'auto',
                    padding: '16px',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                    </Stack>
                </Box>
                :

                <Box className={classes.activeItemBox} >
                    <Box className={classes.activeBoxHeading}>
                        <Box display='flex' justifyContent='space-between'>
                            <Text blackHeader >{current}</Text>
                            {isEditable &&
                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_organization" && item.is_allowed == true))) ?
                                <Button outlineBlueSmall onClick={handleEditClick}>Edit</Button> :
                                <Button popupSaveBlueDisable>Edit</Button>
                            }
                        </Box>
                        <Box sx={{ minHeight: "30vh", overflow: 'auto' }}>
                            <Grid container spacing={2} columnSpacing={4} pt={4}>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "organization_name",
                                            value: state.organization_name,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Organization Name'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.organization_name ? <Text red>{error.organization_name}</Text> : ""}
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
                                            disabled={isEditable}
                                        />
                                    </Box>
                                    {error.date_format ? <Text red>{error.date_format}</Text> : ""}

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
                                            disabled={isEditable}
                                        />
                                    </Box>
                                    {error.currency_symbol ? <Text red>{error.currency_symbol}</Text> : ""}
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Box sx={{ height: '56px !important' }}>
                                        <FileInput
                                            name={"logo_name"}
                                            FileName={state.logo_name}
                                            handleChange={uploadDocs}
                                            label='Organizational Logo'
                                            actionState={'Upload'}
                                            uploadKeyName={'Upload'}
                                            isDisabled={isEditable}
                                        />
                                    </Box>
                                    {error.logo_name ? <Text red>{error.logo_name}</Text> : ""}

                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "email_id",
                                            value: state.email_id,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Organization Email ID'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                </Grid>
                                {error.email_id ? <Text red>{error.email_id}</Text> : ""}

                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "mobile_number",
                                            value: state.mobile_number,
                                            disabled: isEditable,
                                            inputProps: { maxLength: 12 },
                                        }}
                                        labelText={'Organization Phone Number'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.mobile_number ? <Text red>{error.mobile_number}</Text> : ""}

                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "organization_fax_number",
                                            value: state.organization_fax_number,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Organization Fax Number'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.organization_fax_number ? <Text red>{error.organization_fax_number}</Text> : ""}

                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "website_url",
                                            value: state.website_url,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Website URL'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.website_url ? <Text red>{error.website_url}</Text> : ""}

                                </Grid>
                            </Grid>
                            <Divider className={classes.dividerColor} />
                            <Grid container spacing={2} columnSpacing={4}>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "address_line_1",
                                            value: state.address_line_1,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Organization Address Line 1'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.address_line_1 ? <Text red>{error.address_line_1}</Text> : ""}

                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "address_line_2",
                                            value: state.address_line_2,
                                            disabled: isEditable,
                                        }}
                                        labelText={<Text largeLabel>Organization Address Line 2<span className={classes.optional}>(Optional)</span></Text>}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {/* {error.address_line_2 ? <Text red>{error.address_line_2}</Text> : ""} */}

                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "zip_code",
                                            value: state.zip_code,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Pincode'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.zip_code ? <Text red>{error.zip_code}</Text> : ""}
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "city",
                                            value: state.city,
                                            disabled: isEditable,
                                        }}
                                        labelText={'City'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.city ? <Text red>{error.city}</Text> : ""}
                                </Grid>


                            </Grid>
                            <Divider className={classes.dividerColor} />
                            <Grid container spacing={2} columnSpacing={4}>
                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: "true",
                                        }}
                                        inputProps={{
                                            name: "payable_to",
                                            value: state.payable_to,
                                            disabled: isEditable,
                                        }}
                                        labelText={'Payable To'}
                                        clientInput
                                        handleChange={(e) => changeHandler(e)}
                                    />
                                    {error.payable_to ? <Text red>{error.payable_to}</Text> : ""}
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Box py={1} my={1}>
                                        <Textarea className={classes.textarea} type="text" name="additional_information" value={state.additional_information} aria-label="minimum height" minRows={6} onChange={changeHandler} placeholder="Additional Information" disabled={isEditable} />
                                        <Text errorText> {error.additional_information ? error.additional_information : ""}</Text>
                                    </Box>
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12} display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                                    {!isEditable && (
                                        <>
                                            <Button cancelOutline onClick={handleCancel}>
                                                Cancel
                                            </Button>

                                            <LoadingButton loading={btnloading} saveVerySmall onClick={handleSubmit}>
                                                {btnloading ? 'saving' : 'save'}
                                            </LoadingButton>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>

                    </Box>
                </Box >
            }
        </Box >)
}

export default OrganizationDetails;
