import { makeStyles } from "@mui/styles";

const OnboardStyles = makeStyles(() => ({
    optional: {
        font: '14px Nunito Sans, sans-serif !important',
        color: 'rgb(194 188 188) !important',
        marginLeft: '4px !important'
    },
    checkBoxbg: {
        height: '56px',
        borderRadius: '10px', alignItems: 'center !important',
        display: 'flex',
        flexDirection: 'row',
        background: '#FAFAFA !important'
    },
    checkBox: {
        border: '1px solid #c4c2c2',
        height: '56px',
        borderRadius: '10px',
        alignItems: 'center !important',
        display: 'flex',
        flexDirection: 'row'
    },
    checkboxColor:{
        // color: '#E2E5E6 !important'
    },
    ViewContainer:{
        height:'45vh',
        width:'100%',
        alignItems:'center',
        textAlign:'center',
        justifyContent:'center'
    },
}))

export default OnboardStyles;