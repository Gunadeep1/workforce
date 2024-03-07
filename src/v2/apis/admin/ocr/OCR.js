import { ocr_URL, token } from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class OCRApi {

    // Upload Ocr Template create file 
    ocrfileUpload(formdata) {
        return BaseApi.postFormData(`${ocr_URL}/upload/`, formdata, token)
    }

    getOcrList(search) {
        return BaseApi.getWithParams(`${ocr_URL}/template-listing?tenant_id=${LocalStorage.getUserData().tenant_id}&search=${search}`, token)
    }

    // Upload Ocr Template create file 
    getOCRAreaText(data) {
        return BaseApi.postWithToken(`${ocr_URL}/get-area-text/`, data, token)
    }

    templateStore(data) {
        return BaseApi.postWithToken(`${ocr_URL}/set-template/`, data, token)
    }

    /****   BulkUpload related apis   ****/


    getTimesheetDetails(data) {
        return BaseApi.postWithToken(`${ocr_URL}/get-timesheet-details/`, data, token)
    }

    getTimeSheetProgress(data) {
        return BaseApi.getWithParams(`${ocr_URL}/loading-status?id=${data}`, token)
    }

    sentApproval(data) {
        return BaseApi.postWithToken(`${ocr_URL}/sent-approval`, data, token);
    }

}
// eslint-disable-next-line
export default new OCRApi();