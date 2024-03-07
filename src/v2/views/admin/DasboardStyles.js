import { makeStyles } from "@mui/styles";
import { blue, btnTxtBlack } from "../../theme";
import { useTheme } from "@mui/material";


const LayoutStyles = makeStyles(() => ({

    // Navbar styles


    // progress: {
    //     background: "#EA6A47 !important"
    // }
    // routesBox: {
    //     height: '78vh',
    //     overflow: 'auto',
    //     "&::-webkit-scrollbar": {
    //         width: "6px",
    //     }, '&::-webkit-scrollbar-thumb': {
    //         backgroundColor: '#f1f1f1',
    //         borderRadius: '10px'
    //     }
    // },


    // sidebar
    SearchList: {
        width: '48% !important',
        background: '#ffff !important',
        maxHeight: '35vh !important',
        overflowY: 'scroll !important',
        overflowX: 'hidden !important'
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
    }, EmployeesSearchInput2: {
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
    AccordionSummary: {
        backgroundColor: "#ffffff",
    },
    AccordionSummaryBox: {
        width: "60%", display: "flex", alignItems: "center", gap: 2
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
    textVisaType: {
        //styleName: Regular/Base Regular;
        fontFamily: "Nunito Sans, sans-serif !important",
        fontSize: '14px !important',
        fontWeight: '400 !important',
        lineHeight: '17px !important',
        textAlign: 'center'
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
    customScrollbar: {
        overflowY: 'scroll !important',  // Change this line
        maxWidth: '100%',
        "&::-webkit-scrollbar": {
            width: '0px !important'
        },
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
    BlackText: {
        font: '15px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnTxtBlack.shade3} !important`,
        opacity: 1
    },
    ArrowMargin: {
        marginRight: '7px !important'
    },
    blueDot: {
        height: '8px',
        width: '8px',
        borderRadius: '50%',
        background: '#62B2FD !important'
    },
    lightBlueDot: {
        height: '8px',
        width: '8px',
        borderRadius: '50%',
        background: '#CDE7FF !important'
    },
    pinkDot: {
        height: '8px',
        width: '8px',
        borderRadius: '50%',
        background: '#F99BAB !important'
    },
    greenDot: {
        height: '8px',
        width: '8px',
        borderRadius: '50%',
        background: '#9BDFC4 !important'
    },
    redDot: {
        height: '8px',
        width: '8px',
        borderRadius: '50%',
        background: '#FF4B55 !important'
    },
    filterGrid: {
        display: 'flex',
        alignItems: "center"
    },
    dateRowGrid: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'space-evenly !important',
        marginLeft: '-37px !important'
    },
    activeDateBox: {
        height: '75px',
        width: '40px',
        padding: "16px 11px",
        borderRadius: "25px",
        cursor: "pointer",
        "&:hover": { background: "#CDE7FF", color: "#0095FF !important" }
    },
    dateText: {
        marginTop: "3px !important",
        "&:hover": { color: "#0095FF !important" }
    },
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        padding: '8px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    deleteText: {
        font: '13px Nunito Sans, sans-serif !important',
        padding: '10px 0px 0px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: '#C7CCD3 !important',
        marginLeft: '4px !important'
    },
    selectField: {
        border: 'none !important',
        outline: 'none !important',
        height: '35px',
        width: '100%',
        font: '16px  Nunito, Nunito Sans, sans-serif !important',
        paddingTop: '5px'
    },
    border: {
        borderRight: '2px solid #F5F5F5 !important',
        paddingRight: '10px'
    },
    activeText: {
        font: "16px Nunito Sans, sans-serif !important",
        // fontFamily: "Nunito , Nunito Sans, sans-serif",
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
        padding: '0px 25px !important'
    },
    tabText: {
        font: "16px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#707070 !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
        padding: '0px 25px !important'
    },
    borderRight: {
        borderRight: '1px solid #F5F5F5 !important',
        [useTheme().breakpoints.down('lg')]: {
            borderRight: 'none !important',
            // borderBottom:'1px solid #F5F5F5 !important',
        }
    },
    add: {
        color: `${blue} !important`,
        cursor: 'pointer'
    },
    minus: {
        color: 'red !important',
        cursor: 'pointer'
    },

    //dropdown
    filter:{
        font: "14px Nunito Sans, sans-serif !important", 
        fontWeight: "600", 
        color: "#181A18", 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12) !important',
        padding: "10px 19px !important",
        '&:hover': { backgroundColor: 'transparent' },
        '&.Mui-selected': { backgroundColor: 'transparent' },
    },

    filterLast:{
        font: "14px Nunito Sans, sans-serif !important", 
        fontWeight: "600 ", 
        color: "#181A18", 
       
        padding: "10px 19px !important",
        '&:hover': { backgroundColor: 'transparent' },
        '&.Mui-selected': { backgroundColor: 'transparent' },
    },
    selectedFilter: {
        backgroundColor: 'transparent !important',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04) !important'
        }
    },
    
    cashFlowActive: {
        height: '35px',
        width: '90px',
        borderRadius: '4px 0px 0px 4px',
        background: '#0C75EB',
        paddingTop: '7px',
        textAlign: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    cashFlowInactive: {
        height: '35px',
        width: '105px',
        borderRadius: '4px 0px 0px 4px',
        background: 'white !important',
        paddingTop: '7px',
        border: '1px solid #C7CCD3 !important',
        textAlign: 'center',
        alignItems: 'center',
        color:'red !important',
        cursor: 'pointer'
    },
    accrualActive: {
        height: '35px',
        width: '105px',
        borderRadius: '0px 4px 4px 0px !important',
        background: '#0C75EB',
        paddingTop: '7px',
        textAlign: 'center',
        alignItems: 'center',
        color: '#FFFFFF !important',
        cursor: 'pointer'
    },
    accrualInActive: {
        height: '35px',
        width: '110px',
        borderRadius: '0px 4px 4px 0px',
        background: 'white !important',
        paddingTop: '7px',
        border: '1px solid #C7CCD3 !important',
        textAlign: 'center',
        alignItems: 'center',
        cursor: 'pointer !important'
    },
    scrollableBox:{
        height:'420px',
        overflowY:'scroll',
        width:'100%'
    }
}))

export default LayoutStyles;
