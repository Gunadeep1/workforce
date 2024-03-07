import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class JobTitleApi {
    //listing
    getListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `job-title/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    // getDepartmentTypeDropDown(){
    //     return BaseApi.getWithParams(APIURL.API_URL + `departments/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    // }
    getIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `job-title/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeApi(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'job-title/store', data, LocalStorage.getAccessToken());
    }
    deleteApi(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `job-title/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateApi(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `job-title/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `job-title/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new JobTitleApi();
