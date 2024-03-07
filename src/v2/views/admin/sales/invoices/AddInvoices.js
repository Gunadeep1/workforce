import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Breadcrumbs, FormControlLabel, Checkbox, Stack, tooltipClasses, Slide, Dialog, DialogContent } from "@mui/material";
import Text from '../../../../components/customText/Text';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SalesStyles from '../SalesStyles';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import Datepicker from '../../../../components/datePicker/Date';
import Input from '../../../../components/input/Input';
import EmployeeInvoiceTable from './EmployeeInvoiceTable';
import CustomButton from "../../../../components/customButton/Button";
import LoadingButton from '../../../../components/customButton/LoadingButton';
import { ReactComponent as PlusBlue } from '../../../../assets/svg/plusBlue.svg';
import { ReactComponent as PlusGray } from '../../../../assets/svg/PlusGray.svg';
import { styled } from "@mui/material/styles";
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import DiscountTable from '../DiscountTable';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ReactComponent as CheckBorderIcon } from '../../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as CheckedIcon } from '../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/deleteSvg.svg';
import CommonApi from '../../../../apis/CommonApi';
import InvoicesApi from '../../../../apis/admin/sales/InvoicesApi';
import TimesheetApi from '../../../../apis/admin/timesheets/TimesheetApi';
import FileInput from '../../../../components/muiFileInput/FileInput';
import AddNetPayTerms from '../../addSelectForms/AddNetPayTerms';
import LocalStorage from '../../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg, dateFormat, addWarningMsg } from '../../../../utils/utils';
// import { addWarningMsg, getCurrencySymbol } from '../../../../utils/utils';
import ClientAddress from './Address';
import TimesheetConfig from '../popups/TimesheetConfig';
import ConfirmPopup from '../popups/ConfirmPopup';
import {
    isValid,
    validate_alphaNumeric,
    validate_emptyField,
} from "../../../../components/Validation";
import warningImg from '../../../../assets/svg/confirm-BG-img.svg';
import moment from "moment";
import { ReactComponent as CloseIcon } from '../../../../assets/svg/cross.svg';
import { create, all } from 'mathjs'

const math = create(all)

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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});





