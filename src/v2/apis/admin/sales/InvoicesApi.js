import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";


class InvoicesApi {
    getAllInvoicesList(params, paginationData) {
        const page = paginationData.currentPage;
        const limit = paginationData.perPage;
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/invoice/listing?request_id=${LocalStorage.uid()}&from_date=${params.from_date}&to_date=${params.to_date}&page=${page}&limit=${limit}&search=${params.search}&status=${params.status}`, LocalStorage.getAccessToken());
    }

    //  To get Invoices Dashboard Information
    getDashBoardInfoApi() {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/invoice/dashboard-data?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }

    // To get Invoices Client History List
    getClientInvoicesList(params, paginationData) {
        const page = paginationData.currentPage;
        const limit = paginationData.perPage;
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/invoice/listing?request_id=${LocalStorage.uid()}&company_id=${params.company_id}&from_date=${params.from_date}&to_date=${params.to_date}&page=${page}&limit=${limit}&search=${params.search}&status=${params.status}`, LocalStorage.getAccessToken());
    }

    getRefId() {
        return BaseApi.getWithParams(APIURL.API_URL + `prefixes/getPrefix?request_id=${LocalStorage.uid()}&slug=invoice`, LocalStorage.getAccessToken());
    }

    getInvoice(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/invoice/index?request_id=${LocalStorage.uid()}&ledger_id=${id}`, LocalStorage.getAccessToken());
    }

    getTimesheetList(data) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/uninvoiced-timesheets?request_id=${LocalStorage.uid()}&start_date=${data.start_date}&end_date=${data.end_date}&placement_id=${data.placementId}`, LocalStorage.getAccessToken())
    }

    clientDropdownApi(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/client/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

    storeInvoice(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `ledgers/invoice/store`, data, LocalStorage.getAccessToken());
    }


    updateInvoice(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `ledgers/invoice/update/${id}`, data, LocalStorage.getAccessToken())
    }

    // storeTimesheet(slug, data) {
    //     return BaseApi.postWithToken(APIURL.API_URL + `companies/${slug}/add-address`, data, LocalStorage.getAccessToken());
    // }
    storeAddress(slug, data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/${slug}/add-address`, data, LocalStorage.getAccessToken());
    }

    // To add Shipping Address for New Invoice
    storeShippingAddress(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'companies/invoice/add-address', data, LocalStorage.getAccessToken())
    }
    // To get the particular Invoice form through id
    getInvoiceIndexApi(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/invoice/index?request_id=${LocalStorage.uid()}&ledger_id=${id}`, LocalStorage.getAccessToken())
    }
    // To Update the Status of the Invoice
    updateInvoiceStatus(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'ledgers/update-status', data, LocalStorage.getAccessToken())
    }

    updateInvoiceRecurring(slug,data) {
        return BaseApi.putWithToken(APIURL.API_URL + `ledgers/recurring/${slug}/update`, data, LocalStorage.getAccessToken())
    }
    // To Get Write Off Drop Down
    getWriteOffDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `write-off/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

    // To Get Payment Mode Drop Down
    getPaymentModeDropdown(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `payment-mode/dropdown?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

    // To Store the ledger invoice payment
    storeInvoicePayment(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `ledger-payments/payment/store`, data, LocalStorage.getAccessToken())
    }


    // To Delete Ledger item
    deleteLedgerItemAPI(id) {
        let obj = {"request_id":LocalStorage.uid(), id:id}
        return BaseApi.deleteWithToken(APIURL.API_URL + `ledgers/item/delete`, obj, LocalStorage.getAccessToken());
    }

    //export
    exportInvoice(data) {
        return BaseApi.postWithToken(APIURL.API_URL + 'export/invoice/sales', data, LocalStorage.getAccessToken())
    }


}
 // eslint-disable-next-line
export default new InvoicesApi();

