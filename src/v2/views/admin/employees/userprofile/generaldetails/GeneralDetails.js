import React, { useState, useEffect } from 'react';
import { Box, Grid, } from '@mui/material';
import Input from '../../../../../components/input/Input';
import Text from '../../../../../components/customText/Text';
import { empty_name, isValid, validate_charWithSpace, validate_emptyField, } from "../../../../../components/Validation";
import Button from '../../../../../components/customButton/Button';
import EmployeeAPI from '../../../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import LocalStorage from "../../../../../utils/LocalStorage";
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Datepicker from '../../../../../components/datePicker/Date';
import UserProfileStyles from '../UserProfileStyles';
import OffboardingProgress from './OffboardingProgress';
import OffboardApi from '../../../../../apis/admin/offboard/OffboardApi';

const genderOptions = [{
    id: "Male",
    value: "Male"
},
{
    id: "Female",
    value: 'Female'
}];
const MaritalStatusOptions = [{
    id: "Single",
    value: "Single"
},
{
    id: "Married",
    value: 'Married'
}];
const BloodGroupOptions = [
    {
        id: "B+",
        value: "B+"
    },
    {
        id: "B-",
        value: "B-"
    },
    {
        id: "A+",
        value: "A+"
    },
    {
        id: "A-",
        value: "A-"
    },
    {
        id: "AB+",
        value: "AB+"
    },
    {
        id: "AB-",
        value: "AB-"
    },
    {
        id: "O+",
        value: "O+"
    },
    {
        id: "O-",
        value: "O-"
    },

];

