import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";


class EmployeeCreateAPI {

    // get ALL Employees data  
    getAllEmployees(data) {
        // const { limit, page, search, employment, category, status, visa } = data;
        data.request_id = LocalStorage.uid();

        // return BaseApi.getWithParams(APIURL.API_URL + `employee/listing?request_id=${LocalStorage.uid()}&limit=${limit}&page=${page}&search=${search}&employment=${employment}&category=${category}&status=${status}&visa=${visa}`, LocalStorage.getAccessToken(),);
        return BaseApi.postWithToken(APIURL.API_URL + 'employee/listing', data, LocalStorage.getAccessToken())
    }
    getEmployee(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    /* Update Employee General Details*/
    updateEmployeeGeneralDetails(data, empId) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/basic-details/update/${empId}`, data, LocalStorage.getAccessToken())
    }
    /* Update Employee Contact Details*/
    updateEmployeeContactDetails(data, empId) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/contact-details/update/${empId}`, data, LocalStorage.getAccessToken())
    }
    /* Update Employee Current Address*/
    updateEmployeeCurrentAddress(data, empId) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/current-address/update/${empId}`, data, LocalStorage.getAccessToken())
    }
    /* Update Employee Employment Details*/
    updateEmployeeEmploymentDetails(data, empId) {
        return BaseApi.putWithToken(APIURL.API_URL + `employment-details/update/${empId}`, data, LocalStorage.getAccessToken())
    }




    // /* Employee Emergency Contacts API */
    // getEmployeeEmergencyContact(id) {
    //     return BaseApi.getWithParams(APIURL.API_URL + `employee-personal-document/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    // }

    /* Store Employee Emergency Contact*/
    storeEmployeeEmergencyContact(data,) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee-emergency-contact/store`, data, LocalStorage.getAccessToken())
    }
    /* Update Employee Emergency Contact*/
    updateEmployeeEmergencyContact(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-emergency-contact/update`, data, LocalStorage.getAccessToken())
    }

    deleteEmployeeEmergencyContact(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-emergency-contact/destroy/${id}`, data, LocalStorage.getAccessToken())
    }


    /* Education documents API */
    getEducation(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-education/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeEmployeeEducation(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-education/store', data, LocalStorage.getAccessToken())
    }
    updateEmployeeEducation(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-education/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteEmployeeEducation(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-education/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Education documents API */


    /* Passport documents API */
    getPassports(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `passport/index?request_id=${LocalStorage.uid()}&employee_id=${id}`, LocalStorage.getAccessToken());
    }
    storePassport(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'passport/store', data, LocalStorage.getAccessToken())
    }
    updatePassport(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `passport/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deletePassport(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `passport/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Passport documents API */

    /* I94 documents API */
    getI94(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `i94-details/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeI94(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'i94-details/store', data, LocalStorage.getAccessToken())
    }
    updateI94(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `i94-details/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteI94(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `i94-details/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* I94 documents API */

    /* Visa documents API */
    getVisa(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-visa/index?request_id=${LocalStorage.uid()}&employee_id=${id}`, LocalStorage.getAccessToken());
    }
    storeVisa(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-visa/store', data, LocalStorage.getAccessToken())
    }
    updateVisa(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-visa/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteVisa(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-visa/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Visa documents API */

    /* Employee personal documents API */
    getPersonalDocuments(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-personal-document/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storePersonalDocuments(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-personal-document/store', data, LocalStorage.getAccessToken())
    }
    updatePersonalDocuments(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-personal-document/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deletePersonalDocuments(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-personal-document/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Employee personal documents API */

    /* Dependents  API */
    getDependents(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-dependent/listing?request_id=${LocalStorage.uid()}&employee_id=${id}`, LocalStorage.getAccessToken());
    }
    storeDependents(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-dependent/store', data, LocalStorage.getAccessToken())
    }
    updateDependents(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-dependent/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteDependents(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-dependent/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Dependents API */

    /* Employee Vacation API */
    getVacation(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-vacation/listing?request_id=${LocalStorage.uid()}&employee_id=${id}`, LocalStorage.getAccessToken());
    }
    storeVacation(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-vacation/store', data, LocalStorage.getAccessToken())
    }
    updateVacation(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-vacation/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteVacation(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-vacation/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Employee Vacation API */


    /* Bank Details API */
    getBankDetails(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `bank-account-details/index?request_id=${LocalStorage.uid()}&employee_id=${id}`, LocalStorage.getAccessToken());
    }
    storeBankDetails(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'bank-account-details/store', data, LocalStorage.getAccessToken())
    }
    updateBankDetails(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `bank-account-details/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteBankDetails(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `bank-account-details/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /*  Bank Details API */

    /* Update employee pay roll Details*/
    updateEmployeePayRoll(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-payroll-configuration`, data, LocalStorage.getAccessToken())
    }


    /* Pay Cycle Configuration*/
    getPayCycleConfiguration(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `paycycle/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storePayCycleConfiguration(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'paycycle/store', data, LocalStorage.getAccessToken())
    }
    updatePayCycleConfiguration(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `paycycle/update/${id}`, data, LocalStorage.getAccessToken())
    }
    getPayroll(id, value) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/salary-per-payroll-amount?request_id=${LocalStorage.uid()}&employee_id=${id}&pay_value=${value}`, LocalStorage.getAccessToken())
    }

    /* Skills Details API */
    getSkillsList(empId) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-skills/index?request_id=${LocalStorage.uid()}&id=${empId}`, LocalStorage.getAccessToken());
    }
    storeSkillsDetails(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-skills/store', data, LocalStorage.getAccessToken())
    }
    updateSkillsDetails(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-skills/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteSkillsDetails(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-skills/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    /* Skills Details API */


    // payrollConfigData  API
    getpayrollConfigData(empId) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/payroll-pay-config?request_id=${LocalStorage.uid()}&employee_id=${empId}`, LocalStorage.getAccessToken());
    }
    getPayrollType(payValue, empId) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/salary-per-payroll-amount?pay_value=${payValue}&employee_id=${empId}&request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }

    profileUpload(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/update-profile/${id}`, data, LocalStorage.getAccessToken())
    }

    ocrDocumentUpload(docType, data) {
        return BaseApi.postWithToken(APIURL.API_URL + `ocr/${docType}`, data, LocalStorage.getAccessToken())
    }

    //Employee Export data
    EmployeeExportFields() {
        return BaseApi.getWithToken(APIURL.API_URL + `employee-export-data-information?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    employeeExport(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `export/employee`, data, LocalStorage.getAccessToken())
    }

    employeeAccess(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/update-access`, data, LocalStorage.getAccessToken())
    }

    OCRCharts(data) {
        return BaseApi.postWithToken(APIURL.ocr_URL + `/chart`, data, APIURL.token)
    }

}
// eslint-disable-next-line
export default new EmployeeCreateAPI();
