import React, { Fragment, useState, useEffect } from "react";
import { Box, Breadcrumbs, Grid, Avatar, Stack, Pagination, TableRow, TableCell, Skeleton, Menu, MenuItem, SwipeableDrawer } from "@mui/material";
import PlacementDashboardStyles from './PlacementDashboardStyles';
import Button from "../../../components/customButton/Button";
import Text from '../../../components/customText/Text';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg';
import SearchGlobal from '../../../assets/svg/search2.svg';
import TableAccordion from "../../../components/tableAccordion/TableAccordion";
import moment from 'moment';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat, getCurrencySymbol } from '../../../../v2/utils/utils';
import PlacementApi from "../../../apis/admin/placements/PlacementApi";
import Downloadcloud from '../../../assets/svg/download-cloud.svg';
import FilterCard from './FilterCard';
import TotalPlacementsIcon from '../../../assets/svg/TotalPlacementsIcon.svg';
import ActivePlacementsIcon from '../../../assets/svg/ActivePlacementsIcon.svg';
import PlacementsIcon from '../../../assets/svg/PlacementsIcon.svg';
import EndedPlacementIcon from '../../../assets/svg/EndedPlacments.svg';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { styled } from '@mui/system';
import LocalStorage from "../../../utils/LocalStorage";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchSelect from '../../../components/selectField/SearchSelect';
import DatePicker from '../../../components/datePicker/Date';
import disablePlus from '../../../assets/client/disablePlus.svg';
// import FileSaver from "file-saver";
import InvoicesApi from "../../../apis/admin/sales/InvoicesApi";

