import React, { useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import SearchSelectStyles from "./SearchSelectStyles";
import PropTypes from "prop-types";
import ClearIcon from "@mui/icons-material/Clear";
import Text from "../customText/Text";


export default function SearchSelect(props) {
  const classes = SearchSelectStyles();
  const { icon, options, onChange, name, value, onClick, buttonName, width, clearShow, handleClearClick, ...rest } =
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

  const [searchText, setSearchText] = useState("");

  const displayedOptions = options
    .map((item) => {
      /**
       * Condition is for if options have key name as name it will go inside
       * otherwise
       * it will tale display_name as label goes else block
       * */
      if (item.name) {
        if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
        return undefined;
      } else if (item.display_name) {
        if (item.display_name.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
        return undefined;
      }
      else if (item.employee_name) {
        if (item.employee_name.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
        return undefined;
      }
      else {
        if (item.days) {
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
        font: "15px Poppins !important",
        height:
          !onClick && options.length < 3 && displayedOptions.length == 0 ? "46px" :
            !onClick && options.length < 3 && displayedOptions.length == 1 ? "40px" :
              !onClick && options.length < 3 && displayedOptions.length == 2 ? "65px" :
                !onClick && options.length < 3 && displayedOptions.length == 3 ? "85px" :
                  !onClick && options.length > 3 && displayedOptions.length == 4 ? "140px" :
                    !onClick && options.length > 3 && displayedOptions.length == 5 ? "165px" :
                      !onClick && options.length > 3 && displayedOptions.length > 5 ? "185px" :
                        onClick && options.length < 3 && displayedOptions.length == 0 ? "68px" :
                          onClick && options.length < 3 && displayedOptions.length == 1 ? "65px" :
                            onClick && options.length < 3 && displayedOptions.length == 2 ? "85px" :
                              onClick && options.length == 3 && displayedOptions.length == 3 ? "110px" :
                                onClick && options.length > 3 && displayedOptions.length == 4 ? "162px" :
                                  onClick && options.length > 3 && displayedOptions.length == 5 ? "185px" :
                                    onClick && options.length > 3 && displayedOptions.length > 5 && "210px",

        width: width ? width : '100px',
        opacity: 1,
        overflow: 'auto',
        whiteSpace: "normal",
        paddingBottom: "0px",
      },
      sx: {
        "&::-webkit-scrollbar": {
          display: "none !important"
        },
        "& .MuiMenuItem-root": {
          padding: "0px !important",
          paddingLeft: "12px !important",
          paddingRight: "10px !important",
          marginTop: "3px !important",
          // backgroundColor: "white !important",
          font: "13px Poppins !important",
          color: "#323232 !important",
        },
        "& .MuiMenuItem-root.Mui-selected": {
          backgroundColor: "#F9A828 !important",
          font: "13px Poppins !important",
          color: "#ffffff !important",
        },
        "& .MuiMenuItem-root:hover": {
          backgroundColor: "#F9A828 !important",
          font: "13px Poppins !important",
          color: "#ffffff !important",
        },
        transitionDelay: '0.1s !important',
        "& .MuiMenu-list": {
          paddingBottom: "0px !important",
        },
      },
    },
  };

  // Html starts Here
  return (
    <FormControl fullWidth>
      <Select
        MenuProps={Menu}
        value={value}
        name={name}
        onChange={onChange}
        onClose={() => setSearchText("")}
        // This prevents rendering empty string in Select's value
        // if search text would exclude currently selected option.
        // renderValue={() => selectedOption}
        className={classes.select}
        {...rest}

        endAdornment={
          !icon ?
            <IconButton sx={{ visibility: clearShow ? "visible" : "hidden" }} onClick={handleClearClick}>
              <ClearIcon sx={{ height: '15px !important', width: '15px !important' }} />
            </IconButton> : ''
        }
      >
        {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
        {
          options.length > 3 &&
          <ListSubheader className={classes.listSubHeader}>
            <TextField
              size="small"
              focused
              autoFocus
              placeholder="Search..."
              type="search"
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key != "Escape") {
                  e.stopPropagation();
                }
              }}
              InputProps={{ classes: { input: classes.input } }}
              // inputProps={{ autoFocus:true}}
              className={classes.textField}
            />
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
        {displayedOptions.map((val) => (
          <MenuItem key={val.id} value={val.id} noWrap>
            {val.name ? val.name : val.display_name ? val.display_name : val.days ? val.days : val.employee_name}
          </MenuItem>
        ))}
        {displayedOptions.length <= 0 &&
          // <MenuItem noWrap sx={{ justifyContent: "center" }}><b>No Data Found</b></MenuItem>
          <Box sx={{ height: '30px !important', textAlign: 'center' }}>
            <Text smallLabel>No Data Found</Text>
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
  load: PropTypes.bool
};
