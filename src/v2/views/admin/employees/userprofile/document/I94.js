import React, { useState, useEffect, Fragment } from "react";
import { Box, Typography, Grid, Stack, Skeleton } from "@mui/material";
import {
    isValid,
    validate_emptyField,
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
import I94Svg from "../../../../../assets/svg/i94Icon.svg";
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import NoDataImg from "../../../../../assets/images/no-data.png";
import FileInput from '../../../../../components/muiFileInput/FileInput';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Datepicker from '../../../../../components/datePicker/Date';
import { dateFormat } from '../../../../../utils/utils';
import moment from "moment";
import FileSaver from 'file-saver';
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import EmployeeCreateAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LoaderIcon from '../../../../../assets/svg/sandtimer.svg';
import workAuthStyles from "./workAuthStyles";
import disableFile from '../../../../../assets/client/disableDownload.svg';

export default function ControlledAccordions(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = workAuthStyles();
    const location = useLocation();
    const [list, setList] = useState([]);
    const [state, setState] = useState(
        {
            country_id: "",
            valid_from: "",
            expiry_type: "",
            valid_till: "",
            document_number: "",
            status: "",
            documents: [
                {
                    id: "",
                    new_document_id: "",
                    docName: ""
                }
            ]
        }
    );
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [formLoader, setFormLoader] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null);
    const [countriesList, setCountriesList] = useState([]);

    useEffect(() => {
        getCountriesList();
        getI94();
        // eslint-disable-next-line
    }, []);

    const getI94 = () => {
        setLoading(true)
        EmployeeAPI.getI94(location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setList(response.data.data);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const getCountriesList = () => {
        let search = "";
        CommonApi.getCountryList(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setCountriesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    /* fun is for Uploading Documents */
    const uploadDocs = (value) => {
        setFormLoader(true);
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload("i94-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data
                    const data = {
                        request_id: LocalStorage.uid(),
                        document_id: response.data.data.id
                    }
                    EmployeeCreateAPI.ocrDocumentUpload('i94', data).then((res) => {
                        if (res.data.statusCode == 1003) {
                            setFormLoader(false);
                            state.document_number = res.data.data.document_number
                            state.documents[0].new_document_id = response.data.data.id
                            state.documents[0].docName = value.target.files[0].name
                            setState({ ...state })
                            handleValidations({ name: value.target.name, value: docInfo.id });
                        } else {
                            setFormLoader(false);
                            state.documents[0].new_document_id = response.data.data.id
                            state.documents[0].docName = value.target.files[0].name
                            setState({ ...state })
                            handleValidations({ name: value.target.name, value: docInfo.id });
                        }
                    })
                } else {
                    addErrorMsg(response.data.message);
                    setFormLoader(false);
                }
            });
    };

    const deleteDoc = () => {
        state.documents[0].new_document_id = ''
        state.documents[0].docName = ''
        setState({ ...state })
    }

    const handleChange = (e) => {
        setState({
            ...state, [e.target.name]: e.target.value
        })
        handleValidations(e.target);
    };


    const handleChangeDate = (e, name) => {
        let data = { name: name, value: moment(e.$d).format(dateFormat()) }
        setState({ ...state, [data.name]: data.value })
        handleValidations(data);
    };

    const handleValidations = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "country_id":
                err.country_id = validate_emptyField(input.value);
                break;
            case "valid_from":
                err.valid_from = validate_emptyField(input.value);
                break;
            case "expiry_type":
                err.expiry_type = validate_emptyField(input.value);
                break;
            case "valid_till":
                err.valid_till = validate_emptyField(input.value);
                break;
            case "document_number":
                err.document_number = validate_emptyField(input.value);
                break;
            case "status":
                err.status = validate_emptyField(input.value);
                break;
            case "documents":
                err.documents = validate_emptyField(input.value);
                break;

            default:
                break;
        }
        setError(err);
    };

    const validateAll = () => {
        let { country_id,
            valid_from,
            expiry_type,
            valid_till,
            document_number,
            status, } = state;
        let errors = {};
        errors.country_id = validate_emptyField(country_id);
        errors.valid_from = validate_emptyField(valid_from);
        errors.valid_till = validate_emptyField(valid_till);
        errors.expiry_type = validate_emptyField(expiry_type);
        errors.document_number = validate_emptyField(document_number);
        errors.status = validate_emptyField(status);
        if (props.form === "update") {
            if (state.documents[0].id === "") {
                errors.documents = validate_emptyField(state.documents[0].new_document_id);
            }
        } else {
            errors.documents = validate_emptyField(state.documents[0].new_document_id);
        }
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (props.form === "add") {
                storeI94();
            } else if (props.form === "update") {
                updateI94();
            }
        } else {
            console.log(errors);
            setError(errors);
        }
    };



    const storeI94 = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };

        console.log(data, "  Store data");

        // return false;

        setLoading(true)
        EmployeeAPI.storeI94(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getI94()
                    props.closeForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateI94 = () => {
        let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateI94(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getI94();
                    props.closeForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    const deleteI94 = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteI94(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getI94();
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
            country_id: data.country_id,
            valid_from: data.valid_from,
            expiry_type: data.expiry_type,
            valid_till: data.valid_till,
            document_number: data.document_number,
            status: data.status,
            documents: [
                {
                    id: data.documents[0].id,
                    new_document_id: "",
                    docName: data.documents[0].name,
                    document_url: data.documents[0].document_url,
                }
            ]
        }
        props.closeForm("update");
        setEditdeleteId(data.id);
        setState(updateData);
    }

    const handleCloseForm = () => {
        setState(
            {
                country_id: "",
                valid_from: "",
                expiry_type: "",
                valid_till: "",
                document_number: "",
                status: "",
                documents: [
                    {
                        id: "",
                        new_document_id: "",
                        docName: ""
                    }
                ]
            }
        );
        setError({});
        props.closeForm(false)
    }

    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }

    return (
        <Box py={1}>
            {
                ["add", "update"].includes(props.form) ? (
                    formLoader ?
                        <Box className={classes.ViewContainer}>
                            <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                <img src={LoaderIcon} height={100} width={100} alt='loading' />
                            </Stack>
                        </Box> :
                        <Fragment>
                            <Box sx={{ minHeight: "45vh" }}>
                                <Grid container spacing={0}>
                                    <Grid lg={12} md={12} sm={12} xs={12}>
                                        <Box p={2}>
                                            <FileInput
                                                name={"documents"}
                                                FileName={state.documents[0].docName}
                                                handleChange={(e) => uploadDocs(e)}
                                                label={"Upload Document"}
                                                isDisabled={false}
                                                handleDelete={() => deleteDoc()}
                                                actionState={state.documents[0].docName ? 1 : ''}
                                            />
                                            <Text errorText>{error.documents ? error.documents : ""}</Text>
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
                                                    inputProps: { minLength: 5, maxLength: 11 }
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Document Number</Text>}
                                            />
                                            <Text errorText> {error.document_number ? error.document_number : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2} >
                                            <SearchSelect
                                                options={countriesList}
                                                name='country_id'
                                                value={state.country_id}
                                                onChange={handleChange}
                                                labelText={<Text largeLabel>Issued Country</Text>}
                                                scrollTrue
                                            />
                                            <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={3} xs={3}>
                                        <Box p={2}>
                                            <CustomSelect
                                                label='Status'
                                                options={[{ id: 1, name: "Active" }, { id: 2, name: "In-Active" }]}
                                                name='status'
                                                value={state.status}
                                                onChange={handleChange}
                                                commonSelect
                                            />
                                            <Text errorText> {error.status ? error.status : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={3} xs={3}>
                                        <Box p={2}>
                                            <CustomSelect
                                                label='Expiry Type'
                                                options={[{ id: 1, name: "Duration of Status" }, { id: 2, name: "Has Expiry" }]}
                                                name='expiry_type'
                                                value={state.expiry_type}
                                                onChange={handleChange}
                                                commonSelect
                                            />
                                            <Text errorText> {error.expiry_type ? error.expiry_type : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={6} xs={12}>
                                        <Box p={2}>
                                            <Datepicker
                                                labelText={"Date Of Issue"}
                                                name={"valid_from"}
                                                maxDate={moment().format(dateFormat())}
                                                value={state.valid_from}
                                                onChange={(e) => handleChangeDate(e, "valid_from")}
                                            />
                                            <Text errorText> {error.valid_from ? error.valid_from : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={6} xs={12}>
                                        <Box p={2} >
                                            <Datepicker
                                                labelText={"Date Of End"}
                                                name={"valid_till"}
                                                minDate={state.valid_from}
                                                value={state.valid_till}
                                                onChange={(e) => handleChangeDate(e, "valid_till")}
                                            />
                                            <Text errorText> {error.valid_till ? error.valid_till : ""}</Text>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mt={2} px={1} display={"flex"} justifyContent={"end"} gap={3}>
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
                            {
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
                                                    <img src={I94Svg} alt="passport" />
                                                    <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>I94</Typography>
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
                                                        {item.valid_till}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: `${item.status === 1 ? "#4ABE43" : "#092333"}` }}
                                                    >
                                                        {item.status === 1 ? "Active" : "In-Active"}
                                                    </Typography>
                                                </Box>

                                                <Box mr={4} display={'flex'} alignItems={'center'}>
                                                    {
                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                            <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.documents[0].document_url)} /> :
                                                            <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                <img src={disableFile} alt="edit" style={{ cursor: "default" }} />
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
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        Status
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
                                                        {item.status === 1 ? "Active" : "In-Active"}
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
                                                        Issued country_id
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
                                                        {item.country_name}
                                                    </Typography>
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
                                                                <img src={DeleteSvg} alt="delete" onClick={() => deleteI94(item.id)} style={{ cursor: "pointer" }} /> :
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