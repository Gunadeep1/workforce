import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack, styled, Icon, Dialog, Button, DialogContent, Skeleton } from '@mui/material'
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
import CommonApi from '../../../../../apis/CommonApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import AnnouncementsApi from '../../../../../apis/configurations/organization/AnnouncementsApi';
import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import moment from 'moment';

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

    const [value, setValue] = React.useState('1');
    const [anchorEl, setAnchorEl] = useState(null);
    const [webAnnouncementErrorMessage, setWebAnnouncementErrorMessage] = useState('');
    const [mobileAnnouncementErrorMessage, setMobileAnnouncementErrorMessage] = useState('');
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(false)
    const [webData, setWebData] = useState([]);
    const [mobileData, setMobileData] = useState([]);
    const [activeWebIndex, setActiveWebIndex] = useState(0);
    const [activeMobileIndex, setActiveMobileIndex] = useState(0);
    const [opened, setOpened] = useState(false);
    const [alert, setAlert] = useState(false);
    const [document, setDocument] = useState('');

    const getTextBasedOnValue = () => {
        if (value === '1') {
            return 'JPG or PNG 900x140 Pixels with max 10mb';
        } else {
            return 'JPG or PNG 330x140 Pixels with max 10mb';
        }
    };

    useEffect(() => {
        AnnouncementWebListing();
        AnnouncementMobileListing()
    }, [])

    const AnnouncementWebListing = () => {
        setLoading(true)
        const slug = 'web'
        AnnouncementsApi.getAnnouncementListing(slug).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setLoading(false)
                    setWebData(response.data.data)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400);
        })
    }

    const AnnouncementMobileListing = () => {
        setLoading(true)
        const slug = 'mobile'
        AnnouncementsApi.getAnnouncementListing(slug).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setLoading(false)
                    setMobileData(response.data.data)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400);
        })
    }

    const handleDrop = async (acceptedFiles, announcementType) => {
        // documents = [];
        console.log("acceptedFiles", acceptedFiles);

        acceptedFiles.forEach(async (file, index) => {
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

                    // If all checks pass, you can proceed with further actions
                    console.log('File passed all checks:', file);
                    uploadAnnouncementFile(file)
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

    }

    console.log(webData, "web")
    console.log(mobileData, "mobile")

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setWebAnnouncementErrorMessage('');
        setMobileAnnouncementErrorMessage('');

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickMenu = (event, index) => {
        console.log("index", index);
        if (value == 1) {
            setActiveWebIndex(index)
        }
        else {
            setActiveMobileIndex(index)
        }
        setAnchorEl(event.currentTarget);
    };
    console.log("webindex", activeWebIndex);
    console.log("mobileindex", activeMobileIndex);

    const handleDialogClose = () => {
        setOpened(false);
        setIsDialogOpen(false);
        setAnchorEl(false)
    };

    const handleViewClick = () => {
        // Open the dialog
        setIsDialogOpen(true);
        if (value == 1) {
            setDocument(webData[activeWebIndex].document_url)
        }
        else {
            setDocument(mobileData[activeMobileIndex].document_url)
        }
        setAnchorEl(false)
    };

    const handlePublishClick = () => {

        const data = {
            request_id: LocalStorage.uid(),
            publish_date: moment().format(LocalStorage.getDateFormat())
        }
        if (value == 1) {
            console.log("web-id", webData[activeWebIndex].id)
            const slug = 'web'
            AnnouncementsApi.publishAnnouncement(slug, webData[activeWebIndex].id, data).then((response) => {
                setTimeout(() => {
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg("Published successfully")
                        AnnouncementWebListing()
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400);
            })
        }
        else {
            console.log("mobile-id", mobileData[activeMobileIndex].id)
            const slug = 'mobile'
            AnnouncementsApi.publishAnnouncement(slug, mobileData[activeMobileIndex].id, data).then((response) => {
                setTimeout(() => {
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg("Published successfully")
                        AnnouncementMobileListing()
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400);
            })
        }
        setAnchorEl(false)
    };

    const handleDeleteClick = () => {
        setOpened(true);
        setAlert(true);
        setAnchorEl(false)
    }

    const handleDelete = () => {

        console.log("id", webData[activeWebIndex].id)
        const data = {
            request_id: LocalStorage.uid()
        }
        if (value == 1) {
            const slug = 'web'
            AnnouncementsApi.deleteAnnouncementDocument(slug, webData[activeWebIndex].id, data).then((response) => {
                setTimeout(() => {
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg("Deleted successfully")
                        AnnouncementWebListing()
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400);
            })
        }
        else {
            const slug = 'mobile'
            AnnouncementsApi.deleteAnnouncementDocument(slug, mobileData[activeMobileIndex].id, data).then((response) => {
                setTimeout(() => {
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg("Deleted successfully")
                        AnnouncementMobileListing()
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400);
            })
        }
        setOpened(false);
        setAnchorEl(false)
    };



    const uploadAnnouncementFile = (file) => {
        console.log(file, 'valid_files')
        const slug = value == 1 ? 'web' : 'mobile'
        const fileData = new FormData();
        fileData.append("files", file);
        fileData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("announcement-documents", fileData, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.statusCode == 1003) {
                const obj = {
                    request_id: LocalStorage.uid(),
                    documents: [
                        {
                            new_document_id: response.data.data.id
                        }
                    ]
                }
                AnnouncementsApi.storeAnnouncementDocument(obj, slug).then((response) => {
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg("Files added successfully")
                        if (value == 1) {
                            AnnouncementWebListing()
                        }
                        else {
                            AnnouncementMobileListing()
                        }
                    }
                    else {
                        addErrorMsg(response.data.message);
                    }
                })
            }
            else {
                addErrorMsg(response.data.message);
            }
        })
    }


    // const storeAnnouncementFile = (documents) => {
    //     const obj = {
    //         request_id: LocalStorage.uid(),
    //         documents: documents
    //     }
    //     const slug = value == 1 ? 'web' : 'mobile'
    //     AnnouncementsApi.storeAnnouncementDocument(obj, slug).then((response) => {
    //         if (response.data.statusCode == 1003) {
    //             addSuccessMsg("Files added successfully")
    //         }
    //         else {
    //             addErrorMsg(response.data.message);
    //         }
    //     })
    // }

    // const uploadAnnouncementFile = (file) => {
    //     console.log(file, 'valid_files')
    //     const fileData = new FormData();
    //     for (var i in file) {
    //         fileData.append("files", file[i]);
    //     }
    //     // fileData.append("files", file);
    //     fileData.append("tenant_id", LocalStorage.getUserData().tenant_id);
    //     CommonApi.documentUpload("announcement-documents", fileData, LocalStorage.getAccessToken()).then((response) => {
    //         if (response.data.statusCode == 1003) {
    //             // const document = {new_document_id : response.data.data.id};
    //             // documents.push(document);
    //             var samArr = [];
    //             if (typeof response.data.data !== "object") {
    //                 for (var i in response.data.data) {
    //                     samArr.push({
    //                         new_document_id: response.data.data[i].id
    //                     })
    //                 }
    //                 console.log("samArr", samArr)
    //             } else {
    //                 samArr.push({
    //                     new_document_id: response.data.data.id
    //                 })
    //                 console.log("else ", samArr)
    //             }

    //         }
    //         else {
    //             addErrorMsg(response.data.message);
    //         }
    //     })
    // }

    // const fetchImageSize = async (param) => {
    //     // let size = await file_size_url(param).catch((error) => console.log(error));

    //     // console.log(size);
    //     return '1.0';
    //   };


    // function imageSize(url) {
    //     let img = {}
    //     img.imgOrigH=url.nativeEvent.srcElement.naturalHeight
    //     img.imgOrigW=url.nativeEvent.srcElement.naturalWidth
    //     img.imgOrigRatio= img.imgOrigH/img.imgOrigW
    //     return img
    // }


    // const getImageSize = (url) =>{
    //     const img = imageSize(url)
    //     console.log(img,'img')
    // }



    return (

        <Box sx={{
            height: '75vh',
            // overflow: 'auto',
            padding: '16px',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        }}>

            <Box className={classes.mainBox11} >
                <Box sx={{ height: '35vh' }}>
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

                <Box sx={{
                    height: '40vh', overflowY: 'auto', '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    {
                        loading ?
                            [1, 2, 3,].map((item) => (
                                
                                    <Grid container width="100%" alignItems="center" gap={3} className={classes.descriptionBoxStyle}>
                                        <Grid item lg={4} md={4} sm={4} xs={12} container direction={'column'} gap={'3px'} >
                                            <Skeleton variant="text" sx={{ width: "12rem" }} />
                                            <Skeleton variant="text" sx={{ width: "6rem" }} />
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={4} xs={12} container direction={'column'} gap={'3px'} >
                                            <Skeleton variant="text" sx={{ width: "12rem" }} />
                                            <Skeleton variant="text" sx={{ width: "6rem" }} />
                                        </Grid>
                                        <Grid item container lg={2} md={2} sm={2} xs={12} justifyContent={'end'}>
                                            <Skeleton variant="text" sx={{ width: "2rem" }} />
                                        </Grid>
                                    </Grid>
                               
                            ))
                            :
                            value == 1 ?
                                webData.length > 0 && webData.map((item, index) => (
                                    <Grid container key={index} lg={12} style={{ backgroundColor: '#FBFBFB', alignItems: 'center', paddingLeft: '15px', paddingRight: '15px', marginBottom: '30px' }}>
                                        <Grid item lg={6}>
                                            {/* Customize the content of each grid item based on your requirements */}
                                            <Stack direction='column'>
                                                <Text mediumBlackColor>{item.document_name}</Text>
                                                {/* <Text greyLabel style={{ marginTop: '4px' }}>{fetchImageSize(item.document_url) mb} </Text> */}
                                                <Text greyLabel style={{ marginTop: '4px' }}>{ } mb</Text>
                                                {/* getImageSize(item.document_url) */}
                                            </Stack>
                                        </Grid>
                                        <Grid item lg={4}>
                                            <Stack direction='column'>
                                                <Text mediumBlackColor>Publish Date</Text>
                                                <Text greyLabel style={{ marginTop: '4px' }}>{item.publish_date ? item.publish_date : '--'}</Text>
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
                                                        height: webData[activeWebIndex].is_published ? '88px !important' : '125px !important',
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
                                                <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#171717 !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center', marginTop: '-8px !important', }} onClick={handleViewClick}>View</MenuItem>
                                                {webData[activeWebIndex].is_published ? '' : <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: 'green !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center', }} onClick={handlePublishClick}>Publish</MenuItem>}
                                                <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#E51A1A !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center' }} onClick={handleDeleteClick}>Delete</MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                ))
                                :
                                mobileData.length > 0 && mobileData.map((item, index) => (
                                    <Grid container key={index} lg={12} style={{ backgroundColor: '#FBFBFB', alignItems: 'center', paddingLeft: '15px', paddingRight: '15px', marginBottom: '30px' }}>
                                        <Grid item lg={6}>
                                            {/* Customize the content of each grid item based on your requirements */}
                                            <Stack direction='column'>
                                                <Text mediumBlackColor>{item.document_name}</Text>
                                                {/* <Text greyLabel style={{ marginTop: '4px' }}>{fetchImageSize(item.document_url) mb} </Text> */}
                                                <Text greyLabel style={{ marginTop: '4px' }}>{ } mb</Text>
                                                {/* getImageSize(item.document_url) */}
                                            </Stack>
                                        </Grid>
                                        <Grid item lg={4}>
                                            <Stack direction='column'>
                                                <Text mediumBlackColor>Publish Date</Text>
                                                <Text greyLabel style={{ marginTop: '4px' }}>{item.publish_date ? item.publish_date : '--'}</Text>
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
                                                        height: mobileData[activeMobileIndex].is_published ? '88px !important' : '125px !important',
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
                                                <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#171717 !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center', marginTop: '-8px !important', }} onClick={handleViewClick}>View</MenuItem>
                                                {mobileData[activeMobileIndex].is_published ? '' : <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: 'green !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center', }} onClick={handlePublishClick}>Publish</MenuItem>}
                                                <MenuItem sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#E51A1A !important', borderBottom: '1px solid #E2E5E6 !important', height: '40px !important', textAlign: 'center' }} onClick={handleDeleteClick}>Delete</MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                ))

                    }

                </Box>
            </Box>
            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                TransitionComponent={Transition}
            >
                <DialogContent>
                    <Box>
                        <img src={document} alt="Preview" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                    </Box>
                </DialogContent>
            </Dialog>

            {alert ? <AlterBox handleDialogClose={handleDialogClose} open={opened} handleDelete={handleDelete} /> : ""}


        </Box>
    )
}

export default Announcements;