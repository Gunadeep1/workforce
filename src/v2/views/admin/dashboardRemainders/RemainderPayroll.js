import { Box, Divider, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Text from '../../../components/customText/Text';
import arrow from '../../../assets/svg/dashboard/left-arrow.svg';
import Payroll from '../../../assets/svg/dashboard/Payroll.svg';
import Button from '../../../components/customButton/Button';
import LayoutStyles from '../DasboardStyles';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import DashboardAPI from '../../../apis/admin/DashboardAPI';
import { ReactComponent as Newtag } from '../../../assets/svg/NewTag.svg'
import LocalStorage from '../../../utils/LocalStorage';
import CommonApi from '../../../apis/CommonApi';

function RemainderPayroll() {
  const classes = LayoutStyles();
  const navigate = useNavigate();
  const filterList = require('../../../utils/jsons/MonthsFilter.json');

  const [data, setData] = useState([]);
  const [payrollDropdown, setPayrollDropdown] = useState([]);
  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    total: '',
    totalPages: ''
  })

  const [cycle, setCycle] = useState([]);

  const slug = 'payroll'
  useEffect(() => {
    listing(slug, pagination);
    cycleDropdown() // eslint-disable-next-line
  }, [])

  const [state, setState] = useState({
    payCycle: '',
    payPeriod: '',
    all: '',
    form_date: '',
    to_date: ''
  })

  const changeHandler = (e) => {
    if (e.target.name == 'payCycle') {
      getPayrollDrodown(e.target.value);
      setState({
        ...state,
        [e.target.name]: e.target.value
      })
    } else if (e.target.name == 'all') {
      setState({
        ...state,
        [e.target.name]: e.target.value
      })
    }
    else {
      setState({
        ...state,
        [e.target.name]: e.target.value
      })
    }
  }

  const listing = (slug, pagination) => {
    DashboardAPI.remaindersListing(slug, pagination).then((res) => {
      if (res.data.statusCode == 1003) {
        setData(res.data.data);
        setPagination(res.data.pagination)
      }
    })
  }

  const cycleDropdown = () => {
    CommonApi.getCycleDropdown(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
      if (response.data.statusCode == 1003) {
        setCycle(response.data.data);
      }
    });
  };

  const getPayrollDrodown = () => {
    DashboardAPI.payrollConfigDropdown().then((res) => {
      if (res.data.statusCode == 1003) {
        setPayrollDropdown(res.data.data);
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
        <Grid item lg={6}>
          <Text boldBlackfont22><img src={arrow} alt='arrow' style={{ marginBottom: '-5px', paddingRight: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />Payroll Reminders</Text>
        </Grid>
        <Grid item lg={2} className={classes.border}>
          <CustomSelect
            viewDrop1
            scrollTrue={true}
            options={cycle}
            name='payCycle'
            value={state.payCycle}
            Icon={KeyboardArrowDownTwoToneIcon}
            onChange={changeHandler}
            label={<Text mediumGrey>{state.payCycle == '' ? 'Pay Cycle' : ''}</Text>}
          />
        </Grid>
        <Grid item lg={2} className={classes.border}>
          <CustomSelect
            viewDrop1
            scrollTrue={true}
            options={payrollDropdown}
            Icon={KeyboardArrowDownTwoToneIcon}
            name='payPeriod'
            value={state.payPeriod}
            onChange={changeHandler}
            // disabled={state.payCycle == ''}
            label={<Text mediumGrey>{state.payPeriod == '' ? 'Pay Period' : ''}</Text>}
          />
        </Grid>
        <Grid item lg={2}>
          <CustomSelect
            viewDrop1
            scrollTrue={true}
            options={filterList}
            Icon={KeyboardArrowDownTwoToneIcon}
            name='all'
            value={state.all}
            onChange={changeHandler}
            label={<Text mediumGrey>{state.all == '' ? 'All' : ''}</Text>}
          />
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
                        <img src={Payroll} alt='Payroll' />
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

export default RemainderPayroll