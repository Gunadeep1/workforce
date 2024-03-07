import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Breadcrumbs, Grid, Stack, SwipeableDrawer, Menu, MenuItem, Divider, Tab, Tabs, Avatar, Checkbox, } from "@mui/material";
import Button from '../../../../components/customButton/Button';
import InvoicesDashboardStyles from '../invoices/InvoicesDashboardStyles';
import Text from '../../../../components/customText/Text';
import ClockIcon from '../../../../assets/svg/clockIn.svg';
import DownloadIcon from '../../../../assets/svg/downloadIn.svg';
import EditIcon from '../../../../assets/svg/editIn.svg';
import MenuIcon from '../../../../assets/svg/menuIconin.svg';
import NoDataFoundIcon from '../../../../assets/svg/NoDataFoundIcon.svg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { addSuccessMsg, getCurrencySymbol } from '../../../../utils/utils';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { ReactComponent as CloseIcon } from '../../../../assets/svg/cross.svg';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { ReactComponent as ActivityCheckIcon } from '../../../../assets/svg/ActivityCheckIcon.svg';
import Input from '../../../../components/input/Input';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import FileInput from '../../../../components/muiFileInput/FileInput';
import DatePicker from '../../../../components/datePicker/Date';
import Badge from '@mui/material/Badge';
import Filterlines from '../../../../assets/svg/filter-lines.svg';
import LoaderIcon from '../../../../assets/svg/sandtimer.svg';
import ProfileCard from '../CustomCard';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CommonApi from '../../../../apis/CommonApi';
import moment from "moment";
import { addErrorMsg, dateFormat, addWarningMsg } from '../../../../utils/utils';
import { validate_emptyField, validates_Integer, isValid } from "../../../../components/Validation";
import LocalStorage from '../../../../utils/LocalStorage';
import InvoicesApi from '../../../../apis/admin/sales/InvoicesApi';
import BillsApi from '../../../../apis/admin/sales/BillsApi';
import FileSaver from 'file-saver';
import { ReactComponent as BellIcon } from '../../../../assets/svg/bellIn.svg';
import { ReactComponent as MailIcon } from '../../../../assets/svg/mailIn.svg';
import { create, all } from 'mathjs';
import disableReminder from '../../../../assets/client/disableReminders.svg';
import disableMail from '../../../../assets/client/disableMail.svg';

const math = create(all);

const FilterBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 3,
        background: '#FF4B55 !important',
        border: '1px solid #FFFF',
        color: '#FFFF !important',

    },
}));


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        font: '12px Nunito !important',
        backgroundColor: "#404040",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #404040"
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#404040",
        "&::before": {
            backgroundColor: "#404040",
            border: "1px solid #404040"
        }
    },
}));


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "8px",
    },
    "& .MuiDialogContent-root": {
        padding: '0px !important'
    },
    "& .MuiDialogActions-root": {
        padding: '0px !important'
    }
}));



