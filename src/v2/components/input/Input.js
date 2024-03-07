import { Box, InputAdornment, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl';
// @material-ui/core components
import Check from '@mui/icons-material/Check'
// @material-ui/icons
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
// core components
import validator from 'validator'
import Text from '../customText/Text';
import InputStyles from './InputStyles';
import { BlackToolTip } from '../../utils/utils';
import InfoIcon from '../../assets/svg/Information.svg';
import { makeStyles } from "@mui/styles";
import Eye from '../../assets/svg/eye.svg';
import closeEye from '../../assets/svg/NotVisible.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid #C7CCD3 !important`,
    font: '16px Nunito !important',
    background: "#FFFFFF !important",
    opacity: 1,
    borderRadius: '8px !important',
    "& .MuiFilledInput-root": {
      background: "white !important",
    },
    "&.Mui-focused": {
      backgroundColor: "white !important"
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      '-webkit-text-fill-color': "#525252 !important",
    },
  },
  rootDisabled: {
    background: "#FAFAFA !important",
    borderRadius: '8px !important',
    border: '1px solid #FAFAFA !important',
    '-webkit-text-fill-color': "rgb(16 16 16 / 73%) !important",
    font: '16px Nunito !important',
    "& .MuiFilledInput-root": {
      background: "#FAFAFA !important",
      '-webkit-text-fill-color': "rgb(16 16 16 / 73%) !important",
    },
    "&:disabled": {
      background: "#FAFAFA !important",
      borderRadius: '8px !important',
      border: '1px solid #FAFAFA !important',
      color: 'rgb(16 16 16 / 73%) !important',
      '-webkit-text-fill-color': "rgb(16 16 16 / 73%) !important",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "rgb(16 16 16 / 73%) !important",
    },
  }
}));

