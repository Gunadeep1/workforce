import baseApi from '../../BaseApi';
import APIURL from '../../../config/development';
import LocalStorage from '../../../utils/LocalStorage';

class PrefixApi {

    /**********   Prefix Api    ********/
    getPrefix(params, token) {
        return baseApi.getWithParams(APIURL.API_URL + `prefixes/index?request_id=${params}`, token);
    }


    updatePrefix(data, token) {
        return baseApi.putWithToken(APIURL.API_URL + "prefixes/update", data,  LocalStorage.getAccessToken());
    }
   

  
}
// eslint-disable-next-line
export default new PrefixApi();
