import { makeStyles } from "@mui/styles";

const InvoiceStyles = makeStyles(() => ({

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
          flexDirection:'column'
          },
    },

    loader: {
        "@media (max-width:430px) and (min-width:310px)": {
            minWidth:'100px !important',
            marginTop:'10px !important',
            display:'flex',
            alignItems:'end',
            },
    },

    cardBg: {
        width: "100% !important",
        minHeight: "83vh !important",
        boxShadow: "0px 2px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB4D !important",
        borderRadius: "8px !important",
        padding:'15px 25px 0px 25px !important'
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
        fontWeight: `${400} !important`
    },
    contentScroll: {
        height: '460px !important',
        overflowY: 'scroll',
        paddingBottom:'15px !important',
        "&::-webkit-scrollbar": {
            display: 'none !important'
        }
    },
    disabledColor: {
        cursor: "not-allowed !important",
        pointerEvents: "all !important",
        color: "#bebebe !important"
    },
    
    add: {
        color: "#0C75EB",
        cursor:'pointer'
    },
    
    minus: {
        color: "#E51A1A",
        cursor: 'pointer'
    },
    headings:{
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
    helperTextError: {
        color: '#e72929 !important',
        font: '11px Nunito Sans, sans-serif !important',
        marginLeft: '-5px !important'
    },

}))

export default InvoiceStyles;

