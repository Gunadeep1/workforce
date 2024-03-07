import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material"
import { darkSkyBlue } from "../../theme";

const SignUpStyles = makeStyles(() => ({
    rightBox: {
        background: '#243042 ! important',
        height: '100vh'
    },
    image: {
        marginTop: "160px",
        marginLeft: "-200px",
        width: "85%",
    },
    fullHeight: {
        height: "100vh",
    },
    leftBox: {
        paddingTop: "100px",
        height: "100vh",
        justifyContent: 'center',
        display: 'flex',
    },
    header: {
        color: '#2D2D2D !important',
        textAlign: 'center',
    },
    form: {
        marginLeft: '-17px ! important'
    },
    buttonWidth: {
        width: '283px ! important',
        height: '45px ! important'
    },
    boxOne: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxTwo: {
        width: '400px',
        [useTheme().breakpoints.down('sm')]: {
            width: '300px',
        }
    },
    buttonStyles: {
        textAlign: 'center',
        paddingTop: '30px'
    },
    inputBoxes: {
        textAlign: "left",
        paddingLeft: '14px !important',
        paddingRight: '14px !important',
    },
    loginButton: {
        width: "170px !important",
        background: `${darkSkyBlue} 0% 0% no-repeat padding-box !important`,
        borderRadius: "3px !important",
        textTransform: "none !important",
        font: "13px Poppins !important",
        [useTheme().breakpoints.down("lg")]: {
            font: "12px Poppins !important",
            width: "150px !important",
        },
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
        }
    },
    required: {
        color: 'red'
    },
    optional: {
        color: "#C7CCD3",
        font: '12px Nunito, Nunito Sans, sans-serif !important',
        fontWeight: 400,
    },
}))

export default SignUpStyles;
