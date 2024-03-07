import { makeStyles } from "@mui/styles";



const InvoiceDashborardStyles = makeStyles(() => ({

    containerMain: {
        margin: '20px auto 0px 130px',
        width: '88% !important',
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
        font: '14px Nunito Sans !important',
        fontWeight: `${500} !important`
    },
    navText2: {
        font: '14px Nunito Sans !important',
        fontWeight: `${600} !important`,
        color: '#092333',
    },

    card: {
        height: '160px',
        // width: '289px',
        borderRadius: '12px',
        border: '1px solid #F2F2F2',
        padding: '20px !important',
        cursor: 'pointer',
    },
    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito , Nunito Sans, sans-serif !important',
        padding: '10px 0px 10px 15px !important',
        "&:hover": {
            background: 'white !important'
        }
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




    searchIcon: {
        all: "unset",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito Sans , Nunito Sans Sans, sans-serif",
        width: "45px",
        height: "38px",
        border: "none",
        backgroundColor: "#FFFFFF",
        borderRadius: "6px",

    },

    searchField: {
        height: "40px",
        border: "1.5px solid rgba(199, 204, 211, 1)",
        width: "460px",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text1: {
        textAlign: "center !important",
        fontSize: "14px !important",
        fontFamily: "Nunito Sans Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(115, 115, 115, 1) !important"
    },
    text2: {
        textAlign: "center !important",
        fontSize: "12px !important",
        fontFamily: "Nunito Sans Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },

    leftcard: {
        padding: '12px',
        height: '74px',
        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '12px',

    },

    rightcard: {

        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '12px',
    },

    inactive: {
        font: '13px Nunito Sans Sans, sans-serif !important',
        padding: '10px 0px 4px 15px !important'
    },


    ViewContainer: {
        width: '100%',
        height: '73vh',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '12px',
        padding: '30px',
        '@media( max-height: 730px)': {
            height: '70vh',
        }
    },

    CardContainer: {
        width: '100%',
        height: '73vh',

    },

    containerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '30px',
        borderBottom: '1px solid #E2E5E6',


    },

    heading1: {
        font: '18px Nunito Sans !important',
        fontWeight: `${600}`,
        color: '#171717',
    },
    heading2: {
        font: '16px Nunito Sans !important',
        fontWeight: `${600}`,
        color: '#171717',
    },
    heading3: {
        font: '13px Nunito Sans !important',
        fontWeight: `${500}`,
        color: '#404040',
        cursor: 'default'
    },
    heading4: {
        font: '13px Nunito Sans !important',
        fontWeight: `${500}`,
        color: '#262626',
        cursor: 'default'
    },
    heading5: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${600}`,
        color: '#171717',
        cursor: 'default',
        textAlign: 'start',
    },
    heading6: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${400}`,
        color: '#737373',
        cursor: 'default',
        textAlign: 'start',
    },
    heading7: {
        font: '12px Nunito Sans !important',
        fontWeight: `${600}`,
        color: '#262626',
        cursor: 'default'
    },

    heading8: {
        font: '14px Nunito Sans !important',
        fontWeight: `${500}`,
        color: '#0C75EB',
        cursor: 'default',
        textAlign: 'start',
    },
    heading9: {
        font: '10px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#525252',
        cursor: 'default',
        textAlign: 'start',
    },
    heading10: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${400}`,
        color: '#0C75EB',
        cursor: 'default',
        textAlign: 'start',
    },

    heading11: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${500}`,
        color: '#737373',
        textAlign: 'start',
    },
    heading12: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${500}`,
        color: '#0C75EB',
        textAlign: 'start',
    },
    heading13: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${500}`,
        color: '#16A34A',
        textAlign: 'start',
    },
    heading14: {
        font: '12px Nunito Sans  !important',
        fontWeight: `${600}`,
        color: '#737373',
        cursor: 'default',
        textAlign: 'start',
    },
    heading15: {
        font: '14px Nunito Sans  !important',
        fontWeight: `${500}`,
        color: '#000000',
        cursor: 'default',
        textAlign: 'start',
    },

    heading16: {
        font: '16px Nunito Sans !important',
        fontWeight: `${500}`,
        color: '#0C75EB',
        cursor: 'default',
        textAlign: 'start',
    },

    fromText: {
        font: '13px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#404040',
        cursor: 'default',
        textAlign: 'start',
    },

    toText: {
        font: '13px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#404040',
        cursor: 'default',
        textAlign: 'end',
    },
    headingFrom: {

        font: '16px Nunito Sans !important',
        fontWeight: `${600}`,
        color: '#171717',
        cursor: 'default',
        textAlign: 'start',
    },
    headingTo: {
        font: '16px Nunito Sans !important',
        fontWeight: `${600}`,
        color: '#171717',
        cursor: 'default',
        textAlign: 'end',
    },

    description: {
        font: '10px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#737373',
        cursor: 'default',
        textAlign: 'start',
    },

    doclink: {
        // width: '100px',
        font: '12px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#0C75EB',
        cursor: 'pointer',
        textAlign: 'start',
        paddingBottom: "8px",
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    doclinkEmpty: {
        // width: '100px',
        font: '12px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#737373',
    },

    iconStyles: {
        cursor: 'pointer'
    },

    invoiceContent: {
        height: '58vh',
        overflowY: 'auto',
        '@media( max-height: 730px)': {
            height: '52vh',
        }
    },

    template: {
        width: '100%',
        padding: '30px 30px 0px 30px',
    },

    logoStyle: {
        height: '70px',
        width: '70px',
        objectFit: 'fill',
    },

    dateData: {
        marginTop: '30px',
        gap: '24px',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40px',
        borderBottom: '1px solid #E2E5E6',
        borderTop: '1px solid #E2E5E6',
    },

    tableContainer: {
        marginTop: '30px',
        border: '1px solid #E2E5E6',
        borderRadius: '12px 12px 0px 0px'
    },

    tabTitle: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#849199 !important",
        textTransform: "capitalize !important",
        fontSize: "16px !important",
        fontWeight: 500,
        padding: '0px 50px !important'
    },

    activeTabTitle: {
        color: "#0C75EB !important",

    },



    stepperLable: {
        '& .MuiStepLabel-iconContainer': {
            marginBottom: '0px !important',
        },
        '& .MuiStepLabel-labelContainer': {
            marginLeft: '15px !important'
        }
    },

    stepperContent: {
        '& .MuiCollapse-root': {
            marginLeft: '15px !important'
        }
    },


    // "Invoices Status Stlyes"

    invoiceStatus: {
        padding: '6px 16px',
        borderRadius: '37px',
        font: '14px Nunito Sans !important',
        fontWeight: `${400}`,
        color: '#FFFF',
        cursor: 'default',
        textTransform: "capitalize",
    },

    Approved: {
        backgroundColor: "#16A34A",
    },
    Write_Off: {
        backgroundColor: "#EC3C3C",
    },
    Draft: {
        backgroundColor: '#DFBE29'
    },
    pending_approval: {
        backgroundColor: '#F59E0B',
    },
    Approval_In_Progress: {
        backgroundColor: '#F59E0B',
    },
    Partially_Paid: {
        backgroundColor: '#F59E0B',
    },
    Rejected: {
        backgroundColor: '#EC3C3C',
    },
    Void: {
        backgroundColor: '#16A34A',
    },
    Paid: {
        backgroundColor: '#16A34A',
    },
    Submitted: {
        backgroundColor: '#F59E0B',
    },

    tabTitle1: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#404040 !important",
        textTransform: "capitalize !important",
        fontSize: "16px !important",
        fontWeight: 600,
        backgroundColor: '#E2E5E6 !important',

        borderRadius: '4px 0px 0px 4px !important',
        '&.MuiButtonBase-root.MuiTab-root': {
            minHeight: '40px !important',
            padding: '9px 15px !important',
        }
    },
    tabTitle2: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#404040 !important",
        textTransform: "capitalize !important",
        fontSize: "16px !important",
        fontWeight: 600,
        margin: '0px !important',
        backgroundColor: '#E2E5E6 !important',
        borderRadius: '0px 4px 4px 0px !important',
        '&.MuiButtonBase-root.MuiTab-root': {
            minHeight: '40px !important',
            padding: '9px 15px !important',
        }
    },

    activeTabTitle1: {
        color: "#FFFFFF !important",
        backgroundColor: '#0C75EB !important',
    },


    mainCardContainer: {
        marginTop: '16px',
        height: '65vh ',
        width: '100% ',
        overflowY: 'auto',
        padding: '15px',
        '@media( max-height: 730px)': {
            height: '61vh',
        }
    },

    cardView: {
        height: '119px',
        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 0px 15px 0px',
        cursor: 'pointer',
        marginBottom: '8px',
        border: '1px solid #FFFF',
    },
    cardViewActive: {
        height: '119px',
        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 0px 15px 0px',
        cursor: 'pointer',
        border: '1px solid #0C75EB',
        marginBottom: '8px',
    },

    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
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
    subjectInput: {
        border: 'none',
        height: '52px',
        width: '680px',
        font: '14px Nunito',
        fontWeight: `${600}`,
        '&::placeholder': {
            fontFamily: '14px Nunito, sans-serif',
            color: '#737373',
            fontWeight: `${400}`,
        },
    },

    descriptionInput: {
        border: 'none',
        width: '680px',
        font: '15px Nunito',
        fontWeight: `${400}`,
        '&:focus': {
            borderColor: 'transparent',
            outline: 'none',
        },
        '&::placeholder': {
            fontFamily: '15px Nunito, sans-serif',
            color: '#737373',
            fontWeight: `${400}`,
        },
    },

    pdfBox: {
        flexDirection: 'row !important',
        alignItems: 'center',
        borderRadius: '12px',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        padding: '14px',
        gap: '10px',
        width: '235px'
    },

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
            width: '153px !important',
            maxHeight: '226px !important',
        }
    },

    menuText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito , Nunito Sans, sans-serif !important',
        padding: '10px 0px 10px 15px !important',
    },   

}))
export default InvoiceDashborardStyles;