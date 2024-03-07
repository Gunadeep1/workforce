import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class payrollApi {
    getPayrollInfo() {
        return BaseApi.getWithParams(APIURL.API_URL + `/payroll-config-settings/payroll-dashboard?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    getViewAllinfo(data) {
        const { limit, page, status } = data;
        return BaseApi.getWithParams(APIURL.API_URL + `payroll-config-settings/payroll-list?request_id=${LocalStorage.uid()}&status=${status}&limit=${limit}&page=${page}`, LocalStorage.getAccessToken());
    }

    skippedApi(id) {
        const data = {};
        data.payroll_configuration_id = id;
        data.request_id = LocalStorage.uid();
        return BaseApi.putWithToken(APIURL.API_URL + `payroll/skip`, data, LocalStorage.getAccessToken())
    }

    upcomingAPI(data) {
        const { limit, page } = data;
        return BaseApi.getWithParams(APIURL.API_URL + `/payroll-config-settings/payroll-upcoming-list?request_id=${LocalStorage.uid()}&limit=${limit}&page=${page}`, LocalStorage.getAccessToken());
    }

    getlisting(params) {
        return BaseApi.getWithParams(APIURL.API_URL + `payroll/listing?request_id=${LocalStorage.uid()}&payroll_configuration_id=${params.payroll_configuration_id}&visa_type_id=${params.visa_type_id}&search=${params.search?params.search:""}`, LocalStorage.getAccessToken());
    }

    updatePayroll(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `payroll/update`, data, LocalStorage.getAccessToken());
    }

    payRollGenerate(data){
        return BaseApi.putWithToken(APIURL.API_URL + `payroll/generate`, data, LocalStorage.getAccessToken());
    }

    PayrollRun(data){
        return BaseApi.putWithToken(APIURL.API_URL + `payroll/run`, data, LocalStorage.getAccessToken());
    }

    visaTypeList() {
        return BaseApi.getWithParams(APIURL.API_URL + `visa-types/listing?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }
    downloadReport(id, id1){
        return BaseApi.getWithParams(APIURL.API_URL + `payroll/pdf?request_id=${LocalStorage.uid()}&payroll_configuration_id=${id}&employee_id=${id1}`, LocalStorage.getAccessToken())
    }
}
 // eslint-disable-next-line
export default new payrollApi();