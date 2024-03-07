import React, { useState, useEffect } from "react";
import { Box, Breadcrumbs, Typography } from "@mui/material";
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

function OCR(props) {
    const classes = OCRstyles();

    const [state, setState] = useState({
        ocrfile: { url_path: "", file_id: "", file_path: "" },
        searchtext: ""
    })

    // const [ocrfile, setOcrfile] = useState({ url_path: "", file_id: "", file_path: "" });
    // const [searchtext, setSearchtext] = useState("");
// 
// 
    // const [document, setDocument] = useState('');
    // const [browseData, setBrowseData] = useState(false);
    // const [labels, setLabels] = useState([]);
    // const [arrayList, setArrayList] = useState([]);
    // const { tenantId, fullName } = props;

    useEffect(() => {
        // documentsList()
    }, [])

    // const changeHandler = (e, index) => {
    //     setDocument(e.target.value);
    // }

    // const handleSubmit = () => {
    //     finalArray();
    // }

    // const [inside, setInside] = useState(false);
    // const [files, setFiles] = useState([]);

    // react-avatar-editor onChange fun
    // const handleFileChange = (e, index) => {
    //     console.log(e, "e");
    //     console.log(files, "filess");
    //     let fileName = e.target.files[0].name
    //     var idxDot = fileName.lastIndexOf(".") + 1;
    //     var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    //     if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == 'pdf') {
    //         setFiles(e.target.files);
    //         uploadDocs(e.target.files, index);
    //     } else {
    //         addWarningMsg("Only jpg/jpeg and png files are allowed!");
    //     }
    // };

    // react-Dropzone onChange fun
    // const handleDrop = (e, index) => {
    //     var idxDot = e[0].path.lastIndexOf(".") + 1;
    //     var extFile = e[0].path.substr(idxDot, e[0].path.length).toLowerCase();
    //     if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == 'pdf') {
    //         setFiles(e);
    //         uploadDocs(e.target.files, index);
    //     } else {
    //         addWarningMsg("Only jpg/jpeg and png files are allowed!");
    //     }
    // }

    // const addDocs = (e, index) => {
    //     const formData = new FormData();
    //     formData.append('files', e.target.files[0]);
    //     formData.append("tenant_id", tenantId);
    //     SelfOnboardApi.documentsUpload(domain, formData).then((res) => {
    //         if (res.data.statusCode == 1003) {
    //             files[index] = res.data.data[0];
    //             setFiles([...files]);
    //         } else {
    //             addErrorMsg(res.data.message);
    //         }
    //     });
    // }

    // const handleInput = () => {
    //     setInside(true);
    // }

    // const documentsList = () => {
    //     SelfOnboardApi.documentsList(LocalStorage.uid(), domain).then(
    //         (res) => {
    //             if (res.data.statusCode == 1003) {
    //                 setLabels(res.data.data);
    //             } else {
    //                 addErrorMsg(res.data.message);
    //             }
    //         }
    //     )
    // }

    // const uploadDocs = (args) => {
    //     const formData = new FormData();
    //     // eslint-disable-next-line
    //     Array.from(args).map((item, index) => {
    //         formData.append('files', args[index]);
    //     })
    //     formData.append("tenant_id", tenantId)
    //     SelfOnboardApi.documentsUpload(domain, formData).then((res) => {
    //         if (files.length > 0) {
    //             for (let i = 0; i < res.data.data.length; i++) {
    //                 files.push(res.data.data[i]);
    //             }
    //             setFiles(files);
    //         } else if (res.data.statusCode == 1003) {
    //             addSuccessMsg('Documents uploaded successfully');
    //             console.log(res.data.data, "Response add docs Data");
    //             for (let i = 0; i < res.data.data.length; i++) {
    //                 files.push(res.data.data[i]);
    //             }
    //             setFiles(files);
    //             setBrowseData(true);
    //             for (let index = 0; index < res.data.data.length; index++) {
    //                 arrayList.push({
    //                     id: files[index].id,
    //                     url: files[index].document_url
    //                 })
    //             }
    //             setArrayList(arrayList);
    //             console.log(files, "filessss");
    //         }
    //         else {
    //             addErrorMsg(res.data.message);
    //         }
    //     })
    // }

    // const finalArray = () => {
    //     SelfOnboardApi.documentsOcr(arrayList).then((res) => {
    //         if (res.status == 200) {
    //             addSuccessMsg('Documents Added successfully');
    //             props.stage(1);
    //         } else {
    //             addErrorMsg(res.data.message);
    //         }
    //     })
    // }


    const uploadDocs = (files) => {


        var formData = new FormData();
        formData.append("files", files[0]);
        // console.log(files[0], "  formData");
        OCRApi.ocrfileUpload(formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.status) {

                    setState((prev) => ({ ...prev, ocrfile: response.data.data[0] }));
                } else {
                    alert("something went wrong");
                }

                // setState({
                //     imgData: {
                //         imageUrl: '',
                //         imageid: '',
                //         imgTextData: [],
                //     }
                // });
                console.log(response, "Document Upload response");

                //         if (response.data.statusCode === 1003) {
                //             if (response.data.data === "") {
                //                 showNotification("Something went wrong.", "danger", <Error />);
                //             } else {
                //                 console.log(response.data.data.id, " response.data.data.id");
                //                 // getImage(response.data.data.id)
                //             }
                //         } else {
                //             showNotification(response.data.message, "danger", <Error />);
                //         }
            });
    };

    // const handleChangeSearch = () => {
    //     console.log("");
    // }

    return (
        <Box pl={4} ml={5}>
            <Box claseName={classes.ocrpage}>
                <Box mx={5} py={1} mt={2}>
                    <Breadcrumbs aria-label="OCR Template Create">
                        <Typography component={Link} to={'/timesheet'} className={classes.breadcrumbsLink}>Timesheets</Typography>
                        <Typography className={classes.breadcrumbsName}>Create Template</Typography>
                    </Breadcrumbs>
                </Box>

                {
                    // state.ocrfile.file_id == "" ?
                    state.ocrfile.file_id !== "" ?
                        <Box sx={{ width: "100%", height: "82vh", display: "flex", justifyContent: "center", }}>
                            <Box sx={{ width: "70%" }}>
                                <Box sx={{ width: "100%", height: "31vh" }}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: "31vh",
                                            display: 'inline-block',
                                            backgroundColor: "#F2F7FF",
                                            // border: 'dashed 3px black',
                                            border: 'dashed 2px #0C75EB',
                                            borderRadius: "8px",
                                            // borderImageSource: `url(${BorderImg})`,
                                            // borderImageSlice: 2,
                                            // borderImageRepeat: 'round',
                                            // borderImage: `url(${BorderImg}) 2 round`,
                                        }}
                                    >
                                        <DropZone callApi={uploadDocs} />
                                    </Box>
                                </Box>
                                <Box sx={{ width: "100%", height: "51vh" }} >
                                    <Box sx={{ width: "100%", height: "8vh", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text>All Templates</Text>
                                        {/* <div className={classes.searchField}>
                                            <input
                                                type="text"
                                                value={searchtext}
                                                className={classes.globalSearchInput}
                                                placeholder="Search with Invoice Number"
                                                onChange={handleChangeSearch}

                                            />
                                            <button
                                                type="button"
                                                className={classes.searchIcon}
                                            >
                                                {searchtext.length == 0 ? <img src={Search} alt="Search" /> : <CloseRoundedIcon sx={{ cursor: "pointer" }} onClick={() => closeBtn()} />}
                                            </button>
                                        </div> */}
                                    </Box>
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
        </Box>
    )
}

export default OCR;
