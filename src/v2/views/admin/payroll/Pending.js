import React, { useEffect } from "react";
import { Box, Typography, Breadcrumbs, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PayrollStyles from "../payroll/PayrollStyles";
import { TooltipIndicator } from '../../../theme';
import Text from "../../../components/customText/Text";
import Dollar from "../../../assets/dollar.png";
import Play from "../../../assets/svg/PlayBtn.svg";
import { useState } from "react";
import LocalStorage from "../../../utils/LocalStorage";
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import { useNavigate } from "react-router-dom";
import ReusablePopup from "../../../components/reuablePopup/ReusablePopup";
import SkipPopupImg from "../../../assets/svg/skipPopupImg.svg";
import Button from '../../../components/customButton/Button';
import MonthlyImg from "../../../assets/svg/monthlyImg.svg";
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import CircularProgress from '@mui/material/CircularProgress';

const Pending = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const status_id = state ? state.status : null;
    const [loading, setLoading] = useState(false);
    const [pendingArray, setPendingArray] = useState([]);
    const [pagination, setPagination] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const classes = PayrollStyles();
    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        status: status_id
    })
    const [generateLoad, setGenerateLoad] = useState(0);
    const [skipId, setSkipId] = useState('');

    const playSkip = (id) => {
        setSkipId(id)
        setOpenDialog(true)
    }
    const closePlaySkip = () => {
        setOpenDialog(false)
    }

    useEffect(() => {
        getViewAllinfo(filterData);
        // eslint-disable-next-line
    }, []);

    const getViewAllinfo = (filter) => {
        setLoading(true)
        PayrollApi.getViewAllinfo(filter).then((res) => {
            setTimeout(() => {
                setLoading(false)
                if (res.data.statusCode === 1003) {
                    setPendingArray(res.data.data);
                    setPagination(res.data.pagination);
                } else {
                    setPendingArray(res.data.data);
                    addErrorMsg(res.data.message);
                }
            }, 300)
        })
    }
    const loadMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: filterData.page + 1 });
        getViewAllinfo({ ...filterData, limit: filterData.limit + 4, page: 1 });
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
                navigate('/payroll-view', { state: { status: status, name: name, payroll_configuration_id: id, from_date: from_date, to_date: to_date, viewAll: 'pending' } })
            } else {
                setGenerateLoad(0);
                addErrorMsg(response.data.message);
            }
        });
    }

    const skipRecord = () => {
        PayrollApi.skippedApi(skipId).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setOpenDialog(false);
                    addSuccessMsg(res.data.message);
                    getViewAllinfo({ ...filterData, page: 1, limit: 4 });
                }
            })
        })
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
                            <Button
                                onClick={skipRecord}
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
            <Box sx={{ width: '80%' }} >
                <Box style={{ padding: '20px 10px 10px 10px' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/payroll' className={classes.linkStyle}><Text className={classes.navText1}>Payroll</Text></Link>
                        <Text className={classes.navText2}>Pending</Text>
                    </Breadcrumbs>
                </Box>
            </Box>
            <Box sx={{ width: '60%' }} pt={2} >
                <Box pt={2}>
                    <Typography style={{ fontFamily: 'Nunito', fontSize: '16px', fontWeight: '600', color: "#404040" }}>
                        Pending
                    </Typography>
                </Box>
                <Box style={{ width: '100%' }}>
                    {
                        pendingArray ? pendingArray.length > 0 ? pendingArray.map((obj, index) => (
                            <><Box className={classes.customAccordion2} key={index} >
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
                                                    {generateLoad == obj.id ? <CircularProgress /> : !generateLoad && <img src={Dollar} onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} alt="dollar" />}

                                                    {generateLoad !== obj.id ? <Typography className={classes.linkText}>Generate</Typography> : <Typography className={classes.linkText}>Loading...</Typography>}
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                                    <TooltipIndicator
                                                        title={<Text smallWhite>Payroll Will Be Skipped</Text>}
                                                        placement='right-start'>
                                                        <img onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} style={{ cursor: !generateLoad ? 'pointer' : 'not-allowed' }} onClick={!generateLoad ? () => playSkip(obj.id) : undefined} src={Play} alt="play" />
                                                    </TooltipIndicator>
                                                </Box>
                                                {/* <Box sx={{ cursor:'pointer' }} onClick={() => handleGeneratePayroll('Pending', obj.pay_config_setting_name, obj.id, obj.from_date, obj.to_date)} className={classes.flexBox} gap={1}>
                                                    {generateLoad == obj.id ? <CircularProgress /> :<img src={Dollar} alt="dollar" />}
                                                    <Typography className={classes.linkText}>Generate</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                                    <img onClick={playSkip} src={Play} alt="play" />
                                                </Box> */}
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
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
            </Box>
            {
                !loading &&
                    pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                    <Box style={{ textAlign: "center", padding: "10px", }}>
                        <button
                            onClick={() => loading ? null : loadMore()}
                            type="button"
                            style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                        >
                            {loading ? "Loading..." : "Load more"}
                        </button>
                    </Box> : null : null
            }
        </Box>
    )
}

export default Pending;