import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class CategoryApi {

    getCategoryListing(params){
        let {search,limit,page}=params
        return BaseApi.getWithParams(APIURL.API_URL + `config/employee-self-service-types/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }

    storeCategory(data){
        return BaseApi.postWithToken(APIURL.API_URL + `config/employee-self-service-types/store`, data, LocalStorage.getAccessToken())
    }

    updateCategory(data){
        return BaseApi.putWithToken(APIURL.API_URL + `config/employee-self-service-types/update/${data.id}`, data, LocalStorage.getAccessToken())
    }

    statusUpdateCategory(id,data){
        return BaseApi.putWithToken(APIURL.API_URL + `config/employee-self-service-types/update-status/${id}`, data, LocalStorage.getAccessToken())
    }

    deleteCategory(data){
        return BaseApi.deleteWithToken(APIURL.API_URL + `config/employee-self-service-types/destroy/${data.id}`, data, LocalStorage.getAccessToken())
    }
}
// eslint-disable-next-line
export default new CategoryApi()