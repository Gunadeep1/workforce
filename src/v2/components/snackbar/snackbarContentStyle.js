import {
  defaultFont,
  primaryBoxShadow,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  dangerBoxShadow,
  roseBoxShadow,
  whiteColor,
  blackColor,
  grayColor,
  infoColor,
  successColor,
  dangerColor,
  roseColor,
  primaryColor,
  warningColor,
  hexToRgb,
  greenColor,
  redColor,
  orangeColor
} from './GlobalColors.js'

const snackbarContentStyle = {
  snackWidth:{
    "@media (min-width:1100px)": {
          width: "500px !important",
      },
  },
  snackSmallWidth:{
    "@media (min-width:1100px)": {
          width: "300px !important",
      },
  },
  root: {
    ...defaultFont,
    flexWrap: 'unset',
    position: 'relative',
    padding: '5px',
    lineHeight: '20px',
    marginBottom: '20px',
    fontSize: '8px',
    backgroundColor: whiteColor,
    color: grayColor[7],
    borderRadius: '3px',
    boxShadow:
      '0 12px 20px -10px rgba(' +
      hexToRgb(whiteColor) +
      ', 0.28), 0 4px 20px 0px rgba(' +
      hexToRgb(blackColor) +
      ', 0.12), 0 7px 8px -5px rgba(' +
      hexToRgb(whiteColor) +
      ', 0.2)',
  },
  top20: {
    top: '20px',
  },
  top40: {
    top: '40px',
  },
  info: {
    backgroundColor: infoColor[3],
    color: whiteColor,
    ...infoBoxShadow,
  },
  success: {
    backgroundColor: '#FFFFFF !important',
    color: `${greenColor} !important`,
    border:`1px solid ${greenColor} !important`,
    ...successBoxShadow,
  },
  warning: {
    backgroundColor: '#FFFFFF !important',
    color: `${orangeColor} !important`,
    border:`1px solid ${orangeColor} !important`,
    ...warningBoxShadow,
  },
  danger: {
    backgroundColor: '#FFFFFF !important',
    color: `${redColor} !important`,
    border:`1px solid ${redColor} !important`,
    ...dangerBoxShadow,
  },
  primary: {
    backgroundColor: primaryColor[3],
    color: whiteColor,
    ...primaryBoxShadow,
  },
  rose: {
    backgroundColor: roseColor[3],
    color: whiteColor,
    ...roseBoxShadow,
  },
  black: {
    backgroundColor: blackColor,
    color: whiteColor,
    ...primaryBoxShadow,
  },
  message: {
    // width: '100%',
    padding: '20',
    display: 'block',
    // maxWidth: '89%',
  },
  close: {
    width: '11px',
    height: '11px',
  },
  iconButton: {
    width: '24px',
    height: '24px',
    padding: '0px',
  },
  icon: {
    display: 'block',
    left: '15px',
    position: 'absolute',
    top: '50%',
    marginTop: '-15px',
    width: '30px',
    height: '30px',
  },
  infoIcon: {
    color: infoColor[3],
  },
  successIcon: {
    color: successColor[3],
  },
  warningIcon: {
    color: warningColor[3],
  },
  dangerIcon: {
    color: dangerColor[3],
  },
  primaryIcon: {
    color: primaryColor[3],
  },
  roseIcon: {
    color: roseColor[3],
  },
  iconMessage: {
    paddingLeft: '50px',
    display: 'block',
  },
  actionRTL: {
    marginLeft: '-8px',
    marginRight: 'auto',
  },
}

export default snackbarContentStyle
