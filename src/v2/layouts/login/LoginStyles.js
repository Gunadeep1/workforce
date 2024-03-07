import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
        width: '400px',
        [useTheme().breakpoints.down('md')]: {
            width: '400px',
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
        margin: '10px 0px !important',
    },
    buttonStyles: {
        textAlign: 'center',
        paddingTop: '30px'
    },
    forgotPassword: {
        color: "#318CF1 !important",
        font: '12px Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        cursor: "pointer"
    },
    Paper: {
        margin: '6px 0px',
        display: "flex",
        alignItems: "center",
        // height: '70px ! important',
        // background: '#FFFFFF !important',
        border: '1px solid #C7CCD3 !important',
        boxShadow: "none !important",
        borderRadius: '8px !important',
    },
    InputBase: {
        marginLeft: 7,
        flex: 1,
        font: '14px Nunito Sans, sans-serif !important',
        color: '#1A181E !important',
        background: '#FFFFFF 0% 0% no-repeat padding-box !important',
        opacity: 1,
        borderRadius: '8px',
        width: '100%',
        height: '52px ! important',
        '& input': {
            textAlign: 'left !important',
            paddingLeft: '10px !important'
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

}))

