import { Box, Card, CardContent, CardHeader, Checkbox, Divider, Grid, Step, Stepper } from '@mui/material';
import React from 'react';
import Text from '../../../../components/customText/Text';
import { useState } from 'react';
import { AddEmpCont, AddEmpSubStepper, AddEmployeeStepper, BrownMnColorlibStepLabel, BrownMnCustomisedConnector } from '../../../../theme';
import Input from '../../../../components/input/Input';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import OnboardStyles from './OnboardStyles';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import Button from '../../../../components/customButton/Button';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import LocalStorage from '../../../../utils/LocalStorage';
import { isValid, isValidMulti, validateAplaSpecialChar, validate_charWithSpace, validate_emptyField, validate_ssn, validate_usContact, validates_Integer, validates_emailId, validates_float, empty_name, empty_Email_id, empty_usContact, validate_zipcode } from '../../../../components/Validation';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../utils/utils';
import CommonApi from '../../../../apis/CommonApi';
import { useEffect } from 'react';
import minus from '../../../../assets/client/minus-circle.svg';
import Documents from './documents/Documents';
import { useLocation, useNavigate } from 'react-router-dom';
import BankDetails from './bankDetails/BankDetails';
import ReusablePopup from '../../../../components/reuablePopup/ReusablePopup';
import draft from '../../../../assets/employee/savedraft.svg';
import Date from '../../../../components/datePicker/Date';
import OnBoardApi from '../../../../apis/admin/employees/OnBoardApi';
import moment from 'moment';
import ClientsApi from '../../../../apis/admin/clients/ClientsApi';
import EmployeesApi from '../../../../apis/admin/employees/EmployeesApi';

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

