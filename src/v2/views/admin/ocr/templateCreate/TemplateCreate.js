import React, { useState, useEffect, useRef } from "react";
import { Box, Divider, Grid, MenuItem, Stack, Step, Stepper, Slide, Checkbox, Skeleton, } from "@mui/material";
import LocalStorage from '../../../../utils/LocalStorage';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import OCRstyles from "../OCRstyles";
import Text from '../../../../components/customText/Text';
import { styled } from "@mui/material/styles";
import { ReactComponent as InfoIcon } from '../../../../assets/svg/info_svg.svg';
import Input from '../../../../components/input/Input';
import Datepicker from '../../../../components/datePicker/Date';
import OCRApi from '../../../../apis/admin/ocr/OCR';
import { AddEmployeeStepper, BrownMnColorlibStepLabel, BrownMnCustomisedConnector } from '../../../../theme';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from "../../../../components/customButton/Button";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import deleteIcon from '../../../../assets/svg/deleteSvg.svg';
import editIcon from '../../../../assets/svg/editThickGray.svg';
import checkIcon from '../../../../assets/svg/checkedCircle.svg';
import moment from "moment";
import { ReactComponent as CheckedIcon } from '../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as CheckedDisabled } from '../../../../assets/svg/CheckedDisabled.svg';
import { ReactComponent as CheckedBorderIconDisabled } from '../../../../assets/svg/CheckboxDisabled.svg';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from "../../../../utils/utils";
import { isValid, validate_charWithSpace, validate_emptyField } from "../../../../components/Validation";
import CommonApi from "../../../../apis/CommonApi";
import SearchSelect from "../../../../components/selectField/SearchSelect";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../../components/customButton/LoadingButton";


const mainStepsList = ['Add Employee Name', 'Add Dates & Hours', 'Add Anchor Points'];
// eslint-disable-next-line
const testIMGURL = "https://ocr.codetru.org/media/image/865eaf0d-7a42-4cac-b177-4c96b60da3d3.jpg/";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
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

