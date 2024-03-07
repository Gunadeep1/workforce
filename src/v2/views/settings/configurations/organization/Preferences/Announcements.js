import React, { useState } from 'react';
import { Box, Grid, Stack, styled, Icon, Dialog, Button, DialogContent } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Slide from '@mui/material/Slide';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '../../../../../assets/svg/MenuIcon.svg';
import Dropzone from "react-dropzone";
import AlterBox from '../../configComponents/alertBox/AlertBox';


// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//     "& .MuiDialog-paper": {
//         minHeight: '141px',
//         minWidth: '894px',
//         padding: '0px !important',
//         borderRadius: "8px",
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 'auto',
//     },
//     "& .MuiDialogContent-root": {
//         padding: '0px !important',
//     },
//     "& .MuiDialogActions-root": {
//         padding: '0px !important'
//     },
//     "& .MuiDialog-container": {
//         background: 'rgba(0, 0, 0, 0.55) !important'
//     }
// }));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        color: '#0C75EB',
    },
    '&.Mui-selected.Mui-focusVisible': {
        backgroundColor: 'transparent',
    },
    '&:hover': {
        backgroundColor: '#FFFFFF',
    },
    color: '#849199',
    textTransform: 'capitalize',
    width: '50%',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '16px',
    fontWeight: 500,
}));


