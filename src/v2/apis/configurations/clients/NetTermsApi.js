import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class NetTermsApi {

    getNetTermsListing(params){
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `net-pay-terms/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }

    storeNetTerms(data){
        return BaseApi.postWithToken(APIURL.API_URL + `net-pay-terms/store`, data, LocalStorage.getAccessToken())
    }

    updateNetTerms(data){
        return BaseApi.putWithToken(APIURL.API_URL + `net-pay-terms/update/${data.id}`, data, LocalStorage.getAccessToken())
    }
  
    statusUpdateNetTerms(id,data){
        return BaseApi.putWithToken(APIURL.API_URL + `net-pay-terms/update-status/${id}`, data, LocalStorage.getAccessToken())
    }

    deleteNetTerms(data){
        return BaseApi.deleteWithToken(APIURL.API_URL + `net-pay-terms/destroy/${data.id}`, data, LocalStorage.getAccessToken())
    }

}
// eslint-disable-next-line
export default new NetTermsApi();