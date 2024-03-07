import BaseApi from '../../BaseApi'
import APIURL from '../../../config/development'

class TemplateApi {

    getTemplates(params, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `templates/dropdown?request_id=${params}`, token);
    }

    getTemplateIndex(params, slug, token) {
        return BaseApi.getWithParams(APIURL.API_URL + `templates/index?request_id=${params}&module_slug=${slug}`, token);
    }

    updateTemplateIndex(params, token) {
        return BaseApi.putWithToken(APIURL.API_URL + `templates/update`, params, token);
    }

    getTemplateSlug(params,slug,token){
        return BaseApi.getWithParams(APIURL.API_URL + `templates/list-param?request_id=${params}&module_slug=${slug}`, token);
    }
}

export default new TemplateApi();