export default function GeneralDetails(props) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const { reference_id } = props.data2;
    // eslint-disable-next-line
    const { offBoardButton, progress, avatar_url, active, grButn, getData, id, fullName, loading, setLoading } = props

    const classes = UserProfileStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const [get, setGet] = useState({})
    const [action, setAction] = useState("read");
    const [state, setState] = useState({
        id: '',
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: "",
        gender: "",
        blood_group: "",
        marital_status: "",
    });
    // eslint-disable-next-line
    const [active1, setActive1] = useState(0)
    const [active2, setActive2] = useState(0)
    const [active3, setActive3] = useState(0)
    const [active4, setActive4] = useState(0)
    // const [percentValue, setPercentValue] = useState(progress)
    const [error, setError] = useState({});
    const [popUpOpen, setPopUpOpen] = useState(false);
    const [initialState, setInitialState] = useState({});
    useEffect(() => {

    }, [initialState]);
    useEffect(() => {
        // console.log(props.data.basic_details,'props xxxx')

        let newData = props.data.basic_details
        getOffBoardCheckList(props.data.id)
        setState({...newData});
        setInitialState(newData)
        // eslint-disable-next-line
    }, [props]);



    const getOffBoardCheckList = (args) => {
        OffboardApi.getOffBoardCheckList(args).then((response) => {
            if (response.data.statusCode == 1003) {
                setTimeout(() => {
                    setGet({ ...response.data.data[0] })
                }, 400)
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
        handleValidations(e);
    };

    const handleCancel = () => {
        setAction("read");
        setError({});
        setState(initialState);
    }

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "first_name":
                error.first_name = validate_charWithSpace(input.value, 'first ');
                break;
            case "middle_name":
                error.middle_name = empty_name(input.value, 'middle ');
                break;
            case "last_name":
                error.last_name = validate_charWithSpace(input.value, 'last ');
                break;
            case "dob":
                err.dob = validate_emptyField(input.value);
                break;
            case "gender":
                err.gender = validate_emptyField(input.value);
                break;
            case "blood_group":
                err.blood_group = validate_emptyField(input.value);
                break;
            case "marital_status":
                err.marital_status = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const validateAll = () => {
        let { first_name, last_name, dob, gender, marital_status, } = state;
        let errors = {};
        errors.first_name = validate_emptyField(first_name);
        errors.last_name = validate_emptyField(last_name);
        errors.dob = validate_emptyField(dob);
        errors.gender = validate_emptyField(gender);
        errors.marital_status = validate_emptyField(marital_status);
        return errors;

    };
    // eslint-disable-next-line
    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            updateEmployeeGeneralDetails();
        } else {
            setError(errors);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const updateEmployeeGeneralDetails = () => {
        let data = { ...state, request_id: LocalStorage.uid() };
        setLoading(true)
        EmployeeAPI.updateEmployeeGeneralDetails(data, location.state.id).then((response) => {
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
    const handleStart = (args) => {
        if (args == 1) {
            const all = { fullName, reference_id, avatar_url, id, args, }
            setActive1(args)
            navigate(`/employees/user-profile/${fullName === "" ? "" : fullName.trim().split(/ +/).join('-')}/offboarding`, { state: all })
        }
        if (args == 2) {
            const all = { fullName, reference_id, avatar_url, id, args, getData }
            setActive2(args)
            navigate(`/employees/user-profile/${fullName === "" ? "" : fullName.trim().split(/ +/).join('-')}/offboarding`, { state: all })

        } if (args == 3) {
            const all = { fullName, reference_id, avatar_url, id, args, getData }
            setActive3(args)
            navigate(`/employees/user-profile/${fullName === "" ? "" : fullName.trim().split(/ +/).join('-')}/offboarding`, { state: all })
        } if (args == 4) {
            const all = { fullName, reference_id, avatar_url, id, args, getData }
            setActive4(args)
            navigate(`/employees/user-profile/${fullName === "" ? "" : fullName.trim().split(/ +/).join('-')}/offboarding`, { state: all })

        }
    }
    const percentage = progress;
    return (
        <Box py={1}>
            <Box sx={{ minHeight: "53vh", }} >
                <Grid container spacing={0}>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'first_name',
                                    value: state.first_name,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>First Name</Text>}
                            />
                            <Text errorText> {error.first_name ? error.first_name : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'middle_name',
                                    value: state.middle_name,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Middle Name <span className={classes.optional}>(Optional)</span></Text>}
                            />
                            <Text errorText> {error.middle_name ? error.middle_name : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'last_name',
                                    value: state.last_name,
                                    type: 'text',
                                    disabled: action === "update" ? false : true
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel>Last Name</Text>}
                            />
                            <Text errorText> {error.last_name ? error.last_name : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2}>
                            <Datepicker
                                labelText={"Date of Birth"}
                                name={"dob"}
                                value={state.dob}
                                onChange={handleChange}
                                disabled={action === "update" ? false : true}
                            />

                            <Text errorText> {error.dob ? error.dob : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2} >
                            <CustomSelect
                                label={<Text largeLabel>Gender</Text>}
                                options={genderOptions}
                                disabled={action === "update" ? false : true}
                                name='gender'
                                value={state.gender}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.gender ? error.gender : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2}>
                            <CustomSelect
                                label={<Text largeLabel>Blood Group<span className={classes.optional}>(Optional)</span></Text>}
                                options={BloodGroupOptions}
                                disabled={action === "update" ? false : true}
                                name='blood_group'
                                value={state.blood_group}
                                onChange={handleChange}
                                commonSelect
                            />
                        </Box>
                    </Grid>
                    <Grid lg={6} md={6} sm={12} xs={12}>
                        <Box p={2}>
                            <CustomSelect
                                label='Marital Status'
                                options={MaritalStatusOptions}
                                disabled={action === "update" ? false : true}
                                name='marital_status'
                                value={state.marital_status}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.marital_status ? error.marital_status : ""}</Text>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box mt={1} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                {
                    action === "update" ?
                        <Button cancelBtn onClick={() => handleCancel()}>
                            Cancel
                        </Button> : null
                }
                {progress == 0 || get.off_boarding_percentage == 25 || get.off_boarding_percentage == 50 || get.off_boarding_percentage == 75 ?
                    <Button offBoardButton onClick={() => setPopUpOpen(true)}>Off Boarding | {get.off_boarding_percentage ? get.off_boarding_percentage : progress}%</Button>
                    :
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_edit" && item.is_allowed == true))) ?
                        <LoadingButton saveLoader loading={loading} onClick={() => action === "update" ? handleSubmit() : setAction("update")}>
                            {
                                action === "update" ? "Save" : "Edit"
                            }
                        </LoadingButton> :
                        <LoadingButton saveLoaderDisable>
                            Edit
                        </LoadingButton>}

            </Box>
            <OffboardingProgress handleStart={handleStart}
                active={active} active1={active1} active2={active2} active3={active3} active4={active4} percentage={percentage} setPopUpOpen={setPopUpOpen} popUpOpen={popUpOpen} grButn={grButn} get={get} progress={progress} />
        </Box>
    );
}