import React, { useState, useEffect } from "react";
import { Accordion, AccordionSummary, Box, Breadcrumbs, Grid, Skeleton, Stack, Typography } from "@mui/material";
// import CustomButton from "../../../../components/common/customButton/CustomButton";
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import OrganizationNameStyles from "./OrganizationNameStyles";
import OCRstyles from "../OCRstyles";
// import uploadSvg from '../../assets/SVG/employee/uploadSvg.svg';
// import CustomSelect from "../../components/common/customSelect/CustomSelect";
// import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
// import CustomInput from "../../components/common/customInput/CustomInput";
// import eye from '../../assets/SVG/employee/orgEye.svg.svg';
// import DeleteSVG from '../../assets/SVG/employee/orgDelete.svg.svg';
// import reload from '../../assets/SVG/employee/orgReload.svg.svg';
// import Dropzone from "react-dropzone";
// import { addErrorMsg, addSuccessMsg, addWarningMsg } from "../../utils/utils";
// import SelfOnboardApi from "../../apis/admin/selfOnboard/SelfOnboardApi";
// import LocalStorage from "../../utils/LocalStorage";
// import { domain } from '../../config/Domain';
import { Link } from "react-router-dom";
import LocalStorage from '../../../../utils/LocalStorage';
import OCRApi from '../../../../apis/admin/ocr/OCR';
import DropZone from '../../../../components/dropzone/DropZone';
import TemplateCreate from './TemplateCreate';
// import BorderImg from "../../../../assets/images/borderblue.png";
import Text from "../../../../components/customText/Text";
import docIcon from '../../../../assets/svg/docIcon.svg';
import Search from '../../../../assets/svg/search1.svg';
import LoaderIcon from '../../../../assets/svg/sandtimer.svg';
import moment from "moment";
import { addErrorMsg } from "../../../../utils/utils";

