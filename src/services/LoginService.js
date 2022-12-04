import HttpSevice from './HttpSevice';

class LoginService {
    employeeLogin = async credentials => HttpSevice.POST(`/login`, credentials)
}

export default new LoginService();