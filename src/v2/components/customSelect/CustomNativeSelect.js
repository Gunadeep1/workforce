import { Select } from '@mui/material'
import classNames from 'classnames';
import React from 'react'
import CustomSelectStyles from './CustomSelectStyles';
import PropTypes from 'prop-types'


function CustomNativeSelect(props) {
    const classes = CustomSelectStyles();
    const {
        name,
        value,
        onChange,
        children,
        className,
        defaultNativeSelect,
        options,
        ...rest
    } = props;

    /**
     * @parem name: - target name for input 
     * @parem value:- target value
     * @parem onChange: - onChange functinality
     * @parem chidren : - expected type node better to pass options in the place of children
     * ------------------
     * @parem Remaining all the props for input styles
     * -----------------
     * @parem options for json object for drop down list expected type JSON
     * */

    const styleClasses = classNames({
        [className]: className,
        [classes.defaultNativeSelect]: defaultNativeSelect,
    })
    return (
        <div>
            <Select
                native
                name={name}
                value={value}
                onChange={onChange}
                fullWidth
                {...rest}
                className={styleClasses}
            >
                <option aria-label="None" value="" />
                {
                    options.map((key, val) => (
                        <option key={key.value} value={key.value}>{key.label}</option>
                    ))
                }
            </Select>
        </div>
    )
}

export default CustomNativeSelect;

CustomNativeSelect.propTypes = {
    options: PropTypes.object,
    className: PropTypes.string,
    defaultNativeSelect: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string
}