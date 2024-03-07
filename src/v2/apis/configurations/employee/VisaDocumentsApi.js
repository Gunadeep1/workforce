import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class VisaDocumentsApi {
    //listing
    getVisaDocumentsListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `visa-document-types/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getVisaTypeDropDown(){
        return BaseApi.getWithParams(APIURL.API_URL + `visa-types/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    getVisaDocumentsIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `visa-document-types/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeVisaDocument(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'visa-document-types/store', data, LocalStorage.getAccessToken());
    }
    deleteVisaDocument(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `visa-document-types/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateVisaDocument(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `visa-document-types/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateVisaDocumentStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `visa-document-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new VisaDocumentsApi();
