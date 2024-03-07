import React, { Fragment, useEffect, useState } from "react";
import { Grid, Typography, Stack, Box, RadioGroup, Chip, Menu, FormControlLabel, FormControl, Radio, MenuItem, SwipeableDrawer, Checkbox, Pagination, TableRow, TableCell, Skeleton } from "@mui/material";
import TimeSheetDashboardStyles from "./TimeSheetDashboardStyles";
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import LocalStorage from '../../../../v2/utils/LocalStorage';
import Button from '../../../components/customButton/Button';
import Search from '../../../assets/svg/search1.svg';
// import Downloadcloud from '../../../assets/svg/download-cloud.svg';
import TableAccordion from "../../../components/tableAccordion/TableAccordion";
import Avatar from '@mui/material/Avatar';
import Documentsvg from '../../../assets/svg/document.svg';
import Document1svg from '../../../assets/timeSheets/Component 179.svg'
import Document2svg from '../../../assets/svg/Document2svg.svg'
import menu from '../../../assets/client/ActionMenu.svg';
import DialogContent from "@mui/material/DialogContent";
import crossIcon from '../../../../v2/assets/svg/crossIcon.svg';
import IconButton from "@mui/material/IconButton";
import Approved from "../../../assets/timeSheets/Approved.svg"
import Text from '../../../components/customText/Text';
import DashboardStyles from '../DasboardStyles';
import disk1 from "../../../assets/svg/disk1.svg"
import disk2 from "../../../assets/svg/disk2.svg"
import disk3 from "../../../assets/svg/disk3.svg"
import disk4 from "../../../assets/svg/disk4.svg"
import FileSaver from 'file-saver';
import moment from 'moment';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Datesvg from '../../../assets/svg/Dateeye.svg';
import { dateFormat } from '../../../../v2/utils/utils';
import TimesheetApi from "../../../apis/admin/timesheets/TimesheetApi";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../assets/svg/RadioCheckedIcon.svg';
import { ReactComponent as RadioIcon } from '../../../assets/svg/RadioIcon.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svg/cross.svg';
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import Reject from "../../../assets/timeSheets/Rejected.svg";
import Approved1 from "../../../assets/timeSheets/Approved_1.svg"
import warningImg from '../../../../v2/assets/svg/confirm-BG-img.svg';
import FilterCard from './FilterCard';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg';
import { addErrorMsg } from '../../../utils/utils';
import RejectForm from './RejectForm';
import { BlackToolTip } from '../../../utils/utils';
import disablePlus from '../../../assets/client/disablePlus.svg';
import bulkUpload from '../../../assets/timeSheets/bulkUpload.svg';
import enterManually from '../../../assets/timeSheets/enterManually.svg'

// Extend dayjs with the isoWeek plugin to handle weeks correctly
dayjs.extend(isoWeek);

