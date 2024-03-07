import React, { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Grid, Stack, Skeleton } from '@mui/material';
// import Browse from '../../../../../assets/svg/Browse.svg';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { isValid, validate_charWithSpace, validate_emptyField, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
// import CommonApi from '../../../../../apis/CommonApi';
import { useLocation } from 'react-router-dom';
import { BlackToolTip, addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AccordionList from '../AccordionList';
import VacationSvg from "../../../../../assets/svg/VacationSvg.svg";
// import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";
import NoDataImg from "../../../../../assets/images/no-data.png";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Datepicker from '../../../../../components/datePicker/Date';
import { dateFormat } from '../../../../../utils/utils';
import moment from "moment";
import disablePlus from '../../../../../assets/client/disablePlus.svg';

export default function EducationDocs() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const [form, setForm] = useState(false);
    const [editdeleteId, setEditdeleteId] = useState(null)
    const [list, setList] = useState([]);
    const [state, setState] = useState(
        {
            name: "",
            from_date: "",
            to_date: "",
            do_not_disturb: "",
            preferred_from_time: "",
            preferred_to_time: "",
            time_zone: ""
        }
    );
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(loading);
        getVacation();
        // eslint-disable-next-line
    }, []);

    const getVacation = () => {
        setLoading(true)
        EmployeeAPI.getVacation(location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setList(response.data.data);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleChange = (e) => {
        if (e.target.name === "do_not_disturb") {
            setState({ ...state, [e.target.name]: e.target.value, preferred_from_time: "", preferred_to_time: "", time_zone: "" });
        } else {
            setState({ ...state, [e.target.name]: e.target.value });
        }


        handleValidations(e.target);
    };

    const handleChangeDate = (e, name) => {
        let data = { name: name, value: moment(e.$d).format(dateFormat()) }
        setState({ ...state, [data.name]: data.value })
        handleValidations(data);
    };


    const handleValidations = (input) => {
        // let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "name":
                err.name = validate_charWithSpace(input.value);
                break;
            case "from_date":
                err.from_date = validate_emptyField(input.value);
                break;
            case "to_date":
                err.to_date = validate_emptyField(input.value);
                break;
            case "do_not_disturb":
                err.do_not_disturb = validate_emptyField(input.value);
                break;
            case "preferred_from_time":
                if (state.do_not_disturb === 1) {
                    err.preferred_from_time = validate_emptyField(input.value);
                }
                break;
            case "preferred_to_time":
                if (state.do_not_disturb === 1) {
                    err.preferred_to_time = validate_emptyField(input.value);
                }
                break;
            case "time_zone":
                if (state.do_not_disturb === 1) {
                    err.time_zone = validate_emptyField(input.value);
                }
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let {
            name,
            from_date,
            to_date,
            do_not_disturb,
            preferred_from_time,
            preferred_to_time,
            time_zone
        } = state;
        let errors = {};
        errors.name = validate_emptyField(name);
        errors.from_date = validate_emptyField(from_date);
        errors.to_date = validate_emptyField(to_date);
        errors.do_not_disturb = validate_emptyField(do_not_disturb);
        if (do_not_disturb === 1) {
            errors.preferred_from_time = validate_emptyField(preferred_from_time);
            errors.preferred_to_time = validate_emptyField(preferred_to_time);
            errors.time_zone = validate_emptyField(time_zone);
        }
        return errors;
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (form === "add") {
                storeVacation()
            } else if (form === "update") {
                updateVacation();
            }
            // console.log("succeee");
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const storeVacation = () => {
        let data = { ...state, request_id: LocalStorage.uid(), employee_id: location.state.id };
        // let data = { ...state, education_level_id: 1, state_id: 1, country_id: 1, request_id: LocalStorage.uid(), employee_id: location.state.id };

        console.log(data, "  Store data");

        // return false;

        setLoading(true)
        EmployeeAPI.storeVacation(data, location.state.id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message)
                    getVacation()
                    setForm(false);
                    setEditdeleteId(null)

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateVacation = () => {
        let data = { ...state, employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateVacation(data, editdeleteId).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getVacation();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const deleteVacation = (id) => {
        let data = { employee_id: location.state.id, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.deleteVacation(data, id).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    getVacation();
                    setForm(false);
                    setEditdeleteId(null)
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleUpdate = (key) => {
        let data = list[key];
        let updateData = {
            name: data.name,
            from_date: data.from_date,
            to_date: data.to_date,
            do_not_disturb: data.do_not_disturb,
            preferred_from_time: data.preferred_from_time,
            preferred_to_time: data.preferred_to_time,
            time_zone: data.time_zone
        }
        setError({})
        setForm("update");
        setEditdeleteId(data.id);
        setState(updateData);
    }

    const handleChangeTime = (e) => {
        // setIsEditing(true)
        // if (e.target.name == "default_hours") {
        let input = e.target.value.replace(/\D/g, "").substring(0, 5);
        const first = input.substring(0, 2);
        const second = input.substring(2, 5);
        if (input.length > 2) {
            setState({ ...state, [e.target.name]: `${first}:${second}` });
        } else {
            setState({ ...state, [e.target.name]: input });
        }

        if (input.length > 2) {
            var mm = parseInt(second);
            if (mm > 59) {
                if (first < 23) {
                    var sec = second - 60;
                    var fOne = parseInt(first) + 1;
                    setState({ ...state, [e.target.name]: `0${fOne}:${sec}` });
                    handleValidations(e.target);
                } else {
                    setState({ ...state, [e.target.name]: `${first}:${59}` });
                    handleValidations(e.target);
                }
            } else {
                setState({ ...state, [e.target.name]: `${first}:${second}` });
                handleValidations(e.target);
            }
        } else if (input.length >= 0) {
            var hh = parseInt(input);
            if (hh > 23) {
                state[e.target.name] = "23";
            } else {
                state[e.target.name] = input;
            }
            setState({ ...state });
            handleValidations(e.target);
        }
    };

    const openAddForm = () => {
        let obj = {
            name: "",
            from_date: "",
            to_date: "",
            do_not_disturb: "",
            preferred_from_time: "",
            preferred_to_time: "",
            time_zone: ""
        };
        setState(obj)
        setError({})
        setForm("add")
    }


    return (
        <Box>
            <Box py={2} px={1}>

                <Box my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                    <Typography sx={{ margin: '0px 0px 0px 10px', fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", color: `${false ? "rgba(115, 115, 115, 1)" : "rgba(38, 38, 38, 1)"}` }}>
                        Vacation History
                    </Typography>
                    {
                        !["add", "update"].includes(form) ?
                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
                                <Box display={"flex"} justifyContent={"end"}>
                                    <Button addNew startIcon={<Plus />} onClick={() => openAddForm()}>Add New</Button>
                                </Box> :
                                <Box display={"flex"} justifyContent={"end"}>
                                    <Button addNewDisable startIcon={<img src={disablePlus} alt='' />}>Add New</Button>
                                </Box> : null
                    }
                </Box>

                {
                    ["add", "update"].includes(form) ? (
                        <Fragment>
                            <Box sx={{ minHeight: "54vh", }}>
                                <Grid container spacing={0}>
                                    <Grid lg={12} md={12} sm={12} xs={12}>
                                        <Box p={2}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'name',
                                                    value: state.name,
                                                    type: 'text'
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Vacation Name</Text>}
                                            />
                                            <Text errorText> {error.name ? error.name : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={6} xs={12}>
                                        <Box p={2}>

                                            <Datepicker
                                                labelText={"From Date"}
                                                name={"from_date"}
                                                value={state.from_date}
                                                onChange={(e) => handleChangeDate(e, "from_date")}
                                            />
                                            <Text errorText> {error.from_date ? error.from_date : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={3} md={3} sm={6} xs={12}>
                                        <Box p={2} >
                                            <Datepicker
                                                labelText={"To Date"}
                                                name={"to_date"}
                                                value={state.to_date}
                                                minDate={state.from_date}
                                                onChange={(e) => handleChangeDate(e, "to_date")}
                                            />


                                            <Text errorText> {error.to_date ? error.to_date : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12}>

                                        <Box p={2}>
                                            <CustomSelect
                                                label='Do Not Disturb'
                                                options={[
                                                    { id: 1, name: "No" },
                                                    { id: 2, name: "Yes" },
                                                    { id: 3, name: "Emergency" },
                                                ]}
                                                name='do_not_disturb'
                                                value={state.do_not_disturb}
                                                onChange={handleChange}
                                                commonSelect
                                            />

                                            <Text errorText> {error.do_not_disturb ? error.do_not_disturb : ""}</Text>
                                        </Box>
                                    </Grid>

                                    {
                                        state.do_not_disturb === 1 ?
                                            <Fragment>
                                                <Grid lg={6} md={6} sm={12} xs={12}>
                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'preferred_from_time',
                                                                value: state.preferred_from_time,
                                                                type: 'text'
                                                            }}
                                                            handleChange={handleChangeTime}
                                                            clientInput
                                                            labelText={<Text largeLabel>Preferred From Time</Text>}
                                                        />
                                                        <Text errorText> {error.preferred_from_time ? error.preferred_from_time : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>

                                                    <Box p={2}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'preferred_to_time',
                                                                value: state.preferred_to_time,
                                                                type: 'text'
                                                            }}
                                                            handleChange={handleChangeTime}
                                                            clientInput
                                                            labelText={<Text largeLabel>Preferred To Time</Text>}
                                                        />
                                                        <Text errorText> {error.preferred_to_time ? error.preferred_to_time : ""}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid lg={6} md={6} sm={12} xs={12}>

                                                    <Box p={2} >

                                                        <CustomSelect
                                                            label='Time Zone'
                                                            options={[
                                                                { id: "IST", name: "IST" },
                                                                { id: "EST", name: "EST" },
                                                                { id: "PST", name: "PST" },
                                                            ]}
                                                            name='time_zone'
                                                            value={state.time_zone}
                                                            onChange={handleChange}
                                                            commonSelect
                                                        />
                                                        <Text errorText> {error.time_zone ? error.time_zone : ""}</Text>
                                                    </Box>
                                                </Grid></Fragment> : null
                                    }
                                </Grid>
                            </Box>

                            <Box my={2} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                                {
                                    ["add", "update"].includes(form) ?
                                        <Button cancelBtn onClick={() => setForm(false)}>
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
                                    list.map((item, key) => (
                                        <AccordionList
                                            key={key}
                                            serial_no={key + 1}
                                            accordionSummary={

                                                <Box sx={{ width: "100%" }}>
                                                    <Grid container spacing={0}>
                                                        <Grid item lg={4} md={4} sm={6} xs={12}>
                                                            <Box display={'flex'} alignItems={'center'} >
                                                                <img src={VacationSvg} alt="passport" />
                                                                <Typography mx={2} sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "700", color: "#092333" }}>
                                                                    {item.name}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={4} md={4} sm={6} xs={12}>
                                                            <Box>
                                                                <Typography
                                                                    sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                                >
                                                                    {`From - ${item.from_date}`}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={4} md={4} sm={6} xs={12}>

                                                            <Box>
                                                                <Typography
                                                                    sx={{ fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignItems: "center", alignSelf: "center", fontWeight: "400", color: "#092333" }}
                                                                >
                                                                    {`To - ${item.to_date}`}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            }
                                            accordionDetails={

                                                <Box py={2} px={4} sx={{
                                                    backgroundColor: "#F9FCFF",
                                                    minHeight: "80px",
                                                    borderRadius: "10px",
                                                }}>

                                                    <Grid p={1} container spacing={0}>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                    }}
                                                                >
                                                                    Vacation Name
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                    }}
                                                                >
                                                                    From
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                    }}
                                                                >
                                                                    {item.from_date}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                    }}
                                                                >
                                                                    To
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                    }}
                                                                >
                                                                    {item.to_date}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box py={1} sx={{ width: "100%" }} >
                                                                <Stack direction={'row'} spacing={2} justifyContent={'end'}>
                                                                    {
                                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                                                                            <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} /> :
                                                                            <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                                <img src={EditSvg} alt="edit" style={{ cursor: "default" }} />
                                                                            </BlackToolTip>
                                                                    }
                                                                    {
                                                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_delete" && item.is_allowed == true))) ?
                                                                            <img src={DeleteSvg} alt="delete" onClick={() => deleteVacation(item.id)} style={{ cursor: "pointer" }} /> :
                                                                            <BlackToolTip arrow placement='top' title={<Text smallWhite>You don't have permission to perform this action. Please contact the admin</Text>}>
                                                                                <img src={DeleteSvg} alt="delete" style={{ cursor: "default" }} />
                                                                            </BlackToolTip>
                                                                    }
                                                                </Stack>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid p={1} container spacing={0}>
                                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                                            <Box sx={{ width: "100%" }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "500",
                                                                        color: "#849199",
                                                                    }}
                                                                >
                                                                    DND
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        color: "092333",
                                                                    }}
                                                                >
                                                                    {item.do_not_disturb === 1 ? "No" : null}
                                                                    {item.do_not_disturb === 2 ? "Yes" : null}
                                                                    {item.do_not_disturb === 3 ? "Emergency" : null}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>

                                                        {item.do_not_disturb === 1 ?
                                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                                <Box sx={{ width: "100%" }}>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "500",
                                                                            color: "#849199",
                                                                        }}
                                                                    >
                                                                        Preferred From Time
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "092333",
                                                                        }}
                                                                    >
                                                                        {item.preferred_from_time}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid> : null}

                                                        {item.do_not_disturb === 1 ?
                                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                                <Box sx={{ width: "100%" }}>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "500",
                                                                            color: "#849199",
                                                                        }}
                                                                    >
                                                                        Preferred To Time
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "092333",
                                                                        }}
                                                                    >
                                                                        {item.preferred_to_time}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid> : null}

                                                        {item.do_not_disturb === 1 ?
                                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                                <Box sx={{ width: "100%" }}>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "500",
                                                                            color: "#849199",
                                                                        }}
                                                                    >
                                                                        Time Zone
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontFamily: "Nunito , Nunito Sans, sans-serif",
                                                                            fontWeight: "600",
                                                                            color: "092333",
                                                                        }}
                                                                    >
                                                                        {item.time_zone}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid> : null}
                                                    </Grid>



                                                </Box>

                                            }
                                        />
                                    ))
                                }
                                {
                                    !loading && list.length === 0 ?
                                        <Box sx={{ height: "55vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        </Box >
    );
}