import cogoToast from "cogo-toast";
import React from "react";
import {useNavigate} from 'react-router-dom';
import DataLoading from 'components/loading/DataLoading';
import {hotelLogin, getUserInfo} from '../pages/login/server_action';
import axios from 'util/Api';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, userInfo: action.user_info?action.user_info:{} };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, userInfo: {} };
    case "USER_INFO":
      return { ...state, userInfo: action.user_info };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {                       // startup user check
  const history = useNavigate()
  const [loading, setLoading] = React.useState(true)
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: false,
  });

  React.useEffect(()=>{
    const token = sessionStorage.getItem('user-token')
    if(token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fakeUserInfo()
        .then((resp)=>{
          if(resp.success){
            loginSuccess(dispatch, resp)
          } else signOut(dispatch, history)
        })
        .catch(()=>signOut(dispatch, history))
        .finally(()=>setLoading(false))
    } else setLoading(false)
  }, [history])

  return (
    !loading
      ? <UserStateContext.Provider value={state}>
          <UserDispatchContext.Provider value={dispatch}>
            {children}
          </UserDispatchContext.Provider>
        </UserStateContext.Provider>
      : <DataLoading text="Checking user information..."/>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
// eslint-disable-next-line
export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################


const fakeLogin = ()=>{
  return new Promise((resolve, reject)=>{
    resolve({"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJqdGkiOiIwMDFiN2JjNi1iM2Y0LTQ5YWUtOGVkNi1mZmM3ODUyNzM4ZmUiLCJVc2VySUQiOiIyODgwYmQ2OS1hYmU0LTRmNGMtODVmMS1jZjc1YWFiOGZhYmIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJ2c3NRRk9CSDJPaTFjbk5VTGxFL1NodHRPM1NJRTFyU25RektldCsrRlRVPSIsImV4cCI6MTY0MzAxNzk4NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0NTY0NCIsImF1ZCI6IlVzZXIifQ.qCFNgcVLKrCRolAEpPXTbju_7ZTCbj-ueghtHj8NuRM"})
  })
}

const fakeUserInfo = ()=>{
  return new Promise((resolve, reject)=>{
    resolve({"success":true,"role":"vssQFOBH2Oi1cnNULlE/ShttO3SIE1rSnQzKet++FTU=","name":"Ikbal Nayem","user_id":"2880bd69-abe4-4f4c-85f1-cf75aab8fabb","client":{"id":1,"name":"Shop Admin","code":"01","description":"Online Shop admin","phone":"548825417","address":"SULAYMAN ROAD, BAGICHAGAON(NEAR FIRE BRIGADE POND)","division":"CHITTAGONG","district":"CUMILLA","thana":"COMILLA SADAR DAKSHIN","email":"admin@email.com","zipcode":"3500","logo":"/images/client/01/logo/05.png"},"client_code":"01","project":[{"id":3,"name":"Security","code":"0103","in_charge":"Imrul Kayes","phone":"0167858424","isActive":true}],"phone":"01724589637","hk_id":null})
  })
}


function loginUser(dispatch, username, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!username && !!password) {
    fakeLogin({username, password})
      .then(resp => {
        if(resp.success){
          cogoToast.success("Login successful")
          sessionStorage.setItem('user-token', resp.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${resp.token}`;
          fakeUserInfo()
            .then(user_resp => {
              if(user_resp.success){
                loginSuccess(dispatch, user_resp)
                setError(false)
                history.push('/')
              } else {
                cogoToast.error('Error occurred while getting user information')
                signOut(dispatch, history)
              }
            })
        } else cogoToast.error('Sorry! Something went wrong')
      })
      .catch(err => err.message === "Request failed with status code 401" && setError(true))
      .finally(()=>setIsLoading(false))
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

const loginSuccess = (dispatch, resp)=>{
  axios.defaults.headers.common['client_code'] = resp.client_code
  dispatch({ type: 'LOGIN_SUCCESS', user_info: resp })
}

function signOut(dispatch, navigate) {
  sessionStorage.clear();
  localStorage.setItem('LOGOUT', true)
  axios.defaults.headers.common['Authorization'] = ""
  axios.defaults.headers.common['client_code'] = ""
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  navigate && navigate("/login");
}



////////////////////////////////////  Multi tab authentication (Auto login/logout)

let user_token = sessionStorage.getItem('user-token');
if(!user_token){
  localStorage.setItem('NEW_TAB', Date.now())         // Ask other tabs for session storage value
}

window.addEventListener('storage', (e)=>{
  const user_token = sessionStorage.getItem('user-token');
  if(e.key === 'NEW_TAB' && user_token){              // Share session storage
    localStorage.setItem('SESSION', user_token)
    localStorage.removeItem('SESSION')
  } else if(e.key === 'SESSION' && e.newValue) {      // Set session to new tab
    if(!user_token){
      sessionStorage.setItem('user-token', e.newValue)
      try{
        const state = window.history.state.state
        window.location.replace(state ? state.from.pathname : '/')
      } catch {}
    }
  } else if(e.key === 'LOGOUT') {                     // Logout from all tab
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = '/login';
  }
})

window.onbeforeunload = (event) => {
  localStorage.clear();
}