function Announcements({ current }) {
    const classes = MainStyles()
    // const mainClass = useStyles();
    const [value, setValue] = React.useState('1');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setWebAnnouncementErrorMessage('');
        setMobileAnnouncementErrorMessage('');

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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


    const [webAnnouncementErrorMessage, setWebAnnouncementErrorMessage] = useState('');
    const [mobileAnnouncementErrorMessage, setMobileAnnouncementErrorMessage] = useState('');


    const getTextBasedOnValue = () => {
        if (value === '1') {
            return 'JPG or PNG 900x140 Pixels with max 10mb';
        } else {
            return 'JPG or PNG 330x140 Pixels with max 10mb';
        }
    };

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [viewImageIndex, setViewImageIndex] = useState(null);

    const handleViewClick = (index) => {
        setViewImageIndex(index);
        setIsDialogOpen(true);
        // handleClose();
    };


    const handleDialogClose = () => {
        setOpened(false);
        setIsDialogOpen(false);
        setViewImageIndex(null);
    };


    const open = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const [publishDate, setPublishDate] = useState(null);
    const [webAnnouncementPreviewImages, setWebAnnouncementPreviewImages] = useState([]);
    const [mobileAnnouncementPreviewImages, setMobileAnnouncementPreviewImages] = useState([]);


    const handleDrop = async (acceptedFiles, announcementType) => {
        acceptedFiles.forEach(async (file) => {
            const fileName = file.name;
            const idxDot = fileName.lastIndexOf(".") + 1;
            const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

            const validateFile = async (file, requiredWidth, requiredHeight) => {
                try {
                    const image = await createImageBitmap(file);
                    const width = image.width;
                    const height = image.height;

                    // Check dimensions
                    if (width > requiredWidth || height > requiredHeight) {
                        console.error(`Invalid dimensions for ${announcementType}. Width must be less than or equal to ${requiredWidth} and height must be less than or equal to ${requiredHeight}.`);
                        setWebAnnouncementErrorMessage(`The uploaded image does not fulfill the requirements.`);
                        setMobileAnnouncementErrorMessage(`The uploaded image does not fulfill the requirements.`);
                        return;
                    }

                    // Get file size in megabytes
                    const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
                    const formattedSize = fileSizeInMB.toFixed(2);

                    // Set preview image and size
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (announcementType === 'webAnnouncement') {
                            setWebAnnouncementPreviewImages((prevImages) => [...prevImages, { dataUrl: reader.result, size: formattedSize }]);
                        } else if (announcementType === 'mobileAnnouncement') {
                            setMobileAnnouncementPreviewImages((prevImages) => [...prevImages, { dataUrl: reader.result, size: formattedSize }]);
                        }
                    };
                    reader.readAsDataURL(file);

                    // If all checks pass, you can proceed with further actions
                    console.log('File passed all checks:', file);
                } catch (error) {
                    console.error('Error getting image dimensions:', error);
                    setWebAnnouncementErrorMessage(`The uploaded image does not fulfill the requirements.`);
                    setMobileAnnouncementErrorMessage(`The uploaded image does not fulfill the requirements.`);
                }
            };

            if (extFile !== 'jpg' && extFile !== 'jpeg' && extFile !== 'png') {
                setWebAnnouncementErrorMessage("The uploaded image does not fulfill the requirements.");
                setMobileAnnouncementErrorMessage(`The uploaded image does not fulfill the requirements.`);
                return;
            }

            // Reset existing error messages
            setWebAnnouncementErrorMessage('');
            setMobileAnnouncementErrorMessage('');

            // Set dimensions based on announcement type
            let requiredWidth, requiredHeight;
            if (announcementType === 'webAnnouncement') {
                requiredWidth = 900;
                requiredHeight = 140;
            } else if (announcementType === 'mobileAnnouncement') {
                requiredWidth = 330;
                requiredHeight = 140;
            }

            // Validate each dropped file
            await validateFile(file, requiredWidth, requiredHeight);
        });


        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        setPublishDate(formattedDate);
    };



    const [opened, setOpened] = useState(false);
    const [alert, setAlert] = useState(false);
    const [deleteIndexWeb, setDeleteIndexWeb] = useState(null);
    const [deleteIndexMobile, setDeleteIndexMobile] = useState(null);

    const handleDeleteClick = (args) => {
        setOpened(true);
        setAlert(true);

        if (value === "1") {
            setDeleteIndexWeb(args);
        } else if (value === "2") {
            setDeleteIndexMobile(args);
        }
    }

    const handleDelete = () => {
        let updatedWebAnnouncementPreviewImages = [...webAnnouncementPreviewImages];
        let updatedMobileAnnouncementPreviewImages = [...mobileAnnouncementPreviewImages];

        if (value === "1" && deleteIndexWeb !== null) {
            updatedWebAnnouncementPreviewImages.splice(deleteIndexWeb, 1);
            setWebAnnouncementPreviewImages(updatedWebAnnouncementPreviewImages);
        } else if (value === "2" && deleteIndexMobile !== null) {
            updatedMobileAnnouncementPreviewImages.splice(deleteIndexMobile, 1);
            setMobileAnnouncementPreviewImages(updatedMobileAnnouncementPreviewImages);
        }

        setOpened(false);
        setDeleteIndexWeb(null);
        setDeleteIndexMobile(null);
    };




    return (

        <Box sx={{
            height: '75vh',

            padding: '16px',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        }}>

            <Box className={classes.mainBox11} >
                <Box className={classes.activeBoxHeading}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <StyledTab label="Web Announcements" value="1" />
                                <StyledTab label="Mobile Announcements" value="2" />
                            </TabList>
                        </Box>
                    </TabContext>
                </Box>

                <Box style={{ backgroundColor: '#F2F7FF', height: '126px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #0C75EB', marginBottom: '30px', borderRadius: '8px' }}>


                    <Dropzone onDrop={acceptedFiles => { handleDrop(acceptedFiles, value === "1" ? "webAnnouncement" : "mobileAnnouncement") }}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Stack direction='column'>
                                        <Text sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#000000', cursor: 'pointer' }}>Drag & Drop Announcement Banners here or <span style={{ color: '#0C75EB' }}>Browse</span> to Upload </Text>
                                        <Text lightGrey3 sx={{ fontSize: '10px !important', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>{getTextBasedOnValue()}</Text>
                                    </Stack>

                                </div>
                            </section>
                        )}
                    </Dropzone>
                </Box>

                {value === '1' && webAnnouncementErrorMessage && (
                    <Box style={{ backgroundColor: '#FFEEEE', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', color: '#E51A1A', marginBottom: '25px' }}>
                        <Icon as={InfoOutlinedIcon} style={{ marginLeft: '13px', marginRight: '16px', width: '16px', height: '16px' }} />
                        <Text infoText>{webAnnouncementErrorMessage}</Text>
                    </Box>
                )}

                {value === '2' && mobileAnnouncementErrorMessage && (
                    <Box style={{ backgroundColor: '#FFEEEE', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', color: '#E51A1A', marginBottom: '25px' }}>
                        <Icon as={InfoOutlinedIcon} style={{ marginLeft: '13px', marginRight: '16px', width: '16px', height: '16px' }} />
                        <Text infoText>{mobileAnnouncementErrorMessage}</Text>
                    </Box>
                )}


                <div>
                    {value === "1" && webAnnouncementPreviewImages.length > 0 && webAnnouncementPreviewImages.map((previewImage, index) => (
                        <Grid container key={index} lg={12} style={{ backgroundColor: '#FBFBFB', height: '63px', alignItems: 'center', paddingLeft: '15px', paddingRight: '15px', marginBottom: '30px' }}>
                            <Grid item lg={6}>
                                {/* Customize the content of each grid item based on your requirements */}
                                <Stack direction='column'>
                                    <Text mediumBlackColor>Web Announcements</Text>
                                    <Text greyLabel style={{ marginTop: '4px' }}>{previewImage.size} mb</Text>
                                </Stack>
                            </Grid>
                            <Grid item lg={4}>
                                <Stack direction='column'>
                                    <Text mediumBlackColor>Publish Date</Text>
                                    <Text greyLabel style={{ marginTop: '4px' }}>{publishDate || 'Not Available'}</Text>
                                </Stack>
                            </Grid>
                            <Grid item container lg={2} justifyContent='end'>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={(event) => handleClickMenu(event, index)}
                                >
                                    <img src={MenuIcon} alt="MenuIcon" />
                                </Button>
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            boxShadow: 'none !important',
                                            width: '112px !important',
                                            height: '88px !important',
                                            overflow: 'hidden',
                                            maxHeight: 'none !important'
                                        }
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#171717 !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center', marginTop: '-8px !important', }} onClick={() => handleViewClick(index)}>View</MenuItem>
                                    <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#E51A1A !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center' }} onClick={() => handleDeleteClick(index)}>Delete</MenuItem>
                                </Menu>
                                <Dialog
                                    open={isDialogOpen}
                                    onClose={handleDialogClose}
                                    TransitionComponent={Transition}
                                >
                                    <DialogContent>
                                        {value === "1" && webAnnouncementPreviewImages.length > 0 && (
                                            <img src={webAnnouncementPreviewImages[viewImageIndex]?.dataUrl} alt={`Preview ${viewImageIndex + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                        )}
                                        {value === "2" && mobileAnnouncementPreviewImages.length > 0 && (
                                            <img src={mobileAnnouncementPreviewImages[viewImageIndex]?.dataUrl} alt={`Preview ${viewImageIndex + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </Grid>
                        </Grid>
                    ))}

                    {value === "2" && mobileAnnouncementPreviewImages.length > 0 && mobileAnnouncementPreviewImages.map((previewImage, index) => (
                        <Grid container key={index} lg={12} style={{ backgroundColor: '#FBFBFB', height: '63px', alignItems: 'center', paddingLeft: '15px', paddingRight: '15px', marginBottom: '30px' }}>
                            <Grid item lg={6}>
                                {/* Customize the content of each grid item based on your requirements */}
                                <Stack direction='column'>
                                    <Text mediumBlackColor>Mobile Announcements</Text>
                                    <Text greyLabel style={{ marginTop: '4px' }}>{previewImage.size} mb</Text>
                                </Stack>
                            </Grid>
                            <Grid item lg={4}>
                                <Stack direction='column'>
                                    <Text mediumBlackColor>Publish Date</Text>
                                    <Text greyLabel style={{ marginTop: '4px' }}>{publishDate || 'Not Available'}</Text>
                                </Stack>
                            </Grid>
                            <Grid item container lg={2} justifyContent='end'>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={(event) => handleClickMenu(event, index)}
                                >
                                    <img src={MenuIcon} alt="MenuIcon" />
                                </Button>
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            boxShadow: 'none !important',
                                            width: '112px !important',
                                            height: '88px !important',
                                            overflow: 'hidden',
                                            maxHeight: 'none !important'
                                        }
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#171717 !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center', marginTop: '-8px !important', }} onClick={() => handleViewClick(index)}>View</MenuItem>
                                    <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#E51A1A !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center' }} onClick={() => handleDeleteClick(index)}>Delete</MenuItem>
                                </Menu>
                                <Dialog
                                    open={isDialogOpen}
                                    onClose={handleDialogClose}
                                    TransitionComponent={Transition}
                                >
                                    <DialogContent>
                                        {value === "1" && webAnnouncementPreviewImages.length > 0 && (
                                            <img src={webAnnouncementPreviewImages[viewImageIndex]?.dataUrl} alt={`Preview ${viewImageIndex + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                        )}
                                        {value === "2" && mobileAnnouncementPreviewImages.length > 0 && (
                                            <img src={mobileAnnouncementPreviewImages[viewImageIndex]?.dataUrl} alt={`Preview ${viewImageIndex + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </Grid>
                        </Grid>
                    ))}
                </div>
            </Box>

            {alert ? <AlterBox handleDialogClose={handleDialogClose} open={opened} handleDelete={handleDelete} /> : ""}

            <Box className={classes.activeItemBox} mt={4}>
                <Box mb={3}>
                    <Text RegularBlack1>Recent Activities</Text>
                </Box>
                {recentData.map((value) => (
                    <Box className={classes.descriptionBoxStyle} mb={2}>
                        <Grid container spacing={6}>
                            <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                                <Text mediumBlackColor>{value.name}</Text>
                                <Text greyLabel>{value.date}</Text>
                            </Grid>
                            <Grid item lg={8} md={8} sm={6} xs={12} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                                <Text BrowmnMnStepperText sx={{ color: "#404040 !important" }}>{value.description}</Text>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default Announcements;