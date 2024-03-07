import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Stack, Step, Stepper } from "@mui/material";
// import Text from "../../../../components/common/customText/CustomText";
// import CustomButton from "../../../../components/common/customButton/CustomButton";
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import OrganizationNameStyles from "./OrganizationNameStyles";

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
import LocalStorage from '../../../../utils/LocalStorage';
// import { domain } from '../../config/Domain';
// import { Link } from "react-router-dom";
import OCRstyles from "../OCRstyles";
import Text from '../../../../components/customText/Text';
// import LocalStorage from '../../../../utils/LocalStorage';
// import CommonApi from '../../../../apis/CommonApi';
// import DropZone from '../../../../components/dropzone/DropZone';
// import BorderImg from "../../../../assets/images/border.png";
import { ReactComponent as InfoIcon } from '../../../../assets/svg/info_svg.svg';
import Input from '../../../../components/input/Input';
import Datepicker from '../../../../components/datePicker/Date';
import OCRApi from '../../../../apis/admin/ocr/OCR';
// import { addErrorMsg, addSuccessMsg, dateFormat, addWarningMsg } from '../../../../utils/utils';
import { AddEmployeeStepper, BrownMnColorlibStepLabel, BrownMnCustomisedConnector } from '../../../../theme';
// import { AddEmpCont, AddEmpSubStepper, AddEmployeeStepper, BrownMnColorlibStepLabel, BrownMnCustomisedConnector } from '../../../../theme';
import ReactCrop from 'react-image-crop';
// import moment from "moment";
import 'react-image-crop/dist/ReactCrop.css';

const mainStepsList = ['Add Employee Name', 'Add Dates & Hours', 'Add Anchor Points'];

const testIMGURL = "https://ocr.codetru.org/media/image/865eaf0d-7a42-4cac-b177-4c96b60da3d3.jpg/";

