import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { darkSkyBlue } from "../../theme";

export const LoginStyles = makeStyles(() => ({
    box: {
        [useTheme().breakpoints.down('md')]: {
            background: "",
        }
    },
    boxOne: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "-50px ! important",
        [useTheme().breakpoints.down('md')]: {
            marginTop: "50px ! important",
            justifyContent: 'center',
        }
    },
    boxTwo: {
        marginLeft: "-90px !important",
        width: '350px',
        [useTheme().breakpoints.down('md')]: {
            width: '350px',
            marginLeft: "0px !important",
        },
        [useTheme().breakpoints.down('sm')]: {
            width: '300px',
            marginLeft: "0px !important",
        }
    },
    rightBox: {
        background: '#243042 ! important',
        height: '100vh'
    },
    image: {
        marginTop: "200px",
        marginLeft: "-200px",
        width: "100%",
    },
    inputBoxes: {
        textAlign: "left",
        paddingLeft: '20px !important'
    },
    header: {
        color: '#2D2D2D !important',
        textAlign: 'center',
        margin:'10px 0px !important',
    },
    buttonStyles: {
        textAlign: 'center',
        paddingTop: '30px'
    },
    forgotPassword: {
        color: "#4C9FEB !important",
        fontSize: "11px !important",
        cursor: "pointer"
    },
    loginButton: {
        width: "135px !important",
        background: `${darkSkyBlue} 0% 0% no-repeat padding-box !important`,
        borderRadius: "3px !important",
        textTransform: "none !important",
        font: '13px Nunito Sans, sans-serif !important',
        [useTheme().breakpoints.down("lg")]: {
            font: '12px Nunito Sans, sans-serif !important',
            width: "95px !important",
        },
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
        }
    },
    Paper: {
        margin: '6px 0px',
        display: "flex",
        alignItems: "center",
        // height: '70px ! important',
        // background: '#FFFFFF !important',
        border: '1px solid #1A181E !important',
        boxShadow: "none !important",
        borderRadius: '5px !important',
    },
    InputBase: {
        marginLeft: 7,
        flex: 1,
        font: '14px Nunito Sans, sans-serif !important',
        color: '#1A181E !important',
        background: '#FFFFFF 0% 0% no-repeat padding-box !important',
        opacity: 1,
        borderRadius: '5px',
        width: '100%',
        height: '60px ! important',
        '& input': {
            textAlign: 'left !important',
            paddingLeft: '20px !important'
        },
    },
    IconButton: {
        marginTop: '8px !important',
        marginRight: '10px !important'
    },
    visibilityIcon: {
        height: '18px',
        width: '18px',
        cursor: 'pointer'
    },
    notVisibleIcon: {
        height: '18px',
        width: '18px',
        cursor: 'pointer'
    },

}))

