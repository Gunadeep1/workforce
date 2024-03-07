import React, { useState } from "react";
import { Accordion, AccordionSummary, Box, Breadcrumbs, Dialog, DialogContent, Divider, Grid, IconButton, Slide, Stack, Typography } from "@mui/material";
import OCRstyles from "../OCRstyles";
import { Link } from "react-router-dom";
import DropZone from '../../../../components/dropzone/DropZone';
import Text from "../../../../components/customText/Text";
import docIcon from '../../../../assets/svg/docIcon.svg';
import crossIcon from '../../../../assets/svg/crossIcon.svg';
import moment from "moment";
import { styled } from "@mui/material/styles";
import LoaderIcon from '../../../../assets/svg/sandtimer.svg';
import { addErrorMsg } from "../../../../utils/utils";
import LocalStorage from "../../../../utils/LocalStorage";
import CommonApi from "../../../../apis/CommonApi";


const BootstrapDialog1 = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "16px",
    },
    "& .MuiDialogContent-root": {
        padding: '0px'
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));
const TransitionUp = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

function BulkUpload() {
    const classes = OCRstyles();
    const [open, setOpen] = useState(false);
    const [viewData, setViewData] = useState({});
    const [fileLoading, setFileLoading] = useState(false);

    /**
    * Function to replace the last occurrence of '/' in the current URL with a specified new segment.
    * If no '/' is found, it logs an error.
    * 
    * @returns {string} The modified URL with the last '/' replaced by the new segment.
    */

    const replaceLastSlash = (param) => {
        const originalUrl = window.location.href;
        // Find the last occurrence of '/'
        const lastSlashIndex = originalUrl.lastIndexOf('/');

        // Check if a '/' is found in the URL
        if (lastSlashIndex !== -1) {
            // Replace the last '/' with another character or string
            const newSegment = '/bulk-upload-timesheets';
            const modified = originalUrl.substring(0, lastSlashIndex) + newSegment;
            return modified;
        } else {
            console.error("No '/' found in the URL");
        }
    };

    /**
     * Uploads multiple documents using the CommonApi's documentUpload function.
     *
     * @param {Object} files - Object containing the files to be uploaded.
     */

    const uploadDocs = (files) => {
        setFileLoading(true);
        LocalStorage.removeTidData();
        LocalStorage.setTidData([]);
        for (const key in files) {
            var formData = new FormData();
            formData.append("files", files[key]);
            formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
            CommonApi.documentUpload("timesheet-document", formData, LocalStorage.getAccessToken()).then((response) => {
                if (response.data.statusCode == 1003) {
                    response.data.data['url'] = response.data.data['document_url'];
                    console.log("response.data.data", response.data.data);
                    setFileLoading(false);
                    var newArr = LocalStorage.getTidData();
                    newArr.push(response.data.data);
                    LocalStorage.setTidData(newArr);
                    if (LocalStorage.getTidData().length === files.length) {
                        setFileLoading(false);
                        window.open(`${replaceLastSlash()}`, '_blank');
                    }
                    // if (files.length == 1) {
                    //     console.log("if inside");
                    //     response.data.data['url'] = response.data.data['document_url'];
                    //     LocalStorage.setTidData([response.data.data]);
                    // } else {
                    //     console.log("else");
                    //     for (var l in response.data.data) {
                    //         response.data.data[l]['url'] = response.data.data[l]['document_url'];
                    //     }
                    //     LocalStorage.setTidData(response.data.data);
                    // }
                    // setFileLoading(false);
                    // window.open(`${replaceLastSlash()}`, '_blank');
                } else {
                    setFileLoading(false);
                    addErrorMsg(response.data.message);
                }
            });
        }



    };

    const ocrDumpData = [
        {
            id: 1,
            date: "10/12/2024",
            time: "01.20 PM",
            status: 0,
            timesheet_data: [
                {
                    id: 1,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                },
                {
                    id: 2,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                },
                {
                    id: 3,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                },
                {
                    id: 4,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                },
                {
                    id: 5,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                },
                {
                    id: 6,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                },
                {
                    id: 7,
                    emp_name: "Mike",
                    template_name: "Workforce",
                    no_of_pairs: '07'
                }
            ]
        },
        {
            id: 2,
            date: "01/01/2024",
            time: "01.20 PM",
            status: 1,
            timesheet_data: [
                {
                    id: 1,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                },
                {
                    id: 2,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                },
                {
                    id: 3,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                },
                {
                    id: 4,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                },
                {
                    id: 5,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                },
                {
                    id: 6,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                },
                {
                    id: 7,
                    emp_name: "Alen",
                    template_name: "Google",
                    no_of_pairs: '07'
                }
            ]
        },
        {
            id: 3,
            date: "09/12/2023",
            time: "01.20 PM",
            status: 1,
            timesheet_data: [
                {
                    id: 1,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                },
                {
                    id: 2,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                },
                {
                    id: 3,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                },
                {
                    id: 4,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                },
                {
                    id: 5,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                },
                {
                    id: 6,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                },
                {
                    id: 7,
                    emp_name: "Kendall Jenner",
                    template_name: "Microsoft",
                    no_of_pairs: '07'
                }
            ]
        },
        {
            id: 4,
            date: "11/12/2023",
            time: "01.20 PM",
            status: 1,
            timesheet_data: [
                {
                    id: 1,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgan",
                    no_of_pairs: '07'
                },
                {
                    id: 2,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgan",
                    no_of_pairs: '07'
                },
                {
                    id: 3,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgan",
                    no_of_pairs: '07'
                },
                {
                    id: 4,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgan",
                    no_of_pairs: '07'
                },
                {
                    id: 5,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgan",
                    no_of_pairs: '07'
                },
                {
                    id: 6,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgan",
                    no_of_pairs: '07'
                },
                {
                    id: 7,
                    emp_name: "Rahul Sharma",
                    template_name: "JpMorgam",
                    no_of_pairs: '07'
                }
            ]
        }
    ]

    return (
        <Box pl={4} ml={5}>
            <Box >
                <Box mx={5} py={1} mt={2}>
                    <Breadcrumbs aria-label="OCR Template Create">
                        <Typography component={Link} to={'/timesheet'} className={classes.breadcrumbsLink}>Timesheets</Typography>
                        <Typography className={classes.breadcrumbsName}>Bulk Upload</Typography>
                    </Breadcrumbs>
                </Box>

                <Box className={classes.mainBox}>
                    <Box className={classes.secondaryBox}>
                        <Text veryLargeBlack sx={{ padding: "20px 0px" }}>Bulk Upload</Text>
                        {
                            fileLoading ?
                                <Box className={classes.dropzoneMainBox}>
                                    <Box className={classes.dropBox}>
                                        <Stack height={'inherit'} justifyContent={'center'} alignItems={'center'}>
                                            <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                        </Stack>
                                    </Box>
                                </Box>
                                : <Box className={classes.dropzoneMainBox}>
                                    <Box className={classes.dropBox}>
                                        <DropZone callApi={uploadDocs} />
                                    </Box>
                                </Box>
                        }
                        <Box className={classes.secPrimaryBox} >
                            <Box className={classes.headBox}>
                                <Text headerBlack>Bulk History</Text>
                            </Box>
                            {
                                ocrDumpData.map((item, key) => (
                                    <Accordion
                                        key={key}
                                        className={classes.customAccordion}
                                    >
                                        <AccordionSummary
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            className={classes.AccordionSummary}
                                        >
                                            <Grid container item lg={12} md={12} sm={12} xs={12} spacing={2} textAlign='center' alignItems='center'>
                                                <Grid item md={10}>
                                                    <Box className={classes.templateNameBox}>
                                                        <img src={docIcon} alt="docIcon" />
                                                        <Grid container item lg={2} md={12} display={"flex"} alignItems={"center"} pl={2}>
                                                            <Grid item lg={12} md={12} textAlign={"start"}>
                                                                <Text mediumBlack14>{moment(item.date).format('DD-MMM-YYYY')}</Text>
                                                            </Grid>
                                                            <Grid item lg={12} md={12} textAlign={"start"}>
                                                                <Text smallLabel>{item.time}</Text>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item lg={10} md={10} textAlign={"start"} display={"flex"} alignItems={"center"}>
                                                            <Box className={item.status == 0 ? classes.actionRequiredBox : classes.completedBox}>
                                                                {item.status == 0 ? <Text smallOrange>Action Required</Text> : <Text smallGrey sx={{ font: '10px Nunito Sans, sans-serif !important', }}>Completed</Text>}
                                                            </Box>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                                <Grid item md={2} textAlign={"end"}>
                                                    <Typography className={classes.linkText} onClick={(e) => { e.stopPropagation(); setViewData(item); setOpen(true) }}>
                                                        View Details
                                                    </Typography>
                                                </Grid>

                                            </Grid>
                                        </AccordionSummary>
                                    </Accordion>
                                ))
                            }
                        </Box>
                    </Box>
                </Box>
            </Box >
            <BootstrapDialog1
                TransitionComponent={TransitionUp}
                keepMounted
                onClose={() => setOpen(false)}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"md"}
            >

                <IconButton
                    aria-label="close"
                    onClick={() => setOpen(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            background: 'none',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                </IconButton>
                <DialogContent sx={{ margin: "50px" }}>
                    {
                        Object.keys(viewData).length !== 0 &&
                        <Grid container spacing={0}>
                            <Grid item md={12} sm={12} pt={0}>
                                <Text mediumBlack14>{moment(viewData.date).format('DD-MMM-YYYY')}</Text>
                                <Text smallLabel>{viewData.time}</Text>
                            </Grid>
                            <Box className={classes.viewDataBox}>
                                {
                                    viewData.timesheet_data.map((item) => (
                                        <>
                                            <Grid container sx={{ padding: "10px 0px" }}>
                                                <Grid item md={5}>
                                                    <Text mediumBlack14>Employee Name</Text>
                                                    <Text largeLabel>{item.emp_name}</Text>
                                                </Grid>
                                                <Grid item md={5}>
                                                    <Text mediumBlack14>Template Name</Text>
                                                    <Text largeLabel>{item.template_name}</Text>
                                                </Grid>
                                                <Grid item md={2}>
                                                    <Text mediumBlack14>No of Pairs</Text>
                                                    <Text largeLabel>{item.no_of_pairs}</Text>
                                                </Grid>
                                            </Grid>
                                            <Divider />
                                        </>
                                    ))
                                }

                            </Box>
                        </Grid>
                    }
                </DialogContent>
            </BootstrapDialog1>
        </Box >
    )
}

export default BulkUpload