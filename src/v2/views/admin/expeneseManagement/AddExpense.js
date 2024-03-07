import React, { useEffect, useRef } from "react";
import { Avatar, Box, Typography, Stack, CircularProgress, Tooltip, tooltipClasses, Grid, Paper, Grow, Skeleton, Divider } from "@mui/material";
import { useState } from "react";
import Search from '../../../assets/svg/search2.svg'
import DashboardStyles from '../DasboardStyles';
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import EmployeeAPI from "../../../apis/admin/employees/EmployeesApi";
import { addErrorMsg } from "../../../utils/utils";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import Text from "../../../components/customText/Text";
import LocalStorage from "../../../utils/LocalStorage";
import Button from '../../../components/customButton/Button';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`&.${tooltipClasses.tooltip}`]: {
        backgroundColor: "#404040",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #404040"
    },
    [`&.${tooltipClasses.arrow}`]: {
        color: '#404040',
        "&::before": {
            backgroundColor: "#404040",
            border: "1px solid #404040"
        }
    }
}))

function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(
        initialIsVisible
    );
    const ref = useRef(null);

    const handleHideDropdown = (event) => {
        if (event.key === "Escape") {
            setIsComponentVisible(true);
        }
    };

    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(true);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleHideDropdown, true);
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("keydown", handleHideDropdown, true);
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { ref, isComponentVisible, setIsComponentVisible };
}

