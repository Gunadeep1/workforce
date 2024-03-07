import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class TimeSheetCycleApi {
    //listing
    indexApi() {                           
        return BaseApi.getWithParams(APIURL.API_URL + `timesheet-configurations/index?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    updateApi(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `timesheet-configurations/update/${id}`, data, LocalStorage.getAccessToken())
    }
    storeApi(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheet-configurations/store`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new TimeSheetCycleApi();
