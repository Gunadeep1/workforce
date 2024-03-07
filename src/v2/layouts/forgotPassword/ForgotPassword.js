import { Box, Grid, Hidden } from "@mui/material";
import React from "react";
import { useState } from "react";
import { ForgotPasswordStyles } from "./ForgotPasswordStyles";
import Text from "../../components/customText/Text";
import CustomInput from '../../components/input/Input';
import Button from "../../components/customButton/Button";
import { isValid, validates_emailId } from "../../components/Validation";
import ReusablePopup from "../../components/reuablePopup/ReusablePopup";
import Group1916 from "../../assets/Group1916.svg";
import { domain } from "../../config/Domain";
import LocalStorage from "../../utils/LocalStorage";
import CommonApi from "../../apis/CommonApi";
import { addSuccessMsg, addWarningMsg } from "../../utils/utils";
import OTP from "../otp/OTP";

/*fun starts here*/
function ForgotPassword() {
  const classes = ForgotPasswordStyles();
  const [state, setState] = useState({
    emailId: "",
  });
  const [error, setError] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  /*handle change fun*/
  const changeHandler = (e) => {
    setState(
      {
        ...state,
        [e.target.name]: e.target.value,
      },
      handlevalidate(e)
    );
  };

  const handlevalidate = (e) => {
    let input = e.target;
    let err = { ...error };
    switch (input.name || input.tagName) {
      case "emailId":
        error.emailId = validates_emailId(input.value);
        break;
      default:
        break;
    }
    setError(err);
  };

  /*email validation */
  const emailValidations = () => {
    let { emailId } = state;
    let errors = {};
    errors.emailId = validates_emailId(emailId);
    return errors;
  };

  /*submit fun*/
  const handleSubmit = (e) => {
    const data = {
      request_id: LocalStorage.uid(),
      email_id: state.emailId,
      subdomain_name: domain,
    };
    let errors = emailValidations();
    if (isValid(errors)) {
      CommonApi.ForgotPassword(data)
        .then((response) => {
          if (response.data.statusCode == 1003) {
            setOpenPopup(true);
            addSuccessMsg("OTP Send To Your Mail"); //success msg Alert
          } else {
            addWarningMsg(response.data.message); // warning msg Alert
          }
        })
    } else {
      let err = { error };
      err = errors;
      setError(err);
    }
  };

  return (
    <div>
      <Box height={"100vh"}>
        <Grid container>
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
            <Box className={classes.fullHeight}>
              <Box className={classes.leftBox}>
                <form onSubmit={handleSubmit}>
                  <Text className={classes.header} variant="h5">
                    Forgot Password
                  </Text>
                  <Grid item sm={12} xs={12} p={2} pt={3}>
                    <Text largeLabel mb={1}>Email Address</Text>
                    <CustomInput
                      outlined
                      forgotForm
                      className={classes.input}
                      placeholder="Enter your registered email id"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "emailId",
                        value: state.emailId,
                      }}
                      handleChange={changeHandler}
                    />
                    {error.emailId ? <Text red>{error.emailId}</Text> : ""}
                  </Grid>
                  <Grid item sm={12} xs={12} pl={2}>
                    <Button
                      blueButton
                      sx={{marginLeft:'-10px !important'}}
                      onClick={handleSubmit}                     
                    >
                      Send
                    </Button>
                  </Grid>
                </form>
              </Box>
            </Box>
          </Grid>

          <Hidden mdDown>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}
              className={classes.rightBox}
            >
              <Box
                component="img"
                alt="Group1916"
                src={Group1916}
                className={classes.image}
              />
            </Grid>
          </Hidden>
        </Grid>
      </Box>
      <ReusablePopup
        title="Enter OTP"
        dialogTitleSmaller
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <OTP email={state.emailId} />
      </ReusablePopup>
    </div>
  );
}

export default ForgotPassword;

