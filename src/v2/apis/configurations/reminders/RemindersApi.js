import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";



class RemindersAPI {


    // storeReminderConfig(data,) {
    //     return BaseApi.postWithToken(APIURL.API_URL + `reminder-config/store`, data, LocalStorage.getAccessToken())
    // }

    updateReminderConfig(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `reminder-config/update/${id}`, data, LocalStorage.getAccessToken());
    }

    getReminderConfig(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `reminder-config/index?request_id=${LocalStorage.uid()}&referrable_type=${id}`, LocalStorage.getAccessToken());
    }

}

export default new RemindersAPI();