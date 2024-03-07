import BaseApi from "../../BaseApi";
import APIURL from '../../../config/development';
import LocalStorage from "../../../utils/LocalStorage";

class AddClientEndClientApi {
    storeClientContact(slug, data) {
        return BaseApi.postWithToken(APIURL.API_URL + `document-types/${slug}/store`, data, LocalStorage.getAccessToken());
    }

    placementsListing(search) {
        return BaseApi.getWithParams(APIURL.API_URL + `placement/listing?request_id=${LocalStorage.uid()}&search=${search}`, LocalStorage.getAccessToken())
    }

    addJobTitle(data, token) {
        return BaseApi.postWithToken(APIURL.API_URL + "job-title/store", data, token);
    }

    //   // post Job-titles
    //   addJobTitle(data, token) {
    //     return BaseApi.postWithToken(APIURL.API_URL + "job-title/store", data, token);
    // }
}
 // eslint-disable-next-line
export default new AddClientEndClientApi();