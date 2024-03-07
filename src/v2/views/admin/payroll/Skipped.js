import { Box, Typography, Breadcrumbs, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import PayrollStyles from "../payroll/PayrollStyles";
import Text from "../../../components/customText/Text";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SkippedImg from "../../../assets/svg/skippedImg.svg";
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import { addErrorMsg } from '../../../utils/utils';

const Skipped = () => {
    const location = useLocation();
    const { state } = location; // eslint-disable-next-line
    const status_id = state ? state.status : null;
    const [loading, setLoading] = useState(false);
    const [skippedArray, setSkippedArray] = useState([]);
    const [pagination, setPagination] = useState({});
    const classes = PayrollStyles();
    const [success, setSuccess] = useState(false);
    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        status: 'Skipped'
    })
    const navigate = useNavigate();


    useEffect(() => {
        getViewAllinfo(filterData);
        // eslint-disable-next-line
    }, []);

    const getViewAllinfo = (filter) => {
        setLoading(true)
        PayrollApi.getViewAllinfo(filter).then((res) => {
            setTimeout(() => {
                setLoading(false);
                if (res.data.statusCode === 1003) {
                    if (res.data.data.length) {
                        setSuccess(true);
                        setSkippedArray(res.data.data);
                        setPagination(res.data.pagination);
                    }
                    
                } else {
                    setSuccess(false);
                    addErrorMsg(res.data.message)
                }
            }, 300)
        })
    }

    const loadMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: filterData.page + 1 });
        getViewAllinfo({ ...filterData, limit: filterData.limit + 4, page: 1 });
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ width: '80%' }} >
                <Box style={{ padding: '20px 10px 10px 10px' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/payroll' className={classes.linkStyle}><Text className={classes.navText1}>Payroll</Text></Link>
                        <Text className={classes.navText2}>Skipped</Text>
                    </Breadcrumbs>
                </Box>
            </Box>
            <Box sx={{ width: '60%' }} pt={3} >
                <Box style={{ width: '100%' }}>
                    {
                        success ? skippedArray.map((obj, index) => (
                            <Box className={classes.customAccordion2} key={index}>
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={SkippedImg} alt="img" />
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
                                                        >{obj.pay_config_setting_name}</Typography>
                                                        <Typography className={classes.secondarytext}>{obj.from_date} - {obj.to_date}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box >
                                                <Typography className={classes.primarytext}>{obj.check_date}</Typography>
                                            </Box>
                                            <Box className={classes.flexBox} pr={5}>
                                                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate("/payroll-summary", { state: { name: obj.pay_config_setting_name, status: 'Skipped', payroll_configuration_id: obj.id, from_date: obj.from_date, to_date: obj.to_date } })}>
                                                    <Typography className={classes.linkText}>View</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        )) :
                            <Box className={classes.customAccordion2} >
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={SkippedImg} alt="img" />
                                                </Box>
                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box mx={2} >
                                                        {
                                                            success ? <><Typography pb={1}
                                                                sx={{
                                                                    fontFamily: 'Nunito',
                                                                    fontSize: '14px',
                                                                    fontWeight: '600',
                                                                    lineHeight: '17px',
                                                                    letterSpacing: '0em',
                                                                    textAlign: 'left',
                                                                    color: '#000000'
                                                                }}
                                                            >--</Typography>
                                                                <Typography className={classes.secondarytext}>--</Typography></> : null
                                                        }
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box >
                                                {
                                                    success ? <Typography className={classes.primarytext}>Neet to fetch data from API</Typography> : <Typography className={classes.primarytext}>No Data Available</Typography>
                                                }
                                            </Box>
                                            <Box className={classes.flexBox} pr={5}>
                                                <Box>
                                                    {
                                                        success && <Typography className={classes.linkText}>View</Typography>
                                                    }
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

export default Skipped;