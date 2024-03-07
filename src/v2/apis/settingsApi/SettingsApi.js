import BaseApi from '../BaseApi';
import APIURL from '../../config/development';
import LocalStorage from '../../utils/LocalStorage';

class SettingsApi {
    /* For main login API */
    Login(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'login', data)
    }
    configIndexApi(){
        return BaseApi.getWithParams(APIURL.API_URL + `organization/index?request_id=${LocalStorage.uid()}`,LocalStorage.getAccessToken());
    }
}
 // eslint-disable-next-line
export default new SettingsApi()