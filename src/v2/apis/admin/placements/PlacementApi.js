import APIURL from "../../../config/development";
import BaseApi from "../../BaseApi";
import LocalStorage from "../../../utils/LocalStorage";

class PlacementApi {
    billingDetailsStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `placement/billing/store`, data, token)
    }
    placementsIndex(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/index?request_id=${LocalStorage.uid()}&placement_id=${id}`, LocalStorage.getAccessToken());
    }

    getPlacementFilterDetails(data) {
        const { status_type, from_date, to_date } = data;
        return BaseApi.getWithParams(APIURL.API_URL + `/placement/status-analytics/${status_type}?request_id=${LocalStorage.uid()}&from_date=${from_date}&to_date=${to_date}`, LocalStorage.getAccessToken())
    }
    // Latest code
    getFilterPlacement(params) {
        return BaseApi.getWithParams(APIURL.API_URL + `/placement/status-analytics/${params.slug}?request_id=${LocalStorage.uid()}&from_date=${params.from_date}&to_date=${params.to_date}`, LocalStorage.getAccessToken())
    }
    // latest code
    getPlacementListing(params, pagination) {
        let { slug, from_date, to_date, search, } = params;
        let { currentPage, perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `placement/listing?request_id=${LocalStorage.uid()}&status_type=${slug}&search=${search}&from_date=${from_date}&to_date=${to_date}&page=${currentPage}&limit=${perPage}`, LocalStorage.getAccessToken())
    }

    getPlacementTablelisting(data) {
        const { employee_id, reference_id, client_id, page, limit, status_type, value, search, from_date, to_date } = data;
        return BaseApi.getWithParams(APIURL.API_URL + `placement/listing?request_id=${LocalStorage.uid()}&employee_id=${employee_id}&reference_id=${reference_id}&client_id=${client_id}&page=${page}&limit=${limit}&status_type=${status_type}&value=${value}&search=${search}&from_date=${from_date}&to_date=${to_date}`, LocalStorage.getAccessToken());
    }

    getPayroll(id, value) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/salary-per-payroll-amount?request_id=${LocalStorage.uid()}&employee_id=${id}&pay_value=${value}`, LocalStorage.getAccessToken())
    }

    placementClientStore(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `placement/client/store`, data, LocalStorage.getAccessToken());
    }
    placementEmpPay(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `placement/employee-pay`, data, LocalStorage.getAccessToken())
    }
    payRate(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `placement/employee-pay`, data, LocalStorage.getAccessToken())
    }
    defaultCheck(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `placement/employee/default-pay`, data, LocalStorage.getAccessToken())
    }

    exportPlacement(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'export/placements', data, LocalStorage.getAccessToken())
    }
    dashboardGraph(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `placement/dashboard-analytics`,data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new PlacementApi();
