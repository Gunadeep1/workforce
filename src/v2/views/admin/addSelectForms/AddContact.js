import { Box, Divider, Grid, Stack } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import Button from '../../../components/customButton/Button';
import AddSelectFormStyles from './AddSelectFormStyles';
import { useState } from 'react';
import { isValid, validate_charWithSpace, validates_emailId, validates_Integer, empty_usContact, validate_contact_number, empty_name } from '../../../components/Validation';
import Text from '../../../components/customText/Text';
import Input from '../../../components/input/Input';
import ClientsApi from '../../../apis/admin/clients/ClientsApi';
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import LocalStorage from '../../../utils/LocalStorage';


function AddContact(props) {
    const [state, setState] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        contact_number: "",
        email_id: "",
        ext: "",
        mobile_number: "",
    });

    const [error, setError] = useState({});

    const classes = AddSelectFormStyles();

    const open = props.contact;// eslint-disable-next-line
    const clientID = props.clientId;
    const slugName = props.slug

    const handleClose = () => {
        open(false);
        props.getList(clientID);
    }

    const changes = (e) => {
        if (e.target.name == 'contact_number' || e.target.name == 'mobile_number') {
            convertFormat(e);
        }
        else {
            setState(
                {
                    ...state,
                    [e.target.name]: e.target.value,
                },
                handleValidate(e)
            );
        }
    };

    const convertFormat = (e) => {
        const value = e.target.value;
        const name = e.target.name
        const input = value.replace(/\D/g, '').substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890" 
        const first = name == 'contact_number' || name == 'mobile_number' ? input.substring(0, 3) : input.substring(0, 3);
        const middle = name == 'contact_number' || name == 'mobile_number' ? input.substring(3, 6) : input.substring(3, 5);
        const last = name == 'contact_number' || name == 'mobile_number' ? input.substring(6, 10) : input.substring(5, 9);

        if (input.length > (name == 'contact_number' || name == 'mobile_number' ? 6 : 5)) {
            setState(
                {
                    ...state,
                    [e.target.name]: `${first}-${middle}-${last}`
                }, handleValidate(e));
        }
        else if (input.length > 3) {
            setState(
                {
                    ...state,
                    [e.target.name]: `${first}-${middle}`
                }, handleValidate(e));
        }
        else if (input.length >= 0) {
            setState(
                {
                    ...state,
                    [e.target.name]: input
                }, handleValidate(e));
        }
    }

    const handleValidate = (e) => {
        let input = e.target;
        let s1 = { ...error };
        switch (input.name || input.tagName) {
            case "first_name":
                error.first_name = validate_charWithSpace(input.value, 'first ');
                break;
            case "middle_name":
                error.middle_name = empty_name(input.value, 'middle ');
                break;
            case "last_name":
                error.last_name = validate_charWithSpace(input.value, 'last ');
                break;
            case "contact_number":
                error.contact_number = validate_contact_number(input.value, "Contact Number");
                break;
            case "email_id":
                error.email_id = validates_emailId(input.value);
                break;
            case "ext":
                error.ext = validates_Integer(input.value);
                break;
            case "mobile_number":
                error.mobile_number = empty_usContact(input.value, "Mobile Number");
                break;
            default:
                break;
        }
        setError(s1);
    };

    const storeContact = () => {
        const data = {
            request_id: LocalStorage.uid(),
            company_id: clientID,
            contacts: [state]
        }
        ClientsApi.storeContactsDetails(slugName, data).then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg('Contact Added Successfully');
                handleClose();
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleSubmit = () => {
        let errors = validatestate();
        if (isValid(errors)) {
            storeContact();
        } else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    }

    const validatestate = () => {
        let { first_name, last_name, email_id, contact_number } = state;
        let errors = {};
        errors.first_name = validate_charWithSpace(first_name, 'first ');
        errors.last_name = validate_charWithSpace(last_name, 'last');
        errors.email_id = validates_emailId(email_id);
        errors.contact_number = validate_contact_number(contact_number, "Contact Number");
        return errors;
    };

    return (
        <Box container className={classes.popupContactContainer}>
            <Grid item container justifyContent='space-between' display='flex' p={1} alignItems='center'>
                <Grid>
                    <Text normal fontSize14>Add Contact</Text>
                </Grid>
                <Grid textAlign='end'>
                    <CloseIcon onClick={handleClose} className={classes.closeIconStyles} />
                </Grid>
            </Grid>
            <Divider />
            <Grid container p={1} spacing={2} rowSpacing={1}>
                <Grid item lg={6}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'first_name',
                            value: state.first_name,
                            inputProps: { maxLength: 50 }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>First Name</Text>}

                    />
                    {
                        error.first_name ?
                            <Text red>{error.first_name}</Text> : ''
                    }
                </Grid>
                <Grid item lg={6}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'middle_name',
                            value: state.middle_name,
                            inputProps: { maxLength: 50 }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text smallLabel>Middle Name<span style={{ color: "#C7CCD3", fontSize: '11px' }}>( Optional )</span></Text>}
                    />
                    {
                        error.middle_name ?
                            <Text red>{error.middle_name}</Text> : ''
                    }
                </Grid>
                <Grid item lg={6}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'last_name',
                            value: state.last_name,
                            inputProps: { maxLength: 50 }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Last Name</Text>}
                    />
                    {
                        error.last_name ?
                            <Text red>{error.last_name}</Text> : ''
                    }
                </Grid>
                <Grid item lg={6}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'contact_number',
                            value: state.contact_number,
                            inputProps: {
                                maxLength: 12
                            }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Contact Number</Text>}
                    />
                    {
                        error.contact_number ?
                            <Text red>{error.contact_number}</Text> : ''
                    }
                </Grid>
                <Grid item lg={6}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'email_id',
                            value: state.email_id
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Email ID</Text>}
                    />
                    {
                        error.email_id ?
                            <Text red>{error.email_id}</Text> : ''
                    }
                </Grid>
                <Grid item lg={6}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'ext',
                            value: state.ext,
                            inputProps: {
                                maxLength: 4
                            }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Extension</Text>}
                    />
                    {
                        error.ext ?
                            <Text red>{error.ext}</Text> : ''
                    }
                </Grid>
                <Grid item lg={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'mobile_number',
                            value: state.mobile_number,
                            inputProps: {
                                maxLength: 12
                            }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Mobile Number<span style={{ color: "#C7CCD3", fontSize: '11px' }}>( Optional )</span></Text>}
                    />
                    {
                        error.mobile_number ?
                            <Text red>{error.mobile_number}</Text> : ''
                    }
                </Grid>
                <Grid textAlign='center' m={'15px 30px'}>
                    <Stack display='flex' direction='row' spacing={2} justifyContent='center'>
                        <Button popupSaveBlue onClick={handleSubmit}>Save</Button>
                        <Button popupCancel onClick={handleClose}>Cancel</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AddContact

