import React, { useState } from "react";
import { Box, Stack, IconButton, Menu, MenuItem } from "@mui/material";
// import { Link, useLocation, } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import TimesheetStyles from '../timesheets/TimesheetStyles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Text from '../../../components/customText/Text';




export default function FilterCard(props) {

    const { item, filter, getFilterPlacementData } = props;
    const classes = TimesheetStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickfiltermenu = (event) => {
        if (event.target != event.currentTarget) {
            event.stopPropagation();
        }
        setAnchorEl(event.currentTarget);
    };
    const handleClosefiltermenu = () => {
        setAnchorEl(null);
    };
    const filterTimesheet = (e, slug, filterType) => {
        if (e.target == e.currentTarget) {
            e.stopPropagation()
        }
        setAnchorEl(null);
        getFilterPlacementData(slug, filterType)

    }

    return (
        <Box>
            {console.log(item.slug,'itemm')}
            {console.log(filter.slug,'filter')}
            <Box
                className={`${classes.placementCard} ${classes[item.slug]} ${filter.slug === item.slug ? classes[item.slug + "_active"] : ""}`}
                onClick={(e) => filterTimesheet(e, item.slug, "all")}
            >
                <Box px={2} className={classes.cardHead}>
                    <Stack direction="row" spacing={2} alignItems={"center"}>
                        <img src={item.icon} alt="circle1" />
                        <Text className={classes.cardCount}>{item.count}</Text>
                    </Stack>
                    <Box className={classes.moreiconBox}>
                        <IconButton
                            sx={{ padding: "2px" }}
                            onClick={handleClickfiltermenu}
                            aria-controls={open ? item.slug : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <MoreHorizIcon sx={{ fontSize: "24px", color: "#9D9E9F" }} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id={item.slug}
                            open={open}
                            onClose={handleClosefiltermenu}
                            onClick={handleClosefiltermenu}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.12))',
                                    padding: "8px",
                                    borderRadius: "8px",
                                    mt: 0.2,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    "& .css-6hp17o-MuiList-root-MuiMenu-list": {
                                        padding: "0px"
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        // transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={(e) => filterTimesheet(e, item.slug, "all")} data={item.slug} sx={{ px: "12px", borderRadius: "6px", font: "14px Nunito, Nunito Sans, sans-serif", fontWeight: 600 }}>
                                All
                            </MenuItem>
                            <MenuItem onClick={(e) => filterTimesheet(e, item.slug, "this_month")} sx={{ px: "12px", borderRadius: "6px", font: "14px Nunito, Nunito Sans, sans-serif", fontWeight: 600 }}>
                                This Month
                            </MenuItem>
                            <MenuItem onClick={(e) => filterTimesheet(e, item.slug, "last_three_months")} sx={{ px: "12px", borderRadius: "6px", font: "14px Nunito, Nunito Sans, sans-serif", fontWeight: 600 }}>
                                Last 3 Months
                            </MenuItem>
                            <MenuItem onClick={(e) => filterTimesheet(e, item.slug, "last_six_months")} sx={{ px: "12px", borderRadius: "6px", font: "14px Nunito, Nunito Sans, sans-serif", fontWeight: 600 }}>
                                Last 6 Months
                            </MenuItem>

                        </Menu>
                    </Box>
                </Box>
                <Box px={2} className={classes.cardBody}>
                    <Text className={classes.cardText}>{item.text}</Text>
                </Box>
            </Box>
        </Box>
    )
};
