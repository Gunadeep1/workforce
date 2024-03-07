import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class VisaTypeApi {
    //listing
    getVisaTypeListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `visa-types/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getVisaTypeIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `visa-types/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeVisaType(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'visa-types/store', data, LocalStorage.getAccessToken());
    }
    deleteVisaType(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `visa-types/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateVisaType(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `visa-types/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateVisaTypeStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `visa-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new VisaTypeApi();
