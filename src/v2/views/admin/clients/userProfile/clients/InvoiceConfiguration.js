import React, { useState, useEffect, Fragment } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Grid, RadioGroup, FormControlLabel, Radio, SwipeableDrawer, Autocomplete, TextField, Chip, Skeleton, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import { isValid, validate_emptyField, validates_emailId } from "../../../../../components/Validation";
import Text from '../../../../../components/customText/Text';
import CustomButton from '../../../../../components/customButton/Button';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import { ReactComponent as RadioIcon } from '../../../../../assets/svg/RadioIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../../../assets/svg/RadioCheckedIcon.svg';
import { ReactComponent as RemoveIcon } from '../../../../../assets/svg/removeIcon.svg';
import Input from '../../../../../components/input/Input';
import ClientsAPI from '../../../../../apis/admin/clients/ClientsApi';
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import CustomMultipleSelect from '../../../../../components/customSelect/CustomMultipleSelect';
import { ReactComponent as DeleteIcon } from '../../../../../assets/svg/closeIcon.svg';
import RichTextEditor from 'react-rte';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ReactComponent as Information } from '../../../../../assets/svg/Information.svg';
import Button from '../../../../../components/customButton/Button';
import minus from '../../../../../assets/client/minus-circle.svg';


const tempArr = [{ id: 1, value: "@_first_name" }, { id: 2, value: "@_last_name" }, { id: 3, value: "@_company_name" }];

