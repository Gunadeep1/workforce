import { makeStyles } from "@mui/styles";
import { addRecord, cardBg } from '../../theme';
import { useTheme } from "@mui/material";

const CustomSelectStyles = makeStyles(() => ({
    defaultSelect: {
        font: '14px Poppins !important',
        background: '#f4f4f4 0% 0% no-repeat padding-box',
        borderRadius: '3px',
        height: '31px !important',
        opacity: 1,
        border: '#f4f4f4',
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0,
        },
    },

    defaultSelectOrg: {
        font: '14px Poppins !important',
        background: '#f4f4f4 0% 0% no-repeat padding-box',
        borderRadius: '3px',
        height: '36px !important',
        opacity: 1,
        border: '#f4f4f4',
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0,
        },
    },
    borderSelect: {
        font: '14px Poppins !important',
        border: '1px solid #D1D1D1 !important',
        borderRadius: '3px',
        height: '36px !important',
        opacity: 1,
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
    },
    borderWhiteSelect: {
        font: '14px Poppins !important',
        border: '1px solid #D1D1D1 !important',
        background: '#FFFFFF',
        borderRadius: '3px',
        height: '34px !important',
        opacity: 1,
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
    },
    borderBlueSelectWidth: {
        font: '11px Poppins !important',
        background: '#FFFFFF !important',
        color: `${addRecord} !important`,
        border: `1px solid ${addRecord}`,
        borderRadius: '3px',
        height: '31px !important',
        minWidth: '140px',
        opacity: 1,
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
    },
    backgroundBlue: {
        font: '11px Poppins !important',
        background: `${addRecord} !important`,
        color: `#FFFFFF !important`,
        borderRadius: '3px',
        height: '31px !important',
        minWidth: '140px',
        opacity: 1,
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
    },

    yearSelect: {
        background: `${cardBg} !important`,
        borderRadius: '3px',
        height: '35px !important',
        opacity: 1,
        border: '#ECEDEF',
        font: "10px Poppins !important",
        marginTop: "-4px !important",
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0
        },
        '&:active': {
            border: '#ECEDEF !important',
        }
    },
    navYearSelect: {
        background: `#EFF5FF !important`,
        borderRadius: '3px',
        height: '35px !important',
        opacity: 1,
        border: '#ECEDEF',
        font: "10px Poppins !important",
        marginTop: "-4px !important",
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0
        },
        '&:active': {
            border: '#ECEDEF !important',
        }
    },
    defaultYearSelect: {
        background: `${cardBg} !important`,
        borderRadius: '3px',
        height: '35px !important',
        opacity: 1,
        font: "13px Poppins !important",
        border: '#ECEDEF',
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0
        },
        '&:active': {
            border: '#ECEDEF !important',
        }
    },

    //native select
    defaultNativeSelect: {
        font: '14px Poppins !important',
        background: '#f4f4f4 0% 0% no-repeat padding-box',
        borderRadius: '3px',
        height: '31px !important',
        opacity: 1,
        border: '#f4f4f4',
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0,
        },
        "& option": {
            background: "#FFFFFF !important",
            color: "#OOOOOO !important",
        },

        // '&:not([multiple]) option, &:not([multiple]) optgroup': {
        //     backgroundColor: "green !important",
        //   },

    },
    cardSelect: {
        background: '#EFF5FF !important',
        color: '#707070',
        borderRadius: '3px',
        height: '20px !important',
        opacity: 1,
        font: "10px Poppins !important",
        marginTop: "-4px !important",
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0
        },
        '&:active': {
            border: '#ECEDEF !important',
        }
    },
    cardSelectGray: {
        background: '#F7F7F7 !important',
        color: '#707070',
        borderRadius: '3px',
        height: '15px !important',
        width: '100px !important',
        opacity: 1,
        font: "10px Poppins !important",
        marginTop: "-4px !important",
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0
        },
        '&:active': {
            border: '#ECEDEF !important',
        }
    },
    whiteSelect: {
        font: '12px Poppins !important',
        background: '#FFFFFF',
        borderRadius: '3px',
        height: '34px !important',
        minWidth: '160px',
        opacity: 1,
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        [useTheme().breakpoints.down('sm')]: {
            minWidth: "80px !important",
            font: '11px Poppins !important',
        }
    },


    commonSelect: {
        "& .MuiSelect-select": {
            padding: '22.28px 35px 10px 12px !important',
            // marginTop:'25px !important',
            height: '17px !important',
            width: '100% !important',
            background: 'white !important',
            border: '1px solid #C7CCD3 !important',
            borderRadius: '8px !important',
            font: '14px Nunito !important',
            color: '#262626 !imporant',
            fontWeight: `${400} !important`,
        },

        background: 'white !important',
        height: '54px !important',
        borderRadius: '8px !important',


        "& .MuiSvgIcon-root": {
            fill: '#C7CCD3 !important',
            marginRight: '5px !important',
        },

        "& .Mui-disabled": {
            background: "#FAFAFA !important",
            borderRadius: '8px !important',
            border: '1px solid #FAFAFA !important',
            "-webkit-text-fill-color": '#525252 !important',
            fill: '#737373 !important',
        },

        "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
            top: '15px !important'
        },

    },

    commonSelectBorderBlue: {
        "& .MuiSelect-select": {
            padding: '22.28px 35px 10px 12px !important',
            height: '17px !important',
            width: '100% !important',
            background: 'white !important',
            border: '1px solid #5DA5F5 !important',
            borderRadius: '8px !important',
            font: '14px Nunito !important',
            color: '#262626 !imporant',
            fontWeight: `${400} !important`,
        },

        background: 'white !important',
        height: '54px !important',
        borderRadius: '8px !important',

        "& .MuiSvgIcon-root": {
            fill: '#5DA5F5 !important',
            marginRight: '5px !important',
        },

        "& .Mui-disabled": {
            background: "#FAFAFA !important",
            borderRadius: '8px !important',
            border: '1px solid #FAFAFA !important',
            "-webkit-text-fill-color": '#525252 !important',
            fill: '#737373 !important',
        },

        "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
            top: '15px !important'
        },

    },


    inputLabel: {
        color: '#737373 !important',
        font: '14px Nunito !important',
        fontWeight: `${400} !important`,
    },
    //timesheetDashboardDropdown
    viewDrop: {
        "MuiModal-root-MuiPopover-root-MuiMenu-root .MuiMenuItem-root": {
            height: '20px !important'
        },
        "& .MuiSelect-select": {
            padding: "7.28px 35px 5px 12px !important",
            height: '20px !important',
            width: '100% !important',
            background: 'white !important',
            border: '1px solid #C7CCD3 !important',
            borderRadius: '8px !important',
            font: '14px Nunito !important',
            color: '#262626 !imporant',
            fontWeight: `${400} !important`,
        },
        background: 'white !important',
        height: '40px !important',
        borderRadius: '8px !important',
        "& .MuiSvgIcon-root": {
            fill: '#C7CCD3 !important',
            marginRight: '5px !important',
        },
        "& .Mui-disabled": {
            background: "#FAFAFA !important",
            borderRadius: '8px !important',
            border: '1px solid #FAFAFA !important',
            "-webkit-text-fill-color": '#525252 !important',
            fill: '#737373 !important',
        },
        "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
            top: '15px !important'
        },
    },
    //BalanceSheet view
    viewDrop1: {
        "& .MuiSelect-select": {
            padding: "7.28px 35px 10px 12px !important",
            height: '20px !important',
            width: '100% !important',
            background: 'white !important',
            // border: '1px solid #C7CCD3 !important',
            borderRadius: '8px !important',
            font: '14px Nunito !important',
            color: '#262626 !imporant',
            fontWeight: `${400} !important`,
        },

        background: 'white !important',
        height: '40px !important',
        borderRadius: '8px !important',


        "& .MuiSvgIcon-root": {
            // fill: '#C7CCD3 !important',
            fill: '#737373 !important',
            marginRight: '5px !important',
        },

        "& .Mui-disabled": {
            background: "#FAFAFA !important",
            borderRadius: '8px !important',
            border: '1px solid #FAFAFA !important',
            "-webkit-text-fill-color": '#525252 !important',
            fill: '#737373 !important',
        },

        "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
            top: '15px !important'
        },

    }
}))
export default CustomSelectStyles;



// "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
//     // Default transform is "translate(14px, 20px) scale(1)""
//     // This lines up the label with the initial cursor position in the input
//     // after changing its padding-left.
//     transform: "translate(34px, 20px) scale(1);"
// },
// "&.Mui-focused .MuiInputLabel-outlined": {
//     color: "purple"
// }