function OnboardEmployee() {
  const classes = OnboardStyles(); // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation()
  console.log(location.state, "statttee")
  const theme = useTheme();
  const mainStepsList = ['General Details', 'Documents', 'Pay Configuration'];
  const [mainStep, setMainStep] = useState(0);
  const [subStepper, setSubstepper] = useState(4);
  const [docStepper, setDocStepper] = useState(0);
  const subStepperList = ['', '', '', '', '', ''];
  const contactSubStepperList = ['', '', '', ''];
  const [value, setValue] = useState(4);
  const genderList = require('../../../../utils/jsons/Gender.json');
  const maritalList = require('../../../../utils/jsons/MaritalStatus.json');
  const bloodGroups = require('../../../../utils/jsons/BloodGroup.json');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [employmentType, setEmploymentType] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  const [category, setCategory] = useState([]);
  const [empTeam, setEmpTeam] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [relation, setRelation] = useState([]);
  const [open, setOpen] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [emergencyState1, setemergencyState1] = useState([])
  const [emergencyState2, setemergencyState2] = useState([])
  const [state, setState] = useState({
    request_id: LocalStorage.uid(),
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    dob: '',
    blood_group: '',
    marital_status: '',
    contact_number: '',
    email_id: '',
    role_id: '',
    alternate_email_id: '',
    date_of_joining: '',
    employment_type_id: '',
    reference_id: '',
    alternate_contact_number: '',
    emergency_contact: [
      {
        relationship_id: '',
        name: '',
        contact_number: '',
        address_1: '',
        address_2: '',
        city: '',
        zip_code: '',
        state_id: '',
        country_id: '',
        email_id: ''
      },
      {
        relationship_id: '',
        name: '',
        contact_number: '',
        address_1: '',
        address_2: '',
        city: '',
        zip_code: '',
        state_id: '',
        country_id: '',
        email_id: ''
      }
    ],
    address_line_one: '',
    address_line_two: '',
    city: '',
    state_id: '',
    country_id: '',
    zip_code: '',
    employment_category_id: '',
    ssn: '',
    is_usc: '',
    visa_type_id: '',
    reporting_manager_id: '',
    enable_login: 0,
    drafted_stage: "",
    vendor_id: '',
    vendor_price: '',
    department_id: '',
    team_id: ''
  })

  const [error, setError] = useState({});
  const [contactError, setContactError] = useState([]);
  const [visaList, setVisaList] = useState([]);

  const IsEmpUSA = [
    {
      id: 1,
      value: 'Yes'
    },
    {
      id: 0,
      value: 'No'
    }
  ]

  useEffect(() => {
    getRolesDropdown();
    countriesList();
    departmentList();
    employmentList();
    categoryList();
    employeeTeamList();
    relationList();
    employeesList();
    visaListApi();
    vendorDropdown();
    if (location.state !== null) {
      if (location.state.stage === 'General Details' || location.state.stage === 'Documents') {
        setMainStep(0);
        setValue(4);
        setSubstepper(4);
        setDocStepper(0);
        LocalStorage.setEmployeeId(location.state.id);
        LocalStorage.setFullName(location.state.full_name);
        setTimeout(() => {
          callAPI()
        }, 500)
      }
    }
    else {
      setMainStep(0);
      setValue(0);
      setSubstepper(0);
      setDocStepper(0);
    }
    // eslint-disable-next-line
  }, [])

  const callAPI = () => {
    EmployeesApi.getEmployee(location.state.id).then((response) => {
      setTimeout(() => {
        if (response.data.statusCode == 1003) {
          state.first_name = response.data.data.basic_details.first_name
          state.last_name = response.data.data.basic_details.last_name
          state.blood_group = response.data.data.basic_details.blood_group
          state.dob = response.data.data.basic_details.dob
          state.gender = response.data.data.basic_details.gender
          state.middle_name = response.data.data.basic_details.middle_name
          state.marital_status = response.data.data.basic_details.marital_status
          state.emergency_contact = response.data.data.emergency_contacts
          state.alternate_contact_number = response.data.data.contact_details.alternate_contact_number
          state.alternate_email_id = response.data.data.contact_details.alternate_email_id
          state.contact_number = response.data.data.contact_details.contact_number
          state.email_id = response.data.data.contact_details.email_id
          state.address_line_one = response.data.data.current_address.address_line_one
          state.address_line_two = response.data.data.current_address.address_line_two
          state.city = response.data.data.current_address.city
          state.country_id = response.data.data.current_address.country_id
          state.country_name = response.data.data.current_address.country_name
          state.state_id = response.data.data.current_address.state_id
          state.state_name = response.data.data.current_address.state_name
          state.zip_code = response.data.data.current_address.zip_code
          state.date_of_joining = response.data.data.employment_details.date_of_joining
          state.department_id = response.data.data.employment_details.department_id
          state.department_name = response.data.data.employment_details.department_name
          state.employment_category_id = response.data.data.employment_details.employment_category_id
          state.employment_type_id = response.data.data.employment_details.employment_type_id
          state.enable_login = response.data.data.employment_details.enable_login
          state.reference_id = response.data.data.employment_details.reference_id
          state.reporting_manager_id = response.data.data.employment_details.reporting_manager_id
          state.role_id = response.data.data.employment_details.role_id
          state.ssn = response.data.data.employment_details.ssn
          state.team_id = response.data.data.employment_details.team_id
          state.visa_type_id = response.data.data.employment_details.visa_type_id
          state.is_usc = response.data.data.employment_details.is_usc
          setState({ ...state })
        } else {
          addErrorMsg(response.data.message);
        }
      }, 500)

    });
  }

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const addContact = (action, index) => {
    let obj = {
      relationship_id: '',
      name: '',
      contact_number: '',
      address_1: '',
      address_2: '',
      city: '',
      zip_code: '',
      state_id: '',
      country_id: ''
    };
    if (action == "Add") {
      state.emergency_contact.push(obj);
    } else if (action == 'Remove') {
      state.emergency_contact.splice(index, 1);
    }
    setState({ ...state })
  }


  const dateChange = (e, name) => {
    let date = e.$d
    let event = {
      target: {
        name: name,
        value: date
      }
    }
    setState({
      ...state,
      [name]: moment(date).format(dateFormat())
    }, handleValidate(event))
  }

  const changeHandler = (e, index, args) => {
    if (e.target.name == 'country_id') {
      statesList(e.target.value, index);
      state.state_id = ''
      setState({
        ...state,
        [e.target.name]: e.target.value
      }, handleValidate(e));
    } else if (e.target.name == 'contact_number' || e.target.name === 'ssn') {
      convertFormat(e);
    } else if (e.target.name === 'enable_login') {
      state['enable_login'] = e.target.checked == true ? 1 : 0
      setState({ ...state })
    } else if (e.target.name == 'employment_type_id') {
      employeeID(e.target.value);
      handleValidate(e);
    }
    else {
      setState({
        ...state,
        [e.target.name]: e.target.value
      }, handleValidate(e));
    }


    if (args == 'contact') {
      if (e.target.name == 'country_id') {
        statesList(e.target.value);
        state.emergency_contact[index]['state_id'] = ''
        state.emergency_contact[index][e.target.name] = e.target.value
        setState(state, contactHandleValiadates(e.target, index));
      } else if (e.target.name == 'contact_number') {
        convertContactFormat(e, index);
        setState(state, contactHandleValiadates(e.target, index));
      }
      else {
        state.emergency_contact[index][e.target.name] = e.target.value
        setState(state, contactHandleValiadates(e.target, index));
      }
    }
  }

  const convertFormat = (e) => {
    const value = e.target.value;
    const name = e.target.name
    const input = value.replace(/\D/g, '').substring(0, 10);

    // Divide numbers in 3 parts :"(123) 456-7890" 
    const first = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(0, 3) : input.substring(0, 3);
    const middle = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(3, 6) : input.substring(3, 5);
    const last = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(6, 10) : input.substring(5, 9);

    if (input.length > (name == 'contact_number' || name == 'alternate_contact_number' ? 6 : 5)) {
      setState(
        {
          ...state,
          [e.target.name]: `${first}-${middle}-${last}`
        }, handleValidate(e));
    }
    else if (input.length > 3) {
      setState(
        {
          ...state,
          [e.target.name]: `${first}-${middle}`
        }, handleValidate(e));
    }
    else if (input.length >= 0) {
      setState(
        {
          ...state,
          [e.target.name]: input
        }, handleValidate(e));
    }
  }

  const convertContactFormat = (e, index) => {
    const value = e.target.value;
    const name = e.target.name
    const input = value.replace(/\D/g, '').substring(0, 10);

    // Divide numbers in 3 parts :"(123) 456-7890" 
    const first = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(0, 3) : input.substring(0, 3);
    const middle = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(3, 6) : input.substring(3, 5);
    const last = name == 'contact_number' || name == 'alternate_contact_number' ? input.substring(6, 10) : input.substring(5, 9);

    if (input.length > (name == 'contact_number' || name == 'alternate_contact_number' ? 6 : 5)) {
      state.emergency_contact[index][e.target.name] = `${first}-${middle}-${last}`
      setState({ ...state }, contactHandleValiadates(e.target))
    }
    else if (input.length > 3) {
      state.emergency_contact[index][e.target.name] = `${first}-${middle}`
      setState({ ...state }, contactHandleValiadates(e.target))
    }
    else if (input.length >= 0) {
      state.emergency_contact[index][e.target.name] = input
      setState({ ...state }, contactHandleValiadates(e.target))
    }
  }

  const handleValidate = (e) => {
    const input = e.target
    switch (input.name || input.tagName) {
      case "first_name":
        error.first_name = validate_charWithSpace(input.value, 'first ');
        break;
      case "middle_name":
        error.middle_name = empty_name(input.value, 'middle ');
        break;
      case "last_name":
        error.last_name = validate_charWithSpace(input.value, 'last ');
        break;
      case 'dob':
        error.dob = validate_emptyField(input.value)
        break
      case 'gender':
        error.gender = validate_emptyField(input.value)
        break
      case 'blood_group':
        error.blood_group = validate_emptyField(input.value)
        break
      case 'marital_status':
        error.marital_status = validate_emptyField(input.value)
        break
      case 'contact_number':
        error.contact_number = validate_usContact(input.value)
        break
      case 'alternate_contact_number':
        error.alternate_contact_number = empty_usContact(input.value)
        break
      case 'email_id':
        error.email_id = validates_emailId(input.value)
        break
      case 'alternate_email_id':
        error.alternate_email_id = empty_Email_id(input.value)
        break
      case 'address_line_one':
        error.address_line_one = validate_emptyField(input.value)
        break
      case 'address_line_two':
        error.address_line_two = validate_emptyField(input.value)
        break
      case 'zip_code':
        error.zip_code = state.country_id == 101 ? validate_zipcode(input.value,101) : validate_zipcode(input.value);
        break
      case 'city':
        error.city = validateAplaSpecialChar(input.value)
        break
      case 'country_id':
        error.country_id = validate_emptyField(input.value)
        break
      case 'state_id':
        error.state_id = validate_emptyField(input.value)
        break
      case 'reference_id':
        error.reference_id = validate_emptyField(input.value)
        break
      case 'date_of_joining':
        error.date_of_joining = validate_emptyField(input.value)
        break
      case 'employment_type_id':
        error.employment_type_id = validate_emptyField(input.value)
        error.role_id = "";
        break
      case 'employment_category_id':
        error.employment_category_id = validate_emptyField(input.value)
        break
      case 'department_id':
        error.department_id = validate_emptyField(input.value);
        break;
      case 'team_id':
        error.team_id = validate_emptyField(input.value);
        break;
      case 'ssn':
        error.ssn = validate_ssn(input.value)
        break
      case 'is_usc':
        error.is_usc = validate_emptyField(input.value)
        break
      case 'reporting_manager_id':
        error.reporting_manager_id = validate_emptyField(input.value)
        break
      case 'visa_type_id':
        error.visa_type_id = validate_emptyField(input.value)
        break
      case 'role_id':
        error.role_id = validate_emptyField(input.value)
        break
      case 'vendor_id':
        error.vendor_id = validate_emptyField(input.value)
        break
      case 'vendor_price':
        error.vendor_price = validate_emptyField(input.value)
        break
      default:
        break
    }
    setError({ ...error })
  }

  const contactHandleValiadates = (e, index) => {
    let input = e;
    // let error1 =
    //   contactError.length > 0
    //     ? contactError
    //       ? contactError[index]
    //       : contactError
    //     : contactError;

    let error1 = contactError[index] || {};

    for (var k = 0; k <= index; k++) {
      contactError.push({});
    }
    let s1 =
      contactError.length > 0 ? [...contactError] : [{ ...contactError }];
    switch (input.name || input.tagName) {
      case "relationship_id":
        error1.relationship_id = validate_emptyField(input.value);
        break;
      case "name":
        error1.name = validate_charWithSpace(input.value);
        break;
      case "contact_number":
        error1.contact_number = validate_usContact(input.value);
        break;
      case "address_1":
        error1.address_1 = validate_emptyField(input.value);
        break;
      case "address_2":
        error1.address_2 = validate_emptyField(input.value);
        break;
      case "city":
        error1.city = validateAplaSpecialChar(input.value);
        break;
      case "state_id":
        error1.state_id = validate_emptyField(input.value);
        break;
      case "country_id":
        error1.country_id = validate_emptyField(input.value);
        break;
      case "zip_code":
        error1.zip_code = state.emergency_contact[index].country_id == 101 ? validate_zipcode(input.value,101) : validate_zipcode(input.value);
        break;
      default:
        break;
    }
    setContactError(s1);
  }

  const validateAll = () => {
    const { first_name, last_name, dob, gender, marital_status, contact_number, employment_type_id, email_id, address_line_one, zip_code, city, country_id, state_id, reference_id, date_of_joining, employment_category_id, ssn,
      is_usc, reporting_manager_id, department_id, team_id, visa_type_id, role_id, vendor_id, vendor_price } = state
    let errors = {};
    errors.first_name = value == 0 ? validate_charWithSpace(first_name, 'first ') : ''
    errors.last_name = value == 0 ? validate_charWithSpace(last_name, 'last ') : '';
    error.visa_type_id = value == 0 ? state.is_usc == 0 ? validate_emptyField(visa_type_id) : '' : ''
    errors.dob = value == 0 ? validate_emptyField(dob) : '';
    errors.gender = value == 0 ? validate_emptyField(gender) : '';
    errors.marital_status = value == 0 ? validate_emptyField(marital_status) : '';
    errors.contact_number = value == 1 ? validate_usContact(contact_number) : '';
    errors.email_id = value == 1 ? validates_emailId(email_id) : '';
    errors.address_line_one = value == 3 ? validate_emptyField(address_line_one) : ''
    errors.zip_code = value == 3 ? validates_Integer(zip_code) : ''
    errors.city = value == 3 ? validate_emptyField(city) : ''
    errors.country_id = value == 3 ? validate_emptyField(country_id) : ''
    errors.state_id = value == 3 ? validate_emptyField(state_id) : ''
    errors.reference_id = value == 4 ? validate_emptyField(reference_id) : ''
    errors.date_of_joining = value == 4 ? validate_emptyField(date_of_joining) : ''
    errors.employment_type_id = value == 4 ? validate_emptyField(employment_type_id) : ''
    errors.employment_category_id = value == 4 ? validate_emptyField(employment_category_id) : ''
    errors.vendor_id = value == 4 ? state.employment_type_id == 3 ? validate_emptyField(vendor_id) : '' : ''
    errors.vendor_price = value == 4 ? state.employment_type_id == 3 ? validates_float(vendor_price) : '' : ''
    errors.ssn = value == 4 ? validate_ssn(ssn) : ''
    errors.is_usc = value == 4 ? validate_emptyField(is_usc) : ''
    errors.reporting_manager_id = value == 4 ? validate_emptyField(reporting_manager_id) : ''
    errors.department_id = value == 4 ? validate_emptyField(department_id) : ''
    errors.team_id = value == 4 ? validate_emptyField(team_id) : ''
    errors.role_id = value == 0 ? employment_type_id == 1 ? validate_emptyField(role_id) : "" : ''
    return errors;
  }

  const contactValidations = () => {
    let errors = {};
    let err = []; // eslint-disable-next-line
    state.emergency_contact.map((value) => {
      errors = {};
      errors.relationship_id = validate_emptyField(value.relationship_id);
      errors.name = validate_charWithSpace(value.name);
      errors.contact_number = validate_usContact(value.contact_number);
      errors.address_1 = validate_emptyField(value.address_1);
      errors.state_id = validate_emptyField(value.state_id);
      errors.country_id = validate_emptyField(value.country_id);
      errors.city = validateAplaSpecialChar(value.city);
      errors.zip_code = validates_Integer(value.zip_code);
      err.push(errors);
    });
    return err;
  };

  const saveasDraft = () => {
    let errors = validateAll();
    if (isValid(errors)) {
      if (mainStep === 0) {
        state['drafted_stage'] = "Documents"
        setState({ ...state })
      } else if (mainStep === 1) {
        state['drafted_stage'] = "Pay Configuration"
        setState({ ...state })
      } else {
        state['drafted_stage'] = " "
        setState({ ...state })
      }
      state['role_id'] = 1
      OnBoardApi.employeeStore(state, LocalStorage.getAccessToken()).then((res) => {
        if (res.data.statusCode === 1003) {
          LocalStorage.setEmployeeId(res.data.data[0].id);
          LocalStorage.setFullName(`${state.first_name}${state.last_name}`)
          // addSuccessMsg(`General Details of ${state.first_name}${state.last_name} Added SuccessFully`);
          navigate('/employees')
          employeesList()
        } else {
          addErrorMsg(res.data.message);
        }
      })
    }
    // addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
    // setOpen(false)

  }

  const handleSubmit = () => {
    // if (value == 4) {
    //   setMainStep(1);
    //   setValue(value + 1);
    //   setSubstepper(subStepper + 1)
    // } else {
    //   setValue(value + 1);
    //   setSubstepper(subStepper + 1)
    // }
    let errors = validateAll();
    let contactErrors = contactValidations();
    if (value == 2) {
      if (isValidMulti(contactErrors)) {
        setValue(value + 1);
        setSubstepper(subStepper + 1)
      } else {
        let s2 = { contactError };
        s2 = contactErrors;
        setContactError(s2);
        addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
      }
    } else {
      if (isValid(errors)) {
        if (value == 4) {
          state['role_id'] = 1
          OnBoardApi.employeeStore(state, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
              LocalStorage.setEmployeeId(res.data.data[0].id);
              LocalStorage.setFullName(`${state.first_name}${state.last_name}`)
              addSuccessMsg(`General Details of ${state.first_name}${state.last_name} Added SuccessFully`);
              setMainStep(1);
              setDocStepper(1);
              setSubstepper(1);
            } else {
              addErrorMsg(res.data.message);
            }
          })
        } else {
          setValue(value + 1);
          setSubstepper(subStepper + 1);
        }
      } else {
        let s1 = { error }
        s1 = errors
        setError(s1);
        addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
      }
    }
  }

  const back = () => {
    setValue(value - 1);
    setSubstepper(subStepper - 1);
  }

  const countriesList = () => {
    CommonApi.getCountryList('', LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setCountries(res.data.data);
      }
    })
  }

  const statesList = (id,index) => {
    CommonApi.getStatesList(id, LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        if(index === 0){
          setemergencyState1(res.data.data)
        }
        else if(index === 1){
          setemergencyState2(res.data.data)
        }
        else{
          setStates(res.data.data);
        }
      }
    })
  }

  const departmentList = () => {
    CommonApi.departmentList(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setDepartment(res.data.data);
      }
    })
  }

  const employmentList = () => {
    CommonApi.employmentTypesList(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setEmploymentType(res.data.data);
      }
    })
  }

  const getRolesDropdown = () => {
    let search = "";
    CommonApi.rolesDropdown(search).then((response) => {
      if (response.data.statusCode == 1003) {
        setRolesList(response.data.data);
      } else {
        addErrorMsg(response.data.message);
      }
    });
  }

  const categoryList = () => {
    CommonApi.CategoryList(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setCategory(res.data.data);
      }
    })
  }

  const employeeTeamList = () => {
    CommonApi.employeeTeam(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setEmpTeam(res.data.data);
      }
    })
  }

  const relationList = () => {
    CommonApi.relation(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setRelation(res.data.data);
      }
    })
  }

  const employeesList = () => {
    CommonApi.employees(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setEmployees(res.data.data);
      }
    })
  }

  const visaListApi = () => {
    CommonApi.visaTypes(LocalStorage.uid(), LocalStorage.getAccessToken()).then((res) => {
      if (res.data.statusCode === 1003) {
        setVisaList(res.data.data);
      }
    })
  }

  const vendorDropdown = () => {
    ClientsApi.dropdown('vendor').then((response) => {
      if (response.data.statusCode == 1003) {
        setVendorList(response.data.data);
      }
    });
  };

  const employeeID = (args) => {
    CommonApi.prefix(args == 1 ? 'employee' : 'consultant-contractor').then((res) => {
      if (res.data.statusCode === 1003) {
        state.employment_type_id = args
        state.reference_id = res.data.data
        state.role_id = ""
        setState({ ...state, })
      }
    })
  }

  return (
    <Grid container justifyContent='center'>
      <Grid item container lg={7} p={'20px 0px 0px 0px'} justifyContent='center' position='fixed' zIndex='1000' sx={{ background: '#FFFFFF' }}>
        <Grid item lg={11} textAlign='center' p={'10px 0px 10px 0px !important'}>
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
        </Grid>
        {/* <Grid item lg={10} textAlign='center' p={'30px 0px 25px 0px !important'}> */}
        {
          mainStep == 0 ?
            <Grid item lg={10} textAlign='center' p={'30px 0px 25px 0px !important'}>
              <Stepper activeStep={subStepper} connector={<BrownMnCustomisedConnector />}>
                {
                  subStepperList.map((item) => (
                    <Step>
                      <BrownMnColorlibStepLabel StepIconComponent={AddEmpSubStepper}>
                        <Text BrowmnMnStepperText>{item}</Text>
                      </BrownMnColorlibStepLabel>
                    </Step>
                  ))
                }
              </Stepper>
            </Grid> :
            mainStep == 1 ?
              <Grid item lg={10} textAlign='center' p={'30px 0px 25px 0px !important'}>
                <Stepper activeStep={docStepper} connector={<BrownMnCustomisedConnector />}>
                  {
                    contactSubStepperList.map((item) => (
                      <Step>
                        <BrownMnColorlibStepLabel StepIconComponent={AddEmpCont}>
                          <Text BrowmnMnStepperText>{item}</Text>
                        </BrownMnColorlibStepLabel>
                      </Step>
                    ))
                  }
                </Stepper>
              </Grid> : ''
        }
        {/* </Grid> */}
      </Grid>
      {
        mainStep == 0 ?
          <Grid item container lg={12} justifyContent='center' pt={14}>
            <Grid item lg={5.7}>

              {
                mainStep == 0 &&
                <SwipeableViews index={value} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} onChangeIndex={handleChangeIndex}>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <Card sx={{ padding: '10px !important', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                      <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                        <Text largeBlack>{value == 0 ? 'Basic Details' : value == 1 ? 'Contact Details' : value == 2 ? 'Emergency Contact Details' : value == 3 ? 'Current Address' : value == 4 ? 'Employment Details' : ''}</Text>
                      } />
                      <CardContent sx={{ padding: '20px 0px 30px 30px !important' }}
                      >
                        <Grid container lg={12} spacing={2} columnSpacing={3}>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'first_name',
                                value: state.first_name
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>First Name</Text>}
                            />
                            {
                              error.first_name ?
                                <Text red>{error.first_name ? error.first_name : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'middle_name',
                                value: state.middle_name
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Middle Name<span className={classes.optional}>(Optional)</span></Text>}
                            />
                            {
                              error.middle_name ?
                                <Text red>{error.middle_name ? error.middle_name : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'last_name',
                                value: state.last_name
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Last Name</Text>}
                            />
                            {
                              error.last_name ?
                                <Text red>{error.last_name ? error.last_name : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}></Grid>
                          <Grid item lg={6}>
                            <Box pt={'10px'}>
                              <Date
                                labelText={<Text largeLabel>Date of Birth</Text>}
                                name='dob'
                                value={state.dob}
                                onChange={(value => dateChange(value, 'dob'))}
                                height='56px'
                                maxDate={moment().subtract(18, "years")}
                              />
                            </Box>
                            {
                              error.dob ?
                                <Text red>{error.dob ? error.dob : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Box pt={'10px'}>
                              <CustomSelect name='gender' value={state.gender} commonSelect onChange={changeHandler} label={<Text largeLabel>Gender</Text>} options={genderList} />
                            </Box>
                            {
                              error.gender ?
                                <Text red>{error.gender ? error.gender : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Box pt={'8px'}>
                              <SearchSelect
                                name='blood_group'
                                value={state.blood_group}
                                onChange={changeHandler}
                                options={bloodGroups}
                                labelText={<Text largeLabel>Blood Group<span className={classes.optional}>(Optional)</span></Text>}
                              />
                            </Box>
                          </Grid>
                          <Grid item lg={6}>
                            <Box pt={'8px'}>
                              {/* <SearchSelect
                                name='marital_status'
                                value={state.marital_status}
                                onChange={changeHandler}
                                options={maritalList}
                                labelText={<Text largeLabel>Marital Status</Text>}
                              /> */}
                              <CustomSelect name='marital_status' value={state.marital_status} commonSelect onChange={changeHandler} label={<Text largeLabel>Marital Status</Text>} options={maritalList} />

                            </Box>
                            {
                              error.marital_status ?
                                <Text red>{error.marital_status ? error.marital_status : ''}</Text> : ''
                            }
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <Card sx={{ padding: '20px !important', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                      <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                        <Text largeBlack>{value == 0 ? 'Basic Details' : value == 1 ? 'Contact Details' : value == 2 ? 'Emergency Contact Details' : value == 3 ? 'Current Address' : value == 4 ? 'Employment Details' : ''}</Text>
                      } />
                      <CardContent sx={{ padding: '20px 0px 30px 30px !important' }}
                      >
                        <Grid container lg={12} spacing={3} alignItems='center'>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'contact_number',
                                value: state.contact_number,
                                inputProps: { maxLength: 12 }
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Mobile Number</Text>}
                            />
                            {
                              error.contact_number ?
                                <Text red>{error.contact_number ? error.contact_number : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'alternate_contact_number',
                                value: state.alternate_contact_number,
                                inputProps: { maxLength: 12 }
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Alternate Mobile Number<span className={classes.optional}>(Optional)</span></Text>}
                            />
                            {
                              error.alternate_contact_number ?
                                <Text red>{error.alternate_contact_number ? error.alternate_contact_number : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'email_id',
                                value: state.email_id
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Email ID</Text>}
                            />
                            {
                              error.email_id ?
                                <Text red>{error.email_id ? error.email_id : ''}</Text> : ''
                            }
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'alternate_email_id',
                                value: state.alternate_email_id
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Alternate Email ID<span className={classes.optional}>(Optional)</span></Text>}
                            />
                            {
                              error.alternate_email_id ?
                                <Text red>{error.alternate_email_id ? error.alternate_email_id : ''}</Text> : ''
                            }
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </TabPanel>
                  <TabPanel value={value} index={2} dir={theme.direction}>
                    <Card sx={{ padding: '15px !important', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                      <CardHeader sx={{ padding: '10px 0px 0px 29px !important' }} title={
                        <Text largeBlack>{value == 0 ? 'Basic Details' : value == 1 ? 'Contact Details' : value == 2 ? 'Emergency Contact Details' : value == 3 ? 'Current Address' : value == 4 ? 'Employment Details' : ''}</Text>
                      } />
                      <CardContent sx={{ padding: '20px 20px 30px 30px !important' }}
                      >
                        {
                          state.emergency_contact.map((item, index) => (
                            <Grid container lg={12} spacing={2} p={index > 0 ? '30px 0px' : ''}>
                              {
                                index > 0 &&
                                <>
                                  <Grid item container lg={12} md={12} sm={12} xs={12}>
                                    <Grid item lg={8} md={8} sm={8} xs={10}>
                                      <Text largeBlack>Emergency Contact Details -{index + 1}</Text>
                                    </Grid>
                                    {
                                      index > 1 &&
                                      <Grid item lg={4} md={4} sm={4} xs={2} textAlign='end'>
                                        <img src={minus} alt='Minus' style={{ cursor: 'pointer' }} onClick={() => addContact('Remove', index)} />
                                      </Grid>
                                    }
                                  </Grid><Divider sx={{ width: '100%', color: '#C7CCD3 !important', margin: '10px' }} />
                                </>
                              }
                              <Grid item lg={6}>
                                <Input
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    name: 'name',
                                    value: item.name
                                  }}
                                  handleChange={(e) => changeHandler(e, index, 'contact')}
                                  clientInput
                                  labelText={<Text largeLabel>Name</Text>} />
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].name : ""}</Text> : ''}
                              </Grid>
                              <Grid item lg={6}>
                                <Input
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    name: 'contact_number',
                                    value: item.contact_number,
                                    inputProps: { maxLength: 12 }
                                  }}
                                  handleChange={(e) => changeHandler(e, index, 'contact')}
                                  clientInput
                                  labelText={<Text largeLabel>Mobile Number</Text>} />
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].contact_number : ""}</Text> : ''}
                              </Grid>
                              <Grid item lg={6}>
                                <Box pt={'10px'}>
                                  <SearchSelect
                                    name='relationship_id'
                                    value={state.relationship_id}
                                    onChange={(e) => changeHandler(e, index, 'contact')}
                                    options={relation}
                                    labelText={<Text largeLabel>Relation</Text>}
                                  />
                                </Box>
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].relationship_id : ""}</Text> : ''}
                              </Grid>
                              <Grid item lg={6} >
                                <Box pt={'10px'}>
                                  <Input
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      name: 'email_id',
                                      value: item.email_id,
                                    }}
                                    handleChange={(e) => changeHandler(e, index, 'contact')}
                                    clientInput
                                    labelText={<Text largeLabel>Email ID<span className={classes.optional}>(Optional)</span></Text>} />
                                </Box>

                              </Grid>
                              <Grid item container lg={12} spacing={2}>
                                <Grid item lg={12}>
                                  <Input
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      name: 'address_1',
                                      value: item.address_1
                                    }}
                                    handleChange={(e) => changeHandler(e, index, 'contact')}
                                    clientInput
                                    labelText={<Text largeLabel>Address Line-1</Text>} />
                                  {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].address_1 : ""}</Text> : ''}
                                </Grid>
                                <Grid item lg={12}>
                                  <Input
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      name: 'address_2',
                                      value: item.address_2
                                    }}
                                    handleChange={(e) => changeHandler(e, index, 'contact')}
                                    clientInput
                                    labelText={<Text largeLabel>Address Line-2<span className={classes.optional}>(Optional)</span></Text>} />
                                </Grid>
                              </Grid>
                              <Grid item lg={6}>
                                <Box pt={'10px'}>
                                  <SearchSelect
                                    name='country_id'
                                    value={item.country_id}
                                    onChange={(e) => changeHandler(e, index, 'contact')}
                                    options={countries}
                                    labelText={<Text largeLabel>Country</Text>}
                                  />
                                </Box>
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].country_id : ""}</Text> : ''}
                              </Grid>
                              <Grid item lg={6}>
                                <Box pt={'10px'}>
                                  <SearchSelect
                                    name='state_id'
                                    value={item.state_id}
                                    onChange={(e) => changeHandler(e, index, 'contact')}
                                    options={index === 0 ? emergencyState1 : emergencyState2}
                                    labelText={<Text largeLabel>State</Text>}
                                  />
                                </Box>
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].state_id : ""}</Text> : ''}
                              </Grid>
                              <Grid item lg={6}>
                                <Input
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    name: 'city',
                                    value: item.city
                                  }}
                                  handleChange={(e) => changeHandler(e, index, 'contact')}
                                  clientInput
                                  labelText={<Text largeLabel>City</Text>} />
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].city : ""}</Text> : ''}
                              </Grid>
                              <Grid item lg={6}>
                                <Input
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    name: 'zip_code',
                                    value: item.zip_code,
                                    inputProps: { minLength: 4, maxLength: 10 }
                                  }}
                                  handleChange={(e) => changeHandler(e, index, 'contact')}
                                  clientInput
                                  labelText={<Text largeLabel>Zipcode</Text>} />
                                {contactError.length > 0 ? <Text red>{contactError[index] ? contactError[index].zip_code : ""}</Text> : ''}
                              </Grid>
                            </Grid>
                          ))
                        }
                        <Grid item lg={12} md={12} sm={12} xs={12} m={'35px 0px 0px 0px !important'}>
                          <Button lightBlue onClick={() => addContact('Add')}>Add New Contact</Button>
                        </Grid>
                      </CardContent>
                    </Card>
                  </TabPanel>
                  <TabPanel value={value} index={3} dir={theme.direction}>
                    <Card sx={{ padding: '20px !important', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                      <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                        <Text largeBlack>{value == 0 ? 'Basic Details' : value == 1 ? 'Contact Details' : value == 2 ? 'Emergency Contact Details' : value == 3 ? 'Current Address' : value == 4 ? 'Employment Details' : ''}</Text>
                      } />
                      <CardContent sx={{ padding: '20px 0px 30px 30px !important' }}
                      >
                        <Grid container lg={12} spacing={3}>
                          <Grid item lg={12}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'address_line_one',
                                value: state.address_line_one
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Address Line 1</Text>}
                            />
                            {error.address_line_one && <Text red>{error.address_line_one ? error.address_line_one : ''}</Text>}
                          </Grid>
                          <Grid item lg={12}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'address_line_two',
                                value: state.address_line_two
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Address Line 2<span className={classes.optional}>(Optional)</span></Text>}
                            />
                          </Grid>
                          <Grid item lg={6}>
                            <Box pt={"10px"}>
                              <SearchSelect
                                name='country_id'
                                value={state.country_id}
                                onChange={changeHandler}
                                options={countries}
                                labelText={<Text largeLabel>Country</Text>}
                              />
                            </Box>
                            {error.country_id && <Text red>{error.country_id ? error.country_id : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <Box pt={"10px"}>
                              <SearchSelect
                                name='state_id'
                                value={state.state_id}
                                onChange={changeHandler}
                                options={states}
                                labelText={<Text largeLabel>State</Text>}
                              />
                            </Box>
                            {error.state_id && <Text red>{error.state_id ? error.state_id : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'city',
                                value: state.city
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>City</Text>}
                            />
                            {error.city && <Text red>{error.city ? error.city : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'zip_code',
                                value: state.zip_code,
                                disabled: state.country_id === ''
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Zipcode</Text>}
                            />
                            {error.zip_code && <Text red>{error.zip_code ? error.zip_code : ''}</Text>}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </TabPanel>
                  <TabPanel value={value} index={4} dir={theme.direction}>
                    <Card sx={{ padding: '20px !important', boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important", borderRadius: '15px' }}>
                      <CardHeader sx={{ padding: '15px 0px 0px 25px !important' }} title={
                        <Text largeBlack>{value == 0 ? 'Basic Details' : value == 1 ? 'Contact Details' : value == 2 ? 'Emergency Contact Details' : value == 3 ? 'Current Address' : value == 4 ? 'Employment Details' : ''}</Text>
                      } />
                      <CardContent sx={{ padding: '20px 0px 30px 30px !important' }}
                      >
                        <Grid container lg={12} spacing={3}>
                          <Grid item lg={6}>
                            <SearchSelect
                              name='employment_type_id'
                              value={state.employment_type_id}
                              options={employmentType}
                              onChange={changeHandler}
                              labelText={<Text largeLabel>Employment Type</Text>}
                            />
                            {error.employment_type_id && <Text red>{error.employment_type_id ? error.employment_type_id : ''}</Text>}
                          </Grid>

                          {
                            state.employment_type_id == 1 ?
                              <Grid item lg={6}>
                                <SearchSelect
                                  name='role_id'
                                  value={state.role_id}
                                  options={rolesList}
                                  onChange={changeHandler}
                                  labelText={<Text largeLabel>Role</Text>}
                                />
                                {error.role_id && <Text red>{error.role_id ? error.role_id : ''}</Text>}
                              </Grid> : null
                          }

                          <Grid item lg={6}>
                            <SearchSelect
                              name='employment_category_id'
                              value={state.employment_category_id}
                              options={category}
                              onChange={changeHandler}
                              labelText={<Text largeLabel>Employment Catogery</Text>}
                            />
                            {error.employment_category_id && <Text red>{error.employment_category_id ? error.employment_category_id : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'reference_id',
                                value: state.reference_id
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>Employee ID</Text>}
                            />
                            {error.reference_id && <Text red>{error.reference_id ? error.reference_id : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            {/* <Box pt={'9px'}> */}
                            <Date
                              labelText={<Text largeLabel>Joining Date</Text>}
                              name='date_of_joining'
                              value={state.date_of_joining}
                              onChange={(value => dateChange(value, 'date_of_joining'))}
                              height='56px'
                            />
                            {/* </Box> */}
                            {error.date_of_joining && <Text red>{error.date_of_joining ? error.date_of_joining : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <SearchSelect
                              name='department_id'
                              value={state.department_id}
                              options={Department}
                              onChange={changeHandler}
                              labelText={<Text largeLabel>Department</Text>}
                            />
                            {error.department_id && <Text red >{error.department_id ? error.department_id : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <SearchSelect
                              name='team_id'
                              value={state.team_id}
                              options={empTeam}
                              onChange={changeHandler}
                              labelText={<Text largeLabel>Employee Team</Text>}
                            />
                            {error.team_id && <Text red>{error.team_id ? error.team_id : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            <Input
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: 'ssn',
                                value: state.ssn,
                                inputProps: { maxLength: 11 }
                              }}
                              handleChange={changeHandler}
                              clientInput
                              labelText={<Text largeLabel>SSN</Text>}
                            />
                            {error.ssn && <Text red>{error.ssn ? error.ssn : ''}</Text>}
                          </Grid>
                          <Grid item lg={6}>
                            {/* <Box pt={'10px'}> */}
                            <CustomSelect name='is_usc' commonSelect value={state.is_usc} options={IsEmpUSA} onChange={changeHandler} label={<Text largeLabel>Is the Employee USC? </Text>} />
                            {/* </Box> */}
                            {error.is_usc && <Text red>{error.is_usc ? error.is_usc : ''}</Text>}
                          </Grid>
                          {
                            state.is_usc == 0 &&
                            <Grid item lg={6}>
                              {/* <Box pt={'9px'}> */}
                              <SearchSelect
                                name='visa_type_id'
                                value={state.visa_type_id}
                                options={visaList}
                                onChange={changeHandler}
                                labelText={<Text largeLabel>Visa Type</Text>}
                              />
                              {/* </Box> */}
                              {error.visa_type_id && <Text red>{error.visa_type_id ? error.visa_type_id : ''}</Text>}
                            </Grid>
                          }
                          <Grid item lg={6}>
                            {/* <Box pt={'9px'}> */}
                            <SearchSelect
                              name='reporting_manager_id'
                              value={state.reporting_manager_id}
                              options={employees}
                              onChange={changeHandler}
                              labelText={<Text largeLabel>Reporting Manager</Text>}
                            />
                            {/* </Box> */}
                            {error.reporting_manager_id && <Text red>{error.reporting_manager_id ? error.reporting_manager_id : ''}</Text>}
                          </Grid>
                          {
                            state.employment_type_id == 3 &&
                            <Grid item container spacing={2}>
                              <Grid item lg={6}>
                                <SearchSelect
                                  name='vendor_id'
                                  value={state.vendor_id}
                                  options={vendorList}
                                  onChange={changeHandler}
                                  labelText={<Text largeLabel>Vendor Name</Text>} />
                                {error.vendor_id && <Text red>{error.vendor_id ? error.vendor_id : ''}</Text>}
                              </Grid>
                              <Grid item lg={6}>
                                <Input
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    name: 'vendor_price',
                                    value: state.vendor_price,
                                  }}
                                  handleChange={changeHandler}
                                  clientInput
                                  labelText={<Text largeLabel>Vendor Price/Hr</Text>} />
                                {error.vendor_price && <Text red>{error.vendor_price ? error.vendor_price : ''}</Text>}
                              </Grid>
                            </Grid>
                          }
                          <Grid item lg={12}>
                            <Box display='flex' flexDirection='row' gap={2} alignItems='center'>
                              <Checkbox name='enable_login' value={state.enable_login} checked={state.enable_login === 1 ? true : false} onChange={changeHandler} sx={{ padding: '0px !important' }} />
                              <Text mediumBlack>Enable User Access</Text>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </TabPanel>
                </SwipeableViews>
              }
              {/* </CardContent>
              </Card> */}
              <Grid item container pt={4} pb={4}>
                {
                  value > 0 &&
                  <Grid item lg={6}>
                    <Button blackCancel onClick={back}>Back</Button>
                  </Grid>
                }
                <Grid item lg={value == 0 ? 12 : 6} textAlign='end'>
                  {
                    value == 4 && <Button disabled={state.reporting_manager_id === ""} saveAsDraft sx={{ marginRight: '15px' }} onClick={() => setOpen(true)}>Save as Draft</Button>
                  }
                  <Button saveNcontinue onClick={handleSubmit}>Save & Continue</Button>
                </Grid>
              </Grid>
              {
                open &&
                <ReusablePopup openPopup={open} setOpenPopup={setOpen} crossIcon iconHide white>
                  <Box textAlign='center' p={'0px 20px'}>
                    <img src={draft} alt='draft' style={{ height: '130px', width: '150px' }} />
                    <Text veryLargeLabel>Save as Draft!</Text>
                    <Text mediumLabel sx={{ paddingTop: '20px' }}>Your progress will be saved, and you will be able to<br /> continue from the next stage when you return.</Text>
                    <Button blueButton sx={{ marginTop: '20px' }} onClick={saveasDraft}>Done</Button>
                  </Box>
                </ReusablePopup>
              }
            </Grid>
          </Grid> :
          mainStep == 1 ?
            <Documents docStepper={docStepper} setDocStepper={setDocStepper} mainStep={mainStep} setMainStep={setMainStep} setSubstepper={setSubstepper} setValueMain={setValue} /> :
            mainStep == 2 ?
              <BankDetails mainStep={mainStep} setMainStep={setMainStep} setValue={setValue} value={value} setDocStepper={setDocStepper} docStepper={docStepper} />
              : ''
      }
    </Grid>
  )
}

export default OnboardEmployee