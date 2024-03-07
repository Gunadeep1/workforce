import { makeStyles } from "@mui/styles";



const PlacementStyles = makeStyles(() => ({

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
        font: '14px Nunito !important',
        fontWeight: `${500} !important`
    },
    navText2: {
        font: '14px Nunito !important',
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
        font: '13px Nunito Sans, sans-serif !important',
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
        fontFamily: "Nunito , Nunito Sans, sans-serif",
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
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(115, 115, 115, 1) !important"
    },
    text2: {
        textAlign: "center !important",
        fontSize: "12px !important",
        fontFamily: "Nunito Sans, sans-serif !important",
        fontWeight: "500 !important",
        color: "rgba(38, 38, 38, 1) !important"
    },
    endedPlacementText: {
        font: '14px Nunito !important', fontWeight: `${600} !important`, color: '#404040', cursor: 'pointer !important', width: '120px !important', whiteSpace: 'nowrap !important', overflow: 'hidden', textOverflow: 'ellipsis' 
    },
    placementText: {
        font: '14px Nunito !important', fontWeight: `${600} !important`, color: '#0C75EB', cursor: 'pointer !important', width: '120px !important', whiteSpace: 'nowrap !important', overflow: 'hidden', textOverflow: 'ellipsis' 
    },
    RefText: {
        color: '#16A34A !important', font: '12px Nunito !important', fontWeight: `${500} !important`,cursor:'pointer !important'
    }
}))
export default PlacementStyles;