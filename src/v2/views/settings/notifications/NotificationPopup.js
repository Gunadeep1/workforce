import React, { Fragment, useEffect, useState } from 'react';
import { socket } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem, Divider, Badge } from '@mui/material';
import { ReactComponent as BellIcon } from '../../../assets/svg/notification.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svg/bellclosen.svg';
import { ReactComponent as TimeSheetIcon } from '../../../assets/svg/timesheetfreeicon.svg';
import Text from '../../../components/customText/Text';
import BellIconStyles from './NotificationsStyles';
//import NotificationData from './NotificationPopupData.json';
import styled from '@emotion/styled';


const FilterBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 3,
        background: '#FF4B55 !important',
        border: '1px solid #FFFF',
        color: '#FFFF !important',

    },
}));

const NotificationTitle = {
    1: "Consultant Invitation",
    2: "Birthdays",
    3: "Placement Expiry",
    4: "Draft Timesheets",
    5: "Timesheet Approval",
    6: "Draft Invoices",
    7: "Invoice Approval",
    8: "Invoice",
    9: "Bills"
}

export default function Notification() {

    const navigate = useNavigate();
    const classes = BellIconStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [NotificationData, setNotificationData] = useState([]);
    //const [NotificationCount, setNotificationCount] = useState(0);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewAll = () => {
        handleClose();
        navigate('/notifications');
    };

    useEffect(() => {
        console.log(NotificationData,"before");
        socket.on("fetchNotifications", data => {
            setNotificationData(data.notifications);
            console.log(NotificationData,"after");
            //setNotificationCount(data.notificationsCount ? Number(data.notificationsCount.count) : 0);
        })
        console.log(NotificationData,"after");
        // eslint-disable-next-line
    }, [NotificationData, socket])

    useEffect(() => {
        socket.emit("fetchNotifications");
        // eslint-disable-next-line
    }, [socket])


    return (

        <Fragment>
            <Box className={classes.root1} onClick={handleClick} >
                <FilterBadge overlap="circular" variant={'dot'} >
                    <BellIcon height={24} width={24} />
                </FilterBadge>


            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                className={classes.menu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Divider sx={{ borderWidth: '0px !important' }} />
                <MenuItem className={classes.menuItem} >
                    <Text className={classes.header8}>Notifications</Text>
                    <Box className={classes.closeIcon}><CloseIcon onClick={handleClose} /></Box>
                </MenuItem>
                <Divider className={classes.line} />
                {NotificationData.map((obj, key) => (<>
                    <MenuItem className={classes.menuItemIn} key={key}>
                        <Box className={classes.ListItem}>
                            <Box className={classes.leftContainer}>
                                <Box className={classes.IconBg} sx={{ backgroundColor: `#F1F6FE` }} ><TimeSheetIcon stroke='#0C75EB' /></Box>
                                <Box className={classes.textArea} >

                                    <Text className={classes.header2}>{NotificationTitle[obj.notification_slug_id]}</Text>
                                    <Box className={classes.spanText}>
                                        <Text className={classes.header6}>{NotificationTitle[obj.notification_slug_id]}</Text>
                                        <Text className={classes.header7} >{obj.content}</Text>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className={classes.timeArea}>
                                <Text className={classes.header4} >{obj.last_notification_time}</Text>
                                <Text className={classes.header5}>{obj.date}</Text>
                            </Box>
                        </Box>
                    </MenuItem>
                    <Divider className={classes.line} />

                </>))}
                <MenuItem className={classes.viewAll}>
                    <Text className={classes.header9} onClick={handleViewAll}>View all</Text>
                </MenuItem>

            </Menu>
        </Fragment>
    );
}

