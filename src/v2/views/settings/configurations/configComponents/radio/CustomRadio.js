import React from 'react';
import { Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Text from '../../../../../components/customText/Text';
import { ReactComponent as RadioIcon } from '../../../../../assets/svg/RadioIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../../../assets/svg/RadioCheckedIcon.svg';
import { ReactComponent as RadioDisabledIcon } from '../../../../../assets/svg/RadioDisabled.svg';
import { ReactComponent as RadioCheckedDisabedIcon } from '../../../../../assets/svg/RadioCheckedDisabled.svg';



const CustomRadioGroup = ({ options, value, onChange, name, disabled }) => {
  return (
    <Box display="flex" flexDirection="row">
      <RadioGroup row value={value} name={name} onChange={onChange} flexDirection="column">
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={<Radio icon={disabled ? <RadioDisabledIcon /> : <RadioIcon />}
              checkedIcon={disabled ? <RadioCheckedDisabedIcon /> : <RadioCheckedIcon />} />}
            label={<Text mediumGrey2 >{option.label}</Text>}
            value={option.value}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default CustomRadioGroup;