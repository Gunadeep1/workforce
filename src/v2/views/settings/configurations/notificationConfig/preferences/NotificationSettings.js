import React from 'react'
import { Box, Grid, } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import CustomSelect from '../../../../../components/customSelect/CustomSelect';




export default function NotificationSettings({ current }) {

  const classes = MainStyles()


  const options = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Admin', label: 'Admin' },
  ];


  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
    }}>

      <Box className={classes.activeItemBox2}>
        <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <CustomSelect
              commonSelect
              label={'Expense Mangment'}
              options={options}
              name='EmploymentType'
              value={'Admin'}
              scrollTrue={true}
            // onChange={handleChange}
            ></CustomSelect>

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <CustomSelect
              commonSelect
              label={'Bills'}
              options={options}
              name='EmploymentType'
              value={'Admin'}
              scrollTrue={true}
            // onChange={handleChange}
            ></CustomSelect>

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <CustomSelect
              commonSelect
              label={'Placement'}
              options={options}
              name='EmploymentType'
              value={'Admin'}
              scrollTrue={true}
            // onChange={handleChange}
            ></CustomSelect>

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <CustomSelect
              commonSelect
              label={'Payroll'}
              options={options}
              name='EmploymentType'
              value={'Admin'}
              scrollTrue={true}
            // onChange={handleChange}
            ></CustomSelect>

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <CustomSelect
              commonSelect
              label={'Invoice'}
              options={options}
              name='EmploymentType'
              value={'Admin'}
              scrollTrue={true}
            // onChange={handleChange}
            ></CustomSelect>

          </Grid>

        </Grid>

      </Box>

    </Box>
  )
}
