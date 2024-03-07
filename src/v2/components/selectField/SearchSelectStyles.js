import { makeStyles } from "@mui/styles";
// import { btnBorder } from "../../theme";

const SearchSelectStyles = makeStyles(() => ({
  select: {
    // font: "16px Nunito Sans, sans-serif !important",
    // background: "#FFFFFF !important",
    // borderRadius: "8px !important",
    // height: "55px !important",
    // width:'100% !important',
    // // opacity: 1,
    // border: `1px solid ${btnBorder.grey} !important`,
    // "& .MuiOutlinedInput-notchedOutline": {
    //   border: 0,
    //   background: "#FFFFFF !important",
    // },
    // "&.Mui-focused": {
    //   border: 0,
    //   background: "#FFFFFF !important",
    // },
    // "& .MuiSelect-select":{
    //   background:'transparent !important',
    // }   
    "& .MuiSelect-select": {
      positon: 'relative',
      padding: '22.28px 35px 10px 12px !important',
      height: '17px !important',
      width: '100% !important',
      background: 'white !important',
      border: '1px solid #C7CCD3 !important',
      borderRadius: '8px !important',
      font: '14px Nunito !important',
      color: '#262626 !imporant',
      fontWeight: `${400} !important`,
    },

    "& .MuiSvgIcon-root": {
      fill: '#737373 !important',
      marginRight: '5px !important',
    },

    "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
      top: '15px !important'
    },

    "& .Mui-disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      "-webkit-text-fill-color": '#525252 !important',
      fill: '#737373 !important',
    },

    background: 'white !important',
    height: '54px !important',
    borderRadius: '8px !important',

  },


  addText: {
    color: "#171717 !important",
    font: "14px Nunito Sans, sans-serif !important",
    cursor: "pointer",
    paddingTop: "5px",
  },
  bottomListSubHeader: {
    padding: "0px !important",
    paddingRight: "7px !important",
    textAlign: "center !important",
    height: "32px !important",
    bottom: '0px !important',
    background: "#EDF4FB !important"
  },
  bottomListSubHeader1: {
    padding: "0px !important",
    paddingRight: "7px !important",
    textAlign: "center !important",
    height: "32px !important",
    bottom: '0px !important',
    background: "#EDF4FB !important",
    marginTop: "6px !important"
  },


  listSubHeader: {
    width: '100%',
    height: '50px !important',
    padding: '8px 10px !important',
  },
  textField: {
    margin: "3px 2px 0px 2px!important",
    width: "100%",
    padding: "0px !important",
  },
  input: {
    height: "16px !important",
  },

  inputLabel: {
    color: '#737373 !important',
    font: '14px Nunito !important',
    fontWeight: `${400} !important`
  },
  icon: {
    fill: 'red !important'
  }

}));

export default SearchSelectStyles;
