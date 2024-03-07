import React, { useState } from "react";
import { Avatar, Box, Breadcrumbs, Divider, Grid, Skeleton, Stack } from "@mui/material";
import LayoutStyles from "./LayoutStyles";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import PlacementApi from '../../../apis/admin/placements/PlacementApi'
import Button from '../../../components/customButton/Button'
import Eye from "../../../assets/images/eye.png"
import Text from "../../../components/customText/Text";
import { ReactComponent as Edit } from '../../../assets/svg/edit.svg';
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg';
import disableEdit from '../../../assets/client/disableEdit.svg';
import disablePlus from '../../../assets/client/disablePlus.svg';
import { getCurrencySymbol } from '../../../../v2/utils/utils';
import LocalStorage from "../../../utils/LocalStorage";
import TimesheetConfigurationView from "./viewPlacement/TimesheetConfigurationView";
import InvoiceConfigurationView from "./viewPlacement/InvoiceConfigurationView";
// import verify from '../../../assets/svg/verify_icon.svg'
import ViewBills from "./viewPlacement/ViewBills";
import ViewClient from "./viewPlacement/ViewClient";
import LoaderIcon from '../../../assets/svg/sandtimer.svg';
import verified from '../../../assets/svg/Component87.svg';
import Pending from '../../../assets/svg/PendingIcon.svg';
import Rejected from '../../../assets/svg/Rejected.svg';
import disableEye from '../../../assets/client/disableEye.svg';

