import React, { useEffect, useRef, useState } from 'react'
import { Box, Grid, Skeleton, Slide } from '@mui/material'
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
import Text from '../../../../../components/customText/Text'
import Button from '../../../../../components/customButton/Button'
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input'
import CustomSelect from '../../../../../components/customSelect/CustomSelect'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import DocumentTypeApi from '../../../../../apis/configurations/placement/DocumentTypeApi'
import { validate_emptyField, isValid, validate_charWithSpace } from "../../../../../components/Validation";
import { addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
import AlterBox from '../../configComponents/alertBox/AlertBox';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi'


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

function DocumentType({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [getData, setGetData] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  const statusList = require('../../../../../utils/jsons/Status.json');
  const slug = 'placement-documents';
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(false);
  const [state, setState] = useState({
    serial_no: '',
    id: '',
    name: '',
    is_active: '',
    number_display: true,
    number_mandatory: false,
    valid_from_display: true,
    valid_from_mandatory: false,
    valid_to_display: true,
    valid_to_mandatory: false,
    status_display: true,
    status_mandatory: false,
    upload_display: true,
    upload_mandatory: false,
    description: '',
  });
  useEffect(() => {
    setTimeout(() => {
      ListingApi()
      getActivity()
    })

  }, [])

  // eslint-disable-next-line
  const [activityData, setActivityData] = useState([])

  const getActivity = () => {
    setLoading(true)
    let id = 19;
    ConfigApi.getActivity(id, "").then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          setLoading(false)
          console.log(response.data.data, "res")
          setActivityData(response.data.data);
        }
      }, 300)

    });
  };

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
        err.name = validate_charWithSpace(input.value);
        break;
      case "is_active":
        err.is_active = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    setError(err);
  }
  const recentSection = useRef(null);
  const handleSaveAndEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      if (state.id != '') {
        updateDocument(state.id)
      } else {
        storeDocuments(state)
        handleSubmit()
      }


    }

  }
  const handleEditClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_placement" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      // IndexApi(data.id)
      setState({
        ...data,
        is_active: true ? '1' : '0'
      });
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  };

  const handleViewClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_placement" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(true);
      // IndexApi(data.id)
      setState({
        ...data,
        is_active: true ? '1' : '0'
      });
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }
  const [val, setVal] = useState()

  const handleDeleteClick = (args) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_placement" && item.is_allowed == true)))) {
      setVal(args)
      setOpen(true);
      setAlert(true);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }
  const handleSubmit = () => {
    let errors = validateAll();
    if (isValid(errors)) {


    } else {
      setError(errors);
      setLoading(false)
    }
  }
  const validateAll = () => {
    let { name, is_active } = state;
    let errors = {};
    errors.name = validate_emptyField(name);
    errors.is_active = validate_emptyField(is_active);
    return errors;

  };
  const handleDelete = () => {
    deleteApi(val.id)
    setOpen(false);
  }
  const scrollDown = () => {
    window.scroll({
      top: recentSection.current.scrollIntoView(),
      behavior: 'smooth'
    })
  }
  const handleStatus = (event, items) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_placement" && item.is_allowed == true)))) {
      state['is_active'] = event.target.checked
      setState(state);
      updateStatus(items);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const ListingApi = () => {
    setLoading(true)
    DocumentTypeApi.getListing(slug).then((response) => {
      setTimeout(() => {
        setLoading(() => {
          setLoading(false)
          if (response.data.statusCode == 1003) {
            setGetData(response.data.data);
          }
        }, 300)

      })

    });
  };
  const storeDocuments = (data) => {
    data.request_id = LocalStorage.uid()
    state['number_mandatory'] = false;
    state['number_display'] = true;
    state['upload_display'] = true;
    state['valid_from_mandatory'] = false;
    state['valid_to_mandatory'] = false;
    state['status_mandatory'] = false;
    state['upload_mandatory'] = false;
    state['valid_from_display'] = true
    state['valid_to_display'] = true
    state['status_display'] = true
    setLoading(true)
    DocumentTypeApi.storeApi(data, slug).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          ListingApi()
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
    DocumentTypeApi.updateStatus(data, args.id).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(response.data.message);
        ListingApi()
        getActivity()
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  // const IndexApi = (id) => {
  //   DocumentTypeApi.getIndex(
  //     id, slug
  //   ).then((response) => {
  //     setTimeout(() => {
  //       if (response.data.statusCode == 1003) {
  //         setState({ ...response.data.data[0] })
  //       } else {
  //         addErrorMsg(response.data.message);
  //       }
  //     }, 400)
  //   });
  // }
  const updateDocument = (dataId) => {
    let data = { ...state, request_id: LocalStorage.uid() };

    setLoading(true)
    DocumentTypeApi.updateApi(data, dataId, slug).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          ListingApi()
          handleDialogClose();
          getActivity()
          addSuccessMsg(response.data.message);
        } else {
          handleDialogClose();
          addErrorMsg(response.data.message);
        }
      }, 300)

    });
  };
  const deleteApi = (dataId) => {
    let data = { request_id: LocalStorage.uid() };
    DocumentTypeApi.deleteApi(data, dataId, slug).then((response) => {
      if (response.data.statusCode == 1003) {
        ListingApi()
        addSuccessMsg(response.data.message);
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  return (
    <Box sx={{
      padding: '16px !important',
      height: '75vh',
      overflow: 'auto'
    }}
    >
      <Box className={classes.activeItemBox}>

        <Box className={classes.activeBoxHeading}><Text blackHeader>{current}</Text></Box>

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



        </>
          : <>
            {getData.map((value, index) => (
              <Box className={classes.descriptionBoxStyle}>
                <Grid container spacing={6}>
                  <Grid item lg={6} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                    <Text mediumBlackColor>{value.name}</Text>
                    <Text greyLabel>{value.description ? value.description : "--"}</Text>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Grid container>
                      <Grid item lg={8} md={8} sm={8} xs={12} container direction={'column'} gap={1}>
                        <Text mediumBlackColor>Created By</Text>
                        <Text greyLabel>{value.created_by}</Text>
                      </Grid>
                      <Grid item lg={3} md={3} sm={3} xs={3} container alignItems="center">
                        <ToggleSwitch name='is_active' isActive={value.is_active} switchChange={(e) => handleStatus(e, value)} sx={{ height: '240px !important' }} />
                      </Grid>
                      <Grid item lg={1} md={1} sm={1} xs={1} container alignItems="center">
                        <CustomMenu
                          anchorEl={anchorEl}
                          isOpen={Boolean(anchorEl)}
                          onClose={handleClose}
                          children={[{ color: 'black', label: "View", Click: () => handleViewClick(value) },
                          { color: 'black', label: "Edit", Click: () => handleEditClick(value) },
                          { color: 'black', label: "Delete", Click: () => handleDeleteClick(value) }
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {
              (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_placement" && item.is_allowed == true))) ?
                <Button addTitleBtn sx={{ marginTop: '16px' }} onClick={() => handleClickOpen()}>Add Document </Button> :
                <Button addTitleBtnDisable sx={{ marginTop: '16px' }}>Add Document </Button>
            }
          </>
        }
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
            <DialogContent>
              <Box padding={'38px 30px 32px 30px '}>
                <Box mb={4}>
                  <Text mediumViewAmt>Add Document Type</Text>
                </Box>
                <Grid container spacing={'32px'}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '70px !important' }}>
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
                        labelText={'Document Name'}
                      />
                      <Text sx={{ marginLeft: '12px !important' }} errorText> {error.name ? error.name : ""}</Text>
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '70px !important' }}>
                      <CustomSelect
                        commonSelect
                        label={'Status'}
                        options={statusList}
                        name='is_active'
                        value={state.is_active}
                        disabled={isEditable}
                        onChange={handleChange}
                      ></CustomSelect>
                      <Text sx={{ marginLeft: '12px !important' }} errorText> {error.is_active ? error.is_active : ""}</Text>

                    </Box>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '100px !important', display: 'flex', flexDirection: 'column', }}>

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
                <Box display={'flex'} justifyContent={'end'} gap={2} mt={'40px'}>
                  <Button popupCancel1 onClick={handleDialogClose} >Cancel</Button>
                  {/* <Button popupSaveBlue onClick={handleSaveAndEdit} >{isEditable ? 'Edit' : 'Save'}</Button> */}
                  <LoadingButton popupSaveBlue loading={loading} onClick={() => handleSaveAndEdit()}>
                    {isEditable ? 'Edit' : 'Save'}
                  </LoadingButton>
                </Box>
              </Box>
            </DialogContent>
          </BootstrapDialog>
        }
      </Box>
      <Box className={classes.activeItemBox} mt={4} mb={6} ref={recentSection}>
        <Box activeBoxHeading mb={3}>
          <Text blackHeader>
            Recent Activities
          </Text>
        </Box>
        <Box sx={{
          height: '40vh', overflowY: 'auto', '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
          {activityData.length > 0 && activityData.map((value) => (
            <Box className={classes.descriptionBoxStyle} mb={3}>
              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                  <Text mediumBlackColor>{value.created_by}</Text>
                  <Text greyLabel>{value.created_at}</Text>
                </Grid>
                <Grid item lg={8} md={8} sm={8} xs={12} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                  {/* {value.action_type_name === "store" ?
                  <Text BrowmnMnStepperText>
                    {value.referrable_name === null ? 'New Document Type' : value.referrable_name} has been created </Text> :
                  <Text BrowmnMnStepperText>{value.field_changes === '[]' ? '' : value.field_changes}</Text>
                } */}
                  <Text BrowmnMnStepperText>{value.field_changes === '[]' ? '' : value.field_changes}</Text>
                </Grid>
              </Grid>
            </Box>
          ))}
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

export default DocumentType