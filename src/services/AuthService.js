import api from "./api";
import EmployeeService from "./EmployeeService";
import MemberService from "./MemberService";
import TokenService from "./TokenService";

// const register = (username, email, password) => {
//   return api.post("/auth/signup", {
//     username,
//     email,
//     password
//   });
// };

const employeeLogin = (phoneNumber, password) => {
  return api.post("/login/employee", {
    phoneNumber: phoneNumber,
    password: password
  })
    .then((response) => {
      if (response.data.accessToken) {
        let user = { phoneNumber: phoneNumber, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }
        TokenService.setUser(user);
        EmployeeService.findEmployeeByPhone(phoneNumber)
          .then(res => {
            TokenService.setEmployee(res.data)
          })
      }
      return response;
    });
};
const memberLogin = (phoneNumber, password) => {
  return api.post("/login/member", {
    phoneNumber: phoneNumber,
    password: password
  })
    .then((response) => {
      if (response.data.accessToken) {
        let user = { phoneNumber: phoneNumber, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }
        TokenService.setUser(user);
        MemberService.getMemberByPhone(phoneNumber)
          .then(res => {
            TokenService.setMember(res.data)
          })
      }
      return response;
    })
}
const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  // register,
  employeeLogin,
  memberLogin,
  logout,
  getCurrentUser,
};

export default AuthService;