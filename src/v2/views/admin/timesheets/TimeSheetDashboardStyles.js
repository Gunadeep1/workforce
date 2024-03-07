import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material"
import { blue, btnBgRed } from "../../../theme";
const TimeSheetDashboardStyles = makeStyles(() => ({
    main: {
        width: "100% !important",
        [useTheme().breakpoints.down('sm')]: {
            width: "150% !important",
        },
        padding: "10px",

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
    miniCard: {
        minHeight: "20vh",
        // border:"1px solid black",
        borderRadius: "10px",
        cursor: "pointer"
    },
    miniCard1: {
        minHeight: "20vh",
        // border:"1px solid black",
        borderRadius: "10px",
        // cursor:"pointer"
    },
    // title:{

    // // color: `${btnTxtBlack.shade4} !important`,
    // font: "16px Nunito Sans, sans-serif !important",
    // fontWeight: "500 !important",
    // opacity: 1,
    // border: 0,
    // outline:'none !important'   
    // },
    globalSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "100%",
        height: "100%",
        background: "transparent",
        color: "rgba(38, 38, 38, 1)",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all .3s ease",
        '&::-webkit-input-placeholder': {
            color: "rgba(199, 204, 211, 1)",
        },
        '&:focus': {
            outline: "none"
        }
    },

    searchIcon: {
        all: "unset",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // cursor: "pointer", 
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        width: "45px",
        height: "38px",
        border: "none",
        // backgroundColor: "#FFFFFF", 
        color: "black !important",
        borderRadius: "6px",

    },

    searchField: {
        height: "40px",
        border: "1.5px solid rgba(199, 204, 211, 1)",
        // width: "460px", 
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    profileId: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#737373 !important",
        fontSize: "14px !important",
        // textAlign: "center"
    },
    inactive: {
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        // "&:hover": {
        //     background: 'none !important'
        // }
    },
    editText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    deleteText: {
        font: '13px Nunito Sans, sans-serif !important',
        color: `${btnBgRed.shade2} !important`,
        padding: '10px 0px 3px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    sideTooltip: {
        // height: "34px",
        height: "10px",
        width: "100%",
        display: "flex",
        alignItems: "center",
    },

    sideTooltipText: {
        // fontSize: "16px",
        fontSize: "10px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "20",
        color: "#FFFFFF",
    },
    greenText: {
        color: '#16A34A !important', font: '12px Nunito !important', fontWeight: `${500} !important`,cursor:'pointer !important'
    },  
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito , Nunito Sans, sans-serif !important',
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
        
    },

}))
export default TimeSheetDashboardStyles;
