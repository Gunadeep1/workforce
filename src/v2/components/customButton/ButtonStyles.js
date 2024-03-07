import { makeStyles } from "@mui/styles";
import { blue, btnBgBlue, btnBgGrey, btnBgRed, btnBorder, btnStroke, btnTxtBlack, btnTxtBlue, btnTxtWhite, greyButton, lightGrey, orange } from "../../theme";
// import { addButton, saveButtonColor } from "../../../theme";

const ButtonStyles = makeStyles((theme) => ({
    mediumInvite: {
        height: '40px !important',
        background: `#FFFFFF !important`,
        color: `${blue} !important`,
        textTransform: 'capitalize !important',
        minWidth: '135px !important',
        borderRadius: '14px !important',
        border: `1px solid ${blue} !important`,
        fontSize: "13px !important",
        fontFamily: "Nunito, sans-serif",
        fontWeight: "400",
        width: "150px",
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },
    onboardBtn: {
        height: '40px !important',
        // background: `${blue} !important`,
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        width: '120px',
        borderRadius: '12px !important',
        fontSize: "13px !important",
        fontFamily: "Nunito, sans-serif",
        fontWeight: "400",
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },
    outlineBlueMedium1: {
        all: "unset",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif  !important",
        fontWeight: `${600} !important`,
        width: "150px",
        height: "40px",
        border: "1.5px solid #0C75EB !important",
        borderRadius: "12px !important",
        color: "#0C75EB !important",
        transition: "all .3s ease",
        textTransform: 'capitalize !important',
        '&:hover': {
            backgroundColor: '#0C75EB !important', color: '#FFFFFF !important'
        },
    },
    blackCancel: {
        font: "15px Nunito, sans-serif !important",
        color: `${btnTxtBlack.shade1} !important`,
        textTransform: "none !important",
        border: `1px solid ${btnBorder.grey} !important`,
        borderRadius: "8px !important",
        minWidth: "85px !important",
        height: "42px !important",
        fontWeight: '500px !important',
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    brownMnSave: {
        font: "15px Nunito, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "85px !important",
        height: "42px !important",
        variant: "outlined",
        fontWeight: '500px !important',
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    blueButton: {
        font: "15px Nunito, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        height: "42px !important",
        width: '100% !important',
        variant: "outlined",
        fontWeight: '500px !important',
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    addButton: {
        font: "14px Nunito, sans-serif !important",
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "150px !important",
        height: "45px !important",
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    addButtonDisable: {
        font: "14px Nunito, sans-serif !important",
        background: `#FFFFFF !important`,
        border: `1px solid ${btnBgGrey.shade4} !important`,
        color: `${btnBgGrey.shade4} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "150px !important",
        height: "45px !important",
        variant: "outlined",
        cursor: 'not-allowed !important'
   
    }, addButtonmd: {
        font: "14px Nunito, sans-serif !important",
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "95px !important",
        height: "45px !important",
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    // Full Width
    lightBlue: {
        font: "14px Nunito, sans-serif !important",
        background: `#F5F9FF !important`,
        color: `${btnBorder.blue} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        height: "35px !important",
        width: '100% !important',
        fontWeight: `${500} !important`,
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
            background: `${btnBgBlue.shade3} !important`
        }
    },
    save: {
        font: "15px Nunito, sans-serif !important",
        height: '40px !important',
        color: '#FFFFFF !important',
        textTransform: 'capitalize !important',
        minWidth: '120px !important',
        borderRadius: '8px !important',
        background: `${blue} !important`,
        fontWeight: "400",
        width: "150px",
        '&:hover': {
            border: `1px solid ${blue} !important`,
            backgroundColor: '#FFFFFF !important',
            color: `${blue} !important`
        },
    },

    addNew: {
        font: "16px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "159px !important",
        height: "42px !important",
        variant: "outlined",
    },
    addNewDisable: {
        font: "16px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        background: `#fff !important`,
        color: `${btnBgGrey.shade4} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "159px !important",
        height: "42px !important",
        variant: "outlined",
        border: `1px solid ${btnBgGrey.shade4} !important`,
        cursor: 'not-allowed !important'
    },
    rejectDisable: {
        font: "16px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        background: `#fff !important`,
        color: `${btnBgGrey.shade4} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "100px !important",
        height: "42px !important",
        variant: "outlined",
        border: `1px solid ${btnBgGrey.shade4} !important`,
        cursor: 'not-allowed !important'
    },
    iconRemoveBtn: {
        font: "16px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        background: ` #E51A1A !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "159px !important",
        height: "42px !important",
        variant: "outlined",
    },

    EditBlue: {
        font: "16px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "105px !important",
        height: "45px !important",
        variant: "outlined",
    },

    outlineBlue: {
        height: '40px !important',
        font: '16px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        width: '120px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },
    outlineBlueSmall: {
        height: '33px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        width: '100px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },

    saveBtn: {
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "121px !important",
        height: "48px !important",
        variant: "outlined"
    },
    saveBtnDisable: {
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        background: `#fff !important`,
        color: `${btnBgGrey.shade4} !important`,
        border: `1px solid ${btnBgGrey.shade4} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "121px !important",
        height: "48px !important",
        variant: "outlined",
        cursor: 'default !important'
    },

    cancelBtn: {
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` ${btnTxtBlack.shade2} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        // border: `1px solid ${btnBgRed.shade2} !important`,
        minWidth: "121px !important",
        height: "48px !important",
        variant: "outlined",
        '&:hover': {
            background: `${btnBgRed.shade4} !important`,
            color: '#FFFFFF !important',
        },
    },
    cancelBtnBorder: {
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` #525167 !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        border: `1px solid #525167 !important`,
        // border: 1px solid #525167
        minWidth: "121px !important",
        height: "48px !important",
        variant: "outlined",
        '&:hover': {
            border: `1px solid #FFFFFF !important`,
            background: `${btnBgRed.shade4} !important`,
            color: '#FFFFFF !important',
        },
    },

    browseBtn: {
        font: "16px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${btnBgBlue.shade3} !important`,
        color: `${btnTxtBlue.shade2} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "111px !important",
        height: "34px !important",
        variant: "outlined",
        stroke: `${btnStroke.blue} !important`,
        '&:hover': {
            // background: `${btnTxtWhite} !important`,
            // border: `1px solid ${blue} !important`,
            // color: `${blue} !important`,
        },
        '&:disabled': {
            font: "16px Nunito !important",
            fontWeight: `${400} !important`,
            background: ` ${btnBgGrey.shade1} !important`,
            color: `#FFFFFF !important`,
            textTransform: "none !important",
            borderRadius: "8px !important",
            minWidth: "111px !important",
            height: "34px !important",
            variant: "outlined",
            stroke: '#FFFFFF !important',
        }

    },

    browseBtnUpload: {
        font: "16px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${btnBgBlue.shade3} !important`,
        color: `#5DA5F5 !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "111px !important",
        height: "34px !important",
        variant: "outlined",
        stroke: `${btnStroke.blue} !important`,
        '&:hover': {
            // background: `${btnTxtWhite} !important`,
            // border: `1px solid ${blue} !important`,
            // color: `${blue} !important`,
        },
        '&:disabled': {
            font: "16px Nunito !important",
            fontWeight: `${400} !important`,
            background: ` ${btnBgGrey.shade1} !important`,
            color: `#FFFFFF !important`,
            textTransform: "none !important",
            borderRadius: "8px !important",
            minWidth: "111px !important",
            height: "34px !important",
            variant: "outlined",
            stroke: '#FFFFFF !important',
        }

    },


    saveLoader: {
        background: `${blue} !important`,
        borderRadius: "8px !important",
        height: "48px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "140px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },
    saveLoaderDisable: {
        background: `#fff !important`,
        borderRadius: "8px !important",
        height: "48px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: `${btnBgGrey.shade4} !important`,
        border: `1px solid ${btnBgGrey.shade4} !important`,
        minWidth: "140px !important",
        cursor: 'default !iportant',
        "& .MuiLoadingButton-loadingIndicator": {
            color: `${btnBgGrey.shade4} !important`,
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "default !important",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },
    disable: {
        height: '33px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        color: `${lightGrey} !important`,
        border: `1px solid ${lightGrey} !important`,
        textTransform: 'capitalize !important',
        minWidth: '100px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        cursor: 'default !important'
    },
    add: {
        fontWeight: `${600} !important`,
        background: ` ${blue} !important`,
        borderRadius: "8px !important",
        minWidth: "42px !important",
        height: "42px !important",
        display: "flex !important",
        alignItems: "center !important",
        justifyContent: 'center !important',
        margin: "0px !important"
    },

    remove: {
        fontWeight: `${600} !important`,
        background: ` ${btnBgRed.shade2} !important`,
        borderRadius: "8px !important",
        minWidth: "42px !important",
        height: "42px !important",
        display: "flex !important",
        alignItems: "center !important",
        justifyContent: 'center !important',
        margin: "0px !important"
    },



    clearAll: {
        justifySelf: 'end',
        background: `${btnBgGrey.shade5} !important`,
        borderRadius: "8px !important",
        height: '28px !important',
        opacity: 1,
        textTransform: "capitalize !important",
        font: "12px Nunito !important",
        fontWeight: `${400} !important`,
        color: "#181A18 !important",
        minWidth: "92px !important",
    },

    saveSmall: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "125px !important",
        height: "35px !important",
        variant: "outlined",
        '&:hover': {
            // background: `${btnTxtWhite} !important`,
            // border: `1px solid ${blue} !important`,
            // color: `${blue} !important`,
        },
    },
    cancelSmall: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` ${btnTxtBlack.shade2} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        // border: `1px solid ${btnBgRed.shade2} !important`,
        minWidth: "91px !important",
        height: "35px !important",
        variant: "outlined",
        '&:hover': {
            background: `${btnBgRed.shade2} !important`,
            color: '#FFFFFF !important',
        },
    },

    exportSmall: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "91px !important",
        height: "35px !important",
        variant: "outlined",

    },

    BorderBlueButton: {
        height: '35px !important',
        background: `#FFFFFF !important`,
        color: `${blue} !important`,
        textTransform: 'capitalize !important',
        minWidth: '120px !important',
        borderRadius: '8px !important',
        border: `1px solid ${blue} !important`,
        font: "14px Nunito Sans, sans-serif !important",
        fontWeight: `${500} !important`,
    },
    popupSaveBlue: {
        font: "14px Nunito Sans, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        height: "36px !important",
        width: '100px !important',
        variant: "outlined",
        fontWeight: `${500} !important`,
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    popupSaveBlueDisable: {
        font: "14px Nunito Sans, sans-serif !important",
        background: `#fff !important`,
        color: `${btnBgGrey.shade4} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        height: "36px !important",
        width: '100px !important',
        variant: "outlined",
        fontWeight: `${500} !important`,
        border: `1px solid ${btnBgGrey.shade4} !important`,
        cursor: 'default !important'
    },
    popupCancel: {
        font: "15px Nunito Sans, sans-serif !important",
        color: `${blue} !important`,
        textTransform: "none !important",
        border: `1px solid ${blue} !important`,
        borderRadius: "8px !important",
        width: '100px !important',
        height: "36px !important",
        fontWeight: `${500} !important`,
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    addHeightButton: {
        font: "16px Nunito Sans, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "150px !important",
        height: "53px !important",
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    saveAsDraft: {
        color: `${blue} !important`,
        height: "42px !important",
        font: "14px Nunito Sans, sans-serif !important",
        background: '#FFFFFF !important',
        textTransform: 'capitalize !important',
        fontWeight: `${500} !important`,
        borderRadius: "8px !important",
        // "&:hover": {
        //     background: `${blue} !important`,
        //     color: '#FFFFFF !important'
        // }
    },
    greyButton: {
        font: "16px Nunito Sans, sans-serif !important",
        background: `${greyButton} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "85px !important",
        height: "42px !important",
        variant: "outlined",
    },
    groupBtn: {
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        textTransform: 'capitalize !important',
        fontWeight: "600 !important",
        borderColor: `#E2E5E6 !important`,
        color: `${greyButton} !important`,
        "&:focus": {
            color: `#ffffff !important`,
            boxShadow: 'none',
            backgroundColor: `${blue} !important`,
            borderColor: `${blue} !important`,
        },
        "&:active": {
            color: `#ffffff !important`,
            boxShadow: 'none',
            backgroundColor: `${blue} !important`,
            borderColor: `${blue} !important`,
        },
        // "& .makeStyles-groupBtn-163": {
        //     '&:active': {
        //         color: `red !important`,
        //         boxShadow: 'none',
        //         backgroundColor: `${blue} !important`,
        //         borderColor: `${blue} !important`,
        //     },
        // }
    },
    clearall: {
        font: "16px Nunito Sans, sans-serif !important",
        fontWeight: `${580} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` ${btnBgRed.shade2} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        // border: `1px solid ${btnBgRed.shade2} !important`,
        // minWidth: "121px !important",
        minWidth: "85px !important",
        height: "42px !important",
        // height: "48px !important",
        variant: "outlined",
        // '&:hover': {
        //     background: `${btnBgRed.shade4} !important`,
        //     color: '#FFFFFF !important',
        // },
    },
    texutalCancel: {
        font: "18px Nunito Sans, sans-serif !important",
        fontWeight: `${590} !important`,
        color: ` ${btnTxtBlack.shade1} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "85px !important",
        height: "42px !important",
        variant: "outlined",
        '&:hover': {
            background: `none !important`,
        },
    },
    no: {
        height: '40px !important',
        font: '16px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        // width: '120px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },

    deleteBtn: {
        background: `#F85036 !important`,
        borderRadius: "8px !important",
        height: "40px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "168px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },
    popupDelete: {
        background: `${blue} !important`,
        borderRadius: "8px !important",
        height: "42px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: '16px Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "168px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },
    outlinedSmallAdd: {
        height: '36px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        width: '80px',
        // borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },
    popupCancelHeight: {
        font: "15px Nunito Sans, sans-serif !important",
        color: `${blue} !important`,
        textTransform: "none !important",
        border: `1px solid ${blue} !important`,
        borderRadius: "8px !important",
        width: '100px !important',
        height: "46px !important",
        fontWeight: `${500} !important`,
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    editButton: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        height: "28px",
        width: "100px",
        padding: "0px 18px !important",
        background: `${blue} !important`,
        color: '#fff !important',
    },
    editButtonDisable: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        height: "28px",
        width: "100px",
        padding: "0px 18px !important",
        background: `#fff !important`,
        color: `${btnBgGrey.shade4} !important`,
        border: `1px solid ${btnBgGrey.shade4} !important`,
        cursor: 'not-allowed !important'
    },
    viewButton: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        height: "28px",
        width: "100px",
        padding: "0px 18px !important",
        border: `1px solid ${blue} !important`,
        color: `${blue} !important`,
        background: '#FFFFFF !important'
    },
    smallSaveLoader: {
        background: `${blue} !important`,
        borderRadius: "8px !important",
        height: "46px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "110px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '0px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },

    reopenBtn: {
        font: "16px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` ${btnTxtBlack.shade2} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        border: `1px solid ${btnBgGrey.shade2} !important`,
        minWidth: "192px !important",
        height: "42px !important",
        variant: "outlined",
    },
    outlineBlueAuto: {
        height: '42px !important',
        minWidth: '76px !important',
        font: '18px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        borderRadius: '10px !important',
        fontWeight: `500 !important`,
        padding: "4px 20px !important",
        cursor: 'pointer !important',
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },

    outlineBlueAutoAdd: {
        height: '42px !important',
        minWidth: '76px !important',
        font: '18px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        borderRadius: '4px !important',
        fontWeight: `500 !important`,
        padding: "4px 20px !important",
        cursor: 'pointer !important',
        // '&:hover': {
        //     background: `${blue} !important`,
        //     color: '#FFFFFF !important'
        // },
    },

    saveBtnSmall: {
        height: "42px !important",
    },
    saveLarge: {
        height: "52px !important",
    },
    disablebutton: {
        height: '36px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        background: `#EAECF0 !important`,
        // border: `1px solid ${lightGrey} !important`,
        textTransform: 'capitalize !important',
        width: '80px',
        cursor: 'not-allowed !important',
        color: '#FFFFFF !important',
        // borderRadius: '8px !important',
        fontWeight: `${600} !important`,
    },
    popupBack: {
        font: "15px Nunito Sans, sans-serif !important",
        color: `${blue} !important`,
        textTransform: "none !important",
        border: `1px solid ${blue} !important`,
        borderRadius: "8px !important",
        width: '85px !important',
        height: "42px !important",
        fontWeight: `${500} !important`,
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },

    saveLoaderAutoWidth: {
        background: `${blue} !important`,
        borderRadius: "8px !important",
        height: "42px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "200px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },
    cancelOutline: {
        font: "14px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` ${btnBgRed.shade4} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        border: `1px solid ${btnBgRed.shade4} !important`,
        minWidth: "95px !important",
        height: "40px !important",
        variant: "outlined",
        '&:hover': {
            background: `${btnBgRed.shade4} !important`,
            color: '#FFFFFF !important',
        },
    },

    approveBtn: {
        font: "14px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "95px !important",
        height: "40px !important",
        variant: "outlined",
        '&:hover': {
            // background: `${btnTxtWhite} !important`,
            // border: `1px solid ${blue} !important`,
            // color: `${blue} !important`,
        },
    },

    blueOutlineBtn: {
        height: '40px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        stroke: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        width: '182px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important',
            stroke: '#FFFFFF !important',
        },
    },

    sendBtn: {
        font: "14px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "157px !important",
        height: "40px !important",
        variant: "outlined",
    },


    blueBtnSave: {
        font: "18px Nunito, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "88px !important",
        height: "42px !important",
        variant: "outlined",
        fontWeight: '500px !important',
    },


    blackCancelBtn: {
        font: "18px Nunito, sans-serif !important",
        color: `${btnTxtBlack.shade4} !important`,
        textTransform: "none !important",
        border: `1px solid ${btnTxtBlack.shade4} !important`,
        borderRadius: "8px !important",
        minWidth: "85px !important",
        height: "42px !important",
        fontWeight: '500px !important',
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            background: `${btnBgRed.shade2} !important`,
            border: `1px solid ${btnBgRed.shade2} !important`,
            color: `#FFFF !important`,
        }
    },

    selectButton: {
        border: '1px solid #C7CCD3 !important',
        borderRadius: '4px !important',
        textTransform: "none !important",
        height: '30px !important',
        minWidth: '155px !important',
        color: '#737373 !important',
        font: "14px Nunito, sans-serif !important",
        fontWeight: `${400} !important`,
        justifyContent: 'center !important',
        "&:hover": {
            background: '#FFFF !important',
        }
    },
    closeBtn: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` #171717 !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        border: `1px solid #525167 !important`,
        // border: 1px solid #525167
        minWidth: "84px !important",
        height: "35px !important",
        variant: "outlined",
        '&:hover': {
            border: `1px solid #FFFFFF !important`,
            background: `${btnBgRed.shade4} !important`,
            color: '#FFFFFF !important',
        },
    },

    addComment: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "138px !important",
        height: "35px !important",
        variant: "outlined",
    },

    //Popup cancel button with red border and red text
    popupCancel1: {
        font: "15px Nunito Sans, sans-serif !important",
        color: `${btnBgRed.shade2} !important`,
        textTransform: "none !important",
        border: `1px solid ${btnBgRed.shade2} !important`,
        borderRadius: "8px !important",
        width: '100px !important',
        height: "36px !important",
        fontWeight: `${500} !important`,
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    //OffBoard Button
    offBoardButton: {
        background: `${orange} !important`,
        borderRadius: "50px !important",
        // shadow: "0px 2px 24px -4px #919EAB1F , 0px 0px 2px 0px #919EAB4D ",
        boxShadow: '0px 0px 10px rgba(247, 159, 45, 2)', // Modify the shadow properties as needed
        height: "48px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "300px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },






    placementDisable: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        height: "28px",
        width: "100px",
        padding: "0px 18px !important",
        color: `${btnBgGrey.shade7} !important`,
        border: `1px solid ${btnBgGrey.shade7} !important`
    },
    smallBlueOutlineBtn: {
        font: "15px Nunito, sans-serif !important",
        color: `${blue} !important`,
        textTransform: "none !important",
        border: `1px solid ${blue} !important`,
        borderRadius: "8px !important",
        minWidth: "85px !important",
        height: "42px !important",
        fontWeight: '500px !important',
        background: '#FFFFFF !important',
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    addHeighDisabletButton: {
        font: "16px Nunito Sans, sans-serif !important",
        background: `${btnBgGrey.shade1} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        minWidth: "150px !important",
        height: "53px !important",
        variant: "outlined",
        cursor: 'not-allowed !important'
    },
    disableSaveBtn: {
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        background: ` ${btnBgGrey.shade1} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "121px !important",
        height: "48px !important",
        variant: "outlined"
    },

    saveLoadersmall: {
        width: "120px !important",
        height: "42px !important"
    },

    largeCancelText: {
        fontSize: " 18px !important"
    },

    yesNoBtn: {
        width: "80px !important",
    },

    outlineBlueMedium: {
        height: '42px !important',
        font: '18px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        width: '120px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        '&:hover': {
            background: `${blue} !important`,
            color: '#FFFFFF !important'
        },
    },

    //organization config add new button styles
    blueHoverBtn: {
        width: '100%',
        textTransform: "none !important",
        font: "14px Nunito !important",
        fontWeight: "500 !important",
        background: "#F5F9FF !important",
        borderRadius: "8px !important",
        height: "33px !important",
        "&:hover": {
            background: "#d1e1ff !important"
        }
    },

    //Configurations
    deleteButton: {
        background: `#F85036 !important`,
        borderRadius: "8px !important",
        height: "45px",
        padding: "0px 8px !important",
        opacity: 1,
        textTransform: "capitalize !important",
        font: "18px Nunito !important",
        fontWeight: `${600} !important`,
        color: "#FFFFFF !important",
        minWidth: "128px !important",
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#FFFFFF",
            margin: '10px !important'
        },
        '&:hover': {
            cursor: "pointer",
        },
        '&:disabled': {
            opacity: '0.8'
        }
    },
    closeButton: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` #0C75EB !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        border: `1px solid #0C75EB !important`,
        // border: 1px solid #525167
        minWidth: "70px !important",
        height: "45px !important",
        variant: "outlined",
        '&:hover': {
            border: `1px solid #FFFFFF !important`,
            background: `${btnBgRed.shade4} !important`,
            color: '#FFFFFF !important',
        },
    },

    saveVerySmall: {
        font: "15px Nunito, sans-serif !important",
        height: '40px !important',
        color: '#FFFFFF !important',
        textTransform: 'capitalize !important',
        minWidth: '80px !important',
        borderRadius: '8px !important',
        background: `${blue} !important`,
        fontWeight: "400",
        width: "95px",
        '&:hover': {
            border: `1px solid ${blue} !important`,
            backgroundColor: '#FFFFFF !important',
            color: `${blue} !important`
        }
    },
    //configuration
    addButtoConfig: {
        // height: '42px !important',
        // font: '18px Nunito, Nunito Sans, sans-serif !important',
        color: `${blue} !important`,
        // border: `1px solid ${blue} !important`,
        textTransform: 'capitalize !important',
        background: '#F5F9FF !important',
        // width: '120px',
        borderRadius: '8px !important',
        // fontWeight: `${600} !important`,
        '&:hover': {
            background: '#d3ddf5 !important',
            // color: '#FFFFFF !important'
        },
    },

    redHover: {
        '&:hover': {
            border: `1px solid ${btnBgRed.shade4} !important`,
            background: `${btnBgRed.shade4} !important`,
            color: '#FFFFFF !important',
        },
    },
    DashboardAdd: {
        height: '38px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        color: `${btnTxtBlue.shade2} !important`,
        border: `1px solid #DDE4F0 !important`,
        textTransform: 'capitalize !important',
        width: '120px',
        borderRadius: '8px !important',
        fontWeight: `${600} !important`,
        background: `${btnTxtBlue.shade3} !important`
    },
    //onboard changed button style
    saveNcontinue: {
        font: "15px Nunito, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "156px !important",
        height: "42px !important",
    },
    cancelText: {
        font: "15px Nunito, sans-serif !important",
        background: `#FFFFFF !important`,
        color: `${btnStroke.grey} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        height: "42px !important",
        width: '100% !important',
        variant: "outlined",
        fontWeight: '500px !important',
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    borderCancel: {
        font: "14px Nunito, sans-serif !important",
        background: `#FFFFFF !important`,
        color: `${btnStroke.grey} !important`,
        border: `1px solid ${btnStroke.grey}`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        height: "42px !important",
        width: '100% !important',
        fontWeight: `${500} !important`,
        variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
            background: `#FFFFFF !important`,
        }
    },
    bluesmallHeight: {
        font: "14px Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        height: "30px",
        width: "120px",
        padding: "0px 18px 2px 18px !important",
        background: `${blue} !important`,
        color: '#fff !important',
    },

    outlineRedCancel: {
        height: '42px !important',
        font: '18px Nunito, Nunito Sans, sans-serif !important',
        color: '#E51A1A !important',
        border: '1px solid #E51A1A !important',
        width: '103px',
        borderRadius: '8px !important',
        fontWeight: `${500} !important`,
        textTransform: 'none !important'
    },

    saveExtraSmall: {
        height: '42px !important',
        font: '18px Nunito, Nunito Sans, sans-serif !important',
        backgroundColor: '#0C75EB !important',
        width: '103px',
        borderRadius: '8px !important',
        fontWeight: `${500} !important`,
        textTransform: 'none !important',
        color: '#FFFFFF !important'
    },

    scrollBtn: {
        height: '42px !important',
        font: '18px Nunito, Nunito Sans, sans-serif !important',
        backgroundColor: '#0C75EB !important',
        width: '103px',
        borderRadius: '8px !important',
        fontWeight: `${500} !important`,
        textTransform: 'none !important',
        color: '#FFFFFF !important'
    },

    addTitleBtn: {
        height: '33px',
        width: '100%',
        textTransform: 'none !important',
        font: '14px Nunito Sans, sans-serif !important',
        color: '#0C75EB !important',
        fontWeight: '500 !important',
        backgroundColor: '#F5F9FF !important',
        "&:hover": {
            background: "#d1e1ff !important"
        }
    },
    addTitleBtnDisable: {
        height: '33px',
        width: '100%',
        textTransform: 'none !important',
        font: '14px Nunito Sans, sans-serif !important',
        color: `${btnBgGrey.shade4} !important`,
        border: `1px solid ${btnBgGrey.shade4} !important`,
        fontWeight: '500 !important',
        backgroundColor: '#fff !important',
        cursor: 'default !important',
    },
    noButton: {
        height: '44px !important',
        width: '61px !important',
        font: '16px Nunito, Nunito Sans, sans-serif !important',
        color: `#0C75EB !important`,
        border: `1px solid #0C75EB !important`,
        textTransform: 'none !important',
        borderRadius: '8px !important',
        fontWeight: `${400} !important`,
    },

    // deleteButton: {
    //     height: '44px !important',
    //     width: '120px !important',
    //     font: '16px Nunito, Nunito Sans, sans-serif !important',
    //     color: `#FFFFFF !important`,
    //     textTransform: 'none !important',
    //     borderRadius: '8px !important',
    //     fontWeight: `${400} !important`,
    //     backgroundColor: '#F85036 !important'
    // }
    cancelLg: {
        font: "14px Nunito !important",
        fontWeight: `${500} !important`,
        background: ` ${btnTxtWhite} !important`,
        color: ` ${btnBgGrey.shade6} !important`,
        textTransform: "none !important",
        borderRadius: "6px !important",
        minWidth: "220px !important",
        height: "38px !important",
        variant: "outlined",
    },

    createLg: {
        font: "14px Nunito, sans-serif !important",
        fontWeight: `${500} !important`,
        background: `#0C75EB !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "6px !important",
        padding: '4px, 24px, 4px, 24px !important',
        height: "38px !important",
        variant: "outlined",
        width: '220px !important',
    },


    // Reminders Button styles
    lightblueBtn: {
        font: "14px Nunito, sans-serif !important",
        fontWeight: `${500} !important`,
        background: `#318CF1 !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "4px !important",
        padding: '4px, 24px, 4px, 24px !important',
        height: "25px !important",
        variant: "outlined",
        width: '103px !important',
    },

    //activity track
    activity: {
        font: "15px Nunito, sans-serif !important",
        background: `${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "156px !important",
        height: "35px !important",
        "&:hover": {
            background:"#ffffff !important",
            border: '1px solid #000000',
            color: '#000000 !important',
        }
    },
    cancelActivity: {
        font: "14px Nunito !important",
        fontWeight: `${400} !important`,
        // background: ` #000000 !important`,
        color: '#000000 !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        border: `1px solid  #000000  !important`,
        minWidth: "91px !important",
        height: "35px !important",
        variant: "outlined",
        '&:hover': {
            background: ` #000000 !important`,
            color: '#FFFFFF !important',
        },
    },

    addNewFull: {
        height: '33px !important',
        width: "100%",
        backgroundColor: "#E8F3FE !important",
        color: ` ${blue} !important`,
        font: "16px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        variant: "outlined",
        // "&:hover": {
        //     transform: "scale3d(1.05, 1.05, 1)",
        // }
    },
    disableAddNewFull: {
        height: '33px !important',
        width: "100%",
        backgroundColor: "#FAFAFA !important",
        color: ` #C7CCD3 !important`,
        font: "16px Nunito, sans-serif !important",
        fontWeight: `${600} !important`,
        textTransform: "none !important",
        borderRadius: "8px !important",
        variant: "outlined",
        border: "none !important"

    },
    blueBorderOutlined: {
        height: '43px !important',
        background: `#FFFFFF !important`,
        color: `${blue} !important`,
        textTransform: 'capitalize !important',
        minWidth: '141px !important',
        borderRadius: '4px !important',
        border: `1px solid ${blue} !important`,
        font: "14px Nunito Sans, sans-serif !important",
        fontWeight: `${500} !important`,
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    },
    blueNext: {
        font: "14px Nunito, sans-serif !important",
        background: ` ${blue} !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "4px !important",
        minWidth: "141px !important",
        height: "43px !important",
        // variant: "outlined",
        "&:hover": {
            transform: "scale3d(1.05, 1.05, 1)",
        }
    }
}));

export default ButtonStyles;

