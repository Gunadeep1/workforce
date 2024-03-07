import { makeStyles } from "@mui/styles";

const AddSelectFormStyles = makeStyles({
    dialogGrid: {
        position: "absolute",
        // marginLeft: '50px',
        // top: "-14rem",
        zIndex: "1000",
        width: '75% !important',
        border: "1px solid #C9C7C7 !important",
        borderRadius: "7px !important",
        background: "white !important",
    },
    dialogOuterGrid: {
        position: "relative",
    },
    closeIcon: {
        color: "#2D2D2D !important",
        width: "17px !important",
        paddingTop: "1px !important",
    },
    pointer: {
        marginTop: "-8px",
        marginLeft: '-10px',
        color: "#E7E6E6",
        fontSize: "22px",
        position: "absolute",
    },
    popupContainer: {
        height: 'auto !important',
        width: "260px !important"
    },
    closeIconStyles: {
        cursor: 'pointer',
        height: '17px !important',
        width: '17px !important'
    },
    popupContactContainer: {
        height: 'auto !important',
        width: "280px !important",
        padding: '0px !important'
    },
    required:{
        color:'red'
    },
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
    },
    popupContContainer: {
        height: 'auto !important',
        width: "auto !important",
        padding: '0px !important'
    },
});

export default AddSelectFormStyles