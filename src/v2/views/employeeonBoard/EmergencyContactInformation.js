import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardHeader, CardContent, Grid, Dialog, DialogContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import OnboardStyles from './OnboardStyles'
import Text from "../../components/customText/Text";
import { isValid, validate_emptyField, validate_zipcode,validate_contact_number } from "../../components/Validation";
import { addErrorMsg, addSuccessMsg, addWarningMsg } from "../../utils/utils";
import onBoardLinkApi from "../../apis/onBoardLink/onBoardLinkApi";
import SearchSelect from '../../components/selectField/SearchSelect';
import warning from '../../assets/svg/warning.svg';
import submitted from '../../assets/svg/submitted.svg';
import Input from '../../components/input/Input';
import Button from '../../components/customButton/Button';
import { v4 as uuid } from 'uuid';

function EmergencyContactInformation(props) {
    const { id } = useParams();
    const { setMainStep, i9DocumentId, w4DocumentId, ocrData } = props;
    const [openDialog, setOpenDialog] = useState(false);
    const [emergencyContactDetails1, setEmergencyContactDetails1] = useState({
        name: "",
        number: "",
        relation: "",
        addressline1: "",
        addressline2: "",
        city: "",
        state: "",
        country: "",
        zipcode: ""
    });
    const [emergencyContactDetails2, setEmergencyContactDetails2] = useState({
        name2: "",
        number2: "",
        relation2: "",
        addressline12: "",
        addressline22: "",
        city2: "",
        state2: "",
        country2: "",
        zipcode2: ""
    });
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [stateList1, setStateList2] = useState([]);
    const [relationList, setRelationList] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const classes = OnboardStyles();

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

    const changeHandler1 = (e) => {
        if(e.target.name == "number"){
            convertFormat(e);
        }
        else if(e.target.name == "country"){
            setEmergencyContactDetails1({
                ...emergencyContactDetails1,
                [e.target.name]: e.target.value,
                state: "",
                city: "",
                zipcode: ""
            });
        }
        else{
            setEmergencyContactDetails1({
                ...emergencyContactDetails1,
                [e.target.name]: e.target.value
            });
        }
        
        handleValidate(e);
    };

    const changeHandler2 = (e) => {
        if(e.target.name == "number2"){
            convertFormat(e);
        }else if(e.target.name == "country2"){
            setEmergencyContactDetails2({
                ...emergencyContactDetails2,
                [e.target.name]: e.target.value,
                state2: "",
                city2: "",
                zipcode2: ""
            });
        }
        else{
            setEmergencyContactDetails2({
                ...emergencyContactDetails2,
                [e.target.name]: e.target.value
            });
        }
        handleValidate(e);
    };

    const convertFormat = (e) => {
        const value = e.target.value;
        const name = e.target.name
        const input = value.replace(/\D/g, '').substring(0, 10);
        // Divide numbers in 3 parts :"(123) 456-7890" 
        const first = name == 'number' || name == 'number2' ? input.substring(0, 3) : input.substring(0, 3);
        const middle = name == 'number' || name == 'number2' ? input.substring(3, 6) : input.substring(3, 5);
        const last = name == 'number' || name == 'number2' ? input.substring(6, 10) : input.substring(5, 9);
    
        if (input.length > (name == 'number' || name == 'number2' ? 6 : 5)) {
            if(name == 'number'){
                setEmergencyContactDetails1({
                    ...emergencyContactDetails1,
                    [e.target.name]: `${first}-${middle}-${last}`
                  });
            }
            else{
                setEmergencyContactDetails2({
                    ...emergencyContactDetails2,
                    [e.target.name]: `${first}-${middle}-${last}`
                  });
            }
        }
        else if (input.length > 3) {
            if(name == 'number'){
                setEmergencyContactDetails1({
                    ...emergencyContactDetails1,
                    [e.target.name]: `${first}-${middle}`
                  });
            }
            else{
                setEmergencyContactDetails2({
                    ...emergencyContactDetails2,
                    [e.target.name]: `${first}-${middle}`
                  });
            }
        }
        else if (input.length >= 0) {
            if(name == 'number'){
                setEmergencyContactDetails1({
                    ...emergencyContactDetails1,
                    [e.target.name]: input
                  });
            }else{
                setEmergencyContactDetails2({
                    ...emergencyContactDetails2,
                    [e.target.name]: input
                  });
            }
        }
      }

    useEffect(() => {
        getCountryList();
        getRelationList();
        // eslint-disable-next-line
    },[]);

    useEffect(() => {
        getStatesList1();
        // eslint-disable-next-line
    },[emergencyContactDetails1.country]);

    useEffect(() => {
        getStatesList2();
        // eslint-disable-next-line
    },[emergencyContactDetails2.country2]);

    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5ZjQ2ZWNmLTk0ZGItNDRhNC04YmQyLTQyMDhhMTQ4MGRhNSIsImlzX3N1cGVyX2FkbWluIjpmYWxzZSwidXNlck5hbWUiOiJtZWdoYXJhaiBwbiIsInRlbmFudF9pZCI6ImI3OTQzZGE2LWRiMWYtNDdlZi04YjMzLWRlMjk4MmMxZTI3MiIsInN1YmRvbWFpbl9uYW1lIjoibmV3c2NyZWVuIiwicm9sZV9pZCI6MiwiaWF0IjoxNzA1OTI4Mzg5LCJleHAiOjE3MDYwMTQ3ODl9.GjX597fbmB-kAL9alSqdpV7JfqkrnFEmb03VJPD_Y30";

    const getRelationList = () => {
        onBoardLinkApi.relation().then((res) => {
            if (res.data.statusCode === 1003) {
                setRelationList(res.data.data);
            } else {
                addErrorMsg(res.data.message);
            }
        });
    }

    const getCountryList = () => {
        onBoardLinkApi.getCountryList().then((res) => {
            if (res.data.statusCode === 1003) {
                setCountryList(res.data.data);
            } else {
                addErrorMsg(res.data.message);
            }
        });
    }

    const getStatesList1 = () => {
        onBoardLinkApi.getStatesList(emergencyContactDetails1.country).then((res) => {
            if (res.data.statusCode === 1003) {
                setStateList(res.data.data);
            } else {
                // addErrorMsg(res.data.message);
            }
        });
    }

    const getStatesList2 = () => {
        onBoardLinkApi.getStatesList(emergencyContactDetails2.country2).then((res) => {
            if (res.data.statusCode === 1003) {
                setStateList2(res.data.data);
            } else {
                // addErrorMsg(res.data.message);
            }
        });
    }

    const handleValidate = (e) => {
        let input = e.target
        switch (input.name || input.tagName) {
            case 'name':
                error.name = validate_emptyField(input.value)
                break
            case 'number':
                error.number = validate_contact_number(input.value, "Mobile Number")
                break
            case 'relation':
                error.relation = validate_emptyField(input.value)
                break
            case 'addressline1':
                error.addressline1 = validate_emptyField(input.value)
                break
            case 'zipcode':
                error.zipcode = validate_zipcode(input.value,emergencyContactDetails1.country)
                break
            case 'city':
                error.city = validate_emptyField(input.value)
                break
            case 'state':
                error.state = validate_emptyField(input.value)
                break
            case 'country':
                error.country = validate_emptyField(input.value)
                break
            case 'name2':
                error.name2 = validate_emptyField(input.value)
                break
            case 'number2':
                error.number2 = validate_contact_number(input.value, "Mobile Number")
                break
            case 'relation2':
                error.relation2 = validate_emptyField(input.value)
                break
            case 'addressline12':
                error.addressline12 = validate_emptyField(input.value)
                break
            case 'zipcode2':
                error.zipcode2 = validate_zipcode(input.value,emergencyContactDetails2.country2)
                break
            case 'city2':
                error.city2 = validate_emptyField(input.value)
                break
            case 'state2':
                error.state2 = validate_emptyField(input.value)
                break
            case 'country2':
                error.country2 = validate_emptyField(input.value)
                break
            default:
                break
        }
        setError({ ...error });
    }

    const handleSubmit = () => {
        let errors = validateAll();
        if (isValid(errors)) {
            let data = {
                request_id: uuid(),
                status: "approved",
                subdomain_name: "newscreen",
                "emergency_contact": [{
                    name: emergencyContactDetails1.name,
                    relationship_id: emergencyContactDetails1.relation,
                    contact_number: emergencyContactDetails1.number,
                    address_1: emergencyContactDetails1.addressline1,
                    address_2: emergencyContactDetails1.addressline2,
                    city: emergencyContactDetails1.city,
                    state_id: emergencyContactDetails1.state,
                    country_id: emergencyContactDetails1.country,
                    zip_code: emergencyContactDetails1.zipcode
                }, {
                    name: emergencyContactDetails2.name2,
                    relationship_id: emergencyContactDetails2.relation2,
                    contact_number: emergencyContactDetails2.number2,
                    address_1: emergencyContactDetails2.addressline12,
                    address_2: emergencyContactDetails2.addressline22,
                    city: emergencyContactDetails2.city2,
                    state_id: emergencyContactDetails2.state2,
                    country_id: emergencyContactDetails2.country2,
                    zip_code: emergencyContactDetails2.zipcode2
                }],
                i9_document_id: i9DocumentId,
                w4_document_id: w4DocumentId,
                ocr_documents_data: {
                    ocrData
                }
            }

            onBoardLinkApi.ApproveTheInviteLink(id, data).then((res) => {
                if (res.data.statusCode === 1003) {
                    setOpenDialog(true);
                    addSuccessMsg('Invite Link Approved Successfully');
                } else {
                    addErrorMsg(res.data.message);
                }
            });
        } else {
            let s1 = { error };
            s1 = errors
            setError(s1);
            addWarningMsg('Please fill all required fields');
        }
    };

    const validateAll = () => {
        const { name, number, relation, addressline1, city, state, country, zipcode } = emergencyContactDetails1;
        const { name2, number2, relation2, addressline12, city2, state2, country2, zipcode2 } = emergencyContactDetails2;
        let errors = {};
        errors.name = validate_emptyField(name);
        errors.number = validate_contact_number(number, "Mobile Number");
        errors.relation = validate_emptyField(relation);
        errors.addressline1 = validate_emptyField(addressline1);
        errors.zipcode = validate_zipcode(zipcode,country);
        errors.city = validate_emptyField(city);
        errors.state = validate_emptyField(state);
        errors.country = validate_emptyField(country);
        errors.name2 = validate_emptyField(name2);
        errors.number2 = validate_contact_number(number2, "Mobile Number");
        errors.relation2 = validate_emptyField(relation2);
        errors.addressline12 = validate_emptyField(addressline12);
        errors.zipcode2 = validate_zipcode(zipcode2,country2);
        errors.city2 = validate_emptyField(city2);
        errors.state2 = validate_emptyField(state2);
        errors.country2 = validate_emptyField(country2);
        
        return errors;
    }

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
            <Card className={classes.Card}>
                <CardHeader
                    title={
                        <Box 
                        display={"flex"} 
                        justifyContent={"left"} 
                        alignItems={"center"} 
                        p={2} width={"auto"} 
                        height={"80px"}
                        borderRadius={"8px"} 
                        backgroundColor={"#F59E0B33"}  >
                            <img src={warning} alt="warning"></img>
                            <Text p={2} className={classes.CardHedertext}>Please provide information of 2 of your emergency contacts.
                            </Text>
                        </Box>}
                />
                <CardContent>
                    <Text className={classes.CardContentHeader}>Emergency Contact Details - 1</Text>
                    <Grid container spacing={2} mt={2} mb={2}>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'name',
                                    value: emergencyContactDetails1.name
                                }}
                                handleChange={changeHandler1}
                                clientInput
                                labelText={<Text largeLabel>Name</Text>}
                            />
                            {
                                error.name &&
                                <Text red>{error.name ? error.name : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'number',
                                    value: emergencyContactDetails1.number,
                                    inputProps: { maxLength: 12 },
                                }}
                                handleChange={changeHandler1}
                                clientInput
                                labelText={<Text largeLabel>Number</Text>}
                            />
                            {
                                error.number &&
                                <Text red>{error.number ? error.number : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <SearchSelect
                                name='relation'
                                value={emergencyContactDetails1.relation}
                                onChange={changeHandler1}
                                options={relationList}
                                labelText={<Text largeLabel>Relation</Text>}
                            />
                            {
                                error.relation &&
                                <Text red>{error.relation ? error.relation : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}></Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'addressline1',
                                    value: emergencyContactDetails1.addressline1
                                }}
                                clientInput
                                handleChange={changeHandler1}
                                labelText={<Text largeLabel>Address Line 1</Text>}
                            />
                            {
                                error.addressline1 &&
                                <Text red>{error.addressline1 ? error.addressline1 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'addressline2',
                                    value: emergencyContactDetails1.addressline2
                                }}
                                handleChange={changeHandler1}
                                clientInput
                                labelText={<Text largeLabel>Address Line 2 <span className={classes.EmegencyOptionalTextColor}>(Optional)</span></Text>}
                            />
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <SearchSelect
                                name='country'
                                value={emergencyContactDetails1.country}
                                onChange={changeHandler1}
                                options={countryList}
                                labelText={<Text largeLabel>Country</Text>}
                            />
                            {
                                error.country &&
                                <Text red>{error.country ? error.country : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <SearchSelect
                                name='state'
                                value={emergencyContactDetails1.state}
                                onChange={changeHandler1}
                                options={stateList}
                                labelText={<Text largeLabel>State</Text>}
                            />
                            {
                                error.state &&
                                <Text red>{error.state ? error.state : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'city',
                                    value: emergencyContactDetails1.city
                                }}
                                handleChange={changeHandler1}
                                clientInput
                                labelText={<Text largeLabel>City</Text>}
                            />
                            {
                                error.city &&
                                <Text red>{error.city ? error.city : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'zipcode',
                                    value: emergencyContactDetails1.zipcode,
                                    disabled: emergencyContactDetails1.country === ''
                                }}
                                handleChange={changeHandler1}
                                clientInput
                                labelText={<Text largeLabel>Zipcode</Text>}
                            />
                            {
                                error.zipcode &&
                                <Text red>{error.zipcode ? error.zipcode : ''}</Text>
                            }
                        </Grid>
                    </Grid>
                    <Text className={classes.CardContentHeader} >Emergency Contact Details - 2</Text>
                    <Grid container spacing={2} mt={2} mb={1}>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'name2',
                                    value: emergencyContactDetails2.name2
                                }}
                                handleChange={changeHandler2}
                                clientInput
                                labelText={<Text largeLabel>Name</Text>}
                            />
                            {
                                error.name2 &&
                                <Text red>{error.name2 ? error.name2 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'number2',
                                    value: emergencyContactDetails2.number2
                                }}
                                handleChange={changeHandler2}
                                clientInput
                                labelText={<Text largeLabel>Number</Text>}
                            />
                            {
                                error.number2 &&
                                <Text red>{error.number2 ? error.number2 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <SearchSelect
                                name='relation2'
                                value={emergencyContactDetails2.relation2}
                                onChange={changeHandler2}
                                options={relationList}
                                labelText={<Text largeLabel>Relation</Text>}
                            />
                            {
                                error.relation2 &&
                                <Text red>{error.relation2 ? error.relation2 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}></Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'addressline12',
                                    value: emergencyContactDetails2.addressline12
                                }}
                                handleChange={changeHandler2}
                                clientInput
                                labelText={<Text largeLabel>Address Line 1</Text>}
                            />
                            {
                                error.addressline12 &&
                                <Text red>{error.addressline12 ? error.addressline12 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'addressline22',
                                    value: emergencyContactDetails2.addressline22
                                }}
                                handleChange={changeHandler2}
                                clientInput
                                labelText={<Text largeLabel>Address Line 2 <span className={classes.EmegencyOptionalTextColor}>(Optional)</span></Text>}
                            />
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <SearchSelect
                                name='country2'
                                value={emergencyContactDetails2.country2}
                                onChange={changeHandler2}
                                options={countryList}
                                labelText={<Text largeLabel>Country</Text>}
                            />
                            {
                                error.country2 &&
                                <Text red>{error.country2 ? error.country2 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <SearchSelect
                                name='state2'
                                value={emergencyContactDetails2.state2}
                                onChange={changeHandler2}
                                options={stateList1}
                                labelText={<Text largeLabel>State</Text>}
                            />
                            {
                                error.state2 &&
                                <Text red>{error.state2 ? error.state2 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'city2',
                                    value: emergencyContactDetails2.city2
                                }}
                                handleChange={changeHandler2}
                                clientInput
                                labelText={<Text largeLabel>City</Text>}
                            />
                            {
                                error.city2 &&
                                <Text red>{error.city2 ? error.city2 : ''}</Text>
                            }
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    name: 'zipcode2',
                                    value: emergencyContactDetails2.zipcode2,
                                    disabled: emergencyContactDetails2.country2 === ''
                                }}
                                handleChange={changeHandler2}
                                clientInput
                                labelText={<Text largeLabel>Zipcode</Text>}
                            />
                            {
                                error.zipcode2 &&
                                <Text red>{error.zipcode2 ? error.zipcode2 : ''}</Text>
                            }
                        </Grid>
                        
                        
                        
                    </Grid>

                </CardContent>
            </Card>
            <Box width={"55%"} display={"flex"} justifyContent={"space-between"} pt={5} pb={5} >

                <Button
                    className={classes.BackButton}
                    onClick={() => setMainStep(1)}
                >Back</Button>
                <Button
                    className={classes.ContinueButton}
                    onClick={handleSubmit}
                >Submit</Button>
            </Box>
            {openDialog &&
                <BootstrapDialog
                    keepMounted
                    aria-labelledby='customizes-dialog-title'
                    open={openDialog}
                    handleClose={() => setOpenDialog(false)}
                    maxWidth={"md"}>
                    <Box className={classes.MainDialogBox}>
                        <DialogContent className={classes.DialogContent}>
                            <Box textAlign='center' p={'0px 20px 0px 20px'}>
                                <img src={submitted} alt="submitted"></img>
                                <Text className={classes.DiloagContextEmergecny}>Submitted Successfully</Text>
                                <Text className={classes.DiloagContextEmergecny1}>
                                    Your documents has been submitted successfully,<br></br>Your employer will get back to you in short.
                                </Text>
                                <Box mt={4} mb={2}>
                                    <Button className={classes.DiloagContextEmergecnyButton} onClick={() => { setOpenDialog(false); navigate("/") }}>
                                        Close
                                    </Button></Box>
                            </Box>
                        </DialogContent>
                    </Box>
                </BootstrapDialog>}
        </Box>
    )

}

export default EmergencyContactInformation;