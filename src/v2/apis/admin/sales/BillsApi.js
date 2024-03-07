import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";


class BillsApi {

    getAllBillsList(params, paginationData) {
        const page = paginationData.currentPage;
        const limit = paginationData.perPage;
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/bill/listing?request_id=${LocalStorage.uid()}&from_date=${params.from_date}&to_date=${params.to_date}&page=${page}&limit=${limit}&search=${params.search}&status=${params.status}`, LocalStorage.getAccessToken());
    }

    // To get Bills Vendor History List 
    getVendorBillsList(params, paginationData) {
        const page = paginationData.currentPage;
        const limit = paginationData.perPage;
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/bill/listing?request_id=${LocalStorage.uid()}&company_id=${params.company_id}&from_date=${params.from_date}&to_date=${params.to_date}&page=${page}&limit=${limit}&search=${params.search}&status=${params.status}`, LocalStorage.getAccessToken());
    }

    // To get Bills Vendor History List 
    getClientInvoicesList(params, paginationData) {
        const page = paginationData.currentPage;
        const limit = paginationData.perPage;
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/bill/listing?request_id=${LocalStorage.uid()}&company_id=${params.company_id}&from_date=${params.from_date}&to_date=${params.to_date}&page=${page}&limit=${limit}&search=${params.search}&status=${params.status}`, LocalStorage.getAccessToken());
    }

    getDashBoardInfoApi() {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/bill/dashboard-data?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }

    // To get the particular Invoice form through id
    getBillIndexApi(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/bill/index?request_id=${LocalStorage.uid()}&ledger_id=${id}`, LocalStorage.getAccessToken())
    }

    // To Store the ledger bill payment
    storeBillPayment(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `ledger-payments/bill-payment/store`, data, LocalStorage.getAccessToken())
    }

    vendorDropdownApi(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/vendor/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

    storeBill(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `ledgers/bill/store`, data, LocalStorage.getAccessToken());
    }

    updateBill(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `ledgers/bill/update/${id}`, data, LocalStorage.getAccessToken())
    }

    getRefId() {
        return BaseApi.getWithParams(APIURL.API_URL + `prefixes/getPrefix?request_id=${LocalStorage.uid()}&slug=bill`, LocalStorage.getAccessToken());
    }

     //export
     exportBill(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'export/bill/sales', data, LocalStorage.getAccessToken())
    }
    downloadInvoice(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/bill/theme?request_id=${LocalStorage.uid()}&ledger_id=${id}`, LocalStorage.getAccessToken())
    }
   

}
 // eslint-disable-next-line
export default new BillsApi();

