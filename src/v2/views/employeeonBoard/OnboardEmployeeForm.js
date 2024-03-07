import { Box, Divider } from "@mui/material";
import React, { useState, useRef } from "react";
import Text from "../../components/customText/Text";
import warning from '../../assets/svg/warning.svg';
import samplePdf from '../../assets/onboardingpdf/sample.pdf';
import uploadArrowBlue from '../../assets/svg/uploadArrowBlue.svg';
import onBoardLinkApi from "../../apis/onBoardLink/onBoardLinkApi";
import { addErrorMsg, addSuccessMsg } from "../../utils/utils";
import Downloadcloud from '../../assets/svg/download-cloud-blue.svg';
import Downloadcloudwhite from '../../assets/svg/download-cloud-white.svg';
import Button from '../../components/customButton/Button';
import OnboardStyles from './OnboardStyles';
import FsLightbox from 'fslightbox-react';

function OnboardEmployeeForm(props) {
    const { setMainStep, setI9DocumentId, setW4DocumentId, i9, w4, setI9, setW4 } = props;
    const [isHovered, setIsHovered] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [documentType, setDocumentType] = useState(null);
    const fileInputRef = useRef(null);
    const classes = OnboardStyles();

    const handleChange = (value) => {
        const MAX_FILE_SIZE_MB = 25;
        const file = value.target.files[0];
        if (file && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) {
            const formData = new FormData();
            formData.append("tenant_id", "b7943da6-db1f-47ef-8b33-de2982c1e272");
            formData.append("files", value.target.files[0]);
            onBoardLinkApi.documentUpload(formData).then(
                (response) => {
                    if (response.data.statusCode == 1003) {
                        if (documentType == "i9") {
                            setI9({
                                ...i9,
                                new_document_id: response.data.data.id,
                                document_name: value.target.files[0].name,
                                url: response.data.data.document_url
                            });
                            setI9DocumentId(response.data.data.id);
                            addSuccessMsg("I-9 File Uploaded Successfully");
                            fileInputRef.current.value = null;
                        } else {
                            setW4({
                                ...w4,
                                new_document_id: response.data.data.id,
                                document_name: value.target.files[0].name,
                                url: response.data.data.document_url
                            });
                            setW4DocumentId(response.data.data.id);
                            addSuccessMsg("W-4 File Uploaded Successfully");
                            fileInputRef.current.value = null;
                        }
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }
            );
        } else {
            addErrorMsg(`File size must be less than or equal to ${MAX_FILE_SIZE_MB} MB`);
        }
    };

    const handleDownloadPdf = () => {
        const link = document.createElement('a');
        link.href = samplePdf;
        link.setAttribute('download', `sample.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
    }

    const NextStep = () => {
        if (i9.new_document_id == null || w4.new_document_id == null) {
            addErrorMsg("Please Upload I-9 and W-4 Files");
        } else {
            setMainStep(2);
        }
    }

    return (

        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
            <Box display={"flex"} justifyContent={"center"} mt={8} p={1.5} alignItems={"center"} width={"auto"} height={"80px"} borderRadius={"8px"} backgroundColor={"#F59E0B33"}>
                <img src={warning} alt="warning"></img>
                <Text className={classes.DownloadFormText} p={4}>Please  Download Form I-9 and W-4, Fill Them And Upload Them In The Respective Fields. Please find the sample <br></br>documents for your reference
                </Text>
            </Box>
            <Box width={"55%"} display={"flex"} justifyContent={"space-between"} mt={5}>
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <Button
                        onClick={handleDownloadPdf}
                        className={classes.DownloadFormButton}
                        onMouseEnter={() => setIsHovered(1)}
                        onMouseLeave={() => setIsHovered(0)}>
                        <img className={classes.ImgMargin} src={isHovered == 1 ? Downloadcloudwhite : Downloadcloud} alt="Downloadcloud"></img>
                        Download Form I-9
                    </Button>

                    <Box className={classes.I9DocUploadBoxMain}>
                        <Box className={classes.I9DocBox}>
                            <Box className={classes.I9DocBox2}>
                                <Text className={classes.I9Text}>
                                    {i9.document_name ? (i9.document_name.length > 20 ? `${i9.document_name.slice(0, 20)}...` : i9.document_name) : "Form I-9"}
                                </Text>
                            </Box>

                        </Box>

                        <Button
                            onClick={() => { fileInputRef.current.click(); setDocumentType("i9"); }}
                            browseBtnUpload
                            startIcon={<img src={uploadArrowBlue} alt='browse' />}>
                            Upload
                        </Button>


                    </Box>

                    <Text className={classes.ViewI9Text}>To view I-9 sample document <span onClick={() => { setIsLightboxOpen(!isLightboxOpen); }} className={classes.ClickHere}>click here</span></Text>
                </Box>
                <Divider orientation="vertical" flexItem></Divider>
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <Button
                        onClick={handleDownloadPdf}
                        className={classes.DownloadFormButton}
                        onMouseEnter={() => setIsHovered(2)}
                        onMouseLeave={() => setIsHovered(0)}
                    >
                        <img className={classes.ImgMargin} src={isHovered == 2 ? Downloadcloudwhite : Downloadcloud} alt="Downloadcloud"></img>

                        Download Form W-4
                    </Button>
                    <Box className={classes.I9DocUploadBoxMain}>
                        <Box className={classes.I9DocBox}>
                            <Box className={classes.I9DocBox2}>
                                <Text className={classes.I9Text}>
                                    {w4.document_name ? (w4.document_name.length > 20 ? `${w4.document_name.slice(0, 17)}...pdf` : w4.document_name) : "Form W-4"}
                                </Text>
                            </Box>

                        </Box>

                        <Button
                            onClick={() => { fileInputRef.current.click(); setDocumentType("w4"); }}
                            browseBtnUpload
                            startIcon={<img src={uploadArrowBlue} alt='browse' />}>
                            Upload
                        </Button>


                    </Box>
                    <Text className={classes.ViewI9Text}>To view W-4 sample document <span onClick={() => { setIsLightboxOpen(!isLightboxOpen); }} className={classes.ClickHere}>click here</span></Text>
                </Box>
            </Box>
            <Box width={"55%"} display={"flex"} justifyContent={"space-between"} pb={5} position={"absolute"} bottom={0}>

                <Button className={classes.BackButton} onClick={() => { setMainStep(0) }}>Back</Button>
                <Button className={classes.ContinueButton} onClick={NextStep}>Continue</Button>
            </Box>

            <input
                type="file"
                multiple
                onChange={handleChange}
                hidden
                ref={fileInputRef}
            />
            <FsLightbox
                toggler={isLightboxOpen}
                sources={[
                    <iframe title="pdf" src={samplePdf} width={"10000px"} height={"10000px"} />
                ]}
            />
        </Box>
    );
}

export default OnboardEmployeeForm;