import React from "react";
import { Box, Stack } from "@mui/material";
import TimesheetStyles from '../timesheets/TimesheetStyles';
import Text from '../../../components/customText/Text';

export default function FilterCard(props) {

    const { item, filter, getFilterPlacementData } = props;
    const classes = TimesheetStyles();
   
    const filterTimesheet = (slug, filterType) => {
        getFilterPlacementData(slug, filterType)
    }

    return (
        <Box>
            {console.log(item.slug, 'itemm')}
            {console.log(filter.slug, 'filter')}
            <Box
                className={`${classes.placementCard} ${classes[item.slug]} ${filter.slug === item.slug ? classes[item.slug + "_active"] : ""}`}
                onClick={() => filterTimesheet( item.slug, "all")}
            >
                <Box px={2} className={classes.cardHead}>
                    <Stack direction="row" spacing={2} alignItems={"center"}>
                        <img src={item.icon} alt="circle1" />
                        <Text className={classes.cardCount}>{item.count}</Text>
                    </Stack>
                </Box>
                <Box px={2} className={classes.cardBody}>
                    <Text className={classes.cardText}>{item.text}</Text>
                </Box>
            </Box>
        </Box>
    )
};
