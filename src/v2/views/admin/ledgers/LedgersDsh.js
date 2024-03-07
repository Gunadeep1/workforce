import React, { useEffect, useState } from 'react';
import { Box, Grid, InputBase, Paper, SwipeableDrawer, Tab, Skeleton, Stack, Pagination } from '@mui/material';
import Text from '../../../components/customText/Text';
import { TabContext, TabList } from '@mui/lab';
import LedgerDshStyles from './LedgerDshStyles';
import Button from '../../../components/customButton/Button';
import cloud from '../../../assets/client/cloudIcon.svg';
import Userplus from '../../../assets/svg/user-plus.svg';
import Datepicker from '../../../components/datePicker/Date';
import CircularProgress from '../../../components/progressbar/CircularProgress';
import LedgerApi from '../../../apis/ledger/LedgerApi';
import Table from '../../../components/table/Table'
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg, getCurrencySymbol } from '../../../utils/utils';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchGlobal from '../../../assets/svg/search2.svg';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LocalStorage from '../../../utils/LocalStorage';
import disablePlus from '../../../assets/client/disablePlus.svg';
import InvoicesApi from '../../../apis/admin/sales/InvoicesApi';
import SearchSelect from '../../../components/selectField/SearchSelect';
import BillsApi from '../../../apis/admin/sales/BillsApi';
// import FileSaver from 'file-saver';
import { dateFormat } from '../../../utils/utils';
import moment from "moment";

