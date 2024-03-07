import React, { useState, useEffect } from 'react';
import DashboardStyles from '../DasboardStyles';
import { Box, Grid, Breadcrumbs, Typography, Card, Checkbox, CardContent, CardActions, CardHeader, TextField } from '@mui/material';
import { CircularProgress, Tooltip, tooltipClasses } from "@mui/material";
import { useTheme } from "@mui/material";
import ExpenseManagmentAPI from '../../../apis/admin/expensesManagmentApi/ExpensesManagmentApi';
import Button from '../../../components/customButton/Button';
import CommonApi from '../../../apis/CommonApi';
import Avatar from '@mui/material/Avatar';
import { onNumberWithDecimalOnlyChange } from '../../../components/Validation';
import Text from '../../../components/customText/Text';
import Input from "../../../components/input/Input";
import Date from '../../../components/datePicker/Date';
import SearchSelect from '../../../components/selectField/SearchSelect';
import FileInput from '../../../components/muiFileInput/FileInput';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import ExpenseImg from '../../../assets/svg/expenseImg.svg'
import { useLocation, useNavigate } from 'react-router-dom';
import { addErrorMsg, addWarningMsg, addSuccessMsg, dateFormat } from "../../../utils/utils";
import LocalStorage from "../../../utils/LocalStorage";
import moment from 'moment';
import styled from "@emotion/styled";
import { isValid, validate_emptyField, validateDecimalInteger } from "../../../components/Validation";
import { makeStyles } from '@mui/styles';

// eslint-disable-next-line
const useStyles = makeStyles((theme) => ({
    customScrollbar: {
        overflowY: 'scroll !important',  // Change this line
        maxWidth: '100%',
        '@global': {
            '*::-webkit-scrollbar': {
                width: '4px',
                height: '25px',
                borderRadius: '50px'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px white'
            },
            '*::-webkit-scrollbar-thumb': {
                background: "#C7CCD3 !important",
                width: '4px',
                height: '25px',
                borderRadius: '50px',
                outline: 'none'
            }
        }
    },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`&.${tooltipClasses.tooltip}`]: {
        backgroundColor: "#404040",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #404040"
    },
    [`&.${tooltipClasses.arrow}`]: {
        color: '#404040',
        "&::before": {
            backgroundColor: "#404040",
            border: "1px solid #404040"
        }
    }
}))

