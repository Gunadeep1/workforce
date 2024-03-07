import { makeStyles } from "@mui/styles";
import { blue, btnBgGrey} from "../../../theme";
import { useTheme } from "@mui/material";

const LedgerDshStyles = makeStyles(() => ({
    activeText: {
        font: "16px Nunito Sans, sans-serif !important",
        // fontFamily: "Nunito , Nunito Sans, sans-serif",
        letterSpacing: '0px',
        color: `${blue} !important`,
        opacity: 1,
        fontWeight: `${500} !important`,
        textTransform: 'capitalize !important',
        padding:'0px 25px !important'
    },
    tabText: {
        font: "16px Nunito Sans, sans-serif !important",
        letterSpacing: '0px',
        color: `#707070 !important`,
        opacity: 1,
        textTransform: 'capitalize !important',
        padding:'0px 25px !important'
    },
    Paper: {
        // margin: '6px 0px',
        display: "flex",
        alignItems: "center",
        height: '48px ! important',
        // background: '#FFFFFF !important',
        border: `1px solid ${btnBgGrey.shade4} !important`,
        boxShadow: "none !important",
        borderRadius: '8px !important',
        paddingRight: '10px !important',
        [useTheme().breakpoints.down('sm')]: {
            marginTop: "20px !important",
        },
    },
    InputBase: {
        flex: 1,
        font: '13px Nunito Sans, sans-serif !important',
        // color: '#C7CCD3 !important',
        background: '#FFFFFF !important',
        opacity: 1,
        borderRadius: '5px !important',
        fontWeight: `${400} !important`,
        width: '100%',
        height: '30px ! important',
        textAlign:'left !important',
        '& input': {
            textAlign: 'left !important',
            paddingLeft: '20px !important'
        },      
        color: "rgba(38, 38, 38, 1)",
        // transition: "all .3s ease",
        '&::-webkit-input-placeholder': {
            color: "rgba(199, 204, 211, 1)",
        },
        // '&:focus': {
        //     outline: "none"
        // }
    },

    cloud: {
        display: "flex",
        alignItems: "center",
        height: '44px ! important',
        width: '44px ! important',
        // background: '#FFFFFF !important',
        border: `1px solid ${btnBgGrey.shade4} !important`,
        boxShadow: "none !important",
        borderRadius: '8px !important',
        paddingRight: '7px !important'
    }
    
}))

export default LedgerDshStyles;
