import { Box, Stack } from '@mui/material';
import React from 'react';
import myColors from './constant/myColors';

const SubStep = ({ subSteps, currentStep, completedSteps }) => {
  if (subSteps[currentStep] > 1) {
    return (
      <Stack marginX={4} marginTop={4} direction="row">
        {Array.from({ length: subSteps[currentStep] }).map((_, index) => (
          <Box
            borderBottom={2}
            borderColor={
              completedSteps >= index + 1 ? myColors.primary : '#D9D9D9'
            }
            flex={1}
            height={0}
            bgcolor="#D9D9D9"
            marginX={1}
          />
        ))}
      </Stack>
    );
  } else {
    return null;
  }
};

export default SubStep;
