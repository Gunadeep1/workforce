import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const ForgotPasswordStyles = makeStyles(() => ({
    fullHeight: {
        height: "100vh",
        [useTheme().breakpoints.down('md')]: {
            marginTop: "-100px ! important",
        }
    },
    leftBox: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "150px",
        marginLeft: "-50px !important",
        [useTheme().breakpoints.down('md')]: {
            marginLeft: "0px !important",
        },
    },
    header: {
        color: '#2D2D2D !important',
        textAlign: 'center',
    },
    buttonWidth: {
        width: '300px ! important',
        height: '40px ! important',
    },
    rightBox: {
        background: '#243042 ! important',
        height: '100vh'
    },
    image: {
        marginTop: "160px",
        marginLeft: "-200px",
        width: "85%",
        // [useTheme().breakpoints.down('md')]: {
        //     marginLeft: "-80px !important",
        // },
    },
    input: {
        textAlign: "left",
        paddingLeft:'14px !important',
        paddingRight:'14px !important',
        width: "300px !important",
    },
}))
