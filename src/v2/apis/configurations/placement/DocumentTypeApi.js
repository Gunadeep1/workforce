import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class PersonalDocumentsApi {
    getListing(slug) {
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/${slug}/listing?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    getIndex(id,slug) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/${slug}/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeApi(data,slug){
        return BaseApi.postWithToken(APIURL.API_URL + `document-types/${slug}/store`, data, LocalStorage.getAccessToken());
    }
    deleteApi(data, id,slug) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `document-types/${slug}/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateApi(data, id,slug) {
        return BaseApi.putWithToken(APIURL.API_URL + `document-types/${slug}/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `document-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new  PersonalDocumentsApi();
