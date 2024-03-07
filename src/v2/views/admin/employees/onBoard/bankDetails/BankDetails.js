import { Box, Card, CardContent, Divider, Grid, Stack } from '@mui/material'
import React, { useState } from 'react'
import Text from '../../../../../components/customText/Text'
import Input from '../../../../../components/input/Input'
import SearchSelect from '../../../../../components/selectField/SearchSelect'
import Button from '../../../../../components/customButton/Button'
import ReusablePopup from '../../../../../components/reuablePopup/ReusablePopup';
import draft from '../../../../../assets/employee/savedraft.svg';
import { useNavigate } from 'react-router-dom'
import CommonApi from '../../../../../apis/CommonApi'
import { addErrorMsg, addWarningMsg } from '../../../../../utils/utils'
import LocalStorage from '../../../../../utils/LocalStorage'
import { validate_alphaNumeric, validate_emptyField, validates_Integer, validates_float } from '../../../../../components/Validation';
import minus from '../../../../../assets/client/minus-circle.svg';
import { TooltipIndicator, blue } from '../../../../../theme'
import FileInput from '../../../../../components/muiFileInput/FileInput'
import OnBoardApi from '../../../../../apis/admin/employees/OnBoardApi'
import successImg from '../../../../../assets/svg/succesIcon.svg';
import EmployeeCreateAPI from '../../../../../apis/admin/employees/EmployeesApi';
import workAuthStyles from '../../userprofile/document/workAuthStyles'
import LoaderIcon from '../../../../../assets/svg/sandtimer.svg';

