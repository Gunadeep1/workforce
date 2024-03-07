import { Avatar, Box, Breadcrumbs, CircularProgress, Grid, Grow, Paper, Stack } from '@mui/material'
import React, { useRef } from 'react'
import Button from '../../../components/customButton/Button'
import { useNavigate } from 'react-router-dom';
import LayoutStyles from '../DasboardStyles';
import Search from '../../../assets/client/greySearch.svg';
import { useState } from 'react';
import { BlackToolTip, addErrorMsg } from '../../../utils/utils';
import Text from '../../../components/customText/Text';
import EmployeeCreateAPI from '../../../apis/admin/employees/EmployeesApi';
import { useEffect } from 'react';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import info from '../../../assets/svg/redInfo.svg';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LocalStorage from '../../../utils/LocalStorage';


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

function PlacementInfo() {
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
    } = useComponentVisible(true);
    const [local, setLocal] = useState(LocalStorage.getExpenseCache());
    const navigate = useNavigate();
    const classes = LayoutStyles();
    const [placements, setPlacements] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [openConfigure, setOpenConfigure] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [rowData, setRowData] = useState({});
    const [searchImg, setSearchImg] = useState(true);

    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        search: searchName,
        employment: [],
        category: [],
        status: [],
        visa: [],
    })

    useEffect(() => {
        getPlacements(filterData); // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilterData({ ...filterData, limit: 4, page: 1, search: searchName });
            getPlacements({ ...filterData, limit: 4, page: 1, search: searchName });
            if (LocalStorage.getplacementCache() === null && searchName !== '') {
                let data = [{ name: searchName }]
                LocalStorage.setplacementCache(data)
                setLocal(data)
            }
            else {
                if (searchName !== '') {
                    let data = LocalStorage.getplacementCache()
                    let find = data.find((i) => i.name === searchName)
                    if (find === undefined || find === null) {
                        data.push({ name: searchName })
                        LocalStorage.setplacementCache(data)
                        setLocal(data)
                    }
                }
            }
            // Send Axios request here
        }, 300)

        return () => clearTimeout(delayDebounceFn)
        // eslint-disable-next-line
    }, [searchName])

    const handleSearch = (e) => {
        setIsComponentVisible(false)
        setSearchName(e.target.value);
        setFilterData({ ...filterData, limit: 4, page: 1, search: e.target.value });
        if (e.target.value.length > 0) {
            setSearchImg(false);
        } else {
            setSearchImg(true);
        }
    }

    const getPlacements = (args) => {
        EmployeeCreateAPI.getAllEmployees(args).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setPlacements(response.data.data);
                    setPagination(response.data.pagination)
                    // if (filterData.search !== "") {
                    //     setPlacements(response.data.data);
                    // } else {
                    //     let emp = placements;
                    //     let newArr = response.data.data;
                    //     let arr = emp.concat(newArr);
                    //     setPlacements(arr);
                    // }                    
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)

        })
    }

    const loadeMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: 1 });
        getPlacements({ ...filterData, limit: filterData.limit + 4, page: 1 });
    }

    const addPlacement = (args) => {
        setRowData(args);
        if (args.enable_placement == true) {
            navigate('/placements/addPlacement', { state: { empData: args, actionState: 'viewPlacement' } })
        } else {
            setOpenConfigure(true);
        }
    }

    const closeBtn = () => {
        setSearchName('');
        setSearchImg(true);
        setFilterData({ ...filterData, search: "" })
        EmployeeCreateAPI.getAllEmployees({ ...filterData, search: "" }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
            setPlacements(res.data.data);
            // setEmployees(res.data.data);
            setPagination(res.data.pagination);
        })
        // setFilter(filter.search="")
    }

    const removeExcess = (index) => {

        let data = LocalStorage.getplacementCache()
        if (data.length === 1) {
            setLocal(null)
            localStorage.removeItem('placementCache')
        }
        else {
            let data1 = data;
            data1.splice(index, 1);
            LocalStorage.setplacementCache(data1);
            setLocal([...data1])
        }
    }

    return (
        <Grid container lg={12} pl={15} justifyContent='center'>
            <Grid item lg={12} md={12} xs={12}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/dashboard')} >Placement Dashboard</Text>
                    <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>All Placements</Text>
                    <Text mediumBlack>Add Placement</Text>
                </Breadcrumbs>
            </Grid>
            <Grid item lg={7} textAlign='end' pt={3}>
                <Grid item lg={12} mb={5}>
                    <div style={{ height: "40px", width: '100%', border: "1.5px solid #EEEEEE", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                        <input
                            type="text"
                            name='searchName'
                            value={searchName}
                            className={classes.EmployeesSearchInput}
                            onChange={handleSearch}
                            onClick={() => { local.length > 0 && setIsComponentVisible(false) }}
                            placeholder="Search by Employee Name / Employee ID"
                        />
                        <button
                            type="button"
                            style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "45px", height: "38px", border: "none", backgroundColor: "#FFFFFF", borderRadius: "6px", }}
                        >
                            {searchImg ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={closeBtn} />}
                        </button>
                    </div>
                    {
                        !isComponentVisible &&
                        <Grow in={true}>
                            <Paper
                                sx={{ width: '54%', maxHeight: '160px', overflow: 'scroll', overflowX: 'hidden', position: 'absolute', top: '170px', zIndex: '1', borderRadius: '15px' }} ref={ref}
                            >

                                <Grid item container xs={12}>
                                    {
                                        local !== null && local.length > 0 &&
                                        <Grid item container xs={12} justifyContent={'flex-end'}>
                                            <Box>
                                                <Button onClick={() => { setLocal(null); localStorage.removeItem('placementCache') }}>Clear All</Button>
                                            </Box>
                                        </Grid>
                                    }
                                    {
                                        local !== null && local.map((i, index) => (
                                            <Box style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} onClick={() => { setSearchName(i.name); setFilterData({ ...filterData, limit: 4, page: 1, search: i.name }); setIsComponentVisible(true) }}>
                                                <Box pl={5} p={1} sx={{
                                                    cursor: 'pointer', fontFamily: "Nunito Sans, sans-serif !important",
                                                    fontSize: '14px !important',
                                                    fontWeight: '400 !important',
                                                }}>
                                                    {i.name}
                                                </Box>
                                                <Box p={1} sx={{ cursor: 'pointer', color: 'grey' }} onClick={(e) => { removeExcess(index); e.stopPropagation() }}>
                                                    X
                                                </Box>
                                            </Box>
                                            // <Grid item container lg={12} xs={12}>
                                            //     <Grid item xs={0.2}></Grid>
                                            //     <Grid item xs={10.8}>
                                            //         <Box pl={5} p={1} sx={{
                                            //             cursor: 'pointer', fontFamily: "Nunito Sans, sans-serif !important",
                                            //             fontSize: '14px !important',
                                            //             fontWeight: '400 !important',
                                            //         }} onClick={() => { setSearchName(i.name); setFilterData({ ...filterData, limit: 4, page: 1, search: i.name }); setIsComponentVisible(true) }}>
                                            //             {i.name}
                                            //         </Box>
                                            //     </Grid>
                                            //     <Grid item xs={1}>
                                            //         <Box p={1} sx={{ cursor: 'pointer', color: 'grey' }} onClick={() => { removeExcess(index) }}>
                                            //             X
                                            //         </Box>
                                            //     </Grid>
                                            // </Grid>
                                        ))
                                    }
                                </Grid>

                            </Paper>
                        </Grow>
                    }
                </Grid>
                {
                    placements.length !== 0 ? placements.map((item, index) => (
                        <Grid container lg={12} m={'25px 0px'} alignItems='center' sx={{
                            boxShadow: '5px 5px 10px 0px #0000000D !important', borderRadius: '10px !important',
                            height: '90px'
                        }}>
                            <Grid item container lg={6} alignItems='center'>
                                <Grid item lg={3}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Box sx={{ position: 'relative', display: 'flex' }}>
                                            <CircularProgress variant="determinate" value={item.profile_progress} size={60} thickness={1} sx={{ backgroundColor: "#F2F2F2", color: item.profile_progress == 100 ? 'green' : item.profile_progress <= 99 && item.profile_progress >= 40 ? 'orange' : item.profile_progress < 40 ? "red" : "", borderRadius: "100%" }} />
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
                                                <Box sx={{ display: "flex", padding: "3px", borderRadius: "50%", backgroundColor: "#ffffff" }}>
                                                    <BlackToolTip arrow title={
                                                        <Text mediumWhite sx={{ padding: '6px !important' }}> {`Profile Completion - ${item.profile_progress}%`}</Text>
                                                    }>
                                                        <Avatar
                                                            alt="Remy Sharp"
                                                            src={item.avatar == '' ? item.full_name[0] : item.profile_picture_url}
                                                            sx={{ width: 50, height: 50 }}
                                                        />
                                                    </BlackToolTip>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item container lg={9} spacing={2} alignItems='center'>
                                    <Grid item lg={7} textAlign='start'>
                                        <Text blackFont14 noWrap sx={{ cursor: 'pointer !important' }} onClick={() => navigate(`/employees/user-profile/${item.full_name}`, {
                                            state: {
                                                full_name: item.full_name, reference_id: item.reference_id, avatar_url: item.avatar_url, enable_login: item.enable_login, id: item.id
                                            }
                                        })}>
                                            {item.full_name === "" ? "--" : item.full_name}
                                        </Text>
                                        <Text mediumLabel pt={'5px'} noWrap>
                                            {item.reference_id === "" ? "--" : item.reference_id}
                                        </Text>
                                    </Grid>
                                    <Grid item lg={3}>
                                        <Text largeBlack noWrap>
                                            {item.visa_type === "" ? "--" : item.visa_type}
                                        </Text>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item container lg={5} spacing={2} justifyContent='flex-start' alignItems='center' sx={{ borderLeft: "1px solid rgba(226, 229, 230, 1)" }}>
                                <Grid item lg={5} textAlign='center' ml={-2}>
                                    {item.e_verified === "" ?
                                        <Text smallGrey noWrap>--</Text>
                                        : item.e_verified == 0 ?
                                            <Text mediumOrange noWrap>Pending</Text> :
                                            item.e_verified == 1 ? <Text smallGreen noWrap>E-Verified</Text> : <Text >--</Text>}
                                </Grid>
                                <Grid item lg={4}>
                                    {
                                        (item.e_verified !== 1 || item.is_pay_configuration_set == false) &&
                                        <BlackToolTip arrow title={
                                            <Text mediumWhite sx={{ padding: '6px !important' }}>
                                                {
                                                    (item.e_verified !== 1 && item.is_pay_configuration_set == false) ? 'To create a placement, kindly perform E-verification for the employee.' : item.e_verified !== 1 ? 'To create a placement, kindly perform E-verification for the employee.' : item.is_pay_configuration_set == false ? 'To create a placement, kindly add PayType Configuration for the employee.' : ''
                                                }</Text>
                                        } placement="top">
                                            <img src={info} alt='info' />
                                        </BlackToolTip>
                                    }
                                </Grid>
                                <Grid item lg={3}>
                                    {
                                        item.e_verified == 1 && item.is_pay_configuration_set == true ?
                                            <Button outlinedSmallAdd onClick={() => addPlacement(item)}>Add</Button> :
                                            <Button disablebutton>Add</Button>
                                    }
                                </Grid>
                            </Grid>
                            <ReusablePopup openPopup={openConfigure} setOpenPopup={setOpenConfigure} iconHide white fixedWidth>
                                <Box p={'10px 0px'} textAlign='center'>
                                    <Text blackFont14 noWrap>Please Configure payroll to add New Placement</Text>
                                    <Stack display='flex' flexDirection='row' gap={2} justifyContent='center' pt={5}>
                                        <Button popupSaveBlue onClick={() => navigate(`/employees/user-profile/${rowData.full_name}`,
                                            { state: { id: rowData.id, full_name: rowData.full_name, e_verify: rowData.e_verified, reference_id: rowData.reference_id, avatar_url: rowData.avatar, enable_login: '' } })}
                                        >Yes</Button>
                                        <Button popupCancel onClick={() => setOpenConfigure(false)}>No</Button>
                                    </Stack>
                                </Box>
                                {/* <PayrollUpdate setOpen={setOpenConfigure} id={rowData.id} /> */}
                            </ReusablePopup>
                        </Grid >
                    )) :
                        !loading &&
                        <Box sx={{ height: "50vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Text noWrap sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                No records Found
                            </Text>
                        </Box>
                }
                {
                    !loading &&
                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                        <Box sx={{ textAlign: "center", padding: "10px" }} mt={5}>
                            <Button outlineBlue onClick={() => loading ? null : loadeMore()}> {loading ? "Loading..." : "Load more"}</Button>
                        </Box> : null : null
                }
            </Grid >
        </Grid >
    )
}

export default PlacementInfo

