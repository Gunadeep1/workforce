import BaseApi from './BaseApi';
import APIURL from '../config/development';

class LoginApi {
    Login(data) {
        return BaseApi.postWithData(APIURL.API_URL + 'login', data)
    }
}
 // eslint-disable-next-line
export default new LoginApi()