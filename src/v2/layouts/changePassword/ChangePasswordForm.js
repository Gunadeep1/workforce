import { Box, Grid, InputBase, Paper, Stack } from '@mui/material'
import React, { useState } from 'react'
import commonApi from '../../apis/CommonApi'
import Button from '../../components/customButton/Button'
import Text from '../../components/customText/Text'
import { isValid, validates_password, validate_emptyField } from '../../components/Validation'
import LocalStorage from '../../utils/LocalStorage'
import ChangePasswordStyles from './ChangePasswordStyles'
import { useNavigate } from 'react-router-dom';
import { addErrorMsg, addSuccessMsg } from '../../utils/utils'
import eye from '../../assets/svg/eye.svg';
import inVisible from '../../assets/svg/NotVisible.svg';

function ChangePasswordForm() {

  const classes = ChangePasswordStyles();

  const navigate = useNavigate()

  const [state, setState] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',

  });

  const [error, setError] = useState({});
  const [visibleCP, setVisibleCP] = useState(false);
  const [visibleP, setVisibleP] = useState(false);
  const [visible, setVisible] = useState(false);

  const changeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    }, handleValidate(e));
  };

  const handleValidate = (e) => {
    let input = e.target
    let err = { ...error }
    switch (input.name || input.tagName) {
      case 'currentPassword':
        err['currentPassword'] = validate_emptyField(input.value);
        break
      case 'password':
        err['password'] = validates_password(input.value);
        break;
      case 'confirmPassword':
        if (input.value == '') {
          err['confirmPassword'] = 'This field is required';
        }
        else if (state.password != input.value) {
          err['confirmPassword'] = "Password is not matching";
        } else {
          err['confirmPassword'] = '';
        }
        break;
      default:
        break
    }
    setError({ ...err })
  }

  /* fun is for final submission validation when saving the form data*/
  const formValidations = () => {
    let { currentPassword, password, confirmPassword } = state;
    let errors = {};
    errors.currentPassword = validate_emptyField(currentPassword);
    errors.password = validates_password(password);
    errors.confirmPassword = validate_emptyField(confirmPassword);
    return errors;
  };

  /*submit fun*/
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      request_id: LocalStorage.uid(),
      old_password: state.currentPassword,
      password: state.password,
      confirm_password: state.confirmPassword,
    }
    let errors = formValidations();
    if (isValid(errors)) {
      commonApi.ChangePassword(data, LocalStorage.getAccessToken())
        .then(response => {
          if (response.data.statusCode == 1003) {
            navigate('/dashboard');
            addSuccessMsg("Changes Your Password Successfully");
          }
          else {
            addErrorMsg("Password is In-Correct");
          }
        })
        .catch((e) => {
          console.log(e);
        })
    }
    else {
      let err = { error };
      err = errors;
      setError(err);
    }

  };

  const handleCancel = () => {
    setState({
      ...state,
      currentPassword: '',
      password: '',
      confirmPassword: '',
    });
    setError({});
    navigate('/dashboard');
  }


  return (
    <div>
      <Box >
        <form onSubmit={submitHandler}>
          <Text variant="h7" className={classes.thinnerText}>Change Password</Text><br></br>
          <Text variant="caption" className={classes.lighterText}>Create a new password that is at least 8 Charters long.</Text>
          <Grid container spacing={1} pt={4}>
            <Grid item xs={12} md={7} sm={7}>
              <Text label>Type Your Current Password</Text>
              <Paper className={classes.Paper} display={'flex'}>
                <InputBase
                  className={classes.InputBase}
                  fullWidth
                  type={!visibleCP ? "password" : "text"}
                  name="currentPassword"
                  onChange={(e) => changeHandler(e)}
                  value={state.currentPassword}
                />
                <Box className={classes.IconButton}>
                  <span onClick={() => { setVisibleCP(!visibleCP) }}>
                    {visibleCP ? <img src={eye} alt='Visibility' className={classes.visibilityIcon} /> : <img src={inVisible} alt='Visibility' className={classes.notVisibleIcon} />}
                  </span>
                </Box>
              </Paper>
              {error.currentPassword ? (
                <Text red>{error.currentPassword}</Text>
              ) : (
                ""
              )}
            </Grid>

            <Grid item xs={12} md={7} sm={7} >
              <Box>
                <Text label>Type Your New Password</Text>
                <Paper className={classes.Paper} display={'flex'}>
                  <InputBase
                    className={classes.InputBase}
                    fullWidth
                    type={!visibleP ? "password" : "text"}
                    name="password"
                    onChange={(e) => changeHandler(e)}
                    value={state.password}
                  />
                  <Box className={classes.IconButton}>
                    <span onClick={() => { setVisibleP(!visibleP) }}>
                      {visibleP ? <img src={eye} alt='Visibility' className={classes.visibilityIcon} /> : <img src={inVisible} alt='Visibility' className={classes.notVisibleIcon} />}
                    </span>
                  </Box>
                </Paper>
                {error.password ? (
                  <Text red>{error.password}</Text>
                ) : (
                  ""
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={7} sm={7} >
              <Box>
                <Text label>Retype Your New Password</Text>
                <Paper className={classes.Paper} display={'flex'}>
                  <InputBase
                    className={classes.InputBase}
                    fullWidth
                    type={!visible ? "password" : "text"}
                    name="confirmPassword"
                    onChange={(e) => changeHandler(e)}
                    value={state.confirmPassword}
                  />
                  <Box className={classes.IconButton}>
                    <span onClick={() => { setVisible(!visible) }}>
                      {visible ? <img src={eye} alt='Visibility' className={classes.visibilityIcon} /> : <img src={inVisible} alt='Visibility' className={classes.notVisibleIcon} />}
                    </span>
                  </Box>
                </Paper>
                {error.confirmPassword ? (
                  <Text red>{error.confirmPassword}</Text>
                ) : (
                  ""
                )}
              </Box>
            </Grid>

            <Grid item p={3} lg={12} md={12} xs={12} sm={12}>
              <Stack direction="row" justifyContent="center" spacing={3} pt={9}>
                <Button save variant='contained' type="submit" >
                  Save
                </Button>
                <Button cancel variant='contained' onClick={handleCancel} >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div >
  )
}

export default ChangePasswordForm
