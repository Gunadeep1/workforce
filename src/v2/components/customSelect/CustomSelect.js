import React from "react";
import { FormControl, FormHelperText, IconButton, Select } from "@mui/material";
import classNames from "classnames";
import CustomSelectStyles from "./CustomSelectStyles";
import PropTypes from "prop-types";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import MenuItem from "@mui/material/MenuItem";
import InputLabel from '@mui/material/InputLabel';

const Menu = {
  disableScrollLock: true,
  PaperProps: {
    style: {
      font: "14px Nunito, Nunito Sans, sans-serif",
      maxHeight: '200px',
      opacity: 1,
      overflow: 'auto',
      whiteSpace: "normal",
      paddingBottom: "0px !important",
      marginTop: '10px',
      boxShadow: '0px 0px 15px 0px #0000001F',
    },
    elevation: 0,
    padding: '0px !important'
  },
  sx: {

    "& .MuiList-root": {
      padding: '0px !important',
    },
    "&::-webkit-scrollbar": {
      display: "none !important"
    },
    "& .MuiMenuItem-root": {
      padding: "17px 16px !important",
      font: "14px  Nunito, Nunito Sans, sans-serif !important",
      fontWeight: `${400} !important`,
      color: "#262626 !important",
      height: '50px !important',
      borderBottom: '1px solid #EAECF0 !important',
      "&:hover": {
        background: '#0001F !important'
      },
    },

    "& .Mui-selected": {
      backgroundColor: 'white !important'
    }
  }
}

const MenuScroll = {
  disableScrollLock: true,
  //   keepMounted: true,
  //   disablePortal: true,
  PaperProps: {
    style: {
      font: "14px Poppins !important",
      maxHeight: "170px"
    },
    sx: {
      transitionDelay: '0.1s !important',
      "& .MuiMenuItem-root": {
        padding: "0px !important",
        paddingLeft: "12px !important",
        paddingRight: "10px !important",
        paddingTop: "2px !important",
        font: "14px Poppins !important",
        color: "#323232 !important",
      },
      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: "#F9A828 !important",
        font: "14px Poppins !important",
        color: "#ffffff !important",
      },
      "& .MuiMenuItem-root:hover": {
        backgroundColor: "#F9A828 !important",
        font: "14px Poppins !important",
        color: "#ffffff !important",
      },
    },
  },
};

