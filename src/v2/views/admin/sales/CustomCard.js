import React from 'react';
import { Box, Stack, Avatar, Divider } from '@mui/material';
import InvoiceDashborardStyles from './invoices/InvoicesDashboardStyles';
import { getCurrencySymbol } from '../../../utils/utils';
import Text from '../../../components/customText/Text';
import Skeleton from '@mui/material/Skeleton';

export default function CustomCard({ data, Selected, setSelected, isLoading, handleInvoiceFormData }) {

    const classes = InvoiceDashborardStyles();

    const handleClick = (id) => {
        handleInvoiceFormData(id)
        setSelected(id)
    }
    return (<>
        {
            isLoading ?
                (
                    [1, 2, 3, 4].map((index) => (
                        <Box className={classes.cardView} key={index}>
                            <Stack direction={'row'} justifyContent={'space-between'} px={'20px'}>
                                <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
                                    <Skeleton variant="rounded" width={40} height={40} />
                                    <Stack>
                                        <Skeleton variant="text" sx={{ fontSize: '16px', width: '100px' }} />
                                        <Skeleton variant="text" sx={{ fontSize: '12px', width: '70px' }} />
                                    </Stack>
                                </Stack>
                                <Stack width={'100px'} alignItems={'end'}>
                                    <Skeleton variant="text" sx={{ fontSize: '12px', width: '50px' }} />
                                    <Skeleton variant="text" sx={{ fontSize: '18px', width: '64px' }} />
                                </Stack>
                            </Stack>
                            <Divider />
                            <Stack direction={'row'} justifyContent={'space-between'} px={'20px'}>
                                <Skeleton variant="text" sx={{ fontSize: '12px', width: '100px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '12px', width: '70px' }} />
                            </Stack>
                        </Box>
                    ))

                )
                :
                <Box className={`${Selected == data.id ? classes.cardViewActive : classes.cardView}`} onClick={() => handleClick(data.id)}>
                    <Stack direction={'row'} justifyContent={'space-between'} px={'20px'}>
                        <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
                            <Avatar variant="rounded" sx={{ width: 40, height: 40 }} src={data.company_logo}>{data.company_name[0].toUpperCase()}</Avatar>
                            <Stack>
                                <Text className={classes.heading2}>{data.company_name ? data.company_name : '--'}</Text>
                                <Text className={classes.heading11}>{data.company_reference_id ? data.company_reference_id : '--'}</Text>
                            </Stack>
                        </Stack>
                        <Stack alignItems={'end'}>
                            <Text className={classes.heading12}>{data.invoice_id ? data.invoice_id : '--'}</Text>
                            <Text className={classes.heading1}>{`${getCurrencySymbol()}${data.amount ? data.amount : '--'}`}</Text>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack direction={'row'} justifyContent={'space-between'} px={'20px'}>
                        <Text className={classes.heading11} >{`Date ${data.date ? data.date : '--'}`}</Text>
                        <Text className={classes.heading13}>{data.status ? data.status : '--'}</Text>
                    </Stack>
                </Box>

        }


    </>)
}
