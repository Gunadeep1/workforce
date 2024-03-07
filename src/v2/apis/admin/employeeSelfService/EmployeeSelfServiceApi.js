import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";


class EmployeeSSCreateAPI {

    // get ALL Employees Listing api  
    getAllEmployees(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee-self-service/listing?request_id==${LocalStorage.uid()}`, data,LocalStorage.getAccessToken())
    }

    // Store Employee Self Service Request api

    storeESSRequest(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee-self-service/store`, data, LocalStorage.getAccessToken());
    }

    // Get Self Service Type Employee api
    getESSGetEmployee(id) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-self-service/get-employee?request_id==${LocalStorage.uid()}&self_service_type_id=${id}`, LocalStorage.getAccessToken())
    }


    updateAssigneeApi(data) {
        const { id } = data;
        return BaseApi.putWithToken(APIURL.API_URL + `employee-self-service/update/${id}`, data, LocalStorage.getAccessToken())
    }

    // Updating the ticket status
    updateStatusApi(id,data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-self-service/update-status/${id}`, data, LocalStorage.getAccessToken())
    }
}
 // eslint-disable-next-line
export default new EmployeeSSCreateAPI();
