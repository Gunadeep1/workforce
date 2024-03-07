import { Grid } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { Dialog } from '@mui/material';
import { DialogContent, Box } from '@mui/material';
import { DialogContentText } from '@mui/material';
import DomainCheckStyles from './DomainCheckStyles';
import codetru from "../../assets/images/codetru.png"
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import Text from '../../components/customText/Text';
import Button from '../../components/customButton/Button';
// import CustomInput from '../../../v1/components/common/customInput/CustomInput';
import { isValid, validate_charWithSpace } from '../../components/Validation';
import CommonApi from '../../apis/CommonApi';
import { addErrorMsg, addWarningMsg } from '../../utils/utils';
import Input from '../../components/input/Input';

function DomainCheck(props) {
    const { open, setOpen } = props;
    const classes = DomainCheckStyles();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [state, setState] = useState({
        subdomain_name: ""
    });

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        }, handleValidate(e))
    }

    const handleSubmit = () => {
        let errors = formValidations();
        if (isValid(errors)) {
            setLoading(true)
            const data = state;
            CommonApi.subDomainCheck(data).then((res) => {
                if (res.data.statusCode == 1003) {
                    setLoading(false)
                    if (res.data.domain_exists == true) {
                        window.location.replace(`http://${state.subdomain_name}.workforce.codetru.com`);
                    } else {
                        addWarningMsg("domain is in correct plz enter registered company name")
                    }
                } else {
                    setLoading(false)
                    addErrorMsg(res.data.message)
                }
            })
            console.log("state", state);
        } else {
            let er = { error };
            er = errors;
            setError(er);
        }
    }

    const handleValidate = (e) => {
        let input = e.target
        let err = { ...error }
        switch (input.name || input.tagName) {
            case 'subdomain_name':
                error.subdomain_name = validate_charWithSpace(input.value)
                break
            default:
                break
        }
        setError(err)
    }

    const formValidations = () => {
        let { subdomain_name } = state;
        let errors = {};
        errors.subdomain_name = validate_charWithSpace(subdomain_name);
        return errors;
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={'md'}
        >
            <DialogContent className={classes.dailogContent}>
                <DialogContentText id="alert-dialog-description" >

                    <Grid container spacing={0}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box px={2} py={1} sx={{ minHeight: "40vh", background: "#4285F4", display: "flex", justifyContent: 'center', alignItems: "center" }}>
                                <Box>
                                    <Box display={'flex'} justifyContent={'center'} py={1}>
                                        <img alt='codetru' src={codetru} width="45px" height='40px' />
                                    </Box>
                                    <Box display={'flex'} justifyContent={'center'} py={1}>
                                        <Text title>Using the older version of workforce?</Text>
                                    </Box>
                                    <Box display={'flex'} justifyContent={'center'} py={1}>
                                        <Button save className={classes.saveButton} onClick={() => { navigate("/signup") }}>Signup</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box p={5} sx={{ minHeight: "40vh", display: "flex", alignItems: "center" }}>
                                <Box>
                                    <Text title>Using the workforce Work Platform ?</Text>
                                    <Box sx={{ width: "100%", display: 'flex', alignItems: "center" }}>
                                        <Box sx={{ width: "60%", display: 'flex', alignItems: "center" }}>
                                            <Box py={1}>
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'subdomain_name',
                                                        value: state.subdomain_name,
                                                        type: 'text'
                                                    }}
                                                    handleChange={changeHandler}
                                                    clientInput
                                                    labelText={<Text largeLabel>account domain</Text>}
                                                />
                                                <Text errorText> {error.subdomain_name ? error.subdomain_name : ""}</Text>
                                            </Box>
                                        </Box>
                                        <Box sx={{ width: "40%", display: 'flex', alignItems: "center" }}>
                                            <Text largeLabel>.workforce.codetru.com</Text>
                                        </Box>
                                    </Box>

                                    <LoadingButton className={classes.saveButton} loading={loading} onClick={handleSubmit} variant="contained" >
                                        Login
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>




                    {/* <Grid display="flex" container>
                        <Grid item lg={6} md={6} sm={12} xs={12} className={classes.leftGrid}>
                            <Grid container spacing={2} className={classes.leftBox}>
                                <Grid item lg={12} md={12} sm={12} xs={12} textAlign={"center"} mt={2}>
                                    <img alt='codetru' src={codetru} width="45px" height='40px' />
                                </Grid>
                                <Grid item md={12} sm={12} xs={12} textAlign={"center"}>
                                    <Text title>Using the older version of workforce?</Text>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12} textAlign={"center"}>
                                    <Button save className={classes.saveButton} onClick={() => { navigate("/signup") }}>Signup</Button>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} py={3} px={2}>
                            <Text title>Using the workforce Work Platform ?</Text>
                            <Grid container display={"flex"} spacing={0} alignItems={"center"}>
                                <Grid item md={9} sm={9} xs={9}>
                                    <Box py={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'subdomain_name',
                                                value: state.subdomain_name,
                                                type: 'text'
                                            }}
                                            handleChange={changeHandler}
                                            clientInput
                                            labelText={<Text largeLabel>account domain</Text>}
                                        />
                                        <Text errorText> {error.subdomain_name ? error.subdomain_name : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item md={3} sm={3} xs={3}>
                                    <Text largeLabel>.workforce.codetru.com</Text>
                                     <Text normal className={classes.normal}>.workforce.codetru.com</Text> 
                                </Grid>
                                <Grid item md={12} sm={12} xs={12} pt={1} textAlign={"center"}>
                                    <LoadingButton className={classes.saveButton} loading={loading} onClick={handleSubmit} variant="contained" >
                                        Login
                                    </LoadingButton>
                                     <Button save onClick={handleSubmit} className={classes.saveButton}>Submit</Button> 
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid> */}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default DomainCheck
