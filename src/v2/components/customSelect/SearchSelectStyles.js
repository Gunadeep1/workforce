import { makeStyles } from "@mui/styles";

const SearchSelectStyles = makeStyles(() => ({
  select: {
    font: "14px Poppins !important",
    background: "#f4f4f4 0% 0% no-repeat padding-box",
    borderRadius: "3px",
    height: "31px !important",
    opacity: 1,
    border: "#f4f4f4",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },

  listSubHeader: {
    padding: "0px !important",
    paddingRight: "7px !important",
    textAlign: "center !important",
    height: "30px !important",
    bottom:'0px !important'
    // position: "sticky !important ",
  },
  bottomListSubHeader:{
    padding: "0px !important",
    paddingRight: "7px !important",
    textAlign: "center !important",
    height: "30px !important",
    bottom:'0px !important',
    background: "#55a7e4 !important"
  },
  bottomListSubHeader1:{
    padding: "0px !important",
    paddingRight: "7px !important",
    textAlign: "center !important",
    height: "30px !important",
    bottom:'0px !important',
    background: "#55a7e4 !important",
    marginTop: "6px !important"
  },
  textField: {
    marginLeft:"8px !important",
    width: "95%",
    padding: "0px !important",
  },
  input: {
    height: "14px !important",
  },
  addText: {
    color: "#ffffff !important",
    font: "12px Poppins !important",
    cursor: "pointer",
    paddingTop: "5px",
  },
}));

export default SearchSelectStyles;
