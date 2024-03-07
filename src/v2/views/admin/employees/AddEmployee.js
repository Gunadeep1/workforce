import React, { useState } from "react";
import { Box, Typography, Grid, Checkbox, DialogContent, Slide, Dialog } from "@mui/material";
import DashboardStyles from '../DasboardStyles';
import { styled } from "@mui/material/styles";
import Stepper from './Stepper';
import Textinput from './TextInput';
import successImg from '../../../assets/svg/succesIcon.svg';
import crossIcon from '../../../assets/svg/crossIcon.svg';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import DateSvg from '../../../assets/svg/date.svg';
import Browse from '../../../assets/svg/Browse.svg';
import Input from "../../../components/input/Input";
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

// function a11yProps(index) {
//     return {
//         id: `full-width-tab-${index}`,
//         'aria-controls': `full-width-tabpanel-${index}`,
//     };
// }

export default function AddEmployee() {
    const classes = DashboardStyles();
    const navigate = useNavigate();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    // const [sidebar, setSidebar] = useState({ open: false });


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const [success, setSuccess] = useState(false);

    const [state, setState] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        emailId: '',
        contactNumber: '',
        dob: '',
        gender: '',
        uploadfile: '',
        voidCheque: '',
        offerLetter: '',
        workAuth: '',
        i20: '',
        ssn: '',
        educationalDocs: '',
        passport: '',
        i94: '',
        license: ''
    })
    // eslint-disable-next-line
    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.files[0].name
        })
    }

    const changeHandlerFile = (e) => {
        // ale
        setState({ ...state, uploadfile: e.target.files[0].name })
    }

    const handleClose = () => {
        setSuccess(false);
    };

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
        },
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2)
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1)
        }
    }));

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} timeout={500} />;
    });

    const goToHome = () => {
        setSuccess(false);
        navigate('/employees');
    }

    return (
        <Box>
            <Box>
                <Box my={2} sx={{ width: "100%", padding: "16px 10px ", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ width: "35%" }}>
                        <Stepper activeStepper={value} />
                    </Box>
                </Box>

                <Box sx={{ width: "100%", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                    <Box sx={{ width: "55%", borderRadius: "12px", boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05)" }}>
                        {/* <Box sx={{boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05)"}}> */}
                        {/* <h1>Basic Details</h1> */}
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>

                                <Box my={2}>
                                    <Box mb={2}>
                                        <Typography sx={{ fontSize: "18px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                            Basic Details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={4} mb={3}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                {/* <Textinput label={"First Name"} />   
                                                                                              */}
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    formInput
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                <Textinput label={"Middle Name"} labelMsg={"(optional)"} />
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                <Textinput label={"Last Name"} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={4}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                <Textinput label={"Email ID"} />
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                <Textinput label={"Contact Number"} />
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                <Textinput label={"Date of Birth"} icon={<imp src={DateSvg} alt="date" />} />
                                                {/* <label htmlFor={"date"}>Select Date</label>
                                                        <input type="date" id="date" /> */}
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                <Textinput label={"Gender"} />
                                            </Box>
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                border: '1px solid #c4c2c2', height: '56px', borderRadius: '8px',
                                                alignItems: 'center', justifyContent: 'space-between', padding: '0px 14px 0px 0px'
                                            }}>
                                                {/* <Text brownMnLargeLabel sx={{ margin: '0px 0px 0px 10px' }}>{state.uploadfile ? state.uploadfile : 'Upload Offer Letter'}</Text> */}

                                                <Typography sx={{ margin: '0px 0px 0px 10px', fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", color: `${state.uploadfile === "" ? "rgba(115, 115, 115, 1)" : "rgba(38, 38, 38, 1)"}` }}>
                                                    {
                                                        state.uploadfile === "" ?
                                                            "Upload Offer Letter" :
                                                            state.uploadfile
                                                    }

                                                </Typography>
                                                {/* <button>Browse</button> */}

                                                <label
                                                    htmlFor="browse"
                                                    style={{ padding: "2px 14px 1px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "80px", height: "36px", border: "none", backgroundColor: "#D1E1FF", borderRadius: "6px", color: "#5DA5F5" }}
                                                >
                                                    <img src={Browse} alt="Userplus" style={{ margin: "0px 8px 0px 0px" }} />  Browse
                                                </label>
                                                <input hidden name='uploadfile' id="browse" type="file" onChange={(e) => changeHandlerFile(e)} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <Box my={2}>
                                    <Box mb={2}>
                                        <Typography sx={{ fontSize: "18px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                            Documents
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={4} mb={3}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            {/* <Box sx={{ width: "100%", minHeight: "50px", }}>
                                                        <Textinput />
                                                    </Box> */}
                                            <Box className={classes.checkBoxbg} pl={1} alignItems='center'>
                                                <Checkbox size='medium' defaultChecked name='voidCheque' value={state.voidCheque} style={{
                                                    color: '#0C75EB', boxShadow: 'none'
                                                }} />
                                                <Typography className={classes.mediumGreyText}>Copy of Void Cheque</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBoxbg} pl={1} alignItems='center'>
                                                <Checkbox size='medium' defaultChecked name='offerLetter' value={state.offerLetter} style={{
                                                    color: '#0C75EB', boxShadow: 'none'
                                                }} />
                                                <Typography className={classes.mediumGreyText}>CounterSined Offer Letter</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBoxbg} pl={1} alignItems='center'>
                                                <Checkbox size='medium' defaultChecked name='workAuth' value={state.workAuth} style={{
                                                    color: '#0C75EB', boxShadow: 'none'
                                                }} />
                                                <Typography className={classes.mediumGreyText}>Work Authorization</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBoxbg} pl={1} alignItems='center'>
                                                <Checkbox size='medium' defaultChecked name='i20' value={state.i20} style={{
                                                    color: '#0C75EB', boxShadow: 'none'
                                                }} />
                                                <Typography className={classes.mediumGreyText}>All Previous I-20's</Typography>
                                            </Box>
                                        </Grid>
                                        {/* </Grid> */}
                                    </Grid>
                                    <Grid container spacing={4}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBox} pl={1} alignItems='center'>
                                                <Checkbox size='medium' color="default" name='ssn' value={state.ssn} />
                                                <Typography className={classes.mediumGreyText}>Signed SSN</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBox} pl={1} alignItems='center'>
                                                <Checkbox size='medium' color="default" name='educationalDocs' value={state.educationalDocs} />
                                                <Typography className={classes.mediumGreyText}>Educational Documents</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBox} pl={1} alignItems='center'>
                                                <Checkbox size='medium' color="default" name='passport' value={state.passport} />
                                                <Typography className={classes.mediumGreyText}>Passport</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBox} pl={1} alignItems='center'>
                                                <Checkbox size='medium' color="default" name='i94' value={state.i94} />
                                                <Typography className={classes.mediumGreyText}>I-94</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box className={classes.checkBox} pl={1} alignItems='center'>
                                                <Checkbox size='medium' color="default" name='license' value={state.license} />
                                                <Typography className={classes.mediumGreyText}>Driver's License</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </TabPanel>
                        </SwipeableViews>
                        {/* </Box> */}
                    </Box>

                </Box>

                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ width: "55%", display: "flex", justifyContent: "end", alignItems: "center", padding: "20px 10px" }}>

                        <button
                            type="button"
                            onClick={(e) => value === 0 ? navigate("/employees") : handleChange(e, 0)}
                            className={classes.cancelBtn}
                        >
                            Cancel
                        </button>
                        {
                            value === 1 ?
                                <button
                                    type="button"
                                    onClick={() => setSuccess(true)}
                                    className={classes.nextBtn}
                                // style={{
                                //     all: "unset", padding: "0px 14px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "50px", height: "35px", border: "1.5px solid rgba(12, 117, 235, 1)", backgroundColor: "rgba(12, 117, 235, 1)", boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.08)", borderRadius: "6px", color: "#ffffff", transition: "all .3s ease",
                                //     '&:hover': {
                                //         backgroundColor: '#FFFFFF', color: 'rgba(12, 117, 235, 1)'
                                //     }
                                // }}
                                >
                                    Send Invite
                                </button> :
                                <button
                                    type="button"
                                    onClick={(e) => value === 1 ? null : handleChange(e, 1)}
                                    className={classes.nextBtn}
                                >
                                    Next
                                </button>

                        }

                    </Box>
                </Box>


                <BootstrapDialog
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={success}
                    // fullWidth={true}
                    maxWidth={"md"}
                >

                    <Box
                        // aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 10,
                            top: 10,
                            color: (theme) => theme.palette.grey[500],
                            boxShadow: 'none !important',
                            cursor: 'pointer'
                        }}
                    >
                        {/* <CloseIcon sx={{ color: "rgba(38, 38, 38, 1)" }} /> */}
                        <img src={crossIcon} alt="cross" />
                    </Box>
                    <DialogContent sx={{ margin: "50px 50px 40px 40px", }}>
                        <Box textAlign='center' justifyContent='center'>
                            <img src={successImg} alt='success' style={{ height: '150px', width: '150px', marginBottom: '5px' }} />
                            <Typography style={{
                                fontSize: "18px",
                                fontFamily: "Nunito , Nunito Sans, sans-serif",
                                letterSpacing: '0px',
                                color: "#15803D",
                                opacity: 1,
                                fontWeight: '700px'
                            }}>Congratulations</Typography>
                            <Typography style={{
                                fontSize: "15px",
                                fontFamily: "Nunito , Nunito Sans, sans-serif",
                                letterSpacing: '0px',
                                color: "#707070 !important",
                                opacity: 1
                            }} sx={{ marginTop: '8px' }}>Invite Link Successfully Sent to Rahul Raj</Typography>
                            <button onClick={goToHome} className={classes.btn}>Go To Home</button>
                            {/* <Button brownMnMediumSave sx={{ margin: '20px 0px 0px 0px' }} onClick={goToHome}>Go To Home</Button> */}
                        </Box>
                    </DialogContent>
                </BootstrapDialog>
            </Box>
        </Box>
    )
};
