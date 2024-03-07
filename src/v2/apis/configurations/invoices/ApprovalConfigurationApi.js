import BaseApi from "../../BaseApi";
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class ApprovalMatrixApi {
    // get method
    indexApi() {
        return BaseApi.getWithParams(APIURL.API_URL + `approvals/invoice/index?request_id=${LocalStorage.uid()}` , LocalStorage.getAccessToken());
    }
    dropDownApi(){
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    storeApi(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'approvals/invoice/store', data, LocalStorage.getAccessToken());
    }
    updateApi(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `approvals/invoice/update/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new ApprovalMatrixApi();
