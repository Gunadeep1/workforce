import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";

const LayoutStyles = makeStyles(() => ({

    // Breadcrumbs Styles
    breadcrumbsName: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#092333 !important",
        fontSize: "14px !important",
        height: "19.1px !important",
    },

    breadcrumbsLink: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#849199 !important",
        height: "19.1px !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        cursor: "pointer !important",
    },
    // Breadcrumbs Styles End

    Paper: {
        display: "flex",
        alignItems: "center",
        height: "25px !important",
        background: "#ffffff !important",
        border: "1px solid #DADADA !important",
        width: "80% !important",
        boxShadow: "none !important",
        "&::-webkit-scrollbar": {
            display: "none !important",
        },
    },
    InputBase: {
        marginLeft: 7,
        flex: 1,
        font: "13px Nunito Sans, sans-serif !important",
        color: "#2A3042 !important",
        backgroundColor: "#ffffff",
        height: "20px",
        opacity: 1,
        border: 'none'
    },

    currentDraft: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#092333 !important",
        fontSize: '22px !important',
        lineHeight: '26.4px !important',
    },

    checkBoxMenu: {
        '& .MuiCheckbox-root': {
            //   width: '18px !important',
            //   height: '18px !important',
            borderRadius: '4px',
            border: '1px',
            //   padding: '0px',
        },
    },

    currentDraftDate: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        fontSize: '16px !important',
        lineHeight: '19.2px !important',
        color: '#737373 !important',
        marginTop: '5px !important',
    },

    searchField: {
        [useTheme().breakpoints.down('lg')]: {
            marginTop: "10px !important",
            width: "260px !important",
        },
        border: "1.5px solid rgba(199, 204, 211, 1)",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    activeText: {
        font: "14px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#0C75EB !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        lineHeight: '21.82px !important',
        textTransform: 'capitalize !important',
    },
    tabText: {
        font: "14px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#849199 !important`,
        // height: '22px',
        opacity: 1,
        fontWeight: `${500} !important`,
        lineHeight: '21.82px !important',
        textTransform: 'capitalize !important',
    },

    activeText1: {
        font: "13.5px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#0C75EB !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        lineHeight: '21.82px !important',
        textTransform: 'capitalize !important',
    },
    tabText1: {
        font: "13.5px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#849199 !important`,
        // height: '22px',
        opacity: 1,
        fontWeight: `${500} !important`,
        lineHeight: '21.82px !important',
        textTransform: 'capitalize !important',
    },


    searchButton: {
        [useTheme().breakpoints.down('lg')]: {
            marginTop: "10px !important",
        },
        all: "unset",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        width: "50px",
        height: "50px",
        border: "1.5px solid rgba(199, 204, 211, 1)",
        backgroundColor: "#ffffff",
        borderRadius: "6px"
    },

    searchIcon: {
        all: "unset",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        width: "45px",
        height: "38px",
        border: "none",
        color: "black !important",
        borderRadius: "6px",

    },

    sidebar: {
        position: "fixed",
        maxWidth: "75px",
        width: "100%",
        background: "#FFFFFF",
        top: 0,
        left: 0,
        height: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        transition: "all .3s ease",
        zIndex: 200,
        boxShadow: "3px 3px 5px -1px rgba(0, 0, 0, 0.05)",
        "&::-webkit-scrollbar": {
            display: 'none',
        },
    },
    sidebarOpen: {
        maxWidth: "260px",
    },

    brand: {
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        height: "64px",
        fontWeight: 600,
        color: "rgba(24, 26, 24, 1)",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 1)",
        transition: "all .3s ease",
        // padding: "0 18px",
        padding: "0 12px",
    },

    sideMenu: {
        margin: "32px 0",
        // padding: "0 20px",
        padding: "0 10px",
        transition: "all .3s ease",
        backgroundColor: "rgba(255, 255, 255, 1)",
    },
    sidebarLink: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        color: "rgba(24, 26, 24, 1)",
        padding: "12px 15.5px",
        transition: "all .3s ease",
        borderRadius: "8px",
        margin: "6px 0",
        whiteSpace: "nowrap",
    },

    sidebarLinkActive: {
        backgroundColor: "rgba(12, 117, 235, 1)",
        color: "#FFFFFF",
        transition: "all .3s ease",
    },

    sidebarLinkTextMs: {
        margin: "0px 14px",
        transition: "all .3s ease",
    },
    sidebarLinkTextMl: {
        margin: "0px 26px",
        transition: "all .3s ease",
    },

    sideDropdown: {
        marginLeft: "42px",
        paddingLeft: "8px",
        maxHeight: "0px",
        overflowY: "hidden",
        transition: "all .3s ease",
        "&::-webkit-scrollbar": {
            display: 'none',
        },

        borderLeft: "1px solid rgba(12, 117, 235, 1)"
    },

    sideDropdownShow: {
        maxHeight: "1000px",
        transition: "all .3s ease",
    },
    sidebarSideDropdownLink: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        color: "rgba(24, 26, 24, 1)",
        padding: "10px 14px",
        transition: "all .3s ease",
        borderRadius: "10px",
        margin: "4px 0",
        whiteSpace: "nowrap",
    },






    // Main Content

    content: {
        backgroundColor: "rgba(253, 253, 253, 1)",
        position: "relative",
        // width: "calc(100% - 260px)",
        // left: "260px",
        width: "calc(100% - 60px)",
        left: "60px",
        transition: "all .3s ease",
    },

    // NAV
    nav: {
        backgroundColor: "#FFFFFF",
        height: "68px",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gridGap: "28px",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
    },
    globalSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "250px",
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
        }
    },


    // NAV




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
            color: "rgba(199, 204, 211, 1)",
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
        display: "flex", justifyContent: "center", alignItems: "center"
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
    tableRow: {
        border: '1px solid #C7CCD3',
        textAlign: 'center',
        padding:'15px !important'
    },
    table: {
        border: '1px solid #C7CCD3',
        borderCollapse: 'collapse',
        width: '100%',  
        padding:'15px !important'     
    }
}))

export default LayoutStyles;
