import { Avatar, Box, Button as MuiButton, Divider, FormControl, Grid, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, TextField, Typography, styled, Skeleton } from '@mui/material'
import { FiberManualRecord } from "@mui/icons-material"
import React, { useState } from 'react';
import { useEffect } from 'react';
import ArrowLeft from '../../../assets/svg/fi_arrow-left.svg'
import Text from '../../../components/customText/Text'
import MyProfileStyles from '../myProfile/MyProfileStyles'
import Input from '../../../components/input/Input'
import visible from "../../../assets/svg/eye.svg"
import invisible from "../../../assets/svg/NotVisible.svg"
import upload from "../../../assets/svg/fi_upload.svg"
import { empty_name, empty_usContact, isValid, validate_charWithSpace, validate_emptyField, validate_usContact, validates_emailId, validates_password } from '../../../components/Validation'
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils'
import UserProfileApi from '../../../apis/admin/userprofile/UserProfileApi'
import LocalStorage from '../../../utils/LocalStorage'
import Button from '../../../components/customButton/Button'
import { useNavigate } from 'react-router-dom';
import CommonApi from '../../../apis/CommonApi';


const MyDetails = ({ state, setState, classes, setAvatarData }) => {
    const [action, setAction] = useState("read");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUserProfileDetails();
        // eslint-disable-next-line
    }, []);

    const getUserProfileDetails = () => {
        setLoading(true);
        UserProfileApi.getUserProfileDetails().then((response) => {
            setTimeout(() => {
                setLoading(false);
                if (response.data.statusCode == 1003) {
                    setState(response.data.data);

                    // setState({ ...state, ...response.data.data});
                    const name = response.data.data.first_name + " " + response.data.data.last_name
                    setAvatarData(name);

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const [error, setError] = useState({});

    const handleChange = (e) => {
        if (e.target.name === "contact_number" || e.target.name === "alternate_contact_number") {
            let number = contactNumberConvert(e);
            setState({ ...state, [e.target.name]: number })
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
        } handleValidations(e);
    }
    const contactNumberConvert = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const input = value.replace(/\D/g, "").substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890"
        const first =
            name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number"
                ? input.substring(0, 3)
                : input.substring(0, 3);
        const middle =
            name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number"
                ? input.substring(3, 6)
                : input.substring(3, 5);
        const last =
            name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number"
                ? input.substring(6, 10)
                : input.substring(5, 9);

        if (
            input.length >
            (name == "contact_number" || name == "mobile_number" || name == "alternate_contact_number" ? 6 : 5)
        ) {
            return `${first}-${middle}-${last}`;
        } else if (input.length > 3) {
            return `${first}-${middle}`;
        } else if (input.length >= 0) {
            return input;
        }
    };

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagname) {
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
            case "alternate_contact_number":
                err.alternate_contact_number = empty_usContact(input.value,"contact Number");
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let { first_name, last_name, email_id, contact_number } = state;
        let errors = {};
        errors.first_name = validate_emptyField(first_name);
        errors.last_name = validate_emptyField(last_name);
        errors.email_id = validates_emailId(email_id);
        errors.contact_number = validate_emptyField(contact_number);
        return errors;
    }
    const updateUserProfileDetails = () => {

        let data = { ...state, request_id: LocalStorage.uid(), };
        UserProfileApi.updateUserProfileDetails(data).then((response) => {
            if (response.data.statusCode == 1003) {
                setAction("read");
                addSuccessMsg(response.data.message);
                getUserProfileDetails();
            } else {
                console.log(response.data.message)
                addErrorMsg(response.data.message);
            }
        });
    }


    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            updateUserProfileDetails();
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    return (
        <Box px={4} pt={3} pb={4} className={action === 'update' ? classes.myDetailsBoxExtended : classes.myDetailsBox} style={{ width: "100%", boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D", borderRadius: "8px", position: "relative" }}>
            <Typography className={classes.myDetails}>My Details</Typography>
            <Box className={action === "update" ? classes.editButtonAnimation : classes.saveButtonAnimation} >
                <Button
                    outlineBlueAuto={action === "read" ? true : false}
                    blueBtnSave={action === "update" ? true : false}

                    sx={{ borderRadius: "8px !important", height: "35px !important", minWidth: "86px !important", fontSize: "14px !important" }}
                    onClick={() => action === "update" ? handleSubmit() : setAction("update")}
                >
                    {
                        action === "update" ? "Save" : "Edit"
                    }
                </Button>
            </Box>
            <Box pt={3}>
                {loading ? (
                    <Box>
                        <Grid container spacing={0}>
                            {
                                [1, 2, 3, 4, 5, 6].map(() => (
                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Skeleton variant="rounded" width={'100%'} height={'54px'} borderRadius={"10px"} />
                                        </Box>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                ) : (
                    <Grid container spacing={3} >
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Box>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'first_name',
                                        value: state.first_name,
                                        type: 'text',
                                        disabled: action === "update" ? false : true

                                    }}
                                    handleChange={handleChange}
                                    clientInput
                                    labelText={<Text largeLabel>First Name</Text>}
                                />
                                <Text errorText>{error.first_name ? error.first_name : ""}</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'middle_name',
                                        value: state.middle_name,
                                        type: 'text',
                                        disabled: action === "update" ? false : true

                                    }}
                                    handleChange={handleChange}
                                    labelText={<Text largeLabel>Middle Name <span className={classes.optional}>(Optional)</span></Text>}
                                    clientInput
                                />
                                <Text errorText>{error.middle_name ? error.middle_name : ""}</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'last_name',
                                        value: state.last_name,
                                        type: 'text',
                                        disabled: action === "update" ? false : true

                                    }}
                                    handleChange={handleChange}
                                    labelText={<Text largeLabel>Last Name</Text>}
                                    clientInput
                                />
                                <Text errorText>{error.last_name ? error.last_name : ""}</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Box>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'email_id',
                                        value: state.email_id,
                                        type: 'text',
                                        disabled: action === "update" ? false : true
                                    }}
                                    handleChange={handleChange}
                                    labelText={<Text largeLabel>Email ID</Text>}
                                    clientInput

                                />
                                <Text errorText>{error.email_id ? error.email_id : ""}</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'contact_number',
                                        value: state.contact_number,
                                        type: 'text',
                                        inputProps: { maxLength: 12 },
                                        disabled: action === "update" ? false : true

                                    }}
                                    handleChange={handleChange}
                                    labelText={<Text largeLabel>Contact Number</Text>}
                                    clientInput
                                />
                                <Text errorText>{error.contact_number ? error.contact_number : ""}</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'alternate_contact_number',
                                        value: state.alternate_contact_number,
                                        type: 'text',
                                        inputProps: { maxLength: 12 },
                                        disabled: action === "update" ? false : true

                                    }}
                                    handleChange={handleChange}
                                    labelText={<Text largeLabel>Alternate Contact Number <span className={classes.optional}>(Optional)</span></Text>}
                                    clientInput
                                />
                                <Text errorText>{error.alternate_contact_number ? error.alternate_contact_number : ""}</Text>
                            </Box>
                        </Grid>
                    </Grid>
                )
                }
            </Box>
        </Box>
    )
}

