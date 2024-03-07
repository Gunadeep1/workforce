import APIURL from "../../config/development";
import LocalStorage from "../../utils/LocalStorage";
import BaseApi from "../BaseApi";

class DasboardAPI {
    getEmployeesList() {
        return BaseApi.getWithParams(APIURL.API_URL + `dashboard/get-employees-data?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    totalRecievables() {
        return BaseApi.getWithParams(APIURL.API_URL + `dashboard/receivables-payables?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }
    getCompanies() {
        return BaseApi.getWithParams(APIURL.API_URL + `dashboard/get-top-companies?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }

    getPayroll(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `dashboard/payroll?request_id=${LocalStorage.uid()}&payroll_setting_id=${id}`, LocalStorage.getAccessToken())
    }

    payrollConfigDropdown() {
        return BaseApi.getWithParams(APIURL.API_URL + `payroll-config-settings/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }

    remaindersListing(slug, data) {
        const { perPage, currentPage } = data
        return BaseApi.getWithParams(APIURL.API_URL + `reminders/listing/${slug}?request_id=${LocalStorage.uid()}&page=${currentPage}&limit=${perPage}`, LocalStorage.getAccessToken())
    }

    storeReminder(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `self-reminder-config/store`, data, LocalStorage.getAccessToken())
    }

    cashflow(data) {
        const { viewType, fromDate, toDate } = data;
        return BaseApi.getWithParams(APIURL.API_URL + `dashboard/cashflow?request_id=${LocalStorage.uid()}&view_type=${viewType}&from_date=${fromDate}&to_date=${toDate}`, LocalStorage.getAccessToken())
    }

    selfDocuments(date) {
        return BaseApi.getWithParams(APIURL.API_URL + `self-reminder-config/listing?request_id=${LocalStorage.uid()}&date=${date}`, LocalStorage.getAccessToken())
    }

    employerMargin(data) {
        const { fromDate, toDate } = data;
        return BaseApi.getWithParams(APIURL.API_URL + `dashboard/employee-margin?request_id=${LocalStorage.uid()}&from_date=${fromDate}&to_date=${toDate}`, LocalStorage.getAccessToken())
    }

    storeChart(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `chat-bot`, data, LocalStorage.getAccessToken())
    }

    payPeriodList(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `reminder-config/payroll-config-dates?request_id=${LocalStorage.uid()}&payroll_cycle_id=${id}`, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new DasboardAPI();