function CustomSelect(props) {
  const classes = CustomSelectStyles();
  const {
    icon,
    name,
    value,
    onChange,
    children,
    className,
    defaultSelect,
    borderSelect,
    yearSelect,
    borderBlueSelectWidth,
    borderWhiteSelect,
    defaultYearSelect,
    navYearSelect,
    scrollTrue,
    defaultSelectOrg,
    handleClearClick,
    clearShow,
    backgroundBlue,
    whiteSelect,
    cardSelect,
    cardSelectGray,
    options,
    commonSelect,
    commonSelectBorderBlue,
    viewDrop,
    viewDrop1,
    label,
    disabled, helperText, Icon,
    ...rest
  } = props;

  /**
   * @parem label: - target label for input
   * @parem name: - target name for input
   * @parem value:- target value
   * @parem onChange: - onChange functinality
   * @parem chidren : - expected type node better to pass options in the place of children
   * @parem options : - expected array of objects with label and value keys
   * ------------------
   * @parem Remaining all the props for input styles
   * */

  const styleClasses = classNames({
    [className]: className,
    [classes.defaultSelect]: defaultSelect,
    [classes.borderSelect]: borderSelect,
    [classes.yearSelect]: yearSelect,
    [classes.defaultYearSelect]: defaultYearSelect,
    [classes.borderWhiteSelect]: borderWhiteSelect,
    [classes.navYearSelect]: navYearSelect,
    [classes.defaultSelectOrg]: defaultSelectOrg,
    [classes.borderBlueSelectWidth]: borderBlueSelectWidth,
    [classes.backgroundBlue]: backgroundBlue,
    [classes.whiteSelect]: whiteSelect,
    [classes.cardSelect]: cardSelect,
    [classes.cardSelectGray]: cardSelectGray,
    [classes.commonSelect]: commonSelect,
    [classes.commonSelectBorderBlue]: commonSelectBorderBlue,
    [classes.viewDrop]: viewDrop,
    [classes.scrollTrue]: scrollTrue,
    [classes.viewDrop1]: viewDrop1
  });

  // const [searchVal, setSearchVal] = useState("");

  // const handleSearch = (e) => {
  //   setSearchVal(e.target.value)
  // }

  return (
    <div>
      {
        clearShow ?
          <Select
            name={name}
            value={value}
            onChange={onChange}
            fullWidth
            {...rest}
            className={styleClasses}
            MenuProps={scrollTrue ? MenuScroll : Menu}
            endAdornment={
              !icon ?
                <IconButton sx={{ visibility: clearShow ? "visible" : "hidden" }} onClick={handleClearClick}>
                  <ClearIcon sx={{ height: '15px !important', width: '15px !important' }} />
                </IconButton> : ''
            }
            displayEmpty
          // renderValue={value !== "" ? undefined : () => `${placeholder}`}
          >
            {children}
          </Select>
          : <FormControl fullWidth variant="filled">
            <InputLabel id='demo-simple-select-filled-label' className={classes.inputLabel}>{label}</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              name={name}
              value={value}
              onChange={onChange}
              IconComponent={Icon ? Icon : KeyboardArrowDownTwoToneIcon}
              variant="filled"
              disableUnderline
              fullWidth
              disabled={disabled}
              {...rest}
              className={styleClasses}
              // MenuProps={scrollTrue ? MenuScroll : Menu}
              MenuProps={Menu}
            // sx={{
            //   '.css-d9oaum-MuiSelect-select-MuiInputBase-input-MuiFilledInput-input.MuiSelect-select': {
            //     'min-height': '2em',
            //     'minWidth':'7em'
            //   }
            // }}
            //   sx={{
            //     .css-d9oaum-MuiSelect-select-MuiInputBase-input-MuiFilledInput-input.MuiSelect-select {
            //     'min-height': '2em';
            // }}}
            >
              {/* {children} */}

              {/* <Box px={2} py={1} sx={{ height: "50px", position: "sticky", top: 0, backgroundColor: "#ffffff", zIndex: "1" }}>
                <input type="text" name="search" placeholder="Search..." onChange={handleSearch} value={searchVal}
                  style={{ height: "34px", width: "100%", border: "1px solid #C7CCD3", borderRadius: "4px", padding: "4px 8px", font: "14px Nunito, Nunito Sans, sans-serif", }}
                />
              </Box> */}


              {options ? options.map((item) => (
                <MenuItem key={item.id} value={item.id} style={{ padding: "6px 6px 0px 6px" }}>
                  {/* {item.value ? item.value : item.days ? item.days : ""} */}
                  {item.value ? item.value : null}
                  {item.days ? item.days : null}
                  {item.name ? item.name : null}
                  {item.parameter ? item.parameter : null}
                </MenuItem>
              )) : (<MenuItem >Provide options</MenuItem>)}

              {/* {options ? options.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              )) : (<MenuItem >Provide options</MenuItem>)} */}

            </Select>
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>}

    </div>
  );
}

export default CustomSelect;

CustomSelect.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultSelect: PropTypes.bool,
  borderSelect: PropTypes.bool,
  yearSelect: PropTypes.bool,
  defaultYearSelect: PropTypes.bool,
  borderWhiteSelect: PropTypes.bool,
  navYearSelect: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.any,
  scrollTrue: PropTypes.any,
  defaultSelectOrg: PropTypes.any,
  handleClearClick: PropTypes.func,
  clearShow: PropTypes.bool,
  icon: PropTypes.bool,
  borderBlueSelectWidth: PropTypes.bool,
  backgroundBlue: PropTypes.bool,
  whiteSelect: PropTypes.bool,
  cardSelect: PropTypes.bool,
  cardSelectGray: PropTypes.bool,
  commonSelect: PropTypes.bool,
  commonSelectBorderBlue: PropTypes.bool,
  viewDrop: PropTypes.bool,
  label: PropTypes.string,
  viewDrop1: PropTypes.bool,
  helperText: PropTypes.any,
  Icon: PropTypes.bool,
};
