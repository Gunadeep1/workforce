import { makeStyles } from "@mui/styles";
import {btnBgGrey,  } from "../../../theme";

const TimesheetStyles = makeStyles(() => ({


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
    sideTooltip: {
        height: "30px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
    },

    sideTooltipText: {
        fontSize: "11px !important",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "400",
        color: "#FFFFFF",
    },

    textarea: {
        width: "100% !important",
        font: "14px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "400 !important",
        color: `${btnBgGrey.shade6} !important`,
    },


    cardCount: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#171717 !important",
        fontSize: "40px !important",
    },

    cardText: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "#171717 !important",
        fontSize: "16px !important",
    },

    card: {
        padding: "10px",
        height: "160px",
        borderRadius: "12px",
        cursor: "pointer",
        border: "2px solid #FFFFFF",
    },

    cardHead: {
        width: "100%", height: "75px", display: "flex", justifyContent: "space-between", alignItems: "center"
    },

    total_pending_timesheets: {
        backgroundColor: "#FFF5E4"
    },
    total_pending_timesheets_active: {
        border: "2px solid #F9A71E",
    },
    total_pending_approval_timesheets: {
        backgroundColor: "#E7E0FE"
    },
    total_placements_active: {
        border: "2px solid #0C75EB !important",
    },
    active_placements_active:{
        border: "2px solid #8763FC !important",
    },
    ending_in_placements_active:{
        border: "2px solid #F8B525 !important",
    },
    ended_placements_active:{
        border: "2px solid #2BBA35 !important",
    },
    total_pending_approval_timesheets_active: {
        border: "2px solid #8763FC",
    },
    total_invoice_ready_timesheets: {
        backgroundColor: "#77D2B71A"
    },
    total_invoice_ready_timesheets_active: {
        border: "2px solid #77D2B7",
    },
    // total_invoiced_timesheets: {
    //     // cursor:"default",
    //     backgroundColor: "#0C75EB1A"
    // },
    // total_invoiced_timesheets_active: {
    //     border: "2px solid #0C75EB",
    // },
    total_timesheets: {
        // cursor:"default",
        backgroundColor: "#0C75EB1A"
    },
    total_timesheets_active: {
        border: "2px solid #0C75EB",
    },
    cardBody: {
        width: "100%", height: "75px", display: "flex", alignItems: "center"
    },

    moreiconBox: {
        height: "48px"
    },

    primarytext: {
        fontSize: "22px !important",
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        display: "flex !important",
        alignSelf: "center !important",
        fontWeight: "600 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },
    primarytext2: {
        fontSize: "18px !important",
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        display: "flex !important",
        alignSelf: "center !important",
        fontWeight: "500 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },

    secondarytext: {
        fontSize: "14px !important",
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(115, 115, 115, 1) !important"
    },

    searchInput: {
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
    employeViewContainer: {
        width: "100%",
        height: "168px",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "12px",
        boxShadow: "0px 0px 2.0015923976898193px 0px #919EAB4D, 0px 2.0015923976898193px 24.019107818603516px 0px #919EAB1F ",
    },

    employeViewBox: {
        width: "100%",
        height: '80px'
    },
    flexAlineCenter: {
        display: 'flex',
        alignItems: "center"
    },
    placementCard: {
        padding: "10px",
        height: "160px",
        borderRadius: "12px",
        cursor: "pointer",
        border: "2px solid #F2F2F2",
    },

    step: {
        display: 'flex',
        marginBottom: '2px',
      },
      stepLabel: {
        flexBasis: '120px', // Adjust the width of the step label
      },
      stepContent: {
        flex: 1,
        paddingLeft:'1px', // Adjust spacing as needed
        position: 'relative',
      },
      connector: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '2px', // Adjust the width of the connector
        backgroundColor: '#ccc', // Adjust the color of the connector
      },
    //   tickWithLine: {
    //     position: 'relative',
    //     '&::after': {
    //       content: '""',
    //       position: 'absolute',
    //       top: '100%',
    //       left: '50%',
    //     //   transform: 'translateX(-50%)',
    //       width: '2px', // Adjust the width of the line as needed
    //       height: '50vh !important',
    //       backgroundColor: '#ccc', // Adjust the color as needed
    //     },
    //   },
    // textarea: {
    //     width: "100% !important",
    //     font: "14px Nunito, Nunito Sans, sans-serif !important",
    //     fontWeight: "400 !important",
    //     color: `${btnBgGrey.shade6} !important`,
    // },

}))

export default TimesheetStyles;
