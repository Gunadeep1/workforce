import { makeStyles } from "@mui/styles";
import {  blue, red } from "../../../../theme";
// import { blue, btnBgBlue, btnBgGrey, btnBgRed, btnBorder, btnStroke } from "../../../theme";
// import { useTheme } from "@mui/material";

const ClientAndEndClientStyles = makeStyles(() => ({
    // Breadcrumbs Styles
    breadcrumbsName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "14px !important",
    },

    breadcrumbsLink: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        cursor: "pointer !important",
    },
    addIcon:{
        color:`${blue} !important`,
        cursor:'pointer !important'
    },
    removeIcon:{
        color: `${red} !important`,
        cursor:'pointer !important'
    }
    

}))

export default ClientAndEndClientStyles;
