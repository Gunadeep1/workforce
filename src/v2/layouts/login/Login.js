import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { MyContext } from "../../Context";
import Grid from "@mui/material/Grid";
import { Hidden, InputAdornment, Link, Stack } from "@mui/material";
import { LoginStyles } from "./LoginStyles";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Text from "../../components/customText/Text";
import { isValid, validate_emptyField } from "../../components/Validation";
import { addSuccessMsg } from "../../utils/utils";
import { domain } from "../../config/Domain";
import { ReactComponent as VisibileOn } from '../../assets/svg/eye.svg';
import { ReactComponent as VisibleOff } from '../../assets/svg/NotVisible.svg';
import { DefaultRolePermissions } from "../DefaultRoles"
import LocalStorage from "../../utils/LocalStorage";
import LoginApi from "../../apis/LoginApi";
import LoginLogo from '../../assets/svg/LoginLogo.svg'
import Input from "../../components/input/Input";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import LoginBackground from '../../assets/svg/LoginBackground.svg'
import Button from "../../components/customButton/Button";
import CrossMark from '../../assets/svg/CrossMark.svg'


function Login() {
    const classes = LoginStyles();

    const navigate = useNavigate();

    const { setGlobaldata } = useContext(MyContext);
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState({});
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

        if (LocalStorage.getAccessToken()) { navigate('/dashboard') } else navigate('/login')
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
            LoginApi.Login(userData).then((response) => {
                if (response.data.statusCode == 1003) {
                    // if (response.data.data.change_password) {
                    //   navigate('/changepassword', { state: { data: response.data.data } });
                    // }
                    // else {
                    LocalStorage.setRolesData(DefaultRolePermissions);
                    LocalStorage.setUserData(response.data.data);
                    setGlobaldata((prev) => ({ ...prev, logo_url: response.data.data.logo_url, date_format: response.data.data.date_format }));
                    // LocalStorage.setSettings(true);
                    LocalStorage.setDateFormat(response.data.data.date_format);
                    LocalStorage.setCurrencySymbol(response.data.data.currency_symbol);
                    addSuccessMsg(`${response.data.data.full_name} successfully logged in`);
                    navigate('/dashboard');
                    setInvalidPassword(false)
                    window.location.reload();
                    // }
                } else {
                    setInvalidPassword(true)
                    // addErrorMsg(response.data.message);
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


    return (
        <div>
            <Grid container >
                <Hidden mdDown>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                        <img src={LoginBackground} alt="icon" style={{ height: '100%', width: '100%' }} />
                    </Grid>
                </Hidden>
                <Grid item lg={6} md={6} sm={12} xs={12} p={2}>
                    <Box className={classes.boxOne}>
                        <form onSubmit={handleSubmit}>
                            <Box className={classes.boxTwo}>
                                <Stack alignItems='center' gap={6}>
                                    <Stack alignItems='center' gap={4}>
                                        <img src={LoginLogo} alt='login' />
                                        <Text loginHeader>Welcome To BrownMonster</Text>
                                    </Stack>
                                    <Grid container pt={1}>
                                        <Grid item sm={12} xs={12}>
                                            <Input
                                                clientInput
                                                formControlProps={{
                                                    fullWidth: true,
                                                }}
                                                inputProps={{
                                                    name: 'email',
                                                    type: 'text',
                                                    disabled: false,
                                                    value: formData.email,
                                                }}
                                                handleChange={changeHandler}
                                                labelText='Email Address'
                                            />
                                            {error.email ? <Text red>{error.email}</Text> : ""}
                                        </Grid>
                                        <Grid item lg={12} sm={12} xs={12} mt={'20px'}>
                                            <FormControl fullWidth variant="filled" className={classes.endAdornmentControl}>
                                                <TextField
                                                    name="password"
                                                    value={formData.password}
                                                    className={classes.endAdornmentInput}
                                                    label={'Password'}
                                                    onChange={changeHandler}
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
                                            {
                                                error.password ?
                                                    <Text red>{error.password ? error.password : ''}</Text> : ''
                                            }
                                        </Grid>
                                        {
                                            invalidPassword ?
                                                <Box mt='20px' width='100%'>
                                                    {/* {setTimeout(() => { */}
                                                        <Stack direction='row' height='26px' width='100%' backgroundColor="#FFFAFA" gap={2} >
                                                            <img src={CrossMark} alt='CrossMark' style={{ marginLeft: '10px' }}></img>
                                                            <Text reSendFont sx={{ color: '#E51A1A !important' }}>Please enter a valid password</Text>
                                                        </Stack>
                                                    {/* }, 200)
                                                    } */}
                                                </Box> : ''
                                        }

                                        <Grid item lg={12} md={12} sm={12} xs={12} textAlign={"right"} >
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
                                </Stack>
                                <Grid item className={classes.buttonStyles}>
                                    <Button
                                        loginButton
                                        onClick={handleSubmit}
                                        variant="contained"
                                        type="submit"
                                    >
                                        Sign in
                                    </Button>
                                </Grid>
                            </Box>
                        </form>
                    </Box>
                </Grid>
            </Grid >
        </div >
    );
}

export default Login;


