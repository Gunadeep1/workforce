import { Box, Grid, Hidden, Stack } from "@mui/material";
import React from "react";
import { useState } from "react";
import { ForgotPasswordStyles } from "./ForgotPasswordStyles";
import Text from "../../components/customText/Text";
import Button from "../../components/customButton/Button";
import { isValid, validates_emailId } from "../../components/Validation";
import { domain } from "../../config/Domain";
import LocalStorage from "../../utils/LocalStorage";
import CommonApi from "../../apis/CommonApi";
import { addSuccessMsg, addWarningMsg } from "../../utils/utils";
import LoginLogo from '../../assets/svg/LoginLogo.svg'
import Input from "../../components/input/Input";
import LoginBackground from '../../assets/svg/LoginBackground.svg'
import { useNavigate } from "react-router-dom";

/*fun starts here*/



function ForgotPassword() {
    const navigate = useNavigate();
    const classes = ForgotPasswordStyles();
    const [state, setState] = useState({
        emailId: "",
    });
    const [error, setError] = useState({});

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
        e.preventDefault()
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
                        addSuccessMsg("OTP Send To Your Mail"); //success msg Alert
                        navigate("/submit-otp", { state: { emailId: state.emailId } });
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

        <Grid container>
            <Hidden mdDown>
                <Grid item lg={6} md={6} sm={12} xs={12} >
                    <img src={LoginBackground} alt="icon" style={{ height: '100%', width: '100%' }} />
                </Grid>
            </Hidden>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <Box className={classes.fullHeight}>
                    <Box className={classes.leftBox}>
                        <form onSubmit={handleSubmit} style={{ width: '400px' }}>
                            <Stack alignItems='center' gap={2}>
                                <img src={LoginLogo} alt='login' />
                                <Text loginHeader sx={{ mt: '12px' }}>Forgot Password</Text>
                                <Text forgotPasswordDesc sx={{ textAlign: 'center' }}>Please provide your registered email address for password reset OTP</Text>
                            </Stack>
                            <Grid container pt={1} mt='40px' gap={3}>
                                <Grid item sm={12} xs={12}>
                                    <Input
                                        clientInput
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            name: "emailId",
                                            value: state.emailId,
                                            type: 'text',
                                            disabled: false,
                                        }}
                                        handleChange={changeHandler}
                                        labelText='Email Address'
                                    />
                                    {error.emailId ? <Text red>{error.emailId}</Text> : ""}
                                </Grid>
                                <Grid item container justifyContent={'center'} lg={12} md={12} sm={12} xs={12}>
                                    <Button
                                        loginButton
                                        onClick={handleSubmit}
                                        variant="contained"
                                        type="submit"
                                    >
                                        Send OTP
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Grid>
        </Grid>

    );
}

export default ForgotPassword;

