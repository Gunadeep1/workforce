import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';

 
const AntSwitch = styled(Switch)(({ theme }) => ({
  width:'40px',
  height: 24,
  padding:'0px',
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 21,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(12px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding:'1.5px',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    // boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 21,
    height: 21,
    borderRadius: 12,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(23, 23, 31, 0.16)' : 'rgba(23, 23, 31, 0.16)',
    boxSizing: 'border-box',
  },
}));
 
export default function ToggleSwitch({isActive, switchChange}) {
  return (
    <FormGroup>
      <Stack direction="row" spacing={1} alignItems="center">
        <AntSwitch checked={isActive} onChange={switchChange} inputProps={{ 'aria-label': 'ant design' }} />
      </Stack>
    </FormGroup>
  );
}