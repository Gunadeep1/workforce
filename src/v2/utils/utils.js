import Snackbar from '../components/snackbar/Snackbar';
import React from "react";
import ReactDOM from "react-dom";
import Axios from 'axios';
import { CircularProgress, Dialog, linearProgressClasses, LinearProgress } from "@mui/material";
import LocalStorage from "./LocalStorage";
import success from '../assets/employee/check-circle.svg';
import error from '../assets/employee/alert-triangle.svg';
import warning from '../assets/employee/warning.svg';
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import io from "socket.io-client";
import API_URL from "../config/development";

export function getAxios() {
  const axios = Axios;
  // const userId = LocalStorage.getUser() && LocalStorage.getUser().user_id
  // axios.defaults.headers.common['Authorization'] = `${userId}`
  return axios;
}

export function connectionFailed() {
  ReactDOM.render(
    <Dialog
      open={true}
      fullWidth={true}
      fullScreen
      PaperComponent="div"
      PaperProps={{
        style: {
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      {/* <CircularProgress color="primary" size={100} thickness={1.5} /> */}
      <CircularProgress color="inherit" />
      <h2>
        {window.navigator.onLine
          ? window.navigator.connection.effectiveType.endsWith("2g")
            ? "No Internet Connection, Please connect to the network and refresh your page."
            : "Server under maintenance! Please try again after sometime"
          : "No Internet Connection, Please connect to the network and refresh your page."}
      </h2>
    </Dialog>,
    document.getElementById("loader")
  );
}

export function removeLoader() {
  ReactDOM.unmountComponentAtNode(document.getElementById("loader"));
}

export function addSuccessMsg(message) {
  ReactDOM.render(
    <Snackbar
      message={message}
      color="success"
      place="bc"
      icon={<img src={success} alt='success' />}
      renderElement={document.getElementById("error")}
    />,
    document.getElementById("error")
  );
}

export function addWarningMsg(message) {
  ReactDOM.render(
    <Snackbar
      message={message}
      color="warning"
      place="bc"
      icon={<img src={warning} alt='warning' />}
      renderElement={document.getElementById("error")}
    />,
    document.getElementById("error")
  );
}

// export function addWarningMsgs(messages) {
//   const concatenatedMessages = messages.join('<br/>'); // Use <br/> for line breaks
//   const formattedMessage = <span dangerouslySetInnerHTML={{ __html: concatenatedMessages }} />;

//   ReactDOM.render(
//     <Snackbar
//       message={formattedMessage}
//       color="warning"
//       place="bc"
//       icon={<img src={warning} alt='warning' />}
//       renderElement={document.getElementById("error")}
//     />,
//     document.getElementById("error")
//   );  
// }

export function addErrorMsg(message) {
  ReactDOM.render(
    <Snackbar
      message={message}
      color="danger"
      place="bc"
      icon={<img src={error} alt='error' />}
      renderElement={document.getElementById("error")}
    />,
    document.getElementById("error")
  );
}


export function dateFormat() {
  const dateFormat = LocalStorage.getDateFormat() ? LocalStorage.getDateFormat() : "MM/DD/YYYY";
  return dateFormat
}

export function getCurrencySymbol() {
  return LocalStorage.getCurrencySymbol();
}

export const BlackToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#393939",
    padding: "2px 14px",
    minWidth: 100,
    border: "1px solid #393939",
    borderRadius: "12px",
    // font:"10px !important"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#393939",
    "&::before": {
      backgroundColor: "#393939",
      border: "1px solid #393939"
    }
  },
}));

export const WhiteToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#FFFFFF",
    color:'black',
    padding: "2px 14px",
    minWidth: 20,
    border: "1px solid #393939",
    borderRadius: "12px",
    // font:"10px !important"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#393939",
    "&::before": {
      backgroundColor: "#FFFFFF",
      border: "1px solid #393939"
    }
  },
}));

export const socket = io(`${API_URL.Socket_URL}`, { transports: ["websocket"], auth: { token: LocalStorage.getAccessToken() }, });

export const BorderLinearProgress = styled(LinearProgress)(({ theme, bgColor, barColor }) => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: bgColor,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: barColor,
  },
}));

export var rolePermission = LocalStorage.getRolesData()
  ? LocalStorage.getRolesData().role_permissions.permissions
  : "";

export function filterRole(args) {
  if (LocalStorage.getUserData().super_admin) {
    return true;
  } else if (rolePermission != "") {
    var x = rolePermission.find(
      (i) => i.slug == args && i.is_allowed == true
    );
    if (x) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

