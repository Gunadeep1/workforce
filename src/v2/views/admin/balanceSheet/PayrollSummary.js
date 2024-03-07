import React from 'react'
import { Grid, Box, } from '@mui/material'
import Text from '../../../components/customText/Text';
import Avatar from '@mui/material/Avatar';
import BalanceSheetStyles from './BalanceSheetStyles';
import { getCurrencySymbol } from "../../../utils/utils";

function PayrollSummary(Props) {
    const { data, img } = Props
    const classes = BalanceSheetStyles();
    const currencySymbol = getCurrencySymbol()

    return (
        <>
            <Grid item container spacing={2} mt={2}>
                <Grid item lg={4} md={4} sm={12}>
                    <Box p={2} className={classes.miniCard}>
                        <Grid item container>
                            <Grid item lg={3} md={3} sm={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Avatar alt='Jacob James' src={img ? img : ''} sx={{ width: '50px', height: "50px" }} />
                            </Grid>
                            <Grid item lg={9} md={9} sm={9}>
                                <Grid item lg={12} md={12} sm={12}>
                                    <Box ml={2}>
                                        <Text boldBlackfont16 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >{data ? data.employee_name : ''}</Text>
                                        <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{data ? data.reference_id : ''}</Text>
                                    </Box>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} mt={2}>
                                    <Box ml={2}>
                                        <Text boldBlackfont16 sx={{ paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} >Total Worked Hours</Text>
                                        <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{data ? data.total_worked_hours : ''}Hrs</Text>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item lg={8} md={8} sm={12}>
                    <Box p={2} className={classes.miniCard}>
                        <Grid item container>
                            <Grid item lg={12} md={12} sm={12}><Text overViewAmount > Payroll Amount </Text></Grid>
                            <Grid item container mt={4}>
                                <Grid item lg={4} md={4} sm={4}>
                                    <Text largeGreyTxt>Total Amount</Text>
                                    <Text overViewAmount >{currencySymbol + " " + data ? data.total_billed_amount : ''}</Text>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4}>
                                    <Text largeGreyTxt>Total Paid Amount</Text>
                                    <Text overViewAmount >{currencySymbol + " " + data ? data.total_paid_amount : ''}</Text>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4}>
                                    <Text largeGreyTxt>Total Balance</Text>
                                    <Text overViewAmount >{currencySymbol + " " + data ? data.total_balance_amount : ''}</Text>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default PayrollSummary
