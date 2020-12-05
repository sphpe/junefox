import axios from 'axios'
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

import config from '../config'
const apiHost = config.http.hosts[0]
const apiPath = apiHost+"/api/0/"

import { getSid } from '../helpers/session'

export default function api(url,params,formData,onProgress) {
  params = params || {}
  let sid = typeof params.sid == "undefined" ? getSid() : params.sid;
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

  let startTime = Date.now()
  let status = "pending";
  var request = axios(config)
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
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.data) {
        throw new Error("bad response");        
      }
      status = "done"
      return data.data
    }).catch(function (error) {   
      clearTimeout(timeout);   
      if (axios.isCancel(error)) {
        status = "canceled"
        return "canceled";
      } else {
        status = "error"
      }
      return {error}
    });   
  request.cancel = function() {
    source.cancel()
  };

  request.getStatus = function() {
    return status;
  };
  let timeout = setTimeout(() => {}, 2000)  
  
  return request;      
}