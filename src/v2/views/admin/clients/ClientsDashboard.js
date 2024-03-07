import React from 'react';
import ClientStyles from './ClientStyles';
import { Box, Grid, InputBase, Menu, MenuItem, Pagination, Paper, Skeleton, Tab, Typography, Stack, SwipeableDrawer } from '@mui/material';
import Text from '../../../components/customText/Text';
import { TabContext, TabList } from '@mui/lab';
import Button from '../../../components/customButton/Button';
import menu from '../../../assets/client/ActionMenu.svg';
import Search from '../../../assets/svg/search1.svg';
import cloud from '../../../assets/client/cloudIcon.svg';
import Userplus from '../../../assets/svg/user-plus.svg';
import disablePlus from '../../../assets/client/disableAdd.svg';
import { btnBgGrey } from '../../../theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import ClientsApi from '../../../apis/admin/clients/ClientsApi';
import VendorApi from '../../../apis/admin/clients/VendorApi';
import EndClientApi from '../../../apis/admin/clients/EndClientApi';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CircularProgress from '../../../components/progressbar/CircularProgress';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import deactivateImg from '../../../assets/client/deactivateImg.svg';
import CustomButton from '../../../components/customButton/Button';
// import { generateRandom } from '../../../../v1/utils/utils';
import LocalStorage from '../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../utils/utils';
import Table from '../../../components/table/Table';
import { styled } from '@mui/system';
import SearchSelect from '../../../components/selectField/SearchSelect';
import BillsApi from '../../../apis/admin/sales/BillsApi';
import InvoicesApi from '../../../apis/admin/sales/InvoicesApi';
// import FileSaver from 'file-saver';


