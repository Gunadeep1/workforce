import { makeStyles } from "@mui/styles";
import { btnBorder } from "../../theme";

const InputStyles = makeStyles((theme) => ({
  disabled: {
    backgroundColor: 'transparent !important',
  },
  underline: {
    '&:hover:not($disabled):before,&:before': {
      borderColor: 'grey !important',
      borderWidth: '1px !important',
    },
    '&:after': {
      borderColor: '#FFB400',
    },
  },

  underlineError: {
    '&:after': {
      borderColor: 'darkred',
    },
  },
  underlineSuccess: {
    '&:after': {
      borderColor: 'darkgreen',
    },
  },
  labelRoot: {
    color: 'black',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '1.42857',
    letterSpacing: 'unset',
  },
  feedback: {
    position: 'absolute',
    top: '18px',
    right: '0',
    zIndex: '2',
    display: 'block',
    width: '24px',
    height: '24px',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  marginTop: {
    marginTop: '16px',
  },

  formControl: {
    margin: '0px',
    position: 'relative',
    verticalAlign: 'unset',
    "& .MuiFilledInput-root": {
      borderRadius: '8px !important'
    },
    "& .MuiTypography-root": {
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
      color: '#737373 !important',
      padding: '0px 0px 2px 0px !important',
    },
    "& .MuiFormLabel-root": {
      color: '#737373 !important',
      font: '14px Nunito !important',
      marginTop: '2px',
      fontWeight: `${400} !important`,
    },

    "& .MuiFormControl-root": {
      margin: '0px !important'
    }
  },

  formInput: {
    font: '14px Nunito !important',
    background: "#f4f4f4 !important",
    opacity: 1,
    borderRadius: '9px',
    height: '22px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    "&:focus": {
      border: '1px solid #4285F4 !important'
    }
  },
  formInputLight: {
    font: '14px Nunito !important',
    background: "#FAFAFA !important",
    opacity: 1,
    borderRadius: '9px',
    height: '22px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    // "&:focus": {
    //   border: '1px solid #4285F4 !important'
    // }
  },
  borderInput: {
    font: '14px Nunito !important',
    background: '#FFFFFF !important',
    opacity: 1,
    border: '1px solid #D1D1D1 !important',
    borderRadius: '3px',
    height: '25px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    width: '100%',
  },
  smallInput: {
    font: '14px Nunito !important',
    background: '#FFFFFF !important',
    opacity: 1,
    border: '1px solid #D1D1D1 !important',
    borderRadius: '3px',
    height: '18px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    width: '80% !important',
  },
  formInputWhite: {
    background: "#FFFF 0% 0% no-repeat padding-box !important",
    opacity: 1,
    borderRadius: '3px',
    height: '30px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
  },
  fontSize: {
    font: " normal normal normal 12px/30px Nunito !important",
    letterSpacing: "0px !important",
    color: "#707070",
    opacity: "1",
  },
  forgotForm: {
    background: '#FFFFFF 0% 0% no-repeat padding-box !important',
    opacity: 1,
    border: '1px solid #1A181E !important',
    borderRadius: '5px',
    width: '100%',
    height: '30px ! important',
    alignItems: 'center !important',
    padding: '15px 10px 15px 25px !important'
  },
  boxsize: {
    width: " 478px !important",
    height: " 45px !important",
    background: "#f4f4f4 0% 0% no-repeat padding-box !important",
    borderRadius: "3px !important",
    opacity: 1,
  },
  formInputWhiteTextArea: {
    background: "#FFFF 0% 0% no-repeat padding-box !important",
    opacity: 1,
    borderRadius: '3px',
    height: '30px !important',
    paddingBottom: "150px !important",
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
  },
  createInvoice: {
    background: '#FFFFFF 0% 0% no-repeat padding-box !important',
    opacity: 1,
    textAlign: 'center',
    width: '196px !important',
    height: '7px !important',
  },
  tabInput: {
    textAlign: "center"
  },
  //// FormInput Text Align Center
  formInputText: {
    textAlign: 'center',
    font: '14px Nunito !important',
    background: "#f4f4f4 !important",
    opacity: 1,
    borderRadius: '3px',
    height: '22px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    "&:focus": {
      border: '1px solid #4285F4 !important'
    }
  },
  commentHeight: {
    width: '100%',
    font: '14px Nunito !important',
    padding: "5px 10px !important",
    background: "#f4f4f4 !important",
    opacity: 1,
    borderRadius: '3px !important',
    "&:focus": {
      border: '1px solid #4285F4 !important'
    }
  },
  selectDate: {
    font: '9px Nunito !important',
    background: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '3px',
    height: '22px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    border: '1px solid #E3E3E3 !important'
  },
  largeFormInput: {
    font: '14px Nunito !important',
    background: "#f4f4f4 !important",
    opacity: 1,
    borderRadius: '8px',
    height: '25px !important',
    paddingLeft: '10px !important',
    paddingRight: '10px !important',
    "&:focus": {
      border: '1px solid #4285F4 !important'
    }
  },
  employeeFormInput: {
    font: '14px Nunito !important',
    background: "#ffffff !important",
    // opacity: 1,
    borderRadius: '8px',
    border: '1px solid #C7CCD3 !important',
    // height: '54px !important',
    color: 'red ',
    padding: '18.5px, 12px, 18.5px, 12px !important',
    "&:focus": {
      border: '1px solid #4285F4 !important'
    }
  },
  clientInput: {
    font: '16px Nunito !important',
    background: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    border: `1px solid ${btnBorder.grey} !important`,
    "&.MuiInputBase-input": {
      padding: '25.41px 12px 10px 12px !important',
      height: '17px',
      color: '#262626 !important',
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      '-webkit-text-fill-color': "#525252 !important",
    },
  },
  clientInput1: {
    font: '16px Nunito !important',
    background: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    "&.MuiInputBase-input": {
      padding: '25.41px 12px 10px 12px !important',
      height: '17px',
      color: '#262626 !important',
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      '-webkit-text-fill-color': "#525252 !important",
    },
  },
  textAreaHeight: {
    font: '16px Nunito Sans, sans-serif !important',
    background: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    border: `1px solid ${btnBorder.grey} !important`,
    height: '100px !important',
    "MuiInputBase-root-MuiFilledInput-root": {
      borderRadius: '8px !important',
    },
  },

  descriptionFormControl: {
    "& .MuiFilledInput-root": {
      borderRadius: '8px !important',
      background: 'white !important',
      border: `1px solid ${btnBorder.grey} !important`,
      padding: '22px 12px '
    },

    '& .MuiInputBase-root.Mui-disabled': {
      background: "#FAFAFA !important",
      border: '1px solid #FAFAFA !important',
    },
  },

  descriptionInput: {
    font: '16px Nunito !important',
    backgroundColor: "#FFFFFF !important",
    opacity: 1,
    '&::placeholder': {
      color: '#525252 !important',
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
      opacity: '1 !important'
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      border: '1px solid #FAFAFA !important',
      '-webkit-text-fill-color': "#525252 !important",
    },
  },
  InputSm: {
    '&::placeholder': {
      color: '#737373 !important',
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
      opacity: '1 !important'
    },
    font: '16px Nunito !important',
    backgroundColor: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    border: `1px solid ${btnBorder.grey} !important`,
    "&.MuiInputBase-input": {
      padding: '9px 8px 9px 8px !important',
      height: '14px',
      color: '#262626 !important',
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      '-webkit-text-fill-color': "#525252 !important",
    },
  },

  helperText: {
    color: 'red !important'
  },
  popUpInput: {
    font: '16px Nunito, Nunito Sans, sans-serif !important',
    backgroundColor: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    height: '8px !important',
    "&.MuiInputBase-input": {
      border: `1px solid ${btnBorder.grey} !important`,
      padding: '27px 12px 10px 12px !important',
      height: '17px',
      borderRadius: '8px',
      color: '#262626 !important',
      font: '14px Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${400} !important`,
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      border: `1px solid #FAFAFA !important`,
      borderRadius: '8px !important',
      '-webkit-text-fill-color': "#262626 !important",
    },
  },
  smallWhiteInput: {
    width: '100%',
    font: '14px Nunito !important',
    padding: "5px 10px !important",
    height: '25px !important',
    opacity: 1,
    textAlign: 'center',
    // borderRadius: '3px !important',
    "&:focus": {
      // border: '1px solid #4285F4 !important'
    }
  },
  smallClientInput: {
    font: '16px Nunito !important',
    backgroundColor: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    border: `1px solid ${btnBorder.grey} !important`,
    "&.MuiInputBase-input": {
      padding: '10px 12px 20px 12px !important',
      height: '15px',
      color: '#262626 !important',
      font: '14px Nunito !important',
      fontWeight: `${400} !important`,
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      '-webkit-text-fill-color': "#525252 !important",
    },
  },
  tooltipField: {
    font: '16px Nunito !important',
    background: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    border: `1px solid ${btnBorder.grey} !important`,
    "MuiInputBase-root-MuiFilledInput-root": {
      background: 'white !important'
    }
  },

  smallWhiteBg: {
    width: '100%',
    font: '21px Nunito Sans, sans-serif !important',
    padding: "5px 10px !important",
    height: '25px !important',
    opacity: 1,
    background: '#FFFFFF !important',
    color: '#15803D !important',
    fontWeight: `${600} !important`,
  }
}));

export default InputStyles
