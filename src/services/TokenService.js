const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken;
  };
  
  const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  
  const setUser = (user) => {
    removeUser()
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const removeUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("employee");
    localStorage.removeItem("member");
  };
  const setEmployee= (employee)=>{
    localStorage.setItem("employee", JSON.stringify(employee));
  }
  const getEmployee= ()=>{
    return JSON.parse(localStorage.getItem("employee"));
  }
  const setMember= (member)=>{
    console.log(member)
    localStorage.setItem("member", JSON.stringify(member));
  }
  const getMember= ()=>{
    return JSON.parse(localStorage.getItem("member"));
  }
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
    setEmployee,
    getEmployee,
    setMember,
    getMember
  };
  
  export default TokenService;