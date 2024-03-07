import React, { useState, useRef, useEffect } from "react";
import OnboardStyles from './OnboardStyles';
import logoName from '../../assets/svg/logo-name.svg';
import uploadEmployee from '../../assets/svg/uploadEmployee.svg';
import Done from '../../assets/svg/Done.svg';
import onBoradEmptyData from '../../assets/svg/onBoradEmptyData.svg';
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../../assets/svg/loading.svg';
import OnboardEmployeeForm from './OnboardEmployeeForm';
import validate from '../../assets/svg/validate.svg';
import onBoardLinkApi from "../../apis/onBoardLink/onBoardLinkApi";
import EmergencyContactInformation from './EmergencyContactInformation';
import Delete from '../../assets/svg/Delete.svg';
import uploadArrow from '../../assets/svg/uploadArrow.svg'
import Text from "../../components/customText/Text";
import CopyVoidChequeFields from "./UploadFields/CopyVoidChequeFields";
import WorkAuthorizationFields from "./UploadFields/WorkAuthorizationFields";
import PassPortFields from "./UploadFields/PassPortFields";
import OtherFields from "./UploadFields/OtherFields";
import EducationalDocumentFields from "./UploadFields/EducationalDocumentFields";
import I94Fields from "./UploadFields/I94Fields";
import DrivingLicenseFields from "./UploadFields/DrivingLicenseFields";
import Date from '../../components/datePicker/Date';
import Button from '../../components/customButton/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useLocation } from "react-router-dom";
import { pdfjs } from 'react-pdf';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { Box, Grid, Step, Stepper } from '@mui/material';
import { AddEmployeeStepper, BrownMnColorlibStepLabel, BrownMnCustomisedConnector } from '../../theme';
import { addErrorMsg, dateFormat } from "../../utils/utils";
import moment from 'moment';

