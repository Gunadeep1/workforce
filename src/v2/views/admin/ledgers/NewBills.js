import { Box, Breadcrumbs, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Text from '../../../components/customText/Text'
import SearchSelect from '../../../components/selectField/SearchSelect'
import Input from '../../../components/input/Input';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import Date from '../../../components/datePicker/Date';
import moment from 'moment';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../utils/utils';
import FileInput from '../../../components/muiFileInput/FileInput';
import CommonApi from '../../../apis/CommonApi';
import LocalStorage from '../../../utils/LocalStorage';
import Button from '../../../components/customButton/Button';
import ClientsApi from '../../../apis/admin/clients/ClientsApi';
import Table from '../../../components/table/Table';
import PaymentsApi from '../../../apis/admin/ledgers/PaymentsApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValid, validate_alphaNumeric, validate_emptyField, validates_Integer, validates_float } from '../../../components/Validation';
import LedgerApi from '../../../apis/admin/ledgers/LedgerApi';
import success from '../../../assets/svg/paymentSuccess.svg';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import updatePayment from '../../../assets/svg/paymentupdate.svg';

function NewPayment() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const Location = useLocation();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location && location.state && location.state.id
    const action = location && location.state && location.state.action
    const [actionState, setActionState] = useState(action);

    const [state, setState] = useState({
        company_id: "",
        total_ledger_amount: "",
        total_received_amount: 0,
        total_recieve: 0,
        total_balance_amount: "",
        total_excess_amount: 0,
        refund_amount: 0,
        payment_amount: "",
        payment_mode_id: "",
        payment_mode: "",
        payment_reference_number: "",
        received_on: "",
        notes: "",
        documents: [
            {
                new_document_id: '',
                document_name: ''
            }
        ],
        debited_credits: 0,
        ledger_section_details: [
            // {
            //     ledger_id: "",
            //     amount: 0,
            //     received_amount: 0,
            //     balance_amount: 0,
            //     balance_amount_total: 0,
            // },
        ],
    });
    // eslint-disable-next-line
    const [clients, setClients] = useState([]); // eslint-disable-next-line
    const [rows, setRows] = useState([]);
    const [error, setError] = useState({});
    const currentDate = moment().format(dateFormat())
    const paymentModes = [
        {
            id: 1,
            value: 'CC'
        },
        {
            id: 2,
            value: 'Cheque'
        }
    ]
    const [openTooltip, setOpenTooltip] = useState(false);
    const tooltipToggle = () => {
        openTooltip ? setOpenTooltip(false) : setOpenTooltip(true)
    }
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    useEffect(() => {
        clientDropdownList();
        if (id !== '' && id !== null && id !== undefined) {
            indexList(id);
        } // eslint-disable-next-line
    }, [id])

    const changeHandler = (e) => {
        if (e.target.name == 'company_id') {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
            invoiceListing(e.target.value);
        }
        else if (e.target.name == 'total_received_amount') {
            calculationAmount(e);
            let extraAmt = Number(e.target.value) - state.total_ledger_amount
            state.total_excess_amount = extraAmt < 0 ? 0 : extraAmt

            if (state.debited_credits >= Number(e.target.value)) {
                setState({
                    ...state,
                    [e.target.name]: e.target.value,
                    total_recieve: Number(e.target.value),
                    debited_credits: Number(e.target.value)
                });
            }
            else {
                setState({
                    ...state,
                    [e.target.name]: e.target.value,
                    total_recieve: Number(e.target.value),
                });
            }
        } else if (e.target.name == "debited_credits") {
            if (Number(e.target.value) <= (Location.state && Location.state.id != '' ? state.client_unused_credits : rows.length > 0 && rows[0].client_unused_credits)) {
                let extra = state.total_recieve + Number(e.target.value)
                let excess = extra - state.total_ledger_amount;
                let excsAmt = excess < 0 ? 0 : excess
                let target = {
                    target: {
                        value: extra
                    }
                }
                calculationAmount(target);
                setState({
                    ...state,
                    [e.target.name]: Number(e.target.value),
                    total_received_amount: extra,
                    total_excess_amount: excsAmt
                })
            }
        }
        else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
        handleValidate(e);
    }

    const calculationAmount = (e) => {
        var amount = state.total_ledger_amount - e.target.value;
        if (state.total_ledger_amount < e.target.value) {
            state.total_balance_amount = 0;
            state.total_excess_amount = e.target.value - state.total_ledger_amount;
            setState(state);
        } else {
            state.total_balance_amount = amount;
            setState(state);
        }
        var total = state.total_ledger_amount;
        for (let i = 0; i < state.ledger_section_details.length; i++) {
            var targetValue = Number(e.target.value);
            var individualAmount = Location.state && Location.state.id != '' ? state.ledger_section_details[i].balance_amount + state.ledger_section_details[i].received_amount : state.ledger_section_details[i].balance_amount_total;
            if (targetValue < individualAmount) {
                if (i != 0) {
                    var individualAmountUpdate = Location.state && Location.state.id != '' ? state.ledger_section_details[i - 1].balance_amount + state.ledger_section_details[i - 1].received_amount : state.ledger_section_details[i - 1].balance_amount_total;
                    var individualTotal1 =
                        targetValue - individualAmountUpdate;
                    if (individualTotal1 > individualAmount) {
                        state.ledger_section_details[i].received_amount =
                            individualAmount;
                        state.ledger_section_details[i].balance_amount = Math.abs(
                            state.ledger_section_details[i].received_amount -
                            individualAmount
                        );
                    } else {
                        state.ledger_section_details[i].received_amount = individualTotal1 < 0 ? 0 : individualTotal1;
                        state.ledger_section_details[i].balance_amount = Math.abs(
                            state.ledger_section_details[i].received_amount -
                            individualAmount
                        );
                    }
                } else {
                    state.ledger_section_details[i].received_amount = targetValue;
                    state.ledger_section_details[i].balance_amount =
                        individualAmount -
                        state.ledger_section_details[i].received_amount;
                    for (let y = 1; y < state.ledger_section_details.length; y++) {
                        state.ledger_section_details[y].received_amount = 0;
                        state.ledger_section_details[y].balance_amount =
                            state.ledger_section_details[y].amount -
                            state.ledger_section_details[y].received_amount
                        // state.ledger_section_details[y].amount;
                    }
                    break;
                }
            } else {
                total = targetValue - state.total_ledger_amount;
                if (total < individualAmount && total > 0) {
                    state.ledger_section_details[i].received_amount = individualAmount;

                    state.ledger_section_details[i].balance_amount = Math.abs(
                        state.ledger_section_details[i].received_amount - individualAmount
                    );
                } else {
                    if (i != 0) {
                        var xamt = 0;
                        // var yamt = Location.state && Location.state.id != '' ? state.ledger_section_details[i].balance_amount_total + state.ledger_section_details[i].received_amount : state.ledger_section_details[i].balance_amount_total
                        for (let y = 0; y < i; y++) {
                            xamt += Location.state && Location.state.id != '' ? state.ledger_section_details[y].balance_amount + state.ledger_section_details[y].received_amount : state.ledger_section_details[y].balance_amount_total;
                        }
                        var individualTotal = targetValue - xamt;
                        if (individualTotal > individualAmount) {
                            state.ledger_section_details[i].received_amount =
                                individualAmount;
                            state.ledger_section_details[i].balance_amount = Math.abs(
                                state.ledger_section_details[i].received_amount -
                                individualAmount
                            );
                        } else {
                            state.ledger_section_details[i].received_amount = individualTotal > 0 ? individualTotal : 0;
                            state.ledger_section_details[i].balance_amount = Math.abs(
                                state.ledger_section_details[i].received_amount -
                                individualAmount
                            );
                            for (let k = i + 1; k < state.ledger_section_details.length; k++) {
                                state.ledger_section_details[k].received_amount = 0;
                                state.ledger_section_details[k].balance_amount =
                                    state.ledger_section_details[k].balance_amount_total -
                                    state.ledger_section_details[k].received_amount
                                // state.ledger_section_details[k].amount
                            }
                            break;
                        }
                    } else {
                        state.ledger_section_details[i].received_amount =
                            individualAmount;
                        state.ledger_section_details[i].balance_amount =
                            state.ledger_section_details[i].received_amount -
                            individualAmount

                    }
                }
            }
        }
        let extraAmt = state.total_received_amount - state.total_ledger_amount
        state.total_excess_amount = extraAmt < 0 ? 0 : extraAmt.toFixed(2)
        state.payment_amount = Number(e.target.value);
    };

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setState({
            ...state,
            [name]: moment(date).format(dateFormat())
        }, handleValidate(event))
    }

    const uploadDocs = (value, index) => {
        let fileName = value.target.files[0].name
        const formData = new FormData();
        formData.append("files", value.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
            CommonApi.documentUpload("payments-document", formData, LocalStorage.getAccessToken())
                .then((response) => {
                    if (response.data.statusCode == 1003) {
                        state.documents[index].new_document_id = response.data.data.id
                        state.documents[index].document_name = value.target.files[0].name
                        setState({ ...state })
                    } else {
                        addErrorMsg(response.data.message);
                    }
                });
        } else {
            addWarningMsg("Please Upload Only jpg/jpeg and png files");
        }
    }

    const deleteDoc = (args) => {
        state.documents[args].new_document_id = ''
        state.documents[args].document_name = ''
        setState({ ...state })
    }

    const clientDropdownList = () => {
        ClientsApi.dropdown('vendor').then((response) => {
            if (response.data.statusCode == 1003) {
                setClients(response.data.data);
            }
        });
    };

    const handleValidate = (e) => {
        let input = e.target;
        switch (input.name || input.tagName) {
            case "company_id":
                error.company_id = validate_emptyField(input.value);
                break;
            case "total_ledger_amount":
                error.total_ledger_amount = validates_Integer(input.value);
                break;
            case "total_received_amount":
                error.total_received_amount = validates_float(input.value);
                break;
            case "received_on":
                error.received_on = validate_emptyField(input.value);
                break;
            case "payment_mode_id":
                error.payment_mode_id = validate_emptyField(input.value);
                break;
            case "payment_reference_number":
                error.payment_reference_number = validate_alphaNumeric(input.value);
                break;
            default:
                break;
        }
        let err = { ...error };
        setError(err);
    };

    const invoiceListing = (args) => {
        PaymentsApi.invoiceListing('bill', args).then((res) => {
            if (res.data.statusCode === 1003) {
                // if (res.data.data.length > 0) {
                state.ledger_section_details = res.data.data
                var totalRows = res.data.data;
                var totalAmount = 0;
                var a = 0
                // var length = 0;
                for (let i = 0; i < totalRows.length; i++) {
                    // length = i + 1;
                    // if (length != totalRows.length) {
                    // state.ledger_section_details.push({
                    //     ledger_id: "",
                    //     amount: 0,
                    //     received_amount: 0,
                    //     balance_amount: 0,
                    //     invoice_id: "",
                    //     due: "",
                    //     due_date: "",
                    //     hours: ""
                    // });
                    // }
                    totalAmount = totalAmount + totalRows[i].balance_due;
                    // a = a + totalRows[i].received_amount;
                    state.ledger_section_details[i].id = totalRows[i].id;
                    state.ledger_section_details[i].ledger_id = totalRows[i].id;
                    state.ledger_section_details[i].amount = totalRows[i].amount;
                    state.ledger_section_details[i].received_amount_previous = totalRows[i].received_amount_previous;
                    state.ledger_section_details[i].balance_amount = totalRows[i].balance_due;
                    state.ledger_section_details[i].balance_amount_total = totalRows[i].balance_due;
                    state.ledger_section_details[i].invoice_id = totalRows[i].invoice_id
                    state.ledger_section_details[i].date = totalRows[i].date
                    state.ledger_section_details[i].due_date = totalRows[i].due_date
                    state.ledger_section_details[i].hours = totalRows[i].hours
                    state.ledger_section_details[i].received_amount = 0;
                }
                state.total_received_amount = a
                state.debited_credits = 0
                state.payment_amount = ""
                state.payment_mode_id = ""
                state.payment_reference_number = ""
                state.received_on = ""
                state.total_balance_amount = totalAmount
                state.total_excess_amount = 0;
                state.company_id = args;
                state.total_ledger_amount = totalAmount;
                setState(state);
            }
        })
    }

    const validateAll = () => {
        const {
            company_id,
            total_received_amount,
            received_on,
            payment_mode_id,
            payment_reference_number,
        } = state;
        let errors = {};
        errors.company_id = validate_emptyField(company_id);
        errors.total_received_amount = validates_float(total_received_amount);
        errors.received_on = state.company_id == '' ? '' : validate_emptyField(received_on);
        errors.payment_mode_id = state.company_id == '' ? '' : validate_emptyField(payment_mode_id);
        errors.payment_reference_number = state.company_id == '' ? '' : validate_alphaNumeric(payment_reference_number);
        return errors;
    };

    const indexList = (args) => {
        LedgerApi.indexApi('bill-payment', args).then((res) => {
            if (res.data.statusCode === 1003) {
                setState({ ...res.data.data });
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const viewState = () => {
        setActionState('update');
    }

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            if (actionState == 'update') {
                setOpenUpdate(true);
                console.log(state, "state submit");
            } else {
                updateSubmitHandler();
            }
        }
        else {
            console.log(errors, "errors");
            let s1 = { error }
            s1 = errors
            setError(s1);
            addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
        }
    }

    const updateSubmitHandler = () => {
        if (id !== '' && id !== null && id !== undefined) {
            setActionState('update');
            state['request_id'] = LocalStorage.uid();
            LedgerApi.updatePayment('bill-payment', id, state).then((res) => {
                if (res.data.statusCode === 1003) {
                    addSuccessMsg('Payment Updated Successfully');
                    setOpenUpdate(true);
                    navigate('/ledger', { state: { tableView: 'bills' } })
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        } else {
            state['request_id'] = LocalStorage.uid();
            state.record_payment = false
            LedgerApi.storePayment('bill-payment', state).then((res) => {
                if (res.data.statusCode === 1003) {
                    setOpen(true);
                } else {
                    addErrorMsg(res.data.message);
                }
            })
        }
    }
    // eslint-disable-next-line
    const tableHandleChange = (e, index) => {
        state.ledger_section_details[index][e.target.name] = Number(e.target.value);
        if (e.target.value > state.ledger_section_details[index].balance_amount_total) {
            state.ledger_section_details[index].balance_amount = 0;
            var amt = Number(e.target.value) - state.ledger_section_details[index].amount;
            // var excess = state.total_ledger_amount - state.total_received_amount
            state.total_excess_amount = amt;
        } else {
            state.ledger_section_details[index].balance_amount =
                state.ledger_section_details[index].balance_amount_total -
                state.ledger_section_details[index].received_amount;
            var excessAmt = state.total_ledger_amount - state.total_received_amount;
            if (excessAmt < 0) {
                state.total_excess_amount = 0;
            } else {
                state.total_excess_amount = excessAmt;
            }
        }
        var paymentAmt = 0;
        for (let i = 0; i < state.ledger_section_details.length; i++) {
            paymentAmt = paymentAmt + state.ledger_section_details[i].received_amount;
        }
        state.total_received_amount = paymentAmt;
        let extraAmt = state.total_received_amount - state.total_ledger_amount;
        state.total_excess_amount = extraAmt < 0 ? 0 : extraAmt.toFixed(2);
        let extraBalamt = state.total_ledger_amount - state.total_received_amount;
        state.total_balance_amount = extraBalamt < 0 ? 0 : extraBalamt
        state.payment_amount = paymentAmt;
        setState({ ...state });
    };

    const onNumberOnlyChange = (event) => {
        const keyCode = event.keyCode || event.which
        const keyValue = String.fromCharCode(keyCode)
        const isValid = new RegExp('[0-9.]').test(keyValue)
        if (!isValid) {
            event.preventDefault()
            return
        }
    }

    const columns = [
        {
            field: "",
            align: "center",
            headerAlign: "center",
            headerName: 'Period',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Text smallBlack>{cellValues.row.date}-{cellValues.row.due_date}</Text>
                )
            }
        },
        {
            field: "invoice_id",
            align: "center",
            headerAlign: "center",
            headerName: 'Invoice',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Text smallBlack>{cellValues.row.invoice_id}</Text>
                )
            }
        },
        {
            field: "hours",
            align: "center",
            headerAlign: "center",
            headerName: 'Hours',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Text smallBlack>{cellValues.row.hours ? `${cellValues.row.hours} Hrs` : ''}</Text>
                )
            }
        },
        {
            field: "amount",
            align: "center",
            headerAlign: "center",
            headerName: 'Amount',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Text smallBlack>{cellValues.row.amount}</Text>
                )
            }
        },
        {
            field: "received_amount_previous",
            align: "center",
            headerAlign: "center",
            headerName: 'Recieved Amount',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
        {
            align: "center",
            headerAlign: "center",
            headerName: 'Payment',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) => (
                <Input
                    formControlProps={{
                        fullWidth: true,
                    }}
                    inputProps={{
                        name: "received_amount",
                        value: state.ledger_section_details[params.api.getRowIndex(params.row.id)].received_amount,
                        disabled: actionState == 'view'
                    }}
                    onKeyPress={onNumberOnlyChange}
                    handleChange={(e) => tableHandleChange(e, params.api.getRowIndex(params.row.id))}
                    smallWhiteInput
                />
            ),
        },
        {
            field: "balance_amount",
            align: "center",
            headerAlign: "center",
            headerName: 'Balance Due',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) => {
                return (
                    <Text smallBlack>{state.ledger_section_details[params.api.getRowIndex(params.row.id)].balance_amount}</Text>
                )
            }
            // valueGetter: (params) =>
            //     state.ledger_section_details[params.api.getRowIndex(params.row.id)].balance_due,
        }
    ]


    return (
        <Grid container pl={15}>
            <Grid item lg={12}>
                <Breadcrumbs>
                    <Text largeLabel onClick={() => navigate('/ledger', { state: { tableView: 'bills' } })} sx={{ cursor: 'pointer' }}>Ledger</Text>
                    <Text largeBlack>{actionState === 'view' || actionState == 'update' ? 'View' : 'New'} Bill</Text>
                </Breadcrumbs>
            </Grid>
            <Grid item container lg={12} justifyContent='center' pt={3}>
                <Grid item lg={10} justifyContent='end'>
                    <Box sx={{
                        boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important',
                        borderRadius: '8px !important',
                        height: '520px !important',
                        overflowY: 'scroll'
                    }}>
                        <Grid container p={4}>
                            <Grid item lg={12}>
                                <Text largeBoldBlack>{actionState == 'view' ? 'View' : 'New'} Bill</Text>
                            </Grid>
                            <Grid item container lg={12} pt={3} spacing={4}>
                                <Grid item lg={4}>
                                    <SearchSelect
                                        name='company_id'
                                        value={state.company_id}
                                        options={clients}
                                        labelText={<Text largeLabel>Vendor Name</Text>}
                                        onChange={changeHandler}
                                        buttonName='New Client'
                                        onClick={() => {
                                            navigate('/addClient');
                                            tooltipToggle()
                                        }}
                                        disabled={actionState == 'view' || actionState == 'update' ? true : false}
                                    />
                                    {error.company_id ? <Text red>{error.company_id ? error.company_id : ''}</Text> : ''}
                                </Grid>
                                <Grid item lg={4}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'debited_credits',
                                            value: state.debited_credits,
                                            disabled: true,
                                        }}
                                        handleChange={changeHandler}
                                        clientInput
                                        labelText={<Text largeLabel>Vendor Unused Amount</Text>}
                                        disabled={actionState == 'view' ? true : false}
                                    />
                                    {error.debited_credits ? <Text red>{error.debited_credits ? error.debited_credits : ''}</Text> : ''}
                                </Grid>
                                <Grid item lg={4}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'total_ledger_amount',
                                            value: state.total_ledger_amount,
                                            disabled: true,
                                        }}
                                        handleChange={changeHandler}
                                        clientInput
                                        labelText={<Text largeLabel>Bills Amount</Text>}
                                        disabled={actionState == 'view' ? true : false}
                                    />
                                    {error.total_ledger_amount ? <Text red>{error.total_ledger_amount ? error.total_ledger_amount : ''}</Text> : ''}
                                </Grid>
                                <Grid item lg={4}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'total_received_amount',
                                            value: state.total_received_amount,
                                            disabled: state.company_id == "" || actionState == 'view',
                                        }}
                                        onKeyPress={onNumberOnlyChange}
                                        handleChange={changeHandler}
                                        clientInput
                                        labelText={<Text largeLabel>Paid Amount</Text>}
                                    />
                                    {error.total_ledger_amount ? <Text red>{error.total_ledger_amount ? error.total_ledger_amount : ''}</Text> : ''}
                                </Grid>
                                <Grid item lg={4}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'total_balance_amount',
                                            value: state.total_balance_amount,
                                            disabled: true,
                                        }}
                                        handleChange={changeHandler}
                                        onKeyPress={onNumberOnlyChange}
                                        clientInput
                                        labelText={<Text largeLabel>Due Amount</Text>}
                                        disabled={actionState == 'view' ? true : false}
                                    />
                                </Grid>
                                <Grid item lg={4}>
                                    <CustomSelect
                                        name='payment_mode_id'
                                        value={state.payment_mode_id}
                                        onChange={changeHandler}
                                        commonSelect
                                        options={paymentModes}
                                        label={<Text largeLabel>Payment Mode</Text>}
                                        disabled={state.company_id == "" || actionState == 'view'}
                                    />
                                    {error.payment_mode_id ? <Text red>{error.payment_mode_id ? error.payment_mode_id : ''}</Text> : ''}
                                </Grid>
                                <Grid item lg={4}>
                                    <Date
                                        labelText={<Text largeLabel>Paid On</Text>}
                                        name='received_on'
                                        onChange={(value => dateChange(value, 'received_on'))}
                                        value={state.received_on}
                                        height='56px'
                                        disabled={state.company_id == "" || actionState == 'view'}
                                        maxDate={currentDate}
                                    />
                                    {error.received_on ? <Text red>{error.received_on ? error.received_on : ''}</Text> : ''}
                                </Grid>
                                <Grid item lg={4}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'payment_reference_number',
                                            value: state.payment_reference_number,
                                            disabled: state.company_id == "" || actionState == 'view',
                                            inputProps: { maxlength: 15 }
                                        }}
                                        handleChange={changeHandler}
                                        clientInput
                                        labelText={<Text largeLabel>Reference ID</Text>}
                                    />
                                    {error.payment_reference_number ? <Text red>{error.payment_reference_number ? error.payment_reference_number : ''}</Text> : ''}
                                </Grid>
                                {
                                    state.documents.map((item, index) => (
                                        <Grid lg={4} md={12} sm={12} xs={12}>
                                            <Box p={'30px 0px 0px 30px'}>
                                                <FileInput
                                                    name="new_document_id"
                                                    FileName={item.document_name ? item.document_name : ''}
                                                    handleChange={(e) => uploadDocs(e, index)}
                                                    label={<Text largeLabel>Reference Document<span style={{ color: "#C7CCD3" }}>(Optional)</span></Text>}
                                                    isDisabled={false}
                                                    handleDelete={() => deleteDoc(index)}
                                                    actionState={item.document_name ? 1 : ''}
                                                />
                                            </Box>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            {
                                (state.company_id !== '' && state.ledger_section_details.length == 0) ?
                                    <Grid item lg={12} pt={5} textAlign='center'>
                                        <Text largeLabel>
                                            There are no unpaid Invoices for this customer, that can be
                                            applied for this payment.
                                        </Text>
                                    </Grid> : state.company_id !== '' && state.ledger_section_details.length > 0 ?
                                        <Grid item lg={12} pt={3}>
                                            <Table
                                                rows={state.ledger_section_details}
                                                columns={columns}
                                                height='200px'
                                                hideFooter={true}
                                                hidePagination={true}
                                            />
                                        </Grid> : ''
                            }
                            <Grid item lg={12} pt={2} container justifyContent={'flex-end'}>
                                <Box textAlign={'initial'}>
                                    <Text mediumLabel>Total Balance &nbsp;&nbsp;&nbsp;&nbsp;: <span style={{ fontSize: '14px', color: 'black' }}>&nbsp;{state.total_balance_amount}</span></Text>
                                    <Text mediumLabel>Excess Balance &nbsp;:<span style={{ fontSize: '14px', color: 'black' }}>&nbsp;&nbsp;{state.total_excess_amount}</span></Text>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box textAlign='end' pt={3}>
                        <Button popupCancel onClick={() => navigate('/ledger', { state: { tableView: 'bills' } })}>Cancel</Button>
                        {
                            actionState == 'view' ?
                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "bill_edit" && item.is_allowed == true))) ?
                                    <Button popupSaveBlue sx={{ marginLeft: '15px !important' }} onClick={viewState}>Edit</Button> :
                                    <Button disable sx={{ marginLeft: '15px !important' }} >Edit</Button> :
                                state.ledger_section_details.length > 0 ?
                                    <Button popupSaveBlue sx={{ marginLeft: '15px !important' }} onClick={handleSubmit}>Save</Button> : ''
                        }
                    </Box>
                </Grid>
            </Grid>
            <ReusablePopup openPopup={open} setOpenPopup={setOpen} white statusWidth iconHide>
                <Box textAlign='center' p={2} pb={1}>
                    <img src={success} alt='success' />
                    <Text veryLargeLabel pt={3}>Successfully Added</Text>
                    <Text pt={2} pb={3} blackFont14>You have successfully Added New Payment</Text>
                    <Button blueButton onClick={() => navigate('/ledger', { state: { tableView: 'bills' } })}>Go To Home</Button>
                </Box>
            </ReusablePopup>
            <ReusablePopup openPopup={openUpdate} setOpenPopup={setOpenUpdate} white statusWidth iconHide>
                <Box textAlign='center' pt={0} p={2}>
                    <img src={updatePayment} alt='success' />
                    <Text largeBldBlack pt={0}>Are You Sure?</Text>
                    <Text pt={2} pb={3} blackFont14>Do you want to save the changes to this payment</Text>
                    <Box display='flex' flexDirection='row' gap={2} justifyContent='center'>
                        <Button popupCancel onClick={() => setOpenUpdate(false)}>No, Cancel</Button>
                        <Button popupSaveBlue onClick={updateSubmitHandler}>Yes</Button>
                    </Box>
                </Box>
            </ReusablePopup>
        </Grid>
    )
}

export default NewPayment