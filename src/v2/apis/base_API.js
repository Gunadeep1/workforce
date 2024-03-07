// import { addErrorMsg, connectionFailed, getAxios, removeLoader } from '../utils/utils'
import Axios from "axios";

const getAxios = () => {
    const axios = Axios;
    return axios;
}

class BaseApiS {
    get(URL, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .get(URL)
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                // throw new Error(err)
            })
    }
    getWithParams(URL, token, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .get(URL,
                {
                    headers: {
                        'Authorization': `${token}`,
                    }
                })
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response;
                // throw new Error(err)
            })
    }
    getWithToken(URL, token, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .get(URL, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                // throw new Error(err)
            })
    }

    postWithToken(URL, data, token, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .post(URL, data,
                {
                    headers: {
                        'Authorization': `${token}`
                        //  "Content-Type": "multipart/form-data"
                    }
                })
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response
                // throw new Error(err)
            })
    }


    postFormData(URL, formData, token, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .post(URL, formData, {
                headers: {
                    'Authorization': `${token}`,
                    'content-type': 'multipart/form-data'
                }
            })
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response
                // throw new Error(err)
            })
    }

    postWithData(URL, data, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .post(URL, data,
            )
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response
                // throw new Error(err)
            })
    }

    putWithData(URL, data, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .put(URL, data)
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response
                // throw new Error(err)
            })
    }
    putWithToken(URL, data, token, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .put(URL, data,
                {
                    headers: {
                        'Authorization': `${token}`,
                    }
                })
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response
                // throw new Error(err)
            })
    }

    deleteWithToken(URL, data, token, loader) {
        if (loader == undefined) {
            // addLoader()
        }
        return getAxios()
            .delete(URL,
                {
                    headers: {
                        'Authorization': `${token}`,
                    },
                    data
                })
            .then(res => {
                // removeLoader()
                return res
            })
            .catch(err => {
                if (err.code == "ERR_NETWORK") {
                    // connectionFailed();
                    if (window.navigator.onLine && !window.navigator.connection.effectiveType.endsWith("2g")) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100000)
                    }
                }
                else if (err.response.data && err.response.data.statusCode == 1008) {
                    // addErrorMsg(err.response.data.message);
                    // removeLoader();
                    localStorage.clear();
                    window.location.reload();
                }
                else {
                    // removeLoader();
                }
                return err.response
                // throw new Error(err)
            })
    }
}
 // eslint-disable-next-line
export default new BaseApiS()