function OnboardEmployeeUpload() {
    const { id } = useParams();
    const mainStepsList = ['Upload Documents', 'I-9 & W4', 'Emergency Contact Information'];
    const [mainStep, setMainStep] = useState(0);
    const [fileRefresh, setFileRefresh] = useState(true);
    const [isUploaded, setIsUploaded] = useState(false);
    const navigate = useNavigate();
    const [drawer, setDrawer] = useState(false);
    const location = useLocation();
    const { state } = location;
    const data = state ? state.data.upload_documents : [];
    const first_name = state ? state.data.first_name : '';
    const last_name = state ? state.data.last_name : '';
    const [filetype, SetFileType] = useState(data);
    const [fileSelected, setFileSelected] = useState(1);
    const [copyVoidChequeFields, setCopyVoidChequeFields] = useState({
        account_number: '',
        routing_number: '',
        bank_name: '',
        account_type: 'savings',
    });
    const [i9, setI9] = useState({
        new_document_id: null,
        document_name: null,
        url: null
    });
    const [w4, setW4] = useState({
        new_document_id: null,
        document_name: null,
        url: null
    });
    const [i9DocumentId, setI9DocumentId] = useState(null);
    const [w4DocumentId, setW4DocumentId] = useState(null);
    const [workAuthorizationFields, setWorkAuthorizationFields] = useState({
        visa_type: 'H1-b',
        visa_number: '',
        date_of_issue: '',
        date_of_expiry: ''
    });
    const [passportFields, setPassportFields] = useState({
        passport_number: '',
        issued_country: '',
        date_of_issue: '',
        date_of_expiry: ''
    });
    const [educationalDocumentFields, setEducationalDocumentFields] = useState({
        field_of_study: '',
        university_name: '',
        education_level: '',
        start_date: '',
        end_date: '',
        country: '',
        state: '',
    });
    const [otherFields, setOtherFields] = useState({
        document_name: '',
        document_category: ''
    });
    const [i94Fields, setI94Fields] = useState({
        i_94_number: '',
        country_of_origin: '',
        date_of_issue: '',
        date_of_expiry: ''
    });
    const [drivingLicenseFields, setDrivingLicenseFields] = useState({
        document_number: '',
        address_line_1: '',
        address_line_2: '',
        country: '',
        state: '',
        zipcode: ''
    });
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [ocrData, setOcrData] = useState({});
    const inputRef = useRef();
    const classes = OnboardStyles();
    const handleDragOver = (event) => {
        event.preventDefault();
    };


    const onError = (error) => {
        console.log(error);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        handleUploadFile(event);
    }

    const validateFileType = (file) => {
        // Check if the file type is PDF
        return file.type === 'application/pdf';
    };

    const handleChangeFile = (event, fileSelected) => {
        event.preventDefault();
        if (fileSelected === 0) {
            addErrorMsg("Please select any one document");
        } else {
            const updatedFiletype = [...filetype]; // Create a copy of the array
            const indexToUpdate = fileSelected - 1;

            // Check if fileUploaded is already present
            if (!updatedFiletype[indexToUpdate].hasOwnProperty('fileUploaded')) {
                // Add fileUploaded: 1 to the targeted file
                updatedFiletype[indexToUpdate] = {
                    ...updatedFiletype[indexToUpdate],
                    fileUploaded: 1
                };
            }

            const selectedFiles = Array.from(event.target.files);
            const urlFile = [];

            for (let i = 0; i < selectedFiles.length; i++) {

                const file = selectedFiles[i];

                if (!validateFileType(file)) {
                    addErrorMsg("Please select only PDF files");
                    return;
                }

                const fileReader = new FileReader();

                fileReader.onload = (e) => {
                    urlFile.push({ name: selectedFiles[i].name, url: e.target.result });

                    // Check if all files have been processed
                    if (i === selectedFiles.length - 1) {
                        // Update the state with the modified filetype array
                        updatedFiletype[indexToUpdate].files = (updatedFiletype[indexToUpdate].files || []).concat(urlFile);
                        SetFileType(updatedFiletype);
                    }
                };

                fileReader.readAsDataURL(selectedFiles[i]);
            }

            inputRef.current.value = null;
        }
    };

    const handleUploadFile = (event) => {
        if (fileSelected === 0) {
            addErrorMsg("Please select any one document");
        } else {
            const updatedFiletype = [...filetype]; // Create a copy of the array
            const indexToUpdate = fileSelected - 1;

            // Check if fileUploaded is already present
            if (!updatedFiletype[indexToUpdate].hasOwnProperty('fileUploaded')) {
                // Add fileUploaded: 1 to the targeted file
                updatedFiletype[indexToUpdate] = {
                    ...updatedFiletype[indexToUpdate],
                    fileUploaded: 1
                };
            }

            const selectedFiles = Array.from(event.dataTransfer.files);
            const urlFile = [];

            for (let i = 0; i < selectedFiles.length; i++) {

                const file = selectedFiles[i];
                
                if (!validateFileType(file)) {
                    addErrorMsg("Please select only PDF files");
                    return;
                }
                
                const fileReader = new FileReader();

                fileReader.onload = (e) => {
                    urlFile.push({ name: selectedFiles[i].name, url: e.target.result });

                    // Check if all files have been processed
                    if (i === selectedFiles.length - 1) {
                        // Update the state with the modified filetype array
                        updatedFiletype[indexToUpdate].files = (updatedFiletype[indexToUpdate].files || []).concat(urlFile);
                        SetFileType(updatedFiletype);
                    }
                };

                fileReader.readAsDataURL(selectedFiles[i]);
            }
            inputRef.current.value = null;
        }

    }

    useEffect(() => {
        if (data[fileSelected - 1].slug == "driving_license") {
            getCountryList();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (data[fileSelected - 1].slug == "driving_license") {
            getStatesList();
        }
        // eslint-disable-next-line
    }, [drivingLicenseFields.country]);


    const getCountryList = () => {
        onBoardLinkApi.getCountryList().then((res) => {
            if (res.data.statusCode === 1003) {
                setCountryList(res.data.data);
            } else {
                addErrorMsg(res.data.message);
            }
        });
    }

    const getStatesList = () => {
        onBoardLinkApi.getStatesList(drivingLicenseFields.country).then((res) => {
            if (res.data.statusCode === 1003) {
                setStateList(res.data.data);
            } else {
                // addErrorMsg(res.data.message);
            }
        });
    }

    const handleClickShowFile = () => {

        if (filetype[fileSelected - 1].is_mandatory == "true" && filetype[fileSelected - 1].fileUploaded == undefined) {
            addErrorMsg("Please upload document");
        } else if (fileSelected < filetype.length) {
            setFileSelected(fileSelected + 1);
        } else {
            let allocrdata = {
                copy_of_void_cheque: copyVoidChequeFields,
                work_authorization: workAuthorizationFields,
                passport: passportFields,
                educational_document: educationalDocumentFields,
                other_document: otherFields,
                i94_document: i94Fields
            }
            setOcrData(allocrdata);
            setMainStep(1);
        }
    }

    const handleClickBackFile = () => {
        if (fileSelected > 1) {
            setFileSelected(fileSelected - 1);
        } else {
            setIsUploaded(false);
        }
    }

    const NormalBox = (prop) => (
        <Box className={classes.BoxCursorPointer}
            onClick={() => { setDrawer(true); }}
            mt={'20px'} width={'55px'} height={'55px'}
            border={'1.5px solid #C7CCD3'}
            backgroundColor={'#FFFFFF'}
            color={'#262626'}
            borderRadius={'8px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {prop.value + 1}
        </Box>
    );

    const ValidateBox = (prop) => (
        <Box className={classes.BoxCursorPointer}
            onClick={() => { setDrawer(true); }}
            mt={'20px'} width={'55px'} height={'55px'}
            border={'1.5px solid #FF4B55'}
            backgroundColor={'#FDD6D6'}
            color={'#FF4B55'}
            borderRadius={'8px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {prop.value + 1}
        </Box>
    );

    const SelectedBox = (prop) => (
        <Box className={classes.BoxCursorPointer}
            onClick={() => { setDrawer(true); }}
            mt={'20px'} width={'55px'} height={'55px'}
            border={'none'}
            backgroundColor={'#D1E1FF'}
            color={'#262626'}
            borderRadius={'8px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {prop.value + 1}
        </Box>
    );

    const DoneBox = (prop) => (
        <Box className={classes.BoxCursorPointer} mt={'20px'} width={'55px'} height={'55px'} backgroundColor={'#E7FEE7'} color={'#1C9A1A'} borderRadius={'8px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <img src={Done} alt="Done"></img>
        </Box>
    );

    const NormalBoxDrawer = (prop) => (
        <Box onClick={() => { setDrawer(false); }} className={classes.BoxCursorPointer} mt={'20px'} width={'330px'} height={'55px'}
            border={'1.5px solid #C7CCD3'}
            pl={1.5}
            backgroundColor={'#FFFFFF'} color={'#262626'} borderRadius={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            {prop.value + 1}  {prop.name}
            <img src={Loading} alt="Loading" className={classes.ImgStyle}></img>
        </Box>
    );

    const FileUploaBoxDrawer = (prop) => (
        <Box onClick={() => { setDrawer(false); }} className={classes.BoxCursorPointer} mt={'20px'} width={'330px'} height={'55px'}
            border={'1.5px solid #C7CCD3'}
            pl={1.5}
            backgroundColor={'#FFFFFF'} color={'#262626'} borderRadius={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            {prop.value + 1}  {prop.name}
            <CheckCircleIcon className={classes.CheckCircleStyle}></CheckCircleIcon>
        </Box>
    );

    const DoneBoxDrawer = (prop) => (
        <Box onClick={() => { setDrawer(false); }} className={classes.BoxCursorPointer} mt={'20px'} width={'330px'} height={'55px'}
            pl={1.5}
            backgroundColor={'#E7FEE7'} color={'#1C9A1A'} borderRadius={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            {prop.value + 1}  {prop.name}
            <img src={Done} alt="Done" className={classes.ImgStyle}></img>
        </Box>
    );

    const ValidateBoxDrawer = (prop) => (
        <Box onClick={() => { setDrawer(false); }} className={classes.BoxCursorPointer} mt={'20px'} width={'330px'} height={'55px'}
            border={'1.5px solid #FF4B55'} pl={1.5}
            backgroundColor={'#FDD6D6'} color={'#FF4B55'} borderRadius={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            {prop.value + 1}  {prop.name}
            <img src={validate} alt="validate" className={classes.ImgStyle}></img>
        </Box>
    );

    const changeHandlerForCopyVoidChequeFields = (e) => {
        let { name, value } = e.target;
        setCopyVoidChequeFields(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const changeHandlerForWorkAuthorizationFields = (e) => {
        let { name, value } = e.target;
        setWorkAuthorizationFields(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const changeHandlerForPassPortFields = (e) => {
        let { name, value } = e.target;
        setPassportFields(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const changeHandlerForOtherFields = (e) => {
        let { name, value } = e.target;
        setOtherFields(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const changeHandlerForEducationalDocumentFields = (e) => {
        let { name, value } = e.target;
        setEducationalDocumentFields(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const changeHandlerForI94Fields = (e) => {
        let { name, value } = e.target;
        setI94Fields(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const changeHandlerForDrivingLicenseFields = (e) => {
        let { name, value } = e.target;
        if (name == 'country') {
            setDrivingLicenseFields(prevState => ({
                ...prevState,
                [name]: value,
                state: '',
                zipcode: '',
            }));

        } else {
            setDrivingLicenseFields(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }


    const dateChangeWorkAuthorization = (e, name) => {
        let date = e.$d;
        setWorkAuthorizationFields({
            ...workAuthorizationFields,
            [name]: moment(date).format(dateFormat()),
        });
    };

    const dateChangePassport = (e, name) => {
        let date = e.$d;
        setPassportFields({
            ...passportFields,
            [name]: moment(date).format(dateFormat()),
        });
    };

    const dateChangeEducationalDocument = (e, name) => {
        let date = e.$d;
        setEducationalDocumentFields({
            ...educationalDocumentFields,
            [name]: moment(date).format(dateFormat()),
        });
    };

    const dateChangeI94 = (e, name) => {
        let date = e.$d;
        setI94Fields({
            ...i94Fields,
            [name]: moment(date).format(dateFormat()),
        });
    }

    const handleDeleteCurrentFile = () => {
        // Create a new array where the selected file type has 'fileUploaded' and 'files' removed
        const newFiletype = filetype.map((file, index) => {
            if (index === fileSelected - 1) {
                // This is the selected file type, remove 'fileUploaded' and 'files'
                const { fileUploaded, files, ...fileWithoutUploadInfo } = file;
                return fileWithoutUploadInfo;
            } else {
                // This is not the selected file type, leave it unchanged
                return file;
            }
        });

        // Update your state with the new array
        // Replace 'setFiletype' with the function you use to update your state
        SetFileType(newFiletype);
    };

    const handleRefreshTheCurrentFile = () => {
        setFileRefresh(false);
        setTimeout(() => {
            setFileRefresh(true);
        }, 100);
    }

    const handleFileSelect = (index) => {
        setFileSelected(index + 1);
    };

    const handleButtonClick = () => {
        inputRef.current.click();
    };

    console.log("filetype",filetype);

    return (
        <div>
            <img src={logoName} alt="logoName"></img>

            <Grid container justifyContent='center'>
                <Box width={'65%'} mt={'20px'} p={'10px 0px 10px 0px !important'}>
                    <Stepper activeStep={mainStep} connector={<BrownMnCustomisedConnector />}>
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
            </Grid>
            {mainStep === 0 &&
                <>
                    {!isUploaded && <Grid container mt={7}>
                        <Grid item xl={6} lg={6} pl={5} pb={5}>
                            <Text className={classes.UploadText1}>Hello {first_name} {last_name}!</Text>
                            <Text className={classes.UploadText2}>Please Upload The Documents To Continue With The Offer.</Text>
                            <Box className={classes.DataDisplayBox}>
                                {filetype && filetype.map((item, index) => (

                                    <Box width={'100%'} height={'50px'} className={classes.DataDisplayBoxInside}
                                        border={fileSelected == (index + 1) ? '0.5px solid #87bbf5 !important' : ''}
                                        onClick={() => handleFileSelect(index)}
                                        borderRadius={'8px'} mt={'20px'}
                                        backgroundColor={'#FAFAFA'}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        padding="10px" >
                                        <Text className={classes.ItemsName}>{index + 1}.{item.name}</Text>
                                        {item.fileUploaded == 1 && <CheckCircleIcon className={classes.CheckCircleStyle}></CheckCircleIcon>}
                                    </Box>

                                ))}
                            </Box>
                        </Grid>
                        <Grid item xl={6} lg={6} p={3}>
                            <Box
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
                                className={classes.DragandDropStyle}>
                                <img src={uploadEmployee} alt="uploadEmployee"></img>
                                <Text className={classes.DragandDropText1}>Drag & Drop  Documents Here</Text>
                                <Text className={classes.DragandDropText2}>Or</Text>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(event) => handleChangeFile(event, fileSelected)}
                                    hidden
                                    ref={inputRef}
                                />
                                <Button className={classes.BrowseButton} onClick={handleButtonClick}>Browse</Button>
                            </Box>
                            <Box height={'100px'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} mt={'5px'}>
                                <Button className={classes.BackButton} onClick={() => navigate(`/onboard-invite-link/${id}`)}>Back</Button>
                                <Button className={classes.ContinueButton} onClick={() => { setIsUploaded(true); setFileSelected(1); }}>Continue</Button>
                            </Box>
                        </Grid>
                    </Grid>}
                    {isUploaded &&
                        <Grid container mt={4}>
                            <Grid item xl={8} lg={8} pl={2} pb={5} display={'flex'} gap={1}>
                                <Box component={"section"} className={classes.SideMiniDrawerBox}>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(event) => handleChangeFile(event, fileSelected)}
                                        hidden
                                        ref={inputRef}
                                    />
                                    <Box onClick={handleButtonClick} className={classes.BoxCursorPointer} width={'55px'} height={'55px'} backgroundColor={'#0C75EB'} color={'#FFFFFF'} borderRadius={'8px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                        <img src={uploadArrow} alt="uploadArrow"></img>
                                    </Box>
                                    {
                                        filetype && filetype.map((item, index) => {
                                            if (item.is_mandatory == "true" && item.fileUploaded == undefined) {
                                                return <ValidateBox key={index} value={index} ></ValidateBox>;
                                            }
                                            else if ((index + 1) < fileSelected) {
                                                return <DoneBox key={index} value={index} ></DoneBox>;
                                            }
                                            else if (fileSelected == (index + 1)) {
                                                return <SelectedBox key={index} value={index} ></SelectedBox>;
                                            } else {
                                                return <NormalBox key={index} value={index} ></NormalBox>;
                                            }
                                        })
                                    }
                                </Box>
                                {drawer &&
                                    <Box component={"section"} backgroundColor={'#FFFFFF'} zIndex={1} position={'absolute'} className={classes.sideMaxDrawerBox}>
                                        <Box gap={2} onClick={handleButtonClick} className={classes.BoxCursorPointer} width={'330px'} height={'55px'} backgroundColor={'#0C75EB'} color={'#FFFFFF'} borderRadius={'8px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                            <img src={uploadArrow} alt="uploadArrow"></img>
                                            <Text className={classes.UploadText}>Upload</Text>
                                        </Box>
                                        {
                                            filetype && filetype.map((item, index) => {

                                                if (item.is_mandatory == "true" && item.fileUploaded == undefined) {
                                                    return <ValidateBoxDrawer key={index} name={item.name} value={index}></ValidateBoxDrawer>;
                                                }
                                                else if ((index + 1) < fileSelected) {
                                                    return <DoneBoxDrawer key={index} name={item.name} value={index}></DoneBoxDrawer>;
                                                }
                                                else if (item.fileUploaded == 1) {
                                                    return <FileUploaBoxDrawer key={index} name={item.name} value={index} ></FileUploaBoxDrawer>;
                                                }
                                                else {
                                                    return <NormalBoxDrawer key={index} name={item.name} value={index}></NormalBoxDrawer>;
                                                }
                                            })
                                        }
                                    </Box>}
                                <Box
                                    backgroundColor={'#F6F6F6'}
                                    borderRadius={'8px'}
                                    className={classes.sideMainMaxDrawerBox}
                                >
                                    <Box
                                        position={!drawer?"sticky":"unset"}
                                        top="0"
                                        zIndex={!drawer?"1":"0"}
                                        backgroundColor="#F6F6F6"
                                        padding="10px"
                                    >
                                        <Box display={'flex'} justifyContent={'space-between'}>
                                            <Box p={2}>
                                                <Text className={classes.PDFRenderBoxText}>
                                                    {data[fileSelected - 1].name}
                                                </Text>
                                            </Box>
                                            <Box
                                                display={'flex'}
                                                justifyContent={'space-between'}
                                                p={2}
                                                width={'125px'}
                                            >
                                                <Box
                                                    onClick={handleRefreshTheCurrentFile}
                                                    className={classes.BoxCursorPointer}
                                                    backgroundColor={'#FFFFFF'}
                                                    height={'38px'}
                                                    width={'38px'}
                                                    borderRadius={'8px'}
                                                    p={'10px'}
                                                >
                                                    <CachedOutlinedIcon fontSize="small"></CachedOutlinedIcon>
                                                </Box>
                                                <Box
                                                    onClick={handleDeleteCurrentFile}
                                                    className={classes.BoxCursorPointer}
                                                    backgroundColor={'#FFFFFF'}
                                                    height={'38px'}
                                                    width={'38px'}
                                                    borderRadius={'8px'}
                                                    p={'10px'}
                                                >
                                                    <img src={Delete} alt="Delete"></img>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        justifyContent={'center'}
                                        width={'60%'}
                                        margin={'auto'}
                                        paddingTop="60px"  // Adjust this value based on the height of the sticky header
                                    >
                                        {filetype[fileSelected - 1]['files'] &&
                                            filetype[fileSelected - 1]['files'].map((pdfUrl, index) => (
                                                <Worker
                                                    workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
                                                >
                                                    {fileRefresh && (
                                                        <Viewer width={'100%'} fileUrl={pdfUrl.url} onError={onError} />
                                                    )}
                                                </Worker>
                                            ))}
                                    </Box>
                                </Box>

                            </Grid >
                            <Grid item xl={4} lg={4}>
                                <Text pl={4} className={classes.IdentifiedFieldsText}>Identified Fields</Text>

                                <Box height={'420px'} pl={4} pt={3} pr={3} gap={2.5} display={'flex'} flexDirection={'column'} alignContent={'center'}>
                                    {
                                        data[fileSelected - 1].slug == "copy_of_void_cheque" &&
                                        <CopyVoidChequeFields copyVoidChequeFields={copyVoidChequeFields} changeHandler={changeHandlerForCopyVoidChequeFields}></CopyVoidChequeFields>
                                    }
                                    {
                                        data[fileSelected - 1].slug == "work_authorization" &&
                                        <WorkAuthorizationFields workAuthorizationFields={workAuthorizationFields} changeHandler={changeHandlerForWorkAuthorizationFields} Date={Date} dateChange={dateChangeWorkAuthorization}></WorkAuthorizationFields>

                                    }
                                    {
                                        data[fileSelected - 1].slug == "passport" &&
                                        <PassPortFields passportFields={passportFields} changeHandler={changeHandlerForPassPortFields} Date={Date} dateChange={dateChangePassport}></PassPortFields>
                                    }
                                    {
                                        data[fileSelected - 1].slug == "others" &&
                                        <OtherFields otherFields={otherFields} changeHandler={changeHandlerForOtherFields}></OtherFields>
                                    }
                                    {
                                        data[fileSelected - 1].slug == "educational_documents" &&
                                        <EducationalDocumentFields educationalDocumentFields={educationalDocumentFields} changeHandler={changeHandlerForEducationalDocumentFields} Date={Date} dateChange={dateChangeEducationalDocument}></EducationalDocumentFields>
                                    }
                                    {
                                        data[fileSelected - 1].slug == "i_94" &&
                                        <I94Fields i94Fields={i94Fields} changeHandler={changeHandlerForI94Fields} Date={Date} dateChange={dateChangeI94}></I94Fields>
                                    }
                                    {
                                        data[fileSelected - 1].slug == "driving_license" &&
                                        <DrivingLicenseFields countryList={countryList} stateList={stateList} drivingLicenseFields={drivingLicenseFields} changeHandler={changeHandlerForDrivingLicenseFields}></DrivingLicenseFields>
                                    }
                                    {
                                        (data[fileSelected - 1].slug == "counter_signed_offer_letter" || data[fileSelected - 1].slug == "i_20" || data[fileSelected - 1].slug == "signed_ssn") &&
                                        <div className={classes.EmptyData}>
                                            <img width={'196px'} height={'190px'} src={onBoradEmptyData} alt="onBoradEmptyData"></img>
                                            <Text className={classes.EmptyDataExtract}>Seems Like There Is No Data Extract.</Text>
                                        </div>
                                    }
                                </Box>
                                <Box height={'100px'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} mt={3} mr={3} ml={3}>
                                    <Button className={classes.BackButton} onClick={handleClickBackFile}>Back</Button>
                                    <Button className={classes.ContinueButton} onClick={handleClickShowFile}>Continue</Button>
                                </Box>
                            </Grid>
                        </Grid >}
                </>
            }
            {
                mainStep == 1 && <OnboardEmployeeForm i9={i9} setI9={setI9} w4={w4} setW4={setW4} setI9DocumentId={setI9DocumentId} setW4DocumentId={setW4DocumentId} setMainStep={setMainStep} />
            }
            {
                mainStep == 2 && <EmergencyContactInformation ocrData={ocrData} i9DocumentId={i9DocumentId} w4DocumentId={w4DocumentId} setMainStep={setMainStep} />
            }
        </div >
    )
}

export default OnboardEmployeeUpload;