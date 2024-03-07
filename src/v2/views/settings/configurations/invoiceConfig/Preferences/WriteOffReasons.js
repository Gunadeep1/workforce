import React, { useState } from 'react'
import { Box, Grid, } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import ToggleSwitch from '../../../../../components/toggle/CustomToggle'
import CustomMenu from '../../configComponents/customMenu/Menu'
// import { ReactComponent as MenuIcon } from '../../../../../assets/svg/MenuIcon.svg'
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Input from '../../../../../components/input/Input';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper ": {
    // height: '586px',
    width: '692px',
    padding: '0px !important',
    borderRadius: "12px",
  },
  "& .MuiDialogContent-root": {
    padding: '0px !important',
  },
  "& .MuiDialogActions-root": {
    padding: '0px !important'
  },
  "& .MuiDialog-container": {
    background: 'rgba(0, 0, 0, 0.55) !important'
  }
}));
function WriteOffReasons({ current }) {
  const classes = MainStyles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [open, setOpen] = React.useState(false);

  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    if (isEditable) {
      setIsEditable(isEditable)
    }
    setIsEditable(false);
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      setOpen(false);
    }
  };

  const data = [
    {
      id: 1,
      title: 'Bad Debts',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
    {
      id: 2,
      title: 'Bad Debts',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
    {
      id: 3,
      title: 'Bad Debts',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
    {
      id: 3,
      title: 'Bad Debts',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
  ];
  const recentData = [
    {
      name: "Nithin Krishna",
      date: "10-12-2023",
      description: "Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, Description has been changed from to osrnfroflnreov",
    },
    {
      name: "Nithin Krishna",
      date: "10-12-2023",
      description: "Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, "
    },
    {
      name: "Nithin Krishna",
      date: "10-12-2023",
      description: "Net-60 - name has been changed from Net-60 to Net-20."
    }
  ]

  return (
    <Box sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '16px',
    }}>
      <Box className={classes.activeItemBox}>
        <Box className={classes.activeBoxHeading}><Text RegularBlack1 >{current}</Text></Box>
        {data.map((item, index) => (
          <Box className={classes.descriptionBoxStyle} key={index} mb={2}>
            <Grid container alignItems="center">
              <Grid item lg={7} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                <Text mediumBoldBlack2 > {item.title}</Text>
                <Text lightGrey3>{item.Description}</Text>
              </Grid>
              <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                <Text mediumBoldBlack2>Modified By</Text>
                <Text lightGrey3>{item.createdBy}</Text>
              </Grid>
              <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'}>
                <ToggleSwitch sx={{ height: '24px !important' }} />
              </Grid>
              <Grid item lg={1} md={1} sm={1} xs={12} container alignItems={'center'} justifyContent={'center'}>
                <CustomMenu
                  anchorEl={anchorEl}
                  isOpen={Boolean(anchorEl)}
                  onClose={handleClose}
                  children={[{ color: 'black', label: "View" },
                  { color: '#0C75EB', label: "Edit" },
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button addTitleBtn sx={{ width: '100%' }} onClick={() => handleClickOpen()}>Add Payment Mode</Button>
        <BootstrapDialog
          keepMounted
          onClose={handleDialogClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogContent >
            <Box padding={'38px 30px 35px 30px '}>
              <Box mb={4}>
                <Text blackHeader1>Add Document Type</Text>
              </Box>
              <Grid container spacing={'32px'}>
                <Grid item lg={6} md={6} sm={12} xs={12}>

                  <CustomSelect
                    commonSelect
                    label={'Payment Mode'}
                    name='PaymentMode'
                    inputProps={{
                      disabled: !isEditable,
                    }}
                  ></CustomSelect>

                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Input
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: 'description',
                      value: '',
                      type: 'text',
                      disabled: !isEditable,
                    }}
                    clientInput
                    labelText={'Description'}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Input
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: 'bankName',
                      value: 'Rohith Raj',
                      type: 'text',
                      disabled: true,
                    }}
                    clientInput
                    labelText={'Created By'}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Input
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: 'modified_by',
                      value: 'Shree Raj',
                      type: 'text',
                      disabled: true,
                    }}
                    clientInput
                    labelText={'Modified By'}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Input
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: 'status',
                      value: 'Active',
                      type: 'text',
                      disabled: true,
                    }}
                    clientInput
                    labelText={'Status'}
                  />
                </Grid>
              </Grid>
              <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                <Button saveExtraSmall onClick={handleEditClick}>{isEditable ? 'Save' : 'Edit'}</Button>
              </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      </Box>
      <Box className={classes.activeItemBox} mt={4}>
        <Box mb={3}>
          <Text RegularBlack1>Recent Activities</Text>
        </Box>
        {recentData.map((value) => (
          <Box className={classes.descriptionBoxStyle} mb={2}>
            <Grid container spacing={6}>
              <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                <Text mediumBoldBlack2>{value.name}</Text>
                <Text lightGrey3>{value.date}</Text>
              </Grid>
              <Grid item lg={8} md={8} sm={6} xs={12}>
                <Text mediumGrey2>{value.description}</Text>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default WriteOffReasons;
