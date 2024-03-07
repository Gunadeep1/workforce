import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu, MenuItem, Divider, Box, styled } from '@mui/material';
import { ReactComponent as CheckedIcon } from '../../../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../../../assets/svg/CheckedBorderIcon.svg';
import Text from '../../../../../../components/customText/Text';

const NestedMenu = ({
  rowId,
  enableDisableRow,
  setEnableDisableRow,
  activateDeactivateRow,
  setActivateDeactivateRow,
  children
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledMenuPopup = styled(Menu)({

    '& .MuiPaper-root': {
      width: '180px',
      background: '#FFFF !important',
      height: 'auto',
    },
    '&.MuiMenu-list': {
      padding: '0px !important',
      borderRadius: '8px !important',
      background: '#0000 !important'
    },

    '& .MuiPopover-paper': {
      boxShadow: ' 0px 2px 6px #919EAB1F !important',
      borderRadius: '4px !important',

    }
  });

  const StyledMenuItem = styled(MenuItem)({
    padding: '12px 10px !important'
  });

  // const line = {
  //   margin: '0px !important',
  //   borderColor: '#F2F4F7 !important',
  //   borderWidth: '1px !important'
  // }

  return (
    <React.Fragment>
      <MoreHorizIcon onClick={handleClick} style={{ cursor: 'pointer' }} />

      <StyledMenuPopup
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        variant={'menu'}
        MenuListProps={{
          "aria-labelledby": "custom-menu",
        }}
        sx={{
          transform: 'translateX(-50px) translateY(12px)',
        }}
      >
        {/* <StyledMenuItem
          onClick={() => {
            handleClose();
            if (enableDisableRow.includes(rowId)) {
              setEnableDisableRow(
                enableDisableRow.filter(item => item !== rowId)
              );
            } else {
              setEnableDisableRow([...enableDisableRow, rowId]);
            }
          }}
        >
          {(enableDisableRow.includes(rowId) && <CheckedIcon />) || (
            <CheckBorderIcon />
          )}
          <Box ml={2}> <Text smallBlack sx={{ color: "#262626 !important" }} > Activate/Deactivate</Text></Box>


        </StyledMenuItem>
        <Divider sx={{
          margin: '0px !important',
          borderColor: '#F2F4F7 !important',
          borderWidth: '1px !important'
        }} />
        <StyledMenuItem
          onClick={() => {
            handleClose();
            if (activateDeactivateRow.includes(rowId)) {
              setActivateDeactivateRow(
                activateDeactivateRow.filter(item => item !== rowId)
              );
            } else {
              setActivateDeactivateRow([...activateDeactivateRow, rowId]);
            }
          }}
        >
          {(activateDeactivateRow.includes(rowId) && <CheckedIcon />) || (
            <CheckBorderIcon />
          )}
          <Box ml={2}>   <Text smallBlack sx={{ color: "#262626 !important" }} >Enable/Disable</Text></Box>


        </StyledMenuItem> */}
        {children.map((child, index) => (
          <Box key={index}>
            <StyledMenuItem
              onClick={() => {
                handleClose();
                // if (activateDeactivateRow.includes(rowId)) {
                //   setActivateDeactivateRow(
                //     activateDeactivateRow.filter(item => item !== rowId)
                //   );
                // } else {
                //   setActivateDeactivateRow([...activateDeactivateRow, rowId]);
                // }
              }}
            >
              {(activateDeactivateRow.includes(rowId) && <CheckedIcon />) || (
                <CheckBorderIcon />
              )}
              <Box ml={2}>   <Text smallBlack sx={{ color: "#262626 !important" }} >{child.label}</Text></Box>
            </StyledMenuItem>
            <Divider sx={{
              margin: '0px !important',
              borderColor: '#F2F4F7 !important',
              borderWidth: '1px !important'
            }} />
          </Box>
        ))}
      </StyledMenuPopup>
    </React.Fragment>
  );
};

export default NestedMenu;
