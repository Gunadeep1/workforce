import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { MyContext } from "../../Context";
import Grid from "@mui/material/Grid";
import { Hidden, InputBase, Link, Paper } from "@mui/material";
import { LoginStyles } from "./LoginStyles";
import Image from "../../assets/svg/Groupblack.png";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/input/Input";
import Text from "../../components/customText/Text";
import { isValid, validate_emptyField } from "../../components/Validation";
import { addErrorMsg, addSuccessMsg } from "../../utils/utils";
import { domain } from "../../config/Domain";
import { LoadingButton } from "@mui/lab";
import eye from '../../assets/svg/eye.svg';
import inVisible from '../../assets/svg/NotVisible.svg';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { DefaultRolePermissions } from "../DefaultRoles"
import LocalStorage from "../../utils/LocalStorage";
import LoginApi from "../../apis/LoginApi";

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


function Login() {
  const classes = LoginStyles();

  const navigate = useNavigate();

  const { setGlobaldata } = useContext(MyContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = React.useState(false);
  const [isVisible, setVisible] = useState(false); //For password hide and show 

  const changeHandler = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.name]: e.target.value,
      },
      handleValidate(e)
    );
  };

  useEffect(() => {

      if(LocalStorage.getAccessToken()) {navigate('/dashboard')}else navigate('/login')
    // eslint-disable-next-line
  }, [])

  const handleValidate = (e) => {
    let input = e.target;
    switch (input.name || input.tagName) {
      case "email":
        error.email = validate_emptyField(input.value);
        break;
      case "password":
        error.password = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    let err = { ...error };
    setError(err);
  };

  const formValidations = () => {
    let { email, password } = formData;
    let errors = {};
    errors.email = validate_emptyField(email);
    errors.password = validate_emptyField(password);
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = {
      request_id: LocalStorage.uid(),
      email_id: formData.email,
      password: formData.password,
      subdomain_name: domain,
    };
    let errors = formValidations();
    if (isValid(errors)) {
      setLoading(true);
      LoginApi.Login(userData).then((response) => {
        if (response.data.statusCode == 1003) {
          // if (response.data.data.change_password) {
          //   navigate('/changepassword', { state: { data: response.data.data } });
          // }
          // else {
            setLoading(false);
            LocalStorage.setRolesData(DefaultRolePermissions);
            LocalStorage.setUserData(response.data.data);
            setGlobaldata((prev) => ({ ...prev, logo_url: response.data.data.logo_url, date_format: response.data.data.date_format }));
            // LocalStorage.setSettings(true);
            LocalStorage.setDateFormat(response.data.data.date_format);
            LocalStorage.setCurrencySymbol(response.data.data.currency_symbol);
            addSuccessMsg(`${response.data.data.full_name} successfully logged in`);
            navigate('/dashboard');
            window.location.reload();
          // }
        } else {
          setLoading(false);
          addErrorMsg(response.data.message);
        }
      });
    } else {
      let err = { error };
      err = errors;
      setError(err);
    }
  };
  //forgot fun to navigate forgot-password
  const forgotPassword = () => {
    navigate("/forgot-password");
  };

  const passwordVisible = () => {
    setVisible(!isVisible);
  };



  // console.log(LocalStorage.getUserData().access_token);
  return (
    <div>
      <Grid container alignItems='center'>
        <Grid item lg={8} md={8} sm={12} xs={12} p={2}>
          <Box className={classes.boxOne}>
            <form onSubmit={handleSubmit}>
              <Box className={classes.boxTwo}>
                <Breadcrumbs aria-label="breadcrumb">
                  <StyledBreadcrumb
                    component="a"
                    // href="landing-pagoe"
                    href="home"
                    label="Home"
                    icon={<HomeIcon fontSize="small" />}
                  />
                </Breadcrumbs>
                <Text variant="h5" className={classes.header}>
                  Login
                </Text>
                <Grid container pt={1}>
                  <Grid item sm={12} xs={12}>
                    <Text label>Email ID</Text>
                    <CustomInput
                      forgotForm
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "email",
                        value: formData.email,
                      }}
                      handleChange={changeHandler}
                    />
                    {error.email ? <Text red>{error.email}</Text> : ""}
                  </Grid>                  
                  <Grid item lg={12} sm={12} xs={12} mt={'8px'}>
                    <Text label>Password</Text>
                    <Paper className={classes.Paper} display={'flex'}>
                      <InputBase
                        className={classes.InputBase}
                        fullWidth
                        type={!isVisible ? "password" : "text"}
                        name="password"
                        onChange={changeHandler}
                        value={formData.password}
                      />
                      <Box className={classes.IconButton}>
                        <span onClick={passwordVisible}>
                          {isVisible ? <img src={eye} alt='Visibility' className={classes.visibilityIcon} /> : <img src={inVisible} alt='Visibility' className={classes.notVisibleIcon} />}
                        </span>
                      </Box>
                    </Paper>
                    {
                      error.password ?
                        <Text red>{error.password ? error.password : ''}</Text> : ''
                    }
                  </Grid>

                  <Grid item sm={12} xs={12} textAlign={"right"} pt={1}>
                    <Link
                      component="button"
                      variant="body2"
                      type="button"
                      onClick={() => forgotPassword()}
                      className={classes.forgotPassword}
                    >
                      Forgot Password?
                    </Link>
                  </Grid>
                </Grid>
                <Grid item className={classes.buttonStyles}>
                  {/* <Button save onClick={handleSubmit} variant='contained' type="submit"> Login </Button> */}
                  <LoadingButton
                    className={classes.loginButton}
                    loading={loading}
                    onClick={handleSubmit}
                    variant="contained"
                    type="submit"
                  // loadingIndicator={
                  //   <CircularProgress color="white" size={16} />
                  // }
                  >
                    Login
                  </LoadingButton>
                </Grid>
              </Box>
            </form>
          </Box>
        </Grid>
        <Hidden mdDown>
          <Grid item lg={4} md={4} sm={12} xs={12} className={classes.rightBox}>
            <img src={Image} alt="icon" className={classes.image} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default Login;


