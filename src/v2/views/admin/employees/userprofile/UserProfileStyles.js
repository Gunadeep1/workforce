import { makeStyles } from "@mui/styles";


const Styles = makeStyles(() => ({

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
        border: "1px solid #0C75EB !important",
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
        // border: "2px solid #037847",
    },
    avatar: {
        width: "110px !important",
        height: "110px !important",
        margin: "8px"
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
    inactiveDisable: {
        color: '#E2E5E6 !important',
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        cursor: "default !important",
        "&:hover": {
            background: 'none !important'
        }
    },
    optional: {
        font: '12px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '2px !important'
    },
    popupHead: {
        width: "100% !important",
        display: 'flex !important',
        justifyContent: 'center !important'
    },
    //offBoardingPopupStyle
    activeRow: {
        backgroundColor: "#F7FFFA !important",
        borderRadius: "10px !important",
        border: "1px solid #22C55E !important"
    },
    headerRow: {
        display: "flex !important",
        flexDirection: "column !important",
        justifyContent: "center !important"
    },
    disableRow: {
        backgroundColor: "#FBFBFB !important",
        borderRadius: "10px !important"
    },
    bodyBox: {
        width: "100% !important",
        display: 'flex !important',
        justifyContent: 'center !important',
        backgroundColor: "#3B4957 !important"
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
    ViewContainer: {
        height: '45vh',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    uploadBtn: {
        font: '12px Nunito, Nunito Sans, sans-serif !important',
        fontWeight: '500 !important',
        textTransform: 'capitalize !important',
        color: '#0C75EB !important',
        backgroundColor: "#ffffff !important",
        padding: "2px 8px !important"
    },

}))

export default Styles;
