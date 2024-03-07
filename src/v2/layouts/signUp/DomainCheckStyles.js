import { makeStyles } from "@mui/styles";


const DomainCheckStyles = makeStyles(() => ({
    dailogContent: {
        padding: "0px !important"
    },
    leftGrid: {
        background: "#4285F4 !important"
    },
    leftBox: {
        display: "flex ",
        justifyContent: "center",
        padding:"16px !important"
        
    },
    normal: {
        font: "10px Poppins !important",
        marginLeft: "-12px !important",
        paddingTop: "15px !important"
    },
    saveButton: {
        width: "60px !important",
        borderRadius: "3px !important",
        opacity: 1,
        textTransform: "none !important",
        font: "10px Poppins !important",
        letterSpacing: "0px !important",
        color: "#FFFFFF !important",
        height: "23px !important",
        boxShadow:'none !important',
    }
}))

export default DomainCheckStyles;
