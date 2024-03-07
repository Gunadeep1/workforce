import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PropTypes from "prop-types";
import { Box } from '@mui/material';
import moment from 'moment';
import { dateFormat } from '../../utils/utils';
import { ReactComponent as CalendarIcon } from '../../assets/svg/CalenderIcon.svg';

export default function Date(props) {
    const {
        onChange, height, svgHeight, disabled, labelText,
    } = props;
    let dateValue = moment(props.value, dateFormat()).format('YYYY-MM-DD');
    let mindate = moment(props.minDate, dateFormat()).format('YYYY-MM-DD');
    let maxdate = moment(props.maxDate, dateFormat()).format('YYYY-MM-DD');
    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={labelText}
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

                                    ".MuiFormLabel-root.MuiInputLabel-root": {
                                        font: '14px Nunito !important',
                                        fontWeight: `${400} !important`,
                                        color: '#737373 !important'
                                    },

                                    '& .MuiInputBase-root': {
                                        height: height ? height : '54px !important',
                                        border: `${disabled ? '1px solid #FFFF !important' : '1px solid #C7CCD3 !important'}`,
                                        borderRadius: '8px !important',
                                        background: `${disabled ? '#FAFAFA !important' : '#FFFF !important'}`,
                                    },
                                    "& .MuiInputBase-input.MuiFilledInput-input": {
                                        font: '14px Nunito !important',
                                        fontWeight: `${400} !important`,
                                        color: '#262626 !important'
                                    },

                                    "& .MuiInputBase-input.MuiFilledInput-input.Mui-disabled": {
                                        '-webkit-text-fill-color': '#525252 !important',
                                    },
                                    background: "#FFFF !important",
                                    svg: { color: '#725AC1', height: svgHeight ? svgHeight : "24px" },

                                }
                            }
                        }}
                    value={dayjs(dateValue)} onChange={onChange} format={dateFormat().toUpperCase()}
                    minDate={props.minDate !== undefined ? dayjs(mindate) : ''}
                    maxDate={props.maxDate !== undefined ? dayjs(maxdate) : ''}
                    components={{
                        OpenPickerIcon: () => (
                            <CalendarIcon stroke={disabled ? "#737373" : props.value === "" ? "#737373" : "#5DA5F5"} />
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