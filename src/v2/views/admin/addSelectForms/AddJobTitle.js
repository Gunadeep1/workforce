import { Box, Divider, Stack } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import Button from '../../../components/customButton/Button';
import AddSelectFormStyles from './AddSelectFormStyles';
import { useState } from 'react'; // eslint-disable-next-line
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import { isValid, validate_charWithSpace, validate_emptyField } from '../../../components/Validation';
import Text from '../../../components/customText/Text';
import LocalStorage from "../../../utils/LocalStorage";
import AddClientEndClientApi from '../../../apis/admin/placements/AddClientEndClientApi';
import Input from '../../../components/input/Input';


function AddJobTitle(props) {
    const [value, setValue] = useState({
        id: "",
        name: "",
        description: "",
        is_active: 1,
    });

    const [error, setError] = useState({});

    const classes = AddSelectFormStyles();

    const open = props.contact

    const changes = (e) => {
        setValue(
            {
                ...value,
                [e.target.name]: e.target.value,
            },
            handleValidate(e)
        );
    };
    const handleClose = () => {
        open(false);
        props.jobTitleDropdown();
    }

    const handleSubmit = () => {
        let errors = finalValidations();
        if (isValid(errors)) {
            createJobTitle();
        } else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    }

    const createJobTitle = () => {
        const data = {
            request_id: LocalStorage.uid(),
            name: value.name,
            description: value.description,
            is_active: 1,
        };
        AddClientEndClientApi.addJobTitle(data, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                console.log(response,"success")
                handleClose();
                addSuccessMsg("Job Title Added Successfully")
            } else {
                addErrorMsg(response.data.message)
            }
        });
    };

    const handleValidate = (e) => {
        let input = e.target;
        let s1 = { ...error };
        switch (input.name || input.tagName) {
            case "name":
                error.name = validate_charWithSpace(input.value);
                break;
            case "description":
                error.description = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(s1);
    };

    const finalValidations = () => {
        let { name } = value;
        let errors = {};
        errors.name = validate_charWithSpace(name);
        return errors;
    };

  

    return (
        <Box className={classes.popupContainer}>
        <Box justifyContent='space-between' display='flex' p={1} alignItems='center'>
            <Box>
                <Text mediumBlack>Add Job Title</Text>
            </Box>
            <Box textAlign='end'>
                <CloseIcon onClick={handleClose} className={classes.closeIconStyles} />
            </Box>
        </Box>
        <Divider />
        <Box p={1}>
            <Box>
                <Input
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        name: 'name',
                        value: value.name
                    }}
                    handleChange={changes}
                    clientInput
                    labelText={<Text largeLabel>Name</Text>}
                />
                {
                    error.name ?
                        <Text red>{error.name}</Text> : <Text></Text>
                }
            </Box>
            <Box pt={1}>
                <Input
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        name: 'description',
                        value: value.description
                    }}
                    handleChange={changes}
                    clientInput
                    labelText={<Text largeLabel>Description<span className={classes.optional}>(optional)</span></Text>}
                />
                {
                    error.description ?
                        <Text red>{error.description}</Text> : <Text></Text>
                }
            </Box>
            <Box pb={1}>
                <Stack display='flex' direction='row' spacing={2} justifyContent='center' pt={'10px'}>                       
                    <Button popupCancel onClick={handleClose}>Cancel</Button>
                    <Button popupSaveBlue onClick={handleSubmit}>Save</Button>
                </Stack>
            </Box>
        </Box>
    </Box>
    )
}

export default AddJobTitle

