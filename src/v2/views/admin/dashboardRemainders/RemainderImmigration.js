import { Box, Divider, Grid } from '@mui/material'
import React from 'react'
import Text from '../../../components/customText/Text';
import arrow from '../../../assets/svg/dashboard/left-arrow.svg';
import Immigration from '../../../assets/svg/dashboard/Immigration.svg';
import LayoutStyles from '../DasboardStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as Newtag } from '../../../assets/svg/NewTag.svg'

function RemainderImmigration() {
  const classes = LayoutStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.data

  // const data = [
  //   {
  //     name: 'H1B Visa',
  //     approvalNames: 'Approval Request',
  //     ApprovedBy:'Google',
  //     count:'Admin 3',
  //     status:'Approve'
  //   },
  //   {
  //     name: 'State ID',
  //     approvalNames: 'Approval Request',
  //     ApprovedBy:'Google',
  //     count:'Consultant',
  //     status:'Approve'
  //   }
  // ]

  return (
    <Grid container spacing={2} justifyContent='center' pl={15} pt={2}>
      <Grid item container lg={10} alignItems='center' pb={3}>
        <Grid item lg={12}>
          <Text boldBlackfont22><img src={arrow} alt='arrow' style={{ marginBottom: '-5px', paddingRight: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />Immigration Reminders</Text>
        </Grid>
      </Grid>
      <Box className={classes.scrollableBox} justifyContent='center' p={2}>
        <Grid container lg={11} justifyContent='center' pt={2}>
          {
            data.length > 0 ?
              data.map((item) => (
                <Grid item container lg={10} mt={1} alignItems='center' sx={{ cursor: 'pointer' }} onClick={() => navigate('/timesheet/add-timesheet', { state: { id: item.id } })}>
                  <Grid item container lg={8} alignItems='center' spacing={2} columnSpacing={3}>
                    <Grid item lg={1} textAlign='center'>
                      <Box alignItems='center' sx={{ background: '#FFF6ED !important', borderRadius: '50%', height: '55px', width: '54px', paddingTop: '15px' }}>
                        <img src={Immigration} alt='immigration' />
                      </Box>
                    </Grid>
                    <Grid item lg={10} ml={2}>
                      <Box display='flex' flexDirection='row' gap={2}>
                        <Text mediumBlackColor>{item.name}</Text>
                        {
                          item.is_read == false && <Newtag />
                        }
                      </Box>
                      <Text smallGrey sx={{ paddingTop: "6px" }}>{item.approvalNames}</Text>
                      <Text smallGrey noWrap>{item.template}</Text>
                    </Grid>
                  </Grid>
                  <Grid item container lg={4}>
                    <Grid item lg={12} textAlign='center'>
                      <Text smallGrey noWrap>{item.date ? item.date : '-'}</Text>
                    </Grid>
                  </Grid>
                  <Divider sx={{ width: '92%', borderColor: '#F5F5F5', margin: '10px 0px 10px 0px' }} />
                </Grid>
              )) : data.length == 0 ?
                <Box sx={{ height: '100%', width: '100%', textAlign: 'center', alignItems: 'center' }}>
                  <Text largeBlack>No Data Available</Text>
                </Box> : ''
          }
        </Grid>
      </Box>
    </Grid >
  )
}

export default RemainderImmigration