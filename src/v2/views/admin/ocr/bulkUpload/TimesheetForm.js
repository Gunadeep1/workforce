import React, { useState, useEffect } from 'react';
import { Box, Grid } from "@mui/material";
import { useLocation } from 'react-router-dom';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import Text from '../../../../components/customText/Text';
import Datepicker from '../../../../components/datePicker/Date';
import FileInput from '../../../../components/muiFileInput/FileInput';
import Input from '../../../../components/input/Input';
import { dateFormat } from '../../../../utils/utils';
import moment from "moment";
import CommonApi from "../../../../apis/CommonApi";
import LocalStorage from '../../../../utils/LocalStorage';
import { addErrorMsg } from '../../../../utils/utils';
import { isValid, validate_emptyField, } from "../../../../components/Validation";
import TimesheetTable from '../../timesheets/TimesheetTable';
import TimesheetStyles from '../../timesheets/TimesheetStyles';
import Button from '../../../../components/customButton/Button';
import LoadingButton from '../../../../components/customButton/LoadingButton';

function TimesheetForm(props) {
    const { setOpen, handleCancelForm, submit, formData, setFormData } = props;
    const classes = TimesheetStyles();
    const location = useLocation();
    const [error, setError] = useState({});
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [clientsDropdown, setClientsDropdown] = useState([]);


    const [placementsList, setPlacementsList] = useState([]);

    const [tableHours, setTableHours] = useState([]);
    const [upload, setUpload] = useState(false);

    useEffect(() => {
        getEmployeesDropdown();
        getClientsDropdown();

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
        setUpload(true);
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
                        setUpload(false);
                    } else {
                        setUpload(false);
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            setUpload(false);
            addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
        }
    };

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
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
            handleCancelForm(data);
        } else {
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

    // const nextCycleDate = () => {
    //     let date = "";
    //     if (placementsList.length > 0) {
    //         if (!["", null, undefined].includes(formData.employee_id) && !["", null, undefined].includes(formData.client_id)) {
    //             if (!["", null, undefined].includes(placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)])) {
    //                 date = placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)].next_cycle_date;
    //             } else {
    //                 date = "";
    //             }
    //         } else {
    //             date = "";
    //         }
    //     }
    //     return date;
    // }

    const getTotalHours = (arr, target) => {
        var start = "00:00";
        for (var i = 0; i < arr.length; i++) {
            start = sumOfHours(start, arr[i][target]);
        }
        return start;
    }

    return (
        <Box py={3} >
            <Grid container columnSpacing={4}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <SearchSelect
                        name='employee_id'
                        value={formData.employee_id}
                        onChange={handleChange}
                        options={employeesDropdown}
                        labelText={<Text largeLabel>Employee Name</Text>}
                        scrollTrue
                    />
                    <Text errorText> {error.employee_id ? error.employee_id : ""}</Text>
                </Grid>

                <Grid item lg={4} md={4} sm={12} xs={12}>
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
                    />
                    <Text errorText> {error.client_id ? error.client_id : ""}</Text>

                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'end_client_id',
                            value: formData.end_client_id === "" ? "" : placementsList.length > 0 ? placementsList.filter((i) => i.end_client_id === formData.end_client_id)[0]?.end_client_name : "",
                            // value: formData.end_client_id ,
                            type: 'text',
                            disabled: true
                        }}
                        handleChange={handleChange}
                        clientInput
                        labelText={<Text largeLabel>End Client <span className={classes.optional}>(Optional)</span></Text>}
                    />
                </Grid>
                <Grid container item lg={4} md={4} sm={12} xs={12} columnSpacing={4} pt={3}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Datepicker
                            labelText={"Start Date"}
                            name={"start_date"}
                            value={formData.start_date}
                            // minDate={nextCycleDate()}
                            // maxDate={
                            //     formData.end_date === '' ? moment().format(dateFormat()) : formData.end_date
                            // }
                            onChange={(e) => handleChangeDate(e.$d, "start_date")}
                        />
                        <Text errorText> {error.start_date ? error.start_date : ""}</Text>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Datepicker
                            labelText={"End Date"}
                            name={"end_date"}
                            value={formData.end_date}
                            minDate={formData.start_date}
                            // minDate={
                            //     formData.start_date === '' ?
                            //         placementsList.length > 0 ?
                            //             formData.client_id == "" ? "" :
                            //                 !["", null, undefined].includes(placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)]) ?
                            //                     placementsList[placementsList.findIndex(i => i.client_id == formData.client_id)].next_cycle_date : ""
                            //             : "" :
                            //         formData.start_date}
                            // maxDate={moment().format(dateFormat())}
                            onChange={(e) => handleChangeDate(e.$d, "end_date")}
                        />
                        <Text errorText> {error.end_date ? error.end_date : ""}</Text>
                    </Grid>
                </Grid>

                <Grid item lg={4} md={4} sm={12} xs={12} pt={3}>
                    <FileInput
                        name={"document_name"}
                        FileName={formData.documents[0] ? formData.documents[0].document_name : ""}
                        handleChange={uploadDocs}
                        label={"Upload Timesheet"}
                        uploadKeyName={upload ? "Browsing" : "Browse"}
                    />
                    <Text errorText> {error.document_name ? error.document_name : ""}</Text>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} pt={3}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'comments',
                            value: formData.comments,
                            type: 'text',

                        }}
                        handleChange={handleChange}
                        clientInput
                        labelText={<Text largeLabel>Comments</Text>}
                    />
                    <Text errorText> {error.comments ? error.comments : ""}</Text>
                </Grid>
            </Grid>
            {
                tableHours.map((table, key) => (
                    <Box my={3} key={key}>
                        <TimesheetTable hoursArr={table} handleChangeHours={handleChangeHours} tableIndex={key} editscreen={location.state !== null} location={location} formData={formData} edit={''} />
                    </Box>
                ))
            }
            <Grid item md={12} sm={12} xs={12} pt={3} textAlign={"end"}>
                <Button blackCancel onClick={() => { setOpen(false) }} sx={{ marginRight: '15px !important' }}>Cancel</Button>
                {/* <Button addButton onClick={() => { handleSubmit() }} >Send For Approval</Button> */}
                <LoadingButton addButtonmd loading={submit} onClick={() => handleSubmit()}>{submit ? "Sending" : 'Send For Approval'}</LoadingButton>
            </Grid>
        </Box>
    )
}

export default TimesheetForm