export default function AddPlacement() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = LayoutStyles();
    const location = useLocation();
    const listData = location && location.state && location.state.data
    const displayState = location && location.state && location.state.actionState
    const empData = location && location.state && location.state.empData;
    const viewClient = location && location.state && location.state.viewClient;
    const [placement, setPlacement] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetch, setFetch] = useState({});
    const navigate = useNavigate();
    const [action, setAction] = useState('view');
    const [viewState, setViewState] = useState('');
    const [clientData, setClientData] = useState({
        client_name: "",
        client_id: "",
        end_client_id: "",
        client_reference_id: "",
        client_contact_one_id: "",
        client_contact_two_id: "",
        client_contact_one_name: "",
        client_contact_two_name: "",
        end_client_contact_one_name: "",
        end_client_contact_two_name: "",
        end_client_name: "",
        end_client_reference_id: '',
        end_client_contact_one_id: "",
        end_client_contact_two_id: "",
        payroll_configuration_type: "",
        pay_type: "",
        pay_value: "",
        payroll_pay: "",
        job_title_id: "",
        job_title: "",
        project_name: "",
        work_email_id: "",
        placed_employee_id: "",
        notice_period: "",
        start_date: '',
        end_date: "",
        work_location_type: "",
        pay_rate_configurations: [{
            from_hour: 1,
            to_hour: "",
            rate: "",
            pay_in: 1,
        }],
        documents: [
            {
                document_type_id: "",
                name: "",
                new_document_id: "",
                document_type_name: "",
                document_name: ''
            }
        ],
        work_location_address_line_one: '',
        work_location_address_line_two: '',
        work_location_city: '',
        work_location_state_id: '',
        work_location_country_id: '',
        work_location_zipcode: '',
        deleted_pay_rate_id: []
    }
    )

    const [timeSheet, setTimeSheet] = useState({
        cycle_id: '',
        day_name: '',
        approvals: [
            {
                id: '',
                rank: '',
                approver_ids: [
                    {
                        id: '',
                        full_name: '',
                        employee_id: ''
                    }
                ]
            }
        ],
        cycle_name: '',
        day_start_id: '',
        placement_id: '',
        ts_mandatory: '',
        default_hours: '',
        timesheet_start_date: '',
        timesheet_approval_id: '',
        timesheet_configuration_id: '',
        timesheet_approval_config_type: '',
        timesheet_effictive_start_date: '',
        timesheet_settings_config_type: ''
    })

    const [invoice, setInvoice] = useState({
        cycle_id: '',
        day_name: '',
        approvals: [
            {
                id: '',
                rank: '',
                approver_ids: [
                    {
                        id: '',
                        full_name: '',
                        employee_id: ''
                    },
                ]
            }
        ],
        cycle_name: '',
        day_start_id: '',
        net_pay_days: '',
        placement_id: '',
        net_pay_terms_id: '',
        invoice_start_date: '',
        invoice_approval_id: '',
        invoice_configuration_id: '',
        invoice_approval_config_type: '',
        invoice_settings_config_type: ''
    })

    useEffect(() => {
        let id = displayState == 'cancel' || displayState == 'addFlow' ? LocalStorage.getPlacementID() : displayState == 'edit' ? (listData && listData.id) : displayState == 'TSView' ? location.state.placementID : displayState == '' ? '' : ''
        if (id == '' || displayState == 'viewPlacement') {

        } else {
            getPlacementDetails(id);
        }
        //eslint-disable-next-line
    }, []);

    const getPlacementDetails = (args) => {
        setLoading(true);
        PlacementApi.placementsIndex(args).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    let obj = [
                        {
                            document_type_id: "",
                            name: "",
                            new_document_id: "",
                            document_type_name: ""
                        }
                    ]
                    if (response.data.data[0].client_details.documents.length === 0) {
                        setClientData({
                            ...response.data.data[0].client_details,
                            documents: obj
                        })
                    } else {
                        setClientData({
                            ...response.data.data[0].client_details,
                            documents: [{
                                id: response.data.data[0].client_details.documents[0].id,
                                document_name: response.data.data[0].client_details.documents[0].name,
                                document_type_id: response.data.data[0].client_details.documents[0].document_type_id,
                                new_document_id: response.data.data[0].client_details.documents[0].new_document_id,
                                name: response.data.data[0].client_details.documents[0].name
                            }]
                        });
                    }
                    setPlacement(response.data.data[0])
                    setTimeSheet(response.data.data[0].timesheet_details);
                    setInvoice(response.data.data[0].invoice_details);
                    if (response.data.data[0].billing_details.length > 0) {
                        setFetch(response.data.data[0].billing_details[0]);
                    }
                }
            }
        })
    }

    const billView = (args, action) => {
        setViewState(args);
        if (action == 'view') {
            setAction('view');
        } else {
            setAction('update');
        }
    }

    return (
        <Grid container className={classes.main} pl={{ lg: 15, md: 11, sm: 3, xs: 11 }}>
            <Grid item lg={12} md={12} xs={12}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Text mediumGrey >Placement Dashboard</Text>
                    <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>All Placements</Text>
                    <Text mediumBlack sx={{ cursor: 'pointer' }} onClick={() => setViewState('')}>{((placement && placement.placement_reference_id) || (listData && listData.reference_id)) ? 'View' : 'Add'} Placement</Text>
                    {
                        ((placement && placement.placement_reference_id) || (listData && listData.reference_id)) && <Text mediumBlack>{(listData && listData.reference_id) || (placement && placement.placement_reference_id)}</Text>
                    }
                </Breadcrumbs>
            </Grid>
            {
                loading ?
                    <Box className={classes.ViewContainer}>
                        <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <img src={LoaderIcon} height={100} width={100} alt='loading' />
                        </Stack>
                    </Box> :
                    <Grid container mt={3}>
                        <Grid container lg={3} md={3} sm={12} xs={12} className={classes.mainCard} p={{ lg: 3, md: 1, sm: 2, xs: 2 }} pb={0}>
                            <Grid container lg={12} md={12} sm={5} xs={12} borderRight={{ lg: "none", md: "none", sm: "1px solid #E2E5E6" }} >
                                <Grid item lg={12} md={12} sm={12} xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <Avatar
                                        src={displayState == 'viewPlacement' ? empData.avatar : displayState == 'edit' ? listData.profile_picture_url : displayState == 'TSView' ? placement.profile_picture_url : (displayState !== 'edit' || viewClient == 'ClientAdded') ? placement.avatar : ''}
                                        className={classes.avatar}
                                    />
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} mt={{ lg: 2, md: 1, sm: 0 }} textAlign='center'>
                                    {loading ? <Skeleton sx={{ height: '30px', width: "250px", marginLeft: '20px' }} /> :
                                        <Text largeBldBlack noWrap>{displayState == 'edit' ? listData.employee_name : displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView' ? placement && placement.employee_name : empData ? empData.full_name : ''}
                                            {displayState == 'edit' ? listData.e_verified == 1 ? <img src={verified} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : '' : displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView' ? placement && (placement.e_verified == 0 ? <img src={Pending} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : placement.e_verified == 1 ? <img src={verified} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : placement.e_verified == 2 ? <img src={Rejected} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : '') :
                                                empData && (empData.e_verified == 0 ? <img src={Pending} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : empData.e_verified == 1 ? <img src={verified} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : empData.e_verified == 2 ? <img src={Rejected} alt="verified" style={{ marginLeft: "6px", marginBottom: "-3px" }} /> : '')}
                                        </Text>
                                    }
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} textAlign='center' pt={1}>
                                    {loading ? <Skeleton sx={{ height: '30px', width: "250px", marginLeft: '20px' }} /> : <Text smallGrey noWrap>{displayState == 'edit' ? listData.employee_reference_id : displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView' ? placement && placement.reference_id : empData ? empData.reference_id : ''}</Text>}
                                </Grid>
                            </Grid>
                            <Grid container lg={12} xs={12} display={{ lg: "block", md: "block", sm: "none", xs: "block" }} pt={1}><Divider /></Grid>
                            <Grid container lg={12} md={12} sm={7} xs={12} sx={{
                                height: '290px !important',
                                overflowY: 'scroll'
                            }}>
                                <Grid container lg={12} md={12} xs={12} pt={1}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}><Text mediumLabel>Project Start Date</Text></Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={6} sm={6} xs={6} pl={1}>
                                        <Text smallBlack noWrap> {clientData.start_date ? clientData.start_date : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={3}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}><Text mediumLabel>Project End Date</Text></Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {clientData.end_date ? clientData.end_date : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={3}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }} ><Text mediumLabel>Vendor Contacts</Text></Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {clientData.end_client_contact_one_name ? clientData.end_client_contact_one_name : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={3}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }} ><Text mediumLabel>Client Contacts</Text></Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {clientData.client_contact_one_name ? clientData.client_contact_one_name : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={{ lg: 3, xs: 3 }}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}>
                                        <Text mediumLabel>Current Bill Rate</Text>
                                    </Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap>{placement ? placement.current_bill_rate : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={{ lg: 3, xs: 3 }}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}>
                                        <Text mediumLabel>Pay Rate</Text>
                                    </Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap>{placement ? placement.current_pay_rate : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={{ lg: 3, xs: 3 }}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}>
                                        <Text mediumLabel>Pay Type</Text>
                                    </Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {placement.placement_pay_type ? placement.placement_pay_type : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={3} >
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}>
                                        <Text mediumLabel>Pay Cycle</Text>
                                    </Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {clientData ? clientData.pay_cycle : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={{ lg: 3, xs: 3 }}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}>
                                        <Text mediumLabel>Timesheet Start Date</Text>
                                    </Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {placement ? placement.timesheet_details && placement.timesheet_details.length > 0 && placement.timesheet_details[0].timesheet_start_date : ''}</Text>
                                    </Grid>
                                </Grid>
                                <Grid container lg={12} md={12} sm={12} xs={12} pt={3} >
                                    <Grid item lg={6} md={6} sm={6} xs={6} pl={{ lg: 2, md: 0, sm: 3 }}>
                                        <Text mediumLabel>Invoice Start Date</Text>
                                    </Grid>
                                    <Grid item lg={0} md={0} sm={0} xs={0} className={classes.headings}>:</Grid>
                                    <Grid item lg={5} md={5} sm={5} xs={5} pl={1}>
                                        <Text smallBlack noWrap> {placement ? placement.invoice_details && placement.invoice_details.length > 0 && placement.invoice_details[0].invoice_start_date : ''}</Text>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container lg={9} md={9} sm={12} xs={12}>
                            <Grid container pl={{ lg: 3, md: 1 }} pr={{ lg: 2, md: 1 }}>
                                {viewState == 'Bill' ?
                                    <ViewBills fetch={fetch} setFetch={setFetch} empId={placement.employee_id} billDetails={placement.billing_details} />
                                    : viewState == 'Client' ?
                                        <ViewClient clientData={clientData} setClientData={setClientData} listData={listData} setViewState={setViewState} clientDetails={placement} actionState={action} getPlacementDetails={getPlacementDetails} />
                                        : viewState == 'timesheet' ?
                                            <TimesheetConfigurationView actionState={action} id={placement.id} setViewState={setViewState} clientDetails={clientData} getPlacementDetails={getPlacementDetails} placement={placement} />
                                            : viewState == 'invoice' ?
                                                <InvoiceConfigurationView actionState={action} id={placement.id} setViewState={setViewState} clientDetails={clientData} getPlacementDetails={getPlacementDetails} placement={placement} /> :
                                                <>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} className={classes.miniCard} p={3} m={'0px 0px 8px 0px'}>
                                                        <Grid container pl={2}>
                                                            <Grid item lg={10} md={10} sm={10} xs={9}>
                                                                <Text boldBlackfont600>Client & End client</Text>
                                                            </Grid>
                                                            <Grid item lg={2} md={2} sm={2} xs={3} display={"flex"} flexDirection={"row"} justifyContent={"end"} alignItems={"flex-end"} >
                                                                {
                                                                    (displayState == 'edit' || displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView') ?
                                                                        <Stack direction={"row"} spacing={2}>
                                                                            {
                                                                                LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_view" && item.is_allowed == true)) ?
                                                                                    <Button viewButton onClick={() => billView("Client", 'view')}><img src={Eye} alt="Eye" style={{ marginRight: "10px" }} />View</Button> :
                                                                                    <Button editButtonDisable><img src={disableEye} alt="Eye" style={{ marginRight: "10px" }} />View</Button>
                                                                            }
                                                                            {
                                                                                LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_edit" && item.is_allowed == true)) ?
                                                                                    <Button editButton onClick={() => billView("Client", 'edit')} startIcon={<Edit />}>Edit</Button> :
                                                                                    <Button editButtonDisable><img src={disableEdit} alt="Eye" style={{ marginRight: "10px" }} />Edit</Button>
                                                                            }
                                                                        </Stack> :
                                                                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_create" && item.is_allowed == true)) ?
                                                                            <Button editButton startIcon={<Plus />} onClick={() => navigate('/placements/addclientAndendclient', { state: { empDetails: empData } })} >Add</Button> :
                                                                            <Button editButtonDisable><img src={disablePlus} alt="Eye" style={{ marginRight: "10px" }} />Add</Button>

                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container lg={12} md={12} sm={12} xs={12} pt={2} pl={{ lg: 1, md: 2, sm: 0 }} pr={{ lg: 1, md: 1, sm: 0 }}>
                                                            <Grid item lg={3} md={3} sm={3} xs={12} className={classes.bRight} pl={2}>
                                                                <Text largeGreyTxt noWrap>Client Name</Text>
                                                                <Text mediumBlack pt={1} sx={{ paddingLeft: ["", null, undefined].includes(clientData.client_name) ? '35px !important' : '10px !important' }} noWrap>{clientData.client_name ? clientData.client_name : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={3} md={3} sm={3} xs={12} className={classes.bRight} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>End Client Name</Text>
                                                                <Text mediumBlack pt={1} noWrap>{clientData.end_client_name ? clientData.end_client_name : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={3} md={3} sm={3} xs={12} className={classes.bRight} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Job Title</Text>
                                                                <Text mediumBlack pt={1} noWrap>{clientData.job_title ? clientData.job_title : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={3} md={3} sm={3} xs={12} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Project Name</Text>
                                                                <Text mediumBlack pt={1} noWrap>{clientData.project_name ? clientData.project_name : "-"}</Text>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} mt={1} className={classes.miniCard} p={3} m={'8px 0px'}>
                                                        <Grid container pl={2}>
                                                            <Grid item lg={10} md={10} sm={10} xs={9}> <Text boldBlackfont600>Billing Details </Text></Grid>
                                                            <Grid item lg={2} md={2} sm={2} xs={3} display={"flex"} flexDirection={"row"} justifyContent={"end"} alignItems={"flex-end"} >
                                                                {
                                                                    placement.status == 'Completed' ? '' :
                                                                        (displayState == 'edit' || displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView') && Object.keys(fetch).length > 0 ?
                                                                            <Stack direction={"row"} spacing={2}>
                                                                                {
                                                                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_view" && item.is_allowed == true)) ?
                                                                                        <Button viewButton onClick={() => billView("Bill", 'view')}><img src={Eye} alt="Eye" style={{ marginRight: "10px" }} />View</Button> :
                                                                                        <Button editButtonDisable><img src={disableEye} alt="Eye" style={{ marginRight: "10px" }} />View</Button>
                                                                                }
                                                                                {
                                                                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_create" && item.is_allowed == true)) ?
                                                                                        <Button editButton startIcon={<Plus />} onClick={() => navigate('/placements/addBillingDetails', { state: { id: displayState == 'edit' ? listData && listData.id : displayState == 'addFlow' ? LocalStorage.getPlacementID() : '', data: placement, clientDetails: clientData } })}>Add</Button> :
                                                                                        <Button editButtonDisable><img src={disablePlus} alt="Eye" style={{ marginRight: "10px" }} />Add</Button>
                                                                                }
                                                                            </Stack>
                                                                            :
                                                                            <>
                                                                                {
                                                                                    (displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView' || (listData && listData.id)) ?
                                                                                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_create" && item.is_allowed == true)) ?
                                                                                            <Button editButton startIcon={<Plus />} onClick={() => navigate('/placements/addBillingDetails', { state: { id: displayState == 'edit' ? listData && listData.id : displayState == 'addFlow' ? LocalStorage.getPlacementID() : '', data: placement, clientDetails: clientData } })}> Add</Button> :
                                                                                            <Button editButtonDisable><img src={disablePlus} alt="Eye" style={{ marginRight: "10px" }} />Add</Button> : ''
                                                                                }
                                                                            </>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container lg={12} md={12} sm={12} xs={12} pt={2} pl={2}>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.bRight} pl={1}>
                                                                <Text largeGreyTxt noWrap>Bill Rate</Text>
                                                                <Text mediumBlack pt={1} sx={{ paddingLeft: ["", null, undefined].includes(fetch && fetch.bill_rate) ? '35px !important' : '10px !important' }} noWrap>{(fetch && fetch.bill_rate) ? fetch && `${getCurrencySymbol()}${fetch.bill_rate}` : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.bRight} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>OT Rate</Text>
                                                                <Text mediumBlack pt={1} noWrap>{fetch && fetch.ot_pay_rate ? fetch && fetch.ot_pay_rate : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Effective From</Text>
                                                                <Text mediumBlack pt={1} noWrap>{fetch && fetch.effective_from ? fetch && fetch.effective_from : '-'}</Text>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} mt={1} className={classes.miniCard} p={3} m={'8px 0px'}>
                                                        <Grid container pl={2}>
                                                            <Grid item lg={10} md={10} sm={10} xs={9}> <Text boldBlackfont600>Timesheet Configuration</Text></Grid>
                                                            <Grid item lg={2} md={2} sm={2} xs={3} display={"flex"} flexDirection={"row"} justifyContent={"end"} alignItems={"flex-end"}>
                                                                {
                                                                    placement.status == 'Completed' ? '' :
                                                                        (displayState == 'edit' || displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView') && (placement.billing_details && placement.billing_details.length > 0) && timeSheet && timeSheet.length > 0 ?
                                                                            <Stack direction={"row"} spacing={2}>
                                                                                {
                                                                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_view" && item.is_allowed == true)) ?
                                                                                        <Button viewButton onClick={() => billView("timesheet", 'view')}><img src={Eye} alt="Eye" style={{ marginRight: "10px" }} />View</Button> :
                                                                                        <Button editButtonDisable><img src={disableEye} alt="Eye" style={{ marginRight: "10px" }} />View</Button>
                                                                                }
                                                                                {
                                                                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_edit" && item.is_allowed == true)) ?
                                                                                        <Button editButton startIcon={<Edit />} onClick={() => billView("timesheet", 'edit')} >Edit</Button> :
                                                                                        <Button editButtonDisable><img src={disableEdit} alt="Eye" style={{ marginRight: "10px" }} />Edit</Button>
                                                                                }
                                                                            </Stack> :
                                                                            <>
                                                                                {
                                                                                    (displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView' || (listData && listData.id)) && (placement.billing_details && placement.billing_details.length > 0) ?
                                                                                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_create" && item.is_allowed == true)) ?
                                                                                            <Button editButton startIcon={<Plus />} onClick={() => navigate('/placements/timesheets', { state: { id: displayState == 'edit' ? listData && listData.id : displayState == 'addFlow' ? LocalStorage.getPlacementID() : '', data: placement, clientDetails: clientData } })}>  Add</Button> :
                                                                                            <Button editButtonDisable><img src={disablePlus} alt="Eye" style={{ marginRight: "10px" }} />Add</Button> : ''
                                                                                }
                                                                            </>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container lg={12} md={12} sm={12} xs={12} pt={2} pl={2}>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.bRight} pl={1}>
                                                                <Text largeGreyTxt noWrap>Timesheet Cycle</Text>
                                                                <Text mediumBlack pt={1} sx={{ paddingLeft: ["", null, undefined].includes(timeSheet && timeSheet[0] && timeSheet[0].cycle_name) ? '35px !important' : '10px !important' }} noWrap>{timeSheet && timeSheet[0] ? timeSheet[0].cycle_name : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.bRight} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Approval Level</Text>
                                                                <Text mediumBlack pt={1} noWrap>{timeSheet[0] && timeSheet[0].approvals.length !== 0 ? timeSheet[0].approvals.length : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Day Starts From</Text>
                                                                <Text mediumBlack pt={1} noWrap>{timeSheet && timeSheet[0] && timeSheet[0] ? timeSheet[0].day_name : '-'}</Text>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} mt={1} className={classes.miniCard} p={3} m={'8px 0px 0px 0px'}>
                                                        <Grid container pl={2}>
                                                            <Grid item lg={10} md={10} sm={10} xs={9}> <Text boldBlackfont600>Invoice Configuration</Text></Grid>
                                                            <Grid item lg={2} md={2} sm={2} xs={3} display={"flex"} flexDirection={"row"} justifyContent={"end"} alignItems={"flex-end"}>
                                                                {
                                                                    placement.status == 'Completed' ? '' :
                                                                        (displayState == 'edit' || displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView') && (placement.billing_details && placement.billing_details.length > 0) && invoice && invoice.length > 0 ?
                                                                            <Stack direction={"row"} spacing={2}>
                                                                                {
                                                                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_view" && item.is_allowed == true)) ?
                                                                                        <Button viewButton onClick={() => billView("invoice", 'view')}><img src={Eye} alt="Eye" style={{ marginRight: "10px" }} />View</Button> :
                                                                                        <Button editButtonDisable><img src={disableEye} alt="Eye" style={{ marginRight: "10px" }} />View</Button>
                                                                                }
                                                                                {
                                                                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_edit" && item.is_allowed == true)) ?
                                                                                        <Button editButton onClick={() => billView("invoice", 'edit')} startIcon={<Edit />}>Edit</Button> :
                                                                                        <Button editButtonDisable><img src={disableEdit} alt="Eye" style={{ marginRight: "10px" }} />Edit</Button>
                                                                                }
                                                                            </Stack> :
                                                                            <>
                                                                                {
                                                                                    (displayState == 'addFlow' || displayState == 'cancel' || displayState == 'TSView' || (listData && listData.id)) && (placement.billing_details && placement.billing_details.length > 0) ?
                                                                                        LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "placement_create" && item.is_allowed == true)) ?
                                                                                            <Button editButton startIcon={<Plus />} onClick={() => navigate('/placements/invoice', { state: { id: displayState == 'edit' ? listData && listData.id : displayState == 'addFlow' ? LocalStorage.getPlacementID() : '', data: placement, clientDetails: clientData } })}> Add</Button> :
                                                                                            <Button editButtonDisable><img src={disablePlus} alt="Eye" style={{ marginRight: "10px" }} />Add</Button> : ''
                                                                                }
                                                                            </>

                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container lg={12} md={12} sm={12} xs={12} pt={2} pl={2}>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.bRight} pl={1}>
                                                                <Text largeGreyTxt noWrap>Invoice Cycle</Text>
                                                                <Text mediumBlack pt={1} sx={{ paddingLeft: ["", null, undefined].includes(invoice && invoice[0] && invoice[0].cycle_name) ? '35px !important' : '10px !important' }} noWrap>{invoice && invoice[0] ? invoice[0].cycle_name : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.bRight} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Approval Levels</Text>
                                                                <Text mediumBlack pt={1} noWrap>{invoice[0] && invoice[0].approvals.length > 0 ? invoice[0].approvals.length : '-'}</Text>
                                                            </Grid>
                                                            <Grid item lg={4} md={4} sm={4} xs={12} textAlign='center'>
                                                                <Text largeGreyTxt noWrap>Day Starts From</Text>
                                                                <Text mediumBlack pt={1} noWrap>{invoice && invoice[0] && invoice[0].day_name ? invoice[0].day_name : '-'}</Text>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
            }
        </Grid>
    )
};