export default function Input(props) {
  const classes = InputStyles()
  const classes1 = useStyles();
  const [isError, setError] = React.useState(false)
  const [emptyMesaage, setMessage] = React.useState()
  const {
    smallInput,
    formControlProps,
    labelText,
    id,
    required,
    inputProps,
    error,
    success,
    placeholder,
    errorMsg,
    maxLength,
    minLength,
    isHttp,
    isMandatory,
    handleChange,
    onKeyPress,
    isNumber,
    mobile,
    password,
    email,
    emailphone,
    formInput,
    formInputLight,
    fontSize,
    forgotForm,
    formInput2,
    createInvoice,
    className,
    formInputWhite,
    formInputWhiteTextArea,
    tabInput,
    borderInput,
    formInputText,
    commentHeight,
    selectDate,
    largeFormInput,
    employeeFormInput,
    clientInput,
    multiline,
    rows,
    textAreaHeight,
    onKeyDown,
    descriptionFormControl,
    iconText,
    disabled,
    eyeCloseIcon,
    descriptionInput, helperText, popUpInput, InputSm, icon, tooltipTitle, smallWhiteInput, smallClientInput, tooltipField, eyeIcon, eyeHandleChange, clientInput1,
    name,
    value,
    smallWhiteBg,  borderOrange,
  } = props

  const underlineClasses = classNames({
    [classes.underlineError]: error || isError,
    [classes.underlineSuccess]: success && (!error || !isError),
    [classes.underline]: true,
    [classes.marginTop]: true,

  })
  // const marginTop = classNames({
  //   [classes.marginTop]: labelText,
  // })

  const formControlClasses = classNames({
    [' ' + classes.formControl]: formControlProps,
    [classes.descriptionFormControl]: descriptionFormControl,
  })

  // CSS CLASSES WHICH APPLY FOR INPUT
  const fieldClasses = classNames({
    [classes.formInput]: formInput,
    [classes.formInputLight]: formInputLight,
    [classes.borderInput]: borderInput,
    [classes.tabInput]: tabInput,
    [classes.formInputWhite]: formInputWhite,
    [classes.fontSize]: fontSize,
    [classes.forgotForm]: forgotForm,
    [classes.formInput2]: formInput2,
    [classes.createInvoice]: createInvoice,
    [classes.formInputWhiteTextArea]: formInputWhiteTextArea,
    [classes.tabInput]: tabInput,
    [classes.formInputText]: formInputText,
    [className]: className,
    [classes.commentHeight]: commentHeight,
    [classes.smallInput]: smallInput,
    [classes.selectDate]: selectDate,
    [classes.largeFormInput]: largeFormInput,
    [classes.employeeFormInput]: employeeFormInput,
    [classes.clientInput]: clientInput,
    [classes.textAreaHeight]: textAreaHeight,
    [classes.descriptionInput]: descriptionInput,
    [classes.popUpInput]: popUpInput,
    [classes.InputSm]: InputSm,
    [classes.smallWhiteInput]: smallWhiteInput,
    [classes.smallClientInput]: smallClientInput,
    [classes.tooltipField]: tooltipField,
    [classes.clientInput1]: clientInput1,
    [classes.smallWhiteBg]: smallWhiteBg,
    [classes.borderOrange]:borderOrange
  })

  const onChange = (event) => {
    if (isNumber) {
      if (isNaN(event.target.value)) {
        return
      }
    }

    if (isMandatory == 'true' && event.target.value.length == 0) {
      setError(true)
      setMessage(errorMsg)
      handleChange(event, true)
    } else {
      setError(false)
      handleChange(event, false)
    }

    if (mobile == 'true') {
      if (event.target.value.length != 10) {
        setError(true)
        setMessage(errorMsg)
        handleChange(event, true)
      }
    }
    if (password == 'true') {
      if (event.target.value.length < 6) {
        setError(true)
        setMessage(errorMsg)
        handleChange(event, true)
      }
    }

    if (email == 'true') {
      if (validator.isEmail(event.target.value)) {
        setError(false)
        handleChange(event, false)
      }
      else {
        setError(true)
        setMessage(errorMsg)
        handleChange(event, true)
      }
    }
    if (emailphone == 'true') {
      if (validator.isEmail(event.target.value)) {
        setError(false)
        handleChange(event, false)
      }
      else if (event.target.value.length != 10) {
        setError(true)
        setMessage(errorMsg)
        handleChange(event, true)
      }
    }

    if (maxLength) {
      if (event.target.value.length > parseInt(maxLength)) {
        setError(true)
        setMessage(errorMsg)
        handleChange(event, true)
      }
    } else if (minLength) {
      if (event.target.value.length < parseInt(minLength)) {
        setError(true)
        setMessage(errorMsg)
        handleChange(event, true)
      }
    } else {
      if (handleChange) {
        handleChange(event, false)
      }
    }
    if (isHttp) {
      var link = event.target.value
      var check = link.substring(0, 4)
      if (check == 'http' || check == 'HTTP') {
      } else {
        setError(true)
        setMessage(
          'Please Add (http) else (https) before the URL, For Ex:- http://google.com'
        )
      }
    }
  }

  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.classNames + formControlClasses}
    >
      {
        iconText
          ?
          <TextField
            className={disabled ? classes1.rootDisabled : classes1.root}
            label={labelText}
            required={required}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            variant="filled"
            margin="dense"
            InputLabelProps={{
              underline: underlineClasses,
            }}
            InputProps={{
              classes: { input: fieldClasses },
              disableUnderline: true,
              endAdornment: (
                true &&
                <InputAdornment position="end">
                  {
                    eyeIcon ?
                      <img src={eyeIcon ? Eye : InfoIcon} alt="InfoIcon" style={{ height: '22px', width: '22px', cursor: 'pointer' }} onClick={eyeIcon ? eyeHandleChange : ''} />
                      :
                      eyeCloseIcon ?
                        <img src={eyeCloseIcon ? closeEye : InfoIcon} alt="InfoIcon" style={{ height: '22px', width: '22px', cursor: 'pointer' }} onClick={eyeCloseIcon ? eyeHandleChange : ''} />
                        :
                        <BlackToolTip arrow placement='top' title={
                          <Text mediumWhite sx={{ padding: '5px !important' }}>{tooltipTitle ? tooltipTitle : ''}</Text>
                        }>
                          <img src={InfoIcon} alt="InfoIcon" style={{ height: '22px', width: '22px', cursor: 'pointer' }} />
                        </BlackToolTip>
                  }

                </InputAdornment>
              ),
            }}
            id={id}
            {...inputProps}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            multiline={multiline}
            rows={rows}
            autoComplete='off'
            helperText={helperText ? helperText : ''}
          />
          :
          <TextField
            label={
              <Box display='flex' flexDirection='row' >
                {labelText}
                {
                  icon &&
                  <BlackToolTip arrow placement='right' title={
                    <Text mediumWhite sx={{ padding: '5px !important' }}>{tooltipTitle ? tooltipTitle : ''}</Text>
                  }>
                    <img src={InfoIcon} alt="InfoIcon" style={{ height: '13px', width: '13px', margin: '3px 0px 0px 0px', cursor: 'pointer' }} />
                  </BlackToolTip>
                }
              </Box>}
            required={required}
            placeholder={placeholder}
            variant="filled"
            margin="dense"
            InputLabelProps={{
              underline: underlineClasses,
            }}
            InputProps={{
              classes: { input: fieldClasses }, disableUnderline: true,
              endAdornment: (
                icon ?
                  <InputAdornment position="end">
                    <BlackToolTip arrow placement='right' title={
                      <Text mediumWhite sx={{ padding: '5px !important' }}>{tooltipTitle ? tooltipTitle : ''}</Text>
                    }>
                      <img src={eyeIcon ? Eye : InfoIcon} alt="InfoIcon" style={{ height: '13px', width: '13px', margin: '3px 0px 0px 0px', cursor: 'pointer' }} onClick={eyeIcon ? eyeHandleChange : ''} />
                    </BlackToolTip>
                  </InputAdornment> : ''
              ),
            }}
            id={id}
            {...inputProps}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            multiline={multiline}
            rows={rows}
            autoComplete='off'
            helperText={helperText ? helperText : ''}
          />
      }

      {error || isError ? (
        <React.Fragment>
          {/* <Clear className={classes.feedback + ' ' + classes.labelRootError} /> */}
          <Text red > {emptyMesaage} </Text>
        </React.Fragment>
      ) : success ? (
        <Check className={classes.feedback + ' ' + classes.labelRootSuccess} />
      ) : null}
    </FormControl>
  )
}

