import React, { useEffect, useRef, useState } from 'react';
import UserProfileStyles from './UserProfileStyles';
import { Box, Typography, Breadcrumbs, Avatar, Stack, Grid, Button, Divider, ListItemButton, Menu, MenuItem, CircularProgress, Skeleton} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DialogContent from "@mui/material/DialogContent";
import CustomButton from '../../../../components/customButton/Button';
import OffBoardImg from "../../../../assets/svg/OffBoardPop.svg"
import GeneralDetails from './generaldetails';
import Documents from './document';
import Immigration from './Immigration';
import Timesheet from './timesheet';
import Skills from './skills';
import Invoice from './invoice';
import Dependents from './dependents';
import VacationHistory from './vacationHistory';
import PayConfiguration from './payconfiguration';
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import EmployeeAPI from '../../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg, } from '../../../../utils/utils';
import Text from '../../../../components/customText/Text';
import { Link, useLocation, } from 'react-router-dom';
import UserProfileApi from '../../../../apis/admin/employees/UserProfileApi';
import { addSuccessMsg } from '../../../../utils/utils';
import LocalStorage from '../../../../utils/LocalStorage';
import verified from '../../../../assets/svg/Component87.svg';
import Verify from '../../../../assets/svg/verify_icon.svg';
import Pending from '../../../../assets/svg/PendingIcon.svg';
import Rejected from '../../../../assets/svg/Rejected.svg';
import EverifySuccesPopUp from '../../../../assets/svg/Isolation_Mode.svg';
import { useNavigate } from 'react-router-dom';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ReusablePopup from '../../../../components/reuablePopup/ReusablePopup';
import CommonApi from '../../../../apis/CommonApi';
// import Popover from '@mui/material/Popover';
import ActivityLog from './ActivityLog';

const dataArr = ["General Details", "Documents", "Pay Configuration", "Immigration", "Timesheet", "Invoice", "Skills", "Dependents", "Vacation History"];

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#404040",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #404040"
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#404040",
        "&::before": {
            backgroundColor: "#404040",
            border: "1px solid #404040"
        }
    },
}));

