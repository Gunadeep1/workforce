import React, { useState } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    ListSubheader,
    TextField,
    // IconButton,
    Box,
    InputLabel,
    FormHelperText,
} from "@mui/material";
import SearchSelectStyles from "./SearchSelectStyles";
import PropTypes from "prop-types";
import Text from "../customText/Text";
// import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';

export default function SearchSelect(props) {
    const classes = SearchSelectStyles();
    const { icon, options, onChange, name, value, onClick, buttonName, width, clearShow, handleClearClick, labelText, disabled, helperText, referenceID, multiple, refId,check_date, ...rest } =
        props;

    /**
     * @param name: - target name for input expected type string
     * @param value:- target value expected type string
     * @param onChange: - onChange functionality expected type Function
     * @param buttonName: - button  expected type string
     * @param options : - Menu items for select field expected type Array
     * @param onClick: - onClick Function is for if you want add button under the
     *                   Menu pass onClick and its functionality expected type Function
     * */

    // eslint-disable-next-line
    const [searchText, setSearchText] = useState("");


    const displayedOptions = options
        .map((item) => {
            /**
             * Condition is for if options have key name as name it will go inside
             * otherwise
             * it will take display_name as label goes else block
             * */


            if (item.value) {
                if (item.value.toLowerCase().includes(searchText.toLowerCase())) {
                    return item;
                }
                return undefined;
            } else {

                if (item.name) {
                    if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
                        return item;
                    }
                    return undefined;
                }

                if (item.employee_name) {
                    if (item.employee_name.toLowerCase().includes(searchText.toLowerCase())) {
                        return item;
                    }
                    return undefined;
                }
                if (item.placed_employee_name) {
                    if (item.placed_employee_name.toLowerCase().includes(searchText.toLowerCase())) {
                        return item;
                    }
                    return undefined;
                }
                if (item.check_date && item.check_date.includes(searchText)) {
                    return item;
                }
                if (item.days.toString().includes(searchText)) {
                    return item;
                }
                return undefined;
            }
        })
        .filter((item) => item != undefined);

    //  Menu styles for Drop down menu item
    const Menu = {
        // disableScrollLock: true,
        autoFocus: false, // Disables auto focus on MenuItems and allows TextField to be in focus
        // disablePortal:true,
        // keepMounted:true,
        PaperProps: {
            style: {
                font: "15px Nunito Sans, sans-serif !important",
                maxHeight: "240.4px",
                // height:
                //     !onClick && options.length < 3 && displayedOptions.length == 0 ? "46px" :
                //         !onClick && options.length < 3 && displayedOptions.length == 1 ? "50px" :
                //             !onClick && options.length < 3 && displayedOptions.length == 2 ? "80px" :
                //                 !onClick && options.length < 3 && displayedOptions.length == 3 ? "85px" :
                //                     !onClick && options.length > 3 && displayedOptions.length == 4 ? "140px" :
                //                         !onClick && options.length > 3 && displayedOptions.length == 5 ? "165px" :
                //                             !onClick && options.length > 3 && displayedOptions.length > 5 ? "185px" :
                //                                 onClick && options.length < 3 && displayedOptions.length == 0 ? "68px" :
                //                                     onClick && options.length < 3 && displayedOptions.length == 1 ? "65px" :
                //                                         onClick && options.length < 3 && displayedOptions.length == 2 ? "85px" :
                //                                             onClick && options.length == 3 && displayedOptions.length == 3 ? "110px" :
                //                                                 onClick && options.length > 3 && displayedOptions.length == 4 ? "162px" :
                //                                                     onClick && options.length > 3 && displayedOptions.length == 5 ? "185px" :
                //                                                         onClick && options.length > 3 && displayedOptions.length > 5 && "210px",

                width: width ? width : '100px',
                opacity: 1,
                overflow: 'auto',
                whiteSpace: "normal",
                paddingBottom: "0px",
                marginTop: '10px',

            },
            sx: {
                "&::-webkit-scrollbar": {
                    display: "none !important",
                },
                "& .MuiMenuItem-root": {
                    // padding: "0px 10px 0px 12px !important",
                    marginTop: "0px !important",
                    // backgroundColor: "white !important",
                    font: "14px Nunito Sans, sans-serif !important",
                    color: "#323232 !important",
                    height: '46px !important',
                    borderBottom: "1px solid #EAECF0 !important"
                },
                // "& .MuiMenuItem-root.Mui-selected": {
                //     backgroundColor: "#F9A828 !important",
                //     font: "13px Nunito Sans, sans-serif !important",
                //     color: "#ffffff !important",
                // },
                // "& .MuiMenuItem-root:hover": {
                //     backgroundColor: "#F9A828 !important",
                //     font: "13px Nunito Sans, sans-serif !important",
                //     color: "#ffffff !important",
                // },
                transitionDelay: '0.1s !important',
                "& .MuiMenu-list": {
                    paddingBottom: "0px !important",
                },
                "& .MuiSelect-select": {
                    backgroundColor: "red !important",
                },
            },
        },
    };

    // Html starts Here
    return (
        <FormControl fullWidth variant="filled" sx={{ position: "relative" }}>
            {/* <Box sx={{ padding:"6px 12px", height: "100%", width: "100%", position: "absolute", backgroundColor: "#FAFAFA ", zIndex: 100, borderRadius:"6px" }}>
                <Text sx={{ font: "14px Nunito Sans, sans-serif ", color:"#737373", fontWeight:400, }}>tedt</Text>
                <Text sx={{ font: "16px Nunito Sans, sans-serif ", color:"#262626", fontWeight:400, }}> sf av afb a</Text>
            </Box> */}
            {/* {console.log(props)} */}
            <InputLabel id="demo-simple-select-filled-label" className={classes.inputLabel} >{labelText}</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                MenuProps={Menu}
                value={value}
                name={name}
                onChange={onChange}
                disabled={disabled}
                onClose={() => setSearchText("")}
                // This prevents rendering empty string in Select's value
                // if search text would exclude currently selected option.
                // renderValue={() => selectedOption}
                className={classes.select}
                disableUnderline
                {...rest}
                IconComponent={KeyboardArrowDownTwoToneIcon}
            // endAdornment={
            //     !icon ?
            //         <IconButton sx={{ visibility: clearShow ? "visible" : "hidden" }} onClick={handleClearClick}>
            //             <ClearIcon sx={{ height: '15px !important', width: '15px !important' }} />
            //         </IconButton> : ''
            // }
            >
                {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
                {
                    options.length > 3 &&
                    <ListSubheader className={classes.listSubHeader}>
                        <Box className={classes.textFieldBox}>
                            <TextField
                                size="small"
                                focused
                                autoFocus
                                placeholder="Search..."
                                type="search"
                                value={searchText}
                                onChange={
                                    (e) => {
                                        if (buttonName == "Net Pay Terms") {
                                            let regex = new RegExp("^[0-9]+$");
                                            if (regex.test(e.target.value) || e.target.value == "") {
                                                setSearchText(e.target.value);
                                            }
                                        } else {
                                            setSearchText(e.target.value);
                                        }

                                    }
                                }
                                onKeyDown={(e) => {
                                    if (e.key != "Escape") {
                                        e.stopPropagation();
                                    }
                                }}
                                InputProps={{ classes: { input: classes.input } }}
                                // inputProps={{ autoFocus:true}}
                                className={classes.textField}
                            />
                        </Box>
                    </ListSubheader>
                }
                {/* {
          loading &&
          <MenuItem sx={{ justifyContent: "center" }}>
            <Box sx={{ height: 40 }}>
              <Fade in={loading} unmountOnExit>
                <CircularProgress />
              </Fade>
            </Box>
          </MenuItem>
        } */}
                {
                    check_date !== undefined ?
                        displayedOptions.map((val, key) => (
                            <MenuItem key={key} value={val.check_date} noWrap >
                                {val.check_date && val.check_date}
                            </MenuItem>
                        )) :
                        multiple !== undefined ?
                            displayedOptions.map((val, key) => (
                                <MenuItem key={key} value={val.employee_id ? [val.employee_id, val.placement_id] : val.id} noWrap >
                                    {val.value && val.value}
                                    {val.days && val.days}
                                    {val.check_date && val.check_date}
                                    {val.name && val.name}
                                    {val.placed_employee_name ? `${val.placed_employee_name} - ${val.placement_reference_id ? val.placement_reference_id : val.employee_reference_id && val.employee_reference_id}` : val.employee_name && val.employee_name}
                                </MenuItem>
                            ))
                            : displayedOptions.map((val, key) => (
                                <MenuItem key={key} value={val.employee_id ? val.employee_id : val.id} noWrap >
                                    {val.value && val.value}
                                    {val.reference_id && refId && `(${val.reference_id})`}
                                    {val.days && val.days}
                                    {val.check_date && val.check_date}
                                    {val.name && val.name}
                                    {val.placed_employee_name ? `${val.placed_employee_name} - ${val.placement_reference_id ? val.placement_reference_id : val.employee_reference_id && val.employee_reference_id}` : val.employee_name && val.employee_name}
                                </MenuItem>
                            ))}
                {displayedOptions.length <= 0 &&
                    // <MenuItem noWrap sx={{ justifyContent: "center" }}><b>No Data Found</b></MenuItem>
                    <Box sx={{ height: '30px !important', textAlign: 'center', paddingTop: '5px' }}>
                        <Text smallGrayLabel>No Data Found</Text>
                    </Box>
                }
                {onClick ? (
                    <ListSubheader className={displayedOptions.length == 0 ? classes.bottomListSubHeader : classes.bottomListSubHeader1} >
                        <Text type="button" onClick={onClick} className={classes.addText}>
                            + Add {buttonName}
                        </Text>
                    </ListSubheader>
                ) : null}
            </Select>
            <FormHelperText>{helperText ? helperText : ''}</FormHelperText>
        </FormControl>
    );
}

SearchSelect.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.any,
    buttonName: PropTypes.string,
    width: PropTypes.any,
    clearShow: PropTypes.bool,
    handleClearClick: PropTypes.func,
    load: PropTypes.bool,
    labelText: PropTypes.any,
    disabled: PropTypes.any,
    helperText: PropTypes.any,
    referenceID: PropTypes.any,
    multiple: PropTypes.any
};
