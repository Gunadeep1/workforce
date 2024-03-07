import { Grid } from "@mui/material";
import React, { useState } from "react";
import OtpInput from "react-otp-input-rc-17";
import { useNavigate } from "react-router-dom";
import OtpStyles from "./OtpStyles";
import Text from "../../components/customText/Text";
import Button from "../../components/customButton/Button";
// import DomainCheck from "../signUp/DomainCheck";
import { addErrorMsg, addSuccessMsg, addWarningMsg } from "../../utils/utils";
import CommonApi from "../../apis/CommonApi";
import LocalStorage from "../../utils/LocalStorage";
import { domain } from "../../config/Domain";

function OTP(props) {
    const { email } = props;

    const navigate = useNavigate();

    const classes = OtpStyles();
    // const [open, setOpen] = useState(false);
    const [otp, setOtp] = useState("");

    const handleChange = (data) => {
        setOtp(data);
    };

    const handleSubmit = (e) => {   
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
                    navigate("/");
                    e.preventDefault()    
                } else {
                    addErrorMsg(response.data.message);
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

    return (
        <Grid container>
            <form onSubmit={handleSubmit}>
                <Grid item xs={12} textAlign="center">
                    <Text variant="h7"> OTP Sent to your registered email</Text>
                </Grid>

                <Grid item xs={12} className={classes.otpBoxes}>
                    <OtpInput
                        value={otp}
                        onChange={handleChange}
                        placeholder="000000"
                        numInputs={6}
                        separator={<span className={classes.span}></span>}
                        inputStyle={{
                            borderRadius: 4,
                            border: "1px solid rgba(0,0,0,0.3)",
                            width: "30px",
                        }}
                    />
                </Grid>

                <Grid item xs={12} className={classes.reSend}>
                    <Text onClick={ResendOtp} className={classes.reSendFont}>
                        Not yet received, Resend
                    </Text>
                </Grid>

                <Grid item xs={12} className={classes.btn}>
                    <Button save type="submit">
                        Submit
                    </Button>
                </Grid>
            </form>
            {/* <DomainCheck open={open} setOpen={setOpen} /> */}
        </Grid>
    );
}

export default OTP;

