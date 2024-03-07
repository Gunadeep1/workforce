import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class OffBoardingChecklistApi {
    //listing
    getOffBoardCheckListing() {
        return BaseApi.getWithParams(APIURL.API_URL + `organization/index?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }
    updateOffboardStatus(data, id) {
        return BaseApi.putWithToken(APIURL.API_URL + `organization/settings/${id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new OffBoardingChecklistApi();
