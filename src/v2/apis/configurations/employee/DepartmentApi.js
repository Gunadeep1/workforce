import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class DepartmentApi {
    getDepartmentListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `departments/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getDepartmentIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `departments/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    postDepartment(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'departments/store', data, LocalStorage.getAccessToken());
    }
    deleteDeparment(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `departments/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateDepartment(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `departments/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateDepartmentStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `departments/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new DepartmentApi();
