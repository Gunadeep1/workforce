import React, { useState } from 'react'
import LoginBackground from '../../assets/svg/LoginBackground.svg'
import { Box, FormControl, Grid, Hidden, InputAdornment, List, ListItem, ListItemIcon, Stack, TextField, Typography } from '@mui/material'
import LoginLogo from '../../assets/svg/LoginLogo.svg'
import Text from '../../components/customText/Text'
import ResetPasswordStyles from './ResetPasswordStyles'
import { ReactComponent as VisibileOn } from '../../assets/svg/eye.svg';
import { ReactComponent as VisibleOff } from '../../assets/svg/NotVisible.svg';
import Button from '../../components/customButton/Button'
import { FiberManualRecord } from '@mui/icons-material'
import LocalStorage from '../../utils/LocalStorage'
import  CommonApi from '../../apis/CommonApi'
import { addErrorMsg, addSuccessMsg } from '../../utils/utils'
import { useNavigate, useLocation } from "react-router-dom";
import { validate_emptyField, isValid, validates_password } from '../../components/Validation'
import { domain } from '../../config/Domain'
import CheckMark from '../../assets/svg/CheckMark.svg'

const upperCaseRegExp = /.*[A-Z].*/;
const lowerCaseRegExp = /.*[a-z].*/
const numberRegExp = /.*[0-9].*/