function TemplateCreate(props) {
    const classes = OCRstyles();
    const imgRef = useRef(null);
    const [state, setState] = useState({
        cropData: {}
    });


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

    const endCrop = (e) => {

        // setTimeout(() => {

        // console.log(document.querySelector('.ReactCrop__crop-selection'), "  '.ReactCrop__crop-selection'");


        var img = new Image();
        // img.src = location.state.imageUrl;
        // img.src = props.ocrfile.url_path;
        img.src = testIMGURL;
        img.onload = () => {
            var renderedImg = imgRef.current;
            var rect = renderedImg.getBoundingClientRect();
            var data = { scaleX: rect.width / img.naturalWidth, scaleY: rect.height / img.naturalHeight, pdfArea: { x: rect.left, y: rect.top } };
            var elem = document.querySelector('.ReactCrop__crop-selection');
            var pageX = window.pageXOffset + elem.getBoundingClientRect().left;
            var pageY = window.pageYOffset + elem.getBoundingClientRect().top;
            var clientX = pageX - document.documentElement.scrollLeft;
            var clientY = pageY - document.documentElement.scrollTop;
            let startPos = {
                x: pageX - data.pdfArea.x,
                y: pageY - data.pdfArea.y
            };
            let currentPos = {
                x: clientX + elem.getBoundingClientRect().width - data.pdfArea.x,
                y: clientY + elem.getBoundingClientRect().height - data.pdfArea.y
            }
            var points = [[startPos.x / data.scaleX, startPos.y / data.scaleY], [currentPos.x / data.scaleX, startPos.y / data.scaleY], [currentPos.x / data.scaleX, currentPos.y / data.scaleY], [startPos.x / data.scaleX, currentPos.y / data.scaleY]]
            getAreaText(points, props.ocrfile.url_path);
            console.log(points, "  AreaText");
        };

        // }, 2000);

    }


    // [
    //     [
    //         722.8697685526074,
    //         1765.6166234771435
    //     ],
    //     [
    //         944.9377992947088,
    //         1765.6166234771435
    //     ],
    //     [
    //         944.9377992947088,
    //         852.836173611268
    //     ],
    //     [
    //         722.8697685526074,
    //         852.836173611268
    //     ]
    // ]

    const getAreaText = (data, url) => {
        let obj = {
            url: url,
            area_points: data,
        };
        OCRApi.getOCRAreaText(obj, LocalStorage.getAccessToken())
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
    }


    return (
        <Box sx={{ width: "100%", height: "82vh" }}>
            <Box sx={{ width: "100%", height: "10vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ width: "60%" }}>
                    <Stepper activeStep={0} connector={<BrownMnCustomisedConnector />}>
                        {
                            mainStepsList.map((item) => (
                                <Step>
                                    <BrownMnColorlibStepLabel StepIconComponent={AddEmployeeStepper}>
                                        <Text BrowmnMnStepperText>{item}</Text>
                                    </BrownMnColorlibStepLabel>
                                </Step>
                            ))
                        }
                    </Stepper>
                </Box>
            </Box>
            <Box mx={5}>
                <Grid container gap={0}>
                    <Grid item lg={8} md={8}>
                        <Box p={3} sx={{ width: "100%", minHeight: "72vh", border: "1px solid #C7CCD3", backgroundColor: "#FFFFFF", borderRadius: "8px", }}>

                            <Box px={2} mb={2} sx={{ width: "100%", height: "56px", display: "flex", alignItems: "center", borderRadius: "8px", backgroundColor: "#F59E0B33" }}>
                                <InfoIcon />
                                <Text className={classes.infoText}>
                                    Please click and drag on employee name to continue
                                </Text>
                            </Box>

                            <Box sx={{ width: "100%", height: "auto" }}>
                                <ReactCrop crop={state.cropData} onChange={(e) => setState((prev) => ({ ...prev, cropData: e }))} onDragEnd={(e) => endCrop(e)}>
                                    {/* <img src={props.ocrfile.url_path} alt={"ocr"} ref={imgRef} /> */}
                                    <img src={testIMGURL} alt={"ocr"} ref={imgRef} />
                                    {/* <div style={{width: "40vh", height: "40vh"}}></div> */}
                                </ReactCrop>
                            </Box>

                            {/* <Box  sx={{ position: 'relative', width: renderedImgDimensions.width, height: renderedImgDimensions.height, border: '1px solid grey' }}> */}
                            {/* <Box sx={{ position: 'relative', border: '1px solid grey' }}>
                                <img src={props.ocrfile.url_path} alt={"ocr"}
                                    style={{
                                        width: '100%', height: 'auto',
                                        // position: 'absolute', top: 0, left: 0, cursor: mouseCreateMode ? 'crosshair' : 'default'
                                        position: 'absolute', top: 0, left: 0, cursor: 'default'
                                    }}
                                    ref={imgRef}
                                />
                            </Box> */}

                        </Box>
                    </Grid>




                    <Grid item lg={4} md={4}>
                        <Box pl={4} pb={3} sx={{ width: "100%", height: "72vh" }}>
                            <Box p={2} sx={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0px 0px 15px 0px #0000000D" }}>
                                <Box p={1}><Text className={classes.sideboxtitle}>Captured Data</Text></Box>
                                <Box p={1}>
                                    <Box py={1}>
                                        <Input
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                name: 'customer_note',
                                                // value: formData.end_client_id === "" ? "" : placementsList.length > 0 ? placementsList.filter((i) => i.end_client_id === formData.end_client_id)[0]?.end_client_name : "",
                                                value: "state.customer_note",
                                                type: 'text',
                                                inputProps: {
                                                    maxLength: 250
                                                }
                                                // disabled: true
                                            }}
                                            // handleChange={handleChange}
                                            clientInput
                                            labelText={<Text largeLabel>Customer Note</Text>}
                                        // labelText={<Text largeLabel>End Client <span className={classes.optional}>(Optional)</span></Text>}
                                        />
                                        {/* <Text errorText> {error.customer_note ? error.customer_note : ""}</Text> */}
                                    </Box>
                                    {/* <Box> */}
                                    <Stack direction="row" my={2} gap={2}>
                                        <Box>
                                            <Datepicker
                                                labelText="Date"
                                                name="date"
                                                value={state.date}
                                            // minDate={moment().format(dateFormat())}
                                            // onChange={(e) => handleChangeDate(e.$d, "date")}
                                            />
                                        </Box>
                                        <Box>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'customer_note',
                                                    value: "00.00",
                                                    type: 'text',
                                                    inputProps: {
                                                        maxLength: 5
                                                    }
                                                    // disabled: true
                                                }}
                                                // handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>Hours</Text>}
                                            // labelText={<Text largeLabel>End Client <span className={classes.optional}>(Optional)</span></Text>}
                                            />
                                        </Box>
                                    </Stack>
                                    {/* </Box> */}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default TemplateCreate;
