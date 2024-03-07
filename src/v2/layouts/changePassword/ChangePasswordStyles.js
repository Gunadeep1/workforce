import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const ChangePasswordStyles = makeStyles(() => ({
    cardContent: {
        paddingLeft: '50px ! important',
        [useTheme().breakpoints.down('sm')]: {
            paddingLeft: '15px ! important',
        },
    },
    cardHeader: {
        background:"#2A3042",
        color:"#FFFFFF",
        height:"15px !important"
    },
    thinnerText: {
        color: '#707070 ! important',
        font: '18px Poppins !important',
        fontWeight: `${500} !important`,
    },
    lighterText: {
        color: '#C9C7C7 ! important',
    },
    iconPlace: {
        marginRight: '20px',
        marginTop: '7px',
    },
    card1: {
        margin: '20px',
        height: '340px',
        textAlign: 'center ',
        borderRadius: '15px !important',
    },
    formCard: {
        borderRadius: '15px !important'
    },
    typo: {
        fontSize: '13px !important',
        lineHeight: '1.2 !important',
        letterSpacing: '0.06rem !important'
    },
    button: {
        border: '1px solid #707070 !important',
        color: '#000000 !important',
        textTransform: 'capitalize !important',
        padding: '1px !important',
        fontSize: '10px !important',
        width: '100px !important',
        height: '25px'
    },
    Img: {
        borderRadius: '50%'
    },
    primaryGrid: {
        padding:"30px 0px 30px 30px !important",
        background:"#F7F7FA",
        height:"92vh",
        [useTheme().breakpoints.down('lg')]: {
            height:"100%",
        },
        [useTheme().breakpoints.down('md')]: {
            padding:"30px !important",
        },
        [useTheme().breakpoints.down('sm')]: {
            padding:"0px !important",
        },
    },
    secondaryGrid:{
        padding:"16px 20px 16px 16px !important",
    },
    title:{
        marginLeft:"45px !important" 
        
    },
    Paper: {
        margin:'6px 0px',
        display: "flex",
        alignItems: "center",
        height: '35px ! important',
        background: '#F4F4F4 !important',
        boxShadow: "none !important",
    },
    InputBase: {
        marginLeft: 7,
        flex: 1,
        font: '14px Poppins !important',
        color: '#1A181E !important',
        background: '#F4F4F4 !important',
        opacity: 1,
        borderRadius: '5px',
        width: '100%',
        height: '26px ! important',
    },
    IconButton: {
        marginTop: '8px !important',
        marginRight: '10px !important'
    },
    visibilityIcon: {
        height: '18px',
        width: '18px',
        cursor: 'pointer'
    },
    notVisibleIcon: {
        height: '18px',
        width: '18px',
        cursor: 'pointer'
    },
    rightBox: {
        background: '#243042 ! important',
        height: '100vh'
    }
}))

export default ChangePasswordStyles;
