import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class OnBoardApi {
    employeeStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee/store`, data, token)
    }
    passportStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `passport/store`, data, token)
    }
    i94Store(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `i94-details/store`, data, token)
    }
    visaStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee-visa/store`, data, token)
    }
    educationStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee-education/store`, data, token)
    }
    documentsStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee-personal-document/store`, data, token)
    }
    bankStore(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + `bank-account-details/store`, data, token)
    }

    passportIndex(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `passport/index?request_id=${params}&employee_id=${id}`, token)
    }
    I94Index(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `i94-details/index?request_id=${params}&id=${id}`, token)
    }
    visaIndex(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-visa/index?request_id=${params}&employee_id=${id}`, token)
    }
    educationIndex(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-education/index?request_id=${params}&id=${id}`, token)
    }
    documentIndex(params, id, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `employee-personal-document/index?request_id=${params}&id=${id}`, token)
    }
    bankIndex = (params, id, token) => {
        return BaseApi.getWithParams(APIURL.API_URL + `bank-account-details/index?request_id=${params}&employee_id=${id}`, token)
    }


    /*******     Update API'S  ******/
    passportUpdate(data, id, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `passport/update/${id}`, data, token)
    }
    i94Update(data, id, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `i94-details/update/${id}`, data, token)
    }
    visaUpdate(data, id, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-visa/update/${id}`, data, token)
    }
    documentUpdate(data, id, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-personal-document/update/${id}`, data, token)
    }
    educationUpdate(data, id, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee-education/update/${id}`, data, token)
    }


    /**********   delete Api's**********/
    deleteVisaDoc(id, data, token) {
        return BaseApi.deleteWithToken(APIURL.API_URL + `bank-account-details/destroy/${id}`, data, token)
    }

    selfOnboarddocsList() {
        return BaseApi.getWithParams(APIURL.API_URL + `configuration/on-boarding-document-types/listing?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    selfOnboardStore(data) {
        return BaseApi.postWithToken(APIURL.API_URL + `employee/invite-via-link`, data, LocalStorage.getAccessToken());
    }

}
 
// eslint-disable-next-line
export default new OnBoardApi();