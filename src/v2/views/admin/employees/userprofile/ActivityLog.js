import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack, Grid, Stepper, Step, StepLabel, StepContent, } from '@mui/material';
import Text from '../../../../components/customText/Text';
import { ReactComponent as Tick } from '../../../../assets/svg/tick.svg'
import UserProfileApi from '../../../../apis/admin/employees/UserProfileApi';
import LoaderIcon from '../../../../assets/svg/sandtimer.svg';

function ActivityLog() {
    useEffect(() => {
        getActivity(activityFilter)
        // eslint-disable-next-line
    }, [])// eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const activityRef = useRef(null); // eslint-disable-next-line
    const [activeStep, setActiveStep] = useState(0);
    const [activityData, setActivityData] = useState([])
    const [activityFilter, setActivityFilter] = useState({
        limit: 10,
        page: 1,
    })

    const [activityTotal, setActivityTotal] = useState()

    const getActivity = (args) => {
        // setLoading(true)
        UserProfileApi.getActivity(args).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    // setLoading(false)

                    setActivityData(response.data.data);
                    setActivityTotal(response.data.pagination.total)
                }
            }, 300)

        });
    };



    const activityHandleScroll = () => {
        const { current } = activityRef;
        if (current) {
            const { scrollTop, scrollHeight, clientHeight } = current;
            if (scrollTop + clientHeight >= scrollHeight) {
                // getCategory({...filter})
                if (activityTotal >= activityFilter.limit) {
                    setActivityFilter({ ...activityFilter, limit: activityFilter.limit + 10, page: 1 })
                    getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1, });
                }
            }
        }
    };


    return (
        <div>
            {loading ?
                <Box sx={{
                    height: '75vh',
                    overflow: 'auto',
                    padding: '16px',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                    </Stack>
                </Box>
                :
                <Box sx={{
                    overflowY: "auto",
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                }}>

                    <Box height={'6vh'} display={'flex'} alignItems={'start'} sx={{
                        overflowY: "auto",
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                    }}>
                        <Text blackHeader18>Activity Log</Text>
                    </Box>
                    <Box sx={{
                        height: '83vh',
                        overflowY: "auto",
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },

                    }}
                        ref={activityRef}
                        onScroll={activityHandleScroll}>
                        {activityData.length > 0 &&
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {activityData.map((step, index) => (
                                    <Step key={step.label} active={true}>
                                        <StepLabel StepIconComponent={() => (
                                            <Tick style={{ width: '20px' }} />
                                        )} >
                                            {step.action_type_name === "update" ?
                                                <Text mediumBlue>{step.employee_name} {step.referrable_type_name} has been updated by {step.created_by}.</Text> : step.action_type_name === "store" ? <Text mediumBlue>{step.employee_name} {step.referrable_type_name} has been created by {step.created_by}.</Text> : ""
                                            }
                                        </StepLabel>
                                        <StepContent>
                                            <Grid item xs={11} display='flex' flexDirection='column' rowGap={'7px'} >
                                                <Stack direction='row' spacing={1}>
                                                    <Text verySmallBlack>{step.created_time}</Text>
                                                    <Text verySmallBlack>{step.created_at}</Text>
                                                </Stack>

                                                <Text smallBlack>{step.field_changes === '[]' ? "" : step.field_changes}</Text>
                                            </Grid>

                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                        }

                    </Box>
                </Box>
            }
        </div>
    )
}

export default ActivityLog
