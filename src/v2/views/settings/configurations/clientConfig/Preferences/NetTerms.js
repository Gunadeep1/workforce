import React, { useState, useRef, useEffect } from 'react'
import { Box, Grid, Skeleton, Stack, } from '@mui/material'
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
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import Slide from "@mui/material/Slide";
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import LocalStorage from '../../../../../utils/LocalStorage';
import NetTermsApi from '../../../../../apis/configurations/clients/NetTermsApi';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from "../../../../../utils/utils";
import { isValid, validate_emptyField, validates_Integer, } from '../../../../../components/Validation';
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

export default function InvoiceTemplate({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const options = [
    { id: true, value: 'Active' },
    { id: false, value: 'Inactive' },
  ];
  const classes = MainStyles()
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [alert, setAlert] = useState(false);
  const recentSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [newState, setNewState] = useState(false)
  const [dialogData, setDialogData] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [state, setState] = useState({
    serial_no: '',
    id: '',
    days: '',
    created_by: '',
    updated_by: '',
    is_active: '',
    description: '',
    is_editable: '',
  });

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: "",
  });

  const [total, setTotal] = useState()

  const innerBoxRef = useRef(null);
  const activityRef = useRef(null);

  const handleScroll = () => {
    const { current } = innerBoxRef;
    if (current) {
      const { scrollTop, scrollHeight, clientHeight } = current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // getCategory({...filter})
        if (total >= filter.limit) {
          setFilter({ ...filter, limit: filter.limit + 10, page: 1 })
          NetTermsListing({ ...filter, limit: filter.limit + 10, page: 1, });
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
    NetTermsApi.getNetTermsListing({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setDialogData(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      NetTermsApi.getNetTermsListing({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setDialogData(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }

  const [activityTotal, setActivityTotal] = useState()

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
      days: '',
      created_by: '',
      updated_by: '',
      is_active: '',
      description: '',
      is_editable: '',
    })
  };

  const handleDialogClose = () => {
    setOpen(false);
    setError({})
  };

  const handleViewClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_client" && item.is_allowed == true)))) {
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
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_client" && item.is_allowed == true)))) {
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
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_client" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(true);
      setState(data);
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
  const [activityFilter, setActivityFilter] = useState({
    limit: 10,
    page: 1,
  })
  useEffect(() => {
    NetTermsListing(filter);
    getActivity(activityFilter) // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  const [activityData, setActivityData] = useState([])

  const getActivity = (args) => {
    if (activityFilter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    let id = 18;
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

  const NetTermsListing = (args) => {
    if (filter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    NetTermsApi.getNetTermsListing(args).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          setDialogData(response.data.data)
          setTotal(response.data.pagination.total)
        }
      }, 400);
    })
  }

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    }, handleValidate(e.target));
  }

  const handleValidate = (input) => {
    switch (input.name || input.tagName) {
      case 'description':
        error.description = validate_emptyField(input.value)
        break
      case 'days':
        error.days = validates_Integer(input.value)
        break
      case 'is_active':
        error.is_active = validate_emptyField(input.value)
        break;
      default:
        break
    }
    setError({ ...error })
  }

  const validateErrors = () => {
    let { description, days, is_active } = state
    let required = {};
    required.description = validate_emptyField(description);
    required.days = validates_Integer(days);
    required.is_active = validate_emptyField(is_active);
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
          NetTermsApi.storeNetTerms(state).then((response) => {
            setTimeout(() => {
              setBtnLoading(false)
              if (response.data.statusCode === 1003) {
                NetTermsListing()
                addSuccessMsg('Added Successfully');
                setOpen(false)
              }
              else {
                addErrorMsg(response.data.message);
                setOpen(false)
              }
            }, 700);

          })
        }
        else {
          state['request_id'] = LocalStorage.uid();
          NetTermsApi.updateNetTerms(state).then((response) => {
            setTimeout(() => {
              setBtnLoading(false)
              if (response.data.statusCode === 1003) {
                NetTermsListing()
                addSuccessMsg('Updated Successfully');
                setOpen(false)
                getActivity(activityFilter)
              }
              else {
                addErrorMsg(response.data.message);
                setOpen(false)
              }
            }, 600);
          })

        }
      }
      else {
        setError(errors);
        addWarningMsg('Please fill all mandatory fields');
      }
    }
  }

  const toggleChange = (item, e) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_client" && item.is_allowed == true)))) {
      const data = { request_id: LocalStorage.uid(), is_active: e.target.checked }
      NetTermsApi.statusUpdateNetTerms(item.id, data).then((response) => {
        if (response.data.statusCode === 1003) {
          NetTermsListing()
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
    NetTermsApi.deleteNetTerms(state).then((response) => {
      if (response.data.statusCode === 1003) {
        NetTermsListing()
        addSuccessMsg('Deleted Successfully');
      }
      else {
        addErrorMsg(response.data.message);
      }
    })
    setOpen(false);
  }
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
      <Box sx={{
        height: '75vh',
        overflow: 'auto',
        padding: '16px',
      }}>

        <Box className={classes.activeItemBox}>
          <Box className={classes.activeBoxHeading}>
            {/* <Text blackHeader >{current}</Text> */}
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

            {dialogData.map((item, index) => (

              <Box className={classes.descriptionBoxStyle} key={index}>
                <Grid container alignItems="center">
                  <Grid item lg={4.5} md={6} sm={6} xs={12} container direction={'column'} gap={1} >
                    <Text mediumBlackColor style={{ cursor: 'pointer' }}>{`Net-${item.days}`}</Text>
                    <Text lightGrey3>{item.description}</Text>
                  </Grid>
                  <Grid item lg={2.5} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                    <Text mediumBlackColor > Days </Text>
                    <Text lightGrey3>{item.days}</Text>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12} container direction={'column'} gap={1}>
                    <Text mediumBlackColor>Modified By</Text>
                    <Text lightGrey3>{item.updated_by}</Text>
                  </Grid>
                  <Grid item lg={1} md={1} sm={3} xs={12} container >
                    <ToggleSwitch switchChange={(e) => toggleChange(item, e)} isActive={item.is_active} sx={{ height: '24px !important' }}
                    />
                  </Grid>
                  <Grid item lg={1} md={1} sm={3} xs={12} container >
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
            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_client" && item.is_allowed == true))) ?
              <Button addTitleBtn onClick={() => handleClickOpen()}>Add Net Terms</Button> :
              <Button addTitleBtnDisable>Add Net Terms</Button>
          }          {alert ? <AlterBox handleDialogClose={handleDialogClose} open={open} handleDelete={handleDelete} /> :
            <BootstrapDialog
              onClose={handleDialogClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              TransitionComponent={Transition}
            // fullWidth={true}
            // maxWidth={"md"}
            >
              <DialogContent >
                <Box padding={'38px 30px 35px 30px '}>
                  <Box mb={4}>
                    <Text blackHeader1>Net Terms</Text>
                  </Box>
                  <Grid container spacing={'32px'}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Input
                        clientInput
                        labelText={'Description'}
                        placeholder={'Type Something'}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'description',
                          value: state.description,
                          type: 'text',
                          disabled: isEditable,

                        }}
                        handleChange={handleChange}
                      />
                      {
                        error.description ?
                          <Text red>{error.description ? error.description : ''}</Text> : ''
                      }
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Input
                        clientInput
                        labelText={'Days'}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: 'days',
                          value: state.days,
                          type: 'text',
                          disabled: isEditable,
                        }}
                        handleChange={handleChange}
                      />
                      {
                        error.days ?
                          <Text red>{error.days ? error.days : ''}</Text> : ''
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
                        helperText={
                          error.is_active ?
                            <Text red>{error.is_active ? error.is_active : ''}</Text> : ''
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                    <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                    <LoadingButton saveExtraSmall loading={btnLoading} onClick={() => handleSaveAndEdit()}>
                      {isEditable ? 'Edit' : 'Save'}
                    </LoadingButton>
                    {/* <Button saveExtraSmall onClick={handleSaveAndEdit}>{isEditable ? 'Edit' : 'Save'}</Button> */}
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


      </Box>
  )
}
