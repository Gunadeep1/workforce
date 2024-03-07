import { Box, Divider, Grid } from '@mui/material'
import React from 'react'
import CustomSelect from '../../../../components/customSelect/CustomSelect'
import Input from '../../../../components/input/Input'
import Text from '../../../../components/customText/Text'
import RadioGroup from '../../../../components/customButton/RadioGroup'
import LayoutStyles from '../LayoutStyles'

function ViewBills({ fetch, setFetch, empId, billDetails }) {
    const classes = LayoutStyles();
    
    const otPayRateConfigOptions = [
        { id: 1, title: <Text mediumLabel>Same as Payrate</Text>, value: 1 },
        { id: 2, title: <Text mediumLabel>Fixed Value</Text>, value: 2 },
        { id: 3, title: <Text mediumLabel>Variable</Text>, value: 3 }
    ]
    const billOptions = [
        {
            value: "Hourly",
            id: 1
        }
    ]
    const discountTypeList = require('../../../../utils/jsons/DiscountType.json');
    return (
        <Grid item lg={12} md={12} sm={12} xs={12} mt={{ lg: 0, md: 0, sm: 1, xs: 1 }} className={classes.scrollCard} p={2}>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12}> <Text boldBlackfont16>Billing Details</Text></Grid>
            </Grid>
            {
                billDetails.map((item, index) => (
                    <Grid container lg={12} md={12} sm={12} xs={12} pt={index == 0 || index == 1 ? 3 : 1} pr={{ lg: 1, md: 1, sm: 0 }}>
                        <Grid item lg={12} md={12} sm={12} xs={12} pl={1}><Text boldBlackfont16>{index == 0 ? 'New Billing Details' : index == 1 ? 'Old Billing Details' : ''}</Text></Grid>
                        <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={4}>
                            <Grid item lg={5} md={6} sm={6} xs={12}>
                                <CustomSelect
                                    disabled
                                    name='bill_type'
                                    value={item.bill_type}
                                    commonSelect
                                    label={<Text largeLabel>Bill Rate Type </Text>}
                                    options={billOptions}
                                />
                            </Grid>
                            <Grid item lg={5} md={6} sm={6} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'bill_rate',
                                        value: item.bill_rate,
                                        disabled: "disabled"
                                    }}
                                    clientInput
                                    labelText={<Text largeLabel>Bill Rate / Hour</Text>}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={{ lg: 4, md: 3, sm: 3, xs: 0 }} pt={2}>
                            <Grid item lg={5} md={6} sm={6} xs={12}>
                                <CustomSelect
                                    name='bill_rate_discount_type'
                                    value={item.bill_rate_discount_type}
                                    disabled
                                    commonSelect
                                    label={<Text largeLabel>Discount Type </Text>}
                                    options={discountTypeList}
                                />
                            </Grid>
                            <Grid item lg={5} md={6} sm={6} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'bill_rate_discount',
                                        value: item.bill_rate_discount,
                                        disabled: "disabled"
                                    }}
                                    clientInput
                                    labelText={<Text largeLabel>Bill Discount <span style={{ color: "#C7CCD3" }}>( Optional )</span> </Text>}
                                />
                            </Grid>
                        </Grid>                      
                        <Grid container spacing={4} pt={2}>
                            <Grid item lg={5} md={6} sm={6} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'ot_bill_rate',
                                        value: item.ot_bill_rate,
                                        disabled: "disabled"
                                    }}
                                    clientInput
                                    labelText={<Text largeLabel>OT Bill  Rate<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>} />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Box pt={0}>
                                    <Text largeLabel>OT Pay Rate Config Type</Text></Box>
                                <RadioGroup
                                    row
                                    name='ot_pay_rate_config_type'
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: 18,
                                        },
                                    }}
                                    disabled
                                    value={item.ot_pay_rate_config_type}
                                    items={otPayRateConfigOptions}
                                />
                            </Grid>

                        </Grid>
                        <Grid container spacing={4} pt={2}>
                            {((item.ot_pay_rate_config_type == 3) || (item.ot_pay_rate_config_type == '3')) &&
                                <Grid item lg={5} md={6} sm={6} xs={12}>
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'ot_pay_rate_multiplier',
                                            value: item.ot_pay_rate_multiplier,
                                            disabled: "disabled"
                                        }}
                                        clientInput
                                        labelText={<Text largeLabel>OT Pay Rate Multiplier</Text>}
                                    />
                                </Grid>
                            }
                            <Grid item lg={5} md={6} sm={6} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'ot_pay_rate',
                                        value: item.ot_pay_rate,
                                        disabled: true
                                    }}
                                    clientInput
                                    labelText={<Text largeLabel>OT Pay Rate </Text>}
                                />
                            </Grid>                            
                        </Grid>
                        {
                            billDetails.length == index + 1 ? '' : <Divider sx={{ margin: '20px 0px 0px 0px !important', width: '100%' }} />
                        }
                    </Grid>
                ))
            }
        </Grid>
    )
}
export default ViewBills