import { makeStyles } from "@mui/styles";
import { blue, btnBgGreen, btnTxtBlack, lightGreyText, warning } from "../../../../theme";


const VendorProfileStyles = makeStyles(() => ({

    mainContainer: {
        left: "60px",
        width: "calc(100% - 60px)",
        position: "relative",
        transition: "all .3s ease",
        backgroundColor: "rgba(253, 253, 253, 1)",
    },
    profileName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "22px !important",
        textAlign: "center"
    },
    profileId: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#737373 !important",
        fontSize: "14px !important",
        textAlign: "center"
    },
    eVerifyBtn: {
        fontFamily: "Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        color: "#4ABE43 !important",
        border: "1px solid #4ABE43 !important",
        height: "35px",
        width: "140px",
        padding: "0px 18px !important",
        borderRadius: "8px !important"
    },
    moreBtn: {
        fontFamily: "Nunito Sans, sans-serif !important",
        textTransform: "capitalize !important",
        color: "#9D9E9F !important",
        border: "1px solid #9D9E9F !important",
        height: "35px !important",
        minWidth: "35px !important",
        padding: "5px !important",
        borderRadius: "8px !important"
    },

    listItems: {
        fontFamily: "Nunito Sans, sans-serif !important",
        minHeight: "32px",
        margin: "6px 0px !important",
        color: '#092333',
        borderRadius: "4px !important",
        fontSize: "14px !important",
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: '#F5F6F6 !important',
        },
    },

    listItemsActive: {
        color: '#FFFFFF !important',
        backgroundColor: '#0C75EB !important',
        transition: "all .3s ease",
        '&:hover': {
            backgroundColor: '#0C75EB !important',
            color: '#FFFFFF !important',
        },
    },

    avatarBox: {
        display: "flex",
        borderRadius: "50%",
        border: "2px solid #037847",
    },
    avatar: {
        width: "100px !important",
        height: "100px !important",
        margin: "2px"
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

    // Breadcrumbs Styles
    breadcrumbsName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "14px !important",
    },

    breadcrumbsLink: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        cursor: "pointer !important",
    },

    sideTooltip: {
        height: "34px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
    },

    sideTooltipText: {
        fontSize: "14px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        color: "#FFFFFF",
    },
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        "&:hover": {
            background: 'none !important'
        }
    },
    inactive: {
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        "&:hover": {
            background: 'none !important'
        }
    },
    activeText: {
        font: "16px Nunito Sans, sans-serif !important",
        // fontFamily: "Nunito , Nunito Sans, sans-serif",
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
    },
    tabText: {
        font: "16px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#707070 !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
    },

    statuText: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
    },

    red: {
        color: `red !important`,
    },

    green: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${btnBgGreen.shade1} !important`,
        opacity: 1
    },
    orange: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${warning} !important`,
        opacity: 1
    },
    greyText: {
        font: '14px Nunito Sans, sans-serif !important',
        letterSpacing: '0px',
        color: `${lightGreyText} !important`,
        opacity: 1
    },
    contentScroll: {
        height: '400px !important',
        overflow: 'scroll',
        "&::-webkit-scrollbar": {
            display: 'none !important'
        }
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
    },
    contentBox: {
        width: '100%',
        minHeight: "76vh",
        boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D",
        borderRadius: "8px",
        backgroundColor: "#fffff"
    },
    BarChartTitle: {
        color: `${btnTxtBlack.shade4} !important`,
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: `600 !important`,
    },
    barchartYearsmenu: {
        backgroundColor: "#ffffff !important",
        fontWeight: "600 !important",
        font: '13px Nunito, Nunito Sans, sans-serif !important',
        minWidth: "100px !important",
        height: '30px !important',
        display: 'flex !important',
        alignItems: 'center !important',
        padding: "10px 12px !important",
        "&:hover": {
            background: 'none !important'
        }
    },
    helperTextError: {
        color: '#e72929 !important',
        font: '11px Nunito Sans, sans-serif !important',
        marginLeft: '-5px !important'
    },


}))

export default VendorProfileStyles;
