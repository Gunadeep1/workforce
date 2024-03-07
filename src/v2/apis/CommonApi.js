import BaseApi from './BaseApi';
import APIURL from '../config/development';
import LocalStorage from "../utils/LocalStorage";

class CommonApi {
    /* For main login API */
    Login(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'login', data)
    }
    Roles(id,token){
        return BaseApi.getWithParams(APIURL.API_URL + `role/permissions?request_id=${LocalStorage.uid()}&id=${id}`, token)
    }
    ForgotPassword(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'forgotpassword', data)
    }
    subDomainCheck(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'subdomain-check', data)
    }
    signupOtpCheck(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'verifyOTP', data)
    }
    OtpVerification(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'verify-otp', data)
    }
    resendSignupOtp(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'resendOTP', data)
    }
    Logout(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + 'logout', data, token)
    }
    storeSignUp(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'tenant', data)
    }
    resetPassword(data) {
        return BaseApi.postWithData(APIURL.API_URL + `resetpassword`, data)
    }
    tenantStoreSignUp(data){
        return BaseApi.postWithData(APIURL.API_URL + `tenant`, data)
    }

    // Upload Document
    documentUpload(slug,formdata) {
        return BaseApi.postFormData(APIURL.API_URL + 'upload/'+slug, formdata, LocalStorage.getAccessToken())
    }
    getCountryList(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `country/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }
    getStatesList(country) {
        return BaseApi.getWithParams(APIURL.API_URL + `state/dropdown?request_id=${LocalStorage.uid()}&country_id=${country}`, LocalStorage.getAccessToken())
    }
    getNetPayTermsList(params, search, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `net-pay-terms/dropdown?request_id=${params}&search=${search}`, token)
    }

    // Add Net PayTerms
    createPaytems(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `net-pay-terms/store`, data, token)
    }

    getCycleDropdown(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + 'cycles/dropdown?request_id=' + params, token)
    }

    netPayTermsDropDownList(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `net-pay-terms/dropdown?request_id=${LocalStorage.uid()}`, token)
    }
    departmentList(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `departments/dropdown?request_id=` + params, token)
    }
    employmentTypesList(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employment-types/dropdown?request_id=` + params, token)
    }
    CategoryList(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `categories/dropdown?request_id=${params}&emp_type_id=${id}`, token)
    }
    employeeTeam(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-team/dropdown?request_id=` + params, token)
    }
    EmployeeDetailsdropdown(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${params}&emp_type_id=${id}`, token);
    }
    visaTypes(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `visa-types/dropdown?request_id=${params}`, token)
    }
    visaDocumentTypeList(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `visa-document-types/dropdown?request_id=${params}&visa_type_id=${id}`, token)
    }
    educationLevel(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `education-levels/dropdown?request_id=${params}`, token)
    }
    personalDocsList(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/employee-personal-documents/dropdown?request_id=${params}`, token)
    }
    relation(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `relationship-type/dropdown?request_id=${params}`, token)
    }
    employees(params, token, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${params}&emp_type_id=${id ? id : ''}`, token)
    }
    
    employeesWithoutType(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${params}`, token)
    }

    //  employees Dropdown Api
    employeesDropdown(params) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${LocalStorage.uid()}&emp_type_id=${params.emp_type_id}&timesheet_cycle_id=${params.timesheet_cycle_id}`, LocalStorage.getAccessToken());
    }

    //  Clients End-clients Dropdown Api
    clientsEndClientsDropdown(path, search) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${path}/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken());
    }

    // Relationship Dropdown API
    getRelationshipDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `relationship-type/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken(),);
    }

    // Employment Categorey Dropdown API
    getEmploymentCategoreyDropdown(search, emp_type_id) {
        return BaseApi.getWithParams(APIURL.API_URL + `categories/dropdown?request_id=${LocalStorage.uid()}&search=${search}&emp_type_id=${emp_type_id}`, LocalStorage.getAccessToken(),);
    }

    // Employment Type Dropdown API
    getEmploymentTypeDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `employment-types/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken(),);
    }

    // Employee Type Dropdown API
    getEmployeeDetailsdropdown(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${LocalStorage.uid()}&emp_type_id=${id}`, LocalStorage.getAccessToken());
    }

    // Departments Dropdown API
    departmentsDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `departments/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken(),);
    }

    // Team Dropdown API
    teamDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-team/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken(),);
    }

    // Visa Type Dropdown API
    VisaTypeDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `visa-types/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken());
    }

    // visa-document-types  Dropdown API
    visaDocumentTypeDropdown(visa_type_id, search) {
        return BaseApi.getWithParams(APIURL.API_URL + `visa-document-types/dropdown?request_id=${LocalStorage.uid()}&visa_type_id=${visa_type_id}&search=${search}`, LocalStorage.getAccessToken());
    }

    // skills Dropdown API
    skillsDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `skills/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken());
    }


    // Education Levels Dropdown API
    educationLevelsDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `education-levels/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken(),);
    }
    // Document Types Dropdown API
    documentTypesDropdown(search, slug) {
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/${slug}/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken(),);
    }
    // payroll-config-settings Dropdown API
    payrollConfigSettingsDropdown() {
        return BaseApi.getWithParams(APIURL.API_URL + `payroll-config-settings/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken(),);
    }

    //job-titles dropdown API
    // getJobTitlesDropdownList(search) {
    //     return BaseApi.getWithParams(APIURL.API_URL + `job-title/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    // }


    /*************   Prefix Api    **************/
    prefix(slug) {
        return BaseApi.getWithParams(APIURL.API_URL + `prefixes/getPrefix?request_id=${LocalStorage.uid()}&slug=${slug}`, LocalStorage.getAccessToken())
    }

    daysDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `days/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken());
    }

    placementsDropdown(id,args) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/client/dropdown?request_id=${LocalStorage.uid()}&employee_id=${id}&calendar_view=${args}`, LocalStorage.getAccessToken());
    }

    documentsTypeDropdown(slug) {
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/${slug}/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    //job-titles dropdown API
    getJobTitlesDropdownList(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `job-title/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

     // Self Service Types Drop Down Api
     selfServiceTypesDropdown(slug,search) {
        return BaseApi.getWithParams(APIURL.API_URL + `config/${slug}/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken());
    }

    payrollConfigDropdown() {
        return BaseApi.getWithParams(APIURL.API_URL + `payroll-config-settings/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    //  Client Employees  Dropdown Api
    clientEmployeesDropdown(path, client_id) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/${path}/employee-details/${client_id}?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    //  placement Timesheet Api
    placementTimesheet(data) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/uninvoiced-timesheets?request_id=${LocalStorage.uid()}&placement_id=${data.placement_id}&start_date=${data.start_date}&end_date=${data.end_date}`, LocalStorage.getAccessToken());
    }

    //  companies Address list Api
    companiesAddressList(slug, company_id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${slug}/get-company-address?request_id=${LocalStorage.uid()}&company_id=${company_id}`, LocalStorage.getAccessToken());
    }

    paymentDropdown() {
        return BaseApi.getWithParams(APIURL.API_URL + `payment-mode/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }


    // Self Service Types Drop Down Api
    rolesDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `role/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken());
    }

    getAllNotifications(data){
        data.request_id = LocalStorage.uid();
        return BaseApi.postWithToken(APIURL.API_URL + `/notification/listing`, data, LocalStorage.getAccessToken())
    }


}
// eslint-disable-next-line
export default new CommonApi()