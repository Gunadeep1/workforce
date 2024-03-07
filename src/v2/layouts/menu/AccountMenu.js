import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Text from '../../components/customText/Text';
import { ReactComponent as User } from '../../assets/svg/fi_user.svg';
import { ReactComponent as Configuration } from '../../assets/svg/Configuration.svg';
import { ReactComponent as Support } from '../../assets/svg/Support.svg';
import { ReactComponent as Logout } from '../../assets/svg/Logout.svg';
import { useNavigate } from 'react-router-dom';
import AccountMenuStyles from './AccountMenuStyles';
import styled from '@emotion/styled';
import { Badge } from '@mui/material';
import LocalStorage from '../../utils/LocalStorage';
import CommonApi from '../../apis/CommonApi';
import { addErrorMsg, addSuccessMsg } from '../../utils/utils';

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    border: '2px solid white',
    borderRadius: '50%',
    width: '12px',
    height: '12px',
  },
}));


export default function AccountMenu(props) {

  const classes = AccountMenuStyles();
  const person = props.person ? props.person : () => { };
  const UserName = props.UserName ? props.UserName : () => { };
  const MailId = props.MailId ? props.MailId : () => { };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    //userData passing thorough the api
    const userData = {
      request_id: LocalStorage.uid(),
      login_id: LocalStorage.getUserData().login_id
    }
    CommonApi.Logout(userData, LocalStorage.getAccessToken()).then((response) => {
      if (response.data.statusCode == 1003) {
        addSuccessMsg("sucessfully Logged Out") //for success msg Alert
        localStorage.clear();
        setAnchorEl(null);
        window.location.reload();
      }      
      else {
        addErrorMsg(response.data.message); //for Error msg Alert
      }
    })
  };

  const handleViewProfile = () => {
    navigate('/myprofile')
  }
  const handleClickNavigateToConfiguration = () => {
    navigate('/configuration');
    setAnchorEl(null);
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>

        <Box className={`${open ? classes.avatarBoxActive : classes.avatarBox}`} onClick={handleClick} >
          <Avatar sx={{ width: 40, height: 40 }} src={person} />
        </Box>

      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        className={classes.menu}
        PaperProps={{
          sx: {
            mt: "6px",
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem className={classes.menuItem} onClick={handleClose} sx={{

        }}>

          <Box className={classes.profileInfo}>

            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant='dot'
            >
              <Avatar sx={{ width: 40, height: 40 }} src={person} />

            </StyledBadge>
            <Box sx={{ diplay: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Text largeBlack >{UserName}</Text>
              <Text mediumLabel >{MailId}</Text>
            </Box>
          </Box>

        </MenuItem>

        <Divider sx={{ margin: '0px !important', borderColor: '#F2F4F7 !important', borderWidth: '1px !important' }} />


        <MenuItem onClick={handleViewProfile} className={classes.menuItemIn}>

          <Box className={classes.ListItem}>


            <User />




            <Text blackFont14 >View profile</Text>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleClickNavigateToConfiguration} className={classes.menuItemIn}>
          <Box className={classes.ListItem}>
            <Configuration />

            <Text blackFont14 >Configuration</Text>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleClose} className={classes.menuItemIn}>
          <Box className={classes.ListItem}>
            <Support />

            <Text blackFont14 >Support</Text>
          </Box>
        </MenuItem>
        <Divider sx={{ margin: '0px !important', borderColor: '#F2F4F7 !important', borderWidth: '1px !important' }} />
        <MenuItem onClick={handleLogout} className={classes.menuItemIn}>

          <Box className={classes.ListItem} >
            <Logout />
            <Text blackFont14 sx={{ color: '#F4535C !important' }}>Log out</Text>
          </Box>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}