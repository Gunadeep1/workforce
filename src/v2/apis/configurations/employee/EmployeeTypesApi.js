import BaseApi from '../../BaseApi'
import APIURL from "../../../config/development";
import LocalStorage from '../../../utils/LocalStorage';

class EmployeeTypesApi {
    getAllEmployeeTypes() {
        // data.request_id = LocalStorage.uid();
        return BaseApi.getWithParams(APIURL.API_URL + `employment-types/listing?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken())
    }

}
 // eslint-disable-next-line
export default new EmployeeTypesApi();