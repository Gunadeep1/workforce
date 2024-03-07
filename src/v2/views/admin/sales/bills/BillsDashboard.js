import React, { useState, useEffect } from 'react';
import InvoicesDashboardStyles from '../invoices/InvoicesDashboardStyles';
import { Box, Breadcrumbs, Grid, Stack, Pagination, Skeleton, SwipeableDrawer, Menu, MenuItem } from "@mui/material";
import Downloadcloud from '../../../../assets/svg/download-cloud.svg';
import Search from '../../../../assets/svg/search2.svg';
import { Link, useNavigate } from 'react-router-dom';
import Button from "../../../../components/customButton/Button";
import Text from '../../../../components/customText/Text';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ReactComponent as Plus } from '../../../../assets/svg/plus.svg';
import CustomPieChart from '../../../../components/charts/CustomPieChart';
import { ReactComponent as PartialIcon } from '../../../../assets/svg/partialInvoiceIcon.svg';
import { ReactComponent as AwaitIcon } from '../../../../assets/svg/invoiceAwaitIcon.svg';
import { addErrorMsg, addSuccessMsg, addWarningMsg, getCurrencySymbol } from '../../../../utils/utils';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import Table from '../../../../components/table/Table';
import CircularProgress from '../../../../components/progressbar/CircularProgress';
import fileIcon from '../../../../assets/svg/fi_file.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/cross.svg';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import DatePicker from '../../../../components/datePicker/Date';
import BillsApi from '../../../../apis/admin/sales/BillsApi';
import { dateFormat } from '../../../../utils/utils';
import moment from "moment";
import styled from '@emotion/styled';
import FileSaver from 'file-saver';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import disablePlus from '../../../../assets/client/disablePlus.svg';
import LocalStorage from '../../../../utils/LocalStorage';

const labels = ['Amount Billed', 'Overdue', 'Amount paid'];
const colors = ['#3992F5', '#FFB126', '#77D2B7'];
const values = ['raised_amount', 'overdue_amount', 'received_amount']

const StyledPagination = styled(Pagination)({
    "& .MuiPagination-ul li:last-child": {
        marginLeft: "16px",
        '& .MuiButtonBase-root': {
            border: 'none !important'
        }
    },
    "& .MuiPagination-ul li:last-child button::before": {
        content: "'Next'",
        marginRight: "8px",
    },
    "& .MuiPagination-ul li:first-child": {
        marginRight: "16px",
        '& .MuiButtonBase-root': {
            border: 'none !important'
        }
    },
    "& .MuiPagination-ul li:first-child button::after": {
        content: "'Prev'",
        marginLeft: "8px",
    },
    '& .MuiButtonBase-root': {
        border: "1px solid #F1F1F1 !important",
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
        display: 'none', // Hide the icons, but keep the text
    },
});

