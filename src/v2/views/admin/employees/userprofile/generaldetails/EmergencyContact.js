import React, { useState, useEffect, Fragment } from 'react';
// import { Box, Grid, Typography, Skeleton } from '@mui/material';
import { Box, Typography, Grid, Stack, Skeleton, } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { empty_Email_id, isValid, validateAplaSpecialChar, validate_charWithSpace, validate_emptyField, validate_usContact, validate_zipcode, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import AccordionList from '../AccordionList';
// import Browse from "../../../../../assets/svg/Browse.svg";
import EmergencyContactSvg from "../../../../../assets/svg/user2.svg";
// import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import NoDataImg from "../../../../../assets/images/no-data.png";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CommonApi from '../../../../../apis/CommonApi';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import SearchSelect from '../../../../../components/selectField/SearchSelect';
import disablePlus from '../../../../../assets/client/disablePlus.svg';

export default function EmergencyContact(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null);
    const [list, setList] = useState([]);
    const [formData, setFormData] = useState(
        {
            id: "",
            relationship_id: "",
            name: "",
            email_id: "",
            contact_number: "",
            address_1: "",
            city: "",
            zip_code: "",
            state_id: "",
            country_id: ""
        }
    )
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [countriesList, setCountriesList] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [relationshipDropdown, setRelationshipDropdown] = useState([]);

    useEffect(() => {
        getCountriesList();
        getRelationshipDropdown();
        setList(props.data !== null && props.data.length > 0 ? props.data : '')
        // eslint-disable-next-line
    }, [props]);


    const getCountriesList = () => {
        let search = "";
        CommonApi.getCountryList(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setCountriesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getStatesList = (country_id) => {
        CommonApi.getStatesList(country_id).then((response) => {
            if (response.data.statusCode == 1003) {
                setStatesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }


    const getRelationshipDropdown = () => {
        let search = "";
        CommonApi.getRelationshipDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setRelationshipDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }


    const contactNumberConvert = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const input = value.replace(/\D/g, "").substring(0, 10);

        // Divide numbers in 3 parts :"(123) 456-7890"
        const first =
            name == "contact_number" || name == "mobile_number"
                ? input.substring(0, 3)
                : input.substring(0, 3);
        const middle =
            name == "contact_number" || name == "mobile_number"
                ? input.substring(3, 6)
                : input.substring(3, 5);
        const last =
            name == "contact_number" || name == "mobile_number"
                ? input.substring(6, 10)
                : input.substring(5, 9);

        if (
            input.length >
            (name == "contact_number" || name == "mobile_number" ? 6 : 5)
        ) {
            return `${first}-${middle}-${last}`;
        } else if (input.length > 3) {
            return `${first}-${middle}`;
        } else if (input.length >= 0) {
            return input;
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "contact_number") {
            let number = contactNumberConvert(e);
            setFormData({ ...formData, [e.target.name]: number })
        } else if (e.target.name === "country_id") {
            getStatesList(e.target.value);
            setFormData({ ...formData, [e.target.name]: e.target.value, state_id: '' })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        handleValidations(e);
    };

    const handleCancel = () => {
        setForm(false)
        setError({});
        setList(props.data)
    }

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "relationship_id":
                err.relationship_id = validate_emptyField(input.value);
                break;
            case "name":
                err.name = validate_charWithSpace(input.value);
                break;
            case "email_id":
                err.email_id = empty_Email_id(input.value);
                break;
            case "contact_number":
                err.contact_number = validate_usContact(input.value);
                break;
            case "address_1":
                err.address_1 = validate_emptyField(input.value);
                break;
            case "city":
                err.city = validateAplaSpecialChar(input.value);
                break;
            case "zip_code":
                err.zip_code = formData.country_id == 101 ? validate_zipcode(input.value,101) : validate_zipcode(input.value);
                break;
            case "state_id":
                err.state_id = validate_emptyField(input.value);
                break;
            case "country_id":
                err.country_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let {
            relationship_id,
            name,
            // email_id,
            contact_number,
            address_1,
            city,
            zip_code,
            state_id,
            country_id
        } = formData;
        let errors = {};
        errors.relationship_id = validate_emptyField(relationship_id);
        errors.name = validate_emptyField(name);
        errors.contact_number = validate_emptyField(contact_number);
        errors.address_1 = validate_emptyField(address_1);
        errors.city = validate_emptyField(city);
        errors.zip_code = formData.country_id == 101 ? validate_zipcode(zip_code,101) : validate_zipcode(zip_code);
        errors.state_id = validate_emptyField(state_id);
        errors.country_id = validate_emptyField(country_id);
        // errors.email_id = validate_emptyField(email_id);
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (form === "add") {
                storeEmployeeEducation()
            } else if (form === "update") {
                updateEmployeeEducation();
            }
            // console.log("succeee");
        } else {
            setError(errors);
        }
    }

    const storeEmployeeEducation = () => {
        let data = {
            request_id: LocalStorage.uid(),
            employee_id: location.state.id,
            emergency_contact: [formData]
        };
        setLoading(true)
        EmployeeAPI.storeEmployeeEmergencyContact(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    setForm(false);
                    setEditdeleteId(null)
                    props.getIndex();
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateEmployeeEducation = () => {
        let emergencyContactArr = list;
        emergencyContactArr[list.findIndex(p => p.id == editdeleteId)] = formData;
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid(), emergency_contact: emergencyContactArr };
        setLoading(true)
        EmployeeAPI.updateEmployeeEmergencyContact(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                    props.getIndex();
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const deleteEmployeeEmergencyContact = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteEmployeeEmergencyContact(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setForm(false);
                    setEditdeleteId(null);
                    addSuccessMsg(response.data.message);
                    props.getIndex();
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleUpdate = (key) => {
        let data = list[key];
        let updateData = {
            id: data.id,
            relationship_id: data.relationship_id,
            name: data.name,
            email_id: data.email_id,
            contact_number: data.contact_number,
            address_1: data.address_1,
            city: data.city,
            zip_code: data.zip_code,
            state_id: data.state_id,
            country_id: data.country_id
        }

        if (data.country_id !== "") {
            getStatesList(data.country_id)
        }

        setForm("update");
        setEditdeleteId(data.id);
        setFormData(updateData);
    }

    const openAddForm = () => {
        setFormData(
            {
                id: "",
                relationship_id: "",
                name: "",
                email_id: "",
                contact_number: "",
                address_1: "",
                city: "",
                zip_code: "",
                state_id: "",
                country_id: ""
            }
        );
        setError({})
        setForm("add");
    }


    return (
        <Box py={1}>

            {
                !["add", "update"].includes(form) ?
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
                        <Box my={2} display={"flex"} justifyContent={"end"}>
                            <Button addNew startIcon={<Plus />} onClick={() => openAddForm()}>Add New</Button>
                        </Box> :
                        <Box my={2} display={"flex"} justifyContent={"end"}>
                            <Button addNewDisable startIcon={<img src={disablePlus} alt='' />}>Add New</Button>
                        </Box>
                    : null
            }

            {
                ["add", "update"].includes(form) ? (
                    <Fragment>


                        <Box sx={{ height: "53vh", overflow: "auto" }}>
                            <Grid container spacing={0}>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <CustomSelect
                                            label='Relationship'
                                            options={relationshipDropdown}
                                            name='relationship_id'
                                            value={formData.relationship_id}
                                            onChange={handleChange}
                                            commonSelect
                                        />

                                        <Text errorText> {error.relationship_id ? error.relationship_id : ""}</Text>
                                    </Box>

                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'name',
                                                value: formData.name,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Name</Text>}
                                        />
                                        <Text errorText> {error.name ? error.name : ""} </Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'email_id',
                                                value: formData.email_id,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Email id</Text>}
                                        />
                                        <Text errorText> {error.email_id ? error.email_id : ""}</Text>
                                    </Box>
                                </Grid>

                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'contact_number',
                                                value: formData.contact_number,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Contact Number</Text>}
                                        />
                                        <Text errorText> {error.contact_number ? error.contact_number : ""}</Text>
                                    </Box>
                                </Grid>

                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'address_1',
                                                value: formData.address_1,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Address</Text>}
                                        />
                                        <Text errorText> {error.address_1 ? error.address_1 : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2} >
                                        <SearchSelect
                                            name='country_id'
                                            value={formData.country_id}
                                            onChange={handleChange}
                                            options={countriesList}
                                            labelText={<Text largeLabel>Country</Text>}
                                            scrollTrue
                                        />
                                        <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <SearchSelect
                                            options={statesList}
                                            name='state_id'
                                            value={formData.state_id}
                                            onChange={handleChange}
                                            labelText={<Text largeLabel>State</Text>}
                                            scrollTrue
                                        />
                                        <Text errorText> {error.state_id ? error.state_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'city',
                                                value: formData.city,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>City</Text>}
                                        />
                                        <Text errorText> {error.city ? error.city : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid lg={6} md={6} sm={6} xs={12}>
                                    <Box p={2}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'zip_code',
                                                value: formData.zip_code,
                                                type: 'text'
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Zipcode</Text>}
                                        />
                                        <Text errorText> {error.zip_code ? error.zip_code : ""}</Text>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mt={1} px={1} sx={{ backgroundColor: "#FFFFFF", width: "100%", display: 'flex', justifyContent: "end", gap: 3 }}>
                            {
                                ["add", "update"].includes(form) ?
                                    <Button cancelBtn onClick={() => handleCancel()}>
                                        Cancel
                                    </Button> : null
                            }
                            <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                {
                                    form === "update" ? "Update" : form === "add" ? "Save" : null
                                }
                            </LoadingButton>
                        </Box>
                    </Fragment>
                ) :

                    (
                        <Fragment>

                            {
                                loading ?
                                    [1, 2, 3].map((item, key) => (
                                        <AccordionList
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
                                    )) : ''
                            }

                            {
                                !loading &&
                                list.length > 0 && list.map((item, key) => (
                                    <AccordionList
                                        key={key}
                                        accordionSummary={
                                            <Box
                                                sx={{ width: "100%" }}
                                                display={"flex"}
                                                // justifyContent={"space-between"}
                                                alignItems={"center"}
                                            >
                                                <Box display={'flex'} alignItems={'center'} width={"100%"} >
                                                    <img src={EmergencyContactSvg} alt="passport" />
                                                    <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>{item.name}</Typography>
                                                </Box>
                                                <Box width={"100%"}>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                    >
                                                        {item.contact_number}
                                                    </Typography>
                                                </Box>
                                                <Box width={"100%"}>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                    >
                                                        {item.country_name}
                                                    </Typography>
                                                </Box>
                                                <Box width={"100%"}>
                                                    <Typography
                                                        sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                    >
                                                        {item.city}
                                                    </Typography>
                                                </Box>

                                                {/* <Box mr={4} display={'flex'} alignItems={'center'}><img src={DownloadSvg} alt="download" /></Box> */}
                                            </Box>
                                        }
                                        accordionDetails={
                                            <Box
                                                sx={{
                                                    backgroundColor: "#F5F6F6",
                                                    height: "80px",
                                                    borderRadius: "10px",
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "space-around",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        Email Id
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "600",
                                                            color: "092333",
                                                        }}
                                                    >
                                                        {item.email_id === "" ? "--" : item.email_id}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        Relationship
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "600",
                                                            color: "092333",
                                                        }}
                                                    >
                                                        {item.relationship_name === "" ? "--" : item.relationship_name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        State
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "600",
                                                            color: "092333",
                                                        }}
                                                    >
                                                        {item.state_name === "" ? "--" : item.state_name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "500",
                                                            color: "#849199",
                                                        }}
                                                    >
                                                        Country
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            textAlign: "center",
                                                            fontSize: "14px",
                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                            fontWeight: "600",
                                                            color: "092333",
                                                        }}
                                                    >
                                                        {item.country_name === "" ? "--" : item.country_name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ width: "100%" }} >
                                                    <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                                        {
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                                                                <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} /> :
                                                                <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                    <img src={EditSvg} alt="edit" style={{ cursor: "default" }} />
                                                                </BlackToolTip>
                                                        }
                                                        {
                                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_delete" && item.is_allowed == true))) ?
                                                                <img src={DeleteSvg} alt="delete" onClick={() => deleteEmployeeEmergencyContact(item.id)} style={{ cursor: "pointer" }} /> :
                                                                <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                    <img src={DeleteSvg} alt="delete" style={{ cursor: "default" }} />
                                                                </BlackToolTip>
                                                        }
                                                    </Stack>
                                                </Box>
                                            </Box>

                                        }
                                    />
                                ))
                            }

                            {
                                !loading && list.length === 0 ?
                                    <Box sx={{ height: "45vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box>
                                            <img src={NoDataImg} alt='no-data' />
                                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                                <Typography sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "600", color: "#092333" }}>
                                                    No Data Found
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box> : null
                            }

                        </Fragment>
                    )}

        </Box>
    );
}