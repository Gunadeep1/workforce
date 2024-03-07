import React, { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Grid, Stack, Skeleton } from '@mui/material';
import UserProfileStyles from '../UserProfileStyles';
// import Browse from '../../../../../assets/svg/Browse.svg';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validates_emailId, validates_Integer, validate_contact_number, empty_usContact, validate_charWithSpace, empty_name } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import ClientsAPI from '../../../../../apis/admin/clients/ClientsApi';
// import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import UserSvg from "../../../../../assets/svg/user2.svg";
// import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
// import FileInput from '../../../../../components/muiFileInput/FileInput';
import NoDataImg from "../../../../../assets/images/no-data.png";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import crossIcon from '../../../../../assets/svg/crossIcon.svg';
import ConfirmImg from '../../../../../assets/svg/confirm-BG-img.svg';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "16px",
    },
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));

export default function ContactDetails() {
    const classes = UserProfileStyles();
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null);
    const [list, setList] = useState([]);
    const [formData, setFormData] = useState(
        {
            first_name: "",
            middle_name: "",
            last_name: "",
            contact_number: "",
            email_id: "",
            ext: "",
            mobile_number: ""
        }
    );
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = React.useState(false);
    // const [relationshipDropdown, setRelationshipDropdown] = useState([]);
    // const [visaTypeDropdown, setVisaTypeDropdown] = useState([]);
    // const [skillsDropdown, setSkillsDropdown] = useState([])

    useEffect(() => {
        // getRelationshipDropdown();
        // getVisaTypeDropdown();
        // getskillsDropdown();
        // getSkills();

        console.log(editdeleteId);
        // console.log(relationshipDropdown);
        // console.log(visaTypeDropdown);
        getContactsDetails();
        // eslint-disable-next-line
    }, []);

    const getContactsDetails = () => {
        setLoading(true);
        ClientsAPI.getContactsDetails('client', location.state.data.id).then((response) => {
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

    // const getRelationshipDropdown = () => {
    //     let search = "";
    //     CommonApi.getRelationshipDropdown(search).then((response) => {
    //         if (response.data.statusCode == 1003) {
    //             setRelationshipDropdown(response.data.data);
    //         } else {
    //             addErrorMsg(response.data.message);
    //         }
    //     });
    // }

    // const getVisaTypeDropdown = () => {
    //     let search = "";
    //     CommonApi.VisaTypeDropdown(search).then((response) => {
    //         if (response.data.statusCode == 1003) {
    //             setVisaTypeDropdown(response.data.data);
    //         } else {
    //             addErrorMsg(response.data.message);
    //         }
    //     });
    // }

    // const getskillsDropdown = () => {
    //     let search = "";
    //     CommonApi.skillsDropdown(search).then((response) => {
    //         if (response.data.statusCode == 1003) {
    //             setSkillsDropdown(response.data.data);
    //         } else {
    //             addErrorMsg(response.data.message);
    //         }
    //     });
    // }

    /* fun is for Uploading Documents */
    // const uploadDocs = (value) => {
    //     // setLoader(true);
    //     const formData = new FormData();
    //     formData.append("files", value.target.files[0]);
    //     formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
    //     CommonApi
    //         .documentUpload(formData, LocalStorage.getAccessToken())
    //         .then((response) => {
    //             if (response.data.statusCode == 1003) {
    //                 let docInfo = response.data.data
    //                 let newStateObj = state;
    //                 newStateObj[value.target.name][0].new_document_id = docInfo.id;
    //                 newStateObj[value.target.name][0].document_name = value.target.files[0].name;
    //                 setState({ ...newStateObj });
    //             } else {
    //                 addErrorMsg(response.data.message);
    //             }
    //         });
    // };

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
        if (e.target.name === "mobile_number" || e.target.name === "contact_number") {
            let number = contactNumberConvert(e);
            setFormData({ ...formData, [e.target.name]: number });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }

        handleValidations(e.target);
    };

    // const handleChangeDate = (e, name) => {
    //     let data = { name: name, value: moment(e.$d).format(dateFormat()) }
    //     setState({ ...state, [data.name]: data.value })
    //     handleValidations(data);
    // };


    const handleValidations = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "first_name":
                err.first_name = validate_charWithSpace(input.value, 'first ');
                break;
            case "middle_name":
                if (input.value === "") {
                    err.middle_name = "";
                } else {
                    err.middle_name = empty_name(input.value, 'middle ');
                }
                break;
            case "last_name":
                err.last_name = validate_charWithSpace(input.value, 'last ');
                break;
            case "contact_number":
                err.contact_number = empty_usContact(input.value, "Phone number");
                break;
            case "email_id":
                err.email_id = validates_emailId(input.value);
                break;
            case "ext":
                err.ext = validates_Integer(input.value);
                break;
            case "mobile_number":
                err.mobile_number = validate_contact_number(input.value, "Mobile Number");
                break;
            default:
                break;
        }
        // console.log(err, " +++");
        setError(err);
    }

    const validateAll = () => {
        let {
            first_name,
            middle_name,
            last_name,
            // contact_number,
            email_id,
            ext,
            mobile_number,
        } = formData;
        let errors = {};
        errors.first_name = validate_charWithSpace(first_name, 'first ');
        if (middle_name === "") {
            errors.middle_name = "";
        } else {
            errors.middle_name = empty_name(middle_name, 'middle ');
        }
        errors.last_name = validate_charWithSpace(last_name, 'last ');
        // errors.contact_number = validate_contact_number(contact_number, "Contact Number");
        errors.email_id = validates_emailId(email_id);
        errors.ext = validates_Integer(ext);
        errors.mobile_number = validate_contact_number(mobile_number, "Mobile Number");
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        console.log(errors, " errors");
        if (isValid(errors)) {
            if (form === "add") {
                storeContactsDetails()
            } else if (form === "update") {
                updateContactsDetails();
            }
            // console.log("succeee");
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const storeContactsDetails = () => {
        let data = {
            request_id: LocalStorage.uid(),
            company_id: location.state.data.id,
            contacts: [formData]
        };

        setLoading(true)
        ClientsAPI.storeContactsDetails("client", data,).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getContactsDetails()
                    setForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateContactsDetails = () => {
        let data = {
            request_id: LocalStorage.uid(),
            company_id: location.state.data.id,
            contacts: [formData]
        };
        setLoading(true)
        ClientsAPI.updateContactsDetails("client", location.state.data.id, data,).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getContactsDetails();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const deleteContactsDetails = (id) => {
        let data = { company_id: location.state.data.id, request_id: LocalStorage.uid() };
        setLoading(true)
        ClientsAPI.deleteContactsDetails("client", id, data,).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getContactsDetails();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                    setOpen(false);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleUpdate = (key) => {
        let data = list[key];
        let updateData = data;
        setForm("update");
        setError({})
        setEditdeleteId(data.id);
        setFormData(updateData);
    }

    const openAddForm = () => {
        let obj = {
            first_name: "",
            middle_name: "",
            last_name: "",
            contact_number: "",
            email_id: "",
            ext: "",
            mobile_number: ""
        };
        setFormData(obj)
        setError({})
        setForm("add")
    }

    // const downloadDoc = (fileUrl) => {
    //     FileSaver.saveAs(fileUrl);
    // }

    const handleCancel = () => {
        setError({});
        setForm(false);
    }


    const handleOpenDialog = (id) => {
        setOpen(true);
        setEditdeleteId(id)
    };
    const handleClose = () => {
        setOpen(false);
        setEditdeleteId(null)
    };


    return (
        <Box p={2}>

            <Box my={2} mx={1} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >

                <Text profileTitle>
                    {form === "add" ? "Add Contact Details" : form === "update" ? "Update Contact Details" : "Contact Details"}
                </Text>

                {
                    !["add", "update"].includes(form) ?
                        <Box display={"flex"} justifyContent={"end"}>
                            <Button addNew startIcon={<Plus />} onClick={() => openAddForm()}>Add New</Button>
                        </Box> : null
                }
            </Box>


            {
                ["add", "update"].includes(form) ? (
                    <Fragment>
                        <Box sx={{ minHeight: "52vh", }}>
                            <Grid container spacing={0}>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'first_name',
                                                value: formData.first_name,
                                                inputProps: { maxLength: 50 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>First Name</Text>}
                                        />
                                        <Text errorText> {error.first_name ? error.first_name : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'middle_name',
                                                value: formData.middle_name,
                                                inputProps: { maxLength: 50 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Middle Name <span className={classes.optional}>(Optional)</span></Text>}
                                        />
                                        <Text errorText> {error.middle_name ? error.middle_name : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'last_name',
                                                value: formData.last_name,
                                                inputProps: { maxLength: 50 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Last Name</Text>}
                                        />
                                        <Text errorText> {error.last_name ? error.last_name : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'email_id',
                                                value: formData.email_id,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Mail ID</Text>}
                                        />
                                        <Text errorText> {error.email_id ? error.email_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'mobile_number',
                                                value: formData.mobile_number,
                                                inputProps: { maxLength: 12 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Mobile Number</Text>}
                                        />
                                        <Text errorText> {error.mobile_number ? error.mobile_number : ""}</Text>
                                    </Box>
                                </Grid>

                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'ext',
                                                value: formData.ext,
                                                // type: 'text'
                                                inputProps: { maxLength: 4 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Extension</Text>}
                                        />


                                        <Text errorText> {error.ext ? error.ext : ""}</Text>
                                    </Box>
                                </Grid>

                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'contact_number',
                                                value: formData.contact_number,
                                                inputProps: { maxLength: 12 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Phone Number <span className={classes.optional}>(Optional)</span></Text>}
                                        />
                                        <Text errorText> {error.contact_number ? error.contact_number : ""}</Text>
                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>

                        <Box pt={6} px={1} display={"flex"} justifyContent={"end"} gap={3}>
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
                                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                                    <Box display={'flex'} alignItems={'center'} >
                                                        <img src={UserSvg} alt="passport" />
                                                        <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>
                                                            {item.first_name}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={4} md={4} sm={6} xs={6} display={'flex'} >
                                                    <Box>
                                                        <Typography
                                                            sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                        >
                                                            {item.email_id}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={4} md={4} sm={6} xs={6} display={'flex'} >
                                                    <Box>
                                                        <Typography
                                                            sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                        >
                                                            {item.mobile_number}
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
                                                {/* <Grid item lg={1} md={1} sm={3} xs={3}>
                                                    <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}><img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.documents[0].document_url)} /></Box>
                                                </Grid> */}
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
                                                                Phone Number
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
                                                                {item.contact_number ? item.contact_number : '--'}
                                                            </Typography>

                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={12}>

                                                    </Grid>

                                                    <Grid item lg={3} md={3} sm={3} xs={12}>

                                                    </Grid>

                                                    <Grid item lg={3} md={3} sm={3} xs={12}>
                                                        <Box sx={{ width: "100%", margin: "12px 0px", }} >
                                                            <Stack direction={'row'} spacing={2} justifyContent={'end'}>
                                                                <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} />
                                                                <img src={DeleteSvg} alt="delete" onClick={() => handleOpenDialog(item.id)} style={{ cursor: "pointer" }} />
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


            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                    {/* <CloseIcon sx={{ color: "rgba(38, 38, 38, 1)" }} /> */}
                </IconButton>
                <DialogContent sx={{ margin: "20px", }}>
                    <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                        <img src={ConfirmImg} alt="warning" />
                    </Box>

                    <Box my={3}>
                        <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                            Are You Sure?
                        </Typography>
                        <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                            Do You Really Wish To Delete The Contact.
                        </Typography>
                    </Box>

                    <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                        <Button no onClick={() => handleClose()}>
                            No
                        </Button>
                        <LoadingButton deleteBtn loading={loading} onClick={() => deleteContactsDetails(editdeleteId)}>
                            Yes, Delete
                        </LoadingButton>
                    </Box>

                </DialogContent>
            </BootstrapDialog>

        </Box>
    );
}