export default function Dashboard() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const navigate = useNavigate();
    const classes = PlacementDashboardStyles();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [searchImg, setSearchImg] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedItem, setSelectedItem] = useState("All");
    const [drawer, setDrawer] = useState(false); // eslint-disable-next-line
    const [clientDropdown, setClientDropdown] = useState([]);
    const [filter, setFilter] = useState({
        slug: location.state === null ? "total_placements" : location.state.slug,
        from_date: "",
        to_date: "",
        search: "",
    });

    const [cards, setCards] = useState([
        { id: 1, text: "Total Placements", slug: "total_placements", count: "", icon: TotalPlacementsIcon },
        { id: 2, text: "Active Placements", slug: "active_placements", count: "", icon: ActivePlacementsIcon },
        { id: 3, text: "Placements Ending In", slug: "ending_in_placements", count: "", icon: PlacementsIcon },
        { id: 4, text: "Ended Placements", slug: "ended_placements", count: "", icon: EndedPlacementIcon },
    ]);

    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );

    const StyledPagination = styled(Pagination)({
        "& .MuiPagination-ul li:last-child": {
            marginLeft: "13px",
            '& .MuiButtonBase-root': {
                border: 'none !important'
            },
        },
        "& .MuiPagination-ul li:last-child button::before": {
            content: "'Next'",
            marginRight: "8px",
        },
        "& .MuiPagination-ul li:first-child": {
            marginRight: "13px",
            '& .MuiButtonBase-root': {
                border: 'none !important'
            },
        },
        "& .MuiPagination-ul li:first-child button::after": {
            content: "'Prev'",
            marginLeft: "8px",
        },
        '& .MuiButtonBase-root': {
            border: "1px solid #F1F1F1 ",
            color: "#333333 !important",
            font: "13px Nunito, Nunito Sans, sans-serif !important",
            fontWeight: '600 !important'
        },
        '& .MuiButtonBase-root.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: '#2F80ED !important',
            color: '#FFFFFF !important',
            border: "1px solid #2F80ED !important"
        },
        '& .MuiPaginationItem-icon': {
            display: 'none',
        },
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    useEffect(() => {
        cards.forEach(ele => {
            getFilterPlacement({ slug: ele.slug, from_date: "", to_date: "" });
        });
        clientDropdownApi()
        getPlacementListing(filter, pagination);
        // eslint-disable-next-line
    }, []);


    const clientDropdownApi = () => {
        InvoicesApi.clientDropdownApi('').then((res) => {
            if (res.data.statusCode === 1003) {
                setClientDropdown(res.data.data);
            } else {
                setClientDropdown([]);
            }
        })
    }

    const getFilterPlacement = (data) => {
        PlacementApi.getFilterPlacement(data).then((response) => {
            if (response.data.statusCode == 1003) {
                let arr = cards;
                arr[arr.findIndex((i) => i.slug === data.slug)].count = response.data.data[data.slug]
                setCards([...arr]);
            }
        });
    };

    const getPlacementListing = (data, paginationData) => {
        setLoading(true);
        PlacementApi.getPlacementListing(data, paginationData).then((response) => {
            setTimeout(() => {
                setLoading(false);
                if (response.data.statusCode == 1003) {
                    setList(response.data.data);
                    setPagination({ ...response.data.pagination });
                }
            }, 400);

        });
    };

    const getFilterPlacementData = (slug, filterType) => {
        let fromDate = "";
        let toDate = "";
        switch (filterType) {
            case 'all':
                setSelectedItem("All")
                getFilterPlacement({ slug: slug, from_date: "", to_date: "" });
                break;
            case 'this_month':
                setSelectedItem("This Month")
                fromDate = moment().startOf('month').format(dateFormat());
                toDate = moment().format(dateFormat());
                getFilterPlacement({ slug: slug, from_date: fromDate, to_date: toDate });
                break;
            case 'last_three_months':
                setSelectedItem("Last 3 months")
                fromDate = moment().subtract(3, 'months').format(dateFormat());
                toDate = moment().format(dateFormat());
                getFilterPlacement({ slug: slug, from_date: fromDate, to_date: toDate });
                break;
            case 'last_six_months':
                setSelectedItem("Last 6 months")
                fromDate = moment().subtract(6, 'months').format(dateFormat());
                toDate = moment().format(dateFormat());
                getFilterPlacement({ slug: slug, from_date: fromDate, to_date: toDate });
                break;
            default:
                break;
        }
        setFilter({ slug: slug, from_date: fromDate, to_date: toDate, search: "" });
        pagination['currentPage'] = 1
        setPagination(pagination)
        setAnchorEl(null)
        getPlacementListing({ slug: slug, from_date: fromDate, to_date: toDate, search: "" }, pagination);
    }

    const handleExportSubmit = () => {
        console.log(exportData,"data")
        PlacementApi.exportPlacement(exportData, LocalStorage.getAccessToken()).then(res => {
            if (res.data.statusCode == 1003) {
                addSuccessMsg(res.data.message);
                // FileSaver.saveAs(res.data.path);
                console.log(res.data.path)
                const url = res.data.path;
                const link = document.createElement('a');
                link.href = url;
                let file_name = url.split('/').pop();
                link.setAttribute('download',file_name);
                document.body.appendChild(link);
                link.click();
                setDrawer(false)
                setExportData({  
                    request_id: LocalStorage.uid(),
                    client_id: '',
                    from_date: '',
                    to_date: '',
                  })
               
            } else if (res.data.statusCode == 1013) {
                addWarningMsg(res.data.message);
                // setDrawer(false)
               
            } else {
                addErrorMsg(res.data.message);
                // setDrawer(false)
                
            }
            // setExportData({  
            //     request_id: LocalStorage.uid(),
            //     client_id: '',
            //     from_date: '',
            //     to_date: '',
            //   })
        })
    }

    const handleSearch = (e) => {
        const text = e.target.value;
        if (text.length > 0) {
            setSearchImg(false);
        } else {
            setSearchImg(true);
        }
        setFilter({ ...filter, search: text })
        setTimeout(() => {
            PlacementApi.getPlacementListing({ ...filter, search: text.length > 1 ? text : '' }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
                setList(res.data.data);
                setPagination(res.data.pagination);
            })
        }, 400);
    }

    const handleChangePagination = (e, page) => {
        let paginationData = { ...pagination, currentPage: page };
        setPagination({ ...paginationData });
        getPlacementListing(filter, paginationData);
    }

    const closeBtn = () => {
        setSearchImg(true)
        setFilter({ ...filter, search: "" })
        PlacementApi.getPlacementListing({ ...filter, search: "" }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
            setList(res.data.data);
            setPagination(res.data.pagination);
        })
    }

    const Rows = list.map((data, index) => ({
        // id: data.serial_number,
        id: index + 1,
        main_row_data: [
            <Box display="flex" alignItems="center" onClick={() => { navigate('/placements/addPlacement', { state: { data: data, actionState: 'edit', slug: filter.slug } }); LocalStorage.setPlacementID(data.id) }}>
                <Avatar alt={`${data.employee_name}`} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    {
                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true)) ?
                            <Text className={filter.slug == "ended_placements" ? classes.endedPlacementText : classes.placementText} onClick={(e) => {
                                e.stopPropagation(); navigate(`/employees/user-profile/${data.employee_name}`, {
                                    state: {
                                        full_name: data.employee_name, reference_id: data.employee_reference_id, avatar_url: data.profile_picture_url, enable_login: '', id: data.employee_id
                                    }
                                })
                            }}>{data.employee_name}</Text> :
                            <Text smallGrey>{data.employee_name}</Text>
                    }
                    <Text smallGrey nowrap sx={{ paddingTop: '5px !important' }}>{data.employee_reference_id}</Text>
                </Box>
            </Box>,
            <Box textAlign='center'>
                {
                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_edit" && item.is_allowed == true)) ?
                        <Text className={filter.slug == "ended_placements" ? classes.endedPlacementText : classes.RefText} onClick={(e) => { e.stopPropagation(); navigate('/placements/addPlacement', { state: { data: data, actionState: 'edit', slug: filter.slug } }); LocalStorage.setPlacementID(data.id) }}>{data.reference_id}</Text> :
                        <Text smallBlack nowrap>{data.reference_id}</Text>
                }
            </Box>,
            <Box textAlign='center'>
                <Text smallBlack >{data.client_name}</Text>
            </Box>,
            <Box textAlign='center'>
                <Text smallBlack >{data.project_start_date}</Text>
            </Box>,
            <Box textAlign='center'>
                <Text smallBlack >{data.timesheet_cycle ? data.timesheet_cycle : ' -- '}</Text>
            </Box>,
            <Box textAlign='center'>
                <Text smallBlack >{data.bill_rate ? `${getCurrencySymbol()}${data.bill_rate}` : ' -- '}</Text>
            </Box>,
            <Box>
            </Box>
        ],
        sub_row_content: [
            <Box sx={{ paddingTop: '18px', width: '100%', height: '82px', backgroundColor: '#FAFAFA', borderRadius: '10px', justifyContent: 'space-around', display: 'flex', }}>
                <Box width={'100%'}>
                    <Text className={classes.text1}>
                        Project Name
                    </Text>
                    <Text my={1} className={classes.text2}>
                        {data.project_name}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classes.text1}>
                        Notice Period
                    </Text>
                    <Text my={1} className={classes.text2}>
                        {data.notice_period}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classes.text1}>
                        Project End Date
                    </Text>
                    <Text my={1} className={classes.text2}>
                        {data.project_end_date}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classes.text1}>
                        End Client Name
                    </Text>
                    <Text my={1} className={classes.text2}>
                        {data.endclient_name}
                    </Text>
                </Box>
            </Box>
        ]
    }));

    const Columns = [
        { 'name': 'Employee Name', 'width': '200px' },
        { 'name': 'Placement ID', 'width': '211px' },
        { 'name': 'Client Name', 'width': '211px' },
        { 'name': 'Project Start Date', 'width': '211px' },
        { 'name': 'Timesheet Cycle', 'width': '211px' },
        { 'name': 'Bill Rate', 'width': '150px' },
        { 'name': '', 'width': '52px' },
    ]

    const TableRowSkeletonLoader = ({ rowsNum }) => {
        return [...Array(rowsNum)].map((row, index) => (
            <Box key={index} sx={{ width: "100%", display: "flex", alignItems: "center", borderRight: "1px solid rgba(226, 229, 230, 1)" }}>
                <TableRow key={index}>
                    <TableCell component="th" scope="row">
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "19rem" }} />
                    </TableCell>
                </TableRow>
            </Box>
        ));
    };

    const [exportData, setExportData] = useState({
        request_id: LocalStorage.uid(),
        client_id: '',
        from_date: '',
        to_date: '',      
    });
    
    const excelHandleChange = (e) => {
        exportData[e.target.name] = e.target.value;
        setExportData({ ...exportData });
    }

    const cancelExport = () => {
        setDrawer(false)
        setExportData({  
            // request_id: LocalStorage.uid(),
            client_id: '',
            from_date: '',
            to_date: '',
          })
    }

    const dateChange = (e, name) => {
        let date = e.$d
        setExportData({
            ...exportData,
            [name]: moment(date).format(dateFormat())
        },)
    }

    const ExportView = () => (
        <Box sx={{
            width: '488px', height: '100vh',
            overflow: "auto",
            '&::-webkit-scrollbar': {
                width: '4px',
            },
            '&::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px #ffffff',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#C7CCD3',
                outline: '1px solid #C7CCD3',
                borderRadius: "4px",
            }
        }}>

            <Box height={'10vh'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={'0px 16px 0px 32px'} >
                <Text BlackExtraDark>Export</Text>
                {/* <Box onClick={() => setDrawer(false)} sx={{ cursor: 'pointer' }}>
                    <CloseIcon />
                </Box> */}

            </Box>


            <Box width={'100%'} height={'85vh'} px={4}>

                <Grid container spacing={3}>
                    <Grid item lg={12} sx={{ marginTop: '10px' }}>
                        <SearchSelect
                            labelText={'Client Name'}
                            options={clientDropdown}
                            value={exportData.client_id}
                            name={'client_id'}
                            onChange={excelHandleChange}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <DatePicker
                            name={'from_date'}
                            onChange={(e, args) => dateChange(e, 'from_date')}
                            labelText={'From Date'}
                            value={exportData.from_date}
                            maxDate={moment().format(dateFormat())}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <DatePicker
                            name={'to_date'}
                            onChange={(e, args) => dateChange(e, 'to_date')}
                            labelText={'To Date'}
                            value={exportData.from_date}
                            minDate={exportData.from_date}
                        />
                    </Grid>
                </Grid>


            </Box>

            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={3} height={'40px'} pr={'26px'} >
                <Button exportSmall sx={{ height: '40px !important', width: '90px !important', font: '16px Nunito !important', fontWeight: `${600}`, }} onClick={() => handleExportSubmit()}>Export</Button>
                <Button outlineBlue redHover sx={{ height: '40px !important', width: '90px !important', font: '16px Nunito !important', fontWeight: `${600}` }} onClick={() => cancelExport()}>Cancel</Button>
            </Box>

        </Box >
    );


    return (<>
        <Box className={classes.containerMain} >
            <Box width={'100%'} mb={'47px'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Text mediumGrey >Placement Dashboard</Text>
                    <Text mediumBlack >All Placements</Text>
                    {/* <Text className={classes.navText2}>All Placement</Text> */}
                </Breadcrumbs>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Button outlineBlue onClick={() => navigate('/placements/dashboard')} sx={{ height: '36px !important' }}>Dashboard</Button>
                    {
                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_create" && item.is_allowed == true)) ?
                            <Button addNew startIcon={<Plus />} onClick={() => navigate('/placements/placementsInfo')} sx={{ height: '36px !important', minWidth: '167px !important', fontWeight: `${400} !important`, }} px={2}>Add Placement</Button> :
                            <Button addNewDisable sx={{ height: '36px !important', minWidth: '167px !important', fontWeight: `${400} !important`, }} px={2}><img src={disablePlus} alt="add" style={{ marginRight: "10px" }} />Add Placement</Button>
                    }
                    <button
                        type="button"
                        style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "34px", height: "34px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}
                        onClick={() => setDrawer(true)}
                    >
                        <img src={Downloadcloud} alt="Userplus" />
                    </button>

                </Box>
            </Box>

            <Grid container rowSpacing={'22px'}>
                <Grid container spacing={4}>
                    {
                        cards.map((item, key) => (
                            <Grid key={key} item lg={3} md={3} sm={12} xs={12}>
                                <FilterCard item={item} filter={filter} getFilterPlacementData={getFilterPlacementData} />
                            </Grid>
                        ))
                    }
                </Grid>
                <Grid item container lg={12} justifyContent='space-between' width='100%'>
                    <div className={classes.searchField}>
                        <input
                            type="text"
                            value={filter.search}
                            className={classes.globalSearchInput}
                            placeholder="Search by Employee Name / Placement ID"
                            onChange={handleSearch}

                        />
                        <button
                            type="button"
                            className={classes.searchIcon}
                        >

                            {searchImg ? <img src={SearchGlobal} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={closeBtn} />}
                        </button>
                    </div>
                    <Button
                        onClick={(e) => handleClick(e)}
                        disableRipple
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                            fontSize: "14px !important",
                            fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                            fontWeight: `${400} !important`,
                            color: "#737373 !important",
                            width: "147px",
                            height: "36px",
                            border: "1px solid #C7CCD3",
                            backgroundColor: "#ffffff",
                            borderRadius: "4px",
                            textTransform: "none !important",
                            "&:hover": {
                                background: 'none !important'
                            }
                        }}>
                        {selectedItem}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        id="basic-menu"
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                width: '147px',
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.12))',
                                padding: "8px",
                                borderRadius: "8px",
                                mt: 0.2,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                "& .css-6hp17o-MuiList-root-MuiMenu-list": {
                                    padding: "0px"
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    // transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem className={selectedItem === 'All' ? classes.viewText1 : classes.viewText} onClick={(e) => getFilterPlacementData(filter.slug, "all")} >
                            All
                        </MenuItem>
                        <MenuItem className={selectedItem === 'This Month' ? classes.viewText1 : classes.viewText} onClick={(e) => getFilterPlacementData(filter.slug, "this_month")} >
                            This Month
                        </MenuItem>
                        <MenuItem className={selectedItem === 'Last 3 months' ? classes.viewText1 : classes.viewText} onClick={(e) => getFilterPlacementData(filter.slug, "last_three_months")} >
                            Last 3 Months
                        </MenuItem>
                        <MenuItem className={selectedItem === 'Last 6 months' ? classes.viewText1 : classes.viewText} onClick={(e) => getFilterPlacementData(filter.slug, "last_six_months")} >
                            Last 6 Months
                        </MenuItem>

                    </Menu>
                </Grid>
                <Grid item lg={12} sx={{ minHeight: '440px !important' }}>
                    {
                        loading ? <TableRowSkeletonLoader rowsNum={10} /> :
                            <Fragment>
                                {
                                    filter.slug == "total_placements" && <TableAccordion rows={Rows} columns={Columns} acc={true} toggleAccordion={true} />
                                }
                                {
                                    filter.slug == "active_placements" && <TableAccordion rows={Rows} columns={Columns} acc={true} toggleAccordion={true} />
                                }
                                {
                                    filter.slug == "ending_in_placements" && <TableAccordion rows={Rows} columns={Columns} acc={true} toggleAccordion={true} />
                                }
                                {
                                    filter.slug == "ended_placements" && <TableAccordion rows={Rows} columns={Columns} acc={true} toggleAccordion={true} />
                                }
                            </Fragment>
                    }
                </Grid>
            </Grid>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', marginTop: "28px" }}>
                <Stack spacing={2}>
                    {
                        list.length > 0 &&
                        <StyledPagination
                            count={list.length > 0 && pagination && parseInt(pagination.totalPages)}
                            variant="outlined"
                            shape="rounded"
                            page={list.length > 0 && pagination && parseInt(pagination.currentPage)}
                            onChange={handleChangePagination}
                        />
                    }
                </Stack>
            </Box>

            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
                // onClose={toggleDrawer(false, state.view)}
                // onOpen={toggleDrawer(true, state.view)}
                transitionDuration={300}
                sx={{
                    ".MuiDrawer-paper ": {
                        borderRadius: '8px 0px 0px 8px !important',
                    },
                    "& .MuiBackdrop-root.MuiModal-backdrop": {
                        backgroundColor: 'rgba(0, 0, 0, 0.75) !important'
                    }
                }
                }
            >

                {
                    ExportView()
                }
            </SwipeableDrawer>

        </Box>
    </>)
};