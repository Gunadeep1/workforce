import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PropTypes from "prop-types";
import { Box } from '@mui/material';
import moment from 'moment';
import { dateFormat } from '../../utils/utils';
import arrow from '../../assets/svg/dashboard/arrow.svg';

export default function DateSelect(props) {
    const {
        onChange, svgHeight, disabled,
    } = props;
    let dateValue = moment(props.value, dateFormat()).format('YYYY-MM-DD');
    let mindate = moment(props.minDate, dateFormat()).format('YYYY-MM-DD');
    let maxdate = moment(props.maxDate, dateFormat()).format('YYYY-MM-DD');
    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    // label={labelText}
                    disabled={disabled}
                    slotProps={
                        {
                            textField: {
                                InputProps: {
                                    disableUnderline: true
                                },
                                variant: 'filled',
                                fullWidth: true,
                                onKeyPress: (e) => { e.preventDefault(); },
                                sx: {
                                    "& .MuiOutlinedInput-input": {
                                        font: '14px Nunito !important',
                                        fontWeight: `${400} !important`,
                                    },
                                    '& .MuiInputBase-root': {
                                        border: `none !important`,
                                        background: `${disabled ? '#FAFAFA !important' : '#FFFF !important'}`,
                                    },
                                    '& .MuiButtonBase-root': {
                                       padding:"0px !important",
                                       "&:hover":{
                                        background:"none !important"
                                       }
                                    },
                                    "& .MuiInputBase-input.MuiFilledInput-input": {
                                        font: '15px Nunito !important',
                                        fontWeight: `${600} !important`,
                                        color: '#262626 !important',
                                        width: "112px",
                                        paddingLeft:"0px"
                                    },

                                    "& .MuiInputBase-input.MuiFilledInput-input.Mui-disabled": {
                                        '-webkit-text-fill-color': '#525252 !important',
                                    },
                                    background: "#FFFF !important",
                                    svg: { padding:"0px",color: '#725AC1', height: svgHeight ? svgHeight : "24px" },

                                }
                            }
                        }}
                    value={dayjs(dateValue)} onChange={onChange} format={'MMMM YYYY'}
                    minDate={props.minDate !== undefined ? dayjs(mindate) : ''}
                    maxDate={props.maxDate !== undefined ? dayjs(maxdate) : ''}
                    components={{
                        OpenPickerIcon: () => (
                            <img src={arrow} alt='arrow' style={{ marginTop:"12px", width: 23,padding:0}} stroke={disabled ? "#737373" : props.value === "" ? "#737373" : "#262626"} />
                        ),
                    }}
                />
            </LocalizationProvider>
        </Box>

    );
}
Date.propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.any,
};