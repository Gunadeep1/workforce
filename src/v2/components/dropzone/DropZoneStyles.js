// import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import { settingsSBG } from "../../../theme";

const DropZoneStyles = makeStyles(() => ({
    box: {
        borderRight: '2px solid #D4D4D4',
        position: "fixed",
        height: "100vh",
        width: "210px",
        // background: `${settingsSBG} !important`,
        // [useTheme().breakpoints.down('lg')]: {
        //     width: "190px",
        // },
        // "@media (min-width:2560px)": {
        //     width: "380px",
        // },
        // "@media (max-width:1520px) and (min-width:1400px)": {
        //     width: "195px",
        // },
    },

    // fontFamily: "Nunito, Nunito Sans, sans-serif !important",
    // fontWeight: "600 !important",
    // color: "#092333 !important",
    // fontSize: "14px !important",


    dropzoneTitle: {
        fontSize: '16px !important',
        color: '#707070 !important'
    },
    dropzoneText: {
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: '#262626 !important'

    },
    or: {
        fontSize: "14px !important"
    },
    browseButton: {
        textDecoration: "underline !important",
        backgroundColor: "none !important",
        border: "none !important",
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: '#0C75EB !important',
        textTransform: "capitalize !important",
    },
    lineDivider: {
        marginTop: '10px',
        font: "150% Open Sans, Arial, sans-serif",
        color: '#999',
        textAlign: 'center',
        position: 'relative',
        marginBottom: '60px',
        "&::before": {
            content: "",
            display: 'block',
            borderTop: 'solid 2px #999',
            width: '100%',
            height: '2px',
            position: 'absolute',
            top: '17px',
            zIndex: 1,
        }
    },
    spanLineDivider: {
        background: '#fff',
        padding: '0 20px',
        position: 'relative',
        zIndex: 2,
    },
    dropzone: {
        padding: '0px',
        margin: '0px',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dropzoneContentContainer: {
        minHeight: '31vh',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dropzoneContentBox: {
        height: '100%',
        width: '100%',
        textAlign: 'center',
        padding: '20px'
    },
    browseBtnBox: {
        textAlign: 'center',
        // padding: '10px 0px'
    }

}))

export default DropZoneStyles;