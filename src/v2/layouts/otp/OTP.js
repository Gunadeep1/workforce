import { Box, Grid, Hidden, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input-rc-17";
import { useNavigate, useLocation } from "react-router-dom";
import OtpStyles from "./OtpStyles";
import Text from "../../components/customText/Text";
import Button from "../../components/customButton/Button";
// import DomainCheck from "../signUp/DomainCheck";
import { addErrorMsg, addSuccessMsg, addWarningMsg } from "../../utils/utils";
import CommonApi from "../../apis/CommonApi";
import LocalStorage from "../../utils/LocalStorage";
import { domain } from "../../config/Domain";
import LoginBackground from '../../assets/svg/LoginBackground.svg'
import LoginLogo from '../../assets/svg/LoginLogo.svg'
import CrossMark from '../../assets/svg/CrossMark.svg'

function OTP() {
    const location = useLocation();
    const email = location.state && location.state.emailId

    const navigate = useNavigate();

    const classes = OtpStyles();
    // const [open, setOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [invalidOtp, setInvalidOtp] = useState(false)

    const handleChange = (data) => {
        setOtp(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            request_id: LocalStorage.uid(),
            email_id: email,
            otp: otp,
            subdomain_name: domain,
        };
        if (otp == "") {
            addWarningMsg("Otp is required");
        } else {
            CommonApi.OtpVerification(data).then((response) => {
                if (response.data.statusCode == 1003) {
                    addSuccessMsg("OTP Verifies Success Please Check Your Mail");
                    navigate("/reset-password", { state: { emailId: email } });
                    e.preventDefault()
                    setInvalidOtp(false)
                } else {
                    setInvalidOtp(true)
                }
            });
        }
        e.preventDefault()
    };


    const ResendOtp = () => {
        const data = {
            request_id: LocalStorage.uid(),
            email_id: email,
            subdomain_name: domain,
        };
        CommonApi.ForgotPassword(data).then((response) => {
            if (response.data.statusCode == 1003) {
                addSuccessMsg("OTP Resend Success");
            } else {
                addErrorMsg("OTP Resend Failed");
            }
        })
    };

    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(59);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        let interval;

        if (isTimerRunning && minutes >= 0 && seconds >= 0) {
            interval = setInterval(() => {
                if (minutes > 0 && seconds === 0) {
                    if (minutes > 0) {
                        setMinutes(prevMinutes => prevMinutes - 1);
                    }
                    setSeconds(59);
                } else if (minutes >= 0 && seconds > 0) {
                    setSeconds(prevSeconds => prevSeconds - 1);
                }
            }, 1000);
        } else if (minutes === 0 && seconds === 0) {
            setIsTimerRunning(false);
            // Here you can add code to handle what happens when the timer expires
        }

        return () => clearInterval(interval);
    }, [isTimerRunning, minutes, seconds]);


    return (
        <Grid container>
            <Hidden mdDown>
                <Grid item lg={6} md={6} sm={12} xs={12} >
                    <img src={LoginBackground} alt="icon" style={{ height: '100%', width: '100%' }} />
                </Grid>
            </Hidden>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <Box className={classes.fullHeight}>
                    <Box className={classes.leftBox}>
                        <form onSubmit={handleSubmit} style={{ width: '400px' }}>
                            <Stack alignItems='center' gap={2}>
                                <img src={LoginLogo} alt='login' />
                                <Text loginHeader sx={{ mt: '12px' }}>Forgot Password</Text>
                                <Text forgotPasswordDesc sx={{ textAlign: 'center' }}>Please check your registered email id and enter five digits OPT here</Text>
                            </Stack>
                            <Grid container gap={3} alignItems='center'>
                                <Grid item xs={12} mt='40px' className={classes.otpBoxes}>
                                    <OtpInput
                                        value={otp}
                                        onChange={handleChange}
                                        placeholder="000000"
                                        numInputs={6}
                                        separator={<span className={classes.span}></span>}
                                        inputStyle={{
                                            borderRadius: "8px",
                                            border: "1px solid rgba(0,0,0,0.3)",
                                            width: "54px",
                                            height: "52px"
                                        }}
                                    />
                                </Grid>

                                <Grid item container lg={12} md={12} sm={12} xs={12} justifyContent={'center'}>
                                    <Button
                                        loginButton
                                        onClick={handleSubmit}
                                        variant="contained"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        invalidOtp ?
                                            <Stack alignItems='center' gap={2}>
                                                {/* {setTimeout(()=>{ */}
                                                <Stack direction='row' height='26px' width='100%' backgroundColor="#FFFAFA" gap={2} >
                                                    <img src={CrossMark} alt='CrossMark' style={{ marginLeft: '10px' }}></img>
                                                    <Text reSendFont sx={{ color: '#E51A1A !important' }}>Please enter a valid OTP</Text>
                                                </Stack>
                                                {/* } */}
                                                {/* ,200)
                                                } */}
                                                <Text reSendFont onClick={ResendOtp} sx={{ color: '#0C75EB !important', cursor: 'pointer' }}>Resend OTP</Text>
                                            </Stack>
                                            :
                                            <Box>
                                                {isTimerRunning && (
                                                    <Text sx={{
                                                        textAlign: 'center', font: '16px Nunito Sans, sans-serif !important',
                                                        color: `#7F1D1D  !important`,
                                                        fontWeight: `${500} !important`
                                                    }}>
                                                        {minutes.toString().padStart(2, '0')}:
                                                        {seconds.toString().padStart(2, '0')}
                                                    </Text>
                                                )}
                                                <Text reSendFont sx={{ marginTop: '5px' }}>
                                                    Haven't received the verification code <span onClick={ResendOtp} style={{ color: '#0C75EB', cursor: 'pointer' }}>Resend</span>
                                                </Text>
                                            </Box>
                                    }
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Grid>
            {/* <DomainCheck open={open} setOpen={setOpen} /> */}
        </Grid >
    );
}

export default OTP;

