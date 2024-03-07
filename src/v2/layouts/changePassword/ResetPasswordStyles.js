import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";


const ResetPasswordStyles = makeStyles(() => ({
    
    fullHeight: {
        height: "100%",
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
    },
    resetButton:{
        width: "100% !important",
        height: "43px !important",
        background: `#0C75EB !important`,
        borderRadius: "8px !important",
        textTransform: "none !important",
        font: '16px Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        [useTheme().breakpoints.down("lg")]: {
            font: '12px Nunito Sans, sans-serif !important',
            width: "95px !important",
        },
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
        }
    },
    endAdornmentControl: {
        margin: '0px',
        position: 'relative',
        verticalAlign: 'unset',

        "& .MuiFilledInput-root": {
            borderRadius: '8px !important',
            border: `1px solid #C7CCD3 !important`,
            background: 'none !important'
        },
        "& .MuiTypography-root": {
            font: '14px Nunito !important',
            fontWeight: `${400} !important`,
            color: '#262626 !important',
            padding: '0px 0px 2px 0px !important',
        },
        "& .MuiFormLabel-root": {
            color: '#737373 !important',
            font: '14px Nunito !important',
            fontWeight: `${400} !important`,
        },
        "& .MuiInputAdornment-root": {
            color: 'grey',
        },

        "& .MuiInputBase-root.MuiFilledInput-root.Mui-disabled": {
            border: `1px solid #FAFAFA !important`,
            background: '#FAFAFA !important'
        }
    },


    endAdornmentInput: {
        font: '16px Nunito !important',
        background: "#FFFFFF !important",
        opacity: 1,
        borderRadius: '8px !important',
        // border: `1px solid #C7CCD3 !important`,
        "&.MuiInputBase-input": {
            padding: '25.41px 12px 10px 12px !important',
            height: '17px',
            color: '#262626 !important',
            font: '14px Nunito !important',
            fontWeight: `${400} !important`,
        },
        "&:disabled": {
            background: "#FAFAFA !important",
            borderRadius: '8px !important',
            border: '1px solid #FAFAFA !important',
            '-webkit-text-fill-color': "#525252 !important",
        },

    },
    passwordReq: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#171717 !important",
        fontSize: "14px !important",
        fontWeight: "500 !important"
    },

}))

export default ResetPasswordStyles