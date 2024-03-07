import { makeStyles } from "@mui/styles";


const VendorStyles = makeStyles(() => ({

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
        textAlign: "center",
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
        width: "90px !important",
        height: "90px !important",
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
        padding:'0px 5px'
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
        font: '13px Nunito Sans, sans-serif !important',
        height: '35px !important',
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
    cardBg: {
        width: "100% !important",
        minHeight: "80vh !important",
        boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D !important",
        borderRadius: "8px !important"
    },
    moreIcon: {
        fontSize: "18px",
        color: "Black",
        height: '25px',
        width: '25px',
        cursor: 'pointer'
    },
    clientAvatarSection: {
        position: 'relative',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
    },

    uploadBtn: {
        // height: "100px !important",
        // width: "100px !important",
        // display: "block !important",
        // borderRadius: "50% !important",
        // position: "absolute !important",
        // font: '12px Nunito, Nunito Sans, sans-serif !important',
        // fontWeight: '600 !important',
        // color: '#FFFFFF !important',
        // backgroundColor: "#303030CC !important",
        font: '12px Nunito, Nunito Sans, sans-serif !important',
        fontWeight: '500 !important',
        textTransform: 'capitalize !important',
        color: '#0C75EB !important',
        backgroundColor: "#ffffff !important",
        padding: "2px 8px !important"
    },
    // clientAvatarBoxBorderLite:{
    //     border: "3px solid #ffffff"
    // },
    // clientAvatarBoxBorder: {
    //     border: "3px solid #037847"
    // },
    clientAvatarBox: {
        height: "100px",
        width: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        backgroundColor: "#F6F6F6",
        margin: "4px",
    },
    profileTooltipText: {
        fontSize: "14px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#FFFFFF !important",
    },
    helperTextError: {
        color: '#e72929 !important',
        font: '11px Nunito Sans, sans-serif !important',
        marginLeft: '-5px !important'
    },
}))

export default VendorStyles;
