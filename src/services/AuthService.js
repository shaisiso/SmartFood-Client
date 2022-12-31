import api from "./api";
import EmployeeService from "./EmployeeService";
import TokenService from "./TokenService";

// const register = (username, email, password) => {
//   return api.post("/auth/signup", {
//     username,
//     email,
//     password
//   });
// };

const login = (phoneNumber, password) => {
  return api.post("/login", {
      phoneNumber:phoneNumber,
      password:password
    })
    .then((response) => {
      if (response.data.accessToken) {
        let user = {phoneNumber:phoneNumber, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken}
        TokenService.setUser(user);
        EmployeeService.findEmployeeByPhone(phoneNumber)
        .then(res=> {
          TokenService.setEmployee(res.data)
        })
      }
      return response;
    });
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
 // register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;