import React, { useEffect, useState,useRef } from 'react'
import { Box, Grid, Slide, Skeleton, } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import CustomMenu from '../../configComponents/customMenu/Menu'
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';// eslint-disable-next-line
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import AlterBox from '../../configComponents/alertBox/AlertBox';
import LocalStorage from '../../../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../../../utils/utils';
import { isValid, validate_charWithSpace, validate_emptyField, } from '../../../../../components/Validation';
import PrefixApi from '../../../../../apis/configurations/prefixes/PrefixApi';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import ConfigApi from '../../../../../apis/configurations/ConfigApi';

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

function Prefixes({ current }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = useState(false);// eslint-disable-next-line
    const [activitydata, setActivitydata] = useState([]);// eslint-disable-next-line
    const [, setPage] = useState(1);
    const [getData, setGetData] = useState([]);// eslint-disable-next-line 
    const [data, setData] = useState(null);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [btnloading, setBtnLoading] = useState(false);
    const activityRef =  useRef(null);
    const [activityTotal,setActivityTotal] = useState()

    const [state, setState] = useState({
        request_id: LocalStorage.uid(),
        id: "",
        module: "",
        prefix_name: "",
        separator: "",
        number: ""
        // prefixes: [

        // ]
    })

    // const handleMenuClick = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };
    const [activityFilter,setActivityFilter]=useState({
        limit: 10,
        page: 1,
      })
    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
            getApi();
            getActivity(activityFilter)
        }, 500)
        // eslint-disable-next-line
    }, [])

    // eslint-disable-next-line
    const [activityData, setActivityData] = useState([])

    const getActivity = (args) => {
        setLoading(true)
        let id = 24;
        ConfigApi.getActivity(id, "",args).then((response) => {
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



    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInputChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        }, handleValidate(e.target));
    };

    const handleValidate = (input) => {

        let updatedErrors = { ...error };
        switch (input.name || input.tagName) {
            case 'module':
                updatedErrors.module = validate_charWithSpace(input.value)
                break
            case 'prefix_name':
                updatedErrors.prefix_name = validate_charWithSpace(input.value)
                break
            case 'separator':
                updatedErrors.separator = validate_emptyField(input.value)
                break
            case 'number':
                updatedErrors.number = validate_emptyField(input.value)
                break
            default:
                break
        }
        setError(updatedErrors)
    }

    const handleDialogClose = () => {
        setLoading(true)
        setTimeout(() => {
            setOpen(false);
            setLoading(false)
        }, 500)
        setError({});
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleViewClick = (data) => {
        if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_view" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_organization" && item.is_allowed == true))) {
            setOpen(true);
            // setAlert(false)
            // setAnchorEl(null);
            setIsEditable(true);
            setState(data)
            // setAction('view')
        } else {
            addWarningMsg("You don't have permission to perform this action. Please contact the admin")
        }
    }

    const updateApi = (args) => {
        let data = {
            request_id: LocalStorage.uid(),
            prefixes: [{
                id: state.id,
                prefix_name: state.prefix_name,
                separator: state.separator,
                number: state.number,
            }],

        }
        let name = state.module
        setLoading(true)
        setBtnLoading(true)
        PrefixApi.updatePrefix(data).then((res) => {

            if (res.data.statusCode === 1003) {
                setTimeout(() => {
                    addSuccessMsg(`${name} ${res.data.message}`)
                    setLoading(false)
                    setBtnLoading(false)
                    setOpen(false);
                    getApi();
                    getActivity(activityFilter)
                }, 800)

            } else {
                addErrorMsg(res.data.message);
                setOpen(false);
            }
        })
    }

    const handleEditClick = (args) => {
        if (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_organization" && item.is_allowed == true))) {
            setTimeout(() => {
                setOpen(true);
            }, 900)
            setAlert(false)
            setAnchorEl(null);
            setIsEditable(false);
            setId(args.id);
            setState(args);
        } else {
            addWarningMsg("You don't have permission to perform this action. Please contact the admin")
        }
    };
    const [id, setId] = useState("");

    const validateAll = () => {
        let { module, prefix_name, separator, number } = state;
        let errors = {};
        errors.module = validate_emptyField(module);
        errors.prefix_name = validate_emptyField(prefix_name)
        errors.separator = validate_emptyField(separator)
        errors.number = validate_emptyField(number)
        return errors;
    };

    const handleSubmit = (e, index) => {
        e.preventDefault();
        let errors = validateAll();
        if (isValid(errors)) {
            if (id != "") {

                updateApi(index)
            }
        } else {
            let s1 = { error };
            s1 = errors;
            setError(s1);
        }
    }

    console.log(getData, "getttt")
    const getApi = () => {
        setLoading(true)
        setBtnLoading(true)
        PrefixApi.getPrefix(
            LocalStorage.uid(),
            LocalStorage.getAccessToken()
        ).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setGetData(response.data.data);
                    setLoading(false)
                    setBtnLoading(false)
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
            if(activityTotal>=activityFilter.limit){
              setActivityFilter({...activityFilter, limit: activityFilter.limit + 10, page: 1 })
              getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1,});
            }
           
    
            // Reached the bottom of the inner box
            console.log('Reached end of inner box, calling a function...');
            // Call your function here
          }
        }
      };
    return (
        <Box sx={{
            height: '75vh',

            padding: '16px',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        }}>
            <Box className={classes.activeItemBox} >
                <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
                <Box sx={{
                    height: '85vh',
                    overflow: 'auto',
                    padding: '16px',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    {loading ? <>
                        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                            <Grid container key={index} mt={3} className={classes.descriptionBoxStyle}>
                                <Grid item lg={3}>
                                    <Skeleton animation="wave" width="130px" />
                                </Grid>
                                <Grid item lg={3}>
                                    <Skeleton animation="wave" width="80px" />
                                </Grid>
                                <Grid item lg={2}>
                                    <Skeleton animation="wave" width="30px" />
                                </Grid>
                                <Grid item lg={2}>
                                    <Skeleton animation="wave" width="20px" />
                                </Grid>
                                <Grid item lg={2}>
                                    <Skeleton animation="wave" width="30px" />
                                </Grid>
                            </Grid>

                        ))}



                    </>
                        :
                        <>

                            <Grid container alignItems='center'>
                                <Grid item lg={4} md={4} sm={4} xs={12} ml={1}>
                                    <Text smallGreyText>Module</Text>

                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={12} ml={5}>
                                    <Text smallGreyText>Prefix</Text>

                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={12} ml={3}>
                                    <Text smallGreyText> Seperator</Text>

                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={12}>
                                    <Text smallGreyText>Number</Text>

                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={12} ml={2}>
                                    <Text smallGreyText>Actions</Text>

                                </Grid>
                            </Grid>

                            {getData.map((item, index) => (
                                <Box className={classes.descriptionBoxStyle} key={index} mt={2}>
                                    <Grid container alignItems="center">
                                        <Grid item lg={5} md={5} sm={5} xs={12} container direction={'column'} gap={1}>
                                            <Text mediumBlackColor > {item.module}</Text>
                                        </Grid>
                                        <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                                            {/* <Text mediumBlackColor>Modified By</Text> */}
                                            <Text greyLabel>{item.prefix_name}</Text>
                                        </Grid>
                                        <Grid item lg={2} md={2} sm={2} xs={12} container alignItems={'center'}>
                                            <Text greyLabel>{item.separator}</Text>
                                        </Grid>
                                        <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                                            <Text greyLabel>{item.number}</Text>
                                        </Grid>
                                        <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'} justifyContent={'center'}>

                                            <CustomMenu
                                                Icon={<MenuIcon />}
                                                handleMenuClick={handleMenuClick}
                                                anchorEl={anchorEl}
                                                isOpen={Boolean(anchorEl)}
                                                onClose={handleClose}
                                                children={[{ color: 'black', label: "View", Click: () => handleViewClick(item) },
                                                { color: '#0C75EB', label: "Edit", Click: () => handleEditClick(item) },
                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </>
                    }

                </Box>

                {alert ? <AlterBox handleDialogClose={handleDialogClose} open={open} /> :

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
                                    <Text blackHeader1>Prefix</Text>
                                </Box>
                                <Grid container spacing={'32px'}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'module',
                                                value: state.module,
                                                type: 'text',
                                                disabled: isEditable ? true : false,
                                            }}
                                            clientInput
                                            handleChange={handleInputChange}
                                            labelText={'Name'}
                                        />
                                        {error.module ? <Text red>{error.module}</Text> : ""}
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'prefix_name',
                                                value: state.prefix_name,
                                                type: 'text',
                                                disabled: isEditable ? true : false,
                                            }}
                                            handleChange={handleInputChange}
                                            clientInput
                                            labelText={'Prefix'}
                                        />
                                        {error.prefix_name ? <Text red>{error.prefix_name}</Text> : ""}

                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'separator',
                                                value: state.separator,
                                                type: 'text',
                                                disabled: isEditable ? true : false,
                                            }}
                                            handleChange={handleInputChange}
                                            clientInput
                                            labelText={'Seperator'}
                                        />
                                        {error.separator ? <Text red>{error.separator}</Text> : ""}

                                    </Grid>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'number',
                                                value: state.number,
                                                type: 'text',
                                                disabled: isEditable ? true : false,
                                            }}
                                            handleChange={handleInputChange}
                                            clientInput
                                            labelText={'Number'}
                                        />
                                        {error.number ? <Text red>{error.number}</Text> : ""}

                                    </Grid>
                                </Grid>
                                <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>

                                    <Button cancelOutline onClick={handleDialogClose}>
                                        Cancel
                                    </Button>
                                    {isEditable && (
                                        <Button saveVerySmall onClick={() => handleEditClick(state)}>
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
                    </BootstrapDialog>}
            </Box>
            <Box className={classes.activeItemBox} mt={4}>
                <Box mb={3}>
                    <Text RegularBlack1>Recent Activities</Text>
                </Box>
                <Box sx={{
                    height: '40vh', overflowY: 'auto', '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
                ref={activityRef}
                onScroll={activityHandleScroll}>
                    {activityData.length > 0 && activityData.map((value) => (
                        <Box className={classes.descriptionBoxStyle} mb={2}>
                            <Grid container spacing={6}>
                                <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                                    <Text mediumBlackColor>{value.created_by}</Text>
                                    <Text greyLabel>{value.created_at}</Text>
                                </Grid>
                                <Grid item lg={8} md={8} sm={6} xs={12} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                                    <Text BrowmnMnStepperText sx={{ color: "#404040 !important" }}>{value.field_changes === "[]" ? "" : value.field_changes}</Text>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default Prefixes;
