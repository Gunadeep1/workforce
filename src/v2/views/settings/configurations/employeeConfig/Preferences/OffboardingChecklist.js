import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Skeleton, Slide } from '@mui/material';
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles';
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import Button from '../../../../../components/customButton/Button';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import OffBoardingChecklistApi from '../../../../../apis/configurations/employee/OffBoardingChecklistApi';
import LocalStorage from "../../../../../utils/LocalStorage";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Input from '../../../../../components/input/Input';
import { addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../../utils/utils';
import editIcon from "../../../../../assets/svg/editIn.svg"
import DialogContent from "@mui/material/DialogContent";
import ConfigApi from '../../../../../apis/configurations/ConfigApi';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper ": {
    maxHeight: '586px !important',
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
export default function OffboardingChecklist({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const recentSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([])
  const [state, setState] = useState({
    associated_app_names: '',//text
    notify_university_usics: false,
    enable_delete_email: false,
    enable_settlement_amount: false,
    updated_by: ''
  });

  useEffect(() => {
    setTimeout(() => {
      getOffBoardCheckListing()
      getActivity(activityFilter)
    }, 300)// eslint-disable-next-line   
  }, [])
  const handleDialogClose = () => {
    setOpen(false);


  };


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

  const [activityTotal, setActivityTotal] = useState()
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


  const getActivity = (args) => {
    if (activityFilter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    let id = 35;
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

  const handleStatus = (e, items, args) => {
    if (e.target.name == 'associated_app_names') {
      setState({
        ...state, [e.target.name]: e.target.value
      })
    }
    else {
      if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
        if (args == 1) {
          state['notify_university_usics'] = e.target.checked
        } else if (args == 2) {
          state['enable_delete_email'] = e.target.checked
        } else if (args == 3) {
          state['enable_settlement_amount'] = e.target.checked
        } else if (args == 4) {
          state['associated_app_names'] = e.target.value
        }
        updateStatus(items)
      } else {
        addWarningMsg("You don't have permission to perform this action. Please contact the admin")
      }
    }
  }

  const getOffBoardCheckListing = () => {
    setLoading(true)
    OffBoardingChecklistApi.getOffBoardCheckListing().then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          setState({ ...response.data.data[0] });
        }
      }, 300)

    });
  };
  const handleClick = () => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
      setOpen(true);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSave = () => {
    updateStatus(state)
    setOpen(false)
  }
  const updateStatus = (args) => {
    let data = {
      request_id: LocalStorage.uid(),
      associated_app_names: state.associated_app_names,
      notify_university_usics: state.notify_university_usics,
      enable_delete_email: state.enable_delete_email,
      enable_settlement_amount: state.enable_settlement_amount,
    }
    OffBoardingChecklistApi.updateOffboardStatus(data, args.id).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(response.data.message);
        getOffBoardCheckListing()
        getActivity()
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
          <Box className={classes.activeItemBox}>
            <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
            <Box className={classes.descriptionBoxStyle}>
              <Grid container alignItems="center">
                <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor >Disable User Access</Text>
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor>Modified By</Text>
                  <Text greyLabel>{state.updated_by}</Text>
                </Grid>
                <Grid item lg={1} md={1} sm={1} xs={12} ml={2} container alignItems={'center'}>
                  <img src={editIcon} style={{ cursor: "pointer" }} alt='edit' onClick={handleClick} />
                  {/* <ToggleSwitch name='is_active' value={state.is_active} checked={state.is_active}  sx={{ height: '24px !important' }} /> */}
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.descriptionBoxStyle}>
              <Grid container alignItems="center">
                <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor >Send Email to USCIS/ University</Text>
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor>Modified By</Text>
                  <Text greyLabel>{state.updated_by}</Text>
                </Grid>
                <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                  <ToggleSwitch name='is_active' isActive={state.notify_university_usics} switchChange={(e) => handleStatus(e, state, 1)} sx={{ height: '24px !important' }} />
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.descriptionBoxStyle}>
              <Grid container alignItems="center">
                <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor >Delete Email ID</Text>
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor>Modified By</Text>
                  <Text greyLabel>{state.updated_by}</Text>
                </Grid>
                <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                  <ToggleSwitch name='is_active' isActive={state.enable_delete_email} switchChange={(e) => handleStatus(e, state, 2)} sx={{ height: '24px !important' }} />
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.descriptionBoxStyle}>
              <Grid container alignItems="center">
                <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor >Settle Amount</Text>
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                  <Text mediumBlackColor>Modified By</Text>
                  <Text greyLabel>{state.updated_by}</Text>
                </Grid>
                <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                  <ToggleSwitch name='is_active' isActive={state.enable_settlement_amount} switchChange={(e) => handleStatus(e, state, 3)} sx={{ height: '24px !important' }} />
                </Grid>
              </Grid>
            </Box>
          </Box>}

      <Box className={classes.activeItemBox} mt={4} mb={6} ref={recentSection}>
        {/* <Box className={classes.activeItemBox} mt={4} mb={6} ref={recentSection}> */}
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
        {/* </Box> */}
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
                <Text mediumViewAmt></Text>
              </Box>
              <Grid container columnSpacing={'32px'}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Box sx={{ height: '151px !important' }}>
                    <Input
                      formControlProps={{
                        fullWidth: true
                      }}

                      inputProps={{
                        name: 'associated_app_names',
                        value: state.associated_app_names,
                        type: 'text',
                        // disabled: isEditable,
                        inputProps: { maxLength: 20 }
                      }}
                      //   inputProps: {
                      // maxLength
                      // }
                      handleChange={(e) => handleStatus(e, state, 4)}
                      clientInput
                      labelText={'Application Name'}
                    />
                  </Box>

                </Grid>
              </Grid>
              <Box display={'flex'} justifyContent={'end'} gap={'20px'}>
                <Button popupCancel1 onClick={() => handleClose()} >Cancel</Button>
                <Button popupSaveBlue onClick={() => handleSave()}>Save</Button>
              </Box>
            </Box>


          </DialogContent>
        </BootstrapDialog>
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