function OCR(props) {
    const classes = OCRstyles();

    const [loading, setLoading] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);
    const [data, setData] = useState([]);
    const [state, setState] = useState({
        ocrfile: { url_path: "", file_id: "", file_path: "" },
        searchtext: ""
    });
    const [searchLoad, setSearchLoad] = useState(false);


    useEffect(() => {
        getAllOcrTemplates(state.searchtext); // eslint-disable-next-line
    }, [])


    const getAllOcrTemplates = (param) => {
        setLoading(true);
        OCRApi.getOcrList(param).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                setData(response.data);
            } else {
                setLoading(false);
                addErrorMsg(response.data.message);
            }
        });
    }

    const uploadDocs = (files) => {
        var formData = new FormData();
        formData.append("files", files[0]);
        setFileLoading(true);
        OCRApi.ocrfileUpload(formData, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.status) {
                setFileLoading(false);
                setState((prev) => ({ ...prev, ocrfile: response.data.data[0] }));
            } else {
                setFileLoading(false);
                addErrorMsg(response.data.message);
            }
        });
    };

    const handleSearch = (e) => {
        console.log("search Value", e.target.value);
        setSearchLoad(true);
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
        getAllOcrTemplates(e.target.value);
        if (e.target.value == "") {
            setSearchLoad(false);
        }
    }

    const onlyTime = (param) => {
        // const dateTime = moment.utc(param, 'ddd, DD MMM YYYY HH:mm:ss z');
        // const timeOnly = dateTime.format('hh:mm A');
        // console.log(timeOnly);
        const dateTime = moment.utc(param, 'ddd, DD MMM YYYY HH:mm:ss z');
        const dateTimeWithAmPm = dateTime.format('DD-MMM-YYYY hh:mm A');
        return dateTimeWithAmPm;
    }

    return (
        <Box pl={4} ml={5}>
            <Box >
                <Box mx={5} py={1} mt={2}>
                    <Breadcrumbs aria-label="OCR Template Create">
                        <Typography component={Link} to={'/timesheet'} className={classes.breadcrumbsLink}>Timesheets</Typography>
                        <Typography className={classes.breadcrumbsName}>Create Template</Typography>
                    </Breadcrumbs>
                </Box>

                {
                    state.ocrfile.file_id == "" ?

                        <Box className={classes.mainBox}>
                            <Box className={classes.secondaryBox}>

                                {
                                    (fileLoading || loading) && !searchLoad ?
                                        <Box className={classes.dropzoneMainBox}>
                                            <Box className={classes.dropBox}>
                                                <Stack height={'inherit'} justifyContent={'center'} alignItems={'center'}>
                                                    <img src={LoaderIcon} height={100} width={100} alt='loading' />
                                                </Stack>
                                            </Box>
                                        </Box>
                                        :
                                        <Box className={classes.dropzoneMainBox}>
                                            <Box className={classes.dropBox}>
                                                <DropZone callApi={uploadDocs} />
                                            </Box>
                                        </Box>
                                }

                                < Box className={classes.secPrimaryBox} >
                                    <Box className={classes.headBox}>
                                        <Text headerBlack>All Templates</Text>
                                        {
                                            loading && !searchLoad ?
                                                <Skeleton variant="rounded" width={250} height={40} />
                                                :
                                                <div className={classes.searchDiv}>
                                                    <input
                                                        name="searchtext"
                                                        type="text"
                                                        value={state.searchtext}
                                                        className={classes.searchField}
                                                        onChange={handleSearch}
                                                        placeholder="Search by Template Name"
                                                    />
                                                    <button
                                                        type="button" className={classes.searchButton}>
                                                        <img src={Search} alt="Search" />
                                                    </button>
                                                </div>
                                        }
                                    </Box>
                                    {
                                        loading ?
                                            [1, 2, 3, 4,].map((item) => (
                                                <Accordion
                                                    key={item}
                                                    className={classes.customAccordion}
                                                >
                                                    <AccordionSummary
                                                        aria-controls="panel1bh-content"
                                                        id="panel1bh-header"
                                                        className={classes.AccordionSummary}
                                                    >
                                                        <Grid container lg={12} md={12} sm={12} xs={12} spacing={2} alignItems='center'>
                                                            <Grid item md={10}>
                                                                <Box className={classes.templateNameBox}>
                                                                    <Skeleton variant="rounded" width={40} height={40} />
                                                                    <Grid container item lg={12} md={12} display={"flex"} alignItems={"center"} pl={2}>
                                                                        <Grid item lg={12} md={12} textAlign={"start"}>
                                                                            <Skeleton variant="rounded" width={160} height={15} />
                                                                        </Grid>
                                                                        <Grid item lg={12} md={12} textAlign={"start"}>
                                                                            <Skeleton variant="rounded" width={60} height={10} />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={2} textAlign={"end"}>
                                                                <Skeleton variant="rounded" width={120} height={20} />
                                                            </Grid>

                                                        </Grid>
                                                    </AccordionSummary>
                                                </Accordion>
                                            )) :
                                            <>                                    {
                                                data.length > 0 && data.map((item, key) => (
                                                    <Accordion
                                                        key={key}
                                                        className={classes.customAccordion}
                                                    >
                                                        <AccordionSummary
                                                            aria-controls="panel1bh-content"
                                                            id="panel1bh-header"
                                                            className={classes.AccordionSummary}
                                                        >
                                                            <Grid container lg={12} md={12} sm={12} xs={12} spacing={2} alignItems='center'>
                                                                <Grid item md={10}>
                                                                    <Box className={classes.templateNameBox}>
                                                                        <img src={docIcon} alt="docIcon" />
                                                                        <Grid container item lg={12} md={12} display={"flex"} alignItems={"center"} pl={2}>
                                                                            <Grid item lg={12} md={12} textAlign={"start"}>
                                                                                <Text mediumBlack14>{item.template_name}</Text>
                                                                            </Grid>
                                                                            <Grid item lg={12} md={12} textAlign={"start"}>
                                                                                <Text smallLabel>{onlyTime(item.created_at)}</Text>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item md={2} textAlign={"end"}>
                                                                    <Typography className={classes.linkText}>
                                                                        View Details
                                                                    </Typography>
                                                                </Grid>

                                                            </Grid>
                                                        </AccordionSummary>
                                                    </Accordion>
                                                ))
                                            }
                                            </>
                                    }
                                </Box>
                            </Box>
                        </Box> :
                        <TemplateCreate ocrfile={state.ocrfile} />
                }
                {/* <Box my={2} sx={{background:"green", width: "100%", height: "40vh"}}>5</Box> */}
            </Box>


            {/* Template create.... */}
            {/* <Dropzone onDrop={(e, index) => { handleDrop(e, index) }} className={classes.dropZone}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ onClick: evt => evt.stopPropagation() })}>
                        {
                            browseData ? '' : <img src={uploadSvg} alt="upload Document" multiple className={classes.uploadSvg} />
                        }
                        <Text header>Drag and drop timesheets here</Text>
                        <Text header dates pt={1} pb={2}>or</Text>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Button save component="label" onClick={handleInput}>
                                {
                                    inside ? <input hidden name="img" type="file" multiple onChange={(e) => handleFileChange(e)} /> : null
                                }
                                Upload</Button>
                        </Grid>
                        <input {...getInputProps()} />
                    </div>
                )}
            </Dropzone> */}
        </Box >
    )
}

export default OCR;
