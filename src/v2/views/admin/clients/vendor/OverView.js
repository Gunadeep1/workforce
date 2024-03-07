import { Box,Divider, Stack, Paper } from '@mui/material'
import React, { useEffect } from 'react'
import Text from '../../../../components/customText/Text';
import { styled } from '@mui/material/styles';
import VendorProfileStyles from './VendorProfileStyles';
import { useState } from 'react';
import PieCharts from '../userProfile/PieChart';
import BarChart from '../userProfile/BarChart';
import moment from 'moment';
import ClientsApi from '../../../../apis/admin/clients/ClientsApi';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import { getCurrencySymbol } from '../../../../utils/utils';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: "none",
    width: "100%",
    height: "140px",
}));

function OverView({ id }) {
    const classes = VendorProfileStyles();

    const [filterYear, setFilterYear] = useState('2024');

    const currentYear = moment().year()
    const YearArray = [];
    const filterData = []
    for (let year = currentYear; year <= 2024; year++) {
        YearArray.push(moment().year(year).format('YYYY'))
        for (let i = 0; i < YearArray.length; i++) {
            filterData.push({
                id: YearArray[i],
                value: YearArray[i]
            })
        }
    }

    useEffect(() => {
        getOverView(filterYear);
        // eslint-disable-next-line
    }, []);

    const [overView, setOverView] = useState({
        received_amount: '',
        over_due_amount: '',
        series: [
            {
                name: '',
                data: [],
                color: ''
            },
            {
                name: '',
                data: [],
                color: '',
            }
        ],
        labels: [],
        xaxis: {
            categories: []
        }
    })

    const handleSelectYear = (e) => {
        setFilterYear(e.target.value);
        getOverView(e.target.value);
    }

    const getOverView = (args) => {
        ClientsApi.overView('vendor', id, args).then((res) => {
            if (res.data.statusCode == 1003) {
                setOverView(res.data.data.data[0]);
            }
        })
    }

    return (
        <Box p={2}>
            <Box mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                <Text profileTitle>
                    Overview
                </Text>
            </Box>
            <Box m={1}>
                <Stack
                    width={'100%'}
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                >
                    <Item>
                        <Box sx={{ height: "100%" }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <PieCharts overView={overView} />
                        </Box>
                    </Item>
                    <Item>
                        <Box sx={{ height: "100%" }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Stack spacing={1} direction="row" >
                                <Stack>
                                    <Box sx={{ margin: "4px 0px", height: "14px", width: "14px", backgroundColor: "#78B2F2", borderRadius: "50%" }}></Box>
                                </Stack>
                                <Stack sx={{ minWidth: 0 }}>
                                    <Text mediumOverView>Outstanding Receivables</Text>
                                    <Text mediumViewAmt >{`${getCurrencySymbol()}${overView.received_amount}`}</Text>
                                </Stack>
                            </Stack>
                        </Box>
                    </Item>
                    <Item>
                        <Box sx={{ height: "100%" }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Stack spacing={1} direction="row" >
                                <Stack>
                                    <Box sx={{ margin: "4px 0px", height: "14px", width: "14px", backgroundColor: "#FCA5A5", borderRadius: "50%" }}></Box>
                                </Stack>
                                <Stack sx={{ minWidth: 0 }}>
                                    <Text mediumOverView>Outstanding Receivables</Text>
                                    <Text mediumViewAmt >{`${getCurrencySymbol()}${overView.over_due_amount}`}</Text>
                                </Stack>
                            </Stack>
                        </Box>
                    </Item>
                </Stack>
                <Box mt={2}>
                    <Divider />
                </Box>
                <Box mt={2}>
                    <Box mx={5} px={2}>
                        <Text className={classes.BarChartTitle}>Income</Text>
                        <Box py={1} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack spacing={1} direction="row" gap={'12px'}>
                                <Stack spacing={1} direction="row" >
                                    <Box sx={{ margin: "4px 0px", height: "14px", width: "14px", backgroundColor: "#318CF1", borderRadius: "50%" }}></Box>
                                    <Text mediumOverView>Invoices Raised</Text>
                                </Stack>
                                <Stack spacing={1} direction="row" >
                                    <Box sx={{ margin: "4px 0px", height: "14px", width: "14px", backgroundColor: "#77D2B7", borderRadius: "50%" }}></Box>
                                    <Text mediumOverView>Payments Received</Text>
                                </Stack>
                            </Stack>
                            {/* <ListItemButton onClick={handleClickBarchartYear} sx={{ width: '100%', maxWidth: 100, bgcolor: '#ffffff', '&:hover': { bgcolor: '#ffffff' }, }}>
                                <ListItemText primary={filterYear} />
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseBarchartYear}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                sx={{
                                    '& .MuiPaper-root, .MuiMenu-list': {
                                        padding: '0px ',
                                    },
                                }}
                            >
                                <MenuItem className={classes.barchartYearsmenu} onClick={() => handleSelectYear('All')}>All</MenuItem>
                                <MenuItem className={classes.barchartYearsmenu} onClick={() => handleSelectYear('2021')}>2021</MenuItem>
                                <MenuItem className={classes.barchartYearsmenu} onClick={() => handleSelectYear('2022')}>2022</MenuItem>
                                <MenuItem className={classes.barchartYearsmenu} onClick={() => handleSelectYear('2023')}>2023</MenuItem>
                            </Menu> */}
                            <Box>
                                <CustomSelect
                                    name='filterYear'
                                    value={filterYear}
                                    onChange={handleSelectYear}
                                    viewDrop1
                                    options={filterData}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box mx={5}>
                        <BarChart overView={overView} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default OverView