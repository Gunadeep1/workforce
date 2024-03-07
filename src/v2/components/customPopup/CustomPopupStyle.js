import { useTheme } from "@mui/material"
import { makeStyles } from "@mui/styles"


const Styles = makeStyles(() => ({
    dialogWrapper: {
        position: 'absolute',
        borderRadius: '8px 8px 8px 8px !important',
        background: '#FFFFFF !important',
    },
    dialogWrapper1: {
        position: 'absolute',
        borderRadius: '8px 8px 8px 8px !important',
        background: '#FFFFFF !important',
        width: "-webkit-fill-available  !important"
    },
    fixedWidth: {
        position: 'absolute',
        borderRadius: '8px 8px 8px 8px !important',
        background: '#FFFFFF !important',
        width: "400px !important"
    },
    statusWidth:{
        position: 'absolute',
        borderRadius: '8px 8px 8px 8px !important',
        background: '#FFFFFF !important',
        width: "500px !important"
    },
    dialogTitle: {
        background: `#2A3042 !important`,
        color: '#FFFFFF',
        margin: "0px !important",
        padding: '10px !important',
        paddingLeft: '20px !important'
    },
    dialogWhite: {
        background: `#FFFFFF !important`,
        color: '#FFFFFF',
        margin: "0px !important",
        padding: '10px !important',
        paddingLeft: '20px !important'
    },
    DialogContent: {
        paddingBottom: '30px !important',
        paddingTop: '20px !important',
        [useTheme().breakpoints.down('lg')]: {
            paddingBottom: '30px !important',
            paddingTop: '20px !important',
        },
        [useTheme().breakpoints.down('md')]: {
            paddingBottom: '33px !important',
            paddingTop: '20px !important',
        },
        [useTheme().breakpoints.down('sm')]: {
            paddingBottom: '30px !important',
            paddingTop: '20px !important',
        },
        "@media (max-width:320px) ": {
            padding: "20px 10px 30px 10px !important"
        },
    },
    iconBtn: {
        color: '#C9C7C7 !important',
        padding: '2px 6px 2px 2px !important',
        cursor: 'pointer',
        height: '16px !important',
        width: '16px !important',
        textAlign: 'flex-end',
        [useTheme().breakpoints.down('md')]: {
            height: '14px !important',
            width: '14px !important',
            cursor: 'pointer',
            textAlign: 'flex-end !important',
            padding: '2px 0px 2px 2px !important',

        }
    },
    redIcon: {
        color: '#EB573A !important',
        padding: '2px 6px 2px 2px !important',
        cursor: 'pointer',
        height: '25px !important',
        width: '25px !important',
        textAlign: 'flex-end',
        [useTheme().breakpoints.down('md')]: {
            textAlign: 'flex-end !important',
            padding: '2px 0px 2px 2px !important',

        }
    },
    divider: {
        borderBottomWidth: '2px !important',

    },
    headerStyle: {
        font: "12px Poppins !important",
        opacity: 0.8,
        padding: '0px !important',
        fontWeight: "medium !important",
        [useTheme().breakpoints.down('md')]: {
            font: "13px Poppins !important",
        },
        [useTheme().breakpoints.down('sm')]: {
            font: "11px Poppins !important",
        }
    }
}))

export default Styles


