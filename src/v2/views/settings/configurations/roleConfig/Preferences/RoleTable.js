import React from 'react'
import { Box, Breadcrumbs, Grid, Link } from '@mui/material'
import MainStyles from '../../MainStyles'
import Text from '../../../../../components/customText/Text'
import Input from '../../../../../components/input/Input'
import CustomSelect from '../../../../../components/customSelect/CustomSelect'
import { useNavigate } from "react-router-dom";
import CustomRoleTable from '../../configComponents/dataTable/dataTable/CustomRoleTable';
function RoleTable() {
    const classes = MainStyles()


    const navigate = useNavigate();
    return (
        <Box className={classes.mainBox}>
            <Box ml={14} width={'86%'}>
                <Box className={classes.topView}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Text component={Link}  className={classes.breadcrumbsLink}  onClick={() => navigate("/configuration")}>Organization Config</Text>
              
                            <Text className={classes.breadcrumbsLink}>Role</Text>
                
                        <Text className={classes.breadcrumbsName}>Add New Role</Text>
                    </Breadcrumbs>
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
                                    value: '',
                                    type: 'text',
                                }}
                                clientInput
                                labelText={'Name'}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <Box >
                                <CustomSelect
                                    commonSelect
                                    label={'Clone As'}
                                    name='Clone As'
                                ></CustomSelect>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'description',
                                    value: '',
                                    type: 'text',
                                }}
                                clientInput
                                labelText={'Description'}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <CustomRoleTable />
                </Box>
            </Box>
        </Box>
    )
}

export default RoleTable