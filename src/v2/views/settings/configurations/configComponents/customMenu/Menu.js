// import React from "react";
// import { Menu, MenuItem, Divider } from "@mui/material";
// import Text from "../../../../../components/customText/Text";
// import MenuStyles from "./MenuStyle";

// const CustomMenu = ({
//   anchorEl,
//   isOpen,
//   onClose,
//   children,
//   variant = "menu",
// }) => {
//     const classes = MenuStyles();
//   return (
//     <Menu
//       id="custom-menu"
//       anchorEl={anchorEl}
//       open={isOpen}
//       onClose={onClose}
//       MenuListProps={{
//         "aria-labelledby": "custom-menu",
//       }}

//       className={classes.menuPopup}
//       variant={variant}
//     >
//       {children.map((child, index) => (<>
//         <MenuItem key={index} onClick={child.Click} className={classes.menuItemStyle}  sx={{color:`${child.color}`}}>
//           <Text sx={{
//             fontSize:'12px'
//           }}> {child.label}</Text>

//         </MenuItem>
//         <Divider className={classes.line} />
//         </>))}
//     </Menu>
//   );
// };

// export default CustomMenu;


import React from 'react';
import { Menu, MenuItem, Divider, Typography, Box } from '@mui/material';
import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import MenuStyles from './MenuStyle';

const CustomMenu = ({ children, variant = 'menu', Icon }) => {
  const classes = MenuStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box onClick={handleClick} style={{ cursor: 'pointer' }} pt={'5px'}>{Icon ? Icon : <MenuIcon />}</Box>

      <Menu
        id="custom-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'custom-menu',
        }}
        variant={variant}
        className={classes.menuPopup}
      >
        {children.map((child, index) => (
          <Box key={index}>
            <MenuItem
              onClick={() => {
                child.Click && child.Click();
                onClose();
              }}
              sx={{ color: `${child.color}`, cursor:'pointer !important'}}
            >
              <Typography
                sx={{
                  font: '12px Nunito !important',
                  padding: '5px !important'
                }}
              >
                {child.label}
              </Typography>
            </MenuItem>
            <Divider className={classes.line} />
          </Box>
        ))}
      </Menu>
    </>
  );
};

export default CustomMenu;