export default function InvoicesView() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = InvoicesDashboardStyles();
    const navigate = useNavigate();
    const [openStatus, setOpenStatus] = useState(null);
    const [drawer, setDrawer] = useState(false);
    const [activityTab, setActivityTab] = useState(0);
    const [cardTab, setCardTab] = useState(1);
    const [indication, setIndication] = useState(false);
    const [cardStatus, setCardStatus] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState({});
    const [recurringError, setRecurringError] = useState({});
    const [popup, setPopup] = useState('');
    const [prompt, setPrompt] = useState(null);
    const [invoiceForm, setInvoiceForm] = useState({});
    const location = useLocation();
    const invoice_id = location.state ? location.state.data.id ? location.state.data.id : '' : ''; // eslint-disable-next-line
    const company_id = location.state ? location.state.data.company_id ? location.state.data.company_id : '' : '';
    const [invoiceList, setInvoiceList] = useState([]);
    const [clientHistoryList, setClientHistoryList] = useState([]);
    const [paymentModeOp, setPaymentModeOp] = useState([]);
    const [paymentRecordData, setpaymentRecordData] = useState({
        request_id: '',
        reference_id: '',
        company_id: '',
        name: '',
        amount_due: '',
        total_ledger_amount: '',
        total_received_amount: '',
        total_balance_amount: 0.00,
        excess_amount: 0.00,
        received_on: '',
        payment_reference_number: '',
        payment_mode_id: '',
        debited_credits: 0,
        ledger_section_details: [],
        documents: [
            {
                new_document_id: '',
                document_name: ''
            }
        ],
        customer_note: '',
    })

    const [rejectForm, setRejectForm] = useState({
        reject_reason: '',
    })
    const [rejectError, setRejectError] = useState({});




    const [filter, setFilter] = useState({
        company_id: '',
        from_date: '',
        to_date: '',
        search: '',
        status: '',
    });

    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 4,
            totalPages: ""
        }
    );


    const [recurringData, setRecurringData] = useState({
        recurring_cycle_number: '',
        recurring_cycle_type: '',
        record_payment: '',
        recurring_start_date: '',
        recurring_end_date: '',
        recurring_count: '',
        recurring_never_expires: false,
        custom_recurring_cycle_type: '',
        custom_recurring_cycle_number: ''
    })

    const daysOption = [
        {
            value: 'Days', id: 1,
        },
        {
            value: 'Weeks', id: 2,
        },
        {
            value: 'Months ', id: 3,
        },
        {
            value: 'Year ', id: 4,
        },
    ]




    useEffect(() => {
        billListingApi(filter, location.state.pagination ? { ...location.state.pagination, currentPage: 1, perPage: math.multiply(location.state.pagination.currentPage, location.state.pagination.perPage) } : pagination);
        // getVendorBillsList({ ...filter, company_id: company_id }, location.state.pagination ? location.state.pagination : pagination);
        getBillIndexApi(invoice_id);
        getPaymentModeDropdown();
        // eslint-disable-next-line  
    }, [])

    const getBillIndexApi = (id) => {
        setLoading(true);
        setSelected(id);
        BillsApi.getBillIndexApi(id).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setInvoiceForm(res.data.data);
                }
            }, 200)
        })
    }

    const billListingApi = (filterData, paginationData) => {
        setListLoading(true);
        BillsApi.getAllBillsList(filterData, paginationData).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setListLoading(false);
                    moveObjectToTopById(res.data.data, invoice_id);
                } if (res.data.data.length > 0) {
                    setPagination(res.data.pagination);
                }
            }, 200)
        })
    }

    const getVendorBillsList = (filterData, paginationData) => {
        setListLoading(true);
        setFilter(filterData);
        BillsApi.getVendorBillsList(filterData, paginationData).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setListLoading(false);
                    setClientHistoryList(res.data.data)
                } if (res.data.data.length > 0) {
                    setPagination(res.data.pagination);
                }
            }, 200)
        })
    }

    const updateInvoiceStatus = (args) => {
        recurringData['request_id'] = LocalStorage.uid()
        recurringData['ledger_id'] = invoiceForm.id
        recurringData['status_key'] = args
        InvoicesApi.updateInvoiceRecurring('bill', recurringData).then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg(res.data.message)
                billListingApi(filter, location.state.pagination ? location.state.pagination : pagination);
                getBillIndexApi(selected === null ? invoice_id : selected);
                getVendorBillsList({ ...filter, company_id: invoiceForm.company_id }, pagination);
                handleClose();
            } else {
                addErrorMsg(res.data.message)
            }
        })
    }

    const getPaymentModeDropdown = () => {
        InvoicesApi.getPaymentModeDropdown('').then((res) => {
            if (res.data.statusCode === 1003) {
                setPaymentModeOp(res.data.data)
            } else {
                addErrorMsg(res.data.message)
            }
        })
    }

    const storeBillPayment = (data) => {
        const obj = {
            ledger_id: invoiceForm.id,
            amount: invoiceForm.total_amount,
            received_amount: paymentRecordData.total_received_amount,
            balance_amount: paymentRecordData.total_balance_amount,
        }
        data.ledger_section_details = [obj];
        BillsApi.storeBillPayment(data).then((res) => {
            if (res.data.statusCode === 1003) {
                setOpen(false);
                addSuccessMsg(res.data.message)
                billListingApi(filter, location.state.pagination ? location.state.pagination : pagination);
                getBillIndexApi(selected === null ? invoice_id : selected);
                getVendorBillsList({ ...filter, company_id: invoiceForm.company_id }, pagination);
                setpaymentRecordData({
                    name: '',
                    total_ledger_amount: '',
                    total_received_amount: '',
                    total_balance_amount: '',
                    excess_amount: '',
                    received_on: '',
                    amount_due: '',
                    payment_reference_number: '',
                    payment_mode_id: '',
                    documents: [
                        {
                            new_document_id: '',
                            document_name: ''
                        }
                    ],
                    customer_note: '',
                })
            } else {
                addErrorMsg(res.data.message)
            }
        })
    }

    const handleInvoiceFormData = (id) => {
        getBillIndexApi(id)
    }


    const handleRejectForm = (e) => {
        setRejectForm({ ...rejectForm, [e.target.name]: e.target.value })
        handleRejectFormValidations(e);
    };

    const handleRejectFormValidations = (e) => {
        let input = e.target;
        let err = rejectError;
        switch (input.name || input.tagName) {
            case "reject_reason":
                err.reject_reason = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setRejectError(err);
    }

    const rejectFormvalidateAll = () => {
        let { reject_reason } = rejectForm;
        let errors = {};
        errors.reject_reason = validate_emptyField(reject_reason);
        return errors;

    };


    const handleRejectFromSubmit = () => {
        let errors = rejectFormvalidateAll();
        if (isValid(errors)) {
            handlePrompt('reject')
            setOpen(false);
        } else {
            setRejectError(errors);
        }
    }


    const downloadDoc = (fileUrl) => {
        BillsApi.downloadInvoice(selected).then((res) => {
            if (res.data.statusCode === 1003) {
                FileSaver.saveAs(res.data.data.pdf_link);
            } else {
                addErrorMsg(res.data.message)
            }
        })
        FileSaver.saveAs(fileUrl);
    }


    const opStatus = Boolean(openStatus);
    const filterMenu = Boolean(cardStatus);

    const loadeMore = () => {

        if (cardTab === 0) {
            getVendorBillsList(filter, { perPage: parseInt(pagination.perPage) + 4, currentPage: 1 });
        }
        if (cardTab === 1) {
            billListingApi(filter, { perPage: parseInt(pagination.perPage) + 4, currentPage: 1 });
        }

    }


    const steps = [
        {
            id: 1,
            label: 'Rahul Has Viewed Invoice. ',
            date: '10:00am 22-Sep-2023',
            description: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book.'

        },
        {
            id: 2,
            label: 'Mark Has Created Invoice.',
            date: '10:00am 22-Sep-2023',
            description: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'

        },
        {
            id: 3,
            label: 'Mark Has Created Invoice.',
            date: '10:00am 22-Sep-2023',
            description: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'

        },
        {
            id: 4,
            label: 'Mark Has Created Invoice.',
            date: '10:00am 22-Sep-2023',
            description: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'

        },
    ];



    const payments = [
        {
            id: 1,
            label: 'Payment Recorded ',
            date: '10:00am 22-Sep-2023',
            amount: '300',
            ref_id: '001',

        },
        {
            id: 2,
            label: 'Payment Recorded',
            date: '10:00am 22-Sep-2023',
            amount: '300',
            ref_id: '002',

        },
        {
            id: 3,
            label: 'Payment Recorded',
            date: '10:00am 22-Sep-2023',
            amount: '800',
            ref_id: '003',

        },
        {
            id: 4,
            label: 'Invoice Has Been Viewed',
            date: '10:00am 22-Sep-2023',
            amount: '500',
            ref_id: '004',

        },
        {
            id: 5,
            label: 'Invoice Has Been Viewed',
            date: '10:00am 22-Sep-2023',
            amount: '500',
            ref_id: '005',

        },
        {
            id: 6,
            label: 'Invoice Has Been Viewed',
            date: '10:00am 22-Sep-2023',
            amount: '500',
            ref_id: '006',

        },
        {
            id: 7,
            label: 'Invoice Has Been Viewed',
            date: '10:00am 22-Sep-2023',
            amount: '500',
            ref_id: '004',

        },
        {
            id: 8,
            label: 'Invoice Has Been Viewed',
            date: '10:00am 22-Sep-2023',
            amount: '500',
            ref_id: '005',

        },
        {
            id: 9,
            label: 'Invoice Has Been Viewed',
            date: '10:00am 22-Sep-2023',
            amount: '500',
            ref_id: '006',

        },
    ];


    function moveObjectToTopById(data, id) {
        const index = data.findIndex(obj => obj.id === id);
        if (index !== -1) {
            const movedObject = data.splice(index, 1)[0];
            data.unshift(movedObject);
            setInvoiceList(data);
        } else {
            setInvoiceList(data);
        }
    }





    const handleStatus = (args) => {
        setOpenStatus(null);
        if (args === 'mark_as_recurring') {
            if (invoiceForm.ledger_item_details.some(i => i.timesheets_available == true)) {
                addWarningMsg(`Performing invoice recurring is not permitted when thimesheets is true.`);
            } else {
                setPopup('recurring');
                setOpen(true);
            }
            // setPopup('recurring');
            // setOpen(true)
        } else if (args == 'stop_recurring') {
            if (invoiceForm.enable_recurring == true) {
                setPrompt(args);
                setPopup('common_prompt')
                setOpen(true)
                setLoading(false)
                setIndication(false)
            } else {
                addWarningMsg(`Performing Stop recurring is not permitted as Enable Rucurring is false.`);
            }
        }
        else if (
            args === 'mark_as_sent' ||
            args === 'clone' ||
            args === 'convert_to_draft' ||
            // args === 'stop_recurring' ||
            args === 'void') {
            setPrompt(args);
            setPopup('common_prompt')
            setOpen(true)
            setLoading(false)
            setIndication(false)
        }
    }

    const handleFilterStatus = (args) => {
        setCardStatus(null);

    }

    const handleActivityTab = (event, newValue) => {
        setActivityTab(newValue);
    }

    const handleCardTab = (event, newValue) => {
        setCardTab(newValue);
        setSelected(0)
        handleTabApis(newValue);
    }



    const handlePaymentMethod = () => {
        setPopup('record_payment')
        setOpen(true)
        setpaymentRecordData({
            ...paymentRecordData,
            request_id: LocalStorage.uid(),
            reference_id: invoiceForm.reference_id,
            company_id: invoiceForm.company_id,
            name: invoiceForm.name,
            total_ledger_amount: invoiceForm.total_amount,
            received_amount_previous: invoiceForm.received_amount_previous,
            // total_balance_amount: invoiceForm.balance_amount,
            amount_due: invoiceForm.balance_amount,
            debited_credits: 0,
            ledger_section_details: []
        })
    }

    // onChange handler for recurring
    const handleRecurring = (e) => {
        if (e.target.name == 'recurring_never_expires') {
            setRecurringData({ ...recurringData, [e.target.name]: e.target.checked })
        } else if (e.target.name == 'recurring_cycle_type') {
            recurringData['custom_recurring_cycle_number'] = e.target.value == 1 || e.target.value == 4 || e.target.value == 8 ? 1 : e.target.value == 2 || e.target.value == 5 || e.target.value == 9 ? 2 : e.target.value == 3 || e.target.value == 6 || e.target.value == 10 ? 3 : e.target.value == 11 ? '' : ''
            recurringData['custom_recurring_cycle_type'] = e.target.value == 1 || e.target.value == 2 || e.target.value == 3 ? 1 : e.target.value == 4 || e.target.value == 5 || e.target.value == 6 || e.target.value == 7 ? 2 : e.target.value == 8 || e.target.value == 9 || e.target.value == 10 ? 3 : e.target.value == 11 ? '' : ''
            setRecurringData({
                ...recurringData,
                [e.target.name]: e.target.value,
            })
        }
        else {
            setRecurringData({ ...recurringData, [e.target.name]: e.target.value })
        }
        handleRecurringValidations(e);
    }
    // Date Change handler for recurring
    const recurringDateChange = (e, name) => {
        let date = e.$d
        setRecurringData({
            ...recurringData,
            [name]: moment(date).format(dateFormat())
        },)
        handleRecurringValidations({ target: { name: name, value: moment(date).format(dateFormat()) } });
    }





    // onChange handler for payment Record form
    const handleRecordChange = (e) => {
        const input = e.target
        if (input.name === 'total_received_amount') {
            let regex = new RegExp(/^\d*\.?\d{0,2}$/);
            if (regex.test(e.target.value) || e.target.value == "") {
                let value = input.value.replace(/^0+([1-9]\d*|0)(\.\d+)?$/, "$1$2");
                if (input.value == "") {
                    setpaymentRecordData({ ...paymentRecordData, [input.name]: input.value, total_balance_amount: parseInt(0).toFixed(2), excess_amount: parseInt(0).toFixed(2) })
                } else {
                    if (value > paymentRecordData.amount_due) {
                        let excessAmount = math.subtract(value, paymentRecordData.amount_due);
                        setpaymentRecordData({ ...paymentRecordData, [input.name]: value, total_balance_amount: parseInt(0).toFixed(2), excess_amount: excessAmount.toFixed(2) })
                    } else {
                        let totalBalanceAmount = math.subtract(paymentRecordData.amount_due, value);
                        setpaymentRecordData({ ...paymentRecordData, [input.name]: value, total_balance_amount: totalBalanceAmount.toFixed(2), excess_amount: parseInt(0).toFixed(2) })
                    }
                }

                // total_ledger_amount

                // let TotalAmount = math.subtract(amount, discountAmount);
                // let amount = math.add(state.sub_total_amount, state.adjustment_amount);

                // if (input.value === '') {
                //     setpaymentRecordData({ ...paymentRecordData, [input.name]: input.value, total_balance_amount: invoiceForm.balance_amount, excess_amount: 0, })
                // }
                // else if (!Number.isInteger(parseInt(value))) {
                //     setpaymentRecordData({ ...paymentRecordData, [input.name]: value })
                // }
                // else if (Number.isInteger(parseInt(value)) && (parseInt(value) >= 0)) {
                //     let balance = (invoiceForm.balance_amount - parseInt(value))
                //     if (balance < 0) {
                //         setpaymentRecordData({ ...paymentRecordData, [input.name]: value, excess_amount: Math.abs(balance), total_balance_amount: 0 })
                //     }
                //     else {
                //         setpaymentRecordData({ ...paymentRecordData, [input.name]: value, total_balance_amount: balance, excess_amount: 0 })
                //     }
                // }
            }
        } else {
            setpaymentRecordData({ ...paymentRecordData, [input.name]: input.value })
        }
        handleValidations(e);
    }


    const dateChange = (e, name) => {
        let date = e.$d
        setpaymentRecordData({
            ...paymentRecordData,
            [name]: moment(date).format(dateFormat())
        },)

        handleValidations({ target: { name: name, value: moment(date).format(dateFormat()) } });
    }


    const uploadDocs = (e, index) => {
        if (e.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg'].includes(r))) {
            const fileData = new FormData();
            paymentRecordData.documents[index].document_name = e.target.files[0].name
            setpaymentRecordData({ ...paymentRecordData })
            fileData.append('files', e.target.files[0]);
            fileData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("payments-document",fileData, LocalStorage.getAccessToken())
                .then((res) => {
                    if (res.data.statusCode === 1003) {
                        paymentRecordData.documents[index].new_document_id = res.data.data.id

                        setpaymentRecordData({ ...paymentRecordData })
                    } else {
                        addErrorMsg(res.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg).");
        }
    }

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "name":
                err.name = validate_emptyField(input.value);
                break;
            case "total_ledger_amount":
                err.total_ledger_amount = validates_Integer(input.value);
                break;
            case "total_received_amount":
                err.total_received_amount = validate_emptyField(input.value);
                break;
            case "payment_reference_number":
                err.payment_reference_number = validate_emptyField(input.value);
                break;
            case "payment_mode_id":
                err.payment_mode_id = validate_emptyField(input.value);
                break;
            case "received_on":
                err.received_on = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }



    const handleRecurringValidations = (e) => {
        let input = e.target;
        let err = recurringError;
        switch (input.name || input.tagName) {
            case "recurring_cycle_number":
                err.recurring_cycle_number = validates_Integer(input.value);
                break;
            case "recurring_cycle_type":
                err.recurring_cycle_type = validate_emptyField(input.value);
                break;
            case "record_payment":
                err.record_payment = validate_emptyField(input.value);
                break;
            case "recurring_start_date":
                err.recurring_start_date = validate_emptyField(input.value);
                break;
            case "recurring_end_date":
                err.recurring_end_date = validate_emptyField(input.value);
                break;
            case "custom_recurring_cycle_type":
                err.custom_recurring_cycle_type = validate_emptyField(input.value);
                break;
            case "custom_recurring_cycle_number":
                err.custom_recurring_cycle_number = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setRecurringError(err);
    }


    const validateAll = () => {
        let { recurring_cycle_type, recurring_start_date, recurring_end_date, custom_recurring_cycle_type, custom_recurring_cycle_number } = recurringData;
        let errors = {};
        errors.custom_recurring_cycle_number = recurringData.recurring_cycle_type == 11 ? validates_Integer(custom_recurring_cycle_number) : '';
        errors.custom_recurring_cycle_type = recurringData.recurring_cycle_type == 11 ? validate_emptyField(custom_recurring_cycle_type) : '';
        errors.recurring_cycle_type = validate_emptyField(recurring_cycle_type);
        errors.recurring_start_date = validate_emptyField(recurring_start_date);
        errors.recurring_end_date = validate_emptyField(recurring_end_date);
        return errors;

    };

    const validateRecorPaymentAll = () => {
        let { name, total_ledger_amount, total_received_amount, payment_reference_number, payment_mode_id, received_on } = paymentRecordData;
        let errors = {};
        errors.name = validate_emptyField(name);
        errors.total_ledger_amount = validate_emptyField(total_ledger_amount);
        errors.total_received_amount = validate_emptyField(total_received_amount);
        errors.payment_reference_number = validate_emptyField(payment_reference_number);
        errors.payment_mode_id = validate_emptyField(payment_mode_id);
        errors.received_on = validate_emptyField(received_on);
        return errors;

    };



    const handleRecurringSave = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            handlePrompt('mark_as_recurring')
            setOpen(false);
        } else {
            setRecurringError(errors);
        }
    }

    const handleRecordPaymentSave = () => {
        let errors = validateRecorPaymentAll();
        if (isValid(errors)) {
            storeBillPayment(paymentRecordData);
        } else {
            setError(errors);
        }
    }




    const handleTabApis = (newValue) => {
        if (newValue === 0) {
            setIndication(false);
            setFilter({ ...filter, status: '' })
            filter.company_id = invoiceForm.company_id
            getVendorBillsList({ ...filter, status: '' }, { perPage: 4, currentPage: 1 });
        }
        else if (newValue === 1) {
            setIndication(false);
            setFilter({ ...filter, status: '' })
            billListingApi({ ...filter, status: '' }, { perPage: 4, currentPage: 1 });
        }
    }
    const handleClose = () => {
        setOpen(false);
        setRecurringError({});
        setError({});
        setRejectForm({ reject_reason: '', })
        setRejectError({})
        setRecurringData({
            recurring_cycle_number: '',
            recurring_cycle_type: '',
            record_payment: '',
            recurring_start_date: '',
            recurring_end_date: '',
        });
        setpaymentRecordData({
            name: '',
            total_ledger_amount: '',
            total_received_amount: '',
            total_balance_amount: '',
            excess_amount: '',
            received_on: '',
            payment_reference_number: '',
            payment_mode_id: '',
            amount_due: '',
            documents: [
                {
                    new_document_id: '',
                    document_name: ''
                }
            ],
            customer_note: '',
        })
    };

    const handlePrompt = (status) => {
        let data = {
            request_id: LocalStorage.uid(),
            ledger_id: invoiceForm.id,
            status_key: status,
        }

        if (status === 'reject') {
            data = { ...data, reject_reason: rejectForm.reject_reason }
        }

        if (status === 'clone') {
            navigate('/sales/add-bills', { state: { id: selected, action: status, pagination: pagination, company_id: location.state.data.company_id } })
        }

        else if (status === 'mark_as_recurring') {
            updateInvoiceStatus(status);
        }
        else {
            updateInvoiceStatus(data);
        }

    }

    const statusOptions = [
        {
            value: 'Void', id: 'void',
        },
        {
            value: 'Clone', id: 'clone',
        },
        {
            value: 'Mark as Recurring', id: 'mark_as_recurring',
        },
        {
            value: 'Stop Recurring', id: 'stop_recurring',
        },
        {
            value: 'Mark as Sent', id: 'mark_as_sent',
        },
        {
            value: 'Convert to Draft', id: 'convert_to_draft',
        }

    ];

    const recurringCycleOptions = [
        {
            value: 'Week', id: 1,
        },
        {
            value: '2 Weeks', id: 2,
        },
        {
            value: '3 Weeks ', id: 3,
        },
        {
            value: 'Month ', id: 4,
        },
        {
            value: '2 Months', id: 5,
        },
        {
            value: '3 Months ', id: 6,
        },
        {
            value: '6 Months', id: 7,
        },
        {
            value: 'Year', id: 8,
        },
        {
            value: '2 Years ', id: 9,
        },
        {
            value: '3 Years', id: 10,
        },
        {
            value: 'Custom', id: 11,
        },
    ];
    const RecordPaymentOptions = [
        {
            value: 'Yes', id: 'yes',
        },
        {
            value: 'No', id: 'no',
        },
    ];

    const filterStatusOptions = [
        {
            value: 'All', id: '',
        },
        {
            value: 'Drafts', id: 'Drafted',
        },
        {
            value: 'Submitted', id: 'Submitted',
        },
        {
            value: 'Partialy Approved', id: 'Approval In Progress',
        },
        {
            value: 'Approved', id: 'Approved',
        },
        {
            value: 'Rejected', id: 'Rejected',
        },
        {
            value: 'Overdue', id: 'Overdue',
        },
        {
            value: 'Paid', id: 'Paid',
        },
        {
            value: 'Partialy Paid', id: 'Partially Paid',
        },
        {
            value: 'Void', id: 'Void',
        },
        {
            value: 'Write Off', id: 'Write Off',
        },
    ]


    const handleListStatus = (args) => {
        if (args == '') {
            setIndication(false)
        } else {
            setIndication(true);
        }
        if (cardTab == 0) {
            getVendorBillsList({ ...filter, status: args }, { perPage: 4, currentPage: 1 });
        } else {
            billListingApi({ ...filter, status: args }, { perPage: 4, currentPage: 1 });
        }

        setCardStatus(null);

        setFilter({ ...filter, status: args })
        setPagination({
            total: "",
            currentPage: 1,
            perPage: 4,
            totalPages: ""
        });

    }


    const CommonPromptView = () => {

        return (<Stack p={'32px'} alignItems={'center'} width={'457px'} gap={'32px'}>

            {
                prompt == 'mark_as_sent' ? <Text className={classes.heading2}>Mark This Bill As <span className={classes.heading16}>Sent</span></Text> : null
            }
            {
                prompt == 'clone' ? <Text className={classes.heading2}>Are You Sure To <span className={classes.heading16}>Clone</span> This Bill? </Text> : null
            }
            {
                prompt == 'stop_recurring' ? <Text className={classes.heading2}>Stop Recurring For This Bill</Text> : null
            }
            {
                prompt == 'void' ? <Text className={classes.heading2}>Mark This Bill As <span className={classes.heading16}>Void</span></Text> : null
            }
            {
                prompt == 'convert_to_draft' ? <Text className={classes.heading2}>Are You Sure Convert This Bill To <span className={classes.heading16}>Draft ?</span></Text> : null
            }

            <Stack direction={'row'} gap={'20px'}>
                <Button outlineBlue sx={{ width: '64px', height: '42px !important' }} onClick={() => setOpen(false)}>No</Button>
                <Button blueBtnSave onClick={() => handlePrompt(prompt)}>Yes</Button>
            </Stack>
        </Stack>)
    }

    const RecurringView = () => {
        return (
            <Box sx={{ width: '828px !important', padding: '30px' }}>
                <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} mb={4} >
                    <Text className={classes.heading1}>{`Recurring of ${invoiceForm.reference_id}`}</Text>
                    <CloseIcon onClick={() => handleClose()} style={{ cursor: 'pointer' }} />
                </Stack>

                <Grid container columnSpacing={3}>
                    {/* <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Box sx={{ height: '80px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'recurring_cycle_number',
                                    value: recurringData.recurring_cycle_number,
                                    inputProps: {
                                        maxLength: 2
                                    }
                                }}

                                labelText={'Recurring Number'}
                                handleChange={handleRecurring}
                                clientInput

                            />
                            <Text errorText> {recurringError.recurring_cycle_number ? recurringError.recurring_cycle_number : ""}</Text>
                        </Box>
                    </Grid> */}
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px' }}>
                            <SearchSelect
                                options={recurringCycleOptions}
                                name={'recurring_cycle_type'}
                                value={recurringData.recurring_cycle_type}
                                labelText={'Recurring Cycle'}
                                onChange={handleRecurring}
                            />
                            <Text errorText> {recurringError.recurring_cycle_type ? recurringError.recurring_cycle_type : ""}</Text>
                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px' }}>
                            <SearchSelect
                                options={RecordPaymentOptions}
                                name={'record_payment'}
                                value={recurringData.record_payment}
                                labelText={'Record Payment'}
                                onChange={handleRecurring}
                            />
                            <Text errorText> {recurringError.record_payment ? recurringError.record_payment : ""}</Text>
                        </Box>
                    </Grid>
                    {
                        recurringData.recurring_cycle_type == '11' &&
                        <Grid item container spacing={2} pb={2}>
                            <Grid item lg={6}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'custom_recurring_cycle_number',
                                        value: recurringData.custom_recurring_cycle_number,
                                        inputProps: {
                                            maxLength: 2
                                        }
                                    }}
                                    labelText='Recurring Cycle Number'
                                    handleChange={handleRecurring}
                                    clientInput
                                />
                                <Text errorText> {recurringError.custom_recurring_cycle_number ? recurringError.custom_recurring_cycle_number : ""}</Text>
                            </Grid>
                            <Grid item lg={6}>
                                <SearchSelect
                                    options={daysOption}
                                    name={'custom_recurring_cycle_type'}
                                    value={recurringData.custom_recurring_cycle_type}
                                    labelText='Recurring Cycle Type'
                                    onChange={handleRecurring}
                                />
                                <Text errorText> {recurringError.custom_recurring_cycle_type ? recurringError.custom_recurring_cycle_type : ""}</Text>
                            </Grid>
                        </Grid>
                    }
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px' }}>
                            <DatePicker
                                onChange={(e, args) => recurringDateChange(e, 'recurring_start_date')}
                                name={'recurring_start_date'}
                                value={recurringData.recurring_start_date}
                                labelText={'From'}
                                maxDate={recurringData.recurring_end_date !== '' ? recurringData.recurring_end_date : ''}
                            />
                            <Text errorText> {recurringError.recurring_start_date ? recurringError.recurring_start_date : ""}</Text>
                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>

                            <DatePicker
                                onChange={(e, args) => recurringDateChange(e, 'recurring_end_date')}
                                name={'recurring_end_date'}
                                value={recurringData.recurring_end_date}
                                labelText={'To'}
                                minDate={recurringData.recurring_start_date !== '' ? recurringData.recurring_start_date : ''}
                            />
                            <Text errorText> {recurringError.recurring_end_date ? recurringError.recurring_end_date : ""}</Text>
                        </Box>
                    </Grid>
                    {
                        recurringData.recurring_cycle_type == '11' &&
                        <Grid item lg={12}>
                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                <Checkbox name='recurring_never_expires' checked={recurringData.recurring_never_expires} onChange={handleRecurring} />
                                <Text mediumBlack>Never Expires</Text>
                            </Box>
                        </Grid>
                    }
                </Grid>
                <Stack direction={'row'} justifyContent={'end'} gap={2} >
                    <Button blackCancelBtn redHover onClick={() => handleClose()}>Cancel</Button>
                    <Button blueBtnSave onClick={() => handleRecurringSave()}>Save</Button>
                </Stack>
            </Box>
        )
    }




    const PaymentRecordView = () => {
        return (
            <Box sx={{ width: '828px !important', padding: '25px' }}>
                <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} mb={4} >
                    <Text className={classes.heading1}>{`Payment of ${invoiceForm.reference_id}`}</Text>
                    <CloseIcon onClick={() => handleClose()} style={{ cursor: 'pointer' }} />
                </Stack>

                <Grid container columnSpacing={3}>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                        <Box sx={{ height: '80px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'name',
                                    value: paymentRecordData.name,
                                    disabled: true
                                }}

                                labelText={'Vendor Name'}
                                handleChange={handleRecordChange}
                                clientInput

                            />
                            <Text errorText> {error.name ? error.name : ""}</Text>
                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'total_ledger_amount',
                                    value: paymentRecordData.total_ledger_amount,
                                    disabled: true
                                }}

                                labelText={'Bill Amount'}
                                handleChange={handleRecordChange}
                                clientInput

                            />
                            <Text errorText> {error.total_ledger_amount ? error.total_ledger_amount : ""}</Text>
                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'total_received_amount',
                                    value: paymentRecordData.total_received_amount
                                }}

                                labelText={'Amount Received'}
                                handleChange={handleRecordChange}
                                clientInput

                            />
                            <Text errorText> {error.total_received_amount ? error.total_received_amount : ""}</Text>
                        </Box></Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'amount_due',
                                    value: paymentRecordData.amount_due,
                                    disabled: true
                                }}
                                labelText={<Text largeLabel>Amount Due</Text>}
                                handleChange={handleRecordChange}
                                clientInput
                            />

                        </Box></Grid>


                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'total_balance_amount',
                                    value: paymentRecordData.total_balance_amount,
                                    disabled: true
                                }}
                                labelText={<Text largeLabel>Balance Amount</Text>}
                                handleChange={handleRecordChange}
                                clientInput

                            />

                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'excess_amount',
                                    value: paymentRecordData.excess_amount,
                                    disabled: true
                                }}
                                labelText={<Text largeLabel>Excess Amount</Text>}
                                handleChange={handleRecordChange}
                                clientInput

                            />

                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>

                            <DatePicker
                                onChange={(e, args) => dateChange(e, 'received_on')}
                                name={'received_on'}
                                value={paymentRecordData.received_on}
                                maxDate={moment().toDate()}
                                labelText={<Text largeLabel>Paid Date </Text>}
                            />
                            <Text errorText> {error.received_on ? error.received_on : ""}</Text>
                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>

                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'payment_reference_number',
                                    value: paymentRecordData.payment_reference_number,
                                    inputProps: {
                                        maxLength: 25
                                    }
                                }}

                                labelText={'Payment Reference ID'}
                                handleChange={handleRecordChange}
                                clientInput

                            />
                            <Text errorText> {error.payment_reference_number ? error.payment_reference_number : ""}</Text>
                        </Box></Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>
                            <SearchSelect
                                options={paymentModeOp}
                                name={'payment_mode_id'}
                                value={paymentRecordData.payment_mode_id}
                                labelText={'Payment Mode'}
                                onChange={handleRecordChange}
                            />
                            <Text errorText> {error.payment_mode_id ? error.payment_mode_id : ""}</Text>
                        </Box></Grid>


                    {
                        paymentRecordData && paymentRecordData.documents && paymentRecordData.documents.map((item, key) => (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Box sx={{ height: '80px' }}>
                                    <FileInput
                                        label={'Reference Document ( Optional )'}
                                        FileName={item.document_name}
                                        handleChange={(e) => uploadDocs(e, key)}
                                        name={'new_document_id'}
                                        isDisabled={false}
                                    />

                                </Box>
                            </Grid>
                        ))
                    }



                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box sx={{ height: '80px', }}>

                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'customer_note',
                                    value: paymentRecordData.customer_note,
                                    inputProps: {
                                        maxLength: 250
                                    }
                                }}
                                labelText={<Text largeLabel>Customer Note <span className={classes.optional}>(Optional)</span></Text>}
                                handleChange={handleRecordChange}
                                descriptionFormControl
                                descriptionInput
                                multiline={true}
                                rows={2}

                            />
                        </Box></Grid>
                </Grid>
                <Stack direction={'row'} justifyContent={'end'} gap={2} mt={4}>
                    <Button blackCancelBtn redHover onClick={() => handleClose()}>Cancel</Button>
                    <Button blueBtnSave onClick={() => handleRecordPaymentSave()}>Save</Button>
                </Stack>
            </Box>
        )
    }


    const ActivityView = () => {
        return (
            <Box sx={{
                width: '660px', height: '100vh',
                overflow: "auto",
                '&::-webkit-scrollbar': {
                    width: '4px',
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

                <Box height={'10vh'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={'0px 16px 0px 32px'} >
                    <Text BlackExtraDark mt={3}>Activities</Text>

                    <Box onClick={() => setDrawer(false)} sx={{ cursor: 'pointer' }}>
                        <CloseIcon />
                    </Box>

                </Box>


                <Box width={'100%'} height={'85vh'} px={4}>

                    <Box sx={{ borderBottom: '1px solid #E2E5E6 !important', width: '298px', }}>
                        <Tabs
                            value={activityTab}
                            onChange={handleActivityTab}
                            aria-label="scrollable auto tabs example"
                        >

                            <Tab label={'All'}   {...a11yProps(0)} className={`${classes.tabTitle}  ${activityTab === 0 ? classes.activeTabTitle : null}`} />
                            <Tab label="Payments" {...a11yProps(1)} className={`${classes.tabTitle}  ${activityTab === 1 ? classes.activeTabTitle : null}`} />

                        </Tabs>
                    </Box>

                    <CustomTabPanel value={activityTab} index={0}>
                        <Box sx={{ height: '45vh', width: '100%', my: '30px', overflowY: 'auto', }}>

                            <Stepper orientation="vertical" >
                                {steps.map((step, index) => (
                                    <Step key={step.id} active={index + 1}>
                                        <StepLabel
                                            className={classes.stepperLable}
                                            StepIconComponent={ActivityCheckIcon}
                                        >
                                            <Text className={classes.heading8}>{step.label}</Text>
                                            <Text className={classes.heading9}>{step.date}</Text>

                                        </StepLabel>
                                        <StepContent className={classes.stepperContent}>
                                            {/* <Text className={classes.heading9}>{step.date}</Text> */}
                                            <Text className={classes.heading6}>{step.description}</Text>


                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>

                        </Box>
                        <Divider />
                        <Box width={'100%'} my={4}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                labelText={'Add Comment'}
                                inputProps={{
                                    name: '',
                                    value: '',
                                }}
                                descriptionFormControl
                                descriptionInput
                                multiline={true}
                                rows={3}
                            />


                            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={3} height={'40px'} pr={'26px'} margin={'20px 0px !important'} >
                                <Button closeBtn onClick={() => setDrawer(false)}>Close</Button>
                                <Button addComment >Add Comments</Button>
                            </Box>
                        </Box>

                    </CustomTabPanel>
                    <CustomTabPanel value={activityTab} index={1}>
                        <Box sx={{ height: '72vh', width: '100%', my: '30px', overflowY: 'auto', }}>

                            <Stepper orientation="vertical" >
                                {payments.map((step, index) => (
                                    <Step key={step.id} active={index + 1}>
                                        <StepLabel
                                            className={classes.stepperLable}
                                            StepIconComponent={ActivityCheckIcon}
                                        >
                                            <Text className={classes.heading8}>{step.label}</Text>
                                            <Text className={classes.heading9}>{step.date}</Text>

                                        </StepLabel>
                                        <StepContent className={classes.stepperContent}>
                                            <Stack direction={'row'} gap={'5px'}>
                                                <Text className={classes.heading6}>{`Payment of `}</Text>
                                                <Text className={classes.heading10}>{`${getCurrencySymbol()} ${step.amount}`}</Text>
                                                <Text className={classes.heading6}>{`received through bank transfer with ref.id of `}</Text>
                                                <Text className={classes.heading10}>{`${step.ref_id}`}</Text>
                                            </Stack>

                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>

                        </Box>
                    </CustomTabPanel>

                </Box>


            </Box >
        )
    };


    const RejectView = () => {
        return (
            <Box sx={{ width: '660px', p: '32px' }}>
                <Stack direction={'row'} width={'100%'} justifyContent={'start'} mb={'20px'}>
                    <Text className={classes.heading1}>Reason For Rejection</Text>
                </Stack>
                <Box>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'reject_reason',
                            value: rejectForm.reject_reason
                        }}

                        labelText={'Add Remark'}
                        handleChange={handleRejectForm}
                        descriptionFormControl
                        descriptionInput
                        multiline={true}
                        rows={3}
                    />
                    <Text errorText> {rejectError.reject_reason ? rejectError.reject_reason : ""}</Text>
                </Box>
                <Stack direction={'row'} width={'100%'} justifyContent={'end'} mt={'35px'} gap={2}>
                    <Button outlineBlue redHover onClick={() => handleClose()} sx={{ width: '99px', height: '42px !important' }}>Cancel</Button>
                    <Button blueBtnSave onClick={() => handleRejectFromSubmit()} sx={{ width: '99px', font: '16px Nunito Sans !important' }}>Reject</Button>
                </Stack>
            </Box>
        )
    }



    return (
        <Box className={classes.containerMain} >
            <Box width={'100%'} mb={'20px'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='/sales/bills' className={classes.linkStyle}><Text className={classes.navText1}>Sales</Text></Link>
                    <Link to='/sales/bills' className={classes.linkStyle}><Text className={classes.navText1}>Bills</Text></Link>
                    <Link to='' className={classes.navText2}><Text className={classes.navText1}>Bills History</Text></Link>
                </Breadcrumbs>
            </Box>

            <Grid container columnSpacing={2}>

                <Grid item lg={8}>
                    {loading ?
                        <Box className={classes.ViewContainer}>
                            <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                <img src={LoaderIcon} height={100} width={100} alt='loading' />
                            </Stack>
                        </Box>
                        :
                        <Box className={classes.ViewContainer}>

                            <Box className={classes.containerHeader}>
                                <Stack direction={'row'} gap={2} alignItems={'center'} >
                                    <Text className={classes.heading1}>{["", null, undefined].includes(invoiceForm.name) ? "-" : invoiceForm.name}</Text>
                                    <Text className={`${classes.invoiceStatus} ${!["", null, undefined].includes(invoiceForm.status) && classes[(invoiceForm.status).replaceAll(" ", "_")]}`} > {!["", null, undefined].includes(invoiceForm.status) ? invoiceForm.status : '-'} </Text>
                                </Stack>
                                <Stack direction={'row'} gap={'18px'} alignItems={'center'}>

                                    <Box width={'159px'}>
                                        {
                                            invoiceForm.status !== "Rejected" &&
                                                ['Submitted', "Partially Paid"].includes(invoiceForm.status) ?
                                                <Button
                                                    selectButton
                                                    onClick={() => handlePaymentMethod()}
                                                >
                                                    Record Payment
                                                </Button>
                                                : null
                                        }

                                    </Box>
                                    <HtmlTooltip placement='right' title={'Activity Log'} arrow>
                                        <img src={ClockIcon} className={classes.iconStyles} onClick={() => setDrawer(true)} alt='icons' />
                                    </HtmlTooltip>
                                    <img src={DownloadIcon} className={classes.iconStyles} onClick={() => downloadDoc(invoiceForm.documents[0].document_url)} alt='download' />

                                    {
                                        invoiceForm.edit_access ? <img src={EditIcon} className={classes.iconStyles} onClick={() => navigate('/sales/add-bills', { state: { id: selected, action: 'edit', pagination: pagination, company_id: location.state.data.company_id } })} alt='icons' /> : null
                                    }


                                    {
                                        invoiceForm.status !== "Rejected" &&
                                        <img src={MenuIcon} className={classes.iconStyles} onClick={(e) => setOpenStatus(e.currentTarget)} alt='icons' />
                                    }
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={openStatus}
                                        open={opStatus}
                                        onClose={handleStatus}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                borderRadius: '12px',
                                                boxShadow: 'none !important',
                                                border: '1px solid #EAECF0 !important',
                                                width: '140px !important',
                                                maxHeight: '226px !important',
                                            }
                                        }}
                                    >

                                        {
                                            statusOptions.map((option) => {
                                                if (option.value === "Void") {
                                                    return !invoiceForm.void && <MenuItem key={option.id} onClick={() => handleStatus(option.id)} className={classes.menuText} >{option.value}</MenuItem>
                                                } else if (option.value == "Clone") {
                                                    return <MenuItem key={option.id}
                                                        onClick={
                                                            () => {
                                                                if (["Write Off", "Void"].includes(invoiceForm.status)) {
                                                                    // addWarningMsg("This Bill has been marked as 'write off' or 'void' status. Cloning this Bill is prohibited.")
                                                                    addWarningMsg(`Performing Bill Cloning is not permitted when the Bill status is 'write off' or 'void'.`);
                                                                } else {
                                                                    handleStatus(option.id)
                                                                }
                                                            }
                                                        }
                                                        className={classes.menuText} >{option.value}</MenuItem>
                                                } else {
                                                    return <MenuItem key={option.id} onClick={() => handleStatus(option.id)} className={classes.menuText} >{option.value}</MenuItem>
                                                }
                                            }

                                            )
                                        }


                                    </Menu>
                                </Stack>
                            </Box>
                            <Box className={classes.invoiceContent}>

                                <Box className={classes.template}>
                                    <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} mb={'30px'}>
                                        <Avatar variant="rounded" sx={{ width: 70, height: 70 }} src={invoiceForm.logo_document_url && invoiceForm.logo_document_url} alt={invoiceForm.name} />
                                        <Stack width={'200px'} alignItems={'end'}>
                                            <Text className={classes.heading2}>Bill No</Text>
                                            <Text className={classes.heading3}>{invoiceForm.reference_id ? invoiceForm.reference_id : '--'}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'start'}>
                                        <Stack width={'200px'} gap={1}>
                                            <Text className={classes.headingFrom}>{`Spirit (From)`}</Text>
                                            {

                                                invoiceForm ? invoiceForm.billing_address ? invoiceForm.billing_address.length > 0 ?

                                                    <Text className={classes.fromText}>{`
                                                    ${invoiceForm.shipping_address[0].address_line_1 ? invoiceForm.shipping_address[0].address_line_1 : ''}
                                                            ${invoiceForm.shipping_address[0].address_line_2 ? invoiceForm.shipping_address[0].address_line_2 : ''}
                                                            ${invoiceForm.shipping_address[0].city ? invoiceForm.shipping_address[0].city : ''}
                                                            ${invoiceForm.shipping_address[0].state_name ? invoiceForm.shipping_address[0].state_name : ''} ,
                                                            ${invoiceForm.shipping_address[0].country_name ? invoiceForm.shipping_address[0].country_name : ''} 
                                                            ${invoiceForm.shipping_address[0].zip_code ? invoiceForm.shipping_address[0].zip_code : ''}.                                                    
                                                    `}</Text> : null : null : null

                                            }
                                        </Stack>
                                        <Stack width={'200px'} gap={1} alignItems={'end'}>

                                            <Text className={classes.headingTo}>{`${invoiceForm.name ? invoiceForm.name : '--'} (To)`}</Text>
                                            {

                                                invoiceForm ? invoiceForm.shipping_address ? invoiceForm.shipping_address.length > 0 ?

                                                    <Text className={classes.toText}>{`
                                                    ${invoiceForm.billing_address[0].address_line_1 ? invoiceForm.billing_address[0].address_line_1 : ''}
                                                    ${invoiceForm.billing_address[0].address_line_2 ? invoiceForm.billing_address[0].address_line_2 : ''}
                                                    ${invoiceForm.billing_address[0].city ? invoiceForm.billing_address[0].city : ''}
                                                    ${invoiceForm.billing_address[0].state_name ? invoiceForm.billing_address[0].state_name : ''} ,
                                                    ${invoiceForm.billing_address[0].country_name ? invoiceForm.billing_address[0].country_name : ''} 
                                                    ${invoiceForm.billing_address[0].zip_code ? invoiceForm.billing_address[0].zip_code : ''}.
                                                            `}</Text> : null : null : null

                                            }


                                        </Stack>
                                    </Stack>



                                    <Stack className={classes.dateData} direction={'row'}>

                                        <Text className={classes.heading4}>{`Bill Date : ${invoiceForm.date ? invoiceForm.date : '--'}`}</Text>

                                        <Divider orientation='vertical' variant="middle" flexItem sx={{ borderColor: '#737373' }} />

                                        <Text className={classes.heading4}>{`Terms : ${invoiceForm.days ? invoiceForm.days : '--'} Days`}</Text>

                                        <Divider orientation='vertical' variant="middle" flexItem sx={{ borderColor: '#737373' }} />

                                        <Text className={classes.heading4}>{`Due Date : ${invoiceForm.due_date ? invoiceForm.due_date : '--'}`}</Text>

                                    </Stack>
                                    <TableContainer component={'div'} className={classes.tableContainer}>
                                        <Table sx={{ minWidth: 650 }}>
                                            <TableHead sx={{ height: '57px' }}>
                                                <TableRow>
                                                    <TableCell width={'64px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>S.No</TableCell>
                                                    <TableCell width={'291px'} align="left" sx={{ borderRight: '1px solid #E2E5E6' }}>Description</TableCell>
                                                    <TableCell width={'100px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>Hours</TableCell>
                                                    <TableCell width={'100px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>Rate</TableCell>
                                                    <TableCell width={'100px'} align="center" >Amount</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    invoiceForm ? invoiceForm.ledger_item_details && invoiceForm.ledger_item_details.length > 0 ? invoiceForm.ledger_item_details.map((obj, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{ height: '57px' }}
                                                        >
                                                            <TableCell width={'64px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>{index + 1}</TableCell>
                                                            <TableCell width={'291px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>
                                                                <Stack gap={'4px'}>
                                                                    <Text className={classes.heading5}>{["", null, undefined].includes(obj.description) ? "-" : obj.description}</Text>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell width={'100px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>{obj.hours}</TableCell>
                                                            <TableCell width={'100px'} align="center" sx={{ borderRight: '1px solid #E2E5E6' }}>{`${getCurrencySymbol()} ${obj.rate}`}</TableCell>
                                                            <TableCell width={'100px'} align="center">{`${getCurrencySymbol()} ${obj.amount}`}</TableCell>
                                                        </TableRow>
                                                    ))
                                                        : null : null}

                                            </TableBody>

                                        </Table>
                                    </TableContainer>
                                    <Stack justifyContent={'end'} direction={'row'} mt={'30px'}>
                                        <Stack direction={'column'} gap={1}>
                                            <Stack direction={'row'} gap={'37px'}>
                                                <Text className={classes.heading6}>Sub Total</Text>
                                                <Text className={classes.heading7}>{`${getCurrencySymbol()} ${["", null, undefined].includes(invoiceForm.sub_total_amount) ? '--' : invoiceForm.sub_total_amount}`}</Text>
                                            </Stack>
                                            <Stack direction={'row'} gap={'61px'}>
                                                <Text className={classes.heading6}>Total</Text>
                                                <Text className={classes.heading7}>{`${getCurrencySymbol()} ${["", null, undefined].includes(invoiceForm.total_amount) ? '--' : invoiceForm.total_amount}`}</Text>
                                            </Stack>
                                            <Divider sx={{ borderColor: '#E2E5E6' }} />
                                            <Stack direction={'row'} gap={'20px'}>
                                                <Text className={classes.heading6}>Balance Due</Text>
                                                <Text className={classes.heading7}>{`${getCurrencySymbol()} ${["", null, undefined].includes(invoiceForm.balance_amount) ? '--' : invoiceForm.balance_amount}`}</Text>

                                            </Stack>

                                        </Stack>
                                    </Stack>
                                    <Stack gap={1} mt={'30px'} >

                                        <Text className={classes.heading2}>Documents: </Text>

                                        {
                                            invoiceForm.documents &&
                                            invoiceForm.documents.map((doc, i) => (
                                                <span>
                                                    <a href={doc.document_url} rel='noreferrer' target="_blank" className={`${doc.document_url ? classes.doclink : classes.doclinkEmpty}`}>
                                                        {`${i + 1}, ${doc.document_name}`}
                                                    </a>
                                                </span>
                                            ))
                                        }

                                    </Stack>
                                    <Stack gap={1} mt={'30px'}>

                                        <Text className={classes.heading2}>Notes: </Text>
                                        <Text className={`${invoiceForm.customer_note ? classes.heading6 : classes.doclinkEmpty}`}>{invoiceForm.customer_note ? invoiceForm.customer_note : '--'}</Text>
                                    </Stack>
                                    <Stack gap={1} my={'30px'}>
                                        <Text className={classes.heading6}>Please pay the due amount on-time</Text>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>


                    }

                    {loading ?
                        null :
                        (invoiceForm.status !== "Rejected" &&
                            //  invoiceForm.approval_access ?
                            //     <Stack direction={'row'} justifyContent={'end'} my={'20px'} gap={'20px'}>
                            //         <Button cancelOutline onClick={() => { setPopup('reject'); setOpen(true) }}>
                            //             Reject
                            //         </Button>

                            //         <Button approveBtn onClick={() => handlePrompt('approve')}>
                            //             Approve
                            //         </Button>
                            //     </Stack> :

                            <Stack direction={'row'} justifyContent={'end'} my={'20px'} gap={'20px'}>
                                {["Approval In Progress", "Submitted"].includes(invoiceForm.status) ?
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_payment_edit" && item.is_allowed == true))) ?
                                        <Button blueOutlineBtn endIcon={<BellIcon />}>
                                            Send Remainder
                                        </Button> :
                                        <Button addButtonDisable sx={{ height: '40px !important' }} endIcon={<img src={disableReminder} alt='reminder' style={{ height: '17px', width: '17px' }} />}>
                                            Send Remainder
                                        </Button> : null
                                }
                                {["Approved"].includes(invoiceForm.status) ?
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_payment_edit" && item.is_allowed == true))) ?
                                        <Button sendBtn endIcon={<MailIcon />} onClick={() => { setPopup('invoice_mail'); setOpen(true) }} >
                                            Send Invoice
                                        </Button> :
                                        <Button addButtonDisable sx={{ height: '40px !important' }} endIcon={<img src={disableMail} alt='send' style={{ height: '17px', width: '17px' }} />}>
                                            Send Invoice
                                        </Button> : null
                                }
                            </Stack>
                        )
                    }
                </Grid>


                <Grid item lg={4}>
                    <Box className={classes.CardContainer}>
                        <Stack direction={'row'} justifyContent={'space-between'} px={'15px'}>
                            <Box sx={{ width: '235px' }}>
                                <Tabs
                                    value={cardTab}
                                    onChange={handleCardTab}
                                    aria-label="scrollable auto tabs example"
                                    indicatorColor={''}
                                >
                                    <Tab label={'Vendor History'}  {...a11yProps(0)} className={`${classes.tabTitle1}  ${cardTab === 0 ? classes.activeTabTitle1 : null}`} />
                                    <Tab label={'All'}  {...a11yProps(1)} className={`${classes.tabTitle2}  ${cardTab === 1 ? classes.activeTabTitle1 : null}`} />

                                </Tabs>
                            </Box>

                            <button
                                type="button"
                                style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}
                                onClick={(e) => setCardStatus(e.currentTarget)}
                            >
                                <FilterBadge overlap="circular" variant={indication ? 'dot' : null} ><img src={Filterlines} alt="Userplus" /></FilterBadge>
                            </button>
                            <Menu
                                id="basic-menu1"
                                anchorEl={cardStatus}
                                open={filterMenu}
                                onClose={handleFilterStatus}
                                sx={{
                                    '& .MuiPaper-root': {
                                        borderRadius: '12px',
                                        boxShadow: 'none !important',
                                        border: '1px solid #EAECF0 !important',
                                        width: '140px !important',
                                        maxHeight: '189px !important',
                                        marginTop: '10px !important',
                                    }
                                }}
                            >
                                {
                                    filterStatusOptions.map((option) => (
                                        <MenuItem key={option.id} onClick={() => handleListStatus(option.id)} className={classes.viewText} >{option.value}</MenuItem>
                                    ))
                                }
                            </Menu>
                        </Stack>

                        <CustomTabPanel value={cardTab} index={0}>
                            <Box className={classes.mainCardContainer}>
                                {
                                    clientHistoryList.length == 0 && !listLoading ?
                                        <>
                                            <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
                                                <img src={NoDataFoundIcon} alt='No Data Found' />
                                                <Text className={classes.heading1} sx={{ mt: 2, ml: 1 }}>  No Data Found</Text>

                                            </Stack>
                                        </>
                                        : null
                                }


                                {listLoading ?
                                    <ProfileCard isLoading={listLoading} />
                                    :
                                    (clientHistoryList.map((obj, index) => (
                                        <ProfileCard data={obj} Selected={selected} setSelected={setSelected} handleInvoiceFormData={handleInvoiceFormData} key={index} />
                                    )))
                                }

                                {
                                    !listLoading &&
                                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                                        <Box style={{ textAlign: "center", padding: "10px", }}>
                                            <button
                                                onClick={() => listLoading ? null : loadeMore()}
                                                type="button"
                                                style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                                            >
                                                {listLoading ? "Loading..." : "Load more"}
                                            </button>
                                        </Box> : null : null
                                }
                            </Box>
                        </CustomTabPanel>

                        <CustomTabPanel value={cardTab} index={1}>
                            <Box className={classes.mainCardContainer}>
                                {listLoading ?
                                    <ProfileCard isLoading={listLoading} />
                                    :
                                    (invoiceList.map((obj, index) => (
                                        <ProfileCard data={obj} Selected={selected} setSelected={setSelected} handleInvoiceFormData={handleInvoiceFormData} key={index} />
                                    )))
                                }

                                {
                                    !listLoading && invoiceList.length == 0 ?
                                        <>
                                            <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
                                                <img src={NoDataFoundIcon} alt='No Data Found' />
                                                No Data Found
                                            </Stack>
                                        </>
                                        : null
                                }
                                {
                                    !listLoading &&
                                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                                        <Box style={{ textAlign: "center", padding: "10px", }}>
                                            <button
                                                onClick={() => listLoading ? null : loadeMore()}
                                                type="button"
                                                style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                                            >
                                                {listLoading ? "Loading..." : "Load more"}
                                            </button>
                                        </Box> : null : null
                                }
                            </Box>
                        </CustomTabPanel>
                    </Box>
                </Grid>
            </Grid>

            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
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
                    ActivityView()
                }
            </SwipeableDrawer>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={true}
            >
                <DialogContent >
                    {
                        popup === 'record_payment' ? PaymentRecordView() : null
                    }

                    {
                        popup === 'recurring' ? RecurringView() : null
                    }

                    {
                        popup === 'common_prompt' ? CommonPromptView() : null
                    }

                    {
                        popup === 'reject' ? RejectView() : null
                    }

                </DialogContent>
            </BootstrapDialog>
        </Box>
    )
}
