import { Backdrop, Box, CircularProgress, Dialog, DialogContent, Divider, Grid, IconButton, Skeleton, Slide } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Button from '../../../../components/customButton/Button';
import { ReactComponent as Plus } from '../../../../assets/svg/plus.svg';
import checkIcon from '../../../../assets/svg/checkedCircle.svg';
import OCRstyles from '../OCRstyles';
import Text from '../../../../components/customText/Text';
import Input from '../../../../components/input/Input';// eslint-disable-next-line
import Datepicker from '../../../../components/datePicker/Date';
import moment from 'moment';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../utils/utils';
import noInformation from '../../../../assets/timeSheets/noInformation.svg';
import { styled } from "@mui/material/styles";
import crossIcon from '../../../../assets/svg/crossIcon.svg';
import { useNavigate } from 'react-router';
import TimesheetForm from './TimesheetForm';// eslint-disable-next-line
import alertCircle from '../../../../assets/timeSheets/alert-circle.svg';
import OCRApi from '../../../../apis/admin/ocr/OCR';
import LocalStorage from '../../../../utils/LocalStorage';
import LoaderIcon from '../../../../assets/svg/sandtimer.svg';
import PropTypes from 'prop-types';// eslint-disable-next-line
import EmployeesApi from '../../../../apis/admin/employees/EmployeesApi';
import CommonApi from '../../../../apis/CommonApi';
import TimesheetApi from '../../../../apis/admin/timesheets/TimesheetApi';
import LoadingButton from '../../../../components/customButton/LoadingButton';
import SearchSelect from '../../../../components/selectField/SearchSelect';

/**
 * status: 
 * -------
 * 0=> uploaded successfully
 * 1=> uploaded pending
 * 2=> uploaded rejected
 * */

const TransitionUp = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "16px",
    },
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));

