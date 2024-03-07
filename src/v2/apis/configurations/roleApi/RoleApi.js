import BaseApi from "../../BaseApi";
import APIURL from "../../../config/development"
import LocalStorage from "../../../utils/LocalStorage";
class RoleApi {
    rolesList(params) {
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `role/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
    permissionsList(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + "role/permissions?request_id" + params, token);
    }
    rolesDropdown() {
        return BaseApi.getWithParams(APIURL.API_URL + `role/dropdown?request_id=${LocalStorage.uid()}&search=${""}`, LocalStorage.getAccessToken());
    }
    //get role info with id
    rolePermissions(request_id, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `role/index?request_id=${request_id}&id=${id}`, LocalStorage.getAccessToken());
    }
    updateRoleStatus(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `role/update-status/${id}`, data, LocalStorage.getAccessToken());
    }
    updateRole(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `/role/update/${id}`, data, LocalStorage.getAccessToken());
    }
    getAllPermission() {
        return BaseApi.getWithParams(APIURL.API_URL + `/permissions?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    storeRole(data) {
        return BaseApi.postWithToken(APIURL.API_URL + "/role/store", data, LocalStorage.getAccessToken());
    }
    deleteRole(data,id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `role/destroy/${id}`, data, LocalStorage.getAccessToken());
    }
}
// eslint-disable-next-line
export default new RoleApi();