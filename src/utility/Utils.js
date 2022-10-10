// --- Heroku ---//
//export const SERVER_PORT = "5000"
//export const WEB_URL = `http://localhost:${SERVER_PORT}`;

// --- AWS Server --- //
// export const API_URL = "http://smartfood-env.eba-qmkz53pt.eu-central-1.elasticbeanstalk.com";

// --- Local Environment --- //
export const SERVER_PORT = "8080"
export const API_URL = `http://localhost:${SERVER_PORT}`;

export function formatDate(date){
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    console.log(`${da}-${mo}-${ye}`);
    return `${ye}-${mo}-${da}`
}
