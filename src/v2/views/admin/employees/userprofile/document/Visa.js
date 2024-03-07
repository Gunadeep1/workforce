import React, { useState, useEffect, Fragment } from "react";
import { Box, Typography, Grid, Stack, Skeleton } from "@mui/material";
import {
    isValid,
    isValidMulti,
    validate_emptyField,
    validates_Integer,
} from "../../../../../components/Validation";
import Input from "../../../../../components/input/Input";
import Text from "../../../../../components/customText/Text";
// import Browse from "../../../../../assets/svg/Browse.svg";
import Button from "../../../../../components/customButton/Button";
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import visaSvg from "../../../../../assets/svg/visaIcon.svg";
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import NoDataImg from "../../../../../assets/images/no-data.png";
import FileInput from '../../../../../components/muiFileInput/FileInput';
// import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
// import CustomButton from "../../../../../components/customButton/Button";
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Datepicker from '../../../../../components/datePicker/Date';
import { dateFormat } from '../../../../../utils/utils';
import FileSvg from "../../../../../assets/svg/File.svg";
import moment from "moment";
import FileSaver from 'file-saver';
// import RemoveIcon from '@mui/icons-material/Remove';
import { Add, Remove } from "@mui/icons-material";
import UserProfileStyles from '../UserProfileStyles'


