import React from 'react'
import GreenVerif from "../../../../../assets/svg/GreenVerify.svg"
import Button from '../../../../../components/customButton/Button';
import { Grid,Box } from '@mui/material';
import Text from '../../../../../components/customText/Text';
import DialogContent from "@mui/material/DialogContent";
import { CircularProgressbar, } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from "@mui/material/IconButton";
import DialogTitle from '@mui/material/DialogTitle';
import Slide from "@mui/material/Slide";
import { styled } from '@mui/system';
import Dialog from "@mui/material/Dialog";
import UserProfileStyles from '../UserProfileStyles';

function OffboardingProgress(props) {
    const classes = UserProfileStyles();
     // eslint-disable-next-line
    const {handleStart,active,progress,
        // active1,active2,active3,
         // eslint-disable-next-line
        active4,percentage,setPopUpOpen,popUpOpen,grButn,get} = props
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
            width: "450px",
            minHeight: "500px",
        },
        "& .MuiDialogContent-root": {
            padding: theme.spacing(1),
            // padding: theme.spacing(3)
        },
        "& .MuiDialogActions-root": {
            // padding: theme.spacing(1)
            // padding: theme.spacing(5)
        },
        // "& .modal-header": {
        //     background: "blue !important", // Background color for the header (including title)
        //     color: "white !important", // Text color for the title
        //     textAlign: "center !important",
        //     paddingTop: "20px !important",
        //     paddingBottom: "20px !important",
        //     borderTopLeftRadius: "16px !important",
        //     borderTopRightRadius: "16px !important",
        //   },
        //   "& .modal-body": {
        //     // Body styles, if needed
        //     background: "green !important", // Background color for the body
        //     height: "calc(100% - 90px) !important", // Adjust the height as needed
        //     borderBottomLeftRadius: "16px !important",
        //     borderBottomRightRadius: "16px !important",
        //     padding: "20px !important",
        //   },
    }));
    // console.log("color==>",getData)
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} timeout={500}  style={{ position: 'fixed', bottom: 60, right: 50 }} />;
    });
    const calcColor = (percent, start, end) => {
        // if(getData.off_boarding_percentage == 0){
        //     return 'hsl(0, 0%, 100%)'
        // }
        // if (getData.off_boarding_percentage == 25 || getData.off_boarding_percentage == 50) {
        //     let a = 25 / 100,
        //         b = (end - start) * a,
        //         c = b + start
        //     return 'hsl(' + c + ', 92%, 50%)'
        // } else if (getData.off_boarding_percentage == 75) {
        //     return 'hsl(142, 69%, 58%)'

        // } else if (getData.off_boarding_percentage == 100) {
        //     return 'hsl(142, 71%, 45%)'
        // }
        if(get.off_boarding_percentage == 0){
            return 'hsl(0, 0%, 100%)'
        }
        if (get.off_boarding_percentage == 25 || get.off_boarding_percentage == 50) {
            let a = 25 / 100,
                b = (end - start) * a,
                c = b + start
            return 'hsl(' + c + ', 92%, 50%)'
        } else if (get.off_boarding_percentage == 75) {
            return 'hsl(142, 69%, 58%)'

        } else if (get.off_boarding_percentage == 100) {
            return 'hsl(142, 71%, 45%)'
        }

    }
  return (
    <>
       <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={popUpOpen}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: "#3B4957" }} id="customized-dialog-title">
                    <Text overViewAmount sx={{ color: "#FFFFFF !important" }}>Offboarding</Text>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setPopUpOpen(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        // color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <CloseRoundedIcon sx={{ color: "#FFFFFF" }} />
                </IconButton>
                <Box className={classes.bodyBox}>
                    <Grid container >
                        <Grid item lg={12} md={12} sm={12} display={"flex"} justifyContent={"center"}>
                            <Box 
                                sx={{
                                    height: 126,
                                    width: 200,
                                    transform: "rotate(-360deg)"
                                }}
                            >
                                <CircularProgressbar
                                    // value={getData.off_boarding_percentage}
                                    // text={`${getData.off_boarding_percentage}%`}
                                    value={get.off_boarding_percentage?get.off_boarding_percentage:progress}
                                    text={`${get.off_boarding_percentage?get.off_boarding_percentage:progress}%`}
                                    circleRatio={0.45}
                                    strokeWidth={14}
                                    styles={{
                                        root: {
                                            transform: "rotate(0.772turn)",
                                            trail: "pink",
                                            fontWeight: `${5}`,
                                        },
                                        
                                        trail:{
                                            
                                            stroke: 'hsl(0, 0%, 100%)'// Set trailColor to the result of calcColor
                                        } ,
                                        path: {
                                            stroke: calcColor(progress, 0, 152),
                                        },
                                        text: {
                                            fill: "white",
                                            transformOrigin: "center center",
                                            transform: "rotate(80deg)",
                                            font: "10px Nunito Sans, sans-serif",
                                            marginTop: "0px",
                                            fontWeight: "none",
                                        },
                                    }}
                                />
                            </Box>

                        </Grid>
                        <Grid item lg={12} md={12} sm={12} mb={2} display={"flex"} justifyContent={"center"} textAlign={"center"}>
                            <Text BrowmnMnStepperText sx={{ color: "#FFFFFF !important" }}>  Off Boarding <br />
                                {/* {getData.off_boarding_percentage == 100 ? "Completed" : "Progress"}</Text> */}
                                {get.off_boarding_percentage == 100 ? "Completed" : "Progress"}</Text>


                        </Grid>
                    </Grid>

                </Box>
                <DialogContent>
                <Grid container>
                    {progress==0?
                    // getData.off_boarding_percentage==25||getData.off_boarding_percentage==50||getData.off_boarding_percentage==75?
                    <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                    <Grid item lg={9} className={classes.headerRow}><Text headerBlack>1. Disable User Access Across Apps</Text></Grid>
                    <Grid item lg={3}> <Button popupSaveBlue onClick={() => handleStart(1)} >Start</Button></Grid>
                    </Grid>
                    :
                    <Grid item container lg={12} p={2} className={classes.activeRow}>
                    <Grid item lg={9} className={classes.headerRow}><Text headerBlack>1. Disable User Access Across Apps</Text></Grid>
                    <Grid item lg={1} ><img src={GreenVerif} style={{ display: "flex" }} alt="Verify" /></Grid>
                    <Grid item lg={2} className={classes.headerRow}><Text headerBlack sx={{ color: "#16A34A !important" }}>Done</Text></Grid>
                </Grid>
                   }
                       
                        {
                        // active==0?
                        get.off_boarding_percentage==50||get.off_boarding_percentage==75 ?
                            <Grid item container lg={12} mt={1} p={2} className={classes.activeRow}>
                                <Grid item lg={9} className={classes.headerRow}><Text headerBlack>2. Send Email to USCIS / University</Text></Grid>
                                <Grid item lg={1} ><img src={GreenVerif} style={{ display: "flex" }} alt="Verify" /></Grid>
                                <Grid item lg={2} className={classes.headerRow}><Text headerBlack sx={{ color: "#16A34A !important" }}>Done</Text></Grid>
                            </Grid>
                            :
                            // grButn==1?
                            get.off_boarding_percentage==25 ?
                            <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                                <Grid item lg={9} className={classes.headerRow}><Text headerBlack>2. Send Email to USCIS / University</Text></Grid>
                                <Grid item lg={3}> <Button popupSaveBlue  onClick={() => handleStart(2)} >Start</Button></Grid>
                            </Grid>:
                             <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                             <Grid item lg={9} className={classes.headerRow}><Text headerBlack>2. Send Email to USCIS / University</Text></Grid>
                             <Grid item lg={3}> <Button placementDisable >Start</Button></Grid>
                         </Grid>}
                        {
                        // active==0?
                        get.off_boarding_percentage==75 ?
                            <Grid item container lg={12} mt={1} p={2} className={classes.activeRow}>
                                <Grid item lg={9} className={classes.headerRow}><Text headerBlack>3. Delete Mail ID</Text></Grid>
                                <Grid item lg={1} ><img src={GreenVerif} style={{ display: "flex" }} alt="Verify" /></Grid>
                                <Grid item lg={2} className={classes.headerRow}><Text headerBlack sx={{ color: "#16A34A !important" }}>Done</Text></Grid>
                            </Grid>
                            :
                            // grButn==2?
                            get.off_boarding_percentage==50 ?
                            <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                                <Grid item lg={9} className={classes.headerRow}><Text headerBlack>3. Delete Mail ID</Text></Grid>
                                <Grid item lg={3}> <Button popupSaveBlue  onClick={() => handleStart(3)}>Start</Button></Grid>
                            </Grid>:
                           <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                           <Grid item lg={9} className={classes.headerRow}><Text headerBlack>3. Delete Mail ID</Text></Grid>
                           <Grid item lg={3}> <Button placementDisable>Start</Button></Grid>
                       </Grid> }
                        {
                            active4 == 4 ?
                                <Grid item container lg={12} mt={1} p={2} className={classes.activeRow}>
                                    <Grid item lg={9} className={classes.headerRow}><Text headerBlack>4. Settle Amount</Text></Grid>
                                    <Grid item lg={1} ><img src={GreenVerif} style={{ display: "flex" }} alt="Verify" /></Grid>
                                    <Grid item lg={2} className={classes.headerRow}><Text headerBlack sx={{ color: "#16A34A !important" }}>Done</Text></Grid>
                                </Grid>
                                :
                                // grButn==3?
                                get.off_boarding_percentage==75?
                                <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                                    <Grid item lg={9} className={classes.headerRow}><Text headerBlack>4. Settle Amount</Text></Grid>
                                    <Grid item lg={3}> <Button popupSaveBlue onClick={() => handleStart(4)}>Start</Button></Grid>
                                </Grid>
                                : <Grid item container lg={12} p={2} mt={1} className={classes.disableRow}>
                                    <Grid item lg={9} className={classes.headerRow}><Text headerBlack>4. Settle Amount</Text></Grid>
                                    <Grid item lg={3}> <Button placementDisable>Start</Button></Grid>
                                </Grid>
                        }

                </Grid>                   
                </DialogContent>
            </BootstrapDialog>
       
    </>
  )
}

export default OffboardingProgress
