import axios from 'axios'
import config from '../../config'

const CancelToken = axios.CancelToken;
const apiHost = config.http.hosts[0]
const apiPath = apiHost+"/api/0/"

import { getSid } from '../../helpers/session'

import { requestActions } from 'store/actions'

// import { flashMessage } from 'store/action-creators/flashMessages'
// import { DANGER } from 'constants/FlashMessageTypes'
// import { logOutAction } from './session'

const apiCall = (url, params, formData, onProgress) => {

  params = params || {}
  let sid = params.sid || getSid()
  let headers = {};
  if (sid) headers["sid"] = sid;

  let fullUrl = formData ? (apiPath+"upload/"+url) : apiPath+"json/"+url;
  let source = CancelToken.source();

  var data = params;

  if (formData) {
    data = new FormData();
    for (let key in params) {
      data.append(key,params[key])
    }
    headers["content-type"] = 'multipart/form-data';
  }

  let config = {
    url: fullUrl,
    method: "POST",      
    data: data,
    headers: headers,
    cancelToken: source.token
  }
  if (typeof onProgress == 'function') {
    config.onUploadProgress = (e)=>{
      onProgress(e,Math.floor((e.loaded * 100) / e.total));
    } 
  }

  return axios(config)
}

export const makeRequest = (actionType, url, params) => async (dispatch) => {
  dispatch({ type: requestActions.REQUEST, actionType })
  try {
    const response = await apiCall(url, params)
    console.log('api response = ', response)
    dispatch({ type: requestActions.SUCCESS, actionType })
    return response.data
  } catch (error) {
    dispatch({ type: requestActions.FAILED, error })

    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        console.log('user should logout')
        // dispatch(logOutAction())
      }else {
        const message = error.response.data.message || error.message
        console.log('api error = ', message)
        // dispatch(flashMessage(DANGER, `Request error (${status}): ${message}`))
      }
    }

    throw error
  }
}
