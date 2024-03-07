import React from "react";
const namesValidator = RegExp(/^[a-zA-z]*[a-zA-Z]{1,50}$/);
const numberValidator = new RegExp(/^[0-9]{10}$/);
const usMobileNumberValidator = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);
const contactNumberValidator = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);
const ssnValidator = new RegExp(/^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/);
const integerValidator = new RegExp(/^[0-9\b]+$/);
const extension = new RegExp(/^[0-9\b]+$/);
const integerdecimal = new RegExp(/^[0-9.\b]+$/);
const alpaNumericwithreqchar = new RegExp(/^[a-zA-Z0-9,./& ]+$/) // Alpha numeric with /,.&
const emailValidator = new RegExp(
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
);
const passwordValidator = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
var pattern = new RegExp("^[a-zA-Z]+$");
var charWithSpace = new RegExp(/^[a-zA-Z ]+$/);
var alphaSpecialCharacters = new RegExp(/^[a-zA-Z!@#()$%^_&\-* ]+$/);
var alphaSpecialCharacterswithNumber = new RegExp(/^[a-zA-Z0-9!@#$%^_&\-* ]+$/);
var alphaNumeric = new RegExp(/^[a-zA-Z0-9 ]+$/); // Alpha numeric with Spaces
var alphaNumericSplcharacters = new RegExp(/^[a-zA-Z0-9 :-]+$/); // Alpha numeric with Spaces and ":", "-"
var alphaNumericWithoutSpace = new RegExp(/^[a-zA-Z0-9]+$/);
var WithCharDigits = new RegExp(/^[a-zA-Z0-9@./#&+-_ ]*$/);
var Charpattern = new RegExp("^[a-zA-Z0-9]+$");
var datePattern = new RegExp("^[0-9_./#&+-]+$");
var WithChar = new RegExp("^[A-Za-z0-9_@./#&+-]+$");
var floatPattern = new RegExp("^-?\\d+(\\.\\d+)*$");
var alphaNumericWithSpace = new RegExp(/^[a-zA-Z0-9 ]+$/);
var hours_format = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
var ProjectValidation = new RegExp(/^[a-zA-Z0-9-()/ ]+$/);
var float = new RegExp(/^\d*\.?\d{0,2}$/);
// var passportPattern = new RegExp("/^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/");

export const isValidMulti = (errors) => {
  let keys = [];
  // eslint-disable-next-line
  errors.map((value) => {
    let key = Object.keys(value);
    keys.push(key);
  });
  let count;
  // eslint-disable-next-line
  keys.map((value) => {
    // eslint-disable-next-line
    errors.map((response) => {
      count = value.reduce((acc, curr) => (response[curr] ? acc + 1 : acc), 0);
    });
  });
  return count == 0;
};

/*currency name validation*/
export const validate_emptyField = (value) =>
  value === "" || value == null ? "This field is required" : "";

export const hours_pattern_time = (value1) =>
  value1 == "" || value1 == null
    ? "This field is required"
    : !hours_format.test(value1)
      ? "Please enter only numbers"
      : "";

export const validate_toHours = (value1, value2) =>
  value1 == "" || value1 == null
    ? "This field is required"
    : !integerValidator.test(value1)
      ? "Please enter only numbers"
      : Number(value2) >= Number(value1)
        ? "Please enter value greater than the from hours"
        : "";

export const validate_Extension = (value1) =>
  value1 == "" || value1 == null
    ? "This field is required"
    : !extension.test(value1)
      ? "Please enter only numbers"
      : "";

/* errors valid */
export const isValid = (errors) => {
  let keys = Object.keys(errors);
  let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
  return count == 0;
};

/*Validation for users functions starts here*/

export const validates_password = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !passwordValidator.test(value)
      ? passwordList()
      : "";

export const validates_emptyArray = (value) =>
  value.length <= 0
    ? "This field is required"
    : "";

export const validate_passport = (value) =>
  value.length >= 15 ? "" :
    !alphaNumeric.test(value)
      ? 'Please enter valid Passport Number' : '';

export const validate_i94 = (value) =>
  value.length >= 11 ? "" :
    !alphaNumeric.test(value)
      ? 'Please enter valid I-94 Number' : '';

export const validate_vissa = (value) =>
  value.length >= 10 ? "" :
    !alphaNumeric.test(value)
      ? 'Please enter valid Vissa Number' : '';

export const validate_fieldCharacters = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !namesValidator.test(value)
      ? "Please enter only charcters"
      : "";

export const validate_charWithSpace = (value, args) =>
  value == "" || value == null
    ? "This field is required"
    : !charWithSpace.test(value)
      ? `Please enter valid ${args ? args : ''}name`
      : "";
export const aphaNumericwithreqChar = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alpaNumericwithreqchar.test(value)
      ? "Please enter valid name"
      : "";
export const validate_alphaSpecialCharacterswithNumber = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alphaSpecialCharacterswithNumber.test(value)
      ? "Please enter valid name"
      : "";

export const validateAplaSpecialChar = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alphaSpecialCharacters.test(value)
      ? "Please enter valid name"
      : "";

export const validate_alphaNumeric = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alphaNumeric.test(value)
      ? "Please enter valid name" : '';

export const validate_handle_alphaNumeric = (value) =>
  value == "" || value == null
    ? ""
    : !alphaNumeric.test(value)
      ? "Please enter valid name" : '';

export const validate_project_name = (value) =>
  value == "" || value == null
    ? ""
    : !ProjectValidation.test(value)
      ? "Please enter valid name" : '';

export const validate_alphaNumeWithoutSpace = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alphaNumericWithoutSpace.test(value)
      ? "Please enter valid name" : '';

export const validate_withCharDigit = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !WithCharDigits.test(value)
      ? "Please enter valid data"
      : "";

export const validate_ssn = (value) =>
  // value == '' || value == null
  //   ? 'This field is required'
  //   : 
  value.length >= 11 ? "" :
    !ssnValidator.test(value)
      ? 'Please enter ssn format' : '';

export const validate_usContact = (value) =>
  value == '' || value == null
    ? 'This field is required'
    : !usMobileNumberValidator.test(value)
      ? 'Please enter valid mobile number' : '';

export const validate_contact_number = (value, msg) =>
  value == '' || value == null
    ? 'This field is required'
    : !contactNumberValidator.test(value)
      ? `Please enter valid ${msg}` : '';

export const validate_optional_contact = (value) =>
  value && !usMobileNumberValidator.test(value)
    ? 'Please enter a valid Phone number'
    : '';

export const validates_emailId = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !emailValidator.test(value)
      ? "Please enter valid email"
      : "";

export const validates_date = (value) =>
  value == "" || value == null
    ? "This field id required"
    : !datePattern.test(value)
      ? "Please enter valid date"
      : "";

export const validates_contact = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !numberValidator.test(value)
      ? 'Please Enter valid phone number' : '';

export const validates_contact_number = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !numberValidator.test(value)
      ? 'Please Enter valid number' : '';

/*Validation functions end here*/

export const validate_Name = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !pattern.test(value)
      ? "Please Enter valid name"
      : "";

export const validate_Char = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !Charpattern.test(value)
      ? "Please Enter valid name"
      : "";
export const validates_Integer = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !integerValidator.test(value)
      ? "Please enter valid numbers"
      : "";

export const validateDecimalInteger = (value) =>
  value == '' || value == null ?
    "This field is Required" : !integerdecimal.test(value) ? "Please enter valid numbers"
      : "";

export const validate_withchar = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !WithChar.test(value)
      ? "Please Enter valid characters"
      : "";

export const validate_date = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !datePattern.test(value)
      ? "Please Enter valid date"
      : "";

export const validate_selectField = (targetName, error) => {
  // eslint-disable-next-line
  let clearObj = new Object();
  Object.keys(error).forEach(function (index, value) {
    if (index == targetName) {
      clearObj[index] = "";
    } else {
      clearObj[index] = error[index];
    }
  });
  return clearObj;
}

export const float_validation = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !float.test(value)
      ? "Please enter valid numbers"
      : "";

export const validates_float = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !floatPattern.test(value)
      ? "Please enter valid numbers"
      : "";
export const validates_handlechange_float = (value) =>
  value == "" || value == null
    ? ""
    : !floatPattern.test(value)
      ? "Please enter valid number"
      : "";

export const passwordList = () => {
  return (
    <div>
      <ul>
        password must contain
        <li>one special character</li>
        <li>one upper and lower case letters and</li>
        <li>one digit</li>
      </ul>
    </div>
  );
}

// // Mobile Validation for US pattern  //
// export const phoneNumberValidation = function (value) {
//   let input = value.replace(/\D/g, '');
//   input = input.substring(0, 10);
//   var size = input.length;
//   if (size == 0) {
//     // eslint-disable-next-line
//     input = input;
//   } else if (size < 4) {
//     input = '-' + input;
//   } else if (size < 7) {
//     input = input.substring(0, 3) + '-' + input.substring(3, 6);
//   } else {
//     input = input.substring(0, 3) + '-' + input.substring(3, 6) + '-' + input.substring(6, 10);
//   }
//   return input;
// }

export const onCharactersOnlyChange = (event) => {
  var regex = new RegExp("^[a-zA-Z ]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
    event.preventDefault();
    return false;
  }
}

export const onNumberOnlyChange = (event) => {
  const keyCode = event.keyCode || event.which
  const keyValue = String.fromCharCode(keyCode)
  const isValid = new RegExp('[0-9]').test(keyValue)
  if (!isValid) {
    event.preventDefault()
    return
  }
}
export const onNumberWithDecimalOnlyChange = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Check if the entered value is '0' and not part of a larger number
  const isZeroNotAllowed = keyValue === '0' && event.target.value === '';

  // Check if the entered value is a valid digit or a decimal point
  const isValid = new RegExp('^[0-9.]+$').test(keyValue);

  if (!isValid || isZeroNotAllowed) {
    event.preventDefault();
    return;
  }
};


export const onFloatOnlyChange = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);
  // Check if the key pressed is a number or a decimal point
  if (!/^-?\d*\.?\d{0,2}$/.test(event.target.value + keyValue)) {
    event.preventDefault();
  }
}

export const validate_alphaNumeric_Splcharacters = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alphaNumericSplcharacters.test(value)
      ? "Please enter valid name" : '';

export const validate_city = (value) =>
  value == "" || value == null
    ? "This field is required"
    : !alphaNumericWithSpace.test(value)
      ? "Please enter valid name" : '';

export const validate_zipcode = (value, country) =>
  value == '' ? 'This field is required' :
    country == 101 && value.length !== 6 ?
      "Please Enter Valid Pincode" :
      country !== 101 && value.length !== 5 ?
        "Please Enter Valid Zipcode" :
        !integerValidator.test(value)
          ? `Please enter Valid ${country == 101 ? 'Pincode' : 'Zipcode'}` : ''

export const empty_Email_id = (value) =>
  value == "" || value == null
    ? ""
    : !emailValidator.test(value)
      ? "Please enter valid email"
      : "";

export const empty_zipcode = (value, country) =>
  value == '' ? '' :
    country == 101 && value.length !== 6 ?
      "Please Enter Valid Pincode" :
      country !== 101 && value.length !== 5 ?
        "Please Enter Valid Zipcode" :
        !integerValidator.test(value)
          ? `Please enter Valid ${country == 101 ? 'Pincode' : 'Zipcode'}` : ''

export const empty_usContact = (value, name) =>
  value == '' || value == null
    ? ''
    : !usMobileNumberValidator.test(value)
      ? `Please enter valid ${name}` : '';

export const empty_city = (value) =>
  value == "" || value == null
    ? ""
    : !alphaNumericWithSpace.test(value)
      ? "Please enter valid name" : '';


export const empty_name = (value, args) =>
  value == "" || value == null
    ? ""
    : !charWithSpace.test(value)
      ? `Please enter valid ${args ? args : ''}name`
      : "";

export const empty_integer = (value) =>
  value == "" || value == null
    ? ""
    : !integerValidator.test(value)
      ? "Please enter only numbers"
      : "";

export const validate_annual_pay = (value) =>
  value == "" || value == null
    ? "This field is required"
    : value == 0 ?
      "Value Should be greater than 0"
      : !floatPattern.test(value)
        ? "Please enter valid numbers"
        : "";





