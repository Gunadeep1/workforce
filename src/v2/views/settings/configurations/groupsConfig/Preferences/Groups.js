import React, { useEffect, useRef, useState } from 'react'
import { Autocomplete, Box, Chip, Grid, TextField, Skeleton, Slide, } from '@mui/material'
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
import { isValid, validate_charWithSpace, validate_emptyField } from '../../../../../components/Validation';
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import GroupApi from '../../../../../apis/configurations/groups/GroupApi';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';


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
function Groups({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState({});
  const [employee, setEmployee] = useState([]);
  const [getData, setGetData] = useState([])
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);

  const [state, setState] = useState({
    id: '',
    name: "",
    is_active: "",
    members: []
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(true)
      apiGroupsDropdown()
      getApprovalDropdownList();
      getActivity(activityFilter)
    }, 500)

    // eslint-disable-next-line
  }, [])
  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const getApprovalDropdownList = () => {
    CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
      if (response.data.statusCode == 1003) {
        setEmployee(response.data.data)
      }
    });
  };

  const [activityFilter, setActivityFilter] = useState({
    limit: 10,
    page: 1,
  })

  const [activityTotal, setActivityTotal] = useState()
  const activityRef = useRef(null);
  const [activityData, setActivityData] = useState([])
  const recentSection = useRef(null);

  const scrollDown = () => {

    window.scroll({
      top: recentSection.current.scrollIntoView(),
      behavior: 'smooth'
    })
  }

  const getActivity = (args) => {
    // setLoading(true)
    let id = 37;
    ConfigApi.getActivity(id, "", args).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          // setLoading(false)
          setActivityData(response.data.data);
          setActivityTotal(response.data.pagination.total)
        }
      }, 300)

    });
  };

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

 

  const apiGroupsDropdown = () => {
    GroupApi.getGroupsDropdown(
      LocalStorage.uid(), LocalStorage.getAccessToken(),
    ).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          setLoading(false)
          setGetData(response.data.data)

        }
      }, 400)

    });
  }


  const apiGroupMembers = (id) => {

    GroupApi.getGroupMembers(
      LocalStorage.uid(), id, LocalStorage.getAccessToken(),
    ).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode === 1003) {
          if (response.data.data) {
            setState((prev) => ({ ...prev, members: response.data.data.members }));
          } else {
            setState((prev) => ({ ...prev, members: [] }));
          }
        }
      }, 200);
    });
  };

  const validateAll = () => {
    let { name, is_active, members } = state;
    let errors = {};
    errors.name = validate_emptyField(name);
    errors.members = validate_emptyField(members)
    errors.is_active = validate_emptyField(is_active)
    console.log(errors, "erorrs")
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = validateAll();
    if (isValid(errors)) {
      console.log(id, "iddd")
      console.log(action, "action")
      if (action == 'edit') {
        const data = {
          request_id: LocalStorage.uid(),
          id: id,
          name: state.name,
          description: state.description,
          is_active: state.is_active,
        }
        apiUpdateGroup(data)
      } else {

        apiCreateGroup()
      }
    } else {
      //   let s1 = { error };
      //   s1 = errors;
      //   setError(s1);
    }
  }

  // Create Group
  const apiCreateGroup = () => {
    setBtnLoading(true)
    setLoading(true)
    let data = {
      request_id: LocalStorage.uid(),
      name: state.name,
      is_active: true,
      members: []
    };
    state.members.forEach((member) => {
      data.members.push({ id: member.id })
    })

    if (data.name == '' || data.members.length == 0) {

      let nameMsg = '';
      let membersMsg = '';
      if (data.name == '') {
        nameMsg = 'Group Name is required.';
      }
      if (data.members.length == 0) {
        membersMsg = 'Please Add Group Members.'
      }
      setState((prev) => ({ ...prev, errors: { name: nameMsg, members: membersMsg } }))

    } else {

      GroupApi.addGroup(data, LocalStorage.getAccessToken()).then((response) => {
        setTimeout(() => {
          setBtnLoading(false)
          setLoading(false)
          if (response.data.statusCode == 1003) {

            addSuccessMsg(state.name + ' ' + response.data.message);
            apiGroupsDropdown()
            setOpen(false)
            getActivity(activityFilter)
            setState({ ...state, name: '', is_active: '', members: [] })
          } else {
            addErrorMsg(response.data.message)
            setOpen(false)
          }
        }, 300)

      });
    }

  }


  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleClickOpen = () => {
    setOpen(true);
    setAction("Add")
  };
  const handleDialogClose = () => {
    setOpen(false);
    setIsEditable(false);
    setState({
      id: '',
      name: "",
      is_active: "",
      members: []
    })
    setError({})
    setState({ ...state, id: '', name: '', is_active: '', members: [] })
  };

  const [action, setAction] = useState('');;

  const handleViewClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_group" && item.is_allowed == true)))) {
      setOpen(true);
      setIsEditable(true);
      let newObj = { members: [], id: data.id, name: data.value, is_active: data.is_active, }
      setState(newObj)
      setAction("edit")
      apiGroupMembers(data.id);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleEditClick = (args, membersBox, group) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_group" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(false);
      setAnchorEl(null);
      setIsEditable(false);
      setAction("edit")
      if (args && args.id) {
        setId(args.id);
        console.log(getData, "get");
        let groupobj = getData.filter(obj => obj.id === args.id);

        if (groupobj) {
          groupobj.id = args.id;
        }
        let newObj = { members: [], id: membersBox ? groupobj.id : args.id, name: membersBox ? groupobj.value : args.value, is_active: membersBox ? groupobj.is_active : args.is_active }
        // setState((prev) => ({ ...prev, ...newObj }))
        console.log(newObj, "newobj")
        setState({ ...newObj })
        console.log(state, "editstate")

        apiGroupMembers(membersBox ? groupobj.id : args.id);
      }
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  };

  const apiUpdateGroupStatus = (e, value, item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_group" && item.is_allowed == true)))) {
      setName(item.value)
      let data = {
        request_id: LocalStorage.uid(),
        id: item.id,
        is_active: value
      }
      updateStatusGroup(data);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const updateStatusGroup = (args) => {
    setLoading(true)
    let data = {
      request_id: LocalStorage.uid(),
      is_active: args.is_active
    }
    const id = args.id
    GroupApi.updateStatusGroup(id, data).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(`${name} status updated successfully`);
        apiGroupsDropdown()
        getActivity(activityFilter)
        setTimeout(() => {
          setLoading(false)
        }, 500)

      } else {
        addErrorMsg(response.data.message)
      }


    });
  }

  const apiUpdateGroup = (args) => {
    setLoading(true)
    setBtnLoading(true)
    console.log(state, "upadtestatee");
    let data = {
      request_id: LocalStorage.uid(),
      id: state.id,
      name: state.name,
      is_active: state.is_active,
      members: [] // Initialize members as an empty array
    };
    console.log(state.members, "memmmmbers");
    state.members.forEach((member) => {
      data.members.push({ id: member.id });
    });

    GroupApi.updateGroup(state.id, data).then((response) => {
      setTimeout(() => {
        setLoading(false);
        setBtnLoading(false)
        if (response.data.statusCode == 1003) {
          addSuccessMsg(state.name + ' ' + response.data.message);
          apiGroupsDropdown();
          getActivity(activityFilter)
          setOpen(false);
          setState({ ...state, name: '', is_active: '', members: [] })
        } else {
          addErrorMsg(response.data.message);
          setOpen(false);
          // console.log(data, "  Create Group");
        }
      }, 300);
    });
  };


  const [name, setName] = useState('');
  const [alert, setAlert] = useState(false);// eslint-disable-next-line
  const [deleteid, setDeleteid] = useState(null);
  const [id, setId] = useState("");

  const handleDeleteClick = (item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_group" && item.is_allowed == true)))) {
      setName(item.value)
      setState(state)
      setOpen(true);
      setAlert(true)
      setDeleteid(item.id);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

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
      case 'is_active':
        updatedErrors.is_active = validate_emptyField(input.value)
        break
      case 'members':
        updatedErrors.members = validate_emptyField(input.value)
        break
      default:
        break
    }
    setError(updatedErrors)
  }


  const handleChangeMembers = (e, index) => {
    let { id, value } = employee[e.target.getAttribute('data-option-index')];
    let members = state.members;
    if (!Array.isArray(members)) {
      console.error("state.members is not an array");
      return;
    }
    let errors = error
    let membersArr = [...members];
    if (Array.isArray(membersArr) && membersArr.filter((i) => i.id === id).length === 0) {
      membersArr.push({ id: id, full_name: value });
      if (membersArr.length == 0) {
        errors.members = 'Please Add Group Members'
      } else {
        errors.members = '';
      }
      console.log(errors, "errorss")
      setState({ ...state, members: membersArr });
    }
  };



  const [deletedchips, setDeletedchips] = useState([]);

  const handleDeleteEmployee = (key, index) => {
    let members = state.members;
    let newArr = members
    let deletedChipsArr = deletedchips;
    if (newArr[key].id !== '') {
      deletedChipsArr.push(newArr[index]);
    }
    newArr.splice(key, 1);
    setState({ ...state, members })

    setDeletedchips([...deletedChipsArr]);

  }

  const handleDelete = (id) => {
    let data = {
      request_id: LocalStorage.uid(),

    }

    GroupApi.deleteGroup(data, deleteid, LocalStorage.getAccessToken()).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          addSuccessMsg(`${name} Deleted Successfully`)
          apiGroupsDropdown()
          setOpen(false);
          setAlert(false)
          getActivity(activityFilter)
        } else {
          addErrorMsg(response.data.message)
          setAlert(false)
        }
      }, 300)
      setOpen(false);
    });
  }




  const options = [
    { id: true, value: 'Active' },
    { id: false, value: 'Inactive' },
  ];

  console.log(state, "statttteeee")
  return (
    <>
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
    }}>
      <Box className={classes.activeItemBox}>
        <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
        {loading ? <>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Grid container key={index} mt={3} className={classes.descriptionBoxStyle}>
              <Grid item lg={6}>
                <Skeleton animation="wave" width="300px" />


              </Grid>

              <Grid item lg={2}>
                <Skeleton animation="wave" width="60px" height='20px' />


              </Grid>
              <Grid item lg={2}>
                <Skeleton animation="wave" width="20px" />
              </Grid>
            </Grid>

          ))}
        </>
          :
          <>
            {getData.map((item, index) => (
              <Box className={classes.descriptionBoxStyle} key={index} mb={2}>
                <Grid container alignItems="center">
                  <Grid item lg={10} md={10} sm={10} xs={12} container direction={'column'} gap={1}>
                    <Text mediumBlackColor > {item.value}</Text>
                  </Grid>
                  <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                    {/* <Box> //onChange={(e, value) => apiUpdateGroupStatus(value, cellValues)}</Box> */}
                    <ToggleSwitch isActive={item.is_active} switchChange={(e, value) => apiUpdateGroupStatus(e, value, item)} sx={{ height: '24px !important' }} />
                  </Grid>
                  <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'} justifyContent={'center'}>
                    <CustomMenu
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
            {
              (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_group" && item.is_allowed == true))) ?
                <Button addTitleBtn onClick={() => handleClickOpen()}>Add New</Button> :
                <Button addTitleBtnDisable>Add New</Button>
            }
          </>
        }
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
                  <Text blackHeader1>Groups</Text>
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
                      clientInput
                      handleChange={handleInputChange}
                      labelText={'Group Name'}
                    />
                    <Text red>{error.name ? error.name : ''}</Text>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <CustomSelect
                      name={'is_active'}
                      value={state.is_active}
                      onChange={handleInputChange}
                      label='Status'
                      options={options}
                      commonSelect
                      disabled={isEditable}
                    />
                    <Text red>{error.is_active ? error.is_active : ''}</Text>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    {console.log(state, "mem")}
                    <>

                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                        <div style={{ width: '100%', minHeight: '69px', display: 'flex', alignItems: "center", }}>
                          <Autocomplete
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={employee}
                            getOptionLabel={(option) => option.value}
                            value={state.members}
                            disabled={isEditable}
                            renderInput={(params) => (
                              <TextField {...params} label={`Group Members`} pt={2} />
                            )}
                            onChange={(e, newValue) => handleChangeMembers(e, newValue.length)}
                            renderTags={(value, getTagProps) =>
                              value.map((option, key) => (
                                <Chip
                                  key={key}
                                  label={option && option.full_name}
                                  sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                  onDelete={() => handleDeleteEmployee(key,)}
                                  disabled={isEditable}
                                // deleteIcon={<DeleteIcon />}
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
                              },
                            }}
                          />
                        </div>
                      </Box>


                    </>
                    <Text red>{error.members ? error.members : ''}</Text>

                    {/* {state.groupMembers.map((i, key) => (
                   
                  ))} */}
                  </Grid>

                </Grid>
                <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                  <Button cancelOutline onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  {isEditable && (
                    <Button saveVerySmall onClick={() => handleEditClick()}>
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
          </BootstrapDialog>
        }
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
                        <Text BrowmnMnStepperText>{value.field_changes}</Text> : value.action_type_name === "store" ? <Text BrowmnMnStepperText>{value.created_by} stored a new group</Text> : value.action_type_name === "delete" ? <Text BrowmnMnStepperText>{value.created_by} has deleted a group</Text> : null
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


        }}
        onClick={scrollDown}
        endIcon={<ArrowDownwardRoundedIcon sx={{ width: "24px" }} />}>New Recent Activities</Button>
    </Box>
    </>
  )
}

export default Groups;
