import { FormControl, InputLabel, Select, TextField } from '@mui/material';
import classNames from 'classnames';
import React from 'react';
import PropTypes from "prop-types";
import SelectFieldStyles from './SelectFieldStyles';

const Menu = {
    // disableScrollLock: true,
    //   keepMounted: true,
    //   disablePortal: true,
    PaperProps: {
        style: {
            font: "14px Nunito Sans, sans-serif !important",
            maxHeight: "180px",
            marginTop: '10px !important',
            boxShadow: '0px 0px 15px 0px #0000001F !important',
            overFlow: 'scroll',
            "&::-webkit-scrollbar": {
                display: "none !important"
            },
            "& .MuiInputBase-root-MuiFilledInput-root": {
                background: '#FFFFFF !important'
            }
        },
        sx: {
            transitionDelay: '0.1s !important',
            "&::-webkit-scrollbar": {
                display: "none !important"
            },
            "& .MuiMenuItem-root": {
                font: "14px Nunito Sans, sans-serif !important",
                color: "#262626 !important",
                height: '45px !important'
            },
            // "& .MuiMenuItem-root.Mui-selected": {
            //     backgroundColor: "#F9A828 !important",
            //     font: "14px Nunito Sans, sans-serif !important",
            //     color: "#ffffff !important",
            // },
            // "& .MuiMenuItem-root:hover": {
            //     backgroundColor: "#F9A828 !important",
            //     font: "14px Nunito Sans, sans-serif !important",
            //     color: "#ffffff !important",
            // },
        },
    },
};

const MenuScroll = {
    disableScrollLock: true,
    //   keepMounted: true,
    //   disablePortal: true,
    PaperProps: {
        style: {
            font: "14px Nunito Sans, sans-serif !important",
            maxHeight: "180px"
        },
        sx: {
            transitionDelay: '0.1s !important',
            "& .MuiMenuItem-root": {
                // padding: "0px 10px 6px 12px !important", 
                font: "14px Nunito Sans, sans-serif !important",
                color: "#262626 !important",
                height: '45px !important'
            },
            "& .MuiInputBase-root-MuiFilledInput-root": {
                background: '#FFFFFF !important'
            }
            // "& .MuiMenuItem-root.Mui-selected": {
            //     backgroundColor: "#F9A828 !important",
            //     font: "14px Nunito Sans, sans-serif !important",
            //     color: "#ffffff !important",
            // },
            // "& .MuiMenuItem-root:hover": {
            //     backgroundColor: "#F9A828 !important",
            //     font: "14px Nunito Sans, sans-serif !important",
            //     color: "#ffffff !important",
            // },
        },
    },
};

function SelectField(props) {
    const classes = SelectFieldStyles();
    const { name,
        value,
        onChange,
        children,
        className,
        defaultSelect,
        scrollTrue,
        labelText,
        inputProps,
        ...rest } = props

    const styleClasses = classNames({
        [className]: className,
        [classes.defaultSelect]: defaultSelect,
    })

    return (
        // <Select
        // name={name}
        // value={value}
        // onChange={onChange}
        // fullWidth
        // {...rest}
        // className={styleClasses}
        // MenuProps={scrollTrue ? MenuScroll : Menu}
        // >
        //     {children}
        // </Select>

        <FormControl variant="filled" sx={{ width: '100%' }}>
            <InputLabel id="demo-simple-select-filled-label">{labelText}</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                name={name}
                value={value}
                onChange={onChange}
                InputProps={{ disableUnderline: true }}
                className={styleClasses}
            >
                {children}
            </Select>
        </FormControl>




        // <TextField
        //     name={name}
        //     value={value}
        //     onChange={onChange}
        //     fullWidth
        //     variant="filled"
        //     InputProps={{ disableUnderline: true}}
        //     {...rest}
        //     className={styleClasses}
        //     MenuProps={scrollTrue ? MenuScroll : Menu}
        //     select
        //     label={labelText}
        //     {...inputProps}
        // >
        //     {children}
        // </TextField>
    )
}

export default SelectField

SelectField.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    defaultSelect: PropTypes.bool,
    scrollTrue: PropTypes.any,
    labelText: PropTypes.any,
    inputProps: PropTypes.object
}