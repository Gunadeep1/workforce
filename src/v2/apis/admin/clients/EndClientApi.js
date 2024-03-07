import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class EndClientApi {
    listing(params,pagination) {
        let { sortColumn, sortOrder, status, search } = params;
        let { currentPage, perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `companies/end-client/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${currentPage}&limit=${perPage}&status=${status}&sort_column=${sortColumn}&sort_order=${sortOrder}`, LocalStorage.getAccessToken())
    }
    destroy(id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/end-client/destroy/${id}`, data, LocalStorage.getAccessToken());
    }

    storeEndClient(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/end-client/company-details/store`, data, LocalStorage.getAccessToken());
    }
    storeContact(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/end-client/contacts/store`, data, LocalStorage.getAccessToken());
    }
    indexApi(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/end-client/company-details/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }
    contactIndex(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/end-client/contacts/index?request_id=${LocalStorage.uid()}&company_id=${id}`, LocalStorage.getAccessToken());
    }
    updateCompany(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/end-client/company-details/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateContact(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/end-client/contacts/update/${id}`, data, LocalStorage.getAccessToken());
    }

    endClientDropdownApi(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/end-client/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

    // getContactsDetails(params) {
    //     let { page, limit, search } = params;
    //     return BaseApi.getWithParams(APIURL.API_URL + `clients/contacts/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}&search=${search}`, LocalStorage.getAccessToken());
    // }
    storeContactsDetails(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `end-clients/contacts/store`, data, LocalStorage.getAccessToken());
    }
    updateContactsDetails(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `end-clients/contacts/update`, data, LocalStorage.getAccessToken());
    }
    deleteContactsDetails(data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `end-clients/contacts/destroy`, data, LocalStorage.getAccessToken())
    }

     //export
     exportEndClient(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `export/end-client/companies`, data, LocalStorage.getAccessToken())
    }
}
 // eslint-disable-next-line
export default new EndClientApi();