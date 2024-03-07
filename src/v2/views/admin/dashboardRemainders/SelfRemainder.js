import { Box, Divider, Grid, Menu, MenuItem, Tab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Text from '../../../components/customText/Text';
import arrow from '../../../assets/svg/dashboard/left-arrow.svg';
import sales from '../../../assets/svg/dashboard/Sales.svg';
import menu from '../../../assets/svg/dashboard/menu.svg';
import LayoutStyles from '../DasboardStyles';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import { TabContext, TabList } from '@mui/lab';
import DashboardAPI from '../../../apis/admin/DashboardAPI';
import Button from '../../../components/customButton/Button';

function SelfReminder() {
  const classes = LayoutStyles();
  const navigate = useNavigate();
  const payCycle = require('../../../utils/jsons/Cycle.json');
  const filterList = require('../../../utils/jsons/MonthsFilter.json');
  const [openStatus, setOpenStatus] = useState(null);
  const [value, setValue] = useState('1');

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    total: '',
    totalPages: ''
  })

  const slug='self_reminder'

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

  const handleStatus = (args) => {
    setOpenStatus(null);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <Grid container spacing={2} justifyContent='center' pl={15} pt={2}>
      <Grid item container lg={10} alignItems='center' pb={2}>
        <Grid item lg={6}>
          <Text boldBlackfont22><img src={arrow} alt='arrow' style={{ marginBottom: '-5px', paddingRight: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />Self Reminders</Text>
        </Grid>
        <Grid item lg={2} className={classes.border}>
          <CustomSelect
            viewDrop1
            scrollTrue={true}
            options={payCycle}
            Icon={KeyboardArrowDownTwoToneIcon}
            placeholder={<Text largeBlack>Pay Cycle</Text>}
          />
        </Grid>
        <Grid item lg={2} className={classes.border}>
          <CustomSelect
            viewDrop1
            scrollTrue={true}
            options={payCycle}
            Icon={KeyboardArrowDownTwoToneIcon}
          />
        </Grid>
        <Grid item lg={2}>
          <CustomSelect
            viewDrop1
            scrollTrue={true}
            options={filterList}
            Icon={KeyboardArrowDownTwoToneIcon}
          />
        </Grid>
      </Grid>
      <Grid item lg={10} pb={3}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '25%' }}>
            <TabList onChange={handleChange}>
              <Tab label='Pending' value="1" className={value == '1' ? classes.activeText : classes.tabText} />
              <Tab label='Completed' value="2" className={value == '2' ? classes.activeText : classes.tabText} />
            </TabList>
          </Box>
        </TabContext>
      </Grid>
      {
        data.length > 0 ?
          data.map((item) => (
            <Grid item container lg={10} mt={1} alignItems='center'>
              <Grid item container lg={9} alignItems='center' spacing={2} columnSpacing={3}>
                <Grid item lg={1} textAlign='center'>
                  <Box alignItems='center' sx={{ background: '#F1F6FE !important', borderRadius: '50%', height: '55px', width: '54px', paddingTop: '15px' }}>
                    <img src={sales} alt='sales' />
                  </Box>
                </Grid>
                <Grid item lg={10} ml={2}>
                  <Box display='flex' flexDirection='row' gap={2}>
                    <Text mediumBlackColor>{item.name}</Text>
                  </Box>
                  <Text smallGrey sx={{ paddingTop: "6px" }}>{item.approvalNames}</Text>
                </Grid>
              </Grid>
              <Grid item lg={3}>
                <Box display='flex' flexDirection='row' gap={4}>
                  <Box>
                    <Text smallGrey>11:23am</Text>
                    <Text smallGrey sx={{ paddingTop: '6px' }}>11-sep-2023</Text>
                  </Box>
                  {
                    value == '1' &&
                    <img src={menu} alt="menu" onClick={(e) => setOpenStatus(e.currentTarget)} style={{ cursor: 'pointer' }} />
                  }
                  <Menu
                    id="basic-menu"
                    anchorEl={openStatus}
                    open={openStatus}
                    onClose={handleStatus}
                    sx={{
                      '& .MuiPaper-root': {
                        boxShadow: 'none !important',
                        border: '1px solid #EAECF0 !important',
                        width: '140px !important'
                      }
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  >
                    <MenuItem onClick={handleStatus} value={1} className={classes.viewText} ><Text smallBlack>Mark as completed</Text></MenuItem>
                    <MenuItem onClick={handleStatus} value={2} className={classes.viewText} ><Text smallBlack>Remind me later</Text></MenuItem>
                    <MenuItem onClick={handleStatus} value={3} className={classes.viewText} ><Text smallBlack>Mute Reminders</Text></MenuItem>
                    <MenuItem onClick={handleStatus} value={4} className={classes.deleteText} ><Text smallBlack>Delete</Text></MenuItem>
                  </Menu>
                </Box>
              </Grid>
              <Divider sx={{ width: '92%', borderColor: '#F5F5F5', margin: '10px 0px 0px 0px' }} />
            </Grid>
          )) : data.length == 0 ?
            <Box sx={{ height: '100%', width: '100%', textAlign: 'center', alignItems: 'center' }}>
              <Text largeBlack>No Data Available</Text>
            </Box> : ''
      }
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

export default SelfReminder