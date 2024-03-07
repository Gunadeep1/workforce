import { Box, Typography, Breadcrumbs, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import PayrollStyles from "../payroll/PayrollStyles";
import Text from "../../../components/customText/Text";
import { Link } from "react-router-dom";
import UpcomingImg from "../../../assets/svg/upcomingImg.svg";
import PayrollApi from "../../../apis/admin/payrollApi/PayrollApi";
import { addErrorMsg } from '../../../utils/utils';
import moment from "moment";

const UpcomingPayroll = () => {
    const classes = PayrollStyles();
    const [loading, setLoading] = useState(false);
    const [upcomingArray, setUpcomingArray] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filterData, setFilterData] = useState({
        limit: 3,
        page: 1,
    });

    useEffect(() => {
        upcomingAPIFunc(filterData);
        // eslint-disable-next-line
    }, [])

    const upcomingAPIFunc = (filter) => {
        setLoading(true);
        PayrollApi.upcomingAPI(filter).then((res) => {
            setTimeout(() => {
                setLoading(false);
                if (res.data.statusCode === 1003) {
                    setUpcomingArray(res.data.data);
                    setPagination(res.data.pagination)
                } else {
                    setUpcomingArray(res.data.data);
                    addErrorMsg(res.data.message);
                }
            }, 300)
        })
    }
    const loadMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 3, page: filterData.page + 1 });
        upcomingAPIFunc({ ...filterData, limit: filterData.limit + 3, page: 1 });
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ width: '80%' }} >
                <Box style={{ padding: '20px 10px 10px 10px' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/payroll' className={classes.linkStyle}><Text className={classes.navText1}>Payroll</Text></Link>
                        <Text className={classes.navText2}>Upcoming Payroll</Text>
                    </Breadcrumbs>
                </Box>
            </Box>
            <Box sx={{ width: '60%' }} pt={4} >
                <Box style={{ width: '100%' }}>
                    {
                        upcomingArray ? upcomingArray.length > 0 ? upcomingArray.map((obj, index) => (
                            <><Box className={classes.customAccordion2} key={index}>
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={UpcomingImg} alt="img" />
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
                                                        >{obj.payroll_cycle_name}</Typography>
                                                        {console.log(moment(upcomingArray[0].from_date).format('DD-MMM-YYYY'))}
                                                        <Typography className={classes.secondarytext}>{moment(obj.from_date).format('DD-MMM-YYYY')} - {moment(obj.to_date).format('DD-MMM-YYYY')}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box >
                                                <Typography pr={3} className={classes.primarytext}>{moment(obj.check_date).format('DD-MMM-YYYY')}</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box></>
                        )) : null :
                            <Box className={classes.customAccordion2}>
                                <Box >
                                    <Stack direction='row' spacing={2} width='100%' >
                                        <Box className={classes.AccordionSummaryBox2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'flex' }} p={1} >
                                                <Box>
                                                    <img src={UpcomingImg} alt="img" />
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

export default UpcomingPayroll;