export default function LedgersDsh() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = LedgerDshStyles();
    const location = useLocation();
    const tableView = location && location.state && location.state.tableView
    const [value, setValue] = useState('1');
    const [drawer, setDrawer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [clientRows, setClientRows] = useState([]);
    const [vendorRows, setVendorRows] = useState([]);
    const [searchImg, setSearchImg] = useState(true);

    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        company_name: "",
        company_id: "",
        search: "",
    })
    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );

    const [vendorPagination, setVendorPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );

    const StyledPagination = styled(Pagination)({
        "& .MuiPagination-ul li:last-child": {
            marginLeft: "16px",
            '& .MuiButtonBase-root': {
                border: 'none !important'
            },
        },
        "& .MuiPagination-ul li:last-child button::before": {
            content: "'Next'",
            marginRight: "8px",
        },
        "& .MuiPagination-ul li:first-child": {
            marginRight: "16px",
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

    useEffect(() => {
        setTimeout(() => {
            clientDropdownApi()
            vendorDropdownApi()
            paymentListingApi(filter, pagination)
            billListingApi(filter, vendorPagination)
        }, 300)
        if (tableView == 'bills') {
            setValue('2');
        } else {
            setValue('1');
        }
        // eslint-disable-next-line
    }, [])

    const handleChange = (event, newValue) => {
        setPagination({ ...pagination, currentPage: 1, search: '' });
        setVendorPagination({ ...vendorPagination, currentPage: 1, search: '' });
        setValue(newValue);
        if (newValue == '1') {
            paymentListingApi(filter, pagination)
        }
        if (newValue == '2') {
            billListingApi(filter, vendorPagination)
        }
    };

    const paymentListingApi = (data, paginationData) => {
        setLoading(true);
        LedgerApi.paymentListing(data, paginationData).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setLoading(false);
                    setClientRows(response.data.data);
                    setPagination(response.data.pagination);
                }
            }, 300)
        })
    }

    const billListingApi = (data, vendorPaginationData) => {
        setLoading(true);
        LedgerApi.billListing(data, vendorPaginationData).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setLoading(false);
                    setVendorRows(response.data.data);
                    setVendorPagination({ ...response.data.pagination })
                }
            }, 300)
        })
    }

    const changeHandler = (e) => {
        if (e.target.value.length > 0) {
            setSearchImg(false);
        } else {
            setSearchImg(true);
        }
        setFilter({ ...filter, search: e.target.value })
        if (value == '1') {
            setTimeout(() => {
                LedgerApi.paymentListing({ ...filter, search: e.target.value.length > 1 ? e.target.value : '' }, pagination).then((res) => {
                    setClientRows(res.data.data);
                    setPagination(res.data.pagination);
                })
            }, 400);
        } else if (value == '2') {
            setTimeout(() => {
                LedgerApi.billListing({ ...filter, search: e.target.value.length > 1 ? e.target.value : '' }, vendorPagination).then((res) => {
                    setVendorRows(res.data.data);
                    setVendorPagination(res.data.pagination);
                })
            }, 400);
        }
    }

    const closeBtn = () => {
        setSearchImg(true)
        setFilter({ ...filter, search: "" })
        if (value == '1') {
            LedgerApi.paymentListing({ ...filter, search: "" }, { ...pagination, currentPage: 1, limit: 5 }).then((res) => {
                console.log(res.data.pagination, "data")
                setClientRows(res.data.data);
                setPagination(res.data.pagination);
            })
        }

    }

    const handleChangePagination = (e, page) => {
        if (value == '1') {
            pagination['currentPage'] = page
            setPagination(pagination);
            paymentListingApi(filter, pagination);
        } else if (value == '2') {
            vendorPagination['currentPage'] = page
            setVendorPagination(vendorPagination);
            billListingApi(filter, vendorPagination)
        }
    }

    const handleViewProfile = (args) => {
        if (value == '1') {
            navigate('/ledgers/Newpayment', { state: { id: args.id, action: 'view' } });
        } else if (value == '2') {
            navigate('/ledgers/NewBills', { state: { id: args.id, action: 'view' } });
        }
    }

    const handleNavigate = () => {
        if (value == '1') {
            navigate('/ledgers/Newpayment');
        } else if (value == '2') {
            navigate('/ledgers/NewBills');
        }
    }

    const dateChange = (e, name) => {
        let date = e.$d
        setExportData({
            ...exportData,
            [name]: moment(date).format(dateFormat())
        },)
    }

    const [clientDropdown, setClientDropdown] = useState([]);
    const clientDropdownApi = () => {
        InvoicesApi.clientDropdownApi('').then((res) => {
            if (res.data.statusCode === 1003) {
                setClientDropdown(res.data.data);
            } else {
                setClientDropdown([]);
            }
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

    const [exportData, setExportData] = useState({
        request_id: LocalStorage.uid(),
        client_id: '',
        from_date: '',
        to_date: '',
        vendor_id: '',
    });

    const excelHandleChange = (e) => {
        exportData[e.target.name] = e.target.value;
        setExportData({ ...exportData });
    }

    const handleExportSubmit = () => {
        console.log(exportData, "expo")
        if (value == '1') {
            LedgerApi.exportPayment(exportData, LocalStorage.getAccessToken()).then(res => {
                if (res.data.statusCode == 1003) {
                    addSuccessMsg(res.data.message);
                    // FileSaver.saveAs(res.data.path);
                    console.log(res.data.path)
                    const url = res.data.path;
                    const link = document.createElement('a');
                    link.href = url;
                    let file_name = url.split('/').pop();
                    link.setAttribute('download', file_name);
                    document.body.appendChild(link);
                    link.click();
                    setDrawer(false)
                    setExportData({
                        request_id: LocalStorage.uid(),
                        client_id: '',
                        from_date: '',
                        to_date: '',
                        vendor_id: '',
                    })
                } else if (res.data.statusCode == 1013) {
                    addWarningMsg(res.data.message);

                } else {
                    addErrorMsg(res.data.message);

                }
            })
        } else if (value == '2') {
            LedgerApi.exportBillPayment(exportData, LocalStorage.getAccessToken()).then(res => {
                if (res.data.statusCode == 1003) {
                    addSuccessMsg(res.data.message);
                    // FileSaver.saveAs(res.data.path);
                    console.log(res.data.path)
                    const url = res.data.path;
                    const link = document.createElement('a');
                    link.href = url;
                    let file_name = url.split('/').pop();
                    link.setAttribute('download', file_name);
                    document.body.appendChild(link);
                    link.click();
                    setDrawer(false)
                    setExportData({
                        request_id: LocalStorage.uid(),
                        client_id: '',
                        from_date: '',
                        to_date: '',
                        vendor_id: '',
                    })
                } else if (res.data.statusCode == 1013) {
                    addWarningMsg(res.data.message);

                } else {
                    addErrorMsg(res.data.message);

                }

            })
        }

    }
    const cancelExport = () => {
        setDrawer(false)
        setExportData({
            request_id: LocalStorage.uid(),
            client_id: '',
            from_date: '',
            to_date: '',
            vendor_id: '',
        })
    }

    const ExportView = () => (
        <Box sx={{
            width: '488px', height: '100vh', overflow: "auto",
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
            <Box height={'10vh'} display={'flex'} alignItems={'center'} pl={4} >
                <Text BlackExtraDark>Export</Text>
            </Box>
            <Box width={'100%'} height={'85vh'} px={4} >


                <Grid container sx={{ pt: 2 }} justifyContent={'space-between'} spacing={3}>
                    <Grid item lg={12} justifyContent={'center'}>
                        {value == '1' &&
                            <SearchSelect
                                name={'client_id'}
                                labelText={'Client'}
                                options={clientDropdown}
                                value={exportData.client_id}
                                onChange={excelHandleChange}
                            />
                        }
                        {value == '2' &&
                            <SearchSelect
                                labelText={'Vendor'}
                                name={'vendor_id'}
                                options={vendorDropdown}
                                value={exportData.vendor_id}
                                onChange={excelHandleChange}
                            />
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={10} xs={10}   >
                        <Datepicker

                            name={"from_date"}
                            onChange={(e, args) => dateChange(e, 'from_date')}
                            labelText={'From'}
                            value={exportData.from_date}
                            maxDate={moment().format(dateFormat())}

                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={10} xs={10}>
                        <Datepicker
                            labelText={"To"}
                            name={"to_date"}
                            onChange={(e, args) => dateChange(e, 'to_date')}

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
        </Box>
    )

    const columns = [
        {
            field: "client_name",
            align: "left",
            headerAlign: "left",
            headerName: value == '1' ? 'Client Name' : 'Vendor Name',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Box display='flex' flexDirection='row' pt={'6px'}>
                        {loading ? <Skeleton animation="wave" width="40px" height='65px' style={{ borderRadius: '50%' }} /> :
                            <CircularProgress
                                value={cellValues.row.is_active == false ? 0 : cellValues.row.company_profile_perecentage}
                                size={48}
                                color={cellValues.row.is_active == false ? '#FFFFFF' : '#037847'}
                                imgWidth='40px'
                                imgHeight='40px'
                                percentage={cellValues.row.company_profile_perecentage}
                                src={cellValues ? cellValues.row.document_url : ''}
                                name={cellValues ? cellValues.row.company_name[0] : ''}
                                disable={cellValues.row.is_active == false ? true : false}
                            />
                        }
                        <Box p={'7px 10px 5px 15px'}>
                            {
                                cellValues.row.is_active == false ?
                                    <>
                                        <Text nowrap smallGrey>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_name}</Text>
                                        <Text smallGrey sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_reference_id}</Text>
                                    </> :
                                    <>
                                        {value == '1' ?
                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "invoice_view" && item.is_allowed == true)) ?
                                                <Text smallBlue nowrap onClick={() => handleViewProfile(cellValues.row)} sx={{ cursor: 'pointer' }}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_name}</Text> :
                                                <Text smallGrey nowrap sx={{ cursor: 'default' }}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_name}</Text>) :
                                            value == '2' ?
                                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_view" && item.is_allowed !== true)) ?
                                                    <Text smallBlue nowrap onClick={() => handleViewProfile(cellValues.row)} sx={{ cursor: 'pointer' }}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_name}</Text> :
                                                    <Text smallGrey nowrap sx={{ cursor: 'default' }}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_name}</Text>) : ''
                                        }
                                        <Text smallBlack sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.company_reference_id}</Text>
                                    </>
                            }
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: 'payment_ref_no',
            align: "center",
            headerAlign: "center",
            headerName: 'Payments Ref No',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <>
                        {
                            params.row.is_active == false ? <Text mediumGrey >{params.row.payment_ref_no ? params.row.payment_ref_no : "--"}</Text> : <Text smallBlack>{params.row.payment_ref_no ? params.row.payment_ref_no : "--"}</Text>
                        }
                    </>
        },
        {
            field: 'payment_no',
            align: "center",
            headerAlign: "center",
            headerName: 'Payment No',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <>
                        {
                            params.row.is_active == false ? <Text mediumGrey >{params.row.payment_no ? params.row.payment_no : "--"}</Text> : <Text smallBlack>{params.row.payment_no ? params.row.payment_no : "--"}</Text>
                        }
                    </>
        },
        {
            field: "invoice_numbers",
            align: "center",
            headerAlign: "center",
            headerName: 'Invoice No',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,

            renderCell: (cellValues) => {
                return (
                    <>
                        {
                            cellValues.row.is_active === false ?
                                (
                                    cellValues.row.invoice_numbers.length > 2 ?
                                        <>
                                            <Text smallBlack>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.invoice_numbers.slice(0, 2).map(invoice => invoice.no).join(", ")}
                                                <BlackToolTip arrow title={
                                                    <Text mediumWhite sx={{ padding: '5px 12px !important' }}>
                                                        {cellValues.row.invoice_numbers.slice(2).map(invoice => (<div key={invoice.no}>{invoice.no}</div>))}
                                                    </Text>} placement="right">
                                                    <span style={{ color: '#0C75EB', fontSize: '11px', cursor: 'pointer', marginLeft: '6px', fontWeight: 500 }}>+{cellValues.row.invoice_numbers.length - 2} more</span>
                                                </BlackToolTip>
                                            </Text>
                                        </>
                                        :
                                        <Text smallBlack>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.invoice_numbers.map(invoice => invoice.no).join(", ")}</Text>
                                )
                                :
                                (
                                    cellValues.row.invoice_numbers.length > 2 ?
                                        <>
                                            <Text smallBlack>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.invoice_numbers.slice(0, 2).map(invoice => invoice.no).join(", ")}
                                                <BlackToolTip arrow title={
                                                    <Text mediumWhite sx={{ padding: '5px 12px !important' }}>
                                                        {cellValues.row.invoice_numbers.slice(2).map(invoice => (<div key={invoice.no}>{invoice.no}</div>))}
                                                    </Text>} placement="right">
                                                    <span style={{ color: '#0C75EB', fontSize: '11px', cursor: 'pointer', marginLeft: '6px' }}>+{cellValues.row.invoice_numbers.length - 2} more</span>
                                                </BlackToolTip>
                                            </Text>
                                        </>
                                        :
                                        <Text smallBlack>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.invoice_numbers.map(invoice => invoice.no).join(", ")}</Text>
                                )
                        }

                    </>
                )
            }
        },
        {
            field: "amount",
            align: "center",
            headerAlign: "center",
            headerName: 'Amount',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <>
                        {
                            params.row.is_active == false ? <Text mediumGrey >{params.row.amount ? `${getCurrencySymbol()} ${params.row.amount}` : "--"}</Text> : <Text smallBlack>{params.row.amount ? `${getCurrencySymbol()} ${params.row.amount}` : "--"}</Text>
                        }
                    </>
        },

        {
            field: "payment_type",
            align: "center",
            headerAlign: "center",
            headerName: 'Amount Type',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <>
                        {
                            params.row.is_active == false ? <Text mediumGrey >{params.row.payment_type ? params.row.payment_type : "--"}</Text> : <Text smallBlack>{params.row.payment_type ? params.row.payment_type : "--"}</Text>
                        }
                    </>
        },
    ];

    return (
        <Grid container pl={13} pt={3}>
            <Grid item lg={12} md={12} sm={12} xs={12} pl={3}>
                <Text headerBlack>Ledger</Text>
            </Grid>
            <Grid item container lg={12} md={12} sm={12} xs={12} pt={2} pl={2}>
                <Grid item lg={6.5} md={5} sm={7} xs={12}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '320px' }}>
                            <TabList onChange={handleChange}>
                                <Tab label='Payments Received' value="1" className={value == '1' ? classes.activeText : classes.tabText} />
                                <Tab label='Bills Paid' value="2" className={value == '2' ? classes.activeText : classes.tabText} />
                            </TabList>
                        </Box>
                    </TabContext>
                </Grid>
                <Grid item container lg={5.5} md={7} sm={5} xs={12} spacing={2}>
                    <Grid item lg={6.5} md={6.5} sm={10} xs={12}>
                        <Paper className={classes.Paper} display={'flex'}>
                            <InputBase
                                className={classes.InputBase}
                                fullWidth
                                // name="search"
                                type="text"
                                onChange={changeHandler}
                                placeholder={value == '1' ? 'Search by Client Name / Payment ID' : 'Search by Vendor Name / Bills ID '}
                                value={filter.search}
                            />
                            {/* <img src={Search} alt="Search" style={{ color: `${btnBgGrey.shade4} !important`, height: '24px !important', width: '24px !important' }} /> */}
                            {searchImg ? <img src={SearchGlobal} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={closeBtn} />}

                        </Paper>
                    </Grid>

                    <Grid item lg={3} >
                        {value == '1' ?
                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "invoice_create" && item.is_allowed == true)) ?
                                <Button addButton sx={{ width: { sm: '100px' } }} onClick={() => handleNavigate()}><img src={Userplus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />New Payment</Button> :
                                <Button addButtonDisable sx={{ width: { sm: '100px' } }}><img src={disablePlus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />New Payment</Button>) :
                            value == '2' ?
                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_create" && item.is_allowed == true)) ?
                                    <Button addButton sx={{ width: { sm: '100px' } }} onClick={() => handleNavigate()}><img src={Userplus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />New Bill</Button> :
                                    <Button addButtonDisable sx={{ width: { sm: '100px' } }}><img src={disablePlus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />New Bill</Button>) : ''
                        }
                    </Grid>
                    <Grid item lg={1.5}>
                        <Box className={classes.cloud} p={1} justifyContent='center' onClick={() => setDrawer("export")}>
                            <img src={cloud} alt="Userplus" style={{ height: '20px', width: '20px', cursor: "pointer", }} />
                        </Box>
                    </Grid>

                </Grid>
                <Grid item lg={11.6} md={11} sm={11} xs={11} pt={4} >
                    {
                        value == "1" ?
                            <Table
                                columns={columns}
                                rows={clientRows}
                                hideFooter={true}
                                hideFooterPagination={true}
                                height={405}
                            />
                            :
                            <Table
                                rows={vendorRows}
                                columns={columns}
                                hideFooter={true}
                                hideFooterPagination={true}
                                height={405}
                            />
                    }
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', marginTop: "20px", }}>
                        <Stack spacing={2}>
                            {
                                value == '1' && clientRows.length > 0 ?
                                    <StyledPagination
                                        count={clientRows.length > 0 && pagination && parseInt(pagination.totalPages)}
                                        variant="outlined"
                                        shape="rounded"
                                        page={clientRows.length > 0 && pagination && parseInt(pagination.currentPage)}
                                        onChange={handleChangePagination}
                                    /> :
                                    value == '2' && vendorRows.length > 0 ?
                                        <StyledPagination
                                            count={vendorRows.length > 0 && vendorPagination && parseInt(vendorPagination.totalPages)}
                                            variant="outlined"
                                            shape="rounded"
                                            page={vendorRows.length > 0 && vendorPagination && parseInt(vendorPagination.currentPage)}
                                            onChange={handleChangePagination}
                                        /> : ''
                            }
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
                // onClose={toggleDrawer(false, state.view)}
                // onOpen={toggleDrawer(true, state.view)}
                transitionDuration={400}
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
        </Grid>
    )
};