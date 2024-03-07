import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class PaymentModesApi {
    listingApi(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `payment-mode/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    indexApi(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `payment-mode/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeApi(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'payment-mode/store', data, LocalStorage.getAccessToken());
    }
    deleteApi(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `payment-mode/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateApi(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `payment-mode/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `payment-mode/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
    getTheme(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `organization/get-invoice-theme?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }
    updateTheme(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `organization/update-invoice-theme/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new PaymentModesApi();
