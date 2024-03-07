import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class TeamApi {
    //listing
    getTeamsListing(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `employee-team/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    getDepartmentTypeDropDown(){
        return BaseApi.getWithParams(APIURL.API_URL + `departments/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    getTeamIndex(id) {                           
        return BaseApi.getWithParams(APIURL.API_URL + `employee-team/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    postEmployeeTeams(data){
        return BaseApi.postWithToken(APIURL.API_URL + 'employee-team/store', data, LocalStorage.getAccessToken());
    }
    deleteEmployeeTeam(data, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `employee-team/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    updateEmployeeTeam(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-team/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateTeamStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-team/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new TeamApi();
