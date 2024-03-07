import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class ClientsApi {
    listing(params, pagination) {
        let { sortColumn, sortOrder, status, search } = params;
        let { currentPage, perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `companies/client/listing?request_id=${LocalStorage.uid()}&search=${search}&page=${currentPage}&limit=${perPage}&status=${status}&sort_column=${sortColumn}&sort_order=${sortOrder}`, LocalStorage.getAccessToken())
    }

    getTransactionInvoiceList(company_id, page, limit) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/invoice/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}&company_id=${company_id}`, LocalStorage.getAccessToken())
    }
    getTransactionPaymentList(company_id, page, limit) {
        return BaseApi.getWithParams(APIURL.API_URL + `ledger-payments/payment/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}&company_id=${company_id}`, LocalStorage.getAccessToken())
    }
    getTransactionConsultantList(client_id, page, limit) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}&client_id=${client_id}`, LocalStorage.getAccessToken())
    }
    // getTransactionInvoiceList(slug, company_id, page, limit) {
    //     return BaseApi.getWithParams(APIURL.API_URL + `ledgers/${slug}/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}&company_id=${company_id}`, LocalStorage.getAccessToken())
    // }

    destroy(id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/client/destroy/${id}`, data, LocalStorage.getAccessToken());
    }

    storeCompany(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/client/company-details/store`, data, LocalStorage.getAccessToken());
    }
    storeContact(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/client/contacts/store`, data, LocalStorage.getAccessToken());
    }
    storeTimesheet(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/timesheet/store`, data, LocalStorage.getAccessToken());
    }
    storeInvoice(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/invoice/store`, data, LocalStorage.getAccessToken());
    }

    companyIndexApi(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/client/company-details/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }
    contactIndex(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/client/contacts/index?request_id=${LocalStorage.uid()}&company_id=${id}`, LocalStorage.getAccessToken());
    }
    timesheetIndex(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/timesheet/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    invoiceIndex(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/invoice/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }

    updateCompany(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/client/company-details/update/${id}`, data, LocalStorage.getAccessToken())
    }
    updateContact(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/client/contacts/update/${id}`, data, LocalStorage.getAccessToken());
    }


    getCompanyDetails(path, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${path}/company-details/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeCompanyDetails(path, data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/${path}/company-details/store`, data, LocalStorage.getAccessToken());
    }
    updateCompanyDetails(path, id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/${path}/company-details/update/${id}`, data, LocalStorage.getAccessToken());
    }
    deleteCompanyDetails(path, id) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/${path}/destroy/${id}`, { request_id: LocalStorage.uid() }, LocalStorage.getAccessToken())
    }
    updateStatus(path, id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/${path}/update-status/${id}`, data, LocalStorage.getAccessToken());
    }

    getContactsDetails(path, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${path}/contacts/index?request_id=${LocalStorage.uid()}&company_id=${id}`, LocalStorage.getAccessToken());
    }
    storeContactsDetails(path, data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/${path}/contacts/store`, data, LocalStorage.getAccessToken());
    }
    updateContactsDetails(path, id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/${path}/contacts/update/${id}`, data, LocalStorage.getAccessToken());
    }
    deleteContactsDetails(path, id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/${path}/contacts/destroy/${id}`, data, LocalStorage.getAccessToken())
    }
    uploadClientLogo(path, id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/${path}/update-profile/${id}`, data, LocalStorage.getAccessToken());
    }



    getTimesheetConfiguration(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/timesheet/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeTimesheetConfiguration(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/timesheet/store`, data, LocalStorage.getAccessToken());
    }
    updateTimesheetConfiguration(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/timesheet/update/${id}`, data, LocalStorage.getAccessToken());
    }


    getInvoiceConfiguration(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/invoice/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    storeInvoiceConfiguration(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `companies/invoice/store`, data, LocalStorage.getAccessToken());
    }
    updateInvoiceConfiguration(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/invoice/update/${id}`, data, LocalStorage.getAccessToken());
    }
    updateTimesheet(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `companies/timesheet/update/${id}`, data, LocalStorage.getAccessToken());
    }

    dropdown(slug) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${slug}/dropdown?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    contactsDropdown(slug, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${slug}/contacts/dropdown?request_id=${LocalStorage.uid()}&company_id=${id}`, LocalStorage.getAccessToken());
    }

    destroyContact(slug, id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `companies/${slug}/contacts/destroy/${id}`, data, LocalStorage.getAccessToken())
    }

    duplicateCheck(data) {
        return BaseApi.putWithToken(APIURL.API_URL + `placement/duplicate-check`, data, LocalStorage.getAccessToken())
    }

    overView(slug, id, year) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/${slug}/dashboardData?id=${id}&request_id=${LocalStorage.uid()}&year=${year}`, LocalStorage.getAccessToken())
    }

    //export
    exportClient(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `export/client/companies`, data, LocalStorage.getAccessToken())
    }

}
// eslint-disable-next-line
export default new ClientsApi();