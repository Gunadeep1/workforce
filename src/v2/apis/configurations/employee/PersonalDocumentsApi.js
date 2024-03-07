import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class PersonalDocumentsApi {
    getPersonalDocument(slug, params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/${slug}/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    // getEmploymentTypeDropDown(){
    //     return BaseApi.getWithParams(APIURL.API_URL + `employment-types/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    // }
    getPersonalDocumentIndex(id,slug) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `document-types/${slug}/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    postPersonalDocuments(data,slug){
        return BaseApi.postWithToken(APIURL.API_URL + `document-types/${slug}/store`, data, LocalStorage.getAccessToken());
    }
    deletePersonalDocument(data, id,slug) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `document-types/${slug}/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updatePersonalDocument(data, id,slug) {
        return BaseApi.putWithToken(APIURL.API_URL + `document-types/${slug}/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateDocumentStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `document-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new  PersonalDocumentsApi();
