import React, { useState, useEffect } from 'react'
import InvoiceDashborardStyles from '../invoices/InvoicesDashboardStyles';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/cross.svg';
import { Box, Stack, Grid, FormControlLabel, RadioGroup, Radio, Skeleton, Checkbox } from '@mui/material';
import DatePicker from '../../../../components/datePicker/Date';
import moment from "moment";
import Text from '../../../../components/customText/Text';
import { dateFormat } from '../../../../utils/utils';
import { ReactComponent as RadioIcon } from '../../../../assets/svg/RadioIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../../assets/svg/RadioCheckedIcon.svg';
import { ReactComponent as RadioIconDisabled } from '../../../../assets/svg/RadioUnCheckDisabled.svg';
import { ReactComponent as RadioCheckedIconDisabled } from '../../../../assets/svg/Radiobuttondisabled.svg';
import CustomButton from '../../../../components/customButton/Button';
import { ReactComponent as CalendarIcon } from '../../../../assets/svg/CalenderIcon.svg';
import Table from '../../../../components/table/Table';
import fileIcon from '../../../../assets/svg/fileIconInn.svg';
import fileIconDisabled from '../../../../assets/svg/file-text-disabled.svg';
import InvoicesApi from '../../../../apis/admin/sales/InvoicesApi';
import { addErrorMsg } from '../../../../utils/utils';
import FileSaver from 'file-saver';

