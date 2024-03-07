import  APIURL  from "../../../config/development";
import LocalStorage from "../../../utils/LocalStorage";
import BaseApi from "../../BaseApi";

class PaymentsApi{
    invoiceListing(slug,id){
        return BaseApi.getWithParams(APIURL.API_URL + `ledgers/${slug}/listing?request_id=${LocalStorage.uid()}&company_id=${id}&payment=true`,LocalStorage.getAccessToken());
    }
}
 // eslint-disable-next-line
export default new PaymentsApi();