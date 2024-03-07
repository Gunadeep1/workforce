import React, { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Grid, Stack, Skeleton } from '@mui/material';
// import Browse from '../../../../../assets/svg/Browse.svg';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validate_emptyField, validates_Integer, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import SkillsSvg from "../../../../../assets/svg/skillsSvg.svg";
// import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
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
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import disablePlus from '../../../../../assets/client/disablePlus.svg';
import disableFile from '../../../../../assets/client/disableDownload.svg';

const expertiseDropdown = [
    {
        id: "advancedbeginner",
        value: "Advanced Beginner"
    },
    {
        id: "competent",
        value: "Competent"
    },
    {
        id: "proficient",
        value: "Proficient"
    },
    {
        id: "expert",
        value: "Expert"
    },
    {
        id: "novice",
        value: "Novice"
    }
]
export default function Skills() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null)
    const [list, setList] = useState([]);
    const [state, setState] = useState(
        {
            skill_id: "",
            experience_years: "",
            certification: "",
            expertise: "",
            certification_date: "",
            certification_status: "",
            documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: "",
                }
            ]
        }
    );
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [relationshipDropdown, setRelationshipDropdown] = useState([]);
    const [visaTypeDropdown, setVisaTypeDropdown] = useState([]);
    const [skillsDropdown, setSkillsDropdown] = useState([])

    useEffect(() => {
        getRelationshipDropdown();
        getVisaTypeDropdown();
        getskillsDropdown();
        getSkills();

        console.log(relationshipDropdown);
        console.log(visaTypeDropdown);
        // eslint-disable-next-line
    }, []);

    const getSkills = () => {
        setLoading(true);
        EmployeeAPI.getSkillsList(location.state.id).then((response) => {
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

    const getskillsDropdown = () => {
        let search = "";
        CommonApi.skillsDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setSkillsDropdown(response.data.data);
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
            .documentUpload("skill-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data
                    let newStateObj = state;
                    newStateObj[value.target.name][0].new_document_id = docInfo.id;
                    newStateObj[value.target.name][0].document_name = value.target.files[0].name;
                    handleDocumentValidations({ name: "documents", value: docInfo.id });
                    setState({ ...newStateObj });
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };



    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
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
            case "skill_id":
                err.skill_id = validate_emptyField(input.value);
                break;
            case "experience_years":
                err.experience_years = validates_Integer(input.value);
                break;
            case "certification":
                err.certification = validate_emptyField(input.value);
                break;
            case "expertise":
                err.expertise = validate_emptyField(input.value);
                break;
            case "certification_date":
                err.certification_date = validate_emptyField(input.value);
                break;
            case "certification_status":
                err.certification_status = validate_emptyField(input.value);
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
            case "documents":
                err.documents = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let {
            skill_id,
            experience_years,
            certification,
            expertise,
            certification_date,
            certification_status,
        } = state;
        let errors = {};
        errors.skill_id = validate_emptyField(skill_id);
        errors.experience_years = validate_emptyField(experience_years);
        errors.certification = validate_emptyField(certification);
        errors.expertise = validate_emptyField(expertise);
        errors.certification_date = validate_emptyField(certification_date);
        errors.certification_status = validate_emptyField(certification_status);
        if (form === "update") {
            if (state.documents[0].id === "" && state.documents[0].new_document_id === "") {
                errors.documents = validate_emptyField("");
            }
        } else {
            errors.documents = validate_emptyField(state.documents[0].new_document_id);
        }

        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        console.log(errors, " errors");
        if (isValid(errors)) {
            if (form === "add") {
                storeSkillsDetails()
            } else if (form === "update") {
                updateSkillsDetails();
            }
            // console.log("succeee");
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const storeSkillsDetails = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        // let data = { ...state, education_level_id: 1, state_id: 1, country_id: 1, request_id: LocalStorage.uid(), employee_id: location.state.id };

        console.log(data, "  Store data");

        // return false;

        setLoading(true)
        EmployeeAPI.storeSkillsDetails(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getSkills()
                    setForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateSkillsDetails = () => {
        let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateSkillsDetails(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getSkills();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const deleteSkillsDetails = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteSkillsDetails(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getSkills();
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
        updateData.documents = [
            {
                id: data.documents[0].id,
                new_document_id: "",
                document_name: data.documents[0].name,
            }
        ];
        setForm("update");
        setError({})
        setEditdeleteId(data.id);
        setState(updateData);
    }

    const openAddForm = () => {
        let obj = {
            skill_id: "",
            experience_years: "",
            certification: "",
            expertise: "",
            certification_date: "",
            certification_status: "",
            documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: "",
                }
            ]
        };
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
                        {form === "add" ? "Add New Skill" : form === "update" ? "Update Skill" : "Skills"}
                    </Typography>
                    {
                        !["add", "update"].includes(form) ?
                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
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
                            <Box sx={{ height: "54vh", overflowY: 'scroll' }}>
                                <Grid container spacing={0}>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>

                                            {/* <CustomSelect
                                                label='Skill Name'
                                                options={skillsDropdown}
                                                name='skill_id'
                                                value={state.skill_id}
                                                onChange={handleChange}
                                                commonSelect
                                            /> */}

                                            <SearchSelect
                                                options={skillsDropdown}
                                                name='skill_id'
                                                value={state.skill_id}
                                                onChange={handleChange}
                                                labelText={<Text largeLabel>Skill Name</Text>}
                                                scrollTrue
                                            />

                                            <Text errorText> {error.skill_id ? error.skill_id : ""}</Text>
                                        </Box>

                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <CustomSelect
                                                label='Level Of Expertise'
                                                options={expertiseDropdown}
                                                name='expertise'
                                                value={state.expertise}
                                                onChange={handleChange}
                                                commonSelect
                                            />
                                            <Text errorText> {error.expertise ? error.expertise : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2} >
                                            <CustomSelect
                                                label='Status'
                                                options={[{ id: 1, value: "Active" }, { id: 0, value: "In-Active" }]}
                                                name='certification_status'
                                                value={state.certification_status}
                                                onChange={handleChange}
                                                commonSelect
                                            />
                                            <Text errorText> {error.certification_status ? error.certification_status : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'certification',
                                                    value: state.certification,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Certification ID or URL</Text>}
                                            />
                                            <Text errorText> {error.certification ? error.certification : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <Datepicker
                                                labelText={"Certified Date"}
                                                name={"certification_date"}
                                                value={state.certification_date}
                                                onChange={(e) => handleChangeDate(e, "certification_date")}
                                            />
                                            <Text errorText> {error.certification_date ? error.certification_date : ""}</Text>
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'experience_years',
                                                    value: state.experience_years,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Years of Experience</Text>}
                                            />
                                            <Text errorText> {error.experience_years ? error.experience_years : ""}</Text>
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={2}>
                                            <FileInput
                                                name={"documents"}
                                                FileName={state.documents[0].document_name}
                                                handleChange={uploadDocs}
                                                label={"Upload Certificate "} isDisabled={false} />
                                            <Text errorText> {error.documents ? error.documents : ""}</Text>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box my={2} px={1} display={"flex"} justifyContent={"end"} gap={3}>
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

                                {
                                    !loading &&
                                    list.map((item, key) => (
                                        <AccordionList
                                            key={key}
                                            serial_no={key + 1}
                                            accordionSummary={
                                                <Grid container spacing={0}>
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <Box display={'flex'} alignItems={'center'} >
                                                            <img src={SkillsSvg} alt="passport" />
                                                            <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>
                                                                {item.skill_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={6} xs={6} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.expertise}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={6} xs={6} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.experience_years}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={2} md={2} sm={6} xs={6} display={'flex'} justifyContent={'center'}>
                                                        <Box>

                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: `${item.certification_status === 1 ? "#4ABE43" : "#092333"}` }}
                                                            >
                                                                {item.certification_status === 1 ? "Active" : "In-Active"}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    {/* <Grid item lg={3} md={3} sm={6} xs={6} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.visa_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid> */}
                                                    <Grid item lg={1} md={1} sm={3} xs={3}>
                                                        <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                            {
                                                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                    <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.documents[0].document_url)} /> :
                                                                    <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                        <img src={disableFile} alt="dpwnload" style={{ cursor: "default" }} />
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
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }} pr={2}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Certification ID /URL
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "#0C75EB",
                                                                        margin: "10px 0px",
                                                                        textDecoration: "underline",
                                                                        overflowWrap: "break-word",
                                                                        wordWrap: "break-word",
                                                                        hyphens: "auto",
                                                                    }}
                                                                >
                                                                    {item.certification}
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
                                                                    Certified Date
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
                                                                    {item.certification_date}
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
                                                                    Certificate
                                                                </Typography>

                                                                {
                                                                    item.passport_document_name === "" ? "--" :
                                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }} >
                                                                                <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.documents[0].document_url)} style={{ cursor: "pointer" }} />
                                                                                <Typography
                                                                                    sx={{
                                                                                        fontSize: "14px",
                                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                                        fontWeight: "600",
                                                                                        color: "#0C75EB",
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                    onClick={() => downloadDoc(item.documents[0].document_url)}
                                                                                >
                                                                                    {item.documents[0].name}
                                                                                </Typography>
                                                                            </Box> : <Text mediumBlack>{item.documents[0].name}</Text>
                                                                }
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
                                                                            <img src={DeleteSvg} alt="delete" onClick={() => deleteSkillsDetails(item.id)} style={{ cursor: "pointer" }} /> :
                                                                            <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                                <img src={DeleteSvg} alt="delete" style={{ cursor: "default" }} />
                                                                            </BlackToolTip>
                                                                    }
                                                                </Stack>
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
        </Box >
    );
}