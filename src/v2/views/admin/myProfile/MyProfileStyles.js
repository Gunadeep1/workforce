import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const Styles = makeStyles((theme) => ({
    avatar: {
        width: "100px !important",
        height: "100px !important",
    },
    profileName: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#092333 !important",
        fontSize: "18px !important",
        textAlign: "center"
    },
    role: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#9D9E9F !important",
        fontSize: "14px !important",
        textAlign: "center"
    },
    listItems: {
        fontFamily: "Nunito Sans, sans-serif !important",
        minHeight: "57px !important",
        margin: "15px 0px !important",
        color: '#092333',
        borderRadius: "8px !important",
        fontSize: "14px !important",
        transition: "all .3s ease",
        // '&:hover': {
        backgroundColor: '#F5F6F6 !important',
        // },
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
    myDetails: {
        fontFamily: "Nunito Sans, sans-serif !important",
        color: "#171717 !important",
        fontSize: "16px !important",
        fontWeight: "400 !important"
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: '#C7CCD3 !important',
        marginLeft: '4px !important'
    },
    borderInput: {
        font: '14px Nunito !important',
        background: '#FFFFFF !important',
        opacity: 1,
        border: '1px solid #D1D1D1 !important',
        borderRadius: '3px',
        height: '25px !important',
        paddingLeft: '10px !important',
        paddingRight: '10px !important',
        width: '100%',
    },
    endAdornmentControl: {
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#C7CCD3",
                borderRadius: "8px",
                font: "14px Nunito Sans, sans-serif !important"
            },
            "&:hover fieldset": {
                borderColor: "#C7CCD3"
            },
        },
    },
    endAdornmentInput: {
        "& .MuiInputBase-input": {
            font: "14px Nunito Sans, sans-serif !important",
        }

    },
    visiblityBtn: {
        width: '22px',
        height: '22px'

    },
    saveBtn: {
        marginTop: "5px !important",
        height: "35px !important",
        fontSize: "14px !important"
    },
    uploadImage: {
        width: "100%",
        height: "100%",
        opacity: 0,
        background: "#303030CC",
        borderRadius: "50%",
        "&:hover": {
            opacity: 1
        },
        transition: "0.3s ease"
    },
    uploadImageText: {
        font: "12px Nunito Sans, sans-serif !important",
        color: "#FFFFFF"
    },
    saveButtonAnimation: {
        width: "86px !important",
        position: 'absolute',
        top: 18,
        right: 35,
        transition: "1s",
        zIndex: 1
    },
    editButtonAnimation: {
        width: "86px !important",
        position: 'absolute',
        top: "87%",
        right: 35,
        transition: "1s",
        zIndex: 1,
        [useTheme().breakpoints.down('md')]: {
            minHeight: "600px !important",
            top: "90%",
            
        },
    },

    myDetailsBox: {
        minHeight:"390px ",
        transition:"1s"
    },
    myDetailsBoxExtended: {
        minHeight: "450px",
        transition: "1s",
        [useTheme().breakpoints.down('md')]: {
            minHeight: "600px !important",
            
        }
    },
    

}))

export default Styles