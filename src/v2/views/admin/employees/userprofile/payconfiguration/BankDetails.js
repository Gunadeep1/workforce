import React, { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Grid, Skeleton, Stack } from '@mui/material';
// import Browse from '../../../../../assets/svg/Browse.svg';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { validate_emptyField, validate_alphaNumeric, validates_Integer, validates_float } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import BankSvg from "../../../../../assets/svg/banklogo.svg";
import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
// import EditSvg from "../../../../../assets/svg/editIcon.svg";
// import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import FileSvg from "../../../../../assets/svg/File.svg";
import FileSaver from 'file-saver';
import FileInput from '../../../../../components/muiFileInput/FileInput';
import NoDataImg from "../../../../../assets/images/no-data.png";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import RemoveIcon from '@mui/icons-material/Remove';
import EmployeeCreateAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LoaderIcon from '../../../../../assets/svg/sandtimer.svg';
import workAuthStyles from '../document/workAuthStyles';
import disablePlus from '../../../../../assets/client/disablePlus.svg';

const AccountTypeOptions = [
    {
        id: 1,
        name: "Savings"
    },
    {
        id: 2,
        name: "Current"
    }
];

export default function BankDetails() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = workAuthStyles();
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null)
    const [list, setList] = useState([]);
    const [state, setState] = useState([
        {
            bank_name: "",
            account_type: "",
            account_number: "",
            confirm_account_number: "",
            routing_number: "",
            confirm_routing_number: "",
            deposit_type: "",
            deposit_value: "",
            void_cheque_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_url: "",
                    document_name: "",
                }
            ],
            deposit_form_documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_url: "",
                    document_name: "",

                }
            ]
        }]
    );
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoader, setFormLoader] = useState(false);

    useEffect(() => {
        getBankDetails();
        // eslint-disable-next-line
    }, []);

    const getBankDetails = () => {
        setLoading(true)
        EmployeeAPI.getBankDetails(location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setList(response.data.data);
                    setState(response.data.data);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }


    /* fun is for Uploading Documents */
    const uploadDocs = (value, index, fieldName) => {
        setFormLoader(true);
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi
            .documentUpload("bank-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    let docInfo = response.data.data;
                    let newStateArr = [...state];
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
                            setState([...newStateArr]);
                        })
                    } else {
                        setFormLoader(false);
                        newStateArr[index].deposit_form_documents[0].new_document_id = docInfo.id;
                        newStateArr[index].deposit_form_documents[0].document_name = value.target.files[0].name;
                    }
                    setState([...newStateArr]);
                    handleValidate(fieldName, value.target.value, index); // Pass the field name directly
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    };

    const deleteDoc = (index, args) => {
        if (args == 'void_cheque_documents') {
            state[index].void_cheque_documents[0].new_document_id = ''
            state[index].void_cheque_documents[0].document_name = ''
        } else if (args == 'deposit_form_documents') {
            state[index].deposit_form_documents[0].new_document_id = ''
            state[index].deposit_form_documents[0].document_name = ''
        }
        setState({ ...state })
    }

    const handleChange = (e, index) => {
        let { name, value } = e.target;
        let bankDetailsArr = state;
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
                    addErrorMsg("please Enter Valid deposit Percentage");
                }
            }
        }
        setState([...bankDetailsArr]);

        handleValidate(name, e.target.value, index);
    }


    // const handleValidations = (e) => {
    //     let input = e.target;
    //     let err = error;
    //     switch (input.name || input.tagName) {
    //         case "bank_name":
    //             err.bank_name = validate_alphaNumeric(input.value);
    //             break;
    //         case "account_type":
    //             err.account_type = validate_emptyField(input.value);
    //             break;
    //         case "account_number":
    //             err.account_number = validate_emptyField(input.value);
    //             break;
    //         case "confirm_account_number":
    //             err.confirm_account_number = validate_emptyField(input.value);
    //             break;
    //         case "routing_number":
    //             err.routing_number = validate_emptyField(input.value);
    //             break;
    //         case "confirm_routing_number":
    //             err.confirm_routing_number = validate_emptyField(input.value);
    //             break;
    //         case "deposit_type":
    //             err.deposit_type = validate_emptyField(input.value);
    //             break;
    //         case "deposit_value":
    //             err.deposit_value = validate_emptyField(input.value);
    //             break;
    //         default:
    //             break;
    //     }
    //     setError(err);
    // }

    const handleValidate = (fieldName, value, index) => {
        let bankdetailsArr = state;
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
                errors["account_number"] = validates_Integer(value);
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
        errorsArr[index] = errors;
        setError(errorsArr);
    };


    // const handleValidate = (fieldName, value, index, ) => {
    //     let bankdetailsArr = state;
    //     let errorsArr = [...error];
    //     let errors = errorsArr[index];

    //     switch (fieldName) {
    //         case "bank_name":
    //             errors.bank_name = validate_alphaNumeric(value);
    //             break;
    //         case "account_type":
    //             errors.account_type = validate_emptyField(value);
    //             break;
    //         case "account_number":
    //             errors.account_number = validates_Integer(value);
    //             break;
    //         case "confirm_account_number":
    //             if (value == "") {
    //                 errors.confirm_account_number = "This field is required";
    //             } else if (value != bankdetailsArr[index].account_number) {
    //                 errors.confirm_account_number = "Account number not matching";
    //             } else {
    //                 errors.confirm_account_number = "";
    //             }
    //             break;
    //         case "routing_number":
    //             errors.routing_number = validates_Integer(value);
    //             break;
    //         case "confirm_routing_number":
    //             if (value == "") {
    //                 errors.confirm_routing_number = "This field is required";
    //             } else if (value != bankdetailsArr[index].routing_number) {
    //                 errors.confirm_routing_number = "Route number not matching";
    //             } else {
    //                 errors.confirm_routing_number = "";
    //             }
    //             break;
    //         case "deposit_type":
    //             errors.deposit_type = validate_emptyField(value);
    //             break;
    //         case "deposit_value":
    //             if (bankdetailsArr[index].deposit_type == 4) {
    //                 if (value != '' && value != null) {
    //                     errors.deposit_value = validates_float(value);
    //                 }
    //             } else {
    //                 errors.deposit_value = validates_float(value);
    //             }
    //             break;
    //         case "deposit_form_documents":
    //             errors.deposit_form_documents = validate_emptyField(value);
    //             break;
    //         case "void_cheque_documents":
    //             errors.void_cheque_documents = validate_emptyField(value);
    //             break;
    //         default:
    //             break;
    //     }

    //     console.log(errors.void_cheque_documents, "array");
    //     errorsArr[index] = errors;
    //     setError(errorsArr);
    // };



    // const validateAll = () => {
    //     let {
    //         bank_name,
    //         account_type,
    //         account_number,
    //         confirm_account_number,
    //         routing_number,
    //         confirm_routing_number,
    //         deposit_type,
    //         deposit_value, } = state;
    //     let errors = {};
    //     errors.bank_name = validate_alphaNumeric(bank_name);
    //     errors.account_type = validate_emptyField(account_type);
    //     errors.account_number = validates_Integer(account_number);
    //     if (account_number != confirm_account_number) {
    //         errors.confirm_account_number = 'Account number not matching';
    //     } else {
    //         errors.confirm_account_number = validate_emptyField(confirm_account_number);
    //     }
    //     errors.routing_number = validates_Integer(routing_number);
    //     if (routing_number != confirm_routing_number) {
    //         errors.confirm_routing_number = 'Routing number not matching';
    //     } else {
    //         errors.confirm_routing_number = validates_Integer(confirm_routing_number);
    //     }
    //     errors.deposit_type = validate_emptyField(deposit_type);
    //     if (deposit_type != 4) {
    //         errors.deposit_value = validates_Integer(deposit_value);
    //     } else {
    //         if (deposit_value != '' && deposit_value != null) {
    //             errors.deposit_value = validates_Integer(deposit_value);
    //         }
    //     }



    //     // if (form === "update") {
    //     //     if (state.void_cheque_documents[0].id === "") {
    //     //         errors.document = validate_emptyField(state.documents[0].new_document_id);
    //     //     }
    //     // } else {
    //     //     errors.document = validate_emptyField(state.documents[0].new_document_id);
    //     // }
    //     return errors;
    // };


    const formValidations = () => {
        let result = [];
        let bankdetailsArr = state;
        let errorsArr = [];
        bankdetailsArr.forEach(bank => {
            let errors = {};
            errors.bank_name = validate_alphaNumeric(bank.bank_name);
            errors.account_type = validate_emptyField(bank.account_type);
            errors.account_number = validates_Integer(bank.account_number);
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


    const handleSubmit = () => {
        let errors = formValidations();
        if (errors.length == 0) {
            let bankdetailsArr = state;
            if (bankdetailsArr[0].deposit_type == 3) {
                if (bankdetailsArr.filter((bank) => bank.deposit_type == 3).length == bankdetailsArr.length) {
                    let sumArr = bankdetailsArr.map((value) => Number(value.deposit_value));
                    if (sumArr.reduce((a, b) => a + b) != 100) {
                        addWarningMsg("Sum of all Deposit percentage's should be Equal to 100%");
                    } else {
                        storeBankDetails();
                    }
                } else {
                    addWarningMsg("Partial percentage deposit bank accounts and Partial Payment deposit bank not allowed for a single employee");
                }
            } else if (bankdetailsArr[0].deposit_type == 2 || bankdetailsArr[0].deposit_type == 4) {
                if (bankdetailsArr.filter((bank) => bank.deposit_type == 2).length == bankdetailsArr.length - 1 && bankdetailsArr.filter((bank) => bank.deposit_type == 4).length == 1) {
                    storeBankDetails();
                } else {
                    addWarningMsg("For partial payment distribution bank details, one Remainder payment distribution bank must be exists");
                }
            } else if (bankdetailsArr[0].deposit_type == 1) {
                if (bankdetailsArr.length > 1) {
                    addWarningMsg("Unable to store multiple banks with full net diposit type");
                } else {
                    storeBankDetails();
                }
            }
        } else {
            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data.");
        }
    }

    const storeBankDetails = () => {
        let data = { request_id: LocalStorage.uid(), employee_id: location.state.id, bank_information: state };
        EmployeeAPI.storeBankDetails(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getBankDetails();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    // const updateEmployeeEducation = () => {
    //     let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
    //     setLoading(true)
    //     EmployeeAPI.updateEmployeeEducation(data, editdeleteId).then((response) => {
    //         setTimeout(() => {
    //             setLoading(false)
    //             if (response.data.statusCode == 1003) {
    //                 getBankDetails();
    //                 setForm(false);
    //                 setEditdeleteId(null)
    //                 addSuccessMsg(response.data.message);
    //             } else {
    //                 addErrorMsg(response.data.message);
    //             }
    //         }, 400)
    //     });
    // }

    // const deleteEmployeeEducation = (id) => {
    //     let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
    //     setLoading(true)
    //     EmployeeAPI.deleteEmployeeEducation(data, id).then((response) => {
    //         setTimeout(() => {
    //             setLoading(false)
    //             if (response.data.statusCode == 1003) {
    //                 getBankDetails();
    //                 setForm(false);
    //                 setEditdeleteId(null)
    //                 addSuccessMsg(response.data.message);
    //             } else {
    //                 addErrorMsg(response.data.message);
    //             }
    //         }, 400)
    //     });
    // }

    // const handleUpdate = (key) => {
    //     let data = list[key];
    //     let updateData = {
    //         education_level_id: data.education_level_id,
    //         start_date: data.start_date,
    //         end_date: data.end_date,
    //         field_of_study: data.field_of_study,
    //         university_name: data.university_name,
    //         state_id: data.state_id,
    //         country_id: data.country_id,
    //         documents: [
    //             {
    //                 id: data.documents[0].id,
    //                 new_document_id: "",
    //                 docName: data.documents[0].name
    //             }
    //         ]
    //     }

    //     if (data.country_id !== "") {
    //         getStatesList(data.country_id);
    //     }

    //     setError({})
    //     setForm("update");
    //     setEditdeleteId(data.id);
    //     setState(updateData);
    // }

    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
    }

    const openAddForm = () => {
        setState(
            [
                {
                    bank_name: "",
                    account_type: "",
                    account_number: "",
                    confirm_account_number: "",
                    routing_number: "",
                    confirm_routing_number: "",
                    deposit_type: "",
                    deposit_value: "",
                    void_cheque_documents: [
                        {
                            document_name: "",
                            new_document_id: ""
                        }
                    ],
                    deposit_form_documents: [
                        {
                            document_name: "",
                            new_document_id: ""
                        }
                    ]
                }]
        );
        setError({});
        setForm("add");
    }

    const addNewBank = () => {
        let bankdetailsArr = state;
        let newArr = {
            bank_name: "",
            account_type: "",
            account_number: "",
            confirm_account_number: "",
            routing_number: "",
            confirm_routing_number: "",
            deposit_type: "",
            deposit_value: "",
            void_cheque_documents: [
                {
                    id: "",
                    document_name: "",
                    new_document_id: "",
                    document_url: "",
                }
            ],
            deposit_form_documents: [
                {
                    id: "",
                    document_name: "",
                    new_document_id: "",
                    document_url: "",
                }
            ]
        };
        if (bankdetailsArr[0].deposit_type != 1) {
            bankdetailsArr.push(newArr);
            setState([...bankdetailsArr]);
        } else {
            if (bankdetailsArr[0].deposit_type == 1) {
                addErrorMsg("Can not add another bank when selected deposit value as Full net");
            }
        }
    };

    const removeBank = (index) => {
        let bankdetailsArr = state;
        // if (bankdetailsArr[index].bank_account_details_id != '') {
        //   if (!deletebanks.includes(bankdetailsArr[index].bank_account_details_id)) {
        //     let newArr = deletebanks;
        //     newArr.push(bankdetailsArr[index].bank_account_details_id);
        //     setDeletebanks([...newArr])
        //   }
        // }
        bankdetailsArr.splice(index, 1);
        setState([...bankdetailsArr]);
    }

    return (
        <Grid container>
            <Box py={1} width='100%' sx={{ height: "53vh", overflowY: 'scroll' }}>
                {
                    !["add", "update"].includes(form) &&
                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
                        <Box my={2} display={"flex"} justifyContent={"end"}>
                            <Button addNew startIcon={<Plus />} onClick={() => openAddForm()}>Add New</Button>
                        </Box> :
                        <Box my={2} display={"flex"} justifyContent={"end"}>
                            <Button addNewDisable startIcon={<img src={disablePlus} alt='add' />}>Add New</Button>
                        </Box>
                }
                {
                    ["add", "update"].includes(form) ? (
                        formLoader ?
                            <Box className={classes.ViewContainer}>
                                <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                    <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                </Stack>
                            </Box> :
                            <Fragment>
                                {
                                    Array.isArray(state) && state.map((bank, index) => (
                                        <Box>
                                            <Grid container spacing={0}>
                                                <Grid lg={6} md={6} sm={12} xs={12}>
                                                    <Box p={2}>
                                                        <FileInput
                                                            name={"void_cheque_documents"}
                                                            FileName={bank.void_cheque_documents[0].document_name}
                                                            handleChange={(e) => uploadDocs(e, index, "void_cheque_documents")}
                                                            label={"Void Cheque"} isDisabled={false}
                                                            handleDelete={() => deleteDoc(index, 'void_cheque_documents')}
                                                            actionState={bank.void_cheque_documents[0].document_name ? 1 : ''}
                                                        />
                                                        <Text errorText> {error[index] && error[index].void_cheque_documents ? error[index].void_cheque_documents : ""}</Text>
                                                        {/* <Text errorText>{error.void_cheque_documents ? error.void_cheque_documents : ""}</Text> */}
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>
                                                    <Box p={2}>
                                                        <FileInput
                                                            name={"deposit_form_documents"}
                                                            FileName={bank.deposit_form_documents[0].document_name}
                                                            handleChange={(e) => uploadDocs(e, index, "deposit_form_documents")}
                                                            label={"W-4 Form"} isDisabled={false}
                                                            handleDelete={() => deleteDoc(index, 'deposit_form_documents')}
                                                            actionState={bank.deposit_form_documents[0].document_name ? 1 : ''}
                                                        />
                                                        <Text errorText> {error[index] && error[index].deposit_form_documents ? error[index].deposit_form_documents : ""}</Text>
                                                        {/* <Text errorText>{error.void_cheque_documents ? error.void_cheque_documents : ""}</Text> */}

                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>

                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'bank_name',
                                                                value: state[index].bank_name,
                                                                type: 'text',

                                                            }}
                                                            handleChange={(e) => handleChange(e, index)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Bank Name</Text>}
                                                        />
                                                        <Text errorText> {error[index] && error[index].bank_name ? error[index].bank_name : ""}</Text>
                                                    </Box>

                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>
                                                    <Box p={2}>
                                                        <CustomSelect
                                                            label='Account Type'
                                                            options={AccountTypeOptions}
                                                            name='account_type'
                                                            value={state[index].account_type}
                                                            onChange={(e) => handleChange(e, index)}
                                                            commonSelect
                                                        />
                                                        <Text errorText> {error[index] && error[index].account_type ? error[index].account_type : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>
                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'account_number',
                                                                value: state[index].account_number,
                                                                type: 'text',
                                                                inputProps: { minLength: 5, maxLength: 15 }
                                                            }}
                                                            handleChange={(e) => handleChange(e, index)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Account Number</Text>}
                                                        />
                                                        <Text errorText> {error[index] && error[index].account_number ? error[index].account_number : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'confirm_account_number',
                                                                value: state[index].confirm_account_number,
                                                                type: 'text'
                                                            }}
                                                            handleChange={(e) => handleChange(e, index)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Confirm Account Number</Text>}
                                                        />
                                                        <Text errorText> {error[index] && error[index].confirm_account_number ? error[index].confirm_account_number : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>
                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'routing_number',
                                                                value: state[index].routing_number,
                                                                type: 'text',
                                                                inputProps: { minLength: 9, maxLength: 10 }
                                                            }}
                                                            handleChange={(e) => handleChange(e, index)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Routing Number</Text>}
                                                        />
                                                        <Text errorText> {error[index] && error[index].routing_number ? error[index].routing_number : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'confirm_routing_number',
                                                                value: state[index].confirm_routing_number,
                                                                type: 'text'
                                                            }}
                                                            handleChange={(e) => handleChange(e, index)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Confirm Routing Number</Text>}
                                                        />
                                                        <Text errorText> {error[index] && error[index].confirm_routing_number ? error[index].confirm_routing_number : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={2}>
                                                        <CustomSelect
                                                            label='Choose Deposit Configuration'
                                                            options={[
                                                                { id: 1, name: "Full Net" },
                                                                { id: 2, name: "Partial $" },
                                                                { id: 3, name: "Partial %" },
                                                                { id: 4, name: "Remainder" },
                                                            ]}
                                                            name='deposit_type'
                                                            value={state[index].deposit_type}
                                                            onChange={(e) => handleChange(e, index)}
                                                            commonSelect
                                                        />
                                                        <Text errorText> {error[index] && error[index].deposit_type ? error[index].deposit_type : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={6} xs={12}>
                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'deposit_value',
                                                                value: state[index].deposit_value,
                                                                type: 'text'
                                                            }}
                                                            handleChange={(e) => handleChange(e, index)}
                                                            clientInput
                                                            labelText={<Text largeLabel>Deposit Value</Text>}
                                                        />
                                                        <Text errorText> {error[index] && error[index].deposit_value ? error[index].deposit_value : ""}</Text>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Box my={2}>
                                                <Box display={"flex"} justifyContent={"end"} gap={"10px"}>
                                                    {
                                                        state.length - 1 == index ?
                                                            bank.deposit_type === 1 ? null :
                                                                state.filter((val) => val.deposit_type == 2).length > 0 && state.filter((val) => val.deposit_type == 4).length == 1 ?
                                                                    null :
                                                                    <Button addNew startIcon={<Plus />} onClick={() => addNewBank()} >Add bank</Button> : null
                                                    }

                                                    {/* {
                                                state.length - 1 == index ?

                                                    state.filter((val) => val.deposit_type == 2).length > 0 && state.filter((val) => val.deposit_type == 4).length == 1 ?
                                                        null :
                                                        <Button addNew startIcon={<Plus />} onClick={() => addNewBank()} >Add bank</Button> : null
                                            } */}

                                                    {
                                                        state.length > 1 ?
                                                            <Button iconRemoveBtn startIcon={<RemoveIcon />} onClick={() => removeBank(index + 1)}>Remove bank</Button> : null
                                                    }

                                                    {/* <Button addNew startIcon={<Plus />} >Add bank</Button> */}
                                                    {/* <Button iconRemoveBtn startIcon={<RemoveIcon />}>Remove bank</Button> */}
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))
                                }
                            </Fragment>
                    ) :

                        (
                            <Fragment>
                                {
                                    loading ?
                                        [1, 2, 3].map((item, key) => (
                                            <AccordionList
                                                key={key}
                                                serial_no={key + 1}
                                                accordionSummary={
                                                    <Grid container spacing={0}>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box display={'flex'} alignItems={'center'} gap={2} >
                                                                <Skeleton variant="circular" sx={{ width: "24px", height: "24px" }} />
                                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                            <Box>
                                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                            <Box>
                                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "2rem" }} />
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                }
                                                accordionDetails={
                                                    <Box
                                                        sx={{
                                                            height: "80px",
                                                            borderRadius: "10px",
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent: "space-around",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Skeleton variant="rounded" width={'100%'} height={'100%'} borderRadius={"10px"} />
                                                    </Box>

                                                }
                                            />
                                        )) : null
                                }

                                {
                                    !loading &&
                                    list.map((item, key) => (
                                        <AccordionList
                                            key={key}
                                            accordionSummary={
                                                <Grid container spacing={0}>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box display={'flex'} alignItems={'center'} >
                                                            <img src={BankSvg} alt="passport" />
                                                            <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>
                                                                {item.bank_name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.account_type + " Account"}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Typography
                                                                sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                            >
                                                                {item.account_number}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                            <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.void_cheque_documents[0].void_cheque_document_url)} />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            }
                                            accordionDetails={
                                                <Box
                                                    py={3} px={5}
                                                    sx={{
                                                        backgroundColor: "#F5F6F6",
                                                        minHeight: "100px",
                                                        borderRadius: "10px",
                                                    }}>
                                                    <Grid container spacing={0}>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Account Number
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    {item.account_number}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Routing Number
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    {item.routing_number}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Deposit Type
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    {item.deposit_type}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        {/* <Grid item lg={3} md={3} sm={3} xs={12}>
                                                        <Box sx={{ width: "100%", margin: "12px 0px", }} >
                                                            <Stack direction={'row'} spacing={2} justifyContent={'end'}>
                                                                <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} />
                                                                <img src={DeleteSvg} alt="delete" onClick={() => deleteEmployeeEducation(item.id)} style={{ cursor: "pointer" }} />
                                                            </Stack>
                                                        </Box>
                                                    </Grid> */}
                                                        {/* </Grid>
                                                <Grid container spacing={0}> */}

                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Deposit Value
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    {item.deposit_value}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Void Cheque
                                                                </Typography>
                                                                <Box
                                                                    sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }}
                                                                >
                                                                    <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.void_cheque_documents[0].void_cheque_document_url)} style={{ cursor: "pointer" }} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "#0C75EB",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        onClick={() => downloadDoc(item.void_cheque_documents[0].void_cheque_document_url)}
                                                                    >
                                                                        {item.void_cheque_documents[0].void_cheque_document_name}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>

                                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                        margin: "10px 0px",
                                                                    }}
                                                                >
                                                                    Deposit Form
                                                                </Typography>
                                                                <Box
                                                                    sx={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0px", }}
                                                                >
                                                                    <img src={FileSvg} alt='file' onClick={() => downloadDoc(item.deposit_form_documents[0].deposit_form_document_url)} style={{ cursor: "pointer" }} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "#0C75EB",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        onClick={() => downloadDoc(item.deposit_form_documents[0].deposit_form_document_url)}
                                                                    >
                                                                        {item.deposit_form_documents[0].deposit_form_document_name}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                            }
                                        />
                                    ))
                                }

                                {
                                    !loading && list.length === 0 ?
                                        <Box sx={{ height: "40vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Box>
                                                <img src={NoDataImg} alt='no-data' />
                                                <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                                    <Typography sx={{ fontSize: "16px", fontFamily: "Nunito, Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "600", color: "#092333" }}>
                                                        No Data Found
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box> : null
                                }

                            </Fragment>
                        )}

            </Box>
            <Grid item lg={12} textAlign='end'>
                <Box mt={1} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                    {
                        ["add", "update"].includes(form) ?
                            <Button cancelBtn onClick={() => setForm(false)}>
                                Cancel
                            </Button> : null
                    }
                    {
                        (form === "update" || form === 'add') &&
                        <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                            {
                                form === "update" ? "Update" : form === "add" ? "Save" : null
                            }
                        </LoadingButton>
                    }
                </Box>
            </Grid>
        </Grid>
    );
}