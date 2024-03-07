import { Box, Grid, Stack } from '@mui/material'
import React, { useState } from 'react'
import ChartStyles from './ChartsStyles'
import Text from '../../../components/customText/Text'
import CustomPieChart from '../../../components/charts/CustomPieChart';
import { Line } from 'react-chartjs-2';
import Radar from '../placements/RadarGraphPlacement';
import BarChart from '../../../components/charts/BarChart';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { ReactComponent as SendIcon } from '../../../assets/svg/messagesendIcon.svg';
import { btnBgGrey } from '../../../theme';
import EmployeesApi from '../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg } from '../../../utils/utils';

function Charts() {
    const classes = ChartStyles()

    const customData = [
        { value: 60, color: '#3992F5', label: 'In Training' },
        { value: 20, color: '#77D2B7', label: 'In marketing' },
        { value: 20, color: '#FFB126', label: 'In project' },
    ];

    const chartsAPI = () => {
        const data = {
            question: message
        }
        EmployeesApi.OCRCharts(data).then((res) => {
            if (res.data.statusCode == 1003) {
                console.log(res.data.data);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    // const pieData = [
    //     { value: 64, color: '#3992F5', label: 'In Training' },
    //     { value: 17, color: '#77D2B7', label: 'In marketing' },
    //     { value: 19, color: '#FFB126', label: 'In project' },
    // ];

    const PieChartData = () => {
        return customData.map(data => ({
            value: data.value,
            color: data.color,
            label: data.label,
        }));
    }

    const [message, setMessage] = useState('');

    const changeHandler = (e) => {
        setMessage(e.target.value);
    }

    const monochrome = {
        series: [42, 47, 52, 58, 65, 28, 51],
        options: {
            chart: {
                width: 370,
                type: 'polarArea',
            },
            tooltip: {
                enabled: false
            },
            fill: {
                colors: ['#0C75EB', '#84D277', '#96A7FF', '#A3A600', '#FFD0F2', '#77D2B7', '#FFB126'],
                opacity: 1
            },
            labels: [],
            stroke: {
                width: 0,
                dashArray: 18
            },
            yaxis: {
                show: false
            },
            legend: {
                show: false,
            },
            plotOptions: {
                polarArea: {
                    rings: {
                        strokeWidth: 0
                    },
                    spokes: {
                        strokeWidth: 0
                    },
                }
            },
            theme: {
                monochrome: {
                    enabled: true,
                    shadeTo: 'light',
                    shadeIntensity: 0.1
                }
            }
        }
    }

    const employees = {
        series: [25, 25, 25],
        options: {
            chart: {
                width: 370,
                type: 'polarArea',
            },
            tooltip: {
                enabled: false
            },
            fill: {
                colors: ['#0C75EB', '#84D277', '#96A7FF'],
                opacity: 1
            },
            labels: [],
            stroke: {
                width: 4,
                colors: ['#fff'],
                // dashArray: 18
            },
            yaxis: {
                show: false
            },
            legend: {
                show: false,
                position: 'bottom'
            },
            plotOptions: {
                polarArea: {
                    rings: {
                        strokeWidth: 0
                    },
                    spokes: {
                        strokeWidth: 0
                    },
                }
            },
            theme: {
                monochrome: {
                    enabled: true,
                    shadeTo: 'light',
                    shadeIntensity: 0.1
                }
            }
        }
    }

    const monochromeLines = {
        series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
        options: {
            chart: {
                type: 'polarArea',
            },
            tooltip: {
                enabled: false
            },
            stroke: {
                colors: ['#fff']
            },
            fill: {
                opacity: 0.8,
                colors: ['#0C75EB', '#0C75EB', '#0C75EB', '#0C75EB', '#0C75EB', '#0C75EB', '#0C75EB', '#0C75EB', '#0C75EB']
            },
            legend: {
                show: false
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    }

    const monochromeLines1 = {
        series: [14, 23, 21, 17, 15, 10, 12, 17, 21, 10, 19, 18],
        options: {
            chart: {
                type: 'polarArea',
            },
            tooltip: {
                enabled: false
            },
            stroke: {
                colors: ['#fff']
            },
            fill: {
                opacity: 0.8,
                colors: ['#0C75EB', '#14C9C9', '#0C75EB', '#14C9C9', '#0C75EB', '#14C9C9', '#0C75EB', '#14C9C9', '#0C75EB', '#14C9C9', '#0C75EB', '#14C9C9']
            },
            legend: {
                show: false
            },
            // labels: ['Amount', 'value'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    }

    const radialbar = {
        series: [44, 55],
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            tooltip: {
                enabled: true
            },
            colors: ["#77D2B7", "#0C75EB"],
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                            show: false
                        },
                        value: {
                            fontSize: '16px',
                            show: false
                        },
                        total: {
                            show: false,
                        }
                    }
                }
            },
            labels: ['Apples', 'Oranges'],
        },

    }

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Addition',
                data: [0, 12, 5, 23, 11, 17, 9, 15, 29, 34, 26, 35],
                backgroundColor: 'transparent',
                borderColor: '#0C75EB',
                borderWidth: -8,
                pointBorderColor: 'transparent',
                pointBorderWidth: 50
            },
            {
                label: 'Attrition',
                data: [0, 3, 6, 11, 8, 17, 23, 18, 10, 5, 7, 12],
                backgroundColor: 'transparent',
                borderColor: '#FEB127',
                borderWidth: -8,
                pointBorderColor: 'transparent',
                pointBorderWidth: 50
            }
        ]
    };

    const visa = [
        { color: '#D5F89E', count: "12", name: "H-1B" },
        { color: '#B687F3', count: "1", name: "Transit Visa" },
        { color: '#E9C485', count: "6", name: "H2B" },
        { color: '#799CD5', count: "2", name: "CPT" },
        { color: '#65CEC3', count: "12", name: "H4 EAD" },

    ];

    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [

            { name: "Added Employee", data: [10, 47, 30, 39, 55, 43, 34, 60, 17, 14, 6, 12], color: "#318CF1" }
            ,
            { name: "Attrition", data: [19, 20, 80, 27, 62, 49, 37, 27, 16, 11, 11, 30], color: "#77D2B7" }
        ],
    }


    const options = {
        plugins: {
            legend: false
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#8B8BA7',
                    font: {
                        family: 'Nunito , Nunito Sans, sans-serif',
                        size: '14px',
                        weight: 400
                    }
                }
            },
            y: {
                min: 0,
                max: 40,
                ticks: {
                    stepSize: 8,
                    color: '#8B8BA7',
                    font: {
                        family: 'Nunito , Nunito Sans, sans-serif',
                        size: '14px',
                        weight: 400
                    }
                }
            }
        }
    }

    const employeeOpt = {

        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '36%',
                endingShape: 'rounded !important',
                // borderRadius:'20px'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: barData.labels,
            labels: {
                formatter: function (value) {
                    return value;
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,

            },
        },
        grid: {
            show: true,
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                    // strokeDashArray: 3 
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                    color: 'transparent',
                },

                lines: {
                    show: true,
                    strokeDashArray: 3
                },
                axisTicks: {
                    show: false
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            }
        }

    }

    var horizontalBar = {
        series: [{
            data: [360, 300, 260, 210, 170, 130, 80]
        }],

        chart: {
            type: 'bar',
            height: 300,
            toolbar: {
                show: false,
                tools: {
                    download: false
                }
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            bar: {
                horizontal: true,
                fill: '#165DFF',
            }
        },
        colors: ['#165DFF'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [1, 2, 3, 4, 5],
            tickAmount: 9
        },
        yaxis: {
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,

            },
        },
        grid: {
            show: true,
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: true,
                    strokeDashArray: 3
                }
            },
            yaxis: {
                axisBorder: {
                    show: false,
                    color: 'transparent',
                },
                lines: {
                    show: false,
                    // strokeDashArray: 3 
                },
                axisTicks: {
                    show: false
                }
            }
        },
        toolbar: { show: false },
    };

    var horizontalBarTwoBars = {
        series: [{
            name: '1',
            data: [400, 350, 310, 260, 220, 180, 100]

        },
        {
            name: '2',
            data: [360, 300, 260, 210, 170, 130, 80]
        }],
        legend: {
            show: false
        },
        chart: {
            type: 'bar',
            height: 300,
            toolbar: {
                show: false,
                tools: {
                    download: false
                }
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            bar: {
                horizontal: true,
                fill: '#165DFF',
            }
        },
        colors: ['#165DFF', '#14C9C9'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [1, 2, 3, 4, 5],
            tickAmount: 9
        },
        grid: {
            show: true,
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: true,
                    strokeDashArray: 3
                }
            },
            yaxis: {
                lines: {
                    show: false,
                    // strokeDashArray: 3 
                },
                axisTicks: {
                    show: false
                }
            }
        },
        toolbar: { show: false },
    };

    return (
        <Grid container spacing={2} pl={{ lg: 16, md: 9, sm: 4, xs: 9 }} pt={2} alignItems='flex-start' justifyContent='center' mb={2}>
            <Grid item container lg={12} md={12} sm={12} xs={12} pt={3}>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: '30px' }} >
                    <Text mediumBlack14>AI Generative Charts</Text>
                </Grid>
                <Grid container sx={{ height: '58vh', overflowY: "scroll", "&::-webkit-scrollbar": { display: 'none !important' } }}>
                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} rowSpacing={1} columnSpacing={4}>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.leftcard} >
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Total Contractor/Consultant Employees</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5}>
                                    <CustomPieChart data={PieChartData()} height={230} />
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.leftcard}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Employee Margin</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5}>
                                    <ReactApexChart options={radialbar.options} series={radialbar.series} type="radialBar" height={250} />
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} rowSpacing={1} >
                        <Grid item lg={8} md={8} sm={8} xs={12}>
                            <Box className={classes.graphCard}>
                                <BarChart
                                    className={classes.chart}
                                    height={250}
                                    options={employeeOpt}
                                    series={barData.series}
                                />
                            </Box>
                        </Grid>

                    </Grid>

                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} >
                        <Grid item lg={8}>
                            <Box className={classes.graphCard}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Addition & Attrition Rate</Text>
                                </Grid>
                                <Stack direction='row' spacing={2} pt={1}>
                                    <Stack direction={'row'}>
                                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#0C75EB", borderRadius: "50%" }}></Box>
                                        <Text employeeAdded> Added Employees</Text>
                                    </Stack>
                                    <Stack direction={'row'}>
                                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#77D2B7", borderRadius: "50%" }}></Box>
                                        <Text employeeAdded>Attrition</Text>
                                    </Stack>
                                </Stack>
                                <Grid container lg={12} justifyContent='space-between' mt='50px'
                                    sx={{
                                        "&.MuiGrid-root": {
                                            mt: '-19px',
                                            ml: '-7px'
                                        }
                                    }}>
                                    <Line
                                        data={data}
                                        options={options} />
                                </Grid>
                            </Box>
                        </Grid>

                    </Grid>

                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} rowSpacing={1} >
                        <Grid item lg={8}>
                            <Box className={classes.graphCard}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Employees based on Visa</Text>
                                </Grid>
                                <Stack direction='row' spacing={2}>
                                    <Grid container>
                                        <Grid item lg={6}>
                                            <Radar data={visa} />
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={4}>
                                        <Stack gap={5}>
                                            {visa.map((item) => (
                                                <Stack alignItems='center'>
                                                    <Text radarDetails>{item.count}</Text>
                                                    <Stack direction={'row'}>
                                                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: item.color, borderRadius: "50%" }}></Box>
                                                        <Text radarDetails>{item.name}</Text>
                                                    </Stack>
                                                </Stack>
                                            ))}


                                        </Stack>
                                    </Grid>
                                </Stack>
                            </Box>
                        </Grid>

                    </Grid>

                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} rowSpacing={1} columnSpacing={4}>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.miniCard} >
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Total Contractor/Consultant Employees</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={1}>
                                    {/* {/* <PieChart
                                        series={mergedData}
                                        width={250}
                                        height={200}
                                        options={{ pie: customStyles.pie }}
                                        slotProps={{ legend: { hidden: true } }}
                                    /> */}
                                    <ReactApexChart options={employees.options} series={employees.series} type="polarArea" height={350} />
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.leftcard}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Total Contractor/Consultant Employees</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5} className={classes.monochrome}>
                                    <ReactApexChart options={monochrome.options} series={monochrome.series} type="polarArea" height={350} />
                                </Grid>
                            </Box>
                        </Grid>

                    </Grid>
                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} rowSpacing={1} columnSpacing={4}>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.miniCard} >
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Total Contractor/Consultant Employees</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5}>
                                    <ReactApexChart options={monochromeLines1.options} series={monochromeLines1.series} type="polarArea" height={300} />
                                </Grid>

                            </Box>
                        </Grid>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.leftcard}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Total Contractor/Consultant Employees</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5}>
                                    <ReactApexChart options={monochromeLines.options} series={monochromeLines.series} type="polarArea" height={300} />
                                </Grid>
                            </Box>
                        </Grid>

                    </Grid>

                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={3} rowSpacing={1} columnSpacing={4}>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.leftcard} >
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Total Contractor/Consultant Employees</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5}>
                                    <ReactApexChart options={monochromeLines1.options} series={monochromeLines1.series} type="polarArea" height={300} />
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item lg={4} textAlign='center'>
                            <Box className={classes.leftcard}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Text BlackExtraDark>Employee Margin</Text>
                                </Grid>
                                <Grid display='flex' justifyContent="center" mt={5}>
                                    <ReactApexChart options={monochromeLines1.options} series={monochromeLines1.series} type="polarArea" height={300} />
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={7} rowSpacing={1} columnSpacing={4}>
                        <Grid item lg={8} textAlign='start'>
                            <Grid item textAlign='center' lg={4} md={12} sm={12} xs={12}>
                                <Text blackHeader18>Bar Graph</Text>
                            </Grid>
                            <Grid display='flex' justifyContent="center" >
                                <Chart
                                    options={horizontalBar}
                                    series={horizontalBar.series}
                                    type="bar"
                                    height={300}
                                    width={600}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container display='flex' justifyContent="center" spacing={2} lg={12} md={12} sm={12} xs={12} pt={7} rowSpacing={1} columnSpacing={4}>
                        <Grid item lg={8} textAlign='start'>
                            <Grid textAlign='center' lg={4} md={12} sm={12} xs={12}>
                                <Text blackHeader18>Bar Graph</Text>
                            </Grid>
                            <Grid display='flex' justifyContent="center" >
                                <Stack display='flex' justifyContent="center" direction='row' spacing={2} pt={1}>
                                    <Stack direction={'row'}>
                                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#165DFF", borderRadius: "50%" }}></Box>
                                        <Text employeeAdded> 1</Text>
                                    </Stack>
                                    <Stack direction={'row'}>
                                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#14C9C9", borderRadius: "50%" }}></Box>
                                        <Text employeeAdded>2</Text>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid display='flex' justifyContent="center" >
                                <Chart
                                    options={horizontalBarTwoBars}
                                    series={horizontalBarTwoBars.series}
                                    type="bar"
                                    height={300}
                                    width={600}
                                    legend={{ show: false }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container lg={12} justifyContent='center' mt={2}>
                    <Grid container lg={7} xs={12} justifyContent='center'>
                        <Grid item lg={12}>
                            <Text mediumGrey>Suggestions</Text>
                        </Grid>
                        <Grid item lg={12} p={'10px 0px'}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Box className={classes.suggestions}>
                                    <Text mediumBlue className={classes.suggestionText}> How many employees have been onboarded in past one week</Text>
                                </Box>
                                <Box className={classes.suggestions}>
                                    <Text mediumBlue className={classes.suggestionText}> Show my Employees</Text>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={12} mt={1} sx={{ display: 'flex', flexDirection: 'row', background: '#FFFFFF', padding: '15px 10px', border: `1px solid ${btnBgGrey.shade4}`, borderRadius: '10px' }}>
                            <input className={classes.chatInput} placeholder='Ask Something...' name='message' value={message} onChange={changeHandler} autoFocus='on' autoComplete='off' />
                            <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => chartsAPI()}><SendIcon /></Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Charts
