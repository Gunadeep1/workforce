import { Box, Card, CardContent, CardHeader, Grid, Step, Stepper, Divider, Slide } from '@mui/material'
import React, { useEffect } from 'react'
import Text from '../../../components/customText/Text';
import Button from '../../../components/customButton/Button';
import { BrownMnCustomisedConnector, BrownMnColorlibStepLabel, BrownMnCustomStepIcon, blue } from '../../../theme';
import { useState } from 'react';
import Input from '../../../components/input/Input';
import { empty_name, empty_usContact, isValid, isValidMulti, validate_Extension, validate_alphaNumeric, validate_charWithSpace, validate_city, validate_contact_number, validate_emptyField, validate_withCharDigit, validate_zipcode, validates_emailId } from '../../../components/Validation';
import minus from '../../../assets/client/minus-circle.svg';
import ReusablePopup from '../../../components/reuablePopup/ReusablePopup';
import success from '../../../assets/client/clientSuccess.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchSelect from '../../../components/selectField/SearchSelect';
import CommonApi from '../../../apis/CommonApi';
import LocalStorage from '../../../utils/LocalStorage';
import ClientStyles from './ClientStyles';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import FileInput from '../../../components/muiFileInput/FileInput';
import { addErrorMsg, addSuccessMsg, addWarningMsg } from '../../../utils/utils';
import EndClientApi from '../../../apis/admin/clients/EndClientApi';
import ClientsApi from '../../../apis/admin/clients/ClientsApi';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Text>{children}</Text>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function AddEndClient() {
  const classes = ClientStyles();
  const location = useLocation();
  const EndClientID = location && location.state && location.state.id;
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [countries, setCountries] = useState([]);
  const [getStates, setGetStates] = useState([]);
  const [state, setState] = useState({
    name: '',
    reference_id: '',
    net_pay_terms_id: '',
    same_as_above: true,
    billing_address: [
      {
        address_line_one: "",
        address_line_two: "",
        city: "",
        state_id: "",
        state_name: "",
        country_id: "",
        country_name: "",
        zip_code: "",
      },
    ],
    shipping_address: [
      {
        address_line_one: "",
        address_line_two: "",
        city: "",
        state_id: "",
        state_name: "",
        country_id: "",
        country_name: "",
        zip_code: "",
      },
    ],
    documents: [
      {
        id: '',
        new_document_id: '',
        document_name: ''
      }
    ]
  })
  const [error, setError] = useState({});
  const [erro, setErro] = useState([]);
  const [open, setOpen] = useState(false);
  // const [docError, setDocError] = useState([]);
  const [communicationError, setCommunicationError] = useState([]);

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

  useEffect(() => {
    getCountries();
    if (EndClientID !== '' && EndClientID !== null && EndClientID !== undefined) {
      IndexApi(EndClientID ? EndClientID : '');
    } else {
      EndClientIDApi();
    }    // eslint-disable-next-line    
  }, [])

  const getCountries = () => {
    CommonApi.getCountryList('', LocalStorage.getAccessToken())
      .then((response) => {
        if (response.data.statusCode == 1003) {
          setCountries(response.data.data);
        }
      })
  }

  // States Dropdown List
  const getStatesApi = (id) => {
    CommonApi.getStatesList(id)
      .then((response) => {
        if (response.data.statusCode == 1003) {
          setGetStates(response.data.data);
        }
      });
  };

  const EndClientIDApi = () => {
    CommonApi.prefix("end-client").then((res) => {
      if (res.data.statusCode == 1003) {
        setState({
          ...state,
          reference_id: res.data.data,
        });
      } else {
        addErrorMsg(res.data.message);
      }
    });
  };

  const IndexApi = (args) => {
    EndClientApi.indexApi(args).then((res) => {
      if (res.data.statusCode == 1003) {
        setState(res.data.data)
        console.log(res.data.data);
      }
    })
  }

  const changeHandler = (e, value) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    }, handleValidate(e))
  }

  const communicationChangeHandler = (e, value, index) => {
    if (e.target.name == "country_id") {
      getStatesApi(e.target.value);
      state.billing_address[index][e.target.name] = e.target.value;
      state.billing_address[index]['country_name'] = value.props.children;
      state.billing_address[index].state_id = ''
      state.billing_address[index].zip_code = ''
      if (state.same_as_above) {
        state.shipping_address[index][e.target.name] = e.target.value;
        state.shipping_address[index]['country_name'] = value.props.children;
      }
      setState(state, handleValidateCommunicationAdd(e.target, index));
    } else {
      state.billing_address[index][e.target.name] = e.target.value;
      if (state.same_as_above) {
        state.shipping_address[index][e.target.name] = e.target.value;
      }
      setState(state, handleValidateCommunicationAdd(e.target, index));
    }
  };

  const handleValidateCommunicationAdd = (e, index) => {
    let input = e;
    let error =
      communicationError.length > 0
        ? communicationError
          ? communicationError[index]
          : communicationError
        : communicationError;
    for (var k = 0; k <= index; k++) {
      communicationError.push({});
    }
    let s1 =
      communicationError.length > 0
        ? [...communicationError]
        : [{ ...communicationError }];
    switch (input.name || input.tagName) {
      case "address_line_one":
        error.address_line_one = validate_withCharDigit(input.value);
        break;
      case "address_line_two":
        error.address_line_two = validate_withCharDigit(input.value);
        break;
      case "city":
        error.city = validate_city(input.value);
        break;
      case "state_id":
        error.state_id = validate_emptyField(input.value);
        break;
      case "country_id":
        error.country_id = validate_emptyField(input.value);
        break;
      case "zip_code":
        error.zip_code = validate_zipcode(input.value, state.billing_address[index].country_id);
        break;
      default:
        break;
    }
    setCommunicationError(s1);
  };

  const uploadDocs = (e, index) => {
    if (e.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg'].includes(r))) {
      const formData = new FormData();
      formData.append('files', e.target.files[0]);
      formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
      CommonApi.documentUpload("company-logo",formData, LocalStorage.getAccessToken())
        .then((res) => {
          if (res.data.statusCode === 1003) {
            state.documents[index].new_document_id = res.data.data.id
            state.documents[index].document_name = e.target.files[0].name
            setState({ ...state })
          } else {
            addErrorMsg(res.data.message);
          }
        });
    } else {
      addErrorMsg("Upload Valid File(png,jpg,jpeg).");
    }
  }

  // const handleValidateDocs = (e, index) => {
  //   let input = e.target;
  //   let err = docError.length > 0 ? (docError ? docError[index] : docError) : docError;
  //   for (var k = 0; k <= index; k++) {
  //     docError.push({})
  //   }
  //   let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
  //   switch (input.name || input.tagName) {
  //     case 'new_document_id':
  //       err.new_document_id = validate_emptyField(input.value)
  //       break
  //     default:
  //       break
  //   }
  //   setDocError(s1);
  // }

  const handleValidate = (e) => {
    let input = e.target;
    let s1 = { ...error };
    switch (input.name || input.tagName) {
      case "name":
        error.name = validate_alphaNumeric(input.value);
        break;
      case "reference_id":
        error.reference_id = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    setError(s1);
  }

  const validateAll = () => {
    let { name, reference_id } = state;
    let errors = {};
    errors.name = validate_alphaNumeric(name);
    errors.reference_id = validate_emptyField(reference_id);
    return errors;
  }

  const validateContacts = () => {
    let errorsus = {};
    let err = [];
    contacts.map((value) => {
      errorsus = {};
      errorsus.first_name = validate_charWithSpace(value.first_name);
      errorsus.last_name = validate_charWithSpace(value.last_name);
      errorsus.email_id = validates_emailId(value.email_id);
      errorsus.mobile_number = validate_contact_number(value.mobile_number, "Mobile Number");
      errorsus.ext = validate_Extension(value.ext);
      errorsus.middle_name = empty_name(value.middle_name);
      return err.push(errorsus);
    });
    return err;
  };

  const companyCommAddressValidations = () => {
    let errors = {};
    let err = []; // eslint-disable-next-line
    state.billing_address.map((value) => {
      errors = {};
      errors.address_line_one = validate_withCharDigit(value.address_line_one);
      errors.country_id = validate_emptyField(value.country_id);
      errors.state_id = validate_emptyField(value.state_id);
      errors.city = validate_city(value.city);
      errors.zip_code = validate_zipcode(value.zip_code, value.country_id);
      err.push(errors);
    });
    return err;
  };

  const companyStore = (args) => {
    EndClientApi.storeEndClient(args).then((res) => {
      if (res.data.statusCode === 1003) {
        addSuccessMsg('Company Details Added Successfully');
        setActiveStep(1);
        setValue(value + 1);
        LocalStorage.setEndClientID(res.data.data.id);
        IndexApi(LocalStorage.getEndClientID());
      } else {
        addErrorMsg(res.data.message);
      }
    })
  }

  const updateCompany = (args) => {
    EndClientApi.updateCompany(state.id, args).then((res) => {
      if (res.data.statusCode === 1003) {
        addSuccessMsg('Company Details Updated Successfully');
        setActiveStep(activeStep + 1);
        setValue(value + 1)
        LocalStorage.setEndClientID(state.id);
        contatcIndex();
      } else {
        addErrorMsg(res.data.message);
      }
    })
  }

  const contatcIndex = () => {
    EndClientApi.contactIndex(state.id).then((res) => {
      if (res.data.statusCode == 1003) {
        setContacts(res.data.data)
      }
    })
  }

  const handleSubmit = () => {
    let errors = validateAll();
    let commErrors = companyCommAddressValidations();
    let contactErrors = validateContacts();
    if (activeStep == 0) {
      if (isValid(errors) && isValidMulti(commErrors)) {
        state['request_id'] = LocalStorage.uid();
        if (state.id !== '' && state.id !== null && state.id !== undefined) {
          updateCompany(state);
        } else {
          companyStore(state);
        }
      } else {
        let s1 = { error }
        s1 = errors
        setError(s1);
        let s2 = { error };
        s2 = commErrors;
        setCommunicationError(s2);
        addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
      }
    } else if (activeStep == 1) {
      if (isValidMulti(contactErrors)) {
        const data = {
          company_id: LocalStorage.getEndClientID(),
          contacts: contacts
        }
        data['request_id'] = LocalStorage.uid();
        if (EndClientID !== '' && EndClientID !== null && EndClientID !== undefined) {
          EndClientApi.updateContact(EndClientID, data).then((res) => {
            if (res.data.statusCode === 1003) {
              addSuccessMsg('Contact Details Updated Successfully');
              setOpen(true);
              setValue('1');
            }
          })
        } else {
          EndClientApi.storeContact(data).then((res) => {
            if (res.data.statusCode === 1003) {
              addSuccessMsg('Contact Details Added Successfully');
              setOpen(true);
              setValue('1');
            }
          })
        }
      } else {
        let s2 = { erro };
        s2 = contactErrors;
        setErro(s2);
        addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
      }
    }
  }

  const back = () => {
    if (activeStep == 0) {
      navigate('/clients', { state: { page: 'end-Client' } })
    } else if (activeStep == 1) {
      setActiveStep(0);
      setValue(value - 1);
    }
  }

  const addContact = (action, index) => {
    // let newArray = contacts;
    let obj = {
      first_name: "",
      middle_name: "",
      last_name: "",
      email_id: "",
      contact_number: "",
      ext: "",
      mobile_number: "",
    };
    if (action == "Add") {
      contacts.push(obj);
    } else if (action == 'Remove') {
      const data = {
        request_id: LocalStorage.uid(),
        company_id: LocalStorage.getEndClientID()
      }
      ClientsApi.destroyContact('end-client', contacts[index].id, data).then((res) => {
        if (res.data.statusCode == 1003) {
          contacts.splice(index, 1);
          IndexApi(LocalStorage.getEndClientID());
        } else {
          addErrorMsg(res.data.message);
        }
      })
    }
    setContacts([...contacts])
  }

  const handleChange = (e, index) => {
    if (e.target.name == "mobile_number" || e.target.name == "contact_number") {
      convertFormat(e, index)
    } else {
      contacts[index][e.target.name] = e.target.value
      setContacts([...contacts], handleValidateContact(e, index));
    }
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

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
        error.contact_number = empty_usContact(input.value, "Phone Number");
        break;
      case "ext":
        error.ext = validate_Extension(input.value);
        break;
      case "mobile_number":
        error.mobile_number = validate_contact_number(input.value, "Mobile Number");
        break;
      case "first_name":
        error.first_name = validate_charWithSpace(input.value);
        break;
      case "middle_name":
        error.middle_name = empty_name(input.value);
        break;
      case "last_name":
        error.last_name = validate_charWithSpace(input.value);
        break;
      case "email_id":
        error.email_id = validates_emailId(input.value);
        break;
      default:
        break;
    }
    setErro(s2);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Grid container justifyContent='center' pb={5}>
      <Grid item container lg={6} justifyContent='center' position='fixed' zIndex='1000' sx={{ background: '#FFFFFF' }}>
        <Grid item lg={6} pt={2} textAlign='center' p={'30px 0px !important'}>
          <Stepper activeStep={activeStep}
            connector={<BrownMnCustomisedConnector />}
          >
            <Step>
              <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                <Text BrowmnMnStepperText> End Client Details</Text>
              </BrownMnColorlibStepLabel>
            </Step>
            <Step>
              <BrownMnColorlibStepLabel StepIconComponent={BrownMnCustomStepIcon}>
                <Text BrowmnMnStepperText> Contact Details</Text>
              </BrownMnColorlibStepLabel>
            </Step>
          </Stepper>
        </Grid>
      </Grid>
      <Grid item lg={5.5} pt={9}>
        <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Card sx={{ padding: '20px 10px 10px 10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
              <CardHeader sx={{ padding: '15px 0px 0px 30px !important' }} title={
                <Text headerBlack>Company Details</Text>
              } />
              <CardContent
                TransitionComponent={Transition}
                sx={{ padding: '20px 30px 30px 30px !important' }}
              >
                {
                  activeStep == 0 &&
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'name',
                            value: state.name,
                          }}
                          handleChange={changeHandler}
                          clientInput
                          labelText={<Text largeLabel>End Client Name</Text>}
                        />
                        {
                          error.name ?
                            <Text red>{error.name ? error.name : ''}</Text> : ''
                        }
                      </Grid>
                      <Grid item lg={6}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'reference_id',
                            value: state.reference_id,
                            disabled: true
                          }}
                          handleChange={changeHandler}
                          clientInput
                          labelText={<Text largeLabel>End Client ID</Text>}
                        />
                        {
                          error.reference_id ?
                            <Text red>{error.reference_id ? error.reference_id : ''}</Text> : ''
                        }
                      </Grid>
                      {
                        state.documents && state.documents.map((item, key) => (
                          <Grid item lg={12}>
                            <Box pt={'11px'}>
                              <FileInput
                                name='new_document_id'
                                // value={item.new_document_id}
                                FileName={item.document_name}
                                handleChange={(e) => uploadDocs(e, key)}
                                label={<Text largeLabel>Upload Logo<span className={classes.optional}>(Optional)</span></Text>}
                              />
                            </Box>
                          </Grid>
                        ))
                      }
                      {
                        state.billing_address.map((item, index) => (
                          <>
                            <Grid item lg={12}>
                              <Input
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  name: 'address_line_one',
                                  value: item.address_line_one,
                                }}
                                handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                clientInput
                                labelText={<Text largeLabel>Address Line</Text>}
                              />
                              {communicationError.length > 0 ?
                                <Text red>{communicationError[index] ? communicationError[index].address_line_one : ""}</Text>
                                : ''}
                            </Grid>
                            <Grid item lg={12}>
                              <Input
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  name: 'address_line_two',
                                  value: item.address_line_two,
                                }}
                                handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                clientInput
                                labelText={<Text largeLabel>Alternate Address Line<span className={classes.optional}>(optional)</span></Text>}
                              />
                            </Grid>
                            <Grid item lg={6}>
                              <SearchSelect
                                name='country_id'
                                value={item.country_id}
                                options={countries}
                                labelText={<Text largeLabel>Country</Text>}
                                onChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                              />
                              {communicationError.length > 0 ?
                                <Text red>{communicationError[index] ? communicationError[index].country_id : ""}</Text>
                                : ''}
                            </Grid>
                            <Grid item lg={6}>
                              <SearchSelect
                                name='state_id'
                                value={item.state_id}
                                options={getStates}
                                labelText={<Text largeLabel>State</Text>}
                                onChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                              />
                              {communicationError.length > 0 ?
                                <Text red>{communicationError[index] ? communicationError[index].state_id : ""}</Text>
                                : ''}
                            </Grid>
                            <Grid item lg={6}>
                              <Input
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  name: 'city',
                                  value: item.city,
                                }}
                                handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                clientInput
                                labelText={<Text largeLabel>City</Text>}
                              />
                              {communicationError.length > 0 ?
                                <Text red>{communicationError[index] ? communicationError[index].city : ""}</Text>
                                : ''}
                            </Grid>
                            <Grid item lg={6}>
                              <Input
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  name: 'zip_code',
                                  value: item.zip_code,
                                  disabled: item.country_id === ''
                                }}
                                handleChange={(e, val) => { communicationChangeHandler(e, val, index) }}
                                clientInput
                                labelText={<Text largeLabel>{item.country_name == 'India' ? 'Pin Code' : 'Zip Code'}</Text>}
                              />
                              {communicationError.length > 0 ?
                                <Text red>{communicationError[index] ? communicationError[index].zip_code : ""}</Text>
                                : ''}
                            </Grid>
                          </>
                        ))
                      }
                    </Grid >
                  </Box>
                }
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Card sx={{ padding: '20px 10px 10px 10px !important', boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.05)', borderRadius: '12px !important' }}>
              <CardHeader sx={{ padding: '15px 0px 0px 30px !important' }} title={
                <Text headerBlack>Contact Details</Text>
              } />
              <CardContent
                TransitionComponent={Transition}
                sx={{ padding: '20px 30px 30px 30px !important' }}
              >
                {
                  activeStep == 1 &&
                  contacts.map((item, index) => (
                    <Grid container spacing={2} pt={index > 0 ? '15px' : ''}>
                      {
                        index > 0 &&
                        <><Grid item container lg={12} mt={2}>
                          <Grid item lg={8}>
                            <Text largeBlack>Contact Details -{index + 1}</Text>
                          </Grid>
                          <Grid item lg={4} textAlign='end'>
                            <img src={minus} alt='Minus' style={{ cursor: 'pointer' }} onClick={() => addContact('Remove', index)} />
                          </Grid>
                        </Grid><Divider sx={{ width: '100%', color: '#C7CCD3 !important', margin: '10px' }} /></>
                      }
                      <Grid item lg={6}>
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
                      <Grid item lg={6}>
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
                          labelText={<Text largeLabel>Middle Name <span className={classes.optional}>(optional)</span></Text>}
                        />
                        {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].middle_name : ""}</Text>) : ''}
                      </Grid>
                      <Grid item lg={6}>
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
                      <Grid item lg={6}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'email_id',
                            value: item.email_id,
                          }}
                          handleChange={(e) => handleChange(e, index)}
                          clientInput
                          labelText={<Text largeLabel>Email ID</Text>}
                        />
                        {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].email_id : ""}</Text>) : ''}
                      </Grid>
                      <Grid item lg={6}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'mobile_number',
                            value: item.mobile_number,
                            inputProps: { maxLength: 12 },
                          }}
                          handleChange={(e) => handleChange(e, index)}
                          clientInput
                          labelText={<Text largeLabel>Mobile Number</Text>}
                        />
                        {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].mobile_number : ""}</Text>) : ''}
                      </Grid>
                      <Grid item lg={6}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'ext',
                            value: item.ext,
                            inputProps: { maxLength: 4 },
                          }}
                          handleChange={(e) => handleChange(e, index)}
                          clientInput
                          labelText={<Text largeLabel>Extension</Text>}
                        />
                        {erro.length > 0 ? (<Text red>{erro[index] ? erro[index].ext : ""}</Text>) : ''}
                      </Grid>
                      <Grid item lg={6}>
                        <Input
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: 'contact_number',
                            value: item.contact_number,
                            inputProps: { maxLength: 12 },
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
                    </Grid>
                  ))
                }
                <Grid item lg={12} m={'25px 0px 0px 0px !important'}>
                  <Button lightBlue onClick={() => addContact('Add')}>Add Contact</Button>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
        </SwipeableViews>
        <Grid item container p={'10px 20px 0px 20px'}>
          <Grid item lg={6}>
            <Button blackCancel onClick={back}>{activeStep == 0 ? 'Home' : 'Back'}</Button>
          </Grid>
          <Grid item lg={6} textAlign='end'>
            <Button save onClick={handleSubmit}>{activeStep == 0 ? 'Save & Continue' : 'Finish'}</Button>
          </Grid>
        </Grid>
      </Grid>
      {
        open &&
        <ReusablePopup iconHide openPopup={open} setOpenPopup={setOpen} white statusWidth>
          <Box textAlign='center' p={'10px 20px 0px 20px'}>
            <img src={success} alt='success' />
            <Text veryLargeLabel sx={{ paddingTop: '25px !important' }}>Succesfully Added!</Text>
            <Text mediumLabel sx={{ padding: '10px 0px 30px 0px !important' }}>You Have Successfully {EndClientID !== '' && EndClientID !== null && EndClientID !== undefined ? 'Updated' : 'Added'} <span style={{ color: `${blue}` }}>{state.name}</span> Details.</Text>
            <Button onClick={() => navigate('/clients', { state: { page: 'end-Client' } })} blueButton>Go To Home</Button>
          </Box>
        </ReusablePopup>
      }
    </Grid >
  )
}

export default AddEndClient