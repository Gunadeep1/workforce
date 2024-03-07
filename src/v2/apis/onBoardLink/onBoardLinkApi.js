import APIURL from "../../config/development";
import LocalStorage from "../../utils/LocalStorage";
import BaseApi from "../BaseApi";

class onBoardLinkApi {

    inviteViaLink(id) {
        let data ={
            tenant_id:'b7943da6-db1f-47ef-8b33-de2982c1e272'
        };
        return BaseApi.getWithParams(APIURL.API_URL + `employee/invite-via-link?request_id=${LocalStorage.uid()}&id=${id}&subdomain_name=newscreen`,data);
    }

    documentUpload(formdata) {
        return BaseApi.postFormData(APIURL.API_URL + 'open-upload?subdomain_name=newscreen', formdata);
    }

    updateInviteLink(id, status) {
        return BaseApi.putWithData(APIURL.API_URL + `employee/update_invite_link/${id}?request_id=${LocalStorage.uid()}&status=${status}&subdomain_name=newscreen`);
    }

    ApproveTheInviteLink(id, data) {
        return BaseApi.putWithToken(APIURL.API_URL + `employee/update_invite_link/${id}`, data);
    }

    relation() {
        return BaseApi.getWithTenantParams(APIURL.API_URL + `relationship-type/dropdown?request_id=${LocalStorage.uid()}`, 'b7943da6-db1f-47ef-8b33-de2982c1e272');
    }

    getCountryList() {
        return BaseApi.getWithTenantParams(APIURL.API_URL + `country/dropdown?request_id=${LocalStorage.uid()}`, 'b7943da6-db1f-47ef-8b33-de2982c1e272');
    }

    getStatesList(country) {
        return BaseApi.getWithTenantParams(APIURL.API_URL + `state/dropdown?request_id=${LocalStorage.uid()}&country_id=${country}`, 'b7943da6-db1f-47ef-8b33-de2982c1e272');
    }

}

const onBoardLinkApiInstance = new onBoardLinkApi();
export default onBoardLinkApiInstance;