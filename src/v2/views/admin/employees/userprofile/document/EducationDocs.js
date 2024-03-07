import React, { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Grid, Stack, Skeleton } from '@mui/material';
// import Browse from '../../../../../assets/svg/Browse.svg';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validate_emptyField, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import EducationSvg from "../../../../../assets/svg/educationIcon.svg";
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import FileSvg from "../../../../../assets/svg/File.svg";
import FileSaver from 'file-saver';
import FileInput from '../../../../../components/muiFileInput/FileInput';
import NoDataImg from "../../../../../assets/images/no-data.png";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Datepicker from '../../../../../components/datePicker/Date';
import { dateFormat } from '../../../../../utils/utils';
import moment from "moment";
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import disablePlus from '../../../../../assets/client/disablePlus.svg';
import disableFile from '../../../../../assets/client/disableDownload.svg';

export default function EducationDocs({ list, getEducationIndex }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null)

    const [state, setState] = useState({
        education_level_id: "",
        start_date: "",
        end_date: "",
        field_of_study: "",
        university_name: "",
        state_id: "",
        country_id: "",
        documents: [
            {
                id: "",
                new_document_id: "",
                docName: ""
            }
        ]
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [countriesList, setCountriesList] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [educationLevelsDropdown, setEducationLevelsDropdown] = useState([]);


    useEffect(() => {
        getCountriesList();
        getEducationLevelsDropdown();
        // eslint-disable-next-line
    }, []);


    const getEducationLevelsDropdown = () => {
        let search = "";
        CommonApi.educationLevelsDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setEducationLevelsDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
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

    const getStatesList = (country_id) => {
        CommonApi.getStatesList(country_id).then((response) => {
            if (response.data.statusCode == 1003) {
                setStatesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }


    /* fun is for Uploading Documents */
    const uploadDocs = (value) => {
        // setLoader(true);
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload("education-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data
                    let docArr = [{
                        id: state.documents[0].id,
                        new_document_id: docInfo.id,
                        docName: value.target.files[0].name
                    }]
                    handleValidations({ name: value.target.name, value: docInfo.id })
                    setState({ ...state, documents: docArr })
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };

    const handleChange = (e) => {
        if (e.target.name === "country_id") {
            setState({ ...state, [e.target.name]: e.target.value, state_id: "" })
            getStatesList(e.target.value)
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
        }
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
            case "education_level_id":
                err.education_level_id = validate_emptyField(input.value);
                break;
            case "start_date":
                err.start_date = validate_emptyField(input.value);
                break;
            case "end_date":
                err.end_date = validate_emptyField(input.value);
                break;
            case "field_of_study":
                err.field_of_study = validate_emptyField(input.value);
                break;
            case "university_name":
                err.university_name = validate_emptyField(input.value);
                break;
            case "state_id":
                err.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                err.country_id = validate_emptyField(input.value);
                break;
            case "documents":
                err.documents = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        console.log(err, " +++");
        setError(err);
    }

    const validateAll = () => {
        let { education_level_id, start_date, end_date, field_of_study, university_name, state_id, country_id } = state;
        let errors = {};
        errors.education_level_id = validate_emptyField(education_level_id);
        errors.start_date = validate_emptyField(start_date);
        errors.end_date = validate_emptyField(end_date);
        errors.field_of_study = validate_emptyField(field_of_study);
        errors.university_name = validate_emptyField(university_name);
        errors.state_id = validate_emptyField(state_id);
        errors.country_id = validate_emptyField(country_id);
        if (form === "update") {
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
            if (form === "add") {
                storeEmployeeEducation()
            } else if (form === "update") {
                updateEmployeeEducation();
            }
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const storeEmployeeEducation = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        // let data = { ...state, education_level_id: 1, state_id: 1, country_id: 1, request_id: LocalStorage.uid(), employee_id: location.state.id };

        console.log(data, "  Store data");

        // return false;

        setLoading(true)
        EmployeeAPI.storeEmployeeEducation(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getEducationIndex();
                    setForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateEmployeeEducation = () => {
        let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateEmployeeEducation(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getEducationIndex();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const deleteEmployeeEducation = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteEmployeeEducation(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getEducationIndex();
                    setForm(false);
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
            education_level_id: data.education_level_id,
            start_date: data.start_date,
            end_date: data.end_date,
            field_of_study: data.field_of_study,
            university_name: data.university_name,
            state_id: data.state_id,
            country_id: data.country_id,
            documents: [
                {
                    id: data.documents.lenth > 0 ? data.documents[0].id : '',
                    new_document_id: "",
                    docName: data.documents.lenth > 0 ? data.documents[0].name : ''
                }
            ]
        }
        if (data.country_id !== "") {
            getStatesList(data.country_id);
        }
        setError({})
        setForm("update");
        setEditdeleteId(data.id);
        setState(updateData);
    }

    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }

    const openAddForm = () => {
        setState({
            education_level_id: "",
            start_date: "",
            end_date: "",
            field_of_study: "",
            university_name: "",
            state_id: "",
            country_id: "",
            documents: [
                {
                    id: "",
                    new_document_id: "",
                    docName: ""
                }
            ]
        })
        setError({})
        setForm("add")
    }


    return (
        <Box py={1}>

            {
                !["add", "update"].includes(form) ?
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
                        <Box my={2} display={"flex"} justifyContent={"end"}>
                            <Button addNew startIcon={<Plus />} onClick={() => openAddForm()}>Add New</Button>
                        </Box> :
                        <Box my={2} display={"flex"} justifyContent={"end"}>
                            <Button addNewDisable startIcon={<img src={disablePlus} alt='add' />}>Add New</Button>
                        </Box> : null
            }

            {
                ["add", "update"].includes(form) ? (
                    <Fragment>
                        <Box sx={{ minHeight: "53vh", }}>
                            <Grid container spacing={0}>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box p={2}>
                                        <FileInput
                                            name={"documents"}
                                            // value={state.documents[0].docName}
                                            FileName={state.documents[0].docName}
                                            handleChange={uploadDocs}
                                            label={"Upload Offer Letter"} isDisabled={false} />
                                        <Text errorText> {error.documents ? error.documents : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={12} xs={12}>
                                    <Box p={2} >
                                        <CustomSelect
                                            label='Education Level'
                                            options={educationLevelsDropdown}
                                            name='education_level_id'
                                            value={state.education_level_id}
                                            onChange={handleChange}
                                            commonSelect
                                        />
                                        <Text errorText> {error.education_level_id ? error.education_level_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={3} md={3} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Datepicker
                                            labelText={"Start Date"}
                                            name={"start_date"}
                                            value={state.start_date}
                                            maxDate={moment().format(dateFormat())}
                                            minDate={state.start_date}
                                            onChange={(e) => handleChangeDate(e, "start_date")}
                                        />
                                        <Text errorText> {error.start_date ? error.start_date : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={3} md={3} sm={6} xs={12}>
                                    <Box p={2} >
                                        <Datepicker
                                            labelText={"End Date"}
                                            name={"end_date"}
                                            value={state.end_date}
                                            onChange={(e) => handleChangeDate(e, "end_date")}
                                        />
                                        <Text errorText> {error.end_date ? error.end_date : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'field_of_study',
                                                value: state.field_of_study,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Field Of Study</Text>}
                                        />
                                        <Text errorText> {error.field_of_study ? error.field_of_study : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'university_name',
                                                value: state.university_name,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>University Name</Text>}
                                        />
                                        <Text errorText> {error.university_name ? error.university_name : ""}</Text>
                                    </Box>
                                </Grid>
                                {/* <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'state_id',
                                                value: state.state_id,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>State</Text>}
                                        />
                                        <Text errorText> {error.state_id ? error.state_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'country_id',
                                                value: state.country_id,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Country</Text>}
                                        />
                                        <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                    </Box>
                                </Grid> */}


                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2} >
                                        {/* <CustomSelect
                                            label='Country'
                                            options={countriesList}
                                            name='country_id'
                                            value={state.country_id}
                                            onChange={handleChange}
                                            commonSelect
                                        /> */}

                                        <SearchSelect
                                            options={countriesList}
                                            name='country_id'
                                            value={state.country_id}
                                            onChange={handleChange}
                                            labelText={<Text largeLabel>Country</Text>}
                                            scrollTrue
                                        />

                                        <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        {/* <CustomSelect
                                            label='State'
                                            options={statesList}
                                            name='state_id'
                                            value={state.state_id}
                                            onChange={handleChange}
                                            commonSelect
                                        /> */}

                                        <SearchSelect
                                            options={statesList}
                                            name='state_id'
                                            value={state.state_id}
                                            onChange={handleChange}
                                            labelText={<Text largeLabel>State</Text>}
                                            scrollTrue
                                        />

                                        <Text errorText> {error.state_id ? error.state_id : ""}</Text>
                                    </Box>
                                </Grid>

                            </Grid>

                        </Box>

                        <Box mt={1} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                            {
                                ["add", "update"].includes(form) ?
                                    <Button cancelBtn onClick={() => setForm(false)}>
                                        Cancel
                                    </Button> : null
                            }
                            <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                {
                                    form === "update" ? "Update" : form === "add" ? "Save" : null
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
                                            <Grid container spacing={0}>
                                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                                    <Box display={'flex'} alignItems={'center'} >
                                                        <img src={EducationSvg} alt="passport" />
                                                        <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>
                                                            {item.education_level}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                    <Box>
                                                        <Typography
                                                            sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                        >
                                                            {item.field_of_study}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                    <Box>
                                                        <Typography
                                                            sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                        >
                                                            {item.university_name}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                                    <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                        {
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.documents[0].document_url)} /> :
                                                                <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                    <img src={disableFile} alt="edit" style={{ cursor: "default" }} />
                                                                </BlackToolTip>
                                                        }
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        }
                                        accordionDetails={
                                            <Box
                                                py={3} px={5}
                                                sx={{
                                                    backgroundColor: "#F5F6F6",
                                                    minHeight: "100px",
                                                    borderRadius: "10px",
                                                }}>
                                                <Grid container spacing={0}>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                Education Level
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.education_level}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                Field of Study
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.field_of_study}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4}>
                                                        <Box sx={{ width: "100%", margin: "12px 0px", }} >
                                                            <Stack direction={'row'} spacing={2} justifyContent={'end'}>
                                                                {
                                                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                                                                        <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} /> :
                                                                        <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                            <img src={EditSvg} alt="edit" style={{ cursor: "default" }} />
                                                                        </BlackToolTip>
                                                                }
                                                                {
                                                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_delete" && item.is_allowed == true))) ?
                                                                        <img src={DeleteSvg} alt="delete" onClick={() => deleteEmployeeEducation(item.id)} style={{ cursor: "pointer" }} /> :
                                                                        <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                            <img src={DeleteSvg} alt="delete" style={{ cursor: "default" }} />
                                                                        </BlackToolTip>
                                                                }
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={0}>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                University Name
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.university_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                Start Date
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.start_date}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                End Date
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.end_date}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={0}>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                Country
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.country_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                State
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                    fontWeight: "600",
                                                                    color: "092333",
                                                                    margin: "10px 0px",
                                                                }}
                                                            >
                                                                {item.state_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4}>
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
                                                                Certificate
                                                            </Typography>
                                                            {
                                                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                    <Box
                                                                        sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }}
                                                                    >
                                                                        <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.documents.length > 0 && item.documents[0].document_url)} style={{ cursor: "pointer" }} />
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "14px",
                                                                                fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                                fontWeight: "600",
                                                                                color: "#0C75EB",
                                                                                cursor: "pointer"
                                                                            }}
                                                                            onClick={() => downloadDoc(item.documents.length > 0 && item.documents[0].document_url)}
                                                                        >
                                                                            {item.documents.length > 0 && item.documents[0].name}
                                                                        </Typography>
                                                                    </Box> :
                                                                    <Text mediumBlack> {item.documents.length > 0 && item.documents[0].name}</Text>
                                                            }
                                                        </Box>
                                                    </Grid>
                                                </Grid>
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
                                                <Typography sx={{ fontSize: "16px", fontFamily: "Nunito, Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "600", color: "#092333" }}>
                                                    No Data Found
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box> : null
                            }

                        </Fragment>
                    )}

        </Box>
    );
}