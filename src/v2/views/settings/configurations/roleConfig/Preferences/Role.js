import React, { useEffect, useRef, useState } from 'react'
import { Grid, Stack, Box, FormControlLabel, Checkbox, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses, IconButton, Popover, Typography, Skeleton } from "@mui/material";
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import RoleApi from '../../../../../apis/configurations/roleApi/RoleApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import AlertBox from '../../configComponents/alertBox/AlertBox';
import { isValid, validate_charWithSpace } from '../../../../../../v2/components/Validation';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useLocation } from 'react-router-dom';
import CustomRoleTableStyles from '../../configComponents/dataTable/dataTable/CustomRoleTableStyles';
import { ReactComponent as CheckedIcon } from '../../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as CheckedDisabled } from '../../../../../assets/svg/CheckedDisabled.svg';
import { ReactComponent as CheckedBorderIconDisabled } from '../../../../../assets/svg/CheckboxDisabled.svg';
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Search from '../../../../../assets/svg/search1.svg';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper ": {
    minHeight: '650px !important',
    padding: '0px !important',
    borderRadius: "12px",
  },
  "& .MuiDialogContent-root": {
    padding: '0px !important',
    '&::-webkit-scrollbar': {
      display: 'none !important'
    },
  },
  "& .MuiDialogActions-root": {
    padding: '0px !important',
  },
  "& .MuiDialog-container": {
    background: 'rgba(0, 0, 0, 0.55) !important'
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F6F6F6 !important',
    color: '#171717 !important',
    borderRadius: '1px !important',
    font: '16px Nunito !important',
    textAlign: 'left important',
  },
  [`&.${tableCellClasses.body}`]: {
    font: '14px Nunito !important',
    textAlign: 'left !important',
    paddingTop: '4px !important',
    paddingBottom: '4px !important',
    color: '#262626 !important'
  },

}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: "78px !important",
  borderBottom: "1pt solid #EAECF0 !important"
}));

//values for tablerow and table header
const Header = [
  {
    name: 'Module',
    width: '20%',
  },
  {
    name: 'Full Access',
    width: '15%',
  },
  {
    name: 'Create',
    width: '15%',
  },
  {
    name: 'Edit',
    width: '15%',
  },
  {
    name: 'View',
    width: '15%',
  },
  {
    name: 'Delete',
    width: '15%',
  },
  {
    name: 'More',
    width: '15%',
  },
];

