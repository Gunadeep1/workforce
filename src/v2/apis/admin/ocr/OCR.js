// import APIURL from "../../../config/development";
// import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class OCRApi {

    // Upload Ocr Template creat file 
    ocrfileUpload(formdata) {
        let token = "QIo5LzZf64tF3re7eeBiphJyK/1Vr34I0wnmKICo3Co3PwqY+Tr1OymZ5atK4CWzVOJQhSiBExuaFqPFswOacbLVUuZ9NKUGxRGauH0+GOa/SMbbIOXEXiZbGjJX1J/VRFaxajeRrbtbhzmvkaD8ShRM0J2OH3pfB5eHuhekdGV3vG6URq0FHZE9JEEFmYEp+q7bRrjlTMJEng2Y4HEDQld70mx8Rjbr1a4i/B8uYfkL983pR7JkZElzjaXF/KmN7O+DQ9FooffJyMT3Qkc/mapa6IWlblS4jByj/jg8qefrq3P8AQ4EpyC+E8in9Oz116Fl/Py1hlKz3HzDhQZHQg==";
        return BaseApi.postFormData('https://ocr.codetru.org/upload/', formdata, token)
        // return BaseApi.postFormData('https://ocr.codetru.org/upload/', formdata, LocalStorage.getAccessToken())
    }

    // Upload Ocr Template creat file 
    getOCRAreaText(data) {
        let token = "QIo5LzZf64tF3re7eeBiphJyK/1Vr34I0wnmKICo3Co3PwqY+Tr1OymZ5atK4CWzVOJQhSiBExuaFqPFswOacbLVUuZ9NKUGxRGauH0+GOa/SMbbIOXEXiZbGjJX1J/VRFaxajeRrbtbhzmvkaD8ShRM0J2OH3pfB5eHuhekdGV3vG6URq0FHZE9JEEFmYEp+q7bRrjlTMJEng2Y4HEDQld70mx8Rjbr1a4i/B8uYfkL983pR7JkZElzjaXF/KmN7O+DQ9FooffJyMT3Qkc/mapa6IWlblS4jByj/jg8qefrq3P8AQ4EpyC+E8in9Oz116Fl/Py1hlKz3HzDhQZHQg==";
        return BaseApi.postWithToken('https://ocr.codetru.org/get-area-text/', data, token)
        // return BaseApi.postFormData('https://ocr.codetru.org/upload/', formdata, LocalStorage.getAccessToken())
    }

}
// eslint-disable-next-line
export default new OCRApi();