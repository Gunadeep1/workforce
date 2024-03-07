import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { isValid, validate_emptyField, validates_Integer } from "../../../components/Validation";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "@mui/material";
import AddSelectFormStyles from './AddSelectFormStyles';
import LocalStorage from "../../../utils/LocalStorage";
import Input from "../../../components/input/Input";
import Button from "../../../components/customButton/Button";
import Text from "../../../components/customText/Text";
import CommonApi from "../../../apis/CommonApi";
import { addErrorMsg, addSuccessMsg } from "../../../utils/utils";

function AddNetPayTerms(props) {
    const [value, setValue] = useState({
        days: "",
        description: "",
        is_active: 1,
    });
    const [error, setError] = useState({});

    const classes = AddSelectFormStyles();

    const open = props.formTT

    const changes = (e) => {
        setValue(
            {
                ...value,
                [e.target.name]: e.target.value,
            },
            handleValidate(e)
        );
    };

    const handleValidate = (e) => {
        let input = e.target;
        let s1 = { ...error };
        switch (input.name || input.tagName) {
            case "days":
                error.days = validates_Integer(input.value);
                break;
            case "description":
                error.description = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(s1);
    };

    const handleClose = () => {
        open(false);
        props.getList();
    }
    const handleSubmit = () => {
        let errors = validatestate();
        if (isValid(errors)) {
            postApi();           
        } else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    };

    const validatestate = () => {
        let { days } = value;
        let errors = {};
        errors.days = validates_Integer(days);
        return errors;
    };

    const postApi = () => {
        const data = {
            request_id: LocalStorage.uid(),
            days: value.days,
            description: value.description,
            is_active: value.is_active
        }
        CommonApi.createPaytems(data, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    addSuccessMsg("Net Pay Terms Added successfully");
                    handleClose();
                }
                else {
                    addErrorMsg(response.data.message);
                }
            })
    }

    return (
        <Box className={classes.popupContainer}>
            <Box justifyContent='space-between' display='flex' p={1} alignItems='center'>
                <Box>
                    <Text mediumBlack>Add Net PayTerms</Text>
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
                            name: 'days',
                            value: value.days
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Days</Text>}
                    />
                    {
                        error.days ?
                            <Text red>{error.days}</Text> : <Text></Text>
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
    );
}

export default AddNetPayTerms;
