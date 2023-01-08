// --- Heroku ---//
//export const SERVER_PORT = "5000"
//export const WEB_URL = `http://localhost:${SERVER_PORT}`;

// --- AWS Server --- //
// export const API_URL = "http://smartfood.eu-central-1.elasticbeanstalk.com";

// --- Local Environment --- //
export const SERVER_PORT = "8080"
export const API_URL = `http://10.100.102.20:${SERVER_PORT}`//`http://localhost:${SERVER_PORT}`; //


//functions
export function formatDateForBrowser(date) {
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${year}-${month}-${day}`
}
export function formatDateForServer(date) {
    if (typeof (date) === 'string')
        date = new Date(date)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return `${day}-${month}-${year}`
}
export function formatDateWithSlash(date) {
    if (typeof (date) === 'string')
        date = new Date(date)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${day}/${month}/${year}`
}

export function formatDateWithSlashNoYear(date) {
    if (typeof (date) === 'string')
        date = new Date(date)
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${day}/${month}`
}
export function formatDateWithDots(date) {
    if (typeof (date) === 'string')
        date = new Date(date)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${day}.${month}.${year}`
}
export function isValidPhone(phone) {
    return /[0][5][0-9]{8}$/.test(phone)
}
export function isValidName(name) {
    return /[a-zA-Z\s-]{2,}/.test(name)
}
export function isDateInFuture(date, hour) {
    let currentDate = new Date()
    let hourForDate = typeof (hour) === "string" ? parseInt(hour.substring(0, 2)) : hour;
    date.setHours(hourForDate)
    if (date > currentDate)
        return true
    else
        return false
}
export function isValidDateForReservation(date, time) {
    let currentDate = new Date()
    let timeSplited = time.split(":")
    let hourForDate = parseInt(timeSplited[0]);
    let minuteForDate = parseInt(timeSplited[1]);
    date.setHours(hourForDate - 1)
    date.setMinutes(minuteForDate)
    if (date > currentDate)
        return true
    else
        return false
}
export function getCurrentDate() {
    return formatDateForBrowser(new Date())
}
export function substractDate(numOfDays, date = new Date()) {
    date.setDate(date.getDate() - numOfDays);
    return formatDateForBrowser(date);
}
export function enumForReading(enumType) {
    if (!enumType)
        return ''
    return enumType.split("_")
        .map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ")
}
export function enumForClass(toStringEnum) {
    return toStringEnum.split(" ")
        .map(word => word.toUpperCase())
        .join("_")
}
export function toCamelCase(str) {
    // converting all characters to lowercase
    var ans = str.toLowerCase();

    // Returning string to camelcase
    return ans.split(" ").reduce((s, c) => s
        + (c.charAt(0).toUpperCase() + c.slice(1)));
}
export function toText(str) {
    return str ? str : ""
}
export function extractHttpError(err) {
    // var errMsg;
    if (err.response.data) {
        if (err.response.data.message) {
            return [err.response.data.message];
        } else {
            return Object.entries(err.response.data).map(([key, value]) => `${value}`); //Object.entries(err.response.data).map(([key, value]) => `${key}: ${value}`); // JSON.stringify(err.response.data).replace(/[{"}]/g, '').replace(":", ": "); //
        }
    }
    else {
        return [err.message]
    }
}
export function addressToString(address) {
    if (!address || !address.city) return ''
    return `${address.city ?? ''}, ${address.streetName ?? ''} ${address.houseNumber ?? ''}${address.entrance ? `-${address.entrance}` : ''}${address.apartmentNumber ? `, appartment ${address.apartmentNumber}` : ''}`
}
export function isChar(st) {
    return !st || st.length <= 1
}
export function getDateOfLocalDateTimeSt(dateTime) {
    return dateTime ? dateTime.split(' ')[0] : ''
}
export function getTimeOfLocalDateTimeSt(dateTime) {
    return dateTime ? dateTime.split(' ')[1] : ''
}
export function lastCharIsDigit(str) {
    let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (str.length === 0)
        return true
    return digits.includes(str.slice(-1))
}
export function isValidFloatNumber(str) {
    if (lastCharIsDigit(str))
        return true
    return str.slice(-1) === '.' && str.length > 1 && str.split(".").length - 1 === 1
}
export function format2Decimals(str) {
    const num = parseFloat(str);
    return Math.round(num * 100) / 100;
}
export function cleanAll() {
    window.location.reload(true); // false - cached version of the page, true - complete page refresh from the server
}
