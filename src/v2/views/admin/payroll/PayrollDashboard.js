import React, { useEffect, useState } from "react";
import PayrollStyles from "../payroll/PayrollStyles";
import { Box, Stack, Typography } from "@mui/material";
import WeeklyImg from "../../../assets/svg/weeklyImg.svg";
import MonthlyImg from "../../../assets/svg/monthlyImg.svg";
import Dollar from "../../../assets/dollar.png";
import { TooltipIndicator } from '../../../theme';
import Text from "../../../components/customText/Text";
import LocalStorage from "../../../utils/LocalStorage";
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import Play from "../../../assets/svg/PlayBtn.svg";
import UpcomingImg from "../../../assets/svg/upcomingImg.svg";
import NextBtn from "../../../assets/svg/NextBtn.svg";
import SummaryImg from "../../../assets/svg/summaryImg.svg";
import SkippedImg from "../../../assets/svg/skippedImg.svg";
import { useNavigate } from "react-router-dom";
import ReusablePopup from "../../../components/reuablePopup/ReusablePopup";
import SkipPopupImg from "../../../assets/svg/skipPopupImg.svg";
import Button from '../../../components/customButton/Button';
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import CircularProgress from '@mui/material/CircularProgress';

const PayrollDashboard = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const classes = PayrollStyles();
    const navigate = useNavigate();
    const [dashboardInfo, setDashboardInfo] = useState({});
    const [drafted, setDrafted] = useState([]);
    const [generateLoad, setGenerateLoad] = useState(0);
    const [pendingArray, setPendingArray] = useState([]);
    const [skip_id, setSkipId] = useState(null);

    const toDrafted = () => {
        navigate('/drafted', { state: { status: 'Drafted' } });
    }
    const toPending = () => {
        navigate('/pending', { state: { status: 'Yet to generate' } })
    }
    const navToUpcoming = () => {
        navigate('/upcoming-payroll');
    }
    const navToSummary = () => {
        navigate('/summary', { state: { status: 'Submitted' } });
    }
    const navToSkipped = () => {
        navigate('/skipped', { state: { status: 'Skipped' } });
    }
    const playSkip = (id) => {
        setSkipId(id)
        setOpenDialog(true)
    }
    const closePlaySkip = () => {
        setOpenDialog(false)
    }
    const skipRecord = (id) => {
        PayrollApi.skippedApi(id).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setOpenDialog(false);
                    addSuccessMsg(res.data.message);
                    getPayrollInfo();
                }
            })
        })
    }

    useEffect(() => {
        getPayrollInfo();
    }, [])

    const getPayrollInfo = () => {
        PayrollApi.getPayrollInfo().then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setDashboardInfo(res.data.data[0]);
                    setDrafted(res.data.data[0]['drafted'])
                    setPendingArray(res.data.data[0]['pending']);
                } else {
                    addErrorMsg(res.data.message);
                }
            }, 300)
        })
    }

    const handleGeneratePayroll = (status, name, id, from_date, to_date) => {
        let data = {
            request_id: LocalStorage.uid(),
            payroll_configuration_id: id
        }
        setGenerateLoad(id);
        PayrollApi.payRollGenerate(data).then((response) => {
            if (response.data.statusCode == 1003) {
                setGenerateLoad(0);
                addSuccessMsg(response.data.message);
                navigate('/payroll-view', { state: { status: status, name: name, payroll_configuration_id: id, from_date: from_date, to_date: to_date } })
            } else {
                setGenerateLoad(0);
                addErrorMsg(response.data.message);
            }
        });
    }

    return (
        <Box className={classes.flexBox}>
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
                            <Button
                                onClick={() => skipRecord(skip_id)}
                                sx={{
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
            <Box sx={{ width: "68%" }}>
                <Box style={{ padding: "40px 10px 10px 10px" }}>
                    <div>
                        <Typography sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                            Payroll
                        </Typography>
                    </div>
                    <div style={{ display: "flex", justifyContent: 'space-between', padding: '30px 0px 0px 0px' }}>
                        <Typography style={{ fontFamily: 'Nunito', fontSize: '16px', fontWeight: '600', color: "#404040" }}>
                            Drafted
                        </Typography>
                        {
                            drafted !== null ? <Typography
                                onClick={toDrafted}
                                sx={{ cursor: 'pointer' }}
                                className={classes.linkText}>
                                View All
                            </Typography> : null
                        }
                    </div>
                </Box>
                <Box style={{ width: '100%' }}>
                    {
                        drafted ? drafted.length > 0 ? drafted.map((obj, index) => (
                            <>
                                {
                                    index == 0 &&
                                    <Box className={classes.customAccordion2}>
                                        <Box>
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
                                                                > {obj.pay_config_setting_name}
                                                                </Typography>
                                                                <Typography className={classes.secondarytext}>{obj.from_date} - {obj.to_date}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Box >
                                                        <Typography className={classes.primarytext}>{obj.check_date}</Typography>
                                                    </Box>
                                                    <Box className={classes.flexBox} gap={4} >
                                                        <Box className={classes.flexBox} gap={1} style={{ cursor: !generateLoad ? 'pointer' : 'not-allowed' }}
                                                            onClick={!generateLoad ? () => handleGeneratePayroll('Drafted', obj.pay_config_setting_name, obj.id, obj.from_date, obj.to_date) : undefined}>
                                                            {generateLoad == obj.id ? <CircularProgress /> : !generateLoad && <img src={Dollar} onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} alt="dollar" />}
                                                            {!generateLoad ? <Typography className={classes.linkText}>Generate</Typography> : <Typography className={classes.linkText}>Loading...</Typography>}
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                                            <TooltipIndicator
                                                                title={<Text smallWhite>Payroll Will Be Skipped</Text>}
                                                                placement='right-start'>
                                                                <img onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} style={{ cursor: !generateLoad ? 'pointer' : 'not-allowed' }} onClick={() => playSkip(obj.id)} src={Play} alt="play" />
                                                            </TooltipIndicator>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>
                                }
                            </>)) : null :
                            <Box className={classes.customAccordion2}>
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={WeeklyImg} alt="img" />
                                                </Box>
                                                <Box sx={{ margin: 'auto', width: '485px', display: 'flex', justifyContent: 'end' }}>
                                                    <Typography className={classes.primarytext}>No Data Available</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                    }
                </Box>
                <Box style={{ width: '100%' }}>
                    <Box style={{ padding: "0px 10px 0px 10px" }}>
                        <div style={{ display: "flex", justifyContent: 'space-between', padding: '30px 0px 0px 0px' }}>
                            <Typography style={{ fontFamily: 'Nunito', fontSize: '16px', fontWeight: '600', color: "#404040" }}>
                                Pending
                            </Typography>
                            {
                                pendingArray !== null ?
                                    <Typography
                                        onClick={toPending}
                                        sx={{ cursor: 'pointer' }}
                                        className={classes.linkText}>
                                        View All
                                    </Typography> : null
                            }
                        </div>
                    </Box>
                </Box>
                <Box style={{ width: '100%' }}>
                    {
                        pendingArray ? pendingArray.length > 0 ? pendingArray.map((obj, index) => (
                            <>
                                {
                                    index <= 3 &&
                                    <Box className={classes.customAccordion2} key={index}>
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
                                                        <Box className={classes.flexBox} gap={1} style={{ cursor: !generateLoad ? 'pointer' : 'not-allowed' }} onClick={!generateLoad ? () => handleGeneratePayroll('Pending', obj.pay_config_setting_name, obj.id, obj.from_date, obj.to_date) : undefined}>
                                                            {generateLoad == obj.id ? <CircularProgress /> : !generateLoad && <img onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} src={Dollar} alt="dollar" />}
                                                            {generateLoad !== obj.id ? <Typography className={classes.linkText}>Generate</Typography> : <Typography className={classes.linkText}>Loading...</Typography>}
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                                            <TooltipIndicator
                                                                title={<Text smallWhite>Payroll Will Be Skipped</Text>}
                                                                placement='right-start'>
                                                                <img onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} style={{ cursor: !generateLoad ? 'pointer' : 'not-allowed' }} onClick={() => playSkip(obj.id)} src={Play} alt="play" />
                                                            </TooltipIndicator>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>
                                }
                            </>

                        )) : null :
                            <Box className={classes.customAccordion2}>
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={MonthlyImg} alt="img" />
                                                </Box>
                                                <Box sx={{ margin: 'auto', width: '485px', display: 'flex', justifyContent: 'end' }}>
                                                    <Typography className={classes.primarytext}>No Data Available</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                    }
                </Box>
                <Box style={{ width: '100%' }}>
                    <Box style={{ padding: "0px 10px 20px 10px" }}>
                        <div style={{ display: "flex", justifyContent: 'space-between', padding: '30px 0px 0px 0px' }}>
                            <Typography style={{ fontFamily: 'Nunito', fontSize: '16px', fontWeight: '600', color: "#404040" }}>
                                Other Payroll
                            </Typography>
                        </div>
                    </Box>
                </Box>
                <Box style={{ width: '100%' }}>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box onClick={navToUpcoming} className={classes.otherPayrollBox} style={{ cursor: 'pointer', display: "flex", justifyContent: 'space-between' }}>
                            <Box className={classes.flexBox}>
                                <img src={UpcomingImg} alt="img" />
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
                                    >Up Coming</Typography>
                                    <Typography className={classes.secondarytext}>{dashboardInfo.upcoming ? dashboardInfo.upcoming : '--'}</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.flexBox} p={2}>
                                <img src={NextBtn} alt="next" />
                            </Box>
                        </Box>
                        <Box onClick={navToSummary} className={classes.otherPayrollBox} style={{ cursor: 'pointer', display: "flex", justifyContent: 'space-between' }}>
                            <Box className={classes.flexBox}>
                                <img src={SummaryImg} alt="img" />
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
                                    >Summary</Typography>
                                    <Typography className={classes.secondarytext}>{dashboardInfo.summary ? dashboardInfo.summary : '--'}</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.flexBox} p={2}>
                                <img src={NextBtn} alt="next" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box style={{ width: '100%' }} pt={5} pb={2}>
                    <Box style={{display: 'flex', justifyContent: 'space-between' }}>
                        <Box onClick={navToSkipped} className={classes.otherPayrollBox} style={{ cursor: 'pointer', display: "flex", justifyContent: 'space-between' }}>
                            <Box className={classes.flexBox}>
                                <img src={SkippedImg} alt="img" />
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
                                    >Skipped</Typography>
                                    <Typography className={classes.secondarytext}>{dashboardInfo.skipped ? dashboardInfo.skipped : '--'}</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.flexBox} p={2}>
                                <img src={NextBtn} alt="next" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box >
        </Box >
    )
}

export default PayrollDashboard;