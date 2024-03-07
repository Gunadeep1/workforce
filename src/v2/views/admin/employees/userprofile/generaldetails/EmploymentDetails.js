import React, { useState, useEffect } from 'react';
import { Box, Grid, } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validate_emptyField, validates_float, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { useLocation } from 'react-router-dom';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Datepicker from '../../../../../components/datePicker/Date';
import CommonApi from '../../../../../apis/CommonApi';
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import ClientsApi from '../../../../../apis/admin/clients/ClientsApi';
// import { ReactComponent as CheckedIcon } from '../../../../../assets/svg/CheckedIcon.svg';
// import { ReactComponent as CheckBorderIcon } from '../../../../../assets/svg/CheckedBorderIcon.svg';

// import Checkbox from '@mui/material/Checkbox';

export default function EmploymentDetails(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [action, setAction] = useState("read");
    const [state, setState] = useState({
        reference_id: "",
        date_of_joining: "",
        employment_type_id: "",
        employment_category_id: "",
        ssn: "",
        is_usc: "",
        visa_type_id: "",
        enable_login: "",
        reporting_manager_id: "",
        department_id: "",
        team_id: "",
        role_id: "",
        vendor_id: '',
        vendor_price: '',
        showFullSSN: false
    });

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const [employmentCategoryDropdown, setEmploymentCategoryDropdown] = useState([]);
    const [employmentTypeDropdown, setEmploymentTypeDropdown] = useState([]);
    const [reportingManagers, setReportingManagers] = useState([]);
    const [visaTypeDropdown, setVisaTypeDropdown] = useState([]);
    const [departmentsDropdown, setDepartmentsDropdown] = useState([]);
    const [teamDropdown, setTeamDropdown] = useState([]);
    const [vendorList, setVendorList] = useState([]);

    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        getEmploymentTypeDropdown();
        getEmploymentCategoryDropdown(props.data.employment_type_id);
        getReportingManagerDropdown();
        getVisaTypeDropdown();
        getDepartmentsDropdown();
        getTeamDropdown();
        getRolesDropdown();
        vendorDropdown();
        let newData = props.data
        setState(newData);
        // eslint-disable-next-line
    }, [props]);


    const getRolesDropdown = () => {
        let search = "";
        CommonApi.rolesDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setRolesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const vendorDropdown = () => {
        ClientsApi.dropdown('vendor').then((response) => {
            if (response.data.statusCode == 1003) {
                setVendorList(response.data.data);
            }
        });
    };

    const getEmploymentCategoryDropdown = (employment_type_id) => {
        let search = "";
        CommonApi.getEmploymentCategoreyDropdown(search, employment_type_id).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmploymentCategoryDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }
    const getEmploymentTypeDropdown = () => {
        let search = "";
        CommonApi.getEmploymentTypeDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmploymentTypeDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getDepartmentsDropdown = () => {
        let search = "";
        CommonApi.departmentsDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setDepartmentsDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }


    const getTeamDropdown = () => {
        let search = "";
        CommonApi.teamDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setTeamDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getReportingManagerDropdown = () => {
        CommonApi.getEmployeeDetailsdropdown(1).then((response) => {
            if (response.data.statusCode == 1003) {
                setReportingManagers(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getVisaTypeDropdown = () => {
        let search = "";
        CommonApi.VisaTypeDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaTypeDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const handleChange = (e) => {

        if (e.target.name === "employment_type_id") {
            setState({ ...state, [e.target.name]: e.target.value, role_id: "" })
            getEmploymentCategoryDropdown(e.target.value)
        }
        else if (e.target.name === 'ssn' || e.target.name === 'maskedSSN') {
            convertFormat(e);
        }
        else {
            setState({ ...state, [e.target.name]: e.target.value })
        }
        handleValidations(e);
    };

    const convertFormat = (e) => {
        const value = e.target.value;
        const name = e.target.name === 'maskedSSN' ? 'ssn' : e.target.name
        const input = value.replace(/\D/g, '').substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890" 
        const first = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(0, 3) : input.substring(0, 3);
        const middle = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(3, 6) : input.substring(3, 5);
        const last = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(6, 10) : input.substring(5, 9);

        if (input.length > (name == 'contact_number' || name == 'alternate_contact_number' ? 6 : 5)) {
            setState(
                {
                    ...state,
                    [name]: `${first}-${middle}-${last}`
                }, handleValidations(e));
        }
        else if (input.length > 3) {
            setState(
                {
                    ...state,
                    [name]: `${first}-${middle}`
                }, handleValidations(e));
        }
        else if (input.length >= 0) {
            setState(
                {
                    ...state,
                    [name]: input
                }, handleValidations(e));
        }
    }

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "reference_id":
                err.reference_id = validate_emptyField(input.value);
                break;
            case "date_of_joining":
                err.date_of_joining = validate_emptyField(input.value);
                break;
            case "employment_type_id":
                err.employment_type_id = validate_emptyField(input.value);
                err.role_id = "";
                break;
            case "employment_category_id":
                err.employment_category_id = validate_emptyField(input.value);
                break;
            case "ssn":
                err.ssn = validate_emptyField(input.value);
                break;
            case "is_usc":
                err.is_usc = validate_emptyField(input.value);
                break;
            case "visa_type_id":
                if (state.is_usc === 0) {
                    err.visa_type_id = validate_emptyField(input.value);
                }
                break;
            case "department_id":
                err.department_id = validate_emptyField(input.value);
                break;
            case "team_id":
                err.team_id = validate_emptyField(input.value);
                break;
            case "role_id":
                err.role_id = validate_emptyField(input.value);
                break;
            case "vendor_id":
                err.vendor_id = validate_emptyField(input.value);
                break;
            case "vendor_price":
                err.vendor_price = validates_float(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let {
            reference_id,
            date_of_joining,
            employment_type_id,
            employment_category_id,
            ssn,
            is_usc,
            visa_type_id,
            // enable_login,
            reporting_manager_id,
            role_id, vendor_id, vendor_price, department_id, team_id,
        } = state;
        let errors = {};
        errors.reference_id = validate_emptyField(reference_id);
        errors.date_of_joining = validate_emptyField(date_of_joining);
        errors.employment_type_id = validate_emptyField(employment_type_id);
        errors.employment_category_id = validate_emptyField(employment_category_id);
        errors.ssn = validate_emptyField(ssn);
        errors.is_usc = validate_emptyField(is_usc);
        if (state.is_usc === 0) {
            errors.visa_type_id = validate_emptyField(visa_type_id);
        }
        // errors.enable_login = validate_emptyField(enable_login);
        errors.reporting_manager_id = validate_emptyField(reporting_manager_id);
        errors.department_id = validate_emptyField(department_id);
        errors.team_id = validate_emptyField(team_id);
        if (employment_type_id == 1) {
            errors.role_id = validate_emptyField(role_id);
        }
        errors.vendor_id = state.employment_type_id == 3 ? validate_emptyField(vendor_id) : '';
        errors.vendor_price = state.employment_type_id == 3 ? validates_float(vendor_price) : '';
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            updateEmployeeEmploymentDetails();
        } else {
            setError(errors);
        }
    }

    const updateEmployeeEmploymentDetails = () => {
        let data = { ...state, request_id: LocalStorage.uid() };
        setLoading(true);
        EmployeeAPI.updateEmployeeEmploymentDetails(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setAction("read");
                    addSuccessMsg(response.data.message);
                    props.getIndex();
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }



    const toggleVisibility = () => {
        setState({ ...state, showFullSSN: !state.showFullSSN });
    };

    const maskedSSN = state.ssn.slice(0, 3) + '*'.repeat(Math.max(0, state.ssn.length - 3));



    return (
        <Box py={1}>

            <Box sx={{ height: "53vh", overflow: "auto" }}>

                <Grid container spacing={0}>

                    <Grid lg={6} md={6} sm={6} xs={12}>

                        <Box p={2}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'reference_id',
                                    value: state.reference_id,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Employee ID</Text>}
                            />
                            <Text errorText> {error.reference_id ? error.reference_id : ""}</Text>
                        </Box>

                    </Grid>

                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <Datepicker
                                labelText={"Joining Date"}
                                name={'date_of_joining'}
                                value={state.date_of_joining}
                                onChange={handleChange}
                                disabled={action === "update" ? false : true}
                            />
                            <Text errorText> {error.date_of_joining ? error.date_of_joining : ""}</Text>
                        </Box>
                    </Grid>




                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2}>
                            <CustomSelect
                                label='Employment Type'
                                options={employmentTypeDropdown}
                                disabled={action === "update" ? false : true}
                                name='employment_type_id'
                                value={state.employment_type_id}
                                onChange={handleChange}
                                commonSelect
                            />

                            <Text errorText> {error.employment_type_id ? error.employment_type_id : ""}</Text>
                        </Box>

                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            <SearchSelect
                                options={employmentCategoryDropdown}
                                disabled={action === "update" ? false : true}
                                name='employment_category_id'
                                value={state.employment_category_id}
                                onChange={handleChange}
                                labelText={<Text largeLabel>Employment Category</Text>}
                                scrollTrue
                            />
                            <Text errorText> {error.employment_category_id ? error.employment_category_id : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={12}>
                        <Box p={2}>
                            {action !== 'update' ? (
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'ssn',
                                        value: state.showFullSSN ? state.ssn : maskedSSN,
                                        type: 'text',
                                    }}
                                    disabled={true}
                                    handleChange={handleChange}
                                    labelText={<Text largeLabel>SSN</Text>}
                                    eyeIcon={state.showFullSSN ? false : true}
                                    eyeCloseIcon={true}
                                    iconText
                                    eyeHandleChange={toggleVisibility}
                                // eyeHandleChange={action === 'update' ? toggleVisibility : ''}
                                />
                            ) : (
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'ssn',
                                        value: state.ssn,
                                        type: state.showFullSSN ? 'text' : 'password',
                                        inputProps: { maxLength: 11 }
                                    }}
                                    handleChange={handleChange}
                                    clientInput1
                                    iconText
                                    labelText={<Text largeLabel>SSN</Text>}
                                    eyeIcon={state.showFullSSN ? false : true}
                                    eyeCloseIcon={true}
                                    eyeHandleChange={toggleVisibility}
                                />
                            )}
                            <Text errorText> {error.ssn ? error.ssn : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <CustomSelect
                                label='Is The Employee USC?'
                                options={[{ id: 1, value: "Yes" }, { id: 0, value: "No" }]}
                                disabled={action === "update" ? false : true}
                                name='is_usc'
                                value={state.is_usc}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.is_usc ? error.is_usc : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <SearchSelect
                                options={reportingManagers}
                                disabled={action === "update" ? false : true}
                                name='reporting_manager_id'
                                value={state.reporting_manager_id}
                                onChange={handleChange}
                                labelText={<Text largeLabel>Reporting Manager</Text>}
                                scrollTrue
                            />
                            <Text errorText> {error.reporting_manager_id ? error.reporting_manager_id : ""}</Text>
                        </Box>
                    </Grid>
                    {
                        state.is_usc === 0 ?
                            <Grid lg={6} md={6} sm={12} xs={12}>
                                <Box p={2} >
                                    <SearchSelect
                                        options={visaTypeDropdown}
                                        disabled={action === "update" ? false : true}
                                        name='visa_type_id'
                                        value={state.visa_type_id}
                                        onChange={handleChange}
                                        labelText={<Text largeLabel>Visa Type</Text>}
                                        scrollTrue
                                    />
                                    <Text errorText> {error.visa_type_id ? error.visa_type_id : ""}</Text>
                                </Box>
                            </Grid> : null
                    }
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <CustomSelect
                                label='Department'
                                options={departmentsDropdown}
                                disabled={action === "update" ? false : true}
                                name='department_id'
                                value={state.department_id}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.department_id ? error.department_id : ""}</Text>
                        </Box>
                    </Grid>

                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2}>
                            <CustomSelect
                                label='Team'
                                options={teamDropdown}
                                disabled={action === "update" ? false : true}
                                name='team_id'
                                value={state.team_id}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.team_id ? error.team_id : ""}</Text>
                        </Box>
                    </Grid>
                    {
                        state.employment_type_id == 1 ?
                            <Grid lg={6} md={6} sm={6} xs={12}>
                                {
                                    action === "update" ?
                                        <Box p={2} >
                                            <SearchSelect
                                                options={rolesList}
                                                disabled={action === "update" ? false : true}
                                                name='role_id'
                                                value={state.role_id}
                                                onChange={handleChange}
                                                labelText={<Text largeLabel>Role</Text>}
                                                scrollTrue
                                            />
                                            <Text errorText> {error.role_id ? error.role_id : ""}</Text>
                                        </Box> :
                                        <Box p={2}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    value: rolesList.filter(e => e.id === state.role_id).length > 0 ? rolesList.filter(e => e.id === state.role_id)[0].value : "",
                                                    type: 'text',
                                                    disabled: action === "update" ? false : true
                                                }}
                                                clientInput
                                                labelText={<Text largeLabel>Role</Text>}
                                            />
                                        </Box>
                                }
                            </Grid> : null
                    }
                    {
                        state.employment_type_id == 3 &&
                        <Grid item container>
                            <Grid item lg={6}>
                                <Box p={2} >
                                    <SearchSelect
                                        name='vendor_id'
                                        value={state.vendor_id}
                                        options={vendorList}
                                        onChange={handleChange}
                                        labelText={<Text largeLabel>Vendor Name</Text>} />
                                    {error.vendor_id && <Text red>{error.vendor_id ? error.vendor_id : ''}</Text>}
                                </Box>
                            </Grid>
                            <Grid item lg={6}>
                                <Box p={2} >
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'vendor_price',
                                            value: state.vendor_price,
                                        }}
                                        handleChange={handleChange}
                                        clientInput
                                        labelText={<Text largeLabel>Vendoe Price/Hr</Text>} />
                                    {error.vendor_price && <Text red>{error.vendor_price ? error.vendor_price : ''}</Text>}
                                </Box>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Box>

            <Box mt={1} px={1} sx={{ width: "100%", display: "flex", justifyContent: "end", gap: 3 }}>
                {
                    action === "update" ?
                        <Button cancelBtn onClick={() => setAction("read")}>
                            Cancel
                        </Button> : null
                }
                {
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                        <LoadingButton saveLoader loading={loading} onClick={() => action === "update" ? handleSubmit() : setAction("update")}>
                            {
                                action === "update" ? "Save" : "Edit"
                            }
                        </LoadingButton> :
                        <LoadingButton saveLoaderDisable>
                            Edit
                        </LoadingButton>
                }
            </Box>

        </Box>
    );
}
