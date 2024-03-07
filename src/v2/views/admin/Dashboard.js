import { Autocomplete, Avatar, AvatarGroup, Box, Checkbox, Chip, Divider, Grid, Hidden, Menu, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Text from "../../components/customText/Text";
import TS from '../../assets/svg/dashboard/TS.svg';
import sales from '../../assets/svg/dashboard/Sales.svg';
import Employees from '../../assets/svg/dashboard/Employees.svg';
import ExpenseMng from '../../assets/svg/dashboard/Expense-Management.svg';
import ESS from '../../assets/svg/dashboard/ESS.svg';
import Payroll from '../../assets/svg/dashboard/Payroll.svg';
import Immigration from '../../assets/svg/dashboard/Immigration.svg';
import SelfRem from '../../assets/svg/dashboard/Self-Remainder.svg';
import Chart from "react-apexcharts";
import DashboardStyles from './DasboardStyles';
import Button from "../../components/customButton/Button";
import LocalStorage from "../../utils/LocalStorage";
import Arrowup from '../../assets/svg/dashboard/blueArrow-up.svg';
import ArrowDown from '../../assets/svg/dashboard/RedArrow-down.svg';
import CustomSelect from "../../components/customSelect/CustomSelect";
import ReactApexChart from "react-apexcharts";
import plus from '../../assets/svg/dashboard/blueAdd.svg';
import moment from "moment";
import { BlackToolTip, BorderLinearProgress, addErrorMsg, addSuccessMsg, dateFormat } from "../../utils/utils";
import DateSelect from "../../components/datePicker/DateSelect";
import menu from '../../assets/svg/dashboard/menu.svg';
import ReusablePopup from "../../components/reuablePopup/ReusablePopup";
import Input from '../../components/input/Input';
import FileInput from "../../components/muiFileInput/FileInput";
import CommonApi from "../../apis/CommonApi";
import Date from "../../components/datePicker/Date";
import SearchSelect from "../../components/selectField/SearchSelect";
import { ReactComponent as Info } from '../../assets/svg/Information.svg';
import successImg from '../../assets/svg/dashboard/remainder-success.svg';
import { useNavigate } from "react-router-dom";
import DashboardAPI from "../../apis/admin/DashboardAPI";
import { Add, Remove } from "@mui/icons-material";
import { isValid, isValidMulti, validate_charWithSpace, validate_emptyField, validates_Integer } from "../../components/Validation";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PayrollAPI from "../../apis/configurations/payrollSettings/PayrollAPI";
// import { Add,Remove } from "@mui/icons-material";

export default function Dashboard() {
    const classes = DashboardStyles();
    const navigate = useNavigate();
    const [remDate, setRemDate] = useState(moment().format(dateFormat()));
    const [dateArray, setDateArray] = useState([]);
    const [openStatus, setOpenStatus] = useState(null);
    const [openReminder, setOpenReminder] = useState(false);
    const [cycleList, setCycleList] = useState([]);
    const [cycleListDate, setCycleListDate] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState({});
    const [erro, setErro] = useState([]);

    const [totalEmp, setTotalEmp] = useState({
        consultant: '',
        contractor: '',
        internal_employee: '',
        total_employees: ''
    })

    const [Recievables, setRecievables] = useState({
        receivables: {
            total: '',
            current: '',
            overdue: '',
        },
        payables: {
            total: '',
            current: '',
            overdue: '',
        }
    })

    const [companies, setCompanies] = useState([
        {
            id: '',
            name: 'sdf',
            placement_count: 'sd',
            percentage: '3'
        }
    ])

    const linearProgress = [
        {
            bgColor: '#0095FF',
            barColor: '#CDE7FF'
        },
        {
            bgColor: '#00E096',
            barColor: '#D4FFEB'
        },
        {
            bgColor: '#884DFF',
            barColor: '#E7DBFF'
        },
        {
            bgColor: '#FF8F0D',
            barColor: '#FFEBD4'
        },
        {
            bgColor: '#D34040',
            barColor: '#FFC8C8'
        },
        {
            bgColor: '#0095FF',
            barColor: '#CDE7FF'
        },
        {
            bgColor: '#00E096',
            barColor: '#D4FFEB'
        },
        {
            bgColor: '#884DFF',
            barColor: '#E7DBFF'
        },
        {
            bgColor: '#FF8F0D',
            barColor: '#FFEBD4'
        },
        {
            bgColor: '#D34040',
            barColor: '#FFC8C8'
        },
    ]

    const [state, setState] = useState({
        name: '',
        description: '',
        is_payroll_reminder: false,
        reminder_date: '',
        reminder_time: '',
        pay_config_setting_id: '',
        check_date: '',
        employee_ids: [],
        documents: [
            {
                new_document_id: '',
                docName: ''
            }
        ],
        reminders: [
            {
                occurance_order: '',
                number: '',
                cycle: '',
                is_recurring: '',
                recurring_days: ''
            }
        ]
    })
    // eslint-disable-next-line
    const [employees, setEmployees] = useState([]);
    const [deletedchips, setDeletedchips] = useState([]);
    const [deletedLevels, setDeletedLevels] = useState([]);

    useEffect(() => {
        getApprovalDropdownList();
        multiDateFunc(moment());
        cycleDropdown();
        getTotalEmployees();
        DasboardAPI();
        companiesList();
        payrollList(filters.payrollFilters);
        getCashflow(ApiData);
        documentsList(remDate);
        employeeMargin(marginData) // eslint-disable-next-line
    }, [])

    const [dropDownState, setDropdownState] = useState({
        cashflow: 2,
        empMargin: 2
    })

    const [marginData, setMarginData] = useState({
        fromDate: moment().subtract(6, 'months').format(dateFormat()),
        toDate: moment().format(dateFormat())
    })

    const [ApiData, setAPIData] = useState({
        viewType: 'cash',
        fromDate: moment().subtract(6, 'months').format(dateFormat()),
        toDate: moment().format(dateFormat())
    })

    const handleStatus = (args) => {
        setOpenStatus(null);
    }

    const employeeMargin = (args) => {
        DashboardAPI.employerMargin(args).then((res) => {
            if (res.data.statusCode == 1003) {
                for (let i = 0; i < res.data.data.series.length; i++) {
                    empMarginData.series.push(Number(res.data.data.series[i]))
                    empMarginData.labels.push(res.data.data.labels[i])
                }
                setEmpMarginData({ ...empMarginData })
            }
        })
    }

    const getCashflow = (args) => {
        DashboardAPI.cashflow(args).then((res) => {
            if (res.data.statusCode == 1003) {
                setCashflowData(res.data.data);
            }
        })
    }

    const dropDownChangeHandler = (e, args) => {
        let fromDate = "";
        let toDate = "";
        setDropdownState({
            ...state,
            [e.target.name]: e.target.value
        })
        switch (e.target.value) {
            case 1:
                fromDate = moment().subtract(3, 'months').format(dateFormat());
                toDate = moment().format(dateFormat());
                if (args === 'cashFlow') {
                    getCashflow({ ...ApiData, fromDate: fromDate, toDate: toDate });
                } else if (args === 'empMargin') {
                    employeeMargin({ ...marginData, fromDate: fromDate, toDate: toDate });
                }
                break;
            case 2:
                fromDate = moment().subtract(6, 'months').format(dateFormat());
                toDate = moment().format(dateFormat());
                if (args === 'cashFlow') {
                    getCashflow({ ...ApiData, fromDate: fromDate, toDate: toDate });
                } else if (args === 'empMargin') {
                    employeeMargin({ ...marginData, fromDate: fromDate, toDate: toDate });
                }
                break;
            case 3:
                fromDate = moment().subtract(1, 'year').format(dateFormat());
                toDate = moment().format(dateFormat());
                if (args === 'cashFlow') {
                    getCashflow({ ...ApiData, fromDate: fromDate, toDate: toDate });
                } else if (args === 'empMargin') {
                    employeeMargin({ ...marginData, fromDate: fromDate, toDate: toDate });
                }
                break;
            default:
                break;
        }
        setAPIData({ ...ApiData });
        setMarginData({ ...marginData })
    }

    const cycleDropdown = () => {
        DashboardAPI.payrollConfigDropdown().then((response) => {
            if (response.data.statusCode == 1003) {
                setCycleList(response.data.data);
            }
        });
    };

    const cycleDropdownCheck = (id) => {
        PayrollAPI.getPayroll(LocalStorage.uid(),id,LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setCycleListDate(response.data.data);
            }
        });
    };

    const dateChange = (e, name) => {
        let date = e.$d // eslint-disable-next-line
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setState({
            ...state,
            [name]: moment(date).format(dateFormat()),
        }, handleValidate(event))
    }

    const days = [
        {
            id: 1,
            value: 'Days'
        },
        {
            id: 2,
            value: 'Weeks'
        },
        {
            id: 3,
            value: 'Months'
        }
    ]

    const semiDays = [
        {
            id: 1,
            value: 'Every Day'
        },
        {
            id: 2,
            value: 'Every 10 Days'
        },
        {
            id: 3,
            value: 'Every 15 Days'
        },
        {
            id: 3,
            value: 'Every Month'
        }
    ]

    const createReminder = () => {
        let errors = validateAll();
        let reminderErrors = validateReminderErrors();
        if (isValid(errors) && isValidMulti(reminderErrors)) {
            storeReminderApi();
        } else {
            let s1 = { error }
            s1 = errors
            setError(s1);
            let s2 = { erro }
            s2 = reminderErrors
            setErro(s2);
        }
    }

    const getTotalEmployees = () => {
        DashboardAPI.getEmployeesList().then((res) => {
            if (res.data.statusCode == 1003) {
                setTotalEmp(res.data.data[0]);
            }
        })
    }

    const storeReminderApi = () => {
        state['request_id'] = LocalStorage.uid();
        let data = state
        if (data.is_payroll_reminder === false) {
            data.reminders = []
        }
        DashboardAPI.storeReminder(data).then((res) => {
            if (res.data.statusCode == 1003) {
                addSuccessMsg('Reminder Added Successfully');
                setOpenReminder(false);
                setSuccess(true);
                setState({
                    name: '',
                    description: '',
                    is_payroll_reminder: false,
                    reminder_date: '',
                    reminder_time: '',
                    pay_config_setting_id: '',
                    check_date: '',
                    employee_ids: [],
                    documents: [
                        {
                            new_document_id: '',
                            docName: ''
                        }
                    ],
                    reminders: [
                        {
                            occurance_order: '',
                            number: '',
                            cycle: '',
                            is_recurring: '',
                            recurring_days: ''
                        }
                    ]
                })
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const DasboardAPI = () => {
        DashboardAPI.totalRecievables().then((res) => {
            if (res.data.statusCode == 1003) {
                setRecievables(res.data.data);
            }
        })
    }

    const companiesList = () => {
        DashboardAPI.getCompanies().then((res) => {
            if (res.data.statusCode == 1003) {
                setCompanies(res.data.data);
            }
        })
    }

    const [payrollLabels, setPayrolLabels] = useState({
        series: [],
        labels: []
    })

    const payrollList = (args) => {
        DashboardAPI.getPayroll(args).then((res) => {
            if (res.data.statusCode == 1003) {
                setPayrolLabels(res.data.data);
            }
        })
    }

    const documentsList = (args) => {
        DashboardAPI.selfDocuments(args).then((res) => {
            if (res.data.statusCode == 1003) {
                setDocuments(res.data.data);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const [filters, setFilters] = useState({
        payrollFilters: 1
    })

    const handleAddLevel = () => {
        let arr = state.reminders;
        // let errorsArr = appErrors;
        arr.push({
            id: "",
            occurance_order: '',
            number: '',
            cycle: '',
            is_recurring: '',
            recurring_days: ''
        });
        // errorsArr.push({});
        setState({ ...state, reminders: arr });
        // setAppErrors(errorsArr);
    }

    const handleRemoveLevel = (index) => {
        let arr = state.reminders;
        // let errorsArr = appErrors;
        let deletedLevelArr = deletedLevels;
        if (arr[index].id !== '') {
            deletedLevelArr.push(arr[index]);
        }
        arr.splice(index, 1);
        // errorsArr.splice(index, 1);        
        setState({ ...state });
        // setAppErrors(errorsArr);
        setDeletedLevels([...deletedLevelArr]);
    }

    const Reminders = [
        {
            icons: TS,
            Header: 'Timesheet',
            count: '01'
        },
        {
            icons: sales,
            Header: 'Sales',
            count: ''
        },
        {
            icons: Employees,
            Header: 'Employees',
            count: ''
        },
        {
            icons: ExpenseMng,
            Header: 'Expense Management',
            count: ''
        },
        {
            icons: ESS,
            Header: 'Employee Self Service',
            count: ''
        },
        {
            icons: Payroll,
            Header: 'Payroll',
            count: ''
        },
        {
            icons: Immigration,
            Header: 'Immigration',
            count: ''
        },
        {
            icons: SelfRem,
            Header: 'Self Reminders',
            count: ''
        }
    ]

    const remaindersAction = (args) => {
        if (args.Header == 'Timesheet') {
            navigate('/dashboardTimesheet');
        } else if (args.Header == 'Sales') {
            navigate('/RemainderSales')
        } else if (args.Header == 'Employees') {
            navigate('/RemainderEmployees')
        } else if (args.Header == 'Expense Management') {
            navigate('/RemainderExpenseMgnt')
        } else if (args.Header == 'Employee Self Service') {
            navigate('/RemainderESS')
        } else if (args.Header == 'Payroll') {
            navigate('/RemainderPayroll')
        } else if (args.Header == 'Immigration') {
            navigate('/RemainderImmigration')
        } else if (args.Header == 'Self Reminder') {
            navigate('/self-Remainder')
        }
    }

    const employerOptions = [
        {
            value: '3 Months', id: 1,
        },
        {
            value: '6 Months', id: 2,
        },
        {
            value: '1 Year', id: 3,
        },
        {
            value: 'Custom', id: 4,
        },
    ]

    const [documents, setDocuments] = useState([]);

    const [empMarginData, setEmpMarginData] = useState({
        series: [],
        labels: []
    })

    const pieData = {
        options: {
            dataLabels: {
                enabled: false
            },
            tooltip: {
                enable: false
            },
            legend: {
                show: false,
                position: 'bottom',
            },
            labels: empMarginData.labels,
            colors: ['#0095FF', '#CDE7FF'],
        },
        series: empMarginData.series,
        labels: empMarginData.labels
    };

    const options = {
        legend: {
            show: false,
        },
        labels: ['Internal', 'Consultant', 'Contractor'],
        dataLabels: {
            enabled: false,
        },
        colors: ["#62B2FD", "#9BDFC4", "#F99BAB"],
        states: {
            hover: false,
            active: false,
        },
        tooltip: { enabled: false },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
                expandOnClick: false,
                donut: {
                    size: "65%",
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true
                        },
                        total: {
                            value: 101,
                            show: true,
                            fontFamily: 'Nunito, Nunito Sans, sans-serif ',
                            color: '#707070',
                            font: '14px !important'
                        },
                        value: {
                            fontFamily: 'Nunito, Nunito Sans, sans-serif ',
                            font: '17px !important',
                            offsetY: 0,
                            color: 'black',
                            fontWeight: `${700}`
                        },
                    },

                },
            }
        },
        noData: {
            text: "No Data Found",
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: undefined,
                fontSize: '14px',
                fontFamily: undefined
            }
        }
    }

    const [cashflowData, setCashflowData] = useState({
        inflow_amount: '',
        outflow_amount: '',
        monthNames: [],
        monthWiseInflow: [],
        monthWiseOutflow: [],
        yaxis: []
    })

    const areaOptions = {
        series: [
            {
                name: 'series1',
                data: cashflowData.monthWiseInflow
            },
            {
                name: 'series2',
                data: cashflowData.monthWiseOutflow
            }
        ],
        chart: {
            height: 350,
            type: 'area',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            },
        },
        stroke: {
            show: true,
            colors: ['#9BDFC4', '#FF4B55'],
            width: 1
        },
        fill: {
            type: 'gradient',
            colors: ['#9BDFC4', '#FF4B55'],
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        zoom: {
            enabled: false
        },
        xaxis: {
            type: 'datatype',
            categories: cashflowData.monthNames
        },
        yaxis: {
            type: 'datatype',
            categories: cashflowData.yaxis
        },
        interaction: {
            zoomView: false
        },
        layout: {
            hierarchical: false
        },
        // tooltip: {
        //     x: {
        //         format: 'dd/MM/yy HH:mm'
        //     },
        // },
    }

    const radarOptions = {
        series: payrollLabels.series,
        options: {
            chart: {
                height: 350,
                type: 'radar',
                toolbar: {
                    show: false
                },
                layout: {
                    hierarchical: false
                },
                labels: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            title: {
                text: undefined
            },
            xaxis: {
                categories: payrollLabels.labels
            },
        },
    };

    const buttonHandler = (args) => {
        ApiData['viewType'] = args
        setAPIData({ ...ApiData });
        getCashflow(ApiData);
    }

    const handleRemDateChange = (e) => {
        let date = e.$d;
        console.log("date: " + moment(date).format(dateFormat()));
        setRemDate(moment(date).format(dateFormat()));
        multiDateFunc(date);
        documentsList(moment(date).format(dateFormat()));
    }
    const handleDateClick = (param) => {
        var date = moment(dateArray[param]).format(dateFormat());
        setRemDate(date);
        multiDateFunc(date);
        documentsList(date);
    }
    // based on date setting 1 week feature dates in array
    const multiDateFunc = (date) => {
        setDateArray([]);
        var dumpArray = [];
        for (var i = 0; i < 7; i++) {
            dumpArray.push(moment(date, dateFormat()).add(i, "days").format(dateFormat()))
        }
        setDateArray(dumpArray);
    }

    const getApprovalDropdownList = () => {
        CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmployees(response.data.data);
            }
        });
    };

    // eslint-disable-next-line
    const handleChangeLevels = (e, newArr, index) => {
        console.log(e, "e");
        console.log(newArr, "newArr");
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newArr[newArr.length - 1];
            let approvals = state.employee_ids
            if (approvals.filter((i) => i.id == id).length == 0) {
                approvals.push({ id: id, value: value });
            }
            setState({ ...state, employee_ids: approvals })
            error.employee_ids = ''
            setError({ ...error })
            // multiLevelsValidations(approvals, "approvals", index);
        }
    }

    const changeHandler = (e, index, args) => {
        if (args === 'recurring') {
            if (e.target.name === 'is_recurring') {
                state.reminders[index].is_recurring = e.target.value
                state.reminders[index].recurring_days = e.target.value == 1 ? 1 : e.target.value == 2 ? 10 : e.target.value == 3 ? 15 : e.target.value == 4 ? 30 : ''
                setState(state);
            } else {
                state.reminders[index][e.target.name] = e.target.value
                setState(state);
            }
            handleReminders(e, index)
        }
        if (e.target.name == 'is_payroll_reminder') {
            state['is_payroll_reminder'] = e.target.checked
            setState({ ...state })
        } else if (e.target.name == 'payrollFilters') {
            filters[e.target.name] = e.target.value
            payrollList(e.target.value);
            setFilters(filters);
        }
        else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
        handleValidate(e)
        if(e.target.name === 'pay_config_setting_id'){
            cycleDropdownCheck(e.target.value)
        }
    }

    const handleValidate = (e) => {
        const input = e.target
        switch (input.name || input.tagName) {
            case 'name':
                error.name = validate_charWithSpace(input.value)
                break
            case 'reminder_date':
                error.reminder_date = validate_emptyField(input.value)
                break
            case 'reminder_time':
                error.reminder_time = validate_emptyField(input.value)
                break;
            case 'pay_config_setting_id':
                error.pay_config_setting_id = validate_emptyField(input.value)
                break;
            case 'check_date':
                error.check_date = validate_emptyField(input.value)
                break
            case 'description':
                error.description = validate_emptyField(input.value)
                break;
            case 'employee_ids':
                console.log(input.value, "****");
                error.employee_ids = input.value.length == 0 ? 'This field is required' : ''
                break;
            default:
                break
        }
        setError({ ...error })
    }

    const handleReminders = (e, index) => {
        let input = e.target;
        let error = erro.length > 0 ? (erro ? erro[index] : erro) : erro;
        for (var k = 0; k <= index; k++) {
            erro.push({});
        }
        let s2 = erro.length > 0 ? [...erro] : [{ ...erro }];
        switch (input.name || input.tagName) {
            case "occurance_order":
                error.occurance_order = validate_emptyField(input.value);
                break;
            case "number":
                error.number = validates_Integer(input.value);
                break;
            case "cycle":
                error.cycle = validate_emptyField(input.value);
                break;
            case "is_recurring":
                error.is_recurring = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setErro(s2);
    }

    const validateAll = () => {
        const { name, reminder_date, reminder_time, pay_config_setting_id, check_date, employee_ids } = state
        let errors = {};
        console.log(employee_ids, "employee_ids");
        errors.name = validate_charWithSpace(name);
        errors.reminder_date = state.is_payroll_reminder == false ? validate_emptyField(reminder_date) : '';
        errors.reminder_time = state.is_payroll_reminder == false ? validate_emptyField(reminder_time) : '';
        errors.pay_config_setting_id = state.is_payroll_reminder ? validate_emptyField(pay_config_setting_id) : '';
        errors.check_date = state.is_payroll_reminder ? validate_emptyField(check_date) : '';
        errors.employee_ids = employee_ids.length == 0 ? 'This field is required' : '';
        setError(errors);
        return errors;
    }

    const validateReminderErrors = () => {
        let errors = {};
        let err = []; // eslint-disable-next-line
        state.reminders.map((item) => {
            errors = {};
            errors.occurance_order = state.is_payroll_reminder ? validate_emptyField(item.occurance_order) : '';
            errors.number = state.is_payroll_reminder ? validates_Integer(item.number) : '';
            errors.cycle = state.is_payroll_reminder ? validate_emptyField(item.cycle) : '';
            errors.is_recurring = state.is_payroll_reminder ? validate_emptyField(item.is_recurring) : '';
            err.push(errors);
            setErro(err);
        })
        return err;
    }

    // eslint-disable-next-line
    const handleDeleteChipLevels = (key, index) => {
        let approvals = state.employee_ids;
        let deletedChipsArr = deletedchips;
        if (approvals[key].id !== '') {
            deletedChipsArr.push(approvals[key]);
        }
        approvals.splice(key, 1);
        setState({ ...state, approvals })
        if (approvals.length === 0) {
            error.employee_ids = 'This field is required'
            setError({ ...error })
        }
        setDeletedchips([...deletedChipsArr]);
    }

    const uploadDocs = (value, index) => {
        if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
            const formData = new FormData();
            formData.append("files", value.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("remainder-documents", formData, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        state.documents[index].new_document_id = response.data.data.id
                        state.documents[index].docName = value.target.files[0].name
                        setState({ ...state })
                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
        }
    };

    const deleteDoc = (args) => {
        state.documents[args].new_document_id = ''
        state.documents[args].docName = ''
        setState({ ...state });
    }

    const changeTime = (value) => {
        let event = {}
        event.target = {}
        event.target.name = 'reminder_time'
        event.target.value = value
        setState({
            ...state,// eslint-disable-next-line
            ['reminder_time']: value,
        }, handleValidate(event))
    }


    return (
        <Grid container spacing={2} pl={15} pt={2} alignItems='flex-start'>
            <Grid item container lg={8} md={8} sm={7} xs={12} pt={3} sx={{ height: '650px !important', overflowY: "scroll", "&::-webkit-scrollbar": { display: 'none !important' } }}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Text boldBlackfont22>DashBoard</Text>
                </Grid>
                <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12} pt={3}>
                    <Grid item lg={6} md={6} sm={12} xs={12} className={classes.borderRight}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Text BlackExtraDark>Employees Data</Text>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} pt={2} textAlign='center'>
                            <Chart
                                options={options}
                                type='donut'
                                series={[Number(totalEmp.internal_employee), Number(totalEmp.consultant), Number(totalEmp.contractor)]}
                                height={'200px'}
                            />
                            <Grid item container lg={12} md={12} sm={12} xs={12} justifyContent='center' spacing={1} pt={2}>
                                <Grid item container lg={12} md={12} sm={12} xs={12} justifyContent='center'>
                                    <Grid item container lg={5} md={8} sm={8} xs={12}>
                                        <Grid item lg={10} md={10} sm={10} xs={10}>
                                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                                <Box className={classes.blueDot} />
                                                <Text largeLabel>Internal Employee</Text>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={2}>
                                            <Text largeBldBlack>{totalEmp.internal_employee}</Text>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item container lg={12} md={12} sm={12} xs={12} justifyContent='center'>
                                    <Grid item container lg={5} md={8} sm={8} xs={12}>
                                        <Grid item lg={10} md={10} sm={10} xs={10}>
                                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                                <Box className={classes.greenDot} />
                                                <Text largeLabel>Consultant</Text>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={2}>
                                            <Text largeBldBlack>{totalEmp.consultant}</Text>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item container lg={12} md={12} sm={12} xs={12} justifyContent='center'>
                                    <Grid item container lg={5} md={8} sm={8} xs={12}>
                                        <Grid item lg={10} md={10} sm={10} xs={10}>
                                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                                <Box className={classes.pinkDot} />
                                                <Text largeLabel>Contractor</Text>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={2}>
                                            <Text largeBldBlack>{totalEmp.contractor}</Text>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container spacing={2} lg={6} md={6} sm={12} xs={12} pl={2}>
                        <Grid item container alignItems='center' spacing={2} lg={12} md={11} sm={12} xs={12}>
                            <Grid item lg={8} md={7} sm={7} xs={8}>
                                <Text BlackExtraDark>Total Receivables</Text>
                            </Grid>
                            <Grid item lg={4} md={3} sm={4} xs={4}>
                                <Button DashboardAdd onClick={() => navigate('/ledgers/Newpayment')}>Add New</Button>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Text boldBlackfont22>{LocalStorage.getCurrencySymbol()}&nbsp;{Recievables.receivables.total}</Text>
                            </Grid>
                            <Grid item container lg={12} md={12} sm={12} xs={12} alignItems='center'>
                                <Grid item lg={4} md={4} sm={4} xs={4}>
                                    <Text mediumBlue><img src={Arrowup} alt="Arrow" className={classes.ArrowMargin} />Current</Text>
                                    <Text mediumLabel sx={{ paddingTop: '10px !important' }}>{LocalStorage.getCurrencySymbol()}&nbsp;{Recievables.receivables.current}</Text>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={4}>
                                    <Text mediumRed><img src={ArrowDown} alt="D-arrow" className={classes.ArrowMargin} />Overdues</Text>
                                    <Text mediumLabel sx={{ paddingTop: '10px !important' }}>{LocalStorage.getCurrencySymbol()}&nbsp;{Recievables.receivables.overdue}</Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container lg={12} md={12} sm={12} xs={12} m={'0px 0px 8px 0px'}>
                            <Divider sx={{ width: '95%', borderColor: '#F5F5F5' }} />
                        </Grid>
                        <Grid item container alignItems='center' spacing={2} lg={12} md={11} sm={12} xs={12}>
                            <Grid item lg={8} md={7} sm={7} xs={8}>
                                <Text BlackExtraDark>Total Payables</Text>
                            </Grid>
                            <Grid item lg={4} md={3} sm={4} xs={12}>
                                <Button DashboardAdd onClick={() => navigate('/ledgers/NewBills')}>Add New</Button>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Text boldBlackfont22>{LocalStorage.getCurrencySymbol()}&nbsp;{Recievables.payables.total}</Text>
                            </Grid>
                            <Grid item container lg={12} md={12} sm={12} xs={12} alignItems='center'>
                                <Grid item lg={4} md={4} sm={4} xs={4}>
                                    <Text mediumBlue><img src={Arrowup} alt="Arrow" className={classes.ArrowMargin} />Current</Text>
                                    <Text mediumLabel sx={{ paddingTop: '10px !important' }}>{LocalStorage.getCurrencySymbol()}&nbsp;{Recievables.payables.current}</Text>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={4}>
                                    <Text mediumRed><img src={ArrowDown} alt="D-arrow" className={classes.ArrowMargin} />Overdues</Text>
                                    <Text mediumLabel sx={{ paddingTop: '10px !important' }}>{LocalStorage.getCurrencySymbol()}&nbsp;{Recievables.payables.overdue}</Text>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', margin: '30px 0px', borderColor: '#F5F5F5' }} />
                </Grid>
                <Grid container>
                    <Grid item container lg={12} md={12} sm={12} xs={12} paddingRight={3} spacing={1} alignItems='center'>
                        <Grid item lg={7} md={4} sm={3} xs={7}>
                            <Text BlackExtraDark>Cash Flow</Text>
                        </Grid>
                        <Grid item lg={3} md={5} sm={6} xs={3}>
                            <Box display='flex' flexDirection='row' alignItems='center' textAlign='center'>
                                <Box className={ApiData.viewType == 'cash' ? classes.cashFlowActive : classes.cashFlowInactive} onClick={() => buttonHandler('cash')}>
                                    {
                                        ApiData.viewType == 'cash' ?
                                            <Text largeWhite>Cash Basis</Text> : <Text largeBlack>Cash Basis</Text>
                                    }
                                </Box>
                                <Box className={ApiData.viewType == 'accrual' ? classes.accrualActive : classes.accrualInActive} onClick={() => buttonHandler('accrual')}>
                                    {ApiData.viewType == 'accrual' ?
                                        <Text largeWhite>Accrual Basis</Text> : <Text largeBlack>Accrual Basis</Text>
                                    }
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={2} md={3} sm={3} xs={2}>
                            <CustomSelect
                                name='cashflow'
                                value={dropDownState.cashflow}
                                viewDrop
                                scrollTrue={true}
                                options={employerOptions}
                                onChange={(e) => dropDownChangeHandler(e, 'cashFlow')}
                            />
                        </Grid>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} pt={3}>
                        <ReactApexChart
                            options={areaOptions}
                            series={areaOptions.series}
                            type="area"
                            height='300px'
                        />
                    </Grid>
                    <Divider sx={{ width: '100%', margin: '30px 0px', borderColor: '#F5F5F5' }} />
                    <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12} p={'15px 10px'}>
                        <Grid item lg={6} md={6} sm={6} xs={6} sx={{ borderRight: '1px solid #F5F5F5' }}>
                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                <Box className={classes.greenDot} />
                                <Text largeBlack>Inflow</Text>
                            </Box>
                            <Text boldBlackfont22 sx={{ paddingTop: '6px' }}>{LocalStorage.getCurrencySymbol()}{cashflowData.inflow_amount}</Text>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                <Box className={classes.redDot} />
                                <Text largeBlack>Out flow</Text>
                            </Box>
                            <Text boldBlackfont22 sx={{ paddingTop: '6px' }}>{LocalStorage.getCurrencySymbol()}{cashflowData.outflow_amount}</Text>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', margin: '20px 0px 30px 0px', borderColor: '#F5F5F5' }} />
                    <Grid container spacing={2} pt={2} alignItems='flex-start'>
                        <Grid item container lg={6} md={12} sm={12} xs={12} justifyContent='center' className={classes.borderRight}>
                            <Grid item lg={7} md={6} sm={6} xs={6}>
                                <Text BlackExtraDark>Employer Margin</Text>
                            </Grid>
                            <Grid item lg={4} md={6} sm={6} xs={6}>
                                <CustomSelect
                                    name='empMargin'
                                    value={dropDownState.empMargin}
                                    viewDrop
                                    scrollTrue={true}
                                    options={employerOptions}
                                    onChange={(e) => dropDownChangeHandler(e, 'empMargin')}
                                />
                            </Grid>
                            <Grid item lg={8} md={8} sm={12} xs={12} pt={2} textAlign='center'>
                                <Chart
                                    options={pieData.options}
                                    series={pieData.series}
                                    type="donut"
                                    height='280px'
                                    width='280px'
                                />
                                <Grid item container lg={12} justifyContent='center' textAlign='center'>
                                    <Grid item container lg={5}>
                                        <Box display='flex' flexDirection='column' gap={1}>
                                            <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                                                <Box className={classes.lightBlueDot} />
                                                <Text largeBlack>Margin</Text>
                                            </Box>
                                            <Text boldBlackfont16>{empMarginData.series[1]}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid item container lg={4} textAlign='start'>
                                        <Box display='flex' flexDirection='column' gap={1}>
                                            <Box display='flex' flexDirection='row' gap={1} alignItems='center' textAlign='end'>
                                                <Box className={classes.blueDot} />
                                                <Text largeBlack>Balance</Text>
                                            </Box>
                                            <Text boldBlackfont16>{empMarginData.series[0]}</Text>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container lg={6} md={12} sm={12} xs={12} justifyContent='center'>
                            <Grid item lg={12} md={12} sm={12} xs={12} pl={2}>
                                <Text BlackExtraDark>Companies</Text>
                            </Grid>
                            {/* <Grid item lg={4} md={6} sm={6} xs={6}>
                                <CustomSelect
                                    viewDrop
                                    scrollTrue={true}
                                    options={employerOptions}
                                />
                            </Grid> */}
                            <Grid item container textAlign='center' alignItems='center' lg={12} md={12} sm={12} xs={12} spacing={2} mt={1} pl={2} sx={{ maxHeight: '280px', overflowY: 'scroll', "&::-webkit-scrollbar": { display: 'none !important' } }}>
                                {
                                    companies.length > 0 && companies.map((item, index) => (
                                        <>
                                            <Grid item lg={1} md={1} sm={1} xs={1}><Text largeBlack>{index + 1}</Text></Grid>
                                            <Grid item lg={3} md={3} sm={3} xs={3} textAlign='start'><Text largeBlack>{item.name}</Text></Grid>
                                            <Grid item lg={4} md={4} sm={4} xs={4} justifyContent='center'>
                                                <BorderLinearProgress variant="determinate" value={item.percentage} barColor={linearProgress[index].bgColor} bgColor={linearProgress[index].barColor} />
                                            </Grid>
                                            <Grid item lg={4} md={4} sm={4} xs={4} textAlign='right' sx={{ display: 'block' }}>
                                                <AvatarGroup total={item.placement_count} spacing={18} renderSurplus={(surplus) => <span>{surplus.toString()}</span>}
                                                    sx={{
                                                        justifyContent: 'flex-end',
                                                        "& .css-sxh3gq-MuiAvatar-root-MuiAvatarGroup-avatar": {
                                                            width: '35px',
                                                            height: '35px',
                                                            color: '#0C75EB',
                                                            backgroundColor: '#D1E1FF',
                                                            font: '12px Nunito Sans, sans-serif !important',
                                                            fontWeight: `${600} !important`,
                                                        },
                                                        "& .MuiAvatar-root": {
                                                            position: "static !important",
                                                            border: "none !important"
                                                            // marginX: '-10px'
                                                        },
                                                    }}
                                                >
                                                    {item && item.employees && item.employees.map((avt, avtIndex) =>
                                                        <Avatar alt={`Avatar ${avtIndex + 1}`} src={avt ? avt : ''} sx={{ width: "35px", height: "35px" }} />)}
                                                </AvatarGroup>
                                            </Grid>
                                        </>
                                    ))
                                }
                            </Grid>
                            {
                                companies.length > 5 &&
                                <Grid item lg={10} md={10} sm={10} xs={10} pt={2} textAlign='end'>
                                    <Text smallBlue sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>View All</Text>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                    <Hidden lgDown>
                        <Divider sx={{ width: '100%', margin: '30px 0px 20px 0px', borderColor: '#F5F5F5' }} />
                    </Hidden>
                    <Grid item container spacing={2} pt={2}>
                        <Grid item container lg={6} md={6} sm={12} xs={12} justifyContent='center' className={classes.borderRight}>
                            <Grid item lg={11} md={11} sm={11} xs={11}>
                                <Text BlackExtraDark>Self Reminders</Text>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                                <img src={plus} alt="add" onClick={() => setOpenReminder(true)} style={{ cursor: 'pointer' }} />
                            </Grid>
                            <Divider sx={{ width: '100%', borderColor: '#F5F5F5', margin: '0px 0px' }} />
                            <Grid item md={12} xs={12} className={classes.filterGrid}>
                                <DateSelect name='remDate' value={remDate} onChange={(value) => handleRemDateChange(value)} />
                            </Grid>
                            <Grid item md={12} xs={12} className={classes.dateRowGrid} pb={2}>
                                {
                                    dateArray.length > 0 && dateArray.map((date, i) =>
                                        <Box key={i} onClick={() => { handleDateClick(i) }} className={classes.activeDateBox} sx={{ background: i == 0 && "#0095FF" }}>
                                            {
                                                i == 0 ? <>
                                                    <Text smallWhite className={classes.dateText}>{moment(date).format('ddd')}</Text>
                                                    <Text mediumBoldWhite className={classes.dateText}>{moment(date).format('DD')}</Text>
                                                </> :
                                                    <>
                                                        <Text smallBlack className={classes.dateText}>{moment(date).format('ddd')}</Text>
                                                        <Text mediumBoldBlack className={classes.dateText}>{moment(date).format('DD')}</Text>
                                                    </>
                                            }

                                        </Box>
                                    )}
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: '250px', overflowY: 'scroll', "&::-webkit-scrollbar": { display: 'none !important' } }}>
                                {
                                    documents.map((item) => (
                                        <Grid item container lg={12} md={12} sm={12} xs={12} spacing={2} alignItems='center' pt={2}>
                                            <Grid item lg={9} md={9} sm={9} xs={9}>
                                                <Text blackFont14 noWrap>{item.name}</Text>
                                                <Text smallGrey noWrap>{item.description}</Text>
                                            </Grid>
                                            <Grid item lg={3} md={3} sm={3} xs={3} textAlign='center'>
                                                <img src={menu} alt="menu" onClick={(e) => setOpenStatus(e.currentTarget)} style={{ cursor: 'pointer' }} />
                                                <Menu
                                                    id="basic-menu"
                                                    anchorEl={openStatus}
                                                    open={openStatus}
                                                    onClose={handleStatus}
                                                    sx={{
                                                        '& .MuiPaper-root': {
                                                            boxShadow: 'none !important',
                                                            border: '1px solid #EAECF0 !important',
                                                            width: '140px !important'
                                                        }
                                                    }}
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                >
                                                    <MenuItem onClick={handleStatus} value={1} className={classes.viewText} ><Text smallBlack>Mark as completed</Text></MenuItem>
                                                    <MenuItem onClick={handleStatus} value={2} className={classes.viewText} ><Text smallBlack>Remind me later</Text></MenuItem>
                                                    <MenuItem onClick={handleStatus} value={3} className={classes.viewText} ><Text smallBlack>Mute Reminders</Text></MenuItem>
                                                    <MenuItem onClick={handleStatus} value={4} className={classes.deleteText} ><Text smallBlack>Delete</Text></MenuItem>
                                                </Menu>
                                            </Grid>
                                            <Divider sx={{ width: '93%', borderColor: '#F5F5F5', margin: '10px 0px' }} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Grid>
                        <Grid item container lg={6} md={6} sm={12} xs={12} justifyContent='center' alignItems='center'>
                            <Grid item lg={12} md={12} sm={12} xs={12} pl={2}>
                                <Text BlackExtraDark>PayRoll</Text>
                            </Grid>
                            {/* <Grid item lg={4} md={5} sm={4} xs={4}>
                                <CustomSelect
                                    viewDrop
                                    scrollTrue={true}
                                    options={payrollDropdown}
                                    name='payrollFilters'
                                    value={filters.payrollFilters}
                                    onChange={changeHandler}
                                />
                            </Grid> */}
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <ReactApexChart options={radarOptions.options} series={radarOptions.series} type="radar" height={400} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container lg={4} md={4} sm={5} xs={12} p={'0px 10px 0px 30px !important'}>
                <Grid item lg={12} xs={12} pt={2}>
                    <Text BlackExtraDark boldBlackfont600>Reminders & Actions</Text>
                </Grid>
                <Grid item lg={12} xs={12} pt={3}>
                    {
                        Reminders.map((item) => (
                            <Grid item container lg={12} alignItems='center' sx={{ padding: '8px 0px 8px 0px !important', cursor: 'pointer' }} spacing={2} onClick={() => remaindersAction(item)}>
                                <Grid item lg={1}>
                                    <img src={item.icons} alt="TS" />
                                </Grid>
                                <Grid item lg={9}>
                                    <Text mediumBlack>{item.Header}</Text>
                                </Grid>
                                {/* <Grid item lg={1}>
                                    <Box sx={{
                                        color: 'white !important', background: 'red !important', borderRadius: '15px', textAlign: 'center'
                                    }}>
                                        <Text largeWhite>{item.count}</Text>
                                    </Box>
                                </Grid> */}
                                <Box sx={{ width: "95%", paddingTop: "10px" }}>
                                    <Divider sx={{ width: '100%', borderColor: '#F5F5F5' }} />
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
            <ReusablePopup openPopup={openReminder} setOpenPopup={setOpenReminder} white fullWidth iconHide>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}><Text mediumBlack>Add Reminder</Text></Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Input
                            clientInput
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'name',
                                value: state.name
                            }}
                            handleChange={changeHandler}
                            labelText={<Text smallLabel>Reminder Name</Text>}
                        />
                        {error.name && <Text red>{error.name ? error.name : ''}</Text>}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box className={classes.customScrollbar}>
                            <TextField
                                label={<Box style={{ display: 'flex' }} gap={0.5}><Text sx={{
                                    color: '#737373 !important',
                                    fontFamily: "Nunito Sans, sans-serif !important",
                                    fontSize: '14px !important',
                                    fontWeight: 500
                                }} >Description</Text>
                                    <Text sx={{
                                        color: '#C7CCD3 !important',
                                        fontFamily: "Nunito Sans, sans-serif !important",
                                        fontSize: '14px !important',
                                        fontWeight: 400
                                    }}>(Optional)</Text>
                                </Box>}
                                variant="filled"
                                size="small"
                                fullWidth
                                multiline
                                rows={2}
                                inputProps={{
                                    name: 'description',
                                    value: state.description,
                                    maxLength: 250,
                                }}
                                InputProps={{
                                    sx: {
                                        color: '#737373 !important',
                                        fontFamily: "Nunito Sans, sans-serif !important",
                                        borderRadius: '8px !important',
                                        background: 'white !important',
                                        border: `1px solid #C7CCD3 !important`,
                                        height: '100% !important',
                                        paddingTop: '18px',
                                        paddingLeft: '12px',

                                    },
                                    disableUnderline: true,
                                }}
                                onChange={changeHandler}
                            />
                            {error.description && <Text red>{error.description ? error.description : ''}</Text>}
                        </Box>
                    </Grid>
                    {
                        state.documents.map((item, index) => (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <FileInput
                                    name='new_document_id'
                                    FileName={item ? item.docName : ''}
                                    handleChange={(e) => uploadDocs(e, index)}
                                    uploadKeyName={'Upload'}
                                    isDisabled={false}
                                    handleDelete={() => deleteDoc(index)}
                                    actionState={item.docName ? 1 : ''}
                                    label={<Text largeLabel>Attatchments <span className={classes.optional}>(Optional)</span></Text>}
                                />
                            </Grid>
                        ))
                    }
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box display='flex' flexDirection='row' gap={1} alignItems='center'>
                            <Checkbox name='is_payroll_reminder' value={state.is_payroll_reminder} onChange={changeHandler} />
                            <Text smallBlack>This reminder is related to payroll</Text>
                        </Box>
                    </Grid>
                    {
                        state.is_payroll_reminder == true &&
                        <Grid item container spacing={2} alignItems='center' pb={1}>
                            <Grid item container lg={11} md={11} sm={11} xs={11} spacing={2}>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <SearchSelect
                                        options={cycleList}
                                        labelText={<Text largeLabel>Pay Cycle</Text>}
                                        name='pay_config_setting_id'
                                        value={state.pay_config_setting_id}
                                        onChange={changeHandler}
                                    />
                                    {error.pay_config_setting_id && <Text red>{error.pay_config_setting_id ? error.pay_config_setting_id : ''}</Text>}
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <SearchSelect
                                        options={cycleListDate}
                                        labelText={<Text largeLabel>Check Date</Text>}
                                        name='check_date'
                                        value={state.check_date}
                                        onChange={changeHandler}
                                    />
                                    {/* <Date
                                        labelText={<Text largeLabel>Check Date</Text>}
                                        name='check_date'
                                        value={state.check_date}
                                        height='53px'
                                        minDate={moment().format(dateFormat())}
                                        onChange={(value => dateChange(value, 'check_date'))}
                                    /> */}
                                    {error.check_date && <Text red>{error.check_date ? error.check_date : ''}</Text>}
                                </Grid>
                            </Grid>
                            <Grid item lg={1} md={1} sm={12} xs={1}>
                                <BlackToolTip arrow placement='top' title={<Text smallWhite sx={{ padding: '5px !important' }}>Reminder Can only be set before <br /> the check date of this cycle</Text>}>
                                    <Info />
                                </BlackToolTip>
                            </Grid>
                        </Grid>
                    }
                    <Divider sx={{ width: '100%', borderColor: '#F5F5F5', margin: '5px 0px 5px 10px' }} />
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box py={1}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                                <div style={{ width: '100%', paddingTop: state.employee_ids.length > 0 ? '16px' : '0px', minHeight: '59px', display: 'flex', alignItems: "center", }}>
                                    <Autocomplete
                                        multiple
                                        limitTags={2}
                                        id="multiple-limit-tags"
                                        options={employees}
                                        getOptionLabel={(option) => option.value}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.uniqueIdentifier}>
                                                {option.value}
                                            </li>
                                        )}
                                        name='employee_ids'
                                        value={state.employee_ids}
                                        renderInput={(params) => (
                                            <TextField {...params} className={classes.multiSelectinputLabel} pt={2} label='Assign To' />
                                        )}
                                        onChange={(e, newArr) => handleChangeLevels(e, newArr)}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, keyId) => (
                                                <Chip
                                                    {...getTagProps({ keyId })}
                                                    key={keyId}
                                                    label={option && option.value}
                                                    sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                    onDelete={() => handleDeleteChipLevels(keyId)}
                                                />
                                            ))
                                        }
                                        sx={{
                                            width: '100%',
                                            "& .MuiInputBase-root": {
                                                cursor: "pointer",
                                            },
                                            "& .MuiInputBase-input": {
                                                cursor: "pointer",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                border: "none"
                                            },
                                            "& .MuiAutocomplete-endAdornment": {
                                                display: "none"
                                            },
                                            "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
                                                transform: "translate(10px, 16px) scale(1);"
                                            },
                                            "& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root": {
                                                color: "#737373",
                                                fontSize: "14px",
                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                fontWeight: 400,
                                            },
                                            "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
                                                color: "#737373",
                                                fontSize: "16px",
                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                fontWeight: 500,
                                            },
                                            "&.Mui-focused .MuiInputLabel-outlined": {
                                                color: "#737373",
                                                fontSize: "10px",
                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                fontWeight: 400,
                                                transform: state.employee_ids.length === 0 ? "translate(12px, 0px) scale(1);" : "translate(12px, -8px) scale(1);"
                                            },
                                        }}
                                    />
                                </div>
                            </Box>
                            {error.employee_ids && <Text red>{error.employee_ids ? error.employee_ids : ''}</Text>}
                        </Box>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Text smallBlack>{state.is_payroll_reminder == true ? 'Reminder Cycle' : 'Remind On'}</Text>
                    </Grid>
                    {
                        state.is_payroll_reminder == true ?
                            state.reminders.length > 0 && state.reminders.map((item, index) => (
                                <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12}>
                                    <Grid item container spacing={2} lg={11} md={11} sm={11} xs={11}>
                                        <Grid item lg={3} md={3} sm={3} xs={12}>
                                            <SearchSelect
                                                options={[{ id: 1, value: 'Before' }, { id: 2, value: 'After' }]}
                                                labelText={<Text largeLabel>Remind</Text>}
                                                name='occurance_order'
                                                value={item.occurance_order}
                                                onChange={(e) => changeHandler(e, index, 'recurring')}
                                            />
                                            {erro.length > 0 && (<Text red>{erro[index] ? erro[index].occurance_order : ""}</Text>)}
                                        </Grid>
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <Input
                                                clientInput
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'number',
                                                    value: item.number,
                                                    inputProps: { maxLength: 50 }
                                                }}
                                                handleChange={(e) => changeHandler(e, index, 'recurring')}
                                                labelText={<Text smallLabel>Count</Text>}
                                            />
                                            {erro.length > 0 && (<Text red>{erro[index] ? erro[index].number : ""}</Text>)}
                                        </Grid>
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <SearchSelect
                                                options={days}
                                                labelText={<Text largeLabel>Remind</Text>}
                                                name='cycle'
                                                value={item.cycle}
                                                onChange={(e) => changeHandler(e, index, 'recurring')}
                                            />
                                            {erro.length > 0 && (<Text red>{erro[index] ? erro[index].cycle : ""}</Text>)}
                                        </Grid>
                                        {
                                            index == state.reminders.length - 1 &&
                                            <Grid item lg={3} md={3} sm={3} xs={12}>
                                                <SearchSelect
                                                    options={semiDays}
                                                    labelText={<Text largeLabel>Remind Every<span className={classes.optional}>(Optional)</span></Text>}
                                                    name='is_recurring'
                                                    value={item.is_recurring}
                                                    onChange={(e) => changeHandler(e, index, 'recurring')}
                                                />
                                                {erro.length > 0 && (<Text red>{erro[index] ? erro[index].is_recurring : ""}</Text>)}
                                            </Grid>
                                        }
                                    </Grid>
                                    <Grid item container alignItems='center' lg={1} md={2} sm={3} xs={1}>
                                        {state && (
                                            <Box alignItems='center'>
                                                {state.reminders.length - 1 === index ? (
                                                    <>
                                                        {
                                                            <Add className={classes.add} onClick={() => handleAddLevel()} />
                                                        }
                                                        {state.reminders.length > 1 ? (
                                                            <Remove className={classes.minus} onClick={() => handleRemoveLevel(index)} />
                                                        ) : null}
                                                    </>
                                                ) : (
                                                    <Remove className={classes.minus} onClick={() => handleRemoveLevel(index)} />
                                                )}
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>)) :
                            <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12}>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <Date
                                        labelText={<Text largeLabel>Date</Text>}
                                        name='reminder_date'
                                        value={state.reminder_date}
                                        minDate={moment().format(dateFormat())}
                                        height='53px'
                                        onChange={(value => dateChange(value, 'reminder_date'))}
                                    />
                                    {error.reminder_date && <Text red>{error.reminder_date ? error.reminder_date : ''}</Text>}
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {/* <DemoContainer components={['TimePicker']}> */}
                                        <TimePicker label="Time" name='reminder_time'
                                            onChange={(value) => { changeTime(value) }}
                                            slotProps={
                                                {
                                                    textField: {
                                                        InputProps: {
                                                            disableUnderline: true
                                                        },
                                                        variant: 'filled',
                                                        fullWidth: true,
                                                        onKeyPress: (e) => { e.preventDefault(); },
                                                        sx: {
                                                            "& .MuiOutlinedInput-input": {
                                                                font: '14px Nunito !important',
                                                                fontWeight: `${400} !important`,
                                                            },

                                                            ".MuiFormLabel-root.MuiInputLabel-root": {
                                                                font: '14px Nunito !important',
                                                                fontWeight: `${400} !important`,
                                                                color: '#737373 !important'
                                                            },

                                                            '& .MuiInputBase-root': {
                                                                height: '54px !important',
                                                                border: `1px solid #C7CCD3 !important`,
                                                                borderRadius: '8px !important',
                                                                background: `#FFFF !important`,
                                                            },
                                                            "& .MuiInputBase-input.MuiFilledInput-input": {
                                                                font: '14px Nunito !important',
                                                                fontWeight: `${400} !important`,
                                                                color: '#262626 !important'
                                                            },

                                                            "& .MuiInputBase-input.MuiFilledInput-input.Mui-disabled": {
                                                                '-webkit-text-fill-color': '#525252 !important',
                                                            },
                                                            background: "#FFFF !important",
                                                            svg: { color: '#747474', height: "24px" },

                                                        }
                                                    }
                                                }}
                                            value={state.reminder_time} />
                                        {/* </DemoContainer> */}
                                    </LocalizationProvider>
                                    {/* <Input
                                        clientInput
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'time',
                                            name: 'reminder_time',
                                            value: state.reminder_time
                                        }}
                                        handleChange={changeHandler}
                                        labelText={<Text smallLabel>Time</Text>}
                                    /> */}
                                    {error.reminder_time && <Text red>{error.reminder_time ? error.reminder_time : ''}</Text>}
                                </Grid>
                            </Grid>
                    }
                    <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12} mt={1}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Button cancelText onClick={() => setOpenReminder(false)}>Cancel</Button>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Button blueButton onClick={createReminder}>Create</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </ReusablePopup>
            <ReusablePopup openPopup={success} setOpenPopup={setSuccess} white fixedWidth iconHide>
                <Grid container spacing={2} textAlign='center'>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <img src={successImg} alt="success" />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Text largeBoldGreen>Reminder Added Successfully</Text>
                    </Grid>
                    <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12} mt={1}>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Button borderCancel >View All Reminders</Button>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Button blueButton onClick={() => { setSuccess(false) }}>Go To Dashboard</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </ReusablePopup>
        </Grid >
    )
};
