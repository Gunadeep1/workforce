import { Avatar, AvatarGroup, Box, Grid, Menu, MenuItem, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import PlacementDashboardStyles from './GraphDashboardStyles';
import Button from '../../../components/customButton/Button';
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg';
import { useNavigate } from 'react-router-dom';
import PieChartPlacementDsh from './PieChartPlacement'
import Text from '../../../components/customText/Text';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { WhiteToolTip, addErrorMsg, dateFormat } from '../../../utils/utils';
import moment from "moment";
import Date from '../../../components/datePicker/Date';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';// eslint-disable-next-line
import ArrowUpGreen from '../../../assets/svg/ArrowUp_Green.svg'// eslint-disable-next-line
import ArrowUpRed from '../../../assets/svg/ArrowUp_Red.svg'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, } from 'chart.js'
import { geoCentroid } from "d3-geo";
import { ComposableMap, Geographies, Geography, Marker, Annotation } from "react-simple-maps";
import users from '../../../assets/svg/users.svg'

import Radar from './RadarGraphPlacement';
import PlacementApi from '../../../apis/admin/placements/PlacementApi';
import LocalStorage from '../../../utils/LocalStorage';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
    // "Vermont": [30, -5],
    "New Hamshire": [-39, -132],
    "Massachussetts": [-28, -140],
    "Rhode Island": [-20, -135],
    // "Connecticut": [3, -125],
    // "New Jersey": [25, 1],
    "Delaware": [33, 0],
    "Maryland": [47, 10],
};

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)


