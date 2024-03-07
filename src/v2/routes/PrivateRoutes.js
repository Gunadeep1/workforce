import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from '../layouts/sidebar/Sidebar';
import Navbar from '../layouts/navbar/Navbar';
import { Box } from "@mui/material";
import LocalStorage from "../utils/LocalStorage";
import { DefaultRolePermissions } from '../layouts/DefaultRoles';
import NotAllowedPage from "../layouts/NotAllowedPage";
import List from './AdminRoute';
import { makeStyles } from "@mui/styles";
import ReleaseNotes from "../views/releaseNotes";
import Icon from '../assets/svg/dashboard/chatbotIcon.svg'
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Slide } from "@mui/material";
import ChatBot from "./ChatBot";
// import LocalStorage from "./utils/LocalStorage";
// import PrivateRoute from "./routes/routes";
// import { MyContext } from "./Context";
// import { useEffect } from "react";
// import Login from "./layouts/login/Login"
// import ForgotPassword from "./layouts/forgotPassword/ForgotPassword"
// import SignUp from "./layouts/signup/SignUp"
// import LandingPage from "./layouts/LandingPage"
// import ValidateOtp from "./layouts/otp/ValidateOtp"
// import InvoiceView from "./layouts/InvoiceView"
// import Changepasswordnotoken from "./layouts/Changepassword-notoken"
// import OrganizationName from "./layouts/organizationName/OrganizationName"
// import DocumentsBrowsePage from "./views/admin/timeSheets/timesheetDocumentsUpload/DocumentsBrowsePage"
// import VerificationForm from "./views/immigration/verificationForm/VerificationForm";
// import Verification from "./views/immigration/verification/Verification";

var drawerWidth = 260;
const useStyles = makeStyles(() => ({
    box: {
        // display: "flex",

    },
    mainBox: {
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
    },
    chatInput: {
        width: '100%',
        border: 'none',
        font: '16px Nunito',
        fontWeight: `${400}`,
        color: '#4F4F4F',
        paddingLeft: '15px'
    },
}));

export default function PrivateRoutes() {
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        top: 'auto',
        left: '65%',
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
            width: "550px",
            height: 'auto'
        }
    }));
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });
    const [openPoup, setOpenPopup] = useState(false);
    const location = useLocation()
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : DefaultRolePermissions.role_permissions.permissions;

    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <div>
            {LocalStorage.getAccessToken() ? (
                <Box className={classes.box}>
                    {Location.pathname != '/404' && location.pathname !== "/release-notes" ? <Navbar /> : null}
                    {
                        location.pathname == "/release-notes" ? null : <Sidebar />
                    }
                    <Box component="main" className={classes.mainBox}>
                        <Routes>
                            {List.map((route, key) => (
                                <>
                                    {route.slug != null && route.access == true ?
                                        <>
                                            {LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == route.slug && item.is_allowed)) ?
                                                <Route key={key} path={route.path} element={route.element} /> :
                                                <Route key={key} path={route.path} element={route.element} />
                                            }
                                         {/* <Route path={route.path} element={<NotAllowedPage />} />} */}
                                        </>
                                        :
                                        <Route key={key} path={route.path} element={route.element} />}
                                </>
                            ))}
                            <Route path="/404" element={<NotAllowedPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                            <Route path="/release-notes" element={<ReleaseNotes />} />
                        </Routes>
                    </Box>
                </Box>
            ) : navigate("/")}
            {
                !openPoup &&
                <Box sx={{ position: 'absolute', right: 0, bottom: '0', display: 'flex', zIndex: 10000 }}>
                    <img src={Icon} alt="suggestion" onClick={() => setOpenPopup(true)} style={{ cursor: 'pointer' }} />
                </Box>
            }
            <BootstrapDialog
                TransitionComponent={Transition}
                open={openPoup}
                setOpen={setOpenPopup}
            >
                <ChatBot openPoup={openPoup} setOpenPopup={setOpenPopup} />
            </BootstrapDialog>
        </div>
    );
}