export default function ClientsDashboard() {
    const classes = ClientStyles();
    const navigate = useNavigate();
    const location = useLocation();
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const [value, setValue] = useState('1');
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [openStatus, setOpenStatus] = useState(null);
    const open = Boolean(anchorEl);
    const open1 = Boolean(anchorEl1);
    const opStatus = Boolean(openStatus);
    const data = location && location.state
    const [clientRows, setClientRows] = useState([]);
    const [vendorRows, setVendorRows] = useState([]);
    const [endCltRows, setEndCltRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rowData, setRowData] = useState({});
    const [deletePopup, setDeletePopup] = useState(false);
    const [drawer, setDrawer] = useState(false); // eslint-disable-next-line
    const [clientDropdown, setClientDropdown] = useState([]);
    const [filter, setFilter] = useState({
        sortColumn: '',
        sortOrder: '',
        status: '',
        search: ''
    })

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            clientListingApi(filter, pagination);
            vendorsListingApi(filter, vendorPagination);
            EndCltListingApi(filter, endClientPagination);
            vendorDropdownApi()
            clientDropdownApi()
            endClientDropdownApi()
        }, 300)
        if (data && data.page == 'vendors') {
            setValue('2')
        } else if (data && data.page == 'end-Client') {
            setValue('3')
        } else {
            setValue('1')
        }// eslint-disable-next-line  
    }, [])

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

    const handleChange = (event, newValue) => {
        setPagination({ ...pagination, currentPage: 1, search: '' });
        setVendorPagination({ ...vendorPagination, currentPage: 1, search: '' });
        setEndClientPagination({ ...endClientPagination, currentPage: 1, search: '' })
        setValue(newValue);
        if (value == '1') {
            clientListingApi(filter, pagination)
        } else if (value == '2') {
            vendorsListingApi(filter, vendorPagination)
        } else if (value == '3') {
            EndCltListingApi(filter, endClientPagination)
        }
    };

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
    const [endClientPagination, setEndClientPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 5,
            totalPages: ""
        }
    );

    const handleClick = (event, args) => {
        setAnchorEl(event.currentTarget);
        setTimeout(() => {
            setRowData(args);
        }, 300)
    };
    const handleClick2 = (event, args) => {
        setAnchorEl1(event.currentTarget);
        setTimeout(() => {
            setRowData(args);
        }, 300)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClose1 = () => {
        setAnchorEl1(null);
    };

    const handleStatus = (args) => {
        setOpenStatus(null);
        if (value == '1') {
            clientListingApi({ ...filter, status: args }, pagination);
        } else if (value == '2') {
            vendorsListingApi({ ...filter, status: args }, vendorPagination)
        } else if (value == '3') {
            EndCltListingApi({ ...filter, status: args }, endClientPagination)
        }
    }

    const handleView = () => {
        if (value == '1') {
            navigate('/clients/clients-user-profile', { state: { id: rowData.id, viewState: 'view', data: rowData } })
        } else if (value == '2') {
            navigate('/vendor/user-profile', { state: { id: rowData.id, viewState: 'view', data: rowData } })
        } else if (value == '3') {
            navigate('/clients/end-clients-user-profile', { state: { id: rowData, viewState: 'view', data: rowData } })
        }
    }

    const handleEdit = () => {
        if (value == '1') {
            navigate('/clients/clients-user-profile', { state: { id: rowData.id, viewState: 'edit', data: rowData } })
        } else if (value == '2') {
            navigate('/vendor/user-profile', { state: { id: rowData.id, viewState: 'edit', data: rowData } })
        } else if (value == '3') {
            navigate('/clients/end-clients-user-profile', { state: { id: rowData, viewState: 'edit', data: rowData } })
        }
    }

    const deactivateRow = () => {
        setAnchorEl(null);
        setDeletePopup(true);
    }

    const activateRow = () => {
        setAnchorEl1(null);
        setDeletePopup(true);
    }

    const deleteApi = () => {
        const data = {
            request_id: LocalStorage.uid(),
        }
        if (value == '1') {
            ClientsApi.destroy(rowData.id, data).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg('Client deleted Successfully');
                    setAnchorEl(null);
                    setTimeout(() => {
                        clientListingApi(filter, pagination);
                    }, 300)
                    setDeletePopup(false);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        } else if (value == '2') {
            VendorApi.destroy(rowData.id, data).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg('Vendor deleted Successfully');
                    setAnchorEl(null);
                    setTimeout(() => {
                        vendorsListingApi(filter, vendorPagination);
                    }, 300)
                    setDeletePopup(false);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        } else if (value == '3') {
            EndClientApi.destroy(rowData.id, data).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg('End-Client deleted Successfully');
                    setAnchorEl(null);
                    setTimeout(() => {
                        EndCltListingApi(filter, endClientPagination);
                    }, 300)
                    setDeletePopup(false);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        }
    }

    const deleteRow = () => {
        setDeletePopup(false);
        let disableClientRow = clientRows.filter(item => item.id == rowData.id);
        let disableVendorRow = vendorRows.filter(item => item.id == rowData.id);
        let disableEndClientRow = endCltRows.filter(item => item.id == rowData.id);
        setOpenStatus(null);
        const updateData = {
            request_id: LocalStorage.uid(),
            status: rowData.status == 'Active' ? 'In Active' : 'Active'
        }
        if (value == '1') {
            ClientsApi.updateStatus('client', disableClientRow[0].id, updateData).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg(`User Status has been ${updateData.status == 'Active' ? 'Activated' : 'In Activated'} Successfully`);
                    clientListingApi(filter, pagination);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        } else if (value == '2') {
            ClientsApi.updateStatus('vendor', disableVendorRow[0].id, updateData).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg(`User Status has been ${updateData.status == 'Active' ? 'Activated' : 'In Activated'} Successfully`);
                    vendorsListingApi(filter, vendorPagination);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        } else if (value == '3') {
            ClientsApi.updateStatus('end-client', disableEndClientRow[0].id, updateData).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg(`User Status has been ${updateData.status == 'Active' ? 'Activated' : 'In Activated'} Successfully`);
                    EndCltListingApi(filter, endClientPagination);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        }
    }

    const handleViewProfile = (args) => {
        if (value == '1') {
            navigate('/clients/clients-user-profile', { state: { data: args, viewState: 'view' } });
        } else if (value == '2') {
            navigate('/vendor/user-profile', { state: { data: args, action: 'view', viewState: 'view' } });
        } else {
            navigate('/clients/end-clients-user-profile', { state: { data: args, viewState: 'view' } });
        }
    }

    const changeHandler = (e) => {
        setFilter({ ...filter, search: e.target.value });
        if (value == '1') {
            ClientsApi.listing({ ...filter, search: e.target.value.length > 1 ? e.target.value : '' }, { ...pagination, currentPage: 1 }).then((res) => {
                setTimeout(() => {
                    if (res.data.statusCode === 1003) {
                        setLoading(false);
                        setClientRows(res.data.data);
                        setPagination(res.data.pagination);
                    }
                }, 300)
            })
        } else if (value == '2') {
            VendorApi.listing({ ...filter, search: e.target.value.length > 1 ? e.target.value : '' }, { ...vendorPagination, currentPage: 1 }).then((res) => {
                if (res.data.statusCode === 1003) {
                    setTimeout(() => {
                        if (res.data.statusCode === 1003) {
                            setLoading(false);
                            setVendorRows(res.data.data);
                            setVendorPagination(res.data.pagination);
                        }
                    }, 300)
                }
            })
        } else if (value == '3') {
            EndClientApi.listing({ ...filter, search: e.target.value.length > 1 ? e.target.value : '' }, { ...endClientPagination, currentPage: 1 }).then((res) => {
                if (res.data.statusCode === 1003) {
                    setTimeout(() => {
                        if (res.data.statusCode === 1003) {
                            setLoading(false);
                            setEndCltRows(res.data.data);
                            setEndClientPagination(res.data.pagination);
                        }
                    }, 300)
                }
            })
        }
    }

    const columns = [
        {
            field: "name",
            align: "left",
            headerAlign: "left",
            headerName: <Box pl={4}>{value == '1' ? "Client" : value == '2' ? 'Vendor' : value == '3' ? 'End-Client' : ''}</Box>,
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Box display='flex' flexDirection='row' pt={'6px'}>
                        {loading ? <Skeleton animation="wave" width="40px" height='65px' style={{ borderRadius: '50%' }} /> :
                            <CircularProgress
                                value={cellValues.row.is_active == false ? 0 : cellValues.row.profile_perecentage}
                                size={48}
                                color={cellValues.row.is_active == false ? '#FFFFFF' : cellValues.row.profile_perecentage == 100 ? 'green' : cellValues.row.profile_perecentage <= 99 && cellValues.row.profile_perecentage >= 40 ? 'orange' : cellValues.row.profile_perecentage < 40 ? "red" : ''}
                                imgWidth='40px'
                                imgHeight='40px'
                                percentage={cellValues.row.profile_perecentage}
                                src={cellValues ? cellValues.row.document_url : ''}
                                name={cellValues ? cellValues.row.name[0] : ''}
                                disable={cellValues.row.is_active == false ? true : false}
                            />
                        }
                        <Box p={'7px 10px 5px 15px'}>
                            {
                                cellValues.row.is_active == false ?
                                    <>
                                        <Text nowrap smallGrey>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.name}</Text>
                                        <Text smallGrey sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.reference_id}</Text>
                                    </> :
                                    <>
                                        <Text smallBlue nowrap onClick={() => handleViewProfile(cellValues.row)} className={classes.cursor}>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.name}</Text>
                                        <Text smallBlack sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.reference_id}</Text>
                                    </>

                            }
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: "contact_email",
            align: "center",
            headerAlign: "center",
            headerName: "Email", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <>
                        {
                            params.row.is_active == false ? <Text mediumGrey >{params.row.contact_email ? params.row.contact_email : "--"}</Text> : <Text smallBlack>{params.row.contact_email ? params.row.contact_email : "--"}</Text>
                        }
                    </>
        },
        {
            field: "mobile_number",
            align: "center",
            headerAlign: "center",
            headerName: "Mobile Number", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <>
                        {
                            params.row.is_active == false ? <Text mediumGrey >{params.row.mobile_number ? params.row.mobile_number : "--"}</Text> : <Text smallBlack>{params.row.mobile_number ? params.row.mobile_number : "--"}</Text>
                        }
                    </>
        },
        {
            field: "status",
            align: "center",
            headerAlign: "center",
            flex: 1,
            headerName:
                <>
                    <Box display='flex' flexDirection='row' columnGap={1}>
                        <Text largeBlack>Status</Text>
                        <KeyboardArrowDownRoundedIcon style={{ height: '22px', width: '22px', paddingTop: '1px', color: '#737373 !important', cursor: 'pointer' }} onClick={(e) => setOpenStatus(e.currentTarget)} />
                    </Box>
                    <Menu
                        id="basic-menu"
                        anchorEl={openStatus}
                        open={opStatus}
                        onClose={handleStatus}
                        sx={{
                            '& .MuiPaper-root': {
                                boxShadow: 'none !important',
                                border: '1px solid #EAECF0 !important',
                                width: '140px !important'
                            }
                        }}
                    >
                        <MenuItem onClick={() => handleStatus('Active')} className={classes.viewText} >Active</MenuItem>
                        <MenuItem onClick={() => handleStatus('In Active')} className={classes.viewText} >In Active</MenuItem>
                        {/* <MenuItem onClick={() => handleStatus(2)} className={classes.inactive}>Draft</MenuItem> */}
                    </Menu>
                </>,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (cellValues) => {
                return (
                    <>
                        {
                            cellValues.row.status == 'In Active' ?
                                <Text smallGrey sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.status}</Text>
                                :
                                <Text smallBlack sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.status}</Text>
                        }
                    </>
                )
            }
        },
        {
            field: "",
            align: "center",
            headerAlign: "center",
            headerName: "Action", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <>
                        {
                            cellValues.row.is_active == false ?
                                <>
                                    <img src={menu} alt='menu' style={{ cursor: 'pointer' }} onClick={(e) => handleClick2(e, cellValues.row)} />
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl1}
                                        open={open1}
                                        onClose={handleClose1}
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
                                        <MenuItem className={classes.viewText} onClick={activateRow}>Activate</MenuItem>
                                        <MenuItem className={classes.deleteText} onClick={deleteApi}>Delete</MenuItem>
                                    </Menu>
                                </>
                                :
                                <>
                                    <img src={menu} alt='menu' style={{ cursor: 'pointer' }} onClick={(e) => handleClick(e, cellValues.row)} />
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
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
                                        {
                                            ((value == '1' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "client_view" && item.is_allowed == true)))) ||
                                                (value == '2' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "vendor_view" && item.is_allowed == true)))) ||
                                                (value == '3' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "end_client_view" && item.is_allowed == true))))) &&
                                            <MenuItem className={classes.viewText} onClick={handleView}>View</MenuItem>
                                        }
                                        {
                                            ((value == '1' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "client_edit" && item.is_allowed == true)))) ||
                                                (value == '2' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "vendor_edit" && item.is_allowed == true)))) ||
                                                (value == '3' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "end_client_edit" && item.is_allowed == true))))) &&
                                            <MenuItem className={classes.editText} onClick={handleEdit}>Edit</MenuItem>
                                        }
                                        <MenuItem className={classes.deactivate} onClick={deactivateRow}>{rowData.status == 'Active' ? 'In Activate' : 'Activate'}</MenuItem>
                                    </Menu>
                                </>
                        }
                    </>
                )
            }
        }
    ]

    const addForm = () => {
        if (value == '1') {
            navigate('/addClient')
        } else if (value == '2') {
            navigate('/addVendor')
        } else if (value == '3') {
            navigate('/addEnd-Client')
        }
    }

    const clientListingApi = (data, paginationData) => {
        setLoading(true);
        ClientsApi.listing(data, paginationData).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setClientRows(res.data.data);
                    setPagination(res.data.pagination);
                }
            }, 300)
        })
    }

    const vendorsListingApi = (data, paginationData) => {
        setLoading(true);
        VendorApi.listing(data, paginationData).then((res) => {
            if (res.data.statusCode === 1003) {
                setTimeout(() => {
                    if (res.data.statusCode === 1003) {
                        setLoading(false);
                        setVendorRows(res.data.data);
                        setVendorPagination(res.data.pagination);
                    }
                }, 300)
            }
        })
    }

    const EndCltListingApi = (data, paginationData) => {
        setLoading(true);
        EndClientApi.listing(data, paginationData).then((res) => {
            if (res.data.statusCode === 1003) {
                setTimeout(() => {
                    if (res.data.statusCode === 1003) {
                        setLoading(false);
                        setEndCltRows(res.data.data);
                        setEndClientPagination(res.data.pagination);
                    }
                }, 300)
            }
        })
    }

    const handleChangePagination = (e, page) => {
        if (value == '1') {
            pagination['currentPage'] = page
            setPagination(pagination);
            clientListingApi(filter, pagination);
        } else if (value == '2') {
            vendorPagination['currentPage'] = page
            setEndClientPagination(vendorPagination);
            vendorsListingApi(filter, vendorPagination);
        }
        else if (value == '3') {
            endClientPagination['currentPage'] = page
            setEndClientPagination(endClientPagination);
            EndCltListingApi(filter, endClientPagination);
        }
    }

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

    const [endClientDropdown, setEndClientDropdown] = useState([]);

    const endClientDropdownApi = () => {
        EndClientApi.endClientDropdownApi('').then((res) => {
            if (res.data.statusCode === 1003) {
                setEndClientDropdown(res.data.data);
            } else {
                setEndClientDropdown([]);
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
            ClientsApi.exportClient(exportData, LocalStorage.getAccessToken()).then(res => {
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
                        end_client_id: '',
                    })
                } else if (res.data.statusCode == 1013) {
                    addWarningMsg(res.data.message);

                } else {
                    addErrorMsg(res.data.message);

                }
            })
        } else if (value == '2') {
            VendorApi.exportVendor(exportData, LocalStorage.getAccessToken()).then(res => {
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
                        end_client_id: '',
                    })
                } else if (res.data.statusCode == 1013) {
                    addWarningMsg(res.data.message);

                } else {
                    addErrorMsg(res.data.message);

                }

            })
        } else if (value == '3') {
            EndClientApi.exportEndClient(exportData, LocalStorage.getAccessToken()).then(res => {
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
                        end_client_id: '',
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
            end_client_id: ''
        })
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
            </Box>


            <Box width={'100%'} height={'85vh'} px={4}>

                {/* <Grid container spacing={3}>
                    <Grid item lg={12} sx={{ marginTop: '10px' }}>
                        <SearchSelect
                            labelText={'Client Name'}
                            options={clientDropdown}
                            value={filter.client_name}
                        />
                    </Grid>
                </Grid> */}
                <Grid container spacing={3}>
                    <Grid item lg={12} justifyContent={'center'}>
                        {value == '1' &&
                            <SearchSelect
                                name={'client_id'}
                                labelText={'Client Name'}
                                options={clientDropdown}
                                value={exportData.client_id}
                                onChange={excelHandleChange}
                            />
                        }
                        {value == '2' &&
                            <SearchSelect
                                labelText={'Vendor Name'}
                                name={'vendor_id'}
                                options={vendorDropdown}
                                value={exportData.vendor_id}
                                onChange={excelHandleChange}
                            />
                        }
                        {value == '3' &&
                            <SearchSelect
                                labelText={'End-Client Name'}
                                name={'end_client_id'}
                                options={endClientDropdown}
                                value={exportData.end_client_id}
                                onChange={excelHandleChange}
                            />
                        }
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
        <Grid container pl={13} pt={3}>
            <Grid item lg={12} md={12} sm={12} xs={12} pl={3}>
                <Text headerBlack>{value == '1' ? 'Clients' : value == '2' ? 'Vendors' : value == '3' ? 'End - Clients' : ''}</Text>
            </Grid>
            <Grid item container lg={12} md={12} sm={12} xs={12} pt={2} pl={2}>
                <Grid item lg={7.5} md={5} sm={8} xs={12}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '40%' }}>
                            <TabList onChange={handleChange}>
                                <Tab label='Clients' value="1" className={value == '1' ? classes.activeText : classes.tabText} />
                                <Tab label='Vendors' value="2" className={value == '2' ? classes.activeText : classes.tabText} />
                                <Tab label='End Clients' value="3" className={value == '3' ? classes.activeText : classes.tabText} />
                            </TabList>
                        </Box>
                    </TabContext>
                </Grid>
                <Grid item container lg={4} md={7} sm={4} xs={12} spacing={2}>
                    <Grid item lg={6.5} md={4} sm={4} xs={12}>
                        <Paper className={classes.Paper} display={'flex'}>
                            <InputBase
                                className={classes.InputBase}
                                fullWidth
                                name="search"
                                onChange={changeHandler}
                                placeholder={value == '1' ? 'Search by Name / Client ID' : value == '2' ? 'Search by Name / Vendor ID' : value == '3' ? 'Search by Name / End-Client ID' : ''}
                                value={filter.search}
                            />
                            <img src={Search} alt="Search" style={{ color: `${btnBgGrey.shade4} !important`, height: '24px !important', width: '24px !important' }} />
                        </Paper>
                    </Grid>
                    <Grid item lg={1.5}>
                        <Box className={classes.Paper} justifyContent='end'>
                            <img src={cloud} alt="Userplus" style={{ height: '23px', width: '23px', cursor: 'pointer' }} onClick={() => setDrawer(true)} />
                        </Box>
                    </Grid>
                    <Grid item lg={4}>
                        {
                            ((value == '1' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "client_create" && item.is_allowed == true)))) ||
                                (value == '2' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "vendor_create" && item.is_allowed == true)))) ||
                                (value == '3' && (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "end_client_create" && item.is_allowed == true))))) ?
                                <Button addButton onClick={addForm}><img src={Userplus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />Add {value == "1" ? 'Client' : value == "2" ? 'Vendor' : 'End-Client'}</Button> :
                                <Button addButtonDisable><img src={disablePlus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />Add {value == "1" ? 'Client' : value == "2" ? 'Vendor' : 'End-Client'}</Button>
                        }
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
                            /> : value == "2" ?
                                <Table
                                    columns={columns}
                                    rows={vendorRows}
                                    hideFooter={true}
                                    hideFooterPagination={true}
                                    height={405}
                                /> :
                                <Table
                                    columns={columns}
                                    rows={endCltRows}
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
                                        /> : value == '3' && endCltRows.length > 0 ?
                                            <StyledPagination
                                                count={endCltRows.length > 0 && endClientPagination && parseInt(endClientPagination.totalPages)}
                                                variant="outlined"
                                                shape="rounded"
                                                page={endCltRows.length > 0 && endClientPagination && parseInt(endClientPagination.currentPage)}
                                                onChange={handleChangePagination}
                                            /> : ''
                            }
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
            <ReusablePopup iconHide white openPopup={deletePopup} setOpenPopup={setDeletePopup} fullWidth>
                <Box sx={{ margin: "20px", }}>
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                        <img src={deactivateImg} alt="warning" />
                    </Box>

                    <Box my={3}>
                        <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                            Are You Sure?
                        </Typography>
                        <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                            Do You Really Wish To {rowData.status == 'Active' ? 'Activate' : 'In Activate'} the {value == '1' ? 'Client' : value == '2' ? 'vendor' : value == '3' ? 'End - Client' : ''}.
                        </Typography>
                    </Box>

                    <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                        <CustomButton no onClick={() => setDeletePopup(false)}>
                            No
                        </CustomButton>
                        <CustomButton popupDelete onClick={deleteRow}>
                            Yes, {rowData.status == 'Active' ? 'Activate' : 'In Activate'}
                        </CustomButton>
                    </Box>

                </Box>
            </ReusablePopup>

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


        </Grid>
    )
};