export default function Dashboard() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const classes = TimeSheetDashboardStyles();
    const classesDashboard = DashboardStyles();
    // const [tableLoading, setTableLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [popUpOpen, setPopUpOpen] = useState(false);
    const [openStatus, setOpenStatus] = useState(null);
    const [rowData, setRowData] = useState({});
    const [open, setOpen] = useState(false);
    const opStatus = Boolean(openStatus);
    const navigate = useNavigate();
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#393939",
            padding: "6px 14px",
            minWidth: 100,
            border: "1px solid #393939"
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: "#393939",
            "&::before": {
                backgroundColor: "#393939",
                border: "1px solid #393939"
            }
        },
    }));
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} timeout={500} />;
    });
    const TransitionUp = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} timeout={500} />;
    });

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
            width: show == 1 || show == 3 || show == 4 || show == 5 || show == 6 ? "400px" : "500px"
        },
        "& .MuiDialogContent-root": {
            // padding: theme.spacing(2)
            // padding: theme.spacing(3)
        },
        "& .MuiDialogActions-root": {
            // padding: theme.spacing(1)
            // padding: theme.spacing(5)
        }
    }));
    const BootstrapDialog1 = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
        },
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2)
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1)
        }
    }));
    const [drawer, setDrawer] = useState(false);
    const [anchorEldots, setAnchorEldots] = useState(null);
    // const [show, setShow] = useState("");
    const [show, setShow] = useState("");
    const opendots = Boolean(anchorEldots);
    // const [searchImg, setSearchImg] = useState(true);
    // const [data1, setData1] = useState(
    //     {
    //         request_id: LocalStorage.uid(),
    //         timesheet_id: "",
    //         placement_id: "",
    //         approved_status: "",
    //         comments: ""
    //     }
    // );
    const [filterData, setFilterData] = useState({
        // limit: 5,
        // page: 1,
        search: "",
        // employment: [],
        // category: [],
        // status: [],
        // visa: [],
    });

    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState({
        slug: location.state === null ? "total_timesheets" : location.state.slug,
        // slug: "",
        from_date: "",
        to_date: "",
        search: "",
        filter_value: 1,
    });

    const [cards, setCards] = useState([
        // { id: 4, text: "All Timesheets", slug: "total_invoiced_timesheets", count: "", icon: disk1 },
        { id: 4, text: "All Timesheets", slug: "total_timesheets", count: "", icon: disk1 },
        { id: 1, text: "Pending Timesheet", slug: "total_pending_timesheets", count: "", icon: disk2 },
        { id: 2, text: "Pending for approval", slug: "total_pending_approval_timesheets", count: "", icon: disk3 },
        { id: 3, text: "Invoice ready timesheet", slug: "total_invoice_ready_timesheets", count: "", icon: disk4 },
    ]);
    const [cardSlug, setCardSlug] = useState("")
    const [invoiceReadyApprovedBy, setInvoiceReadyApprovedBy] = useState([]);
    const statusOptions = [
        {
            value: 'All', id: 'All',
        },
        {
            value: 'Drafted', id: 'Drafted',
        },
        {
            value: 'Approval In Progress', id: 'Approval In Progress',
        },
        {
            value: 'Approved', id: 'Approved',
        },
        {
            value: 'Rejected', id: 'Rejected',
        },
    ]
    const filterOptions = [
        {
            value: 'All', id: 1,
        },
        {
            value: 'This Month', id: 2,
        },
        {
            value: 'Last 3 Months', id: 3,
        },
        {
            value: 'Last 6 Months', id: 4,
        },
    ];
    useEffect(() => {
        getTimesheetCount();
        getTimesheetListing(filter, pagination);
        if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_view" && item.is_allowed == true))) {
            setViewAccess(true);
        } else {
            setViewAccess(false);
        }
        // eslint-disable-next-line  
    }, []);

    const getApprovedBy = (id) => {
        TimesheetApi.getApprovedByData(id).then((response) => {

            let newArr = invoiceReadyApprovedBy;

            newArr.push({
                id: id,
                approved_by: response.data.data
            })




            setInvoiceReadyApprovedBy([...newArr]);



        });
    }

    const getTimesheetCount = () => {
        TimesheetApi.getTimesheetCount().then((response) => {
            if (response.data.statusCode == 1003) {
                let arr = cards;
                arr.forEach((ele, index) => {
                    arr[index].count = response.data.data[ele.slug]
                });
                setCards([...arr]);
            }
        });
    }

    const getFilterTimesheet = (data) => {
        TimesheetApi.getFilterTimesheet(data).then((response) => {
            if (response.data.statusCode == 1003) {
                let arr = cards;
                arr.forEach((ele, index) => {
                    arr[index].count = response.data.data[ele.slug]
                });
                // arr[arr.findIndex((i) => i.slug === data.slug)].count = response.data.data[data.slug];
                setCards([...arr]);
            }
        });
    };

    const getTimesheetListing = (data, paginationData) => {
        setLoading(true);
        TimesheetApi.getTimesheetListing(data, paginationData).then((response) => {
            setTimeout(() => {
                setLoading(false);
                if (response.data.statusCode == 1003) {
                    setList(response.data.data);
                    setPagination({ ...response.data.pagination });
                }
            }, 400);
            console.log(list, "daya");
        });
    };
    const getFilterTimesheetData = (e, slug, filterType) => {

        if (filterType == "all") {
            setCardSlug(slug)
            let fromDate = "";
            let toDate = "";
            getFilterTimesheet({ from_date: fromDate, to_date: toDate });
            setFilter({ slug: slug, from_date: fromDate, to_date: toDate, search: "", filter_value: 1 });
            getTimesheetListing({ slug: slug, from_date: fromDate, to_date: toDate, search: "" }, { total: "", currentPage: 1, perPage: 5, totalPages: "" });
            // if(cardSlug=='total_pending_timesheets'){
            setPagSlug(slug)
            // }else if(cardSlug==' total_pending_approval_timesheets'){
            //     setPagSlug(cardSlug)
            // }else if(cardSlug==' total_invoice_ready_timesheets'){
            //     setPagSlug(cardSlug)
            // }

        } else if (filterType == "") {
            let fromDate = "";
            let toDate = "";
            switch (e.target.value) {
                case 1:
                    fromDate = ''
                    toDate = ''
                    break;
                case 2:
                    fromDate = moment().startOf('month').format(dateFormat());
                    toDate = moment().format(dateFormat());
                    break;
                case 3:
                    fromDate = moment(moment().subtract(3, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                    toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                    break;
                case 4:
                    fromDate = moment(moment().subtract(6, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                    toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                    break;
                default:
                    break;
            }



            console.log(cardSlug)
            // setPagSlug(cardSlug)
            getFilterTimesheet({ from_date: fromDate, to_date: toDate });
            setFilter({ slug: cardSlug == "" ? "total_timesheets" : cardSlug, from_date: fromDate, to_date: toDate, search: "", filter_value: [e.target.value] });
            getTimesheetListing({ slug: cardSlug, from_date: fromDate, to_date: toDate, search: "" }, { total: "", currentPage: 1, perPage: 5, totalPages: "" });
        }
    }


    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }

    const handleClickdots = (event, args) => {
        setAnchorEldots(event.currentTarget)
        setRowData(args);
    };

    const handleOpenDialog = (args) => {
        handleClosedots()
        if (args == 1) {
            let data = {
                request_id: LocalStorage.uid(),
                timesheet_id: rowData.timesheet_id,
                placement_id: rowData.placement_id,
                status: "Approved",
                comments: "",
            };

            TimesheetApi.updateTimesheetStatus(data, LocalStorage.getAccessToken()).then((res) => {
                if (res.data.statusCode === 1003) {
                    setPopUpOpen(true);
                    setShow(1)
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        } if (args == 2) {
            setShow(args)
            setPopUpOpen(true)
        } if (args == 3) {
            setPopUpOpen(true);
            setShow(args)
            // setData1(data1.approved_status = 0, data1.timesheet_id = rowData.timesheet_id, data1.placement_id = rowData.placement_id)
            // let data = {
            //     request_id: LocalStorage.uid(),
            //     timesheet_id: rowData.timesheet_id,
            //     placement_id: rowData.placement_id,
            //     approved_status: 3,
            //     comments: "",
            // };
            // TimesheetApi.approvalUpdate(data, LocalStorage.getAccessToken()).then((res) => {
            //     if (res.data.statusCode === 1003) {
            //         setPopUpOpen(true);
            //         setShow(5)
            //     } else {
            //         addErrorMsg(res.data.message);
            //     }
            // })
        }
        if (args == 4) {
            setShow(args)
            setPopUpOpen(true)
        }
    }

    const callDeleteTimesheet = (id) => {
        setPopUpOpen(true);
        setShow(6)
    }
    const deleteApi = () => {
        TimesheetApi.deleteTimesheet(rowData.timesheet_id, { request_id: LocalStorage.uid() }).then((res) => {
            if (res.data.statusCode === 1003) {
                setPopUpOpen(true);
                setShow(7)
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }


    const handleClosePopUp = () => {
        setAnchorEldots(null);
        setPopUpOpen(false);
        getTimesheetCount();
        getTimesheetListing(filter, pagination);
    };

    const handleClosedots = () => {
        setAnchorEldots(null);
    };

    const handleDeleteChip = (id, name) => {
        let newFilterData = filterData;
        if (newFilterData[name].includes(id)) {
            newFilterData[name].splice(newFilterData[name].findIndex(item => item === parseInt(id)), 1)
        }
        setFilterData({ ...newFilterData });
    };


    const ExportView = () => (
        <Box sx={{
            width: '660px', height: '100vh',
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

            <Box height={'10vh'} borderBottom={'1px solid #EAECF0'} display={'flex'} alignItems={'center'} pl={4} >
                <Text BlackExtraDark>Export</Text>
            </Box>

            <Box display={'flex'} height={'7vh'} borderBottom={'1px solid #EAECF0'} alignItems={'center'} justifyContent={'space-between'} pr={'26px'} gap={1}>
                <Box display={'flex'} height={'60px'} alignItems={'center'} width={'90%'} pl={4} pr={'26px'} gap={1} >
                    <Chip label="Employee First Name" variant="outlined" onDelete={handleDeleteChip} deleteIcon={<CloseIcon />} />
                    <Chip label="Employee Middle Name" variant="outlined" onDelete={handleDeleteChip} deleteIcon={<CloseIcon />} />
                </Box>
                <Button clearAll startIcon={<CloseIcon />} >Clear All</Button>
            </Box>

            <Box display={'flex'} width={'100%'} border={'1px solid #EAECF0'} height={'73vh'} >
                <Box display={'flex'} flexDirection={'column'} gap={1} height={'100%'} width={'45%'} borderRight={'1px solid #EAECF0'} pl={5} pt={2} >
                    <RadioGroup sx={{
                        gap: '16px !important'
                    }}
                        defaultValue="Personal Information"

                    >
                        <FormControlLabel value="Personal Information" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Personal Information</Text>} />
                        <FormControlLabel value="Address Details" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Address Details</Text>} />
                        <FormControlLabel value="Dependent Details" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Dependent Details</Text>} />
                        <FormControlLabel value="Education Details" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Education Details</Text>} />
                        <FormControlLabel value="Employee Skills" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Employee Skills</Text>} />
                        <FormControlLabel value="Employee Documents" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Employee Documents</Text>} />
                        <FormControlLabel value="Emergency Contact Info" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Emergency Contact Info</Text>} />
                    </RadioGroup>
                </Box>
                <Box
                    pl={5} pt={2}
                    sx={{
                        isplay: "flex",
                        flexDirection: "column",
                        gap: 1,
                        height: "100%",
                        width: "55%", paddingLeft: 5, overflow: "auto",
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            '-webkit-box-shadow': 'inset 0 0 6px #ffffff'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#C7CCD3',
                            outline: '1px solid #C7CCD3',
                            borderRadius: "4px"
                        }
                    }} >
                    <FormControl sx={{
                        gap: '16px !important'
                    }}>
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >All</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} defaultChecked />} label={<Text checkboxlable >Employee First Name</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} defaultChecked />} label={<Text checkboxlable >Employee Middle Name</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Employee Last Name</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Date Of Birth</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Gender</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Email ID</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Phone Number</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Hire Date </Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Employee Designation</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Department</Text>} />
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >Employment Type</Text>} />
                    </FormControl>
                </Box>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={1} height={'73px'} pr={'26px'}>
                <Button cancelSmall onClick={() => setDrawer(false)}>Cancel</Button>
                <Button exportSmall >Export</Button>
            </Box>
        </Box >
    )

    const Rows1 = list.map((data, index) => ({
        id: data.timesheet_id,
        isInvoiceConfigured: data.isInvoiceConfigured,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Avatar alt={`${data.employee_name}`} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    <Text smallBlue1 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >{data.employee_name}</Text>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{data.employee_reference_id}</Text>
                </Box>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.timesheet_no}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.from_date} - {data.to_date}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.client_name}</Text>
            </Box>,
            // <Box>
            //     <Text mediumBlack >{data.status == 0 ? "Drafted" : data.status == 1 ? "Submitted" : data.status == 2 ? "Partially Approved" : data.status == 3 ? "Approved" : data.status == 4 ? "Rejected" : "--"}</Text>
            // </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.billable_hours}<span style={{ color: "#57B556" }}>+{data.over_time}</span></Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.status}</Text>
            </Box>,
            <Box>
                <HtmlTooltip
                    placement="right"
                    //  sx={{ display: `${sidebar.open ? "none" : "block"}` }}
                    arrow
                    title={
                        <React.Fragment>
                            <Box className={classes.sideTooltip}>
                                <Typography className={classes.sideTooltipText}>
                                    Generate Invoice
                                </Typography>
                            </Box>
                        </React.Fragment>
                    }
                >
                    <IconButton
                        aria-label="generate_invoice"
                        size="small"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                navigate("/sales/add-invoices", { state: { id: data.timesheet_id, action: "generate_invoice", } })
                            }
                        }>
                        <img alt='Document1svg' src={Document1svg} style={{ cursor: "pointer" }} />
                    </IconButton>

                </HtmlTooltip>

            </Box>
        ],
        sub_row_content: [
            <Box sx={{ paddingTop: '18px', width: '100%', height: '80px', backgroundColor: '#f1f8ff', borderRadius: '16px', justifyContent: 'space-around', display: 'flex' }}>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Total Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.total_hours}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        OT Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.over_time}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Timesheet No
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.timesheet_no}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted On
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_on}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Approved By
                    </Text>




                    {
                        invoiceReadyApprovedBy.length > 0 ?

                            invoiceReadyApprovedBy.some(i => i.id == data.timesheet_id) &&

                                invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)].approved_by.length > 2 ?
                                <>
                                    <Text smallBlack>{loading ? <Skeleton animation="wave" width="100px" /> : invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)].approved_by.slice(0, 2).map(approvedUser => approvedUser).join(", ")}
                                        <BlackToolTip arrow title={
                                            <Text mediumWhite sx={{ padding: '5px 12px !important' }}>
                                                {invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)].approved_by.slice(2).map(approvedUser => (<div key={approvedUser}>{approvedUser}</div>))}
                                            </Text>} placement="right">
                                            <span style={{ color: '#0C75EB', fontSize: '11px', cursor: 'pointer', marginLeft: '6px', fontWeight: 500 }}>+{invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)].approved_by.length - 2} more</span>
                                        </BlackToolTip>
                                    </Text>
                                </>
                                :
                                <Text smallBlack>
                                    {loading ?
                                        <Skeleton animation="wave" width="100px" /> :
                                        // console.log(invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)], "  3693693")
                                        <Fragment>{
                                            invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)] &&
                                            <Text my={1} className={classesDashboard.text2}>
                                                {invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)].approved_by.length == 0 ? "-" :
                                                    invoiceReadyApprovedBy[invoiceReadyApprovedBy.findIndex(i => i.id == data.timesheet_id)].approved_by.map(approvedUser => approvedUser).join(", ")}
                                            </Text>
                                        }</Fragment>
                                    }
                                </Text>
                            : <Text my={1} className={classesDashboard.text2}>{'-'}</Text>
                    }

                </Box>
            </Box>
        ]
    }));
    const Columns1 = [
        { 'name': 'Employee Name', 'width': '' },
        { 'name': 'Timesheet ID', 'width': '' },
        { 'name': 'Pay-Period', 'width': '' },
        { 'name': 'Client Name', 'width': '' },
        { 'name': 'Billable Hours', 'width': '' },
        { 'name': 'Status', 'width': '' },
        { 'name': 'Invoice', 'width': "" }
    ]
    const Rows2 = list.map((data, index) => ({
        id: data.timesheet_id,
        isInvoiceConfigured: data.isInvoiceConfigured,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Avatar alt={`${data.employee_name}`} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    <Text smallBlue1 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap >{data.employee_name}</Text>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{data.employee_reference_id}</Text>
                </Box>
            </Box>,
            <Box textAlign='center'>
                {
                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_edit" && item.is_allowed == true)) ?
                        <Text className={classes.greenText} sx={{ textAlign: "center" }}
                            onClick={(e) => { e.stopPropagation(); navigate('/placements/addPlacement', { state: { data: data, placementID: data.placement_id, actionState: 'TSView', slug: filter.slug } }); LocalStorage.setPlacementID(data.placement_id) }}
                        >{data.placement_reference_id}</Text> :
                        <Text smallBlack sx={{ textAlign: "center" }}>{data.placement_reference_id}</Text>
                }
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.timesheet_no}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{data.from_date} - {data.to_date}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>{["", null, undefined].includes(data.client_name) ? "-" : data.client_name}</Text>
            </Box>,

            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{["", null, undefined].includes(data.end_client_name) ? "-" : data.end_client_name}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >
                    {data.status}
                </Text>
            </Box>,
            <Box>
                <img
                    src={menu}
                    alt='menu'
                    style={{ cursor: "pointer" }}

                    onClick={
                        (e) => {
                            e.stopPropagation();
                            handleClickdots(e, data)
                        }
                    }

                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEldots}
                    open={opendots}
                    onClose={handleClosedots}
                    sx={{
                        '& .MuiPaper-root': {
                            boxShadow: 'none !important',
                            border: '1px solid #EAECF0 !important',
                            width: '140px !important',
                        },
                        "&:hover": {
                            background: 'none !important'
                        }
                    }}
                >
                    <MenuItem
                        className={classes.editText}
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                handleOpenDialog(4)
                            }
                        }
                    >Send a Reminder</MenuItem>
                    <MenuItem
                        className={classes.deleteText}
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                callDeleteTimesheet(6)
                            }
                        }
                    >Delete Timesheet</MenuItem>
                </Menu>
            </Box>
        ],
    }))
    const Columns2 = [
        { 'name': 'Employee Name', 'width': '' },
        { 'name': 'Placement ID', 'width': '' },
        { 'name': 'Timesheet ID', 'width': '' },
        { 'name': 'Period', 'width': '' },
        { 'name': 'Client Name', 'width': '' },
        { 'name': 'End Client Name', 'width': '' },
        { 'name': 'Status', 'width': '' },
        { 'name': 'Action', 'width': 165 }
    ]
    const Rows3 = list.map((data, index) => ({
        id: data.timesheet_id,
        isInvoiceConfigured: data.isInvoiceConfigured,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Avatar alt={`${data.employee_name}`} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    <Text smallBlue1 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >{data.employee_name}</Text>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{data.employee_reference_id}</Text>
                </Box>
            </Box>,
            <Box>
                {
                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_edit" && item.is_allowed == true)) ?
                        <Text className={classes.greenText} sx={{ textAlign: "center" }}
                            onClick={(e) => { e.stopPropagation(); navigate('/placements/addPlacement', { state: { data: data, placementID: data.placement_id, actionState: 'TSView', slug: filter.slug } }); LocalStorage.setPlacementID(data.placement_id) }}
                        >{data.placement_reference_id}</Text> :
                        <Text smallBlack sx={{ textAlign: "center" }}>{data.placement_reference_id}</Text>
                }
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.timesheet_no}</Text>
            </Box>,
            <Box>
                <Text sx={{ textAlign: "center" }} smallBlack >{data.from_date} - {data.to_date}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center", color: "#171717 !important" }}>{data.client_name}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>
                    {data.billable_hours}<span style={{ color: "#57B556", marginLeft: '8px' }}>+{data.over_time}</span>
                </Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }}>
                    {data.status}

                </Text>
            </Box>,
            <Box sx={{ textAlign: "center" }}>
                {data.document_url[0].document_url == null ?
                    "--" : <img alt='Document2svg' src={Document2svg} style={{ cursor: "pointer" }} onClick={() => downloadDoc(data.document_url[0].document_url)}></img>
                }
            </Box>,
            <Box>
                <img src={menu} alt='menu' style={{ cursor: "pointer" }}
                    // onClick={(e) => handleClickdots(e, 4)} 
                    onClick={
                        (e) => {
                            e.stopPropagation();
                            handleClickdots(e, data)
                        }
                    }
                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEldots}
                    open={opendots}
                    onClose={handleClosedots}
                    sx={{
                        '& .MuiPaper-root': {
                            boxShadow: 'none !important',
                            border: '1px solid #EAECF0 !important',
                            width: '140px !important',
                        },
                        "&:hover": {
                            background: 'none !important'
                        }
                    }}
                >
                    <MenuItem
                        className={classes.editText}
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                handleOpenDialog(1);
                            }
                        }
                    >Approve</MenuItem>
                    <MenuItem
                        className={classes.deleteText}
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                handleOpenDialog(2);
                            }
                        } >Reject</MenuItem>
                </Menu>

            </Box>
        ],
        sub_row_content: [
            <Box sx={{ paddingTop: '18px', width: '100%', height: '80px', backgroundColor: '#f1f8ff', borderRadius: '16px', justifyContent: 'space-around', display: 'flex' }}>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Total Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.total_hours}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        OT Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.over_time}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Timesheet No
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.timesheet_no}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted On
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_on}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted By
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_by ? data.submitted_by : "--"}
                    </Text>
                </Box>
            </Box>
        ]
    }))
    const Columns3 = [
        { 'name': 'Employee Name', 'width': '' },
        { 'name': 'Placement ID', 'width': '' },
        { 'name': 'Timesheet ID', 'width': '' },
        { 'name': 'Pay-Period', 'width': '' },
        { 'name': 'Client Name', 'width': '' },
        { 'name': 'Billable Hours', 'width': '' },
        { 'name': 'Status', 'width': '' },
        { 'name': 'Attachment', 'width': '' },
        { 'name': 'Action', 'width': 165 }

    ]
    // const Rows4 = employees.map((data, index) => ({
    const Rows4 = list.map((data, index) => ({
        id: data.timesheet_id,
        isInvoiceConfigured: data.isInvoiceConfigured,
        main_row_data: [
            <Box display="flex" alignItems="center">
                <Avatar alt={`${data.employee_name}`} src={data.profile_picture_url} sx={{ width: '40px', height: "40px" }} />
                <Box ml={2}>
                    <Text smallBlue1 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >{data.employee_name}</Text>
                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{data.employee_reference_id}</Text>
                </Box>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.from_date} - {data.to_date}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.client_name}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.billable_hours}</Text>
            </Box>,
            <Box>
                <Text smallBlack sx={{ textAlign: "center" }} >{data.status}</Text>
            </Box>,
            // <Box>
            //     <Text mediumBlack >{data.over_time}</Text>
            // </Box>,
            <Box>
                <img alt='Documentsvg' src={Documentsvg} style={{ cursor: "pointer" }} onClick={() => downloadDoc(data.document_url[0].document_url)}></img>
            </Box>
        ],
        sub_row_content: [
            <Box sx={{ paddingTop: '18px', width: '100%', height: '80px', backgroundColor: '#f1f8ff', borderRadius: '16px', justifyContent: 'space-around', display: 'flex' }}>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Total Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.total_hours}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        OT Hours
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.over_time}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Timesheet No
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.timesheet_no}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Invoice No
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.to_date}
                    </Text>
                </Box>

                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted On
                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_on}
                    </Text>
                </Box>
                <Box width={'100%'}>
                    <Text className={classesDashboard.text1}>
                        Submitted By

                    </Text>
                    <Text my={1} className={classesDashboard.text2}>
                        {data.submitted_by ? data.submitted_by : "--"}
                    </Text>
                </Box>
            </Box>
        ]
    }));
    const [pagSlug, setPagSlug] = useState('')

    const handleStatus = (args) => {
        if (args !== '') {
            // setPagSlug(args);
            if (args == "All") {
                setPagSlug('');
                getTimesheetListing({ ...filter, slug: '' }, { total: "", currentPage: 1, perPage: 5, totalPages: "" });
            } else if (args == 'Rejected') {
                setPagSlug('total_rejected_timesheets');
                getTimesheetListing({ ...filter, slug: 'total_rejected_timesheets', }, { total: "", currentPage: 1, perPage: 5, totalPages: "" });
                // setFilter(filter)
            } else {
                setPagSlug(args);
                getTimesheetListing({ ...filter, slug: args }, { total: "", currentPage: 1, perPage: 5, totalPages: "" });
                setFilter(filter)
            }

            // setPagination({
            //     total: "",
            //     currentPage: 1,
            //     perPage: 5,
            //     totalPages: ""
            // });
        }
        setOpenStatus(null);
    }

    const Columns4 = [
        { 'name': 'Employee Name', 'width': '' },
        { 'name': 'Pay-Period', 'width': '' },
        { 'name': 'Client Name', 'width': '' },
        { 'name': 'Billable Hours', 'width': '' },
        {
            'name': 'Status',
            'icon': <><KeyboardArrowDownRoundedIcon style={{ height: '25px', width: '25px', paddingTop: '1px', color: '#737373 !important', cursor: 'pointer', }} onClick={(e) => setOpenStatus(e.currentTarget)} />
                <Menu
                    id="basic-menu"
                    anchorEl={openStatus}
                    open={opStatus}
                    onClose={() => handleStatus('')}
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '10px',
                            //   boxShadow: 'none !important',
                            boxShadow: "11px 6px -1px 0px rgba(0, 0, 0, 0.05)!important",

                            '&:before': { display: "none" },
                            border: '1px solid #EAECF0 !important',
                            width: '155px !important',
                            maxHeight: '210px !important',
                            // padding: "5px !important"
                        }
                    }}
                >

                    {
                        statusOptions.map((option) => (
                            <MenuItem key={option.id} onClick={() => handleStatus(option.id)} className={classes.viewText} >{option.value}</MenuItem>
                        ))
                    }


                </Menu></>
            ,
            'width': ''
        },
        { 'name': 'Attachment', 'width': 165 }
    ]

    const [viewAccess, setViewAccess] = useState(false);

    const handleSearch = (e) => {
        const text = e.target.value;
        setFilter({ ...filter, search: text })
        if (text.length > 1 || text.length == 0) {
            if (!loading) {
                setLoading(true);
                setTimeout(() => {
                    searchAPICall(e.target.value);
                }, 2000);
            }
        }
    }

    const searchAPICall = (text) => {
        TimesheetApi.getTimesheetListing({ ...filter, search: text }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
            setLoading(false);
            setList(res.data.data);
            setPagination(res.data.pagination);
        })
    }

    const handleChangePagination = (e, page) => {
        let paginationData = { ...pagination, currentPage: page };
        setPagination({ ...paginationData });
        getTimesheetListing({ ...filter, slug: pagSlug }, paginationData);
    }

    const closeBtn = () => {
        setLoading(true);
        setFilter({ ...filter, search: "" });
        setTimeout(() => {
            TimesheetApi.getTimesheetListing({ ...filter, search: "" }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
                setLoading(false);
                setList(res.data.data);
                setPagination(res.data.pagination);
            })
        }, 2000);
    }


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

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Grid container component={'main'} className={classes.main} pl={{ lg: 15, md: 11, sm: 12, xs: 11 }} pr={5}>
            {/* first  */}
            <Grid item container >
                <Grid item lg={9} md={7} sm={6} xs={12} mt={1}>
                    <Typography sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                        Timesheet
                    </Typography>
                </Grid>
                <Grid item lg={3} md={5} sm={6} xs={12}>
                    <Stack direction={"row"} spacing={2}>
                        {/* <Button popupCancel sx={{ width: "150px !important", height: "40px !important" }} >Create Template</Button> */}
                        {/* <Button save onClick={() => navigate("/timesheet/add-timesheet")} > + Add Timesheet</Button> */}

                        <Link to={"/ocr/create-template"}>
                            <Button popupCancel
                                sx={{ width: "150px !important", height: "42px !important" }}
                            >
                                Create Template
                            </Button>
                        </Link>
                        {
                            LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_create" && item.is_allowed == true)) ?
                                <Button addNew startIcon={<Plus />} onClick={() => setOpen(true)} /*onClick={() => navigate("/timesheet/add-timesheet")}*/>Add Timesheet</Button> :
                                <Button addNewDisable><img src={disablePlus} alt="add" sx={{ marginRight: '10px' }} />Add Timesheet</Button>
                        }
                    </Stack>
                </Grid>
            </Grid>
            <Box py={2} sx={{ width: "100%" }}>
                <Grid container spacing={4}>
                    {
                        cards.map((item, key) => (
                            <Grid key={key} item lg={3} md={3} sm={12} xs={12}>
                                <FilterCard item={item} filter={filter} getFilterTimesheetData={getFilterTimesheetData} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Box >
            <Grid container mt={2} display='flex' justifyContent={'space-between'} >
                <Grid item lg={3}>
                    <div className={classes.searchField}>
                        <input
                            type="text"
                            value={filter.search}
                            onChange={handleSearch}
                            className={classes.globalSearchInput}
                            placeholder="Search by Name / Timesheet ID"
                        // onKeyUp={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                        // onKeyDown={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                        />
                        <button
                            type="button"
                            className={classes.searchIcon}
                        >
                            {filter.search.length == 0 ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={closeBtn} />}
                        </button>
                    </div>
                </Grid>

                <Stack direction={'row'} gap={2}>
                    <CustomSelect
                        sx={{
                            '.css-d9oaum-MuiSelect-select-MuiInputBase-input-MuiFilledInput-input.MuiSelect-select': {
                                'min-height': '2em',
                                'minWidth': '7em'
                            }
                        }}
                        viewDrop
                        scrollTrue={true}
                        options={filterOptions}
                        value={filter.filter_value}
                        onChange={(e) => getFilterTimesheetData(e, '', '')}

                    />
                    <button
                        type="button"
                        style={{
                            all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif",
                            width: "40px", height: "40px",
                            //   border: "1.5px solid rgba(199, 204, 211, 1)",
                            backgroundColor: "#ffffff", borderRadius: "6px"
                        }}
                        onClick={() => { navigate('/timesheet/view'); }}
                    >
                        <img src={Datesvg} alt="Datesvg" />
                    </button>
                </Stack>

                {/* </Grid> */}
            </Grid>
            <Grid container mt={2}>
                {/* <Grid item lg={12} sx={{ height: '500px !important', overflowY: 'auto' }}> */}
                <Grid item lg={12} sx={{ minHeight: '400px !important' }}>
                    {console.log(list, "@#$%")}
                    {
                        loading ? <TableRowSkeletonLoader rowsNum={10} /> :
                            <Fragment>
                                {
                                    filter.slug == "total_pending_timesheets" && <TableAccordion url={viewAccess == true ? true : false} name={"Pending Timesheet"} acc={false} rows={Rows2} columns={Columns2} />
                                }
                                {
                                    filter.slug == "total_pending_approval_timesheets" && <TableAccordion url={viewAccess == true ? true : false} name={"Approve Timesheet"} acc={true} rows={Rows3} columns={Columns3} />
                                }
                                {
                                    filter.slug == "total_invoice_ready_timesheets" && <TableAccordion url={viewAccess == true ? true : false} name={"Invoice Ready Timesheet"} acc={true} rows={Rows1} columns={Columns1} getApprovedByApicall={getApprovedBy} />
                                }
                                {/* <TableAccordion url={true} name={"total_timesheets"} acc={true} rows={Rows4} columns={Columns4} /> */}
                                {
                                    filter.slug == "total_timesheets" && <TableAccordion url={viewAccess == true ? true : false} name={"total_timesheets"} acc={true} rows={Rows4} columns={Columns4} />
                                }

                            </Fragment>
                    }
                </Grid>
            </Grid>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', marginTop: "8px" }}>
                <Stack spacing={2} >
                    <Pagination
                        count={parseInt(pagination.totalPages)}
                        variant="outlined"
                        shape="rounded"
                        page={parseInt(pagination.currentPage)}
                        onChange={handleChangePagination}
                        sx={{
                            '& .MuiButtonBase-root': {
                                border: "1px solid #F1F1F1 !important",
                                color: "#333333 !important",
                                font: "13px Nunito, Nunito Sans, sans-serif !important",
                                fontWeight: '600 !important'
                            },
                            "& .MuiPagination-ul li:last-child button::before": {
                                content: `${list.length === 0 ? "''" : "'Next'"}`,
                                marginRight: "8px",
                            },
                            "& .MuiPagination-ul li:first-child button::after": {
                                content: `${list.length === 0 ? "''" : "'Prev'"}`,
                                marginLeft: "8px",
                            },
                            "& .MuiPagination-ul li:last-child": {
                                marginLeft: "13px",
                                '& .MuiButtonBase-root': {
                                    border: 'none !important'
                                },
                            },
                            "& .MuiPagination-ul li:first-child": {
                                marginRight: "13px",
                                '& .MuiButtonBase-root': {
                                    border: 'none !important'
                                },
                            },
                            '& .MuiPaginationItem-icon': {
                                display: 'none',
                            },
                            '& .css-19xm0h7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: '#2F80ED !important',
                                color: '#FFFFFF !important',
                                border: "1px solid #2F80ED !important"
                            }
                        }}

                    />
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
                    drawer === "export" ? ExportView() : null
                }
            </SwipeableDrawer>
            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={popUpOpen}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClosePopUp}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                </IconButton>
                <DialogContent sx={{ margin: "20px", }}>
                    {show == 1 ?
                        <>
                            <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={Approved} alt="Approved" />
                            </Box>
                            <Box my={3}>
                                <Typography my={1} sx={{ color: "#15803D", font: '22px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                    Congratulations
                                </Typography>
                                <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                    You Have Apporved Timesheet
                                </Typography>
                            </Box>
                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <Button save onClick={() => handleClosePopUp()}>
                                    Go To Home
                                </Button>
                            </Box>
                        </>
                        :
                        show == 2 ?
                            <RejectForm handleClosePopUp={handleClosePopUp} handleOpenDialog={handleOpenDialog} id={rowData.timesheet_id} formData={rowData} />
                            :
                            show == 3 ?
                                <>
                                    <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                        <img src={Reject} alt="Approved" />
                                    </Box>

                                    <Box my={3}>
                                        <Typography my={1} sx={{ color: "#E51A1A", font: '22px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                            Rejected
                                        </Typography>
                                        <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                            You Have Rejected Timesheet
                                        </Typography>
                                    </Box>

                                    <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                        <Button save onClick={() => handleClosePopUp()}>
                                            Go To Home
                                        </Button>

                                    </Box>
                                </>
                                :
                                show == 4 ?
                                    <>
                                        <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                            <img src={Approved1} alt="Approved1" />
                                        </Box>

                                        <Box my={3}>
                                            <Typography my={1} sx={{ color: "#15803D", font: '22px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                                Congratulations
                                            </Typography>
                                            <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                                Reminder Sent Successfully
                                            </Typography>
                                        </Box>

                                        <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                            <Button save onClick={() => handleClosePopUp()}>
                                                Go To Home
                                            </Button>
                                        </Box>
                                    </>
                                    :
                                    null
                    }

                    {
                        show == 6 ?
                            <>
                                <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                    <img src={warningImg} alt="warning" />
                                </Box>

                                <Box my={3}>
                                    <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                        Are You Sure?
                                    </Typography>
                                    <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                        Do You Really want to delete? You cannot undo this process.
                                    </Typography>
                                </Box>
                                <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                    <Button no onClick={() => handleClosePopUp()}>
                                        No
                                    </Button>
                                    <Button deleteBtn loading={loading} onClick={() => deleteApi()}  >
                                        Yes, Delete
                                    </Button>
                                </Box>
                            </> : null
                    }


                    {
                        show === 7 ?

                            <>
                                <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                    <img src={Reject} alt="Approved" />
                                </Box>

                                <Box my={3}>
                                    <Typography my={1} sx={{ color: "#E51A1A", font: '22px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                        Deleted
                                    </Typography>
                                    <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                        You Have deleted Timesheet
                                    </Typography>
                                </Box>

                                <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                    <Button save onClick={() => handleClosePopUp()}>
                                        Go To Home
                                    </Button>

                                </Box>
                            </> : null
                    }
                </DialogContent>
            </BootstrapDialog>

            <BootstrapDialog1
                TransitionComponent={TransitionUp}
                keepMounted
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"md"}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            background: 'none',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                </IconButton>
                <DialogContent sx={{ margin: "50px" }}>
                    <Grid container spacing={0}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Box className={classes.bulkUploadBox}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Box sx={{ margin: "12px 0px" }}>
                                        <img src={bulkUpload} alt='bulkUpload' style={{ height: "200px" }} />
                                    </Box>
                                    <Box sx={{ margin: "8px 0px" }}>
                                        <Text mediumLabel >
                                            Upload multiple timesheets to fetch information <br /> automatically using OCR.
                                        </Text>
                                    </Box>
                                    <Box sx={{ margin: "11px 0px" }}>
                                        <Button onClick={() => navigate("/ocr/bulk-upload-timesheet")} outlineBlueMedium1>Bulk Upload</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Box className={classes.manualBox}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Box sx={{ margin: "16px 0px" }}>
                                        <img src={enterManually} alt='enterManually' style={{ height: "200px" }} />
                                    </Box>
                                    <Box sx={{ margin: "6px 0px" }}>
                                        <Text mediumLabel >
                                            Create an individual timesheet manually
                                        </Text>
                                    </Box>
                                    <Box sx={{ margin: "27px 0px" }}>
                                        <Button outlineBlueMedium1 onClick={() => { navigate("/timesheet/add-timesheet"); setOpen(false) }}>Enter Manually</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </BootstrapDialog1>

        </Grid >
    )
}; 