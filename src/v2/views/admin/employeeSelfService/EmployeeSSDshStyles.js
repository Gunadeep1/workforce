import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";
import { addIcon, boxBorder, sideActiveBg, btnBgWhite, borderGrey } from "../../../../v2/theme";

const EmployeeSelfServiceStyles = makeStyles(() => ({

    globalSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "440px",
        height: "100%",
        background: "transparent",
        color: "rgba(38, 38, 38, 1)",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all .3s ease",
        '&::-webkit-input-placeholder': {
            color: "rgba(199, 204, 211, 1)",
        },
        '&:focus': {
            outline: "none"
        },

    },

    sideTooltip: {
        height: "34px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
    },

    sideTooltipText: {
        fontSize: "10px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        color: "#FFFFFF",
    },

    cancel: {
        width: '46% !important',
        [useTheme().breakpoints.down('md')]: {
            width: '40% !important',
        },
        [useTheme().breakpoints.down('sm')]: {
            width: '60% !important',
        },
        [useTheme().breakpoints.down('xs')]: {
            width: '70% !important',
        }
    },







    // MAIN
    main: {
        width: "100%",
        padding: "20px",
    },

    EmployeesSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "215px",
        height: "100%",
        background: "transparent",
        color: "rgba(38, 38, 38, 1)",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all .3s ease",
        '&::-webkit-input-placeholder': {
            color: "#C7CCD3",
            font: '12px Nunito !important'
        },
        '&:focus': {
            outline: "none"
        }
    },
    checkBox: {
        border: '1px solid #c4c2c2',
        height: '52px',
        borderRadius: '10px', alignItems: 'center !important',
        display: 'flex',
        flexDirection: 'row'
    },

    checkBoxbg: {
        height: '52px',
        borderRadius: '10px', alignItems: 'center !important',
        display: 'flex',
        flexDirection: 'row',
        background: '#FAFAFA !important'

    },
    mediumGreyText: {
        fontSize: "14px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        letterSpacing: '0px',
        color: "#707070",
        opacity: 1
    },

    // MAIN

    inviteLinkBtn: {
        margin: "12px 0px",
        all: "unset",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        width: "150px",
        height: "40px",
        border: "1.5px solid rgba(12, 117, 235, 1)",
        borderRadius: "6px",
        color: "rgba(12, 117, 235, 1)",
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: 'rgba(12, 117, 235, 1)', color: '#FFFFFF'
        },
    },
    onboardBtn: {
        all: "unset",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        width: "150px",
        height: "40px",
        border: "1.5px solid rgba(12, 117, 235, 1)",
        borderRadius: "6px",
        color: "rgba(12, 117, 235, 1)",
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: 'rgba(12, 117, 235, 1)', color: '#FFFFFF'
        },
    },
    nextBtn: {
        all: "unset",
        padding: "0px 14px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        minWidth: "50px",
        height: "35px",
        border: "1.5px solid rgba(12, 117, 235, 1)",
        backgroundColor: "rgba(12, 117, 235, 1)",
        boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.08)",
        borderRadius: "6px",
        color: "#ffffff",
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: '#FFFFFF', color: 'rgba(12, 117, 235, 1)'
        },
    },

    cancelBtn: {
        all: "unset",
        padding: "0px 16px",
        margin: "0px 18px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito Sans,  sans-serif",
        fontWeight: "400",
        minWidth: "60px",
        height: "35px",
        border: "1px solid rgba(229, 26, 26, 1)",
        backgroundColor: "#FFFFFF",
        borderRadius: "6px",
        color: "rgba(229, 26, 26, 1)",
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: 'rgba(229, 26, 26, 1)', color: '#FFFFFF'
        },
    },

    btn: {
        padding: "0px 12px",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        color: '#FFFFFF',
        background: 'rgba(12, 117, 235, 1)',
        borderRadius: '8px',
        border: 'none',
        height: '40px',
        marginTop: '15px',
        // border: "1.5px solid rgba(12, 117, 235, 1)",
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: '#FFFFFF', color: 'rgba(12, 117, 235, 1)'
        },
        textStyle: {
            fontSize: '16px !important',
            color: 'rgba(38, 38, 38, 1) !important',
            fontFamily: "Nunito Sans, sans-serif !important"
        }
    },

    flexBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: '#FDFDFD !important',
    },

    responsiveNav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row',
        [useTheme().breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
            alignItems: "start",
            gap: '20px'
        },
        [useTheme().breakpoints.down('lg')]: {
            flexDirection: 'column-reverse',
            alignItems: "start",
            gap: '20px'
        },
        [useTheme().breakpoints.down('sm')]: {
            flexDirection: 'column-reverse',
            alignItems: "start",
            gap: '20px'
        },
    },

    customAccordion: {
        padding: "6px 18px !important",
        backgroundColor: "#ffffff !important",
        // border: "1px solid #c5c5c526 !important",
        margin: "20px 0px !important",
        borderRadius: "20px !important",
        boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05) !important",
        '&:before': { display: "none" }
    },
    AccordionSummary: {
        backgroundColor: "#ffffff",
    },
    AccordionSummaryBox: {
        width: "60%", display: "flex", alignItems: "center", gap: 2, borderRight: "1px solid rgba(226, 229, 230, 1)"
    },
    AccordionDetails: {
        backgroundColor: "#f1f8ff", height: "80px", borderRadius: "16px", width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center"
    },
    text1: {
        textAlign: "center !important",
        fontSize: "14px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(115, 115, 115, 1) !important"
    },
    text2: {
        textAlign: "center !important",
        fontSize: "12px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },
    linkText: {
        fontSize: "14px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(12, 117, 235, 1) !important"
    },
    secondarytext: {
        fontSize: "12px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(115, 115, 115, 1) !important"
    },
    primarytext: {
        fontSize: "14px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        display: "flex !important",
        alignSelf: "center !important",
        fontWeight: "500 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },

    profileTooltipText: {
        fontSize: "10px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#FFFFFF !important",
    },

    tabTitle: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        textTransform: "capitalize !important",
        fontSize: "16px !important",
        fontWeight: 500,
        margin: "0px !important",
        padding: "15px !important",
        width: '140px'

    },

    activeTabTitle: {
        color: "#0C75EB !important",

    },


    card: {
        width: '100% !important',
        boxShadow: '5px 5px 10px 0px #0000000D !important',
        borderRadius: '20px !important',
    },

    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '65vh',
        gap: '16px',
        // border:'0.1px solid black !important',
        padding: '30px 15px 15px 15px !important',
        background: '#FDFDFD !important',
        alignItems: 'start !important',
    },

    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },

    containerMain: {
        margin: '0 auto',
        width: '82% !important',
        display: "flex",
        justifyContent: "center",
        flexDirection: 'column',
        alignItems: "center",
        background: '#FDFDFD !important',
    },

    linkStyle: {
        color: '#849199',
        '&:active': {
            color: '#849199',
            textDecoration: 'none',
        }
    },

    navText1: {
        font: '14px Nunito !important',
        fontWeight: `${500} !important`
    },
    navText2: {
        font: '14px Nunito !important',
        fontWeight: `${600} !important`,
        color: '#092333',
    },

    formBox: {
        boxShadow: '0px 2px 24px -4px #919EAB1F,  0px 0px 2px 0px #919EAB4D !important',
        borderRadius: '8px !important',
        padding: '32px 60px 30px 60px !important',
        marginTop: '32px !important',
    },

    autoSelect: {
        '& .MuiFilledInput-root': {
            background: 'white !important',
            border: '1px solid #C7CCD3',
            borderRadius: '8px',
            padding: '12px 8px 8px 8px !important',

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
        '& .MuiButtonBase-root.MuiChip-root': {
            margin: '8px 8px 0px 0px !important',
            backgroundColor: '#EEEEEE !important',
            padding: '4px 6px !important',
        },


    },

    chatBox1: {
        width: '376px',
        height: '119px',
        borderRadius: '8px',
        boxShadow: '0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D',
        margin: '8px 12px 0px 12px',
        cursor: 'pointer'
    },

    chatBoxSelected: {
        width: '376px',
        height: '119px',
        borderRadius: '8px',
        boxShadow: '0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D',
        margin: '8px 12px 0px 12px',
        border: '1px solid #0C75EB',
        background: '#F7FAFE',
        cursor: 'pointer'

    },

    upperData: {
        display: 'flex',
        alignItems: 'center',
        height: '77px',
        justifyContent: 'space-between',
        padding: '20px',
        width: '100%',
        gap: '5px'
    },


    lowerData: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '42px',
        padding: '0px 20px 4px 20px'
    },

    chatDisplay: {
        boxShadow: '0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D',
        display: 'flex',
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        flexDirection: 'column',
    },

    chatInput: {
        width: '100%',
        border: 'none',
        font: '16px Nunito',
        fontWeight: `${400}`,
        color: '#4F4F4F',
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
    },
    box: {
        minHeight: '92vh',
        display: 'flex'
    },
    requestsListSection: {
        width: '26%',
        minHeight: '92vh',
        borderRight: `1px solid ${boxBorder}`
    },
    requestsListHeader: {
        padding: '0px 18px',
        display: 'flex',
        alignItems: 'center',
        minHeight: '9vh',
        borderBottom: `1px solid ${boxBorder}`
    },
    requestsListBox: {
        height: '83vh',
        overflow: 'auto'
    },
    requestUserBox: {
        padding: '5px 18px',
        display: 'flex',
        alignItems: 'center',
        minHeight: '90px',
        borderBottom: `1px solid ${boxBorder}`,
        cursor: 'pointer'
    },
    selectedUserBox: {
        background: '#F3F3F3',
    },
    userBoxHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between !important'
    },
    userInfoBox: {
        width: '72%'
    },
    userStatusBox: {
        width: '28%',
    },
    statusText: {
        fontSize: '9px !important',
        textAlign: 'center',
        borderRadius: '10px',
        marginTop: '-6px !important'
    },
    inProgress: {
        color: `${sideActiveBg}`,
        border: `1px solid ${sideActiveBg}`,
    },

    resolved: {
        color: `${addIcon}`,
        border: `1px solid ${addIcon}`,
    },

    requestMsgSection: {
        width: '74%',
        minHeight: '92vh',
    },
    requestMsgHeader: {
        padding: '0px 30px',
        display: 'flex',
        alignItems: 'center',
        minHeight: '9vh',
        borderBottom: `1px solid ${boxBorder}`
    },
    requestMsgBody: {
        minHeight: '83vh', background: '#F7F7FA'
    },
    requestMsgformBox: {
        minHeight: '76vh', margin: '0px 30px', width: "78%"
    },
    customTextareaSection: {
        display: 'flex', marginTop: '4px', height: '126px', border: `1px solid ${boxBorder}`, borderRadius: '4px', background: `${btnBgWhite}`, padding: '10px'
    },
    customTextarea: {
        width: '100%', border: "none", resize: "none", fontFamily: 'Poppins, sans-serif', color: `${borderGrey}`
    },
    markBtn: {
        textTransform: "none !important",
        color: '#054CA6 important',
        border: '1px solid #054CA6 !important'
    },
    customInput: {
        color: `${borderGrey} !important`,
    },
    chatSection: {
        height: '170px', padding: '5px 0px', overflow: 'hidden'
    },
    chatBox: {
        height: '340px', overflow: 'auto', marginTop: "4px", paddingRight: '4px'
    },

    msgBox: {
        height: 'auto'
    },
    sendMsgBox: {
        width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end"
    },
    receiveMsgBox: {
        width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start"
    },
    userImgBox: {
        height: "20px", width: "20px", borderRadius: "50%", background: "#93B6F0", display: "flex", justifyContent: "center", alignItems: "center"
    },
    userImgText: {
        fontSize: "10px", fontWeight: "500", color: `${btnBgWhite}`
    },
    user: {
        fontSize: "10px", paddingLeft: "4px", color: "#242424"
    },
    msg: {
        borderRadius: "4px", minWidth: "100px", margin: "4px 0px", padding: "5px 10px"
    },


    footerSection: {
        minHeight: '7vh', borderTop: `1px solid ${boxBorder}`, background: `${btnBgWhite}`, display: 'flex', alignItems: 'center', padding: '0px 30px'
    },
    msgInput: {
        background: `${btnBgWhite}`,
        fontFamily: 'Poppins, sans-serif',
    },



    flexCenterY: {
        display: 'flex', alignItems: 'center'
    },

    flexEndX: {
        width: '100%', display: 'flex', justifyContent: 'end'
    },

    flexCenterX: {
        width: '100%', display: 'flex', justifyContent: 'center'
    },

    textAlignR: {
        textAlign: 'right',
    },
    textAlignC: {
        textAlign: 'center',
    },

    w100: {
        width: '100%',
    },
    w90: {
        width: '90%',
    },
    w85: {
        width: '85%',
    },
    w80: {
        width: '80%',
    },
    w65: {
        width: '65%',
    },
    w35: {
        width: '35%',
    },
    w20: {
        width: '20%',
    },
    w15: {
        width: '15%',
    },
    w10: {
        width: '10%',
    },

    pl6: {
        paddingLeft: '6px'
    },
    my5: {
        margin: '5px 0px'
    },
    py5: {
        padding: '5px 0px'
    },
    px5: {
        padding: '0px 5px'
    },
    px10: {
        padding: '0px 10px'
    },
    pT2: {
        paddingTop: "2px"
    },
    px20: {
        padding: '0px 20px'
    },
    consultantSearch: {
        marginTop: '10px',
        background: 'white !important',
        height: '34px'
    },
    documentIcon: {
        height: '16px',
        width: '16px'
    },
    // sendMsgBox: {
    //     width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end"
    // },
    // receiveMsgBox: {
    //     width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start"
    // },
    suggestionsBox: {
        width: 'auto', border: '1px solid #3B4957', borderRadius: '8px', padding: '5px 8px',
        cursor: 'pointer'
    },
    suggestionText:{
        color: '#3B4957 !important', cursor: 'pointer'
    }
}))

export default EmployeeSelfServiceStyles;
