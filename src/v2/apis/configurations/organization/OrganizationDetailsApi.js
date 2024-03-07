import BaseApi from "../../BaseApi";
import APIURL from "../../../config/development";

class OrganizationDetailsAPI {
    // get method
    getOrganizationDetails(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + "organization/index?request_id=" + params, token);
    }  
    // update method
    addOrganizationDetails(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + "organization/store", data, token);
    }
    // update method
    updateOrganizationDetails(data,id, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `organization/update/${id}`, data, token);
    }
  }
// eslint-disable-next-line
export default new OrganizationDetailsAPI();
