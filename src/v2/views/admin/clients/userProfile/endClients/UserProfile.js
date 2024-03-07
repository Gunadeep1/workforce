import React, { useState, useRef } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Typography, Breadcrumbs, Avatar, Grid, Divider, ListItemButton, Menu, MenuItem, Button, CircularProgress, } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { addSuccessMsg, addErrorMsg } from '../../../../../utils/utils';
import EndClientDetails from './EndClientDetails';
import ContactDetails from './ContactDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import LocalStorage from '../../../../../utils/LocalStorage';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CommonApi from '../../../../../apis/CommonApi';
import ClientsAPI from '../../../../../apis/admin/clients/ClientsApi';
import Text from '../../../../../components/customText/Text';
import ReusablePopup from '../../../../../components/reuablePopup/ReusablePopup';
import deactivateImg from '../../../../../assets/client/deactivateImg.svg';
import CustomButton from '../../../../../components/customButton/Button';

const dataArr = ["End Client Details", "Contact Details",];

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
export default function UserProfile() {
    const classes = UserProfileStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const { name, reference_id, document_url, profile_perecentage, status } = location.state.data;
    const [current, setCurrent] = useState("End Client Details");
    const [statuss, setStatuss] = useState("");
    const [logo, setLogo] = useState("");
    const [loading, setLoading] = useState(false);// eslint-disable-next-line 
    const [statusLoading, setStatusLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const AvatarInputRef = useRef(null);
    const [deletePopup, setDeletePopup] = useState(false);

    React.useEffect(() => {
        setLogo(document_url);
        setStatuss(status);
        // eslint-disable-next-line
    }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const updateClientStatus = () => {
        let data = {
            request_id: LocalStorage.uid(),
            status: statuss == 'Active' ? 'In Active' : 'Active'
        };
        setStatusLoading(true)
        ClientsAPI.updateStatus("end-client", location.state.data.id, data).then((response) => {
            setTimeout(() => {
                setStatusLoading(false)
                if (response.data.statusCode == 1003) {                    
                    addSuccessMsg(`User has been ${statuss == 'Active' ? 'In Activated' : 'Activated'} Successfully`);
                    setStatuss(statuss == 'Active' ? 'In Active' : 'Active');
                    setDeletePopup(false);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleChangeUpload = (value) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg'].includes(r))) {
            setLoading(true)
            const formData = new FormData();
            formData.append("files", value.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("employee-profile",formData, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        let docInfo = response.data.data;
                        setLogo(docInfo.document_url);
                        uploadLogo(docInfo.id, docInfo.document_url);
                    } else {
                        setLoading(false)
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg).");
        }
    }

    const openDeletPop = () => {
        setDeletePopup(true);
    }

    const uploadLogo = (id, url) => {
        let data = {
            request_id: LocalStorage.uid(), documents: [
                {
                    new_document_id: id
                }
            ]
        };
        ClientsAPI.uploadClientLogo("end-client", location.state.data.id, data).then((response) => {
            setLoading(false)
            if (response.data.statusCode == 1003) {
                setLogo(response.data.data.profile_link);
                addSuccessMsg(response.data.message);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const clientAvatarUpload = () => {
        AvatarInputRef.current.click();
    }

    return (
        <Box className={classes.mainContainer} px={5} py={1}>
            <Box mx={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography onClick={() => navigate('/clients', { state: { page: 'end-Client' } })} className={classes.breadcrumbsLink}>End Clients</Typography>
                    <Typography className={classes.breadcrumbsName}>End Clients User Profile</Typography>
                </Breadcrumbs>
            </Box>
            <Box my={2} mx={2}>
                <Grid container spacing={0}>
                    <Grid item container lg={3} md={3} sm={4} xs={12} pr={2}>
                        <Box className={classes.cardBg}>
                            <Box width={"100%"} display={'flex'} justifyContent={'end'} px={2} pt={2}>
                                <MoreHorizIcon sx={{ cursor: "pointer" }} onClick={handleClickMenu} />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    sx={{
                                        '& .MuiPaper-root, .MuiMenu-list': {
                                            padding: '0px ',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={openDeletPop} className={classes.inactive}>
                                        <span>{statuss}</span>
                                        {statusLoading ? <CircularProgress color="secondary" size={"12px"} sx={{ margin: "0px 6px" }} /> : ""}
                                    </MenuItem>
                                </Menu>
                            </Box>
                            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }} mt={2}>
                                <CircularProgress variant="determinate" value={profile_perecentage} size="122px" thickness={2} sx={{ backgroundColor: "#F2F2F2", color: "#037847", borderRadius: "100%", }} />
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
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3px", borderRadius: "50%", backgroundColor: "#ffffff" }}>
                                        <HtmlTooltip
                                            placement="top"
                                            arrow
                                            title={
                                                <React.Fragment>
                                                    <Box>
                                                        <Typography className={classes.profileTooltipText}>
                                                            {`Profile Completion - ${profile_perecentage}%`}
                                                        </Typography>
                                                    </Box>
                                                </React.Fragment>
                                            }
                                        >
                                            <Avatar
                                                alt='Logo'
                                                src={logo}
                                                sx={{ width: "110px", height: "110px", }}
                                            />
                                        </HtmlTooltip>
                                    </Box>
                                </Box>
                            </Box>
                            <Box py={1} mt={1} textAlign={'center'}>
                                <Button className={classes.uploadBtn} onClick={clientAvatarUpload}>
                                    {`Edit Logo`}
                                    {loading ? <CircularProgress color="secondary" size={"12px"} sx={{ margin: "0px 2px" }} /> : null}
                                </Button>
                                <input
                                    name={'client_avatar'}
                                    type='file'
                                    onChange={handleChangeUpload}
                                    ref={AvatarInputRef}
                                    style={{ display: 'none' }}
                                />
                            </Box>
                            <Grid item lg={12} px={3} textAlign='center' py={1}>
                                <Text largeBlack noWrap>{name}</Text>
                            </Grid>
                            <Grid item lg={12} px={3} textAlign='center' pb={2}>
                                <Text mediumLabel noWrap>{reference_id}</Text>
                            </Grid>
                            <Box px={3}>
                                <Divider />
                            </Box>
                            <Box p={3} sx={{
                                maxHeight: "33vh",
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
                    </Grid>
                    <Grid item lg={9} md={9} sm={8} xs={12} pl={2}>
                        <Box className={classes.cardBg}>
                            {
                                current === "End Client Details" ? <EndClientDetails /> : null
                            }
                            {
                                current === "Contact Details" ? <ContactDetails /> : null
                            }
                        </Box>
                    </Grid>
                    <ReusablePopup iconHide white openPopup={deletePopup} setOpenPopup={setDeletePopup} fullWidth>
                        <Box sx={{ margin: "20px", }}>
                            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={deactivateImg} alt="warning" />
                            </Box>
                            <Box my={3}>
                                <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                    Are You Sure?
                                </Typography>
                                <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                    Do You Really Wish To {statuss == 'In Active' ? 'Activate' : 'In Activate'} the End-Client.
                                </Typography>
                            </Box>
                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <CustomButton no onClick={() => setDeletePopup(false)}>
                                    No
                                </CustomButton>
                                <CustomButton popupDelete onClick={updateClientStatus}>
                                    Yes, {statuss == 'In Active' ? 'Activate' : 'In Activate'}
                                </CustomButton>
                            </Box>
                        </Box>
                    </ReusablePopup>
                </Grid>
            </Box>
        </Box>
    );
}