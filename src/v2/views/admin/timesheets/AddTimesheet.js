import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography, Breadcrumbs, Avatar, DialogContent, IconButton, SwipeableDrawer, Divider, Stepper, Step, StepLabel, StepContent, Stack, } from "@mui/material";
// import { Box, Grid, Typography, Breadcrumbs, Avatar, DialogContent } from "@mui/material";
// import { Link, useLocation, } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TimesheetStyles from './TimesheetStyles';
import SearchSelect from '../../../components/selectField/SearchSelect';
import Text from '../../../components/customText/Text';
import Datepicker from '../../../components/datePicker/Date';
import FileInput from '../../../components/muiFileInput/FileInput';
import Input from '../../../components/input/Input';
import TimesheetTable from './TimesheetTable';
import { dateFormat } from '../../../utils/utils';
import moment from "moment";
import Component87 from '../../../assets/svg/Component87.svg';
import TimesheetApi from '../../../apis/admin/timesheets/TimesheetApi';
import CommonApi from "../../../apis/CommonApi";
import LocalStorage from '../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../utils/utils';
import CustomButton from "../../../components/customButton/Button";
import LoadingButton from '../../../components/customButton/LoadingButton';
import { isValid, validate_emptyField } from "../../../components/Validation";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import RejectForm from './RejectForm';
import { styled } from "@mui/material/styles";
import Approved from "../../../assets/timeSheets/Approved.svg";
import crossIcon from '../../../../v2/assets/svg/crossIcon.svg';
import Reject from "../../../assets/timeSheets/Rejected.svg";
import { ReactComponent as Clock } from '../../../assets/svg/clock.svg'
// import Reject from "../../../assets/timeSheets/Rejected.svg";
import Button from "../../../components/customButton/Button";
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import { ReactComponent as Tick } from '../../../assets/svg/tickActivity.svg'
// var today = moment().format(dateFormat());

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 415px;
    font-family: 'Nunito', Nunito Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
   
    border: 2px solid #C7CCD3;
    &:focus-visible {
        outline: 0;
      }
  `,
);

export default function AddTimesheet() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} timeout={500} />;
    });
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
            width: show == 1 || show == 3 || show == 4 || show == 5 ? "400px" : "500px"
        },
        "& .MuiDialogContent-root": {
            // padding: theme.spacing(2)
            // padding: theme.spacing(3)
        },
        "& .MuiDialogActions-root": {
            // padding: theme.spacing(1)
            // padding: theme.spacing(5)
        }
    }));



    const classes = TimesheetStyles();
    const location = useLocation();
    // const { action, id } = location.state;
    const navigate = useNavigate();
    const [show, setShow] = useState("");
    const [error, setError] = useState({});
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [clientsDropdown, setClientsDropdown] = useState([]);
    const [edit, setEdit] = useState(true)
    const [invoiceReadyEdit, setinvoiceReadyEdit] = useState(false)
    // const [endclientsDropdown, setEndclientsDropdown] = useState([]);
    // const [rejectComment, setRejectComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const [formData, setFormData] = useState(
        {
            employee_id: "",
            client_id: "",
            placement_id: "",
            end_client_id: "",
            start_date: "",
            end_date: "",
            comments: "",
            total_billable_hours: "",
            total_hours: "",
            total_ot_hours: "",
            timesheet: [],
            documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: "",
                }
            ]
        }
    );

    const [placementsList, setPlacementsList] = useState([]);

    const [tableHours, setTableHours] = useState([]);

    const [popUpOpen, setPopUpOpen] = useState(false);
    const [drawer, setDrawer] = useState(false);

    // const rejectText = React.useRef('');

    useEffect(() => {
        getEmployeesDropdown();
        getClientsDropdown();
        getActivity(activityFilter)
        // getEndClientsDropdown();
        if (location.state !== null) {
            getTimesheet(location.state.id);
        }
        console.log(location, "location");

        // eslint-disable-next-line  
    }, []);
    const getEmployeesDropdown = () => {
        CommonApi.employeesDropdown({ emp_type_id: "", timesheet_cycle_id: 5 }).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmployeesDropdown(response.data.data);
            }
        });
    };

    const getClientsDropdown = () => {
        let search = "";
        CommonApi.clientsEndClientsDropdown("client", search).then((response) => {
            if (response.data.statusCode == 1003) {
                setClientsDropdown(response.data.data);
            }
        });
    };

    const getPlacementsDropdown = (id, args) => {
        CommonApi.placementsDropdown(id, args).then((response) => {
            if (response.data.statusCode == 1003) {
                setPlacementsList(response.data.data);
                if (response.data.data.length === 1) {
                    let arr = [{ name: "employee_id", value: id }, { name: "client_id", value: response.data.data[0].client_id }, { name: "end_client_id", value: response.data.data[0].end_client_id }];
                    arr.forEach(ele => {
                        handleValidations(ele);
                    });
                    setFormData((prev) => ({ ...prev, placement_id: response.data.data[0].placement_id, client_id: response.data.data[0].client_id, end_client_id: response.data.data[0].end_client_id, }));
                }
            }
        });
    };
    // const calendar_view= false
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "client_id") {
            if (placementsList.length > 0) {
                let placementId = placementsList.filter((i) => i.client_id === value)[0].placement_id;
                let endClientId = placementsList.filter((i) => i.client_id === value)[0].end_client_id;
                setFormData({ ...formData, [name]: value, placement_id: placementId, end_client_id: endClientId, start_date: "", end_date: "", });
            } else {
                setFormData((prev) => ({ ...prev, [name]: value, placement_id: "", end_client_id: "", start_date: "", end_date: "", }));
            }
        } else if (name === "employee_id") {
            setFormData((prev) => ({ ...prev, [name]: value, placement_id: "", client_id: "", end_client_id: "", }));
            getPlacementsDropdown(value, false);
        } else {
            setFormData({ ...formData, [name]: value });
        }
        handleValidations(e.target);
    }

    const uploadDocs = (value) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
            const formDataFile = new FormData();
            formDataFile.append("files", value.target.files[0]);
            formDataFile.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi
                .documentUpload("timesheet-document", formDataFile, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        let docInfo = response.data.data;
                        let docArr;
                        docArr = [{
                            id: formData.documents.length == 0 ? "" : formData.documents[0].id,
                            new_document_id: docInfo.id,
                            document_name: value.target.files[0].name,
                        }]
                        setFormData((prev) => ({ ...prev, documents: docArr }));
                        handleValidations({ name: "document_name", value: docInfo.id });
                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
        }
    };

    const getTimesheet = (id) => {
        TimesheetApi.getTimesheet(id).then((response) => {
            if (response.data.statusCode == 1003) {
                setFormData((prev) => ({ ...prev, ...response.data.data[0] }));
                spliceTimesheetHours(response.data.data[0].timesheet);
            }
        });
    };

    const storeTimesheet = () => {
        let arr = [];
        let data;
        tableHours.forEach(ele => {
            ele.forEach(i => {
                // let obj = { ...i, ot_hours: i.ot_hours == "" ? "00:00" : i.ot_hours, billable_hours: i.billable_hours == "" ? "00:00" : i.billable_hours, };
                let obj = { ...i, ot_hours: i.ot_hours, billable_hours: i.billable_hours };
                arr.push(obj)
            });
        });
        data = { ...formData, request_id: LocalStorage.uid(), timesheet: arr, total_ot_hours: getTotalHours(arr, "ot_hours"), total_billable_hours: getTotalHours(arr, "billable_hours"), total_hours: getTotalHours(arr, "total_hours") };

        if (data.timesheet.some((i) => i.ot_hours === "") || data.timesheet.some((i) => i.billable_hours === "")) {
            return addErrorMsg("Timesheet Hours required.")
        }

        setLoading(true);
        TimesheetApi.storeTimesheet(data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    navigate("/timesheet", { state: { slug: "total_pending_approval_timesheets" } });
                } else if (response.data.statusCode == 1012) {
                    // response.data.message.errors.forEach(ele => {
                    //     addWarningMsg(ele.msg)
                    // });
                    addWarningMsg(response.data.message)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateTimesheet = () => {
        let arr = [];
        let data;
        tableHours.forEach(ele => {
            ele.forEach(i => {
                // let obj = { ...i, ot_hours: i.ot_hours == "" ? "00:00" : i.ot_hours, billable_hours: i.billable_hours == "" ? "00:00" : i.billable_hours, };
                let obj = { ...i, ot_hours: i.ot_hours, billable_hours: i.billable_hours };
                arr.push(obj)
            });
        });
        data = { ...formData, request_id: LocalStorage.uid(), timesheet: arr, total_ot_hours: getTotalHours(arr, "ot_hours"), total_billable_hours: getTotalHours(arr, "billable_hours"), total_hours: getTotalHours(arr, "total_hours") };
        setLoading(true);
        // console.log(data , "  Update Data");
        // return false;
        TimesheetApi.updateTimesheet(location.state.id, data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    navigate("/timesheet", { state: { slug: "total_pending_approval_timesheets" } });
                } else if (response.data.statusCode == 1012) {
                    // response.data.message.errors.forEach(ele => {
                    //     addWarningMsg(ele.msg)
                    // });
                    addWarningMsg(response.data.message)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const updateTimesheetStatus = (actionId) => {
        let data = {
            request_id: LocalStorage.uid(),
            timesheet_id: location.state.id,
            placement_id: formData.placement_id,
            status: "Approved",
            comments: formData.comments,
        };
        setApproveLoading(true);
        TimesheetApi.updateTimesheetStatus(data).then((response) => {
            setTimeout(() => {
                setApproveLoading(false)
                if (response.data.statusCode == 1003) {
                    addSuccessMsg(response.data.message);
                    if (actionId == 1) {
                        setShow(1)
                        setPopUpOpen(true)
                    } else {
                        setShow(3)
                        setPopUpOpen(true)
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (location.state === null) {
                storeTimesheet();
            } else {
                updateTimesheet();
            }
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const validateAll = () => {
        let {
            employee_id,
            client_id,
            // end_client_id,
            start_date,
            end_date,
            comments,
            documents
        } = formData;
        let errors = {};
        errors.employee_id = validate_emptyField(employee_id);
        errors.client_id = validate_emptyField(client_id);
        // errors.end_client_id = validate_emptyField(end_client_id);
        errors.start_date = validate_emptyField(start_date);
        errors.end_date = validate_emptyField(end_date);
        errors.comments = validate_emptyField(comments);
        if (location.state !== null) {
            console.log(formData, "  ++++");
            if (formData.documents.length == 0) {
                errors.document_name = validate_emptyField("");
            } else {
                if (formData.documents[0].id === "") {
                    errors.document_name = validate_emptyField(documents[0].new_document_id);
                }
            }
        } else {
            errors.document_name = validate_emptyField(documents[0].new_document_id);
        }
        return errors;
    };

    const handleValidations = (input) => {
        let err = error;
        switch (input.name || input.tagName) {
            case "employee_id":
                err.employee_id = validate_emptyField(input.value);
                break;
            case "client_id":
                err.client_id = validate_emptyField(input.value);
                break;
            // case "end_client_id":
            //     err.end_client_id = validate_emptyField(input.value);
            //     break;
            case "start_date":
                err.start_date = validate_emptyField(input.value);
                break;
            case "end_date":
                err.end_date = validate_emptyField(input.value);
                break;
            case "comments":
                err.comments = validate_emptyField(input.value);
                break;
            case "document_name":
                err.document_name = validate_emptyField(input.value);
                break;
            default:
                break;
        }

        console.log(err, " err err");
        setError({ ...err });
    };

    const handleChangeDate = (value, name) => {
        setFormData((prev) => ({ ...prev, [name]: moment(value).format(dateFormat()) }));
        if (name === 'start_date') {
            getTimesheetArray(moment(value).format(dateFormat()), formData.end_date);
        } else if (name === 'end_date') {
            getTimesheetArray(formData.start_date, moment(value).format(dateFormat()));
        }

        handleValidations({ name: name, value: value });
    }


    const getTimesheetArray = (startDate, endDate) => {
        if (startDate !== '' && endDate !== '') {
            let hoursArr = [];
            for (let i = 0; i <= moment(endDate, dateFormat()).diff(moment(startDate, dateFormat()), 'days'); i++) {
                let hoursDate = moment(moment(startDate, dateFormat()).add(i, 'days')).format(dateFormat());
                hoursArr.push(
                    {
                        date: hoursDate,
                        ot_hours: "00:00",
                        billable_hours: ["Sat", "Sun"].includes(moment(hoursDate).format('ddd')) ? "00:00" : "08:00",
                        total_hours: ["Sat", "Sun"].includes(moment(hoursDate).format('ddd')) ? "00:00" : "08:00"
                    }
                )
            }
            // setFormData({ ...formData, timesheet: hoursArr });
            spliceTimesheetHours(hoursArr);
            // console.log(hoursArr, " hoursArr 11");
            // setFormData((prev) => ({ ...prev, timesheet: hoursArr, total_ot_hours: getTotalHours(hoursArr, "ot_hours"), total_billable_hours: getTotalHours(hoursArr, "billable_hours"), total_hours: getTotalHours(hoursArr, "total_hours") }));
        }
    }

    const spliceTimesheetHours = (hoursArr) => {
        let arrData = hoursArr;
        if (arrData.length > 0) {
            let Arr = []
            while (arrData.length > 0) {
                Arr.push(arrData.splice(0, 7));
            }
            setTableHours(Arr);
        }
    }

    const handleChangeHours = (e, hourIndex, tableIndex) => {

        let arr = tableHours;
        arr[tableIndex][hourIndex][e.target.name] = hoursValidationHandle(e.target.value);
        if (arr[tableIndex][hourIndex].ot_hours !== "" && arr[tableIndex][hourIndex].billable_hours !== "") {
            // console.log("66");
            // arr[tableIndex][hourIndex].total_hours = sumOfHours(arr[tableIndex][hourIndex].ot_hours, arr[tableIndex][hourIndex].billable_hours);
            arr[tableIndex][hourIndex].total_hours = sumOfHours(arr[tableIndex][hourIndex].ot_hours, arr[tableIndex][hourIndex].billable_hours);
            // setFormData((prev) => ({ ...prev, timesheet: arr, total_ot_hours: getTotalHours(arr, "ot_hours"), total_billable_hours: getTotalHours(arr, "billable_hours"), total_hours: getTotalHours(arr, "total_hours") }));
        } else {
            if (arr[tableIndex][hourIndex].ot_hours == "") {
                arr[tableIndex][hourIndex].total_hours = sumOfHours("00:00", arr[tableIndex][hourIndex].billable_hours);
            }
            if (arr[tableIndex][hourIndex].billable_hours == "") {
                arr[tableIndex][hourIndex].total_hours = sumOfHours(arr[tableIndex][hourIndex].ot_hours, "00:00");
            }
        }
        setTableHours([...arr]);

        // hoursValidationHandle(e.target, hourIndex, tableIndex);
    }


    const hoursValidationHandle = (value) => {
        // let arr = tableHours;
        let input = value.replace(/\D/g, "").substring(0, 5);
        const first = input.substring(0, 2);
        const second = input.substring(2, 4);

        if (input.length > 2) {
            var mm = parseInt(second);
            if (mm > 59) {
                if (first < 23) {
                    var sec = second - 60;
                    var fOne = parseInt(first) + 1;
                    // values.weekly[tableIndex].timesheet[rowIndex].billable_hours = `0${fOne}:${sec}`;
                    // arr[tableIndex][hourIndex][target.name] = `0${fOne}:${sec}`;
                    return `0${fOne}:${sec}`;
                } else {
                    return `${first}:${59}`;
                }
            } else {
                return `${first}:${second}`;
                // arr[tableIndex][hourIndex][target.name] = `${first}:${second}`;
            }
        } else if (input.length >= 0) {
            var hh = parseInt(input);
            if (hh > 23) {
                return "23";
                // arr[tableIndex][hourIndex][target.name] = "23";
            } else {
                return input;
                // arr[tableIndex][hourIndex][target.name] = input;
            }
        }
    }

    function sumOfHours(time1, time2) {

        var [hours1, minutes1] = time1.split(':');
        var [hours2, minutes2] = time2.split(':');

        if (hours1 == '' || hours1 == undefined) {
            hours1 = 0;
        } else if (hours2 == '' || hours2 == undefined) {
            hours2 = 0;
        } else if (minutes1 == '' || minutes1 == undefined) {
            minutes1 = 0;
        } else if (minutes2 == '' || minutes2 == undefined) {
            minutes2 = 0;
        }

        // Convert time to minutes
        var totalMinutes = parseInt(hours1) * 60 + parseInt(minutes1) + parseInt(hours2) * 60 + parseInt(minutes2);

        // Convert minutes back to HH:MM format
        var hours = isNaN(totalMinutes) ? 0 : Math.floor(totalMinutes / 60);
        var minutes = isNaN(totalMinutes) ? 0 : totalMinutes % 60;

        // Add leading zeros if necessary
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + ':' + minutes;
    }

    const getTotalHours = (arr, target) => {
        var start = "00:00";
        for (var i = 0; i < arr.length; i++) {
            start = sumOfHours(start, arr[i][target]);
        }
        return start;
    }


    const handleClosePopUp = () => {
        setPopUpOpen(false);
    };

    const handleOpenDialog = (args) => {
        setShow(args)
        setPopUpOpen(true)
    }

    const nextCycleDate = () => {
        let date = "";
        if (placementsList.length > 0) {
            if (!["", null, undefined].includes(formData.employee_id) && !["", null, undefined].includes(formData.client_id)) {
                if (!["", null, undefined].includes(placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)])) {
                    date = placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)].next_cycle_date;
                } else {
                    date = "";
                }
            } else {
                date = "";
            }
        }
        console.log(date, "  next cycle date");
        return date;
    }

    const activityRef = useRef(null); // eslint-disable-next-line
    const [activeStep, setActiveStep] = useState(0);
    const [activityData, setActivityData] = useState([])
    const [activityFilter, setActivityFilter] = useState({
        limit: 10,
        page: 1,
    })
    const [activityTotal, setActivityTotal] = useState()

    const getActivity = (args) => {
        // setLoading(true)
        TimesheetApi.getActivity(args).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    // setLoading(false)

                    setActivityData(response.data.data);
                    setActivityTotal(response.data.pagination.total)
                }
            }, 300)

        });
    };

    const activityHandleScroll = () => {
        const { current } = activityRef;
        if (current) {
            const { scrollTop, scrollHeight, clientHeight } = current;
            if (scrollTop + clientHeight >= scrollHeight) {
                // getCategory({...filter})
                if (activityTotal >= activityFilter.limit) {
                    setActivityFilter({ ...activityFilter, limit: activityFilter.limit + 10, page: 1 })
                    getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1, });
                }
            }
        }
    };

    const ActivityView = () => (
        <Box px={4} pt={'14px'} sx={{
            width: '660px', height: '100vh',
            overflow: "auto",
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            '&::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px #ffffff',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#C7CCD3',
                outline: '1px solid #C7CCD3',
                borderRadius: "4px",
            }
        }}>

            <Box height={'6vh'} display={'flex'} alignItems={'center'}>
                <Text blackHeader18>Activities</Text>
            </Box>
            <Box sx={{
                height: '68vh',
                overflowY: "auto",
                '&::-webkit-scrollbar': {
                    display: 'none'
                },

            }}
                ref={activityRef}
                onScroll={activityHandleScroll}>
                {activityData.length > 0 &&
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {activityData.map((step, index) => (
                            <Step key={step.label} active={true}>
                                <StepLabel StepIconComponent={() => (
                                    <Tick style={{ width: '20px' }} />
                                )} >
                                    {step.action_type_name === "update" ?
                                        <Text mediumBlue>{step.created_by} Edited the Timesheet {step.reference_id}</Text> : step.action_type_name === "store" ? <Text mediumBlue>{step.created_by} Stored the Timesheet {step.reference_id}</Text> : step.action_type_name === "approval" ? <Text mediumBlue>{step.created_by} Approved the Timesheet</Text> : null
                                    }
                                </StepLabel>
                                <StepContent>
                                    <Grid item xs={11} display='flex' flexDirection='column' rowGap={'7px'} >
                                        <Stack direction='row' spacing={1}>
                                            <Text verySmallBlack>{step.created_time}</Text>
                                            <Text verySmallBlack>{step.created_at}</Text>
                                        </Stack>

                                        <Text smallBlack>{step.field_changes === '[]' ? "" : step.field_changes}</Text>
                                    </Grid>

                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                }
            </Box>

            <Grid mt={9}>
                <Divider />
                <Grid mt={4}>
                    <Textarea className={classes.textarea} type="text" maxLength={600} name="comments" aria-label="minimum height" minRows={4} placeholder="Add Comments" sx={{ resize: "none" }} />
                </Grid>
            </Grid>


            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={2} height={'63px'} pr={'2px'}>

                <Button cancelActivity onClick={() => setDrawer(false)}>Cancel</Button>
                <Button activity >Add Comment</Button>
            </Box>
        </Box >
    )


    return (
        <Box sx={{ width: "100%" }}>

            {console.log(formData, "   state data")}
            <Box p={1} sx={{ marginLeft: "76px" }}>
                <Box mx={3} display='flex' justifyContent='space-between'>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography component={Link} to={'/timesheet'} className={classes.breadcrumbsLink}>Timesheet</Typography>
                        <Typography className={classes.breadcrumbsName}>
                            {console.log(formData.status, "status")}
                            {
                                location.state === null ?
                                    "Add Timesheet" :
                                    formData.status ?
                                        formData.status === "Drafted" ? "Pending Timesheet" : formData.status === "Approved" ? "Invoice Ready Timesheet" : "Approval In Progress" ? "Approve Timesheet" : null
                                        : "View Timesheet"
                            }

                        </Typography>
                    </Breadcrumbs>
                    {location.state !== null &&
                        <button
                            type="button"
                            style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px", marginRight: '40px' }}
                            onClick={() => setDrawer("activity")}>

                            <Clock />
                        </button>
                    }

                </Box>
                <Box m={3}>
                    {location.state !== null ?
                        <Box my={3} p={3} className={classes.employeViewContainer}>
                            <Box className={classes.employeViewBox}>
                                <Grid container spacing={0}>
                                    <Grid item lg={4} md={4} sm={12} xs={12} >
                                        <Box px={1} className={classes.flexAlineCenter} >
                                            <Box>
                                                <Avatar
                                                    alt="Remy Sharp"
                                                    // src={AvatarSvg}
                                                    src={formData.profile_picture_url}
                                                    sx={{ width: '80px', height: '80px', }}
                                                />
                                            </Box>
                                            <Box mx={2}>
                                                <Typography className={classes.primarytext}>
                                                    {`${formData.employee_name}`} {formData.e_verified ? <img src={Component87} alt='svg' style={{ margin: "0px 6px" }} /> : null}
                                                </Typography>
                                                <Typography className={classes.secondarytext}>
                                                    {`${formData.emp_reference_id}`}
                                                </Typography>
                                            </Box>
                                        </Box>

                                    </Grid>
                                    <Grid item lg={3} md={3} sm={12} xs={12} >
                                        <Box px={1} sx={{ height: '80px', display: 'flex', alignItems: "center" }}>
                                            <Box>
                                                <Typography className={classes.secondarytext}>
                                                    {`Approval Status`}
                                                </Typography>
                                                <Typography className={classes.primarytext2}>
                                                    {formData.status}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={12} xs={12} >
                                        <Box px={1} sx={{ height: '80px', display: 'flex', alignItems: "center" }}>
                                            <Box>
                                                <Typography className={classes.secondarytext}>
                                                    {`Total Logged  Hours`}
                                                </Typography>
                                                <Typography className={classes.primarytext2}>
                                                    {`${formData.total_hours}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={12} xs={12} >
                                        <Box px={1} sx={{ height: '80px', display: 'flex', alignItems: "center" }}>
                                            <Box>
                                                <Typography className={classes.secondarytext}>
                                                    {`Submit Date`}
                                                </Typography>
                                                <Typography className={classes.primarytext2} sx={{ textAlign: "center" }}>
                                                    {`${["", null, undefined].includes(formData.submitted_on) ? "-" : formData.submitted_on}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box> : null
                    }
                    <Box py={3} px={2} sx={{ border: "1px solid #EAECF0", borderRadius: '12px' }}>
                        <Text profileTitle mx={2} mt={1}>New Timesheet</Text>
                        <Grid container spacing={0}>

                            {
                                location.state === null ?
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <Box p={1} my={1} mx={1}>
                                            <SearchSelect
                                                name='employee_id'
                                                value={formData.employee_id}
                                                onChange={handleChange}
                                                options={employeesDropdown}
                                                labelText={<Text largeLabel>Employee Name</Text>}
                                                scrollTrue
                                                disabled={location.state !== null}
                                            />
                                            <Text errorText> {error.employee_id ? error.employee_id : ""}</Text>
                                        </Box>
                                    </Grid> : null
                            }

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <Box p={1} my={1} mx={1}>
                                    <SearchSelect
                                        name='client_id'
                                        value={formData.client_id}
                                        onChange={handleChange}
                                        options={
                                            location.state == null ?
                                                placementsList.length > 0 ?
                                                    clientsDropdown.filter((i) => placementsList.some((n) => n.client_id === i.id))
                                                    : clientsDropdown
                                                : clientsDropdown
                                        }
                                        labelText={<Text largeLabel>Client</Text>}
                                        scrollTrue
                                        disabled={location.state !== null}
                                    />
                                    <Text errorText> {error.client_id ? error.client_id : ""}</Text>
                                </Box>
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <Box p={1} my={1} mx={1}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'end_client_id',
                                            value: formData.end_client_id === "" ? "" : formData.end_client_name !== '' ? formData.end_client_name : placementsList.length > 0 ? placementsList.filter((i) => i.end_client_id === formData.end_client_id)[0]?.end_client_name : "",
                                            // value: formData.end_client_id ,
                                            type: 'text',
                                            disabled: true
                                        }}
                                        handleChange={handleChange}
                                        clientInput
                                        labelText={<Text largeLabel>End Client <span className={classes.optional}>(Optional)</span></Text>}
                                    />
                                </Box>
                            </Grid>
                            <Grid container item lg={4} md={4} sm={12} xs={12}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box p={1} mt={1} ml={{ lg: 1, md: 1, sm: 0, xs: 0 }}>
                                        <Datepicker
                                            labelText={"Start Date"}
                                            name={"start_date"}
                                            value={formData.start_date}
                                            minDate={nextCycleDate()}
                                            maxDate={
                                                formData.end_date === '' ? moment().format(dateFormat()) : formData.end_date
                                            }
                                            onChange={(e) => handleChangeDate(e.$d, "start_date")}
                                            disabled={location.state !== null}
                                        />
                                        <Text errorText> {error.start_date ? error.start_date : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box p={1} mt={1} mr={{ lg: 1, md: 1, sm: 0, xs: 0 }}>
                                        <Datepicker
                                            labelText={"End Date"}
                                            name={"end_date"}
                                            value={formData.end_date}
                                            minDate={
                                                formData.start_date === '' ?
                                                    placementsList.length > 0 ?
                                                        formData.client_id == "" ? "" :
                                                            !["", null, undefined].includes(placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)]) ?
                                                                placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)].next_cycle_date : ""
                                                        : "" :
                                                    formData.start_date}
                                            maxDate={moment().format(dateFormat())}
                                            onChange={(e) => handleChangeDate(e.$d, "end_date")}
                                            disabled={location.state !== null}
                                        />
                                        <Text errorText> {error.end_date ? error.end_date : ""}</Text>
                                    </Box>
                                </Grid>
                            </Grid>
                            {
                                console.log(formData, "   formData formData")
                            }
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <Box p={1} mt={1} mx={1}>
                                    <FileInput
                                        name={"document_name"}
                                        FileName={formData.documents[0] ? formData.documents[0].document_name : ""}
                                        handleChange={uploadDocs}
                                        label={"Upload Timesheet"}
                                        isDisabled={location.state == null ? (formData.status == "Approval In Progress" || formData.status == "Submitted")  ? invoiceReadyEdit : false : !formData.is_editable || (formData.approved_status !== 3 && location.state.name == 'Invoice Ready Timesheet' && formData.is_editable && edit)} />
                                    <Text errorText> {error.document_name ? error.document_name : ""}</Text>
                                </Box>
                            </Grid>
                            <Grid item lg={location.state === null ? 4 : 8} md={location.state === null ? 4 : 8} sm={12} xs={12}>
                                <Box p={1} mx={1} my={1}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'comments',
                                            value: formData.comments,
                                            type: 'text',
                                            disabled: location.state == null ? (formData.status == "Approval In Progress" || formData.status == "Submitted") ? invoiceReadyEdit : false : !formData.is_editable || (formData.approved_status !== 3 && location.state.name == 'Invoice Ready Timesheet' && formData.is_editable && edit)
                                        }}
                                        handleChange={handleChange}
                                        clientInput
                                        labelText={<Text largeLabel>Comments</Text>}
                                    />
                                    <Text errorText> {error.comments ? error.comments : ""}</Text>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        tableHours.map((table, key) => (
                            <Box my={3} key={key}>
                                <TimesheetTable hoursArr={table} handleChangeHours={handleChangeHours} tableIndex={key} editscreen={location.state !== null} location={location} formData={formData} edit={(formData.status == "Approval In Progress" || formData.status == "Submitted") ? invoiceReadyEdit : edit} />
                            </Box>
                        ))
                    }
                    <Box>
                        <Box mt={2} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                            {/* cancel button expect for invoice ready timesheet card */}
                            {location && location.state && location.state.name != 'Invoice Ready Timesheet' ?
                                <CustomButton cancelBtnBorder onClick={() => navigate("/timesheet")}>
                                    Cancel
                                </CustomButton> : null
                            }
                            {
                                location.state === null ?
                                    <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                        Save
                                    </LoadingButton> : null
                            }
                            {location.state !== null ?
                                formData.status !== "Approved" && formData.is_approver && !invoiceReadyEdit ?
                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_edit" && item.is_allowed == true)) ?
                                        <CustomButton cancelBtnBorder onClick={() => handleOpenDialog(2)}>
                                            Reject
                                        </CustomButton> :
                                        <CustomButton saveLoaderDisable>
                                            Reject
                                        </CustomButton> : null
                                : null
                            }
                            {location.state !== null ?
                                formData.status !== "Approved" && formData.is_approver && !invoiceReadyEdit ?
                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_edit" && item.is_allowed == true)) ?
                                        <LoadingButton saveLoader loading={approveLoading} onClick={() => updateTimesheetStatus(1)}>
                                            Approve
                                        </LoadingButton> :
                                        <LoadingButton saveLoaderDisable>
                                            Approve
                                        </LoadingButton> : null
                                : null
                            }
                             {/* edit button only for Approver level */}
                             {location.state !== null ?
                                (formData.status == "Approval In Progress" || formData.status == "Submitted") && !invoiceReadyEdit?
                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_edit" && item.is_allowed == true)) ?
                                        <CustomButton blackCancel sx={{ height: "48px !important" }} onClick={() => {setinvoiceReadyEdit(true); setEdit(true)}} >
                                            Edit
                                        </CustomButton> :
                                        <CustomButton rejectDisable sx={{ height: "48px !important" }}>
                                            Edit
                                        </CustomButton> : null
                                : null
                            }
                             {/* submit button not for invoice ready timesheet */}
                             {location.state !== null ?
                                formData.approved_status !== 3 && formData.is_editable && location && location.state && location.state.name != 'Invoice Ready Timesheet' && edit && invoiceReadyEdit ?
                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_edit" && item.is_allowed == true)) ?
                                        <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                            Submit
                                        </LoadingButton> :
                                        <LoadingButton saveLoaderDisable>
                                            Submit
                                        </LoadingButton> : null
                                : null
                            }
                            {/* submit button not for invoice ready timesheet */}
                            {location.state !== null ?
                                formData.approved_status !== 3 && formData.is_editable && location && location.state && location.state.name != 'Invoice Ready Timesheet' && edit && (formData.status != "Approval In Progress" && formData.status != "Submitted") ?
                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_edit" && item.is_allowed == true)) ?
                                        <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                            Submit
                                        </LoadingButton> :
                                        <LoadingButton saveLoaderDisable>
                                            Submit
                                        </LoadingButton> : null
                                : null
                            }
                           {/* edit button only for invoice ready timesheet */}
                            {location.state !== null ?
                                formData.approved_status !== 3 && location && location.state && location.state.name == 'Invoice Ready Timesheet' && formData.is_editable && edit ?
                                    LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "timesheet_edit" && item.is_allowed == true)) ?
                                        <CustomButton blackCancel sx={{ height: "48px !important" }} onClick={() => setEdit(false)} >
                                            Edit
                                        </CustomButton> :
                                        <CustomButton rejectDisable sx={{ height: "48px !important" }}>
                                            Edit
                                        </CustomButton> : null
                                : null
                            }
                            {/* cancel button only for invoice ready timesheet and */}
                            {location.state !== null ?
                                location && location.state && location.state.name == 'Invoice Ready Timesheet' ? formData.is_editable ? null :
                                    <CustomButton cancelBtnBorder onClick={() => navigate("/timesheet")}>
                                        Cancel
                                    </CustomButton> : null
                                : null
                            }
                            {location.state !== null ?
                                formData.approved_status !== 3 && location && location.state && location.state.name == 'Invoice Ready Timesheet' && edit ?
                                    location.state.isInvoiceConfigured == true ?
                                        <LoadingButton saveLoader onClick={() => navigate("/sales/add-invoices", { state: { id: location.state.id, action: "generate_invoice" } })}>
                                            Generate Invoice
                                        </LoadingButton> : <LoadingButton saveLoaderDisable>
                                            Generate Invoice
                                        </LoadingButton> : null
                                : null
                            }
                            {
                                edit == false ?
                                    <CustomButton cancelBtnBorder onClick={() => navigate("/timesheet")}>
                                        Cancel
                                    </CustomButton>
                                    : null
                            }
                            {
                                edit == false ?
                                    <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                        Submit
                                    </LoadingButton>
                                    : null
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>

            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
                // onClose={toggleDrawer(false, state.view)}
                // onOpen={toggleDrawer(true, state.view)}
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

                {
                    drawer === "activity" ? ActivityView() : null
                }
            </SwipeableDrawer>
            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={popUpOpen}
            >
                <IconButton
                    aria-label="close"
                    onClick={() => { handleClosePopUp(); navigate("/timesheet", { state: { slug: "total_invoice_ready_timesheets" } }) }}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                </IconButton>
                <DialogContent>
                    {show == 1 ?
                        <>
                            <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <img src={Approved} alt="Approved" />
                            </Box>
                            <Box my={3}>
                                <Typography my={1} sx={{ color: "#15803D", font: '22px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                    Congratulations
                                </Typography>
                                <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                    You Have Apporved Timesheet
                                </Typography>
                            </Box>
                            <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                <CustomButton save onClick={() => navigate("/timesheet", { state: { slug: "total_invoice_ready_timesheets" } })}>
                                    Go To Home
                                </CustomButton>
                            </Box>
                        </>
                        :
                        show == 2 ?
                            <RejectForm handleClosePopUp={handleClosePopUp} handleOpenDialog={handleOpenDialog} id={location.state.id} formData={formData} />
                            :
                            show == 3 &&
                            <>
                                <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                    <img src={Reject} alt="Approved" />
                                </Box>
                                <Box my={3}>
                                    <Typography my={1} sx={{ color: "#E51A1A", font: '22px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                        Rejected
                                    </Typography>
                                    <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                        You Have Rejected Timesheet
                                    </Typography>
                                </Box>
                                <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                    <CustomButton save onClick={() => navigate("/timesheet", { state: { slug: "total_pending_approval_timesheets" } })}>
                                        Go To Home
                                    </CustomButton>
                                </Box>
                            </>
                    }
                </DialogContent>
            </BootstrapDialog>
        </Box>
    )
};