import APIURL from "../config/development";
import LocalStorage from "../utils/LocalStorage";
import BaseApi from "./BaseApi";


class ExportAPI {

    // Employees Export  
    getEmployeesExport() {
        return BaseApi.getWithParams(APIURL.API_URL + `employee/listing?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken(),);
    }

}
 // eslint-disable-next-line
export default new ExportAPI();
