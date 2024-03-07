import BaseApi from "../../BaseApi";
import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";

class UserProfileApi {
    getUserProfileDetails() {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/get-profile?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }
    updateUserProfileDetails(data) {
        return BaseApi.putWithToken(APIURL.API_URL + "employee/profile/update/", data, LocalStorage.getAccessToken());
    }
    changePassword(data) {
        return BaseApi.postWithToken(APIURL.API_URL + "changepassword", data, LocalStorage.getAccessToken());
    }
    updateUserProfile(data,id) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/update-profile/${id}`, data, LocalStorage.getAccessToken())
    }
}
 // eslint-disable-next-line
export default new UserProfileApi();