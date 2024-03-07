import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class DefaultInvoiceCycleApi {
    //listing
    dropDownApi(){
        return BaseApi.getWithParams(APIURL.API_URL + `net-pay-terms/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    indexApi() {
        return BaseApi.getWithParams(APIURL.API_URL + `invoice/raise/configurations/index?request_id=${LocalStorage.uid()}` , LocalStorage.getAccessToken());
    }
    updateApi(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `invoice/raise/configurations/update/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new DefaultInvoiceCycleApi();
