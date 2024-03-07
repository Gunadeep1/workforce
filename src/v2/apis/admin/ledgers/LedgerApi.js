import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class LedgerApi {
    paymentListing(company_name, page, limit, company_id, search) {
        // let { perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `ledger-payments/payment/listing?request_id=${LocalStorage.uid()}&company_id=${company_id}&company_name=${company_name}&page=${page}&limit=${limit}&search=${search}`, LocalStorage.getAccessToken())
    }

    billListing(company_name, page, limit, company_id, search) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledger-payments/bill-payment/listing?request_id=${LocalStorage.uid()}&company_name=${company_name}&page=${page}&limit=${limit}&company_id=${company_id}`, LocalStorage.getAccessToken())
    }
    storePayment(slug, data) {
        return BaseApi.postWithToken(APIURL.API_URL + `ledger-payments/${slug}/store`, data, LocalStorage.getAccessToken());
    }
    updatePayment(slug, id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `ledger-payments/${slug}/update/${id}`, data, LocalStorage.getAccessToken())
    }

    indexApi(slug, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledger-payments/${slug}/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }

}
 // eslint-disable-next-line
export default new LedgerApi();
