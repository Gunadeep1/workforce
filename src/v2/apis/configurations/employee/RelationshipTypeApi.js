import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class RelationshipTypeApi {
    //listing
    getRelationashipTypeListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `relationship-type/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    // getDepartmentTypeDropDown(){
    //     return BaseApi.getWithParams(APIURL.API_URL + `departments/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    // }
    getIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `relationship-type/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeRelationshipType(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'relationship-type/store', data, LocalStorage.getAccessToken());
    }
    deleteApi(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `relationship-type/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    update(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `relationship-type/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `relationship-type/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new RelationshipTypeApi();