function TemplateCreate(props) {

    const classes = OCRstyles();
    const imgRef = useRef(null);
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [areaPoints, setAreaPoints] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState({});
    const [clients, setClients] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [dateLoading, setDateLoading] = useState(null);
    const [viewArea, setViewArea] = useState(null);
    const [state, setState] = useState({
        cropData: {}
    });
    const [dtSet, setDtSet] = useState({
        date: null,
        time: null
    });
    const [anchorPoints, setAnchorPoints] = useState({
        startDateAnchor: null,
        endDateAnchor: null,
        hoursAnchor: null,
    })

    useEffect(() => {
        getClientsDropdown();
    }, [])

    /**
 * param Expected : "https://ocr.codetru.org/media/image/f411a34d-300d-4ece-8bf1-3829caa6a921.jpg"
 * 
 * returns: f411a34d-300d-4ece-8bf1-3829caa6a921
 * */
    // const handleId = (param) => {
    //     const myArray = param.split("/");
    //     return myArray[myArray.length - 1].split(".")[0];
    // }

    const [apiState, setApiState] = useState({
        id: props.ocrfile.id,
        url: props.ocrfile.url ? props.ocrfile.url : "",
        tenant_id: LocalStorage.getUserData().tenant_id,
        template_name: "",
        client_id: "",
        consultant_name: {
            text: "",
            points: [],
            view: { top: '', left: "", height: "", width: "" }
        },
        timesheet_data: [
            {
                date: {
                    text: "",
                    points: [],
                    view: { top: '', left: "", height: "", width: "" }
                },
                hours: {
                    text: "",
                    points: [],
                    view: { top: '', left: "", height: "", width: "" }
                }
            }
        ],
        anchorPoints: {
            startDateAnchor: {
                text: "",
                points: [],
                view: { top: '', left: "", height: "", width: "" }
            },
            endDateAnchor: {
                text: "",
                points: [],
                view: { top: '', left: "", height: "", width: "" }
            },
            hoursAnchor: {
                text: "",
                points: [],
                view: { top: '', left: "", height: "", width: "" }
            }
        }
    })

    const [selectedArea, setSelectedArea] = useState(null);

    // main function for cropped areas fetching
    const endCrop = (e) => {
        var img = new Image();
        img.src = props.ocrfile.url;
        img.onload = () => {
            var renderedImg = imgRef.current;
            var rect = renderedImg.getBoundingClientRect();
            var data = { scaleX: rect.width / img.naturalWidth, scaleY: rect.height / img.naturalHeight };
            var elem = document.querySelector('.ReactCrop__crop-selection');
            var elemRect = elem.getBoundingClientRect();
            let startPos = {
                x: elemRect.left - rect.left,
                y: elemRect.top - rect.top
            };
            let currentPos = {
                x: startPos.x + elemRect.width,
                y: startPos.y + elemRect.height
            }
            var points = [
                [startPos.x / data.scaleX, startPos.y / data.scaleY],
                [currentPos.x / data.scaleX, startPos.y / data.scaleY],
                [currentPos.x / data.scaleX, currentPos.y / data.scaleY],
                [startPos.x / data.scaleX, currentPos.y / data.scaleY]
            ];
            var viewObj = { top: startPos.y, left: startPos.x, height: currentPos.y - startPos.y, width: currentPos.x - startPos.x }
            if (step === 1 || step === 2) {
                setViewArea(viewObj);
                setAreaPoints(points);
                setSelectedArea({ t: currentPos.y, l: currentPos.x });
            }
            if (step === 0) {

                apiState.consultant_name.view = viewObj;
                setApiState({ ...apiState });
                getAreaText(points, props.ocrfile.url);
            }
        };
    };

    const handleChange = (e, index) => {
        apiState.timesheet_data[index].hours.text = hoursValidationHandle(e.target.value);
        setApiState({ ...apiState });
    }

    const popupOnchange = (e) => {
        setApiState({ ...apiState, [e.target.name]: e.target.value })
        handleValidations(e);
    }

    const handleChangeDate = (e, index) => {
        apiState.timesheet_data[index].date.text = moment(e.$d).format(dateFormat());
        setApiState({ ...apiState });
    };

    const handleOnChange = (e) => {
        setState((prev) => ({ ...prev, cropData: e }));
    }

    const handleMenuClick = (param, name) => {
        dtSet[name] = param;
        setDtSet({ ...dtSet });
        setDateLoading(apiState.timesheet_data.length - 1);
        getAreaText(areaPoints, props.ocrfile.url, param, name);

        setState({ ...state, cropData: {} });
        setSelectedArea(null);

    }

    const handleMenu2Click = (name) => {

        getAreaText(areaPoints, props.ocrfile.url, name);

        setState({ ...state, cropData: {} });
        setSelectedArea(null);
    }

    /***************       Api functions starts here         ******************/

    const getAreaText = (data, url, param, name) => {
        let obj = {
            url: url,
            area_points: data,
        };
        setLoading(true);
        OCRApi.getOCRAreaText(obj, LocalStorage.getAccessToken()).then((response) => {
            if (response.data.status) {
                if (step == 0) {
                    apiState.consultant_name.text = response.data.text;
                    apiState.consultant_name.points = response.data.points;
                    setApiState(apiState);
                    setLoading(false);
                }
                if (step == 1) {
                    if (dtSet.date != null && dtSet.time == null) {
                        if (moment(response.data.text).format(dateFormat()) !== "Invalid date") {
                            apiState.timesheet_data[apiState.timesheet_data.length - 1].date.text = response.data.text;
                            apiState.timesheet_data[apiState.timesheet_data.length - 1].date.points = response.data.points;
                            apiState.timesheet_data[apiState.timesheet_data.length - 1].date.view = viewArea;
                            setApiState(apiState);
                            dtSet[name] = param;
                            setDtSet({ ...dtSet });
                        } else {
                            dtSet[name] = null;
                            setDtSet({ ...dtSet });
                            addWarningMsg("Please crop proper date");
                        }
                        setViewArea(null);
                        setLoading(false);

                    } else if (dtSet.date != null && dtSet.time != null) {
                        apiState.timesheet_data[apiState.timesheet_data.length - 1].hours.text = response.data.text;
                        apiState.timesheet_data[apiState.timesheet_data.length - 1].hours.points = response.data.points;
                        apiState.timesheet_data[apiState.timesheet_data.length - 1].hours.view = viewArea;
                        setApiState(apiState);
                        dtSet[name] = param;
                        setDtSet({ ...dtSet });
                    }
                    setLoading(false);
                    setViewArea(null);
                    if (dtSet.date !== null && dtSet.time !== null) {
                        dtSet.date = null;
                        dtSet.time = null;
                        setDtSet(dtSet);
                    }
                }
                if (step == 2) {
                    if (response.data.text !== "") {
                        anchorPoints[param] = true;
                        setAnchorPoints({ ...anchorPoints });
                        apiState.anchorPoints[param].text = response.data.text;
                        apiState.anchorPoints[param].points = response.data.points;
                        apiState.anchorPoints[param].view = viewArea;
                        setApiState({ ...apiState });
                    } else {
                        addErrorMsg("Please select proper content area");
                    }
                    setViewArea(null);
                    setLoading(false);
                }
            } else {
                setViewArea(null);
                setLoading(false);
                addErrorMsg("Please select proper area");
            }
        });
    }

    const getClientsDropdown = () => {
        CommonApi.clientsEndClientsDropdown("client", '').then((response) => {
            if (response.data.statusCode == 1003) {
                setClients(response.data.data);
            }
        });
    };

    const storeTemplate = (param) => {
        setSubmit(true);
        OCRApi.templateStore(param, LocalStorage.getAccessToken()).then((response) => {
            if (response.status === 200) {
                setOpen(false);
                setSubmit(false);
                navigate('/timesheet');
                addSuccessMsg(response.data.message);
            } else {
                setSubmit(false);
                addErrorMsg(response.data.message);
            }
        })
    }

    /***************       Ends here         ******************/

    const handleStep = (param) => {
        // console.log("final state", apiState);
        state.cropData = {};
        setState(state);
        setStep(param);
        setEdit(false);
    }

    const handleAddPair = () => {
        let newArray = apiState.timesheet_data;
        var obj = { date: { text: "", points: [] }, hours: { text: "", points: [] } };
        newArray.push(obj);
        setApiState({ ...apiState, timesheet_data: newArray });
    }

    const deleteDateAndTime = (index) => {
        let newArray = apiState.timesheet_data;
        newArray.splice(index, 1);
        setApiState({ ...apiState, timesheet_data: newArray });
        addSuccessMsg("Date and time deleted successfully");
    }

    const [anchorPointsEdit, setAnchorEditPoints] = useState({
        text: "",
        points: []
    });
    const handleCheckBox = (e) => {
        if (e.target.checked && anchorPointsEdit != null) {
            apiState.anchorPoints[e.target.name].text = anchorPointsEdit.text;
            apiState.anchorPoints[e.target.name].points = anchorPointsEdit.points;
            setApiState({ ...apiState });
            setAnchorEditPoints({
                ...anchorPointsEdit,
                text: "",
                points: []
            });
        } else {
            anchorPointsEdit.text = apiState.anchorPoints[e.target.name].text;
            anchorPointsEdit.points = apiState.anchorPoints[e.target.name].points;
            setAnchorEditPoints({ ...anchorPointsEdit });
            apiState.anchorPoints[e.target.name].text = '';
            apiState.anchorPoints[e.target.name].points = '';
            setApiState({ ...apiState });
        }
    }

    /*** Final Create template submit func  **/
    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            storeTemplate(apiState);
        } else {
            let s = { error };
            s = errors
            setError(s);
        }
    }

    const handleEditSave = () => {
        var fieldsCheck = findEmpty(apiState);
        if (fieldsCheck) {
            setEditIndex(null);
        } else {
            addWarningMsg("Please fill all data")
        }
    }

    const findEmpty = (param) => {
        return (param.timesheet_data.some(item => item.date.text == "" || item.hours.text == "")) ? false : true;
    }

    const hoursValidationHandle = (value) => {

        let input = value.replace(/\D/g, "").substring(0, 5);
        const first = input.substring(0, 2);
        const second = input.substring(2, 4);
        if (input.length > 2) {
            var mm = parseInt(second);
            if (mm > 59) {
                if (first < 23) {
                    var sec = second - 60;
                    var fOne = parseInt(first) + 1;
                    return `0${fOne}:${sec}`;
                } else {
                    return `${first}:${59}`;
                }
            } else {
                return `${first}:${second}`;
            }
        } else if (input.length >= 0) {
            var hh = parseInt(input);
            if (hh > 23) {
                return "23";
            } else {
                return input;
            }
        }
    }

    const validateAll = () => {
        let { template_name, client_id } = apiState;
        let errors = {};
        errors.template_name = validate_emptyField(template_name);
        errors.client_id = validate_emptyField(client_id);
        return errors;
    };

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "template_name":
                err.template_name = validate_charWithSpace(input.value);
                break;
            case "client_id":
                err.client_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const renderMenu = () => {
        // Check if there is a selected area before rendering the menu
        if (!selectedArea) return null;

        // Calculate the position of the menu based on the selected area
        const menuStyle = {
            position: 'absolute',
            top: `${selectedArea.t}px`,
            left: `${selectedArea.l}px`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
        };

        return (
            <>
                {
                    step === 1 && selectedArea !== null ?
                        <div className="your-menu-class" style={menuStyle}>
                            {dtSet.date == null && <MenuItem onClick={() => { handleMenuClick(1, 'date') }} sx={{ padding: '0px' }}>Add Date</MenuItem>}
                            <Divider />
                            {dtSet.time == null && <MenuItem onClick={() => { handleMenuClick(2, 'time') }} sx={{ padding: '0px' }}>Add Hours</MenuItem>}
                        </div> :
                        step === 2 && selectedArea !== null ?
                            <div className="your-menu-class" style={menuStyle}>
                                {apiState.anchorPoints.startDateAnchor.text == "" && <MenuItem onClick={() => { handleMenu2Click('startDateAnchor') }} sx={{ padding: '0px' }}>Set Date Anchor Start point</MenuItem>}
                                <Divider />
                                {apiState.anchorPoints.endDateAnchor.text == "" && <MenuItem onClick={() => { handleMenu2Click('endDateAnchor') }} sx={{ padding: '0px' }}>Set Date Anchor End point</MenuItem>}
                                <Divider />
                                {apiState.anchorPoints.hoursAnchor.text == "" && <MenuItem onClick={() => { handleMenu2Click('hoursAnchor') }} sx={{ padding: '0px' }}>Set Hour Anchor point</MenuItem>}
                            </div> : ''
                }
            </>
        );
    };

    // const dumPoints = [
    //     [
    //         465.24408303711857,
    //         214.25810670089362
    //     ],
    //     [
    //         916.8420372604251,
    //         214.25810670089362
    //     ],
    //     [
    //         916.8420372604251,
    //         282.2765532726059
    //     ],
    //     [
    //         465.24408303711857,
    //         282.2765532726059
    //     ]
    // ]

    return (
        <Box className={classes.templateMain}>
            <Box className={classes.templateMainBox}>
                <Box className={classes.templateSecBox}>
                    <Stepper activeStep={step} connector={<BrownMnCustomisedConnector />}>
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
                    <Grid item lg={7} md={7}>
                        <Box className={classes.middlePrimaryBox}>

                            <Box px={2} mb={2} className={classes.middleSecBox}>
                                <InfoIcon />
                                <Text className={classes.infoText}>
                                    {step == 0 ? 'Please click and drag on employee name to continue' : step == 1 ? 'Please click and drag to select date and hours to create a pair' : 'Please set anchor points of both date and hours to fetch data accurately.'}
                                </Text>
                            </Box>

                            <Box className={classes.cropBox}>
                                <ReactCrop crop={state.cropData} onChange={(e) => { handleOnChange(e) }} onDragEnd={(e) => endCrop(e)}>
                                    <img src={props.ocrfile.url} alt={"ocr"} ref={imgRef} />
                                    {apiState.consultant_name.text !== "" && (
                                        <div className={classes.cropOverlay}
                                            style={{
                                                top: apiState.consultant_name.view.top,
                                                left: apiState.consultant_name.view.left,
                                                width: apiState.consultant_name.view.width,
                                                height: apiState.consultant_name.view.height,
                                            }}
                                        ></div>
                                    )}
                                    {
                                        apiState.timesheet_data.map((item, ind) => (
                                            <>
                                                <>
                                                    {item.date && item.date.text && item.date.text !== "" && (
                                                        <div className={classes.cropOverlay}
                                                            style={{
                                                                top: item.date.view.top,
                                                                left: item.date.view.left,
                                                                width: item.date.view.width,
                                                                height: item.date.view.height,
                                                            }}
                                                        ></div>
                                                    )}
                                                </>
                                                <>
                                                    {item.hours && item.hours.text && item.hours.text !== "" && (
                                                        <div className={classes.cropOverlay}
                                                            style={{
                                                                top: item.hours.view.top,
                                                                left: item.hours.view.left,
                                                                width: item.hours.view.width,
                                                                height: item.hours.view.height,
                                                            }}
                                                        ></div>
                                                    )}
                                                </>
                                            </>
                                        ))
                                    }

                                    {apiState.anchorPoints.startDateAnchor.text !== "" && (
                                        <div className={classes.cropOverlay}
                                            style={{
                                                top: apiState.anchorPoints.startDateAnchor.view.top,
                                                left: apiState.anchorPoints.startDateAnchor.view.left,
                                                width: apiState.anchorPoints.startDateAnchor.view.width,
                                                height: apiState.anchorPoints.startDateAnchor.view.height,
                                            }}
                                        ></div>
                                    )}
                                    {apiState.anchorPoints.endDateAnchor.text !== "" && (
                                        <div className={classes.cropOverlay}
                                            style={{
                                                top: apiState.anchorPoints.endDateAnchor.view.top,
                                                left: apiState.anchorPoints.endDateAnchor.view.left,
                                                width: apiState.anchorPoints.endDateAnchor.view.width,
                                                height: apiState.anchorPoints.endDateAnchor.view.height,
                                            }}
                                        ></div>
                                    )}
                                    {apiState.anchorPoints.hoursAnchor.text !== "" && (
                                        <div className={classes.cropOverlay}
                                            style={{
                                                top: apiState.anchorPoints.hoursAnchor.view.top,
                                                left: apiState.anchorPoints.hoursAnchor.view.left,
                                                width: apiState.anchorPoints.hoursAnchor.view.width,
                                                height: apiState.anchorPoints.hoursAnchor.view.height,
                                            }}
                                        ></div>
                                    )}
                                </ReactCrop>
                                {renderMenu()}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item lg={5} md={5} sm={12} xs={12}>
                        <Box className={classes.templateRightBox}>
                            <Box className={classes.templateRightSecBox}>
                                <Box p={1}><Text className={classes.sideboxtitle}>{step == 2 ? "Set Anchor Points" : "Captured Data"}</Text></Box>
                                <Box p={1}>
                                    {
                                        step == 0 &&
                                        <>
                                            {
                                                loading ?
                                                    <>
                                                        <Skeleton variant="rounded" height={45} />
                                                    </>
                                                    :
                                                    <Box py={1}>
                                                        <Input
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                name: 'employee_name',
                                                                value: apiState.consultant_name.text,
                                                                type: 'text',
                                                                inputProps: {
                                                                    maxLength: 250
                                                                }
                                                                // disabled: true
                                                            }}
                                                            // handleChange={handleChange}
                                                            clientInput
                                                            labelText={<Text largeLabel>Employee Name</Text>}
                                                        />

                                                    </Box>
                                            }
                                        </>
                                    }
                                    {
                                        step == 1 &&
                                        <>
                                            {
                                                apiState.timesheet_data.map((item, ind) => (
                                                    <Stack direction="row" my={2} gap={3}>
                                                        <Grid item md={edit ? 5 : 6} sm={12}>
                                                            {
                                                                loading && dateLoading == ind && dtSet.date != null && dtSet.time == null ?
                                                                    <>
                                                                        <Skeleton variant="rounded" height={45} />
                                                                    </>
                                                                    :
                                                                    <Datepicker
                                                                        labelText="Date"
                                                                        name="date"
                                                                        value={item.date.text}
                                                                        disabled={editIndex != ind}
                                                                        // minDate={moment().format(dateFormat())}
                                                                        onChange={(e) => handleChangeDate(e.$d, ind)}
                                                                    />
                                                            }
                                                        </Grid>
                                                        <Grid item md={edit ? 5 : 6} sm={12}>
                                                            {
                                                                loading && dateLoading == ind && dtSet.date != null && dtSet.time != null ?
                                                                    <>
                                                                        <Skeleton variant="rounded" height={45} />
                                                                    </>
                                                                    :
                                                                    <Input
                                                                        formControlProps={{
                                                                            fullWidth: true
                                                                        }}
                                                                        inputProps={{
                                                                            name: 'hours',
                                                                            value: item.hours.text,
                                                                            type: 'text',
                                                                            inputProps: {
                                                                                maxLength: 5
                                                                            },
                                                                            disabled: editIndex != ind
                                                                        }}
                                                                        handleChange={(e) => { handleChange(e, ind) }}
                                                                        clientInput
                                                                        labelText={<Text largeLabel>Hours</Text>}
                                                                    />
                                                            }
                                                        </Grid>
                                                        {edit &&
                                                            <Grid container item md={2} sm={12} className={classes.actionIconGrid}>
                                                                {
                                                                    editIndex != ind ?
                                                                        <>
                                                                            <img height='22px' src={editIcon} alt="editIcon" className={classes.iconsCur} onClick={() => { setEditIndex(ind) }} />
                                                                            {apiState.timesheet_data.length > 1 && <img src={deleteIcon} alt="deleteIcon" onClick={() => { deleteDateAndTime(ind) }} className={classes.iconsCur} />}
                                                                        </> :
                                                                        <>
                                                                            <img className={classes.saveEditIcon} src={checkIcon} alt="checkIcon" onClick={() => { handleEditSave() }} />
                                                                        </>
                                                                }
                                                            </Grid>
                                                        }
                                                    </Stack>
                                                ))
                                            }
                                            {
                                                !edit ?
                                                    <>
                                                        {
                                                            (apiState.timesheet_data[apiState.timesheet_data.length - 1].hours.text != '' && apiState.timesheet_data[apiState.timesheet_data.length - 1].date.text != '') ?
                                                                <Button onClick={() => { handleAddPair() }} startIcon={<AddCircleOutlineIcon />} addNewFull >Add Pair</Button> :
                                                                <Button disable startIcon={<AddCircleOutlineIcon />} disableAddNewFull >Add Pair</Button>
                                                        }
                                                    </>

                                                    : ''
                                            }
                                        </>
                                    }
                                    {
                                        step == 2 &&
                                        <Grid container item md={12} xs={12}>
                                            {
                                                loading && anchorPoints.startDateAnchor == null && anchorPoints.endDateAnchor == null && anchorPoints.hoursAnchor == null ?
                                                    <Skeleton variant="rounded" height={55} width={'100%'} sx={{ marginTop: '24px !important' }} />
                                                    :
                                                    <Grid item md={12} xs={12} mt={'3px !important'} className={apiState.anchorPoints.startDateAnchor.text !== "" ? classes.activeBorderGrid : classes.borderGrid}>
                                                        {apiState.anchorPoints.startDateAnchor.text !== "" && <img className={classes.checkIcons} src={checkIcon} alt="checkIcon" />}
                                                        <Text largeGrey16 ml={-1}>Date Anchor Start point</Text>
                                                    </Grid>
                                            }
                                            {
                                                loading && anchorPoints.startDateAnchor !== null && anchorPoints.endDateAnchor == null && anchorPoints.hoursAnchor == null ?
                                                    <Skeleton variant="rounded" height={50} width={'100%'} sx={{ marginTop: '24px !important' }} />
                                                    :
                                                    <Grid item md={12} xs={12} className={apiState.anchorPoints.endDateAnchor.text !== "" ? classes.activeBorderGrid : classes.borderGrid}>
                                                        {apiState.anchorPoints.endDateAnchor.text !== "" && <img className={classes.checkIcons} src={checkIcon} alt="checkIcon" />}
                                                        <Text largeGrey16 ml={-1}>Date Anchor End point</Text>
                                                    </Grid>
                                            }
                                            {
                                                loading && anchorPoints.startDateAnchor !== null && anchorPoints.endDateAnchor !== null && anchorPoints.hoursAnchor == null ?
                                                    <Skeleton variant="rounded" height={50} width={'100%'} sx={{ marginTop: '24px !important' }} />
                                                    :
                                                    <Grid item md={12} xs={12} className={apiState.anchorPoints.hoursAnchor.text !== "" ? classes.activeBorderGrid : classes.borderGrid}>
                                                        {apiState.anchorPoints.hoursAnchor.text !== "" && <img className={classes.checkIcons} src={checkIcon} alt="checkIcon" />}
                                                        <Text largeGrey16 ml={-1}>Hour Anchor point</Text>
                                                    </Grid>
                                            }
                                        </Grid>
                                    }
                                    {
                                        step == 3 &&
                                        <Box className={classes.finalStepBox}>
                                            <Box py={1} >
                                                <Input
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: 'employee_name',
                                                        value: apiState.consultant_name ? apiState.consultant_name.text ? apiState.consultant_name.text : "" : "",
                                                        type: 'text',
                                                        inputProps: {
                                                            maxLength: 250
                                                        },
                                                        disabled: true
                                                    }}
                                                    clientInput
                                                    labelText={<Text largeLabel>Employee Name</Text>}
                                                />

                                            </Box>

                                            {
                                                apiState.timesheet_data.map((item, ind) => (
                                                    <Stack direction="row" my={2} gap={3}>
                                                        <Grid item md={6} sm={12}>
                                                            <Datepicker
                                                                labelText="Date"
                                                                name="date"
                                                                value={item.date ? item.date.text ? item.date.text : "" : ""}
                                                                disabled={true}
                                                            />
                                                        </Grid>
                                                        <Grid item md={6} sm={12}>
                                                            <Input
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    name: 'hours',
                                                                    value: item.hours ? item.hours.text ? item.hours.text : "" : "",
                                                                    type: 'text',
                                                                    inputProps: {
                                                                        maxLength: 5
                                                                    },
                                                                    disabled: true
                                                                }}
                                                                clientInput
                                                                labelText={<Text largeLabel>Hours</Text>}
                                                            />
                                                        </Grid>
                                                    </Stack>
                                                ))
                                            }

                                            <Grid item md={12} mt={'3px !important'} className={classes.borderGrid}>
                                                <Checkbox checked={apiState.anchorPoints.startDateAnchor.text !== "" ? true : false} name="startDateAnchor" onChange={(e) => { handleCheckBox(e) }}
                                                    className={classes.checkBox}
                                                    icon={apiState.anchorPoints.startDateAnchor.text !== "" ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                                                    checkedIcon={apiState.anchorPoints.startDateAnchor.text === "" ? <CheckedDisabled /> : <CheckedIcon />}
                                                />
                                                <Text largeGrey16 ml={-1}>Date Anchor Start point</Text>
                                            </Grid>
                                            <Grid item md={12} className={classes.borderGrid}>
                                                <Checkbox checked={apiState.anchorPoints.endDateAnchor.text !== "" ? true : false} name="endDateAnchor" onChange={(e) => { handleCheckBox(e) }} className={classes.checkBox}
                                                    icon={apiState.anchorPoints.endDateAnchor.text !== "" ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                                                    checkedIcon={apiState.anchorPoints.endDateAnchor.text === "" ? <CheckedDisabled /> : <CheckedIcon />}
                                                />
                                                <Text largeGrey16 ml={-1}>Date Anchor End point</Text>
                                            </Grid>
                                            <Grid item md={12} className={classes.borderGrid}>
                                                <Checkbox checked={apiState.anchorPoints.hoursAnchor.text !== "" ? true : false} name="hoursAnchor" onChange={(e) => { handleCheckBox(e) }} className={classes.checkBox}
                                                    icon={apiState.anchorPoints.hoursAnchor.text !== "" ? <CheckedBorderIconDisabled /> : <CheckBorderIcon />}
                                                    checkedIcon={apiState.anchorPoints.hoursAnchor.text === "" ? <CheckedDisabled /> : <CheckedIcon />}
                                                />
                                                <Text largeGrey16 ml={-1}>Hour Anchor point</Text>
                                            </Grid>
                                        </Box>
                                    }

                                </Box>
                                {
                                    apiState.consultant_name.text !== '' && apiState.consultant_name.text !== null && apiState.consultant_name.text !== undefined && step == 0 &&
                                    <Grid item md={12} className={classes.nextBtnGrid}>
                                        <Button blueNext onClick={() => { handleStep(1) }}>Next</Button>
                                    </Grid>
                                }
                                {
                                    (step == 1 && (apiState.timesheet_data[apiState.timesheet_data.length - 1].hours.text != '' && apiState.timesheet_data[apiState.timesheet_data.length - 1].date.text != '')) &&
                                    <Grid container item md={12} className={classes.buttonsGrids}>
                                        <Button blueBorderOutlined onClick={() => { edit ? setEdit(false) : handleStep(0) }}>Back</Button>
                                        {
                                            edit ?
                                                <Button blueNext onClick={() => { handleStep(2) }}>Save</Button>
                                                :
                                                <Button blueNext onClick={() => { setEdit(true) }}>Next</Button>
                                        }

                                    </Grid>
                                }
                                {
                                    step == 2 &&
                                    <Grid container item md={12} pt={'30%'} className={classes.buttonsGrids}>
                                        <Button blueBorderOutlined onClick={() => { handleStep(1) }}>Back</Button>
                                        {(apiState.anchorPoints.startDateAnchor.text !== "" && apiState.anchorPoints.endDateAnchor.text !== "" && apiState.anchorPoints.hoursAnchor.text !== "") && <Button blueNext onClick={() => { handleStep(3) }}>Preview</Button>}
                                    </Grid>
                                }
                                {
                                    step == 3 &&
                                    <Grid container item md={12} pt={'0%'} className={classes.buttonsGrids}>
                                        <Button blueBorderOutlined onClick={() => { handleStep(2) }}>Back</Button>
                                        <Button blueNext onClick={() => { setOpen(true); }}>Create Template</Button>
                                    </Grid>
                                }
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <BootstrapDialog
                TransitionComponent={TransitionUp}
                keepMounted
                onClose={() => setOpen(false)}
                open={open}
            >
                <DialogContent sx={{ margin: "25px" }}>
                    <Grid container>
                        <Grid item md={12} sm={12} xs={12}>
                            <Text mediumBoldBlack>Template Name</Text>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box py={3} >
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'template_name',
                                        value: apiState.template_name,
                                        type: 'text',
                                        inputProps: {
                                            maxLength: 250
                                        }
                                    }}
                                    handleChange={popupOnchange}
                                    clientInput
                                    labelText={<Text largeLabel>Template Name</Text>}
                                />
                                {
                                    error.template_name &&
                                    <Text red>{error.template_name ? error.template_name : ''}</Text>
                                }

                            </Box>
                            <Box py={3} >
                                <SearchSelect
                                    name='client_id'
                                    value={apiState.client_id}
                                    onChange={popupOnchange}
                                    options={clients}
                                    labelText={<Text largeLabel>Client</Text>}
                                    scrollTrue
                                />
                                {
                                    error.client_id &&
                                    <Text red>{error.client_id ? error.client_id : ''}</Text>
                                }
                            </Box>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} textAlign={"end"} my={2}>
                            <Button className={classes.cancelBtn} blackCancel onClick={() => { setOpen(false); }}>Cancel</Button>
                            <LoadingButton addButtonmd className={classes.saveBtn} loading={submit} onClick={() => handleSubmit()}>
                                {submit ? "Saving" : 'Save'}
                            </LoadingButton>
                            {/* <Button className={classes.saveBtn} addButtonmd onClick={() => { handleSubmit() }}>Save</Button> */}
                        </Grid>
                    </Grid>
                </DialogContent>
            </BootstrapDialog>

        </Box >
    )
}

export default TemplateCreate;
