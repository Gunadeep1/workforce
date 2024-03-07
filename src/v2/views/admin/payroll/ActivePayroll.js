import React from "react";
import { Box, Typography, Breadcrumbs, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PayrollStyles from "../payroll/PayrollStyles";
import Text from "../../../components/customText/Text";
import Dollar from "../../../assets/dollar.png";
import Play from "../../../assets/svg/PlayBtn.svg";
import WeeklyImg from "../../../assets/svg/weeklyImg.svg";
import { useState } from "react";
import ReusablePopup from "../../../components/reuablePopup/ReusablePopup";
import SkipPopupImg from "../../../assets/svg/skipPopupImg.svg";
import Button from '../../../components/customButton/Button';
import MonthlyImg from "../../../assets/svg/monthlyImg.svg";


const ActivePayroll = () => {
    const location = useLocation();
    const { state } = location;
    const pendingArray = state ? state.pendingArray : [];
    const [openDialog, setOpenDialog] = useState(false);
    const classes = PayrollStyles();
    const playSkip = () => {
        setOpenDialog(true)
    }
    const closePlaySkip = () => {
        setOpenDialog(false)
    }


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {
                openDialog &&
                <ReusablePopup iconHide openPopup={openDialog} setOpenPopup={closePlaySkip} white statusWidth>
                    <Box textAlign='center' p={'0px 20px 0px 20px'}>
                        <img src={SkipPopupImg} alt='skipPopupImg' />
                        <Typography sx={{
                            font: "18px Nunito Sans, sans-serif !important",
                            fontWeight: '600',
                            lineHeight: '22px',
                            letterSpacing: '0em',
                            textAlign: 'center',
                            color: '#54595E'
                        }}>Are You Sure?</Typography>
                        <Typography pt={1} mediumLabel sx={{
                            font: "14px Nunito Sans, sans-serif !important",
                            fontWeight: '400 !important',
                            lineHeight: '17px !important',
                            textAlign: 'center !important',
                            color: '#54595E99 !important'
                        }}>This Payroll will be skipped</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '35px 0px 0px 10px' }}>
                            <Button
                                onClick={closePlaySkip}
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: "none !important",
                                    width: '120px !important',
                                    height: '48px !important',
                                    fontSize: '18px !important',
                                    backgroundColor: '#FFFFFF !important',
                                    border: '1px solid #737373 !important',
                                    color: '#737373 !important',
                                    font: "18px Nunito Sans, sans-serif !important",
                                    fontWeight: '500 !important',
                                    lineHeight: '20px !important',
                                    textAlign: 'left !important'
                                }}>No, Cancel</Button>
                            <Button sx={{
                                textTransform: "none !important",
                                width: '93px !important',
                                height: '48px !important',
                                padding: '14px 16px 14px 16px !important',
                                fontSize: '18px !important ',
                                backgroundColor: '#0C75EB !important',
                                border: '1px solid #FFFFFF !important',
                                color: '#FFFFFF !important',
                                font: "16px Nunito Sans, sans-serif !important",
                                borderRadius: '8px !important',
                                fontWeight: '500',
                                textAlign: 'center',
                                '&:hover': {
                                    backgroundColor: '#0C75EB !important',
                                    color: '#FFFFFF !important',
                                }
                            }} >
                                Yes</Button>
                        </Box>
                    </Box>
                </ReusablePopup>
            }
            <Box sx={{ width: '80%' }} >
                <Box style={{ padding: '20px 10px 10px 10px' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/payroll' className={classes.linkStyle}><Text className={classes.navText1}>Payroll</Text></Link>
                        <Text className={classes.navText2}>Active Payroll</Text>
                    </Breadcrumbs>
                </Box>
            </Box>
            <Box sx={{ width: '60%' }} pt={5} >
                <Box>
                    <Typography style={{ fontFamily: 'Nunito', fontSize: '16px', fontWeight: '600', color: "#404040" }}>
                        Drafted
                    </Typography>
                </Box>
                <Box style={{ width: '100%' }}>
                    <Box className={classes.customAccordion2}>
                        <Box >
                            <Stack direction='row' spacing={2} width='100%' >
                                <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                        <Box>
                                            <img src={WeeklyImg} alt="img" />
                                        </Box>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box mx={2} >
                                                <Typography pb={1}
                                                    sx={{
                                                        fontFamily: 'Nunito',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        lineHeight: '17px',
                                                        letterSpacing: '0em',
                                                        textAlign: 'left',
                                                        color: '#000000'
                                                    }}
                                                >Weekly</Typography>
                                                <Typography className={classes.secondarytext}>12-Sep-2023 - 12-Sep-2023</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box >
                                        <Typography className={classes.primarytext}>09-Sep-2023</Typography>
                                    </Box>
                                    <Box className={classes.flexBox} gap={4} >
                                        <Box className={classes.flexBox} gap={1}>
                                            <img src={Dollar} alt="dollar" />
                                            <Typography className={classes.linkText}>Generate</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                            <img
                                                onClick={playSkip}
                                                src={Play} alt="play" />
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
                <Box pt={2}>
                    <Typography style={{ fontFamily: 'Nunito', fontSize: '16px', fontWeight: '600', color: "#404040" }}>
                        Pending
                    </Typography>
                </Box>
                <Box style={{ width: '100%' }}>
                    {
                        pendingArray.map((obj, index) => (
                            <Box className={classes.customAccordion2} key={index} >
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={MonthlyImg} alt="monthlyImg" />
                                                </Box>
                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box mx={2}>
                                                        <Typography pb={1}
                                                            sx={{
                                                                fontFamily: 'Nunito',
                                                                fontSize: '14px',
                                                                fontWeight: '600',
                                                                lineHeight: '17px',
                                                                letterSpacing: '0em',
                                                                textAlign: 'left',
                                                                color: '#000000'
                                                            }}
                                                        >{obj.pay_config_setting_name}</Typography>
                                                        <Typography className={classes.secondarytext}>{obj.from_date} - {obj.to_date}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box >
                                                <Typography className={classes.primarytext}>{obj.check_date}</Typography>
                                            </Box>
                                            <Box className={classes.flexBox} gap={4} >
                                                <Box className={classes.flexBox} gap={1}>
                                                    <img src={Dollar} alt="dollar" />
                                                    <Typography className={classes.linkText}>Generate</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                                    <img onClick={playSkip} src={Play} alt="play" />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
            {
                console.log("Pending Array in Active Payroll==>", pendingArray)
            }
        </Box>
    )
}

export default ActivePayroll;