function GraphDashboard() {

    const allStates = [
        { "id": "Alabama", "val": "01" },
        { "id": "Alaska", "val": "02" },
        { "id": "Arizona", "val": "04" },
        { "id": "Arkansas", "val": "05" },
        { "id": "California", "val": "06" },
        { "id": "Colorado", "val": "08" },
        { "id": "Connecticut", "val": "09" },
        { "id": "Delaware", "val": "10" },
        { "id": "Florida", "val": "12" },
        { "id": "Georgia", "val": "13" },
        { "id": "Hawaii", "val": "15" },
        { "id": "Idaho", "val": "16" },
        { "id": "Illinois", "val": "17" },
        { "id": "Indiana", "val": "18" },
        { "id": "Iowa", "val": "19" },
        { "id": "Kansas", "val": "20" },
        { "id": "Kentucky", "val": "21" },
        { "id": "Louisiana", "val": "22" },
        { "id": "Maine", "val": "23" },
        { "id": "Maryland", "val": "24" },
        { "id": "Massachussetts", "val": "25" },
        { "id": "Michigan", "val": "26" },
        { "id": "Minnesota", "val": "27" },
        { "id": "Mississipi", "val": "28" },
        { "id": "Missouri", "val": "29" },
        { "id": "Montana", "val": "30" },
        { "id": "Nebraska", "val": "31" },
        { "id": "Nevada", "val": "32" },
        { "id": "New Hamshire", "val": "33" },
        { "id": "New Jersey", "val": "34" },
        { "id": "New Mexico", "val": "35" },
        { "id": "New York", "val": "36" },
        { "id": "North Carolina", "val": "37" },
        { "id": "North Dakota", "val": "38" },
        { "id": "Ohio", "val": "39" },
        { "id": "Oklahoma", "val": "40" },
        { "id": "Oregon", "val": "41" },
        { "id": "Pennsylvania", "val": "42" },
        { "id": "Rhode Island", "val": "44" },
        { "id": "South Carolina", "val": "45" },
        { "id": "South Dakota", "val": "46" },
        { "id": "Tennesse", "val": "47" },
        { "id": "Texas", "val": "48" },
        { "id": "Utah", "val": "49" },
        { "id": "Vermont", "val": "50" },
        { "id": "Virginia", "val": "51" },
        { "id": "Washington", "val": "53" },
        { "id": "West Virginia", "val": "54" },
        { "id": "Wisconsin", "val": "55" },
        { "id": "Wyoming", "val": "56" }
    ]


    const classes = PlacementDashboardStyles();
    const navigate = useNavigate();
    const [custom, setCustom] = useState(false)
    const [custom2, setCustom2] = useState(false)
    const [custom3, setCustom3] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [anchorEl2, setAnchorEl2] = useState(null)
    const [anchorEl3, setAnchorEl3] = useState(null)
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);
    const [selectedItem, setSelectedItem] = useState("All");
    const [selectedItem2, setSelectedItem2] = useState("All");
    const [selectedItem3, setSelectedItem3] = useState("All");
    const [graphData, setGraphData] = useState({})
    const [state, setState] = useState({
        from_date: "",
        to_date: ""
    })
    const [state2, setState2] = useState({
        from_date: "",
        to_date: ""
    })
    const [state3, setState3] = useState({
        from_date: "",
        to_date: ""
    })// eslint-disable-next-line
    const [graphState, setGraphState] = useState({
        request_id: LocalStorage.uid(),
        skill_wise: {
            from_date: '',
            to_date: ''
        },
        placement_added: {
            from_date: '',
            to_date: ''
        },
        addition_rate: {
            from_date: '',
            to_date: ''
        }
    })

    const data = {
        labels: graphData.additionAndAttritionGraph && graphData.additionAndAttritionGraph.labels,
        datasets: [
            {
                label: 'Addition',
                data: graphData.additionAndAttritionGraph && graphData.additionAndAttritionGraph.AdditionSets,
                backgroundColor: 'transparent',
                borderColor: '#0C75EB',
                borderWidth: -8,
                pointBorderColor: 'transparent',
                pointBorderWidth: 50
            },
            {
                label: 'Attrition',
                data: graphData.additionAndAttritionGraph && graphData.additionAndAttritionGraph.AttritionSets,
                backgroundColor: 'transparent',
                borderColor: '#FEB127',
                borderWidth: -8,
                pointBorderColor: 'transparent',
                pointBorderWidth: 50
            }
        ]
    };

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

    // const radialBarData = [100, 44, 78, 35, 56, 73, 100]

    // const radialBarOptions = {
    //   labels: ["A", "B", "C", "D", "E", "F", "G"],
    //   legend: {
    //     show: false,
    //     onItemClick: {
    //       toggleDataSeries: false,
    //     },
    //     onItemHover: {
    //       highlightDataSeries: false,
    //     },
    //   },
    //   plotOptions: {
    //     radialBar: {
    //       size: undefined,
    //       inverseOrder: false,
    //       startAngle: 0,
    //       endAngle: 270,
    //       offsetX: 0,
    //       offsetY: 0,
    //       hollow: {
    //         margin: 5,
    //         size: -5,
    //         background: "transparent",
    //         image: undefined,
    //         imageWidth: 250,
    //         imageHeight: 150,
    //         imageOffsetX: 0,
    //         imageOffsetY: 0,
    //         imageClipped: true,
    //         position: "front",
    //         dropShadow: {
    //           enabled: false,
    //           top: 0,
    //           left: 0,
    //           blur: 3,
    //           opacity: 0.5,
    //         },
    //       },
    //       track: {
    //         show: false,
    //         startAngle: undefined,
    //         endAngle: undefined,
    //         background: "#f2f2f2",
    //         strokeWidth: -5,
    //         strokeLinecap: "round",
    //         opacity: 1,
    //         margin: 10,
    //         dropShadow: {
    //           enabled: false,
    //           top: 0,
    //           left: 0,
    //           blur: 3,
    //           opacity: 0.5,
    //         },
    //         strokeDashArray: 4,
    //       },
    //       dataLabels: {
    //         show: false,
    //       },
    //     },
    //   },
    //   colors: [
    //     "#65CEC3",
    //     "#799CD5",
    //     "#E9C485",
    //     "#FCE58B",
    //     "#B687F3",
    //     "#F1AF93",
    //     "#D5F89E",
    //   ], // Colors for radial bars
    // }

    const BorderLinearProgress = styled(LinearProgress)(({ barColor, bgColor }) => ({
        height: 5,
        borderRadius: 7,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: bgColor
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 7,
            backgroundColor: barColor
        },
    }));

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [graphState])

    const getData = () => {
        // let data = {
        //     request_id: LocalStorage.uid(),
        //     skill_wise: {
        //         from_date: '',
        //         to_date: ''
        //     },
        //     placement_added: {
        //         from_date: '',
        //         to_date: ''
        //     },
        //     addition_rate: {
        //         from_date: '',
        //         to_date: ''
        //     }
        // }
        PlacementApi.dashboardGraph(graphState).then((response) => {
            if (response.data.statusCode == 1003) {
                setGraphData(response.data.data)
            }
        });
    }

    const handleClose = (key) => {
        if (key == 'filter1') {
            setAnchorEl(null)
        }
        if (key == 'filter2') {
            setAnchorEl2(null)
        }
        if (key == 'filter3') {
            setAnchorEl3(null)
        }
    }

    const handleClick = (event, key) => {
        if (key == 'filter1') {
            setAnchorEl(event.currentTarget);
        }
        if (key == 'filter2') {
            setAnchorEl2(event.currentTarget);
        }
        if (key == 'filter3') {
            setAnchorEl3(event.currentTarget);
        }
    };

    const handleSelect = (e, args, key,name) => {
        let fromDate = "";
        let toDate = "";
        switch (args) {
            case 1:
                if (key == 'filter1') {
                    setSelectedItem("All")
                    graphState[name].from_date = ''
                    graphState[name].to_date = ''
                    setGraphState({...graphState})
                }
                if (key == 'filter2') {
                    setSelectedItem2("All")
                    graphState[name].from_date = ''
                    graphState[name].to_date = ''
                    setGraphState({...graphState})
                }
                if (key == 'filter3') {
                    setSelectedItem3("All")
                    graphState[name].from_date = ''
                    graphState[name].to_date = ''
                    setGraphState({...graphState})
                }
                break;
            case 2:
                fromDate = moment().startOf('month').format(dateFormat());
                toDate = moment().format(dateFormat());
                if (key == 'filter1') {
                    setSelectedItem("This Month");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                if (key == 'filter2') {
                    setSelectedItem2("This Month");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                if (key == 'filter3') {
                    setSelectedItem3("This Month");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                break;
            case 3:
                fromDate = moment(moment().subtract(3, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                if (key == 'filter1') {
                    setSelectedItem("Last 3 months");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                if (key == 'filter2') {
                    setSelectedItem2("Last 3 months");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                if (key == 'filter3') {
                    setSelectedItem3("Last 3 months");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }

                break;
            case 4:
                fromDate = moment(moment().subtract(6, 'months').format(dateFormat())).startOf('month').format(dateFormat());
                toDate = moment(moment().subtract(1, 'months').format(dateFormat())).endOf('month').format(dateFormat());
                if (key == 'filter1') {
                    setSelectedItem("Last 6 months");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                if (key == 'filter2') {
                    setSelectedItem2("Last 6 months");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }
                if (key == 'filter3') {
                    setSelectedItem3("Last 6 months");
                    graphState[name].from_date = fromDate
                    graphState[name].to_date = toDate
                    setGraphState({...graphState})
                }

                break;
            case 5:
                if (key == 'filter1') {
                    fromDate = state.from_date
                    toDate = state.to_date
                }
                if (key == 'filter2') {
                    fromDate = state2.from_date
                    toDate = state2.to_date
                }
                if (key == 'filter3') {
                    // eslint-disable-next-line
                    fromDate = state3.from_date
                    // eslint-disable-next-line
                    toDate = state3.to_date
                }
                break;
            default:
                break;
        }
        // getDashboardData({ from_date: fromDate, to_date: toDate })
        if (key == 'filter1') {
            setTimeout(() => {
                setCustom(false)
            }, 400)
        }
        if (key == 'filter2') {
            setTimeout(() => {
                setCustom2(false)
            }, 400)
        }
        if (key == 'filter3') {
            setTimeout(() => {
                setCustom3(false)
            }, 400)
        }
        handleClose(key)
    }

    const dateChange = (e, name, key, slug) => {
        let date = e.$d
        if (key == 'filter1') {
            setState({
                ...state,
                [name]: moment(date).format(dateFormat())
            })
            graphState[slug][name] = moment(date).format(dateFormat())
        }
        if (key == 'filter2') {
            setState2({
                ...state2,
                [name]: moment(date).format(dateFormat())
            })
            graphState[slug][name] = moment(date).format(dateFormat())
        }
        if (key == 'filter3') {
            setState3({
                ...state3,
                [name]: moment(date).format(dateFormat())
            })
        }
    }

    const handleCustomSelect = (key) => {
        if (key == 'filter1') {
            setCustom(true);
            setSelectedItem("Custom")
        }
        if (key == 'filter2') {
            setCustom2(true);
            setSelectedItem2("Custom")
        }
        if (key == 'filter3') {
            setCustom3(true);
            setSelectedItem3("Custom")
        }
    }

    const handleCancel = (key) => {
        if (key == 'filter1') {
            setAnchorEl(null)
            setSelectedItem("All")
            if (custom) {
                setTimeout(() => {
                    setCustom(false)
                }, 200)
            }
        }
        if (key == 'filter2') {
            setAnchorEl2(null)
            setSelectedItem2("All")
            if (custom2) {
                setTimeout(() => {
                    setCustom2(false)
                }, 200)
            }
        }
        if (key == 'filter3') {
            setAnchorEl3(null)
            setSelectedItem3("All")
            if (custom3) {
                setTimeout(() => {
                    setCustom3(false)
                }, 200)
            }
        }
    }

    const linearProgress = [
        {
            bgColor: '#0095FF',
            barColor: '#CDE7FF'
        },
        {
            bgColor: '#00E096',
            barColor: '#D4FFEB'
        },
        {
            bgColor: '#884DFF',
            barColor: '#E7DBFF'
        },
        {
            bgColor: '#FF8F0D',
            barColor: '#FFEBD4'
        },
        {
            bgColor: '#D34040',
            barColor: '#FFC8C8'
        },
        {
            bgColor: '#0095FF',
            barColor: '#CDE7FF'
        },
        {
            bgColor: '#00E096',
            barColor: '#D4FFEB'
        },
        {
            bgColor: '#884DFF',
            barColor: '#E7DBFF'
        },
        {
            bgColor: '#FF8F0D',
            barColor: '#FFEBD4'
        },
        {
            bgColor: '#D34040',
            barColor: '#FFC8C8'
        },
    ]

    return (
        <Box className={classes.containerMain}>

            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'} gap={2} px={2} py='30px'>
                <Text dashboardTitle>Placement Dashboard</Text>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <Button outlineBlue onClick={() => navigate('/placements')} sx={{ height: '36px !important', width: "129px !important" }}>All Placement</Button>
                    <Button addNew startIcon={<Plus />} onClick={() => navigate('/placements/placementsInfo')} sx={{ height: '36px !important', minWidth: '167px !important', fontWeight: `${400} !important`, }} px={2}>Add Placement</Button>
                </Stack>
            </Stack>

            <Box sx={{ height: '73vh', overflowY: 'auto', width: "100%" }}>
                <Box sx={{ borderBottom: '1px solid #F5F5F5 !important', pb: '30px', pl: '16px' }}>
                    <Grid container lg={12} justifyContent='space-between' pt='20px' >
                        <Grid item lg={5} md={5} sm={12} xs={12} borderRight='1px solid #F5F5F5'>
                            <Stack direction='column' >
                                <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Total Contractor/ Consultant Employee</Text>
                                <Stack alignItems={'center'} mt={'92px'}>
                                    <PieChartPlacementDsh data={graphData.employeeInformation} />
                                    <Stack direction={'row'} gap={5} mt={'30px'}>
                                        <Stack alignItems={'center'} gap={'5px'}>
                                            <Text pieDetails>{graphData.employeeInformation && graphData.employeeInformation.employees_in_training}</Text>
                                            <Stack direction={'row'}>
                                                <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#60B2EE", borderRadius: "50%" }}></Box>
                                                <Text pieDetails>In Training</Text>
                                            </Stack>
                                        </Stack>
                                        <Stack alignItems={'center'} gap={'5px'}>
                                            <Text pieDetails>{graphData.employeeInformation && graphData.employeeInformation.employees_in_marketing}</Text>
                                            <Stack direction={'row'}>
                                                <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#77D2B7", borderRadius: "50%" }}></Box>
                                                <Text pieDetails>In Marketing</Text>
                                            </Stack>
                                        </Stack>
                                        <Stack alignItems={'center'} gap={'5px'}>
                                            <Text pieDetails>{graphData.employeeInformation && graphData.employeeInformation.employees_in_project}</Text>
                                            <Stack direction={'row'}>
                                                <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#FEB127", borderRadius: "50%" }}></Box>
                                                <Text pieDetails>In Project</Text>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item lg={7} md={7} sm={12} xs={12} pl={{ lg: '50px', md: '50px', sm: '0px', xs: '0px' }} mt={{ lg: '0px', md: '0px', sm: '40px', xs: '40px' }}>
                            <Stack gap={3}>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems='center' >
                                    <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Skill Based Placements</Text>
                                    <Button
                                        onClick={(e) => handleClick(e, 'filter1')}
                                        disableRipple
                                        endIcon={<KeyboardArrowDownIcon />}
                                        sx={{
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            fontSize: "14px !important",
                                            fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                            fontWeight: `${400} !important`,
                                            color: "#737373 !important",
                                            width: "159px",
                                            height: "36px",
                                            border: "1px solid #C7CCD3",
                                            backgroundColor: "#ffffff",
                                            borderRadius: "4px",
                                            textTransform: "none !important",
                                            "&:hover": {
                                                background: 'none !important'
                                            }

                                        }}>
                                        {selectedItem}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={() => handleClose('filter1')}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                border: '1px solid #EAECF0 !important',
                                                width: custom ? '350px !important' : '159px !important',
                                                transform: custom ? 'translateX(-52px) !important' : '',
                                                boxShadow: "#0000001F !important",
                                                borderRadius: '8px !important',
                                                padding: '0px 2px 0px 0px !important'
                                            },
                                        }}>

                                        {custom ?
                                            <Stack ml={1}>
                                                <Grid container lg={12} spacing={1}>
                                                    <Grid item lg={6} >
                                                        <Box pt={'10px'}>
                                                            <Date
                                                                labelText={<Text largeLabel>From</Text>}
                                                                name='from_date'
                                                                value={state.from_date}
                                                                onChange={(value => dateChange(value, 'from_date', 'filter1','skill_wise'))}
                                                                height='40px'
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={6} >
                                                        <Box pt={'10px'}>
                                                            <Date
                                                                labelText={<Text largeLabel>To</Text>}
                                                                name='to_date'
                                                                value={state.to_date}
                                                                onChange={(value => dateChange(value, 'to_date', 'filter1','skill_wise'))}
                                                                height='40px'
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid container mt={1}>
                                                    <Stack direction={'row'} justifyContent={'space-between'} width="100%">
                                                        <Button blackCancel sx={{ width: '121px !important' }} onClick={() => handleCancel('filter1')}>Cancel</Button>
                                                        <Button blueButton sx={{ width: '121px !important' }} onClick={(e) => {handleSelect(e, 5, 'filter1'); if(graphState.skill_wise.from_date !== '' && graphState.skill_wise.to_date !== ''){setGraphState({...graphState})} else {addErrorMsg('Please enter from date and end date')}}} >Apply</Button>
                                                    </Stack>
                                                </Grid>
                                            </Stack>
                                            :
                                            <Box>
                                                <MenuItem className={selectedItem === 'All' ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 1, 'filter1','skill_wise')} >All</MenuItem>
                                                <MenuItem className={selectedItem === 'This Month' ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 2, 'filter1','skill_wise')}>This Month</MenuItem>
                                                <MenuItem className={selectedItem === 'Last 3 months' ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 3, 'filter1','skill_wise')}>Last 3 Months</MenuItem>
                                                <MenuItem className={selectedItem === 'Last 6 months' ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 4, 'filter1','skill_wise')}>Last 6 Months</MenuItem>
                                                <MenuItem className={selectedItem === 'Custom' ? classes.viewText1 : classes.viewText} onClick={() => handleCustomSelect('filter1')} >Custom</MenuItem>
                                            </Box>
                                        }

                                    </Menu>
                                </Stack>
                                {
                                    graphData.skillsInformation && graphData.skillsInformation.map((item, index) => (
                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} gap={{ xs: 3 }}>
                                            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} width={'70%'} gap={{ xs: 3 }}>
                                                <Stack direction={'row'} gap={{ lg: 2, md: 2, sm: 1, xs: 1 }}>
                                                    <Text roleText>{index + 1}</Text>
                                                    <Text roleText>{item.skill_name}</Text>
                                                </Stack>
                                                <Stack sx={{ width: { lg: "150px", md: '150px', sm: '100px', xs: '50px' } }} direction={'column'} justifyContent={'end'}>
                                                    <BorderLinearProgress sx={{ height: '5px !important' }} variant="determinate" value={item.employees_count} barColor={linearProgress[index].bgColor} bgColor={linearProgress[index].barColor} />
                                                </Stack>
                                            </Stack>
                                            <Stack >
                                                <AvatarGroup total={item.employees_count} spacing={18}
                                                    renderSurplus={(surplus) => <span>{surplus.toString()}</span>}
                                                    sx={{
                                                        "& .css-sxh3gq-MuiAvatar-root-MuiAvatarGroup-avatar": {
                                                            width: '35px',
                                                            height: '35px',
                                                            color: '#0C75EB',
                                                            backgroundColor: '#D1E1FF',
                                                            font: '12px Nunito Sans, sans-serif !important',
                                                            fontWeight: `${600} !important`,
                                                        },
                                                        "& .MuiAvatar-root": {
                                                            position: "static !important",
                                                            border: "none !important",
                                                            font: '12px Nunito Sans, sans-serif !important',
                                                            fontWeight: `${600} !important`
                                                            // marginX: '-10px'
                                                        },
                                                        "& .MuiAvatar-root-MuiAvatarGroup-avatar": {
                                                            width: '35px',
                                                            height: '35px',
                                                            color: '#0C75EB !important',
                                                            backgroundColor: '#D1E1FF !important',
                                                            font: '12px Nunito Sans, sans-serif !important',
                                                            fontWeight: `${600} !important`,
                                                            // marginX: '-10px'
                                                        }
                                                    }}>
                                                    {item.urls && item.urls.map((profile) => (
                                                        <Avatar alt="Remy Sharp" src={profile} sx={{ width: "35px", height: "35px", }} />
                                                    ))}
                                                    {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" sx={{ width: "35px", height: "35px", }} />
                           <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" sx={{ width: "35px", height: "35px", }} />
                           <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" sx={{ width: "35px", height: "35px", }} /> */}
                                                </AvatarGroup>
                                            </Stack>
                                        </Stack>
                                    ))
                                }
                                {
                                    (graphData.skillsInformation && graphData.skillsInformation.length > 5) &&
                                    <Text ml={{ lg: '400px', md: '400px', sm: '380px', xs: '160px' }} mediumBlue sx={{ fontSize: '12px !important', fontWeight: `${400} !important`, }}>View all</Text>}
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt='30px' pb='30px' pl='16px'>
                    <Stack direction={'row'} justifyContent={'space-between'} flexWrap={'wrap'}>
                        <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Addition & Attrition Rate</Text>
                        <Button
                            onClick={(e) => handleClick(e, 'filter2')}
                            disableRipple
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "14px !important",
                                fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                fontWeight: `${400} !important`,
                                color: "#737373 !important",
                                width: "159px",
                                height: "36px",
                                border: "1px solid #C7CCD3",
                                backgroundColor: "#ffffff",
                                borderRadius: "4px",
                                textTransform: "none !important",
                                "&:hover": {
                                    background: 'none !important'
                                }
                            }}>
                            {selectedItem2}
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl2}
                            open={open2}
                            onClose={() => handleClose('filter2')}
                            sx={{
                                '& .MuiPaper-root': {
                                    border: '1px solid #EAECF0 !important',
                                    width: custom2 ? '350px !important' : '159px !important',
                                    transform: custom2 ? 'translateX(-50px) !important' : '',
                                    boxShadow: "#0000001F !important",
                                    borderRadius: '8px !important',
                                    padding: '0px 2px 0px 0px !important'
                                },
                            }}>

                            {custom2 ?
                                <Stack ml={1}>
                                    <Grid container lg={12} spacing={1}>
                                        <Grid item lg={6} >
                                            <Box pt={'10px'}>
                                                <Date
                                                    labelText={<Text largeLabel>From</Text>}
                                                    name='from_date'
                                                    value={state2.from_date}
                                                    onChange={(value => dateChange(value, 'from_date', 'filter2','placement_added'))}
                                                    height='40px'
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} >
                                            <Box pt={'10px'}>
                                                <Date
                                                    labelText={<Text largeLabel>To</Text>}
                                                    name='to_date'
                                                    value={state2.to_date}
                                                    onChange={(value => dateChange(value, 'to_date', 'filter2','placement_added'))}
                                                    height='40px'
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={1}>
                                        <Stack direction={'row'} justifyContent={'space-between'} width="100%">
                                            <Button blackCancel sx={{ width: '121px !important' }} onClick={() => handleCancel('filter2')}>Cancel</Button>
                                            <Button blueButton sx={{ width: '121px !important' }} onClick={(e) => {handleSelect(e, 5, 'filter2'); if(graphState.placement_added.from_date !== '' && graphState.placement_added.to_date !== ''){setGraphState({...graphState})} else {addErrorMsg('Please enter from date and end date')}}} >Apply</Button>
                                        </Stack>
                                    </Grid>
                                </Stack>
                                :
                                <Box>
                                    <MenuItem className={selectedItem2 === 1 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 1, 'filter2','placement_added')} >All</MenuItem>
                                    <MenuItem className={selectedItem2 === 2 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 2, 'filter2','placement_added')}>This Month</MenuItem>
                                    <MenuItem className={selectedItem2 === 3 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 3, 'filter2','placement_added')}>Last 3 Months</MenuItem>
                                    <MenuItem className={selectedItem2 === 4 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 4, 'filter2','placement_added')}>Last 6 Months</MenuItem>
                                    <MenuItem className={selectedItem2 === 5 ? classes.viewText1 : classes.viewText} onClick={() => handleCustomSelect('filter2')} >Custom</MenuItem>
                                </Box>
                            }
                        </Menu>
                    </Stack>
                    <Grid container lg={12} justifyContent='space-between' mt='30px' borderBottom='1px solid #F5F5F5'>
                        <Grid item lg={7} md={12} sm={12} xs={12}
                            sx={{
                                borderRight: '1px solid #F5F5F5',
                                "&.MuiGrid-root": {
                                    mt: '-49px',
                                    ml: '-20px'
                                }
                            }}>
                            {/* <Box sx={{width: '1500px', height: '260px'}}> */}
                            <Line
                                data={data}
                                options={options} />
                            {/* </Box> */}
                        </Grid>
                        <Grid item lg={2.5} md={6} sm={6} xs={12} sx={{ borderRight: '1px solid #F5F5F5', pl: '50px' }} mt={{ lg: '0px', md: '0px', sm: '20px', xs: '20px' }}>
                            <Stack direction={'row'}>
                                <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#0C75EB", borderRadius: "50%" }}></Box>
                                <Text employeeAdded>Employees Added</Text>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'} mt={'10px'}>
                                <Text dashboardTitle sx={{ fontSize: '40px !important', marginRight: '5px' }}>{graphData.additionAndAttrition && graphData.additionAndAttrition.totalCountActive}</Text>
                                {/* <img src={ArrowUpGreen} alt="Arrow" style={{ marginRight: '2px' }} />
                                <Text greenText>+{employees.total_employees_added}</Text> */}
                            </Stack>
                            <Stack gap={2} mt={'10px'} height={'30vh'} sx={{ overflow: 'scroll' }}>
                                {
                                    graphData.additionAndAttrition && graphData.additionAndAttrition.active.map((item) => (

                                        <Stack direction={'row'} width='70%' justifyContent={'space-between'}>
                                            <Stack direction={'row'} width='65%' justifyContent={'space-between'}>
                                                <Text roleText sx={{ color: '#737373 !important' }}>{item.name}</Text>
                                                <Text roleText sx={{ color: '#737373 !important' }}>-</Text>
                                            </Stack>
                                            <Text roleText sx={{ color: '#737373 !important' }}>{item.countvalue}</Text>
                                        </Stack>

                                    ))
                                }
                            </Stack>
                        </Grid>
                        <Grid item lg={2.5} md={6} sm={6} xs={12} pl='50px' mt={{ lg: '0px', md: '0px', sm: '20px', xs: '20px' }}>
                            <Stack direction={'row'}>
                                <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#FEB127", borderRadius: "50%" }}></Box>
                                <Text employeeAdded>Employees Left</Text>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'} mt={'10px'}>
                                <Text dashboardTitle sx={{ fontSize: '40px !important', marginRight: '5px' }}>{graphData.additionAndAttrition && graphData.additionAndAttrition.totalCountInactive}</Text>
                                {/* <img src={ArrowUpRed} alt="Arrow" style={{ marginRight: '2px' }} />
                                <Text greenText sx={{ color: '#F87171 !important' }}>+{employees.total_employees_left}</Text> */}
                            </Stack>
                            <Stack gap={2} mt={'10px'} height={'30vh'} sx={{ overflow: 'scroll' }}>
                                {
                                    graphData.additionAndAttrition && graphData.additionAndAttrition.in_active.map((item) => (

                                        <Stack direction={'row'} width='70%' justifyContent={'space-between'}>
                                            <Stack direction={'row'} width='65%' justifyContent={'space-between'}>
                                                <Text roleText sx={{ color: '#737373 !important' }}>{item.name}</Text>
                                                <Text roleText sx={{ color: '#737373 !important' }}>-</Text>
                                            </Stack>
                                            <Text roleText sx={{ color: '#737373 !important' }}>{item.countvalue}</Text>
                                        </Stack>
                                    ))
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Box borderBottom='1px solid #F5F5F5' pl='16px'>
                    <Stack gap={2}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
                            <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Employees based on Visa</Text>
                            <Button
                                onClick={(e) => handleClick(e, 'filter3')}
                                disableRipple
                                endIcon={<KeyboardArrowDownIcon />}
                                sx={{
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    fontSize: "14px !important",
                                    fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                    fontWeight: `${400} !important`,
                                    color: "#737373 !important",
                                    width: "159px",
                                    height: "36px",
                                    border: "1px solid #C7CCD3",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "4px",
                                    textTransform: "none !important",
                                    "&:hover": {
                                        background: 'none !important'
                                    }
                                }}>
                                {selectedItem3}
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl3}
                                open={open3}
                                onClose={() => handleClose('filter3')}
                                sx={{
                                    '& .MuiPaper-root': {
                                        border: '1px solid #EAECF0 !important',
                                        width: custom3 ? '350px !important' : '159px !important',
                                        transform: custom3 ? 'translateX(-50px) !important' : '',
                                        boxShadow: "#0000001F !important",
                                        borderRadius: '8px !important',
                                        padding: '0px 2px 0px 0px !important'
                                    },
                                }}>

                                {custom3 ?
                                    <Stack ml={1}>
                                        <Grid container lg={12} spacing={1}>
                                            <Grid item lg={6} >
                                                <Box pt={'10px'}>
                                                    <Date
                                                        labelText={<Text largeLabel>From</Text>}
                                                        name='from_date'
                                                        value={state3.from_date}
                                                        onChange={(value => dateChange(value, 'from_date', 'filter3'))}
                                                        height='40px'
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item lg={6} >
                                                <Box pt={'10px'}>
                                                    <Date
                                                        labelText={<Text largeLabel>To</Text>}
                                                        name='to_date'
                                                        value={state3.to_date}
                                                        onChange={(value => dateChange(value, 'to_date', 'filter3'))}
                                                        height='40px'
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid container mt={1}>
                                            <Stack direction={'row'} justifyContent={'space-between'} width="100%">
                                                <Button blackCancel sx={{ width: '121px !important' }} onClick={() => handleCancel('filter3')}>Cancel</Button>
                                                <Button blueButton sx={{ width: '121px !important' }} onClick={(e) => handleSelect(e, 5, 'filter3')} >Apply</Button>
                                            </Stack>
                                        </Grid>
                                    </Stack>
                                    :
                                    <Box>
                                        <MenuItem className={selectedItem3 === 1 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 1, 'filter3')} >All</MenuItem>
                                        <MenuItem className={selectedItem3 === 2 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 2, 'filter3')}>This Month</MenuItem>
                                        <MenuItem className={selectedItem3 === 3 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 3, 'filter3')}>Last 3 Months</MenuItem>
                                        <MenuItem className={selectedItem3 === 4 ? classes.viewText1 : classes.viewText} onClick={(e) => handleSelect(e, 4, 'filter3')}>Last 6 Months</MenuItem>
                                        <MenuItem className={selectedItem3 === 5 ? classes.viewText1 : classes.viewText} onClick={() => handleCustomSelect('filter3')} >Custom</MenuItem>
                                    </Box>
                                }
                            </Menu>
                        </Stack>
                        <Grid container>
                            <Grid item lg={6}>
                                {/* <Chart
                  options={radialBarOptions}
                  series={radialBarData}
                  type="radialBar"
                  width="380"
                /> */}
                                <Radar data={graphData.visaCount} />
                            </Grid>
                            <Grid item lg={6}>
                                <Stack direction='row' gap={5}>
                                    <Stack gap={5}>
                                        {graphData.visaCount && graphData.visaCount.map((item) => (
                                            <Stack alignItems='center'>
                                                <Text pieDetails>{item.count}</Text>
                                                <Stack direction={'row'}>
                                                    <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#D5F89E", borderRadius: "50%" }}></Box>
                                                    <Text pieDetails>{item.name}</Text>
                                                </Stack>
                                            </Stack>
                                        ))}

                                        {/* <Stack alignItems='center'>
                      <Text pieDetails>65</Text>
                      <Stack direction={'row'}>
                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#F1AF93", borderRadius: "50%" }}></Box>
                        <Text pieDetails>GC EAD</Text>
                      </Stack>
                    </Stack>
                    <Stack alignItems='center'>
                      <Text pieDetails>20</Text>
                      <Stack direction={'row'}>
                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#B687F3", borderRadius: "50%" }}></Box>
                        <Text pieDetails>H1B</Text>
                      </Stack>
                    </Stack>
                    <Stack alignItems='center'>
                      <Text pieDetails>20</Text>
                      <Stack direction={'row'}>
                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#FCE58B", borderRadius: "50%" }}></Box>
                        <Text pieDetails>STEM OPT</Text>
                      </Stack>
                    </Stack> */}
                                    </Stack>
                                    {/* <Stack gap={5}>
                    <Stack alignItems='center'>
                      <Text pieDetails>20</Text>
                      <Stack direction={'row'}>
                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#E9C485", borderRadius: "50%" }}></Box>
                        <Text pieDetails>H4 EAD</Text>
                      </Stack>
                    </Stack>
                    <Stack alignItems='center'>
                      <Text pieDetails>20</Text>
                      <Stack direction={'row'}>
                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#799CD5", borderRadius: "50%" }}></Box>
                        <Text pieDetails>CPT</Text>
                      </Stack>
                    </Stack>
                    <Stack alignItems='center'>
                      <Text pieDetails>20</Text>
                      <Stack direction={'row'}>
                        <Box sx={{ margin: "4px 6px 4px 0px", height: "10px", width: "10px", backgroundColor: "#65CEC3", borderRadius: "50%" }}></Box>
                        <Text pieDetails>OPT</Text>
                      </Stack>
                    </Stack>
                  </Stack> */}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
                <Box mt='30px' pl='16px'>
                    <Text dashboardTitle sx={{ fontSize: '16px !important' }}>Employees based on State</Text>
                    <Grid container>
                        <Grid item lg={9} md={9} sm={12} xs={12}>
                            <ComposableMap projection="geoAlbersUsa">
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) => (
                                        <>
                                            {geographies.map(geo => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    stroke="#065A7E"
                                                    geography={geo}
                                                    fill="#94B7FB"
                                                />
                                            ))}
                                            {geographies.map(geo => {
                                                const centroid = geoCentroid(geo);
                                                const cur = allStates.find(s => s.val === geo.id);
                                                return (
                                                    <g key={geo.rsmKey + "-name"}>
                                                        {cur &&
                                                            centroid[0] > -160 &&
                                                            centroid[0] < -67 &&
                                                            (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                                                <Marker coordinates={centroid} >
                                                                    <WhiteToolTip arrow title={
                                                                        <Text sx={{ padding: '1px !important', color: 'black !important' }}><img src={users} alt='img' style={{ paddingRight: '5px' }} />{graphData.stateWiseData && graphData.stateWiseData[cur.id] ? graphData.stateWiseData[cur.id] : 'There are no placements'}</Text>
                                                                    } placement="top">
                                                                        <text y="2" fontSize={10} fontWeight={400} fill="#7643A3" textAnchor="middle" cursor={'pointer'}>
                                                                            {cur.id}
                                                                        </text>
                                                                    </WhiteToolTip>

                                                                </Marker>
                                                            ) : (
                                                                <Annotation
                                                                    subject={centroid}
                                                                    dx={offsets[cur.id][0]}
                                                                    dy={offsets[cur.id][1]}
                                                                >
                                                                    <text x={4} fontSize={10} fontWeight={400} fill="#7643A3" alignmentBaseline="middle">
                                                                        {cur.id}
                                                                    </text>
                                                                </Annotation>
                                                            ))}
                                                    </g>
                                                );
                                            })}
                                        </>
                                    )}
                                </Geographies>
                            </ComposableMap>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <Stack>
                                <Text dashboardTitle sx={{ fontSize: '16px !important', ml: '30px', mb: '20px' }}>States</Text>
                                <Stack ml={'30px'} sx={{ maxHeight: '100vh !important', overflowY: 'auto' }} >
                                    {allStates.map((item) => (
                                        <Text statesText sx={{ borderBottom: '1px solid #EAECF0', padding: '12px 16px' }}>{item.id}</Text>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default GraphDashboard