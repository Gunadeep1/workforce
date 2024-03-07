import { makeStyles } from "@mui/styles";
import BorderImg from "../../../assets/images/border.png";


const OCRstyles = makeStyles(() => ({

    // Breadcrumbs Styles
    breadcrumbsName: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#092333 !important",
        fontSize: "14px !important",
    },

    breadcrumbsLink: {
        fontFamily: "Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#849199 !important",
        fontSize: "14px !important",
        textDecoration: "none !important",
        cursor: "pointer !important",
    },
    // Breadcrumbs Styles End


    infoText:{
        font:"16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "600 !important",
        color: "#D97706 !important",
        margin: "0px 8px !important"
    },

    dropzoneBox: {
        width: '100%',
        height: "31vh",
        display: 'inline-block',
        border: 'dashed 3px red',
        borderImageSource: `url(${BorderImg})`,
        borderImageSlice: 2,
        borderImageRepeat: 'round',
        borderImage: `url(${BorderImg}) 2 round`,
    },


    sideboxtitle:{
        font:"16px Nunito, Nunito Sans, sans-serif !important",
        fontWeight: "400 !important",
        color: "#000000 !important",
    },

}))
export default OCRstyles;