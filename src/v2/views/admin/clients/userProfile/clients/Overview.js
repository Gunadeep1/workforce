import React, { useState, useEffect } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Stack, Divider, Paper } from '@mui/material';
import { getCurrencySymbol } from "../../../../../utils/utils";
import Text from '../../../../../components/customText/Text';
import { styled } from '@mui/material/styles';
import PieChart from '../PieChart';
import BarChart from '../BarChart';
import ClientsApi from '../../../../../apis/admin/clients/ClientsApi';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import moment from 'moment';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: "none",
    width: "100%",
    height: "140px",
}));

export default function Overview({ id }) {

    const classes = UserProfileStyles();
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

    const getOverView = (args) => {
        ClientsApi.overView('client', id, args).then((res) => {
            if (res.data.statusCode == 1003) {
                setOverView(res.data.data.data[0]);
            }
        })
    }

    const handleSelectYear = (e) => {
        setFilterYear(e.target.value);
        getOverView(e.target.value);
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
                            <PieChart overView={overView} />
                        </Box>
                    </Item>
                    <Item>
                        <Box sx={{ height: "100%" }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Stack spacing={1} direction="row" >
                                <Stack>
                                    <Box sx={{ margin: "4px 0px", height: "14px", width: "14px", backgroundColor: "#78B2F2", borderRadius: "50%" }}></Box>
                                </Stack>
                                <Stack sx={{ minWidth: 0 }}>
                                    <Text overViewLable>Outstanding Receivables</Text>
                                    <Text overViewAmount > {`${getCurrencySymbol()}${overView.received_amount}`} </Text>
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
                                    <Text overViewLable>Outstanding Overdue</Text>
                                    <Text overViewAmount >{`${getCurrencySymbol()}${overView.over_due_amount}`}</Text>
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
                                <Stack spacing={1} direction="row" alignItems='center'>
                                    <Box sx={{ height: "12px", width: "12px", backgroundColor: "#318CF1", borderRadius: "50%" }}></Box>
                                    <Text overViewLable>Invoices Raised</Text>
                                </Stack>
                                <Stack spacing={1} direction="row" alignItems='center'>
                                    <Box sx={{ height: "12px", width: "12px", backgroundColor: "#77D2B7", borderRadius: "50%" }}></Box>
                                    <Text overViewLable>Payments Received</Text>
                                </Stack>
                            </Stack>
                            {/* <ListItemButton onClick={handleClickBarchartYear} sx={{ width: '100%', maxWidth: 100, bgcolor: '#ffffff', '&:hover': { bgcolor: '#ffffff' }, }}>
                                <ListItemText primary={filterYear} />
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton> */}
                            {/* <Menu
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
    );
}