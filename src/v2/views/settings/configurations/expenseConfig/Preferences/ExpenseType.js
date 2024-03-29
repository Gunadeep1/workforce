import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid, Slide, Autocomplete, Skeleton, Chip, TextField } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';// eslint-disable-next-line
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import ExpenseManagementApi from '../../../../../apis/configurations/expense/ExpenseManagementApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import { isValid, validate_charWithSpace, validate_emptyField, validates_emptyArray } from '../../../../../components/Validation';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Search from '../../../../../assets/svg/search1.svg';
import CommonApi from '../../../../../apis/CommonApi';

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

function ExpenseType({ current }) {
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
  const recentSection = useRef(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);
  const [newState, setNewState] = useState(false)
  const [activityTotal, setActivityTotal] = useState()
  const activityRef = useRef(null);
  const [state, setState] = useState({
    // request_id: LocalStorage.uid(),
    id: '',
    name: "",
    description: "",
    is_active: "",
    updated_by: '',
    assignee_employee_ids: [],
  })

  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };


  const scrollDown = () => {

    window.scroll({
      top: recentSection.current.scrollIntoView(),
      behavior: 'smooth'
    });
  }
  // const [activityFilter,setActivityFilter]=useState({
  //   limit: 10,
  //   page: 1,
  // })

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      getAssignedToDropdownList();
      getExpenseManagementApiList(filter);
      getActivity(activityFilter)
    }, 300)

    // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  const [activityData, setActivityData] = useState([])
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: "",
  });
  const [activityFilter, setActivityFilter] = useState({
    limit: 10,
    page: 1,
  })
  const [total, setTotal] = useState()
  // const [activityTotal, setActivityTotal] = useState()

  const getActivity = (args) => {
    setLoading(true)
    let id = 25;
    ConfigApi.getActivity(id, "", args).then((response) => {
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    }, handleValidate(e.target));
  };

  const handleValidate = (input) => {

    let updatedErrors = { ...error };
    switch (input.name || input.tagName) {
      case 'name':
        updatedErrors.name = validate_charWithSpace(input.value)
        break
      // case 'description':
      //   updatedErrors.description = validate_charWithSpace(input.value)
      //   break
      case 'is_active':
        updatedErrors.is_active = validate_emptyField(input.value)
        break
      case 'assignee_employee_ids':
        console.log(input.name, "name")
        console.log(input.value, "value")
        updatedErrors.assignee_employee_ids = validates_emptyArray(input.value)
        break;
      default:
        break
    }
    console.log(updatedErrors, "errr")
    setError(updatedErrors)
  }
  const [deletedchips, setDeletedchips] = useState([]);
  const handleDeleteEmployee = (key, index) => {
    let members = state.assignee_employee_ids;
    let newArr = members
    let deletedChipsArr = deletedchips;
    if (newArr[key].id !== '') {
      deletedChipsArr.push(newArr[index]);
    }
    newArr.splice(key, 1);
    // setState({ ...state, members })
    setDeletedchips([...deletedChipsArr]);

  }
  const handleClickOpen = () => {
    setNewState(true);
    // setId("");
    setError({});
    setIsEditable(false)
    setAlert(false);
    setState({
      // ...state,
      // request_id: LocalStorage.uid(),
      id: "",
      name: "",
      description: "",
      is_active: "",
      updated_by: '',
      assignee_employee_ids: [],
    })
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    // setBtnLoading(true)
  };



  const [name, setName] = useState('');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleViewClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_expense_management_types" && item.is_allowed == true)))) {
      setNewState(false);
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(true);
      setState(data);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleEditClick = (args) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_expense_management_types" && item.is_allowed == true)))) {
      setNewState(false);
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      // setId(args.id);
      setState(args);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  };
  const [deleteid, setDeleteid] = useState(null);
  // const [id, setId] = useState("");

  const handleDeleteClick = (item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_expense_management_types" && item.is_allowed == true)))) {
      setName(item.name)
      setOpen(true);
      setAlert(true)
      setDeleteid(item.id);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const options = [
    { id: true, value: 'Active' },
    { id: false, value: 'Inactive' },
  ];

  // const handleStatusChange = (e, value, item) => {
  //   var statusData = {
  //     request_id: LocalStorage.uid(),
  //     id: item.id,
  //     name: item.name,
  //     description: item.description,
  //     is_active: value
  //   }
  //   updateExpenseType(statusData);

  // }
  const handleChangeMembers = (e, newValue) => {
    let { id, value } = newValue[newValue.length - 1];
    if (!["", null, undefined].includes(e.target.value)) {
      let members = state.assignee_employee_ids;
      console.log(members, 'members')
      if (!Array.isArray(members)) {
        console.error("state.assignee_employee_ids is not an array");
        return;
      }

      let membersArr = [...members];
      if (Array.isArray(membersArr) && membersArr.filter((i) => i.employee_id === id).length === 0) {
        membersArr.push({ id: '', employee_name: value, employee_id: id });
        let target = { name: 'assignee_employee_ids', value: membersArr }
        setState({ ...state, assignee_employee_ids: membersArr }, handleValidate(target));
      }
    }
  };
  const toggleChange = (item, e) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_expense_management_types" && item.is_allowed == true)))) {
      const data = { request_id: LocalStorage.uid(), is_active: e.target.checked }
      ExpenseManagementApi.statusUpdate(item.id, data).then((response) => {
        if (response.data.statusCode === 1003) {
          getExpenseManagementApiList(filter);
          addSuccessMsg('Status Updated Successfully');
          getActivity(activityFilter)
        }
        else {
          addErrorMsg(response.data.message);
        }
      })
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  // const updateExpenseType = (args) => {
  //   const data = { ...args, request_id: LocalStorage.uid() };
  //   console.log(data, "data")
  //   const id = args.id
  //   console.log(args, "sttatwe")
  //   setLoading(true)
  //   // setBtnLoading(true)
  //   ExpenseManagementApi.updateExpense(id, data).then((response) => {
  //     setTimeout(() => {
  //       if (response.data.statusCode == 1003) {
  //         getExpenseManagementApiList(page);
  //         addSuccessMsg(args.name + ' ' + response.data.message);
  //         setData(null);
  //         setOpen(false)
  //         // setBtnLoading(false)
  //         setLoading(true)
  //       } else {
  //         getExpenseManagementApiList(page);
  //         addErrorMsg(response.data.message);
  //       }
  //     }, 300)

  //   });
  // }

  const handleDelete = (id) => {
    const userData = {
      request_id: LocalStorage.uid(),

    }
    setLoading(true)
    // setBtnLoading(true)
    ExpenseManagementApi.deleteExpense(userData, deleteid, LocalStorage.getAccessToken()).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          getExpenseManagementApiList(page);
          addSuccessMsg(`${name} Deleted Successfully`)
          setLoading(false)
          // setBtnLoading(false)
        }
        else {
          addErrorMsg(response.data.message);
        }
      }, 300)
      setOpen(false);
    })
  }


  const validateAll = () => {
    let { name, assignee_employee_ids, is_active } = state;
    let errors = {};
    errors.name = validate_emptyField(name);
    errors.assignee_employee_ids = validates_emptyArray(assignee_employee_ids);
    errors.is_active = validate_emptyField(is_active)
    console.log(errors, "erorrs")
    return errors;
  };

  const handleSubmit = (e) => {
    // if (isEditable) {
    //   setIsEditable(false)
    // }
    // // e.preventDefault();
    // let errors = validateAll();
    // if (isValid(errors)) {
    //   setBtnLoading(true)
    //   if (id != "") {
    //     const data = {
    //       request_id: LocalStorage.uid(),
    //       id: id,
    //       name: state.name,
    //       description: state.description,
    //       is_active: state.is_active,
    //     }
    //     updateExpenseType(data)
    //   } else {
    //     setBtnLoading(false)
    //     setLoading(true)
    //     ExpenseManagementApi.storeExpense(state, LocalStorage.getAccessToken()).then((response) => {
    //       setTimeout(() => {
    //         if (response.data.statusCode == 1003) {
    //           getExpenseManagementApiList(1);
    //           setOpen(false);
    //           setLoading(false)
    //           setBtnLoading(false)
    //           addSuccessMsg(state.name + ' ' + response.data.message);
    //         } else {
    //           // setBtnLoading(false)
    //           addErrorMsg(response.data.message);
    //           setOpen(false);
    //         }
    //       }, 700)

    //     });
    //   }
    // } else {
    //   let s1 = { error };
    //   s1 = errors;
    //   setError(s1);
    // }
    if (isEditable) {
      setIsEditable(false)
    }
    else {
      let errors = validateAll();
      if (isValid(errors)) {
        setBtnLoading(true)
        if (newState) {

          state['request_id'] = LocalStorage.uid();
          ExpenseManagementApi.storeExpense(state).then((response) => {
            setTimeout(() => {
              setBtnLoading(false)
              if (response.data.statusCode === 1003) {
               getExpenseManagementApiList(filter);
                addSuccessMsg(`${state.name} Added Successfully`);
                setOpen(false)
              }
              else {
                addErrorMsg(response.data.message);
                // setOpen(false)
              }
            }, 600)

          })

        }
        else {

          state['request_id'] = LocalStorage.uid();
          ExpenseManagementApi.updateExpense(state).then((response) => {
            setTimeout(() => {
              setBtnLoading(false)
              if (response.data.statusCode === 1003) {
               getExpenseManagementApiList(filter);
                addSuccessMsg(`${state.name} Updated Successfully`);
                setOpen(false)
                getActivity(activityFilter)
              }
              else {
                addErrorMsg(response.data.message);
                setOpen(false)
              }
            }, 600)
          })
        }
      }
      else {
        setError(errors);
        addWarningMsg('Please fill all Mandatory Fields');
      }
    }
  }
  const getAssignedToDropdownList = () => {
    CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
      if (response.data.statusCode == 1003) {
        setEmployees(response.data.data);
      }
    });
  };
  const getExpenseManagementApiList = (args) => {
    if(filter.limit <= 10){
      setLoading(true)
  }else{
      setLoading(false)  
  }
    setBtnLoading(true)
    ExpenseManagementApi.getExpenses(args)
      .then((response) => {
        setTimeout(() => {

          if (response.data.statusCode == 1003) {
            setgetData(response.data.data);
            setTotal(response.data.pagination.total)
            setBtnLoading(false)
            setLoading(false)
            setActivitydata(response.data.activity)
          }
        }, 400)
      })
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
    ExpenseManagementApi.getExpenses({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setgetData(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      ExpenseManagementApi.getExpenses({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setgetData(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }
  const innerBoxRef = useRef(null);

  const handleScroll = () => {
    const { current } = innerBoxRef;
    if (current) {
      const { scrollTop, scrollHeight, clientHeight } = current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // getCategory({...filter})
        if (total >= filter.limit) {
          setFilter({ ...filter, limit: filter.limit + 10, page: 1 })
          getExpenseManagementApiList({ ...filter, limit: filter.limit + 10, page: 1, });
        }


        // Reached the bottom of the inner box
        console.log('Reached end of inner box, calling a function...');
        // Call your function here
      }
    }
  };

  const activityHandleScroll = () => {
    const { current } = activityRef;
    if (current) {
      const { scrollTop, scrollHeight, clientHeight } = current;
      if (scrollTop + clientHeight >= scrollHeight) {
        if (activityTotal >= activityFilter.limit) {
          setActivityFilter({ ...activityFilter, limit: activityFilter.limit + 10, page: 1 })
          getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1, });
        }


        // Reached the bottom of the inner box
        console.log('Reached end of inner box, calling a function...');

      }
    }
  };
  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
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
              {total > 10 ?
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
          height: '40vh',
          overflow: 'auto',
          // padding: '16px',
          // '&::-webkit-scrollbar': {
          //     display: 'none',
          // },
        }}
          ref={innerBoxRef}
          onScroll={handleScroll}
        // onScroll={handleInnerBoxScroll}
        >
          {loading ? <>
            {[1, 2, 3, 4, 5].map((item, index) => (
              <Grid container key={index} mt={3} className={classes.descriptionBoxStyle}>
                <Grid item lg={4}>
                  <Skeleton animation="wave" width="200px" />
                  <Skeleton animation="wave" width="200px" />

                </Grid>
                <Grid item lg={4}>
                  <Skeleton animation="wave" width="100px" />
                  <Skeleton animation="wave" width="100px" />

                </Grid>
                <Grid item lg={2}>
                  <Skeleton animation="wave" width="30px" />


                </Grid>
                <Grid item lg={2}>
                  <Skeleton animation="wave" width="20px" />
                </Grid>
              </Grid>

            ))}
            {
              (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_expense_management_types" && item.is_allowed == true))) ?
                <Button addTitleBtn onClick={handleClickOpen}>Add Expense Type</Button> :
                <Button addTitleBtnDisable>Add Expense Type</Button>
            }
          </>
            :
            <>
              {getData.map((item, index) => (
                <Box className={classes.descriptionBoxStyle} key={index} mb={2}>
                  <Grid container alignItems="center">
                    <Grid item lg={4} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor > {item.name}</Text>
                      <Text greyLabel>{item.description ? item.description : "--"}</Text>
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
                      <Text mediumBlackColor > Assigned to </Text>
                      {
                        item.assignee_employee_ids.length > 2 ?
                          <>
                            <Text lightGrey3>{loading ? <Skeleton animation="wave" width="100px" /> : item.assignee_employee_ids.slice(0, 2).map(assignee => assignee.employee_name).join(", ")}
                              <BlackToolTip arrow title={
                                <Text mediumWhite sx={{ padding: '5px 12px !important' }}>
                                  {item.assignee_employee_ids.slice(2).map(assignee => (<div key={assignee.employee_name}>{assignee.employee_name}</div>))}</Text>
                              } placement="right">
                                <span style={{ color: '#0C75EB', fontSize: '11px', cursor: 'pointer', marginLeft: '6px' }}>+{item.assignee_employee_ids.length - 2} more</span>
                              </BlackToolTip>
                            </Text>
                          </>
                          :
                          <Text lightGrey3>{loading ? <Skeleton animation="wave" width="100px" /> : item.assignee_employee_ids.slice(0, 2).map(assignee => assignee.employee_name).join(", ")}</Text>
                      }
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor>Modified By</Text>
                      <Text greyLabel>{item.updated_by ? item.updated_by : "--"}</Text>
                    </Grid>
                    <Grid item lg={1} md={3} sm={3} xs={12} container alignItems={'center'}>
                      <ToggleSwitch switchChange={(e) => toggleChange(item, e)} isActive={item.is_active} sx={{ height: '24px !important' }} />
                    </Grid>
                    <Grid item lg={1} md={3} sm={3} xs={12} container alignItems={'center'} justifyContent={'center'}>

                      <CustomMenu
                        Icon={<MenuIcon />}
                        handleMenuClick={handleMenuClick}
                        anchorEl={anchorEl}
                        isOpen={Boolean(anchorEl)}
                        onClose={handleClose}
                        children={[{ color: 'black', label: "View", Click: () => handleViewClick(item) },
                        { color: '#0C75EB', label: "Edit", Click: () => handleEditClick(item) },
                        { color: 'red', label: "Delete", Click: () => handleDeleteClick(item) },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button addTitleBtn sx={{ width: '100%' }} onClick={handleClickOpen}>Add Expense Type</Button>
            </>
          }

        </Box>
        {alert ? <AlterBox handleDialogClose={handleDialogClose} open={open} handleDelete={handleDelete} /> :

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
                  <Text blackHeader1>Expense Type</Text>
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
                      labelText={'Name'}
                    />
                    {error.name ? <Text red>{error.name}</Text> : ""}
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>

                    <CustomSelect
                      commonSelect
                      label={'Status'}
                      options={options}
                      name='is_active'
                      value={state.is_active}
                      disabled={isEditable ? true : false}
                      onChange={handleInputChange}
                    />
                    {error.is_active ? <Text red>{error.is_active}</Text> : ""}
                  </Grid>
                  <Grid item container lg={12} md={12} sm={12} xs={12}>
                    <>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: isEditable ? `none` : `1px solid #C7CCD3`, backgroundColor: isEditable ? `#FAFAFA` : `none`, borderRadius: "8px", }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: "center", }}>
                          <Autocomplete
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={employees}
                            getOptionLabel={(option) => option.value}
                            name="assignee_employee_ids"
                            value={state.assignee_employee_ids}
                            disabled={isEditable}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={"Assign To"}
                                sx={{
                                  color: '#737373 !important',
                                  font: '12px Nunito Sans, sans-serif !important',
                                  fontWeight: `${400} !important`
                                }}
                              />
                            )}
                            onChange={(e, newValue) => handleChangeMembers(e, newValue)}
                            renderTags={(value, getTagProps) =>
                              value.map((option, keyId) => (
                                <Chip
                                  key={keyId}
                                  label={option && option.employee_name}
                                  sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                  onDelete={() => handleDeleteEmployee(keyId)}
                                  disabled={isEditable}
                                />
                              ))
                            }
                            sx={{
                              width: '100%',
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                              },
                              "& .MuiAutocomplete-endAdornment": {
                                display: "none"
                              },
                              "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
                                transform: "translate(10px, 28px) scale(1)",
                                color: '#737373 ',
                                font: '14px Nunito ',
                                fontWeight: `${400} `,
                              },
                              "& .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root": {
                                color: "#737373",
                                fontSize: "14px",
                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                fontWeight: 400,
                                paddingTop: '20px'
                              },
                              "&.Mui-focused .MuiInputLabel-outlined": {
                                color: "#737373",
                                fontSize: "16px",
                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                fontWeight: 400,
                              },
                              "&.MuiAutocomplete-root .MuiOutlinedInput-root": {
                                paddingTop: '30px'
                              },

                            }}
                          />
                        </div>
                      </Box>
                    </>
                    {
                      error.assignee_employee_ids ?
                        <Text red>{error.assignee_employee_ids ? error.assignee_employee_ids : ''}</Text> : ''
                    }
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Input
                      formControlProps={{
                        fullWidth: true
                      }}
                      multiline={true}
                      rows={3}
                      inputProps={{
                        name: 'description',
                        value: state.description,
                        type: 'text',
                        disabled: isEditable ? true : false,
                      }}
                      handleChange={handleInputChange}
                      descriptionFormControl
                      descriptionInput
                      labelText={'Description'}
                      placeholder={'Type Something'}
                    />
                    {error.description ? <Text red>{error.description}</Text> : ""}

                  </Grid>

                </Grid>
                <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                  {/* <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                  <Button saveExtraSmall onClick={handleSubmit}>{isEditable ? 'Edit' : 'Save'}</Button> */}
                  <Button cancelOutline onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  {/* {isEditable && (

                    <LoadingButton saveVerySmall loading={btnloading} onClick={() => handleEditClick(state)}>
                      Edit
                    </LoadingButton>
                  )}
                  {!isEditable && (
                    <LoadingButton saveVerySmall loading={btnloading} onClick={()=>handleSubmit()}>
                      {btnloading ? 'saving' : 'save'}
                    </LoadingButton>
                  )} */}
                  <LoadingButton saveExtraSmall loading={btnloading} onClick={() => handleSubmit()}>
                    {isEditable ? 'Edit' : 'Save'}
                  </LoadingButton>
                </Box>
              </Box>
            </DialogContent>
          </BootstrapDialog>}
      </Box>

      <Box className={classes.activeItemBox} mt={4} ref={recentSection}>

        <Box mb={3}>
          <Text RegularBlack1>Recent Activities</Text>
        </Box>
        <Box sx={{
          height: '40vh', overflowY: 'auto', '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
          ref={activityRef}
          onScroll={activityHandleScroll}>
          {activityData.length > 0 && activityData.length > 0 && activityData.map((value) => (
            <Box className={classes.descriptionBoxStyle} mb={2}>
              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                  <Text mediumBoldBlack2>{value.created_by}</Text>
                  <Text lightGrey3>{value.created_at}</Text>
                </Grid>
                <Grid item lg={8} md={8} sm={6} xs={12}>
                {/* <Text BrowmnMnStepperText>  */}
                {value.action_type_name === "update" ?
                    <Text BrowmnMnStepperText>{value.field_changes}</Text> : value.action_type_name === "store" ? <Text BrowmnMnStepperText>{value.created_by} stored the new expense type {value.referrable_name}</Text> : value.action_type_name === "delete" ? <Text BrowmnMnStepperText>{value.created_by} has deleted the expense type {value.referrable_name}</Text> : null
                  }
                  {/* <Text BrowmnMnStepperText>{value.field_changes}</Text> */}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Box>
      <Button addButton
        // scrollBtn
        sx={{
          position: 'fixed',
          bottom: 20,
          borderRadius: "30px !important",
          paddingLeft: "20px",
          paddingRight: "20px",

          // left: '50%',
          // transform: 'translateX(-50%)',
        }}
        onClick={scrollDown}
        endIcon={<ArrowDownwardRoundedIcon sx={{ width: "24px" }} />}>New Recent Activities
      </Button>
    </Box>
    // </Box>
  )
}

export default ExpenseType;
