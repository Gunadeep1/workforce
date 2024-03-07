import React, { useEffect, useState } from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import MainStyles from '../../MainStyles'
import Button from '../../../../../components/customButton/Button';
import DefaultInvoiceCycleApi from '../../../../../apis/configurations/invoices/DefaultInvoiceCycleApi';
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import TimeSheetApi from '../../../../../apis/admin/placements/TimeSheetApi';

function DefaultInvoiceCycle({ current }) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()
    const [drop, setDrop] = useState([])
    const [dropdown, setDropdown] = useState([]);
    const [dayslist, setDaysList] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [loading, setLoading] = useState(true);

    const [state, setState] = useState({
        cycle_id: '',
        day_start_id: '',
        id: '',
        is_global: true,
        net_pay_terms_id: ''
    })

    useEffect(() => {
        setTimeout(() => {
            getDepartmentDropdown()
            cycleDropdown()
            indexApi()
            daysDropdown()
        }, 300)

    }, [])
    const handleSaveAndEdit = () => {
        if (isEditable) {
            setIsEditable(false)
        } else {
            updateApi(state.id)
            setIsEditable(true)
        }
    }
    const getDepartmentDropdown = () => {
        DefaultInvoiceCycleApi.dropDownApi().then((response) => {
            if (response.data.statusCode == 1003) {
                setDrop(response.data.data)
            }
        });
    };
    const updateApi = (dataId) => {
        let data = { ...state, request_id: LocalStorage.uid() };

        DefaultInvoiceCycleApi.updateApi(data, dataId).then((response) => {
            if (response.data.statusCode == 1003) {
                indexApi()
                addSuccessMsg(response.data.message);

            } else {
                addErrorMsg(response.data.message);
            }
        });
    };
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    };
    const cycleDropdown = () => {
        CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDropdown(response.data.data);
            }
        });
    };
    const indexApi = () => {
        setTimeout(true)
        DefaultInvoiceCycleApi.indexApi(
        ).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setState({ ...response.data.data[0] })

                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }
    const daysDropdown = () => {
        TimeSheetApi.getDaysDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                setDaysList(response.data.data);
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
                <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
                {
                    loading ? <>
                        {[1].map((item, index) => (
                            <Grid container key={index} spacing={2}>
                                <Grid item lg={6}>
                                    <Skeleton animation="wave" height="100px" />
                                    <Skeleton animation="wave" height="100px" />

                                </Grid>
                                <Grid item lg={6}>
                                    <Skeleton animation="wave" height="100px" />
                                    <Skeleton animation="wave" height="100px" />

                                </Grid>
                            </Grid>
                        ))}



                    </>
                        :
                        <Grid container spacing={'20px'}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box pt={'8px'}>
                                    <CustomSelect
                                        disabled={isEditable}
                                        name={'net_pay_terms_id'}
                                        value={state.net_pay_terms_id}
                                        commonSelect
                                        options={drop}
                                        label={'Payment Terms'}
                                        inputProps={{
                                        }}
                                        onChange={handleChange}
                                    ></CustomSelect>
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box pt={'8px'}>
                                    <CustomSelect
                                        disabled={isEditable}
                                        name={'cycle_id'}
                                        value={state.cycle_id}
                                        commonSelect
                                        options={dropdown}
                                        label={'Invoice Cycle'}
                                        onChange={handleChange}
                                        inputProps={{
                                        }}
                                    ></CustomSelect>
                                </Box>
                            </Grid>
                            {state.cycle_id == 1 || state.cycle_id == 2 ?
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box pt={'8px'}>
                                        <CustomSelect
                                            name={'day_start_id'}
                                            value={state.day_start_id}
                                            disabled={isEditable}
                                            label='Day Starts From'
                                            onChange={handleChange}
                                            options={dayslist}
                                            commonSelect
                                        />
                                    </Box>
                                </Grid> : ""}
                        </Grid>}
            </Box>
            <Box display={'flex'} justifyContent={'end'} mt={'22px'} gap={2}>
                <Button BorderBlueButton sx={{ minWidth: "100px !important" }} onClick={() => indexApi()}>Cancel</Button>
                {
                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_invoice" && item.is_allowed == true))) ?
                        <Button popupSaveBlue onClick={() => handleSaveAndEdit()}>{isEditable ? "Edit" : "Save"}</Button> :
                        <Button popupSaveBlueDisable>{isEditable ? "Edit" : "Save"}</Button>
                }
            </Box>
        </Box>
    )
}

export default DefaultInvoiceCycle;
