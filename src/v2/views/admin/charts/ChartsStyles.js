import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material"
import { blue } from "../../../theme";

const ChartStyles = makeStyles(() => ({

    containerMain: {
        margin: '20px auto 0px 130px',
        width: '88% !important',
        display: "flex",
        justifyContent: "center",
        flexDirection: 'column',
        alignItems: "center",
        background: '#FDFDFD !important',
    },

    leftcard: {
        padding: '24px',
        minHeight: "35vh",
        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '12px',

    },

    graphCard: {
        padding: '24px',
        minHeight: "45vh",
        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '12px',
    },

    miniCard: {
        padding: '24px',
        minHeight: "28vh",
        width: '100%',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        borderRadius: '12px',

    },
    chart: {
        width: 870,

        [useTheme().breakpoints.down('md')]: {
            width: '470px !important',
            // paddingTop: '20px !important',
        },
        [useTheme().breakpoints.down('sm')]: {
            width: '370px !important',
        },
        "@media (max-width:320px) ": {
            padding: "20px 10px 30px 10px !important"
        },
    },
    monochrome: {
        "apexcharts-polar-series": {
            borderRadius: '10px !important'
        }
    },
    chatInput: {
        width: '100%',
        border: 'none',
        font: '16px Nunito',
        fontWeight: `${400}`,
        color: '#4F4F4F',
        paddingLeft: '15px',
        alignItems: 'center',  
    },
    suggestionText: {
        color: `${blue}`, cursor: 'pointer'
    },
    suggestions: {
        border: `1px solid ${blue}`, borderRadius: '8px', padding: '5px 8px'
    },

}))
export default ChartStyles;