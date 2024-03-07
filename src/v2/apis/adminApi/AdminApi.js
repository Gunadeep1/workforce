import BaseApi from '../BaseApi';
import APIURL from '../../config/development';

class AdminApi {
     /* For main login API */
    Login(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'login', data)
    }
}

export default new AdminApi()