function Role({ current }) {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const classes = MainStyles()
  const customTableStyles = CustomRoleTableStyles();
  const routeState = useLocation();
  const [allPemissions, setAllPermissions] = useState({})
  const [state, setState] = useState({
    data: {
      name: "",
      description: "",
    },
    error: {},
    rows: [],
    checked: {},
    modules: {},
  })
  const [errors, setErrors] = useState({});
  const [action, setAction] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [clone, setClone] = useState("");
  const [cloneArr, setCloneArr] = useState([]);
  const [roles, setRoles] = useState([]);
  const [alert, setAlert] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true)
      getRolesListing(filter);
      rolesDropdown();
      getAllPermissions();
      getActivity(activityFilter)
    }, 300)// eslint-disable-next-line
  }, [])

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
    let id = 26;
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


  const handleClone = (e) => {
    setClone(e.target.value);
    setAction(true);
    getRolePermissions(e.target.value);
  }

  //handle input change for all fields
  const handleInputChange = (event) => {
    setState((prev) => ({ ...prev, "data": { ...state.data, [event.target.name]: event.target.value } }));
    handleValidate({ name: event.target.name, value: event.target.value });
  };

  const handleValidate = (input) => {
    switch (input.name) {
      case 'name':
        errors.name = validate_charWithSpace(input.value);
        break
      default:
        break
    }
    setErrors({ ...errors });
  }

  //   const [filter, setFilter] = useState({
  //     limit: 10,
  //     page: 1,
  //     search: "",
  // });

  // handle change for table to select and deselect all values
  const handlechangeTableSelectAll = (e, key) => {
    var trueArray = [];  //defining true array;
    // setAction(true);
    var keyName = routeState.state == null && action == false ? "checked" : "is_allowed";
    // var keyName = routeState.state == null && action == false ? "checked" : "is_allowed";
    var allLength = 0;
    // if (e.target.checked) {
    state.rows[key].totalcheck.totalchecked = e.target.checked;
    state.rows[key].checkBoxListrow.forEach((ele, index) => {
      if (ele.additional_permissions) {
        ele.additional_permissions.forEach((k, v) => {
          ele.additional_permissions[v][keyName] = e.target.checked;
          if (k[keyName] == true) {
            trueArray.push({ checked: true })
          }
        })
        allLength = state.rows[key].checkBoxListrow.length + ele.additional_permissions.length
      } else {
        state.rows[key].checkBoxListrow[index][keyName] = e.target.checked;
        if (ele[keyName] == true) {
          trueArray.push({ checked: true })
        }
      }
    });
    if (trueArray.length + 1 == allLength) {
      state.rows[key].totalcheck.totalchecked = true;
    } else {
      state.rows[key].totalcheck.totalchecked = false;
    }

    setState({ ...state })
  };

  //handlechange to check and uncheck the diff values in table

  const handleChangeCheckboxTable = (event, key, checkBox) => {
    var keyName = routeState.state == null && action == false ? "checked" : "is_allowed";
    var trueArray = [];  //defining true array;

    state.rows[key].checkBoxListrow[checkBox][keyName] = event.target.checked;

    state.rows[key].checkBoxListrow.forEach((element, index) => {
      if (element[keyName] == true) {
        trueArray.push({ checked: true })
      }
    });
    if (trueArray.length == state.rows[key].checkBoxListrow.length) {
      state.rows[key].totalcheck.totalchecked = true;
    } else {
      state.rows[key].totalcheck.totalchecked = false;
    }

    setState({ ...state });
  };


  const handleChangeCheckboxPopup = (e, index, key, ind) => {
    var keyName = routeState.state == null && action == false ? "checked" : "is_allowed";
    var trueArray = [];  //defining true array;

    state.rows[index].checkBoxListrow[key].additional_permissions[ind][keyName] = e.target.checked;

    state.rows[index].checkBoxListrow[key].additional_permissions.forEach((element, index) => {
      if (element[keyName] == true) {
        trueArray.push({ checked: true })
      }
    });
    if (trueArray.length == state.rows[index].checkBoxListrow[key].additional_permissions.length) {
      state.rows[index].totalcheck.totalchecked = true;
    } else {
      state.rows[index].totalcheck.totalchecked = false;
    }
    setState({ ...state })
  }

  // handle submit for save button
  const handleSubmit = () => {
    var allRolesArray = [];
    let errors = validateAll();
    console.log(isValid(errors))
    if (isValid(errors)) {
      var data = {
        request_id: LocalStorage.uid(),
        role_name: state.data.name,
        description: state.data.description,
        is_active: 1,
        permissions: []
      }
      var keyName = routeState.state == null && action == false ? "checked" : "is_allowed";
      state.rows.forEach((module, key) => {
        module.checkBoxListrow.forEach((permission) => {
          if (Object.keys(permission)[0] == "additional_permissions") {
            const addArray = Object.values(permission)[0];
            addArray.forEach((item) => {
              data.permissions.push({
                permission_id: item.permission_id,
                is_allowed: item[keyName]
              })
            })

          } else {
            data.permissions.push({
              permission_id: permission.permission_id,
              is_allowed: permission[keyName]
            })
          }
        })
      })

      setState({ ...state });

      Object.keys(state.modules).forEach((permission) => {
        for (let i = 0; i < state.modules[permission].length; i++) {
          if (Object.keys(state.modules[permission][i])[0] == "additional_permissions") {
            const addArray = Object.values(state.modules[permission][i])[0];
            addArray.forEach((item) => {
              allRolesArray.push({
                permission_id: item.permission_id,
                is_allowed: false,
              })
            })
          } else {
            allRolesArray.push({
              permission_id: state.modules[permission][i].permission_id,
              is_allowed: false,
            })
          }
        }
      })
      const allDataPermissionsSet = new Set(data.permissions.map(({ permission_id }) => permission_id));
      const combined = [
        ...data.permissions,
        ...allRolesArray.filter(({ permission_id }) => !allDataPermissionsSet.has(permission_id))
      ];

      data.permissions = combined;
      console.log(data.permissions)

      if (data.permissions.some(p => p.is_allowed === true)) {
        if (editingIndex != null) {
          updateApiCall(data)
        } else {
          createApiCall(data)
        }
      } else {
        setState((prev) => ({ ...prev }))
        console.log(data.permissions.some(p => p.is_allowed === true));

        addWarningMsg("please select the permissions")
      }
    } else {
      console.log(errors)
      setState((prev) => ({ ...prev, error: errors }));
      setErrors(errors);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewClick = (item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_role" && item.is_allowed == true)))) {
      setAction(true);
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(true);
      setEditingIndex(item)
      getRolePermissions(item);
      setDialogTitle("Role Permissions");
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleEditClick = (item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_role" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      getAllPemissionsWithChecked(item)
      setEditingIndex(item)
      setDialogTitle("Edit Role Permissions");
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleDeleteClick = (item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_delete" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_role" && item.is_allowed == true)))) {
      setOpen(true);
      setAlert(true);
      setEditingIndex(item);
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const handleFormEdit = (item) => {
    if (isEditable) {
      setOpen(true);
      setAlert(false)
      setAnchorEl(null);
      setIsEditable(false);
      getAllPemissionsWithChecked(item)
      setDialogTitle("Edit Role Permissions")
    } else {
      handleSubmit();
    }
  }

  const handleDialogClose = () => {
    setOpen(false);
    setIsEditable(true);
    setEditingIndex(null)
    setClone("");
    setErrors({});
  };

  const handleAddNew = () => {
    setOpen(true);
    setAlert(false);
    setState({
      data: {
        name: "",
        description: "",
      },
      error: {},
      rows: [],
      checked: {},
      modules: {},
    })
    setNewRolePermissions()
    setIsEditable(false)
    setEditingIndex(null)
    setDialogTitle("Add New Role")
  }

  const deleteConfirm = (id) => {
    deleteApiCall(id);
    handleDialogClose();
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
          getRolesListing({ ...filter, limit: filter.limit + 10, page: 1, });
        }


        // Reached the bottom of the inner box
        console.log('Reached end of inner box, calling a function...');
        // Call your function here
      }
    }
  };
  //Api integration starts here
  const getRolesListing = (args) => {
    if(filter.limit < 10){
      setLoading(true)
  }else{
      setLoading(false)  
  }
    RoleApi.rolesList(args).then(response => {
      setTimeout(() => {
        setLoading(false)
        if (response.data.statusCode == 1003) {
          setRoles(response.data.data);
          setTotal(response.data.pagination.total)
        } else {
          console.log(response.data.message);
        }
      }, 300)
    })
  }

  const getAllPermissions = async () => {
    var response = await RoleApi.getAllPermission()
    if (response.data.statusCode == 1003) {
      setAllPermissions(response.data.data);
      console.log(response.data.data)
    } else {
      console.log(response.data.message);
    }
  }

  const rolesDropdown = () => {
    RoleApi.rolesDropdown().then(response => {
      console.log(response)
      if (response.data.statusCode == 1003) {
        setCloneArr(response.data.data);
      }
      else {
        console.log(response.data.message, "===========================");
      }
    })
  }

  const updateRoleStatus = (e, item) => {
    if ((LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_role" && item.is_allowed == true)))) {
      const data = { request_id: LocalStorage.uid(), is_active: e.target.checked };
      RoleApi.updateRoleStatus(item.id, data).then(response => {
        if (response.data.statusCode == 1003) {
          getRolesListing(filter);
          
          rolesDropdown();
          addSuccessMsg(response.data.message);
        } else {
          addErrorMsg(response.data.message);
        }
      })
    } else {
      addWarningMsg("You don't have permission to perform this action. Please contact the admin")
    }
  }

  const getRolePermissions = (args) => {
    RoleApi.rolePermissions(LocalStorage.uid(), args).then(response => {

      if (response.data.statusCode == 1003) {
        let { role_name, description, permissions } = response.data.data;
        let dataObj = { ...state.data, 'name': role_name, 'description': description ? description : "" };
        let newRowArr = [];
        Object.keys(permissions).forEach((permission) => {
          for (let i = 0; i < permissions[permission].length; i++) {

            if (permissions[permission][i].is_allowed) {
              let obj = {
                title: permission,
                totalcheck:
                {
                  totalchecked: totalCheckReturn(permissions[permission]),
                  // checked1: totalcheckObjCount.true ? totalcheckObjCount.true < 5 ? true : false : false
                },
                checkBoxListrow: permissions[permission]
              }
              newRowArr.push(obj);
            }
          }
        })
        const finalRows = uniqByKeepLast(newRowArr, it => it.title);
        setState((prev) => ({ ...prev, "data": dataObj, "rows": finalRows, "modules": response.data.data.permissions }));
        console.log(finalRows);
        console.log(dataObj);
      }
      else {
        addErrorMsg(response.data.message)
        setState((prev) => ({ ...prev }));
      }
    })
  }

  const getAllPemissionsWithChecked = async (args) => {

    var response = await RoleApi.rolePermissions(LocalStorage.uid(), args)
    if (response.data.statusCode == 1003) {
      let { role_name, description, permissions } = response.data.data;
      let dataObj = { ...state.data, 'name': role_name, 'description': description ? description : "" };
      let newRowArr = [];
      Object.keys(permissions).forEach((permission) => {
        for (let i = 0; i < permissions[permission].length; i++) {

          let obj = {
            title: permission,
            totalcheck:
            {
              totalchecked: totalCheckReturn(permissions[permission]),
            },
            checkBoxListrow: permissions[permission]
          }
          newRowArr.push(obj);
        }
      }
      )

      const finalRows = uniqByKeepLast(newRowArr, it => it.title);
      setState((prev) => ({ ...prev, "data": dataObj, "rows": finalRows, "modules": response.data.data.permissions }));
      console.log(finalRows);
      console.log(dataObj);
    }

  }

  const setNewRolePermissions = () => {

    let dataObj = { ...state.data, 'name': "", 'description': "" };
    let newRowArr = [];
    let newPemissions = allPemissions
    Object.keys(newPemissions).forEach((permission) => {
      for (let i = 0; i < newPemissions[permission].length; i++) {
        if (newPemissions[permission][i]['additional_permissions'] !== undefined) {
          for (const addPermissions in newPemissions[permission][i]['additional_permissions']) {
            newPemissions[permission][i]['additional_permissions'][addPermissions].is_allowed = false
          }
          continue
        }
        newPemissions[permission][i].is_allowed = false
        let obj = {
          title: permission,
          totalcheck:
          {
            totalchecked: totalCheckReturn(newPemissions[permission]),
            // checked1: totalcheckObjCount.true ? totalcheckObjCount.true < 5 ? true : false : false
          },
          checkBoxListrow: newPemissions[permission]
        }
        newRowArr.push(obj)
      }
    }
    )
    console.log(newPemissions)
    const finalRows = uniqByKeepLast(newRowArr, it => it.title);
    setState((prev) => ({ ...prev, "data": dataObj, "rows": finalRows, "modules": newPemissions }));
    console.log(finalRows);
    console.log(dataObj);
  }


  const updateApiCall = (data) => {
    if (editingIndex != null) {
      setLoading(true);
      RoleApi.updateRole(editingIndex, data).then((response) => {
        setTimeout(() => {
          setLoading(false);
          if (response.data.statusCode == 1003) {
            addSuccessMsg(response.data.message);
            handleDialogClose();
            getRolesListing(filter);
            getActivity(activityFilter)
          } else {
            addErrorMsg(response.data.message)
          }
        }, 600)
      })
    } else {
      console.log("No index Selected")
    }
  }

  const createApiCall = (data) => {
    setLoading(true);
    RoleApi.storeRole(data).then((response) => {
      setTimeout(() => {
        setLoading(false);
        if (response.data.statusCode == 1003) {
          addSuccessMsg(response.data.message);
          getRolesListing(filter);
          getActivity(activityFilter)
          handleDialogClose()
        } else {
          addErrorMsg(response.data.message)
        }
      }, 600)
    })
  }
  const deleteApiCall = (id) => {
    const data = { request_id: LocalStorage.uid() }
    RoleApi.deleteRole(data, id).then(response => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg(response.data.message);
        getRolesListing(filter);
        getActivity(activityFilter)
      } else {
        addErrorMsg(response.data.message);
      }
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
    RoleApi.rolesList({ ...filter, search: text }).then((res) => {

      setLoading(false);
      setRoles(res.data.data);
      // setPagination(res.data.pagination);
    })
  }
  const closeBtn = () => {
    setLoading(true);
    setFilter({ ...filter, search: "" });
    setTimeout(() => {
      RoleApi.rolesList({ ...filter, search: "" }).then((res) => {
        setLoading(false);
        setRoles(res.data.data);
        // setPagination(res.data.pagination);
      })
    }, 2000);
  }

  // const getActivity = (args) => {
  //   // setLoading(true)
  //   let id = 1;
  //   ConfigApi.getActivity(id, "",args).then((response) => {
  //     setTimeout(() => {
  //       if (response.data.statusCode == 1003) {
  //         // setLoading(false)
  //         setActivityData(response.data.data);
  //         setActivityTotal(response.data.pagination.total)
  //       }
  //     }, 300)

  //   });
  // };

  //validation for save button
  const validateAll = () => {
    let { name } = state.data;
    let errors = {};
    errors.name = validate_charWithSpace(name);
    console.log(errors, "errr")
    return errors;
  };

  // function for removing duplicate objects in array
  function uniqByKeepLast(data, key) {
    return [...new Map(data.map(x => [key(x), x])).values()]
  }

  // function for based all boolean values return true or false for total checkbox in row
  const totalCheckReturn = (args) => {
    var trueArray = [];
    var totalcheck = 0
    var keyName = routeState.state == null && action == false ? "checked" : "is_allowed";
    args.forEach((permission) => {
      if (Object.keys(permission)[0] == "additional_permissions") {
        const addArray = Object.values(permission)[0];
        addArray.forEach((item) => {
          totalcheck = totalcheck + 1
          if (item[keyName]) {
            trueArray.push(item[keyName]);
          }
        })
      } else {
        totalcheck = totalcheck + 1
        if (permission[keyName]) {
          trueArray.push(permission[keyName]);
        }
      }
    });
    if (totalcheck == trueArray.length) {
      return true;
    } else {
      return false;
    }
  }

  const ascendingOrder = (param) => {
    const numAscending = param.sort((a, b) => a.permission_id - b.permission_id);
    return numAscending;
  }

  const Tablerow = (props) => {

    const { row, index } = props;
    const checkForFullAccess = () => {
      for (const obj in row.checkBoxListrow) {
        if (row.checkBoxListrow[obj]['additional_permissions'] !== undefined) {
          for (const permission in row.checkBoxListrow[obj]['additional_permissions']) {
            if (row.checkBoxListrow[obj]['additional_permissions'][permission].is_allowed === false) {
              return false
            }
          }
        }
        else if (row.checkBoxListrow[obj]['is_allowed'] === false) {
          return false
        }
      }
      return true
    }
    return (
      <>
        <StyledTableRow >
          <StyledTableCell>{row.title}</StyledTableCell>
          <StyledTableCell>
            <Checkbox
              size="small"
              checked={checkForFullAccess()}
              // indeterminate={row.totalcheck.checked1}
              onClick={(event) => handlechangeTableSelectAll(event, index)}
              icon={isEditable ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
              checkedIcon={isEditable ? <CheckedDisabled /> : <CheckedIcon />}
              disabled={isEditable}
            />
          </StyledTableCell>

          {ascendingOrder(row.checkBoxListrow).map((ele, key) => (
            <>
              {
                ele.permission_name == "Create" ?
                  <StyledTableCell>
                    <Checkbox size="small"
                      checked={action || routeState.state != null ? ele.is_allowed : ele.checked}
                      onClick={(event) => handleChangeCheckboxTable(event, index, key)}
                      icon={isEditable ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                      checkedIcon={isEditable ? <CheckedDisabled /> : <CheckedIcon />}
                      disabled={isEditable}
                    />
                  </StyledTableCell>
                  :
                  ele.permission_name == "Edit" ?
                    <StyledTableCell>
                      <Checkbox size="small"
                        checked={action || routeState.state != null ? ele.is_allowed : ele.checked}
                        onClick={(event) => handleChangeCheckboxTable(event, index, key)}
                        icon={isEditable ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                        checkedIcon={isEditable ? <CheckedDisabled /> : <CheckedIcon />}
                        disabled={isEditable}
                      />
                    </StyledTableCell>
                    :
                    ele.permission_name == "View" ?
                      <StyledTableCell>
                        <Checkbox size="small"
                          checked={action || routeState.state != null ? ele.is_allowed : ele.checked}
                          onClick={(event) => handleChangeCheckboxTable(event, index, key)}
                          icon={isEditable ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                          checkedIcon={isEditable ? <CheckedDisabled /> : <CheckedIcon />}
                          disabled={isEditable}
                        />
                      </StyledTableCell>
                      :
                      ele.permission_name == "Delete" &&
                      <StyledTableCell>
                        <Checkbox size="small"
                          checked={action || routeState.state != null ? ele.is_allowed : ele.checked}
                          onClick={(event) => handleChangeCheckboxTable(event, index, key)}
                          icon={isEditable ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                          checkedIcon={isEditable ? <CheckedDisabled /> : <CheckedIcon />}
                          disabled={isEditable}
                        />
                      </StyledTableCell>
              }

            </>
          )
          )}


          {row.checkBoxListrow.map((ele, key) => (
            (ele.additional_permissions && ele.additional_permissions.length > 0) &&
            <StyledTableCell>
              <PopupState variant="popover" popupId="demo-popup-popover" >
                {(popupState) => (
                  <div>
                    <IconButton
                      {...bindTrigger(popupState)}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Popover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      // sx={{
                      //   transform: 'translateX(-50px) translateY(12px)',
                      // }}
                      className={customTableStyles.popover}
                    >
                      <Stack direction={'column'}>

                        {ele.additional_permissions.map((val, ind) => {
                          return (
                            <FormControlLabel
                              fullWidth
                              sx={{
                                m: 0,
                                width: '161px',
                                height: '46px',
                                fontSize: '12px',
                                '& .MuiFormControlLabel-label': {
                                  font: '12px Nunito',
                                  fontWeight: "500",
                                  color: "#262626"
                                },
                              }}
                              key={ind}
                              label={val.permission_name}
                              control={<Checkbox size="small"
                                checked={action || routeState.state != null ? val.is_allowed : val.checked}
                                onClick={(event) => handleChangeCheckboxPopup(event, index, key, ind, popupState)}
                                icon={isEditable ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                                checkedIcon={isEditable ? <CheckedDisabled /> : <CheckedIcon />}
                                disabled={isEditable}
                              />}
                            />

                          )
                        })
                        }
                      </Stack>
                    </Popover>
                  </div>
                )}
              </PopupState>
            </StyledTableCell>
          ))
          }
        </StyledTableRow >
      </>
    )
  }

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: "",
  });
  

  const [total, setTotal] = useState()

  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
    }}>
      <Box className={classes.activeItemBox}>
        <Box className={classes.activeBoxHeading}>
          {/* <Text sx={{ font: "16px Nunito !important", fontWeight: "500 !important" }} >Roles</Text> */}

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
            loading ?
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
            roles.map((item, index) => (
              <Box className={classes.descriptionBoxStyle} key={index} mb={2}>
                <Grid container alignItems="center">
                  <Grid item lg={10} md={8} sm={8} xs={12} container direction={'column'} gap={1}>
                    <Text sx={{ font: "14px Nunito !important", fontWeight: "600 !important" }}> {item.name}</Text>
                    <Text sx={{ font: "12px Nunito !important", fontWeight: "500 !important", color: "#737373 !important" }}>{item.description}</Text>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12} container alignItems={'center'}>
                    <ToggleSwitch switchChange={(e) => updateRoleStatus(e, item)} isActive={item.is_active} sx={{ height: '24px !important' }} />
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12} container alignItems={'center'} justifyContent={'center'}>
                    <CustomMenu
                      anchorEl={anchorEl}
                      isOpen={Boolean(anchorEl)}
                      onClose={handleClose}
                      children={[
                        { color: '#171717', label: "View", Click: () => handleViewClick(item.id) },
                        { color: '#171717', label: "Edit", Click: () => handleEditClick(item.id) },
                        { color: '#171717', label: "Delete", Click: () => handleDeleteClick(item.id) },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
        {
          (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_role" && item.is_allowed == true))) ?
            <Button blueHoverBtn onClick={handleAddNew}>Add New</Button> :
            <Button addTitleBtnDisable>Add New</Button>
        }
        </Box>
        {
          alert ? <AlertBox handleDialogClose={handleDialogClose} handleDelete={() => { deleteConfirm(editingIndex) }} open={open} /> :
            <BootstrapDialog
              keepMounted
              onClose={handleDialogClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              fullWidth={true}
              maxWidth={"lg"}
            >
              <DialogContent >
                <Box padding={'38px 30px 35px 30px '}>
                  <Box mb={4}>
                    <Text blackHeader18>{dialogTitle}</Text>
                  </Box>
                  <Box mt={'32px'} mb={'32px'}>
                    <Grid container spacing={4}>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'name',
                            value: state.data.name,
                            type: 'text',
                            disabled: isEditable,
                          }}
                          clientInput
                          labelText={'Name'}
                          handleChange={handleInputChange}
                        />
                        {errors.name ? <Text red>{errors.name}</Text> : ""}
                        {/* {state.error.name ? <Text red>{state.error.name}</Text> : ""} */}
                      </Grid>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Box >
                          <CustomSelect
                            commonSelect
                            label={'Clone As'}
                            name='clone'
                            value={clone}
                            onChange={handleClone}
                            options={cloneArr}
                            disabled={isEditable}
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'description',
                            value: state.data.description,
                            type: 'text',
                            disabled: isEditable,
                          }}
                          clientInput
                          labelText={'Description'}
                          handleChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    {/* <CustomRowTable rolesIndex={rolesIndex} isEditable={isEditable} /> */}
                    <TableContainer className={customTableStyles.tableContainer}>
                      <Table stickyHeader style={{ "borderCollapse": "collapse" }}>
                        <TableHead>
                          {Header.map((head, index) => (
                            <StyledTableCell width={head.width} key={index}>{head.name}</StyledTableCell>
                          ))}
                        </TableHead>
                        <TableBody>
                          {state.rows.map((row, index) => (
                            routeState.state == null ?
                              <>
                                <Tablerow row={row} index={index} />
                              </>
                              :
                              row.checkBoxListrow.some(a => a.is_allowed) ?
                                <>
                                  <Tablerow row={row} index={index} />
                                </>
                                : null
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Stack justifyContent="flex-end" direction="row" gap={'20px'} mt={'30px'}>
                    <Button
                      cancelOutline
                      sx={{
                        width: "103px !important",
                        height: "42px !important",
                      }}
                      onClick={handleDialogClose}
                    >
                      <Typography sx={{ font: "18px Nunito", fontWeight: "500" }}>Cancel</Typography>
                    </Button>
                    {/* <Button saveBtn sx={{
                      width: "88px !important",
                      height: "42px !important"
                    }}
                      onClick={() => handleFormEdit(editingIndex)}>{isEditable ? 'Edit' : 'Save'}
                    </Button> */}
                    <LoadingButton
                      saveBtn
                      sx={{
                        width: "88px !important",
                        height: "42px !important"
                      }}
                      loading={loading} onClick={() => handleFormEdit(editingIndex)}>
                      {isEditable ? 'Edit' : 'Save'}
                    </LoadingButton>
                  </Stack>
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
  )
}

export default Role;
