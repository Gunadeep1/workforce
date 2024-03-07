import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class NotificationsApi{

    getTemplatesDropdown(data){
        return BaseApi.getWithParams(APIURL.API_URL + `templates/list-param?request_id=${LocalStorage.uid()}&module_slug=${data}`, LocalStorage.getAccessToken());
    }

    getNotificationIndexData(data){
        return BaseApi.getWithParams(APIURL.API_URL + `/notification-settings/index?request_id=${LocalStorage.uid()}&module_slug=${data}`, LocalStorage.getAccessToken());
    }

    updateNotification(data){
        return BaseApi.putWithToken(APIURL.API_URL + `/notification-settings/update`, data, LocalStorage.getAccessToken());
    }
}
// eslint-disable-next-line
export default new NotificationsApi();