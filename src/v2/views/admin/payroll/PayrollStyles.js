import { makeStyles } from "@mui/styles";
import { blue, btnBgBlue, btnBgGrey, btnBorder, btnStroke, red } from "../../../theme";
import { useTheme } from "@mui/material";

const LayoutStyles = makeStyles(() => ({
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
        }
    },

    // NAV




    // MAIN
    main: {
        width: "100%",
        padding: "20px",
    },
    EmployeesSearchInput2: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "700px",
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

    EmployeesSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "100%",
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
    customAccordion2: {
        padding: "10px 18px !important",
        backgroundColor: "#ffffff !important",
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
    AccordionSummaryBox2: {
        width: "100%", display: "flex", alignItems: "center", gap: 2
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
    otherPayrollBox: {
        width: ' 48%',
        height: '112px',
        padding: '16px',
        borderRadius: '20px',
        gap: '24px',
        boxShadow: '0px 2px 24px 0px #919EAB1F'
    },

    profileTooltipText: {
        fontSize: "10px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#FFFFFF !important",
    },
    linkStyle: {
        color: '#849199',
        '&:active': {
            color: '#849199',
            textDecoration: 'none',
        }
    },

    navText1: {
        font: '15px Nunito !important',
        fontWeight: `${500} !important`
    },
    navText2: {
        font: '15px Nunito !important',
        fontWeight: `${600} !important`,
        color: '#092333',
    },

    tabTitle: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        textTransform: "capitalize !important",
        fontSize: "16px !important",
        fontWeight: 500,
        margin: "0px 12px !important",
        padding: "20px !important"
    },
    activeTabTitle: {
        color: "#0C75EB !important",
    },
    activeText: {
        font: "15px Nunito Sans, sans-serif !important",
        // fontFamily: "Nunito , Nunito Sans, sans-serif",
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
        padding: '0px 25px !important'
    },
    tabText: {
        font: "15px Nunito Sans, sans-serif !important",
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
        color: '#C7CCD3 !important',
        background: '#FFFFFF !important',
        opacity: 1,
        borderRadius: '5px !important',
        fontWeight: `${400} !important`,
        width: '100%',
        height: '30px ! important',
        textAlign: 'left !important',
        '& input': {
            textAlign: 'left !important',
            paddingLeft: '20px !important'
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

export default LayoutStyles;
