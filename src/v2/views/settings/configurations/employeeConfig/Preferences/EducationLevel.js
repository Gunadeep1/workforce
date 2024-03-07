import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Skeleton, Slide } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu';
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import { styled } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import Button from '../../../../../components/customButton/Button';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import { isValid, validate_emptyField, } from "../../../../../components/Validation";
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import EducationalLevelApi from '../../../../../apis/configurations/employee/EducationalLevelApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../../utils/utils';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Search from '../../../../../assets/svg/search1.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper ": {
    height: '410px',
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
export default function EducationLevel({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const recentSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState({});
  const [getData, setGetData] = useState([]);
  const statusList = require('../../../../../utils/jsons/Status.json');
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    serial_no: '',
    id: '',
    name: '',
    is_active: '',
    description: '',
  });
  
  useEffect(() => {
    setTimeout(() => {
      EducationalLevelListing(filter)
      getActivity(activityFilter)
    }, 300)// eslint-disable-next-line
  }, [])

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
          EducationalLevelListing({ ...filter, limit: filter.limit + 10, page: 1, });
        }


        // Reached the bottom of the inner box
        console.log('Reached end of inner box, calling a function...');
        // Call your function here
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
    EducationalLevelApi.getEducationalLevelListing({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setGetData(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      EducationalLevelApi.getEducationalLevelListing({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setGetData(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }
  const getActivity = (args) => {
    if (activityFilter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    let id = 3;
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
      case "is_active":
        err.is_active = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    setError(err);
  }

  const validateAll = () => {
    let { name, is_active, } = state;
    let errors = {};
    errors.name = validate_emptyField(name);

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
    // getEducationalLevelIndex(data.id)
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
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
    // getEducationalLevelIndex(data.id)
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
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
    deleteEducationLevel(val.id)
    setOpen(false);
  }


  const handleSaveAndEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      if (state.id != "") {
        updateEducationLevel(state.id)
      } else {
        storeEducationLevel(state)
        handleSubmit()
      }
    }
  }

  const [val, setVal] = useState()
  const handleDeleteClick = (args) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
      setVal(args)
      setOpen(true);
      setAlert(true);
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
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
      state['is_active'] = event.target.checked
      setState(state);
      updateStatus(items);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }
  const EducationalLevelListing = (args) => {
    if (filter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    EducationalLevelApi.getEducationalLevelListing(args).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          setGetData(response.data.data);
          setTotal(response.data.pagination.total)
        }
      }, 300)

    });
  };

  const storeEducationLevel = (data) => {
    data.request_id = LocalStorage.uid()
    setLoading(true)
    EducationalLevelApi.storeEducationLevel(data).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          EducationalLevelListing(filter)
          getActivity(activityFilter)
          handleDialogClose();
          addSuccessMsg(response.data.message);
        }
      }, 600)

    });
  };
  const updateStatus = (args) => {
    let data = {
      request_id: LocalStorage.uid(),
      is_active: state.is_active
    }
    EducationalLevelApi.updateEducationLevelStatus(data, args.id).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(response.data.message);
        EducationalLevelListing(filter)
        getActivity(activityFilter)
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  // const getEducationalLevelIndex = (id) => {
  //   EducationalLevelApi.getEducationalLevelIndex(
  //     id
  //   ).then((response) => {
  //     setTimeout(() => {
  //       if (response.data.statusCode == 1003) {
  //         setState(response.data.data)
  //       } else {
  //         addErrorMsg(response.data.message);
  //       }
  //     }, 400)
  //   });
  // }
  const updateEducationLevel = (dataId) => {
    let data = { ...state, request_id: LocalStorage.uid() };

    setLoading(true)
    EducationalLevelApi.updateEducationaLevel(data, dataId).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          EducationalLevelListing(filter)
          getActivity(activityFilter)
          handleDialogClose();
          addSuccessMsg(response.data.message);
        } else {
          handleDialogClose();
          addErrorMsg(response.data.message);
        }
      }, 600)

    });
  };
  const deleteEducationLevel = (dataId) => {
    let data = { request_id: LocalStorage.uid() };
    EducationalLevelApi.deleteEducationLevel(data, dataId).then((response) => {
      if (response.data.statusCode == 1003) {
        EducationalLevelListing(filter)
        getActivity(activityFilter)
        addSuccessMsg(response.data.message);
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
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
            {
              (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true))) ?
                <Button addTitleBtn onClick={() => handleClickOpen()}>Add Education Level</Button> :
                <Button addTitleBtnDisable>Add Education Level</Button>
            }
          </>
            :
            <>
              {getData.map((item, index) => (
                <Box className={classes.descriptionBoxStyle} key={index}>
                  <Grid container alignItems="center">
                    <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor >{item.name}</Text>
                      <Text greyLabel>{item.description ? item.description : "--"}</Text>
                    </Grid>

                    <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor>Created By</Text>
                      <Text greyLabel>{item.created_by}</Text>
                    </Grid>
                    <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                      <ToggleSwitch name='is_active' isActive={item.is_active} switchChange={(e) => handleStatus(e, item)} sx={{ height: '24px !important' }} />
                    </Grid>
                    <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'} justifyContent={'center'}>

                      <CustomMenu
                        Icon={<MenuIcon />}
                        handleMenuClick={handleMenuClick}
                        anchorEl={anchorEl}
                        isOpen={Boolean(anchorEl)}
                        onClose={handleClose}
                        children={[{ color: 'black', label: "View", Click: () => handleViewClick(item) },
                        { color: 'black', label: "Edit", Click: () => handleEditClick(item) },
                        { color: 'black', label: "Delete", Click: () => handleDeleteClick(item) },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button addTitleBtn sx={{ width: '100%' }} onClick={() => handleClickOpen()}>Add Education Level</Button>

            </>
          }
        </Box>

        {alert ? <AlterBox handleDialogClose={handleDialogClose} open={open} handleDelete={handleDelete} /> : <BootstrapDialog
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
                <Text mediumViewAmt>Education</Text>
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
                      }}
                      handleChange={handleChange}
                      clientInput
                      labelText={'Education Name'}
                    />
                    <Text sx={{ marginLeft: '12px !important' }} errorText> {error.name ? error.name : ""}</Text>
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
                {/* <Button popupSaveBlue onClick={handleSaveAndEdit}>{isEditable ? 'Edit' : 'Save'}</Button> */}
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
              {activityData.map((value) => (
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
