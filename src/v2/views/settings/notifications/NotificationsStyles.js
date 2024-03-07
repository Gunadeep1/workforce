import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";


const NotificationsStyles = makeStyles(() => ({

    root: {
        width: '100% !important',
        display: "flex",
        justifyContent: "center",
        backgroundColor: '#FDFDFD !important',
        marginTop: '30px',
        paddingLeft: '70px',
        [useTheme().breakpoints.down('lg')]: {
        },

        [useTheme().breakpoints.down('sm')]: {
        },
    },

    mainContainer: {
        width: '85% !important',
        alignItems: 'start',
        justifyContent: "start",
    },

    header: {
        flexDirection: 'row !important',
        justifyContent: 'space-between !important',
        width: '100% !important',
        alignItems: 'center !important',
        [useTheme().breakpoints.down('sm')]: {
            flexDirection: 'column !important',
            gap: '16px',
            alignItems: 'start !important'
        },

    },

    leftHeader: {
        flexDirection: 'row !important',
        gap: '24px',
        alignItems: 'center !important'
    },


    header1: {
        font: '22px  Nunito !important',
        color: '#092333 !important',
        fontWeight: `${500} !important`,
    },

    header2: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#000000 !important`,
    },

    header3: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#525252 !important`,
    },
    header4: {
        font: '10px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#737373 !important`,
        textAlign: 'center'
    },
    header5: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#737373 !important`,
    },
    header6: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        color: `#525252 !important`,
    },
    header7: {
        font: '12px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        color: `#0C75EB !important`,
    },
    header8: {
        font: '18px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#000000 !important`,
    },
    header9: {
        font: '14px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        color: `#0C75EB !important`,
        cursor: 'pointer !important',

    },
    header10: {
        font: '16px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${500} !important`,
        color: `#0C75EB !important`,
        cursor: 'pointer !important',

    },

    inputYear: {
        padding: '0px 0px 0px 0px !important',
        fontFamily: "Nunito , Nunito Sans, sans-serif !important",
        fontSize: "14px !important",
        color: "#333333 !important",
        fontWeight: "600 !important"
    },

    listContianer: {
        width: '92.5%',
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    notificationCard: {
        flexDirection: 'row !important',
        justifyContent: 'space-between',
        paddingBottom: '20px',
        marginBottom: '16px',
        width: '100%',
        borderBottom: '1px solid #EAE5E5',
    },

    leftContent: {
        flexDirection: 'row !important',
        gap: '14px',
        alignItems: 'center !important'
    },

    NoDataFoundIcon: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginTop: '100px',
        paddingLeft: '70px',
        gap: '16px',
        font: '18px Nunito !important',
        fontWeight: `${500} !important`,
    },




    // Notification Popup Styles

    root1: {
        display: 'flex',
        height: '40px',
        width: '40px',
        border: '1px solid #EAECF0',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },

    menu: {
        '& .MuiPaper-root': {
            width: '413px',
            maxHeight: '454px',
            boxShadow: 'rgba(16, 24, 40, 0.03) 0px 4px 6px -2px, rgba(16, 24, 40, 0.08) 0px 12px 16px -4px',
            overflow: 'visible',
            marginTop: '15px !important',
            border: '1px solid #F2F4F7',
            borderRadius: '8px !important',
            padding: '12px !important',
        },
        '& .MuiMenu-list': {
            padding: '0px',
            borderRadius: '8px',
        },
    },

    menuItem: {
        display: 'flex !important',
        justifyContent: 'space-between !important',
        alignItems: 'center !important',
        width: '100% !important',
        height: '48px !important',
        cursor: 'default !important',
        background: 'none !important',
        '&:hover': {
            background: 'none !important'
        },
        '& .MuiTouchRipple-root': {
            display: 'none !important',
        }

    },

    closeIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '24px',
        width: '24px',
        borderRadius: '50%',
        backgroundColor: '#EBF2FE',
        cursor: 'pointer',
    },



    viewAll: {
        display: 'flex !important',
        justifyContent: 'center !important',
        alignItems: 'center !important',
        width: '100% !important',
        height: '48px !important',
        cursor: 'default !important',
        '&:hover': {
            background: 'none !important'
        },
        '& .MuiTouchRipple-root': {
            display: 'none !important',
        }
    },
    menuItemIn: {
        width: '100%',
        height: '83px',
        padding: '12px 12px !important',
        cursor: 'default !important',
        '& .MuiTouchRipple-root': {
            display: 'none !important',
        },
        '&:hover': {
            background: 'none !important'
        },
    },

    profileInfo: {
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '10px'
    },

    ListItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },

    leftContainer: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '10px',
        height: '100%',
        width: '280px',
    },

    IconBg: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '53px',
        width: '53px',
        borderRadius: '50%',
    },

    textArea: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        gap: '5px',
        height: '53px',
        width: '215px',
        overflow: 'hidden',
    },

    timeArea: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        height: '53px',
        width: '80px',
        overflow: 'hidden',
    },

    line: {
        margin: '0px !important',
        borderColor: '#F2F4F7 !important',
        borderWidth: '1px !important'
    },

    spanText: {
        display: 'flex',
        gap: '4px'
    },

    cursor: {
        cursor: 'pointer !important',
    },

    // Calender Filter Styles
    calendarBox: {
        width: '220px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


    avatarSize: {
        height: '53px !important',
        width: '53px !important',
    }


}))
export default NotificationsStyles;