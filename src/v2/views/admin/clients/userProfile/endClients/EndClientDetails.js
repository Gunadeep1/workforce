import React, { useState, useEffect, Fragment } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import { Box, Grid, Typography, Skeleton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ClientsAPI from '../../../../../apis/admin/clients/ClientsApi';
import CommonApi from '../../../../../apis/CommonApi';
import Text from '../../../../../components/customText/Text';
import CustomButton from '../../../../../components/customButton/Button';
import LoadingButton from '../../../../../components/customButton/LoadingButton';
import Input from '../../../../../components/input/Input';
// import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import SearchSelect from '../../../../../components/selectField/SearchSelect';

import { addErrorMsg, addSuccessMsg } from '../../../../../utils/utils';
import { isValid, validate_emptyField, validates_Integer, validate_alphaNumeric } from "../../../../../components/Validation";
import LocalStorage from "../../../../../utils/LocalStorage";
// import name from '../../';

// import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import crossIcon from '../../../../../assets/svg/crossIcon.svg';
import ConfirmImg from '../../../../../assets/svg/confirm-BG-img.svg';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "16px",
    },
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));



export default function CompanyDetails() {

    const classes = UserProfileStyles();
    const location = useLocation();
    // const [tab, setTab] = useState(0);
    // const [employee, setEmployee] = useState({}); 
    // eslint-disable-next-line
    // const [employee, setEmployee] = useState({});
    const [action, setAction] = useState("read");
    const [data, setData] = useState({});
    const [formData, setFormData] = useState(
        {
            name: "",
            reference_id: "",
            net_pay_terms_id: "",
            same_as_above: false,
            billing_address: [
                {
                    address_line_one: "",
                    address_line_two: "",
                    city: "",
                    state_id: "",
                    country_id: "",
                    zip_code: ""
                }
            ],
            shipping_address: [
                {
                    address_line_one: "",
                    address_line_two: "",
                    city: "",
                    state_id: "",
                    country_id: "",
                    zip_code: ""
                }
            ],
            documents: [
                {
                    new_document_id: ""
                }
            ]
        }
    );
    // const [payTerms, setPayTerms] = useState([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [getloading, setGetloading] = useState(false);
    const [countriesList, setCountriesList] = useState([]);
    const [statesList, setStatesList] = useState({
        billing_address: [],
        shipping_address: []
    });
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        console.log(data);
        getCountriesList();
        getCompanyDetails();
        // netPayterms();
        // eslint-disable-next-line
    }, []);

    const getCompanyDetails = () => {
        setGetloading(true);
        ClientsAPI.getCompanyDetails("end-client", location.state.data.id).then((response) => {
            setTimeout(() => {
                setGetloading(false)
                if (response.data.statusCode == 1003) {
                    setFormData(response.data.data);
                    setData(response.data.data);
                    getStatesList(response.data.data.billing_address[0].country_id, "billing_address");
                    if (!response.data.data.same_as_above) {
                        if (response.data.data.shipping_address[0].country_id) {
                            getStatesList(response.data.data.shipping_address[0].country_id, "shipping_address");
                        }
                    }
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }
    // const netPayterms = () => {
    //     CommonApi.getNetPayTermsList(LocalStorage.uid(), LocalStorage.getAccessToken()).then((response) => {
    //         if (response.data.statusCode == 1003) {
    //             setPayTerms(response.data.data);
    //             console.log(response.data.data, "data");
    //         }
    //     });
    // };

    const getCountriesList = () => {
        let search = "";
        CommonApi.getCountryList(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setCountriesList(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const updateCompanyDetails = () => {
        let data = { ...formData, request_id: LocalStorage.uid() };
        setLoading(true)
        ClientsAPI.updateCompanyDetails("end-client", location.state.data.id, data).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setAction("read");
                    addSuccessMsg(response.data.message);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const handleChange = (e) => {

        if (e.target.name === "same_as_above") {

            let shippingAddress = [
                {
                    address_line_one: "",
                    address_line_two: "",
                    city: "",
                    state_id: "",
                    country_id: "",
                    zip_code: ""
                }
            ];
            let shippingErrors = error;
            shippingErrors.shipping_address_line_one = "";
            shippingErrors.shipping_address_line_two = "";
            shippingErrors.shipping_address_city = "";
            shippingErrors.shipping_address_state_id = "";
            shippingErrors.shipping_address_country_id = "";
            shippingErrors.shipping_address_zip_code = "";

            setError({ ...error })

            setFormData({ ...formData, [e.target.name]: e.target.checked, shipping_address: shippingAddress });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
        handleValidations(e);
    };
    const handleChangeAddress = (e, target) => {
        let arr = formData[target];
        arr[0] = { ...arr[0], [e.target.name]: e.target.value };
        setFormData({ ...formData, [target]: arr });
        if (e.target.name === "country_id") {
            getStatesList(e.target.value, target);
            arr[0] = { ...arr[0], 'state_id': '' };
            // setFormData({ ...formData, [target]: arr }, handleValidationsAddress(e, target));           
        }
        handleValidationsAddress(e, target)
    }

    const handleValidations = (e) => {
        let input = e.target;
        let err = error;
        switch (input.name || input.tagName) {
            case "name":
                err.name = validate_emptyField(input.value);
                break;
            case "reference_id":
                err.reference_id = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setError(err);
    }

    const handleValidationsAddress = (e, target) => {
        let input = e.target;
        let err = error;
        if (target === "billing_address") {
            switch (input.name || input.tagName) {
                case "address_line_one":
                    err.address_line_one = validate_emptyField(input.value);
                    break;
                case "address_line_two":
                    err.address_line_two = validate_emptyField(input.value);
                    break;
                case "city":
                    err.city = validate_alphaNumeric(input.value);
                    break;
                case "state_id":
                    err.state_id = validate_emptyField(input.value);
                    break;
                case "country_id":
                    err.country_id = validate_emptyField(input.value);
                    break;
                case "zip_code":
                    err.zip_code = validates_Integer(input.value);

                    if (validates_Integer(input.value) === "") {
                        if (formData.billing_address[0].country_id == 101) {
                            if (input.value.length < 6) {
                                err.zip_code = "Enter Valid Pin code";
                            } else {
                                err.zip_code = "";
                            }
                        } else {
                            if (input.value.length < 5) {
                                err.zip_code = "Enter Valid Zipcode";
                            } else {
                                err.zip_code = "";
                            }
                        }

                    }
                    break;
                default:
                    break;
            }
        }
        setError(err);
    }

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            console.log();
            updateCompanyDetails();
        } else {
            console.log(errors);
            setError(errors);
        }
    }

    const validateAll = () => {
        let { name, reference_id, billing_address, } = formData;
        let errors = {};
        errors.name = validate_emptyField(name);
        errors.reference_id = validate_emptyField(reference_id);
        errors.billing_address_line_one = validate_emptyField(billing_address[0].address_line_one);
        // errors.billing_address_line_two = validate_emptyField(billing_address[0].address_line_two);
        errors.city = validate_alphaNumeric(billing_address[0].city);
        errors.state_id = validate_emptyField(billing_address[0].state_id);
        errors.country_id = validate_emptyField(billing_address[0].country_id);
        errors.zip_code = validates_Integer(billing_address[0].zip_code);

        if (errors.zip_code === "") {
            if (billing_address[0].country_id == 101) {
                if (billing_address[0].zip_code.length < 6) {
                    errors.zip_code = "Enter Valid Pin code";
                } else {
                    errors.zip_code = "";
                }
            } else {
                if (billing_address[0].zip_code.length < 5) {
                    errors.zip_code = "Enter Valid Zip code";
                } else {
                    errors.zip_code = "";
                }
            }

        }

        return errors;
    };

    const getStatesList = (country_id, target) => {
        CommonApi.getStatesList(country_id).then((response) => {
            if (response.data.statusCode == 1003) {
                setStatesList((prev) => ({ ...prev, [target]: response.data.data }));
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const handleCancel = () => {
        setError({})
        setAction("update");
    }

    const getName = (arr, id) => {
        if (arr.length > 0) {
            let filterArr = arr.filter(e => e.id == id);
            if (filterArr.length > 0) {
                return filterArr[0].value
            } else {
                return "";
            }
        }
    }

    const handleOpenDialog = () => {
        setOpen(true);
        // setEditdeleteId(id)
    };
    const handleClose = () => {
        setOpen(false);
        // setEditdeleteId(null)
    };

    const inputFun = (val, key) => {
        return (
            <Input
                key={key}
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    value: val,
                    type: 'text',
                    disabled: action === "update" ? false : true
                }}
                clientInput
                labelText={<Text largeLabel>State</Text>}
            />
        );
    }

    return (
        <Box p={2}>
            <Box mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                <Text profileTitle>
                    End Client Details
                </Text>
            </Box>
            <Box pb={1}>

                {getloading ?
                    <Grid container spacing={0} my={3}>
                        {
                            [1, 2, 3, 4, 5, 6, 7].map(() => (
                                <Grid lg={6} md={6} sm={12} xs={12}>
                                    <Box p={1}>
                                        <Skeleton variant="rounded" width={'100%'} height={'54px'} borderRadius={"10px"} />
                                    </Box>
                                </Grid>
                            ))
                        }
                    </Grid> :
                    <Fragment>
                        <Box className={classes.contentScroll}>
                            <Box sx={{ minHeight: "50vh", }}>
                                <Grid container spacing={0}>
                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'name',
                                                    value: formData.name,
                                                    inputProps: { maxLength: 50 },
                                                    disabled: action === "update" ? false : true
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>End Client Name</Text>}
                                            />
                                            <Text errorText> {error.name ? error.name : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={6} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'reference_id',
                                                    value: formData.reference_id,
                                                    type: 'text',
                                                    disabled: true
                                                }}
                                                handleChange={handleChange}
                                                clientInput
                                                labelText={<Text largeLabel>End Client ID</Text>}
                                            />
                                            <Text errorText> {error.reference_id ? error.reference_id : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={12} md={12} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'address_line_one',
                                                    value: formData.billing_address[0].address_line_one,
                                                    type: 'text',
                                                    disabled: action === "update" ? false : true
                                                }}
                                                handleChange={(e) => handleChangeAddress(e, "billing_address")}
                                                clientInput
                                                labelText={<Text largeLabel>Address Line</Text>}
                                            />
                                            <Text errorText> {error.address_line_one ? error.address_line_one : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={12} md={12} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'address_line_two',
                                                    value: formData.billing_address[0].address_line_two,
                                                    type: 'text',
                                                    disabled: action === "update" ? false : true
                                                }}
                                                handleChange={(e) => handleChangeAddress(e, "billing_address")}
                                                clientInput
                                                labelText={<Text largeLabel>Alternate Address Line <span className={classes.optional}>(Optional)</span> </Text>}
                                            />
                                            <Text errorText> {error.address_line_two ? error.address_line_two : ""}</Text>
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        {
                                            action === "update" ?
                                                <Box p={1} my={1}>
                                                    <SearchSelect
                                                        name='country_id'
                                                        value={formData.billing_address[0].country_id}
                                                        onChange={(e) => handleChangeAddress(e, "billing_address")}
                                                        options={countriesList}
                                                        labelText={<Text largeLabel>Country</Text>}
                                                        scrollTrue
                                                    />
                                                    <Text errorText> {error.country_id ? error.country_id : ""}</Text>
                                                </Box> :
                                                <Box p={1} >
                                                    <Input
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            value: getName(countriesList, formData.billing_address[0].country_id),
                                                            // value: countriesList.length > 0 && countriesList.filter(e => e.id === formData.billing_address[0].country_id).length > 0 ? [0].value : "",
                                                            type: 'text',
                                                            disabled: action === "update" ? false : true
                                                        }}
                                                        clientInput
                                                        labelText={<Text largeLabel>Country</Text>}
                                                    />
                                                </Box>
                                        }
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        {
                                            action === "update" ?
                                                <Box p={1} my={1}>
                                                    <SearchSelect
                                                        name='state_id'
                                                        value={formData.billing_address[0].state_id}
                                                        onChange={(e) => handleChangeAddress(e, "billing_address")}
                                                        options={statesList.billing_address}
                                                        labelText={<Text largeLabel>State</Text>}
                                                        scrollTrue
                                                    />
                                                    <Text errorText> {error.state_id ? error.state_id : ""}</Text>
                                                </Box> :
                                                <Box p={1} >
                                                    {
                                                        formData.billing_address.map((item, key) => (
                                                            item.state_id == "" ?
                                                                inputFun("", key) : inputFun(getName(statesList.billing_address, item.state_id), key)
                                                        ))
                                                    }
                                                </Box>
                                        }
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'city',
                                                    value: formData.billing_address[0].city,
                                                    type: 'text',
                                                    disabled: action === "update" ? false : true
                                                }}
                                                handleChange={(e) => handleChangeAddress(e, "billing_address")}
                                                clientInput
                                                labelText={<Text largeLabel>City</Text>}
                                            />
                                            <Text errorText> {error.city ? error.city : ""}</Text>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12}>
                                        <Box p={1}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'zip_code',
                                                    value: formData.billing_address[0].zip_code,
                                                    // type: 'text',
                                                    inputProps: formData.billing_address[0].country_id == 101 ? { maxLength: 6, minLength: 6 } : { maxLength: 5, minLength: 5 },
                                                    disabled: action === "update" ? false : true
                                                }}
                                                handleChange={(e) => handleChangeAddress(e, "billing_address")}
                                                clientInput
                                                labelText={<Text largeLabel>{formData.billing_address[0].country_id == 101 ? "Pin Code" : "Zip Code"}</Text>}
                                            />
                                            <Text errorText> {error.zip_code ? error.zip_code : ""}</Text>
                                        </Box>
                                    </Grid>

                                </Grid>

                            </Box>
                        </Box>

                        <Box pt={5} px={1} display={"flex"} justifyContent={"end"} gap={3}>
                            {
                                action === "update" ?
                                    <CustomButton cancelBtn onClick={() => handleOpenDialog()}>
                                        Cancel
                                    </CustomButton> : null
                            }
                            <LoadingButton saveLoader loading={loading} onClick={() => action === "update" ? handleSubmit() : handleCancel()}>
                                {
                                    action === "update" ? "Save" : "Edit"
                                }
                            </LoadingButton>
                        </Box>
                    </Fragment>
                }

            </Box>
            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                    {/* <CloseIcon sx={{ color: "rgba(38, 38, 38, 1)" }} /> */}
                </IconButton>
                <DialogContent sx={{ margin: "20px", }}>
                    <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                        <img src={ConfirmImg} alt="warning" />
                    </Box>

                    <Box my={3}>
                        <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                            Are You Sure?
                        </Typography>
                        <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                            Do You Really Wish To Cancel.
                        </Typography>
                    </Box>

                    <Box my={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }} >
                        <CustomButton no onClick={() => handleClose()}>
                            No
                        </CustomButton>
                        <CustomButton deleteBtn onClick={
                            () => {
                                getCompanyDetails();
                                setAction("read")
                                // setFormData({ ...data })
                                setError({})
                                handleClose()
                            }
                        }>
                            Yes, Cancel
                        </CustomButton>
                    </Box>

                </DialogContent>
            </BootstrapDialog>

        </Box>
    );
}