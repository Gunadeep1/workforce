import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function MainSteps({ mainSteps, completedMainSteps }) {
  return (
    <Stack mt={4} direction="row" justifyContent="space-between">
      {mainSteps.slice(0, mainSteps.length).map((el, index) =>
      (index <= mainSteps.length - 1 && <Stack flex={1} direction="row" alignItems="center">
        {(index + 1 < completedMainSteps && (
          <CheckCircleIcon sx={{ marginRight: '10px', color: '#0C75EB' }} />
        )) ||
          (index + 1 === completedMainSteps && (
            <RadioButtonCheckedIcon sx={{ marginRight: '10px', color: '#0C75EB' }} />
          )) || <RadioButtonUncheckedIcon sx={{ marginRight: '10px', color: "#D1D5DB" }} />}
        {/* {index + 1 <= completedMainSteps ? (
          <RadioChecked color="primary" sx={{ marginRight: 1 }} />
        ) : (
          <RedioUnchecked color="disabled" sx={{ marginRight: 1 }} />
        )} */}
        <Typography>{el}</Typography>
        <Box
          borderBottom={2}
          borderColor={
            completedMainSteps > index + 1 ? '#0C75EB' : '#D1D5DB'
          }
          flex={1}
          height={0}
          bgcolor={
            completedMainSteps > index + 1 ? '#0C75EB' : '#D1D5DB'
          }
          marginX={1}
        />
      </Stack>)

      )}
      <Stack direction="row">
        {(mainSteps.length < completedMainSteps && (
          <CheckCircleIcon color="primary" sx={{ marginRight: 20 }} />
        )) ||
          (mainSteps.length === completedMainSteps && (
            <RadioButtonCheckedIcon color="primary" sx={{ marginRight: 10 }} />
          )) || <RadioButtonUncheckedIcon sx={{ marginRight: 1, color: '#D1D5DB' }} />}
        {/* {mainSteps.length <= currentMainStep ? (
        <RadioChecked color="primary" sx={{ marginRight: 1 }} />
      ) : (
        <RedioUnchecked color="disabled" sx={{ marginRight: 1 }} />
      )}
      <Typography>{mainSteps[mainSteps.length - 1]}</Typography> */}
      </Stack>
    </Stack>
  )
}

export default MainSteps