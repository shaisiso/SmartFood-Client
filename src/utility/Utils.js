// --- Heroku ---//
//export const SERVER_PORT = "5000"
//export const WEB_URL = `http://localhost:${SERVER_PORT}`;

// --- AWS Server --- //
// export const API_URL = "http://smartfood.eu-central-1.elasticbeanstalk.com";

// --- Local Environment --- //
export const SERVER_PORT = "8080"
export const API_URL = `http://localhost:${SERVER_PORT}`;

export function formatDateForBrowser(date){
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${year}-${month}-${day}`
}
export function formatDateForServer(date){
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    if (month<10) month = '0'+month;
    if (day<10) day = '0'+day;

    return `${day}-${month}-${year}`
}
