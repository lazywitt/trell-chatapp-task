import axios from 'axios'
import {setAuthHeader} from './common'


const baseURL = process.env.REACT_APP_BASE_URL
console.log(baseURL)


export const signin = (data) => {
  return async (dispatch) => {
    return axios.post(`${baseURL}/users/login`,{
        email: data.email,
        password: data.password
      }
  ).then((res)=>{
    console.log('Success')
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('email', res.data.user.email)

    dispatch(loginSuccess(res.data.token,res.data.user.email))
    return res
  })
  }
}

export const signup =  (data) => {
  return async (dispatch) => {
    return axios.post(`${baseURL}/users`,{...data})
      .then((res)=>{
        console.log('New User Created!')
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('email', res.data.user.email)

        dispatch(loginSuccess(res.data.token,res.data.user.email))
        return res.data.user
      })
  }
}

export const logout = () => {
  return async (dispatch) => {
    return axios.post(`${baseURL}/users/logout`,{},{
      headers:setAuthHeader()
    }).then((res)=>{
      localStorage.removeItem("token");
      localStorage.removeItem('email')
      dispatch(logoutSuccess())
      return
    }).catch((err)=>{
      return err
    })
  }
}



export const loginSuccess = (token = '',email = '') => {
  return {
    type: 'LOGGED_IN',
    token,
    email
  }

}

export const logoutSuccess = () => {
  return {
    type: 'LOGGED_OUT',
  }
}


// export const loginFailed = (error = '') => {
//   return {
//     type: 'LOGGED_IN',
//     token
//   }

// }