import {
  Box,
  Button,
  Divider,
  Grid,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import React from "react";
import Text from "../customText/CustomText";

const useStyles = makeStyles((theme) => ({
  DropDownButton: {
    margin: "50px 50px",
    fontSize: "1.125rem",
    width: "320px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #000000 !important",
    borderRadius: "10px",
    background: "#F7F7F7 !important",
    cursor: "pointer",
    padding: "0px 20px",
    textTransform: "none !important",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  search: {
    position: "relative",
    // borderRadius: theme.shape.borderRadius,
    marginRight: "20px",
    marginLeft: 0,
    width: "100%",
    border: "1px solid grey",
  },
  searchIcon: {
    // padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
  },
  inputInput: {
    // padding: theme.spacing(1, 1, 1, 0),
    // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    // transition: theme.transitions.create("width"),
    width: "100%",
  },
  searchBarContainer: {
    minWidth: "inherit",
    display: "flex",
    justifyContent: "space-evenly",
    cursor: "default",
    "&.MuiListItem-button": {
      "&:hover": {
        backgroundColor: "white",
      },
    },
  },
  menuDivider: {
    margin: "0 20px",
  },
  dashboardSelectMenu: {
    width:"50%",
    "& .MuiPopover-paper": {
      minWidth: "380px",
      maxWidth: "fit-content",
    },
  },
  externalLinkIcon: {
    borderLeft: "1px solid var(--color-gray-eighty-five)",
    padding: "10px 0px 10px 10px",
    color: "var(--color-primary)",
    cursor: "pointer",
  },
  checkedItem: {
    color: "indigo",
  },
  add: {
    height: "50px",
    position: "absolute",
    justifyContent: "center !important",
  },
}));

const options = [
  {
    id: "a02d9e62-7042-447d-9c2f-f8220bbf3d7d",
    display_name: "Ram K",
  },
  {
    id: "caa5ca08-3151-469e-9558-afffd9e97fbb",
    display_name: "Sandeep Kumar A",
  },
  {
    id: "c64642ac-80e1-4aa9-802b-d0e361a7734b",
    display_name: "Michel Kumar",
  },
  {
    id: "01dce9b0-023e-4b6c-93e8-1661d422540e",
    display_name: "pavan b",
  },
  {
    id: "08a36ddd-8206-4b1f-9ff6-20e7c1065396",
    display_name: "Mike Will",
  },
  {
    id: "d02957cc-7eb8-4f83-8dcb-0f5d71dc8779",
    display_name: "Jashwanth Reddy",
  },
  {
    id: "e8dde439-0e8b-4186-8a39-7a47691b17b7",
    display_name: "Jhon Kal",
  },
  {
    id: "8d8544aa-2f19-4459-b7a6-9f084d71389f",
    display_name: "Mariyana Markkas",
  },
  {
    id: "9e5628d7-94e0-4c7f-b012-6d217e7ceb6e",
    display_name: "Satheesh Kumar Merugu",
  },
  {
    id: "2fc74fc8-4585-45d0-83df-1b303dea30b9",
    display_name: "Jhon Will",
  },
  {
    id: "1c4e4b28-fbfd-4de9-ac43-8f81cebe3307",
    display_name: "prasad K",
  },
  {
    id: "ce5ec902-1773-4463-9eff-331e51deba40",
    display_name: "Danny danny",
  },
  {
    id: "076c9952-bc8f-494d-95bd-2d71dd900abf",
    display_name: "Varun Kumar",
  },
  {
    id: "4108a0ea-3753-46a3-b1aa-65a81c30956b",
    display_name: "Rajeev Kumar",
  },
  {
    id: "ca8b4bff-4a34-4d71-aab6-bafabffa24d1",
    display_name: "Rohit kumar",
  },
  {
    id: "4b3d3f4c-6ddc-46b6-9f9d-22d64b336dd8",
    display_name: "Mickel mike",
  },
  {
    id: "282d8d7b-6708-414c-bbb8-6aa8fdf12616",
    display_name: "Angelina Watson",
  },
  {
    id: "088b49cc-0b02-4ff0-931e-506e040ff4bc",
    display_name: "Karthik N",
  },
  {
    id: "3065c570-97dd-4fe8-81bc-0c58e98a7e64",
    display_name: "Siva Tungala",
  },
];

function SelectDropDown() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selection, setSelection] = useState("");

  useEffect(() => {
    setSelection(options[0].label);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e,id) => {
    console.log("e",id);
    console.log("text",e.target.innerText);
    if (e.target.innerText != selection && e.target.innerText != "") {
      setSelection(e.target.innerText);
    }
    setSearchText("");
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Grid container p={2}>
      <Button
        type="button"
        className={classes.DropDownButton}
        onClick={handleMenuOpen}
      >
        {selection}
        {/* <KeyboardArrowDownIcon /> */}
      </Button>
      {renderDashboardMenu()}
    </Grid>
  );

  function renderDashboardMenu() {
    const displayOptions = options
      .map((item) => {
        if (
          item.display_name.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return item;
        }
        return undefined;
      })
      .filter((item) => item != undefined);

    function renderOption(value) {
      if (selection == value) {
        return (
          <div className={classes.checkedItem}>
            {/* <CheckIcon /> */}
            {value}
          </div>
        );
      }
      return value;
    }

    return (
      <Menu
        anchorEl={anchorEl}
        keepMounted={true}
        open={!!anchorEl}
        onClose={handleClose}
        className={classes.dashboardSelectMenu}
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            background: "#ffffff",
            position: "fixed",
            zIndex: 1000,
            width: "25%",
          }}
        >
          <MenuItem
            className={classes.searchBarContainer}
            disableTouchRipple={true}
          >
            <InputBase
              type="search"
              placeholder="SEARCH..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearchChange}
              value={searchText}
              sx={{
                background: "#f7f7f7",
                width: "100%",
                border: "1px solid #000000",
                borderRadius: "5px",
              }}
            />
          </MenuItem>
        </Box>
        <Box
          sx={{
            height: "200px",
            overflow: "hidden",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none !important",
            },
          }}
        >
          {displayOptions.map((item, index) => {
            return (
              <div key={index}>
                <MenuItem value={item.id} onClick={(e) => handleClose(e,item.id)}>
                  {renderOption(item.display_name)}
                </MenuItem>
              </div>
            );
          })}
        </Box>
        <Box
          sx={{
            position: "fixed",
            background: "#ffffff",
            width: "24%",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <Divider />
          <MenuItem className={classes.add} disableTouchRipple={true}>
            <Text sx={{ color: "blue" }}>+ Add</Text>
          </MenuItem>
        </Box>
      </Menu>
    );
  }
}

export default SelectDropDown;