const ResetPassword = () => {
    const location = useLocation();
    const email = location.state && location.state.emailId

    console.log(email)

    const navigate = useNavigate();

    const classes = ResetPasswordStyles();
    const [state, setState] = useState(false)
    const [passwordReq, setPasswordReq] = useState({
        length: false,
        upperCase: false,
        lowerCase: false,
        number: false
    })

    const [error, setError] = useState({})
    const [isVisible, setVisible] = useState(false);
    const [isVisible2, setVisible2] = useState(false);
    const [passwordData, setPasswordData] = useState({
        request_id: LocalStorage.uid(),
        email_id: email,
        password: "",
        confirm_password: "",
        subdomain_name: domain
    })

    const passwordVisible = () => {
        setVisible(!isVisible);
    };

    const passwordVisible2 = () => {
        setVisible2(!isVisible2);
    };

    const handlePassword = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
        setState(true)
        handlePasswordValidations(e);
    }

    const handlePasswordValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name) {
            case "password":
                err.password = validate_emptyField(input.value);
                if (input.value != '') {
                    let vals = passwordReq
                    input.value.length >= 8 ? passwordReq.length = true : passwordReq.length = false;
                    upperCaseRegExp.test(input.value) ? passwordReq.upperCase = true : passwordReq.upperCase = false;
                    lowerCaseRegExp.test(input.value) ? passwordReq.lowerCase = true : passwordReq.lowerCase = false
                    numberRegExp.test(input.value) ? passwordReq.number = true : passwordReq.number = false
                    setPasswordReq({ ...vals })
                }
                else {
                    setPasswordReq({
                        length: false,
                        upperCase: false,
                        lowerCase: false,
                        number: false
                    })
                }
                break;
            case 'confirm_password':
                if (input.value == '') {
                    err.confirm_password = validate_emptyField(input.value);
                }
                else if (passwordData.password != input.value) {
                    err.confirm_password = "Passwords do not match";
                } else {
                    err.confirm_password = '';
                }
                break;
            default:
                break
        }
        setError({ ...err })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let errors = validateAll();
        if (isValid(errors)) {
            resetPassword(e);
            setState(false)
        } else {
            console.log(errors);
            addErrorMsg("Please set the password as per the password requirements");
        }
    }

    const validateAll = () => {
        let { password, confirm_password } = passwordData;
        let errors = {};
        errors.password = validates_password(password);
        errors.confirm_password = validates_password(confirm_password);
        return errors;
    }

    const resetPassword = (e) => {
        e.preventDefault()
        CommonApi.resetPassword(passwordData).then((response) => {
            if (response.data.statusCode == 1003) {
                addSuccessMsg(response.data.message);
                navigate("/login")
            } else {
                addErrorMsg(response.data.message);
                console.log(response.data.message);
            }
        })
    }


    return (
        <Grid container>
            <Hidden mdDown>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <img src={LoginBackground} alt="icon" style={{ width: '100%', height: '100%' }} />
                </Grid>
            </Hidden>
            <Grid item lg={6} md={6} xs={12} sm={12}>
                <Box className={classes.fullHeight}>
                    <Box className={classes.leftBox}>
                        <form style={{ width: '400px' }}>
                            <Stack alignItems='center' gap={6}>
                                <Stack alignItems='center' gap={4}>
                                    <img src={LoginLogo} alt='login' />
                                    <Text loginHeader>Reset Password</Text>
                                </Stack>
                                <Grid container pt={1}>
                                    <Grid item sm={12} xs={12}>
                                        <FormControl fullWidth variant="filled" className={classes.endAdornmentControl}>
                                            <TextField
                                                name="password"
                                                value={passwordData.password}
                                                className={classes.endAdornmentInput}
                                                label={'Enter Password'}
                                                onChange={handlePassword}
                                                type={isVisible ? 'text' : 'password'}
                                                variant="filled"
                                                InputProps={{
                                                    disableUnderline: true,
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <Box onClick={passwordVisible} sx={{ cursor: 'pointer' }}>
                                                                {isVisible ? <VisibileOn /> : <VisibleOff />}
                                                            </Box>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                        {error.password ? <Text errorText>{error.password}</Text> : ""}
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} mt={'20px'}>
                                        <FormControl fullWidth variant="filled" className={classes.endAdornmentControl}>
                                            <TextField
                                                name="confirm_password"
                                                value={passwordData.confirm_password}
                                                className={classes.endAdornmentInput}
                                                label={'Reenter Password'}
                                                onChange={handlePassword}
                                                type={isVisible2 ? 'text' : 'password'}
                                                variant="filled"
                                                InputProps={{
                                                    disableUnderline: true,
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <Box onClick={passwordVisible2} sx={{ cursor: 'pointer' }}>
                                                                {isVisible2 ? <VisibleOff /> : <VisibileOn />}
                                                            </Box>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                        {
                                            error.confirm_password ?
                                                <Text errorText>{error.confirm_password}</Text> : ''
                                        }
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} mt={'20px'}>
                                        {
                                            state ?
                                                <Box>
                                                    <Text passwordReqHeader>Password Requirements :</Text>
                                                    <List sx={{ listStyleType: 'disc' }}  >

                                                        <ListItem sx={{ px: "3px", py: "1px" }}>
                                                            <ListItemIcon sx={{ minWidth: "20px" }}>
                                                                <FiberManualRecord sx={{ color: '#4A4A4A', width: "8px", right: "0px" }} />
                                                            </ListItemIcon>
                                                            {
                                                                passwordReq.length ?
                                                                    <Stack direction='row' spacing={1}>
                                                                        <Typography className={classes.passwordReq} sx={{ color: "#404040 !important" }}>8 or more characters</Typography>
                                                                        <img src={CheckMark} alt='checkMark' />
                                                                    </Stack>
                                                                    :
                                                                    <Typography className={classes.passwordReq} sx={{ color: "red !important" }}>8 or more characters</Typography>
                                                            }
                                                        </ListItem>
                                                        <ListItem sx={{ px: "3px", py: "2px" }}>
                                                            <ListItemIcon sx={{ minWidth: "20px" }}>
                                                                <FiberManualRecord sx={{ color: '#4A4A4A', width: "8px", right: "0px" }} />
                                                            </ListItemIcon>
                                                            {
                                                                passwordReq.upperCase ?
                                                                    <Stack direction='row' spacing={1}>
                                                                        <Typography className={classes.passwordReq} sx={{ color: "#404040 !important" }}>At least one upper case</Typography>
                                                                        <img src={CheckMark} alt='checkMark' />
                                                                    </Stack>
                                                                    :
                                                                    <Typography className={classes.passwordReq} sx={{ color: "red !important" }}>At least one upper case</Typography>
                                                            }
                                                        </ListItem>
                                                        <ListItem sx={{ px: "3px", py: "1px" }}>
                                                            <ListItemIcon sx={{ minWidth: "20px" }}>
                                                                <FiberManualRecord sx={{ color: '#4A4A4A', width: "8px", right: "0px" }} />
                                                            </ListItemIcon>
                                                            {
                                                                passwordReq.lowerCase ?
                                                                    <Stack direction='row' spacing={1}>
                                                                        <Typography className={classes.passwordReq} sx={{ color: "#404040 !important" }}>At least one lower case</Typography>
                                                                        <img src={CheckMark} alt='checkMark' />
                                                                    </Stack>
                                                                    :
                                                                    <Typography className={classes.passwordReq} sx={{ color: "red !important" }}>At least one lower case</Typography>
                                                            }
                                                        </ListItem>
                                                        <ListItem sx={{ px: "3px", py: "1px" }}>
                                                            <ListItemIcon sx={{ minWidth: "20px" }}>
                                                                <FiberManualRecord sx={{ color: '#4A4A4A', width: "8px", right: "0px" }} />
                                                            </ListItemIcon>

                                                            {
                                                                passwordReq.number ?
                                                                    <Stack direction='row' spacing={1}>
                                                                        <Typography className={classes.passwordReq} sx={{ color: "#404040 !important" }}>At least one number</Typography>
                                                                        <img src={CheckMark} alt='checkMark' />
                                                                    </Stack>
                                                                    :
                                                                    <Typography className={classes.passwordReq} sx={{ color: "red !important" }}>At least one number</Typography>
                                                            }
                                                        </ListItem>
                                                    </List>
                                                </Box> : ''
                                        }
                                    </Grid>
                                    <Grid item container justifyContent='center' lg={12} md={12} sm={12} xs={12} paddingTop='24px'>
                                        <Button
                                            loginButton
                                            //loading={loading}
                                            onClick={handleSubmit}
                                            variant="contained"
                                            type="submit"
                                        >
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </form>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default ResetPassword