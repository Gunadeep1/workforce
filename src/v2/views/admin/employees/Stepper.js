import * as React from 'react';
import { Box, Stack, Radio } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
// import SettingsIcon from '@mui/icons-material/Settings';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Text from '../../../components/customText/Text';
import { BrownMnCustomStepIcon } from '../../../theme';


const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: 'rgba(12, 117, 235, 1)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: 'rgba(12, 117, 235, 1)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
        transition: "all .6s ease",
    },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: 'rgba(12, 117, 235, 1)',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#FFFFFF',
        zIndex: 1,
        fontSize: 18,
        width: 20,
        height: 20,
        padding: "3px",
        borderRadius: '50%',
        backgroundColor: 'rgba(12, 117, 235, 1)',
        margin: "2px"
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));


function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Box sx={{ height: "22px", width: "22px",display:"flex", justifyContent:"center", alignItems:"center" }}>
                    <Check className="QontoStepIcon-completedIcon" />
                </Box>
            ) : (
                <Box sx={{ height: "22px", width: "22px", display:"flex", justifyContent:"center", alignItems:"center" }}>
                    <Radio
                        checked={active}
                        onChange={() => console.log("fds")}
                        value="a"
                        name="radio-buttons"
                        sx={{ padding: "2px" }}
                    />
                </Box>
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};

const steps = ['Basic Details', 'Documents'];


export default function Invitelinkform(props) {

    // const [activeStep, setActiveStep] = React.useState(0);

    // const handleNext = () => {
    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // };

    // const handleBack = () => {
    //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // };

    return (

            <Stack sx={{ width: '100%' }}>
                <Stepper activeStep={props.activeStepper} variant="progress" connector={<QontoConnector />} >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={BrownMnCustomStepIcon}><Text BrowmnMnStepperText sx={{marginTop:'-5px !important'}}>{label}</Text></StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Stack>


        //     <button type="button" onClick={() => handleBack()}>Back</button>
        //     <button type="button" onClick={() => handleNext()}>Next</button>
        
    );
}