function CircularProgressWithLabel(props) {
    return (
        // <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <Backdrop sx={{ position: "absolute" }} open={true}>
            <CircularProgress variant="inherit" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text smallOrange variant="caption" component="div" color="text.primary">
                    {`${props.value}%`}
                </Text>
            </Box>
        </Backdrop>
        // </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};


function BulkUploadedTimesheets(props) {

    const classes = OCRstyles();
    const navigate = useNavigate();
    const inputRef = useRef();
    const [active, setActive] = useState(0);
    const [data, setData] = useState(null);
    const [edit, setEdit] = useState(true);
    const [addNew, setAddNew] = useState(false);
    const [open, setOpen] = useState(false);
    const [docsData, setDocsData] = useState(LocalStorage.getTidData() !== undefined ? LocalStorage.getTidData() : []); // eslint-disable-next-line
    const [timesheetsData, setTimesheetsData] = useState([]);
    const [tIds, setTIds] = useState([]);
    const [docLoader, setDocLoader] = useState(false);
    const [loader, setLoader] = useState(true);
    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [load, setLoad] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [state, setState] = useState({
        id: "",
        date: "",
        billable_hours: "",
        ot_hours: "",
        total_hours: ""
    });
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

    useEffect(() => {
        getEmployees();
        getClientsDropdown();
        if (LocalStorage.getTidData() !== undefined && LocalStorage.getTidData().length > 0) {
            getTimeSheetTIds(LocalStorage.getTidData());
        }
        // eslint-disable-next-line
    }, []);

    const getEmployees = () => {
        setLoad(true);
        CommonApi.employeesWithoutType(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setLoad(false);
                setEmployees(res.data.data);
            } else {
                setLoad(false);
                addErrorMsg(res.data.message)
            }
        })
    }

    const getClientsDropdown = () => {
        CommonApi.clientsEndClientsDropdown("client", '').then((response) => {
            if (response.data.statusCode == 1003) {
                setClients(response.data.data);
            }
        });
    };

    const getTimeSheetTIds = (param, param1) => {
        setDocLoader(true);
        OCRApi.getTimesheetDetails(param).then((response) => {
            if (response.status == 200) {
                if (param1 != undefined) {
                    var newArr = tIds;
                    newArr.splice(0, 0, response.data);
                    setTIds(newArr);
                    getTimeSheetProgressDetails(response.data[0], param1);
                } else {
                    setTIds(response.data);
                    for (var i in response.data) {
                        getTimeSheetProgressDetails(response.data[i])
                    }
                }
            } else {
                addErrorMsg(response.data.message);
            }
        })
    }

    const uploadDocs = (value) => {
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("timesheet-document", formData, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                var newArr = docsData;
                response.data.data['url'] = response.data.data['document_url'];
                newArr.splice(0, 0, response.data.data);
                LocalStorage.setTidData(newArr);
                setDocsData([...newArr]);
                setActive(0);
                getTimeSheetTIds([response.data.data], 'add');

            } else {
                addErrorMsg(response.data.message);
            }
        });
    };

    const getTimeSheetProgressDetails = (param, param1) => {
        console.log("getTimeSheetProgressDetails");
        OCRApi.getTimeSheetProgress(param.id).then((response) => {
            if (response.status == 200) {
                if (response.data.progress_status) {
                    for (var k in docsData) {
                        if (docsData[k].id === response.data.id) {
                            docsData[k]['result'] = response.data.result;
                            docsData[k]['progress'] = response.data.progress;
                            docsData[k]['progress_status'] = response.data.progress_status;
                            docsData[k]['sent_approval'] = response.data.sent_approval;
                            docsData[k]['status'] = response.data.status;
                            docsData[k]['client_id'] = response.data.client_id;
                            docsData[k]['timesheet'] = response.data.timesheet;
                            setDocsData([...docsData]);
                            var newArray = timesheetsData;
                            if (param1 != undefined) {
                                newArray.unshift(docsData[k]);
                            } else {
                                newArray.splice(k, 0, docsData[k]);
                            }
                            // docsData[k]['data'] = payLoadReturn(docsData[k]);                            
                            // setDocsData([...docsData]);
                            setTimesheetsData([...newArray]);
                            setData(payLoadReturn(timesheetsData[0]));
                        }
                    }
                    setDocLoader(false);
                } else {
                    for (var i in docsData) {
                        if (docsData[i].id === response.data.id) {
                            docsData[i]['progress'] = response.data.progress;
                            docsData[i]['progress_status'] = response.data.progress_status;
                            docsData[i]['sent_approval'] = response.data.sent_approval;
                            docsData[i]['status'] = response.data.status;
                            docsData[i]['client_id'] = response.data.client_id;
                            setDocsData([...docsData]);
                            setData(payLoadReturn(docsData[i]));
                        }
                    }

                    setTimeout(() => {
                        getTimeSheetProgressDetails(param);
                    }, 1000);
                }
            } else {
                setDocLoader(false);
                addErrorMsg(response.data.message);
            }
        })
    }

    const totalCalculation = (param) => {
        var timesArray = param.timesheet;
        var total = 0;
        for (var i in timesArray) {
            if (timesArray[i].billable_hours != null && timesArray[i].billable_hours != "") {
                total += parseFloat(timesArray[i].billable_hours);
            }
        }
        return parseFloat(total).toFixed(2);
    }

    const handleClick = (param, index) => {
        setEmployees([]);
        getEmployees();
        console.log("param: ", param);
        setData(null);
        setData(payLoadReturn(param));
        setActive(index);
    }

    const handleEmployee = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }
    // eslint-disable-next-line
    const handleChange = (e, index) => {
        if (index === undefined) {
            setState({ ...state, [e.target.name]: hoursValidationHandle(e.target.value) });
        } else {
            data.timesheet[index].billable_hours = hoursValidationHandle(e.target.value);
            data.timesheet[index].total_hours = hoursValidationHandle(e.target.value);
            setData({ ...data });
            data.total_hours = totalCalculation(data);
            setData({ ...data });
        }

    }

    const addNewPair = () => {
        setState({
            date: moment(data.timesheet[data.timesheet.length - 1].date).add(1, 'days').format(dateFormat()),
            ot_hours: "00:00",
            total_hours: "08.00",
            billable_hours: "08.00"
        })
        setAddNew(true);
    }
    const handleCancel = () => {
        setState({
            id: "",
            date: "",
            ot_hours: "",
            total_hours: "",
            billable_hours: ""
        })
        setAddNew(false);
    }

    const handleCancelForm = (param) => {
        console.log("param", param);
        // var tid = getTid(data.id);
        setSubmit(true);
        var obj = {
            request_id: LocalStorage.uid(),
            client_id: param.client_id,
            employee_id: param.employee_id,
            comments: param.comments,
            start_date: param.start_date,
            end_date: param.end_date,
            timesheet: param.timesheet,
            total_billable_hours: param.total_billable_hours,
            total_hours: param.total_hours,
            total_ot_hours: param.total_ot_hours,
            documents: param.documents,
        }
        TimesheetApi.storeTimesheetOcr(obj, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                const payLoad = {
                    id: data.id,
                    timesheet: obj
                }
                OCRApi.sentApproval(payLoad).then((response) => {
                    if (response.status == 200) {
                        data.client_id = param.client_id;
                        data.employee_id = param.employee_id;
                        data.employee_name = findingEmployee(param.employee_id, 'name');
                        data.comments = param.comments;
                        data.start_date = param.start_date;
                        data.end_date = param.end_date;
                        data.timesheet = param.timesheet;
                        data.total_billable_hours = param.total_billable_hours;
                        data.total_hours = param.total_hours;
                        data.total_ot_hours = param.total_ot_hours;
                        data.documents = param.documents;
                        data.sent_approval = true;
                        data.progress_status = true;
                        data.progress = 100;
                        data.status = 0;
                        data.result = true;
                        setData({ ...data });
                        var newObj = data;
                        newObj.timesheet = obj;
                        for (var i in docsData) {
                            if (data.id === docsData[i].id) {
                                docsData.splice(i, 1);
                                docsData.splice(i, 0, newObj);
                                setDocsData([...docsData]);
                            }
                        }
                        addSuccessMsg("Sent For Approval Successfully");
                        setEdit(false);
                        setSubmit(false);
                        setOpen(false);
                    } else {
                        setSubmit(false);
                        addErrorMsg(response.data.message);
                    }
                })
            } else {
                setSubmit(false);
                addErrorMsg(res.data.message);
            }
        })
    }

    // eslint-disable-next-line
    const handleChangeDate = (e, name, index) => {
        console.log("handleChangeDate");
        var value = moment(e).format(dateFormat());
        if (index === undefined) {
            setState({ ...state, [name]: value });
        } else {
            data.timesheet[index].date = value;
            setData({ ...data });
        }
    };

    const handleSaveNewObject = () => {
        if (state.date == "" || state.billable_hours == "") {
            addWarningMsg("Please fill data");
        } else {
            state.total_hours = state.billable_hours;
            setState({ ...state });
            let newArray = data.timesheet;
            newArray.push(state);
            setData({ ...data, timesheet: newArray });
            data.total_billable_hours = totalCalculation(data);
            data.end_date = data.timesheet[data.timesheet.length - 1].date;
            data.total_hours = totalCalculation(data);

            setData({ ...data });
            setAddNew(false);
        }
    }

    const handleEditSave = () => {
        var test = findEmpty(data);
        if (test) {
            setEdit(!edit);
        } else {
            addWarningMsg('Please fill all data')
        }
    }

    const handleEditCancel = () => {
        if (!edit) {
            var test = findEmpty(data);
            if (test) {
                setEdit(!edit);
            } else {
                addWarningMsg('Please fill previous data')
            }
        } else {
            setEdit(!edit);
        }
    }

    const timesheetStoreAndSendForApproval = (param) => {
        setSubmit(true);
        TimesheetApi.storeTimesheetOcr(param, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                const payLoad = {
                    id: param.id,
                    timesheet: param
                }
                OCRApi.sentApproval(payLoad).then((response) => {
                    if (response.status == 200) {
                        param.sent_approval = 1;
                        setData({ ...param });
                        for (var i in docsData) {
                            if (param.id === docsData[i].id) {
                                docsData.splice(i, 1);
                                docsData.splice(i, 0, param);
                                setDocsData([...docsData]);
                            }
                        }
                        addSuccessMsg("Sent For Approval Successfully");
                        setEdit(false);
                        setSubmit(false);
                    } else {
                        setSubmit(false);
                        addErrorMsg(response.data.message);
                    }
                })
            } else {
                setSubmit(false);
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleSendApproval = () => {
        setSubmit(true);
        if (data.employee_id == "" || data.employee_id == undefined || data.employee_id == null) {
            data.employee_id = findingEmployee(data.employee_name, "id");
            setData({ ...data });
        }
        data.start_date = data.timesheet[0].date;
        data.end_date = data.timesheet[data.timesheet.length - 1].date;
        data.total_billable_hours = String(data.total_billable_hours).replace('.', ':');
        data.total_hours = String(data.total_hours).replace('.', ':');
        data.total_ot_hours = String(data.total_ot_hours).replace('.', ':');
        setData({ ...data });
        timesheetStoreAndSendForApproval(data);
        console.log("data", data);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpenForm = () => {
        setFormData({
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
        })
        setOpen(true);
    }

    /**
    * Finds if there are any empty dates or times in the given array of time_sheet objects.
    * @param {Object} param - An object containing a 'time_sheet' property, which is an array of objects with 'date' and 'time' properties.
    * @returns {boolean} - Returns true if there are no empty dates or times, otherwise returns false.
    */
    const findEmpty = (param) => {
        // return (param.time_sheet.some(item => item.date == "" || item.time == "")) ? false : true;
        return !param.timesheet.some(item => item.date === "" || item.billable_hours === "");
    };

    /**
    * Finds the document ID from the given URL by extracting the part of the string
    * before the last dot and after the last slash.
    * 
    * @param {string} param - The URL from which the document ID needs to be extracted.
    */
    // eslint-disable-next-line
    const findsDocumentId = (param) => {
        if (param !== undefined) {
            return param.substring(param.lastIndexOf("/") + 1).replace(/\.[^.]*$/, '');
        }
    };

    const handleButtonClick = () => {
        inputRef.current.click();
    };


    /**
     * Generates a payload object based on the provided parameter, typically derived from an API call response.
     * This function prepares a payload object with various properties for further processing or submission.
     * 
     * @param {Object} param - The input parameter representing data, often obtained from an API response.
     * @returns {Object} - A payload object with properties derived from the input parameter.
     */
    const payLoadReturn = (param) => {
        var obj = {};
        console.log("Input Parameter:", param);
        setLoader(true);
        if (param !== undefined) {
            obj['id'] = param.id;
            obj['request_id'] = LocalStorage.uid();
            obj['comments'] = '';
            obj['url'] = param.url;
            obj['status'] = param.status;
            obj['result'] = param.result;
            obj['sent_approval'] = param.sent_approval;
            obj['progress_status'] = param.progress_status;
            obj['client_id'] = param.client_id;
            obj['documents'] = [{
                // new_document_id: findsDocumentId(param.url)
                new_document_id: param.id
            }];

            if (param.result != null || (param.result == null && param.sent_approval)) {
                if (param.sent_approval) {
                    console.log("inside");
                    obj['employee_id'] = param.timesheet.employee_id;
                    obj['employee_name'] = findingEmployee(param.timesheet.employee_id, 'name');
                    obj['placement_id'] = '';
                    obj['start_date'] = param.timesheet.start_date;
                    obj['end_date'] = param.timesheet.end_date;
                    obj['total_billable_hours'] = param.timesheet.total_billable_hours;
                    obj['total_hours'] = param.timesheet.total_hours;
                    obj['total_ot_hours'] = '00.00';
                    obj['timesheet'] = param.timesheet.timesheet;
                    // console.log("Generated Payload Object:", obj);
                    setLoader(false);
                    return obj;
                } else {
                    obj['employee_id'] = findingEmployee(param.result.consultant_name ? param.result.consultant_name.text : "", "id");
                    obj['employee_name'] = param.result.consultant_name ? param.result.consultant_name.text : "";
                    obj['placement_id'] = '';
                    obj['start_date'] = timeSheetData(param.result.timesheet_data, "fDate");
                    obj['end_date'] = timeSheetData(param.result.timesheet_data, "lDate");
                    obj['total_billable_hours'] = timeSheetData(param.result.timesheet_data, "total");
                    obj['total_hours'] = timeSheetData(param.result.timesheet_data, "total");
                    obj['total_ot_hours'] = '0.00';
                    obj['timesheet'] = timeSheetData(param.result.timesheet_data, "timesheet");
                    // console.log("Generated Payload Object:", obj);
                    setLoader(false);
                    return obj;
                }

            } else {
                obj['employee_id'] = "";
                obj['placement_id'] = '';
                obj['start_date'] = '';
                obj['end_date'] = '';
                obj['total_billable_hours'] = '0.00';
                obj['total_hours'] = '0.00';
                obj['total_ot_hours'] = '0.00';
                obj['timesheet'] = '';
                console.log("Generated Payload Object:", obj);
                setLoader(false);
                return obj;
            }
        }
    };

    /**
     * Converts an array of time sheet data to a new format, adjusting date formatting and adding default values for 'ot_hours', 'billable_hours', and 'total_hours'.
     * Optionally, provides additional functionalities based on the 'param1' parameter.
     * 
     * @param {Array} param - The array of time sheet data to be transformed.
     * @param {string} param1 - A parameter to determine the type of output:
     *                          - 'total': Returns the total hours as a numeric value.
     *                          - 'fDate': Returns the formatted date of the first entry.
     *                          - 'lDate': Returns the formatted date of the last entry.
     *                          - Otherwise, returns an array of objects with adjusted date format and default values.
     * @returns {Array|number|string} - Based on the 'param1' parameter, it returns an array of objects, a total hours value, or a formatted date.
     */
    const timeSheetData = (param, param1) => {
        var finalArr = [];
        var total = 0.00;
        for (var i in param) {
            finalArr.push({
                "date": moment(param[i].date.text).format(dateFormat()),
                // Set default values for 'ot_hours', 'billable_hours', and 'total_hours'
                "ot_hours": "00:00",
                "billable_hours": param[i].hours.text,
                "total_hours": param[i].hours.text
            });
            total += parseFloat(param[i].hours.text);
        }
        return param1 === "total" ? parseFloat(total).toFixed(2) :
            param1 === "fDate" ? finalArr[0].date :
                param1 === "lDate" ? finalArr[finalArr.length - 1].date :
                    finalArr;
    };

    /**
     * Finds an employee in the array of objects returned from the API call,
     * based on a specified property matching a given value.
     * 
     * @param {string} param - The value to match against in the 'value' property.
     * @returns {Promise<Object|undefined>} - A promise that resolves to the first object found with the specified property and value, or undefined if not found.
     */
    // eslint-disable-next-line
    const findingEmployee = (param, type) => {
        console.log("param", param);
        setLoad(true);
        if (employees.length > 0) {
            if (type == "id") {
                const foundEmployeeId = employees.find(emp => emp.value === param);
                const filteredEmployees = employees.filter(emp => emp.value === param);
                var len = filteredEmployees.length;
                if (len > 1) {
                    setEmployees(filteredEmployees);
                    addWarningMsg(`Found ${len} employees names as ${param} please select an employee`);
                }
               
                setLoad(false);
                // console.log("foundEmployeeId", foundEmployeeId);
                return foundEmployeeId ? foundEmployeeId.id : '';
            } else {
                const foundEmployee = employees.find(emp => emp.id === param);
                setLoad(false);
                console.log("foundEmployee", foundEmployee);
                return foundEmployee ? foundEmployee.value : '';
            }
        } else {
            CommonApi.employeesWithoutType(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
                if (res.data.statusCode === 1003) {
                    setEmployees(res.data.data);
                    if (type == "id") {
                        const foundEmployeeId = res.data.data.find(emp => emp.value === param);
                        const filteredEmployees = res.data.data.filter(emp => emp.value === param);
                        var len = filteredEmployees.length;
                        if (len > 1) {
                            addWarningMsg(`Found ${len} employees names as ${param} please select an employee`);
                            setEmployees(filteredEmployees);
                        }
                     
                        setLoad(false);
                        return foundEmployeeId ? foundEmployeeId.id : '';
                    } else {
                        const foundEmployee = res.data.data.find(emp => emp.id === param);
                        setLoad(false);
                        return foundEmployee ? foundEmployee.value : '';
                    }
                }
            })
        }
    };

    /**
* Finds the name of a client based on the given ID.
* @param {number} param - The ID of the client to search for.
* @returns {string|undefined} - The name of the client if found, or undefined if not found.
*/
    const findClientName = (param) => {
        const foundClient = clients.find(client => client.id === param);
        return foundClient ? foundClient.name : undefined;
    };

    // eslint-disable-next-line
    const getTid = (param) => {
        const ti = tIds.find(d => d.id === param);
        return ti ? ti.tid : '';
    }

    const hoursValidationHandle = (value) => {

        let input = value.replace(/\D/g, "").substring(0, 5);
        const first = input.substring(0, 2);
        const second = input.substring(2, 4);

        if (input.length > 2) {
            var mm = parseInt(second);
            if (mm > 59) {
                if (first < 23) {
                    var sec = second - 60;
                    var fOne = parseInt(first) + 1;
                    return `0${fOne}.${sec}`;
                } else {
                    return `${first}.${59}`;
                }
            } else {
                return `${first}.${second}`;
            }
        } else if (input.length >= 0) {
            var hh = parseInt(input);
            if (hh > 23) {
                return "23";
            } else {
                return input;
            }
        }
    }

    return (
        <Grid container>
            <Grid item lg={2} >
                <Box className={classes.buttonBox}>
                    <input type="file" hidden ref={inputRef} onChange={uploadDocs} />
                    <Button addButton onClick={handleButtonClick} startIcon={<Plus />}>Add New</Button>
                </Box>
                <Box className={classes.sideBarBox}>
                    {
                        docsData.length > 0 && docsData.map((item, ind) => (
                            <Box className={classes.imageBox} onClick={() => { handleClick(item, ind) }}>
                                <img src={item.url} alt={"image_url"} className={`${classes.image} ${((item.progress_status && item.status == 0) || item.sent_approval) ? classes.borderGreen : (!item.progress_status && item.status == 0) ? classes.borderOrange : (item.progress_status && item.status == 1 && !item.sent_approval) ? classes.borderRed : ''}`} />
                                {!item.progress_status && <CircularProgressWithLabel variant="determinate" sx={{ color: "#fbc02d" }} value={item.progress ? item.progress : 0} />}
                                {active == ind && <img src={checkIcon} alt="checkIcon" className={classes.activeImage} />}
                            </Box>
                        ))
                    }
                </Box>
            </Grid>
            <Grid item lg={6} className={classes.middleGrid}>
                <Box className={classes.middleImageBox}>
                    {
                        docLoader || loader ?
                            <img src={LoaderIcon} height={100} width={100} alt='loading' style={{ marginTop: "170px" }} />
                            :
                            <>
                                <Text mediumBlack14>{data != null ? data.employee_name : ""}</Text>
                                <Divider className={classes.divider} />
                                <img src={data != null ? data.url : ''} alt={"image_url"} className={classes.middleImage} />
                            </>
                    }
                </Box>
            </Grid>
            <Grid item lg={4} textAlign={"center"}>
                {
                    docLoader || loader ?
                        <img src={LoaderIcon} height={100} width={100} alt='loading' style={{ marginTop: "170px" }} />
                        :
                        <>
                            {
                                data != null &&
                                <>
                                    <Box className={classes.rightBox}>
                                        <>
                                            <Grid container>
                                                <Grid item md={6} textAlign={"start"}>
                                                    <Text mediumBoldBlack>Timesheet - {active + 1}</Text>
                                                    <Text mediumLabel>{data.client_id !== "" ? findClientName(data.client_id) : ""}</Text>
                                                </Grid>
                                                <Grid item md={6} >
                                                    <Box className={(data.result === null && data.status == 1) ? classes.statusRedBox : classes.statusBox}>
                                                        <Text mediumGreen className={(data.result === null && data.status == 1) ? classes.mdRed : classes.mdGreen}>{(data.result === null && data.status == 1) ? "Error" : (data.result != null && !data.sent_approval) ? "Sent For Approval" : "Success"}</Text>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Divider className={data.result === null && !data.sent_approval ? classes.smDividerRed : classes.smDivider} />
                                            {((data.result === null && !data.sent_approval) || data.timesheet == undefined || data.timesheet.length == 0) ?
                                                <Box className={classes.noInfoBox}>
                                                    <img src={noInformation} alt="noInformation" className={classes.noInformation} />
                                                    <Grid item md={12}>
                                                        <Text mediumBlack14>No Information Fetched.</Text>
                                                    </Grid>
                                                    <Grid item md={12} pt={1}>
                                                        <Text mediumLabel>No template is found for this timesheet, Create a template or Upload Timesheet Manually</Text>
                                                    </Grid>
                                                    <Grid container item md={12} pt={2} justifyContent={"space-evenly"}>
                                                        <Button blackCancel onClick={() => { navigate("/ocr/create-template") }}>Create Template</Button>
                                                        <Button addButton onClick={() => { handleOpenForm() }}>Enter Manually</Button>
                                                    </Grid>
                                                </Box>
                                                :
                                                <Box className={classes.previewBox}>
                                                    <Grid container columnSpacing={3}>

                                                        <>
                                                            <Grid item md={12} sm={12} xs={12} textAlign={"start"}>
                                                                {load ?
                                                                    <Skeleton variant='rounded' height={55} width={100} /> :
                                                                    <SearchSelect
                                                                        labelText={<Text largeLabel>Employee Name</Text>}
                                                                        options={employees}
                                                                        disabled={edit}
                                                                        name='employee_id'
                                                                        value={data.employee_id}
                                                                        onChange={handleEmployee}
                                                                        scrollTrue
                                                                        refId={true}
                                                                    />
                                                                    // <Input
                                                                    //     formControlProps={{
                                                                    //         fullWidth: true
                                                                    //     }}
                                                                    //     inputProps={{
                                                                    //         name: 'employee_name',
                                                                    //         value: data.employee_name,
                                                                    //         type: 'text',
                                                                    //         inputProps: {
                                                                    //             maxLength: 250
                                                                    //         },
                                                                    //         disabled: edit
                                                                    //     }}
                                                                    //     // handleChange={handleChange}
                                                                    //     clientInput
                                                                    //     labelText={<Text largeLabel>Employee Name</Text>}
                                                                    // />
                                                                }
                                                            </Grid>
                                                            {
                                                                data.timesheet != undefined && data.timesheet.length > 0 && data.timesheet.map((item, ind) => (
                                                                    <>
                                                                        <Grid item md={6} pt={3}>
                                                                            <Datepicker
                                                                                labelText="Date"
                                                                                name="date"
                                                                                value={item.date}
                                                                                disabled={edit}
                                                                                // minDate={item.date}
                                                                                onChange={(e) => handleChangeDate(e.$d, "date", ind)}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} pt={3} >
                                                                            <Input
                                                                                formControlProps={{
                                                                                    fullWidth: true
                                                                                }}
                                                                                inputProps={{
                                                                                    name: 'billable_hours',
                                                                                    value: item.billable_hours,
                                                                                    type: 'text',
                                                                                    inputProps: {
                                                                                        maxLength: 5
                                                                                    },
                                                                                    disabled: edit
                                                                                }}
                                                                                handleChange={(e) => { handleChange(e, ind) }}
                                                                                clientInput
                                                                                labelText={<Text largeLabel>Hours</Text>}
                                                                            />
                                                                        </Grid>

                                                                    </>
                                                                ))
                                                            }
                                                        </>
                                                        {
                                                            addNew &&
                                                            <>
                                                                <Grid item md={6} pt={3}>
                                                                    <Datepicker
                                                                        labelText="Date"
                                                                        name="date"
                                                                        value={state.date}
                                                                        minDate={moment(data.timesheet[data.timesheet.length - 1].date).add(1, 'days').format(dateFormat())}
                                                                        onChange={(e) => handleChangeDate(e.$d, "date")}
                                                                    />
                                                                </Grid>
                                                                <Grid item md={6} pt={3} >
                                                                    <Input
                                                                        formControlProps={{
                                                                            fullWidth: true
                                                                        }}
                                                                        inputProps={{
                                                                            name: 'billable_hours',
                                                                            value: state.billable_hours,
                                                                            type: 'text',
                                                                            inputProps: {
                                                                                maxLength: 5
                                                                            },
                                                                        }}
                                                                        handleChange={(e) => { handleChange(e) }}
                                                                        clientInput
                                                                        labelText={<Text largeLabel>Hours</Text>}
                                                                    />
                                                                </Grid>
                                                            </>
                                                        }

                                                    </Grid>
                                                    {!data.sent_approval &&
                                                        <Box className={classes.bulkUploadBtnBox}>
                                                            {
                                                                addNew ?
                                                                    <Box className={classes.bulkUploadBtnBoxSec}>
                                                                        <Button blackCancel onClick={() => { handleCancel() }}>Cancel</Button>
                                                                        <Button addButtonmd onClick={() => { handleSaveNewObject() }}>Save</Button>
                                                                    </Box> :
                                                                    <Button onClick={() => { addNewPair() }} addNewFull className={classes.addNewFullBtn}>Add New Pair</Button>
                                                            }

                                                        </Box>}
                                                </Box>
                                            }

                                        </>
                                    </Box>
                                    {(data.result || data.sent_approval) && <Grid container item md={12} className={classes.totalTimeGrid}>
                                        <Text mediumBoldBlack>Total Hours</Text>
                                        <Text mediumBoldBlack>{data !== null ? data.total_hours ? (data.total_hours && data.total_hours !== "NaN") ? data.total_hours : "00.00" : "00.00" : "00.00"}</Text>
                                    </Grid>}
                                    {(!addNew && data.result != null && !data.sent_approval) &&
                                        <Grid container item md={12} className={classes.bulkUploadActionsBox}>
                                            <Button blackCancel onClick={() => { handleEditCancel() }}>{edit ? 'Edit' : 'Cancel'}</Button>
                                            {
                                                !edit ?
                                                    <Button addButtonmd onClick={() => { handleEditSave() }}>Save</Button> :
                                                    // <Button addButton onClick={() => { handleSendApproval() }}>Send For Approval</Button>
                                                    <LoadingButton addButtonmd loading={submit} onClick={() => handleSendApproval()}>{submit ? "Sending" : 'Send For Approval'}</LoadingButton>
                                            }
                                        </Grid>}
                                </>
                            }
                        </>
                }
            </Grid>
            <BootstrapDialog
                TransitionComponent={TransitionUp}
                keepMounted
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"lg"}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            background: 'none',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                </IconButton>
                <DialogContent sx={{ margin: "10px" }}>
                    <Grid container spacing={0}>
                        <Grid item md={8}>
                            <Text mediumBoldBlack>Enter Timesheet Manually</Text>
                        </Grid>
                        <TimesheetForm submit={submit} setOpen={setOpen} open={open} handleCancelForm={handleCancelForm} formData={formData} setFormData={setFormData} />
                    </Grid>
                </DialogContent>
            </BootstrapDialog>

        </Grid>
    )
}

export default BulkUploadedTimesheets