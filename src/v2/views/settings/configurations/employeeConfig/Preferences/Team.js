import React, { useState, useRef, useEffect } from 'react'
import { Box, Grid, Skeleton, Slide } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import { isValid, validate_emptyField, } from "../../../../../components/Validation";
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import TeamApi from '../../../../../apis/configurations/employee/TeamApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Search from '../../../../../assets/svg/search1.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper ": {
    maxHeight: '585px !important',
    maxWidth: '692px !important',
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
function Team({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const recentSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState({});
  const [getData, setGetData] = useState([]);
  const [drop, setDrop] = useState([])
  const [loading, setLoading] = useState(true);
  const innerBoxRef = useRef(null);
  const statusList = require('../../../../../utils/jsons/Status.json');
  const activityRef = useRef(null);
  const [activityFilter, setActivityFilter] = useState({
    limit: 10,
    page: 1,
  })
  const [activityTotal, setActivityTotal] = useState()
  const [state, setState] = useState({
    serial_no: '',
    id: '',
    name: '',
    department_id: '',
    department_name: '',
    createdBy: '',
    modifiedBy: '',
    is_active: '',
    description: '',
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: "",
  });
  const [total, setTotal] = useState()

  useEffect(() => {
    setTimeout(() => {
      getEmployeeTeam(filter)
      getDepartmentDropdown()
      getActivity(activityFilter)
    }, 300)
    // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  const [activityData, setActivityData] = useState([])

  const getActivity = (args) => {
    setLoading(true)
    let id = 4;
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


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
    handleValidations(e);
  };

  const handleValidations = (e) => {
    let input = e.target;
    let err = error;
    switch (input.name || input.tagName) {
      case "name":
        err.name = validate_emptyField(input.value);
        break;
      case "department_id":
        err.department_id = validate_emptyField(input.value);
        break;

      case "is_active":
        err.is_active = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    setError(err);
  }

  const validateAll = () => {
    let { name, department_id,
      is_active } = state;
    let errors = {};
    errors.name = validate_emptyField(name);
    errors.department_id = validate_emptyField(department_id);
    errors.is_active = validate_emptyField(is_active);
    return errors;

  };

  const handleSubmit = () => {
    let errors = validateAll();
    if (isValid(errors)) {


    } else {
      console.log(errors);
      setError(errors);
      setLoading(false)
    }
  }


  const handleClickOpen = () => {
    setOpen(true);
    setAlert(false);
    setState({
      serial_no: '',
      id: '',
      name: '',
      department_id: '',
      department_name: '',
      createdBy: '',
      modifiedBy: '',
      is_active: '',
      description: '',
    })

  };

  const handleDialogClose = () => {
    setOpen(false);
    if (isEditable) {
      setIsEditable(isEditable)
    }
    setIsEditable(false);
    setError({})
  };

  const handleEditClick = (data) => {
    // getTeamIndex(data.id)
    if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      setState({
        ...data,
        is_active: true ? '1' : '0'
      });
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  };

  const handleViewClick = (data) => {
    // getTeamIndex(data.id)
    if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(true);
      setState({
        ...data,
        is_active: true ? '1' : '0'
      });
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleDelete = () => {
    deleteTeam(val.id);
    setOpen(false);
  }


  const handleSaveAndEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      if (state.id != "") {
        updateTeam(state.id)
      } else {
        storeEmployeeTeam(state)
        handleSubmit()
      }


    }

  }
  const [val, setVal] = useState()

  const handleDeleteClick = (args) => {
    if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true))) {
      setVal(args)
      setOpen(true);
      setAlert(true)
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

  const handleStatus = (event, items) => {
    state['is_active'] = event.target.checked
    setState(state);
    updateStatus(items)
  }
  //1.listing
  const getEmployeeTeam = (args) => {
    setLoading(true)
    TeamApi.getTeamsListing(args).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          setGetData(response.data.data);
          setTotal(response.data.pagination.total)
        }
      }, 300)

    });
  };
  //2.departmentDropdown
  const getDepartmentDropdown = () => {
    // setLoading(true)
    TeamApi.getDepartmentTypeDropDown().then((response) => {
      if (response.data.statusCode == 1003) {
        setDrop(response.data.data)
      }
    });
  };
  //3.adding new team
  const storeEmployeeTeam = (data) => {
    data.request_id = LocalStorage.uid()
    setLoading(true)
    TeamApi.postEmployeeTeams(data).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          getEmployeeTeam(filter)
          getActivity(activityFilter)
          handleDialogClose();
          addSuccessMsg(response.data.message);
        }
      }, 600)

    });
  };
  //4.Update Status
  const updateStatus = (args) => {
    let data = {
      request_id: LocalStorage.uid(),
      is_active: state.is_active
    }
    TeamApi.updateTeamStatus(data, args.id).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(response.data.message);
        getEmployeeTeam(filter)
        getActivity(activityFilter)
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  //5.index
  // const getTeamIndex = (id) => {
  //   TeamApi.getTeamIndex(
  //     id
  //   ).then((response) => {
  //     setTimeout(() => {
  //       // setLoading(false)
  //       if (response.data.statusCode == 1003) {
  //         setState(response.data.data)
  //       } else {
  //         addErrorMsg(response.data.message);
  //       }
  //     }, 400)
  //   });
  // }
  //6.UpdateTeam
  const updateTeam = (dataId) => {
    let data = { ...state, request_id: LocalStorage.uid() };

    setLoading(true)
    TeamApi.updateEmployeeTeam(data, dataId).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          getEmployeeTeam(filter)
          handleDialogClose();
          getActivity(activityFilter)
          addSuccessMsg(response.data.message);
        } else {
          handleDialogClose();
          addErrorMsg(response.data.message);
        }

      }, 300)


    });
  };
  //7.Delete
  const deleteTeam = (dataId) => {
    let data = { request_id: LocalStorage.uid() };
    TeamApi.deleteEmployeeTeam(data, dataId).then((response) => {
      if (response.data.statusCode == 1003) {
        getEmployeeTeam(filter)
        getActivity(activityFilter)
        addSuccessMsg(response.data.message);
      } else {
        addErrorMsg(response.data.message);
      }
    });
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
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      TeamApi.getTeamsListing({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setGetData(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }
  const searchAPICall = (text) => {
    TeamApi.getTeamsListing({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setGetData(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const handleScroll = () => {
    const { current } = innerBoxRef;
    if (current) {
      const { scrollTop, scrollHeight, clientHeight } = current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // getCategory({...filter})
        if (total >= filter.limit) {
          setFilter({ ...filter, limit: filter.limit + 10, page: 1 })
          getEmployeeTeam({ ...filter, limit: filter.limit + 10, page: 1, });
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
  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
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

          {
            loading ? <>
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



            </>
              :
              <>
                {getData.map((items, index) => (
                  <Box className={classes.descriptionBoxStyle} key={index}>
                    <Grid container alignItems="center">
                      <Grid item lg={4} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                        <Text mediumBlackColor > {items.name}</Text>
                        <Text greyLabel>{items.description ? items.description : "--"}</Text>
                      </Grid>
                      <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                        <Text mediumBlackColor > Department</Text>
                        <Text greyLabel>{items.department_name}</Text>
                      </Grid>
                      <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                        <Text mediumBlackColor>Created By</Text>
                        <Text greyLabel>{items.created_by}</Text>
                      </Grid>
                      <Grid item lg={1} md={2} sm={2} xs={2} container alignItems={'center'}>
                        <ToggleSwitch name='is_active' isActive={items.is_active} switchChange={(e) => handleStatus(e, items)} sx={{ height: '24px !important' }} />
                      </Grid>
                      <Grid item lg={1} md={2} sm={2} xs={2} container alignItems={'center'} justifyContent={'center'}>
                        <CustomMenu
                          Icon={<MenuIcon />}
                          handleMenuClick={handleMenuClick}
                          anchorEl={anchorEl}
                          isOpen={Boolean(anchorEl)}
                          onClose={handleClose}
                          children={[{ color: 'black', label: "View", Click: () => handleViewClick(items) },
                          { color: 'black', label: "Edit", Click: () => handleEditClick(items) },
                          { color: 'black', label: "Delete", Click: () => handleDeleteClick(items) },
                          ]}
                        />

                      </Grid>
                    </Grid>
                  </Box>

                ))}
                {
                  (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true))) ?
                    <Button addTitleBtn onClick={() => handleClickOpen()}>Add Team</Button> :
                    <Button addTitleBtnDisable>Add Team</Button>
                }
              </>
          }

        </Box>


        {alert ? <AlterBox handleDialogClose={handleDialogClose} open={open} handleDelete={handleDelete} /> :
          <BootstrapDialog
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth={"md"}
          >
            <DialogContent >

              <Box padding={'38px 30px 35px 30px '}>
                <Box mb={4}>
                  <Text mediumViewAmt>Team</Text>
                </Box>
                <Grid container columnSpacing={'32px'}>
                  <Grid item lg={6} md={6} sm={6} xs={12} >
                    <Box sx={{ height: '86px !important' }}>

                      <Input
                        formControlProps={{
                          fullWidth: true
                        }}

                        inputProps={{
                          name: 'name',
                          value: state.name,
                          type: 'text',
                          disabled: isEditable,
                          inputProps: { maxLength: 20 }
                        }}
                        handleChange={handleChange}
                        clientInput
                        labelText={'Team Name'}
                      />
                      <Text sx={{ marginLeft: '12px !important' }} errorText> {error.name ? error.name : ""}</Text>
                    </Box>


                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>

                    <Box sx={{ height: '86px !important' }}>

                      <CustomSelect
                        commonSelect
                        label={'Department Type'}
                        options={drop}
                        name='department_id'
                        value={state.department_id}
                        disabled={isEditable}
                        onChange={handleChange}
                      ></CustomSelect>
                      <Text sx={{ marginLeft: '12px !important' }} errorText> {error.department_id ? error.department_id : ""}</Text>
                    </Box>



                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Box sx={{ height: '86px !important' }}>
                      <CustomSelect name='is_active'
                        value={state.is_active}
                        commonSelect
                        onChange={handleChange}
                        label={<Text largeLabel>Status</Text>}
                        options={statusList}
                        disabled={isEditable} />
                      <Text sx={{ marginLeft: '12px !important' }} errorText> {error.is_active ? error.is_active : ""}</Text>
                    </Box>

                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '151px !important' }}>
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
                          inputProps: { maxLength: 100 }
                        }}
                        handleChange={handleChange}
                        descriptionFormControl
                        descriptionInput
                        labelText={'Description'}
                        placeholder={'Type Something'}
                      />
                    </Box>

                  </Grid>

                </Grid>
                <Box display={'flex'} justifyContent={'end'} gap={'20px'}>
                  <Button popupCancel1 onClick={handleDialogClose} >Cancel</Button>
                  <LoadingButton popupSaveBlue loading={loading} onClick={() => handleSaveAndEdit()}>
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
                      {value.action_type_name === "store" ?
                        <Text BrowmnMnStepperText>
                          {value.referrable_name === null ? 'A new team' : value.referrable_name} has been created </Text> :
                        <Text BrowmnMnStepperText>{value.field_changes === '[]' ? '' : value.field_changes}</Text>
                      }
                    </Grid>
                  </Grid>
                </Box>
              ))}</>
          }
        </Box>
      </Box>
      <Button addButton
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

  )
}

export default Team;
