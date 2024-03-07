import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class OnboardDocumentsApi {
    listingApi(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `configuration/on-boarding-document-types/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    indexApi(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `configuration/on-boarding-document-types/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeApi(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'configuration/on-boarding-document-types/store', data, LocalStorage.getAccessToken());
    }
    updateStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `configuration/on-boarding-document-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
    updateApi(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `configuration/on-boarding-document-types/update/${id}`, data, LocalStorage.getAccessToken())
    }
    deleteApi(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `configuration/on-boarding-document-types/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
   
}
// eslint-disable-next-line
export default new  OnboardDocumentsApi();
