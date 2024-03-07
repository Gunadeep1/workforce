import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class GroupsApi {
    // Get Groups list(Get method)
    getGroupsDropdown(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `groups/dropdown?request_id=${params}`, token);
    }

    // Get Internal Employees list(Get method)
    getEmployeeDropdown(params, type, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${params}&id=${type}`, token);
    }

    // Get Group members(Get method)
    getGroupMembers(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `groups/index?request_id=${params}&id=${id}`, token);
    }

    // Create Group(post method)
    addGroup(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + "groups/store", data, token);
    }

    // Update Group(Put method)
    updateGroup(id,data) {
        return BaseApi.putWithToken(APIURL.API_URL + `groups/update/${id}`, data, LocalStorage.getAccessToken());
    }

    // Update Group Status (Put method)
    updateStatusGroup(id,data) {
        return BaseApi.putWithToken(APIURL.API_URL + `groups/updateStatus/${id}`, data, LocalStorage.getAccessToken());
    }

    // delete Group
    deleteGroup(data,id, token) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `groups/destroy/${id}`, data, token);
    }
}
// eslint-disable-next-line
export default new GroupsApi();
