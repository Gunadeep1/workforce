import React, { useState } from 'react'
import { Box, Grid, Checkbox, tooltipClasses } from '@mui/material';
import ToolTip from '../../../../../components/toolTip/ToolTip';
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
// import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import { validate_selectField, validate_emptyField } from '../../../../../components/Validation'
import { ReactComponent as InfoIcon } from '../../../../../assets/svg/InfoIcon.svg';
import { ReactComponent as CheckedIcon } from '../../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../../assets/svg/CheckedBorderIcon.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        maxHeight: '700px',
        width: '963px',
        padding: '0px !important',
        borderRadius: "12px",
    },
    "& .MuiDialogContent-root": {
        padding: '0px !important',
    },
    "& .MuiDialogActions-root": {
        padding: '0px !important'
    },
    "& .MuiDialog-container": {
        background: 'rgba(0, 0, 0, 0.55) !important'
    }
}));

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <ToolTip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 160,
        fontFamily: 'Nunito',
    },
});


function DraftInvoices({ current }) {

    const classes = MainStyles()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [error, setError] = useState({});
    // const [isEditing, setIsEditing] = useState(false);
    const [state, setState] = useState({
        default_hours: '',
    })

    // const handleMenuClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleDialogClose = () => {
        setOpen(false);
    };

    const data = [
        {
            id: 1,
            title: 'Accounts',
            Description: "Description here",
            EmployeeType: 'Contractor',
            time: "10:00",
        },
        {
            id: 2,
            title: 'Payroll',
            Description: "Description here",
            EmployeeType: 'W9 Consultant',
            time: "10:00",
        },
        {
            id: 3,
            title: 'Accounts',
            Description: "Description here",
            EmployeeType: 'W9 Consultant',
            time: "10:00",
        },
        {
            id: 4,
            title: 'Accounts',
            Description: "Description here",
            EmployeeType: 'W9 Consultant',
            time: "10:00",
        },
    ];

    const handleValidateChangeHandler = (e) => {
        let input = e.target;
        let s1 = { ...error };
        switch (input.name || input.tagName) {
            case "default_hours":
                error.default_hours = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(s1);
    };


    const handleInputChange = (e) => {
        // setIsEditing(true)
        if (e.target.name == "default_hours") {
            let input = e.target.value.replace(/\D/g, "").substring(0, 5);
            const first = input.substring(0, 2);
            const second = input.substring(2, 5);
            if (input.length > 2) {
                setState({ ...state, [e.target.name]: `${first}:${second}` });
            } else {
                setState({ ...state, [e.target.name]: input });
            }

            if (input.length > 2) {
                var mm = parseInt(second);
                if (mm > 59) {
                    if (first < 23) {
                        var sec = second - 60;
                        var fOne = parseInt(first) + 1;
                        setState({ ...state, [e.target.name]: `0${fOne}:${sec}` }, handleValidateChangeHandler(e));
                    } else {
                        setState({ ...state, [e.target.name]: `${first}:${59}` }, handleValidateChangeHandler(e));
                    }
                } else {
                    setState({ ...state, [e.target.name]: `${first}:${second}` }, handleValidateChangeHandler(e));
                }
            } else if (input.length >= 0) {
                var hh = parseInt(input);
                if (hh > 23) {
                    state[e.target.name] = "23";
                } else {
                    state[e.target.name] = input;
                }
                setState({ ...state }, handleValidateChangeHandler(e));
            }
        }
        else if (e.target.name == 'cycle_id') {
            setState({ ...state, [e.target.name]: e.target.value, }, handleValidateChangeHandler(e));
            setError(validate_selectField("cycle_id", error));
        }
        else {
            setState({ ...state, [e.target.name]: e.target.value, }, handleValidateChangeHandler(e));
        }
    };

    const templateFormHandler = () => (
        <Box padding={'38px 30px 35px 30px '}>
            <Box mb={4}>
                <Text blackHeader1>Add Draft Invoices Template</Text>
            </Box>
            <Grid container spacing={'32px'}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}

                        inputProps={{
                            // name: 'bankName',
                            // value: '',
                            type: 'text',
                            disabled: false,
                        }}
                        // handleChange={handleChange}
                        titleInput
                        placeholder={'Employee Category'}
                    />

                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={3}>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true,
                                    maxLength: 12,
                                }}
                                inputProps={{
                                    name: "default_hours",
                                    value: state.default_hours,
                                    maxLength: 12,
                                }}
                                titleInput
                                labelText='Reminder Time'
                                handleChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>

                            <CustomSelect
                                commonSelect
                                label={'Text'}
                                // options={''}
                                name='text'
                            // value={''}
                            // onChange={handleChange}
                            ></CustomSelect>

                        </Grid>
                        <Grid item lg={3} md={3} sm={3} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}

                                inputProps={{
                                    name: 'bankName',
                                    value: '',
                                    type: 'text',
                                    disabled: false,
                                }}
                                // handleChange={handleChange}
                                clientInput
                                labelText={'Created By'}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>

                            <CustomSelect
                                commonSelect
                                label={'Text'}
                                // options={''}
                                name='text'
                            ></CustomSelect>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>

                    <CustomSelect
                        commonSelect
                        label={'Text'}
                        // options={''}
                        name='text'
                    // value={''}
                    // onChange={handleChange}
                    ></CustomSelect>

                </Grid>
                <Grid container item lg={8} md={8} sm={12} xs={12} justifyContent={'start'}>
                    <Grid container item lg={3} md={6} sm={6} xs={12} justifyContent={'start'} alignItems={'center'}>
                        <Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />
                        <Text blackHeader3 >Client</Text>
                        <Box pt={'6px'} ml={'11px'}>
                            <CustomWidthTooltip
                                title="Check To Sent Reminder To Respective Client"
                                placement={'right'}
                            >
                                <InfoIcon />
                            </CustomWidthTooltip>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}

                        inputProps={{
                            name: 'bankName',
                            value: '',
                            type: 'text',
                            disabled: false,
                        }}
                        // handleChange={handleChange}
                        clientInput
                        labelText={'CC'}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'bankName',
                            value: '',
                            type: 'text',
                            disabled: false,
                        }}
                        // handleChange={handleChange}
                        clientInput
                        labelText={'BCC'}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={3}>
                        <Grid item lg={3} md={3} sm={6} xs={12}>

                            <CustomSelect
                                commonSelect
                                label={'Text'}
                                // options={''}
                                name='text'
                            // value={''}
                            // onChange={handleChange}
                            ></CustomSelect>

                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>

                            <CustomSelect
                                commonSelect
                                label={'Text'}
                                // options={''}
                                name='text'
                            ></CustomSelect>

                        </Grid>
                        <Grid container item lg={3} md={3} sm={6} xs={12} alignItems={'center'} >

                            <Button addBtn1>Add</Button>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}

                        inputProps={{
                            // name: 'bankName',
                            // value: '',
                            type: 'text',
                            disabled: false,
                        }}
                        // handleChange={handleChange}
                        titleInput
                        placeholder={'Subject'}
                    />

                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        multiline={true}
                        rows={3}

                        inputProps={{
                            name: 'Template',

                            type: 'text',
                        }}
                        // handleChange={handleChange}
                        descriptionFormControl
                        descriptionInput
                        labelText={'Template'}
                        placeholder={'Type Something'}
                    />
                </Grid>
            </Grid>
            <Grid container mt={'32px'}>
                <Grid item container alignItems={'center'} >
                    <Checkbox icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />} />
                    <Text blackHeader3 >Enable This Reminder</Text>
                </Grid>
            </Grid>
            <Box display={'flex'} justifyContent={'end'} gap={'16px'} mt={'21px'}>
                <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                <Button saveExtraSmall onClick={handleDialogClose}>Saveee</Button>
            </Box>
        </Box>
    )
    return (
        <Box sx={{
            height: '75vh',
            overflow: 'auto',
            padding: '16px',
        }}>
            <Box className={classes.activeItemBox}>
                <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
                {data.map((item, index) => (
                    <Box className={classes.descriptionBoxStyle} key={index}>
                        <Grid container alignItems="center">
                            <Grid item lg={7} md={9} sm={9} xs={12} container direction={'column'} gap={1}>
                                <Text mediumBoldBlack2 > {item.title}</Text>
                                <Text lightGrey3>{item.Description}</Text>
                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                                <Text mediumBoldBlack2>Time</Text>
                                <Text lightGrey3>{item.time}</Text>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                                <ToggleSwitch sx={{ height: '24px !important' }} />
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'} justifyContent={'center'}>
                                <CustomMenu
                                    anchorEl={anchorEl}
                                    isOpen={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    children={[{ color: 'black', label: "View" },
                                    { color: '#0C75EB', label: "Edit" },
                                    ]}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                <Button addTitleBtn sx={{ width: '100%' }} onClick={() => handleClickOpen()}>Add Reminder</Button>
                <BootstrapDialog
                    keepMounted
                    onClose={handleDialogClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    fullWidth={true}
                    maxWidth={"lg"}
                >
                    <DialogContent >
                        {templateFormHandler()}
                    </DialogContent>
                </BootstrapDialog>
            </Box>
        </Box>
    )
}

export default DraftInvoices;