export default function ControlledAccordions() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = UserProfileStyles();
    const location = useLocation();
    const { id, offBoardButton, progress, active, grButn } = location.state;
    const [current, setCurrent] = useState("General Details");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const AvatarInputRef = useRef(null);
    const [employee, setEmployee] = useState({
        basic_details: {
            first_name: "",
            middle_name: "",
            last_name: "",
            dob: "",
            gender: "",
            blood_group: "",
            marital_status: "",
            full_name: ""
        },
        contact_details: {
            contact_number: "",
            alternate_contact_number: "",
            email_id: "",
            alternate_email: "",
        },
        current_address: {
            address_line_one: "",
            zip_code: "",
            city: "",
            state_id: "",
            country_id: "",
        },
        emergency_contacts: [{
            id: "",
            relationship_id: "",
            name: "",
            email_id: "",
            contact_number: "",
            address_1: "",
            city: "",
            zip_code: "",
            state_id: "",
            country_id: ""
        }],
        employment_details: {
            reference_id: "",
            date_of_joining: "",
            employment_type_id: "",
            employment_category_id: "",
            ssn: "",
            is_usc: "",
            visa_type_id: "",
            reporting_manager_id: "",
            department_id: "",
            team_id: "",
            role_id: "",
            vendor_id: '',
            vendor_price: '',
            showFullSSN: false
        },
        profile_picture_url: "",
        enable_login: "",
        e_verified: ""
    });
    const [EmployeeProfile, setEmployeeProfile] = useState();
    const [loader, setLoader] = useState(false);
    const [popUpOpen, setPopUpOpen] = useState(false);
    const [show, setShow] = useState("");
    const [loading, setLoading] = useState(false);
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
            width: "500px"
        },
        "& .MuiDialogContent-root": {
            // padding: theme.spacing(2)
            // padding: theme.spacing(3)
        },
        "& .MuiDialogActions-root": {
            // padding: theme.spacing(1)
            // padding: theme.spacing(5)
        }
    }));
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} timeout={500} />;
    });


    useEffect(() => {
        getEmployeeApi();
        if (location.state.page == 'placementAdd') {
            setCurrent('Pay Configuration');
        } else {
            setCurrent('General Details')
        }
        if (location.state.stage === 'General Details' || location.state.stage === 'Documents') {
            setCurrent('Documents');
        } else {
            setCurrent('General Details');
        }  // eslint-disable-next-line
    }, [])

    const getEmployeeApi = () => {
        console.log(location.state.id,'location.state.id')
        setLoading(true);
        if (location.state.id !== '') {
            EmployeeAPI.getEmployee(location.state.id).then((response) => {
                setTimeout(() => {
                    if (response.data.statusCode == 1003) {
                        setLoading(false);
                        setEmployee({ ...response.data.data });
                        setEmployeeProfile(response.data.data.profile_picture_url);
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400)
            });
        }
    }

    const clientAvatarUpload = () => {
        AvatarInputRef.current.click();
    }

    const uploadProfile = (e) => {
        if (e.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg'].includes(r))) {
            const formData = new FormData();
            formData.append("files", e.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("employee-profile", formData, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        setEmployeeProfile(response.data.data.id);
                        ProfileUpdateApi(response.data.data.id)
                    } else {
                        setLoading(false)
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg).");
        }
    }

    const ProfileUpdateApi = (args) => {
        setLoader(true);
        const data = {
            request_id: LocalStorage.uid(),
            id: location.state.id,
            documents: [
                {
                    new_document_id: args
                }
            ]
        }
        EmployeeAPI.profileUpload(location.state.id, data).then((res) => {
            if (res.data.statusCode == 1003) {
                setLoader(false);
                addSuccessMsg('Profile Uploaded Successfully');
                getEmployeeApi();
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopUp = () => {
        setPopUpOpen(false);
    };

    const everifyEmployee = () => {
        const data = {
            request_id: LocalStorage.uid()
        }
        UserProfileApi.everifyEmp(id, data).then((res) => {
            if (res.data.statusCode == 1003) {
                addSuccessMsg('Employee E-Verified Successfully');
                setEverifyPopUpOpen(false);
                getEmployeeApi();
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleStatus = (args) => {
        if (args == 1) {
            if (employee.enable_login == 0) {
                handleClose()

                setShow(args)
                setPopUpOpen(true)
            } else if (employee.enable_login == 1) {
                handleClose()

                setShow(args)
                setPopUpOpen(true)
            }

        }
        if (args == 0) {
            handleClose()
            setShow(args)
            setPopUpOpen(true)
        }
    }

    const handleAccess = () => {
        if (employee.enable_login == 0) {
            addSuccessMsg('User Access Disabled')
        } else if (employee.enable_login == 1) {
            addSuccessMsg('User Access Enabled')
        }
        DeactiveApi()
        window.location.reload();
        handleClosePopUp()

    }
    // eslint-disable-next-line 
    //disable user access
    const DeactiveApi = () => {
        const data = {
            request_id: LocalStorage.uid(),
            employee_id: id
        }
        UserProfileApi.InactiveEmp(data).then((res) => {

        })
    }

    const navigate = useNavigate();
    const [everifyPopUpOpen, setEverifyPopUpOpen] = useState(false);

    const handleEverifyPopUp = (args) => {
        if (args == 1) {
            setEverifyPopUpOpen(false);
        } else {
            setEverifyPopUpOpen(true);
        }
    } 

    const [successEverifyPopUpOpen, setsuccessEverifyPopUpOpen] = useState(false);
 
    const handleCloseSuccessEverifyPopUp = () => {
        setsuccessEverifyPopUpOpen(false);
        setEverifyPopUpOpen(false);
        navigate('/Dashboard');
    };

    // eslint-disable-next-line
    // const openPopup = (url) => {
    //     window.open(url, "_blank", "width=600,height=400");
    // };


    const [showPassword, setShowPassword] = useState(false);
    const [ssn, setSSN] = useState('');

    // const handleClickShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };
    // eslint-disable-next-line
    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    // eslint-disable-next-line
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    // eslint-disable-next-line
    const handleInputChange = (event) => {
        setSSN(event.target.value);
    };
    // eslint-disable-next-line
    const getVisibleText = () => {
        if (showPassword) {
            return ssn;
        } else {
            return ssn.slice(0, 3) + '*'.repeat(Math.max(0, ssn.length - 3));
        }
    };

    const [activityAnchorEl, setActivityAnchorEl] = useState(null);

    const handleActivityClick = (event) => {
        setActivityAnchorEl(event.currentTarget);
    };

    const handleActivityClose = () => {
        setActivityAnchorEl(null);
    };
    // eslint-disable-next-line
    const [activeStep, setActiveStep] = useState(0);
    const activityOpen = Boolean(activityAnchorEl);
    // const act_id = activityOpen ? 'simple-popover' : undefined;
    // const dataArray = [
    //     { message: "Rahul Has Created Timesheet", time: "10:00am 22-Sep-2023", description: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    //     { message: "Level 1 Approval Completed", time: "10:00am 5-Sep-2023", description: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    //     { message: "Adithya Edited The Timesheet", time: "10:00am 5-Sep-2023", description: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    //     { message: "Level 2 Approval Completed", time: "10:00am 2-Sep-2023", description: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." }
    // ];

    return (
        <Box className={classes.mainContainer} px={5} py={1}>
            <Box mx={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography component={Link} to={'/employees'} className={classes.breadcrumbsLink}>Employees</Typography>
                    <Typography className={classes.breadcrumbsName}>User Profile</Typography>
                </Breadcrumbs>
            </Box>
            <Box my={2} mx={2}>
                <Grid container columnSpacing={4}>
                    <Grid item container lg={3} md={3} sm={4} xs={12}>
                        <Box style={{ width: "100%", height: "79vh", boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D", borderRadius: "8px" }}>
                            <Box px={3} py={1}>
                                <Box my={1} mt={2} style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    <Box sx={{ position: 'relative', display: 'flex' }} className={classes.avatarBox}>
                                        <CircularProgress variant="determinate" value={location.state.progress} size="130px" thickness={2} sx={{ backgroundColor: "#F2F2F2", color: location.state.progress == 100 ? 'green' : location.state.progress <= 99 && location.state.progress >= 40 ? 'orange' : location.state.progress < 40 ? "red" : '', borderRadius: "100%" }} />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Box sx={{ display: "flex", borderRadius: "50%", backgroundColor: "#ffffff" }}>
                                                <HtmlTooltip
                                                    placement="bottom"
                                                    arrow
                                                    title={
                                                        <Box>
                                                            <Text smallWhite>
                                                                {`Profile Completion - ${location.state.progress}%`}
                                                            </Text>
                                                        </Box>
                                                    }
                                                >
                                                    <Avatar
                                                        className={classes.avatar}
                                                        alt={employee.basic_details && employee.basic_details.full_name}
                                                        src={EmployeeProfile}
                                                    />
                                                </HtmlTooltip>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Grid item lg={12} xs={12} p={1} textAlign='center' justifyContent='center'>
                                    <Button className={classes.uploadBtn} onClick={clientAvatarUpload}>
                                        {`Edit Profile`}
                                        {loader ? <CircularProgress color="secondary" size={"12px"} sx={{ margin: "0px 2px" }} /> : null}
                                    </Button>
                                    <input
                                        name='avatar'
                                        type='file'
                                        onChange={(e) => uploadProfile(e)}
                                        ref={AvatarInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </Grid>
                                <Grid item container lg={12} pt={1} spacing={0} alignItems='center'>
                                    <Grid item lg={12}>
                                        {/* {
                                            loading ?
                                                <Skeleton width='150px' height='40px' animation='wave' />
                                                : */}
                                        <Box display='flex' flexDirection='row' gap={1} justifyContent='center'>
                                            <Text className={classes.profileName} noWrap>{employee.basic_details.full_name}</Text>
                                            {employee.e_verified == 1 ? <img src={verified} alt='verified' /> : ''}
                                        </Box>
                                        {/* } */}
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} pt={1}>
                                    {/* {loading ? <Skeleton width='150px' height='40px' animation='wave' /> :  */}
                                    <Text className={classes.profileId} noWrap>{employee.employment_details.reference_id}</Text>
                                    {/* } */}
                                </Grid>
                                <Grid item lg={12} xs={12} p={1} textAlign='center' justifyContent='center'>
                                    <Button className={classes.uploadBtn} onClick={handleActivityClick}>
                                        Activity log
                                    </Button>

                                </Grid>
                                <Stack my={1} direction="row" justifyContent={"center"} spacing={2}>
                                    {
                                        loading ?
                                            <Skeleton width='150px' height='60px' animation='wave' /> :
                                            <Button className={classes.eVerifyBtn} sx={{ border: employee.e_verified == 1 ? '1px solid #4ABE43 !important' : '', backgroundColor: (employee.e_verified == 0 ? "#ffffff !important" : employee.e_verified == 1 ? "#4ABE43 !important" : employee.e_verified == 2 ? "#F59E0B !important" : employee.e_verified == 3 ? "#E51A1A !important" : ''), color: '#ffffff' }} onClick={() => handleEverifyPopUp(employee.e_verified)}>
                                                <Stack direction='row' gap={1} sx={{ color: (employee.e_verified == 0 ? "#0C75EB  !important" : employee.e_verified == 1 ? "#ffffff !important" : employee.e_verified == 2 ? "#ffffff !important" : employee.e_verified == 3 ? "#ffffff !important" : '') }}>
                                                    {(employee.e_verified == 0 ? 'E-Verify' : employee.e_verified == 1 ? 'E-Verified' : employee.e_verified == 2 ? 'Pending' : employee.e_verified == 3 ? 'Rejected' : '')}
                                                    {employee.e_verified !== 0 && <img src={employee.e_verified == 1 ? Verify : employee.e_verified == 2 ? Pending : employee.e_verified == 3 ? Rejected : null} alt='e_verify' />}
                                                </Stack>
                                            </Button>
                                    }
                                    <Button variant="outlined" className={classes.moreBtn}>
                                        <MoreHorizIcon sx={{ fontSize: "18px", color: "#9D9E9F" }} onClick={handleClick} />
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            sx={{
                                                '& .MuiPaper-root': {
                                                    border: '1px solid #EAECF0 !important',
                                                    width: '150px !important',
                                                    boxShadow: "#0000001F !important",
                                                    borderRadius: '8px !important',
                                                    padding: '0px 2px 0px 0px !important'
                                                },
                                            }}
                                        >
                                            {employee.status == 'In Active' ?
                                                <>
                                                    {
                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_active_inactive" && item.is_allowed == true))) ?
                                                            <MenuItem className={classes.inactive}>Mark as Active</MenuItem> :
                                                            <MenuItem className={classes.inactiveDisable}>Mark as Active</MenuItem>
                                                    }
                                                </>
                                                :
                                                <>
                                                    {
                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_disable_enable" && item.is_allowed == true))) ?
                                                            <MenuItem onClick={() => handleStatus(1)} className={classes.viewText}>{employee.enable_login == '1' ? 'Disable' : 'Enable'} User Access</MenuItem> :
                                                            <MenuItem className={classes.inactiveDisable}>{employee.enable_login == '1' ? 'Disable' : 'Enable'} User Access</MenuItem>
                                                    }
                                                    {
                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_active_inactive" && item.is_allowed == true))) ?
                                                            <MenuItem onClick={() => handleStatus(0)} className={classes.inactive}>Mark as Inactive</MenuItem> :
                                                            <MenuItem className={classes.inactiveDisable}>Mark as Inactive</MenuItem>
                                                    }
                                                </>
                                            }
                                        </Menu>
                                    </Button>
                                </Stack>
                            </Box>
                            <Box px={3}>
                                <Divider />
                            </Box>
                            <Box py={3}>
                                <Box px={3} sx={{
                                    height: "20vh",
                                    overflow: "auto",
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        '-webkit-box-shadow': 'inset 0 0 6px #ffffff',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#C7CCD3',
                                        outline: '1px solid #C7CCD3',
                                        borderRadius: "4px",
                                    }
                                }}>
                                    {
                                        dataArr.map((item, key) => (
                                            <ListItemButton
                                                key={key}
                                                className={`${classes.listItems} ${current === item ? classes.listItemsActive : null}`}
                                                onClick={() => setCurrent(item)}
                                            >
                                                {item}
                                            </ListItemButton>
                                        ))}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={9} md={9} sm={8} xs={12}>
                        <Box sx={{ width: '100%', height: "79vh", boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D", borderRadius: "8px" }}>
                            {
                                current === "General Details" && employee.basic_details.first_name !== '' && <GeneralDetails offBoardButton={offBoardButton} progress={progress} avatar_url={employee.profile_picture_url} active={active} grButn={grButn}
                                    employee={employee} setEmployee={setEmployee} getIndex={getEmployeeApi} loading={loading} setLoading={setLoading}
                                />                              
                            }
                            {
                                current === "Documents" ? <Documents employee={employee} setEmployee={setEmployee} getIndex={getEmployeeApi} /> : null
                            }
                            {
                                current === "Pay Configuration" ? <PayConfiguration /> : null
                            }
                            {
                                current === "Immigration" ? <Immigration /> : null
                            }
                            {
                                current === "Timesheet" ? <Timesheet /> : null
                            }
                            {
                                current === "Skills" ? <Skills /> : null
                            }
                            {
                                current === "Invoice" ? <Invoice /> : null
                            }
                            {
                                current === "Dependents" ? <Dependents /> : null
                            }
                            {
                                current === "Vacation History" ? <VacationHistory /> : null
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={popUpOpen}
            >
                <DialogContent sx={{ margin: "20px", }}>
                    {show == 1 &&
                        <>
                            <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={OffBoardImg} alt="OffBoard" />
                            </Box>
                            <Box my={3}>
                                <Text my={1} popupHead1> Are You Sure?</Text>
                                <Text my={1} popupHead2>
                                    {employee.enable_login == 1 ?
                                        (<>
                                            The user access will be disabled  for <span style={{ color: "#0C75EB" }}>{employee.basic_details.full_name}.</span>
                                        </>)
                                        :
                                        (<>
                                            The user access will be enabled for <span style={{ color: "#0C75EB" }}>{employee.basic_details.full_name}.</span>

                                        </>)}
                                </Text>
                            </Box>
                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <CustomButton popupCancel1 onClick={() => handleClosePopUp()}>
                                    Cancel
                                </CustomButton>
                                <CustomButton popupSaveBlue onClick={() => handleAccess()} >
                                    Yes
                                </CustomButton>
                            </Box>
                        </>
                    }
                    {show == 0 &&
                        <>
                            <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={OffBoardImg} alt="OffBoard" />
                            </Box>
                            <Box my={3}>
                                <Text my={1} popupHead1> Are You Sure?</Text>
                                <Text my={1} popupHead2>
                                    {employee.enable_login == '0' ?
                                        (<>
                                            The user access will be disabled for <span style={{ color: "#0C75EB" }}>{employee.basic_details.full_name}</span>.Do you want continue with the offboarding process
                                        </>)
                                        : 'Do you want continue with the offboarding process'}
                                </Text>
                            </Box>
                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <CustomButton popupCancel1 onClick={() => handleClosePopUp()}>
                                    Cancel
                                </CustomButton>
                                <CustomButton popupSaveBlue component={Link}
                                    to={`/employees/user-profile/${employee.basic_details.full_name === "" ? "" : employee.basic_details.full_name.trim().split(/ +/).join('-')}/offboarding`}
                                    state={{
                                        full_name: employee.basic_details.full_name, reference_id: employee.employment_details.reference_id, enable_login: employee.enable_login, avatar_url: employee.profile_picture_url, id: id, acc: 1,
                                        // getData1:getData 
                                    }}
                                >
                                    Yes
                                </CustomButton>
                            </Box>
                        </>
                    }
                </DialogContent>
            </BootstrapDialog>
          
            <BootstrapDialog
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={activityOpen}
                anchorEl={activityAnchorEl}
                onClose={handleActivityClose}
                sx={{
                    "& .MuiDialog-paper ": { borderRadius: "0px", width: "650px !important", height: "630px !important" , overflowY: "auto",
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },},
                }}
            >
                <DialogContent style={{ display: 'flex', flexDirection: 'column', overflowY: "auto",
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }, }}>
                  
                    <ActivityLog setLoading={setLoading} loading={loading}/>
                </DialogContent>

            </BootstrapDialog>
            
            <ReusablePopup openPopup={everifyPopUpOpen} setPopUpOpen={setEverifyPopUpOpen} white iconHide fixedWidth>
                <Grid container p={3} textAlign='center'>
                    <Grid item lg={12}>
                        <Text largeBlack>Are you sure want to <b>E-Verify</b> the Employee</Text>
                    </Grid>
                    <Grid item lg={12} pt={4}>
                        <Box display='flex' flexDirection='row' gap={2} justifyContent='center'>
                            <CustomButton popupSaveBlue onClick={everifyEmployee}>Yes</CustomButton>
                            <CustomButton popupCancel onClick={() => setEverifyPopUpOpen(false)}>No</CustomButton>
                        </Box>
                    </Grid>
                </Grid>
            </ReusablePopup>

            <BootstrapDialog
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={successEverifyPopUpOpen}
                sx={{
                    "& .MuiDialog-paper ": { borderRadius: "8px", width: "406px !important", height: "390px !important" },
                }}
            >
                <DialogContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={EverifySuccesPopUp} alt='Everify SuccessPopUp' style={{ marginTop: '35px' }} />
                    <Text largeBoldGreen sx={{ fontSize: '22px !important', marginTop: '20px' }}>Successfully Sent</Text>
                    <Text blackHeader sx={{ fontSize: '14px !important', marginTop: '18px' }}>Details has been Successfully Sent</Text>
                    <CustomButton popupSaveBlue sx={{ marginTop: '35px', color: '#F5F5F5 !important', fontSize: '16px !important', fontWeight: `${400} !important`, width: '122px !important', height: '39px !important' }} onClick={() => handleCloseSuccessEverifyPopUp()}>Go To Home</CustomButton>
                </DialogContent>

            </BootstrapDialog>
        </Box>
    );
}