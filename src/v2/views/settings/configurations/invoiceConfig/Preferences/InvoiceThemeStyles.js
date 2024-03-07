import { makeStyles } from "@mui/styles";

const InvoiceThemeStyles = makeStyles(() => ({
    label1: {
        font: '36px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${600} !important`,
        // color: `#138CBD !important`,
    },
    label2: {
        font: '24px  Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${700} !important`,
        // color: `#138CBD !important`,
    },
    activeItemBox:{
        border:"1px solid #E8E8E8",
        borderRadius:"10px"
    }
}))
export default InvoiceThemeStyles;