import React from 'react'
import { Menu, MenuItem, } from "@mui/material";
import Button from '../../../components/customButton/Button';
import { ReactComponent as KeyboardArrowDownIcon } from '../../../assets/svg/broderlessdown.svg';
import BorderlessSelectStyles from './ReminderStyles';



export default function BorderlessSelect({ handleClose, open, anchorEl, options, handleClick, ApplyFilter, value }) {
    const classes = BorderlessSelectStyles();
    return (
        <div>
            <Button
                id="basic-menu"
                className={classes.selectButton}
                disableRipple
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {value}
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className={classes.selectMenu}

            >
                {
                    options.map((option) => (
                        <MenuItem key={option.id} onClick={() => ApplyFilter(option.value)} className={classes.viewText} >{option.value}</MenuItem>
                    ))
                }
            </Menu>
        </div>
    )
}
