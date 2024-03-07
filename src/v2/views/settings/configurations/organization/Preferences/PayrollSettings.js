import React, { useEffect, useRef, useState } from 'react'
import { Box, Grid, Slide, Skeleton } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import CustomMenu from '../../configComponents/customMenu/Menu'
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';// eslint-disable-next-line
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import LocalStorage from '../../../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../../utils/utils';
import { isValid, validate_charWithSpace, validate_emptyField, validate_selectField } from '../../../../../components/Validation';
import PayrollAPI from '../../../../../apis/configurations/payrollSettings/PayrollAPI';
import Date from '../../../../../components/datePicker/Date';
import moment from 'moment';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Search from '../../../../../assets/svg/search1.svg';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        // height: '586px',
        width: '692px',
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

function PayrollSettings({ current }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = useState(false);// eslint-disable-next-line
    const [activitydata, setActivitydata] = useState([]);// eslint-disable-next-line
    const [page, setPage] = useState(1);
    const [getData, setgetData] = useState([]);// eslint-disable-next-line 
    const [data, setData] = useState(null);
    const [error, setError] = useState({});
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnloading, setBtnLoading] = useState(false);

    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        id: '',
        name: "",
        payroll_cycle_id: "",
        from_date: "",
        to_date: "",
        check_date: '',
        second_from_date: "",
        second_to_date: "",
        second_check_date: "",
        second_actual_check_date: ""
    })

    // const handleMenuClick = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };
    const [filter, setFilter] = useState({
        limit: 10,
        page: 1,
        search: "",
    });

    const activityRef =  useRef(null);