export default function ControlledAccordions(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = UserProfileStyles()
    const location = useLocation();
    const [list, setList] = useState([]);
    const [state, setState] = useState(
        {
            visa_type_id: "",
            valid_from: "",
            valid_till: "",
            document_number: "",
            status: "",
            i9_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_url: "",
                    document_name: "",
                }
            ],
            visa_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_url: "",
                    document_name: "",
                }
            ],
            support_documents: [
                {
                    id: "",
                    visa_document_type_id: "",
                    visa_document_type_name: "",
                    new_visa_document_upload_id: "",
                    document_name: "",
                }
            ]
        }
    );
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null);
    const [visaTypeDropdown, setVisaTypeDropdown] = useState([]);
    const [visaDocumentTypeDropdown, setVisaDocumentTypeDropdown] = useState([]);

    useEffect(() => {
        getVisaTypeDropdown();
        getVisa();

        // eslint-disable-next-line
    }, []);

    const getVisaTypeDropdown = () => {
        let search = "";
        CommonApi.VisaTypeDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaTypeDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getVisaDocumentTypeDropdown = (visa_type_id) => {
        let search = "";
        CommonApi.visaDocumentTypeDropdown(visa_type_id, search).then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaDocumentTypeDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getVisa = () => {
        setLoading(true)
        EmployeeAPI.getVisa(location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    console.log(response.data.data, " 66666666666666");
                    setList(response.data.data);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    /* fun is for Uploading Documents */
    const uploadDocs = (e, value, supportDocs, key) => {
        const formData = new FormData();
        formData.append("files", e.target.files[0]); // Access 'e.target' instead of 'value.target'
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload("visa-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data;
                    if (supportDocs === "support_documents") {
                        let support_documents = state.support_documents;
                        support_documents[key].new_document_id = docInfo.id;
                        support_documents[key].document_name = e.target.files[0].name;
                        setState({ ...state, support_documents });
                        handleMultiValidate(e, docInfo.id, key);
                    } else {
                        let docInfo = response.data.data;
                        let newStateObj = state;
                        newStateObj[e.target.name][0].new_document_id = docInfo.id;
                        newStateObj[e.target.name][0].document_name = e.target.files[0].name;
                        handleDocumentValidations({ name: e.target.name, value: docInfo.id, key });
                        setState({ ...newStateObj });
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };


    const handleMultiValidate = (e, value, index) => {
        let input = e.target;
        // Ensure docError[index] exists before accessing it
        let err = docError[index] || {};
        let s1 = [...docError];
        switch (input.name || input.tagName) {
            case 'visa_document_type_id':
                err.visa_document_type_id = validate_emptyField(input.value);
                break;
            case 'new_document_id':
                err.new_document_id = validate_emptyField(input.value);
                break;
            case 'visa_document_type_name':
                err.visa_document_type_name = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        // Update docError array with the modified object
        s1[index] = err;
        setDocError(s1);
    }



    const handleDocumentValidations = (input) => {
        let err = error;
        switch (input.name) {
            case "visa_documents":
                err.visa_documents = validate_emptyField(input.value);
                break;
            case "i9_documents":
                err.i9_documents = validate_emptyField(input.value);
                break;
            // case "support_documents":
            //     err.support_documents = validate_emptyField(input.value);
            //     break;
            default:
                break;
        }
        setError(err);
    }

    const handleChange = (e, index) => {
        setState({
            ...state, [e.target.name]: e.target.value
        })
        handleValidations(e.target)
        if (e.target.name === "visa_type_id") {
            getVisaDocumentTypeDropdown(e.target.value);
            handleValidations(e.target)
        }
        // if (e.target.name == 'visa_document_type_id') {
        //     state.support_documents[index][e.target.name] = e.target.value
        //     setState({ ...state }, handleMultiValidate(e, index));
        // }

    };

    // const handleChangeSupportDocs = (e, key) => {
    //     let support_documents = state.support_documents;
    //     support_documents[key][e.target.name] = e.target.value;
    //     setState({ ...state, support_documents });
    //     handleMultiValidate(e.target.value, key)
    // }

    const handleChangeSupportDocs = (e, key) => {
        let support_documents = state.support_documents;
        support_documents[key][e.target.name] = e.target.value;
        setState({ ...state, support_documents });
        handleMultiValidate(e, e.target.value, key);
    }

    const [docError, setDocError] = useState([]);

    const handleChangeDate = (e, name) => {
        let data = { name: name, value: moment(e.$d).format(dateFormat()) }
        setState({ ...state, [data.name]: data.value })
        handleValidations(data);
    };

    const handleValidations = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "visa_type_id":
                err.visa_type_id = validate_emptyField(input.value);
                break;
            case "valid_from":
                err.valid_from = validate_emptyField(input.value);
                break;
            case "valid_till":
                err.valid_till = validate_emptyField(input.value);
                break;
            case "document_number":
                err.document_number = validates_Integer(input.value);
                break;
            case "status":
                err.status = validate_emptyField(input.value);
                break;

            case "i9document_upload_id":
                err.i9document_upload_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        if (!err[input.name] && err[input.name] !== undefined) {
            delete err[input.name];
        }

        setError(err);
    };

    const validateAll = () => {
        let {
            visa_type_id,
            valid_from, valid_till,
            document_number, status,
        } = state;
        let errors = {};
        errors.visa_type_id = validate_emptyField(visa_type_id);
        errors.valid_from = validate_emptyField(valid_from);
        errors.valid_till = validate_emptyField(valid_till);
        errors.document_number = validate_emptyField(document_number);
        errors.status = validate_emptyField(status);
        errors.visa_documents = validate_emptyField(state.visa_documents[0].new_document_id);
        errors.i9_documents = validate_emptyField(state.i9_documents[0].new_document_id);
        // errors.support_documents = validate_emptyField(state.support_documents[0].new_document_id);
        // errors.visa_document_type_id = validate_emptyField(state.support_documents[0].visa_document_type_id);
        return errors;
    };


    const multiValidations = () => {
        const { support_documents } = state;
        let newDocError = [];

        support_documents.forEach((value, index) => {
            let error = {};

            error.visa_document_type_id = validate_emptyField(value.visa_document_type_id);
            error.new_document_id = validate_emptyField(value.new_document_id);
            // if (value.visa_document_type_id !== '') {
            //     error.new_document_id = validate_emptyField(value.new_document_id);
            // } else {
            //     error.new_document_id = '';
            // }

            newDocError.push(error);
        });

        setDocError(newDocError); // Update docError state
        console.log(docError, "errorrrr")
        return newDocError;
    }


    const handleSubmit = () => {
        let errors = validateAll();
        let documentErrors = multiValidations();
        if (isValid(errors) && isValidMulti(documentErrors)) {
            if (props.form === "add") {

                storeVisa();
            } else if (props.form === "update") {

                updateVisa();
            }
        } else {

            setError(errors);
        }
    };


    const storeVisa = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        setLoading(true)
        EmployeeAPI.storeVisa(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getVisa()
                    props.closeForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateVisa = () => {
        let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateVisa(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getVisa();
                    props.closeForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    const deleteVisa = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteVisa(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getVisa();
                    props.closeForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleUpdate = (key) => {
        let data = list[key];
        let updateData = {
            visa_type_id: data.visa_type_id,
            valid_from: data.valid_from,
            valid_till: data.valid_till,
            document_number: data.document_number,
            status: data.status,
            i9_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_url: data.i9_documents[0].i9_document_url,
                    document_name: data.i9_documents[0].i9_document_name,
                }
            ],
            visa_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_url: data.visa_documents[0].visa_document_url,
                    document_name: data.visa_documents[0].visa_document_name,
                }
            ],
            support_documents: []
        };

        data.support_documents.forEach(ele => {
            let obj = {
                id: ele.id,
                document_name: ele.document_name,
                visa_document_type_id: ele.visa_document_type_id,
                visa_document_type_name: ele.visa_document_type_name,
                new_document_id: "",
                visa_document_type_url: ele.visa_document_type_url
            }
            updateData.support_documents.push(obj);
        });

        getVisaDocumentTypeDropdown(data.visa_type_id);
        setError({});
        props.closeForm("update");
        setEditdeleteId(data.id);
        setState(updateData);
    }

    const handleCloseForm = () => {
        setState(
            {
                visa_type_id: "",
                valid_from: "",
                valid_till: "",
                document_number: "",
                status: "",
                i9_documents: [
                    {
                        id: "",
                        new_document_id: "",
                        document_url: "",
                        document_name: "",
                    }
                ],
                visa_documents: [
                    {
                        id: "",
                        new_document_id: "",
                        document_url: "",
                        document_name: "",
                    }
                ],
                support_documents: [
                    {
                        id: "",
                        visa_document_type_id: "",
                        visa_document_type_name: "",
                        new_visa_document_upload_id: "",
                        document_name: "",
                    }
                ]
            }
        );
        setError({});
        props.closeForm(false)
    }

    const addSupportDocuments = () => {
        let newObj = {
            id: "",
            visa_document_type_id: "",
            visa_document_type_name: "",
            new_visa_document_upload_id: "",
            document_name: "",
        }
        let support_documents = state.support_documents;
        support_documents.push(newObj)
        setState({ ...state, support_documents })
    }
    const removeSupportDocuments = (index) => {
        let supportingDocs = state.support_documents;
        supportingDocs.splice(index, 1);
        let newArr = { ...state, support_documents: supportingDocs };
        setState({ ...newArr });
    }


    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }

    return (
        <Box py={1}>
            {
                ["add", "update"].includes(props.form) ? (
                    <Fragment>
                        <Box sx={{ height: "45vh", overflowY: 'scroll' }}>
                            <Grid container spacing={0}>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>

                                        <CustomSelect
                                            label='Visa Type'
                                            options={visaTypeDropdown}
                                            name='visa_type_id'
                                            value={state.visa_type_id}
                                            onChange={handleChange}
                                            commonSelect
                                        />
                                        <Text errorText> {error.visa_type_id ? error.visa_type_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'document_number',
                                                value: state.document_number,
                                                type: 'text',
                                                inputProps: { minLength: 5, maxLength: 10 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Visa Number</Text>}
                                        />
                                        <Text errorText> {error.document_number ? error.document_number : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={4} md={4} sm={4} xs={4}>
                                    <Box p={2} >
                                        {/* <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'status',
                                            value: state.status,
                                            type: 'text'
                                        }}
                                        handleChange={handleChange}
                                        clientInput
                                        labelText={<Text largeLabel>Active</Text>}
                                    /> */}

                                        <CustomSelect
                                            label='Status'
                                            options={[{ id: 1, name: "Active" }, { id: 0, name: "In-Active" }]}
                                            name='status'
                                            value={state.status}
                                            onChange={handleChange}
                                            commonSelect
                                        />
                                        <Text errorText> {error.status ? error.status : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={4} md={4} sm={4} xs={4}>
                                    <Box p={2}>
                                        {/* <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'valid_from',
                                            value: state.valid_from,
                                            type: 'text'
                                        }}
                                        handleChange={handleChange}
                                        clientInput
                                        labelText={<Text largeLabel>Date Of Issue</Text>}
                                    /> */}

                                        <Datepicker
                                            labelText={"Date Of Issue"}
                                            name={"valid_from"}
                                            value={state.valid_from}
                                            maxDate={moment().format(dateFormat())}
                                            onChange={(e) => handleChangeDate(e, "valid_from")}
                                        />
                                        <Text errorText> {error.valid_from ? error.valid_from : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={4} md={4} sm={4} xs={4}>
                                    <Box p={2} >
                                        {/* <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'valid_till',
                                            value: state.valid_till,
                                            type: 'text'
                                        }}
                                        handleChange={handleChange}
                                        clientInput
                                        labelText={<Text largeLabel>Date Of End</Text>}
                                    /> */}

                                        <Datepicker
                                            labelText={"Date Of End"}
                                            name={"valid_till"}
                                            value={state.valid_till}
                                            minDate={state.valid_from}
                                            onChange={(e) => handleChangeDate(e, "valid_till")}
                                        />
                                        <Text errorText> {error.valid_till ? error.valid_till : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box p={2}>
                                        <FileInput
                                            name={"visa_documents"}
                                            FileName={state.visa_documents[0].document_name}
                                            handleChange={(e) => uploadDocs(e, false, "")}
                                            label={"Visa Document"}
                                            isDisabled={false} />
                                        <Text errorText>{error.visa_documents ? error.visa_documents : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box p={2}>
                                        <FileInput
                                            name={"i9_documents"}
                                            FileName={state.i9_documents[0].document_name}
                                            handleChange={(e) => uploadDocs(e, false, "")}
                                            label={"i-9 Document"}
                                            isDisabled={false} />
                                        <Text errorText>{error.i9_documents ? error.i9_documents : ""}</Text>
                                    </Box>
                                </Grid>
                            </Grid>
                            {
                                state.support_documents.map((item, key) => (

                                    <Grid container spacing={0} key={key}>
                                        <Grid lg={4} md={4} sm={4} xs={4}>
                                            <Box p={2}>
                                                <CustomSelect
                                                    label='Support Document Type'
                                                    options={visaDocumentTypeDropdown}
                                                    name='visa_document_type_id'
                                                    value={item.visa_document_type_id}
                                                    onChange={(e) => handleChangeSupportDocs(e, key)}
                                                    commonSelect
                                                />
                                                {docError[key] && <Text errorText> {docError[key].visa_document_type_id ? docError[key].visa_document_type_id : ""}</Text>}

                                            </Box>
                                        </Grid>
                                        <Grid lg={6} md={6} sm={6} xs={6}>
                                            <Box px={1} py={2}>
                                                <FileInput
                                                    name="new_document_id"
                                                    FileName={state.support_documents[key].document_name}
                                                    handleChange={(e) => uploadDocs(e, true, "support_documents", key)}
                                                    label={"Support Document"}
                                                    isDisabled={false} />
                                                {docError[key] && <Text errorText>{docError[key].new_document_id ? docError[key].new_document_id : ""}</Text>}
                                            </Box>
                                        </Grid>
                                        <Grid lg={2} md={2} sm={2} xs={2}>
                                            <Box p={2} sx={{ height: "100%", display: "flex", alignItems: "center", }}>
                                                {
                                                    state.support_documents.length - 1 == key ?
                                                        // <CustomButton add onClick={() => addSupportDocuments()}><Plus /></CustomButton> : null
                                                        <Add className={classes.add} onClick={() => addSupportDocuments()}></Add> : null
                                                }

                                                {
                                                    state.support_documents.length > 1 ?
                                                        // <CustomButton remove onClick={() => removeSupportDocuments(key)}><RemoveIcon sx={{ color: "#ffffff" }} /></CustomButton> : null
                                                        <Remove className={classes.minus} onClick={() => removeSupportDocuments(key)}></Remove> : null
                                                }


                                            </Box>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Box>


                        <Box my={2} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                            {
                                ["add", "update"].includes(props.form) ?
                                    <Button cancelBtn onClick={() => handleCloseForm()}>
                                        Cancel
                                    </Button> : null
                            }
                            <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                {
                                    props.form === "update" ? "Update" : props.form === "add" ? "Save" : null
                                }
                            </LoadingButton>
                        </Box>
                    </Fragment>
                ) :

                    (
                        <Fragment>

                            {
                                loading ?
                                    [1, 2, 3].map((item, key) => (
                                        <AccordionList
                                            key={key}
                                            serial_no={key + 1}
                                            accordionSummary={

                                                <Grid container spacing={0}>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box display={'flex'} alignItems={'center'} gap={2} >
                                                            <Skeleton variant="circular" sx={{ width: "24px", height: "24px" }} />
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "2rem" }} />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            }
                                            accordionDetails={
                                                <Box
                                                    sx={{
                                                        height: "80px",
                                                        borderRadius: "10px",
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-around",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Skeleton variant="rounded" width={'100%'} height={'100%'} borderRadius={"10px"} />
                                                </Box>

                                            }
                                        />
                                    )) : null
                            }

                            {!loading &&
                                list.map((item, key) => (
                                    <AccordionList
                                        key={key}
                                        accordionSummary={
                                            <Box
                                                sx={{ width: "100%" }}
                                                display={"flex"}
                                                justifyContent={"space-between"}
                                                alignItems={"center"}
                                            >
                                                <Box display={'flex'} alignItems={'center'} >
                                                    <img src={visaSvg} alt="passport" />
                                                    <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>Visa</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                    >
                                                        {item.document_number}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                    >
                                                        {item.visa_type_name}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                    >
                                                        {item.lable}
                                                    </Typography>
                                                </Box>

                                                <Box mr={4} display={'flex'} alignItems={'center'}>
                                                    {
                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                            <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.documents[0].document_url)} /> :
                                                            <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                <img src={DownloadSvg} alt="download" />
                                                            </BlackToolTip>
                                                    }
                                                </Box>
                                            </Box>
                                        }
                                        accordionDetails={
                                            <Box
                                                sx={{
                                                    backgroundColor: "#F5F6F6",
                                                    height: "80px",
                                                    borderRadius: "10px",
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "space-around",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        Valid from
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "600",
                                                            color: "092333",
                                                        }}
                                                    >
                                                        {item.valid_from}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        Valid till
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "600",
                                                            color: "092333",
                                                        }}
                                                    >
                                                        {item.valid_till}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                            margin: "10px 0px",
                                                        }}
                                                    >
                                                        I9 Documents
                                                    </Typography>

                                                    {
                                                        item.passport_document_name === "" ? "--" :
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }} >
                                                                    <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.i9_documents[0].i9_document_url)} style={{ cursor: "pointer" }} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "#0C75EB",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        onClick={() => downloadDoc(item.i9_documents[0].i9_document_url)}
                                                                    >
                                                                        {item.i9_documents[0].i9_document_name}
                                                                    </Typography>
                                                                </Box> : <Text mediumBlack>{item.i9_documents[0].i9_document_name}</Text>
                                                    }
                                                </Box>


                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                            margin: "10px 0px",
                                                        }}
                                                    >
                                                        Visa Documents
                                                    </Typography>

                                                    {
                                                        item.passport_document_name === "" ? "--" :
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }} >
                                                                    <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.visa_documents[0].visa_document_url)} style={{ cursor: "pointer" }} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "#0C75EB",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        onClick={() => downloadDoc(item.visa_documents[0].visa_document_url)}
                                                                    >
                                                                        {item.visa_documents[0].visa_document_name}
                                                                    </Typography>
                                                                </Box> : <Text mediumBlack>{item.visa_documents[0].visa_document_name}</Text>
                                                    }
                                                </Box>

                                                <Box sx={{ width: "100%" }} >
                                                    <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                                        {
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                                                                <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} /> :
                                                                <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                    <img src={EditSvg} alt="edit" style={{ cursor: "default" }} />
                                                                </BlackToolTip>
                                                        }
                                                        {
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_delete" && item.is_allowed == true))) ?
                                                                <img src={DeleteSvg} alt="delete" onClick={() => deleteVisa(item.id)} style={{ cursor: "pointer" }} /> :
                                                                <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                    <img src={DeleteSvg} alt="delete" style={{ cursor: "default" }} />
                                                                </BlackToolTip>
                                                        }
                                                    </Stack>
                                                </Box>
                                            </Box>

                                        }
                                    />
                                ))
                            }

                            {
                                !loading && list.length === 0 ?
                                    <Box sx={{ height: "40vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box>
                                            <img src={NoDataImg} alt='no-data' />
                                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                                <Typography sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "600", color: "#092333" }}>
                                                    No Data Found
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box> : null
                            }

                        </Fragment>
                    )
            }
        </Box>
    );
}