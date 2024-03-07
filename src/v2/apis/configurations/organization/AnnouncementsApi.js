import BaseApi from "../../BaseApi";
import APIURL from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";

class AnnouncementsApi{

    getAnnouncementListing(slug){
        return BaseApi.getWithParams(APIURL.API_URL + `announment/${slug}/listing?request_id=${LocalStorage.uid()}`, LocalStorage.getAccessToken());
    }

    storeAnnouncementDocument(data, slug ) {
        return BaseApi.postWithToken(APIURL.API_URL + `announment/${slug}/store`, data, LocalStorage.getAccessToken());
    }

    publishAnnouncement(slug, id, data){
        return BaseApi.putWithToken(APIURL.API_URL + `announment/${slug}/publish/${id}`, data, LocalStorage.getAccessToken());
    }

    deleteAnnouncementDocument(slug,id,data){
        return BaseApi.deleteWithToken(APIURL.API_URL + `announment/${slug}/delete/${id}`, data, LocalStorage.getAccessToken());
    }
}

export default new AnnouncementsApi();