const [total,setTotal] = useState()

    const [activityTotal,setActivityTotal] = useState()

    const [activityFilter,setActivityFilter]=useState({
        limit: 10,
        page: 1,
      })

    useEffect(() => {

        setTimeout(() => {
            setLoading(true);
            getPayrollSettingsList(filter)
            getCycleDropdown();
            getActivity(activityFilter)
        }, 400)
        // eslint-disable-next-line
    }, []);

    // eslint-disable-next-line
    const [activityData, setActivityData] = useState([])

    const getActivity = (args) => {
        setLoading(true)
        let id = 23;
        ConfigApi.getActivity(id, "",args).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setLoading(false)
                    console.log(response.data.data, "res")
                    setActivityData(response.data.data);
                    setActivityTotal(response.data.pagination.total)
                }
            }, 300)

        });
    };



    // API call to get payroll settings List
    const getPayrollSettingsList = (args) => {
        setLoading(true)
        setBtnLoading(true)
        PayrollAPI.getPayrollConfig(args,LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setgetData(response.data.data)
                setTotal(response.data.pagination.total)
                setLoading(false)
                setBtnLoading(false)
            }
        });
    }

    const getCycleDropdown = () => {
        PayrollAPI.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setCycles(response.data.data);
            }
        });
    }

    // API call to get payroll settings List
    const getPayrollIndex = (args) => {
        let id = args.id
        setLoading(true)
        setBtnLoading(true)
        setTimeout(() => {
            PayrollAPI.getPayroll(LocalStorage.uid(), id, LocalStorage.getAccessToken()).then((response) => {
                if (response.data.statusCode == 1003) {
                    setgetData(response.data.data)
                    setLoading(false)
                    setBtnLoading(false)
                } else {
                    addErrorMsg(response.data.message)
                }
            });
        }, 500)

    }

    const activityHandleScroll = () => {
        const { current } = activityRef;
        if (current) {
          const { scrollTop, scrollHeight, clientHeight } = current;
          if (scrollTop + clientHeight >= scrollHeight) {
            // getCategory({...filter})
            if(activityTotal>=activityFilter.limit){
              setActivityFilter({...activityFilter, limit: activityFilter.limit + 10, page: 1 })
              getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1,});
            }
            // Reached the bottom of the inner box
            console.log('Reached end of inner box, calling a function...');
            // Call your function here
          }
        }
      };

    const dateChange = (e, name) => {
        let date = e.$d
        let event = {
            target: {
                name: name,
                value: moment(date).format(dateFormat())
            }
        }

        handleInputChange(event)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    // eslint-disable-next-line
    const [today, setToday] = useState("");
    const finalDateReturn = (param, param1) => {

        return moment(param, dateFormat()).add(param1, "days").format(dateFormat())
    }


    const [dates, setDates] = useState({
        small: "",
        large: ""
    })

    const getOneMonthEndDate = (date) => {
        // New Second cycle end date
        var temp2 = moment(date, dateFormat());
        // const inputDate = new Date(temp2);
        // Add 1 month
        // const year = inputDate.getFullYear();
        // const month = inputDate.getMonth() + 1;
        // const day = inputDate.getDate();
        const year = Number(temp2.format('YYYY'));
        const month = Number(temp2.format('M'));
        const day = Number(temp2.format('D'));

        let newDate;
        let newMonth;
        let newYear;
        let leapYear = (year % 100 == 0) ? (year % 400 == 0) : (year % 4 == 0);
        if (!leapYear) {
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                if (month == 1) {
                    if (day == 1) {
                        newDate = 31;
                        newMonth = month;
                        newYear = year;
                    } else if (day <= 29) {
                        newDate = day - 1;
                        newMonth = month + 1;
                        newYear = year;
                    } else {
                        newDate = 27;
                        newMonth = month + 1;
                        newYear = year;
                    }
                } else {
                    if (day == 1) {
                        newDate = 31;
                        newMonth = month;
                        newYear = year;
                    } else if (day <= 30) {
                        newDate = day - 1;
                        newMonth = month + 1;
                        newYear = year;
                        if (month == 12) {
                            newMonth = 1;
                            newYear = year + 1;
                        }
                    } else {
                        if (month + 1 == 8) {
                            newDate = 30
                        } else {
                            newDate = 29
                        }
                        if (month == 12) {
                            newMonth = 1;
                            newYear = year + 1;
                            newDate = 30
                        } else {
                            newMonth = month + 1;
                            newYear = year;
                        }
                    }
                }
            } else {
                if (month == 2) {
                    if (day == 1) {
                        newDate = 28;
                        newMonth = month;
                        newYear = year;
                    } else if (day < 28) {
                        newDate = day - 1;
                        newMonth = month + 1;
                        newYear = year;
                    } else {
                        newDate = 30;
                        newMonth = month + 1;
                        newYear = year;
                    }
                } else {
                    if (day == 1) {
                        newDate = 30;
                        newMonth = month;
                        newYear = year;
                    } else if (day < 30) {
                        newMonth = month + 1;
                        newYear = year;
                        newDate = day - 1;
                    } else {
                        newDate = 30;
                        newMonth = month + 1;
                        newYear = year;
                    }
                }
            }
        } else {
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                if (month == 1) {
                    if (day == 1) {
                        newDate = 31;
                        newMonth = month;
                        newYear = year;
                    } else if (day <= 29) {
                        newDate = day - 1;
                        newMonth = month + 1;
                        newYear = year;
                    } else {
                        newDate = 28;
                        newMonth = month + 1;
                        newYear = year;
                    }
                } else {
                    if (day == 1) {
                        newDate = 31;
                        newMonth = month;
                        newYear = year;
                    } else if (day <= 30) {
                        newDate = day - 1;
                        newMonth = month + 1;
                        newYear = year;
                        if (month == 12) {
                            newMonth = 1;
                            newYear = year + 1;
                        }
                    } else {
                        if (month + 1 == 8) {
                            newDate = 30
                        } else {
                            newDate = 29
                        }
                        if (month == 12) {
                            newMonth = 1;
                            newYear = year + 1;
                            newDate = 30
                        } else {
                            newMonth = month + 1;
                            newYear = year;
                        }
                    }
                }
            } else {
                if (month == 2) {
                    if (day == 1) {
                        newDate = 29;
                        newMonth = month;
                        newYear = year;
                    } else if (day < 29) {
                        newDate = day - 1;
                        newMonth = month + 1;
                        newYear = year;
                    } else {
                        newDate = 30;
                        newMonth = month + 1;
                        newYear = year;
                    }
                } else {
                    if (day == 1) {
                        newDate = 30;
                        newMonth = month;
                        newYear = year;
                    } else if (day < 30) {
                        newMonth = month + 1;
                        newYear = year;
                        newDate = day - 1;
                    } else {
                        newDate = 30;
                        newMonth = month + 1;
                        newYear = year;
                    }
                }
            }
        }
        // return new Date(newYear + "-" + (newMonth) + "-" + newDate);
        const modifiedDate = moment([newYear, (newMonth - 1), newDate]).format(dateFormat());
        return modifiedDate;
    };

    // returning past dates if day is saturday or sunday
    const handlePayDate = (param) => {
        var day = Number(moment(param, dateFormat()).format('d'));
        if (day == 6) {
            return moment(param, dateFormat()).subtract(1, "days").format(dateFormat())
        } else if (day == 0) {
            return moment(param, dateFormat()).subtract(2, "days").format(dateFormat())
        } else {
            return param;
        }
    }


    // finding difference between two dates
    const diffTwoDates = (param1, param2) => {
        var date1 = moment(param1, dateFormat()).format('YYYY-MM-DD');
        var date2 = moment(param2, dateFormat()).format('YYYY-MM-DD');
        var days_difference = moment(date2).diff(moment(date1), 'days')
        return days_difference;
    }

    const handleInputChange = (e) => {
        if (e && e.target && e.target.name) {
            const { name, value } = e.target;
            if (name == 'from_date') {
                console.log(value, "valueee")
                const result = moment(value, dateFormat()).format(dateFormat());
                console.log(result, "result")
                if (state.payroll_cycle_id == 1) { // weekly 
                    state[name] = value;
                    state.to_date = moment(value, dateFormat()).add(6, "days").format(dateFormat());
                    state.actual_check_date = "";
                    state.check_date = "";
                } else if (state.payroll_cycle_id == 2) { // Bi weekly cycle
                    state[name] = value;
                    state.to_date = moment(value, dateFormat()).add(13, "days").format(dateFormat());
                    state.actual_check_date = "";
                    state.check_date = "";
                } else if (state.payroll_cycle_id == 3) { // semi monthly cycle
                    setToday(value);
                    const middleDate = finalDateReturn(result, 14);
                    const selectFeatureDate = moment(middleDate, dateFormat()).add(2, "days").format(dateFormat());
                    const selectPastDate = moment(middleDate, dateFormat()).subtract(2, "days").format(dateFormat());
                    const newDates = dates;
                    newDates.small = selectPastDate;
                    newDates.large = selectFeatureDate;
                    setDates({ ...newDates });
                    state[name] = value;
                    state.to_date = finalDateReturn(result, 14);
                    state.check_date = "";
                    state.actual_check_date = "";
                    state.second_from_date = finalDateReturn(result, 15);
                    state.second_to_date = getOneMonthEndDate(value);

                } else if (state.payroll_cycle_id == 4) { // monthly cycle
                    setToday(value);
                    state[name] = value;
                    state.to_date = getOneMonthEndDate(value);

                }
            }
            else if (e.target.name == 'payroll_cycle_id') {
                if (state.from_date == "") {
                    state[e.target.name] = e.target.value
                } else {
                    const result = state.from_date;
                    if (e.target.value == 1) {
                        state[e.target.name] = e.target.value;
                        state.to_date = moment(result, dateFormat()).add(6, "days").format(dateFormat());
                        state.actual_check_date = "";
                        state.check_date = "";
                        state.second_from_date = "";
                        state.second_to_date = "";

                        const newDates = dates;
                        newDates.small = "";
                        newDates.large = "";
                        setDates({ ...newDates });
                    } else if (e.target.value == 2) {
                        const newDates = dates;
                        newDates.small = "";
                        newDates.large = "";
                        setDates({ ...newDates });
                        state[e.target.name] = e.target.value;
                        state.to_date = moment(result, dateFormat()).add(13, "days").format(dateFormat());
                        state.actual_check_date = "";
                        state.check_date = "";
                        state.second_from_date = "";
                        state.second_to_date = "";

                    } else if (e.target.value == 3) {
                        const middleDate = finalDateReturn(result, 14);
                        const selectFeatureDate = moment(middleDate, dateFormat()).add(2, "days").format(dateFormat());
                        const selectPastDate = moment(middleDate, dateFormat()).subtract(2, "days").format(dateFormat());
                        const newDates = dates;
                        newDates.small = selectPastDate;
                        newDates.large = selectFeatureDate;
                        setDates({ ...newDates });
                        state[e.target.name] = e.target.value;
                        state.to_date = finalDateReturn(result, 14);
                        state.check_date = "";
                        state.actual_check_date = "";
                        state.second_from_date = finalDateReturn(result, 15);
                        state.second_to_date = getOneMonthEndDate(result);

                    } else if (e.target.value == 4) {
                        const newDates = dates;
                        newDates.small = "";
                        newDates.large = "";
                        setDates({ ...newDates });
                        state[e.target.name] = e.target.value;
                        state.to_date = getOneMonthEndDate(result);
                        state.check_date = "";
                        state.actual_check_date = "";
                        state.second_from_date = "";
                        state.second_to_date = "";

                    }
                }
            } else if (e.target.name == "second_from_date") {
                const result = e.target.value;
                const lastDay = moment(result, dateFormat()).subtract(1, "days").format(dateFormat())
                const dif = diffTwoDates(lastDay, state.actual_check_date);
                state[e.target.name] = e.target.value;
                state.to_date = lastDay;
                if (state.actual_check_date != "") {
                    state.second_check_date = dif <= 2 ? handlePayrollRunsDate(finalDateReturn(state.second_to_date, dif)) : handlePayDate(finalDateReturn(state.second_to_date, dif));
                    state.second_actual_check_date = finalDateReturn(state.second_to_date, dif);
                }
            }
            else if (e.target.name == "check_date") {
                const result = e.target.value;
                var days = Number(moment(result, dateFormat()).format('d'));
                const featureDay = moment(result, dateFormat()).add(1, "days").format(dateFormat());
                if (result > state.second_to_date && result > state.second_check_date) {
                    if (days == 0 || days == 6) {
                        handleClickOpen();
                    }
                    if (state.payroll_cycle_id == 3) {
                        state[e.target.name] = handlePayDate(e.target.value);
                        state.actual_check_date = e.target.value;
                        state.second_check_date = handlePayDate(featureDay);
                        state.second_actual_check_date = handlePayDate(featureDay);
                    } else {
                        state[e.target.name] = handlePayDate(e.target.value);
                        state.actual_check_date = e.target.value;
                        state.second_check_date = "";
                        state.second_actual_check_date = "";
                    }
                } else {
                    if (days == 0 || days == 6) {
                        handleClickOpen();
                    }
                    if (state.payroll_cycle_id == 3) {
                        var diff = diffTwoDates(state.to_date, e.target.value);
                        state[e.target.name] = handlePayDate(e.target.value);
                        state.actual_check_date = e.target.value;
                        state.second_check_date = handlePayDate(finalDateReturn(state.second_to_date, diff));
                        state.second_actual_check_date = finalDateReturn(state.second_to_date, diff);
                        var sec_fre = finalDateReturn(state.second_to_date, diff);
                        if (Number(moment(sec_fre, dateFormat()).format('d')) == 0 || Number(moment(sec_fre, dateFormat()).format('d')) == 6) {
                            handleClickOpen();
                        }
                    } else {
                        state[e.target.name] = handlePayDate(e.target.value);
                        state.actual_check_date = e.target.value;
                    }
                }
            }
            else if (e.target.name == "second_check_date") {
                var day = Number(moment(e.target.value, dateFormat()).format('d'));
                if (day == 0 || day == 6) {
                    handleClickOpen();
                }
                state[e.target.name] = handlePayDate(e.target.value);
                state.second_actual_check_date = e.target.value;
            }

            else {
                state[e.target.name] = e.target.value;
            }
            setState({ ...state }, handleValidate(e))
            setError(validate_selectField(e.target.name, error));

            setState({
                ...state,
                [e.target.name]: e.target.value,
            }, handleValidate(e.target));
        }
    };

    const handlePayrollRunsDate = (param) => {
        var day = Number(moment(param, dateFormat()).format('d'));
        if (day == 6) {
            return moment(param, dateFormat()).subtract(2, "days").format(dateFormat())
        } else if (day == 0) {
            return moment(param, dateFormat()).subtract(1, "days").format(dateFormat())
        } else {
            return param;
        }
    }

    const handleValidate = (input) => {

        let updatedErrors = { ...error };
        switch (input.name || input.tagName) {
            case 'name':
                updatedErrors.name = validate_charWithSpace(input.value)
                break
            case 'description':
                updatedErrors.description = validate_charWithSpace(input.value)
                break
            case 'is_active':
                updatedErrors.is_active = validate_emptyField(input.value)
                break
            default:
                break
        }
        console.log(updatedErrors, "errr")
        setError(updatedErrors)
    }

    const handleClickOpen = () => {

        setError({});
        setIsEditable(false)
        setAlert(false);
        setState({
            ...state,
            request_id: LocalStorage.uid(),
            name: "",
            payroll_cycle_id: "",
            from_date: "",
            to_date: "",
            check_date: "",


        })
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        getPayrollSettingsList(filter)
    };



    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleViewClick = (data) => {
        if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_organization" && item.is_allowed == true))) {
            setOpen(true);
            setAlert(false)
            setAnchorEl(null);
            setIsEditable(true);
            setState(data)
            getPayrollIndex(data)
        } else {
            addWarningMsg("You don't have permission to perform this action. Please contact the admin")
        }
    }

    const handleEditClick = (args) => {
        if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_organization" && item.is_allowed == true))) {
            setOpen(true);
            setAlert(false)
            setAnchorEl(null);
            setIsEditable(false);
            setState(args);
            getPayrollIndex(args)
        } else {
            addWarningMsg("You don't have permission to perform this action. Please contact the admin")
        }
    };


    const validateAll = () => {
        let { name, from_date, to_date, check_date } = state;
        let errors = {};
        errors.name = validate_emptyField(name);
        errors.from_date = validate_emptyField(from_date)
        errors.to_date = validate_emptyField(to_date)
        errors.check_date = validate_emptyField(check_date)
        console.log(errors, "erorrs")
        return errors;
    };

    const handleSubmit = (e) => {
        setLoading(true)
        setBtnLoading(true)
        e.preventDefault();
        let errors = validateAll();
        if (isValid(errors)) {
            if (state.id != "") {
                const newState = state;
                newState['request_id'] = LocalStorage.uid();
                setState({ ...newState })
                const id = state.id
                PayrollAPI.updatePayrollConfig(state, id, LocalStorage.getAccessToken()).then((response) => {
                    if (response.data.statusCode == 1003) {
                        setLoading(false)
                        setBtnLoading(false)
                        addSuccessMsg(`${state.name} Updated Successfully`);
                        setOpen(false);
                        getPayrollSettingsList(filter);
                        getActivity(activityFilter)
                    } else {
                        addErrorMsg(response.data.message);
                    }
                })
            } else {
                const newState = state;
                newState['request_id'] = LocalStorage.uid();
                setState({ ...newState })
                PayrollAPI.storePayrollConfig(state, LocalStorage.getAccessToken()).then((response) => {
                    if (response.data.statusCode == 1003) {
                        setOpen(false)
                        setLoading(false)
                        setBtnLoading(false)
                        addSuccessMsg(`${state.name} Added successfully`);
                        getPayrollSettingsList(filter);
                        getActivity(activityFilter)
                    } else {
                        addErrorMsg(response.data.message);

                    }
                })
            }
        }
        else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    }
    const handleSearch = (e) => {
        const text = e.target.value;
        setFilter({ ...filter, search: text })
        if (text.length > 1 || text.length == 0) {
            if (!loading) {
                setLoading(true);
                setTimeout(() => {
                    searchAPICall(e.target.value);
                }, 2000);
            }
        }
    }
    const searchAPICall = (text) => {
        PayrollAPI.getPayrollConfig({ ...filter, search: text }).then((res) => {
    
          setLoading(false);
          setgetData(res.data.data);
          // setPagination(res.data.pagination);
      })
    }
    const closeBtn = () => {
      setLoading(true);
      setFilter({ ...filter, search: "" });
      setTimeout(() => {
        PayrollAPI.getPayrollConfig({ ...filter, search: "" }).then((res) => {
              setLoading(false);
              setgetData(res.data.data);
              // setPagination(res.data.pagination);
          })
      }, 2000);
    }


    return (
        <Box sx={{
            height: '60vh',
            padding: '16px',
        }}>
            <Box className={classes.activeItemBox}>
                <Box className={classes.activeBoxHeading}>
                    {/* <Text RegularBlack1 >{current}</Text> */}
                    <Grid container>
                        <Grid item lg={7} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                        <Text blackHeader>
                        {current}
                        </Text>
                        </Grid>
                    
                    <Grid item lg={5}>
                    {total>10?
                    <div className={classes.searchField}>
                    <input
                        type="text"
                        value={filter.search}
                        onChange={handleSearch}
                        className={classes.globalSearchInput}
                        placeholder="Search"
                    // onKeyUp={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                    // onKeyDown={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                    />
                    <button
                        type="button"
                        className={classes.searchIcon}
                    >
                        {filter.search.length == 0 ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} 
                        onClick={closeBtn}
                         />}
                    </button>
                </div>
                    :
                    ""}
                   
                    </Grid>
                    </Grid>
                    </Box>
                <Box sx={{
                    // height: '55vh',
                    overflow: 'auto',
                    padding: '16px',
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        '-webkit-box-shadow': 'inset 0 0 6px #ffffff',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ffffff',
                        outline: '1px solid #ffffff',
                        borderRadius: "4px",
                    }

                }}>
                    {loading ? <>
                        {[1, 2, 3, 4, 5].map((item, index) => (
                            <Grid container key={index} mt={3} className={classes.descriptionBoxStyle}>
                                <Grid item lg={6}>
                                    <Skeleton animation="wave" width="250px" />
                                    <Skeleton animation="wave" width="250px" />

                                </Grid>
                                <Grid item lg={4}>
                                    <Skeleton animation="wave" width="100px" />
                                    <Skeleton animation="wave" width="100px" />

                                </Grid>

                                <Grid item lg={2} mt={2}>
                                    <Skeleton animation="wave" width="20px" />
                                </Grid>
                            </Grid>

                        ))}



                    </>
                        :
                        <>
                            {getData.map((item, index) => (
                                <Box className={classes.descriptionBoxStyle} key={index} mb={2}>
                                    <Grid container justifyContent='space-between' alignItems="center">
                                        <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                                            <Text mediumBlackColor > {item.name}</Text>
                                            <Text greyLabel>{item.from_date}-{item.to_date}</Text>
                                        </Grid>
                                        <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                                            <Text mediumBlackColor>Check in date</Text>
                                            <Text greyLabel>{item.check_date}</Text>
                                        </Grid>

                                        <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'} justifyContent={'center'}>

                                            <CustomMenu
                                                Icon={<MenuIcon />}
                                                handleMenuClick={handleMenuClick}
                                                anchorEl={anchorEl}
                                                isOpen={Boolean(anchorEl)}
                                                onClose={handleClose}
                                                children={[{ color: 'black', label: "View", Click: () => handleViewClick(item) },
                                                { color: '#0C75EB', label: "Edit", Click: () => handleEditClick(item) },

                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            {
                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_organization" && item.is_allowed == true))) ?
                                    <Button addTitleBtn onClick={handleClickOpen}>Add Payroll</Button> :
                                    <Button addTitleBtnDisable>Add Payroll</Button>
                            }
                        </>
                    }

                    {alert ? "" :
                        <BootstrapDialog
                            keepMounted
                            onClose={handleDialogClose}
                            aria-labelledby="customized-dialog-title"
                            open={open}
                            fullWidth={true}
                            maxWidth={"md"}
                            TransitionComponent={Transition}
                        >
                            <DialogContent >
                                <Box padding={'38px 30px 35px 30px '}>
                                    <Box mb={4}>
                                        <Text blackHeader1>Payroll Settings</Text>
                                    </Box>
                                    <Grid container spacing={'32px'}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'name',
                                                    value: state.name,
                                                    type: 'text',
                                                    disabled: isEditable ? true : false,
                                                }}
                                                clientInput
                                                handleChange={handleInputChange}
                                                labelText={'Payroll Name'}
                                            />
                                            {error.name ? <Text red>{error.name}</Text> : ""}
                                        </Grid>


                                        <Grid item lg={6} md={6} sm={12} xs={12}>

                                            <CustomSelect
                                                commonSelect
                                                label={'Payroll Cycle'}
                                                options={cycles}
                                                name='payroll_cycle_id'
                                                value={state.payroll_cycle_id}
                                                disabled={isEditable ? true : false}
                                                onChange={handleInputChange}
                                            />
                                            {error.payroll_cycle_id ? <Text red>{error.payroll_cycle_id}</Text> : ""}
                                        </Grid>

                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Date
                                                labelText={<Text largeLabel>Payroll Start Date</Text>}
                                                name='from_date'
                                                value={state.from_date}
                                                height='53px'
                                                disabled={isEditable ? true : false}
                                                onChange={(value => dateChange(value, 'from_date'))}
                                            />
                                            {console.log(!state.payroll_cycle_id, "stateee")}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Date
                                                labelText={<Text largeLabel>Payroll End Date</Text>}
                                                name='to_date'
                                                value={state.to_date}
                                                height='53px'
                                                onChange={(value => dateChange(value, 'to_date'))}
                                                disabled={true}
                                            />

                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Date
                                                labelText={<Text largeLabel>Payroll Runs from</Text>}
                                                name='check_date'
                                                value={state.check_date}
                                                height='53px'
                                                disabled={isEditable ? true : false}
                                                minDate={moment(state.to_date, dateFormat()).add(1, "days").format(dateFormat())}
                                                onChange={(value => dateChange(value, 'check_date'))}
                                            />

                                        </Grid>
                                    </Grid>
                                    <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                                        {/* <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                                             <Button saveExtraSmall onClick={handleSubmit}>{isEditable ? 'Edit' : 'Save'}</Button> */}
                                        <Button cancelOutline onClick={handleDialogClose}>
                                            Cancel
                                        </Button>
                                        {isEditable && (
                                            <Button saveVerySmall onClick={() => handleEditClick(state)}>
                                                Edit
                                            </Button>
                                        )}
                                        {!isEditable && (
                                            <LoadingButton loading={btnloading} saveVerySmall onClick={handleSubmit}>
                                                {btnloading ? 'Saving' : 'Save'}
                                            </LoadingButton>
                                        )}
                                    </Box>
                                </Box>
                            </DialogContent>
                        </BootstrapDialog>}
                </Box>


            </Box>
            <Box className={classes.activeItemBox} mt={4}>
                <Box mb={3}>
                    <Text RegularBlack1>Recent Activities</Text>
                </Box>
                <Box sx={{
                    height: '40vh', overflowY: 'auto', 
                    // '&::-webkit-scrollbar': {
                    //     display: 'none',
                    // },
                }}
                ref={activityRef}
                onScroll={activityHandleScroll}>
                    {activityData.length > 0 && activityData.map((value) => (
                        <Box className={classes.descriptionBoxStyle} mb={2}>
                            {console.log(value, "value")}
                            <Grid container spacing={6}>
                                <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                                    <Text mediumBoldBlack2>{value.created_by}</Text>
                                    <Text lightGrey3>{value.created_at}</Text>
                                </Grid>
                                <Grid item lg={8} md={8} sm={6} xs={12} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                                    {value.action_type_name === "store" ? <Text mediumGrey2>{value.referrable_name } has been created</Text> : value.action_type_name === "update" ?  <Text mediumGrey2>{value.field_changes}</Text>: null}
                                   
                                </Grid>
                            </Grid>
                        </Box>

                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default PayrollSettings;
