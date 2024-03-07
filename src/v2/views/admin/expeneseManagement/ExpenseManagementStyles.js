import { makeStyles } from "@mui/styles";
import { blue, btnBgBlue, btnBgGrey, btnBorder, btnStroke, red } from "../../../theme";
import { useTheme } from "@mui/material";

const ExpenseManagementStyles = makeStyles(() => ({
    activeText: {
        font: "16px Nunito Sans, sans-serif !important",
        // fontFamily: "Nunito , Nunito Sans, sans-serif",
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
        padding: '0px 25px !important',
        // borderBottom: '3px solid blue !important'
    },
    tabText: {
        font: "16px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#707070 !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
        padding: '0px 25px !important'
    },
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },

    inactive: {
        font: '13px Nunito Sans, sans-serif !important',
        padding: '10px 0px 4px 15px !important'
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
    approveText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        color: "#409C65 !important",
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    viewText2: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        color: "#0C75EB !important",
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    viewTextDisable: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        color: `${btnBgGrey.shade4} !important`,
        padding: '10px 0px 10px 15px !important',
        cursor: 'default !important'
    },
    rejectText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        color: `${red} !important`,
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    deleteText: {
        font: '13px Nunito Sans, sans-serif !important',
        // color: `${btnBgRed.shade2} !important`,
        padding: '10px 0px 3px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    Paper: {
        // margin: '6px 0px',
        display: "flex",
        alignItems: "center",
        height: '48px ! important',
        // background: '#FFFFFF !important',
        border: `1px solid ${btnBgGrey.shade4} !important`,
        boxShadow: "none !important",
        borderRadius: '8px !important',
        paddingRight: '10px !important'
    },
    InputBase: {
        flex: 1,
        font: '13px Nunito Sans, sans-serif !important',
        background: '#FFFFFF !important',
        opacity: 1,
        borderRadius: '5px !important',
        fontWeight: `${500} !important`,
        width: '100%',
        height: '30px ! important',
        textAlign: 'left !important',
        '& input': {
            textAlign: 'left !important',
            paddingLeft: '6px !important'
        },
    },

    /// Add Vendor
    browseButton: {
        background: `${btnBgBlue.shade3} !important`,
        color: `${btnStroke.blueMain} !important`,
        textAlign: "center",
        padding: "5px 5px 5px 0px !important",
        borderRadius: "6px !important",
        width: "100px",
        cursor: "pointer !important",
        height: "35px",
        font: '14px Nunito Sans, sans-serif !important',
        textTransform: "none !important",
        boxShadow: "none !important",
        fontWeight: '400 !important'
    },
    autoComplete: {
        padding: "0px !important",
        margin: "0px !important",
        background: "#FFFFFF !important",
        border: `1px solid ${btnBorder.grey} !important`,
        borderRadius: "5px",
        font: '16px Nunito Sans, sans-serif !important',
        "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
            visibility: "hidden !important",
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: "0",
            padding: "0",
        },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none",
            // padding:'0px !important'
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "& .MuiAutocomplete-tag": {
            height: "20px !important",
        },
    },
    autoCompleteInput: {
        // font: '16px Nunito Sans, sans-serif !important',
        // background: "#FFFFFF !important",
        // opacity: 1,
        // borderRadius: '8px !important',
        // border: `1px solid ${btnBorder.grey} !important`,
        height: '55px !important',
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
    },
    toggleBox: {
        width: 600,
        [useTheme().breakpoints.down("sm")]: {
            width: 420,
        },
        "@media (max-width:410px)": {
            width: 380,
        },
        "@media (max-width:375px)": {
            width: 320,
        },
    },
    editorHeight: {
        borderRadius: "8px"
    },
    subList: {
        display: 'flex !important',
        flexDirection: 'column !important',
        position: 'absolute !important',
        top: '1.25rem !important',
        left: 0,
        color: 'black !important'
    },
    subListItem: {
        position: 'absolute !important',
    },
    helperTextError: {
        color: '#e72929 !important',
        font: '11px Nunito Sans, sans-serif !important',
        marginLeft: '-5px !important'
    },
    cursor: {
        cursor: 'pointer !important'
    }
}))

export default ExpenseManagementStyles;