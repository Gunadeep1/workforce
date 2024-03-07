import React, { useState, useEffect } from 'react';
import { Box, Grid, } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { empty_Email_id, empty_usContact, isValid, validate_emptyField, validate_usContact, validates_emailId, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { useLocation } from 'react-router-dom';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
// import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import UserProfileStyles from '../UserProfileStyles';

export default function ContactDetails(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = UserProfileStyles();
    const location = useLocation();
    const [action, setAction] = useState("read");
    const [state, setState] = useState({
        contact_number: "",
        alternate_contact_number: "",
        email_id: "",
        alternate_email_id: "",
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let newData = props.data
        setState(newData);
        // eslint-disable-next-line
    }, [props]);

    const contactNumberConvert = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const input = value.replace(/\D/g, "").substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890"
        const first =
            name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number"
                ? input.substring(0, 3)
                : input.substring(0, 3);
        const middle =
            name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number"
                ? input.substring(3, 6)
                : input.substring(3, 5);
        const last =
            name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number"
                ? input.substring(6, 10)
                : input.substring(5, 9);

        if (
            input.length >
            (name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number" ? 6 : 5)
        ) {
            return `${first}-${middle}-${last}`;
        } else if (input.length > 3) {
            return `${first}-${middle}`;
        } else if (input.length >= 0) {
            return input;
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "contact_number" || e.target.name === "alternate_contact_number") {
            let number = contactNumberConvert(e);
            setState({ ...state, [e.target.name]: number })
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
        }
        handleValidations(e);
    };

    const handleCancel = () => {
        setAction("read");
        setError({});
        setState(props.data);
    }

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "contact_number":
                err.contact_number = validate_usContact(input.value);
                break;
            case "alternate_contact_number":
                err.alternate_contact_number = empty_usContact(input.value, 'Alternate Contact');
                break;
            case "email_id":
                err.email_id = validates_emailId(input.value);
                break;
            case "alternate_email_id":
                err.alternate_email_id = empty_Email_id(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let { contact_number, email_id, alternate_email_id } = state;
        let errors = {};
        errors.contact_number = validate_emptyField(contact_number);
        errors.email_id = validate_emptyField(email_id);
        errors.alternate_email_id = empty_Email_id(alternate_email_id);
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            updateEmployeeContactDetails();
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const updateEmployeeContactDetails = () => {
        let data = { ...state, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateEmployeeContactDetails(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setAction("read");
                    addSuccessMsg(response.data.message);
                    props.getIndex();
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    return (
        <Box py={1}>
            <Box sx={{ minHeight: "53vh", }}>
                <Grid container spacing={0}>

                    <Grid lg={6} md={6} sm={12} xs={12}>

                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'contact_number',
                                    value: state.contact_number,
                                    inputProps: { maxLength: 12 },
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Mobile Number</Text>}
                            />
                            <Text errorText> {error.contact_number ? error.contact_number : ""}</Text>
                        </Box>

                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2} >
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'alternate_contact_number',
                                    value: state.alternate_contact_number,
                                    inputProps: { maxLength: 12 },
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Alternate Mobile Number <span className={classes.optional}>(Optional)</span></Text>}
                            />
                            <Text errorText> {error.alternate_contact_number ? error.alternate_contact_number : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'email_id',
                                    value: state.email_id,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Email ID</Text>}
                            />
                            <Text errorText> {error.email_id ? error.email_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'alternate_email_id',
                                    value: state.alternate_email_id,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Alternate Email ID <span className={classes.optional}>(Optional)</span></Text>}
                            />
                            <Text errorText> {error.alternate_email_id ? error.alternate_email_id : ""}</Text>
                        </Box>
                    </Grid>
                </Grid>

            </Box>

            <Box mt={1} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                {
                    action === "update" ?
                        <Button cancelBtn onClick={() => handleCancel()}>
                            Cancel
                        </Button> : null
                }
                {
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                        <LoadingButton saveLoader loading={loading} onClick={() => action === "update" ? handleSubmit() : setAction("update")}>
                            {
                                action === "update" ? "Save" : "Edit"
                            }
                        </LoadingButton> :
                        <LoadingButton saveLoaderDisable>
                            Edit
                        </LoadingButton>
                }
            </Box>

        </Box>
    );
}