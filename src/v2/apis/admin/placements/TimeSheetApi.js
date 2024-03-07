import BaseApi from '../../BaseApi';
import APIURL from '../../../config/development';// eslint-disable-next-line
import LocalStorage from "../../../utils/LocalStorage";


class TimeSheetApi {
    timesheetStore(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `placement/timesheet/store`, data, LocalStorage.getAccessToken())
    }

    invoiceStore(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `placement/invoice/store`, data, LocalStorage.getAccessToken())
    }

    getDaysDropdown(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + 'days/dropdown?request_id=' + params, token)
    }

    placementIndex(params,id,token) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/index?request_id=${params}`, token)

    }

    updateTimesheetConfiguration(data) {
        return BaseApi.putWithToken(APIURL.API_URL + 'placement/timesheet/update', data, LocalStorage.getAccessToken());
    }

    getTimesheetConfiguration(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/timesheet/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    
    getInvoiceConfiguration(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/invoice/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }
    updateInvoiceConfiguration( data) {
        return BaseApi.putWithToken(APIURL.API_URL + `placement/invoice/update`, data, LocalStorage.getAccessToken());
    }

    getDefaultConfig(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + 'invoice/raise/configurations/index?request_id=' + params, token);
    }

    getApprovalConfiguration(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + "approvals/invoice/index?request_id=" + params, token);
    }

    // client invoice approval configuration index

    getClientApprovalConfig(params, token, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/invoice/index?request_id=${params}&id=${id}`, token)
    }    

    getClientInvoiceApproval(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/invoice/index?request_id=${params}&id=${id}`, token);
    }

    //timesheet
    getDefaulTimesheetConfig(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + 'timesheet-configurations/index?request_id=' + params, token);
    }

    getApprovalConfigurationTimesheet(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + "approvals/timesheet/index?request_id=" + params, token);
    }

    // client timesheet approval configuration index

    getClientApprovalTimesheetConfig(params, token, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/timesheet/index?request_id=${params}&id=${id}`, token)
    }    

    getClientTimesheetApproval(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `companies/timesheet/index?request_id=${params}&id=${id}`, token);
    }

    //client update
    updateClientPlacement(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `placement/client/update/${id}`, data, LocalStorage.getAccessToken());
    }

      // get Client Drop down list
      getClientDropdownList(params, id) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/client/dropdown?request_id=${params}&employee_id=${id}`,  LocalStorage.getAccessToken())
    }

}
 // eslint-disable-next-line
export default new TimeSheetApi()
