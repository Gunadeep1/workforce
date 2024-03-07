import { v4 as uuid } from 'uuid';


class LocalStorage {
    uid() {
        const id = uuid();
        return id
    }
    getURLNAME() {
        var temp = window.location.hostname;
        return temp;
    }
    setUserData(data) {
        const local_data = JSON.stringify(data);
        return localStorage.setItem('UserData', local_data)
    }
    getUserData() {
        const str = localStorage.getItem('UserData');
        const parsedArray = JSON.parse(str);
        return parsedArray
    }
    removeUserData() {
        return localStorage.removeItem('UserData')
    }
    setAccessToken() {
        // return localStorage.setItem('access_token', data)
        return this.getUserData().access_token
    }
    getAccessToken() {
        return this.getUserData() ? this.getUserData().access_token : ''
    }
    removeAcessToken() {
        return localStorage.removeItem('access_token')
    }
    setRolesData(data) {
        const local_data = JSON.stringify(data);
        return localStorage.setItem('RolesData', local_data)
    }
    getRolesData() {
        const str = localStorage.getItem('RolesData');
        const parsedArray = JSON.parse(str);
        return parsedArray
    }
    removeRolesData() {
        return localStorage.removeItem('RolesData')
    }

    setDateFormat(data) {
        return localStorage.setItem('date_format', data);
    }
    getDateFormat() {
        return localStorage.getItem('date_format');
    }
    removeDateFormat() {
        return localStorage.removeItem('date_format')
    }


    setCurrencySymbol(data) {
        return localStorage.setItem('currency_symbol', data);
    }
    getCurrencySymbol() {
        return localStorage.getItem('currency_symbol');
    }
    removeCurrencySymbol() {
        return localStorage.removeItem('currency_symbol')
    }

    setEmployeeId(data) {
        return localStorage.setItem('EmployeeID', data);
    }
    getEmployeeId() {
        return localStorage.getItem('EmployeeID');
    }
    removeEmployeeId() {
        return localStorage.removeItem('EmployeeID');
    }

    setFullName(data) {
        return localStorage.setItem('FullName', data);
    }
    getFullName() {
        return localStorage.getItem('FullName');
    }
    removeFullName() {
        return localStorage.removeItem('FullName');
    }

    setVendorID(data) {
        return localStorage.setItem('vendorID', data)
    }
    getVendorID() {
        return localStorage.getItem('vendorID')
    }
    removeVendorID() {
        return localStorage.removeItem('vendorID')
    }

    setEndClientID(data) {
        return localStorage.setItem('EndClientID', data)
    }
    getEndClientID() {
        return localStorage.getItem('EndClientID')
    }
    removeEndClientID() {
        return localStorage.removeItem('EndClientID')
    }

    setClientID(data) {
        return localStorage.setItem('ClientID', data)
    }
    getClientID() {
        return localStorage.getItem('ClientID')
    }
    removeClientID() {
        return localStorage.removeItem('ClientID')
    }

    setPlacementID(data) {
        return localStorage.setItem('PlacementID', data)
    }
    getPlacementID() {
        return localStorage.getItem('PlacementID')
    }
    removePlacementID() {
        return localStorage.removeItem('PlacementID')
    }
    setExpenseCache(data){
        const premiumData = JSON.stringify(data);
        return localStorage.setItem('expenceCache',premiumData)
    }
    getExpenseCache(){
        const data = localStorage.getItem('expenceCache')
        const parsedArray = JSON.parse(data)
        return parsedArray
    }
    setplacementCache(data){
        const premiumData = JSON.stringify(data);
        return localStorage.setItem('placementCache',premiumData)
    }
    getplacementCache(){
        const data = localStorage.getItem('placementCache')
        const parsedArray = JSON.parse(data)
        return parsedArray
    }
}
 // eslint-disable-next-line
export default new LocalStorage()