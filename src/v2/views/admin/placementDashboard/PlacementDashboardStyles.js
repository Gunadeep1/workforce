import { makeStyles } from "@mui/styles";

const PlacementDashboardStyles = makeStyles(() => ({

    containerMain: {
        margin: '20px auto 0px 130px',
        width: '88% !important',
        display: "flex",
        justifyContent: "center",
        flexDirection: 'column',
        alignItems: "center",
        background: '#FDFDFD !important',
    },

    dashboardTitle: {
        font: '22px  Nunito , Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important` ,
        // lineHeight: "26px !important",
        letterSpacing: '0em',
        color:"#171717 !important"
    },

    viewText1: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        "&:hover": {
            background: '#F6F6F6  !important'
        },
        backgroundColor:"#F6F6F6 !important"
    },

    viewText: {
        borderBottom: '1px solid #EAECF0 !important',
        font: '13px Nunito Sans, sans-serif !important',
        height: '37px !important',
        "&:hover": {
            background: '#F6F6F6  !important'
        }
    },

}))

export default PlacementDashboardStyles