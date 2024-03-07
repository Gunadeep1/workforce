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
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import EducationSvg from "../../../../../assets/svg/educationIcon.svg";
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import NoDataImg from "../../../../../assets/images/no-data.png";
import FileInput from '../../../../../components/muiFileInput/FileInput';
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
// import CustomSelect from '../../../../../components/customSelect/CustomSelect';

export default function EducationDocs() {

    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null)
    const [list, setList] = useState([]);
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

    useEffect(() => {
        console.log(loading);
        // getEducation();
        // eslint-disable-next-line
    }, []);

    const getEducation = () => {
        setLoading(true)
        EmployeeAPI.getEducation(location.state.id).then((response) => {
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
    const uploadDocs = (value) => {
        // setLoader(true);
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload("invoice-document",formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {

                    console.log(response.data.data, " response.data");
                    let docInfo = response.data.data
                    let docArr = [{
                        new_document_id: docInfo.id,
                        docName: value.target.files[0].name
                    }]
                    setState({ ...state, documents: docArr })
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };



    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
        handleValidations(e);
    };


    const handleValidations = (e) => {
        let input = e.target;
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
            // console.log("succeee");
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const storeEmployeeEducation = () => {
        // let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        let data = { ...state, education_level_id: 1, state_id: 1, country_id: 1, request_id: LocalStorage.uid(), employee_id: location.state.id };

        console.log(data, "  Store data");

        // return false;

        setLoading(true)
        EmployeeAPI.storeEmployeeEducation(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getEducation()
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

        // let docs = { ...state.documents[0], id: "" }

        // {
        //     "request_id": "{{$guid}}",
        //     "employee_id": "@_Employee_Id",
        //     "education_level_id": "@_Id_from_education_level",
        //     "field_of_study": "@_Only_Alphabet",
        //     "state_id": "@_id_from_states",
        //     "country_id": "@_Id_from_countries",
        //     "university_name": "@_Only_Alphabet",
        //     "start_date": "@_Date",
        //     "end_date": "@_Date",
        //     "documents": [
        //       {
        //         "id": "Id_from_employee_mapped_documents",
        //         "new_document_id": "Id_from_temp_upload_documents"
        //       }
        //     ]
        //   }



        //store
        // {
        //     "request_id": "{{$guid}}",
        //     "employee_id": "@_Employee_Id",
        //     "education_level_id": "@_Id_from_education_levels",
        //     "field_of_study": "@_Only_Alphabet",
        //     "state_id": "@_Id_from_states",
        //     "country_id": "@_Id_from_countries",
        //     "university_name": "@_Only_Alphabet",
        //     "start_date": "@_Date",
        //     "end_date": "@_Date",
        //     "documents": [
        //       {
        //         "new_document_id": "Id_from_temp_upload_documents"
        //       }
        //     ]
        // }

        setLoading(true)
        EmployeeAPI.updateEmployeeEducation(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getEducation();
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
                    getEducation();
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
                    id: data.documents[0].id,
                    new_document_id: "",
                    docName: data.documents[0].name
                }
            ]
        }
        setForm("update");
        setEditdeleteId(data.id);
        setState(updateData);
    }

    // const openAddForm = () => {
    //     setError({})
    //     setForm("add")
    // }


    return (


        <Box sx={{ width: '100%', minHeight: "76vh", boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D", borderRadius: "8px" }}>
            <Box p={2}>

                <Box my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                    <Typography sx={{ margin: '0px 0px 0px 10px', fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", color: `${false ? "rgba(115, 115, 115, 1)" : "rgba(38, 38, 38, 1)"}` }}>
                        Invoice
                    </Typography>
                    {
                        !["add", "update"].includes(form) ?
                            <Box display={"flex"} justifyContent={"end"}>
                                <Button addNew startIcon={<Plus />} >Add New</Button>
                            </Box> : null
                    }
                </Box>


                {
                    ["add", "update"].includes(form) ? (
                        <Fragment>
                            <Box sx={{ minHeight: "54vh", }}>
                                <Grid container spacing={0}>
                                    <Grid lg={12} md={12} sm={12} xs={12}>
                                        <Box p={1}>
                                            <FileInput name={state.documents[0].docName} handleChange={uploadDocs} label={"Upload Offer Letter"} isDisabled={false} />
                                            <Text errorText></Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12}>

                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'education_level_id',
                                                    value: state.education_level_id,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Education Level</Text>}
                                            />
                                            <Text errorText> {error.education_level_id ? error.education_level_id : ""}</Text>
                                        </Box>

                                    </Grid>
                                    <Grid lg={3} md={3} sm={6} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'start_date',
                                                    value: state.start_date,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Start Date</Text>}
                                            />
                                            <Text errorText> {error.start_date ? error.start_date : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={6} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'end_date',
                                                    value: state.end_date,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>End Date</Text>}
                                            />
                                            <Text errorText> {error.end_date ? error.end_date : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={1}>
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
                                        <Box p={1}>
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
                                    <Grid lg={6} md={6} sm={6} xs={12}>
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
                                                labelText={<Text largeLabel>country_id</Text>}
                                            />
                                            <Text errorText> {error.country_id ? error.country_id : ""}</Text>
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
                                    list.map((item, key) => (
                                        <AccordionList
                                            key={key}
                                            serial_no={key + 1}
                                            accordionSummary={
                                                <Box
                                                    sx={{ width: "100%" }}
                                                    display={"flex"}
                                                    justifyContent={"space-between"}
                                                    alignItems={"center"}
                                                >
                                                    <Box display={'flex'} alignItems={'center'} >
                                                        <img src={EducationSvg} alt="passport" />
                                                        <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>Passport</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                        >
                                                            Electrics and Com...
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                        >
                                                            University of Taxas
                                                        </Typography>
                                                    </Box>

                                                    <Box mr={4} display={'flex'} alignItems={'center'}><img src={DownloadSvg} alt="download" /></Box>
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
                                                            22/05/1990
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
                                                            22/05/2030
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
                                                            Active
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
                                                            United State
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ width: "100%" }} >
                                                        <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                                            <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} />
                                                            <img src={DeleteSvg} alt="delete" onClick={() => deleteEmployeeEducation(item.id)} style={{ cursor: "pointer" }} />
                                                        </Stack>
                                                    </Box>
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