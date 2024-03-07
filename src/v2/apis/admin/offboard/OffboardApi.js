import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";
class OffboardApi {
    storeOffBoard(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee/off-board`, data, LocalStorage.getAccessToken());
    }
    getOffBoardCheckList(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/off-board?request_id=${LocalStorage.uid()}&employee_id=${id}`, LocalStorage.getAccessToken());

        
    }
}
 // eslint-disable-next-line
export default new OffboardApi();