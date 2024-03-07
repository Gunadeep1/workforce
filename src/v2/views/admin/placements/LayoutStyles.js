import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material"
import { blue } from "../../../theme";

const LayoutStyles = makeStyles(() => ({
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
    bRight: {
        borderRight: "1px solid #D9D9D9",
        [useTheme().breakpoints.down('sm')]: {
            borderRight: "none",
        },
    },
    breadcrumbsLink: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        // cursor: "pointer !important",
    },
    mainCard: {
        // border:"1px solid black",
        minHeight: "76vh !important",
        [useTheme().breakpoints.down('md')]: {
            minHeight: "10vh !important",
        },
        borderRadius: "10px",
        boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D "
    },
    avatarBox: {
        display: "flex",
        borderRadius: "50%",
        border: "2px solid #037847",
    },
    avatar: {
        width: "120px !important",
        height: "120px !important",
        margin: "2px"
    },
    profileName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "20px !important",
        textAlign: "center"
    },
    profileId: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#737373 !important",
        fontSize: "14px !important",
        textAlign: "center"
    },
    eVerifyBtn: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        color: "#FFFFFF !important",
        height: "35px",
        width: "120px",
        padding: "0px 18px !important",
        borderRadius: "8px !important",
        backgroundColor: "#4ABE43 !important",
        cursor: 'not-allowed !important'
    },
    addButton: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        height: "25px",
        width: "100px",
        padding: "0px 18px !important",
    },
    headings: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "12px !important",

    },
    miniCard: {
        minHeight: "5vh",
        boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D ",
        borderRadius: "10px",
        paddingLeft: '30px !important'
    },
    cardTitle: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "18px !important",
        // textAlign: "center"
    },
    leftName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#737373 !important",
        fontSize: "14px !important",
        // textAlign: "left"
    },
    leftValue: {
        textAlign: "left",
        marginLeft: "39px !important"
    },
    scroll: {
        height: '450px !important',
        overflowY: 'scroll'
    },
    add: {
        color: `${blue} !important`,
        cursor: 'pointer'
    },
    minus: {
        color: 'red !important',
        cursor: 'pointer'
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
    },
    greyAdd: {
        color: 'red !important'
    },
    scrollCard: {
        height: '560px !important',
        overflowY: 'scroll',
        boxShadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D ",
        borderRadius: "10px",
        paddingLeft: '30px !important'
    },
    ViewContainer: {
        height: '75vh',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    disabledColor: {
        color: '#BDBDBD !important',
        cursor: 'not-allowed !important'
    }
}))
export default LayoutStyles;