export default function AddExpense(props) {
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
    } = useComponentVisible(true);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const classes = DashboardStyles();
    const [loading, setLoading] = useState(false);
    const [local, setLocal] = useState(LocalStorage.getExpenseCache());
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({});
    // const [selectedFilter, setSelectedFilter] = useState("");
    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        search: "",
        employment: [],
        category: [],
        status: [],
        visa: [],
    })

    const callApi = (args) => {
        // getAllPlacements(page, pageSize, args.target.value);
        // getApi(1, pageSizevalue, args.target.value);
        //   getAllTimeSheets(dumpData)
        setSearchValue(args.target.value);

        console.log(LocalStorage.getExpenseCache())
    }
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getAllEmployees({ ...filterData, limit: 4, page: 1, search: searchValue })
            if (LocalStorage.getExpenseCache() === null && searchValue !== '') {
                let data = [{ name: searchValue }]
                LocalStorage.setExpenseCache(data)
                setLocal(data)
            }
            else {
                if (searchValue !== '') {
                    let data = LocalStorage.getExpenseCache()
                    let find = data.find((i) => i.name === searchValue)
                    if (find === undefined || find === null) {
                        data.push({ name: searchValue })
                        LocalStorage.setExpenseCache(data)
                        setLocal(data)
                    }
                }
            }
            // Send Axios request here
        }, 300)

        return () => clearTimeout(delayDebounceFn)
        // eslint-disable-next-line
    }, [searchValue])

    const handleSearch = (e) => {
        setIsComponentVisible(false)
        setEmployees([])
        setFilterData({ ...filterData, limit: filterData.limit, page: 1, search: e.target.value })
        callApi(e);
        // getAllEmployees({ ...filterData, limit: 5, page: 1, search: e.target.value })
        console.log(filterData.search);
    }
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }


    const loadeMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: 1 });
        getAllEmployees({ ...filterData, limit: filterData.limit + 4, page: 1 });
    }

    const openForm = (Emp) => {
        navigate('/addExpenseForm', { state: { employeeData: Emp } })
        // navigate('/clients', { state: { page: 'Client' } })
    }

    useEffect(() => {
        getAllEmployees(filterData);
        // eslint-disable-next-line
    }, [])

    const getAllEmployees = (filter) => {
        EmployeeAPI.getAllEmployees(filter).then((response) => {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setEmployees(response.data.data);
                    setPagination(response.data.pagination);
                    // if (response.data.data.length === 0) {

                    // } else {

                    // }
                    // if (filterData.search !== "") {
                    //     setEmployees(response.data.data);
                    // } else {
                    //     let emp = employees;
                    //     let newArr = response.data.data;
                    //     let arr = emp.concat(newArr);
                    //     setEmployees(arr);
                    // }
                    // setPagination(response.data.pagination);
                } else {
                    addErrorMsg(response.data.message)
                }
            }, 400)
        })
    }


    const removeExcess = (index) => {

        let data = LocalStorage.getExpenseCache()
        if (data.length === 1) {
            setLocal(null)
            localStorage.removeItem('expenceCache')
        }
        else {
            let data1 = data;
            data1.splice(index, 1);
            LocalStorage.setExpenseCache(data1);
            setLocal([...data1])
        }
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
            <Box sx={{ width: '80%' }} >
                <Box style={{ padding: '20px 10px 10px 10px' }}>
                    {/* <Typography sx={{ fontSize: "18px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                        <span style={{ color: 'grey' }}> Expense Management / </span>  Add Expense
                    </Typography> */}
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/expense-management' className={classes.linkStyle}><Text className={classes.navText1}>Expense Management</Text></Link>
                        <Text className={classes.navText2}>Add Expense</Text>
                    </Breadcrumbs>
                </Box>
            </Box>

            <Box sx={{ width: '80%' }} pt={2} pb={1} ref={ref}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                    <div style={{ height: '40px', border: "1.5px solid rgba(199, 204, 211, 1)", width: "60%", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                        <input
                            type="text"
                            value={filterData.search}
                            className={classes.EmployeesSearchInput2}
                            onChange={handleSearch}
                            onClick={()=>{local.length > 0 && setIsComponentVisible(false)}}
                            placeholder="Search Employee Name / ID"
                        />
                        <button
                            type="button"
                            style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "45px", height: "38px", border: "none", backgroundColor: "#FFFFFF", borderRadius: "6px", }}
                        >
                            <img src={Search} alt="Search" />
                        </button>
                    </div>
                </div>
            </Box>
            {
                !isComponentVisible &&
                <Grow in={true}>
                    <Paper
                        sx={{ width: '48%', maxHeight: '160px', overflow: 'scroll', overflowX: 'hidden', position: 'absolute', top: '205px', zIndex: '1', borderRadius: '15px' }} ref={ref}
                    >

                        <Grid container xs={12}>
                            {
                                local !== null && local.length > 0 &&
                                <Grid item container xs={12} justifyContent={'flex-end'}>
                                    <Box>
                                        <Button onClick={() => { setLocal(null); localStorage.removeItem('expenceCache') }}>Clear All</Button>
                                    </Box>
                                </Grid>
                            }
                            {
                                local !== null && local.map((i, index) => (
                                    <Grid container xs={12}>
                                        <Grid item xs={0.2}></Grid>
                                        <Grid item xs={10.8}>
                                            <Box pl={5} p={1} sx={{
                                                cursor: 'pointer', fontFamily: "Nunito Sans, sans-serif !important",
                                                fontSize: '14px !important',
                                                fontWeight: '400 !important',
                                            }} onClick={() => { setSearchValue(i.name); setFilterData({ ...filterData, search: i.name }); setIsComponentVisible(true) }}>
                                                {i.name}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Box p={1} sx={{ cursor: 'pointer', color: 'grey' }} onClick={() => { removeExcess(index) }}>
                                                X
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>

                    </Paper>
                </Grow>
            }

            <Box style={{ width: '60%' }}>
                {
                    loading ?
                        [1, 2, 3, 4,].map((item) => (
                            <Stack key={item} direction="row" my={0} px={2} py={2} spacing={2} sx={{ width: "100%", boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05)", borderRadius: "20px" }}>
                                <Box sx={{ width: "70%", display: "flex", alignItems: "center", gap: 2, }}>
                                    <Skeleton variant="circular" sx={{ width: "56px", height: "50px" }} />
                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box>
                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "10rem" }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "5rem" }} />
                                                <Divider orientation="vertical" flexItem sx={{ border: '1px solid #FAFAF !important', borderRadius: '8px' }} />
                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "3rem" }} />
                                            </Box>

                                        </Box>
                                        <Box mr={15}>
                                            <Skeleton variant="text" sx={{ fontSize: '16px', width: "7rem" }} />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ width: "30%", display: "flex", alignItems: "center", gap: 2, }}>

                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: '0px 20px 0px 30px ' }}>
                                        <Skeleton variant="circular" sx={{ height: '20px', width: '20px' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '10px', width: "2rem" }} />
                                    </Box>

                                </Box>
                            </Stack>
                        ))
                        : !loading && employees.length == 0 ? <Box sx={{ height: "50vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Text sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                No records Found
                            </Text>
                        </Box> : !loading && employees.length > 0 ?
                            employees.map((Emp, key) => (
                                <Box
                                    key={key}
                                    className={classes.customAccordion}
                                    expanded={expanded === `panel${key}`}
                                    onChange={handleChange(`panel${key}`)}
                                >
                                    <Box pt={1}>
                                        <Stack direction='row' spacing={2} width='100%'>
                                            <Box className={classes.AccordionSummaryBox}>
                                                <Box sx={{ position: 'relative', display: 'flex' }}>
                                                    <CircularProgress variant="determinate" value={Emp.profile_progress} size="4.2rem" thickness={2} sx={{ backgroundColor: "#F2F2F2", color: Emp.profile_progress > 99 ? "green" : Emp.profile_progress > 40 ? "orange" : "red", borderRadius: "100%", }} />
                                                    <Box
                                                        sx={{
                                                            top: 0,
                                                            left: 0,
                                                            bottom: 0,
                                                            right: 0,

                                                            position: 'absolute',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', padding: '3px', borderRadius: '50%', backgroundColor: '#ffffff' }}>
                                                            <HtmlTooltip
                                                                placement='bottom'
                                                                arrow
                                                                title={
                                                                    <React.Fragment>
                                                                        <Box>
                                                                            <Typography className={classes.profileTooltipText}>
                                                                                {`profile Completion- ${Emp.profile_progress}%`}
                                                                            </Typography>
                                                                        </Box>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                                <Avatar
                                                                    alt='Remy Sharp'
                                                                    src={Emp.profile_picture_url}
                                                                    sx={{ width: 56, height: 56 }}
                                                                />
                                                            </HtmlTooltip>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box mx={2}>
                                                        <Typography className={classes.primarytext}>
                                                            {Emp.full_name === '' ? "--" : Emp.full_name}
                                                            {/* {Emp.e_verified ? <img src={Component87} alt="svg" style={{ margin: '0px 6px' }} /> : null} */}
                                                        </Typography>
                                                        <Typography className={classes.secondarytext}>
                                                            {Emp.reference_id === '' ? "--" : Emp.reference_id}
                                                        </Typography>
                                                    </Box>
                                                    <Box mx={3} sx={{ width: '20%', alignSelf: 'center' }}>
                                                        <Typography className={classes.textVisaType}>
                                                            {Emp.visa_type === null ? "--" : Emp.visa_type}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box sx={{ width: '40%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", gap: "100px" }}>
                                                    <Typography className={classes.linkText} sx={{ color: 'green !important' }}>E-verified</Typography>
                                                    <Button
                                                        style={{
                                                            width: '79px',
                                                            height: '35px',
                                                            fontFamily: "Nunito Sans, sans-serif !important",
                                                            fontSize: '14px !important',
                                                            fontWeight: '400 !important',
                                                            padding: '8px 24px 8px 24px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #318CF1',
                                                            gap: '8px',
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onClick={() => openForm(Emp)}>Add</Button>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                            )) : ''
                }

                {
                    !loading && employees.length > 0 &&
                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                        <Box style={{ textAlign: "center", padding: "10px", }} mt={5}>
                            <Button outlineBlue onClick={() => loading ? null : loadeMore()}> {loading ? "Loading..." : "Load more"}</Button>
                            {/* <button
                                onClick={() => loading ? null : loadeMore()}
                                type="button"
                                style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                            >
                                {loading ? "Loading..." : "Load more"}
                            </button> */}
                        </Box>
                        : null : null
                }
            </Box>

        </Box >
    );
}