export default function InvoiceConfiguration() {

    const classes = UserProfileStyles();
    const location = useLocation();

    const [formData, setFormData] = useState(
        {
            id: '',
            cycle_id: "",
            day_start_id: "",
            net_pay_terms_id: "",
            approvals: [
                {
                    id: "",
                    rank: 1,
                    approver_ids: [],
                },
            ],
            invoice_email_template_type: 1,
            invoice_email_template_id: "",
            subject: "",
            template: RichTextEditor.createValueFromString("", "html"),
            cc: [],
            bcc: [],
            is_global: "",
            delete_user_ids: [],
            delete_approval_level_ids: []
        }
    );
    const [action, setAction] = useState(location.state.viewState);
    const [error, setError] = useState({});
    const [approvalsError, setApprovalsError] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [payTerms, setPayTerms] = useState([]);
    const [approvalDropdown, setApprovalDropdown] = useState([]);
    const [cycleDropdown, setCycleDropdown] = useState([]);
    const [dayslist, setDayslist] = useState([]);
    const [getloading, setGetloading] = useState(false);

    const [deletedLevels, setDeletedLevels] = useState([]);
    const [deletedchips, setDeletedchips] = useState([]);

    const [templateType, setTemplateType] = useState({
        templateType: 1,
        templateText: "",
    });


    const [mailConfigs, setMailConfigs] = useState({
        subject: "",
        template: RichTextEditor.createValueFromString("", "html"),
        cc: [],
        bcc: [],
    })

    function onChangeEditor(value) {
        setFormData({ ...formData, template: value })
        if (value.toString("html") == "<p><br></p>" || value.toString("html") == "<p></p>" || value.toString("html") == "<p></p><br>") {
            handleValidationsEditor("");
        } else {
            handleValidationsEditor(value.toString("html"));
        }
    }

    const handleValidationsEditor = (value) => {
        // let input = e.target;
        let err = error;
        err.template = validate_emptyField(value);
        setError(err);
    }

    useEffect(() => {
        getInvoiceConfiguration();
        getNetPaytermsDropdown();
        getCycleDropdown();
        getDaysDropdown();
        getApprovalDropdown();
        // eslint-disable-next-line
    }, []);

    const handleSelectTemplate = (e) => {
        setTemplateType({ ...templateType, [e.target.name]: e.target.value })
    }

    const getCycleDropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setCycleDropdown(response.data.data);
            }
        });
    };

    const getDaysDropdown = () => {
        let search = "";
        CommonApi.daysDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setDayslist(response.data.data);
            }
        });
    };

    const getInvoiceConfiguration = () => {
        setGetloading(true);
        ClientsAPI.getInvoiceConfiguration(location.state.data.id,).then((response) => {
            setTimeout(() => {
                setGetloading(false)
                if (response.data.statusCode == 1003 || response.data.statusCode == 1013) {
                    if (location.state.viewState == 'view' && response.data.data.length == 0) {
                        setAction('update')
                    } else if (location.state.viewState == 'edit') {
                        setAction('update')
                    } else {
                        setAction('view')
                    }
                    if (response.data.data.length > 0) {
                        setMailConfigs({
                            subject: response.data.data[0].subject,
                            template: RichTextEditor.createValueFromString(response.data.data[0].template, "html"),
                            cc: response.data.data[0].cc,
                            bcc: response.data.data[0].bcc,
                        })
                        setFormData({ ...response.data.data[0], template: RichTextEditor.createValueFromString(response.data.data[0].template, "html") });
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const getNetPaytermsDropdown = () => {
        let search = "";
        CommonApi.getNetPayTermsList(LocalStorage.uid(), search, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setPayTerms(response.data.data);
            }
        });
    };
    const getApprovalDropdown = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setApprovalDropdown(response.data.data);
            }
        });
    };

    const storeInvoiceConfiguration = () => {
        let data = { ...formData, request_id: LocalStorage.uid(), id: location.state.data.id }
        setLoading(true)
        ClientsAPI.storeInvoiceConfiguration(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    getInvoiceConfiguration();
                    setAction('view');
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateInvoiceConfiguration = () => {
        let data = { ...formData, request_id: LocalStorage.uid(), delete_user_ids: [], delete_approval_level_ids: [] }
        deletedLevels.forEach(ele => {
            data.delete_approval_level_ids.push(ele.id);
        });
        deletedchips.forEach(ele => {
            data.delete_user_ids.push(ele.id);
        });
        setLoading(true);
        ClientsAPI.updateInvoiceConfiguration(location.state.data.id, data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    getInvoiceConfiguration();
                    setAction('view');
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleChange = (e) => {
        if (e.target.name == "cycle_id") {
            setFormData({ ...formData, [e.target.name]: e.target.value, day_start_id: "" })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        handleValidations(e.target);
    };

    const handleValidations = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "cycle_id":
                err.cycle_id = validate_emptyField(input.value);
                err.day_start_id = "";
                break;
            case "day_start_id":
                if (formData.cycle_id == 1 || formData.cycle_id == 2) {
                    err.day_start_id = validate_emptyField(input.value);
                }
                break;
            case "net_pay_terms_id":
                err.net_pay_terms_id = validate_emptyField(input.value);
                break;
            case "invoice_email_template_type":
                err.invoice_email_template_type = validate_emptyField(input.value);
                break;
            case "subject":
                err.subject = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }


    const handleSubmit = () => {
        let errors = validateAll();
        let multiLevelErrors = multiLevelSubmitValidation();
        let mailErrors = formData.invoice_email_template_type == 2 ? validateMailConfiguration() : {};
        if (isValid(errors) && multiLevelErrors && mailErrors) {
            if (formData.id == "") {
                storeInvoiceConfiguration();
            } else if (action === "update") {
                updateInvoiceConfiguration();
            }
        } else {
            setError(errors);
        }
    }

    const multiLevelSubmitValidation = () => {
        let approvalsArr = formData.approvals;
        let err = approvalsError;
        let result = [];
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
        setApprovalsError(err);
        return result.length === 0;
    }

    const validateAll = () => {
        let { cycle_id, day_start_id, net_pay_terms_id, invoice_email_template_type, cc, bcc, subject, template } = formData;
        let errors = {};
        errors.cycle_id = validate_emptyField(cycle_id);
        errors.net_pay_terms_id = validate_emptyField(net_pay_terms_id);
        errors.invoice_email_template_type = validate_emptyField(invoice_email_template_type);
        if ([1, 2].includes(cycle_id)) {
            errors.day_start_id = validate_emptyField(day_start_id);
        } else {
            errors.day_start_id = "";
        }
        if (invoice_email_template_type == 2) {
            errors.cc = cc.length === 0 ? "This field is Required" : "";
            errors.bcc = bcc.length === 0 ? "This field is Required" : "";
            errors.subject = validate_emptyField(subject);
            errors.template = validate_emptyField(template);
        }
        return errors;
    };

    const validateMailConfiguration = () => {
        let { invoice_email_template_type, cc, bcc, subject, template } = formData;
        let errors = {};
        if (invoice_email_template_type == 2) {
            errors.cc = mailsValidation(cc, "cc");
            errors.bcc = mailsValidation(bcc, "bcc");
            errors.subject = validate_emptyField(subject);
            if (template.toString("html") == "<p><br></p>" || template.toString("html") == "<p></p>" || template.toString("html") == "<p></p><br>") {
                errors.template = validate_emptyField("");
            } else {
                errors.template = validate_emptyField(template.toString("html"));
            }
        }
        return errors;
    }

    const mailsValidation = (arr, target) => {
        if (arr.length === 0) {
            return "This field is required";
        } else {
            let mailErrors = [];
            arr.forEach((ele, key) => {
                if (validates_emailId(ele) === "") {
                    mailErrors.splice(key, 1);
                } else {
                    mailErrors.push(key)
                }
            });
            if (mailErrors.length === 0) {
                return "";
            } else {
                return "Please enter valid email";
            }
        }
    }

    const handleChangeLevels = (e, newArr, index) => {
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newArr[newArr.length - 1];
            let approvals = formData.approvals;
            let approverIdsArr = approvals[index].approver_ids;
            if (approverIdsArr.filter((i) => i.employee_id === id).length == 0) {
                approverIdsArr.push({ id: "", employee_id: id, full_name: value });
                setFormData({ ...formData, approvals })
            }
            multiLevelsValidations(approvals, 'approvals', index);
        }
    }


    const multiLevelsValidations = (arr, target, index) => {
        let err = approvalsError;
        arr.forEach((ele, key) => {
            if (key === index) {
                if (ele.approver_ids.length === 0) {
                    err[key][target] = "This field is required";
                } else {
                    err[key][target] = "";
                }
            }
        });
        setApprovalsError(err);
    }

    const handleDeleteChipLevels = (key, index) => {
        let approvals = formData.approvals;
        let newArr = approvals[index].approver_ids;
        let deletedChipsArr = deletedchips;
        if (newArr[key].id !== '') {
            deletedChipsArr.push(newArr[key]);
        }
        newArr.splice(key, 1);
        setFormData({ ...formData, approvals })
        multiLevelsValidations(approvals, 'approvals', index);
        setDeletedchips([...deletedChipsArr]);
    }


    const multiSelectMailsValidations = (arr, target) => {
        let err = error;
        if (arr.length === 0) {
            err[target] = "This field is required";
        } else {
            let mailErrors = [];
            arr.forEach((ele, key) => {
                if (validates_emailId(ele) === "") {
                    mailErrors.splice(key, 1);
                } else {
                    mailErrors.push(key)
                }
            });
            if (mailErrors.length === 0) {
                err[target] = "";
            } else {
                err[target] = "Please enter valid email";
            }
        }
        setError(err);
    }

    const handleChangeMails = (e, target) => {
        let { value } = e.target;
        let newArr = formData[target];
        if (newArr.filter((i) => i === value).length == 0 && value !== '') {
            newArr.push(value);
            setFormData({ ...formData, [target]: newArr });
        }
        multiSelectMailsValidations(newArr, target);
    }

    const handleDeleteChip = (key, target) => {
        let newArr = formData[target];
        newArr.splice(key, 1);
        setFormData({ ...formData, [target]: newArr })
        multiSelectMailsValidations(newArr, target)
    }

    const handleAddLevel = () => {
        let arr = formData.approvals;
        let errorsArr = approvalsError;
        arr.push({
            id: "",
            rank: arr.length + 1,
            approver_ids: [],
        },);
        errorsArr.push({});

        setFormData({ ...formData, approvals: arr });
        setApprovalsError(errorsArr);
    }

    const handleRemoveLevel = (index) => {
        let arr = formData.approvals;
        let errorsArr = approvalsError;
        let deletedLevelArr = deletedLevels;

        if (arr[index].id !== '') {
            deletedLevelArr.push(arr[index]);
        }
        arr.splice(index, 1);
        errorsArr.splice(index, 1);
        arr.forEach((ele, key) => {
            ele.rank = key + 1;
        });

        setFormData({ ...formData, approvals: arr });
        setApprovalsError(errorsArr);
        setDeletedLevels([...deletedLevelArr]);
    }


    return (
        <Box p={2}>
            <Box mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                <Text profileTitle>
                    Invoice Configuration
                </Text>
            </Box>
            <Box pb={1}>
                {
                    getloading ?
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
                            <Box sx={{ minHeight: "50vh", }}>
                                <Grid container className={classes.contentScroll}>
                                    <Grid container spacing={0}>
                                        <Grid lg={6} md={6} sm={12} xs={12}>
                                            <Box p={1} my={1}>
                                                <SearchSelect
                                                    name='net_pay_terms_id'
                                                    value={formData.net_pay_terms_id}
                                                    onChange={handleChange}
                                                    options={payTerms}
                                                    labelText={<Text largeLabel>Payment Terms</Text>}
                                                    scrollTrue
                                                    disabled={action == 'view' ? true : false}
                                                />
                                                <Text errorText> {error.net_pay_terms_id ? error.net_pay_terms_id : ""}</Text>
                                            </Box>
                                        </Grid>
                                        <Grid lg={6} md={6} sm={6} xs={12}>
                                            <Box p={1} my={1}>
                                                <SearchSelect
                                                    name='cycle_id'
                                                    value={formData.cycle_id}
                                                    onChange={handleChange}
                                                    options={cycleDropdown}
                                                    labelText={<Text largeLabel>Invoice Cycle</Text>}
                                                    scrollTrue
                                                    disabled={action == 'view' ? true : false}
                                                />
                                                <Text errorText> {error.cycle_id ? error.cycle_id : ""}</Text>
                                            </Box>
                                        </Grid>
                                        {
                                            [1, 2].includes(formData.cycle_id) ?
                                                <Fragment>
                                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                                        <Box p={1} my={1}>
                                                            <SearchSelect
                                                                name='day_start_id'
                                                                value={formData.day_start_id}
                                                                onChange={handleChange}
                                                                options={dayslist}
                                                                labelText={<Text largeLabel>Day start from</Text>}
                                                                scrollTrue
                                                                disabled={action == 'view' ? true : false}
                                                            />
                                                            <Text errorText> {error.day_start_id ? error.day_start_id : ""}</Text>
                                                        </Box>
                                                    </Grid>
                                                    <Grid lg={6} md={6} sm={12} xs={12}></Grid>
                                                </Fragment> : null
                                        }

                                        <Grid lg={6} md={6} sm={6} xs={12}>
                                            <Box p={1}>
                                                <Text profileTitle>
                                                    Client Invoice Template
                                                </Text>
                                                <Box py={1}>
                                                    <RadioGroup
                                                        row
                                                        name='invoice_email_template_type'
                                                        value={parseInt(formData.invoice_email_template_type)}
                                                        onChange={
                                                            (e) => {
                                                                if (parseInt(e.target.value) === 2) {
                                                                    setDrawer(true)
                                                                }
                                                                handleChange(e)
                                                            }

                                                            /* setSelectedFilter(e.target.value) */
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value={1}
                                                            control={<Radio icon={<RadioIcon />}
                                                                checkedIcon={<RadioCheckedIcon />} />}
                                                            label={<Text checkboxlable >Default Configuration</Text>}
                                                            disabled={action == 'view' ? true : false}
                                                        />
                                                        <FormControlLabel
                                                            onClick={
                                                                () => {
                                                                    if (parseInt(formData.invoice_email_template_type) === 2) {
                                                                        setDrawer(true)
                                                                    }
                                                                }
                                                            }
                                                            value={2}
                                                            control={<Radio icon={<RadioIcon />}
                                                                checkedIcon={<RadioCheckedIcon />} />}
                                                            label={<Text checkboxlable >Custom Configuration</Text>}
                                                            disabled={action == 'view' ? true : false}
                                                        />
                                                    </RadioGroup>
                                                    <Text errorText> {error.invoice_email_template_type ? error.invoice_email_template_type : ""}</Text>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid lg={6} md={6} sm={6} xs={12}>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <Box>
                                            <Box p={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                                <Text profileTitle>
                                                    Invoice Approval Configuration
                                                </Text>
                                                {
                                                    action == 'view' ?
                                                        <LoadingButton disable loading={loading}>
                                                            Add level
                                                        </LoadingButton> :
                                                        <CustomButton outlineBlueSmall onClick={() => handleAddLevel()}>Add Level</CustomButton>
                                                }
                                            </Box>
                                            <Grid container spacing={0}>
                                                {
                                                    formData.approvals.map((i, key) => (
                                                        <Grid lg={12} md={12} sm={12} xs={12}>
                                                            <Box my={1} mx={1}>
                                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                                                    <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '69px', display: 'flex', alignItems: "center", }}>
                                                                        <Autocomplete
                                                                            multiple
                                                                            limitTags={4}
                                                                            id="multiple-limit-tags"
                                                                            options={approvalDropdown}
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
                                                                            disabled={action == 'view' ? true : false}
                                                                            renderTags={(value, getTagProps) =>
                                                                                value.map((option, keyId) => (
                                                                                    <Chip
                                                                                        {...getTagProps({ keyId })}
                                                                                        key={keyId}
                                                                                        label={option && option.full_name}
                                                                                        sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                                                        onDelete={() => handleDeleteChipLevels(keyId, key)}
                                                                                        deleteIcon={<DeleteIcon />}
                                                                                        disabled={action == 'view' ? true : false}
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
                                                                                    font: '16px Nunito Sans, sans-serif !important',
                                                                                    fontWeight: 400,
                                                                                },
                                                                                "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
                                                                                    color: "#737373",
                                                                                    font: '16px Nunito Sans, sans-serif !important',
                                                                                    fontWeight: 500,
                                                                                },
                                                                                "&.Mui-focused .MuiInputLabel-outlined": {
                                                                                    color: "#737373",
                                                                                    font: '12px Nunito Sans, sans-serif !important',
                                                                                    fontWeight: 400,
                                                                                    transform: i.approver_ids.length === 0 ? "translate(12px, 0px) scale(1);" : "translate(12px, -8px) scale(1);"
                                                                                },
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    {
                                                                        formData.approvals.length > 1 ?
                                                                            <Box mx={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                                                                                {action == 'view' ? <RemoveCircleOutlineIcon style={{ color: 'grey' }} /> : <RemoveIcon onClick={() => handleRemoveLevel(key)} style={{ cursor: "pointer" }} />}
                                                                            </Box> : null
                                                                    }
                                                                </Box>
                                                                <Text errorText> {approvalsError.length > 0 && approvalsError[key] && approvalsError[key].approvals ? approvalsError[key].approvals : ""}</Text>
                                                            </Box>
                                                        </Grid>

                                                    ))
                                                }
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box pt={5} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                                {
                                    action == 'view' ?
                                        <LoadingButton saveLoader loading={loading} onClick={() => setAction('update')}>
                                            Edit
                                        </LoadingButton> :
                                        <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                            {action == 'update' && formData.id !== '' ? 'Update' : 'Save'}
                                        </LoadingButton>
                                }
                            </Box>
                        </Fragment>
                }
            </Box>

            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
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
                <Box width={'594px'} height={'100vh'} >
                    <Box height={'10vh'} display={'flex'} alignItems={'center'} px={3} pt={4} >
                        <Stack direction={'row'}>
                            <Text BlackExtraDark>Invoice Configuration</Text>
                            <Box pl={1}>
                                <BlackToolTip
                                    title={<Text mediumWhite sx={{ padding: '5px !important' }}>Please press Enter key to save MailID</Text>}
                                    arrow placement='right'>
                                    <Information style={{ height: '20px', width: '20px', cursor: 'pointer' }} />
                                </BlackToolTip>
                            </Box>

                        </Stack>
                    </Box>

                    <Box width={'100%'}
                    // sx={{
                    //     height: '580px',
                    //     overflowY: 'scroll'
                    // }}
                    >
                        <Box px={2}>
                            <Grid container spacing={0}>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box my={2} mx={1}>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                            <CustomMultipleSelect
                                                labelText={"CC Mails"}
                                                options={
                                                    [{ id: 1, value: "test1@gmail.com" }, { id: 2, value: "test2@gmail.com" }, { id: 3, value: "test3@gmail.com" }, { id: 4, value: "test4@gmail.com" }]
                                                }
                                                valuesArr={formData.cc}
                                                onChange={(e) => handleChangeMails(e, 'cc')}
                                                handleDeleteChip={(e) => handleDeleteChip(e, 'cc')}
                                            />
                                            <Box mx={4} sx={{ cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                                                {
                                                    formData.cc.length > 0 ?
                                                        <img src={minus} alt='Remove' onClick={() => {
                                                            setFormData({ ...formData, cc: [] })
                                                            multiSelectMailsValidations([], 'cc')
                                                        }} /> : null
                                                    // <ClearIcon onClick={
                                                    //     () => {
                                                    //         setFormData({ ...formData, cc: [] })
                                                    //         // multiLevelsValidations([], 'cc')
                                                    //         multiSelectMailsValidations([], 'cc')
                                                    //     }
                                                    // } /> : null
                                                }

                                            </Box>
                                        </Box>
                                        <Text errorText> {error.cc ? error.cc : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box my={2} mx={1}>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                            <CustomMultipleSelect
                                                labelText={"BCC Mails"}
                                                options={
                                                    [{ id: 1, value: "test1@gmail.com" }, { id: 2, value: "test2@gmail.com" }, { id: 3, value: "test3@gmail.com" }, { id: 4, value: "test4@gmail.com" }]
                                                }
                                                valuesArr={formData.bcc}
                                                onChange={(e) => handleChangeMails(e, 'bcc')}
                                                handleDeleteChip={(e) => handleDeleteChip(e, 'bcc')}
                                            />
                                            <Box mx={4} sx={{ cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: "center", }}>
                                                {
                                                    formData.bcc.length > 0 ?
                                                        <img src={minus} alt='Remove' onClick={
                                                            () => {
                                                                setFormData({ ...formData, bcc: [] })
                                                                multiSelectMailsValidations([], 'bcc')
                                                            }
                                                        } /> : null
                                                }
                                            </Box>
                                        </Box>
                                        <Text errorText> {error.bcc ? error.bcc : ""}</Text>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box mx={1} mt={1}>
                                <Text BlackExtraDark>Add Description</Text>
                            </Box>
                        </Box>
                        <Box mx={1}>
                            <Grid container spacing={0}>
                                <Grid lg={4} md={4} sm={12} xs={12}>
                                    <Box p={1} m={1}>
                                        <SearchSelect
                                            name='templateType'
                                            value={templateType.templateType}
                                            onChange={handleSelectTemplate}
                                            options={[{ id: 1, value: "Subject" }, { id: 2, value: "Template" }]}
                                            labelText={<Text largeLabel>Add</Text>}
                                            scrollTrue
                                        />
                                        <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={4} md={4} sm={12} xs={12}>
                                    <Box p={1} m={1}>
                                        <SearchSelect
                                            name='templateText'
                                            value={templateType.templateText}
                                            onChange={handleSelectTemplate}
                                            options={tempArr}
                                            labelText={<Text largeLabel>Add To Subject</Text>}
                                            scrollTrue
                                        />
                                        <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={4} md={4} sm={12} xs={12}>
                                    <Box p={1} m={1}>
                                        {
                                            (templateType.templateType == '' || templateType.templateText == '') ?
                                                <Button disableSaveBtn>Add</Button> :
                                                <CustomButton saveBtn fullWidth
                                                    onClick={
                                                        () => {
                                                            let err = error;
                                                            if (templateType.templateType == 1) {
                                                                let sub = formData.subject + " " + tempArr.filter(i => i.id == templateType.templateText)[0].value;
                                                                setFormData({ ...formData, subject: sub });
                                                                err.subject = validate_emptyField(sub);
                                                            }
                                                            if (templateType.templateType == 2) {
                                                                let tempText = formData.template.toString("html") + " " + tempArr.filter(i => i.id == templateType.templateText)[0].value;
                                                                let text = RichTextEditor.createValueFromString(tempText, "html");
                                                                setFormData({ ...formData, template: text, });
                                                                if (tempText == "" || tempText == "<p><br></p>" || tempText == "<p></p>" || tempText == "<p></p><br>") {
                                                                    err.template = validate_emptyField("");
                                                                } else {
                                                                    err.template = validate_emptyField(tempText.toString("html"));
                                                                }
                                                            }
                                                            setError(err);
                                                        }
                                                    }
                                                >
                                                    Add
                                                </CustomButton>
                                        }
                                    </Box>
                                </Grid>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box p={1} mx={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'subject',
                                                value: formData.subject,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Subject</Text>}
                                        />
                                        <Text errorText> {error.subject ? error.subject : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={12} md={12} sm={12} xs={12}>
                                    <Box p={1} mx={1}>
                                        <RichTextEditor
                                            onChange={onChangeEditor}
                                            value={formData.template}
                                            editorClassName={classes.editorHeight}
                                            placeholder="Type something here..."

                                        />
                                        <Text errorText> {error.template ? error.template : ""}</Text>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    {/* <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={1} height={'68px'} pr={'26px'}>

                        <CustomButton cancelSmall  onClick={() => cancelFilter()} >Cancel</CustomButton>
                        <CustomButton saveSmall  onClick={() => getAllEmployees({ ...filterData, limit: 5, page: 1, })}  >Apply Filters</CustomButton>
                    </Box> */}
                    <Box mt={1} mx={2} px={1} display={"flex"} justifyContent={"end"} gap={2}>
                        <CustomButton cancelBtn onClick={
                            () => {
                                setDrawer(false)
                                setFormData({ ...formData, invoice_email_template_type: 1, cc: mailConfigs.cc, bcc: mailConfigs.bcc, subject: mailConfigs.subject, template: mailConfigs.template, })
                                setTemplateType({ templateType: 1, templateText: "", })
                                setError({ ...error, cc: "", bcc: "", subject: "", template: "" });
                            }
                        }>
                            Cancel
                        </CustomButton>

                        <LoadingButton saveLoader loading={loading} onClick={
                            () => {
                                let errors = validateMailConfiguration();
                                if (isValid(errors)) {
                                    setDrawer(false)
                                } else {
                                    setError(errors);
                                }
                            }
                        } >
                            Save
                        </LoadingButton>
                    </Box>
                </Box >
            </SwipeableDrawer>
        </Box>
    );
}
