// import { useTheme } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { blue, btnBgGreen, btnBgGrey, btnBgRed, btnStroke, btnTxtBlack, lightGrey, orange } from "../../theme"
import { useTheme } from "@mui/material"

const TextStyles = makeStyles((theme) => ({
    mediumLabel: {
        font: '12px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#707070 !important",
        textTransform: 'capitalize !important',
        // fontWeight: '500 !important',
        opacity: 1
    },
    smallLabel: {
        font: '11px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#707070 !important",
        textTransform: 'capitalize !important',
        // fontWeight: '500 !important',
        opacity: 1
    },
    largeBlue: {
        font: '17px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
    },
    smallBlue: {
        font: "12px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `${blue} !important`,
        fontWeight: `${550} !important`,
        opacity: 1,
        [useTheme().breakpoints.down('lg')]: {
            font: "9px Poppins, sans-serif !important",
        }
    },
    smallBlack: {
        font: '12px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        opacity: 1,
        fontWeight: '500 !important',
        color: `${btnTxtBlack.shade4} !important`
    },
    blackFont14: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        opacity: 1,
        color: `${btnTxtBlack.shade1} !important`
    },
    verySmallBoldBlack: {
        font: '11px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade1} !important`,
        fontWeight: `${600} !important`,
        opacity: 1
    },
    largeBlack: {
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        opacity: 1,
        fontWeight: `${500} !important`,
        color: `${btnTxtBlack.shade4} !important`,
    },
    largeLabel: {
        font: '15px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#737373 !important",
        opacity: 1
    },
    veryLargeLabel: {
        font: '18px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${lightGrey} !important`,
        fontWeight: `${600} !important`,
        opacity: 1
    },
    BrowmnMnStepperText: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnStroke.black} !important`,
        fontWeight: `${400} !important`,
        opacity: 1
    },
    mediumBlack: {
        font: '15px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        opacity: 1,
        fontWeight: `${500} !important`,
        color: `${btnTxtBlack.shade4} !important`,
    },
    headerBlack: {
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        opacity: 1,
        fontWeight: `${500} !important`,
        color: `${btnTxtBlack.shade4} !important`,
    },
    smallGrayLabel: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#cbcbcb !important",
        opacity: 1,
    },
    largeGreen: {
        font: '18px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#28A745 !important",
        opacity: 1
    },
    mediumGreen: {
        font: '21px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#15803D !important",
        fontWeight: `${500} !important`,
        opacity: 1
    },
    largeBoldGreen: {
        font: '21px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#15803D !important",
        fontWeight: `${600} !important`,
        opacity: 1
    },
    mediumOrange: {
        font: '13px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${orange} !important`,
        opacity: 1
    },
    smallOrange: {
        font: '10px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${orange} !important`,
        opacity: 1
    },
    largeOrange: {
        font: '18px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${orange} !important`,
        opacity: 1
    },
    smallWhite: {
        font: '10px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#FFFFFF !important",
        opacity: 1
    },
    mediumWhite: {
        font: '12px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#FFFFFF !important",
        opacity: 1
    },
    verySmallGreen: {
        font: '9px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnBgGreen.shade1} !important`,
        // fontWeight:`${600} !important`,
        opacity: 1
    },
    smallGreen: {
        font: '13px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnBgGreen.shade1} !important`,
        // fontWeight:`${600} !important`,
        opacity: 1
    },
    mediumGrey: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${lightGrey} !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
    },
    red: {
        font: '11px Nunito Sans, sans-serif !important',
        color: `${btnBgRed.shade4} !important`,
    },
    sidebarText: {
        fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "#FFFFFF"
    },
    errorText: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontSize: "12px !important",
        color: "red",
    },
    checkboxlable: {
        fontWeight: "500 !important",
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        color: "#101828 !important"
    },
    BlackExtraDark: {
        fontWeight: `${500} !important`,
        font: '16px Nunito Sans, sans-serif !important',
        color: "#262626 !important"
    },
    largeBldBlack: {
        font: '15px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade2} !important`,
        opacity: 1,
        fontWeight: `${700} !important`,
        textTransform: 'capitalize !important',
    },
    veryLargeBlack: {
        font: '18px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade2} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
    },
    largeGrey: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${lightGrey} !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
    },
    mediumOverView: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: "500 !important",
        color: `${btnTxtBlack.shade5} !important`,
    },
    mediumViewAmt: {
        font: '18px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: "600 !important",
        color: `#000000 !important`,
    },
    smallGrey: {
        font: '12px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${lightGrey} !important`,
        opacity: 1,
    },
    smallGreyText: {
        font: '13px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${lightGrey} !important`,
        opacity: 1,
        fontWeight: '600 !important'
    },
    largeWhite: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#FFFFFF !important",
        opacity: 1
    },
    largeBoldBlack: {
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#2A3042 !important",
        fontWeight: `${500} !important`,
        opacity: 1
    },
    mediumBlackColor: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#000000 !important`,
    },
    mediumYellow: {
        font: "12px Poppins, sans-serif !important",
        letterSpacing: '0px',
        color: "#F9A828 !important",
        opacity: 1
    },
    // mediumBoldBlack: {
    //     font: '13px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#2A3042 !important",
    //     fontWeight: `${600} !important`,
    //     opacity: 1,
    //     textTransform: 'capitalize !important'
    // },
    // smallBoldBlack: {
    //     font: '11px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#2A3042 !important",
    //     fontWeight: `${500} !important`,
    //     opacity: 1
    // },
    // mediumLessBoldBlack: {
    //     font: '12px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#2A3042 !important",
    //     fontWeight: `${500} !important`,
    //     opacity: 1
    // },

    // mediumBoldPrimary: {
    //     font: '12px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#2A3042 !important",
    //     fontWeight: `${600} !important`,
    //     opacity: 1
    // },
    // veryLargeBlack: {
    //     font: '19px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#323232 !important",
    //     fontWeight: `${700} !important`,
    //     opacity: 1
    // },

    // smallRed: {
    //     font: "10px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#FF5656 !important",
    //     opacity: 1
    // },  
    // mediumBoldRed: {
    //     font: "12px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#FF5656 !important",
    //     fontWeight: `${500} !important`,
    //     opacity: 1
    // },
    // largeRed: {
    //     font: "14px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#FF5656 !important",
    //     opacity: 1
    // },
    // smallBoldGreen: {
    //     font: "10px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#28A745 !important",
    //     fontWeight: `${600} !important`,
    //     opacity: 1
    // },
    // mediumGreen: {
    //     font: "12px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#28A745 !important",
    //     opacity: 1
    // },


    // smallYellow: {
    //     font: "10px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#F9A828 !important",
    //     opacity: 1
    // },

    // largeYellow: {
    //     font: "14px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#F9A828 !important",
    //     opacity: 1
    // },    
    // mediumBlue: {
    //     font: "12px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#054CA6 !important",
    //     opacity: 1
    // }, 

    // smallLightBlue: {
    //     font: "10px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#0260D8 !important",
    //     fontWeight: `${600} !important`,
    //     opacity: 1
    // },
    // mediumLightBlue: {
    //     font: "12px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#0260D8 !important",
    //     opacity: 1
    // },
    // largeLightBlue: {
    //     font: "14px Poppins, sans-serif !important",
    //     letterSpacing: '0px',
    //     color: "#0260D8 !important",
    //     opacity: 1
    // },   


    // smallBoldOrange: {
    //     font: '10px Poppins !important',
    //     letterSpacing: '0px',
    //     color: '#EE8A73 !important',
    //     fontWeight: `${600} !important`,
    //     opacity: 1
    // },

    // smallBoldBlue: {
    //     font: '11px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#054CA6 !important",
    //     fontWeight: `${500} !important`,
    //     opacity: 1
    // },
    // mediumBoldBlue: {
    //     font: '13px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#054CA6 !important",
    //     fontWeight: `${600} !important`,
    //     opacity: 1
    // },
    // largeBoldBlue: {
    //     font: '15px Poppins !important',
    //     letterSpacing: '0px',
    //     color: "#054CA6 !important",
    //     fontWeight: `${600} !important`,
    //     opacity: 1
    // },
    profileTitle: {
        font: '16px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `${btnTxtBlack.shade4} !important`
    },
    overViewLable: {
        font: '16px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: "500 !important",
        color: `${btnTxtBlack.shade5} !important`,
    },
    overViewAmount: {
        font: '22px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: "600 !important",
        color: `#000000 !important`,
    },
    //TimeSheet Text Styles
    cardTitle: {

        // color: `${btnTxtBlack.shade4} !important`,
        font: "16px Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        opacity: 1,
        border: 0,
        outline: 'none !important'
    },
    smallBlue1: {
        font: "14px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `${blue} !important`,
        fontWeight: `${600} !important`,
        opacity: 1,
        [useTheme().breakpoints.down('lg')]: {
            font: "9px Poppins, sans-serif !important",
        }
    },
    boldBlackfont600: {
        font: '17px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade2} !important`,
        opacity: 1,
        fontWeight: `${600} !important`,
        textTransform: 'capitalize !important',
    },
    largeGreyTxt: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnBgGrey.shade6} !important`,
        textTransform: 'capitalize !important',
        opacity: 1
    },
    largeGrey16: {
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnBgGrey.shade6} !important`,
        textTransform: 'capitalize !important',
        opacity: 1
    },
    greyLabel: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#737373 !important`,
    },

    mediumBlue: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#0C75EB !important`,
    },
    //BalanceSheet styles
    boldBlackfont16: {
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade2} !important`,
        opacity: 1,
        fontWeight: `${600} !important`,
        textTransform: 'capitalize !important',
    },
    verySmallBlack: {
        font: '10px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        opacity: 1,
        fontWeight: '500 !important',
        color: `${btnTxtBlack.shade4} !important`
    },
    boldBlackfont22: {
        font: '22px Nunito Sans, sans-serif !important',
        color: `#092333 !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
    },
    //popupStyles
    popupHead1: {
        color: "#54595E !important",
        font: '18px  Nunito , Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        textAlign: 'center !important'
    },
    popupHead2: {
        color: "#54595E99 !important",
        font: '14px  Nunito , Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        textAlign: 'center !important'
    },
    mediumRed: {
        font: '14px  Nunito , Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: "#FF5656 !important",
        opacity: 1,
        fontWeight: `${600} !important`,
    },
    //style for header in org config (Add new role)
    blackHeader18: {
        font: "18px Nunito !important",
        fontWeight: "600 !important",
        color: "#171717",
    },
    mediumBlack14: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#262626 !important`,
    },
    blackHeader: {
        font: '16px Nunito Sans, sans-serif !important',
        color: '#171717 !important',
        fontWeight: '400 !important'
    },
    mediumBoldBlack2: {
        font: '14px Nunito Sans, sans-serif !important',
        color: '#000000 !important',
        fontWeight: `${600} !important`
    },
    lightGrey3: {
        font: '12px Nunito Sans, sans-serif !important',
        color: '#737373 !important',
        fontWeight: '500 !important'
    },
    mediumGrey2: {
        font: '14px Nunito Sans, sans-serif !important',
        color: '#404040 !important',
        fontWeight: '400 !important'
    },
    blackHeader1: {
        font: '18px Nunito Sans, sans-serif !important',
        color: '#171717 !important',
        fontWeight: '600 !important',
    },
    infoText: {
        font: "12px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "400 !important",
     },

    mediumBoldWhite: {
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `#ffffff !important`,
        fontWeight: `${600} !important`,
        opacity: 1
    },
    mediumBoldBlack: {
        font: '16px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `#262626  !important`,
        fontWeight: `${600} !important`,
        opacity: 1
    },
    employeeAdded: {
        font: '12px Nunito Sans, sans-serif !important',
        color: 'rgba(23, 23, 23, 1) !important',
        fontWeight: '400 !important',
    },
    radarDetails:  {
        font: '12px Nunito Sans, sans-serif !important',
        color: 'rgba(64, 64, 64, 1) !important',
        fontWeight: '500 !important',
    },
}))

export default TextStyles
