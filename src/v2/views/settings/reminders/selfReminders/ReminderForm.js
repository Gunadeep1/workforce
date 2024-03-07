
import React, { useEffect, useState } from 'react'
// import Input from '../../../components/input/Input';
import Input from '../../../../components/input/Input';
import FileInput from '../../../../components/muiFileInput/FileInput';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import Date from '../../../../components/datePicker/Date'
import { Box, Grid, Stack, FormControlLabel, FormControl, Checkbox, TextField, Chip, Divider, InputLabel, MenuItem, ListItemText } from '@mui/material';
import { ReactComponent as CheckedIcon } from '../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as ReminderIcon } from '../../../../assets/svg/inforeminder.svg';
import { ReactComponent as ChipDeleteIcon } from '../../../../assets/svg/chipDeletIcon.svg';
import Text from '../../../../components/customText/Text';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Autocomplete from '@mui/material/Autocomplete';
import styled from '@emotion/styled';
import SelfReminderStyles from './SelfReminderStyles';
import Button from '../../../../components/customButton/Button';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import { Select } from '@mui/material';
import { isValid, validateDecimalInteger, validate_emptyField, validates_emptyArray } from '../../../../components/Validation';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../utils/utils';
import { onNumberWithDecimalOnlyChange } from '../../../../components/Validation';
import ReusablePopup from "../../../../components/reuablePopup/ReusablePopup";
import { useNavigate } from "react-router-dom";
import ReminderSuccess from "../../../../assets/svg/reminderSuccess.svg";
import moment from 'moment';
import { dateFormat } from '../../../../utils/utils';


const Menu = {
    disableScrollLock: true,
    PaperProps: {
        style: {
            font: "14px Nunito, Nunito Sans, sans-serif",
            maxHeight: '200px',
            opacity: 1,
            overflow: 'auto',
            whiteSpace: "normal",
            paddingBottom: "0px !important",
            marginTop: '10px',
            boxShadow: '0px 0px 15px 0px #0000001F',
        },
        elevation: 0,
        padding: '0px !important'
    },
    sx: {

        "& .MuiList-root": {
            padding: '0px !important',
        },
        "&::-webkit-scrollbar": {
            display: "none !important"
        },
        "& .MuiMenuItem-root": {
            padding: "17px 16px !important",
            font: "14px  Nunito, Nunito Sans, sans-serif !important",
            fontWeight: `${400} !important`,
            color: "#262626 !important",
            height: '50px !important',
            borderBottom: '1px solid #EAECF0 !important',
            "&:hover": {
                background: '#0001F !important'
            },
        },

        "& .Mui-selected": {
            backgroundColor: 'white !important'
        }
    }
}

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        font: '10px Nunito !important',
        color: '#FEFEFE',
        backgroundColor: "##737373",
        padding: "6px 14px",
        width: 190,
        border: "1px solid ##737373",
        textAlign: 'center',
        borderRadius: '4px'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#737373",
        "&::before": {
            backgroundColor: "#737373",
            border: "1px solid #737373"
        }
    },
}));

const Options = [
    {
        value: '13-01-2024', id: 1,
    },
    {
        value: '14-01-2024', id: 2,
    },
    {
        value: '15-01-2024', id: 3,
    },
    {
        value: '16-01-2024', id: 4,
    },
    {
        value: '17-01-2024', id: 5,
    },
    {
        value: '18-01-2024', id: 6,
    },
];

