import { Box, Card, CardContent, CardHeader, Grid, Chip, Stack, Step, Stepper, Autocomplete, TextField, Tooltip, tooltipClasses, Slide, Breadcrumbs } from '@mui/material';
import Text from '../../../../components/customText/Text';
import { BrownMnCustomisedConnector, BrownMnColorlibStepLabel, BrownMnCustomStepIcon } from '../../../../theme';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import RadioGroup from '../../../../components/customButton/RadioGroup';
import React, { useState } from 'react';
import Button from '../../../../components/customButton/Button';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import CommonApi from '../../../../apis/CommonApi';
import { styled } from '@mui/system';
import AddNetPayTerms from '../../addSelectForms/AddNetPayTerms';
import { isValid, validate_emptyField, } from '../../../../components/Validation';
import moment from 'moment';
import TimesheetConfigurationStyles from '../timesheetConfiguration/TimesheetConfigurationStyles';
import { useEffect } from 'react';
import Date from '../../../../components/datePicker/Date';
import { dateFormat, addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import TimeSheetApi from '../../../../apis/admin/placements/TimeSheetApi';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import { Add, Remove } from "@mui/icons-material";
import LocalStorage from '../../../../utils/LocalStorage';
import Input from '../../../../components/input/Input';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Text>{children}</Text>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function InvoiceConfiguration() {
    const location = useLocation();
    const placementID = location && location.state && location.state.data.id
    const clientID = location && location.state && location.state.clientDetails && location.state.clientDetails.client_id
    const clientStartDate = location && location.state && location.state.clientDetails
    const classes = TimesheetConfigurationStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState(0);
    const [approvaldropdownlist, setApprovaldropdownlist] = useState([]);
    const [cycleDropdownList, setcycleDropdownList] = useState([]);
    const [formTT, setFormTT] = useState(false);
    const [payTerms, setPayTerms] = useState([]);
    const [opentooltip, setOpentooltip] = useState(false);
    const [dayslist, setDaysList] = useState([]);
    const [invoiceApprovalsError, setInvoiceApprovalsError] = useState([{}]);// eslint-disable-next-line
    const [readMode, setreadMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const tooltipToggle = () => {
        opentooltip ? setOpentooltip(false) : setOpentooltip(true)
    }
    const [invoice, setInvoice] = useState({
        request_id: LocalStorage.uid(),
        invoice_settings_config_type: 1,
        invoice_approval_config_type: 1,
        net_pay_terms_id: '',
        cycle_id: '',
        day_start_id: '',
        invoice_start_date: clientStartDate.start_date,
        approvals: [{ id: "", approver_ids: [], rank: 1 }],
    })

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

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });

    useEffect(() => {
        if (invoice.invoice_settings_config_type == 1) {
            defaultInvoiceConfig();
        } else if (invoice.invoice_settings_config_type == 2) {
            clientInvoiceConfig();
        } else if (invoice.invoice_approval_config_type == 1) {
            getDefaultApprovalConfig();
        }
        else if (invoice.invoice_approval_config_type == 2) {
            getClientApprovalConfig();
        }
        getApprovalDropdownList();
        cycleDropdown();
        netPayterms();
        daysDropdown();
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

    // const getIndexAPI = (index) => {
    //     invoice['placement_id'] = '0f960353-cd96-49cb-aa6c-4230803cc5c6'
    //     TimeSheetApi.getInvoiceindex(LocalStorage.uid(), LocalStorage.getAccessToken(),'0f960353-cd96-49cb-aa6c-4230803cc5c6').then((response) => {
    //       if (response.data.statusCode == 1003) {
    //         if (response.data.data.length > 0) {
    //           if (response.data.data[0].approvals.length > 0 && response.data.data[0].approvals[0].approver_ids.length != 0) {
    //             setInvoice(response.data.data[0]);
    //             console.log(response.data.data,"res")
    //           } else {
    //             setInvoice({
    //               ...response.data.data[0],

    //               approvals: [
    //                 {
    //                   approver_ids: [],
    //                   rank: 1,
    //                 },
    //               ],
    //             });
    //           }

    //         } else {
    //           setInvoice({ ...invoice });

    //         }
    //       } else {
    //         addErrorMsg(response.data.message);
    //       }
    //     });
    //   };


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
    const handleChangeIndex = (index) => {
        setValue(index);
    };


    const changeHandler = (e) => {
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
                let a = moment(invoice.invoice_start_date).day()
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

    const handleValidate = (e) => {
        let input = e.target;
        console.log(input.name, "name")
        console.log(input.value, "value")
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
                    error.day_start_id = validate_emptyField(input.value);
                }
                break;
            default:
                break;
        }
        setError({ ...error })
    };



    const validateInvoiceErrors = () => {
        let { cycle_id, net_pay_terms_id, invoice_start_date, day_start_id } = invoice
        let errors = {};
        if (cycle_id === 1 || cycle_id === 2) {
            errors.day_start_id = validate_emptyField(day_start_id)
        }
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.net_pay_terms_id = validate_emptyField(net_pay_terms_id);
        errors.invoice_start_date = validate_emptyField(invoice_start_date);
        return errors;
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
        newArr.splice(key, 1);
        setInvoice({ ...invoice, approvals })
        multiLevelsValidations(approvals, "approvals", index);
    }

    const handleAddLevel = () => {
        let arr = invoice.approvals;
        let errorsArr = invoiceApprovalsError || [{}];
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
        arr.splice(index, 1);
        errorsArr.splice(index, 1);
        arr.forEach((ele, key) => {
            ele.rank = key + 1;
        });
        setInvoice({ ...invoice, approvals: arr });
        setInvoiceApprovalsError(errorsArr);
    }

    const handleChangeConfigSetting = (e, config) => {
        if (config == "config") {
            invoice['invoice_settings_config_type'] = e.target.value
            setInvoice({ ...invoice })
            if (e.target.value == 1) {
                defaultInvoiceConfig();
                setError({});
            } else if (e.target.value == 2) {
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
                    invoice_start_date: clientStartDate.start_date
                });
                setError({})
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
                setInvoiceApprovalsError([{}]);
            }
        }
    };

    const getDefaultApprovalConfig = () => {
        setLoading(true);
        TimeSheetApi.getApprovalConfiguration(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    invoice['approvals'] = response.data.data[0].approvals
                    setInvoice({ ...invoice })
                } else {
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
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
        setLoading(true);
        TimeSheetApi.getClientApprovalConfig(LocalStorage.uid(), LocalStorage.getAccessToken(), clientID).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    invoice['approvals'] = response.data.data[0].approvals
                    setInvoice({ ...invoice })
                } else {
                    addWarningMsg('Client configurations have not been completed. Please configure the client module to reflect the changes here.');
                    setInvoice({
                        ...invoice,
                        approvals: [{ approver_ids: [], rank: 1 }],
                        invoice_approval_config_type: 2,
                        invoice_start_date: clientStartDate.start_date
                    });
                }
            } else {
                addErrorMsg(response.data.message);
            }
        })
    };

    const defaultInvoiceConfig = () => {
        setLoading(true);
        TimeSheetApi.getDefaultConfig(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            invoice['invoice_start_date'] = clientStartDate.start_date
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
                        approvals: [{ id: "", approver_ids: [], rank: 1 }],
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
        invoice['invoice_start_date'] = clientStartDate.start_date
        TimeSheetApi.getClientInvoiceApproval(LocalStorage.uid(), clientID, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setLoading(false);
                if (response.data.data.length > 0) {
                    setInvoice({
                        ...invoice,
                        net_pay_terms_id: response.data.data[0].net_pay_terms_id,
                        cycle_id: response.data.data[0].cycle_id,
                        day_start_id: response.data.data[0].day_start_id,
                        invoice_settings_config_type: 2,
                        approvals: [{ id: "", approver_ids: [], rank: 1 }],
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

    const handleSubmit = () => {
        let inverrors = validateInvoiceErrors();
        let multiLevelErrors = multiLevelSubmitValidation();
        if (activeStep === 0) {
            if (isValid(inverrors)) {
                setActiveStep(activeStep + 1);
                setValue(value + 1)
            } else {
                let s = { error }
                s = inverrors;
                setError(s);
            }
        } else if (activeStep === 1) {
            invoice['placement_id'] = placementID
            if (isValid(inverrors) && multiLevelErrors) {
                TimeSheetApi.invoiceStore(invoice, LocalStorage.getAccessToken()).then((res) => {
                    if (res.data.statusCode === 1003) {
                        navigate('/placements/addPlacement', { state: { actionState: 'addFlow' } });
                        addSuccessMsg('Invoice added Successfully')
                    } else {
                        addErrorMsg(res.data.message)
                    }
                });
            }
            else {
                let s = { error };
                s = inverrors;
                setError(s);
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        }
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = invoice.approvals;
        let err = invoiceApprovalsError || [{}];
        let result = [];
        if (activeStep == 1) {
            approvalsArr.forEach((ele, key) => {
                if (err.length < key + 1) {
                    err.push({});
                }
                if (ele.approver_ids.length === 0) {
                    err[key].approvals = "This field is required";
                    result.push(key);
                } else {
                    err[key].approvals = "";
                    result.splice(key, 1);
                }
            });
            setInvoiceApprovalsError(err);
            return result.length === 0;
        }
    }

    const back = () => {
        if (activeStep === 0) {
            navigate('/placements/addPlacement', { state: { actionState: 'cancel' } })
        } else {
            setActiveStep(activeStep - 1);
            setValue(value - 1);
            setInvoiceApprovalsError('')
            // setInvoice(...invoice)
        }
    }

    const statusItems = [
        { id: 1, title: <Text mediumBlack>Default Configuration</Text>, value: 1 },
        { id: 2, title: <Text mediumBlack>Client Configuration</Text>, value: 2 },
        { id: 3, title: <Text mediumBlack>Custom Configuration</Text>, value: 3 },
    ]

    return (
        <Grid container justifyContent='center' pb={5} className={classes.mainGrid}>
            <Grid container position='fixed' justifyContent='center' zIndex='100' sx={{ background: '#FFFFFF' }} pt={2} pl={{ lg: 14, md: 12, sm: 11, xs: 11 }}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Text mediumGrey sx={{ cursor: 'pointer' }}>Placement Dashboard</Text>
                        <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>All Placements</Text>
                        <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/addPlacement', { state: { actionState: 'cancel' } })}>Add placements</Text>
                        <Text mediumBlack>Add Invoice Configuration</Text>
                    </Breadcrumbs>
                </Grid>
                <Grid item container lg={7} md={10} sm={11} xs={11} justifyContent='center'>
                    <Grid item lg={8} md={8} sm={10} xs={12} pt={2} textAlign='center' p={'30px 10px !important'}>
                        <Stepper activeStep={activeStep}
                            connector={<BrownMnCustomisedConnector />}
                        >
                            <Step>
                                <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                                    <Text BrowmnMnStepperText>Invoice Configuration</Text>
                                </BrownMnColorlibStepLabel>
                            </Step>
                            <Step>
                                <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                                    <Text BrowmnMnStepperText>Invoice Approval Configuration</Text>
                                </BrownMnColorlibStepLabel>
                            </Step>
                        </Stepper>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={7} md={9} sm={11} xs={12} mt={14} pl={{ lg: 0, md: 8, sm: 0, xs: 0 }}>
                <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}
                    springConfig={{
                        duration: '0.3s',
                        easeFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        delay: '0s',
                    }}>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Card sx={{ padding: '15px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>{activeStep == 0 ? 'Invoice Configuration' : activeStep == 1 ? 'Invoice Approval Configuration' : ''}</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '30px  25px 30px  25px !important' }}
                            >
                                {
                                    activeStep == 0 &&
                                    <>
                                        {
                                            loading ?
                                                <Grid container spacing={2} pt={3}>
                                                    <Grid item lg={9} md={9} sm={9} xs={10}>
                                                        <Input formControlProps={{ fullWidth: true }} formInput />
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={2}>
                                                        <Box sx={{ height: '55px', width: '50px', background: '#f4f4f4', borderRadius: '9px' }}></Box>
                                                    </Grid>
                                                </Grid> :
                                                <Grid container spacing={2} columnSpacing={3} alignItems='center'>
                                                    <Box pl={'22px'}>
                                                        <RadioGroup
                                                            row
                                                            name="invoice_settings_config_type"
                                                            value={invoice.invoice_settings_config_type}
                                                            items={statusItems}
                                                            onChange={(e) => handleChangeConfigSetting(e, "config")}
                                                            disabled={readMode}
                                                        />
                                                    </Box>
                                                    <Grid container spacing={0} pt={2}>
                                                        <Grid item lg={6} md={6} sm={12} xs={12} pl={2}>
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
                                                                                disabled={invoice.invoice_settings_config_type != 3 || readMode}
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
                                                                        disabled={invoice.invoice_settings_config_type != 3 || readMode}
                                                                        helperText={
                                                                            invoice.invoice_settings_config_type == 3 && error.net_pay_terms_id &&
                                                                            <span className={classes.helperTextError}>{error.net_pay_terms_id}</span>
                                                                        }
                                                                    />
                                                                }
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={12} xs={12} >
                                                            <Box p={1}>
                                                                <SearchSelect
                                                                    name='cycle_id'
                                                                    value={invoice.cycle_id}
                                                                    options={cycleDropdownList}
                                                                    disabled={invoice.invoice_settings_config_type != 3 || readMode}
                                                                    onChange={changeHandler}
                                                                    labelText={<Text largeLabel>Invoice Cycle</Text>}
                                                                    helperText={
                                                                        invoice.invoice_settings_config_type == 3 && error.cycle_id &&
                                                                        <span className={classes.helperTextError}>{error.cycle_id}</span>
                                                                    }
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={6} xs={12} >
                                                            <Box mt={'1px'} p={1} ml={2}>
                                                                <Date
                                                                    labelText={<Text largeLabel>Start Date</Text>}
                                                                    name='invoice_start_date'
                                                                    value={invoice.invoice_start_date}
                                                                    height='53px'
                                                                    minDate={clientStartDate.start_date}
                                                                    maxDate={clientStartDate.end_date}
                                                                    onChange={(value => dateChange(value, 'invoice_start_date'))}
                                                                />
                                                                {invoice.invoice_settings_config_type == 3 && error.invoice_start_date ?
                                                                    <Text red>{error.invoice_start_date ? error.invoice_start_date : ''}</Text> : ''
                                                                }
                                                            </Box>
                                                        </Grid>
                                                        {
                                                            (invoice.cycle_id == '1' || invoice.cycle_id == '2') &&
                                                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                <Box p={1} pl={1}>
                                                                    <CustomSelect name='day_start_id' value={invoice.day_start_id} commonSelect onChange={changeHandler} label={<Text largeLabel>Day Starts From</Text>} options={dayslist} disabled={(invoice.invoice_settings_config_type == 3 && invoice.cycle_id == 2) || invoice.invoice_settings_config_type != 3 || readMode} />
                                                                    {
                                                                        invoice.invoice_settings_config_type == 3 && error.day_start_id ?
                                                                            <Text red>{error.day_start_id ? error.day_start_id : ''}</Text> : ''
                                                                    }
                                                                </Box>
                                                            </Grid>
                                                        }
                                                    </Grid>
                                                </Grid>
                                        }
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Card sx={{ padding: '20px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
                            <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                                <Text headerBlack>{activeStep == 0 ? 'Invoice Configuration' : activeStep == 1 ? 'Invoice Approval Configuration' : ''}</Text>
                            } />
                            <CardContent
                                TransitionComponent={Transition}
                                sx={{ padding: '30px 40px 30px 40px !important' }}
                            >
                                {
                                    activeStep == 1 &&
                                    <Grid container spacing={2} columnSpacing={3} alignItems='center'>
                                        <Grid container spacing={0} >
                                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                                <Box pl={'2px'}>
                                                    <RadioGroup
                                                        row
                                                        name="invoice_approval_config_type"
                                                        value={invoice.invoice_approval_config_type}
                                                        items={statusItems}
                                                        onChange={(e) => handleChangeConfigSetting(e, "approvalconfig")}
                                                        disabled={readMode}
                                                    />
                                                </Box>
                                            </Grid>
                                            {invoice.approvals.map((i, key) => (
                                                <>
                                                    {
                                                        loading ?
                                                            <Grid container spacing={2} pt={3}>
                                                                <Grid item lg={9} md={9} sm={9} xs={10}>
                                                                    <Input formControlProps={{ fullWidth: true }} formInput />
                                                                </Grid>
                                                                <Grid item lg={3} md={3} sm={3} xs={2}>
                                                                    <Box sx={{ height: '55px', width: '50px', background: '#f4f4f4', borderRadius: '9px' }}></Box>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            <>
                                                                <Grid item lg={9} md={9} sm={9} xs={10} mt={1}>
                                                                    <Box my={1} mx={1}>
                                                                        {/* <Box className={invoice.invoice_approval_config_type != 3 ? classes.defaultapprovalLevels : classes.approvalLevels}> */}
                                                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                                            <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '69px', display: 'flex', alignItems: "center", }}>
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
                                                                                        <TextField {...params} label={`Level ${key + 1} Approvals`} className={classes.multiSelectinputLabel} pt={2} />
                                                                                    )}
                                                                                    // onChange={(e) => handleChangeLevels(e, key)}
                                                                                    onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                                                                                    disabled={invoice.invoice_approval_config_type != 3 || readMode}
                                                                                    renderTags={(value, getTagProps) =>
                                                                                        value.map((option, keyId) => (
                                                                                            <Chip
                                                                                                {...getTagProps({ keyId })}
                                                                                                key={keyId}
                                                                                                label={option && option.full_name}
                                                                                                sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                                onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                                disabled={invoice.invoice_approval_config_type != 3 || readMode}
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
                                                                                            color: "#737373",//filled
                                                                                            fontSize: "14px",
                                                                                            fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                        "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
                                                                                            color: "#737373",//empty
                                                                                            fontSize: "16px",
                                                                                            fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                            fontWeight: 500,
                                                                                        },
                                                                                        "&.Mui-focused .MuiInputLabel-outlined": {
                                                                                            color: "#737373",//focus
                                                                                            fontSize: "10px",
                                                                                            fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                                                            fontWeight: 400,
                                                                                            transform: i.approver_ids.length === 0 ? "translate(12px, 0px) scale(1);" : "translate(12px, -8px) scale(1);"
                                                                                        },
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </Box>
                                                                        {
                                                                            invoice.invoice_approval_config_type == 3 ? <Text errorText>{invoiceApprovalsError.length > 0 && invoiceApprovalsError[key] && invoiceApprovalsError[key].approvals ? invoiceApprovalsError[key].approvals : ''}</Text> : ""
                                                                        }
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} md={3} sm={3} xs={2}>
                                                                    {invoice ? (
                                                                        <Box pt={5}>
                                                                            {invoice.approvals.length - 1 === key ? (
                                                                                <>
                                                                                    <>
                                                                                        {
                                                                                            !readMode && invoice.invoice_approval_config_type == 3 ?
                                                                                                <Add className={classes.add} onClick={() => handleAddLevel()} /> :
                                                                                                <Add className={classes.disabledColor} />
                                                                                        }
                                                                                    </>
                                                                                    {invoice.approvals.length > 1 ? (
                                                                                        <>
                                                                                            {
                                                                                                !readMode && invoice.invoice_approval_config_type == 3 ?
                                                                                                    <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                                    <Remove className={classes.disabledColor} />
                                                                                            }
                                                                                        </>
                                                                                    ) : null}
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {
                                                                                        !readMode && invoice.invoice_approval_config_type == 3 ?
                                                                                            <Remove className={classes.minus} onClick={() => handleRemoveLevel(key)} /> :
                                                                                            <Remove className={classes.disabledColor} />
                                                                                    }
                                                                                </>
                                                                            )}
                                                                        </Box>
                                                                    ) : ''}
                                                                </Grid>
                                                            </>
                                                    }
                                                </>
                                            ))}
                                        </Grid >
                                    </Grid>
                                }
                            </CardContent>
                        </Card>
                    </TabPanel>
                </SwipeableViews>
                <Grid item container justifyContent='end'>
                    <Stack display='flex' direction='row' spacing={2} justifyContent='center' pt={2} pr={3}>
                        <Button BorderBlueButton onClick={back}>Back</Button>
                        <Button saveSmall onClick={handleSubmit}>{activeStep == 0 ? 'Next' : 'Save'}</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default InvoiceConfiguration

