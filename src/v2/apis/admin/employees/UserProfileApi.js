import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class UserProfileApi {
    InactiveEmp(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/update-access`, data, LocalStorage.getAccessToken())
    }
    DeactiveEmp(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/deactivate-user/${id}`, data, LocalStorage.getAccessToken())
    }
    everifyEmp(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/e-verify-status/${id}`, data, LocalStorage.getAccessToken())
    }

    getActivity(params) {
        let {page, limit} = params
        return BaseApi.getWithParams(APIURL.API_URL + `activity/employee/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
}
// eslint-disable-next-line
export default new UserProfileApi();