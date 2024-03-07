import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class EmploymentCategoryApi {


    // get method
    // getEmploymentCategories(id, token) {
    //     return BaseApi.getWithParams(APIURL.API_URL + `categories/listing?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    // }
    getEmploymentCategories(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `categories/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getEmploymentTypeDropDown(){
        return BaseApi.getWithParams(APIURL.API_URL + `employment-types/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    getEmploymentIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `categories/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    postEmployeeCategory(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'categories/store', data, LocalStorage.getAccessToken());
    }
    deleteEmployeeCategory(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `categories/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateEmployeeCategory(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `categories/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateEmployeeStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `categories/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
    // deleteEmployeeCategory(data,id) {
    //     return BaseApi.deleteWithToken(APIURL.API_URL + `categories/destroy/${id}`,data, LocalStorage.getAccessToken())
    // }
}
// eslint-disable-next-line
export default new EmploymentCategoryApi();
