import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";


const ReminderStyles = makeStyles(() => ({

    root: {
        width: '100% !important',
        display: "flex",
        justifyContent: "center",
        backgroundColor: '#FDFDFD !important',
        marginTop: '30px',
        paddingLeft: '70px',
        [useTheme().breakpoints.down('lg')]: {
        },

        [useTheme().breakpoints.down('sm')]: {
        },
    },

    mainContainer: {
        width: '85% !important',
        alignItems: 'start',
        justifyContent: "start",
        marginLeft:'40px'
    },

    header: {
        flexDirection: 'row !important',
        justifyContent: 'space-between !important',
        width: '100% !important',
        alignItems: 'center !important',
        marginBottom: '15px',
        [useTheme().breakpoints.down('lg')]: {
            flexDirection: 'column !important',
            gap: '16px',
            alignItems: 'start !important'
        },
    },

    leftHeader: {
        flexDirection: 'row !important',
        gap: '24px',
        alignItems: 'center !important'
    },
    rightHeader: {
        flexDirection: 'row !important',
        gap: '24px',
        [useTheme().breakpoints.down('md')]: {
            flexDirection: 'column !important',
            gap: '16px',
            alignItems: 'start !important'
        },
    },
    addRemindSuccessText: {
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        lineHeight: '26px !important',
        textAlign: 'center !important',
        fontSize: "22px !important",
        color: "#15803D !important"
     },
     viewAllBtn: {
        width: '190px !important',
        height: '39px !important',
        padding: '10px 16px 10px 16px !important',
        borderRadius: '8px !important',
        border: '1px solid #737373 !important',
        gap: '10px !important',
        background: 'white !important',
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "16px !important",
        fontWeight: "400 !important",
        lineHeight: '19px !important ',
        textTransform: "none !important",
   
        color: "#404040 !important",
        variant: "outlined",
        "&:hover": {
           transform: "scale3d(1.05, 1.05, 1)",
        }
   
     },
     gotoBtn: {
        width: '180px !important',
        height: '39px !important',
        padding: '10px 16px 10px 16px !important',
        border: 'none !important',
        gap: '10px !important',
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "16px !important",
        fontWeight: "400 !important",
        lineHeight: '19px !important',
        background: '#0C75EB !important',
        color: '#F5F5F5 !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        variant: "outlined",
        "&:hover": {
           transform: "scale3d(1.05, 1.05, 1)",
        }
     },
    header1: {
        font: '22px  Nunito !important',
        color: '#092333 !important',
        fontWeight: `${500} !important`,
    },

    header2: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#000000 !important`,
    },

    header3: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#525252 !important`,
    },
    header4: {
        font: '10px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#737373 !important`,
        textAlign: 'center',
        marginTop:'10px !important'
    },
    header5: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#737373 !important`,
        textAlign: 'center'
    },
    header6: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        color: `#525252 !important`,
    },
    header7: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        color: `#0C75EB !important`,
    },
    header8: {
        font: '18px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#000000 !important`,
    },
    header9: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#0C75EB !important`,
        cursor: 'pointer !important',

    },
    header10: {
        font: '16px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#0C75EB !important`,
        cursor: 'pointer !important',

    },
    header11: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        color: `#000000 !important`,
    },

    inputYear: {
        padding: '0px 0px 0px 0px !important',
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "14px !important",
        color: "#333333 !important",
        fontWeight: "600 !important"
    },

    listContianer: {
        width: '98.2%',
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    notificationCard: {
        flexDirection: 'row !important',
        justifyContent: 'space-between',
        paddingBottom: '20px',
        marginBottom: '16px',
        width: '100%',
        borderBottom: '1px solid #EAE5E5',
    },

    leftContent: {
        flexDirection: 'row !important',
        gap: '14px',
        alignItems: 'center !important'
    },

    NoDataFoundIcon: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginTop: '100px',
        paddingLeft: '70px',
        gap: '16px',
        font: '18px Nunito !important',
        fontWeight: `${500} !important`,
    },
    cursor: {
        cursor: 'pointer !important',
    },


    // Borderless select styles
    selectMenu: {
        '& .MuiList-root.MuiMenu-list': {
            padding: '0px !important',
        },
        '& .MuiPaper-root': {
            marginTop: '4px !important',
            borderRadius: '4px',
            font: "14px Nunito, sans-serif !important",
            boxShadow: 'none !important',
            border: '1px solid #EAECF0 !important',
            minWidth: '170px !important',
            maxHeight: '226px !important',
        }
    },
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '14px Nunito , Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        padding: '10px 15px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },

    selectButton: {
        textTransform: "none !important",
        height: '30px !important',
        minWidth: '116px !important',
        color: '#737373 !important',
        font: "14px Nunito, sans-serif !important",
        fontWeight: `${400} !important`,
        justifyContent: 'center !important',
        gap: '20px',
        "&:hover": {
            background: '#FFFF !important',
        }
    },

    divider: {
        borderColor: '#EAECF0 !important',
    },

    avatarSize: {
        height: '53px !important',
        width: '53px !important',
    },


    autoSelect: {
        '& .MuiFilledInput-root': {
            background: 'white !important',
            border: '1px solid #C7CCD3',
            borderRadius: '8px',
            paddingTop: '16px !important'
        },
        '& .MuiInputBase-root.MuiFilledInput-root:before': {
            borderBottom: 'none !important',
        },
        '& .MuiInputBase-root.MuiFilledInput-root:after': {
            borderBottom: 'none !important',
        },
        "& .MuiTypography-root": {
            font: '14px Nunito !important',
            fontWeight: `${400} !important`,
            color: '#737373 !important',
        },
        "& .MuiFormLabel-root": {
            color: '#737373 !important',
            font: '14px Nunito !important',
            fontWeight: `${400} !important`,
        },
        '& .MuiChip-label': {
            padding: '0px 12px 2px 4px !important',
            font: '10px Nunito Sans, sans-serif !important',
            fontWeight: `${500} !important`,
            color: '#181A18 !important',
        },

        '& .MuiChip-root': {
            height: '20px !important',
            backgroundColor: '#EEEEEE !important',
            padding: '2px 2px 2px 4px !important'
        }


    },

    // select field styles
    checkedSelect: {
        "& .MuiSelect-select": {
            padding: '22.28px 35px 10px 12px !important',
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

    inputLabel: {
        color: '#737373 !important',
        font: '14px Nunito !important',
        fontWeight: `${400} !important`,
    },


    // Description field styles
    customScrollbar: {
        maxWidth: '100%',
        '@global': {
            '*::-webkit-scrollbar': {
                width: '4px',
                height: '25px',
                borderRadius: '50px'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px white'
            },
            '*::-webkit-scrollbar-thumb': {
                background: "#C7CCD3 !important",
                width: '4px',
                height: '25px',
                borderRadius: '50px',
                outline: 'none'
            }
        }
    },



}))
export default ReminderStyles;