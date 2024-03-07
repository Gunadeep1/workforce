import React from 'react'
import VendorProfileStyles from './VendorProfileStyles';
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import Text from '../../../../components/customText/Text';
import Input from '../../../../components/input/Input';
import { useState } from 'react';
import { empty_name, empty_usContact, isValidMulti, validate_Extension, validate_charWithSpace, validate_contact_number, validates_emailId } from '../../../../components/Validation';
import Button from '../../../../components/customButton/Button';
import VendorApi from '../../../../apis/admin/clients/VendorApi';
import { useEffect } from 'react';
import CustomizedAccordions from '../../employees/userprofile/AccordionList';
// import DownloadSvg from "../../../../assets/svg/downloadIcon.svg";
import EditSvg from "../../../../assets/svg/editIcon.svg";
import DeleteSvg from "../../../../assets/svg/deleteIcon.svg";
// import FileSvg from "../../../../assets/svg/File.svg";
// import FileSaver from 'file-saver';
import contact from '../../../../assets/client/blackContact.svg';
import { Add } from '@mui/icons-material';
import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';
import LocalStorage from '../../../../utils/LocalStorage';
import LoadingButton from '../../../../components/customButton/LoadingButton';
import NoDataImg from "../../../../assets/images/no-data.png";
import ReusablePopup from '../../../../components/reuablePopup/ReusablePopup';
import ConfirmImg from '../../../../assets/svg/confirm-BG-img.svg';
import CustomButton from '../../../../components/customButton/Button';
import { useLocation } from 'react-router-dom';

