import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const OtpStyles = makeStyles(() => ({
    padding: {
        paddingTop: '20px',
    },
    otpBoxes: {
        paddingTop: '20px',
    },
    reSend: {
        paddingTop: '10px',
        textAlign: 'right',
    },
   
    btn: {
        paddingTop: '20px',
        textAlign: 'center',
    },
    span: {
        marginRight: "15px",
        "@media (max-width:320px) ": {
            marginRight: "5px",
        },
    },
    dialogContent: {
        padding: "0px"
    },
    rightBox: {
        border: "1px solid #1976d2",
        borderRadius: "15px",
        borderWidth: "3px",
        padding: "70px",
        marginTop: "50px"
    },
    divider: {
        backgroundColor: "#707070",
        width: "1px"
    },
    approvedBox: {
        paddingTop:"10px",
        width: "50%",
        background: "#E6FFF1",
        height: "30px",
        borderRadius:"5px",
        marginLeft:"-130px",
        [useTheme().breakpoints.down("lg")]:{
            width: "80%",
        },
        [useTheme().breakpoints.down("md")]:{
            marginLeft:"0px",
            textAlign:"center",
        },
        [useTheme().breakpoints.down("sm")]:{
            width: "100%",
        }
    },
    normal:{
        color:"green !important",
    },
    fullHeight: {
        height: "100vh",
        [useTheme().breakpoints.down('md')]: {
            marginTop: "-100px ! important",
        }
    },
    leftBox: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "150px",
        marginLeft: "-50px !important",
        [useTheme().breakpoints.down('md')]: {
            marginLeft: "0px !important",
        },
    }

}))

export default OtpStyles;
