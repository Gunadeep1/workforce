import React, { useState, useEffect, Fragment } from 'react'
import { Stack, Box, Grid, Skeleton, Tooltip, tooltipClasses, Autocomplete, TextField, Chip, Divider, } from '@mui/material';
import InvoiceStyles from '../invoiceConfiguration/InvoiceStyles';
import LocalStorage from '../../../../utils/LocalStorage';
import TimeSheetApi from '../../../../apis/admin/placements/TimeSheetApi';
import Date from '../../../../components/datePicker/Date';
import { dateFormat, addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../utils/utils';
import Text from '../../../../components/customText/Text';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import AddNetPayTerms from '../../addSelectForms/AddNetPayTerms';
import { isValid, validate_emptyField, } from '../../../../components/Validation';
import CommonApi from '../../../../apis/CommonApi';
import moment from 'moment';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import RadioGroup from '../../../../components/customButton/RadioGroup';
import { styled } from '@mui/system';
import { Add, Remove } from "@mui/icons-material";
import edit from "../../../../assets/images/edit.png";
import LoadingButton from '../../../../components/customButton/LoadingButton';
import Button from '../../../../components/customButton/Button';

function InvoiceConfigurationView({ actionState, id, setViewState, clientDetails, getPlacementDetails }) {
    const classes = InvoiceStyles();
    const clientID = clientDetails.client_id
    const [action, setAction] = useState(actionState);
    const [cycleDropdownList, setcycleDropdownList] = useState([]);
    const [dayslist, setDaysList] = useState([]);
    const [error, setError] = useState({});
    const [payTerms, setPayTerms] = useState([]);
    const [getloading, setGetloading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formTT, setFormTT] = useState(false);
    const [opentooltip, setOpentooltip] = useState(false);
    const [approvaldropdownlist, setApprovaldropdownlist] = useState([]);
    const [invoiceApprovalsError, setInvoiceApprovalsError] = useState([{}]);// eslint-disable-next-line
    const [deletedLevels, setDeletedLevels] = useState([]);
    const [deletedchips, setDeletedchips] = useState([]);
    const [invoice, setInvoice] = useState({
        // Placement_id: id,
        invoice_settings_config_type: 1,
        invoice_approval_config_type: 1,
        net_pay_terms_id: '',
        cycle_id: '',
        day_start_id: '',
        invoice_start_date: '',
        approvals: [{ id: "", approver_ids: [], rank: 1 }],
        delete_user_ids: [],
        delete_approval_level_ids: []
    })

    const tooltipToggle = () => {
        opentooltip ? setOpentooltip(false) : setOpentooltip(true)
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip open={opentooltip} arrow {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 600,
            border: '1px solid #bdbdbd',
            padding: '0px !important'
        },
    }));

    useEffect(() => {
        getInvoiceConfiguration();
        getApprovalDropdownList();
        cycleDropdown();
        netPayterms();
        daysDropdown();
        // defaultInvoiceConfig();
        // getDefaultApprovalConfig();
        // eslint-disable-next-line
    }, [])

    const getApprovalDropdownList = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setApprovaldropdownlist(response.data.data);
            }
        });
    };

    const cycleDropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setcycleDropdownList(response.data.data);
            }
        });
    };

    const netPayterms = () => {
        CommonApi.getNetPayTermsList(LocalStorage.uid(), '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setPayTerms(response.data.data);
            }
        });
    };

    //Dropdown API for days
    const daysDropdown = () => {
        TimeSheetApi.getDaysDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDaysList(response.data.data);
            }
        });
    };

    const getInvoiceConfiguration = () => {
        setGetloading(true);
        TimeSheetApi.getInvoiceConfiguration(id).then((response) => {
            setTimeout(() => {
                setGetloading(false)
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        if (response.data.data[0].approvals.length > 0 && response.data.data[0].approvals[0].approver_ids.length != 0) {
                            setInvoice(response.data.data[0]);
                        } else {
                            setInvoice({
                                ...response.data.data[0],
                                approvals: [
                                    {
                                        approver_ids: [],
                                        rank: 1,
                                    },
                                ],
                            });
                        }

                    } else {
                        setInvoice({ ...invoice });
                    }
                } else {
                    addErrorMsg(response.data.messge);
                }
            }, 400)
        });
    }

    const updateInvoiceConfiguration = () => {
        let data = { ...invoice, request_id: LocalStorage.uid(), delete_user_ids: [], delete_approval_level_ids: [] }
        deletedLevels.forEach(ele => {
            data.delete_approval_level_ids.push(ele.id);
        });
        deletedchips.forEach(ele => {
            data.delete_user_ids.push(ele.id);
        });
        setLoading(true)
        TimeSheetApi.updateInvoiceConfiguration(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    getInvoiceConfiguration();
                    setAction("read");
                    setViewState('');
                    getPlacementDetails(id);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setInvoice({
            ...invoice,
            [name]: moment(date).format(dateFormat()),
            day_start_id: moment(date).day()
        }, handleValidate(event))
    }

    const handleChangeConfigSetting = (e, config) => {
        if (config == "config") {
            invoice['invoice_settings_config_type'] = e.target.value
            setInvoice({ ...invoice })
            if (e.target.value == 1) {
                defaultInvoiceConfig();
                setError({});
            } else if (e.target.value == 2) {
                invoice['net_pay_terms_id'] = ''
                invoice['day_start_id'] = ''
                invoice['cycle_id'] = ''
                clientInvoiceConfig();
                setError({});
            } else if (e.target.value == 3) {
                invoice['net_pay_terms_id'] = ''
                invoice['day_start_id'] = ''
                invoice['cycle_id'] = ''
                setInvoice({
                    ...invoice,
                    net_pay_terms_id: "",
                    cycle_id: "",
                    day_start_id: "",
                    invoice_settings_config_type: 3,
                    invoice_start_date: clientDetails.start_date
                });
            }
        }
        if (config == "approvalconfig") {
            invoice['invoice_approval_config_type'] = e.target.value
            setInvoice({ ...invoice })
            if (e.target.value == 1 || e.target.value == '1') {
                getDefaultApprovalConfig();
                setInvoiceApprovalsError([])
            } else if (e.target.value == 2 || e.target.value == '2') {
                getClientApprovalConfig();
                setInvoiceApprovalsError([])
            } else if (e.target.value == 3 || e.target.value == '3') {
                setInvoice({
                    ...invoice,
                    approvals: [{ approver_ids: [], rank: 1 }],
                    invoice_approval_config_type: 3,
                });
            }
        }
    };

    const getDefaultApprovalConfig = () => {
        TimeSheetApi.getApprovalConfiguration(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data.length > 0) {
                    let data = response.data.data;
                    setInvoice({
                        ...invoice,
                        approvals: data[0].approvals,
                        invoice_approval_config_type: 1,
                    });
                } else {
                    addWarningMsg('Default configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setInvoice({
                        ...invoice,
                        approvals: [{ approver_ids: [], rank: 1 }],
                        invoice_approval_config_type: 1,
                    });
                }
            } else {
                addErrorMsg(response.data.message);
            }
        })
    }

    const getClientApprovalConfig = () => {
        TimeSheetApi.getClientApprovalConfig(LocalStorage.uid(), LocalStorage.getAccessToken(), clientID).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data.length > 0) {
                    let data = response.data.data;
                    setInvoice({
                        ...invoice,
                        invoice_approval_config_type: 2,
                        approvals: data[0].approvals,

                    });
                } else {
                    setInvoice({
                        ...invoice,
                        approvals: [{ approver_ids: [], rank: 1 }],
                        invoice_approval_config_type: 2,
                    });
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
                }
            } else {
                addErrorMsg(response.data.message);
            }
        })
    };

    const defaultInvoiceConfig = () => {
        setLoading(true);
        TimeSheetApi.getDefaultConfig(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    invoice['cycle_id'] = response.data.data[0].cycle_id
                    invoice['net_pay_terms_id'] = response.data.data[0].net_pay_terms_id
                    invoice['day_start_id'] = response.data.data[0].day_start_id
                    setInvoice({
                        ...invoice,
                        net_pay_terms_id: response.data.data[0].net_pay_terms_id,
                        cycle_id: response.data.data[0].cycle_id,
                        day_start_id: response.data.data[0].day_start_id,
                        invoice_settings_config_type: 1,
                        // approvals: [{ id: "", approver_ids: [], rank: 1 }],
                    })
                } else {
                    addWarningMsg('Default configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setInvoice({
                        ...invoice,
                        net_pay_terms_id: "",
                        cycle_id: "",
                        day_start_id: "",
                        invoice_settings_config_type: 1,
                    });
                }
            } else {
                setInvoice({
                    ...invoice,
                    net_pay_terms_id: "",
                    cycle_id: "",
                    day_start_id: "",
                    invoice_settings_config_type: 1,
                });
            }
        });
    };

    const clientInvoiceConfig = () => {
        setLoading(true);
        TimeSheetApi.getClientInvoiceApproval(LocalStorage.uid(), clientID, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    invoice['cycle_id'] = response.data.data[0].cycle_id
                    invoice['net_pay_terms_id'] = response.data.data[0].net_pay_terms_id
                    invoice['day_start_id'] = response.data.data[0].day_start_id
                    setInvoice({
                        ...invoice,
                        net_pay_terms_id: response.data.data[0].net_pay_terms_id,
                        cycle_id: response.data.data[0].cycle_id,
                        day_start_id: response.data.data[0].day_start_id,
                        invoice_settings_config_type: 2,
                    })
                } else {
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setInvoice({
                        ...invoice,
                        net_pay_terms_id: "",
                        cycle_id: "",
                        day_start_id: "",
                        invoice_settings_config_type: 2,
                    });
                }
            } else {
                setInvoice({
                    ...invoice,
                    net_pay_terms_id: "",
                    cycle_id: "",
                    day_start_id: "",
                    invoice_settings_config_type: 2,
                });
            }
        });
    };

    const changeHandler = (e) => {
        if (invoice.invoice_settings_config_type == 3) {
            console.log(e, "ee")
            if (e.target.name == 'net_pay_terms_id') {
                setInvoice({
                    ...invoice,
                    [e.target.name]: e.target.value,

                }, handleValidate(e));
                setOpentooltip(false);
            }
            else if (e.target.name == 'cycle_id') {
                invoice[e.target.name] = e.target.value
                if (e.target.value == 2 || e.target.value == '2') {
                    let a = moment(invoice.timesheet_start_date).day()
                    invoice['day_start_id'] = a
                } else {
                    invoice['day_start_id'] = ''
                }
                setInvoice({ ...invoice }, handleValidate(e))
            }
            else {
                setInvoice({
                    ...invoice,
                    [e.target.name]: e.target.value
                }, handleValidate(e));
            }
        }

    }

    const handleChangeLevels = (e, newArr, index) => {
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newArr[newArr.length - 1];
            let approvals = invoice.approvals
            let approverIdsArr = approvals[index].approver_ids;
            if (approverIdsArr.filter((i) => i.employee_id == id).length == 0) {
                approverIdsArr.push({ id: "", employee_id: id, full_name: value });
                setInvoice({ ...invoice, approvals })
            }
            multiLevelsValidations(approvals, "approvals", index);
        }
    }


    const multiLevelsValidations = (arr, target, index) => {
        let err = invoiceApprovalsError;
        console.log(err, "ererer")
        arr.forEach((ele, key) => {

            if (key === index) {

                if (ele.approver_ids.length === 0) {

                    err[key][target] = "This field is required";

                } else {
                    err[key][target] = "";
                }
            }
        });
        setInvoiceApprovalsError(err);

    }


    const handleDeleteChipLevels = (key, index) => {
        let approvals = invoice.approvals;
        let newArr = approvals[index].approver_ids;
        let deletedChipsArr = deletedchips;
        if (newArr[key].id !== '') {
            deletedChipsArr.push(newArr[key]);
        }
        newArr.splice(key, 1);
        setInvoice({ ...invoice, approvals })
        multiLevelsValidations(approvals, "approvals", index);
        setDeletedchips([...deletedChipsArr]);
    }

    const handleAddLevel = () => {
        let arr = invoice.approvals;
        let errorsArr = invoiceApprovalsError;
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        },);
        errorsArr.push({});

        setInvoice({ ...invoice, approvals: arr });
        setInvoiceApprovalsError(errorsArr);

    }


    const handleRemoveLevel = (index) => {
        let arr = invoice.approvals;
        let errorsArr = invoiceApprovalsError;
        let deletedLevelArr = deletedLevels;
        if (arr[index].id !== '') {
            deletedLevelArr.push(arr[index]);
        }
        arr.splice(index, 1);
        errorsArr.splice(index, 1);
        arr.forEach((ele, key) => {
            ele.rank = key + 1;
        });

        setInvoice({ ...invoice, approvals: arr });
        setInvoiceApprovalsError(errorsArr);
        setDeletedLevels([...deletedLevelArr]);
    }

    const handleValidate = (e) => {
        const input = e.target;
        // console.log(input, "e");
        switch (input.name || input.tagName) {
            case 'invoice_start_date':
                error.invoice_start_date = validate_emptyField(input.value);
                break;
            case 'net_pay_terms_id':
                error.net_pay_terms_id = validate_emptyField(input.value);
                break;
            case 'cycle_id':
                error.cycle_id = validate_emptyField(input.value);
                break;
            case 'day_start_id':
                if (invoice.cycle_id == 1 || invoice.cycle_id == 2) {
                    error.day_start_id = validate_emptyField(input.value)
                }
                break
            default:
                break
        }
        setError({ ...error })
        // console.log(error, "error validate");
    }

    const validateInvoiceErrors = () => {
        let { cycle_id, net_pay_terms_id, invoice_start_date, day_start_id } = invoice
        let errors = {};
        if (cycle_id === 1 || cycle_id === 2) {
            errors.day_start_id = invoice.invoice_settings_config_type == 3 ? validate_emptyField(day_start_id) : '';
        }
        errors.cycle_id = invoice.invoice_settings_config_type == 3 ? validate_emptyField(cycle_id) : '';
        errors.net_pay_terms_id = invoice.invoice_settings_config_type == 3 ? validate_emptyField(net_pay_terms_id) : '';
        errors.invoice_start_date = invoice.invoice_settings_config_type == 3 ? validate_emptyField(invoice_start_date) : '';
        return errors;
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = invoice.approvals;
        let err = invoiceApprovalsError || [];
        let result = [];
        approvalsArr.forEach((ele, key) => {
            if (err.length < key + 1) {
                err.push({});
            }
            if (ele.approver_ids.length === 0) {
                err[key].approvals = "This field is required";
                result.push(key);
            } else {
                console.log(err[key].approvals, "errrorrr")
                err[key].approvals = "";
                result.splice(key, 1);
            }
        });
        setInvoiceApprovalsError(err);
        return result.length === 0;

    }


    const handleSubmit = () => {
        let errors = validateInvoiceErrors();
        let multiLevelErrors = multiLevelSubmitValidation();
        if (isValid(errors) && multiLevelErrors) {
            updateInvoiceConfiguration();
        } else {
            setError(errors);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const statusItems = [
        { id: 1, title: <Text mediumBlack>Default Configuration</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>Client Configuration</Text>, value: 2 },
        { id: 3, title: <Text mediumBlack>Custom Configuration</Text>, value: 3 },
    ]

    const handleCancel = () => {
        setError({});
        setAction(false);
        getPlacementDetails(id);
        getInvoiceConfiguration();
        setViewState('');
    }

    return (
        <Grid container columnSpacing={{ lg: 3, md: 3, sm: 0, xs: 0 }} p={'0px 5px'}>
            <Grid item lg={12} md={12} sm={12} xs={12} mt={{ lg: 0, md: 0, sm: 3, xs: 3 }}>
                <Box p={2} pb={0} className={classes.cardBg}>
                    <Box mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                        <Text boldBlackfont600>
                            Invoice Configuration
                        </Text>
                        <Box display={"flex"} justifyContent={"end"}>
                            {action !== 'update' &&
                                <Button editButton onClick={() => setAction('update')}><img src={edit} alt="edit" style={{ marginRight: "10px" }} />Edit</Button>
                            }
                        </Box>
                    </Box>
                    <Box>
                        {getloading ?
                            <Grid container spacing={0} my={3}>
                                {
                                    [1, 2, 3, 4, 5, 6, 7].map(() => (
                                        <Grid lg={6} md={6} sm={12} xs={12}>
                                            <Box p={1}>
                                                <Skeleton variant="rounded" width={'100%'} height={'54px'} borderRadius={"10px"} />
                                            </Box>
                                        </Grid>
                                    ))
                                }
                            </Grid> :
                            <Fragment>
                                <Box className={classes.contentScroll} mb={2}>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Box p={1}>
                                                <RadioGroup
                                                    row
                                                    name="invoice_settings_config_type"
                                                    value={invoice.invoice_settings_config_type}
                                                    items={statusItems}
                                                    onChange={(e) => handleChangeConfigSetting(e, "config")}
                                                    disabled={action === "update" ? false : true}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid container spacing={0} pt={2}>
                                            <Grid lg={6} md={5} sm={6} xs={12} pl={2}>
                                                <Box p={1}>
                                                    {formTT == 'net_pay_terms_id' ?
                                                        (<HtmlTooltip
                                                            title={
                                                                <AddNetPayTerms formTT={setOpentooltip} getList={netPayterms} />
                                                            }
                                                        >
                                                            <Box >
                                                                <SearchSelect
                                                                    name='net_pay_terms_id'
                                                                    value={invoice.net_pay_terms_id}
                                                                    options={payTerms}
                                                                    labelText={<Text largeLabel> Pay Terms</Text>}
                                                                    onChange={changeHandler}
                                                                    onClick={() => {
                                                                        setFormTT('net_pay_terms_id');
                                                                        tooltipToggle()
                                                                    }}
                                                                    disabled={action === "update" && (invoice.invoice_settings_config_type == 3) ? false : true}
                                                                    buttonName='Pay Terms'
                                                                    helperText={
                                                                        invoice.invoice_settings_config_type == 3 && error.net_pay_terms_id &&
                                                                        <span className={classes.helperTextError}>{error.net_pay_terms_id}</span>
                                                                    }
                                                                />
                                                            </Box>
                                                        </HtmlTooltip>) :

                                                        <SearchSelect
                                                            name='net_pay_terms_id'
                                                            value={invoice.net_pay_terms_id}
                                                            options={payTerms}
                                                            labelText={<Text largeLabel> Pay Terms</Text>}
                                                            onChange={changeHandler}
                                                            onClick={() => {
                                                                setFormTT('net_pay_terms_id');
                                                                tooltipToggle()
                                                            }}
                                                            buttonName='Pay Terms'
                                                            disabled={action === "update" && (invoice.invoice_settings_config_type == 3) ? false : true}
                                                            helperText={
                                                                invoice.invoice_settings_config_type == 3 && error.net_pay_terms_id &&
                                                                <span className={classes.helperTextError}>{error.net_pay_terms_id}</span>
                                                            }
                                                        />

                                                    }
                                                </Box>
                                            </Grid>
                                            <Grid lg={6} md={5} sm={6} xs={12}>
                                                <Box p={1}>
                                                    <SearchSelect
                                                        name='cycle_id'
                                                        value={invoice.cycle_id}
                                                        options={cycleDropdownList}
                                                        onChange={(e) => changeHandler(e)}
                                                        labelText={<Text largeLabel>Invoice Cycle</Text>}
                                                        scrollTrue
                                                        disabled={action === "update" && (invoice.invoice_settings_config_type == 3) ? false : true}
                                                    />
                                                    {
                                                        error.cycle_id ?
                                                            <Text red>{error.cycle_id ? error.cycle_id : ''}</Text> : ''
                                                    }
                                                </Box>
                                            </Grid>
                                            <Grid item lg={6} md={5} sm={6} xs={12}>
                                                <Box mt={'1px'} p={1} ml={2}>
                                                    <Date
                                                        labelText={<Text largeLabel>Start Date</Text>}
                                                        name='invoice_start_date'
                                                        value={invoice.invoice_start_date}
                                                        height='56px'
                                                        onChange={(value => dateChange(value, 'invoice_start_date'))}
                                                        minDate={clientDetails.start_date}
                                                        maxDate={clientDetails.end_date}
                                                        disabled={action === "view" ? true : false}
                                                    />
                                                    {
                                                        error.invoice_start_date ?
                                                            <Text red>{error.invoice_start_date ? error.invoice_start_date : ''}</Text> : ''
                                                    }
                                                </Box>
                                            </Grid>
                                            {(invoice.cycle_id == 1 || invoice.cycle_id == 2) &&
                                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={1} pl={1}>
                                                        <CustomSelect
                                                            name={'day_start_id'}
                                                            value={invoice.day_start_id}
                                                            onChange={changeHandler}
                                                            label='Day Starts From'
                                                            options={dayslist}
                                                            commonSelect
                                                            disabled={(invoice.invoice_settings_config_type == 3 && invoice.cycle_id == 2) || invoice.invoice_settings_config_type != 3 || action == 'view'}
                                                        />
                                                        <Text red>{error.day_start_id ? error.day_start_id : ''}</Text>
                                                    </Box>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>
                                    <Box p={1} mt={2}>
                                        <Divider />
                                    </Box>
                                    <Box>
                                        <Box p={1} mt={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                            <Text largeBlack>
                                                Invoice Approval Configuration
                                            </Text>

                                        </Box>
                                        <Grid container spacing={0}>
                                            <Grid item lg={12} >
                                                <Box p={1}>
                                                    <RadioGroup
                                                        row
                                                        name="invoice_approval_config_type"
                                                        value={invoice.invoice_approval_config_type}
                                                        items={statusItems}
                                                        // onChange={changeHandler}
                                                        onChange={(e) => handleChangeConfigSetting(e, "approvalconfig")}
                                                        disabled={action === "update" ? false : true}
                                                    />
                                                </Box>
                                            </Grid>
                                            {invoice.approvals.map((i, key) => (
                                                <>
                                                    <Grid item lg={11} md={11} sm={11} xs={10}>
                                                        <Box p={1} mx={1}>
                                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                                <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '59px', display: 'flex', alignItems: "center", }}>
                                                                    <Autocomplete
                                                                        multiple
                                                                        limitTags={2}
                                                                        id="multiple-limit-tags"
                                                                        options={approvaldropdownlist}
                                                                        getOptionLabel={(option) => option.value}
                                                                        renderOption={(props, option) => (
                                                                            <li {...props} key={option.uniqueIdentifier}>
                                                                                {option.value}
                                                                            </li>
                                                                        )}
                                                                        value={i.approver_ids}
                                                                        renderInput={(params) => (
                                                                            <TextField {...params} label={`Level ${key + 1} Approvers`} className={classes.multiSelectinputLabel} pt={2} />
                                                                        )}
                                                                        onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                                                                        disabled={action === "update" && (invoice.invoice_approval_config_type == 3) ? false : true}
                                                                        renderTags={(value, getTagProps) =>
                                                                            value.map((option, keyId) => (
                                                                                <Chip
                                                                                    {...getTagProps({ keyId })}
                                                                                    key={keyId}
                                                                                    label={option && option.full_name}
                                                                                    sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                    onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                    disabled={action === "update" && (invoice.invoice_approval_config_type == 3) ? false : true}
                                                                                // deleteIcon={<DeleteIcon />}
                                                                                />
                                                                            ))
                                                                        }
                                                                        sx={{
                                                                            width: '100%',
                                                                            "& .MuiInputBase-root": {
                                                                                cursor: "pointer",
                                                                            },
                                                                            "& .MuiInputBase-input": {
                                                                                cursor: "pointer",
                                                                            },
                                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                                border: "none"
                                                                            },
                                                                            "& .MuiAutocomplete-endAdornment": {
                                                                                display: "none"
                                                                            },
                                                                            "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
                                                                                transform: "translate(10px, 16px) scale(1);"
                                                                            },
                                                                            "& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root": {
                                                                                color: "#737373",
                                                                                fontSize: "14px",
                                                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                fontWeight: 400,
                                                                            },
                                                                            "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
                                                                                color: "#737373",
                                                                                fontSize: "16px",
                                                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                fontWeight: 500,
                                                                            },
                                                                            "&.Mui-focused .MuiInputLabel-outlined": {
                                                                                color: "#737373",
                                                                                fontSize: "10px",
                                                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                fontWeight: 400,
                                                                                transform: i.approver_ids.length === 0 ? "translate(12px, 0px) scale(1);" : "translate(12px, -8px) scale(1);"
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Box>
                                                            <Text errorText>{invoice.invoice_approval_config_type == 3 && invoiceApprovalsError.length > 0 && invoiceApprovalsError[key] && invoiceApprovalsError[key].approvals ? invoiceApprovalsError[key].approvals : ''}</Text>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={2}>
                                                        {invoice ? (
                                                            <Box pt={4}>
                                                                {invoice.approvals.length - 1 === key ? (
                                                                    <>
                                                                        <>
                                                                            {
                                                                                action === "update" && invoice.invoice_approval_config_type == 3 ?
                                                                                    <Add className={classes.add} onClick={() => handleAddLevel()} /> :
                                                                                    <Add className={classes.disabledColor} />
                                                                            }
                                                                        </>
                                                                        {invoice.approvals.length > 1 ? (
                                                                            <>
                                                                                {
                                                                                    action === "update" && invoice.invoice_approval_config_type == 3 ?
                                                                                        <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                        <Remove className={classes.disabledColor} />
                                                                                }
                                                                            </>
                                                                        ) : null}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            action === "update" && invoice.invoice_approval_config_type == 3 ?
                                                                                <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                <Remove className={classes.disabledColor} />
                                                                        }
                                                                    </>
                                                                )}
                                                            </Box>

                                                        ) : ''}
                                                    </Grid>
                                                </>
                                            ))}
                                        </Grid>
                                    </Box>
                                    {action == 'update' ?
                                        <Grid container lg={12} md={10} sm={10} xs={12} mt={{ lg: 6, md: 4, sm: 4, xs: 3 }} justifyContent={"end"}>
                                            <Stack spacing={3} direction={"row"} pr={2}>
                                                <Button popupCancelHeight onClick={handleCancel}>Cancel</Button>
                                                <LoadingButton smallSaveLoader loading={loading} onClick={handleSubmit}>{action === "update" ? 'Update' : 'Save'}</LoadingButton>
                                            </Stack>
                                        </Grid> : ""
                                    }
                                </Box>
                            </Fragment>
                        }
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default InvoiceConfigurationView

