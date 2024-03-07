import { Box, Grid, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Text from '../../../components/customText/Text'
import Input from '../../../components/input/Input'
import SearchSelect from '../../../components/selectField/SearchSelect';
import RadioGroup from '../../../components/customButton/RadioGroup';
import PlacementApi from '../../../apis/admin/placements/PlacementApi';
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import LocalStorage from '../../../utils/LocalStorage';
import Button from '../../../components/customButton/Button';
import CommonApi from '../../../apis/CommonApi';

function PayrollUpdate({ setOpen,id }) {
    const [hours, setHours] = useState(0);
    const [cycleDropdown, setCycleDropdown] = useState([]);
    const [enablePayroll, setEnablePayroll] = useState(true);
    const [enable_balance_sheet, setEnableBalanceSheet] = useState(true);
    const [payrollId, setpayrollId] = useState('');

    const payrollItems = [
        { id: 'true', value: true, title: <Text label>Yes</Text> },
        { id: 'false', value: false, title: <Text label>No</Text> },
    ]

    useEffect(() => {
        getCycledropdown();
    }, [])

    const getCycledropdown = () => {
        CommonApi.payrollConfigDropdown().then((response) => {
            if (response.data.statusCode == 1003) {
                setCycleDropdown(response.data.data);
            }
        });
    }

    const updatePayroll = () => {
        const data = {
            request_id: LocalStorage.uid(),
            employee_id: id,
            enable_payroll: enablePayroll,
            payroll_config_settings_id: payrollId,
            hours_worked: hours,
            enable_balance_sheet: enable_balance_sheet
        }
        PlacementApi.updatePayroll(data).then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg('Payroll Added Successfully');
                setOpen(false);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    return (
        <>
            <Grid container p={'5px 10px 5px 10px'} spacing={2}>
                <Grid item lg={12}>
                    <Text largeBlack>Add Opening Balance</Text>
                </Grid>
                <Grid item lg={12}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        clientInput
                        inputProps={{
                            name: 'hours',
                            value: hours
                        }}
                        handleChange={(e) => setHours(e.target.value)}
                        labelText={<Text mediumLabel>Hours</Text>}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Text mediumLabel>Enable Payroll</Text>
                    <RadioGroup row
                        name='enablePayroll'
                        value={enablePayroll}
                        onChange={(e) => setEnablePayroll(e.target.value)}
                        items={payrollItems}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Text mediumLabel>Enable Balance Sheet</Text>
                    <RadioGroup row
                        name='enable_balance_sheet'
                        value={enable_balance_sheet}
                        onChange={(e) => setEnableBalanceSheet(e.target.value)}
                        items={payrollItems}
                    />
                </Grid>
            </Grid>
            {
                enablePayroll &&
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box p={1}>
                        <SearchSelect
                            name="payrollId"
                            value={payrollId}
                            onChange={(e) => setpayrollId(e.target.value)}
                            options={cycleDropdown}
                            labelText={<Text mediumLabel>Payroll Cycle Name</Text>}
                        />
                    </Box>
                </Grid>
            }
            <Stack pt={4} gap={2} display='flex' flexDirection='row' justifyContent='center'>
                <Button popupSaveBlue onClick={updatePayroll}>Yes</Button>
                <Button popupCancel onClick={() => setOpen(false)}>No</Button>
            </Stack>
        </>
    )
}

export default PayrollUpdate