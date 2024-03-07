import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class SkillsApi {
    //listing
    getSkillsListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `skills/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getSkillsIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `skills/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    StoreSkills(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'skills/store', data, LocalStorage.getAccessToken());
    }
    deleteSkills(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `skills/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateSkills(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `skills/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateSkillsStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `skills/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new SkillsApi();
