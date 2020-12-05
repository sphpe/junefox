import axios from 'axios'
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

import config from '../config'
const apiHost = config.http.hosts[0]
const apiPath = apiHost+"/api"

import { getSid } from '../helpers/session'

export default function api(url,params,formData) {
  return function(dispatch) {    
    params = params || {}
    let sid = typeof params.sid == "undefined" ? getSid() : params.sid;
    let headers = {};
    if (sid) headers["sid"] = sid;
    let split = url.split("/")
    if (split[0]) headers["controller"] = split[0];
    if (split[1]) headers["action"] = split[1]

    let key = split.join("_");
    let fullUrl = apiPath+"/"+url;
    let source = CancelToken.source();
    var data = params;

    if (formData) {
      data = new FormData();
      for (let key in params) {
        data.append(key,params[key])
      }
      headers["content-type"] = 'multipart/form-data';
    } else {
      data = {data}
    }

    let config = {
      url: apiPath,
      method: "post",      
      data: data,
      headers: headers,
      cancelToken: source.token
    }

    // let request = axios.post(fullUrl, params)
    let startTime = Date.now()
    let timeout = setTimeout(() => {}, 2000)
    let request = axios(config)
      .then(function (response) {
        clearTimeout(timeout);
        const data = response.data;
        let now = Date.now()
        if (!data) {
          throw new Error("no data received");
        }
        if (typeof data == "string") {
          throw new Error(data);
        }
        let err = data.error || data.err
        if (err) {
          throw new Error(err.message || err);
        }
        if (!data.data) {
          throw new Error("bad response");        
        }
        dispatch({
          type: "api_success",
          key: key,
          params: params,
          data: data.data
        });      
        return data.data
      }).catch(function (error) {   
        clearTimeout(timeout);   
        if (axios.isCancel(error)) {
          return "canceled";
        } else {
          dispatch({
            type: "api_failure",
            key: key,     
            params: params,   
            error: error
          });     
        }
        return {error}
      });   
    request.cancel = function() {
      source.cancel()
    }    
    dispatch({
      type: "api",
      key: key,      
      params: params,
      request: request
    });  
    return request;      
  }

  return request;
}