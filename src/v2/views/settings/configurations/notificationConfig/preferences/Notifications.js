import React, { useState, useEffect,useRef } from 'react'
import { Box, Autocomplete, TextField, Chip, Grid, Stack } from '@mui/material';
import Text from '../../../../../components/customText/Text';
import Plus from '../../../../../assets/svg/plus.svg';
import Button from '../../../../../components/customButton/Button';
import MainStyles from '../../MainStyles'
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import NotificationsApi from '../../../../../apis/configurations/notifications/NotificationsApi';
import { addErrorMsg, addSuccessMsg } from "../../../../../utils/utils";
import Input from '../../../../../components/input/Input';
import LoaderIcon from '../../../../../assets/svg/sandtimer.svg';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';


function Invoices({ current }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()

    const [employees, setEmployees] = useState([]);
    const [templates, setTemplates] = useState([])
    const [notificationTemplate, setNotificationTemplate] = useState("");
    const [loading, setLoading] = useState(false)
    const [indexData, setIndexData] = useState([])
    const [btnLoading, setBtnLoading] = useState(false)
    const activityRef =  useRef(null);

    useEffect(() => {
        callNotificationsIndexAPI();
        getAssignedToDropdownList();
        getTemplatesDropdownList()
        getActivity(activityFilter)
        // eslint-disable-next-line
    }, [current])
    const [activityFilter,setActivityFilter]=useState({
        limit: 10,
        page: 1,
      })
    const [activityData, setActivityData] = useState([])
    const [activityTotal,setActivityTotal] = useState()
    const getActivity = (args) => {
        setLoading(true)
        let id = 28;
        ConfigApi.getActivity(id, current.slugId,args).then((response) => {
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
    // referrable_name
    const callNotificationsIndexAPI = () => {
        let slug = current.slug;
        setLoading(true);
        NotificationsApi.getNotificationIndexData(slug).then((response) => {
            setTimeout(() => {
                setLoading(false);
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        setIndexData(response.data.data[0])
                    }
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

    const getTemplatesDropdownList = () => {
        let slug = current.slug
        NotificationsApi.getTemplatesDropdown(slug).then((response) => {
            if (response.data.statusCode == 1003) {
                setTemplates(response.data.data);
            }
        })
    }

    const handleSave = () => {
        setBtnLoading(true)
        indexData['request_id'] = LocalStorage.uid()
        NotificationsApi.updateNotification(indexData).then((response) => {
            setTimeout(() => {
                setBtnLoading(false)
                if (response.data.statusCode === 1003) {
                    callNotificationsIndexAPI()
                    getActivity()
                    addSuccessMsg('Updated Successfully');
                }
                else {
                    addErrorMsg(response.data.message);
                }
            }, 600)
        })
    }

    const handleChangeMembers = (e, newValue) => {
        console.log(e.target.value, "  e.target");

        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newValue[newValue.length - 1];
            console.log(newValue[newValue.length - 1], " *************** newValue");
            let members = indexData.assignee_employee_ids ? indexData.assignee_employee_ids : [];
            console.log(members, 'members')
            if (!Array.isArray(members)) {
                console.error("state.assignee_employee_ids is not an array");
                return;
            }

            let membersArr = [...members];
            if (Array.isArray(membersArr) && membersArr.filter((i) => i.employee_id === id).length === 0) {
                membersArr.push({ id: '', employee_name: value, employee_id: id });
                // let target = { name: 'assignee_employee_ids', value: membersArr }
                setIndexData({ ...indexData, assignee_employee_ids: membersArr },); //handleValidate(target)
            }

        }
    };

    const [deletedchips, setDeletedchips] = useState([]);
    const handleDeleteEmployee = (key, index) => {
        let members = indexData.assignee_employee_ids
        let newArr = members
        let deletedChipsArr = deletedchips;
        if (newArr[key].id !== '') {
            deletedChipsArr.push(newArr[index]);
        }
        newArr.splice(key, 1);
        // setState({ ...state, members })
        setDeletedchips([...deletedChipsArr]);
    }

    const handleAddTemplate = (e) => {
        var finalText = indexData.template + notificationTemplate
        setIndexData({
            ...indexData,
            template: finalText
        })
    }

    const handleChange = (e) => {
        setIndexData({
            ...indexData,
            [e.target.name]: e.target.value
        });
    }
    const activityHandleScroll = () => {
        const { current } = activityRef;
        if (current) {
          const { scrollTop, scrollHeight, clientHeight } = current;
          if (scrollTop + clientHeight >= scrollHeight) {
            // getCategory({...filter})
            if(activityTotal>=activityFilter.limit){
              setActivityFilter({...activityFilter, limit: activityFilter.limit + 10, page: 1 })
              getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1,});
            }
           
    
            // Reached the bottom of the inner box
            console.log('Reached end of inner box, calling a function...');
          
          }
        }
      };
    return (
        loading ?
            // <Box className={classes.ViewContainer}>
            <Box sx={{
                height: '75vh',
                overflow: 'auto',
                padding: '16px',
            }}>
                <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <img src={LoaderIcon} height={100} width={100} alt='loading' />
                    <div>Fetching data...</div>
                </Stack>
            </Box>
            :
            <Box sx={{
                height: '75vh',
                overflow: 'auto',
                padding: '16px',
            }}>
                <Box className={classes.activeItemBox}>
                    <Box sx={{ width: '100%', height: '100%', borderRadius: '12px', }}>
                        <div>{current.name}</div>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", border: `1px solid #C7CCD3`, borderRadius: "8px", mt: '15px' }}>
                            <div style={{ width: '100%', display: 'flex', alignItems: "center", }}>
                                <Autocomplete
                                    multiple
                                    limitTags={2}
                                    id="multiple-limit-tags"
                                    options={employees}
                                    getOptionLabel={(option) => option.value}
                                    name="assignee_employee_ids"
                                    value={indexData.assignee_employee_ids ? indexData.assignee_employee_ids : []}
                                    disabled={false}
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
                                        value.map((option, key) => (
                                            <Chip
                                                key={key}
                                                label={option && option.employee_name}
                                                sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                onDelete={() => handleDeleteEmployee(key)}
                                                disabled={false}
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
                        <Box mt={2}>
                            <Text sx={{ color: "#171717", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '400' }}>Notification Template</Text>
                            <Box mt={2} display={'flex'} gap={2}>
                                <Box width={'80%'}>
                                    <CustomSelect
                                        commonSelectBorderBlue
                                        label={'Choose Field'}
                                        name='template_field'
                                        options={templates}
                                        scrollTrue={true}
                                        onChange={(e) => setNotificationTemplate(e.target.value)}
                                    ></CustomSelect>
                                </Box>
                                <Box width={'20%'}>
                                    <Button
                                        sx={{
                                            width: '100% !important',
                                            height: '95% !important',
                                            font: "14px Nunito, sans-serif !important",
                                            background: `#0C75EB !important`,
                                            color: '#FFFFFF !important',
                                            textTransform: "none !important",
                                            borderRadius: "8px !important",
                                            variant: "outlined"
                                        }}
                                        onClick={(e) => handleAddTemplate()}
                                    ><img src={Plus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />Add</Button>
                                </Box>
                            </Box>
                            <Box mt={2} height={'104px'} width={'100%'} borderRadius={'6px'} >
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    multiline={true}
                                    rows={3}
                                    inputProps={{
                                        name: 'template',
                                        value: indexData.template,
                                        type: 'text',
                                        disabled: false,
                                    }}
                                    descriptionFormControl
                                    descriptionInput
                                    handleChange={handleChange}
                                />
                            </Box>
                            <Box mt={3} gap={1} display={'flex'} justifyContent={'right'}>
                                <Button
                                    sx={{
                                        width: "95px",
                                        height: "42px",
                                        borderRadius: "10px",
                                        border: '1px solid #0C75EB',
                                        color: '#0C75EB',
                                        backgroundColor: '#FFFFFF',
                                        textTransform: 'none',
                                        font: "18px Nunito, sans-serif !important",
                                        fontWeight: `500 !important`,
                                    }}
                                >Cancel</Button>
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_notification" && item.is_allowed == true))) ||
                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_notification" && item.is_allowed == true))) ?
                                        <LoadingButton saveExtraSmall loading={btnLoading} onClick={handleSave}>
                                            Save
                                        </LoadingButton> :
                                        <Button saveLoaderDisable sx={{ height: '42px !important', width: "80px" }}
                                        >Save</Button>
                                }
                            </Box>
                        </Box>
                    </Box>

                </Box>
                <Box className={classes.activeItemBox} mt={4}>
                    <Box mb={3}>
                        <Text blackHeader>Recent Activities</Text>
                    </Box>
                    <Box sx={{
          height: '40vh', overflowY: 'auto',
          //  '&::-webkit-scrollbar': {
          //   display: 'none',
          // },
        }}
        ref={activityRef}
        onScroll={activityHandleScroll}>
                    {activityData.length > 0 && activityData.map((value) => (

                        // (current.name==value.referrable_name)||
                        // (current.name== value.referrable_name)||
                        // (current.name==value.referrable_name)||
                        // (current.name==value.referrable_name)||
                        // (current.name==value.referrable_name)||
                        // (current.name==value.referrable_name)||
                        // (current.name== value.referrable_name)||
                        // (current.name==value.referrable_name)||
                        // (current.name==value.referrable_name)?
                        <Box className={classes.descriptionBoxStyle} mb={2}>
                            {/* {console.log("notify",current.name,value.referrable_name)} */}
                            <Grid container spacing={6}>
                                <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                                    <Text mediumBoldBlack2>{value.created_by}</Text>
                                    <Text lightGrey3>{value.created_at}</Text>
                                </Grid>
                                <Grid item lg={8} md={8} sm={6} xs={12}>
                                    <Text BrowmnMnStepperText>{value.field_changes === '[]' ? '' : value.field_changes}</Text>
                                </Grid>

                            </Grid>
                        </Box>
                        // :null
                    ))}
                    </Box>
                </Box>

            </Box>

    )
};

export default Invoices;