import APIURL from "../../config/development";
import LocalStorage from "../../utils/LocalStorage";
import BaseApi from "../BaseApi";

class LedgerApi {
    paymentListing(params, pagination) {
        let { company_name, company_id, search } = params;
        let { currentPage, perPage } = pagination;    
        return BaseApi.getWithParams(APIURL.API_URL + `ledger-payments/payment/listing?request_id=${LocalStorage.uid()}&search=${search}&company_name=${company_name}&company_id=${company_id}&page=${currentPage}&limit=${perPage}`, LocalStorage.getAccessToken())
    }

    billListing(params, pagination) {
        let { company_name, company_id, search, } = params;
        let { currentPage, perPage } = pagination;    
        return BaseApi.getWithParams(APIURL.API_URL + `ledger-payments/bill-payment/listing?request_id=${LocalStorage.uid()}&search=${search}&company_name=${company_name}&company_id=${company_id}&page=${currentPage}&limit=${perPage}`, LocalStorage.getAccessToken())
    }

     //export
     exportPayment(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `export/payment/ledgers`, data, LocalStorage.getAccessToken())
    }

    exportBillPayment(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `export/bill-payment/ledgers`, data, LocalStorage.getAccessToken())
    }

}
 // eslint-disable-next-line
export default new LedgerApi();