import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class EducationalLevelApi {
    //listing
    getEducationalLevelListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `education-levels/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getEducationTypeDropDown(){
        return BaseApi.getWithParams(APIURL.API_URL + `education-levels/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    getEducationalLevelIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `education-levels/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeEducationLevel(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'education-levels/store', data, LocalStorage.getAccessToken());
    }
    deleteEducationLevel(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `education-levels/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateEducationaLevel(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `education-levels/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateEducationLevelStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `education-levels/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new EducationalLevelApi();
