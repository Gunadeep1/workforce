import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class TimesheetApi {
    //table Api when we click cards
    getCardListingDetails(obj) {
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/listing?request_id=${LocalStorage.uid()}&ts_status=${obj.path}&status=${obj.status}&placement_id=${obj.placementId}&employee_id=${obj.employeeId}&client_id=${obj.clientId}&end_client_id=${obj.endClientId}&employee_name=${obj.employeeName}&client_name=${obj.clientName}&end_client_name=${obj.endClientName}&search=${obj.search}`, LocalStorage.getAccessToken())
    }

    timesheetlistView(data, paginationData) {
        data.request_id = LocalStorage.uid();
        data.page = paginationData.currentPage;
        data.limit = paginationData.perPage;

        return BaseApi.postWithToken(APIURL.API_URL + 'timesheet/range-total-view', data, LocalStorage.getAccessToken())
    }

    timesheetweeklyView(data, paginationData) {
        data.request_id = LocalStorage.uid();
        data.page = paginationData.currentPage;
        data.limit = paginationData.perPage;

        return BaseApi.postWithToken(APIURL.API_URL + 'timesheet/weeks-view', data, LocalStorage.getAccessToken())
    }

    timesheetcalendarView(data) {
        data.request_id = LocalStorage.uid();

        return BaseApi.postWithToken(APIURL.API_URL + 'timesheets/calendar', data, LocalStorage.getAccessToken())

    }

    //table Api when we click on months in cards
    getCardListingDateDetails(obj) {
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/listing?request_id=${LocalStorage.uid()}&ts_status=${obj.path}&status=${obj.status}&placement_id=${obj.placementId}&employee_id=${obj.employeeId}&client_id=${obj.clientId}&end_client_id=${obj.endClientId}&employee_name=${obj.employeeName}&client_name=${obj.clientName}&end_client_name=${obj.endClientName}&search=${obj.search}&from_date=${obj.startDate}&to_date=${obj.endDate}`, LocalStorage.getAccessToken())
    }

    // getListingDetails(status, placementId, employeeId,clientId,endClientId,employeeName,clientName,endClientName,search) {
    //search Api 
    getListingDetails(obj) {

        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/listing?request_id=${LocalStorage.uid()}&ts_status=${obj.path}&status=${obj.status}&placement_id=${obj.placementId}&employee_id=${obj.employeeId}&client_id=${obj.clientId}&end_client_id=${obj.endClientId}&employee_name=${obj.employeeName}&client_name=${obj.clientName}&end_client_name=${obj.endClientName}&search=${obj.search}`, LocalStorage.getAccessToken())

    }
    //count corresponding to the dates
    getFilterDetails(obj) {
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/dashboard/cards/${obj.path}?request_id=${LocalStorage.uid()}&from_date=${obj.startDate}&to_date=${obj.endDate}`, LocalStorage.getAccessToken())
    }
    //send a remainder
    remainderUpdate(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheets/reminder`, data, token)
    }

    getTimesheetListing(params, pagination) {
        let { slug, from_date, to_date, search, } = params;
        let { currentPage, perPage } = pagination;
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/listing?request_id=${LocalStorage.uid()}&ts_status=${slug=="total_timesheets"?"":slug}&search=${search}&from_date=${from_date}&to_date=${to_date}&page=${currentPage}&limit=${perPage}`, LocalStorage.getAccessToken())
    }


    getTimesheetViewData(data, view) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheet/${view}`, data, LocalStorage.getAccessToken());
    }

    getFilterTimesheet(params) {
        // return BaseApi.getWithParams(APIURL.API_URL + `timesheets/dashboard/cards/${params.slug}?request_id=${LocalStorage.uid()}&from_date=${params.from_date}&to_date=${params.to_date}`, LocalStorage.getAccessToken());
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/dashboard/cards/?request_id=${LocalStorage.uid()}&from_date=${params.from_date}&to_date=${params.to_date}`, LocalStorage.getAccessToken());

    }

    getTimesheetCount() {
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/dashboard/cards/?request_id=${LocalStorage.uid()}&from_date=${""}&to_date=${""}`, LocalStorage.getAccessToken());
    }

    getTimesheet(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/index?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken());
    }

    storeTimesheet(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheets/store`, data, LocalStorage.getAccessToken());
    }

    updateTimesheet(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `timesheets/update/${id}`, data, LocalStorage.getAccessToken())
    }

    updateTimesheetStatus(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheets/status`, data, LocalStorage.getAccessToken());
    }

    sendTimesheetReminder(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheets/reminder`, data, LocalStorage.getAccessToken());
    }

    sendTimesheetNotification(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheets/notification`, data, LocalStorage.getAccessToken());
    }

    //delete timeSheet
    deleteTimesheet(id, data) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `timesheet/delete/${id}`, data, LocalStorage.getAccessToken())

    }
    //Approve or reject
    approvalUpdate(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `timesheets/status`, data, token)

    }

    getInvoice(timesheet_id) {
        return BaseApi.getWithParams(APIURL.API_URL + `timesheets/invoice-ready-data/${timesheet_id}?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    // /api/v1 / placement / timesheets / approved - users ? request_id = {{ $guid }}& id=3baf54c1 -0818 - 496f - b4db - 961fdd13c3c7


    getApprovedByData(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/timesheets/approved-users?request_id=${LocalStorage.uid()}&id=${id}`, LocalStorage.getAccessToken())
    }
    employeesDropdown() {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/dropdown?request_id=${LocalStorage.uid()}&timesheet_available=true`, LocalStorage.getAccessToken());
    }

    getActivity(params) {
        let {page, limit} = params
        return BaseApi.getWithParams(APIURL.API_URL + `activity/timesheet/listing?request_id=${LocalStorage.uid()}&page=${page}&limit=${limit}`, LocalStorage.getAccessToken());
    }
   

}
 // eslint-disable-next-line
export default new TimesheetApi();