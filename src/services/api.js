import axios from "axios";
import { API_URL } from "../utility/Utils";
import TokenService from "./TokenService";

const instance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;  // for Spring Boot back-end
            // config.headers["x-access-token"] = token; // for Node.js Express back-end
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== "/login" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && err.response.data.message ==='Token is expired') {
                originalConfig._retry = true;
                try {
                    const rs = await instance.post("/login/refresh-token", {
                        refreshToken: TokenService.getLocalRefreshToken(),
                    });
                    const { accessToken } = rs.data;
                    TokenService.updateLocalAccessToken(accessToken);
                    return instance(originalConfig);
                } catch (_error) {
                    console.log('reject')
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    }
);

export default instance;