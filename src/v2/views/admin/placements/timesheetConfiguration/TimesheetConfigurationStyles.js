import { makeStyles } from "@mui/styles";
// import { blue, btnBgBlue, btnBgGrey, btnBgRed, btnBorder, btnStroke } from "../../../../theme";
import { useTheme } from "@mui/material";
import { btnBgRed } from "../../../../theme";

const TimesheetConfigurationStyles = makeStyles(() => ({
    //Form card
    cardOuterBox: {
        padding: "0px 25px"
    },

    card: {
        padding: '35px 15px !important',
        boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important",
        borderRadius: '15px !important'
    },
    cardHeader: {
        padding: '0px 0px 15px 15px !important'
    },
    cardContent: {
        padding: '0px 20px 0px 20px !important'
    },
    sideTooltip: {
        // height: "34px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
    },

    sideTooltipText: {
        fontSize: "12px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        color: "#FFFFFF",
    },

    stepperHeader: {
        // background: '#FFFFFF !important',
        // zIndex: '900',
        // [useTheme().breakpoints.down("lg")]: {
        //     zIndex: 90,
        // },
    },
    disabledColor: {
        cursor: "not-allowed !important",
        pointerEvents: "all !important",
        color: "#bebebe !important"
    },

    add: {
        color: "#0C75EB",
        cursor: 'pointer'
    },

    minus: {
        color: "#E51A1A",
        cursor: 'pointer',
    },

    //configuration view&update

    mainContainer: {
        left: "60px",
        width: "calc(100% - 60px)",
        position: "relative",
        transition: "all .3s ease",
        backgroundColor: "rgba(253, 253, 253, 1)",
        padding: '10px 40px',
        "@media (max-width:768px) and (min-width:430px)": {
            width: "calc(100% - 40px)",
            left: "20px",
            padding: '0px',
        },
        "@media (max-width:430px) and (min-width:310px)": {
            width: "100% !important",
            left: "0px",
            padding: '0px',
        },
    },
    header: {
        display: "flex",
        "@media (max-width:430px) and (min-width:310px)": {
            flexDirection: 'column'
        },
    },

    loader: {
        "@media (max-width:430px) and (min-width:310px)": {
            minWidth: '100px !important',
            marginTop: '10px !important',
            display: 'flex',
            alignItems: 'end',
        },
    },

    cardBg: {
        width: "100% !important",
        minHeight: "85vh !important",
        boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D !important",
        borderRadius: "8px !important",
        padding: '15px 25px 0px 25px !important'
    },

    // Breadcrumbs Styles
    breadcrumbsName: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "14px !important",
    },

    breadcrumbsLink: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        cursor: "pointer !important",
    },

    multiSelectinputLabel: {
        color: '#737373 !important',
        font: '14px Nunito !important',
        fontWeight: `${400} !important`,
    },
    contentScroll: {
        height: '490px !important',
        overflowY: 'scroll',
        "&::-webkit-scrollbar": {
            display: 'none !important'
        }
    },
    headings: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "12px !important",

    },
    avatarBox: {
        display: "flex",
        borderRadius: "50%",
        border: "2px solid #037847",
    },
    avatar: {
        width: "120px !important",
        height: "120px !important",
        margin: "2px"
    },
    profileName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "20px !important",
        textAlign: "center"
    },
    profileId: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#737373 !important",
        fontSize: "14px !important",
        textAlign: "center"
    },
    main: {
        // gap:'20px'
        display: 'flex'
    },
    helperTextError: {
        color: `${btnBgRed.shade4} !important`,
        marginLeft: '-5px !important',
        font: '11px Nunito Sans, sans-serif !important',
    },
    defaultapprovalLevels: {
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", borderRadius: "8px",

        background: '#FAFAFA'
    },

    approvalLevels: {
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px",

        background: '#ffffff'
    },
    mainGrid: {
        width: "100% !important",        
        [useTheme().breakpoints.down('sm')]: {
            width: "150% !important",
        },
        // padding: "15px",
    },
}))

export default TimesheetConfigurationStyles;