export default function ReminderForm({ setView }) {
    const classes = SelfReminderStyles();
    const [selectValue, setSelectValue] = useState([]);
    const navigate = useNavigate();
    const [selectLabel, setSelectLabel] = useState([]);
    const isAllSelected = Options.length > 0 && selectValue.length === Options.length;
    const OptionsValue = Options.map((item) => item.value);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState({});
    const [checked, setChecked] = React.useState(true);
    const [formData, setformData] = useState({
        reminder_name: '',
        description: '',
        upoload_document: '',
        assign_to: '',
        date: '',
        time: '',
        pay_cycle: '',
        check_date: '',
        count: '',
        cycle: '',
        remind_every: ''
    });
    const payCycleOptions = [
        {
            value: 'Weekly', id: 1,
        },
        {
            value: 'Bi - Weekly', id: 2,
        },
        {
            value: 'Semi - Monthly ', id: 3,
        },
        {
            value: 'Monthly ', id: 4,
        },
    ];
    const cycleOptions = [
        {
            value: 'Days', id: 1,
        },
        {
            value: 'Weeks', id: 2,
        },
        {
            value: 'Months ', id: 3,
        },
    ];
    const everyOptions = [
        {
            value: 'Every Day', id: 1,
        },
        {
            value: 'Every 10 Days', id: 2,
        },
        {
            value: 'Every 15 Days', id: 3,
        },
        {
            value: 'Every Month', id: 4,
        },
    ];
    const validateAll = () => {
        // eslint-disable-next-line
        const { reminder_name, description, upoload_document, assign_to, date, time, pay_cycle, check_date, count, cycle, remind_every } = formData;
        let errors = {}
        errors.assign_to = validate_emptyField(assign_to);
        errors.date = validate_emptyField(date);
        errors.time = validate_emptyField(time);
        errors.pay_cycle = validate_emptyField(pay_cycle);
        errors.check_date = validate_emptyField(check_date);
        errors.count = validate_emptyField(count);
        errors.cycle = validate_emptyField(cycle);
        return errors;
    }

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: date
            }
        }
        setformData({
            ...formData,
            [name]: moment(date).format(dateFormat())
        }, handleValidate(event))
    }

    const handleChange = (e) => {
        // if (e.target.name == 'upoload_document') {
        //     uploadDocs(e);
        // } else {
        //     setformData({
        //         ...formData,
        //         [e.target.name]: e.target.value
        //     })
        // }
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
        handleValidate(e);
    }

    const handleApproveClose = () => {
        setOpenDialog(false);
    }

    const handleValidate = (e) => {
        let input = e.target
        switch (input.name || input.tagName) {
            case 'assign_to':
                error.assign_to = validate_emptyField(input.value)
                break
            case 'date':
                error.date = validate_emptyField(input.value)
                break
            case 'time':
                error.time = validate_emptyField(input.value)
                break
            case 'pay_cycle':
                error.pay_cycle = validate_emptyField(input.value)
                break
            case 'check_date':
                error.check_date = validates_emptyArray(input.value)
                break
            case 'count':
                error.count = validateDecimalInteger(input.value)
                break
            case 'cycle':
                error.cycle = validate_emptyField(input.value)
                break
            default:
                break
        }
        setError({ ...error });
        console.log(error, "etest");
        console.log(selectValue, "@@#");
    }

    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
        if (1 == 2) {
            setformData()
            setError()
        }
    };

    const handleValue = (e) => {
        const value = e.target.value;
        if (value.includes('all')) {
            setSelectValue(
                (selectValue && selectValue.length) === (Options && Options.length)
                    ? []
                    : OptionsValue
            );
            setSelectLabel(
                (selectValue && selectValue.length) === (Options && Options.length)
                    ? []
                    : OptionsValue
            );
            return;
        }
        setSelectValue(value);
        setSelectLabel(value.map((optionValue) => {
            const option = Options.find((item) => item.value === optionValue)
            return option ? option.value : ""
        }))
        handleValidate(e)
    };

    useEffect(() => {
        if (Array.isArray(selectLabel) && selectLabel.length > 0) {
            document.querySelector('#multi-select').innerHTML = selectLabel.join(", ")
        } else if (!Array.isArray(selectLabel)) {
            document.querySelector('#multi-select').innerHTML = selectLabel;
        } else {
            document.querySelector('#multi-select').innerHTML = "";
        }
    }, [selectLabel])
    // eslint-disable-next-line
    const uploadDocs = (value) => {
        const MAX_FILE_SIZE_MB = 25;
        const file = value.target.files[0];
        if (file && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) {
            // const formData = new FormData();
            // formData.append("files", value.target.files[0]);
            // formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            // CommonApi.documentUpload(formData, LocalStorage.getAccessToken()).then(
            //     (response) => {
            //         if (response.data.statusCode == 1003) {
            //             state.upoload_document = response.data.data.id;
            //             state.documents[0].new_document_id = response.data.data.id;
            //             state.documents[0].document_name = value.target.files[0].name;
            //             setState({ ...state })
            //         } else {
            //             addErrorMsg(response.data.message);
            //         }
            //     }
            // );
        } else {
            addErrorMsg(`File size must be less than or equal to ${MAX_FILE_SIZE_MB} MB`);
        }
    };

    const handleAddReminder = () => {
        let errors = validateAll();
        console.log(errors, "esubmit");
        if (isValid(errors)) {// eslint-disable-next-line
            let newFormData = {
                count: formData.count
            }
            setOpenDialog(true)
            addSuccessMsg('Expense Added Successfully');
        } else {
            let s1 = { error };
            s1 = errors
            setError(s1);
            addWarningMsg('Please fill all required fields');
        }
    }
    return (
        <Box width={checked ? '580px' : '470px'} padding={'20px'} borderRadius={'6px'} sx={{ transition: '0.5s !important' }}>
            {openDialog &&
                <ReusablePopup iconHide openPopup={openDialog} setOpenPopup={handleApproveClose} white statusWidth >
                    <Box >
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: '50px' }}>
                            <img src={ReminderSuccess} alt='success' />
                            <Text className={classes.addRemindSuccessText} >Reminder Added Successfully</Text>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexDirection: 'row', paddingBottom: '20px' }}>
                            <Button className={classes.viewAllBtn} onClick={() => { navigate('/self-reminder') }} >View all Reminders</Button>
                            <Button className={classes.gotoBtn} onClick={() => { navigate('mainDashboard') }} >Go To Dashboard</Button>
                        </Box>
                    </Box>
                </ReusablePopup>
            }
            <Stack direct0ion={'row'} width={'100%'}>
                <Text className={classes.header2}>Add Reminder</Text>
            </Stack>
            <Grid container columnSpacing={1} mt={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '70px' }}>
                        <Input
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                name: 'reminder_name',
                                value: formData.reminder_name,
                                disabled: false
                            }}

                            handleChange={handleChange}
                            clientInput
                            labelText='Reminder Name'
                        />
                        {/* <Text errorText> {error.reminder_name ? error.reminder_name : ""}</Text> */}
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '70px' }}>
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
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={1}
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
                                        height: '54px !important',
                                    },
                                    disableUnderline: true,
                                }}
                            />
                        </Box>
                        {/* <Text errorText> {error.description ? error.description : ""}</Text> */}
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '62px' }}>
                        <FileInput
                            name="upoload_document"
                            FileName={formData.upoload_document}
                            handleChange={handleChange}
                            label={<Text largeLabel>Attachments</Text>}
                            uploadKeyName='Upload'
                            isDisabled={false}
                        />
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <FormControl sx={{ height: '44px' }} >
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} checked={checked} onChange={handleCheckChange} />} label={<Text className={classes.header11} >This Reminder Is Related to Payroll</Text>} />
                    </FormControl>
                </Grid>
                {checked && <> <Grid item lg={5.5} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '60px' }}>
                        <CustomSelect
                            label={<Text largeLabel>Pay Cycle</Text>}
                            options={payCycleOptions}
                            disabled={false}
                            name='pay_cycle'
                            value={formData.pay_cycle}
                            onChange={handleChange}
                            commonSelect
                        />
                        <Text errorText> {error.pay_cycle ? error.pay_cycle : ""}</Text>
                    </Box>
                </Grid>
                    <Grid item lg={5.5} md={11} sm={11} xs={11}>
                        <Box sx={{ height: '70px' }}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel className={classes.inputLabel}>{<Text largeLabel>Check Date</Text>}</InputLabel>
                                <Select
                                    id='multi-select'
                                    name={'check_date'}
                                    multiple
                                    value={selectValue}
                                    onChange={handleValue}
                                    IconComponent={KeyboardArrowDownTwoToneIcon}
                                    // variant="filled"
                                    renderValue={(selected) => {
                                        selected.join(' ,')
                                    }}
                                    MenuProps={Menu}
                                    className={classes.checkedSelect}
                                    disableUnderline
                                    fullWidth
                                >
                                    <MenuItem value="all" >
                                        <Checkbox checked={isAllSelected} />
                                        <ListItemText className={classes.listItem} primary={<Text menuItem>All</Text>} />
                                    </MenuItem>
                                    {Options.map((option) => (
                                        <MenuItem key={option.id} value={option.value}>
                                            <Checkbox name="select-checkbox" checked={selectValue.includes(option.value)} />
                                            <ListItemText primary={option.value} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Text errorText> {error.check_date ? error.check_date : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid item lg={1} md={1} sm={1} xs={1} container pt={2}>
                        <HtmlTooltip placement='top' title={'Reminder can only be set before the check date of this cycle.'} arrow>
                            <ReminderIcon style={{ cursor: 'pointer' }} />
                        </HtmlTooltip>
                    </Grid></>}

                <Grid item xs={12} mb={2}>
                    <Divider sx={{ borderColor: '#EAECF0' }} />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            limitTags={2}
                            multiple
                            name="assign_to"
                            freeSolo
                            options={[]}
                            value={formData.to}
                            getOptionLabel={(option) => option.value}
                            onChange={handleChange}
                            renderTags={(value) =>
                                value.map((option, key) => (
                                    <Chip
                                        key={key}
                                        label={option}
                                        onDelete={() => ''}
                                        deleteIcon={<ChipDeleteIcon />}
                                    />
                                ))}
                            clearIcon={false}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name={'assign_to'}
                                    label="Assign To"
                                    variant='filled'
                                    className={classes.autoSelect}
                                />
                            )}
                        />
                        <Text errorText> {error.assign_to ? error.assign_to : ""}</Text>

                    </Box>
                </Grid>
                <Grid item xs={12} mb={1}>
                    <Divider sx={{ borderColor: '#EAECF0' }} />
                </Grid>

                {checked && <>
                    <Grid item lg={12} md={12} sm={12} xs={12} mb={'4px'}>
                        <Text className={classes.header11} >Remind Cycle</Text>
                    </Grid>
                    <Grid item lg={2.5} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '70px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'remind',
                                    value: 'Before',
                                    disabled: true
                                }}

                                handleChange={''}
                                clientInput
                                labelText='Remind'
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={2.5} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '70px' }}>
                            <Input
                                onKeyPress={onNumberWithDecimalOnlyChange}
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'count',
                                    value: formData.count,
                                    disabled: false
                                }}

                                handleChange={handleChange}
                                clientInput
                                labelText={<Text largeLabel >Count</Text>}
                            />{
                                error.count &&
                                <Text errorText> {error.count ? error.count : ""}</Text>

                            }
                        </Box>
                    </Grid>
                    <Grid item lg={2.5} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '70px' }}>
                            <CustomSelect
                                label={<Text largeLabel >Cycle</Text>}
                                options={cycleOptions}
                                disabled={false}
                                name='cycle'
                                value={formData.cycle}
                                onChange={handleChange}
                                commonSelect
                            />
                            <Text errorText> {error.cycle ? error.cycle : ""}</Text>
                        </Box>
                    </Grid>
                    <Grid item lg={4.5} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '70px' }}>
                            <CustomSelect
                                label={<Text sx={{ fontSize: '12px' }} >Remind Every(Optional)</Text>}
                                options={everyOptions}
                                disabled={false}
                                name='remind'
                                value={formData.every}
                                onChange={''}
                                commonSelect
                            />
                            <Text errorText> {error.every ? error.every : ""}</Text>
                        </Box>
                    </Grid>
                </>}

                {!checked && <>
                    <Grid item lg={12} md={12} sm={12} xs={12} mb={'4px'}>
                        <Text className={classes.header11} >Remind On</Text>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '70px' }}>
                            <Date
                                labelText={'Date'}
                                name='date'
                                value={formData.date}
                                onChange={(value => dateChange(value, 'date'))}
                            />
                            <Text errorText> {error.date ? error.date : ""}</Text>

                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ height: '84px' }}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'time',
                                    value: formData.time,
                                    disabled: false,
                                    type: 'time'
                                }}
                                handleChange={handleChange}
                                clientInput
                                labelText='Time'
                            />
                            <Text errorText> {error.time ? error.time : ""}</Text>
                        </Box>
                    </Grid>
                </>
                }
            </Grid>

            <Stack width={'100%'} justifyContent={'space-between'} direction={'row'} gap={2}>
                <Button cancelLg onClick={() => { setView(false) }}>Cancel</Button>
                <Button createLg onClick={() => handleAddReminder()}>Create</Button>
            </Stack>
        </Box>
    )
}
