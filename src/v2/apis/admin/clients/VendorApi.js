import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class VendorApi {
    listing(params,pagination) {
        let { sortColumn, sortOrder, status, search } = params;
        let { currentPage, perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `companies/vendor/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${currentPage}&limit=${perPage}&status=${status}&sort_column=${sortColumn}&sort_order=${sortOrder}`, LocalStorage.getAccessToken())
    }
    destroy(id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/vendor/destroy/${id}`, data, LocalStorage.getAccessToken());
    }
    contactdestroy(id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/vendor/contacts/destroy/${id}`, data, LocalStorage.getAccessToken());
    }

    storeVendor(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/vendor/company-details/store`, data, LocalStorage.getAccessToken());
    }
    storeContact(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/vendor/contacts/store`, data, LocalStorage.getAccessToken());
    }
    indexApi(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/vendor/company-details/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }
    contactIndex(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/vendor/contacts/index?request_id=${LocalStorage.uid()}&company_id=${id}`, LocalStorage.getAccessToken());
    }
    updateCompany(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/vendor/company-details/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateContact(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/vendor/contacts/update/${id}`, data, LocalStorage.getAccessToken());
    }

    //export
    exportVendor(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `export/vendor/companies`, data, LocalStorage.getAccessToken())
    }
}
 // eslint-disable-next-line
export default new VendorApi();