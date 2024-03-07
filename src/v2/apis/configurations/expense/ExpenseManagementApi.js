import BaseApi from "../../BaseApi";
import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";

class ExpenseManagementApi {
  

    // settings apis

    getExpenses(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `config/expense-management-types/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`,  LocalStorage.getAccessToken());
    }
    storeExpense(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `config/expense-management-types/store`, data, LocalStorage.getAccessToken());
    }
     // update method
     updateExpense(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `config/expense-management-types/update/${data.id}`, data,  LocalStorage.getAccessToken());
    }
    statusUpdate(id,data){
        return BaseApi.putWithToken(APIURL.API_URL + `config/expense-management-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }

    deleteExpense(data, id, token) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `config/expense-management-types/destroy/${id}`, data, token);
    }
   
}
// eslint-disable-next-line
export default new ExpenseManagementApi();