function ContactDetails() {
    const location = useLocation();
    const classes = VendorProfileStyles();
    const [contacts, setContacts] = useState([
        {
            first_name: "",
            middle_name: "",
            last_name: "",
            email_id: "",
            contact_number: "",
            ext: "",
            mobile_number: "",
        }
    ])
    const [erro, setErro] = useState([]);
    const [list, setlist] = useState([]);
    const [actionState, setActionState] = useState(false); // eslint-disable-next-line
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteID, setdeleteID] = useState('');


    useEffect(() => {
        indexApi(); // eslint-disable-next-line              
    }, [])

    // const downloadDoc = (fileUrl) => {
    //     FileSaver.saveAs(fileUrl);
    // }

    // const yesPopup = (args) => {
    //     setDeletePopup(true);
    //     setdeleteID(args);
    // }

    // const deleteData = () => {
    //     setLoading(true);
    //     const data = {
    //         request_id: LocalStorage.uid(),
    //         company_id: id,
    //     }
    //     VendorApi.contactdestroy(deleteID, data).then((res) => {
    //         setTimeout(() => {
    //             setLoading(false);
    //             if (res.data.statusCode === 1003) {
    //                 indexApi();
    //                 addSuccessMsg('Contact Details Deleted Successfully');
    //                 setDeletePopup(false); 
    //                 setdeleteID(null);
    //             } else {
    //                 addErrorMsg(res.data.message);
    //             }
    //         }, 400)
    //     })
    // }

    const yesPopup = (args) => {
        setDeletePopup(true);
        setdeleteID(args);
    }

    const deleteData = () => {
        setLoading(true);
        const data = {
            request_id: LocalStorage.uid(),
            company_id: location.state.data.id,
        }
        VendorApi.contactdestroy(deleteID, data).then((res) => {
            setTimeout(() => {
                setLoading(false);
                if (res.data.statusCode === 1003) {
                    addSuccessMsg('Contact Details Deleted Successfully');
                    setDeletePopup(false);
                    setdeleteID(null);
                    indexApi();
                } else {
                    addErrorMsg(res.data.message);
                }
            }, 400)
        })
    }

    const handleChange = (e, index) => {
        if (e.target.name == "mobile_number" || e.target.name == "contact_number") {
            convertFormat(e, index)
        } else {
            contacts[index][e.target.name] = e.target.value
            setContacts([...contacts], handleValidateContact(e, index));
        }
    };

    const convertFormat = (e, index) => {
        const value = e.target.value;
        const name = e.target.name
        const input = value.replace(/\D/g, '').substring(0, 10);
        // Divide numbers in 3 parts :"(123) 456-7890" 
        const first = name == 'mobile_number' || name == 'contact_number' ? input.substring(0, 3) : input.substring(0, 3);
        const middle = name == 'mobile_number' || name == 'contact_number' ? input.substring(3, 6) : input.substring(3, 5);
        const last = name == 'mobile_number' || name == 'contact_number' ? input.substring(6, 10) : input.substring(5, 9);

        if (input.length > (name == 'mobile_number' || name == 'contact_number' ? 6 : 5)) {
            contacts[index][e.target.name] = `${first}-${middle}-${last}`
            setContacts([...contacts], handleValidateContact(e, index))
        }
        else if (input.length > 3) {
            contacts[index][e.target.name] = `${first}-${middle}`
            setContacts([...contacts], handleValidateContact(e, index))
        }
        else if (input.length >= 0) {
            contacts[index][e.target.name] = input
            setContacts([...contacts], handleValidateContact(e, index))
        }
    }

    const handleValidateContact = (e, index) => {
        let input = e.target;
        let error = erro.length > 0 ? (erro ? erro[index] : erro) : erro;
        for (var k = 0; k <= index; k++) {
            erro.push({});
        }
        let s2 = erro.length > 0 ? [...erro] : [{ ...erro }];
        switch (input.name || input.tagName) {
            case "contact_number":
                error.contact_number = empty_usContact(input.value, "Phone number");
                break;
            case "ext":
                error.ext = validate_Extension(input.value);
                break;
            case "mobile_number":
                error.mobile_number = validate_contact_number(input.value, "Mobile Number");
                break;
            case "first_name":
                error.first_name = validate_charWithSpace(input.value, "first ");
                break;
            case "middle_name":
                error.middle_name = empty_name(input.value, "middle ");
                break;
            case "last_name":
                error.last_name = validate_charWithSpace(input.value, "last ");
                break;
            case "email_id":
                error.email_id = validates_emailId(input.value);
                break;
            default:
                break;
        }
        setErro(s2);
    };

    const validateAll = () => {
        let errorsus = {};
        let err = [];
        contacts.map((value) => {
            errorsus = {};
            errorsus.first_name = validate_charWithSpace(value.first_name, "first ");
            errorsus.last_name = validate_charWithSpace(value.last_name, "last ");
            errorsus.email_id = validates_emailId(value.email_id);
            errorsus.mobile_number = validate_contact_number(value.mobile_number, "Mobile Number");
            errorsus.ext = validate_Extension(value.ext);
            return err.push(errorsus);
        });
        return err;
    }

    const indexApi = () => {
        setLoading(true);
        VendorApi.contactIndex(location.state.data.id).then((res) => {
            if (res.data.statusCode == 1003) {
                setLoading(false);
                setlist(res.data.data)
            }else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValidMulti(errors)) {
            const data = {
                request_id: LocalStorage.uid(),
                company_id: location.state.data.id,
                contacts: contacts
            }
            data['request_id'] = LocalStorage.uid();
            setLoading(true);
            setTimeout(() => {
                setLoading(false)
                if (actionState === 'add') {
                    VendorApi.storeContact(data).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Contact Details Added Successfully');
                            indexApi();
                            setActionState(false);
                            setEditId(null);
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                } else if (actionState === 'update') {
                    VendorApi.updateContact(location.state.data.id, data).then((res) => {
                        if (res.data.statusCode === 1003) {
                            addSuccessMsg('Contact Details Updated Successfully');
                            indexApi();
                            setActionState(false);
                            setEditId(null);
                        } else {
                            addErrorMsg(res.data.message);
                        }
                    })
                }
            }, 400)
        } else {
            let s1 = { erro }
            s1 = errors;
            setErro(s1);
        }
    }

    const handleUpdate = (index) => {
        let data = list[index];
        let updateData = list.filter((item) => item.id === data.id)
        console.log(updateData, "updateData");
        setActionState('update');
        setErro([]);
        setEditId(data.id);
        setContacts([...updateData]);
    }

    const openAddForm = () => {
        setContacts([
            {
                first_name: "",
                middle_name: "",
                last_name: "",
                email_id: "",
                contact_number: "",
                ext: "",
                mobile_number: "",
            }
        ]);
        setErro([])
        setActionState('add');
    }

    return (
        <Box p={4} pt={5} >
            <Grid container lg={12} >
                <Grid item lg={8}>
                    <Text largeBlack>Contact Details</Text>
                </Grid>
                <Grid item lg={4} textAlign='end'>
                    {
                        !["add", "update"].includes(actionState) &&
                        <Button addNew onClick={openAddForm}><Add style={{ marginRight: '5px' }} />Add New</Button>
                    }
                </Grid>

            </Grid>
            <Grid item lg={12} md={8} sm={8} xs={12} pt={3}>
                {
                    ["add", "update"].includes(actionState) ?
                        <>
                            {
                                contacts.map((item, index) => (
                                    <Grid container spacing={2} pt={index > 0 ? '15px' : ''}>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'first_name',
                                                    value: item.first_name,
                                                    inputProps: { maxLength: 50 }
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>First Name</Text>}
                                            />
                                            {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].first_name : ""}</Text>) : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'middle_name',
                                                    value: item.middle_name,
                                                    inputProps: { maxLength: 50 }
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>Middle Name<span className={classes.optional}>(Optional)</span></Text>}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'last_name',
                                                    value: item.last_name,
                                                    inputProps: { maxLength: 50 }
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>Last Name</Text>}
                                            />
                                            {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].last_name : ""}</Text>) : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'email_id',
                                                    value: item.email_id
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>Email ID</Text>}
                                            />
                                            {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].email_id : ""}</Text>) : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'mobile_number',
                                                    value: item.mobile_number,
                                                    inputProps: { maxLength: 12 }
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>Mobile Number</Text>}
                                            />
                                            {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].mobile_number : ""}</Text>) : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'ext',
                                                    value: item.ext,
                                                    inputProps: { maxLength: 4 }
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>Extension</Text>}
                                            />
                                            {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].ext : ""}</Text>) : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: 'contact_number',
                                                    value: item.contact_number,
                                                    inputProps: { maxLenth: 12 }
                                                }}
                                                handleChange={(e) => handleChange(e, index)}
                                                clientInput
                                                labelText={<Text largeLabel>Phone Number<span className={classes.optional}>(Optional)</span></Text>}
                                                helperText={
                                                    erro.length &&
                                                    erro[index] && erro[index].contact_number &&
                                                    <span className={classes.helperTextError}>{erro[index].contact_number}</span>
                                                }
                                            />
                                        </Grid>
                                        <Grid item lg={12} textAlign='end' mt={8}>
                                            {
                                                ["add", "update"].includes(actionState) ?
                                                    <Button cancelBtn onClick={() => setActionState(false)} sx={{ marginRight: '15px' }}>
                                                        Cancel
                                                    </Button> : null
                                            }
                                            <LoadingButton saveLoader loading={loading} onClick={() => handleSubmit()}>
                                                {
                                                    actionState === "update" ? "Update" : actionState === "add" ? "Save" : null
                                                }
                                            </LoadingButton>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </> :
                        <>
                            {
                                loading ?
                                    [1, 2, 3].map((item, key) => (
                                        <CustomizedAccordions
                                            key={key}
                                            serial_no={key + 1}
                                            accordionSummary={

                                                <Grid container spacing={0}>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box display={'flex'} alignItems={'center'} gap={2} >
                                                            <Skeleton variant="circular" sx={{ width: "24px", height: "24px" }} />
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                        <Box>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "8rem" }} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                                        <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "2rem" }} />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            }
                                            accordionDetails={
                                                <Box
                                                    sx={{
                                                        height: "80px",
                                                        borderRadius: "10px",
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-around",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Skeleton variant="rounded" width={'100%'} height={'100%'} borderRadius={"10px"} />
                                                </Box>

                                            }
                                        />
                                    )) : null
                            }
                            {
                                !loading &&
                                list.map((item, key) => (
                                    <CustomizedAccordions
                                        key={key}
                                        accordionSummary={
                                            <Grid container spacing={0} alignItems='center'>
                                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                                    <Box display={'flex'} alignItems={'center'} >
                                                        <img src={contact} alt="contact" style={{ marginRight: '12px' }} />
                                                        <Text largeBldBlack>{item.first_name}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                    <Box>
                                                        <Text mediumGrey>{item.email_id}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item lg={3} md={3} sm={3} xs={3} display={'flex'} justifyContent={'center'}>
                                                    <Box>
                                                        <Text mediumLabel>{item.contact_number ? item.contact_number : '--'}</Text>
                                                    </Box>
                                                </Grid>
                                                {/* <Grid item lg={3} md={3} sm={3} xs={3}>
                                                    <Box mr={5} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                                        <img src={DownloadSvg} alt="download" onClick={() => downloadDoc(item.documents[0].document_url)} />
                                                    </Box>
                                                </Grid> */}
                                            </Grid>
                                        }
                                        accordionDetails={
                                            <Box
                                                py={3} px={5}
                                                sx={{
                                                    backgroundColor: "#F9FCFF !important",
                                                    minHeight: "100px",
                                                    borderRadius: "10px",
                                                }}>
                                                <Grid container spacing={0}>
                                                    <Grid item lg={8} md={4} sm={4}>
                                                        <Box sx={{ width: "100%" }}>
                                                            <Text largeGrey>Phone Number</Text>
                                                            <Text largeBlack sx={{ paddingTop: '8px' }}>{item.mobile_number ? item.mobile_number : '--'}</Text>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={4} md={4} sm={4} textAlign='end'>
                                                        <Box sx={{ width: "100%", margin: "12px 0px", }} >
                                                            <Stack direction={'row'} spacing={2} justifyContent={'end'}>
                                                                <img src={EditSvg} alt="edit" onClick={() => handleUpdate(key)} style={{ cursor: "pointer" }} />
                                                                <img src={DeleteSvg} alt="delete" onClick={() => yesPopup(item.id)} style={{ cursor: "pointer" }} />
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        }
                                    />
                                ))
                            }
                            {
                                !loading && list.length === 0 ?
                                    <Box sx={{ height: "55vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box>
                                            <img src={NoDataImg} alt='no-data' />
                                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                                <Text>No Data Found</Text>
                                            </Box>
                                        </Box>
                                    </Box> : null
                            }
                            {
                                deletePopup &&
                                <ReusablePopup iconHide white openPopup={deletePopup} setOpenPopup={setDeletePopup} fullWidth>
                                    <Box sx={{ margin: "20px", }}>
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
                                            <CustomButton no onClick={() => setDeletePopup(false)}>
                                                No
                                            </CustomButton>
                                            <CustomButton deleteBtn onClick={deleteData}>
                                                Yes, Cancel
                                            </CustomButton>
                                        </Box>

                                    </Box>
                                </ReusablePopup>
                            }
                        </>
                }
            </Grid>
        </Box >
    )
}

export default ContactDetails