const MyProfile = () => {
    const classes = MyProfileStyles();
    const btnArr = ["My Details", "Change Password"];
    const [current, setCurrent] = useState("My Details");
    const [state, setState] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email_id: "",
        contact_number: "",
        alternate_contact_number: "",
        reference_id: "",
        profile_picture_url: "",
        documents: [
            {
                new_document_id: "",
                document_url: "",
            }
        ],
    });
    const [avatarData, setAvatarData] = useState("");
    const navigate = useNavigate();


    const PasswordField = (name, value, onChange, placeholder) => {
        const [showPassword, setShowPassword] = useState({
            old_password: false,
            password: false,
            confirm_password: false
        })

        const handlePasswordVisibility = (field, event) => {
            event.preventDefault();
            setShowPassword({ ...showPassword, [field]: !showPassword[field] });
        };

        return (
            <FormControl fullWidth
                className={classes.endAdornmentControl}
            >
                <TextField
                    className={classes.endAdornmentInput}
                    onFocus='false'
                    placeholder={placeholder}
                    margin="dense"
                    type={showPassword["old_password"] ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    name={name}
                    autoComplete='false'
                    InputProps={{
                        disableUnderline: true,
                        endAdornment:
                            <InputAdornment position='end'>
                                <IconButton
                                    onClick={(event) => handlePasswordVisibility("old_password", event)}
                                    disableRipple
                                >
                                    {
                                        showPassword["old_password"] ? <img src={visible} alt='Visible' className={classes.visiblityBtn} /> : <img src={invisible} alt='invisible' className={classes.visiblityBtn} />
                                    }
                                </IconButton>
                            </InputAdornment>

                    }}
                />

            </FormControl>
        )
    }

    const ChangePassword = () => {
        const [formData, setFormData] = useState({
            old_password: '',
            password: '',
            confirm_password: ''
        })

        const [error, setError] = useState({});

        const handleInputChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
            handlePasswordValidations(e);
        }

        const handlePasswordValidations = (e) => {
            let input = e.target;
            let err = error;
            switch (input.name) {
                case "old_password":
                    err.old_password = validates_password(input.value);
                    break;
                case "password":
                    err.password = validates_password(input.value);
                    break;
                case "confirm_password":
                    err.confirm_password = validates_password(input.value);
                    break;
                default:
                    break;
            }
            setError(err);
        }

        const validateAll = () => {
            let { old_password, password, confirm_password } = formData;
            let errors = {};
            errors.old_password = validates_password(old_password);
            errors.password = validates_password(password);
            errors.confirm_password = validates_password(confirm_password);
            return errors;
        }


        const changePassword = () => {
            let data = { ...formData, request_id: LocalStorage.uid(), };
            UserProfileApi.changePassword(data).then((response) => {
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                    console.log(response.data.message);
                }
            })
        }

        const handleSubmitPassord = () => {
            let errors = validateAll();
            if (isValid(errors)) {
                changePassword();
            } else {
                console.log(errors);
                setError(errors);
            }
        }

        return (
            <Box px={4} py={3.5} style={{ width: "100%", minHeight: "auto", boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D", borderRadius: "8px" }}>
                <Box>
                    <Typography className={classes.myDetails}>Change Password</Typography>
                </Box>
                <Box my={2}>
                    <Grid container>
                        <Grid item lg={12} sm={12} xs={12}>
                            <Box display={'flex'} flexDirection={'column'} gap={1}>
                                {PasswordField("old_password", formData.old_password, handleInputChange, "Current Password")}
                                <Text errorText>{error.old_password ? error.old_password : ""}</Text>

                                {PasswordField("password", formData.password, handleInputChange, "New Password")}
                                <Text errorText>{error.password ? error.password : ""}</Text>

                                {PasswordField("confirm_password", formData.confirm_password, handleInputChange, "Confirm Password")}
                                <Text errorText>{error.confirm_password ? error.confirm_password : ""}</Text>
                                <Box>
                                    <Button
                                        disableRipple
                                        blueBtnSave
                                        fullWidth
                                        className={classes.saveBtn}
                                        onClick={handleSubmitPassord}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box py={3}>
                        <Divider />
                    </Box>
                    <Box>
                        <Typography className={classes.myDetails} sx={{ color: "#111827 !important", fontWeight: "500 !important" }}>Password Requirements :</Typography>
                        <List
                            sx={{ listStyleType: 'disc' }}
                        >
                            <ListItem sx={{ px: "3px", py: "5px" }}>
                                <ListItemIcon sx={{ minWidth: "20px" }}>
                                    <FiberManualRecord sx={{ color: '#4A4A4A', width: "10px", right: "0px" }} />
                                </ListItemIcon>
                                <Typography className={classes.myDetails} sx={{ color: "#4A4A4A !important" }}>8 or more characters</Typography>
                            </ListItem>
                            <ListItem sx={{ px: "3px", py: "5px" }}>
                                <ListItemIcon sx={{ minWidth: "20px" }}>
                                    <FiberManualRecord sx={{ color: '#4A4A4A', width: "10px", right: "0px" }} />
                                </ListItemIcon>
                                <Typography className={classes.myDetails} sx={{ color: "#4A4A4A !important" }}>At least one upper case</Typography>
                            </ListItem>
                            <ListItem sx={{ px: "3px", py: "5px" }}>
                                <ListItemIcon sx={{ minWidth: "20px" }}>
                                    <FiberManualRecord sx={{ color: '#4A4A4A', width: "10px", right: "0px" }} />
                                </ListItemIcon>
                                <Typography className={classes.myDetails} sx={{ color: "#4A4A4A !important" }}>At least one lower case</Typography>
                            </ListItem>
                            <ListItem sx={{ px: "3px", py: "5px" }}>
                                <ListItemIcon sx={{ minWidth: "20px" }}>
                                    <FiberManualRecord sx={{ color: '#4A4A4A', width: "10px", right: "0px" }} />
                                </ListItemIcon>
                                <Typography className={classes.myDetails} sx={{ color: "#4A4A4A !important" }}>At least one number</Typography>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </Box >
        )
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleBackNavigation = () => {
        navigate("/dashboard")
    }

    const handleFileChange = (e) => {
        const formData = new FormData();
        formData.append("files", e.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload("employee-profile",formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data;
                    let docArr = [{
                        new_document_id: docInfo.id,
                    }]
                    setState({ ...state, profile_picture_url: docInfo.document_url });
                    profileUpload({ request_id: LocalStorage.uid(), documents: docArr });
                } else {
                    addErrorMsg(response.data.message);
                }
            })
    }

    const profileUpload = (data) => {
        let id = LocalStorage.getUserData().login_id
        UserProfileApi.updateUserProfile(data, id).then((response) => {
            if (response.data.statusCode == 1003) {
                addSuccessMsg(response.data.message);
            } else {
                addErrorMsg(response.data.message);
            }
        })
    }

    return (
        <Box className={classes.mainContainer} px={4} py={1}>
            <Box mx={12} display={'flex'} alignItems={'center'} gap={1}>
                <IconButton disableRipple onClick={handleBackNavigation}>
                    <img src={ArrowLeft} alt='ArrowLeft'></img>
                </IconButton>
                <Text boldBlackfont22 >My Profile</Text>
            </Box>

            <Box mx={{ lg: 12, md: 12, sm: 12, xs: 4 }} ml={{ xs: 15 }} mt={4}>
                <Grid container spacing={4}>
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Box px={4} py={2} display={'flex'} alignItems={"center"} flexDirection={'column'} style={{ width: '100%', minHeight: "auto", boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D", borderRadius: "8px" }}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                <Box mt={2} width={"100px"} height={"100px"} position={'relative'}>
                                    <Avatar
                                        src={state.profile_picture_url}
                                        alt='Profile'
                                        className={classes.avatar}
                                    />
                                    <Box
                                        position={'absolute'}
                                        top={"0px"}
                                        textAlign={'center'}
                                        className={classes.uploadImage}
                                        display={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                    >
                                        <MuiButton component="label" sx={{ textTransform: "none" }} disableRipple onChange={handleFileChange}>
                                            <Typography className={classes.uploadImageText}>
                                                <img src={upload} alt='upload' />
                                                <br />
                                                Upload
                                                <br />
                                                Images
                                            </Typography>
                                            <VisuallyHiddenInput type="file" />
                                        </MuiButton>
                                    </Box>
                                </Box>
                                <Box mt={2}>
                                    <Typography className={classes.profileName}>{avatarData}</Typography>
                                    <Typography className={classes.role}>
                                        {
                                            state.reference_id
                                        }
                                    </Typography>
                                </Box>
                            </Box>

                            <Box mt={1} width={"100%"}>
                                {
                                    btnArr.map((item, key) => (
                                        <ListItemButton
                                            key={key}
                                            className={`${classes.listItems} ${current === item ? classes.listItemsActive : null}`}
                                            onClick={() => setCurrent(item)}
                                            disableRipple
                                        >
                                            {item}
                                        </ListItemButton>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        {
                            current === "My Details" ? <MyDetails state={state} setState={setState} classes={classes} setAvatarData={setAvatarData} /> : null
                        }
                        {
                            current === "Change Password" ? <ChangePassword /> : null
                        }
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}

export default MyProfile