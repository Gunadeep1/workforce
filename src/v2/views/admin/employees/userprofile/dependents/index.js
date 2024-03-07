import React, { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Grid, Stack, Skeleton } from '@mui/material';
// import Browse from '../../../../../assets/svg/Browse.svg';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { empty_name, isValid, validate_charWithSpace, validate_emptyField, validate_ssn, validate_usContact, validates_emailId, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import DependentSvg from "../../../../../assets/svg/dependentSvg.svg";
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import FileInput from '../../../../../components/muiFileInput/FileInput';
import NoDataImg from "../../../../../assets/images/no-data.png";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import FileSvg from "../../../../../assets/svg/File.svg";
import FileSaver from 'file-saver';
import Datepicker from '../../../../../components/datePicker/Date';
import { dateFormat } from '../../../../../utils/utils';
import moment from "moment";
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import disablePlus from '../../../../../assets/client/disablePlus.svg';
import disableFile from '../../../../../assets/client/disableDownload.svg';

export default function EducationDocs() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null)
    const [list, setList] = useState([]);
    const [state, setState] = useState(
        {
            relationship_id: "",
            first_name: "",
            last_name: "",
            middle_name: "",
            email_id: "",
            contact_number: "",
            dob: "",
            visa_type_id: "",
            ssn: "",
            passport_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: ""
                }
            ],
            i94_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: "",
                }
            ],


            // passport_document_id: "",
            // passport_new_document_id: "",
            // passport_document_id_name: "",
            // i94_document_id: "",
            // i94_new_document_id: "",
            // i94_document_id_name: ""
        }


    );
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [relationshipDropdown, setRelationshipDropdown] = useState([]);
    const [visaTypeDropdown, setVisaTypeDropdown] = useState([]);

    useEffect(() => {
        getRelationshipDropdown();
        getVisaTypeDropdown();
        getDependents();
        // eslint-disable-next-line
    }, []);

    const getDependents = () => {
        setLoading(true)
        EmployeeAPI.getDependents(location.state.id).then((response) => {
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

    const getRelationshipDropdown = () => {
        let search = "";
        CommonApi.getRelationshipDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setRelationshipDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

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



    /* fun is for Uploading Documents */
    const uploadDocs = (value, slug) => {


        // setLoader(true);
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload(slug, formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data
                    let newStateObj = state;
                    newStateObj[value.target.name][0].new_document_id = docInfo.id;
                    newStateObj[value.target.name][0].document_name = value.target.files[0].name;
                    handleDocumentValidations({ name: value.target.name, value: docInfo.id });
                    setState({ ...newStateObj });
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };



    const contactNumberConvert = (e) => {
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
            return `${first}-${middle}-${last}`;
        } else if (input.length > 3) {
            return `${first}-${middle}`;
        } else if (input.length >= 0) {
            return input;
        }
    };


    const handleChange = (e) => {

        if (e.target.name === "contact_number" || e.target.name === "ssn") {
            let number = contactNumberConvert(e);
            setState({ ...state, [e.target.name]: number })
            handleValidations({ name: e.target.name, value: number });
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
            handleValidations(e.target);
        }

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
            case "relationship_id":
                err.relationship_id = validate_emptyField(input.value);
                break;
            case "first_name":
                err.first_name = validate_charWithSpace(input.value);
                break;
            case "last_name":
                err.last_name = validate_charWithSpace(input.value);
                break;
            case "middle_name":
                err.middle_name = empty_name(input.value);
                break;
            case "email_id":
                err.email_id = validates_emailId(input.value);
                break;
            case "contact_number":
                err.contact_number = validate_usContact(input.value);
                break;
            case "dob":
                err.dob = validate_emptyField(input.value);
                break;
            case "visa_type_id":
                err.visa_type_id = validate_emptyField(input.value);
                break;
            case "ssn":
                err.ssn = validate_ssn(input.value);
                break;
            default:
                break;
        }
        console.log(err, " +++");
        setError(err);
    }

    const handleDocumentValidations = (input) => {
        let err = error;
        switch (input.name) {
            case "passport_documents":
                err.passport_documents = validate_emptyField(input.value);
                break;
            case "i94_documents":
                err.i94_documents = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const handleCancel = () => {
        setForm(false)
        setError({});
        getDependents()
    }

    const validateAll = () => {
        let {
            relationship_id,
            first_name,
            last_name,
            // middle_name,
            email_id,
            contact_number,
            dob,
            visa_type_id,
            ssn,
        } = state;
        let errors = {};
        errors.relationship_id = validate_emptyField(relationship_id);
        errors.first_name = validate_emptyField(first_name);
        errors.last_name = validate_emptyField(last_name);
        // errors.middle_name = validate_emptyField(middle_name);
        errors.email_id = validate_emptyField(email_id);
        errors.contact_number = validate_emptyField(contact_number);
        errors.contact_number = validate_emptyField(contact_number);
        errors.dob = validate_emptyField(dob);
        errors.visa_type_id = validate_emptyField(visa_type_id);
        errors.ssn = validate_emptyField(ssn);

        // i94_documents, passport_documents

        if (form === "update") {
            if (state.passport_documents[0].new_document_id == "" && state.passport_documents[0].id == "") {
                errors.passport_documents = validate_emptyField("");
            }
            if (state.i94_documents[0].new_document_id == "" && state.i94_documents[0].id == "") {
                errors.i94_documents = validate_emptyField("");
            }
        } else {
            errors.passport_documents = validate_emptyField(state.passport_documents[0].new_document_id);
            errors.i94_documents = validate_emptyField(state.i94_documents[0].new_document_id);
        }

        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        console.log(errors, " errors");
        if (isValid(errors)) {
            if (form === "add") {
                storeDependents()
            } else if (form === "update") {
                updateDependents();
            }
            // console.log("succeee");
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const storeDependents = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        // let data = { ...state, education_level_id: 1, state_id: 1, country_id: 1, request_id: LocalStorage.uid(), employee_id: location.state.id };

        console.log(data, "  Store data");

        // return false;

        setLoading(true)
        EmployeeAPI.storeDependents(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getDependents()
                    setForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateDependents = () => {
        let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateDependents(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getDependents();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const deleteDependents = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteDependents(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getDependents();
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
        let updateData = data;
        updateData.passport_documents = [
            {
                id: data.passport_document_id,
                new_document_id: "",
                document_name: data.passport_document_name
            }
        ];
        updateData.i94_documents = [
            {
                id: data.i94_document_id,
                new_document_id: "",
                document_name: data.i94_document_name,
            }
        ];

        setForm("update");
        setError({})
        setEditdeleteId(data.id);
        setState(updateData);
    }

    const openAddForm = () => {
        let obj = {

            relationship_id: "",
            first_name: "",
            last_name: "",
            middle_name: "",
            email_id: "",
            contact_number: "",
            dob: "",
            visa_type_id: "",
            ssn: "",
            passport_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: ""
                }
            ],
            i94_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: "",
                }
            ],
        }
        setState(obj)
        setError({})
        setForm("add")
    }

    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }


    return (
        <Box>
            <Box py={2} px={1}>

                <Box my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                    <Typography sx={{ margin: '0px 0px 0px 10px', fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", color: `${false ? "rgba(115, 115, 115, 1)" : "rgba(38, 38, 38, 1)"}` }}>
                        Dependents
                    </Typography>
                    {
                        !["add", "update"].includes(form) ?
                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                                <Box display={"flex"} justifyContent={"end"}>
                                    <Button addNew startIcon={<Plus />} onClick={() => openAddForm()}>Add New</Button>
                                </Box> :
                                <Box display={"flex"} justifyContent={"end"}>
                                    <Button addNewDisable startIcon={<img src={disablePlus} alt='add' />}>Add New</Button>
                                </Box> : null
                    }
                </Box>


                {
                    ["add", "update"].includes(form) ? (
                        <Fragment>
                            <Box sx={{ height: "55vh", overflow: "auto" }}>
                                <Grid container spacing={0}>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'first_name',
                                                    value: state.first_name,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>First Name</Text>}
                                            />
                                            <Text errorText> {error.first_name ? error.first_name : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'middle_name',
                                                    value: state.middle_name,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Middle Name<span style={{ color: "#C7CCD3" }}>(optional)</span></Text>}
                                            />
                                            <Text errorText> {error.middle_name ? error.middle_name : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2} >
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'last_name',
                                                    value: state.last_name,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Last Name</Text>}
                                            />
                                            <Text errorText> {error.last_name ? error.last_name : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2} >
                                            <Datepicker
                                                labelText={"Date of Birth"}
                                                name={"dob"}
                                                value={state.dob}
                                                onChange={(e) => handleChangeDate(e, "dob")}
                                            />
                                            <Text errorText> {error.dob ? error.dob : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            {/* <CustomSelect
                                                label='Visa Type'
                                                options={visaTypeDropdown}
                                                name='visa_type_id'
                                                value={state.visa_type_id}
                                                onChange={handleChange}
                                                commonSelect
                                            /> */}


                                            <SearchSelect
                                                options={visaTypeDropdown}
                                                name='visa_type_id'
                                                value={state.visa_type_id}
                                                onChange={handleChange}
                                                labelText={<Text largeLabel>Visa Type</Text>}
                                                scrollTrue
                                            />

                                            <Text errorText> {error.visa_type_id ? error.visa_type_id : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <CustomSelect
                                                label='Relationship'
                                                options={relationshipDropdown}
                                                name='relationship_id'
                                                value={state.relationship_id}
                                                onChange={handleChange}
                                                commonSelect
                                            />
                                            <Text errorText> {error.relationship_id ? error.relationship_id : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2} my={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'ssn',
                                                    value: state.ssn,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>SSN</Text>}
                                            />
                                            <Text errorText> {error.ssn ? error.ssn : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
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
                                                    type: 'text'
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
                                                    name: 'contact_number',
                                                    value: state.contact_number,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Mobile Number</Text>}
                                            />
                                            <Text errorText> {error.contact_number ? error.contact_number : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>

                                        <Box p={2}>
                                            <FileInput
                                                name={"passport_documents"}
                                                FileName={state.passport_documents[0].document_name}
                                                handleChange={(e) => uploadDocs(e, 'passport-document')}
                                                label={"Passport"} isDisabled={false}
                                            />
                                            <Text errorText> {error.passport_documents ? error.passport_documents : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>

                                        {console.log(state.i94_documents, " state.i94_documents[0].document_name")}
                                        <Box p={2}>
                                            <FileInput
                                                name={"i94_documents"}
                                                FileName={state.i94_documents[0].document_name}
                                                handleChange={(e) => uploadDocs(e, 'i94-document')}
                                                label={"I-94"} isDisabled={false}
                                            />
                                            <Text errorText> {error.i94_documents ? error.i94_documents : ""}</Text>
                                        </Box>

                                    </Grid>
                                </Grid>
                            </Box>

                            <Box my={2} px={1} sx={{ backgroundColor: "#FFFFFF", width: "100%", display: "flex", justifyContent: "end", gap: 3 }} >
                                {
                                    ["add", "update"].includes(form) ?
                                        <Button cancelBtn onClick={() => handleCancel()}>
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

                                {
                                    !loading &&
                                    list.map((item, key) => (
                                        <AccordionList
                                            key={key}
                                            serial_no={key + 1}
                                            accordionSummary={
                                                <Grid container spacing={0}>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box display={'flex'} alignItems={'center'} >
                                                            <img src={DependentSvg} alt="passport" />
                                                            <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>
                                                                {`${item.first_name} ${item.middle_name} ${item.last_name}`}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.relationship_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.visa_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                            {
                                                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                    <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.passport_document_url)} /> :
                                                                    <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                        <img src={disableFile} alt="download" style={{ cursor: "default" }} />
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
                                                        backgroundColor: "#F9FCFF",
                                                        minHeight: "100px",
                                                        borderRadius: "10px",
                                                    }}>
                                                    <Grid container spacing={0}>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    Visa Type
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
                                                                    {item.visa_name}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    Contact Number
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
                                                                    {item.contact_number}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    Email Id
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
                                                                    {item.email_id}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                            <img src={DeleteSvg} alt="delete" onClick={() => deleteDependents(item.id)} style={{ cursor: "pointer" }} /> :
                                                                            <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                                <img src={DeleteSvg} alt="delete" style={{ cursor: "default" }} />
                                                                            </BlackToolTip>
                                                                    }
                                                                </Stack>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={0}>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    Date of Birth
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
                                                                    {item.dob}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    SSN
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
                                                                    {item.ssn}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    Passport Document
                                                                </Typography>

                                                                {
                                                                    item.passport_document_name === "" ? "--" :
                                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }} >
                                                                                <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.passport_document_url)} style={{ cursor: "pointer" }} />
                                                                                <Typography
                                                                                    sx={{
                                                                                        fontSize: "14px",
                                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                                        fontWeight: "600",
                                                                                        color: "#0C75EB",
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                    onClick={() => downloadDoc(item.passport_document_url)}
                                                                                >
                                                                                    {item.passport_document_name}
                                                                                </Typography>
                                                                            </Box> : <Text mediumBlack>{item.passport_document_name}</Text>
                                                                }
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
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
                                                                    I94 Document
                                                                </Typography>
                                                                {
                                                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }} >
                                                                            <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.i94_document_url)} style={{ cursor: "pointer" }} />
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: "14px",
                                                                                    fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                                    fontWeight: "600",
                                                                                    color: "#0C75EB",
                                                                                    cursor: "pointer"
                                                                                }}
                                                                                onClick={() => downloadDoc(item.i94_document_url)}
                                                                            >
                                                                                {item.i94_document_name}
                                                                            </Typography>
                                                                        </Box> : <Text mediumBlack> {item.i94_document_name}</Text>
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
                                        <Box sx={{ height: "55vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                        )}

            </Box>
        </Box>
    );
}