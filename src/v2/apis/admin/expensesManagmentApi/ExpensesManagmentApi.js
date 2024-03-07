import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class expeneseManagementApi {
    listing(data, pagination) {
        data.request_id = LocalStorage.uid();
        data.page = pagination.currentPage;
        data.limit = pagination.perPage;
        return BaseApi.postWithToken(APIURL.API_URL + `expense-management/listing`, data, LocalStorage.getAccessToken());
    }

    index(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `expense-management/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    delete(id){
        let data = {request_id:LocalStorage.uid()};
        return BaseApi.deleteWithToken(APIURL.API_URL + `expense-management/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
 
    updateStatus(data,id) {
        data.request_id = LocalStorage.uid();
        return BaseApi.putWithToken(APIURL.API_URL + `expense-management/update-status/${id}`, data, LocalStorage.getAccessToken());
    }

    dropDownExpenseTypeList(slug) {
        return BaseApi.getWithParams(APIURL.API_URL + `config/${slug}/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    createExpense(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `expense-management/store`, data, LocalStorage.getAccessToken());
    }

    expenseManagementindexApi(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `expense-management/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }

}


 // eslint-disable-next-line
export default new expeneseManagementApi();