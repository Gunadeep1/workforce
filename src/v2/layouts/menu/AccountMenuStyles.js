import { makeStyles } from "@mui/styles";

const AccountMenuStyles = makeStyles(() => ({
    menu: {
        '& .MuiPaper-root': {
            width: '240px',
            height: '234px',
            boxShadow: 'rgba(16, 24, 40, 0.03) 0px 4px 6px -2px, rgba(16, 24, 40, 0.08) 0px 12px 16px -4px',
            overflow: 'visible',
            border: '1px solid #F2F4F7',
            borderRadius: '8px',
        },
        '& .MuiMenu-list': {
            padding: '0px',
            borderRadius: '8px',
        },


    },


    avatarBox: {
        border: '4px solid #FFFF',
        borderRadius: '50%',
        cursor: 'pointer',
    },
    avatarBoxActive: {
        border: '4px solid #E2F0FF',
        borderRadius: '50%',
        cursor: 'pointer',

    },

    menuItem: {
        width: '240px',
        height: '64px',
        padding: '12px 16px !important',
        background:'#FFFFFF !important',
        borderRadius:'8px !important'
    },

    menuItemIn: {
        width: '240px',
        height: '42px',
        padding: '12px 12px !important',
    },

    profileInfo: {
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '10px',
    },

    ListItem: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '15px',
    },






}));

export default AccountMenuStyles;