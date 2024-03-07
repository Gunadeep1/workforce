import { makeStyles } from "@mui/styles";
import {  btnTxtBlack,blue} from "../../../../v2/theme"

const BalanceSheetStyles = makeStyles(() => ({
    main: {
        width: "100%",
        padding: "5px",
        paddingLeft:"120px"
    },
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        "&:hover": {
            background: 'none !important'
        }
    },
    viewText1: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        "&:hover": {
            background: 'none !important'
        },
        backgroundColor:"#F6F6F6 !important"
    },
    miniCard:{
        minHeight: "20vh",
        borderRadius:"10px",
        boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D "
    },
    title:{
        color: `${btnTxtBlack.shade4} !important`,
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: `600 !important`,
    },
    globalSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
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
    searchIcon:{
        all: "unset", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        textAlign: "center", 
        fontSize: "16px", 
        fontFamily: "Nunito , Nunito Sans, sans-serif", 
        width: "45px", 
        height: "38px", 
        border: "none", 
        color:"black !important",
        borderRadius: "6px", 
      },
    
         searchField:{ 
            height: "40px", 
            border: "1.5px solid rgba(199, 204, 211, 1)", 
            borderRadius: "6px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
        },
        loaders:{
            display:"flex",textAlign: "center",justifyContent:"center" 
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
    },
    activeText: {
        font: "16px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
        padding:'0px 25px !important'
    },
    tabText: {
        font: "16px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#707070 !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
        padding:'0px 25px !important'
    },
    text1: {
        textAlign: "center !important",
        fontSize: "14px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(115, 115, 115, 1) !important"
    },
    text2: {
        textAlign: "center !important",
        fontSize: "12px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },
    mainHead:{
        paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important",cursor:"pointer",
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade2} !important`,
        opacity: 1,
        fontWeight: `${600} !important`,
        textTransform: 'capitalize !important',
    },
    profileTooltipText: {
        fontSize: "10px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#FFFFFF !important",
    },



}))
export default BalanceSheetStyles ;