export default function Timesheet(props) {

    const { placementId, timesheetConfiguration, saveTimesheet, timesheetTableDisable, closeTimesheetPopUp, ledgerItem } = props
    // const { placementId, timesheetConfiguration, saveTimesheet, timesheetTableDisable, closeTimesheetPopUp, ledgerItem } = props
    const classes = InvoiceDashborardStyles();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(timesheetTableDisable);
    const [config, setConfig] = useState(timesheetConfiguration);
    const [timesheetList, setTimesheetList] = useState([]);
    const [timesheetData, setTimesheetData] = useState({
        start_date: '',
        end_date: '',
    });
    const [ids, setIds] = useState([]);
    const [timesheetTotalhours, setTimesheetTotalhour] = useState("");

    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        if (ledgerItem && ledgerItem.timesheet_hour_ids) {
            setIds(ledgerItem.timesheet_hour_ids);
        }

        if (timesheetConfiguration === "default") {
            if (placementId === "") {
                addErrorMsg("please Select Client")
            } else {
                generateTimesheet(timesheetData, timesheetConfiguration);
            }
        } else {

            if (timesheetTableDisable) {
                generateTimesheet(timesheetData, timesheetConfiguration);
            }

        }

        // eslint-disable-next-line
    }, []);

    const downloadDoc = (fileUrl) => {
        FileSaver.saveAs(fileUrl);
        // setLoading(false)
    }

    const selectAllIds = (e) => {
        if (e.target.checked) {
            let arr = timesheetList.map(i => parseInt(i.timesheet_hours_id));
            setTimesheetTotalhour(getTotalHours(arr.map(i => timesheetList.filter(n => n.timesheet_hours_id == i)[0].total_hours)));
            setIds(timesheetList.map(i => parseInt(i.timesheet_hours_id)));
        } else {
            setTimesheetTotalhour("00.00");
            setIds([]);
        }
    }

    const selectIds = (id) => {
        let idsArr = ids;
        let totalHours;
        if (idsArr.includes(parseInt(id))) {
            idsArr.splice(idsArr.findIndex(i => i == parseInt(id)), 1);
        } else {
            idsArr.push(parseInt(id));
        }

        totalHours = getTotalHours(idsArr.map(i => timesheetList.filter(n => n.timesheet_hours_id == i)[0].total_hours));
        setTimesheetTotalhour(totalHours);
        setIds([...idsArr]);
    }


    const columns = [
        {
            field: "",
            align: "center",
            headerAlign: "center",
            // headerName: "", 
            sortable: false,
            renderHeader: () => (
                <Box sx={{ width: "80px", textAlign: "center", }}>
                    {timesheetList ?
                        <Checkbox onChange={(e) => selectAllIds(e)} checked={ids.length > 0 ? true : false} indeterminate={ids.length > 0 ? ids.length !== timesheetList.length : false} disabled={disabled} /> : null
                    }
                </Box>
            ),
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Box>
                        <Checkbox defaultChecked={ids.includes(parseInt(params.row.timesheet_hours_id))} checked={ids.includes(parseInt(params.row.timesheet_hours_id))} value={parseInt(params.row.timesheet_hours_id)} onChange={(e) => selectIds(e.target.value)} disabled={disabled} />
                    </Box>
            // console.log(params.row.timesheet_hours_id, " paramsss")

        },
        {
            field: "date",
            align: "center",
            headerAlign: "center",
            headerName: "Date", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{["", null, undefined].includes(params.row.date) ? "-" : moment(params.row.date).format(dateFormat())}</Text>

        },
        {
            field: "billable_hours",
            align: "center",
            headerAlign: "center",
            headerName: "Billable Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack >{params.row.billable_hours ? params.row.billable_hours : "--"}</Text>
        },
        {
            field: "ot_hours",
            align: "center",
            headerAlign: "center",
            headerName: "OT Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.ot_hours ? params.row.ot_hours : "--"}</Text>

        },
        {
            field: "total_hours",
            align: "center",
            headerAlign: "center",
            headerName: "Total Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.total_hours ? params.row.total_hours : "--"}</Text>

        },

        {
            field: "document_url",
            align: "center",
            headerAlign: "center",
            headerName: "", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="18px" variant='rounded' height='20px' />
                    :
                    params.row.document_url !== "" ?
                        <img src={`${disabled ? fileIconDisabled : fileIcon}`} alt='fileIcon' style={{ cursor: `${disabled ? 'default' : 'pointer'}`, marginRight: '10px' }} onClick={() => disabled ? null : downloadDoc(params.row.document_url)} /> : '--'
        }
    ];
    const columnsCustom = [
        {
            field: "date",
            align: "center",
            headerAlign: "center",
            headerName: "Date", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{["", null, undefined].includes(params.row.date) ? "-" : moment(params.row.date).format(dateFormat())}</Text>

        },
        {
            field: "billable_hours",
            align: "center",
            headerAlign: "center",
            headerName: "Billable Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack >{params.row.billable_hours ? params.row.billable_hours : "--"}</Text>
        },
        {
            field: "ot_hours",
            align: "center",
            headerAlign: "center",
            headerName: "OT Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.ot_hours ? params.row.ot_hours : "--"}</Text>

        },
        {
            field: "total_hours",
            align: "center",
            headerAlign: "center",
            headerName: "Total Hours", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="100px" />
                    :
                    <Text smallBlack>{params.row.total_hours ? params.row.total_hours : "--"}</Text>

        },

        {
            field: "document_url",
            align: "center",
            headerAlign: "center",
            headerName: "", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ?
                    <Skeleton animation="wave" width="18px" variant='rounded' height='20px' />
                    :
                    params.row.document_url !== "" ?
                        <img src={`${disabled ? fileIconDisabled : fileIcon}`} alt='fileIcon' style={{ cursor: `${disabled ? 'default' : 'pointer'}`, marginRight: '10px' }} onClick={() => disabled ? null : downloadDoc(params.row.document_url)} /> : '--'
        }
    ];

    const handleChangeDate = (value, name) => {
        setTimesheetData({ ...timesheetData, [name]: moment(value).format(dateFormat()) });
    }


    const getTimesheetData = () => {

        if (placementId === "") {
            addErrorMsg("please Select Client")
        } else {
            if (config === "default") {
                generateTimesheet(timesheetData, config);
            } else {
                if (timesheetData.start_date === "" || timesheetData.end_date === "") {
                    addErrorMsg("please Select start date and end date")
                } else {
                    generateTimesheet(timesheetData, config);
                }
            }
        }
    }

    const generateTimesheet = (timesheetDataObj, configInfo) => {
        setLoading(true)
        InvoicesApi.getTimesheetList({ ...timesheetDataObj, placementId }).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setTimesheetList(response.data.data);
                    if (configInfo == "custom") {
                        if (response.data.data.length > 0) {
                            setTimesheetTotalhour(getTotalHours(response.data.data.map(i => i.total_hours)));
                        } else {
                            setTimesheetTotalhour("00.00");
                        }
                    } else {

                        if (ledgerItem.timesheet_hour_ids.length > 0) {
                            setTimesheetTotalhour(getTotalHours(ledgerItem.timesheet_hour_ids.map(i => response.data.data.filter(n => n.timesheet_hours_id == i)[0].total_hours)));
                        } else {
                            setTimesheetTotalhour("00.00");
                        }
                    }
                    setContentVisible(config == "custom");
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }



    const handleChangeConfig = (e) => {
        setTimesheetList([]);
        setConfig(e.target.value);
        setContentVisible(false)
        if (e.target.value === "default") {
            generateTimesheet({ start_date: '', end_date: '' }, e.target.value);
            setTimesheetTotalhour("00.00");
        } else {
            setTimesheetData({ start_date: '', end_date: '', });
            // setTimesheetTotalhour("00:00");
        }



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

    const getTotalHours = (arr) => {
        var start = "00.00";
        for (var i = 0; i < arr.length; i++) {
            start = sumOfHours(start, arr[i]);
        }
        return start;
    }

    const getTotalTimesheetHour = () => {

        if (config == "custom") {
            if (timesheetList.length > 0) {
                let totalHours = getTotalHours(timesheetList.map((time) => time.total_hours))
                let ids = timesheetList.map((time) => time.timesheet_hours_id);
                saveTimesheet(totalHours, ids, config, timesheetData);
            } else {
                addErrorMsg("No Timesheet records are available.");
            }
        } else {
            if (ids.length > 0) {
                let totalHours = getTotalHours(ids.map((id) => timesheetList.find((row) => row.timesheet_hours_id == id).total_hours));
                let datesArr = ids.map(i => moment(timesheetList.find((row) => row.timesheet_hours_id == i).date));
                saveTimesheet(totalHours, ids, config, { start_date: moment.min(datesArr).format(dateFormat()), end_date: moment.max(datesArr).format(dateFormat()) });
            } else {
                addErrorMsg("Please select timesheet hours.");
            }
        }
    }

    const TimesheetTableContent = () => {
        return (
            <Box>
                {config === "default" ?
                    <Stack direction={'row'} gap={2} my={2}>
                        {
                            timesheetList.length > 0 ? <CalendarIcon stroke={true ? "#737373" : "#5DA5F5"} /> : null
                        }

                        {
                            timesheetList.length > 0 ?
                                <Text className={classes.heading2}>{timesheetList.length > 0 ? `Time Period : ${moment(timesheetList[0].date).format(dateFormat())} - ${moment(timesheetList[timesheetList.length - 1].date).format(dateFormat())}` : ""}</Text> : null
                        }
                    </Stack> :
                    disabled ? <Stack direction={'row'} gap={2} mb={3} mt={1}>
                        {
                            timesheetList.length > 0 ? <CalendarIcon stroke={true ? "#737373" : "#5DA5F5"} /> : null
                        }

                        {
                            timesheetList.length > 0 ?
                                <Text className={classes.heading2}>{timesheetList.length > 0 ? `Time Period : ${moment(timesheetList[0].date).format(dateFormat())} - ${moment(timesheetList[timesheetList.length - 1].date).format(dateFormat())}` : ""}</Text> : null
                        }
                    </Stack> : null
                }
                {/* <Box sx={{ height: "336px" }}> */}
                    <Table
                        height={'45vh'}
                        // scroll={true}
                        rows={timesheetList ? timesheetList : []}
                        columns={config == "custom" ? columnsCustom : columns}
                        hideFooter={true}
                        hidePagination={true}
                        isLoading={loading}
                        headerHeight={59}
                        rowHeight={59}
                        isDisabled={disabled}
                    />
                {/* </Box> */}
                <Stack direction={'row'} mt={'30px'} justifyContent={'space-between'} >
                    <Box sx={{ height: "48px", minWidth: "160px", display: "flex", alignItems: "center" }}>
                        <Text className={classes.heading2}>{`Total Hours : ${timesheetTotalhours}`}</Text>
                    </Box>
                    <CustomButton
                        saveBtn
                        sx={{ border: `${disabled ? '1px solid black !important' : 'none'}`, background: `${disabled ? '#FFFF !important' : 'none'}`, color: `${disabled ? 'black !important' : ''}` }}
                        onClick={() => disabled ? setDisabled(!disabled) : getTotalTimesheetHour()}
                    >
                        {disabled ? `Edit` : `Save`}
                    </CustomButton>
                </Stack>
            </Box>
        );
    }




    return (
        <Box sx={{ width: '828px !important', padding: '8px 16px' }}>

            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} mb={1} >
                <Text className={classes.heading2}>Time Sheet</Text>
                <CloseIcon onClick={() => closeTimesheetPopUp()} style={{ cursor: 'pointer' }} />
            </Stack>

            <Stack width={'100%'} justifyContent={'space-between'} >
                <Text className={classes.heading2} sx={{ mb: 1 }} >Choose Your Configuration</Text>
                <RadioGroup sx={{
                    gap: '32px !important',
                    // mb: 1
                }}
                    value={config}
                    onChange={handleChangeConfig}
                    row
                >
                    <FormControlLabel
                        value={'default'}
                        disabled={disabled}
                        control={
                            <Radio
                                icon={disabled ? <RadioIconDisabled /> : <RadioIcon />}
                                checkedIcon={disabled ? <RadioCheckedIconDisabled /> : <RadioCheckedIcon />}
                            />}
                        label={<Text checkboxlable >Default  Configuration</Text>} />
                    <FormControlLabel
                        value={'custom'}
                        disabled={disabled}
                        control={
                            <Radio
                                icon={disabled ? <RadioIconDisabled /> : <RadioIcon />}
                                checkedIcon={disabled ? <RadioCheckedIconDisabled /> : <RadioCheckedIcon />}
                            />}
                        label={<Text checkboxlable >Custom Configuration</Text>} />
                </RadioGroup>


                {
                    config === "custom" ?
                        <Grid container columnSpacing={3} mt={1}>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <Box sx={{ height: '80px', }}>
                                    <DatePicker
                                        onChange={(e) => handleChangeDate(e.$d, "start_date")}
                                        name={'from_date'}
                                        value={timesheetData.start_date}
                                        maxDate={timesheetData.end_date === '' ? null : moment(timesheetData.end_date).format(dateFormat())}
                                        labelText={'From Date'}
                                        disabled={disabled}
                                    />
                                </Box></Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <Box sx={{ height: '80px', }}>

                                    <DatePicker
                                        onChange={(e) => handleChangeDate(e.$d, "end_date")}
                                        name={'end_date'}
                                        value={timesheetData.end_date}
                                        minDate={timesheetData.start_date === '' ? null : moment(timesheetData.start_date).format(dateFormat())}
                                        labelText={'To Date'}
                                        disabled={disabled}
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                {
                                    disabled ?
                                        null :
                                        <Box sx={{ height: '80px', display: 'flex', alignItems: 'center', pb: '28px' }}>
                                            <CustomButton save sx={{ width: '123px' }} onClick={() => getTimesheetData()}>
                                                Generate
                                            </CustomButton>
                                        </Box>
                                }
                            </Grid>
                        </Grid> : null
                }

            </Stack>


            {
                config == "custom" ?
                    contentVisible ?
                        TimesheetTableContent() :
                        null :
                    TimesheetTableContent()
            }


        </Box>
    )
}
