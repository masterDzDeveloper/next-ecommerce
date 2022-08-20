export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START",
  });
  
  export const LoginSuccess = (admin) => ({
    type: "LOGIN_SUCCESS",
    payload: admin,
  });
  
  export const LoginFailure = () => ({
    type: "LOGIN_FAILURE",
  });
  
  export const Logout = () => ({
    type: "LOGOUT",
  });
  
  export const UpdateStart = (userCredentials) => ({
    type: "UPDATE_START",
  });
  
  export const UpdateSuccess = (admin) => ({
    type: "UPDATE_SUCCESS",
    payload: admin,
  });
  
  export const UpdateFailure = () => ({
    type: "UPDATE_FAILURE",
  });

  export const FetchingStart = () => ({
    type: "FETCHING_START",
  });

  export const FetchingSuccess = () => ({
    type: "FETCHING_SUCCESS",
  });

  export const FetchingFailure = (error) => ({
    type: "FETCHING_FAILURE",
    payload: error
  });
