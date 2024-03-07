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
import CustomRadioGroup from '../../configComponents/radio/CustomRadio';

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
function Documents({ current }) {
  const classes = MainStyles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [open, setOpen] = React.useState(false);



  const [radioValue1, setRadioValue1] = React.useState('yes');
  const [radioValue2, setRadioValue2] = React.useState('yes');
  const [radioValue3, setRadioValue3] = React.useState('yes');
  const [radioValue4, setRadioValue4] = React.useState('yes');
  const [radioValue5, setRadioValue5] = React.useState('yes');
  const [radioValue6, setRadioValue6] = React.useState('yes');
  const [radioValue7, setRadioValue7] = React.useState('yes');
  const [radioValue8, setRadioValue8] = React.useState('yes');
  const [radioValue9, setRadioValue9] = React.useState('yes');
  const [radioValue10, setRadioValue10] = React.useState('yes');
  const [radioValue11, setRadioValue11] = React.useState('yes');

  const options = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const handleRadio1Change = (event) => {
    setRadioValue1(event.target.value);
  };
  const handleRadio2Change = (event) => {
    setRadioValue2(event.target.value);
  };
  const handleRadio3Change = (event) => {
    setRadioValue3(event.target.value);
  };
  const handleRadio4Change = (event) => {
    setRadioValue4(event.target.value);
  };
  const handleRadio5Change = (event) => {
    setRadioValue5(event.target.value);
  };
  const handleRadio6Change = (event) => {
    setRadioValue6(event.target.value);
  };
  const handleRadio7Change = (event) => {
    setRadioValue7(event.target.value);
  };
  const handleRadio8Change = (event) => {
    setRadioValue8(event.target.value);
  };
  const handleRadio9Change = (event) => {
    setRadioValue9(event.target.value);
  };
  const handleRadio10Change = (event) => {
    setRadioValue10(event.target.value);
  };
  const handleRadio11Change = (event) => {
    setRadioValue11(event.target.value);
  };

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

  // const handleEditClick = () => {
  //   setIsEditable(!isEditable);
  //   if (isEditable) {
  //     setOpen(false);
  //   }
  // };

  const data = [
    {
      id: 1,
      title: 'Document Name',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
    {
      id: 2,
      title: 'Document Name',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
    {
      id: 3,
      title: 'Document Name',
      Description: "Description here",
      createdBy: "Rohith Raj",
    },
    {
      id: 4,
      title: 'Document Name',
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
          // TransitionComponent={Transition}
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
                <Text blackHeader1>Add  Personal Documents</Text>
              </Box>
              <Grid container rowSpacing={'32px'} columnSpacing={'48px'}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Input
                    formControlProps={{
                      fullWidth: true
                    }}

                    inputProps={{
                      // name: 'bankName',
                      // value: '',
                      type: 'text',
                      disabled: false,
                    }}
                    // handleChange={handleChange}
                    titleInput
                    placeholder={'Document Name'}
                  />

                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>

                  <CustomSelect
                    commonSelect
                    label={'Payment Mode'}
                    name='PaymentMode'
                  ></CustomSelect>

                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Number Display</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue1} onChange={handleRadio1Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Number Mandatory</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue2} onChange={handleRadio2Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Valid From Display</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue3} onChange={handleRadio3Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Valid From Mandatory</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue4} onChange={handleRadio4Change} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Number Display</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue5} onChange={handleRadio5Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Number Mandatory</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue6} onChange={handleRadio6Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Valid From Display</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue7} onChange={handleRadio7Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Valid From Mandatory</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue8} onChange={handleRadio8Change} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Number Display</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue9} onChange={handleRadio9Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Number Mandatory</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue10} onChange={handleRadio10Change} />
                    </Grid>
                    <Grid itemlg={3} md={3} sm={3} xs={12}>
                      <Text blackMedium>Valid From Display</Text>
                      <CustomRadioGroup mediumGrey2 options={options} value={radioValue11} onChange={handleRadio11Change} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Input
                    formControlProps={{
                      fullWidth: true
                    }}
                    multiline={true}
                    rows={3}

                    inputProps={{
                      // name: 'bankName',
                      // value: '',
                      type: 'text',
                      disabled: false,
                    }}
                    // handleChange={handleChange}
                    descriptionFormControl
                    descriptionInput
                    labelText={'Description'}
                    placeholder={'Type Something'}
                  />
                </Grid>

              </Grid>
              <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'40px'}>
                <Button outlineRedCancel onClick={handleDialogClose} >Cancel</Button>
                <Button saveExtraSmall onClick={handleDialogClose}>Save</Button>
              </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      </Box>
      <Box className={classes.activeItemBox} mt={4}>
        <Box mb={3}>
          <Text RegularBlack1>Recent Activities</Text>
        </Box>
        <Box sx={{
          height: '40vh', overflowY: 'auto', '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
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
    </Box>
  )
}

export default Documents;
