import { Box, Divider, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Text from '../../../components/customText/Text';
import arrow from '../../../assets/svg/dashboard/left-arrow.svg';
import Expmgnt from '../../../assets/svg/dashboard/Expense-Management.svg';
import Button from '../../../components/customButton/Button';
import LayoutStyles from '../DasboardStyles';
import { useNavigate } from 'react-router-dom';
import DashboardAPI from '../../../apis/admin/DashboardAPI';
import { ReactComponent as Newtag } from '../../../assets/svg/NewTag.svg'

function RemainderExpenseMgmt() {
  const classes = LayoutStyles();
  const navigate = useNavigate();

  const slug = 'expense-management'

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    total: '',
    totalPages: ''
  })

  useEffect(() => {
    listing(slug, pagination); // eslint-disable-next-line
  }, [])

  const listing = (slug, pagination) => {
    DashboardAPI.remaindersListing(slug, pagination).then((res) => {
      if (res.data.statusCode == 1003) {
        setData(res.data.data);
        setPagination(res.data.pagination)
      }
    })
  }

  const loadMore = () => {
    pagination['currentPage'] = 1
    pagination['perPage'] = parseInt(pagination.perPage) + 10
    setPagination({ ...pagination });
    listing(slug, pagination);
  }

  return (
    <Grid container spacing={2} justifyContent='center' pl={15} pt={2}>
      <Grid item container lg={10} alignItems='center' pb={3}>
        <Grid item lg={12}>
          <Text boldBlackfont22><img src={arrow} alt='arrow' style={{ marginBottom: '-5px', paddingRight: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />Expenses Reminders</Text>
        </Grid>
      </Grid>
      <Box className={classes.scrollableBox} justifyContent='center' p={2}>
        <Grid container lg={11} justifyContent='center' pt={2}>
          {
            data.length > 0 ?
              data.map((item) => (
                <Grid item container lg={10} mt={1} alignItems='center' sx={{ cursor: 'pointer' }} onClick={() => navigate('/expense-management')}>
                  <Grid item container lg={8} alignItems='center' spacing={2} columnSpacing={3}>
                    <Grid item lg={1} textAlign='center'>
                      <Box alignItems='center' sx={{ background: '#FFF6ED !important', borderRadius: '50%', height: '55px', width: '54px', paddingTop: '15px' }}>
                        <img src={Expmgnt} alt='Expmgnt' />
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
      {
        pagination.totalPages && pagination.currentPage < pagination.totalPages ?
          <Grid item lg={10} textAlign='center' justifyContent='center'>
            <Box sx={{ textAlign: "center", padding: "10px" }} mt={5}>
              <Button outlineBlue onClick={loadMore}>Load more</Button>
            </Box>
          </Grid> : ''
      }
    </Grid >
  )
}

export default RemainderExpenseMgmt