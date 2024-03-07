import React, { useState, useRef, useEffect } from 'react'
import { Box, Grid, Autocomplete, Chip, TextField, Skeleton } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles';
import { ReactComponent as RemoveIcon } from '../../../../../assets/svg/RemoveIconRed.svg';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import Button from '../../../../../components/customButton/Button';
import ApprovalConfigurationApi from '../../../../../apis/configurations/invoices/ApprovalConfigurationApi';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import InputAdornment from '@mui/material/InputAdornment';
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';


function ApprovalConfiguration({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles();
  const [employees, setEmployees] = useState([]);
  const [deletedLevels, setDeletedLevels] = useState([]);
  const [deletedchips, setDeletedchips] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [approvalsError, setApprovalsError] = useState([{}]);// eslint-disable-next-line

  const recentSection = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      getIndex()
      dropdownApi()
      getActivity(activityFilter)
    }, 300)

    // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  const [activityData, setActivityData] = useState([])
  const [activityFilter, setActivityFilter] = useState({
    limit: 10,
    page: 1,
  })
  const [activityTotal, setActivityTotal] = useState()

  const getActivity = (args) => {
    setLoading(true)
    let id = 12;
    ConfigApi.getActivity(id, "",args).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          setLoading(false)
          setActivityData(response.data.data);
          setActivityTotal(response.data.pagination.total)

        }
      }, 300)

    });
  };


  const [state, setState] = useState({
    id: '',
    is_global: true,
    approvals: [
      {
        id: "",
        rank: "",
        approver_ids: []
      }
    ],
    delete_user_ids: [],
  },
  )

  const handleDeleteChipLevels = (key, index) => {
    let approvals = state.approvals;
    let newArr = approvals[index].approver_ids;
    let deletedChipsArr = deletedchips;
    if (newArr[key].id !== '') {
      deletedChipsArr.push(newArr[key]);
    }
    newArr.splice(key, 1);
    setState({ ...state, approvals })
    setDeletedchips([...deletedChipsArr]);
  }

  const handleRemoveLevel = (index) => {
    let arr = state.approvals;
    let deletedLevelArr = deletedLevels;
    if (arr[index].id !== '') {
      deletedLevelArr.push(arr[index]);
    }
    arr.splice(index, 1);
    arr.forEach((ele, key) => {
      ele.rank = key + 1;
    });
    setState({ ...state });
    setDeletedLevels([...deletedLevelArr]);
  }
  const handleChangeLevels = (e, newArr, index) => {
    let { id, value } = newArr[newArr.length - 1];
    let approvals = state.approvals
    let approverIdsArr = approvals[index].approver_ids;
    if (approverIdsArr.filter((i) => i.employee_id === id).length == 0) {
      approverIdsArr.push({ id: "", employee_id: id, full_name: value });
      setState((prev) => ({ ...prev, approvals }))
    }
  }
  const multiLevelSubmitValidation = () => {
    let approvalsArr = state.approvals;
    let err = approvalsError || [];
    let result = [];
    approvalsArr.forEach((ele, key) => {
      if (err.length < key + 1) {
        err.push({});
      }
      if (ele.approver_ids.length === 0) {
        err[key].approvals = "This field is required";
        result.push(key);
      } else {
        err[key].approvals = "";
        result.splice(key, 1);
      }
    });
    setApprovalsError(err);
    return result.length === 0;

  }
  const handleSave = () => {
    let multiLevelErrors = multiLevelSubmitValidation();
    if (isEditable) {
      setIsEditable(false)
    } else {
      if (state.id != "") {
        if (multiLevelErrors) {
          updateApi(state.id)
          setIsEditable(true)
        } else {
          // setError(errors);
          addWarningMsg('Please verify and resubmit  as the approval field have not been filled in or contain invalid data');
        }
      }
      else {
        storeApi(state)
        setIsEditable(true)
      }

    }

  }
  const scrollDown = () => {

    window.scroll({
      top: recentSection.current.scrollIntoView(),
      behavior: 'smooth'
    })
  }



  const handleAddLevel = () => {
    let arr = state.approvals;
    arr.push({
      id: "",
      rank: arr.length + 1,
      approver_ids: [],
    },);

    setState({ ...state, approvals: arr });
  }

  const getIndex = () => {
    setLoading(true)
    ApprovalConfigurationApi.indexApi().then((response) => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          if (response.data.data.length > 0) {
            for (let i = 0; i < response.data.data.length; i++) {
              state['approvals'] = response.data.data[i].approvals
              state['id'] = response.data.data[i].id
              setState({ ...state })
            }
          } else {
            setState({
              ...state,
              approvals: [{ approver_ids: [], rank: 1 }],
            });
          }
        } else {
          addErrorMsg(response.data.message);
        }
      }, 400)
    })
  }
  const updateApi = (dataId) => {
    let data = { ...state, request_id: LocalStorage.uid(), delete_user_ids: [], delete_approval_level_ids: [] };
    data.approvals.forEach((ele, key) => {
      data.approvals[key].rank = key + 1
    })
    deletedLevels.forEach(ele => {
      data.delete_approval_level_ids.push(ele.id);
    });
    deletedchips.forEach(ele => {
      data.delete_user_ids.push(ele.id);
    });
    data['is_global'] = true;
    data['approval_module'] = 1
    data['id'] = state.id
    ApprovalConfigurationApi.updateApi(data, dataId).then((response) => {
      if (response.data.statusCode == 1003) {
        getIndex()
        addSuccessMsg(response.data.message);
        getActivity()
      } else {
        addErrorMsg(response.data.message);
      }
    });
  };
  const dropdownApi = () => {
    CommonApi.EmployeeDetailsdropdown(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((response) => {
      if (response.data.statusCode == 1003) {
        setEmployees(response.data.data);
      }
    });
  };
  const storeApi = (data) => {
    data.request_id = LocalStorage.uid()
    ApprovalConfigurationApi.storeApi(data).then((response) => {
      if (response.data.statusCode == 1003) {
        getIndex()
        addSuccessMsg(response.data.message);
      }
    });
  };

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
  
  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
    }}>

      <Box className={classes.activeItemBox2}>
        <Box><Text RegularBlack1 >{current}</Text></Box>

        {loading ? <>
          {[1, 2, 3].map((item, index) => (
            <Grid container key={index} mt={3}>
              <Grid item lg={12}>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />

              </Grid>

            </Grid>
          ))}



        </>
          :
          <Box className={classes.chipContainerMain}>
            {state.approvals.map((i, key) => (
              <>
                <Grid item lg={12} md={10} sm={9} xs={11}>
                  <Box mt={1}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
                      <div style={{ width: '100%', paddingTop: i.approver_ids.length > 0 ? '16px' : '0px', minHeight: '59px', display: 'flex', alignItems: "center", }}>
                        <Autocomplete
                          disabled={isEditable}
                          multiple
                          limitTags={2}
                          id="multiple-limit-tags"
                          options={employees}
                          getOptionLabel={(option) => option.value}
                          renderOption={(props, option) => (
                            <li {...props} key={option.uniqueIdentifier}>
                              {option.value}
                            </li>
                          )}

                          value={i.approver_ids}
                          renderInput={(params) => (
                            <>
                              <TextField {...params} pt={2} label={`Level ${key + 1} Approval`}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <InputAdornment position="end" sx={{ cursor: isEditable ? "default" : "pointer" }}>
                                      {key != 0 && isEditable ? <RemoveCircleOutlineRoundedIcon sx={{ height: "30px", width: "30px" }} /> : key != 0 &&
                                        <RemoveIcon sx={{ color: "#15803D !imoprtant" }} onClick={() => handleRemoveLevel(key)} />
                                      }
                                    </InputAdornment>
                                  )
                                }} />
                            </>
                          )}
                          onChange={(e, newArr) => handleChangeLevels(e, newArr, key)}
                          renderTags={(value, getTagProps) =>
                            value.map((option, keyId) => (
                              <>
                                <Chip
                                  disabled={isEditable}
                                  key={keyId}
                                  label={option && option.full_name}
                                  sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                  onDelete={() => handleDeleteChipLevels(keyId, key)}
                                />
                              </>
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
                              transform: i.approver_ids.length === 0 ? "translate(12px, 0px) scale(1);" : "translate(12px, -8px) scale(1);"
                            },
                            "& .MuiOutlinedInput-root": {
                              paddingRight: "10px !important",
                            },
                          }}
                        />
                      </div>
                    </Box>
                  </Box>
                </Grid>

              </>
            ))}


          </Box>}



        {isEditable ?
          (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_invoice" && item.is_allowed == true))) &&
          <Button disable={isEditable} sx={{ width: '100%' }}>Add New Level</Button>
          :
          <Button addTitleBtn sx={{ width: '100%' }} onClick={() => handleAddLevel()} >Add New Level</Button>
        }

        <Grid item display={"flex"} justifyContent={"end"}>
          {
            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_invoice" && item.is_allowed == true))) ?
              <Button popupSaveBlue sx={{ marginTop: "10px" }} onClick={() => handleSave()}
              >{isEditable ? "Edit" : "Save"}
              </Button> :
              <Button popupSaveBlueDisable sx={{ marginTop: "10px" }}
              >{isEditable ? "Edit" : "Save"}
              </Button>
          }

        </Grid>

        {/* <Grid item display={"flex"} justifyContent={"end"}>
          <Button popupSaveBlue sx={{ marginTop: "10px" }} onClick={() => handleSave()}
          >{isEditable ? "Edit" : "Save"}</Button>
        </Grid> */}

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
                        <Text BrowmnMnStepperText>{value.field_changes}</Text> : value.action_type_name === "store" ? <Text BrowmnMnStepperText>{value.created_by} stored {value.referrable_name}</Text> : null
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

export default ApprovalConfiguration;