export default function AddInvoices() {


    const classes = SalesStyles();
    const navigate = useNavigate();
    const location = useLocation();

    const [addressSameAs, setAddressSameAs] = useState(false);
    const [formTT, setFormTT] = useState(false);
    const [opentooltip, setOpentooltip] = useState(false);


    const [loading, setLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    const [popupView, setPopupView] = useState(null);
    const [timesheetConfiguration, setTimesheetConfiguration] = useState(null);
    // const [placementId, setPlacementId] = useState(null);

    // const [popup, setPopup] = useState("");
    const [clientsList, setClientsList] = useState([]);
    const [clientEmployeesList, setClientEmployeesList] = useState([]);

    // const [companiesAddressList, setCompaniesAddressList] = useState([]);
    const [payTerms, setPayTerms] = useState([]);
    const [state, setState] = useState(
        {
            company_id: "",
            order_number: "",
            net_pay_terms_id: "",
            date: moment().format(dateFormat()),
            due_date: "",
            terms_and_conditions: "",
            customer_note: "",
            sub_total_amount: parseFloat(0).toFixed(2),
            adjustment_amount: "",
            total_amount: parseFloat(0).toFixed(2),
            discount_type: 2,
            discount_value: "",
            discount_amount: parseFloat(0).toFixed(2),
            ledger_item_details: [
                {
                    new: true,
                    employee_id: "",
                    placement_id: "",
                    hours: "00.00",
                    amount: parseFloat(0).toFixed(2),
                    rate: "",
                    timesheets_available: false,
                    timesheet_hour_ids: [],
                    description: "",
                },
            ],
            shipping_address: [],
            billing_address: [],
            documents: [
                {
                    id: "",
                    new_document_id: "",
                    document_name: "",
                }
            ]
        }
    );
    const [error, setError] = useState({});


    const [refId, setRefId] = useState("");
    const [timesheetPlacementId, setTimesheetPlacementId] = useState("");
    const [timesheetEmployeeId, setTimesheetEmployeeId] = useState("");
    const [billrate, setBillrate] = useState("");
    const [timesheetIndex, setTimesheetIndex] = useState("");

    const [timesheetTableDisable, setTimesheetTableDisable] = useState(true);

    // const [ledgerEmp, setLedgerEmp] = useState({});


    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "8px",
            minWidth: popupView === 3 ? "880px" : "400px",
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

    const tooltipToggle = () => {
        opentooltip ? setOpentooltip(false) : setOpentooltip(true)
    }



    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip open={opentooltip} arrow {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 600,
            border: '1px solid #bdbdbd',
            padding: '0px !important'
        },
    }));

    useEffect(() => {
        netPayterms();
        getClientsDropdown();
        if (location.state !== null) {
            if (location.state.action === "generate_invoice") {
                getInvoiceWithTimesheet(location.state.id);
            } else {
                getInvoiceData(location.state.id);
            }
            if (location.state.action === "clone" || location.state.action === "generate_invoice") {
                getRefId();
            }
        } else {
            getRefId();
        }


        // eslint-disable-next-line
    }, []);

    const getInvoiceWithTimesheet = (timesheet_id) => {
        TimesheetApi.getInvoice(timesheet_id).then((response) => {
            if (response.data.statusCode == 1003) {
                if (location.state.action === "generate_invoice") {
                    // response.data.data
                    // if (response.data.data.length > 0) {


                    let data = response.data.data;

                    // console.log(response.data.data, " ..");
                    let timesheetIdsArr = data.timesheet_hours.map((i) => i.timesheet_hours_id);
                    // let ledgerTotalHour = timeToPercentage(getTotalHours(data.timesheet_hours.map(i => i.total_hours))).toFixed(2);
                    let ledgerTotalHour = getTotalHours(data.timesheet_hours.map(i => i.total_hours));
                    // console.log(ledgerTotalHour, " 00222");
                    let dataObj = {
                        company_id: data.company_id,
                        order_number: "",
                        net_pay_terms_id: data.net_pay_terms_id,
                        date: moment().format(dateFormat()),
                        due_date: ["", null, undefined].includes(data.net_pay_terms_name) ? "" : moment().add(data.net_pay_terms_name, 'days').format(dateFormat()),
                        terms_and_conditions: "",
                        customer_note: "",
                        sub_total_amount: math.multiply(ledgerTotalHour, ["", null, undefined].includes(data.current_bill_rate) ? parseFloat(0).toFixed(2) : data.current_bill_rate).toFixed(2),
                        adjustment_amount: "",
                        total_amount: math.multiply(ledgerTotalHour, ["", null, undefined].includes(data.current_bill_rate) ? parseFloat(0).toFixed(2) : data.current_bill_rate).toFixed(2),
                        discount_type: 2,
                        discount_value: "",
                        discount_amount: parseFloat(0).toFixed(2),
                        ledger_item_details: [
                            {
                                employee_id: data.employee_id,
                                placed_employee_name: data.employee_name,
                                placement_id: data.placement_id,
                                hours: ledgerTotalHour,
                                amount: math.multiply(ledgerTotalHour, ["", null, undefined].includes(data.current_bill_rate) ? parseFloat(0).toFixed(2) : data.current_bill_rate).toFixed(2),
                                rate: data.current_bill_rate,
                                timesheets_available: true,
                                timesheet_hour_ids: timesheetIdsArr,
                                description: data.timesheet_hours.length > 0 ? `Invoice From ${moment(data.timesheet_hours[0].date).format(dateFormat())} To ${moment(data.timesheet_hours[data.timesheet_hours.length - 1].date).format(dateFormat())}` : "",
                                avatar: data.avatar,
                                employee_reference_id: data.employee_reference_id,
                            },
                        ],
                        shipping_address: [],
                        billing_address: [],
                        documents: [
                            {
                                id: "",
                                new_document_id: "",
                                document_name: "",
                            }
                        ]
                    }

                    setState((prev) => ({ ...prev, ...dataObj }));
                    getClientEmployeesDropdown(data.company_id);
                    getCompaniesAddressList("billing", data.company_id);
                    getCompaniesAddressList("shipping", data.company_id);
                    // setRefId(response.data.data.reference_id);
                    // addLedgerData();
                    // }
                }
            }
        });
    }

    const getTotalHours = (arr) => {
        // timeToPercentage()
        var start = "00.00";
        for (var i = 0; i < arr.length; i++) {
            let hour = arr[i].replace(":", ".");
            start = sumOfHours(start, hour);
            // start = math.sum(timeToPercentage(start), timeToPercentage(hour));
        }
        return timeToPercentage(start).toFixed(2);
    }

    function sumOfHours(time1, time2) {

        var [hours1, minutes1] = time1.split('.');
        var [hours2, minutes2] = time2.split('.');

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

        return hours + '.' + minutes;
    }

    const getRefId = () => {
        InvoicesApi.getRefId().then((response) => {
            if (response.data.statusCode == 1003) {
                // console.log(response.data.data);
                setRefId(response.data.data)
                // setState({ ...response.data.data })
                // setFormData((prev) => ({ ...prev, ...response.data.data[0] }));
                // spliceTimesheetHours(response.data.data[0].timesheet);
                // getPlacementsDropdown(response.data.data[0].employee_id);
            }
        });
    }

    const uploadDocs = (value, index) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
            const formDataFile = new FormData();
            formDataFile.append("files", value.target.files[0]);
            formDataFile.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi
                .documentUpload("invoice-document",formDataFile, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {

                        let docInfo = response.data.data;
                        let docArr = state.documents;

                        docArr[index] = {
                            id: state.documents[index].id,
                            new_document_id: docInfo.id,
                            document_name: value.target.files[0].name,
                        };

                        setState({ ...state, documents: docArr })

                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
        }
    };

    const getClientsDropdown = () => {
        let search = "";
        CommonApi.clientsEndClientsDropdown("client", search).then((response) => {
            if (response.data.statusCode == 1003) {
                setClientsList(response.data.data);
            }
        });
    };

    const getClientEmployeesDropdown = (client_id) => {
        CommonApi.clientEmployeesDropdown("client", client_id).then((response) => {
            if (response.data.statusCode == 1003) {
                setClientEmployeesList(response.data.data);                
            }
        });
    };


    const netPayterms = () => {
        CommonApi.getNetPayTermsList(LocalStorage.uid(), '', LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setPayTerms(response.data.data);
            }
        });
    };

    const getCompaniesAddressList = (slug, companyId) => {
        CommonApi.companiesAddressList(slug, companyId).then((response) => {
            if (response.data.statusCode == 1003) {
                if (response.data.data.length > 0) {
                    if (slug == "shipping") {
                        let arr = [];
                        arr.push(response.data.data[0])
                        setState((prev) => ({ ...prev, shipping_address: arr }))
                    }
                    if (slug == "billing") {
                        let arr = [];
                        arr.push(response.data.data[0])
                        setState((prev) => ({ ...prev, billing_address: arr, }))
                    }
                }
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "company_id") {
            let ledgerItem = [
                {
                    new: true,
                    employee_id: "",
                    placement_id: "",
                    hours: "00.00",
                    amount: parseFloat(0).toFixed(2),
                    rate: "",
                    timesheets_available: false,
                    timesheet_hour_ids: [],
                    description: "",
                }
            ];
            getClientEmployeesDropdown(value);
            getCompaniesAddressList("billing", value);
            getCompaniesAddressList("shipping", value);
            setState({ ...state, [name]: value, ledger_item_details: ledgerItem, billing_address: [], shipping_address: [] });
        } else if (name == 'net_pay_terms_id') {
            let days = payTerms.filter((i) => i.id == value)[0].days;
            setState({ ...state, [name]: value, due_date: moment(state.date).add(days, "days").format(dateFormat()) });
        } else if (name === "adjustment_amount" || name === "discount_type" || name === "discount_value") {

            if (name === "adjustment_amount") {

                if (["-", "+"].includes(value)) {
                    setState({ ...state, [name]: value });
                } else {

                    let regex = new RegExp(/^[-+]?\d*\.?\d{0,2}$/);

                    if (regex.test(value) || value == "") {
                        if (value.includes("-") && parseFloat(value.replace("-", '')) > state.sub_total_amount) {
                            return false;
                        } else {
                            let adjustmentAmount = value == "" ? parseFloat(0).toFixed(2) : value;
                            if (state.discount_type == 2) {
                                let amount = math.add(state.sub_total_amount, adjustmentAmount);
                                let discountAmount = math.multiply(amount, (state.discount_value / 100));
                                let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
                                setState({ ...state, [name]: value == "" ? "" : adjustmentAmount.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2"), discount_amount: discountAmount.toFixed(2), total_amount: TotalAmount.toFixed(2) });
                            }
                            if (state.discount_type == 1) {
                                let amount = math.add(state.sub_total_amount, adjustmentAmount);
                                let TotalAmount = math.subtract(amount, state.discount_value);
                                setState({ ...state, [name]: value == "" ? "" : adjustmentAmount.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2"), discount_amount: state.discount_value.toFixed(2), total_amount: TotalAmount.toFixed(2) });
                            }
                        }
                    }


                }


            }




            if (name === "discount_value") {

                if (state.discount_type == 2) {
                    if (e.target.value <= 100 || e.target.value == "") {
                        let regex = new RegExp(/^\d*\.?\d{0,2}$/);

                        if (regex.test(e.target.value) || e.target.value == "") {

                            let discountValue = value;
                            discountValue = discountValue == "" ? parseFloat(0).toFixed(2) : discountValue

                            if (state.discount_type == 2) {
                                let amount = math.add(state.sub_total_amount, state.adjustment_amount);
                                // let discountAmount = amount * (discountValue / 100);
                                let discountAmount = math.multiply(amount, (discountValue / 100));
                                let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
                                setState({ ...state, [name]: value.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2"), discount_amount: discountAmount.toFixed(2), total_amount: TotalAmount.toFixed(2) });
                            }
                        }
                    }
                } else {
                    let regex = new RegExp(/^\d*\.?\d{0,2}$/);
                    if (math.sum([state.sub_total_amount, state.adjustment_amount]) >= e.target.value || e.target.value == "") {
                        if (regex.test(e.target.value) || e.target.value == "") {
                            let discountValue = value;
                            discountValue = discountValue == "" ? parseFloat(0).toFixed(2) : parseFloat(discountValue).toFixed(2);
                            if (state.discount_type == 1) {
                                // let amount = math.sum([state.sub_total_amount, state.adjustment_amount]);
                                let amount = math.add(state.sub_total_amount, state.adjustment_amount);

                                if (amount >= discountValue) {
                                    let TotalAmount = math.subtract(amount, discountValue);
                                    setState({ ...state, [name]: value.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2"), discount_amount: discountValue, total_amount: TotalAmount.toFixed(2) });
                                }


                            }
                        }
                    }
                }



            }


            if (name === "discount_type") {
                let TotalAmount = math.add(state.sub_total_amount, state.adjustment_amount);
                setState({ ...state, [name]: value, discount_value: "", discount_amount: parseFloat(0).toFixed(2), total_amount: TotalAmount.toFixed(2) });
            }



            // setState({ ...state, [name]: value });
        } else if (name === "order_number") {


            let regex = new RegExp(/^[a-zA-Z0-9 ]+$/);

            if (regex.test(e.target.value) || e.target.value == "") {
                setState({ ...state, [name]: value });
            }
        } else {
            setState({ ...state, [name]: value });
        }
        handleValidations(e.target);
    }

    const handleChangeDate = (value, name) => {

        if (["", null, undefined].includes(state.net_pay_terms_id)) {
            setState({ ...state, [name]: moment(value).format(dateFormat()) });
        } else {
            let days = payTerms.filter((i) => i.id == state.net_pay_terms_id)[0].days;
            setState({ ...state, [name]: moment(value).format(dateFormat()), due_date: moment(moment(value).format(dateFormat())).add(days, "days").format(dateFormat()) });
        }
        handleValidations({ name: name, value: value });
    }

    const getInvoiceData = (id) => {
        InvoicesApi.getInvoice(id).then((response) => {
            if (response.data.statusCode == 1003) {

                if (location.state.action === "clone") {
                    let docArr = [
                        {
                            id: "",
                            new_document_id: "",
                            document_name: "",
                        }
                    ];
                    setState({ ...response.data.data, order_number: "", documents: docArr });
                } else {
                    setState({ ...response.data.data })
                }

                if (location.state.action === "edit") {
                    setRefId(response.data.data.reference_id)
                }
                getClientEmployeesDropdown(response.data.data.company_id);
            }
        });
    }

    const sendForApprove = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (state.shipping_address.length > 0 || state.billing_address.length > 0) {
                if (state.ledger_item_details.some((i) => checkEmployeeTimesheetTable(i))) {
                    addWarningMsg(" please select valid employee Or enter valid employee data");
                } else {
                    if (state.documents.some((i) => i.new_document_id == "" && i.id == "")) {
                        addWarningMsg(" Attach supporting Documents are required.");
                    } else {
                        if (location.state === null) {
                            storeInvoice();
                        } else {
                            if (location.state.action === "clone" || location.state.action === "generate_invoice") {
                                storeInvoice();
                            } else {
                                updateInvoice();
                            }
                        }
                    }
                }
            } else {
                addErrorMsg("Please select the address")
            }
        } else {
            setError(errors);
            addWarningMsg("Please verify and resubmit the form as some fields have not been filled in or contain invalid data");
        }
    }

    const checkEmployeeTimesheetTable = (i) => {
        return [i.employee_id == "", i.employee_id == null, i.employee_id == undefined, i.placement_id == "", i.placement_id == null, i.placement_id == undefined, i.rate == "", i.rate == null, i.rate == undefined].includes(true);
    }

    const storeInvoice = () => {
        let data = { ...state, request_id: LocalStorage.uid() }
        if (["", null, undefined].includes(data.adjustment_amount)) {
            data.adjustment_amount = parseFloat(0).toFixed(2);
        } else {
            data.adjustment_amount = parseFloat(data.adjustment_amount).toFixed(2);
        }

        if (["", null, undefined].includes(data.discount_value)) {
            data.discount_value = parseFloat(0).toFixed(2);
        } else {
            data.discount_value = parseFloat(data.discount_value).toFixed(2);
        }

        if (["", null, undefined].includes(data.discount_amount)) {
            data.discount_amount = parseFloat(0).toFixed(2);
        } else {
            data.discount_amount = parseFloat(data.discount_amount).toFixed(2);
        }


        if (data.total_amount < 1 || ["", null, undefined, NaN].includes(data.total_amount)) {
            addWarningMsg("Unable to generate an invoice due to a zero invoice amount.")
        } else {
            setLoading(true);
            InvoicesApi.storeInvoice(data).then((response) => {
                setTimeout(() => {
                    setLoading(false)
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg(response.data.message);
                        navigate("/sales/invoices");
                        // navigate("/sales", { state: { slug: "total_pending_approval_timesheets" } });
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

    }

    const updateInvoice = () => {
        let data = { ...state, request_id: LocalStorage.uid() }
        if (["", null, undefined].includes(data.adjustment_amount)) {
            data.adjustment_amount = parseFloat(0).toFixed(2);
        } else {
            data.adjustment_amount = parseFloat(data.adjustment_amount).toFixed(2);
        }

        if (["", null, undefined].includes(data.discount_value)) {
            data.discount_value = parseFloat(0).toFixed(2);
        } else {
            data.discount_value = parseFloat(data.discount_value).toFixed(2);
        }

        if (["", null, undefined].includes(data.discount_amount)) {
            data.discount_amount = parseFloat(0).toFixed(2);
        } else {
            data.discount_amount = parseFloat(data.discount_amount).toFixed(2);
        }

        if (data.total_amount < 1 || ["", null, undefined, NaN].includes(data.total_amount)) {
            addWarningMsg("Unable to generate an invoice due to a zero invoice amount.")
        } else {
            setLoading(true);
            InvoicesApi.updateInvoice(location.state.id, data).then((response) => {
                setTimeout(() => {
                    setLoading(false)
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg(response.data.message);
                        navigate("/sales/invoices");
                    } else if (response.data.statusCode == 1012) {
                        // response.data.message.errors.forEach(ele => {
                        //     addWarningMsg(ele.msg)
                        // });
                        addWarningMsg(response.data.message);
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400)
            });
        }
    }

    const validateAll = () => {
        let {
            company_id,
            order_number,
            net_pay_terms_id,
            date,
            due_date,
            terms_and_conditions,
            customer_note
        } = state;
        let errors = {};
        errors.company_id = validate_emptyField(company_id);
        errors.order_number = validate_alphaNumeric(order_number);
        errors.net_pay_terms_id = validate_emptyField(net_pay_terms_id);
        errors.date = validate_emptyField(date);
        errors.due_date = validate_emptyField(due_date);
        errors.terms_and_conditions = validate_emptyField(terms_and_conditions);
        errors.customer_note = validate_emptyField(customer_note);
        return errors;
    };

    const handleValidations = (input) => {
        let err = error;
        switch (input.name || input.tagName) {
            case "company_id":
                err.company_id = validate_emptyField(input.value);
                break;
            case "order_number":
                err.order_number = validate_alphaNumeric(input.value);
                break;
            case "net_pay_terms_id":
                err.net_pay_terms_id = validate_emptyField(input.value);
                err.due_date = "";
                break;
            case "date":
                err.date = validate_emptyField(input.value);
                break;
            case "due_date":
                err.due_date = validate_emptyField(input.value);
                break;
            case "terms_and_conditions":
                err.terms_and_conditions = validate_emptyField(input.value);
                break;
            case "customer_note":
                err.customer_note = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    };


    const addLedgerItem = () => {
        let ledgerItem = state.ledger_item_details;
        let obj = {
            new: true,
            employee_id: "",
            placement_id: "",
            hours: "00.00",
            amount: parseFloat(0).toFixed(2),
            rate: "",
            timesheets_available: false,
            timesheet_hour_ids: [],
            description: "",
        };

        ledgerItem.push(obj);
        setState({ ...state, ledger_item_details: ledgerItem });
    }
    const deleteLedgerItem = (index) => {
        let subTotalAmount;
        let totalAmount;
        let ledgerItem = state.ledger_item_details;
        ledgerItem.splice(index, 1);
        subTotalAmount = math.sum(ledgerItem.map(i => i.amount)).toFixed(2);
        let amount = math.sum([subTotalAmount, state.adjustment_amount]);
        if (state.discount_type == 2) {
            let discountAmount = math.multiply(amount, (state.discount_value / 100));
            let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
            totalAmount = TotalAmount.toFixed(2);
        }
        if (state.discount_type == 1) {
            let TotalAmount = math.subtract(amount, state.discount_value);
            totalAmount = TotalAmount.toFixed(2);
        }
        setState({ ...state, ledger_item_details: ledgerItem, sub_total_amount: subTotalAmount, total_amount: totalAmount });
    }
    const handleChangeLedgerItem = (e, index) => {
        let newState = state;
    
        if (e.target.name === "employee_id") {
            if (!["", null, undefined].includes(e.target.value[0])) {
                setPopupView(1);
                setOpenPopup(true);
                setTimesheetEmployeeId(e.target.value[0]);
                setTimesheetIndex(index)
                setTimesheetTableDisable(false);
                if (clientEmployeesList.filter((i) => i.employee_id === e.target.value[0]).length > 0) {
                    setTimesheetPlacementId(clientEmployeesList.filter((i) => i.placement_id === e.target.value[1])[0].placement_id);
                    setBillrate(clientEmployeesList.filter((i) => i.placement_id === e.target.value[1])[0].current_bill_rate);
                }
            }

        }
        else {
            if (newState.ledger_item_details[index].employee_id !== "") {
                if (e.target.name === "hours" || e.target.name === "description" || e.target.name === "rate") {
                    if (e.target.name === "hours") {
                        let regex = new RegExp(/^\d*\.?\d{0,2}$/);
                        if (regex.test(e.target.value)) {
                            let timeValue = e.target.value.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2");
                            newState.ledger_item_details[index][e.target.name] = timeValue;
                            let billRate = newState.ledger_item_details[index].rate == "" ? 0 : newState.ledger_item_details[index].rate;
                            let subTotalAmount;
                            let amount
                            newState.ledger_item_details[index].amount = math.multiply(timeValue, billRate).toFixed(2);
                            subTotalAmount = math.sum(newState.ledger_item_details.map(i => i.amount));
                            newState.sub_total_amount = subTotalAmount.toFixed(2);
                            amount = math.sum([subTotalAmount, newState.adjustment_amount]);
                            if (newState.discount_type == 2) {
                                let discountAmount = math.multiply(amount, (newState.discount_value / 100));
                                let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
                                newState.total_amount = TotalAmount.toFixed(2);
                            }
                            if (newState.discount_type == 1) {
                                let TotalAmount = math.subtract(amount, newState.discount_value);
                                newState.total_amount = TotalAmount.toFixed(2);
                            }
                        }
                        // newState.ledger_item_details[index][e.target.name] = e.target.value.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2");

                        // if (e.target.value.length < 6) {
                        //     let time = handleChangeTime(e.target.value);

                        //     let subTotalAmount;
                        //     let billRate = newState.ledger_item_details[index].rate;
                        //     newState.ledger_item_details[index][e.target.name] = time;
                        //     if (billRate === null || billRate === "" || billRate === undefined) {
                        //         billRate = 0;
                        //     }

                        //     newState.ledger_item_details[index].amount = e.target.value === "" ? 0 * parseInt(billRate) : getAmountPerTime(time, billRate);
                        //     subTotalAmount = math.sum(newState.ledger_item_details.map(i => i.amount));
                        //     newState.sub_total_amount = subTotalAmount.toFixed(2);
                        //     let amount = math.sum([subTotalAmount, newState.adjustment_amount]);

                        //     if (newState.discount_type == 2) {
                        //         let discountAmount = math.multiply(amount, (newState.discount_value / 100));
                        //         let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
                        //         newState.total_amount = TotalAmount.toFixed(2);
                        //     }
                        //     if (newState.discount_type == 1) {
                        //         let TotalAmount = math.subtract(amount, newState.discount_value);
                        //         newState.total_amount = TotalAmount.toFixed(2);
                        //     }
                        // }
                    } else if (e.target.name === "rate") {
                        let regex = new RegExp(/^\d*\.?\d{0,2}$/);
                        if (regex.test(e.target.value)) {
                            let subTotalAmount;
                            let hours = newState.ledger_item_details[index].hours;
                            let billRate = e.target.value;
                            if (billRate === null || billRate === "" || billRate === undefined) {
                                billRate = 0;
                            }
                            if (hours === null || hours === "" || hours === undefined) {
                                hours = 0;
                            }
                            newState.ledger_item_details[index].rate = e.target.value == "" ? parseFloat(0).toFixed(2) : billRate.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2");
                            // newState.ledger_item_details[index].amount = ["", null, undefined].includes(hours) ? parseFloat(0).toFixed(2) : getAmountPerTime(hours, billRate);
                            newState.ledger_item_details[index].amount = ["", null, undefined].includes(hours) ? parseFloat(0).toFixed(2) : math.multiply(hours, billRate).toFixed(2);
                            // subTotalAmount = newState.ledger_item_details.reduce((partialSum, { amount }) => partialSum + parseInt(amount), 0);

                            subTotalAmount = math.sum(newState.ledger_item_details.map(i => i.amount));
                            newState.sub_total_amount = subTotalAmount.toFixed(2);
                            let amount = math.sum([subTotalAmount, newState.adjustment_amount]);
                            if (newState.discount_type == 2) {
                                // let discountAmount = amount * (parseInt(newState.discount_value) / 100);
                                let discountAmount = math.multiply(amount, (newState.discount_value / 100));
                                // let TotalAmount = amount - parseInt(discountAmount);
                                let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
                                newState.total_amount = TotalAmount.toFixed(2);
                            }
                            if (newState.discount_type == 1) {
                                // let TotalAmount = amount - parseInt(newState.discount_value);
                                let TotalAmount = math.subtract(amount, newState.discount_value);
                                newState.total_amount = TotalAmount.toFixed(2);
                            }
                        }
                    } else {
                        newState.ledger_item_details[index][e.target.name] = e.target.value;
                    }
                    setState({ ...newState });
                }
            }
        }
    }

    function timeToPercentage(time) {
        // Split the time string into hours and minutes
        var parts = time.split('.');
        var hours = parseInt(parts[0]);
        var minutes = parseInt(parts[1]);

        // Calculate total minutes
        var totalMinutes = hours * 60 + minutes;

        // Calculate percentage
        var percentage = (totalMinutes / 60);

        return percentage;
    }


    // const handleChangeTime = (timeValue) => {
    //     // setIsEditing(true)
    //     // if (e.target.name == "default_hours") {
    //     let input = timeValue.replace(/\D/g, "").substring(0, 5);

    //     console.log(input, "  hours  and minutes")

    //     const first = input.substring(0, 2);
    //     const second = input.substring(2, 5);
    //     // if (input.length > 2) {
    //     //     return `${first}:${second}`;
    //     //     // setState({ ...state, [e.target.name]: `${first}:${second}` });
    //     // } else {
    //     //     return input;
    //     //     // setState({ ...state, [e.target.name]: input });
    //     // }

    //     if (input.length > 2) {
    //         var mm = parseInt(second);
    //         if (mm > 59) {
    //             if (first < 23) {
    //                 var sec = second - 60;
    //                 var fOne = parseInt(first) + 1;
    //                 return `0${fOne}:${sec}`;
    //                 // setState({ ...state, [e.target.name]: `0${fOne}:${sec}` });
    //                 // handleValidations(e.target);
    //             } else {
    //                 return `${first}:${59}`;
    //                 // setState({ ...state, [e.target.name]: `${first}:${59}` });
    //                 // handleValidations(e.target);
    //             }
    //         } else {
    //             return `${first}:${second}`;
    //             // setState({ ...state, [e.target.name]: `${first}:${second}` });
    //             // handleValidations(e.target);
    //         }
    //     } else {
    //         return input;
    //     }
    // };


    const selectTimesheetManually = () => {
        let newState = state;
        newState.ledger_item_details[timesheetIndex].employee_id = timesheetEmployeeId;
        newState.ledger_item_details[timesheetIndex].placement_id = timesheetPlacementId;
        newState.ledger_item_details[timesheetIndex].rate = billrate;
        newState.ledger_item_details[timesheetIndex].timesheet_hour_ids = [];
        newState.ledger_item_details[timesheetIndex].timesheets_available = false;
        setState({ ...newState });
        setOpenPopup(null);
    }

    const openTimesheetpopup = (config) => {
        setPopupView(3);
        setTimesheetConfiguration(config)
    }

    const selectAddress = (slug, data) => {

        // console.log(data, " 00000");
        let keyName;
        let arr = [];
        arr.push(data)
        if (slug === "billing") {
            keyName = "billing_address";
        }
        if (slug === "shipping") {
            keyName = "shipping_address";
        }
        setState({ ...state, [keyName]: arr })

    }

    const deleteFieldField = (index) => {

        let docsArr = state.documents;
        docsArr.splice(index, 1);
        setState({ ...state, documents: docsArr });
    }
    const addDocField = () => {

        let arr = state.documents;
        arr.push({
            id: "",
            new_document_id: "",
            document_name: "",
        })

        setState({ ...state, documents: arr })
    }

    const saveTimesheet = (hours, idsArr, config, timesheetDates) => {
        let newState = state;
        let subTotalAmount;
        let obj = {
            employee_id: timesheetEmployeeId,
            placement_id: timesheetPlacementId,
            rate: ["", null, undefined].includes(billrate) ? 0 : billrate,
            timesheet_hour_ids: idsArr,
            timesheets_available: true,
            hours: timeToPercentage(hours).toFixed(2),
            amount: math.multiply(timeToPercentage(hours).toFixed(2), ["", null, undefined].includes(billrate) ? 0 : billrate,).toFixed(2),
            description: "",
        };

        if (moment(timesheetDates.start_date).isSame(moment(timesheetDates.end_date).format(dateFormat()))) {
            obj.description = `Invoice of ${moment(timesheetDates.start_date).format(dateFormat())}`;
        } else {
            obj.description = `Invoice From ${moment(timesheetDates.start_date).format(dateFormat())} To ${moment(timesheetDates.end_date).format(dateFormat())}`;
        }


        newState.ledger_item_details[timesheetIndex] = { ...newState.ledger_item_details[timesheetIndex], ...obj }

        subTotalAmount = math.sum(newState.ledger_item_details.map(i => i.amount));

        newState.sub_total_amount = subTotalAmount.toFixed(2);

        let amount = math.sum([subTotalAmount, newState.adjustment_amount]);

        if (newState.discount_type == 2) {
            let discountAmount = math.multiply(amount, (newState.discount_value / 100));
            let TotalAmount = math.subtract(amount, discountAmount.toFixed(2));
            newState.total_amount = TotalAmount.toFixed(2);
        }
        if (newState.discount_type == 1) {
            let TotalAmount = math.subtract(amount, newState.discount_value);
            newState.total_amount = TotalAmount.toFixed(2);
        }

        setOpenPopup(null);
        setPopupView(null);
        setTimesheetTableDisable(true);
        setState({ ...newState });
    }

    // const getAmountPerTime = (timeSpent, billrateAmount) => {

    //     if (timeSpent.includes(":")) {
    //         let amountPerhour = billrateAmount;
    //         let time = timeSpent.split(":");
    //         let hours = time[0];
    //         let mins = time[1];
    //         let amount = (+hours + +mins / 60) * amountPerhour;
    //         return parseFloat(amount).toFixed(2);
    //     } else {
    //         return parseInt(timeSpent) * parseInt(billrateAmount)
    //     }
    // }

    const handleChangeAddressSameAs = (e) => {
        setAddressSameAs(e.target.checked)
        if (e.target.checked) {
            setState({ ...state, shipping_address: state.billing_address })
        } else {
            setState({ ...state, shipping_address: [] })
        }
    }


    const viewTimesheetData = (index) => {

        let ledgerItemObj = state.ledger_item_details[index];


        setTimesheetEmployeeId(ledgerItemObj.employee_id);
        setTimesheetIndex(index);
        setTimesheetPlacementId(ledgerItemObj.placement_id);
        setBillrate(ledgerItemObj.rate);

        setTimesheetTableDisable(true);

        setPopupView(3)
        setOpenPopup(true)


        // if (clientEmployeesList.filter((i) => i.employee_id === e.target.value).length > 0) {
        //     setTimesheetPlacementId(clientEmployeesList.filter((i) => i.employee_id === e.target.value)[0].placement_id);
        //     setBillrate(clientEmployeesList.filter((i) => i.employee_id === e.target.value)[0].current_bill_rate);
        // }

    }

    const AddTimesheetData = (index) => {
        let ledgerItemObj = state.ledger_item_details[index];


        setTimesheetEmployeeId(ledgerItemObj.employee_id);
        setTimesheetIndex(index);
        setTimesheetPlacementId(ledgerItemObj.placement_id);
        setBillrate(ledgerItemObj.rate);
        setTimesheetTableDisable(false);
        setPopupView(2)
        setOpenPopup(true)
    }

    const closeTimesheetPopUp = () => {
        setOpenPopup(false);
        setPopupView(null)
        setTimesheetTableDisable(true);
        setTimesheetEmployeeId("");
        setTimesheetIndex("");
        setTimesheetPlacementId("");
        setBillrate("");
    }


    return (
        <Box sx={{ width: "100%" }}>
            <Box px={1} sx={{ marginLeft: "76px" }}>

                <Box mx={3}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography component={Link} to={'/sales/invoices'} className={classes.breadcrumbsLink}>Sales</Typography>
                        <Typography component={Link} to={'/sales/invoices'} className={classes.breadcrumbsLink}>Invoices</Typography>
                        <Typography className={classes.breadcrumbsName}> {` ${location.state == null ? "New" : location.state.action === "edit" ? "Edit" : "New"} Invoices`}  </Typography>
                    </Breadcrumbs>
                </Box>
                <Box mx={3} pt={1} >
                    <Box p={1} sx={{ boxShadow: "0px 2px 24px 0px #919EAB1F", borderRadius: "12px", minHeight: "72vh", }}>
                        <Box sx={{ height: "70px", width: "100%", display: "flex", alignItems: "center" }}>
                            <Grid container spacing={0}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box px={2} py={1}><Text className={classes.title}>New Invoice</Text></Box>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    {
                                        refId !== "" ?
                                            <Box px={2} py={1} >
                                                <Text className={classes.invoiceNumber}>{refId}</Text>
                                                <Text className={classes.invoiceNumberCaption}>Invoice Number (Auto Generated)</Text>
                                            </Box> : null
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ height: "60vh", overflow: "auto" }}>
                            <Grid container spacing={0}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box p={1} my={1} mx={1}>
                                        <SearchSelect
                                            name='company_id'
                                            value={state.company_id}
                                            onChange={handleChange}
                                            options={clientsList}
                                            labelText={<Text largeLabel>Client Name</Text>}
                                            scrollTrue
                                            disabled={location.state == null ? false : location.state.action == "generate_invoice"}
                                        />
                                        <Text errorText> {error.company_id ? error.company_id : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <Box p={1} m={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'order_number',
                                                // value: formData.end_client_id === "" ? "" : placementsList.length > 0 ? placementsList.filter((i) => i.end_client_id === formData.end_client_id)[0]?.end_client_name : "",
                                                value: state.order_number,
                                                type: 'text',
                                                // disabled: true
                                                inputProps: { maxLength: 150 }
                                            }}
                                            handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Order Number</Text>}
                                        // labelText={<Text largeLabel>Order Number <span className={classes.optional}>(Optional)</span></Text>}
                                        />
                                        <Text errorText> {error.order_number ? error.order_number : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <Box p={1} mx={1} >
                                        {/* <SearchSelect
                                            name='net_pay_terms_id'
                                            value={state.net_pay_terms_id}
                                            onChange={handleChange}
                                            options={clientsList}
                                            labelText={<Text largeLabel>Payment Terms</Text>}
                                            scrollTrue
                                        />
                                        <Text errorText> {error.net_pay_terms_id ? error.net_pay_terms_id : ""}</Text> */}



                                        {formTT == 'net_pay_terms_id' ?
                                            (<HtmlTooltip
                                                title={
                                                    <AddNetPayTerms formTT={setOpentooltip} getList={netPayterms} />
                                                }
                                            >
                                                <Box pt={'9px'}>
                                                    <SearchSelect
                                                        name='net_pay_terms_id'
                                                        value={state.net_pay_terms_id}
                                                        options={payTerms}
                                                        labelText={<Text largeLabel>Net Pay Terms</Text>}
                                                        onChange={handleChange}
                                                        onClick={() => {
                                                            setFormTT('net_pay_terms_id');
                                                            tooltipToggle()
                                                        }}
                                                        buttonName='Net Pay Terms'
                                                    />
                                                    <Text errorText> {error.net_pay_terms_id ? error.net_pay_terms_id : ""}</Text>
                                                </Box>
                                            </HtmlTooltip>) :
                                            <Box pt={'9px'}>
                                                <SearchSelect
                                                    name='net_pay_terms_id'
                                                    value={state.net_pay_terms_id}
                                                    options={payTerms}
                                                    labelText={<Text largeLabel>Net Pay Terms</Text>}
                                                    onChange={handleChange}
                                                    onClick={() => {
                                                        setFormTT('net_pay_terms_id');
                                                        tooltipToggle()
                                                    }}
                                                    buttonName='Net Pay Terms'
                                                />
                                                <Text errorText> {error.net_pay_terms_id ? error.net_pay_terms_id : ""}</Text>
                                            </Box>
                                        }


                                    </Box>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <Box p={1} m={1} >
                                        <Datepicker
                                            labelText="Invoice Date"
                                            name="date"
                                            value={state.date}
                                            minDate={moment().format(dateFormat())}
                                            onChange={(e) => handleChangeDate(e.$d, "date")}
                                        />
                                        <Text errorText> {error.date ? error.date : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <Box p={1} m={1} >
                                        <Datepicker
                                            labelText={"Due Date"}
                                            name={"due_date"}
                                            value={state.due_date}
                                            onChange={(e) => handleChangeDate(e.$d, "due_date")}
                                            disabled={true}
                                        />
                                        <Text errorText> {error.due_date ? error.due_date : ""}</Text>
                                    </Box>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>

                            </Grid>

                            <Box px={2} py={1}>
                                {
                                    location.state == null ? <EmployeeInvoiceTable AddTimesheetData={AddTimesheetData} viewTimesheetData={viewTimesheetData} ledgerItems={state.ledger_item_details} clientEmployeesList={clientEmployeesList} deleteLedgerItem={deleteLedgerItem} handleChangeLedgerItem={handleChangeLedgerItem} /> :
                                        clientEmployeesList.length > 0 ?
                                            <EmployeeInvoiceTable AddTimesheetData={AddTimesheetData} viewTimesheetData={viewTimesheetData} ledgerItems={state.ledger_item_details} clientEmployeesList={clientEmployeesList} deleteLedgerItem={deleteLedgerItem} handleChangeLedgerItem={handleChangeLedgerItem} /> :
                                            null

                                }


                            </Box>
                            <Box px={2} py={1}>
                                <Grid container spacing={0}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        {/* <CustomButton outlineBlue startIcon={<Plus />}>Add Employee Section</CustomButton> */}
                                        {
                                            location.state !== null ?
                                                location.state.action === "generate_invoice" ? null :
                                                    <CustomButton outlineBlueAutoAdd startIcon={<PlusBlue />} onClick={() => addLedgerItem()} >Add Employee Section</CustomButton> :
                                                <CustomButton outlineBlueAutoAdd startIcon={<PlusBlue />} onClick={() => addLedgerItem()} >Add Employee Section</CustomButton>
                                        }
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <Box sx={{ width: "100%", display: 'flex', justifyContent: "end" }}>
                                            <Box px={3} py={1} sx={{ width: "400px", border: " 1px solid #E2E5E6", borderRadius: "8px", backgroundColor: "#f4f4f4" }}>
                                                <DiscountTable state={state} handleChange={handleChange} />
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box px={2} py={1}>
                                <Grid container spacing={4}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>

                                        {/* {console.log(state, " -----------++++++++")} */}
                                        <ClientAddress label={"Billing Address"} data={state.billing_address.length > 0 ? state.billing_address[0] : null} slug={"billing"} companyId={state.company_id} selectAddress={selectAddress} />
                                        {/* <Text errorText> {error.company_id ? error.company_id : ""}</Text> */}
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <ClientAddress label={"Shipping Address"} data={state.shipping_address.length > 0 ? state.shipping_address[0] : null} slug={"shipping"} companyId={state.company_id} selectAddress={selectAddress} />
                                        {/* <Text errorText> {error.company_id ? error.company_id : ""}</Text> */}
                                    </Grid>
                                </Grid>

                                <FormControlLabel
                                    // disabled={action === "update" ? false : true}
                                    control={
                                        <Checkbox
                                            name={"same_as_above"}
                                            onChange={handleChangeAddressSameAs}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            value={addressSameAs}
                                            checked={addressSameAs}
                                        />}
                                    label={<Text checkboxlable >{"Shipping Address Same as  Billing Address"}</Text>}
                                />

                            </Box>
                            <Box px={2} py={2}>
                                <Divider />
                            </Box>
                            <Box px={2} py={1}>

                                <Grid container spacing={4}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <Box py={1} my={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'customer_note',
                                                    // value: formData.end_client_id === "" ? "" : placementsList.length > 0 ? placementsList.filter((i) => i.end_client_id === formData.end_client_id)[0]?.end_client_name : "",
                                                    value: state.customer_note,
                                                    type: 'text',
                                                    inputProps: {
                                                        maxLength: 250
                                                    }
                                                    // disabled: true
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Customer Note</Text>}
                                            // labelText={<Text largeLabel>End Client <span className={classes.optional}>(Optional)</span></Text>}
                                            />
                                            <Text errorText> {error.customer_note ? error.customer_note : ""}</Text>
                                        </Box>

                                        {
                                            state.documents.map((doc, key) => (
                                                <Box py={1} my={1} key={key}>
                                                    <Box sx={{ width: '100%', display: "flex" }}>
                                                        <Box sx={{ width: '86%' }}>
                                                            <FileInput
                                                                name={"document_name"}
                                                                FileName={doc.document_name}
                                                                handleChange={(e) => uploadDocs(e, key)}
                                                                label={"Attach supporting Document"} isDisabled={false} />
                                                            {/* <Text errorText> {error.document_name ? error.document_name : ""}</Text> */}
                                                        </Box>
                                                        <Box sx={{ width: '14%', height: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <IconButton onClick={() => addDocField()}>
                                                                <PlusGray />
                                                            </IconButton>
                                                            {
                                                                state.documents.length > 1 ?

                                                                    <IconButton onClick={() => deleteFieldField(key)}>
                                                                        <DeleteSvg />
                                                                    </IconButton> : null
                                                            }
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))
                                        }

                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <Box py={1} my={1}>
                                            <Textarea className={classes.textarea} type="text" maxLength={600} name="terms_and_conditions" value={state.terms_and_conditions} aria-label="minimum height" minRows={6} onChange={handleChange} placeholder="Terms & Condition" sx={{ resize: "none" }} />
                                            <Text errorText> {error.terms_and_conditions ? error.terms_and_conditions : ""}</Text>
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Box>
                    </Box>


                    <Stack direction="row" spacing={2} my={2} justifyContent={"end"}>
                        <CustomButton
                            outlineBlueMedium
                            largeCancelText
                            redHover
                            // onClick={() => navigate("/sales/invoices")}
                            onClick={
                                () => {
                                    setPopupView(4);
                                    setOpenPopup(true);

                                    // if (location.state !== null) {
                                    //     navigate('/sales/invoices/invoices-history', { state: { data: { id: location.state.id, company_id: location.state.company_id }, pagination: location.state.pagination, } })
                                    // } else {
                                    //     navigate("/sales/invoices")
                                    // }

                                }
                            }
                        >
                            Cancel
                        </CustomButton>
                        {
                            location.state === null ?
                                <LoadingButton saveLoader saveLoadersmall loading={loading} onClick={() => sendForApprove()}>Save</LoadingButton> :
                                ["clone", "generate_invoice"].includes(location.state.action) ? <LoadingButton saveLoader saveLoadersmall loading={loading} onClick={() => sendForApprove()}>Save</LoadingButton> :
                                    <LoadingButton saveLoaderAutoWidth loading={loading} onClick={() => sendForApprove()}>Update</LoadingButton>
                        }
                    </Stack>


                </Box>
            </Box>


            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={openPopup}
            >

                <DialogContent>
                    {
                        popupView === 1 ? <ConfirmPopup popupView={popupView} setPopupView={setPopupView} setOpenPopup={setOpenPopup} selectTimesheetManually={selectTimesheetManually} /> : null
                    }
                    {
                        popupView === 2 ? <ConfirmPopup popupView={popupView} setOpenPopup={setOpenPopup} openTimesheetpopup={openTimesheetpopup} /> : null
                    }
                    {
                        popupView === 3 ? <TimesheetConfig ledgerItem={state.ledger_item_details[timesheetIndex]} closeTimesheetPopUp={closeTimesheetPopUp} timesheetTableDisable={timesheetTableDisable} saveTimesheet={saveTimesheet} setPopupView={setPopupView} setOpenPopup={setOpenPopup} timesheetConfiguration={timesheetConfiguration} placementId={timesheetPlacementId} employeeId={timesheetEmployeeId} /> : null
                    }
                    {
                        popupView === 4 ?
                            <Box p={1} sx={{ width: "500px", position: "relative" }}>

                                <Box sx={{ display: "flex", position: "absolute", zIndex: "1", top: "2px", right: "0px" }}>
                                    <CloseIcon onClick={() => closeTimesheetPopUp()} style={{ cursor: 'pointer' }} />
                                </Box>


                                <Box>

                                    <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                        <img src={warningImg} alt="warning" />
                                    </Box>

                                    <Box my={3}>
                                        <Text my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                                            Are You Sure to Cancel?
                                        </Text>
                                        <Text my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                                            Do You Really Wish To Cancel The Invoice
                                        </Text>
                                    </Box>
                                    <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                                        <CustomButton
                                            outlineBlue
                                            largeCancelText
                                            onClick={
                                                () => {
                                                    setOpenPopup(false);
                                                    setPopupView(null);
                                                }
                                            }
                                            sx={{ width: "168px" }}
                                        >
                                            Not Now
                                        </CustomButton>
                                        <CustomButton deleteBtn loading={loading}
                                            onClick={
                                                () => {
                                                    if (location.state !== null) {
                                                        navigate('/sales/invoices/invoices-history', { state: { data: { id: location.state.id, company_id: location.state.company_id }, pagination: location.state.pagination, } })
                                                    } else {
                                                        navigate("/sales/invoices")
                                                    }
                                                }
                                            }
                                        >
                                            Yes, Cancel
                                        </CustomButton>
                                    </Box>
                                </Box>
                            </Box> : null
                    }
                </DialogContent>
            </BootstrapDialog>
        </Box >
    );
}