export default function BillsDashboard() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = InvoicesDashboardStyles();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
    const [openStatus, setOpenStatus] = useState(null);
    const [drawer, setDrawer] = useState(false);
    const [billRowData, setBillRowData] = useState([]);
    // const [searchImg, setSearchImg] = useState(true);
    const opStatus = Boolean(openStatus);
    const [dashboardInfo, setDashboardInfo] = useState({
        partially_paid: '',
        overdue: '',
        raised_amount: '',
        overdue_amount: '',
        received_amount: '',
        over_due_percentage: '',
        received_percentage: '',
    });

    const [filter, setFilter] = useState({
        from_date: '',
        to_date: '',
        search: '',
        filter_value: 1,
        status: '',
    });

    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 4,
            totalPages: ""
        }
    );

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

    const statusOptions = [
        {
            value: 'Drafts', id: 'Drafted',
        },
        {
            value: 'Submitted', id: 'Submitted',
        },
        {
            value: 'Partialy Approved', id: 'Approval In Progress',
        },
        {
            value: 'Approved', id: 'Approved',
        },
        {
            value: 'Rejected', id: 'Rejected',
        },
        {
            value: 'Overdue', id: 'Overdue',
        },
        {
            value: 'Paid', id: 'Paid',
        },
        {
            value: 'Partialy Paid', id: 'Partially Paid',
        },
        {
            value: 'Void', id: 'Void',
        },
        {
            value: 'Write Off', id: 'Write Off',
        },
    ]

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            billListingApi(filter, pagination);
            vendorDropdownApi()
            getDashBoardInfoApi();
        }, 300)

        // eslint-disable-next-line  
    }, [])

    const getDashBoardInfoApi = () => {
        setLoading(true);
        BillsApi.getDashBoardInfoApi().then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setDashboardInfo(res.data.data);
                }
            }, 300)
        })
    }

    const billListingApi = (filterData, paginationData) => {
        setTableLoading(true);
        BillsApi.getAllBillsList(filterData, paginationData).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setTableLoading(false);
                    setBillRowData(res.data.data);
                } if (res.data.data.length > 0) {
                    setPagination(res.data.pagination);
                }
            }, 200)
        })
    }

    const [vendorDropdown, setVendorDropdown] = useState([]);

    const vendorDropdownApi = () => {
        BillsApi.vendorDropdownApi('').then((res) => {
            if (res.data.statusCode === 1003) {
                setVendorDropdown(res.data.data);
            } else {
                setVendorDropdown([]);
            }
        })
    }



    const dateChange = (e, name) => {
        let date = e.$d
        setExportData({
            ...exportData,
            [name]: moment(date).format(dateFormat())
        },)
    }

    const [exportData, setExportData] = useState({
        request_id: LocalStorage.uid(),
        vendor_id: '',
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
            request_id: LocalStorage.uid(),
            vendor_id: '',
            from_date: '',
            to_date: '',
          })
    }

    const handleExportSubmit = () => {
        console.log(exportData,"expo")
        BillsApi.exportBill(exportData, LocalStorage.getAccessToken()).then(res => {
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
                    vendor_id: '',
                    from_date: '',
                    to_date: '',
                  })
            } else if (res.data.statusCode == 1013) {
                addWarningMsg(res.data.message);
                // setDrawer(false)
                // setExportData({  
                //     request_id: LocalStorage.uid(),
                //     vendor_id: '',
                //     from_date: '',
                //     to_date: '',
                //   })
            } else {
                addErrorMsg(res.data.message);
                // setDrawer(false)
                // setExportData({  
                //     request_id: LocalStorage.uid(),
                //     vendor_id: '',
                //     from_date: '',
                //     to_date: '',
                //   })
            }
        })
    }

    const handleSearch = (e) => {
        const text = e.target.value;
        setFilter({ ...filter, search: text })
        if (text.length > 1 || text.length == 0) {
            if (!tableLoading) {
                setTableLoading(true);
                setTimeout(() => {
                    searchAPICall(e.target.value);
                }, 2000);
            }
        }
    }

    const searchAPICall = (text) => {
        BillsApi.getAllBillsList({ ...filter, search: text }, { ...pagination, currentPage: 1, limit: 4 }).then((res) => {
            setTableLoading(false)
            if (res.data.statusCode === 1003) {
                setBillRowData(res.data.data);
            }
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            }
        })
    }


    const handleSelect = (e) => {
        let fromDate = "";
        let toDate = "";

        switch (e.target.value) {
            case 1: // All 
                fromDate = ''
                toDate = ''
                break;
            case 2: // This month
                fromDate = moment().startOf('month').format(dateFormat());
                toDate = moment().format(dateFormat());
                break;
            case 3: // Last 3 months
                fromDate = moment().subtract(3, 'months').format(dateFormat());
                toDate = moment().format(dateFormat());
                break;
            case 4: // Last 6 months
                fromDate = moment().subtract(6, 'months').format(dateFormat());
                toDate = moment().format(dateFormat());
                break;
            default:
                break;
        }
        setFilter({ from_date: fromDate, to_date: toDate, search: '', status: '', filter_value: [e.target.value] });
        billListingApi({ from_date: fromDate, to_date: toDate, search: '', status: '' }, { perPage: 4, currentPage: 1 });
        setPagination({
            total: "",
            currentPage: 1,
            perPage: 4,
            totalPages: ""
        });
    }


    const PieChartData = () => {
        const resultArray = labels.map((label, index) => ({
            value: Math.round(dashboardInfo[values[index]]),
            color: colors[index],
            label: label
        }));
        return resultArray;
    }

    const handleStatus = (args) => {
        if (args !== '') {
            billListingApi({ ...filter, status: args }, { perPage: 4, currentPage: 1 });
            setFilter({ ...filter, status: args })
            setPagination({
                total: "",
                currentPage: 1,
                perPage: 4,
                totalPages: ""
            });
        }
        setOpenStatus(null);
    }

    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }

    const closeBtn = () => {
        setFilter({ ...filter, search: '' })
        setTableLoading(true)
        setTimeout(() => {
            BillsApi.getAllBillsList({ ...filter, search: "" }, { ...pagination, currentPage: 1, limit: 4 }).then((res) => {
                setTableLoading(false)
                if (res.data.statusCode === 1003) {
                    setBillRowData(res.data.data);
                }
                if (res.data.pagination) {
                    setPagination(res.data.pagination);
                }
            })
        }, 1000);

    }

    const handleChangePagination = (e, page) => {
        let paginationData = { ...pagination, currentPage: page };
        setPagination({ ...paginationData });
        billListingApi(filter, paginationData);
    }



    const columns = [
        {
            field: "company_name",
            align: "left",
            headerAlign: "left",
            headerName: 'Vendor Name',
            sortable: false,
            disableColumnMenu: true,
            // flex: 1,
            width: 250,
            renderCell: (cellValues) => {
                return (
                    <Box display='flex' flexDirection='row' pt={'6px'} alignItems={'center'} gap={2}>
                        {tableLoading ? <Skeleton variant='circular' height={40} width={40} /> :
                            <CircularProgress
                                value={cellValues.row.is_active == false ? 0 : cellValues.row.profile_perecentage}
                                size={48}
                                color={cellValues.row.is_active == false ? '#FFFFFF' : '#037847'}
                                imgWidth='40px'
                                imgHeight='40px'
                                percentage={cellValues.row.profile_perecentage}
                                src={cellValues ? cellValues.row.company_logo : ''}
                                name={cellValues ? cellValues.row.company_name[0] : ''}
                                disable={false}
                            />
                        }
                        <Box pb={'5px'}>
                            {
                                tableLoading ? <Skeleton animation="wave" width="100px" height={18} />
                                    :
                                    <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#171717' }} nowrap >{cellValues.row.company_name}</Text>
                            }
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: "invoice_id",
            align: "left",
            headerAlign: "left",
            headerName: "Bill", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_view" && item.is_allowed == true))) ?
                    <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#16A34A', cursor: 'pointer' }} onClick={() => params.row.invoice_id ? params.row.invoice_id == "" ? null : navigate('/sales/bills/bills-history', { state: { data: params.row, pagination: pagination, } }) : null}>{params.row.invoice_id ? params.row.invoice_id : "--"}</Text>:
                    <Text smallBlack>{params.row.invoice_id ? params.row.invoice_id : "--"}</Text>
        },
        {
            field: "date",
            align: "left",
            headerAlign: "left",
            headerName: "Date", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.date ? params.row.date : "--"}</Text>

        },
        {
            field: "Hours",
            align: "left",
            headerAlign: "left",
            headerName: "Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.hours ? params.row.hours : "--"}</Text>
        },
        {
            field: "due_date",
            align: "left",
            headerAlign: "left",
            headerName: "Due Date", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.due_date ? params.row.due_date : "--"}</Text>
        },
        {
            field: "amount",
            align: "left",
            headerAlign: "left",
            headerName: "Amount", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.amount ? `${getCurrencySymbol()} ${params.row.amount}` : "--"}</Text>
        },
        {
            field: "status",
            align: "left",
            headerAlign: "left",
            flex: 1,
            headerName:
                <>
                    <Box display='flex' flexDirection='row' columnGap={1}>
                        <Text headerBlack>Status</Text>
                        <KeyboardArrowDownRoundedIcon style={{ height: '22px', width: '22px', paddingTop: '1px', color: '#737373 !important', cursor: 'pointer' }} onClick={(e) => setOpenStatus(e.currentTarget)} />
                    </Box>
                    <Menu
                        id="basic-menu"
                        anchorEl={openStatus}
                        open={opStatus}
                        onClose={() => handleStatus('')}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '12px',
                                boxShadow: 'none !important',
                                border: '1px solid #EAECF0 !important',
                                width: '140px !important',
                                maxHeight: '200px !important',
                            }
                        }}
                    >
                        {
                            statusOptions.map((option) => (
                                <MenuItem key={option.id} onClick={() => handleStatus(option.id)} className={classes.viewText} >{option.value}</MenuItem>
                            ))
                        }


                    </Menu>
                </>,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.status ? params.row.status : "--"}</Text>
        },

        {
            field: "attachment",
            align: "center",
            headerAlign: "center",
            headerName: "Attachment", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                tableLoading ?
                    <Skeleton animation="wave" width="18px" variant='rounded' height='20px' />
                    :
                    params.row.ledger_document_url ?
                        <img src={fileIcon} alt='fileIcon' style={{ cursor: 'pointer' }} onClick={() => downloadDoc(params.row.ledger_document_url)} /> : '--'
        }
    ];





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
                <Box onClick={() => setDrawer(false)} sx={{ cursor: 'pointer' }}>
                    <CloseIcon />
                </Box>

            </Box>


            <Box width={'100%'} height={'85vh'} px={4}>

                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <SearchSelect
                            labelText={'Vendor'}
                            name={'vendor_id'}
                            options={vendorDropdown}
                            value={exportData.vendor_id}
                            onChange={excelHandleChange}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <DatePicker
                            name={'from_date'}
                            onChange={(e, args) => dateChange(e, 'from_date')}
                            labelText={'From'}
                            value={exportData.from_date}
                            maxDate={moment().format(dateFormat())}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <DatePicker
                            name={'to_date'}
                            onChange={(e, args) => dateChange(e, 'to_date')}
                            labelText={'To'}
                            value={exportData.to_date}
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

    return (

        <Box className={classes.containerMain} >
            <Box width={'100%'} mb={'20px'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='' className={classes.linkStyle}><Text className={classes.navText1}>Home</Text></Link>
                    <Link to='' className={classes.linkStyle}><Text className={classes.navText1}>Sales</Text></Link>
                    <Link to='' className={classes.navText2}><Text className={classes.navText1}>Bills</Text></Link>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    {
                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_payment_create" && item.is_allowed == true))) ?
                            <Button addNew startIcon={<Plus />} onClick={() => navigate('/sales/add-bills')} sx={{ height: '36px !important', minWidth: '144px !important', fontWeight: `${400} !important`, padding: '0px 20px !important' }}>Add Bill</Button> :
                            <Button addNewDisable  sx={{ height: '36px !important', minWidth: '144px !important'}}><img src={disablePlus} alt='add' style={{ marginRight: '10px' }} />Add Bill</Button>
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


            <Box width={'100%'}>
                <Grid container spacing={2} >
                    <Grid container item lg={3} md={12} rowSpacing={1} columnSpacing={1}>
                        <Grid item lg={12} md={6} sm={6}>
                            <Box className={classes.leftcard}>
                                <Stack direction={'row'} mb={'6px'} gap={2} >
                                    {loading ? <Skeleton variant="rounded" height={35} width={35} /> : <PartialIcon />}
                                    <Stack direction={'column'} mb={'6px'} >
                                        {loading ?
                                            <>
                                                <Skeleton variant="text" sx={{ fontSize: '13px', width: '160px' }} />
                                                <Skeleton variant="text" sx={{ fontSize: '22px', width: '40px' }} />
                                            </>
                                            :
                                            <>
                                                <Text sx={{ font: '13px Nunito', fontWeight: `${500}`, color: '#404040' }}>Partially paid Bills</Text>
                                                <Text sx={{ font: '22px Nunito', fontWeight: `${600}`, color: '#171717' }}>{dashboardInfo.partially_paid ? dashboardInfo.partially_paid : '--'}</Text>
                                            </>
                                        }
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item lg={12} md={6} sm={6}>
                            <Box className={classes.leftcard}>
                                <Stack direction={'row'} mb={'6px'} gap={2} >
                                    {loading ? <Skeleton variant="rounded" height={35} width={35} /> : <AwaitIcon />}

                                    <Stack direction={'column'} mb={'6px'} >


                                        {loading ?
                                            <>
                                                <Skeleton variant="text" sx={{ fontSize: '13px', width: '160px' }} />
                                                <Skeleton variant="text" sx={{ fontSize: '22px', width: '40px' }} />
                                            </>
                                            :
                                            <>
                                                <Text sx={{ font: '13px Nunito', fontWeight: `${500}`, color: '#404040' }}>Bills Overdue</Text>
                                                <Text sx={{ font: '22px Nunito', fontWeight: `${600}`, color: '#171717' }}>{dashboardInfo.overdue ? dashboardInfo.overdue : '--'}</Text>
                                            </>
                                        }
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item lg={9} md={12} sm={12}>

                        <Box className={classes.rightcard} p={'20px 30px 20px 20px'}>
                            <Grid container spacing={0} >
                                <Grid container item lg={3} md={3} sm={6} xs={6} alignItems={'space-between'} justifyContent={'space-between'} direction={'column'}>

                                    {loading ?
                                        <Skeleton variant="text" sx={{ fontSize: '23px', width: '150px' }} />
                                        :
                                        <Text sx={{ font: '22px Nunito', fontWeight: `${600}`, color: '#171717', }}>Bills Amount</Text>}

                                    <Box >
                                        <Stack direction={'row'} mb={'6px'}>
                                            {loading ?
                                                <Skeleton variant="text" sx={{ fontSize: '13px', width: '150px' }} />
                                                :
                                                <>
                                                    <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#0C75EB", borderRadius: "50%" }}></Box>
                                                    <Text sx={{ font: '13px Nunito', fontWeight: `${500}`, color: '#404040' }}>Amount Billed</Text>
                                                </>
                                            }
                                        </Stack>

                                        {loading ?
                                            <Skeleton variant="text" sx={{ fontSize: '18px', width: '90px' }} />
                                            :
                                            <Text sx={{ font: '18px Nunito', fontWeight: `${600}`, color: '#171717' }}>{`${getCurrencySymbol()} ${dashboardInfo.raised_amount ? dashboardInfo.raised_amount : '--'}`}</Text>}
                                    </Box>

                                </Grid>
                                <Grid container item lg={3} md={3} sm={6} xs={6} alignItems={'end'} pl={{ lg: 6 }}>
                                    <Box >
                                        <Stack direction={'row'} mb={'6px'}>
                                            {loading ?
                                                <Skeleton variant="text" sx={{ fontSize: '13px', width: '150px' }} />
                                                :
                                                <>
                                                    <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#77D2B7", borderRadius: "50%" }}></Box>
                                                    <Text sx={{ font: '13px Nunito', fontWeight: `${500}`, color: '#404040' }}>Amount paid</Text>
                                                </>
                                            }
                                        </Stack>

                                        {loading ? <Skeleton variant="text" sx={{ fontSize: '18px', width: '90px' }} /> : <Text sx={{ font: '18px Nunito', fontWeight: `${600}`, color: '#171717' }}>{`${getCurrencySymbol()} ${dashboardInfo ? dashboardInfo.received_amount : '--'}`}</Text>}
                                    </Box>
                                </Grid>
                                <Grid container item lg={3} md={3} sm={6} xs={6} alignItems={{ lg: 'end', md: 'end', sm: 'center', xs: 'center' }} pl={{ lg: 15 }}>
                                    <Box pt={{ lg: 5 }}>
                                        <Stack direction={'row'} mb={'6px'}>

                                            {loading ? <Skeleton variant="text" sx={{ fontSize: '13px', width: '70px' }} /> :
                                                <>
                                                    <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#FFB126", borderRadius: "50%" }}></Box>
                                                    <Text sx={{ font: '13px Nunito', fontWeight: `${500}`, color: '#404040' }}>Overdue</Text>
                                                </>
                                            }

                                        </Stack>

                                        {loading ? <Skeleton variant="text" sx={{ fontSize: '18px', width: '90px' }} /> : <Text sx={{ font: '18px Nunito', fontWeight: `${600}`, color: '#171717' }}>{`${getCurrencySymbol()} ${dashboardInfo.overdue_amount ? dashboardInfo.overdue_amount : '--'}`}</Text>}
                                    </Box>
                                </Grid>
                                <Grid item container lg={3} md={3} sm={6} xs={6} justifyContent={{ lg: 'end' }} pr={{ lg: 1 }} mt={{ lg: 0, md: 0, sm: 5, xs: 5 }}>
                                    <Box sx={{ height: '115px', width: '115px' }}>
                                        {loading ? <Skeleton variant="circular" height={115} width={115} /> : <CustomPieChart data={PieChartData()} />}
                                    </Box>


                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>
                </Grid>

            </Box>

            <Grid container rowSpacing={'22px'} mt={'20px'} justifyContent={'space-between'}>
                <Grid item >
                    <div className={classes.searchField}>
                        <input
                            type="text"
                            value={filter.search}
                            className={classes.globalSearchInput}
                            placeholder="Search By Vendor Name / Bill ID"
                            onChange={handleSearch}

                        />
                        <button
                            type="button"
                            className={classes.searchIcon}
                        >
                            {filter.search.length == 0 ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={() => closeBtn()} />}
                        </button>
                    </div>
                </Grid>
                <Grid item sx={{ width: '147px' }}>
                    <CustomSelect
                        viewDrop
                        scrollTrue={true}
                        options={filterOptions}
                        value={filter.filter_value}
                        onChange={handleSelect}

                    />
                </Grid>
            </Grid>

            <Box sx={{ width: '100%' }} mt={5}>
                <Table
                    height={'336px'}
                    rows={tableLoading ? [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] : billRowData}
                    columns={columns}
                    hideFooter={true}
                    hidePagination={true}
                    isLoading={tableLoading}
                />

                <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', marginTop: "31px" }}>
                    <Stack spacing={2} >

                        <StyledPagination
                            count={parseInt(pagination.totalPages)}
                            variant="outlined"
                            shape="rounded"
                            page={parseInt(pagination.currentPage)}
                            onChange={handleChangePagination}
                            disabled={billRowData.length > 0 ? false : true}
                        />

                    </Stack>

                </Box>

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





    )
};