const AddExpenseForm = () => {
    const classes = DashboardStyles();
    const location = useLocation();
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState({});
    const [expenseList, setExpenseList] = useState([]);
    const paymentList = [{ "id": 1, "value": "Reimbursement" }, { "id": 2, "value": "Deduction" }];
    const deductList = [{ "id": 1, value: 'Payroll', }, { "id": 2, value: 'Balance Sheet' }];
    const deductionGoalAmountList = [{ "id": 1, value: 'Yes', }, { "id": 0, value: 'No' }];

    const navigate = useNavigate();
    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        expense_type: '',
        date_of_expense: '',
        payment_type: 1,
        deduct: 2,
        deduction_goal_amount: 1,
        goal_amount: 0,
        remarks: '',
        enable_for_approval: '',
        enter_amount: '',
        upoload_document: '',
        documents: [
            {
                new_document_id: '',
                document_name: ''
            }
        ]
    })

    const importedData = location && location.state && location.state.employeeData;

    const validateAll = () => {
        const { date_of_expense, expense_type, payment_type, deduct, deduction_goal_amount,
            goal_amount, enter_amount, } = state
        let errors = {}
        errors.expense_type = validate_emptyField(expense_type);
        errors.date_of_expense = validate_emptyField(date_of_expense);
        errors.payment_type = validate_emptyField(payment_type);
        errors.deduct = validate_emptyField(deduct);
        errors.goal_amount = ((deduct === 1) && (deduction_goal_amount === 1)) ? validateDecimalInteger(goal_amount) : '';
        errors.enter_amount = validate_emptyField(enter_amount);
        errors.documents = validate_emptyField(state.documents[0].new_document_id);
        console.log(errors, "errrr")
        return errors;
    }

    useEffect(() => {
        DropdownExpenseTypeApi();
    }, []);

    const DropdownExpenseTypeApi = () => {
        // setLoading(true);
        let slug = 'expense-management'
        ExpenseManagmentAPI.dropDownExpenseTypeList(slug).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setExpenseList(res.data.data);
                }
            }, 300)
        })
    }

    const uploadDocs = (value) => {
        const MAX_FILE_SIZE_MB = 25;
        const file = value.target.files[0];
        if (file && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) {
            const formData = new FormData();
            formData.append("files", value.target.files[0]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("expense-document",formData, LocalStorage.getAccessToken()).then(
                (response) => {
                    if (response.data.statusCode == 1003) {
                        // state.upoload_document = response.data.data.id;
                        // state.documents[0].new_document_id = response.data.data.id;
                        // state.documents[0].document_name = value.target.files[0].name;
                        // setState({ ...state }, handleValidate())
                        let docInfo = response.data.data
                        let docArr = [{
                            id: state.documents[0].id,
                            new_document_id: docInfo.id,
                            document_name: value.target.files[0].name
                        }]
                        handleValidate({ name: value.target.name, value: docInfo.id })
                        setState({ ...state, documents: docArr })
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }
            );
        } else {
            addErrorMsg(`File size must be less than or equal to ${MAX_FILE_SIZE_MB} MB`);
        }
    };

    const changeHandler = (e) => {
        if (e.target.name == 'new_document_id') {
            uploadDocs(e);
        } else if (e.target.name == 'deduct') {
            setState({
                ...state,
                [e.target.name]: e.target.value,
                goal_amount: '',
                enter_amount: ''
            })
        }
        else if ((state.deduct === 1) && (state.deduction_goal_amount === 1) && e.target.name == 'enter_amount') {
            if (state.payment_type === 2 && (parseInt(e.target.value) > parseInt(state.goal_amount))) {
                addWarningMsg('Should not Exceed the Goal Amount')
            } else {
                setState({
                    ...state,
                    [e.target.name]: e.target.value
                })
            }
        }
        else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
        handleValidate(e.target);
    }

    const handleValidate = (input) => {
        // let input = e.target
        switch (input.name || input.tagName) {
            case 'expense_type':
                error.expense_type = validate_emptyField(input.value)
                break
            case 'date_of_expense':
                error.date_of_expense = validate_emptyField(input.value)
                break
            case 'deduct':
                error.goal_amount = input.value === 2 && ''
                break
            case 'deduction_goal_amount':
                error.goal_amount = input.value === 2 && ''
                break
            case 'payment_type':
                error.payment_type = validate_emptyField(input.value)
                break
            case 'goal_amount':
                error.goal_amount = ((state.deduct === 1) && (state.deduction_goal_amount === 1)) ? validateDecimalInteger(input.value) : ''
                break
            case 'enter_amount':
                error.enter_amount = validateDecimalInteger(input.value)
                break
            case "documents":
                error.documents = validate_emptyField(input.value);
                break;
            default:
                break
        }
        setError({ ...error });
        console.log(error, "errr")
    }

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

    const checkBoxChange = (name, value) => {
        let event = {
            target: {
                name: name,
                value: value
            }
        }

        setState({
            ...state,
            [name]: value
        });

        handleValidate(event)

    }

    const handleAdd = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            let data = {
                request_id: state.request_id,
                employee_id: importedData.id,
                expense_type_id: state.expense_type,
                raised_date: state.date_of_expense,
                amount: state.enter_amount,
                expense_transaction_type: state.payment_type,
                expense_effect_on: state.deduct,
                description: state.remarks,
                enable_approval: state.enable_for_approval ? 1 : 0,
                is_recurring: ((state.payment_type === 1) && (state.deduct === 1)) ? state.deduction_goal_amount : 0,
                recurring_count: ((state.payment_type === 1) && (state.deduct === 1) && (state.deduction_goal_amount === 1)) ? state.goal_amount : '',
                has_goal_amount: ((state.payment_type === 2) && (state.deduct === 1)) ? state.deduction_goal_amount : '',
                goal_amount: ((state.payment_type === 2) && (state.deduct === 1) && (state.deduction_goal_amount === 1)) ? state.goal_amount : '',
                documents: [
                    {
                        "new_document_id": state.documents[0].new_document_id
                    }
                ],
            }

            ExpenseManagmentAPI.createExpense(data).then((res) => {
                setTimeout(() => {
                    if (res.data.statusCode === 1003) {
                        addSuccessMsg('Expense Added Successfully');
                        setOpenDialog(true);
                    }
                    else {
                        addErrorMsg(res.data.message);
                    }
                }, 300)
            });

        } else {
            let s1 = { error };
            s1 = errors
            setError(s1);
            console.log(error, "errrr")
            if (s1.goal_amount === "Please enter valid numbers") {
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
            else {
                addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
            }
        }
    }
    const handleApproveClose = () => {
        setOpenDialog(false);
    }
    return (
        <>
            {openDialog &&
                <ReusablePopup iconHide openPopup={openDialog} setOpenPopup={handleApproveClose} white statusWidth>
                    <Box textAlign='center' p={'0px 20px 0px 20px'}>
                        <img src={ExpenseImg} alt='success' />
                        <Text sx={{ color: "#54595E !important", font: "18px Nunito, sans-serif !important", fontWeight: "600 !important", paddingTop: '25px !important' }}>Expense Added</Text>
                        <Text sx={{ color: "rgba(84, 89, 94, 0.6) !important", padding: '10px 0px 30px 0px !important', font: "14px Nunito, sans-serif !important", fontWeight: "400 !important" }}>You Have Successfully Added Expense to <span style={{ color: `#404040` }}>{importedData.full_name}</span></Text>
                        <Button onClick={() => { navigate('/expense-management') }} blueButton>Go To Home</Button>
                    </Box>
                </ReusablePopup>
            }
            <Grid container component={'main'} sx={{
                width: "100% !important",
                [useTheme().breakpoints.down('sm')]: {
                    width: "150% !important",
                },
                padding: "10px",
            }} pl={{ lg: 15, md: 11, sm: 12, xs: 11 }} pr={5}>

                <Grid item container >
                    <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography sx={{
                                fontFamily: "Nunito Sans, sans-serif !important",
                                color: "#849199 !important",
                                fontSize: "14px !important",
                                textDecoration: "none !important",
                                cursor: "pointer",
                            }} onClick={() => navigate('/expense-management')}>Expense Management</Typography>
                            <Typography sx={{
                                fontFamily: "Nunito Sans, sans-serif !important",
                                color: "#092333 !important",
                                fontSize: "14px !important",
                            }}>Add Expense</Typography>
                        </Breadcrumbs>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container lg={12} justifyContent='center' pt={3}>
                <Card sx={{ width: '700px', height: '100%', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                    <CardHeader sx={{ padding: '20px 0px 0px 35px !important' }}
                        title={
                            <Box display="flex" alignItems="center" >
                                <Box sx={{ position: 'relative', display: 'flex', }} >
                                    <CircularProgress variant="determinate" value={importedData.profile_progress} size="4.2rem" thickness={2} sx={{ backgroundColor: "#F2F2F2", color: "green", borderRadius: "100%", }} />
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
                                        <Box sx={{ display: 'flex', padding: '3px', borderRadius: '50%', backgroundColor: '#ffffff' }}>
                                            <HtmlTooltip
                                                placement='bottom'
                                                arrow
                                                title={
                                                    <React.Fragment>
                                                        <Box>
                                                            <Typography className={classes.profileTooltipText}>
                                                                {`profile Completion- ${importedData.profile_progress}%`}
                                                            </Typography>
                                                        </Box>
                                                    </React.Fragment>
                                                }
                                            >
                                                <Avatar
                                                    alt='Jacob James'
                                                    src={importedData.avatar}
                                                    sx={{ width: '55px', height: "55px" }} />
                                            </HtmlTooltip>
                                        </Box>
                                    </Box>

                                </Box>
                                <Box ml={2}>
                                    <Text largeBoldBlack sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important", color: 'black' }} >{importedData.full_name}</Text>
                                    <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap> {importedData.reference_id} </Text>
                                </Box>
                            </Box>
                        } />
                    <CardContent sx={{ padding: '25px 0px 0px 30px !important' }}>
                        <Grid container lg={12} spacing={2} columnSpacing={3}>


                            <Grid item lg={6}>
                                <Box pt={'10px'}>
                                    <SearchSelect
                                        name='payment_type'
                                        value={state.payment_type}
                                        onChange={changeHandler}
                                        options={paymentList}
                                        labelText={<Text largeLabel>Payment Type</Text>}
                                    />
                                    {
                                        error.payment_type &&
                                        <Text red>{error.payment_type ? error.payment_type : ''}</Text>
                                    }
                                </Box>
                            </Grid>
                            <Grid item lg={6}>
                                <Box pt={'9px'}>
                                    <Date
                                        labelText={<Text largeLabel>Date of Expense</Text>}
                                        name='date_of_expense'
                                        value={state.date_of_expense}
                                        onChange={(value) => dateChange(value, 'date_of_expense')}
                                        height='56px'
                                    />
                                    {
                                        error.date_of_expense &&
                                        <Text red>{error.date_of_expense ? error.date_of_expense : ''}</Text>
                                    }
                                </Box>
                            </Grid>
                            <Grid item lg={6}>
                                <Box pt={'10px'}>
                                    <SearchSelect
                                        name='expense_type'
                                        value={state.expense_type}
                                        onChange={changeHandler}
                                        options={expenseList}
                                        labelText={<Text largeLabel>Expense Type</Text>}
                                    />
                                    {
                                        error.expense_type &&
                                        <Text red>{error.expense_type ? error.expense_type : ''}</Text>
                                    }
                                </Box>
                            </Grid>
                            <Grid item lg={6}>
                                <Box pt={'10px'}>
                                    <SearchSelect
                                        name='deduct'
                                        value={state.deduct}
                                        onChange={changeHandler}
                                        options={deductList}
                                        labelText={<Text largeLabel>{state.payment_type === 1 ? "Add To" : "Deduct From"}</Text>}
                                    />
                                    {
                                        error.deduct &&
                                        <Text red>{error.deduct ? error.deduct : ''}</Text>
                                    }
                                </Box>
                            </Grid>
                            {state.deduct === 1 &&
                                <>
                                    <Grid item lg={6}>
                                        <Box pt={'10px'}>
                                            <SearchSelect
                                                name='deduction_goal_amount'
                                                value={state.deduction_goal_amount}
                                                onChange={changeHandler}
                                                options={deductionGoalAmountList}
                                                labelText={<Text largeLabel>{state.payment_type === 2 ? "Does this deduction have a goal amount?" : "Is Recurring"}</Text>}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item lg={6}>
                                        <Box sx={{ mt: '10px' }}>
                                            {state.deduction_goal_amount === 1 &&
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'goal_amount',
                                                        value: state.goal_amount,
                                                        inputProps: {
                                                            maxLength: state.payment_type !== 2 ? 2 : 10
                                                        }
                                                    }}
                                                    handleChange={changeHandler}
                                                    onKeyPress={onNumberWithDecimalOnlyChange}
                                                    clientInput
                                                    labelText={<Text largeLabel>{state.payment_type === 2 ? "Goal Amount" : "Recurring Count"}</Text>}
                                                />}
                                            {
                                                error.goal_amount &&
                                                <Text red>{error.goal_amount ? error.goal_amount : ''}</Text>
                                            }
                                        </Box>
                                    </Grid>
                                </>
                            }
                            <Grid item lg={12}>
                                
                                 <Box pt={'10px'}>
                                        <FileInput
                                            name={"documents"}
                                            // value={state.documents[0].docName}
                                            FileName={state.documents[0].document_name}
                                            handleChange={uploadDocs}
                                            label={<Text largeLabel>Upload A Document</Text>}
                                             isDisabled={false} />
                                        <Text errorText> {error.documents ? error.documents : ""}</Text>
                                    </Box>

                            </Grid>
                            <Grid item lg={12}>
                                <Box className={classes.customScrollbar} pt={'10px'}>
                                    <TextField
                                        label={<Box style={{ display: 'flex' }} gap={0.5}><Text sx={{
                                            color: '#737373 !important',
                                            fontFamily: "Nunito Sans, sans-serif !important",
                                            fontSize: '14px !important',
                                            fontWeight: 500
                                        }} >Remarks</Text>
                                            <Text sx={{
                                                color: '#C7CCD3 !important',
                                                fontFamily: "Nunito Sans, sans-serif !important",
                                                fontSize: '14px !important',
                                                fontWeight: 400
                                            }}>(Optional)</Text>
                                        </Box>}
                                        variant="filled"
                                        size="small"
                                        name='remarks'
                                        value={state.remarks}
                                        onChange={changeHandler}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        inputProps={{
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
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={12}>
                                <Text largeLabel>
                                    <Checkbox size='small'
                                        name="enable_for_approval"
                                        value={state.enable_for_approval}
                                        onChange={(e, val) => checkBoxChange(e.target.name, val)}
                                    />Enable Approval
                                </Text>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{
                        background: "#ACD3FF30",
                        width: "100%",
                        height: "90px"

                    }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            sx={{ mt: '0px !important', justifyContent: 'space-between', width: '100%', alignContent: 'center', padding: "5px" }}
                        >
                            <Box pl={3} sx={{ fontSize: '30px !important', color: '#737373 !important' }}>$</Box>

                            <div style={{ width: '100%', height: '100%' }}>
                                <TextField
                                    placeholder="Enter Amount Here..."
                                    variant="standard"
                                    size="small"
                                    name='enter_amount'
                                    value={state.enter_amount}
                                    onChange={changeHandler}
                                    onKeyPress={onNumberWithDecimalOnlyChange}
                                    fullWidth
                                    InputProps={{
                                        sx: {
                                            color: '#737373 !important',
                                            fontFamily: "Nunito Sans, sans-serif !important", border: 'none !important'
                                        },
                                        disableUnderline: true,
                                        inputProps: {
                                            maxLength: 10
                                        }
                                    }}

                                />
                                {
                                    error.enter_amount &&
                                    <Text red>{error.enter_amount ? error.enter_amount : ''}</Text>
                                }
                            </div>

                            <Button
                                onClick={() => handleAdd()}
                                sx={{ '&:hover': { background: '#0C75EB !important', color: 'white !important' } }}
                                save>Add Expense</Button>
                        </Box>
                    </CardActions>
                </Card>
            </Grid >
        </>

    )
}

export default AddExpenseForm;