function BankDetails({ mainStep, setMainStep, setValue, setDocStepper }) {
    const classes = workAuthStyles();
    const navigate = useNavigate();
    const accountType = require('../../../../../utils/jsons/AccountType.json');
    const [bank, setBank] = useState(
        [
            {
                bank_account_details_id: '',
                bank_name: '',
                account_number: '',
                confirm_account_number: '',
                routing_number: '',
                confirm_routing_number: '',
                account_type: '',
                deposit_type: '',
                deposit_value: '',
                description: '',
                void_cheque_documents: [
                    {
                        new_document_id: '',
                        document_name: ''
                    }
                ],
                deposit_form_documents: [
                    {
                        new_document_id: '',
                        document_name: ''
                    }
                ],
                // documents: [
                //     {
                //         document_name: '',
                //         id: '',
                //         description: '',
                //         document_type: 'direct deposit',
                //         document_url: '',
                //         document_status: '',
                //         new_document_id: ''
                //     },
                //     {
                //         document_name: '',
                //         id: '',
                //         description: '',
                //         document_type: 'void cheque',
                //         document_url: '',
                //         document_status: '',
                //         new_document_id: ''
                //     }
                // ]
            }
        ]
    )

    const [formLoader, setFormLoader] = useState(false);

    const deposityTypes = [
        {
            id: 1,
            name: 'Full Net'
        },
        {
            id: 2,
            name: 'Partial $'
        },
        {
            id: 3,
            name: 'Partial %'
        },
        {
            id: 4,
            name: 'Remainder'
        },
    ]

    const [open, setOpen] = useState(false);
    const [error, setError] = useState([]);
    // const [add, setAdd] = useState(false);
    const [deletebanks, setDeletebanks] = useState([]);
    const [indexValue, setIndexvalue] = useState('');
    const [success, setSuccess] = useState(false);

    const changeHandler = (e, index, fileIndex, args) => {
        let { name, value } = e.target;
        setIndexvalue(index);
        let bankDetailsArr = bank;
        if (name == "new_document_id") {
            uploadDocs(e, index, args);
        }
        else {
            if (name == "deposit_type") {
                if (value == 1) {
                    if (bankDetailsArr.length > 1 && index != 0) {
                        return addErrorMsg("unable to select Full net ");
                    } else {
                        bankDetailsArr.splice(1)
                    }
                } else if (value == 2 || value == 4) {
                    if (bankDetailsArr.length > 1 && index != 0) {
                        if (bankDetailsArr[0].deposit_type == 1 || bankDetailsArr[0].deposit_type == 3) {
                            return addErrorMsg("unable to select partial Amout and Remainder");
                        }
                    }
                } else if (value == 3) {
                    if (bankDetailsArr.length > 1 && index != 0) {
                        if (bankDetailsArr[0].deposit_type == 1 || bankDetailsArr[0].deposit_type == 2 || bankDetailsArr[0].deposit_type == 4) {
                            return addErrorMsg("unable to select");
                        }
                    }
                }
            }
            bankDetailsArr[index] = { ...bankDetailsArr[index], [name]: value };
            if (name == "deposit_value") {
                if (bankDetailsArr[index].deposit_type == 3) {
                    let sumArr = bankDetailsArr.map((value) => Number(value.deposit_value));
                    if (sumArr.reduce((a, b) => a + b) > 100) {

                        addWarningMsg("please Enter Valid deposit Percentage");
                    }
                }
            }
            setBank([...bankDetailsArr]);
        }
        handleValidate(name, e.target.value, index);
    }

    const uploadDocs = (value, index, fieldName) => {
        setFormLoader(true);
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("bank-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data;
                    let newStateArr = [...bank];
                    if (fieldName === "void_cheque_documents") {
                        const data = {
                            request_id: LocalStorage.uid(),
                            document_id: response.data.data.id
                        }
                        EmployeeCreateAPI.ocrDocumentUpload('cheque', data).then((res) => {
                            if (res.data.statusCode == 1003) {
                                setFormLoader(false);
                                newStateArr[index].void_cheque_documents[0].new_document_id = docInfo.id;
                                newStateArr[index].void_cheque_documents[0].document_name = value.target.files[0].name;
                            } else {
                                setFormLoader(false);
                                newStateArr[index].void_cheque_documents[0].new_document_id = docInfo.id;
                                newStateArr[index].void_cheque_documents[0].document_name = value.target.files[0].name;
                            }
                            setBank([...newStateArr]);
                        })
                    } else {
                        setFormLoader(false);
                        newStateArr[index][value.target.name][0].new_document_id = docInfo.id;
                        newStateArr[index][value.target.name][0].document_name = value.target.files[0].name;
                    }
                    setBank([...newStateArr]);
                    handleValidate(fieldName, value.target.value, index);
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };

    const deleteDoc = (index, args) => {
        if (args == 'void_cheque_documents') {
            bank[index].void_cheque_documents[0].new_document_id = ''
            bank[index].void_cheque_documents[0].document_name = ''
        } else if (args == 'deposit_form_documents') {
            bank[index].deposit_form_documents[0].new_document_id = ''
            bank[index].deposit_form_documents[0].document_name = ''
        }
        setBank({ ...bank })
    }

    const goToHome = () => {
        setSuccess(false);
        navigate('/employees');
    }

    const handleValidate = (fieldName, value, index) => {
        let bankdetailsArr = bank;
        let errorsArr = Array.isArray(error) ? [...error] : [];
        if (!errorsArr[index]) {
            errorsArr[index] = {};
        }

        let errors = errorsArr[index];

        switch (fieldName) {
            case "bank_name":
                errors["bank_name"] = validate_alphaNumeric(value);
                break;
            case "account_type":
                errors["account_type"] = validate_emptyField(value);
                break;
            case "account_number":
                errors["account_number"] = validate_alphaNumeric(value);
                break;
            case "confirm_account_number":
                if (value == "") {
                    errors["confirm_account_number"] = "This field is required";
                } else if (value != bankdetailsArr[index].account_number) {
                    errors["confirm_account_number"] = "Account number not matching";
                } else {
                    errors["confirm_account_number"] = "";
                }
                break;
            case "routing_number":
                errors["routing_number"] = validates_Integer(value);
                break;
            case "confirm_routing_number":
                if (value == "") {
                    errors["confirm_routing_number"] = "This field is required";
                } else if (value != bankdetailsArr[index].routing_number) {
                    errors["confirm_routing_number"] = "Route number not matching";
                } else {
                    errors["confirm_routing_number"] = "";
                }
                break;
            case "deposit_type":
                errors["deposit_type"] = validate_emptyField(value);
                break;
            case "deposit_value":
                if (bankdetailsArr[index].deposit_type == 4) {
                    if (value != '' && value != null) {
                        errors["deposit_value"] = validates_float(value);
                    }
                } else {
                    errors["deposit_value"] = validates_float(value);
                }
                break;
            case "deposit_form_documents":
                errors["deposit_form_documents"] = validate_emptyField(value);
                break;
            case "void_cheque_documents":
                errors["void_cheque_documents"] = validate_emptyField(value);
                break;
            default:
                break;
        }
        // Update errorsArr with the errors object
        errorsArr[index] = errors;

        // Update error state with the updated errorsArr
        setError(errorsArr);
    };


    const formValidations = () => {
        let result = [];
        let bankdetailsArr = bank;
        let errorsArr = [];
        console.log(bankdetailsArr, "bankkk")
        bankdetailsArr.forEach(bank => {
            let errors = {};
            errors.bank_name = validate_alphaNumeric(bank.bank_name);
            errors.account_type = validate_emptyField(bank.account_type);
            errors.account_number = validate_alphaNumeric(bank.account_number);
            errors.void_cheque_documents = validate_emptyField(bank.void_cheque_documents[0].new_document_id);
            errors.deposit_form_documents = validate_emptyField(bank.deposit_form_documents[0].new_document_id);
            if (bank.account_number != bank.confirm_account_number) {
                errors.confirm_account_number = 'Account number not matching';
            } else {
                errors.confirm_account_number = validate_emptyField(bank.confirm_account_number);
            }
            errors.routing_number = validates_Integer(bank.routing_number);
            if (bank.routing_number != bank.confirm_routing_number) {
                errors.confirm_routing_number = 'Routing number not matching';
            } else {
                errors.confirm_routing_number = validates_Integer(bank.confirm_routing_number);
            }
            errors.deposit_type = validate_emptyField(bank.deposit_type);
            if (bank.deposit_type != 4) {
                errors.deposit_value = validates_float(bank.deposit_value);
            } else {
                if (bank.deposit_value != '' && bank.deposit_value != null) {
                    errors.deposit_value = validates_float(bank.deposit_value);
                }
            }
            errorsArr.push(errors);
        });
        setError(errorsArr);
        console.log(error, "errroooorrrrrrrr");
        errorsArr.forEach(errVal => {
            let errArr = [];
            Object.keys(errVal).forEach(err => {
                if (errVal[err] != '') {
                    errArr.push(err)
                }
            });
            if (errArr.length > 0) {
                result.push(errArr);
            }
        });
        return result;
    };

    const addNewBank = () => {
        let bankdetailsArr = bank;
        let newArr = {
            bank_account_details_id: "",
            bank_name: "",
            account_number: "",
            confirm_account_number: "",
            routing_number: "",
            confirm_routing_number: "",
            account_type: "",
            deposit_type: "",
            deposit_value: "",
            description: "",
            void_cheque_documents: [
                {
                    new_document_id: '',
                    document_name: ''
                }
            ],
            deposit_form_documents: [
                {
                    new_document_id: '',
                    document_name: ''
                }
            ],
        };
        if (bankdetailsArr[0].deposit_type !== 1) {
            bankdetailsArr.push(newArr);
            setBank([...bankdetailsArr]);
        } else {
            if (bankdetailsArr[0].deposit_type == 1) {
                addErrorMsg("Can not add another bank when selected deposit value as Full net");
            }
        }

    };

    const removeBank = (index) => {
        let bankdetailsArr = bank;
        if (bankdetailsArr[index] && bankdetailsArr[index].bank_account_details_id != '') {
            if (!deletebanks.includes(bankdetailsArr[index].bank_account_details_id)) {
                let newArr = deletebanks;
                newArr.push(bankdetailsArr[index].bank_account_details_id);
                setDeletebanks([...newArr])
            }
        }
        bankdetailsArr.splice(index, 1);
        setBank([...bankdetailsArr]);
    }

    const back = () => {
        setValue(0);
        setDocStepper(1);
        setMainStep(mainStep - 1);
    }

    const bankIndexApi = (id) => {
        OnBoardApi.bankIndex(LocalStorage.uid(), id ? id : '', LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                console.log(res.data.data);
                setBank(res.data.data);
            }
        })
    }

    const storeBankDetails = () => {
        const data = {
            employee_id: LocalStorage.getEmployeeId(),
            bank_information: bank
        }
        data['request_id'] = LocalStorage.uid()
        OnBoardApi.bankStore(data, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                console.log(res.data.data);
                if (bank[indexValue] && bank[indexValue].deposit_type !== 1) {
                    // setAdd(true);
                }
                if (bank.length == 0) {

                }
                setSuccess(true);
                console.log(success, "suces")
                bankIndexApi(LocalStorage.getEmployeeId());
            }
        })
    }

    const handleSubmit = (args) => {
        let errors = formValidations();
        console.log(errors, "errors");
        if (errors.length == 0) {
            let bankdetailsArr = bank;
            if (bankdetailsArr[0].deposit_type == 3) {
                if (bankdetailsArr.filter((bank) => bank.deposit_type == 3).length == bankdetailsArr.length) {
                    let sumArr = bankdetailsArr.map((value) => Number(value.deposit_value));
                    if (sumArr.reduce((a, b) => a + b) != 100) {
                        addWarningMsg("Sum of all Deposit percentage's should be Equal to 100%");
                    } else {
                        storeBankDetails();
                        console.log(bank, 'storeApi');
                        // setAdd(true);
                    }
                } else {
                    addWarningMsg("Partial percentage deposit bank accounts and Partial Payment deposit bank not allowed for a single employee");
                }
            } else if (bankdetailsArr[0].deposit_type == 2 || bankdetailsArr[0].deposit_type == 4) {
                if (bankdetailsArr.filter((bank) => bank.deposit_type == 2).length == bankdetailsArr.length - 1 && bankdetailsArr.filter((bank) => bank.deposit_type == 4).length == 1) {
                    console.log(bank, 'storeApi');
                    storeBankDetails();
                    // setAdd(true);
                } else {
                    addWarningMsg("For partial payment distribution bank details, one Remainder payment distribution bank must be exists");
                }
            } else if (bankdetailsArr[0].deposit_type == 1) {
                if (bankdetailsArr.length > 1) {
                    addWarningMsg("Unable to store multiple banks with full net diposit type");
                } else {
                    console.log(bank, 'storeApi');
                    storeBankDetails();
                    // setAdd(true);
                }
            }
        } else {
            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
        }
    };

    return (
        <Grid container justifyContent='center' pb={4}>
            <Grid item lg={6} pt={16}>
                <Card sx={{ padding: '10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)!important', borderRadius: '15px' }}>
                    {/* <CardHeader sx={{ padding: '15px 0px 0px 23px !important' }} title={
                        <Text largeBlack>Bank Details</Text>
                    } /> */}
                    <CardContent sx={{ padding: '10px 20px !important' }}
                    >
                        {
                            formLoader ?
                                <Box className={classes.ViewContainer}>
                                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                    </Stack>
                                </Box> :
                                <>
                                    {
                                        Array.isArray(bank) && bank.map((item, key) => (
                                            <Box>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={12} m={'20px 0px 10px 0px'}>
                                                        {
                                                            key > 0 ?
                                                                <>
                                                                    <Grid item container lg={12} md={12} sm={12} xs={12} mt={1}>
                                                                        <Grid item lg={8} md={8} sm={8} xs={10}>
                                                                            <Text largeBlack>Bank Details -{key + 1}</Text>
                                                                        </Grid>
                                                                        <Grid item lg={4} md={4} sm={4} xs={2} textAlign='end'>
                                                                            <img src={minus} alt='Minus' style={{ cursor: 'pointer' }} onClick={() => removeBank(key)} />
                                                                        </Grid>
                                                                    </Grid><Divider sx={{ width: '100%', color: '#C7CCD3 !important', margin: '10px 10px 10px 0px' }} />
                                                                </> :
                                                                key >= 0 ?
                                                                    <Grid item lg={12} md={8} sm={8} xs={10}>
                                                                        <Text largeBlack>Bank Details</Text>
                                                                    </Grid>
                                                                    : ''
                                                        }
                                                    </Grid>
                                                    {/* {
                                            item.void_cheque_documents.map((value, voidIndex) => (
                                                <Grid item lg={6}>
                                                    <Box pt={'9px'}>
                                                        <FileInput
                                                            name='new_document_id'
                                                            // value={value.new_document_id}
                                                            FileName={value.document_name}
                                                            handleChange={(e) => changeHandler(e, key, voidIndex, 'void')}
                                                            label={<Text largeLabel>Void Cheque</Text>}
                                                        />
                                                    </Box>
                                                    {console.log(error,"error")}
                                                </Grid>
                                            ))
                                        } */}
                                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                                        <Box p={'25px 2px 1px 15px'}>
                                                            <FileInput
                                                                name={"void_cheque_documents"}
                                                                FileName={item.void_cheque_documents[0].document_name}
                                                                handleChange={(e) => uploadDocs(e, key, "void_cheque_documents")}
                                                                label={"Void Cheque"} isDisabled={false}
                                                                handleDelete={() => deleteDoc(key, 'void_cheque_documents')}
                                                                actionState={item.void_cheque_documents[0].document_name ? 1 : ''}
                                                            />
                                                            <Text errorText> {error[key] && error[key].void_cheque_documents ? error[key].void_cheque_documents : ""}</Text>
                                                            {/* <Text errorText>{error.void_cheque_documents ? error.void_cheque_documents : ""}</Text> */}
                                                        </Box>
                                                    </Grid>
                                                    {/* {
                                            item.deposit_form_documents.map((value, depositIndex) => (
                                                <Grid item lg={6}>
                                                    <Box pt={'9px'}>
                                                        <FileInput
                                                            name='new_document_id'
                                                            // value={value.new_document_id}
                                                            FileName={value.document_name}
                                                            handleChange={(e) => changeHandler(e, key, depositIndex, 'deposit')}
                                                            label={<Text largeLabel>W-4 Form</Text>}
                                                        />
                                                        {error[key] && error[key].void_cheque_documents ? error[key].void_cheque_documents != '' ? <Text red>{error[key].bank_name}</Text> : null : null}

                                                    </Box>
                                                </Grid>
                                            ))
                                        } */}

                                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                                        <Box p={'25px 5px 1px 15px'}>
                                                            <FileInput
                                                                name={"deposit_form_documents"}
                                                                FileName={item.deposit_form_documents[0].document_name}
                                                                handleChange={(e) => uploadDocs(e, key, "deposit_form_documents")}
                                                                label={"W-4 Form"} isDisabled={false}
                                                                handleDelete={() => deleteDoc(key, 'deposit_form_documents')}
                                                                actionState={bank.deposit_form_documents[0].document_name ? 1 : ''}
                                                            />
                                                            <Text errorText> {error[key] && error[key].deposit_form_documents ? error[key].deposit_form_documents : ""}</Text>
                                                            {/* <Text errorText>{error.deposit_form_documents ? error.void_cheque_documents : ""}</Text> */}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'bank_name',
                                                                value: item.bank_name
                                                            }}
                                                            handleChange={(e) => changeHandler(e, key)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Bank Name</Text>}
                                                        />
                                                        {error[key] && error[key].bank_name ? error[key].bank_name != '' ? <Text red>{error[key].bank_name}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Box pt={'0px'}>
                                                            <SearchSelect
                                                                name='account_type'
                                                                value={item.account_type}
                                                                onChange={(e) => changeHandler(e, key)}
                                                                options={accountType}
                                                                labelText={<Text largeLabel>Account Type</Text>}
                                                            />
                                                        </Box>
                                                        {error[key] && error[key].account_type ? error[key].account_type != '' ? <Text red>{error[key].account_type}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'account_number',
                                                                value: item.account_number,
                                                                inputProps: { minLength: 5, maxLength: 15 }
                                                            }}
                                                            handleChange={(e) => changeHandler(e, key)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Account Number</Text>}
                                                        />
                                                        {error[key] && error[key].account_number ? error[key].account_number != '' ? <Text red>{error[key].account_number}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'confirm_account_number',
                                                                value: item.confirm_account_number,
                                                                inputProps: { minLength: 5, maxLength: 15 }
                                                            }}
                                                            handleChange={(e) => changeHandler(e, key)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Confirm Account Number</Text>}
                                                        />
                                                        {error[key] && error[key].confirm_account_number ? error[key].confirm_account_number != '' ? <Text red>{error[key].confirm_account_number}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'routing_number',
                                                                value: item.routing_number,
                                                                inputProps: { minLength: 9, maxLength: 10 }
                                                            }}
                                                            handleChange={(e) => changeHandler(e, key)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Routing Number</Text>}
                                                        />
                                                        {error[key] && error[key].routing_number ? error[key].routing_number != '' ? <Text red>{error[key].routing_number}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'confirm_routing_number',
                                                                value: item.confirm_routing_number,
                                                                inputProps: { minLength: 9, maxLength: 10 }
                                                            }}
                                                            handleChange={(e) => changeHandler(e, key)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Confirm Routing Number</Text>}
                                                        />
                                                        {error[key] && error[key].confirm_routing_number ? error[key].confirm_routing_number != '' ? <Text red>{error[key].confirm_routing_number}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Box pt={'0.5px'}>
                                                            <SearchSelect
                                                                name='deposit_type'
                                                                value={item.deposit_type}
                                                                onChange={(e) => changeHandler(e, key)}
                                                                options={deposityTypes}
                                                                labelText={<Text largeLabel>Choose Debit Config</Text>}
                                                            />
                                                        </Box>
                                                        {error[key] && error[key].deposit_type ? error[key].deposit_type != '' ? <Text red>{error[key].deposit_type}</Text> : null : null}
                                                    </Grid>
                                                    <Grid item lg={6}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'deposit_value',
                                                                value: item.deposit_value
                                                            }}
                                                            handleChange={(e) => changeHandler(e, key)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Deposit {item.deposit_type == 3 ? 'Percentage' : 'value'}</Text>}
                                                        />
                                                        {error[key] && error[key].deposit_value ? error[key].deposit_value != '' ? <Text red>{error[key].deposit_value}</Text> : null : null}

                                                    </Grid>
                                                </Grid>
                                                {
                                                    bank.length - 1 == key ?
                                                        item.deposit_type === 1 ? null :
                                                            bank.filter((val) => val.deposit_type == 2).length > 0 && bank.filter((val) => val.deposit_type == 4).length == 1 ?
                                                                null :
                                                                <Box py={2}>
                                                                    <Button lightBlue onClick={addNewBank}>Add New Bank</Button>
                                                                </Box> : null
                                                }
                                            </Box>
                                        ))
                                    }
                                </>
                        }

                        {/* {
                            state.length > 1 ?
                                <Button iconRemoveBtn startIcon={<RemoveIcon />} onClick={() => removeBank(index)}>Remove bank</Button> : null
                        } */}
                        {/* {
                            <Box py={2}>
                                <Button lightBlue onClick={addNewBank}>Add New Bank</Button>
                            </Box>
                        } */}
                        {/* {
                            add &&
                            <Box p={'20px 0px 10px 0px'}>
                                <Button lightBlue onClick={addNewBank}>Add New Contact</Button>
                            </Box>
                        } */}
                    </CardContent>
                </Card>
                <Grid item container m={'25px 0px 10px 0px'}>
                    <Grid item lg={6}>
                        <Button blackCancel onClick={back}>Back</Button>
                    </Grid>
                    <Grid item lg={6} textAlign='end'>
                        {
                            bank.length == 1 && bank[0].deposit_type != 1 ?
                                <TooltipIndicator
                                    title={<Text smallWhite>Atleast Add Two<br />Bank Details To Next</Text>}
                                    placement='right-start'
                                >
                                    <Button greyButton>Next</Button>
                                </TooltipIndicator>
                                :
                                <>
                                    {/* <Button saveAsDraft sx={{ marginRight: '15px' }} onClick={() => setOpen(true)}>Save as Draft</Button> */}
                                    <Button brownMnSave onClick={() => handleSubmit()}>{bank.length == 0 && bank.deposit_type != 1 ? 'Save' : 'Finish'}</Button>
                                </>
                        }
                    </Grid>
                </Grid>
            </Grid>
            {
                open &&
                <ReusablePopup openPopup={open} setOpenPopup={setOpen} crossIcon iconHide white>
                    <Box textAlign='center' p={'0px 20px'}>
                        <img src={draft} alt='draft' style={{ height: '130px', width: '150px' }} />
                        <Text veryLargeLabel>Save as Draft!</Text>
                        <Text mediumLabel sx={{ paddingTop: '20px' }}>Your progress will be saved, and you will be able to<br /> continue from the next stage when you return.</Text>
                        <Button blueButton sx={{ marginTop: '20px' }} onClick={() => navigate('/employees')}>Done</Button>
                    </Box>
                </ReusablePopup>
            }
            {
                success &&
                <ReusablePopup openPopup={success} setOpenPopup={setSuccess} white iconHide fixedWidth>
                    <Box textAlign='center' justifyContent='center' p={'20px 0px'}>
                        <img src={successImg} alt='success' style={{ height: '150px', width: '150px', marginBottom: '5px' }} />
                        <Text largeGreen>Congratulations</Text>
                        <Text mediumBlack sx={{ marginTop: '8px !important' }}>You Have Successfully Onboarded <span style={{ color: `${blue}` }}>&nbsp;{LocalStorage && LocalStorage.getFullName()}</span></Text>
                        <Button brownMnSave sx={{ margin: '20px 0px 0px 0px !important' }} onClick={goToHome}>Go To Home</Button>
                    </Box>
                </ReusablePopup>
            }
        </Grid>
    )
}

export default BankDetails