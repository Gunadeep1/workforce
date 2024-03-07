import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";
class BalanceSheetApi {
    getAllEmployees(data,pagination) {
        data.request_id = LocalStorage.uid();
        data.page=pagination.currentPage;
        data.limit=pagination.perPage;
        return BaseApi.postWithToken(APIURL.API_URL + 'employee/listing', data, LocalStorage.getAccessToken())
    }
    getBalanceAmount(state) {
        return BaseApi.getWithParams(APIURL.API_URL + `balancesheet/dashboardData?request_id=${LocalStorage.uid()}&from_date=${state.from_date}&to_date=${state.to_date}`,LocalStorage.getAccessToken())
    }
    getPayrollCardIndex(state) {
        return BaseApi.getWithParams(APIURL.API_URL + `balancesheet/indexCard?request_id=${LocalStorage.uid()}&employee_id=${state.employee_id}&financial_summary=${state.financial_summary}&from_date=${state.from_date}&to_date=${state.to_date}`, LocalStorage.getAccessToken());
    }
    getExpenseCardIndex(state) {
        return BaseApi.getWithParams(APIURL.API_URL + `balancesheet/indexCard?request_id=${LocalStorage.uid()}&employee_id=${state.employee_id}&financial_summary=${state.financial_summary}&expense_transaction_type=${state.expense_transaction_type}&from_date=${state.from_date}&to_date=${state.to_date}`, LocalStorage.getAccessToken());
    }
    // getPayrollListing(data){
    //     return BaseApi.getWithParams(APIURL.API_URL + `balancesheet/index?request_id=${LocalStorage.uid()}&employee_id=${data.employee_id}&from_date=${data.from_date}&to_date=${data.to_date}`,LocalStorage.getAccessToken())
    // }
    
    getPayrollListing(params, pagination) {
        let { employee_id, from_date, to_date } = params;
        let { currentPage, perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `balancesheet/index?request_id=${LocalStorage.uid()}&employee_id=${employee_id}&from_date=${from_date}&to_date=${to_date}&page=${currentPage}&limit=${perPage}`, LocalStorage.getAccessToken())
    }
    getExpenseListing(data) {
        data.request_id = LocalStorage.uid();
        return BaseApi.postWithToken(APIURL.API_URL + 'expense-management/listing', data, LocalStorage.getAccessToken())
    }
}
 // eslint-disable-next-line
export default new BalanceSheetApi();
