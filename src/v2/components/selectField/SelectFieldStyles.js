import { makeStyles } from "@mui/styles";
import { btnBorder } from "../../theme";

const SelectFieldStyles = makeStyles(() => ({
    defaultSelect: {
        font: "14px Nunito Sans, sans-serif !important",
        background: '#FFFFFF !important',
        borderRadius: '8px',
        height: '55px !important',
        opacity: 1,
        border: `1px solid ${btnBorder.grey} !important`,
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0,
        },
    },
}))

export default SelectFieldStyles;