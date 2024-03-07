import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Grid } from '@mui/material';
import Text from '../../../components/customText/Text';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeSelfServiceStyles from './EmployeeSSDshStyles';
import Input from '../../../components/input/Input';
import SearchSelect from '../../../components/selectField/SearchSelect';
import Button from '../../../components/customButton/Button';
// import BrowseInput from '../../../components/muiFileInput/FileInput';
import FileInput from '../../../components/muiFileInput/FileInput';
import CommonApi from '../../../apis/CommonApi';
import EmployeeSelfServiceApi from '../../../apis/admin/employeeSelfService/EmployeeSelfServiceApi';
import LocalStorage from '../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import { isValid, validate_emptyField, } from "../../../components/Validation";

export default function RaiseRequest() {
    const classes = EmployeeSelfServiceStyles();
    const navigate = useNavigate();
    const [employeesList, setEmployeesList] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        employee_id: '',
        ticket_id: '',
        self_service_types_id: '',
        subject: '',
        description: '',
        documents: [
            {
                new_document_id: '',
                document_name: ''
            }
        ]
    });

    useEffect(() => {
        getEmployeesDropdown();
        getSelfServiceTypeDropdown();
        getTicketID(); // eslint-disable-next-line
    }, [])

    // Self Service Types DropDown api call
    const getSelfServiceTypeDropdown = () => {
        let slug = 'self-service'
        CommonApi.selfServiceTypesDropdown(slug, '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setServiceTypes(response.data.data);
            }
        });

    }

    // Employees DropDown api call
    const getEmployeesDropdown = () => {

        CommonApi.employees(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmployeesList(response.data.data);
            }
        });

    }

    // Prefix api call
    const getTicketID = () => {

        CommonApi.prefix('employee-self-service').then((response) => {
            if (response.data.statusCode == 1003) {
                setFormData({ ...formData, ticket_id: response.data.data });
            }
        });

    }



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        handleValidations(e);
    }


    const uploadDocs = (value) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg'].includes(r))) {
            const formDataFile = new FormData();
            formDataFile.append("files", value.target.files[0]);
            formDataFile.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi
                .documentUpload("ess-document",formDataFile, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        let docInfo = response.data.data;
                        let docArr;
                        if (formData.documents.length > 0) {
                            docArr = [{
                                id: formData.documents[0].id,
                                new_document_id: docInfo.id,
                                document_name: value.target.files[0].name,
                            }]
                        } else {
                            docArr = [
                                {
                                    id: "",
                                    new_document_id: "",
                                    document_name: "",
                                }
                            ]
                        }
                        setFormData((prev) => ({ ...prev, documents: docArr }));
                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg).");
        }
    };


    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "employee_id":
                err.employee_id = validate_emptyField(input.value);
                break;
            case "ticket_id":
                err.ticket_id = validate_emptyField(input.value);
                break;
            case "self_service_types_id":
                err.self_service_types_id = validate_emptyField(input.value);
                break;
            case "subject":
                err.subject = validate_emptyField(input.value);
                break;
            case "description":
                err.description = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let { employee_id, ticket_id, self_service_types_id, subject, description, } = formData;
        let errors = {};
        errors.employee_id = validate_emptyField(employee_id);
        errors.ticket_id = validate_emptyField(ticket_id);
        errors.self_service_types_id = validate_emptyField(self_service_types_id);
        errors.subject = validate_emptyField(subject);
        errors.description = validate_emptyField(description);
        return errors;

    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            submitESSRequest();
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const submitESSRequest = () => {
        let data = { ...formData, request_id: LocalStorage.uid() };
        EmployeeSelfServiceApi.storeESSRequest(data).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    addSuccessMsg('Successfully Raised a Request');
                    let data = formData;
                    data.id = response.data.data.id
                    data.status = 1
                    navigate('/employee-self-service/chat-panel', { state: { requestData: data, formData: data, recieve: false, raise: true } })
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }





    return (
        <Box className={classes.containerMain} >
            <Box width={'100%'}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='/employee-self-service' className={classes.linkStyle}><Text className={classes.navText1}>Employees Self Service</Text></Link>
                    <Text className={classes.navText2}>Raise a Request</Text>
                </Breadcrumbs>
            </Box>
            <Box width={{ lg: '70%', md: '80%', sm: '90%', xs: '100%' }} className={classes.formBox}>
                <Text sx={{ mb: '32px' }}>Raise a Request</Text>
                <Grid container columnSpacing={'80px'}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '84px' }}>


                            <SearchSelect
                                options={employeesList}
                                name='employee_id'
                                value={formData.employee_name}
                                labelText='Employee Name'
                                onChange={handleChange}
                            />
                            <Text errorText> {error.employee_id ? error.employee_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '84px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'ticket_id',
                                    value: formData.ticket_id,
                                    disabled: true
                                }}

                                handleChange={handleChange}
                                clientInput
                                labelText='Ticket ID'
                            />
                            <Text errorText> {error.ticket_id ? error.ticket_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '84px' }}>
                            <SearchSelect
                                options={serviceTypes}
                                name='self_service_types_id'
                                value={formData.self_service_types_id}
                                labelText='Service Type'
                                onChange={handleChange}
                            />
                            <Text errorText> {error.self_service_types_id ? error.self_service_types_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '84px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'subject',
                                    value: formData.subject
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText='Subject'
                            />
                            <Text errorText> {error.subject ? error.subject : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box sx={{ height: '210px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'description',
                                    value: formData.description
                                }}
                                rows={6}
                                multiline={true}
                                handleChange={handleChange}
                                descriptionFormControl
                                descriptionInput
                                labelText={'Description'}
                            />
                            <Text errorText> {error.description ? error.description : ""}</Text>
                        </Box>
                    </Grid>

                    {
                        formData && formData.documents && formData.documents.map((item, key) => (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Box sx={{ height: '84px' }}>
                                    <FileInput
                                        name={"document_name"}
                                        FileName={formData.documents[0] ? formData.documents[0].document_name : ""}
                                        handleChange={uploadDocs}
                                        label={<Text largeLabel>Upload A Document<span className={classes.optional}>(Optional)</span></Text>}
                                        isDisabled={false} />
                                </Box>
                            </Grid>
                        ))
                    }

                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'end', gap: '16px', marginTop: '12px' }}>
                    <Button
                        cancelSmall
                        sx={{ height: '43px !important', width: '98px !important', font: '16px Nunito !important' }}
                        onClick={() => navigate('/employee-self-service')}
                    >
                        Cancel
                    </Button>
                    <Button
                        addNew
                        sx={{ height: '43px !important', minWidth: '98px !important' }}
                        onClick={handleSubmit}
                    >Send</Button>
                </Box>
            </Box>
        </Box>
    )
}
