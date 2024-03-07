import React, { useState, useRef, useEffect } from 'react'
import { Box, Grid, Stack, Autocomplete, TextField, Skeleton, Chip } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import Slide from "@mui/material/Slide";
import LocalStorage from '../../../../../utils/LocalStorage';
import { BlackToolTip, addErrorMsg, addSuccessMsg, addWarningMsg } from "../../../../../utils/utils";
import { isValid, validate_emptyField, validates_emptyArray, } from '../../../../../components/Validation';
import CommonApi from '../../../../../apis/CommonApi';
import CategoryApi from '../../../../../apis/configurations/employeeSelfService/CategoryApi';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Search from '../../../../../assets/svg/search1.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper ": {
    maxHeight: '698px',
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

const
  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
  });

export default function Category({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [alert, setAlert] = useState(false);
  const recentSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [dialogData, setDialogData] = useState([])
  const [newState, setNewState] = useState(false)
  const [state, setState] = useState({
    serial_no: '',
    id: '',
    name: '',
    created_by: '',
    updated_by: '',
    is_active: '',
    description: '',
    is_editable: '',
    assignee_employee_ids: [],
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setNewState(true);
    setOpen(true);
    setAlert(false);
    setState({
      serial_no: '',
      id: '',
      name: '',
      created_by: '',
      updated_by: '',
      is_active: '',
      description: '',
      is_editable: '',
      assignee_employee_ids: [],
    })
  };

  const handleDialogClose = () => {
    setOpen(false);
    setError({})
  };

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

  const [activityTotal, setActivityTotal] = useState()
  const innerBoxRef = useRef(null);
  const activityRef = useRef(null);

  const activityHandleScroll = () => {
    const { current } = activityRef;
    if (current) {
      const { scrollTop, scrollHeight, clientHeight } = current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // getCategory({...filter})
        if (activityTotal >= activityFilter.limit) {
          setActivityFilter({ ...activityFilter, limit: activityFilter.limit + 10, page: 1 })
          getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1, });
        }


        // Reached the bottom of the inner box
        console.log('Reached end of inner box, calling a function...');
      }
    }
  };


  const handleScroll = () => {
    const { current } = innerBoxRef;
    if (current) {
      const { scrollTop, scrollHeight, clientHeight } = current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // getCategory({...filter})
        if (total >= filter.limit) {
          setFilter({ ...filter, limit: filter.limit + 10, page: 1 })
          CategoryListing({ ...filter, limit: filter.limit + 10, page: 1, });
        }


        // Reached the bottom of the inner box
        console.log('Reached end of inner box, calling a function...');
      }
    }
  };

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
    CategoryApi.getCategoryListing({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setDialogData(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      CategoryApi.getCategoryListing({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setDialogData(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }




  const handleViewClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee_self_service_types" && item.is_allowed == true)))) {
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

  const handleEditClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee_self_service_types" && item.is_allowed == true)))) {
      setNewState(false);
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      setState(data);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  };

  const handleDeleteClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee_self_service_types" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(true)
      setState(data)
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const scrollDown = () => {
    window.scroll({
      top: recentSection.current.scrollIntoView(),
      behavior: 'smooth'
    })
  }

  const options = [
    { id: true, value: 'Active' },
    { id: false, value: 'Inactive' },
  ];

  useEffect(() => {
    getAssignedToDropdownList();
    CategoryListing(filter)
    getActivity(activityFilter)
    // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  const [activityData, setActivityData] = useState([])

  const getActivity = (args) => {
    setLoading(true)
    let id = 17;
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


  const CategoryListing = (args) => {
    setLoading(true);
    CategoryApi.getCategoryListing(args).then((response) => {
      setTimeout(() => {
        setLoading(false);
        if (response.data.statusCode == 1003) {
          setDialogData(response.data.data)
          setTotal(response.data.pagination.total)
          console.log(response.data.data, "response")
        }
      }, 400);
    })
  }

  const getAssignedToDropdownList = () => {
    CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
      if (response.data.statusCode == 1003) {
        setEmployees(response.data.data);
      }
    });
  };

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    }, handleValidate(e.target));
  }

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

  const handleValidate = (input) => {
    switch (input.name || input.tagName) {
      case 'name':
        error.name = validate_emptyField(input.value)
        break
      // case 'description':
      //   error.description = validate_emptyField(input.value)
      //   break
      case 'is_active':
        error.is_active = validate_emptyField(input.value)
        break;
      case 'assignee_employee_ids':
        console.log(input.name, "name")
        console.log(input.value, "value")
        error.assignee_employee_ids = validates_emptyArray(input.value)
        break;
      default:
        break
    }
    setError({ ...error })
  }

  const validateErrors = () => {
    let { name, assignee_employee_ids, is_active,
      // description 
    } = state
    let required = {};
    required.name = validate_emptyField(name);
    required.assignee_employee_ids = validates_emptyArray(assignee_employee_ids);
    required.is_active = validate_emptyField(is_active);
    // required.description = validate_emptyField(description);
    return required;
  }

  const handleSaveAndEdit = () => {
    if (isEditable) {
      setIsEditable(false)
    }
    else {
      let errors = validateErrors();
      if (isValid(errors)) {
        setBtnLoading(true)
        if (newState) {

          state['request_id'] = LocalStorage.uid();
          CategoryApi.storeCategory(state).then((response) => {
            setTimeout(() => {
              setBtnLoading(false)
              if (response.data.statusCode === 1003) {
                CategoryListing(filter)
                getActivity(activityFilter)
                addSuccessMsg('Added Successfully');
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
          CategoryApi.updateCategory(state).then((response) => {
            setTimeout(() => {
              setBtnLoading(false)
              if (response.data.statusCode === 1003) {
                CategoryListing(filter)
                getActivity(activityFilter)
                addSuccessMsg('Updated Successfully');
                setOpen(false)
                // getActivity()
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

  const toggleChange = (item, e) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee_self_service_types" && item.is_allowed == true)))) {
      const data = { request_id: LocalStorage.uid(), is_active: e.target.checked }
      CategoryApi.statusUpdateCategory(item.id, data).then((response) => {
        if (response.data.statusCode === 1003) {
          CategoryListing(filter)
          getActivity(activityFilter)
          addSuccessMsg('Status Updated Successfully');
        }
        else {
          addErrorMsg(response.data.message);
        }
      })
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleDelete = () => {
    state['request_id'] = LocalStorage.uid();
    CategoryApi.deleteCategory(state).then((response) => {
      if (response.data.statusCode === 1003) {
        CategoryListing(filter)
        getActivity(activityFilter)
        addSuccessMsg('Deleted Successfully');
      }
      else {
        addErrorMsg(response.data.message);
      }
    })
    setOpen(false);
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

  return (

    loading ?
      [1, 2, 3, 4, 5].map((item) => (
        <Stack className={classes.descriptionBoxStyle}>
          <Grid container alignItems="center">
            <Grid item lg={4} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
              <Skeleton variant="text" sx={{ width: "12rem" }} />
              <Skeleton variant="text" sx={{ width: "12rem" }} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
              <Skeleton variant="text" sx={{ width: "10rem" }} />
              <Skeleton variant="text" sx={{ width: "10rem" }} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
              <Skeleton variant="text" sx={{ width: "10rem" }} />
              <Skeleton variant="text" sx={{ width: "10rem" }} />
            </Grid>
            <Grid item lg={1} md={3} sm={3} xs={12} container gap={1}>
              <Skeleton variant="text" sx={{ width: "2rem" }} />
            </Grid>
            <Grid item container lg={1} md={3} sm={3} xs={12}>
              <Skeleton variant="text" sx={{ width: "2rem" }} />
            </Grid>
          </Grid>
        </Stack>
      )) :
      <>
        <Box sx={{
          height: '75vh', overflow: 'auto', padding: '16px', '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
          <Box className={classes.activeItemBox}>
            <Box className={classes.activeBoxHeading}>

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
            <>
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
                {dialogData.map((item, index) => (
                  <Box className={classes.descriptionBoxStyle} key={index}>
                    <Grid container alignItems="center">
                      <Grid item lg={4} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
                        <Text mediumBlackColor >{item.name}</Text>
                        <Text lightGrey3>{item.description ? item.description : "--"}</Text>
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
                      <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
                        <Text mediumBlackColor>Modified By</Text>
                        <Text lightGrey3>{item.updated_by ? item.updated_by : "--"}</Text>
                      </Grid>
                      <Grid item lg={1} md={3} sm={3} xs={12} container >
                        <ToggleSwitch switchChange={(e) => toggleChange(item, e)} isActive={item.is_active} sx={{ height: '24px !important' }} />
                      </Grid>
                      <Grid item container lg={1} md={3} sm={3} xs={12}>
                        <CustomMenu
                          anchorEl={anchorEl}
                          isOpen={Boolean(anchorEl)}
                          onClose={handleClose}
                          children={[
                            { color: '#171717', label: "View", Click: () => handleViewClick(item) },
                            { color: '#171717', label: "Edit", Click: () => handleEditClick(item) },
                            { color: '#171717', label: 'Delete', Click: () => handleDeleteClick(item) }
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
              {
                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee_self_service_types" && item.is_allowed == true))) ?
                  <Button addTitleBtn onClick={() => handleClickOpen()}>Add Employee Self Service</Button> :
                  <Button addTitleBtnDisable>Add Employee Self Service</Button>
              }
            </>
            {alert ? <AlterBox handleDialogClose={handleDialogClose} open={open} handleDelete={handleDelete} /> :
              <BootstrapDialog
                TransitionComponent={Transition}
                onClose={handleDialogClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"md"}
              >
                <DialogContent >
                  <Box padding={'38px 30px 35px 30px '}>
                    <Box mb={4}>
                      <Text blackHeader1>Add Self Service Category</Text>
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
                            disabled: isEditable,
                          }}
                          handleChange={handleChange}
                          clientInput
                          labelText={'Name'}
                        />
                        {
                          error.name ?
                            <Text red>{error.name ? error.name : ''}</Text> : ''
                        }
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <CustomSelect
                          commonSelect
                          label={'Status'}
                          options={options}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'is_active',
                            value: state.is_active,
                            disabled: isEditable,
                          }}
                          onChange={handleChange}
                        />
                        {
                          error.is_active ?
                            <Text red>{error.is_active ? error.is_active : ''}</Text> : ''
                        }
                      </Grid>
                      {/* <Grid item lg={6} md={6} sm={12} xs={12}> */}
                      {/* <CustomSelect
                      commonSelect
                      label={'Assigned To'}
                      name='assignee_employee_ids'
                      options={employees}
                      inputProps={{
                        disabled: isEditable,
                        value: state.assignee_employee_ids,
                      }}
                      multiple
                      onChange={handleChange}
                    ></CustomSelect> */}

                      {/* <Select
                      fullWidth
                      IconComponent={KeyboardArrowDownIcon}
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      label = "Assign To"
                      name={"employee_id"}
                      value={state.assignee_employee_ids}
                      onChange={handleChange}
                      disabled={isEditable}
                      sx={{
                        "& .Mui-disabled": {
                          backgroundColor: "#FAFAFA !important",
                          border: "none !important",
                        },
                        borderRadius: "8px !important",
                      }}
                      MenuProps={{ classes: { paper: selectClasses.height } }}
                    >
                      {
                        employees.map((val, key) => (
                          <MenuItem key={key} value={val.id}>{val.value}</MenuItem> //value={val.id} 
                        ))
                      }
                    </Select> */}

                      {/* </Grid> */}

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
                            disabled: isEditable,
                          }}
                          descriptionFormControl
                          descriptionInput
                          labelText={'Description'}
                          placeholder={'Type Something'}
                          handleChange={handleChange}
                        />
                        {
                          // error.description ?
                          //   <Text red>{error.description ? error.description : ''}</Text> : ''
                        }
                      </Grid>
                    </Grid>
                    <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                      <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                      <LoadingButton saveExtraSmall loading={btnLoading} onClick={() => handleSaveAndEdit()}>
                        {isEditable ? 'Edit' : 'Save'}
                      </LoadingButton>
                    </Box>
                  </Box>
                </DialogContent>
              </BootstrapDialog>}
          </Box>

          <Box className={classes.activeItemBox} mt={4} mb={6} ref={recentSection}>
        <Box mb={3}>
          <Text RegularBlack1>Recent Activities</Text>
        </Box>
        <Box sx={{
          height: '40vh', overflowY: 'auto',
          //  '&::-webkit-scrollbar': {
          //   display: 'none',
          // },
        }}
          ref={activityRef}
          onScroll={activityHandleScroll}>
          {loading ?
            <>
              {[1, 2, 3].map((item, index) => (
                <Grid container key={index} mt={3}>
                  <Grid item lg={8}>
                    <Skeleton animation="wave" width="200px" />
                    <Skeleton animation="wave" width="200px" />

                  </Grid>
                  <Grid item lg={3}>
                    <Skeleton animation="wave" width="200px" />
                    <Skeleton animation="wave" width="200px" />

                  </Grid>
                </Grid>
              ))}
            </> :
            <>
              {activityData.length > 0 && activityData.map((value) => (
                <Box className={classes.descriptionBoxStyle} mb={2}>
                  <Grid container spacing={6}>
                    <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                      <Text mediumBlackColor>{value.created_by}</Text>
                      <Text greyLabel>{value.created_at}</Text>
                    </Grid>
                    <Grid item lg={8} md={8} sm={6} xs={12} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                      {value.action_type_name === "update" ?
                        <Text BrowmnMnStepperText>{value.field_changes}</Text> : value.action_type_name === "store" ? <Text BrowmnMnStepperText>{value.created_by} stored {value.referrable_name}</Text> : value.action_type_name === "delete" ? <Text BrowmnMnStepperText>{value.created_by} has deleted {value.referrable_name}</Text> : null
                      }
                      {/* <Text BrowmnMnStepperText>{value.field_changes === '[]' ? '' : value.field_changes}</Text> */}
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </>
          }
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
            endIcon={<ArrowDownwardRoundedIcon sx={{ width: "24px" }} />}>New Recent Activities</Button>
        </Box >
      </>
  )
}
