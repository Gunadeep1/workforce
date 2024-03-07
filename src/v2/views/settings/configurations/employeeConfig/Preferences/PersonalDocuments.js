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
import AlterBox from '../../configComponents/alertBox/AlertBox';
import { isValid, validate_emptyField, } from "../../../../../components/Validation";
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import PersonalDocumentsApi from '../../../../../apis/configurations/employee/PersonalDocumentsApi';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import RadioGroup from '../../../../../components/customButton/RadioGroup';
import { addSuccessMsg, addErrorMsg, addWarningMsg } from '../../../../../utils/utils';
import LocalStorage from "../../../../../utils/LocalStorage";
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});
function PersonalDocuments({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const recentSection = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState({});
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const slug = 'employee-personal-documents';
  const [state, setState] = useState({
    serial_no: '',
    id: '',
    name: '',
    is_active: '',
    number_display: '',
    number_mandatory: '',
    valid_from_display: '',
    valid_from_mandatory: '',
    valid_to_display: '',
    valid_to_mandatory: '',
    status_display: '',
    status_mandatory: '',
    upload_display: '',
    upload_mandatory: '',
    description: '',
  });


  const statusList = require('../../../../../utils/jsons/Status.json');
  const options = [
    { id: true, title: <Text mediumBlack>Yes</Text>, value: true },
    { id: false, title: <Text mediumBlack>No</Text>, value: false },
  ];


  useEffect(() => {
    setTimeout(() => {
      getDocumentsListing(filter)
      getActivity(activityFilter)
    }, 300)// eslint-disable-next-line
  }, [])

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: "",
  });
  const [activityData, setActivityData] = useState([])
  const [activityFilter, setActivityFilter] = useState({
    limit: 10,
    page: 1,
  })
  const [total, setTotal] = useState()

  const [activityTotal, setActivityTotal] = useState()
  const getActivity = (args) => {
    if (activityFilter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    let id = 30;
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
          getDocumentsListing({ ...filter, limit: filter.limit + 10, page: 1, });
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
    PersonalDocumentsApi.getPersonalDocument({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setGetData(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      PersonalDocumentsApi.getPersonalDocument({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setGetData(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }

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
      case "number_display":
        err.number_display = validate_emptyField(input.value);
        break;
      case "number_mandatory":
        err.number_mandatory = validate_emptyField(input.value);
        break;
      case "valid_from_display":
        err.valid_from_display = validate_emptyField(input.value);
        break;
      case "valid_from_mandatory":
        err.valid_from_mandatory = validate_emptyField(input.value);
        break;
      case "valid_to_display":
        err.valid_to_display = validate_emptyField(input.value);
        break;
      case "valid_to_mandatory":
        err.valid_to_mandatory = validate_emptyField(input.value);
        break;
      case "status_display":
        err.status_display = validate_emptyField(input.value);
        break;
      case "status_mandatory":
        err.status_mandatory = validate_emptyField(input.value);
        break;
      case "upload_display":
        err.upload_display = validate_emptyField(input.value);
        break;
      case "upload_mandatory":
        err.upload_mandatory = validate_emptyField(input.value);
        break;

      default:
        break;
    }
    setError(err);
  }

  const validateAll = () => {
    let { name, is_active, number_display, number_mandatory,
      valid_from_display, valid_from_mandatory, valid_to_display, valid_to_mandatory,
      status_display, status_mandatory, upload_display, upload_mandatory, } = state;
    let errors = {};
    errors.name = validate_emptyField(name);
    errors.is_active = validate_emptyField(is_active);
    errors.number_display = validate_emptyField(number_display);
    errors.number_mandatory = validate_emptyField(number_mandatory);
    errors.valid_from_display = validate_emptyField(valid_from_display);
    errors.valid_from_mandatory = validate_emptyField(valid_from_mandatory);
    errors.valid_to_display = validate_emptyField(valid_to_display);
    errors.valid_to_mandatory = validate_emptyField(valid_to_mandatory);
    errors.status_display = validate_emptyField(status_display);
    errors.status_mandatory = validate_emptyField(status_mandatory);
    errors.upload_display = validate_emptyField(upload_display);
    errors.upload_mandatory = validate_emptyField(upload_mandatory);
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
      number_display: '',
      number_mandatory: '',
      valid_from_display: '',
      valid_from_mandatory: '',
      valid_to_display: '',
      valid_to_mandatory: '',
      status_display: '',
      status_mandatory: '',
      upload_display: '',
      upload_mandatory: '',
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
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      // getDocumentIndex(data.id)
      setState({
        ...data,
        is_active: true ? '1' : '0'
      });
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  };

  const handleViewClick = (data) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(true);
      // getDocumentIndex(data.id)
      setState({
        ...data,
        is_active: true ? '1' : '0'
      });
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleDelete = () => {
    deleteDocument(val.id)
    setOpen(false);
  }


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
  const [val, setVal] = useState()

  const handleDeleteClick = (args) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_employee" && item.is_allowed == true)))) {
      setVal(args)
      setOpen(true);
      setAlert(true)
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }


  const handleStatus = (event, items) => {
    state['is_active'] = event.target.checked
    setState(state);
    updateStatus(items)
  }
  const scrollDown = () => {

    window.scroll({
      top: recentSection.current.scrollIntoView(),
      behavior: 'smooth'
    })
  }




  // const recentData = [

  //   {
  //     name: "Nithin Krishna",
  //     date: "10-12-2023",
  //     description: "Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, Description has been changed from to osrnfroflnreov",
  //   },
  //   {
  //     name: "Nithin Krishna",
  //     date: "10-12-2023",
  //     description: "Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, "
  //   },
  //   {
  //     name: "Nithin Krishna",
  //     date: "10-12-2023",
  //     description: "Net-60 - name has been changed from Net-60 to Net-20."
  //   }

  // ]



  const getDocumentsListing = (args) => {
    if (filter.limit <= 10) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    PersonalDocumentsApi.getPersonalDocument(slug, args).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          setGetData(response.data.data);
          setTotal(response.data.pagination.total)
        }
      }, 300)

    });
  };
  const storeDocuments = (data) => {
    data.request_id = LocalStorage.uid()
    setLoading(true)
    PersonalDocumentsApi.postPersonalDocuments(data, slug).then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          getDocumentsListing(filter)
          getActivity(activityFilter)
          handleDialogClose();
          // getActivity()
          addSuccessMsg(response.data.message);
        }
      }, 300)

    });
  };
  const updateStatus = (args) => {
    let data = {
      request_id: LocalStorage.uid(),
      is_active: state.is_active
    }
    PersonalDocumentsApi.updateDocumentStatus(data, args.id).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(response.data.message);
        getDocumentsListing(filter)
        getActivity(activityFilter)
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  // const getDocumentIndex = (id) => {
  //   PersonalDocumentsApi.getPersonalDocumentIndex(
  //     id, slug
  //   ).then((response) => {
  //     setTimeout(() => {
  //       // setLoading(false)
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
    PersonalDocumentsApi.updatePersonalDocument(data, dataId, slug).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          getDocumentsListing(filter)
          getActivity(activityFilter)
          addSuccessMsg(response.data.message);
          handleDialogClose();
          // getActivity()
          // setGetData(response.data.data);
        } else {
          handleDialogClose();
          addErrorMsg(response.data.message);
        }
        setLoading(false)
      }, 600)

    });
  };
  const deleteDocument = (dataId) => {
    let data = { request_id: LocalStorage.uid() };
    PersonalDocumentsApi.deletePersonalDocument(data, dataId, slug).then((response) => {
      if (response.data.statusCode == 1003) {
        getDocumentsListing(filter)
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



          </>
            :
            <>
              {getData.map((items, index) => (
                <Box className={classes.descriptionBoxStyle} key={index}>
                  <Grid container alignItems="center">
                    <Grid item lg={4.5} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor > {items.name}</Text>
                      <Text greyLabel>{items.description ? items.description : "--"}</Text>
                    </Grid>
                    <Grid item lg={2.5} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor > Created By </Text>
                      <Text greyLabel>{items.created_by}</Text>
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                      <Text mediumBlackColor>Modified By</Text>
                      <Text greyLabel>{items.updated_by ? items.updated_by : "--"}</Text>
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
                  <Button addTitleBtn onClick={() => handleClickOpen()}>Add Personal Documents</Button> :
                  <Button addTitleBtnDisable>Add Personal Documents</Button>
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
                  <Text mediumViewAmt>Personal Document</Text>
                </Box>
                <Grid container columnSpacing={'48px'}>

                  <Grid item lg={6} md={6} sm={12} xs={12}>

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
                        labelText={'Document Name'}
                      />

                      <Text sx={{ marginLeft: '12px !important' }} errorText> {error.name ? error.name : ""}</Text>
                    </Box>




                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box sx={{ height: '86px !important' }}>
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
                  <Grid item container lg={12} md={12} sm={12} xs={12}>

                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}> Number Display</Text>
                        <RadioGroup
                          row
                          name="number_display"
                          value={state.number_display}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.number_display ? error.number_display : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Number Mandatory</Text>
                        <RadioGroup
                          row
                          name="number_mandatory"
                          value={state.number_mandatory}
                          items={options}
                          onChange={handleChange}
                          disabled={isEditable}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.number_mandatory ? error.number_mandatory : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Valid From Display</Text>
                        <RadioGroup
                          row
                          name="valid_from_display"
                          value={state.valid_from_display}
                          items={options}
                          onChange={handleChange}
                          disabled={isEditable}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.valid_from_display ? error.valid_from_display : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Valid From Mandatory</Text>
                        <RadioGroup
                          row
                          name="valid_from_mandatory"
                          value={state.valid_from_mandatory}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.valid_from_mandatory ? error.valid_from_mandatory : ""}</Text>
                      </Box>

                    </Grid>

                  </Grid>


                  <Grid item container lg={12} md={12} sm={12} xs={12}>

                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Valid To Display</Text>
                        <RadioGroup
                          row
                          name="valid_to_display"
                          value={state.valid_to_display}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.valid_to_display ? error.valid_to_display : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Valid To  Mandatory</Text>
                        <RadioGroup
                          row
                          name="valid_to_mandatory"
                          value={state.valid_to_mandatory}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.valid_to_mandatory ? error.valid_to_mandatory : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Status Display</Text>

                        <RadioGroup
                          row
                          name="status_display"
                          value={state.status_display}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}

                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.status_display ? error.status_display : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Status Mandatory</Text>

                        <RadioGroup
                          row
                          name="status_mandatory"
                          value={state.status_mandatory}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.status_mandatory ? error.status_mandatory : ""}</Text>
                      </Box>

                    </Grid>
                  </Grid>


                  <Grid item container lg={12} md={12} sm={12} xs={12}>

                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Upload Display</Text>
                        <RadioGroup
                          row
                          name="upload_display"
                          value={state.upload_display}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.upload_display ? error.upload_display : ""}</Text>
                      </Box>

                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Box sx={{ height: '93px !important', display: 'flex', flexDirection: 'column', }}>
                        <Text largeBlack mb={'16px'}>Upload Mandatory</Text>
                        <RadioGroup
                          row
                          name="upload_mandatory"
                          value={state.upload_mandatory}
                          items={options}
                          disabled={isEditable}
                          onChange={handleChange}
                        />
                        <Text sx={{ marginLeft: '12px !important' }} errorText> {error.upload_mandatory ? error.upload_mandatory : ""}</Text>
                      </Box>

                    </Grid>

                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ height: '151px !important', display: 'flex', flexDirection: 'column', }}>
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
                <Box display={'flex'} justifyContent={'end'} gap={'20px'} >
                  <Button popupCancel1 onClick={handleDialogClose} >Cancel</Button>
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
                        <Text BrowmnMnStepperText>{value.field_changes}</Text> : value.action_type_name === "store" ? <Text BrowmnMnStepperText>{value.created_by} stored the new document type {value.referrable_name}</Text> : value.action_type_name === "delete" ? <Text BrowmnMnStepperText>{value.created_by} has deleted {value.referrable_name}</Text> : null
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

export default PersonalDocuments;



