import { Box, Grid, Hidden, } from '@mui/material';
import Image from '../../assets/svg/Startup life-pana.svg';
import React, { useState } from 'react';
// import CustomInput from '../../components/common/customInput/CustomInput';
// import Text from '../../components/common/customText/CustomText';
import Input from '../../components/input/Input';
import Text from '../../components/customText/Text';
import { isValid, validates_emailId, validate_charWithSpace, validate_usContact, validate_Char } from '../../components/Validation';
import LocalStorage from '../../utils/LocalStorage';
import SignUpStyles from './SignUpStyles';
import common_Api from '../../apis/CommonApi';
import { addErrorMsg, addSuccessMsg } from '../../utils/utils';
import Popups from '../../components/customPopup/CustomPopups';
// components/common/customPopup/CustomPopups
import Otp from '../otp/OTPOld';
import { LoadingButton } from '@mui/lab';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode == 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor: "#F9A828",
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: "#054CA6",
      color: "#FFFFFF",
      cursor: "pointer"
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591


function SignUp() {

  const classes = SignUpStyles();

  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});
  const [state, setState] = useState({
    request_id: LocalStorage.uid(),
    first_name: '',
    middle_name: '',
    last_name: '',
    organization_name: '',
    email_id: '',
    contact_number: '',
  });

  const changeHandler = (e) => {
    if (e.target.name == "contact_number") {
      convertFormat(e)
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      },
        handleValidate(e));
    }

  };

  const handleValidate = (e) => {
    let input = e.target
    let err = { ...error }
    switch (input.name || input.tagName) {
      case 'first_name':
        error.first_name = validate_charWithSpace(input.value)
        break
      case 'last_name':
        error.last_name = validate_charWithSpace(input.value)
        break
      case 'email_id':
        error.email_id = validates_emailId(input.value)
        break
      case 'organization_name':
        error.organization_name = validate_Char(input.value)
        break
      case 'contact_number':
        error.contact_number = validate_usContact(input.value)
        break
      default:
        break
    }
    setError(err)
  }

  const formValidations = () => {
    let { email_id, first_name, last_name, organization_name, contact_number } = state;
    let errors = {};
    errors.first_name = validate_charWithSpace(first_name);
    errors.last_name = validate_charWithSpace(last_name);
    errors.organization_name = validate_Char(organization_name);
    errors.email_id = validates_emailId(email_id);
    errors.contact_number = validate_usContact(contact_number);
    return errors;
  };

  /*submit fun*/
  const submitHandler = (e) => {
    e.preventDefault();
    let errors = formValidations();
    if (isValid(errors)) {
      setLoader(true);
      const data = state
      common_Api.storeSignUp(data).then((response) => {
        if (response.data.statusCode == 1003) {
          setLoader(false);
          addSuccessMsg(`OTP sent to your mail successfully`);
          setOpen(true);
        } else {
          setLoader(false)
          addErrorMsg(response.data.message);
        }
      })
    } else {
      let err = { error };
      err = errors;
      setError(err);
    }

  };

  /*onChange fun for input values*/
  const convertFormat = (e) => {
    const value = e.target.value;
    const input = value.replace(/\D/g, '').substring(0, 10);

    // Divide numbers in 3 parts :"(123) 456-7890" 
    const first = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) {
      setState(
        {
          ...state,
          [e.target.name]: `${first}-${middle}-${last}`
        }, handleValidate(e));
    }
    else if (input.length > 3) {
      setState(
        {
          ...state,
          [e.target.name]: `${first}-${middle}`
        }, handleValidate(e));
    }
    else if (input.length >= 0) {
      setState(
        {
          ...state,
          [e.target.name]: input
        }, handleValidate(e));
    }
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={8} md={8} sm={12} xs={12} p={2}>
          <Box className={classes.boxOne}>
            <Box className={classes.boxTwo}>
              <form onSubmit={submitHandler}>
                <Box px={2} sx={{ width: "100%", display: "flex", justifyContent: 'space-between' }}>
                  <Text largeBlack>Sign up</Text>
                  <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb
                      component="a"
                      href="home"
                      label="Home"
                      icon={<HomeIcon fontSize="small" />}
                    />
                  </Breadcrumbs>
                </Box>
                {/* <Text variant="h5" className={classes.header}>Sign up</Text> */}

                <Grid container spacing={0}>

                  <Grid item sm={12} xs={12} >

                    <Box p={1}>
                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'first_name',
                          value: state.first_name,
                          type: 'text'
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>First Name</Text>}
                      />
                      <Text errorText> {error.first_name ? error.first_name : ""}</Text>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6} >
                    <Box p={1}>
                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'middle_name',
                          value: state.middle_name,
                          type: 'text'
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>Middle Name <span className={classes.optional}>(Optional)</span></Text>}
                      />
                      <Text errorText> {error.middle_name ? error.middle_name : ""}</Text>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box p={1}>
                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'last_name',
                          value: state.last_name,
                          type: 'text'
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>Last Name</Text>}
                      />
                      <Text errorText> {error.last_name ? error.last_name : ""}</Text>
                    </Box>
                  </Grid>

                  <Grid item sm={12} xs={12}>
                    <Box p={1}>
                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'organization_name',
                          value: state.organization_name,
                          type: 'text'
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>Company Name</Text>}
                      />
                      <Text errorText> {error.organization_name ? error.organization_name : ""}</Text>
                    </Box>
                  </Grid>

                  <Grid item sm={12} xs={12} >
                    <Box p={1}>
                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'email_id',
                          value: state.email_id,
                          type: 'text'
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>Email ID</Text>}
                      />
                      <Text errorText> {error.email_id ? error.email_id : ""}</Text>
                    </Box>
                  </Grid>

                  <Grid item sm={12} xs={12} >
                    <Box p={1}>
                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'contact_number',
                          value: state.contact_number,
                          type: 'text'
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>Contact Number</Text>}
                      />
                      <Text errorText> {error.contact_number ? error.contact_number : ""}</Text>
                    </Box>

                  </Grid>



                </Grid>

                <Box className={classes.buttonStyles}>
                  <LoadingButton
                    className={classes.loginButton}
                    loading={loader}
                    variant="contained"
                    type="submit"
                  >
                    Create Account
                  </LoadingButton>
                </Box>

                {/* <Grid item className={classes.buttonStyles}> */}
                {/* <LoadingButton
                  className={classes.loginButton}
                  loading={loader}
                  variant="contained"
                  type="submit"
                >
                  Create Account
                </LoadingButton> */}
                {/* <Button save variant='contained' type="submit" >
                    Create Account
                  </Button> */}
                {/* </Grid> */}
              </form>
            </Box>
          </Box>
        </Grid>
        <Hidden mdDown>
          <Grid item lg={4} md={4} sm={12} xs={12}
            className={classes.rightBox} >
            <img src={Image} alt='icon' className={classes.image} />
          </Grid>
        </Hidden>

      </Grid>
      <Popups
        title="Enter OTP"
        dialogTitleSmaller
        openPopup={open}
        setOpenPopup={setOpen}
      >
        <Otp email={state.email_id} signUp={"signup"} />
      </Popups>
    </div>
  )
}

export default SignUp
