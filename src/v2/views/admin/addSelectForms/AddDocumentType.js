import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "@mui/material";
import AddSelectFormStyles from "./AddSelectFormStyles";
import { isValid, validate_alphaNumeric } from "../../../components/Validation";
import LocalStorage from "../../../utils/LocalStorage";
import Text from "../../../components/customText/Text";
import Input from "../../../components/input/Input";
import Button from "../../../components/customButton/Button";
import AddClientEndClientApi from "../../../apis/admin/placements/AddClientEndClientApi";
import { addErrorMsg, addSuccessMsg } from "../../../utils/utils";

function AddDocumentType(props) {
    const [value, setValue] = useState({
        request_id: LocalStorage.uid(),
        id: "",
        name: "",
        description: "",
        number_mandatory: false,
        number_display: true,
        valid_from_mandatory: false,
        valid_from_display: true,
        valid_to_mandatory: false,
        valid_to_display: true,
        status_mandatory: false,
        status_display: true,
        upload_mandatory: false,
        upload_display: true,
        is_active: true
    });

    const [error, setError] = useState({});

    const classes = AddSelectFormStyles();

    const open = props.open;

    const changes = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        }, handleValidate(e));
    };


    const handleSubmit = () => {
        let errors = validateState();
        if (isValid(errors)) {
            createPlacementDocType(value);
        } else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    };

    const createPlacementDocType = (param) => {
        AddClientEndClientApi.storeClientContact('placement-documents', param).then(
            (response) => {
                if (response.data.statusCode == 1003) {
                    props.getDocumentsTypes();
                    handleClose();
                    addSuccessMsg("Document Type Added Successfully");
                } else {
                    addErrorMsg(response.data.message);
                }
            }
        );
    };

    const validateState = () => {
        let { name } = value;
        let errors = {};
        errors.name = validate_alphaNumeric(name);
        return errors;
    };

    const handleValidate = (e) => {
        let input = e.target;
        let s1 = { ...error };
        switch (input.name || input.tagName) {
            case "name":
                error.name = validate_alphaNumeric(input.value);
                break;
            default:
                break;
        }
        setError(s1);
    };

    const handleClose = () => {
        open(false);
    };

    return (
        <Box className={classes.popupContainer}>
            <Box justifyContent="space-between" display="flex" p={1} alignItems="center">
                <Box>
                    <Text blackFont14>
                        Add Document Type
                    </Text>
                </Box>
                <Box textAlign="end">
                    <CloseIcon onClick={handleClose} className={classes.closeIconStyles} />
                </Box>
            </Box>
            <Divider />
            <Box p={'10px 15px'}>
                <Box>
                    <Input
                        formControlProps={{
                            fullWidth: true,
                        }}
                        inputProps={{
                            name: "name",
                            value: value.name,
                            inputProps: { maxLength: 50 }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Name</Text>}
                    />
                    {error.name ? <Text red>{error.name}</Text> : <Text></Text>}
                </Box>
                {/* <Box pt={1}>
                    <Text mediumLabel >Status</Text>
                    <RadioGroup row
                        name="is_active"
                        value={value.is_active}
                        onChange={changes}
                        items={statusItems}
                    />
                </Box> */}
                <Box pt={1}>
                    <Input
                        formControlProps={{
                            fullWidth: true,
                        }}
                        inputProps={{
                            name: "description",
                            value: value.description,
                            // inputProps: { maxLength: 50 }
                        }}
                        handleChange={changes}
                        clientInput
                        labelText={<Text largeLabel>Description</Text>}
                    />
                </Box>
                <Box pb={1}>
                    <Stack display="flex" direction="row" spacing={2} justifyContent="center" pt={"10px"}>
                        <Button popupSaveBlue onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button popupCancel onClick={handleClose}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default AddDocumentType;
