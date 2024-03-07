import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CircularProgress as MuiCircularProgress } from '@mui/material';
import Text from '../customText/Text';

/* Custom Circular Progress */
function CircularProgress(props) {
    /**
     * Function is for adding circular progress bar based on value around the image 
     * ---------------------------------------------------------------------------
     * Decleration:-
     * ======
     * @parem value :- based on value showing progrees bar expected type number other wise it will took default
     * @parem size :- circular progress size expected type number other wise it will took default
     * @parem color : circular progress color expected type string 
     * @parem src :- image source placed inside circular progress
     * @parem imgWidth and @parem imgHeight :-
     * image width and height expected type `string` other wise it will took default
     * */
    const { value, size, color, src, imgWidth, imgHeight, thickness, margin, percentage, name, disable } = props;

    return (
        <div>
            <Box position="relative" display="inline-flex">
                <MuiCircularProgress variant="determinate" sx={{ color: { color } }} thickness={thickness ? thickness : 1.5} value={value ? value : 100} size={size ? size : 81} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Tooltip arrow title={
                        <>
                            <Text mediumWhite>Profile Completion {percentage ? `${percentage}%` : ''}</Text>
                        </>
                    }>
                        {
                            src ?
                                <Typography variant="caption" component="div" color="textSecondary">
                                    <img src={src} alt="icon" width={imgWidth ? imgWidth : "70px"} height={imgHeight ? imgHeight : "80px"} style={{ margin: margin ? margin : "7px 0px 0px 0px", borderRadius: '50%' }} />
                                </Typography> :
                                <Avatar sx={{ background: disable ? '#adacac' : '#e5b256' }}><Typography sx={{ textTransform: 'capitalize' }}>{name}</Typography></Avatar>
                        }
                    </Tooltip>
                </Box>
            </Box>
        </div>
    );
}

export default CircularProgress;