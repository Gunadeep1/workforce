import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";

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
    updateGroup(data, token) {
        return BaseApi.putWithToken(APIURL.API_URL + "groups/update", data, token);
    }

    // Update Group Status (Put method)
    updateStatusGroup(data, token) {
        return BaseApi.putWithToken(APIURL.API_URL + "groups/updateStatus", data, token);
    }

    // delete Group
    deleteGroup(data, token) {
        return BaseApi.deleteWithToken(APIURL.API_URL + "groups/destroy", data, token);
    }
}

export default new GroupsApi();
