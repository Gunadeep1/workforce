import APIURL from "../../../config/development";
import BaseApi from "../../BaseApi";
import LocalStorage from '../../../utils/LocalStorage';

class PayrollAPI {

    storePayrollConfig(data, token) {

        return BaseApi.postWithToken(APIURL.API_URL + `payroll-config-settings/store`, data, token)

    }
    updatePayrollConfig(data,id , token) {

        return BaseApi.putWithToken(APIURL.API_URL + `payroll-config-settings/update/${id}`, data, token)

    }
    getPayrollConfig(params, token) {
        let {search,limit,page}=params
        return BaseApi.getWithToken(APIURL.API_URL + `payroll-config-settings/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}&search=${'Testing'}`, token)

    }
    getPayroll(params, id, token) {
        return BaseApi.getWithToken(APIURL.API_URL + `payroll-config-settings/index?request_id=${params}&payroll_config_settings_id=${id}`, token)

    }

    //dropdown TimesheetCycle method without configure
    getCycleDropdown(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `cycles/dropdown?request_id=${params}&exclude_id=5`, token);
    }

}
// eslint-disable-next-line
export default new PayrollAPI();