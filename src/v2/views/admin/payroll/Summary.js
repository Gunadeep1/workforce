import { Box, Typography, Breadcrumbs, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import PayrollStyles from "../payroll/PayrollStyles";
import Text from "../../../components/customText/Text";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SummaryImg from "../../../assets/svg/summaryImg.svg";
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import { addErrorMsg } from '../../../utils/utils';

const Summary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location; // eslint-disable-next-line
    const status_id = state ? state.status : null;
    const [loading, setLoading] = useState(false);
    const [summaryArray, setSummaryArray] = useState([]);
    const [pagination, setPagination] = useState({});
    const classes = PayrollStyles();
    const [filterData, setFilterData] = useState({
        limit: 3,
        page: 1,
        status: 'Submitted'
    });

    useEffect(() => {
        getViewAllinfo(filterData);
        // eslint-disable-next-line
    }, []);

    const getViewAllinfo = (filter) => {
        setLoading(true);
        PayrollApi.getViewAllinfo(filter).then((res) => {
            setTimeout(() => {
                setLoading(false)
                if (res.data.statusCode === 1003) {
                    setSummaryArray(res.data.data);
                    setPagination(res.data.pagination)
                    console.log("Pagination--->", res.data.pagination);
                } else {
                    setSummaryArray(res.data.data);
                    addErrorMsg(res.data.message)
                }
            }, 300)
        })
    }

    const loadMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 3, page: filterData.page + 1 });
        getViewAllinfo({ ...filterData, limit: filterData.limit + 3, page: 1 });
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ width: '80%' }} >
                <Box style={{ padding: '20px 10px 10px 10px' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/payroll' className={classes.linkStyle}><Text className={classes.navText1}>Payroll</Text></Link>
                        <Text className={classes.navText2}>Summary</Text>
                    </Breadcrumbs>
                </Box>
            </Box>
            <Box sx={{ width: '60%' }} pt={3} >
                <Box style={{ width: '100%' }}>
                    {
                        summaryArray ? summaryArray.length > 0 ? summaryArray.map((obj, index) => (
                            <><Box className={classes.customAccordion2} key={index}>
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={SummaryImg} alt="img" />
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
                                                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate("/payroll-summary", { state: { name: obj.pay_config_setting_name, status: 'Summary', payroll_configuration_id: obj.id, from_date: obj.from_date, to_date: obj.to_date } })}>
                                                    <Typography className={classes.linkText}>View</Typography>
                                                </Box>

                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box></>)) : null :
                            <Box className={classes.customAccordion2}>
                                <Box>
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={SummaryImg} alt="img" />
                                                </Box>
                                                <Box sx={{ margin: 'auto', width: '455px', display: 'flex', justifyContent: 'end' }}>
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
                    pagination && pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                    <Box style={{ textAlign: "center", padding: "10px", }}>
                        <button
                            onClick={() => loading ? null : loadMore()}
                            type="button"
                            style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                        >
                            {loading ? "Loading..." : "Load more"}
                        </button>
                    </Box> : null : 'No data Available'
            }
        </Box>

    )
}

export default Summary;