import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material"

const AddBillingDetailsStyles= makeStyles(() => ({
    main: {
        width: "100% !important",
        [useTheme().breakpoints.down('sm')]: {
            width: "150% !important",
            },
        padding: "15px",
    },
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
        // cursor: "pointer !important",
    },
    mainCard:{
        minHeight: "68vh !important",
        // [useTheme().breakpoints.down('md')]: {
        //     minHeight: "0vh !important",
        //     },
        boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D ",
        borderRadius:"10px"
    },
    radioText: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#737373 !important",
        fontSize: "13px !important",
        textDecoration: "none !important",
        // cursor: "pointer !important",
    },
    sideTooltip: {
        height: "20px !important",
        width: "300% !important",
        display: "flex",
        alignItems: "center",
    },

    sideTooltipText: {
        fontSize: "12px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "500",
        color: "#FFFFFF",
    },
   
}))

export default AddBillingDetailsStyles