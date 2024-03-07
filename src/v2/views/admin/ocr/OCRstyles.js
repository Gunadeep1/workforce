import { makeStyles } from "@mui/styles";
import BorderImg from "../../../assets/images/border.png";
import { useTheme } from "@mui/material";


const OCRstyles = makeStyles(() => ({

    // Breadcrumbs Styles
    breadcrumbsName: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#092333 !important",
        fontSize: "14px !important",
    },

    breadcrumbsLink: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#849199 !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        cursor: "pointer !important",
    },
    // Breadcrumbs Styles End


    infoText: {
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#D97706 !important",
        margin: "0px 8px !important"
    },

    dropzoneBox: {
        width: '100%',
        height: "31vh",
        display: 'inline-block',
        border: 'dashed 3px red',
        borderImageSource: `url(${BorderImg})`,
        borderImageSlice: 2,
        borderImageRepeat: 'round',
        borderImage: `url(${BorderImg}) 2 round`,
    },
    dropzoneMainBox: {
        width: '100%',
        height: "31vh",
    },
    mainBox: {
        width: "100%",
        height: "82vh ",
        display: "flex !important",
        justifyContent: "center !important",
    },
    secondaryBox: {
        width: "70%",
        [useTheme().breakpoints.down('md')]: {
            width: "90%",
        }
    },
    dropBox: {
        width: '100%',
        height: "31vh",
        display: 'inline-block',
        backgroundColor: "#F2F7FF",
        border: 'dashed 2px #0C75EB',
        borderRadius: "8px",
    },
    secPrimaryBox: {
        width: "100%",
        height: "51vh"
    },
    templateNameBox: {
        position: 'relative',
        display: 'flex !important'
    },

    sideboxtitle: {
        font: "16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#000000 !important",
    },

    templateMain: {
        width: "100%",
        height: "82vh"
    },
    templateMainBox: {
        width: "100%",
        height: "10vh",
        display: "flex !important",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px 130px !important",
        [useTheme().breakpoints.down('lg')]: {
            padding: "0px 00px !important",
        }
    },
    templateSecBox: {
        width: "60%",
        [useTheme().breakpoints.down('md')]: {
            width: "80%",
        }
    },
    middlePrimaryBox: {
        width: "100%",
        border: "1px solid #C7CCD3",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        padding: "24px !important",
    },
    middleSecBox: {
        width: "100%",
        height: "56px",
        display: "flex",
        alignItems: "center",
        borderRadius: "8px",
        backgroundColor: "#F59E0B33"
    },
    cropBox: {
        width: "100%",
        height: "auto",
        position: 'relative'
    },
    templateRightBox: {
        width: "100%",
        minHeight: "72vh",
        paddingLeft: "32px !important",
        paddingBottom: "24px !important",
    },
    templateRightSecBox: {
        width: "100%",
        minHeight: "72vh",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0px 0px 15px 0px #0000000D",
        padding: "16px !important"
    },

    actionIconGrid: {
        display: "flex !important",
        alignItems: "center",
        justifyContent: "space-around"
    },
    iconsCur: {
        cursor: "pointer !important",
    },
    checkIcons: {
        marginLeft: "-12px !important",
        paddingRight: '20px !important',
    },
    finalStepBox: {
        height: "55vh",
        overflow: "auto"
    },
    checkBox: {
        marginLeft: "-12px !important",
        paddingRight: '18px !important',
    },
    borderGrid: {
        borderRadius: "8px",
        border: '1px solid #C7CCD3',
        height: "56px",
        display: 'flex',
        alignItems: 'center',
        padding: "25px",
        marginTop: "25px !important"
    },

    activeBorderGrid: {
        borderRadius: "8px",
        border: '1px solid #57B556',
        height: "56px",
        display: 'flex',
        alignItems: 'center',
        padding: "25px",
        marginTop: "25px !important"
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
        width: "60%",
        display: "flex",
        alignItems: "center",
        gap: 2
    },
    AccordionDetails: {
        backgroundColor: "#f1f8ff", height: "80px", borderRadius: "16px", width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center"
    },
    linkText: {
        fontSize: "14px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(12, 117, 235, 1) !important"
    },
    headBox: {
        width: "100%",
        height: "8vh",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px"
    },
    searchDiv: {
        height: "40px",
        border: "1.5px solid rgba(199, 204, 211, 1)",
        width: "260px",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    searchField: {
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
    searchButton: {
        all: "unset",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        width: "45px",
        height: "38px",
        border: "none",
        backgroundColor: "#FFFFFF",
        borderRadius: "6px",
    },
    actionRequiredBox: {
        border: '1px solid #D97706',
        borderRadius: "12px !important",
        padding: "4px 12px !important",
        width: "fit-content !important",
    },
    completedBox: {
        border: '1px solid #C7CCD3',
        borderRadius: "12px !important",
        padding: "4px 12px !important",
        width: "fit-content !important",
    },
    viewDataBox: {
        height: "400px",
        width: "100%",
        marginTop: "30px",
        paddingLeft: "10px",
        overflow: 'auto !important'
    },

    sideBarBox: {
        height: "81vh",
        width: "100%",
        padding: "0px 40px !important",
        overflow: 'auto',
        marginLeft: '6px !important',

    },
    buttonBox: {
        padding: "10px 0px",
        textAlign: "center"
    },
    imageBox: {
        paddingTop: "10px !important",
        position: "relative",
        display: "inline-flex"
    },
    image: {
        height: "200px",
        width: "160px",
    },
    borderRed: {
        border: "1px solid #EA5B45"
    },
    borderGreen: {
        border: "1px solid #15803D"
    },
    borderOrange: {
        border: "1px solid #F59E0B"
    },
    middleGrid: {
        background: "#f8f8f8"
    },
    middleImageBox: {
        height: "90vh",
        width: "100%",
        padding: "40px 70px ",
        textAlign: "center",
        overflow: "auto !important",
        "&::-webkit-scrollbar": {
            display: "none !important"
        }
    },
    middleImage: {
        // height: '78vh',
        // width: '41vw',
        width: "-webkit-fill-available",
        paddingTop: "30px !important",
    },
    divider: {
        paddingTop: "10px !important",
    },
    activeImage: {
        position: 'absolute',
        right: 0,
        height: "20px !important",
        paddingRight: "11px !important",
        marginTop: "8px !important",
    },
    rightBox: {
        width: "100%",
        padding: "20px 40px !important"
    },
    statusBox: {
        border: "1px solid #22C55E",
        width: "fit-content",
        padding: "3px 15px !important",
        borderRadius: "4px",
        float: "inline-end"
    },
    statusRedBox: {
        border: "1px solid #E51A1A",
        width: "fit-content",
        padding: "3px 15px !important",
        borderRadius: "4px",
        float: "inline-end"
    },
    statusOrangeBox: {
        border: "1px solid #D97706",
        width: "fit-content",
        padding: "3px 15px !important",
        borderRadius: "4px",
        float: "inline-end"
    },
    smDivider: {
        height: 3,
        background: "#22C55E",
        marginTop: "10px !important",
    },
    smDividerRed: {
        height: 3,
        background: "#E51A1A",
        marginTop: "10px !important",
    },
    smDividerOrange: {
        height: 3,
        background: "#D97706",
        marginTop: "10px !important",
    },
    mdGreen: {
        color: "#22C55E !important", font: '15px Nunito Sans, sans-serif !important',
    },
    mdRed: {
        color: "#E51A1A !important", font: '15px Nunito Sans, sans-serif !important',
    },
    mdOrange: {
        color: "#D97706 !important", font: '15px Nunito Sans, sans-serif !important',
    },
    nextBtnGrid: {
        paddingTop: '60% !important',
        textAlign: "end !important",
    },
    buttonsGrids: {
        display: "flex !important",
        justifyContent: "space-between",
        padding: "8px !important"
    },
    cancelBtn: {
        marginRight: "15px !important"
    },
    saveBtn: {
        marginRight: "10px !important"
    },
    noInfoBox: {
        width: "100%",
        height: "60vh",
        paddingTop: "30px !important",
        textAlign: "center !important"
    },
    noInformation: {
        marginTop: "60px !important"
    },
    previewBox: {
        width: "100%",
        height: "60vh",
        paddingTop: "30px !important",
        overflow: "auto !important"
    },
    bulkUploadBtnBox: {
        width: "100%",
        marginTop: "15px !important",
        paddingBottom: "0px"
    },
    bulkUploadBtnBoxSec: {
        width: "100%",
        display: "flex !important",
        justifyContent: "space-between !important",
        padding: "5px !important"
    },
    addNewFullBtn: {
        borderRadius: "8px !important"
    },
    totalTimeGrid: {
        borderBottom: "1px solid #E5E8E9 !important",
        borderTop: "1px solid #E5E8E9 !important",
        padding: "10px 40px !important",
        justifyContent: "space-between"
    },
    bulkUploadActionsBox: {
        padding: "20px 40px !important",
        justifyContent: "space-between !important",
        marginTop: "15px !important !important"
    },
    editCancel: {
        color: "#8d8d8d",
        cursor: "pointer",
    },
    saveEditIcon: {
        cursor: "pointer !important",
    },
    cropOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: "40%",
        backgroundColor: '#0C75EB', // Set your desired background color and transparency
    },

}))
export default OCRstyles;