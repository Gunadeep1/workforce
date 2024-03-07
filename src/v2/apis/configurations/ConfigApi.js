import BaseApi from '../base_API'
import APIURL from "../../config/development";
import LocalStorage from '../../utils/LocalStorage';

class configApi {

    getActivity(id,slug,params) {
        let {page,limit}=params
        return BaseApi.getWithParams(APIURL.API_URL + `activity/configuration/listing?request_id=${LocalStorage.uid()}&referrable_id=${id}&slug_id=${slug}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
   
}
// eslint-disable-next-line
export default new configApi();