Input.propTypes = {
  labelText: PropTypes.node,
  required: PropTypes.node,
  labelProps: PropTypes.object,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object.isRequired,
  error: PropTypes.bool,
  success: PropTypes.bool,
  formInput: PropTypes.bool,
  formInputLight: PropTypes.bool,
  createInvoice: PropTypes.bool,
  forgotForm: PropTypes.bool,
  tabInput: PropTypes.bool,
  errorMsg: PropTypes.string,
  isMandatory: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  mobile: PropTypes.string,
  password: PropTypes.string,
  email: PropTypes.string,
  emailphone: PropTypes.string,
  handleChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  isNumber: PropTypes.bool,
  outlined: PropTypes.bool,
  className: PropTypes.string,
  fontSize: PropTypes.bool,
  boxsize: PropTypes.bool,
  formInputWhite: PropTypes.bool,
  formInputWhiteTextArea: PropTypes.bool,
  borderInput: PropTypes.bool,
  formInputText: PropTypes.bool,
  commentHeight: PropTypes.bool,
  smallInput: PropTypes.bool,
  onKeyDown: PropTypes.func,
  selectDate: PropTypes.bool,
  largeFormInput: PropTypes.bool,
  employeeFormInput: PropTypes.bool,
  clientInput: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.any,
  textAreaHeight: PropTypes.bool,
  descriptionFormControl: PropTypes.bool,
  descriptionInput: PropTypes.bool,
  InputSm: PropTypes.bool,
  helperText: PropTypes.any,
  popUpInput: PropTypes.bool,
  icon: PropTypes.any,
  tooltipTitle: PropTypes.any,
  smallWhiteInput: PropTypes.bool,
  smallClientInput: PropTypes.bool,
  tooltipField: PropTypes.bool,
  iconText: PropTypes.bool,
  eyeIcon: PropTypes.bool,
  eyeHandleChange: PropTypes.func,
  clientInput1: PropTypes.bool,
  disabled: PropTypes.bool,
  eyeCloseIcon: PropTypes.bool,
  smallWhiteBg: PropTypes.bool,
  name: PropTypes.any,
  value: PropTypes.any,
  borderOrange:PropTypes.bool,
}

